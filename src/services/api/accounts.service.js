/**
 * =========================================================
 * FinApp Haiti - Accounts Service
 * Service pour communication avec backend Node.js
 * ✅ ARCHITECTURE FINALE - Synchronisé avec backend
 * =========================================================
 */

import apiClient from './baseClient';
import { BANKS, ACCOUNT_TYPES, CURRENCIES } from '../../utils/constants/constants';

// ===================================================================
// UTILITAIRES VALIDATION
// ===================================================================

/**
 * Valider et normaliser bankName
 * Le backend attend TOUJOURS des codes en minuscules
 */
const normalizeBankName = (bankName) => {
  if (!bankName) return undefined;
  const normalized = bankName.toLowerCase();
  
  // Vérifier que la banque existe dans nos constants
  const validBanks = Object.values(BANKS).map(b => b.toLowerCase());
  if (!validBanks.includes(normalized)) {
    throw new Error(`Code banque invalide: ${bankName}. Codes valides: ${validBanks.join(', ')}`);
  }
  
  return normalized;
};

/**
 * Valider le type de compte
 */
const validateAccountType = (type) => {
  const validTypes = Object.values(ACCOUNT_TYPES);
  if (!validTypes.includes(type)) {
    throw new Error(`Type de compte invalide: ${type}. Types valides: ${validTypes.join(', ')}`);
  }
  return type;
};

/**
 * Valider la devise
 */
const validateCurrency = (currency) => {
  const validCurrencies = Object.values(CURRENCIES);
  if (!validCurrencies.includes(currency)) {
    throw new Error(`Devise invalide: ${currency}. Devises valides: ${validCurrencies.join(', ')}`);
  }
  return currency;
};

// ===================================================================
// SERVICE ACCOUNTS
// ===================================================================

