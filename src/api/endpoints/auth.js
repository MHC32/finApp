// src/api/endpoints/auth.js
import api from '../axios';

// ===================================================================
// ENDPOINTS D'AUTHENTIFICATION
// ===================================================================

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} data - Données d'inscription
 * @param {string} data.firstName - Prénom
 * @param {string} data.lastName - Nom
 * @param {string} data.email - Email
 * @param {string} data.password - Mot de passe
 * @param {string} data.phone - Téléphone (optionnel)
 * @returns {Promise}
 */
export const register = (data) => {
  return api.post('/auth/register', data);
};

/**
 * Connexion utilisateur
 * @param {Object} credentials - Identifiants
 * @param {string} credentials.email - Email ou téléphone
 * @param {string} credentials.password - Mot de passe
 * @returns {Promise}
 */
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

/**
 * Déconnexion utilisateur
 * @returns {Promise}
 */
export const logout = () => {
  return api.post('/auth/logout');
};

/**
 * Refresh du token d'accès
 * @param {string} refreshToken - Refresh token
 * @returns {Promise}
 */
export const refresh = (refreshToken) => {
  return api.post('/auth/refresh', { refreshToken });
};

/**
 * Récupérer les informations de l'utilisateur connecté
 * @returns {Promise}
 */
export const me = () => {
  return api.get('/auth/me');
};

/**
 * Changer le mot de passe (utilisateur connecté)
 * @param {Object} data - Données
 * @param {string} data.currentPassword - Mot de passe actuel
 * @param {string} data.newPassword - Nouveau mot de passe
 * @returns {Promise}
 */
export const changePassword = (data) => {
  return api.post('/auth/change-password', data);
};

/**
 * Demander un reset de mot de passe (mot de passe oublié)
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise}
 */
export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

/**
 * Réinitialiser le mot de passe avec le token reçu par email
 * @param {Object} data - Données
 * @param {string} data.token - Token de reset
 * @param {string} data.newPassword - Nouveau mot de passe
 * @returns {Promise}
 */
export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data);
};

/**
 * Vérifier la validité d'un token (email, reset, etc.)
 * @param {string} token - Token à vérifier
 * @returns {Promise}
 */
export const verifyToken = (token) => {
  return api.get(`/auth/verify-token/${token}`);
};

/**
 * Récupérer toutes les sessions actives de l'utilisateur
 * @returns {Promise}
 */
export const getSessions = () => {
  return api.get('/auth/sessions');
};

/**
 * Supprimer une session spécifique
 * @param {string} sessionId - ID de la session à supprimer
 * @returns {Promise}
 */
export const deleteSession = (sessionId) => {
  return api.delete(`/auth/sessions/${sessionId}`);
};

/**
 * Déconnexion globale (toutes les sessions)
 * @returns {Promise}
 */
export const logoutAll = () => {
  return api.post('/auth/logout-all');
};

/**
 * Vérifier l'email avec le token reçu
 * @param {string} token - Token de vérification email
 * @returns {Promise}
 */
export const verifyEmail = (token) => {
  return api.get(`/auth/verify-email/${token}`);
};

/**
 * Renvoyer l'email de vérification
 * @returns {Promise}
 */
export const resendVerificationEmail = () => {
  return api.post('/auth/resend-verification');
};

// ===================================================================
// EXPORT PAR DÉFAUT (objet groupé)
// ===================================================================

const authApi = {
  register,
  login,
  logout,
  refresh,
  me,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyToken,
  getSessions,
  deleteSession,
  logoutAll,
  verifyEmail,
  resendVerificationEmail
};

export default authApi