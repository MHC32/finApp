/**
 * =========================================================
 * FinApp Haiti - Auth Service (SYNCHRONISÉ BACKEND)
 * Service d'authentification - Backend Node.js
 * ✅ Correspondance exacte avec backend routes/controllers
 * =========================================================
 */

import apiClient from './baseClient';

const authService = {
  /**
   * Login - Connexion utilisateur
   * POST /api/auth/login
   * 
   * Backend expects:
   * {
   *   identifier: string (email ou téléphone),
   *   password: string,
   *   rememberMe?: boolean
   * }
   * 
   * Backend returns:
   * {
   *   success: true,
   *   message: "Bon retour {firstName}! 👋",
   *   data: {
   *     user: { userId, email, firstName, lastName, role, region, isVerified },
   *     tokens: { accessToken, tokenType, expiresIn },
   *     session: { sessionId, deviceId, deviceInfo }
   *   }
   * }
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', {
        identifier: credentials.email, // Peut être email ou téléphone
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });
      
      console.log('✅ Login réussi:', response);
      return response; // baseClient retourne déjà response.data
    } catch (error) {
      console.error('❌ Erreur login:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Register - Inscription utilisateur
   * POST /api/auth/register
   * 
   * Backend expects:
   * {
   *   firstName: string,
   *   lastName: string,
   *   email: string,
   *   password: string,
   *   phone?: string,
   *   region: string,
   *   city: string,
   *   agreeToTerms: boolean
   * }
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phoneNumber || userData.phone,
        region: userData.region || 'ouest',
        city: userData.city || 'Port-au-Prince',
        agreeToTerms: true,
      });
      
      console.log('✅ Register réussi:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur register:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logout - Déconnexion session courante
   * POST /api/auth/logout
   * 
   * Requiert authentification (token dans headers)
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      console.log('✅ Logout réussi');
      return response;
    } catch (error) {
      console.error('❌ Erreur logout:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get Current User - Récupérer utilisateur connecté
   * GET /api/auth/me
   * 
   * Utilise optionalAuth sur le backend
   * 
   * Backend returns:
   * {
   *   success: true,
   *   data: {
   *     user: UserObject | null,
   *     authenticated: boolean,
   *     session: { sessionId, tokenExpiringSoon } | null
   *   }
   * }
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      console.log('✅ getCurrentUser réussi:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur getCurrentUser:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Verify Token - Vérifier validité du token
   * GET /api/auth/verify-token
   * 
   * Requiert authentification
   * 
   * Backend returns:
   * {
   *   success: true,
   *   data: {
   *     valid: boolean,
   *     user: UserObject,
   *     session: SessionObject,
   *     tokenExpiringSoon: boolean
   *   }
   * }
   */
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify-token');
      console.log('✅ Token vérifié:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur verifyToken:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Refresh Token - Renouveler access token
   * POST /api/auth/refresh
   * 
   * Backend expects:
   * {
   *   refreshToken: string
   * }
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      });
      console.log('✅ Token renouvelé');
      return response;
    } catch (error) {
      console.error('❌ Erreur refreshToken:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Change Password - Changer mot de passe
   * POST /api/auth/change-password
   * 
   * Requiert authentification
   */
  changePassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      return response;
    } catch (error) {
      console.error('❌ Erreur changePassword:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Forgot Password - Demander réinitialisation
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('❌ Erreur forgotPassword:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Reset Password - Réinitialiser avec token
   * POST /api/auth/reset-password
   */
  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        resetToken,
        newPassword,
        confirmPassword,
      });
      return response;
    } catch (error) {
      console.error('❌ Erreur resetPassword:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get Sessions - Liste sessions actives
   * GET /api/auth/sessions
   * 
   * Requiert authentification
   */
  getSessions: async () => {
    try {
      const response = await apiClient.get('/auth/sessions');
      return response;
    } catch (error) {
      console.error('❌ Erreur getSessions:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logout All - Déconnexion toutes sessions
   * POST /api/auth/logout-all
   * 
   * Requiert authentification
   */
  logoutAll: async () => {
    try {
      const response = await apiClient.post('/auth/logout-all');
      return response;
    } catch (error) {
      console.error('❌ Erreur logoutAll:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default authService;