/**
 * =========================================================
 * FinApp Haiti - Auth Slice (SYNCHRONISÉ BACKEND)
 * ✅ Correspondance avec backend authController responses
 * ✅ Gestion correcte loading states
 * ✅ Token storage et user extraction
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from 'services/api/auth.service';

// ===================================================================
// INITIAL STATE
// ===================================================================

const initialState = {
  // User data
  user: null,
  isAuthenticated: false,
  
  // UI states
  loading: false,
  error: null,
  
  // Session info
  session: null,
  
  // Token info
  tokenExpiringSoon: false,
};

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Check Auth - Vérifier token au démarrage
 * Appelle GET /api/auth/me
 * 
 * Backend response:
 * {
 *   success: true,
 *   data: {
 *     user: { userId, email, firstName, lastName, role, region, isVerified },
 *     authenticated: boolean,
 *     session: { sessionId, tokenExpiringSoon }
 *   }
 * }
 */
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Pas de token');
      }

      // Appeler /auth/me
      const response = await authService.getCurrentUser();
      
      // Vérifier réponse backend
      if (!response.success || !response.data) {
        return rejectWithValue('Réponse invalide du serveur');
      }

      // ✅ IMPORTANT: Vérifier si user existe
      if (!response.data.user) {
        return rejectWithValue('Utilisateur non trouvé');
      }

      return {
        user: response.data.user,
        session: response.data.session,
        authenticated: response.data.authenticated,
      };
    } catch (error) {
      console.error('❌ checkAuth échoué:', error);
      
      // Nettoyer token invalide
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Erreur vérification authentification'
      );
    }
  }
);

/**
 * Login - Connexion utilisateur
 * Appelle POST /api/auth/login
 * 
 * Backend response:
 * {
 *   success: true,
 *   message: "Bon retour {firstName}! 👋",
 *   data: {
 *     user: UserObject,
 *     tokens: { accessToken, tokenType, expiresIn },
 *     session: { sessionId, deviceId, deviceInfo }
 *   }
 * }
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || 'Échec de la connexion');
      }

      // ✅ Sauvegarder tokens dans localStorage
      const { tokens, user, session } = response.data;
      localStorage.setItem('token', tokens.accessToken);
      
      // Sauvegarder refreshToken si présent
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }

      return {
        user,
        session,
        tokens,
      };
    } catch (error) {
      console.error('❌ Login échoué:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Erreur de connexion'
      );
    }
  }
);

/**
 * Register - Inscription utilisateur
 * Appelle POST /api/auth/register
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || 'Échec de l\'inscription');
      }

      // ✅ Sauvegarder tokens
      const { tokens, user, session } = response.data;
      localStorage.setItem('token', tokens.accessToken);
      
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }

      return {
        user,
        session,
        tokens,
      };
    } catch (error) {
      console.error('❌ Register échoué:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Erreur d\'inscription'
      );
    }
  }
);

/**
 * Logout - Déconnexion
 * Appelle POST /api/auth/logout
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // ✅ Nettoyer localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      return null;
    } catch (error) {
      // Même en cas d'erreur, on déconnecte localement
      console.error('❌ Logout échoué:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Ne pas rejeter, toujours réussir localement
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
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Logout local (sans appel API)
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.session = null;
      state.error = null;
      state.tokenExpiringSoon = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    
    /**
     * Update user info (profil édité)
     */
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================================
      // CHECK AUTH
      // ============================================================
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.tokenExpiringSoon = action.payload.session?.tokenExpiringSoon || false;
        state.error = null;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        // ✅ CRITIQUE: Mettre loading à false pour éviter boucle
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.session = null;
        state.error = action.payload;
      })

      // ============================================================
      // LOGIN
      // ============================================================
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.session = null;
        state.error = action.payload;
      })

      // ============================================================
      // REGISTER
      // ============================================================
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.session = null;
        state.error = action.payload;
      })

      // ============================================================
      // LOGOUT
      // ============================================================
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.session = null;
        state.error = null;
        state.tokenExpiringSoon = false;
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Même en cas d'erreur, déconnecter
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.session = null;
        state.tokenExpiringSoon = false;
      });
  },
});

// ===================================================================
// SELECTORS
// ===================================================================

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectSession = (state) => state.auth.session;
export const selectTokenExpiringSoon = (state) => state.auth.tokenExpiringSoon;

// Sélecteurs dérivés
export const selectUserFullName = (state) => {
  const user = state.auth.user;
  return user ? `${user.firstName} ${user.lastName}` : null;
};

export const selectUserRole = (state) => state.auth.user?.role || null;
export const selectUserRegion = (state) => state.auth.user?.region || null;
export const selectIsVerified = (state) => state.auth.user?.isVerified || false;

// ===================================================================
// EXPORTS
// ===================================================================

export const { clearError, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;