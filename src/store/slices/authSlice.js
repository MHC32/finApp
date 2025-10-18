// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/endpoints/auth';

// ===================================================================
// THUNKS ASYNCHRONES (actions avec appels API)
// ===================================================================

/**
 * Inscription d'un nouvel utilisateur
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      // Response structure: { success, message, data: { user, tokens, session } }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'inscription'
      );
    }
  }
);

/**
 * Connexion utilisateur
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      // Response structure: { success, message, data: { user, tokens, session } }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Identifiants incorrects'
      );
    }
  }
);

/**
 * Déconnexion utilisateur
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    
      await authApi.logout();
      return true;
  }
);

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.me();
      // Response structure: { success, data: { user } }
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des données'
      );
    }
  }
);

/**
 * Changer le mot de passe
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      );
    }
  }
);

/**
 * Demander reset mot de passe
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la demande de réinitialisation'
      );
    }
  }
);

/**
 * Reset mot de passe avec token
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(resetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la réinitialisation'
      );
    }
  }
);

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const initialState = {
  // Données utilisateur
  user: null,
  
  // Tokens (en mémoire seulement, pas dans localStorage)
  token: null,
  refreshToken: null,
  
  // Session info
  sessionId: null,
  sessionExpiresAt: null,
  
  // État authentification
  isAuthenticated: false,
  
  // États de chargement
  loading: false,
  loginLoading: false,
  registerLoading: false,
  
  // Erreurs
  error: null,
  
  // Success messages
  successMessage: null
};

// ===================================================================
// SLICE
// ===================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Mettre à jour les tokens (utilisé par refresh interceptor)
    setTokens: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    
    // Déconnexion locale (sans appel API)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.sessionId = null;
      state.sessionExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
    
    // Mettre à jour les données utilisateur
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    // Nettoyer les erreurs
    clearError: (state) => {
      state.error = null;
    },
    
    // Nettoyer les messages de succès
    clearSuccess: (state) => {
      state.successMessage = null;
    }
  },
  
  extraReducers: (builder) => {
    // ===================================================================
    // REGISTER
    // ===================================================================
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.sessionId = action.payload.session.sessionId;
        state.sessionExpiresAt = action.payload.session.expiresAt;
        state.isAuthenticated = true;
        state.successMessage = 'Inscription réussie ! Bienvenue ! 🇭🇹';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.error = action.payload;
      });
    
    // ===================================================================
    // LOGIN
    // ===================================================================
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.sessionId = action.payload.session.sessionId;
        state.sessionExpiresAt = action.payload.session.expiresAt;
        state.isAuthenticated = true;
        state.successMessage = `Bon retour ${action.payload.user.firstName} ! 👋`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
    
    // ===================================================================
    // LOGOUT
    // ===================================================================
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionId = null;
        state.sessionExpiresAt = null;
        state.isAuthenticated = false;
        state.error = null;
        state.successMessage = 'Déconnexion réussie. À bientôt ! 👋';
      })
      .addCase(logoutUser.rejected, (state) => {
        // Même si logout API échoue, on déconnecte localement
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionId = null;
        state.sessionExpiresAt = null;
        state.isAuthenticated = false;
      });
    
    // ===================================================================
    // FETCH USER
    // ===================================================================
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Si fetch user échoue, probablement token invalide
        state.isAuthenticated = false;
      });
    
    // ===================================================================
    // CHANGE PASSWORD
    // ===================================================================
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Mot de passe modifié avec succès';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // ===================================================================
    // FORGOT PASSWORD
    // ===================================================================
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Email de réinitialisation envoyé. Vérifiez votre boîte mail.';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // ===================================================================
    // RESET PASSWORD
    // ===================================================================
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ===================================================================
// EXPORTS
// ===================================================================

export const { 
  setTokens, 
  logout, 
  updateUser, 
  clearError, 
  clearSuccess 
} = authSlice.actions;

export default authSlice.reducer;