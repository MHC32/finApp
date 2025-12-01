// src/api/endpoints/sols.js
import api from '../axios';

// ===================================================================
// ENDPOINTS SOLS/TONTINES
// ===================================================================

/**
 * Créer un nouveau sol/tontine
 * @param {Object} solData - Données du sol
 * @param {string} solData.name - Nom du sol
 * @param {string} solData.description - Description
 * @param {string} solData.type - Type de sol
 * @param {number} solData.contributionAmount - Montant de contribution
 * @param {string} solData.currency - Devise
 * @param {number} solData.maxParticipants - Nombre max de participants
 * @param {string} solData.frequency - Fréquence
 * @param {string} solData.startDate - Date de début
 * @param {number} solData.duration - Durée
 * @param {number} solData.paymentDay - Jour de paiement
 * @param {number} solData.interestRate - Taux d'intérêt
 * @param {string[]} solData.tags - Tags
 * @param {boolean} solData.isPrivate - Privé ou public
 * @param {Object[]} solData.rules - Règles
 * @returns {Promise}
 */
export const createSol = (solData) => {
  return api.post('/sols', solData);
};

/**
 * Récupérer tous les sols de l'utilisateur
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Statut des sols
 * @param {string} params.type - Type de sol
 * @param {number} params.page - Page
 * @param {number} params.limit - Limite par page
 * @param {string} params.sortBy - Champ de tri
 * @param {string} params.sortOrder - Ordre de tri
 * @param {boolean} params.includeAnalytics - Inclure analytics
 * @returns {Promise}
 */
export const getSols = (params = {}) => {
  return api.get('/sols', { params });
};

/**
 * Récupérer un sol spécifique
 * @param {string} solId - ID du sol
 * @param {Object} params - Paramètres
 * @param {boolean} params.includeHistory - Inclure historique
 * @returns {Promise}
 */
export const getSolById = (solId, params = {}) => {
  return api.get(`/sols/${solId}`, { params });
};

/**
 * Rejoindre un sol avec code d'accès
 * @param {Object} joinData - Données de participation
 * @param {string} joinData.accessCode - Code d'accès
 * @returns {Promise}
 */
export const joinSol = (joinData) => {
  return api.post('/sols/join', joinData);
};

/**
 * Quitter un sol
 * @param {string} solId - ID du sol
 * @param {Object} leaveData - Données de départ
 * @param {string} leaveData.reason - Raison du départ
 * @returns {Promise}
 */
export const leaveSol = (solId, leaveData = {}) => {
  return api.delete(`/sols/${solId}/leave`, { data: leaveData });
};

/**
 * Effectuer un paiement pour un sol
 * @param {string} solId - ID du sol
 * @param {Object} paymentData - Données de paiement
 * @param {string} paymentData.accountId - ID du compte
 * @param {number} paymentData.amount - Montant
 * @param {number} paymentData.roundIndex - Index du round
 * @param {string} paymentData.notes - Notes
 * @returns {Promise}
 */
export const makePayment = (solId, paymentData) => {
  return api.post(`/sols/${solId}/payment`, paymentData);
};

/**
 * Récupérer les participants d'un sol
 * @param {string} solId - ID du sol
 * @returns {Promise}
 */
export const getSolParticipants = (solId) => {
  return api.get(`/sols/${solId}/participants`);
};

/**
 * Récupérer les rounds d'un sol
 * @param {string} solId - ID du sol
 * @param {Object} params - Paramètres
 * @param {boolean} params.includePayments - Inclure paiements
 * @param {string} params.status - Statut des rounds
 * @returns {Promise}
 */
export const getSolRounds = (solId, params = {}) => {
  return api.get(`/sols/${solId}/rounds`, { params });
};

/**
 * Récupérer le calendrier d'un sol
 * @param {string} solId - ID du sol
 * @param {Object} params - Paramètres
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @param {string} params.format - Format
 * @returns {Promise}
 */
export const getSolCalendar = (solId, params = {}) => {
  return api.get(`/sols/${solId}/calendar`, { params });
};

/**
 * Récupérer les analytics personnels des sols
 * @param {Object} params - Paramètres
 * @param {number} params.timeframe - Période en jours
 * @returns {Promise}
 */
export const getPersonalAnalytics = (params = {}) => {
  return api.get('/sols/analytics/personal', { params });
};

/**
 * Découvrir des sols disponibles
 * @param {Object} params - Paramètres de recherche
 * @param {string} params.type - Type de sol
 * @param {number} params.minAmount - Montant minimum
 * @param {number} params.maxAmount - Montant maximum
 * @param {string} params.currency - Devise
 * @param {string} params.region - Région
 * @param {number} params.page - Page
 * @param {number} params.limit - Limite par page
 * @returns {Promise}
 */
export const discoverSols = (params = {}) => {
  return api.get('/sols/discover', { params });
};

/**
 * Rechercher des sols
 * @param {Object} params - Paramètres de recherche
 * @param {string} params.q - Terme de recherche
 * @param {Object} params.filters - Filtres
 * @param {string} params.sort - Tri
 * @param {number} params.page - Page
 * @param {number} params.limit - Limite par page
 * @returns {Promise}
 */
export const searchSols = (params = {}) => {
  return api.get('/sols/search', { params });
};

/**
 * Mettre à jour un sol
 * @param {string} solId - ID du sol
 * @param {Object} updateData - Données de mise à jour
 * @returns {Promise}
 */
export const updateSol = (solId, updateData) => {
  return api.put(`/sols/${solId}`, updateData);
};

/**
 * Supprimer/annuler un sol
 * @param {string} solId - ID du sol
 * @param {Object} deleteData - Données de suppression
 * @param {string} deleteData.reason - Raison
 * @param {boolean} deleteData.confirmDeletion - Confirmation
 * @returns {Promise}
 */
export const deleteSol = (solId, deleteData) => {
  return api.delete(`/sols/${solId}`, { data: deleteData });
};

/**
 * Récupérer les types de sols supportés
 * @returns {Promise}
 */
export const getSupportedSolTypes = () => {
  return api.get('/sols/supported/types');
};

/**
 * Récupérer les fréquences supportées
 * @returns {Promise}
 */
export const getSupportedFrequencies = () => {
  return api.get('/sols/supported/frequencies');
};

// ===================================================================
// EXPORT PAR DÉFAUT (objet groupé)
// ===================================================================

const solsApi = {
  createSol,
  getSols,
  getSolById,
  joinSol,
  leaveSol,
  makePayment,
  getSolParticipants,
  getSolRounds,
  getSolCalendar,
  getPersonalAnalytics,
  discoverSols,
  searchSols,
  updateSol,
  deleteSol,
  getSupportedSolTypes,
  getSupportedFrequencies
};

export default solsApi;