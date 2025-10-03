/**
 * =========================================================
 * FinApp Haiti - Accounts API Service
 * Service pour communication avec backend
 * ✅ CORRIGÉ - Endpoints, validation et conversion bankName
 * =========================================================
 */

import baseClient from './baseClient';

/**
 * ✅ FIX: Liste des banques valides (en minuscules)
 * Pour validation côté frontend
 */
const VALID_BANKS = [
  'brh', 'bnc', 'buh', 'sogebank', 'unibank', 
  'capital_bank', 'citibank', 'sofihdes',
  'moncash', 'natcash', 'loncash',
  'cash', 'other'
];

/**
 * ✅ FIX: Types de comptes valides
 */
const VALID_TYPES = ['checking', 'savings', 'cash', 'investment', 'mobile_money'];

/**
 * ✅ FIX: Devises valides
 */
const VALID_CURRENCIES = ['HTG', 'USD', 'EUR', 'CAD'];

export const accountsAPI = {
  /**
   * Get all accounts
   * ✅ CORRIGÉ: Endpoint GET /api/accounts (sans /list)
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.includeInactive) params.append('includeInactive', 'true');
      if (filters.includeArchived) params.append('includeArchived', 'true');
      if (filters.type) params.append('type', filters.type);
      if (filters.currency) params.append('currency', filters.currency);
      
      // ✅ FIX: Convertir bankName en minuscules pour le filtre
      if (filters.bankName) {
        params.append('bankName', filters.bankName.toLowerCase());
      }

      const queryString = params.toString();
      const url = queryString ? `/accounts?${queryString}` : '/accounts';
      
      console.log('📤 Fetching accounts from:', url);
      const response = await baseClient.get(url);
      
      console.log('✅ Accounts fetched:', {
        count: response.data?.data?.accounts?.length || 0,
        totals: response.data?.data?.totals
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ Erreur get accounts:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get account by ID
   */
  getById: async (accountId) => {
    try {
      console.log('📤 Fetching account:', accountId);
      const response = await baseClient.get(`/accounts/${accountId}`);
      
      console.log('✅ Account fetched:', response.data?.data?.account?.name);
      return response;
      
    } catch (error) {
      console.error('❌ Erreur get account by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Create new account
   * ✅ FIX PRINCIPAL: Conversion bankName en minuscules
   */
  create: async (accountData) => {
    try {
      // ✅ FIX: Convertir bankName en minuscules avant envoi
      let bankName = (accountData.bankName || 'cash').toLowerCase();
      
      // ✅ Validation: Vérifier que la banque est valide
      if (!VALID_BANKS.includes(bankName)) {
        console.warn(`⚠️ Banque '${bankName}' non reconnue, utilisation de 'cash'`);
        bankName = 'cash';
      }
      
      // ✅ Validation: Vérifier le type
      const type = accountData.type;
      if (!VALID_TYPES.includes(type)) {
        throw new Error(`Type de compte invalide: ${type}`);
      }
      
      // ✅ Validation: Vérifier la devise
      const currency = accountData.currency || 'HTG';
      if (!VALID_CURRENCIES.includes(currency)) {
        throw new Error(`Devise invalide: ${currency}`);
      }

      // ✅ Construction du payload validé
      const validatedData = {
        name: accountData.name.trim(),
        type: type,
        currency: currency,
        initialBalance: Number(accountData.initialBalance) || 0,
        bankName: bankName, // ✅ En minuscules
        
        // Optionnels
        accountNumber: accountData.accountNumber?.trim() || undefined,
        minimumBalance: Number(accountData.minimumBalance) || 0,
        creditLimit: Number(accountData.creditLimit) || 0,
        description: accountData.description?.trim() || undefined,
        tags: Array.isArray(accountData.tags) ? accountData.tags : [],
        isDefault: Boolean(accountData.isDefault),
        includeInTotal: accountData.includeInTotal !== undefined ? Boolean(accountData.includeInTotal) : true,
        allowNegativeBalance: Boolean(accountData.allowNegativeBalance),
        
        // Champs UI (optionnels)
        color: accountData.color || undefined,
        icon: accountData.icon || undefined,
        isActive: accountData.isActive !== undefined ? Boolean(accountData.isActive) : true,
      };

      // Nettoyer les undefined
      Object.keys(validatedData).forEach(key => {
        if (validatedData[key] === undefined) {
          delete validatedData[key];
        }
      });

      console.log('📤 Creating account with data:', validatedData);
      console.log('📤 API Request:', {
        method: 'POST',
        url: '/accounts',
        hasToken: !!baseClient.defaults.headers.common['Authorization']
      });
      
      const response = await baseClient.post('/accounts', validatedData);
      
      console.log('✅ Account created:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ Erreur create account:', error.response?.data?.message || error.message);
      
      // Extraire les erreurs de validation du backend
      if (error.response?.status === 400) {
        const backendErrors = error.response.data.errors || error.response.data.details || [];
        console.error('🚨 Erreurs validation backend:', backendErrors);
      }
      
      throw error;
    }
  },

  /**
   * Update account
   * ✅ FIX: Conversion bankName si présent
   */
  update: async (accountId, accountData) => {
    try {
      // ✅ Construction des données de mise à jour
      const updateData = {};
      
      if (accountData.name !== undefined) updateData.name = accountData.name.trim();
      if (accountData.description !== undefined) updateData.description = accountData.description?.trim();
      if (accountData.minimumBalance !== undefined) updateData.minimumBalance = Number(accountData.minimumBalance);
      if (accountData.creditLimit !== undefined) updateData.creditLimit = Number(accountData.creditLimit);
      if (accountData.isActive !== undefined) updateData.isActive = Boolean(accountData.isActive);
      if (accountData.includeInTotal !== undefined) updateData.includeInTotal = Boolean(accountData.includeInTotal);
      if (accountData.allowNegativeBalance !== undefined) updateData.allowNegativeBalance = Boolean(accountData.allowNegativeBalance);
      if (accountData.tags !== undefined) updateData.tags = accountData.tags;
      if (accountData.color !== undefined) updateData.color = accountData.color;
      if (accountData.icon !== undefined) updateData.icon = accountData.icon;
      if (accountData.notes !== undefined) updateData.notes = accountData.notes?.trim();
      
      // ✅ FIX: Convertir bankName en minuscules si présent
      if (accountData.bankName !== undefined) {
        updateData.bankName = accountData.bankName.toLowerCase();
        
        // Validation
        if (!VALID_BANKS.includes(updateData.bankName)) {
          throw new Error(`Banque invalide: ${accountData.bankName}`);
        }
      }

      console.log('📤 Updating account:', accountId, updateData);
      const response = await baseClient.put(`/accounts/${accountId}`, updateData);
      
      console.log('✅ Account updated:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ Erreur update account:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete account
   */
  delete: async (accountId) => {
    try {
      console.log('📤 Deleting account:', accountId);
      const response = await baseClient.delete(`/accounts/${accountId}`);
      
      console.log('✅ Account deleted');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur delete account:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get accounts summary
   */
  getSummary: async () => {
    try {
      console.log('📤 Fetching accounts summary');
      const response = await baseClient.get('/accounts/summary/all');
      
      console.log('✅ Summary fetched');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur get summary:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Set default account
   */
  setDefault: async (accountId) => {
    try {
      console.log('📤 Setting default account:', accountId);
      const response = await baseClient.put(`/accounts/${accountId}/set-default`);
      
      console.log('✅ Default account set');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur set default:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Archive account
   */
  archive: async (accountId, reason) => {
    try {
      console.log('📤 Archiving account:', accountId);
      const response = await baseClient.put(`/accounts/${accountId}/archive`, { reason });
      
      console.log('✅ Account archived');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur archive:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Unarchive account
   */
  unarchive: async (accountId) => {
    try {
      console.log('📤 Unarchiving account:', accountId);
      const response = await baseClient.put(`/accounts/${accountId}/unarchive`);
      
      console.log('✅ Account unarchived');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur unarchive:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Adjust balance
   */
  adjustBalance: async (accountId, adjustmentData) => {
    try {
      console.log('📤 Adjusting balance:', accountId);
      const response = await baseClient.put(`/accounts/${accountId}/adjust-balance`, adjustmentData);
      
      console.log('✅ Balance adjusted');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur adjust balance:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Transfer between accounts
   */
  transfer: async (fromAccountId, transferData) => {
    try {
      console.log('📤 Transferring:', fromAccountId);
      const response = await baseClient.post(`/accounts/${fromAccountId}/transfer`, transferData);
      
      console.log('✅ Transfer completed');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur transfer:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Validate bank code
   * ✅ FIX: Convertir en minuscules avant validation
   */
  validateBank: async (bankCode) => {
    try {
      const normalizedCode = bankCode.toLowerCase();
      console.log('📤 Validating bank:', normalizedCode);
      
      const response = await baseClient.get(`/accounts/validate/bank/${normalizedCode}`);
      
      console.log('✅ Bank validated');
      return response;
      
    } catch (error) {
      console.error('❌ Erreur validate bank:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Export default également pour compatibilité
export default accountsAPI;