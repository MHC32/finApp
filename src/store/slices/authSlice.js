/**
 * =========================================================
 * FinApp Haiti - Auth Slice
 * Gestion de l'authentification utilisateur
 * =========================================================
 */

import { createSlice } from '@reduxjs/toolkit';

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

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Login Success
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
     * Login Start
     */
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Login Failure
     */
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    /**
     * Register Success
     */
    registerSuccess: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    /**
     * Register Start
     */
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Register Failure
     */
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /**
     * Logout
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
});

/**
 * Export Actions
 */
export const {
  loginSuccess,
  loginStart,
  loginFailure,
  registerSuccess,
  registerStart,
  registerFailure,
  logout,
  updateUser,
  updateToken,
  clearError,
  setUser,
} = authSlice.actions;

/**
 * Selectors
 */
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

/**
 * Export Reducer
 */
export default authSlice.reducer;