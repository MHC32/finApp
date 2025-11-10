// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/endpoints/auth';

// ===================================================================
// THUNKS ASYNCHRONES
// ===================================================================

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'inscription'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Identifiants incorrects'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (error) {
      console.error('Erreur logout API:', error);
      return true; // Déconnexion locale même si API échoue
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const refreshTokenValue = state.auth.refreshToken;
      
      if (!refreshTokenValue) {
        throw new Error('Aucun refresh token disponible');
      }
      
      const response = await authApi.refresh(refreshTokenValue);
      return response.data.data.tokens;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors du rafraîchissement'
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.me();
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération'
      );
    }
  }
);

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const getInitialState = () => {
  // Tentative de récupération depuis le localStorage pour la persistance
  const savedAuth = localStorage.getItem('auth');
  
  if (savedAuth) {
    try {
      const parsedAuth = JSON.parse(savedAuth);
      return {
        user: parsedAuth.user || null,
        token: parsedAuth.token || null,
        refreshToken: parsedAuth.refreshToken || null,
        tokenExpiresAt: parsedAuth.tokenExpiresAt || null,
        
        // Gestion expiration
        showTokenExpiryModal: false,
        tokenExpiryCountdown: 0,
        
        // États
        isAuthenticated: !!(parsedAuth.token && parsedAuth.user),
        loading: false,
        loginLoading: false,
        registerLoading: false,
        refreshLoading: false,
        
        // Messages
        error: null,
        successMessage: null
      };
    } catch (error) {
      console.error('Erreur parsing saved auth:', error);
    }
  }

  return {
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiresAt: null,
    
    // Gestion expiration
    showTokenExpiryModal: false,
    tokenExpiryCountdown: 0,
    
    // États
    isAuthenticated: false,
    loading: false,
    loginLoading: false,
    registerLoading: false,
    refreshLoading: false,
    
    // Messages
    error: null,
    successMessage: null
  };
};

const initialState = getInitialState();

// ===================================================================
// SLICE
// ===================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      
      if (action.payload.expiresAt) {
        state.tokenExpiresAt = action.payload.expiresAt;
      } else if (action.payload.expiresIn) {
        state.tokenExpiresAt = Date.now() + action.payload.expiresIn;
      } else {
        // Default: 15 minutes
        state.tokenExpiresAt = Date.now() + (15 * 60 * 1000);
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt
      }));
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.showTokenExpiryModal = false;
      state.tokenExpiryCountdown = 0;
      state.error = null;
      state.successMessage = null;
      
      // Nettoyer le localStorage
      localStorage.removeItem('auth');
    },
    
    // Gestion modal d'expiration
    showTokenExpiryModal: (state, action) => {
      state.showTokenExpiryModal = true;
      state.tokenExpiryCountdown = action.payload.countdown || 0;
    },
    
    hideTokenExpiryModal: (state) => {
      state.showTokenExpiryModal = false;
      state.tokenExpiryCountdown = 0;
    },
    
    updateTokenExpiryCountdown: (state, action) => {
      state.tokenExpiryCountdown = action.payload;
    },
    
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Mettre à jour le localStorage
      if (state.token) {
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          tokenExpiresAt: state.tokenExpiresAt
        }));
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearSuccess: (state) => {
      state.successMessage = null;
    },

    // Restaurer l'authentification depuis le localStorage
    restoreAuth: (state) => {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          state.user = parsedAuth.user;
          state.token = parsedAuth.token;
          state.refreshToken = parsedAuth.refreshToken;
          state.tokenExpiresAt = parsedAuth.tokenExpiresAt;
          state.isAuthenticated = !!(parsedAuth.token && parsedAuth.user);
        } catch (error) {
          console.error('Erreur restoration auth:', error);
        }
      }
    }
  },
  
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        
        // Définir l'expiration du token
        const expiresIn = action.payload.tokens.expiresIn || (15 * 60 * 1000); // 15 minutes par défaut
        state.tokenExpiresAt = Date.now() + expiresIn;
        
        state.isAuthenticated = true;
        state.showTokenExpiryModal = false;
        state.successMessage = `Bon retour ${action.payload.user.firstName} ! 👋`;
        
        // Sauvegarder dans localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          tokenExpiresAt: state.tokenExpiresAt
        }));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        
        // Nettoyer le localStorage en cas d'erreur
        localStorage.removeItem('auth');
      });

    // REFRESH TOKEN
    builder
      .addCase(refreshToken.pending, (state) => {
        state.refreshLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.refreshLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        
        // Mettre à jour l'expiration
        const expiresIn = action.payload.expiresIn || (15 * 60 * 1000);
        state.tokenExpiresAt = Date.now() + expiresIn;
        
        state.showTokenExpiryModal = false;
        state.tokenExpiryCountdown = 0;
        state.successMessage = 'Session prolongée avec succès ✅';
        
        // Mettre à jour le localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          tokenExpiresAt: state.tokenExpiresAt
        }));
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshLoading = false;
        state.error = action.payload;
        state.showTokenExpiryModal = false;
        
        // En cas d'erreur de refresh, déconnecter l'utilisateur
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        
        localStorage.removeItem('auth');
      });

    // LOGOUT
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        state.showTokenExpiryModal = false;
        state.tokenExpiryCountdown = 0;
        state.successMessage = 'Déconnexion réussie. À bientôt ! 👋';
        
        localStorage.removeItem('auth');
      });

    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        
        const expiresIn = action.payload.tokens.expiresIn || (15 * 60 * 1000);
        state.tokenExpiresAt = Date.now() + expiresIn;
        
        state.isAuthenticated = true;
        state.showTokenExpiryModal = false;
        state.successMessage = `Bienvenue ${action.payload.user.firstName} ! 🎉`;
        
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          tokenExpiresAt: state.tokenExpiresAt
        }));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        
        localStorage.removeItem('auth');
      });

    // FETCH USER
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Mettre à jour le localStorage avec les nouvelles infos user
        if (state.token) {
          localStorage.setItem('auth', JSON.stringify({
            user: state.user,
            token: state.token,
            refreshToken: state.refreshToken,
            tokenExpiresAt: state.tokenExpiresAt
          }));
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        
        localStorage.removeItem('auth');
      });
  }
});

export const { 
  setTokens, 
  logout, 
  updateUser, 
  clearError, 
  clearSuccess,
  showTokenExpiryModal,
  hideTokenExpiryModal,
  updateTokenExpiryCountdown,
  restoreAuth
} = authSlice.actions;

export default authSlice.reducer;