// src/api/endpoints/account.js
import api from '../axios';

// ===================================================================
// ENDPOINTS COMPTES BANCAIRES
// ===================================================================

/**
 * Créer un nouveau compte bancaire
 * @param {Object} accountData - Données du compte
 * @param {string} accountData.name - Nom du compte
 * @param {string} accountData.type - Type de compte
 * @param {string} accountData.bankName - Code banque
 * @param {string} accountData.currency - Devise
 * @param {string} accountData.accountNumber - Numéro de compte (optionnel)
 * @param {number} accountData.initialBalance - Solde initial
 * @param {string} accountData.description - Description (optionnel)
 * @returns {Promise}
 */
export const createAccount = (accountData) => {
  return api.post('/accounts', accountData);
};

/**
 * Récupérer tous les comptes de l'utilisateur
 * @param {Object} params - Paramètres de filtrage
 * @param {boolean} params.includeInactive - Inclure comptes inactifs
 * @param {boolean} params.includeArchived - Inclure comptes archivés
 * @param {string} params.type - Filtrer par type
 * @param {string} params.currency - Filtrer par devise
 * @param {string} params.bankName - Filtrer par banque
 * @returns {Promise}
 */
export const getAccounts = (params = {}) => {
  return api.get('/accounts', { params });
};

/**
 * Récupérer un compte spécifique
 * @param {string} accountId - ID du compte
 * @returns {Promise}
 */
export const getAccountById = (accountId) => {
  return api.get(`/accounts/${accountId}`);
};

/**
 * Mettre à jour un compte
 * @param {string} accountId - ID du compte
 * @param {Object} updateData - Données de mise à jour
 * @param {string} updateData.name - Nouveau nom
 * @param {string} updateData.description - Nouvelle description
 * @param {number} updateData.minimumBalance - Nouveau solde minimum
 * @param {number} updateData.creditLimit - Nouvelle limite de crédit
 * @param {boolean} updateData.isActive - Statut actif
 * @param {boolean} updateData.includeInTotal - Inclure dans le total
 * @returns {Promise}
 */
export const updateAccount = (accountId, updateData) => {
  return api.put(`/accounts/${accountId}`, updateData);
};

/**
 * Supprimer/désactiver un compte
 * @param {string} accountId - ID du compte
 * @param {boolean} permanent - Suppression définitive
 * @returns {Promise}
 */
export const deleteAccount = (accountId, permanent = false) => {
  return api.delete(`/accounts/${accountId}`, {
    params: { permanent }
  });
};

/**
 * Ajuster le solde d'un compte
 * @param {string} accountId - ID du compte
 * @param {Object} adjustmentData - Données d'ajustement
 * @param {number} adjustmentData.amount - Montant d'ajustement
 * @param {string} adjustmentData.description - Raison de l'ajustement
 * @returns {Promise}
 */
export const adjustBalance = (accountId, adjustmentData) => {
  return api.put(`/accounts/${accountId}/adjust-balance`, adjustmentData);
};

/**
 * Définir un compte comme compte par défaut
 * @param {string} accountId - ID du compte
 * @returns {Promise}
 */
export const setDefaultAccount = (accountId) => {
  return api.put(`/accounts/${accountId}/set-default`);
};

/**
 * Archiver un compte
 * @param {string} accountId - ID du compte
 * @param {Object} archiveData - Données d'archivage
 * @param {string} archiveData.reason - Raison de l'archivage
 * @returns {Promise}
 */
export const archiveAccount = (accountId, archiveData = {}) => {
  return api.put(`/accounts/${accountId}/archive`, archiveData);
};

/**
 * Désarchiver un compte
 * @param {string} accountId - ID du compte
 * @returns {Promise}
 */
export const unarchiveAccount = (accountId) => {
  return api.put(`/accounts/${accountId}/unarchive`);
};

/**
 * Récupérer les banques supportées
 * @returns {Promise}
 */
export const getSupportedBanks = () => {
  return api.get('/accounts/supported/banks');
};

/**
 * Récupérer les devises supportées
 * @returns {Promise}
 */
export const getSupportedCurrencies = () => {
  return api.get('/accounts/supported/currencies');
};

/**
 * Récupérer les types de comptes supportés
 * @returns {Promise}
 */
export const getSupportedAccountTypes = () => {
  return api.get('/accounts/supported/types');
};

/**
 * Valider un code banque
 * @param {string} bankCode - Code banque à valider
 * @returns {Promise}
 */
export const validateBank = (bankCode) => {
  return api.get(`/accounts/validate/bank/${bankCode}`);
};

// ===================================================================
// EXPORT PAR DÉFAUT (objet groupé)
// ===================================================================

const accountApi = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  adjustBalance,
  setDefaultAccount,
  archiveAccount,
  unarchiveAccount,
  getSupportedBanks,
  getSupportedCurrencies,
  getSupportedAccountTypes,
  validateBank
};

export default accountApi;