/**
 * =========================================================
 * FinApp Haiti - Auth Slice (VERSION PROPRE)
 * ✅ Redux Persist gère la persistence
 * ✅ Token dans le state Redux
 * ✅ Aucun localStorage manuel
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from 'services/api/auth.service';

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const initialState = {
  user: null,
  token: null,              // ✅ AJOUTÉ
  refreshToken: null,       // ✅ AJOUTÉ
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ===================================================================
// ACTIONS ASYNCHRONES
// ===================================================================

/**
 * Vérifier l'authentification au démarrage
 */
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Lire le token depuis Redux state (pas localStorage)
      const { auth } = getState();
      const token = auth.token;
      
      if (!token) {
        return rejectWithValue('Utilisateur non connecté');
      }

      // Vérifier avec le backend si le token est valide
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data?.user) {
        return {
          user: response.data.user,
          session: response.data.session,
        };
      } else {
        return rejectWithValue('Token invalide');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de vérification'
      );
    }
  }
);

/**
 * Connexion utilisateur
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data?.user && response.data?.tokens) {
        return {
          user: response.data.user,
          session: response.data.session,
          tokens: response.data.tokens, // ✅ Retourner les tokens
        };
      } else {
        return rejectWithValue(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Erreur de connexion'
      );
    }
  }
);

/**
 * Inscription utilisateur
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.data?.user && response.data?.tokens) {
        return {
          user: response.data.user,
          session: response.data.session,
          tokens: response.data.tokens, // ✅ Retourner les tokens
        };
      } else {
        return rejectWithValue(response.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Erreur d\'inscription'
      );
    }
  }
);

/**
 * Déconnexion utilisateur
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      // Même si le backend échoue, on déconnecte localement
      console.warn('Logout backend échoué, mais déconnexion locale effectuée');
      return null;
    }
  }
);

// ===================================================================
// SLICE
// ===================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Effacer les erreurs
    clearError: (state) => {
      state.error = null;
    },
    
    // Déconnexion manuelle (sans appel backend)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // ✅ Redux Persist nettoiera automatiquement localStorage
    },

    // ✅ NOUVEAU : Mettre à jour le token (après refresh)
    updateTokens: (state, action) => {
      state.token = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // CHECK AUTH
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        // Token reste inchangé (déjà dans le state)
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;          // ✅ Sauvegarder token
        state.refreshToken = action.payload.tokens.refreshToken;  // ✅ Sauvegarder refreshToken
        state.error = null;
        // ✅ Redux Persist sauvegarde automatiquement dans localStorage
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      });
  },
});

// ===================================================================
// SELECTORS
// ===================================================================

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;                    // ✅ NOUVEAU
export const selectRefreshToken = (state) => state.auth.refreshToken;      // ✅ NOUVEAU
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export const selectUserFullName = (state) => {
  const user = state.auth.user;
  return user ? `${user.firstName} ${user.lastName}` : null;
};

export const selectUserRole = (state) => state.auth.user?.role || null;

// ===================================================================
// EXPORTS
// ===================================================================

export const { clearError, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;