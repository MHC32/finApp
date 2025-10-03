/**
 * =========================================================
 * FinApp Haiti - Auth Slice
 * Gestion de l'authentification utilisateur
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api/auth.api';

/**
 * Initial State
 */
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// =============================================================================
// ASYNC THUNKS (Actions Asynchrones)
// =============================================================================

/**
 * Login Async
 * @param {Object} credentials - { email, password, rememberMe }
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Response format: { success, data: { user, tokens, session } }
      if (response.success && response.data) {
        return {
          user: response.data.user,
          tokens: response.data.tokens
        };
      }
      
      return rejectWithValue('Format de réponse invalide');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur de connexion'
      );
    }
  }
);

/**
 * Register Async
 * @param {Object} userData - { firstName, lastName, email, password, phone, region }
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        return {
          user: response.data.user,
          tokens: response.data.tokens
        };
      }
      
      return rejectWithValue('Format de réponse invalide');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur d\'inscription'
      );
    }
  }
);

/**
 * Logout Async
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error) {
      // Même si l'API échoue, on déconnecte quand même localement
      console.warn('Erreur API logout, déconnexion locale quand même');
      return true;
    }
  }
);

/**
 * Check Auth (vérifier token au démarrage)
 */
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Vérifier si token existe
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Pas de token');
      }

      // Vérifier token avec API
      const response = await authAPI.checkAuth();
      
      if (response.success && response.data) {
        return {
          user: response.data.user,
          token: token
        };
      }
      
      return rejectWithValue('Token invalide');
    } catch (error) {
      return rejectWithValue(error.message || 'Token invalide');
    }
  }
);

/**
 * Refresh Token Async
 */
export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshToken = getState().auth.refreshToken || localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return rejectWithValue('Pas de refresh token');
      }

      const response = await authAPI.refreshToken(refreshToken);
      
      if (response.success && response.data) {
        return {
          tokens: response.data.tokens
        };
      }
      
      return rejectWithValue('Refresh token échoué');
    } catch (error) {
      return rejectWithValue(error.message || 'Refresh token échoué');
    }
  }
);

// =============================================================================
// AUTH SLICE
// =============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Login Success (synchrone - pour compatibilité)
     */
    loginSuccess: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    /**
     * Login Start (synchrone)
     */
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Login Failure (synchrone)
     */
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    /**
     * Logout (synchrone)
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Nettoyer localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },

    /**
     * Update User
     */
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    /**
     * Update Token
     */
    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },

    /**
     * Clear Error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set User (pour réhydratation)
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },

  // =============================================================================
  // EXTRA REDUCERS (pour gérer les async thunks)
  // =============================================================================
  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // LOGIN ASYNC
    // -------------------------------------------------------------------------
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { user, tokens } = action.payload;
        
        state.user = user;
        state.token = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        
        // Save to localStorage
        localStorage.setItem('token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }

        console.log('✅ Login réussi:', user.email);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur de connexion';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;

        console.error('❌ Login échoué:', action.payload);
      });

    // -------------------------------------------------------------------------
    // REGISTER ASYNC
    // -------------------------------------------------------------------------
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        const { user, tokens } = action.payload;
        
        state.user = user;
        state.token = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        
        localStorage.setItem('token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }

        console.log('✅ Inscription réussie:', user.email);
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur d\'inscription';
        state.isAuthenticated = false;

        console.error('❌ Inscription échouée:', action.payload);
      });

    // -------------------------------------------------------------------------
    // LOGOUT ASYNC
    // -------------------------------------------------------------------------
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        console.log('✅ Déconnexion réussie');
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Même si l'API échoue, on déconnecte localement
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        console.log('⚠️ Déconnexion locale (API échouée)');
      });

    // -------------------------------------------------------------------------
    // CHECK AUTH ASYNC
    // -------------------------------------------------------------------------
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        console.log('✅ Auth vérifiée:', user.email);
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        
        // Nettoyer localStorage si token invalide
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        console.log('❌ Token invalide - déconnexion');
      });

    // -------------------------------------------------------------------------
    // REFRESH TOKEN ASYNC
    // -------------------------------------------------------------------------
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        const { tokens } = action.payload;
        
        state.token = tokens.accessToken;
        if (tokens.refreshToken) {
          state.refreshToken = tokens.refreshToken;
        }
        
        localStorage.setItem('token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }

        console.log('✅ Token renouvelé');
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        // Si refresh échoue, déconnecter
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        console.log('❌ Refresh token échoué - déconnexion');
      });
  },
});

// =============================================================================
// EXPORT ACTIONS
// =============================================================================
export const {
  loginSuccess,
  loginStart,
  loginFailure,
  logout,
  updateUser,
  updateToken,
  clearError,
  setUser,
} = authSlice.actions;

// =============================================================================
// SELECTORS
// =============================================================================
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// =============================================================================
// EXPORT REDUCER
// =============================================================================
export default authSlice.reducer;