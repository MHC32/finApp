import api from '../axios';

// ===================================================================
// ENDPOINTS DES TRANSACTIONS
// ===================================================================

/**
 * Créer une nouvelle transaction
 * @param {Object} data - Données de la transaction
 * @param {number} data.amount - Montant
 * @param {string} data.type - Type (income/expense/transfer)
 * @param {string} data.description - Description
 * @param {string} data.category - Catégorie
 * @param {string} data.account - ID du compte
 * @param {string} data.subcategory - Sous-catégorie (optionnel)
 * @param {string} data.toAccount - ID compte destinataire (pour transfert)
 * @param {string} data.date - Date (optionnel)
 * @param {Array} data.tags - Tags (optionnel)
 * @param {string} data.notes - Notes (optionnel)
 * @param {Object} data.location - Localisation (optionnel)
 * @returns {Promise}
 */
export const createTransaction = (data) => {
  return api.post('/transactions', data);
};

/**
 * Récupérer les transactions de l'utilisateur
 * @param {Object} params - Paramètres de filtrage
 * @param {number} params.page - Page
 * @param {number} params.limit - Limite par page
 * @param {string} params.account - ID du compte
 * @param {string} params.category - Catégorie
 * @param {string} params.type - Type
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @param {string} params.search - Terme de recherche
 * @param {string} params.sortBy - Champ de tri
 * @param {string} params.sortOrder - Ordre de tri
 * @returns {Promise}
 */
export const getTransactions = (params = {}) => {
  return api.get('/transactions/list', { params });
};

/**
 * Récupérer une transaction spécifique
 * @param {string} transactionId - ID de la transaction
 * @returns {Promise}
 */
export const getTransactionById = (transactionId) => {
  return api.get(`/transactions/${transactionId}`);
};

/**
 * Mettre à jour une transaction
 * @param {string} transactionId - ID de la transaction
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise}
 */
export const updateTransaction = (transactionId, data) => {
  return api.put(`/transactions/${transactionId}`, data);
};

/**
 * Supprimer une transaction
 * @param {string} transactionId - ID de la transaction
 * @param {Object} options - Options de suppression
 * @param {string} options.reason - Raison de la suppression
 * @param {boolean} options.permanent - Suppression permanente
 * @returns {Promise}
 */
export const deleteTransaction = (transactionId, options = {}) => {
  return api.delete(`/transactions/${transactionId}`, { data: options });
};

/**
 * Analytics par catégorie
 * @param {Object} params - Paramètres
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @param {string} params.type - Type (income/expense)
 * @param {number} params.limit - Limite
 * @returns {Promise}
 */
export const getCategoryAnalytics = (params = {}) => {
  return api.get('/transactions/analytics/categories', { params });
};

/**
 * Statistiques mensuelles
 * @param {Object} params - Paramètres
 * @param {number} params.year - Année
 * @param {number} params.months - Nombre de mois
 * @returns {Promise}
 */
export const getMonthlyStats = (params = {}) => {
  return api.get('/transactions/analytics/monthly', { params });
};

/**
 * Recherche avancée
 * @param {Object} params - Paramètres de recherche
 * @param {string} params.q - Terme de recherche
 * @param {number} params.limit - Limite de résultats
 * @param {boolean} params.includeDeleted - Inclure supprimées
 * @returns {Promise}
 */
export const searchTransactions = (params = {}) => {
  return api.get('/transactions/search', { params });
};

/**
 * Dupliquer une transaction
 * @param {string} transactionId - ID de la transaction
 * @param {Object} data - Données de duplication
 * @returns {Promise}
 */
export const duplicateTransaction = (transactionId, data = {}) => {
  return api.post(`/transactions/${transactionId}/duplicate`, data);
};

/**
 * Confirmer une transaction en attente
 * @param {string} transactionId - ID de la transaction
 * @returns {Promise}
 */
export const confirmTransaction = (transactionId) => {
  return api.put(`/transactions/${transactionId}/confirm`);
};

/**
 * Ajouter un reçu à une transaction
 * @param {string} transactionId - ID de la transaction
 * @param {Object} receiptData - Données du reçu
 * @returns {Promise}
 */
export const addReceipt = (transactionId, receiptData) => {
  return api.post(`/transactions/${transactionId}/receipt`, receiptData);
};

/**
 * Ajouter une localisation à une transaction
 * @param {string} transactionId - ID de la transaction
 * @param {Object} locationData - Données de localisation
 * @returns {Promise}
 */
export const addLocation = (transactionId, locationData) => {
  return api.put(`/transactions/${transactionId}/location`, locationData);
};

/**
 * Obtenir des suggestions de transactions
 * @param {Object} params - Paramètres
 * @param {string} params.category - Catégorie
 * @param {string} params.description - Description
 * @param {number} params.limit - Limite
 * @returns {Promise}
 */
export const getTransactionSuggestions = (params = {}) => {
  return api.get('/transactions/suggestions', { params });
};

/**
 * Obtenir les templates de transactions rapides
 * @returns {Promise}
 */
export const getTransactionTemplates = () => {
  return api.get('/transactions/templates');
};

/**
 * Valider un montant de transaction
 * @param {number} amount - Montant à valider
 * @param {Object} params - Paramètres
 * @param {string} params.accountId - ID du compte
 * @param {string} params.type - Type de transaction
 * @returns {Promise}
 */
export const validateAmount = (amount, params = {}) => {
  return api.get(`/transactions/validate/amount/${amount}`, { params });
};

// ===================================================================
// EXPORT PAR DÉFAUT (objet groupé)
// ===================================================================

const transactionsApi = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getCategoryAnalytics,
  getMonthlyStats,
  searchTransactions,
  duplicateTransaction,
  confirmTransaction,
  addReceipt,
  addLocation,
  getTransactionSuggestions,
  getTransactionTemplates,
  validateAmount
};

export default transactionsApi;