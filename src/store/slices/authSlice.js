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

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiresAt: null, // Timestamp d'expiration
  
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
      }
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
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearSuccess: (state) => {
      state.successMessage = null;
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
        state.tokenExpiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes
        state.isAuthenticated = true;
        state.showTokenExpiryModal = false;
        state.successMessage = `Bon retour ${action.payload.user.firstName} ! 👋`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // REFRESH TOKEN
    builder
      .addCase(refreshToken.pending, (state) => {
        state.refreshLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.refreshLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiresAt = Date.now() + (15 * 60 * 1000); // Nouveau 15 minutes
        state.showTokenExpiryModal = false;
        state.tokenExpiryCountdown = 0;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshLoading = false;
        state.error = action.payload;
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
  updateTokenExpiryCountdown
} = authSlice.actions;

export default authSlice.reducer;