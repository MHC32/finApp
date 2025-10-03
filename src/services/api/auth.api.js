/**
 * =========================================================
 * FinApp Haiti - Auth API Service
 * Services d'authentification
 * =========================================================
 */

import apiClient from './baseClient';

/**
 * Auth API Service
 * Tous les endpoints d'authentification
 */
export const authAPI = {
  /**
   * Login
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise} - { user, tokens, session }
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', {
        identifier: credentials.email, // Backend attend "identifier"
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      console.log('✅ Login réussi:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur login:', error);
      throw error;
    }
  },

  /**
   * Register
   * @param {Object} userData - { firstName, lastName, email, password, phone, region }
   * @returns {Promise} - { user, tokens, session }
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        region: userData.region || 'Ouest', // Défaut Port-au-Prince
        currency: userData.currency || 'HTG',
        language: userData.language || 'fr'
      });

      console.log('✅ Inscription réussie:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  },

  /**
   * Logout
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      console.log('✅ Déconnexion réussie');
      return response;
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      throw error;
    }
  },

  /**
   * Refresh Token
   * @param {string} refreshToken
   * @returns {Promise} - { tokens, session }
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });

      console.log('✅ Token renouvelé');
      return response;
    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      throw error;
    }
  },

  /**
   * Verify Token / Get Current User
   * @returns {Promise} - { user }
   */
  checkAuth: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      console.log('✅ Token valide');
      return response;
    } catch (error) {
      console.error('❌ Token invalide');
      throw error;
    }
  },

  /**
   * Forgot Password
   * @param {string} email
   * @returns {Promise}
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email
      });

      console.log('✅ Email de réinitialisation envoyé');
      return response;
    } catch (error) {
      console.error('❌ Erreur forgot password:', error);
      throw error;
    }
  },

  /**
   * Reset Password
   * @param {string} token - Reset token
   * @param {string} newPassword
   * @returns {Promise}
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword
      });

      console.log('✅ Mot de passe réinitialisé');
      return response;
    } catch (error) {
      console.error('❌ Erreur reset password:', error);
      throw error;
    }
  },

  /**
   * Change Password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise}
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      console.log('✅ Mot de passe modifié');
      return response;
    } catch (error) {
      console.error('❌ Erreur change password:', error);
      throw error;
    }
  },

  /**
   * Get Active Sessions
   * @returns {Promise} - { sessions }
   */
  getSessions: async () => {
    try {
      const response = await apiClient.get('/auth/sessions');
      console.log('✅ Sessions récupérées');
      return response;
    } catch (error) {
      console.error('❌ Erreur get sessions:', error);
      throw error;
    }
  },

  /**
   * Logout All Sessions
   * @returns {Promise}
   */
  logoutAll: async () => {
    try {
      const response = await apiClient.post('/auth/logout-all');
      console.log('✅ Toutes les sessions fermées');
      return response;
    } catch (error) {
      console.error('❌ Erreur logout all:', error);
      throw error;
    }
  }
};

export default authAPI;