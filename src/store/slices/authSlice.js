/**
 * =========================================================
 * FinApp Haiti - Auth Slice
 * Gestion de l'état d'authentification avec Redux Toolkit
 * =========================================================
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * État initial de l'authentification
 */
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

/**
 * Auth Slice
 * Gère tout l'état lié à l'authentification de l'utilisateur
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Login Start
     * Déclenché quand l'utilisateur commence à se connecter
     */
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Login Success
     * Déclenché quand le login réussit
     * @param {object} action.payload - { user, token, refreshToken }
     */
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.error = null;

      // Sauvegarder token dans localStorage
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
      }
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },

    /**
     * Login Failure
     * Déclenché quand le login échoue
     * @param {string} action.payload - Message d'erreur
     */
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    /**
     * Logout
     * Déconnecte l'utilisateur et nettoie l'état
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.loading = false;

      // Nettoyer localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    },

    /**
     * Update User
     * Met à jour les informations de l'utilisateur
     * @param {object} action.payload - Données utilisateur à mettre à jour
     */
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    /**
     * Clear Error
     * Efface les erreurs d'authentification
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set Token
     * Définit manuellement le token (utile pour refresh)
     * @param {string} action.payload - Nouveau token
     */
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('authToken', action.payload);
    },

    /**
     * Restore Session
     * Restaure la session depuis localStorage
     * @param {object} action.payload - { user, token }
     */
    restoreSession: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
  },
});

// Export des actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
  setToken,
  restoreSession,
} = authSlice.actions;

// Selectors (helpers pour accéder à l'état)
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export du reducer
export default authSlice.reducer;