export const accountsService = {
  
  // =================================================================
  // CRUD COMPTES
  // =================================================================

  /**
   * Récupérer tous les comptes
   * GET /api/accounts
   * 
   * @param {Object} filters - Filtres optionnels
   * @param {boolean} filters.includeInactive - Inclure comptes inactifs
   * @param {boolean} filters.includeArchived - Inclure comptes archivés
   * @param {string} filters.type - Filtrer par type
   * @param {string} filters.currency - Filtrer par devise
   * @param {string} filters.bankName - Filtrer par banque
   * @returns {Promise} Liste comptes + totaux
   */
  getAccounts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.includeInactive) params.append('includeInactive', 'true');
      if (filters.includeArchived) params.append('includeArchived', 'true');
      if (filters.type) params.append('type', validateAccountType(filters.type));
      if (filters.currency) params.append('currency', validateCurrency(filters.currency));
      
      // Normaliser bankName en minuscules
      if (filters.bankName) {
        params.append('bankName', normalizeBankName(filters.bankName));
      }

      const queryString = params.toString();
      const url = queryString ? `/accounts?${queryString}` : '/accounts';
      
      const response = await apiClient.get(url);
      return response; // { success: true, data: { accounts, totals, ... } }
      
    } catch (error) {
      console.error('❌ Erreur getAccounts:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupérer un compte par ID
   * GET /api/accounts/:accountId
   * 
   * @param {string} accountId - ID du compte
   * @returns {Promise} Détails compte + historique
   */
  getAccountById: async (accountId) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      const response = await apiClient.get(`/accounts/${accountId}`);
      return response; // { success: true, data: { account } }
      
    } catch (error) {
      console.error('❌ Erreur getAccountById:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Créer un nouveau compte
   * POST /api/accounts
   * 
   * @param {Object} accountData - Données du compte
   * @param {string} accountData.name - Nom du compte (required)
   * @param {string} accountData.type - Type de compte (required)
   * @param {string} accountData.bankName - Code banque (optional)
   * @param {string} accountData.currency - Devise (default: HTG)
   * @param {number} accountData.initialBalance - Solde initial (default: 0)
   * @param {number} accountData.minimumBalance - Solde minimum (default: 0)
   * @param {number} accountData.creditLimit - Limite crédit (default: 0)
   * @param {string} accountData.description - Description (optional)
   * @param {string[]} accountData.tags - Tags (optional)
   * @param {boolean} accountData.isDefault - Compte par défaut (optional)
   * @param {boolean} accountData.allowNegativeBalance - Autoriser solde négatif (optional)
   * @param {boolean} accountData.includeInTotal - Inclure dans total (default: true)
   * @param {string} accountData.color - Couleur UI (optional)
   * @param {string} accountData.icon - Icône UI (optional)
   * @returns {Promise} Compte créé
   */
  createAccount: async (accountData) => {
    try {
      // Validation locale
      if (!accountData.name || accountData.name.trim().length < 2) {
        throw new Error('Le nom du compte doit contenir au moins 2 caractères');
      }

      if (!accountData.type) {
        throw new Error('Le type de compte est requis');
      }

      // Construction données validées
      const validatedData = {
        name: accountData.name.trim(),
        type: validateAccountType(accountData.type),
        currency: accountData.currency ? validateCurrency(accountData.currency) : CURRENCIES.HTG,
        
        // Champs optionnels avec valeurs par défaut
        initialBalance: accountData.initialBalance !== undefined ? Number(accountData.initialBalance) : 0,
        minimumBalance: accountData.minimumBalance !== undefined ? Number(accountData.minimumBalance) : 0,
        creditLimit: accountData.creditLimit !== undefined ? Number(accountData.creditLimit) : 0,
        
        description: accountData.description?.trim() || undefined,
        accountNumber: accountData.accountNumber?.trim() || undefined,
        tags: accountData.tags || [],
        
        isDefault: Boolean(accountData.isDefault),
        includeInTotal: accountData.includeInTotal !== undefined ? Boolean(accountData.includeInTotal) : true,
        allowNegativeBalance: Boolean(accountData.allowNegativeBalance),
        
        // Champs UI (optionnels)
        color: accountData.color || undefined,
        icon: accountData.icon || undefined,
      };

      // bankName uniquement si fourni
      if (accountData.bankName) {
        validatedData.bankName = normalizeBankName(accountData.bankName);
      }

      // Nettoyer les undefined
      Object.keys(validatedData).forEach(key => {
        if (validatedData[key] === undefined) {
          delete validatedData[key];
        }
      });
      
      const response = await apiClient.post('/accounts', validatedData);
      return response; // { success: true, data: { account } }
      
    } catch (error) {
      console.error('❌ Erreur createAccount:', error.response?.data || error.message);
      
      // Extraire erreurs de validation backend
      if (error.response?.status === 400) {
        const backendErrors = error.response.data.details || [];
        if (backendErrors.length > 0) {
          throw new Error(backendErrors.map(e => e.message).join(', '));
        }
      }
      
      throw error;
    }
  },

  /**
   * Mettre à jour un compte
   * PUT /api/accounts/:accountId
   * 
   * @param {string} accountId - ID du compte
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise} Compte mis à jour
   */
  updateAccount: async (accountId, updateData) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      // Construction des données validées
      const validatedData = {};
      
      if (updateData.name !== undefined) {
        if (updateData.name.trim().length < 2) {
          throw new Error('Le nom doit contenir au moins 2 caractères');
        }
        validatedData.name = updateData.name.trim();
      }
      
      if (updateData.type !== undefined) {
        validatedData.type = validateAccountType(updateData.type);
      }
      
      if (updateData.description !== undefined) {
        validatedData.description = updateData.description?.trim();
      }
      
      if (updateData.minimumBalance !== undefined) {
        validatedData.minimumBalance = Number(updateData.minimumBalance);
      }
      
      if (updateData.creditLimit !== undefined) {
        validatedData.creditLimit = Number(updateData.creditLimit);
      }
      
      if (updateData.isActive !== undefined) {
        validatedData.isActive = Boolean(updateData.isActive);
      }
      
      if (updateData.includeInTotal !== undefined) {
        validatedData.includeInTotal = Boolean(updateData.includeInTotal);
      }
      
      if (updateData.allowNegativeBalance !== undefined) {
        validatedData.allowNegativeBalance = Boolean(updateData.allowNegativeBalance);
      }
      
      if (updateData.tags !== undefined) {
        validatedData.tags = updateData.tags;
      }
      
      if (updateData.color !== undefined) {
        validatedData.color = updateData.color;
      }
      
      if (updateData.icon !== undefined) {
        validatedData.icon = updateData.icon;
      }
      
      if (updateData.notes !== undefined) {
        validatedData.notes = updateData.notes?.trim();
      }
      
      // bankName si présent
      if (updateData.bankName !== undefined) {
        validatedData.bankName = normalizeBankName(updateData.bankName);
      }

      const response = await apiClient.put(`/accounts/${accountId}`, validatedData);
      return response; // { success: true, data: { account } }
      
    } catch (error) {
      console.error('❌ Erreur updateAccount:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Supprimer un compte
   * DELETE /api/accounts/:accountId
   * 
   * @param {string} accountId - ID du compte
   * @param {boolean} permanent - Suppression permanente (default: false = soft delete)
   * @returns {Promise} Confirmation suppression
   */
  deleteAccount: async (accountId, permanent = false) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      const url = permanent 
        ? `/accounts/${accountId}?permanent=true`
        : `/accounts/${accountId}`;

      const response = await apiClient.delete(url);
      return response; // { success: true, message: '...' }
      
    } catch (error) {
      console.error('❌ Erreur deleteAccount:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // GESTION SOLDE
  // =================================================================

  /**
   * Ajuster manuellement le solde d'un compte
   * PUT /api/accounts/:accountId/adjust-balance
   * 
   * @param {string} accountId - ID du compte
   * @param {Object} adjustmentData
   * @param {number} adjustmentData.amount - Montant ajustement (+ ou -)
   * @param {string} adjustmentData.description - Description ajustement
   * @returns {Promise} Compte avec nouveau solde
   */
  adjustBalance: async (accountId, adjustmentData) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      if (!adjustmentData.amount || adjustmentData.amount === 0) {
        throw new Error('Montant d\'ajustement requis (différent de 0)');
      }

      const validatedData = {
        amount: Number(adjustmentData.amount),
        description: adjustmentData.description?.trim() || 'Ajustement manuel'
      };

      const response = await apiClient.put(
        `/accounts/${accountId}/adjust-balance`, 
        validatedData
      );
      return response; // { success: true, data: { account, adjustment } }
      
    } catch (error) {
      console.error('❌ Erreur adjustBalance:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Transférer entre deux comptes
   * POST /api/accounts/:fromAccountId/transfer
   * 
   * @param {string} fromAccountId - ID compte source
   * @param {Object} transferData
   * @param {string} transferData.toAccountId - ID compte destination
   * @param {number} transferData.amount - Montant à transférer
   * @param {string} transferData.description - Description transfert
   * @returns {Promise} Comptes mis à jour
   */
  transferBetweenAccounts: async (fromAccountId, transferData) => {
    try {
      if (!fromAccountId) {
        throw new Error('ID compte source requis');
      }

      if (!transferData.toAccountId) {
        throw new Error('ID compte destination requis');
      }

      if (!transferData.amount || transferData.amount <= 0) {
        throw new Error('Montant du transfert doit être supérieur à 0');
      }

      if (fromAccountId === transferData.toAccountId) {
        throw new Error('Les comptes source et destination doivent être différents');
      }

      const validatedData = {
        toAccountId: transferData.toAccountId,
        amount: Number(transferData.amount),
        description: transferData.description?.trim() || 'Transfert entre comptes'
      };

      const response = await apiClient.post(
        `/accounts/${fromAccountId}/transfer`, 
        validatedData
      );
      return response; // { success: true, data: { fromAccount, toAccount, transfer } }
      
    } catch (error) {
      console.error('❌ Erreur transferBetweenAccounts:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // GESTION COMPTES
  // =================================================================

  /**
   * Définir un compte comme compte par défaut
   * PUT /api/accounts/:accountId/set-default
   * 
   * @param {string} accountId - ID du compte
   * @returns {Promise} Compte défini comme défaut
   */
  setDefault: async (accountId) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      const response = await apiClient.put(`/accounts/${accountId}/set-default`);
      return response; // { success: true, data: { account } }
      
    } catch (error) {
      console.error('❌ Erreur setDefault:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Archiver un compte
   * PUT /api/accounts/:accountId/archive
   * 
   * @param {string} accountId - ID du compte
   * @param {string} reason - Raison de l'archivage (optional)
   * @returns {Promise} Compte archivé
   */
  archiveAccount: async (accountId, reason) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      const data = reason ? { reason: reason.trim() } : {};
      const response = await apiClient.put(`/accounts/${accountId}/archive`, data);
      return response; // { success: true, data: { account } }
      
    } catch (error) {
      console.error('❌ Erreur archiveAccount:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Désarchiver un compte
   * PUT /api/accounts/:accountId/unarchive
   * 
   * @param {string} accountId - ID du compte
   * @returns {Promise} Compte désarchivé
   */
  unarchiveAccount: async (accountId) => {
    try {
      if (!accountId) {
        throw new Error('ID compte requis');
      }

      const response = await apiClient.put(`/accounts/${accountId}/unarchive`);
      return response; // { success: true, data: { account } }
      
    } catch (error) {
      console.error('❌ Erreur unarchiveAccount:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // UTILITAIRES
  // =================================================================

  /**
   * Obtenir le résumé de tous les comptes
   * GET /api/accounts/summary/all
   * 
   * @returns {Promise} Résumé avec totaux par devise, stats, etc.
   */
  getSummary: async () => {
    try {
      const response = await apiClient.get('/accounts/summary/all');
      return response; // { success: true, data: { summary, totals, stats } }
      
    } catch (error) {
      console.error('❌ Erreur getSummary:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Valider un code banque haïtienne
   * GET /api/accounts/validate/bank/:bankCode
   * 
   * @param {string} bankCode - Code de la banque
   * @returns {Promise} Validation + infos banque
   */
  validateBankCode: async (bankCode) => {
    try {
      if (!bankCode) {
        throw new Error('Code banque requis');
      }

      // Normaliser en minuscules pour backend
      const normalizedCode = bankCode.toLowerCase();
      
      const response = await apiClient.get(`/accounts/validate/bank/${normalizedCode}`);
      return response; // { success: true, data: { valid, bankInfo } }
      
    } catch (error) {
      console.error('❌ Erreur validateBankCode:', error.response?.data || error.message);
      throw error;
    }
  },

  // =================================================================
  // ADMIN (Optionnel)
  // =================================================================

  /**
   * Obtenir les comptes d'un utilisateur (admin uniquement)
   * GET /api/accounts/admin/users/:userId/accounts
   * 
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise} Liste comptes utilisateur
   */
  getUserAccountsAdmin: async (userId) => {
    try {
      if (!userId) {
        throw new Error('ID utilisateur requis');
      }

      const response = await apiClient.get(`/accounts/admin/users/${userId}/accounts`);
      return response; // { success: true, data: { accounts, summary } }
      
    } catch (error) {
      console.error('❌ Erreur getUserAccountsAdmin:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Export default pour compatibilité
export default accountsService;