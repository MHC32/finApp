/**
 * =========================================================
 * FinApp Haiti - Auth Service (VERSION PROPRE)
 * ✅ Pas de localStorage manuel
 * ✅ Retourne juste les données brutes
 * ✅ Redux gère toute la logique de state
 * =========================================================
 */

import apiClient from './baseClient';

const authService = {
  /**
   * Login - Connexion utilisateur
   */
  login: async (credentials) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🔐 AUTH SERVICE - LOGIN                               ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log('║ Credentials:');
    console.log('║   Email/Identifier:', credentials.email);
    console.log('║   Password:', credentials.password ? '***' : 'VIDE');
    console.log('║   RememberMe:', credentials.rememberMe);
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      console.log('🚀 Envoi requête POST /auth/login...\n');
      
      const response = await apiClient.post('/auth/login', {
        identifier: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });
      
      console.log('\n╔═══════════════════════════════════════════════════════╗');
      console.log('║ ✅ LOGIN RÉUSSI                                       ║');
      console.log('╠═══════════════════════════════════════════════════════╣');
      console.log('║ Response type:', typeof response);
      console.log('║ Response.success:', response?.success);
      console.log('║ Response.data présent:', !!response?.data);
      
      if (response?.data) {
        console.log('║ ');
        console.log('║ User:', response.data.user ? 'PRÉSENT' : 'ABSENT');
        if (response.data.user) {
          console.log('║   - userId:', response.data.user.userId);
          console.log('║   - email:', response.data.user.email);
          console.log('║   - firstName:', response.data.user.firstName);
          console.log('║   - lastName:', response.data.user.lastName);
        }
        
        console.log('║ ');
        console.log('║ Tokens:', response.data.tokens ? 'PRÉSENT' : 'ABSENT');
        if (response.data.tokens) {
          console.log('║   - accessToken:', response.data.tokens.accessToken ? '***' : 'ABSENT');
          console.log('║   - refreshToken:', response.data.tokens.refreshToken ? '***' : 'ABSENT');
          console.log('║   - tokenType:', response.data.tokens.tokenType);
          console.log('║   - expiresIn:', response.data.tokens.expiresIn);
        }
        
        console.log('║ ');
        console.log('║ Session:', response.data.session ? 'PRÉSENT' : 'ABSENT');
      }
      
      console.log('╚═══════════════════════════════════════════════════════╝\n');
      
      // ✅ Retourne juste la réponse - Redux s'occupe du reste
      return response;
      
    } catch (error) {
      console.log('\n╔═══════════════════════════════════════════════════════╗');
      console.log('║ ❌ LOGIN ÉCHOUÉ                                       ║');
      console.log('╠═══════════════════════════════════════════════════════╣');
      console.log('║ Error type:', error.constructor.name);
      console.log('║ Error message:', error.message);
      console.log('║ ');
      
      if (error.response) {
        console.log('║ HTTP Status:', error.response.status);
        console.log('║ Response data:', JSON.stringify(error.response.data, null, 2).split('\n').join('\n║ '));
      } else if (error.type) {
        console.log('║ Error type:', error.type);
        console.log('║ Error data:', JSON.stringify(error, null, 2).split('\n').join('\n║ '));
      } else {
        console.log('║ Erreur réseau (pas de réponse du backend)');
      }
      
      console.log('╚═══════════════════════════════════════════════════════╝\n');
      
      throw error;
    }
  },

  /**
   * Register - Inscription utilisateur
   */
  register: async (userData) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 📝 AUTH SERVICE - REGISTER                            ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log('║ User Data:');
    console.log('║   firstName:', userData.firstName);
    console.log('║   lastName:', userData.lastName);
    console.log('║   email:', userData.email);
    console.log('║   password:', userData.password ? '***' : 'VIDE');
    console.log('║   phone:', userData.phoneNumber || userData.phone);
    console.log('║   region:', userData.region || 'ouest');
    console.log('║   city:', userData.city || 'Port-au-Prince');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      console.log('🚀 Envoi requête POST /auth/register...\n');
      
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
      
      console.log('\n✅ REGISTER RÉUSSI');
      console.log('Response:', response);
      
      // ✅ Retourne juste la réponse
      return response;
      
    } catch (error) {
      console.log('\n❌ REGISTER ÉCHOUÉ');
      console.log('Error:', error);
      console.log('Response:', error.response);
      
      throw error;
    }
  },

  /**
   * Logout - Déconnexion session courante
   */
  logout: async () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🚪 AUTH SERVICE - LOGOUT                              ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.post('/auth/logout');
      console.log('✅ LOGOUT BACKEND RÉUSSI');
      return response;
    } catch (error) {
      console.log('⚠️ LOGOUT BACKEND ÉCHOUÉ (mais déconnexion locale OK)');
      console.log('Error:', error);
      // On laisse Redux gérer la déconnexion locale même si le backend échoue
      throw error;
    }
    // ✅ Redux nettoiera automatiquement le state
  },

  /**
   * Get Current User - Récupérer utilisateur connecté
   */
  getCurrentUser: async () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 👤 AUTH SERVICE - GET CURRENT USER                    ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      console.log('🚀 Envoi requête GET /auth/me...\n');
      
      const response = await apiClient.get('/auth/me');
      
      console.log('\n✅ GET CURRENT USER RÉUSSI');
      console.log('Response:', response);
      console.log('User présent:', !!response?.data?.user);
      console.log('Authenticated:', response?.data?.authenticated);
      
      return response;
      
    } catch (error) {
      console.log('\n❌ GET CURRENT USER ÉCHOUÉ');
      console.log('Error:', error);
      console.log('Status:', error.response?.status);
      
      throw error;
    }
  },

  /**
   * Verify Token - Vérifier validité du token
   */
  verifyToken: async () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🔍 AUTH SERVICE - VERIFY TOKEN                        ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.get('/auth/verify-token');
      console.log('✅ Token vérifié:', response);
      return response;
    } catch (error) {
      console.log('❌ Erreur verifyToken:', error);
      throw error;
    }
  },

  /**
   * Refresh Token - Renouveler access token
   * NOTE: Cette méthode n'est PAS utilisée directement par le code
   * Le refresh est géré automatiquement par baseClient.js interceptor
   */
  refreshToken: async (refreshToken) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🔄 AUTH SERVICE - REFRESH TOKEN                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      });
      console.log('✅ Token renouvelé');
      return response;
    } catch (error) {
      console.log('❌ Erreur refreshToken:', error);
      throw error;
    }
  },

  /**
   * Change Password - Changer mot de passe
   */
  changePassword: async (data) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🔑 AUTH SERVICE - CHANGE PASSWORD                     ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      console.log('✅ Mot de passe changé');
      return response;
    } catch (error) {
      console.log('❌ Erreur changePassword:', error);
      throw error;
    }
  },

  /**
   * Forgot Password - Demander réinitialisation
   */
  forgotPassword: async (email) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 📧 AUTH SERVICE - FORGOT PASSWORD                     ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      console.log('✅ Email de réinitialisation envoyé');
      return response;
    } catch (error) {
      console.log('❌ Erreur forgotPassword:', error);
      throw error;
    }
  },

  /**
   * Reset Password - Réinitialiser avec token
   */
  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🔓 AUTH SERVICE - RESET PASSWORD                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.post('/auth/reset-password', {
        resetToken,
        newPassword,
        confirmPassword,
      });
      console.log('✅ Mot de passe réinitialisé');
      return response;
    } catch (error) {
      console.log('❌ Erreur resetPassword:', error);
      throw error;
    }
  },

  /**
   * Get Sessions - Liste sessions actives
   */
  getSessions: async () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 📋 AUTH SERVICE - GET SESSIONS                        ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.get('/auth/sessions');
      console.log('✅ Sessions récupérées');
      return response;
    } catch (error) {
      console.log('❌ Erreur getSessions:', error);
      throw error;
    }
  },

  /**
   * Revoke Session - Révoquer une session spécifique
   */
  revokeSession: async (sessionId) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🗑️ AUTH SERVICE - REVOKE SESSION                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
      console.log('✅ Session révoquée');
      return response;
    } catch (error) {
      console.log('❌ Erreur revokeSession:', error);
      throw error;
    }
  },

  /**
   * Logout All - Déconnexion toutes sessions
   */
  logoutAll: async () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🚪 AUTH SERVICE - LOGOUT ALL                          ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.post('/auth/logout-all');
      console.log('✅ Déconnexion de toutes les sessions réussie');
      return response;
    } catch (error) {
      console.log('❌ Erreur logoutAll:', error);
      throw error;
    }
  },

  /**
   * Update Profile - Mettre à jour profil utilisateur
   */
  updateProfile: async (profileData) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ ✏️ AUTH SERVICE - UPDATE PROFILE                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      console.log('✅ Profil mis à jour');
      return response;
    } catch (error) {
      console.log('❌ Erreur updateProfile:', error);
      throw error;
    }
  },

  /**
   * Delete Account - Supprimer compte utilisateur
   */
  deleteAccount: async (password) => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🗑️ AUTH SERVICE - DELETE ACCOUNT                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    try {
      const response = await apiClient.delete('/auth/account', {
        data: { password }
      });
      console.log('✅ Compte supprimé');
      return response;
    } catch (error) {
      console.log('❌ Erreur deleteAccount:', error);
      throw error;
    }
  },
};

export default authService;