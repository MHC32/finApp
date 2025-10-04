/**
 * =========================================================
 * FinApp Haiti - Auth Service
 * Service pour authentification avec backend Node.js
 * ✅ ARCHITECTURE FINALE - Synchronisé avec backend
 * =========================================================
 */

import apiClient from './baseClient';

// ===================================================================
// AUTH SERVICE
// ===================================================================

export const authService = {
  
  // =================================================================
  // AUTHENTIFICATION PUBLIQUE
  // =================================================================

  /**
   * Inscription d'un nouvel utilisateur
   * POST /api/auth/register
   * 
   * @param {Object} userData
   * @param {string} userData.firstName - Prénom (required)
   * @param {string} userData.lastName - Nom (required)
   * @param {string} userData.email - Email (required)
   * @param {string} userData.password - Mot de passe (required, min 8 chars)
   * @param {string} userData.phone - Téléphone (optional, format: +509XXXXXXXX)
   * @param {string} userData.region - Région Haïti (default: 'Ouest')
   * @param {string} userData.currency - Devise préférée (default: 'HTG')
   * @param {string} userData.language - Langue (default: 'fr')
   * @returns {Promise} { user, tokens, session }
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        firstName: userData.firstName?.trim(),
        lastName: userData.lastName?.trim(),
        email: userData.email?.toLowerCase().trim(),
        password: userData.password,
        phone: userData.phone?.trim() || '',
        region: userData.region || 'Ouest',
        currency: userData.currency || 'HTG',
        language: userData.language || 'fr',
      });

      // Sauvegarder le token
      if (response.data?.tokens?.accessToken) {
        localStorage.setItem('token', response.data.tokens.accessToken);
        if (response.data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
      }

      return response; // { success: true, data: { user, tokens, session } }
    } catch (error) {
      console.error('❌ Erreur register:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Connexion utilisateur
   * POST /api/auth/login
   * 
   * @param {Object} credentials
   * @param {string} credentials.email - Email ou téléphone
   * @param {string} credentials.password - Mot de passe
   * @param {boolean} credentials.rememberMe - Se souvenir (default: false)
   * @returns {Promise} { user, tokens, session }
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', {
        identifier: credentials.email?.toLowerCase().trim(),
        password: credentials.password,
        rememberMe: Boolean(credentials.rememberMe),
      });

      // Sauvegarder les tokens
      if (response.data?.tokens?.accessToken) {
        localStorage.setItem('token', response.data.tokens.accessToken);
        
        if (credentials.rememberMe && response.data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
      }

      return response; // { success: true, data: { user, tokens, session } }
    } catch (error) {
      console.error('❌ Erreur login:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Renouveler access token
   * POST /api/auth/refresh
   * 
   * @param {string} refreshToken - Refresh token (optional, lu depuis localStorage si absent)
   * @returns {Promise} { tokens, session }
   */
  refreshToken: async (refreshToken = null) => {
    try {
      const token = refreshToken || localStorage.getItem('refreshToken');

      if (!token) {
        throw new Error('Refresh token manquant');
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken: token,
      });

      // Mettre à jour le token
      if (response.data?.tokens?.accessToken) {
        localStorage.setItem('token', response.data.tokens.accessToken);
      }

      return response; // { success: true, data: { tokens, session } }
    } catch (error) {
      console.error('❌ Erreur refresh token:', error.response?.data || error.message);
      
      // Si refresh échoue, supprimer les tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      throw error;
    }
  },

  /**
   * Demander réinitialisation mot de passe
   * POST /api/auth/forgot-password
   * 
   * @param {string} email - Email utilisateur
   * @returns {Promise} { message }
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email: email?.toLowerCase().trim(),
      });

      return response; // { success: true, message: '...' }
    } catch (error) {
      console.error('❌ Erreur forgot password:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Réinitialiser mot de passe avec token
   * POST /api/auth/reset-password
   * 
   * @param {Object} data
   * @param {string} data.token - Token de réinitialisation
   * @param {string} data.newPassword - Nouveau mot de passe
   * @returns {Promise} { message }
   */
  resetPassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword,
      });

      return response; // { success: true, message: '...' }
    } catch (error) {
      console.error('❌ Erreur reset password:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // GESTION SESSION (Authentification requise)
  // =================================================================

  /**
   * Déconnexion session courante
   * POST /api/auth/logout
   * 
   * @returns {Promise} { message }
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');

      // Nettoyer le stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      return response; // { success: true, message: '...' }
    } catch (error) {
      console.error('❌ Erreur logout:', error.response?.data || error.message);
      
      // Nettoyer quand même en cas d'erreur
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      throw error;
    }
  },

  /**
   * Déconnexion de toutes les sessions
   * POST /api/auth/logout-all
   * 
   * @returns {Promise} { message }
   */
  logoutAll: async () => {
    try {
      const response = await apiClient.post('/auth/logout-all');

      // Nettoyer le stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      return response; // { success: true, message: '...' }
    } catch (error) {
      console.error('❌ Erreur logout all:', error.response?.data || error.message);
      
      // Nettoyer quand même
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      throw error;
    }
  },

  /**
   * Changer mot de passe
   * POST /api/auth/change-password
   * 
   * @param {Object} data
   * @param {string} data.currentPassword - Mot de passe actuel
   * @param {string} data.newPassword - Nouveau mot de passe
   * @returns {Promise} { message }
   */
  changePassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      return response; // { success: true, message: '...' }
    } catch (error) {
      console.error('❌ Erreur change password:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Lister les sessions actives
   * GET /api/auth/sessions
   * 
   * @returns {Promise} { sessions }
   */
  getSessions: async () => {
    try {
      const response = await apiClient.get('/auth/sessions');
      return response; // { success: true, data: { sessions } }
    } catch (error) {
      console.error('❌ Erreur get sessions:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Nettoyer les sessions expirées
   * DELETE /api/auth/sessions/cleanup
   * 
   * @returns {Promise} { message, sessionsRemoved }
   */
  cleanupSessions: async () => {
    try {
      const response = await apiClient.delete('/auth/sessions/cleanup');
      return response; // { success: true, data: { message, sessionsRemoved } }
    } catch (error) {
      console.error('❌ Erreur cleanup sessions:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // INFORMATIONS UTILISATEUR
  // =================================================================

  /**
   * Obtenir les informations de l'utilisateur connecté
   * GET /api/auth/me
   * 
   * @returns {Promise} { user, session }
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response; // { success: true, data: { user, session } }
    } catch (error) {
      console.error('❌ Erreur get current user:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Vérifier la validité du token actuel
   * GET /api/auth/verify-token
   * 
   * @returns {Promise} { valid, user, session, tokenExpiringSoon }
   */
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify-token');
      return response; // { success: true, data: { valid, user, session, tokenExpiringSoon } }
    } catch (error) {
      console.error('❌ Erreur verify token:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // UTILITAIRES LOCAUX
  // =================================================================

  /**
   * Vérifier si l'utilisateur est connecté (token présent)
   * 
   * @returns {boolean} True si token présent
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtenir le token d'accès
   * 
   * @returns {string|null} Token ou null
   */
  getAccessToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Obtenir le refresh token
   * 
   * @returns {string|null} Refresh token ou null
   */
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Nettoyer tous les tokens (déconnexion locale)
   */
  clearTokens: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};

// Export default pour compatibilité
export default authService;