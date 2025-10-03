/**
 * =========================================================
 * FinApp Haiti - Accounts API Service
 * Services pour la gestion des comptes financiers
 * =========================================================
 */

import apiClient from './baseClient';

/**
 * Accounts API Service
 * Tous les endpoints pour les comptes
 */
export const accountsAPI = {
  /**
   * Get All Accounts
   * @returns {Promise} - { accounts, summary }
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/accounts/list');
      console.log('✅ Comptes récupérés:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get accounts:', error);
      throw error;
    }
  },

  /**
   * Get Account by ID
   * @param {string} id - Account ID
   * @returns {Promise} - { account }
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/accounts/${id}`);
      console.log('✅ Compte récupéré:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get account:', error);
      throw error;
    }
  },

  /**
   * Create Account
   * @param {Object} data - Account data
   * @returns {Promise} - { account }
   */
  create: async (data) => {
    try {
      const response = await apiClient.post('/accounts', {
        name: data.name,
        type: data.type, // 'cash' | 'bank' | 'mobile_money' | 'savings'
        currency: data.currency || 'HTG',
        initialBalance: data.initialBalance || 0,
        color: data.color || '#667eea',
        icon: data.icon || 'account_balance_wallet',
        description: data.description || '',
        isActive: data.isActive !== undefined ? data.isActive : true
      });
      
      console.log('✅ Compte créé:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur create account:', error);
      throw error;
    }
  },

  /**
   * Update Account
   * @param {string} id - Account ID
   * @param {Object} data - Account data to update
   * @returns {Promise} - { account }
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/accounts/${id}`, data);
      console.log('✅ Compte mis à jour:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur update account:', error);
      throw error;
    }
  },

  /**
   * Delete Account
   * @param {string} id - Account ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/accounts/${id}`);
      console.log('✅ Compte supprimé');
      return response;
    } catch (error) {
      console.error('❌ Erreur delete account:', error);
      throw error;
    }
  },

  /**
   * Get Account Summary
   * @returns {Promise} - { totalBalance, byType, byCurrency }
   */
  getSummary: async () => {
    try {
      const response = await apiClient.get('/accounts/summary');
      console.log('✅ Résumé comptes:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get summary:', error);
      throw error;
    }
  },

  /**
   * Get Account Transactions
   * @param {string} id - Account ID
   * @param {Object} filters - Filters (type, startDate, endDate)
   * @returns {Promise} - { transactions }
   */
  getTransactions: async (id, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/accounts/${id}/transactions?${params}`);
      console.log('✅ Transactions compte récupérées:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get account transactions:', error);
      throw error;
    }
  },

  /**
   * Toggle Account Active Status
   * @param {string} id - Account ID
   * @returns {Promise} - { account }
   */
  toggleActive: async (id) => {
    try {
      const response = await apiClient.put(`/accounts/${id}/toggle-active`);
      console.log('✅ Statut compte changé:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur toggle active:', error);
      throw error;
    }
  },

  /**
   * Adjust Account Balance (manual)
   * @param {string} id - Account ID
   * @param {Object} data - { amount, reason }
   * @returns {Promise} - { account }
   */
  adjustBalance: async (id, data) => {
    try {
      const response = await apiClient.post(`/accounts/${id}/adjust-balance`, {
        amount: data.amount,
        reason: data.reason || 'Ajustement manuel'
      });
      console.log('✅ Balance ajustée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur adjust balance:', error);
      throw error;
    }
  },
};

export default accountsAPI;