/**
 * =========================================================
 * FinApp Haiti - Auth Slice (REFACTORÉ)
 * Gestion Redux de l'authentification
 * ✅ Utilise auth.service.js (Backend Node.js)
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/api/auth.service';

// ===================================================================
// INITIAL STATE
// ===================================================================

const initialState = {
  // Utilisateur
  user: null,
  
  // Tokens
  token: null,
  refreshToken: null,
  
  // Session
  session: null,
  
  // État authentification
  isAuthenticated: false,
  
  // UI State
  loading: false,
  error: null,
  
  // Vérification initiale
  initialCheckDone: false,
};

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Register (Inscription)
 * POST /api/auth/register
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur lors de l\'inscription');
      }
      
      return response.data; // { user, tokens, session }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur inscription'
      );
    }
  }
);

/**
 * Login (Connexion)
 * POST /api/auth/login
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Identifiants invalides');
      }
      
      return response.data; // { user, tokens, session }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur connexion'
      );
    }
  }
);

/**
 * Logout (Déconnexion)
 * POST /api/auth/logout
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      // Même en cas d'erreur, on déconnecte localement
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur déconnexion'
      );
    }
  }
);

/**
 * Logout All (Déconnexion toutes sessions)
 * POST /api/auth/logout-all
 */
export const logoutAllAsync = createAsyncThunk(
  'auth/logoutAll',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutAll();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur déconnexion globale'
      );
    }
  }
);

/**
 * Refresh Token
 * POST /api/auth/refresh
 */
export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(refreshToken);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Impossible de renouveler le token');
      }
      
      return response.data; // { tokens, session }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur renouvellement token'
      );
    }
  }
);

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      
      if (!response.success || !response.data) {
        return rejectWithValue('Impossible de récupérer les informations utilisateur');
      }
      
      return response.data; // { user, session }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur récupération utilisateur'
      );
    }
  }
);

/**
 * Check Auth (Vérification initiale au chargement)
 * GET /api/auth/verify-token
 */
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Vérifier si token existe localement
      if (!authService.isAuthenticated()) {
        return rejectWithValue('Non authentifié');
      }

      // Vérifier avec le backend
      const response = await authService.verifyToken();
      
      if (!response.success || !response.data || !response.data.valid) {
        // Token invalide, nettoyer
        authService.clearTokens();
        return rejectWithValue('Token invalide');
      }
      
      return response.data; // { valid, user, session, tokenExpiringSoon }
    } catch (error) {
      // En cas d'erreur, nettoyer les tokens
      authService.clearTokens();
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Session expirée'
      );
    }
  }
);

/**
 * Change Password
 * POST /api/auth/change-password
 */
export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data);
      
      if (!response.success) {
        return rejectWithValue('Erreur lors du changement de mot de passe');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur changement mot de passe'
      );
    }
  }
);

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur demande réinitialisation'
      );
    }
  }
);

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur réinitialisation mot de passe'
      );
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
     * Clear Error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set User (pour mise à jour locale)
     */
    setUser: (state, action) => {
      state.user = action.payload;
    },

    /**
     * Clear Auth (déconnexion locale forcée)
     */
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.clearTokens();
    },
  },

  // ===================================================================
  // EXTRA REDUCERS (Async Thunks)
  // ===================================================================
  
  extraReducers: (builder) => {
    
    // -----------------------------------------------------------------
    // REGISTER
    // -----------------------------------------------------------------
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // -----------------------------------------------------------------
    // LOGIN
    // -----------------------------------------------------------------
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // -----------------------------------------------------------------
    // LOGOUT
    // -----------------------------------------------------------------
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        // Reset complet
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        // Même en cas d'erreur, déconnecter localement
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // LOGOUT ALL
    // -----------------------------------------------------------------
    builder
      .addCase(logoutAllAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAllAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutAllAsync.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // REFRESH TOKEN
    // -----------------------------------------------------------------
    builder
      .addCase(refreshTokenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.tokens.accessToken;
        if (action.payload.tokens.refreshToken) {
          state.refreshToken = action.payload.tokens.refreshToken;
        }
        state.session = action.payload.session;
        state.loading = false;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        // Token refresh échoué, déconnecter
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // GET CURRENT USER
    // -----------------------------------------------------------------
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // CHECK AUTH (Vérification initiale)
    // -----------------------------------------------------------------
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.loading = false;
        state.initialCheckDone = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null; // Pas d'erreur affichée pour check initial
        state.initialCheckDone = true;
      });

    // -----------------------------------------------------------------
    // CHANGE PASSWORD
    // -----------------------------------------------------------------
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // FORGOT PASSWORD
    // -----------------------------------------------------------------
    builder
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // RESET PASSWORD
    // -----------------------------------------------------------------
    builder
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ===================================================================
// EXPORT ACTIONS
// ===================================================================

export const {
  clearError,
  setUser,
  clearAuth,
} = authSlice.actions;

// ===================================================================
// SELECTORS
// ===================================================================

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectSession = (state) => state.auth.session;
export const selectToken = (state) => state.auth.token;
export const selectInitialCheckDone = (state) => state.auth.initialCheckDone;

// Selectors dérivés
export const selectUserFullName = (state) => {
  const user = state.auth.user;
  return user ? `${user.firstName} ${user.lastName}` : '';
};

export const selectUserEmail = (state) => state.auth.user?.email;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserRegion = (state) => state.auth.user?.region;

// ===================================================================
// EXPORT REDUCER
// ===================================================================

export default authSlice.reducer;