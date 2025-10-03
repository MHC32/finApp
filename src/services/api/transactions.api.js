/**
 * =========================================================
 * FinApp Haiti - Transactions API Service
 * Services pour la gestion des transactions
 * =========================================================
 */

import apiClient from './baseClient';

/**
 * Transactions API Service
 * Tous les endpoints pour les transactions
 */
export const transactionsAPI = {
  /**
   * Get All Transactions
   * @param {Object} filters - Filters (accountId, type, category, startDate, endDate, page, limit)
   * @returns {Promise} - { transactions, pagination, statistics }
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Ajouter les filtres
      if (filters.accountId) params.append('accountId', filters.accountId);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/transactions/list?${params}`);
      console.log('✅ Transactions récupérées:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get transactions:', error);
      throw error;
    }
  },

  /**
   * Get Transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise} - { transaction }
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/transactions/${id}`);
      console.log('✅ Transaction récupérée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get transaction:', error);
      throw error;
    }
  },

  /**
   * Create Transaction
   * @param {Object} data - Transaction data
   * @returns {Promise} - { transaction }
   */
  create: async (data) => {
    try {
      const response = await apiClient.post('/transactions', {
        accountId: data.accountId,
        type: data.type, // 'income' | 'expense' | 'transfer'
        category: data.category,
        amount: data.amount,
        currency: data.currency || 'HTG',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        
        // Pour les transferts
        toAccountId: data.toAccountId || null,
        
        // Optionnel
        tags: data.tags || [],
        notes: data.notes || '',
        receiptUrl: data.receiptUrl || null,
      });
      
      console.log('✅ Transaction créée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur create transaction:', error);
      throw error;
    }
  },

  /**
   * Update Transaction
   * @param {string} id - Transaction ID
   * @param {Object} data - Transaction data to update
   * @returns {Promise} - { transaction }
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/transactions/${id}`, data);
      console.log('✅ Transaction mise à jour:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur update transaction:', error);
      throw error;
    }
  },

  /**
   * Delete Transaction
   * @param {string} id - Transaction ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/transactions/${id}`);
      console.log('✅ Transaction supprimée');
      return response;
    } catch (error) {
      console.error('❌ Erreur delete transaction:', error);
      throw error;
    }
  },

  /**
   * Get Transaction Statistics
   * @param {Object} filters - Filters (accountId, startDate, endDate)
   * @returns {Promise} - { totalIncome, totalExpense, balance, byCategory }
   */
  getStatistics: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.accountId) params.append('accountId', filters.accountId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/transactions/stats?${params}`);
      console.log('✅ Statistiques récupérées:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get statistics:', error);
      throw error;
    }
  },

  /**
   * Get Transactions by Category
   * @param {Object} filters - Filters (startDate, endDate)
   * @returns {Promise} - { byCategory }
   */
  getByCategory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/transactions/by-category?${params}`);
      console.log('✅ Transactions par catégorie:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get by category:', error);
      throw error;
    }
  },

  /**
   * Get Recent Transactions
   * @param {number} limit - Number of transactions (default 10)
   * @returns {Promise} - { transactions }
   */
  getRecent: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/transactions/recent?limit=${limit}`);
      console.log('✅ Transactions récentes:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur get recent:', error);
      throw error;
    }
  },

  /**
   * Search Transactions
   * @param {string} query - Search query
   * @returns {Promise} - { transactions }
   */
  search: async (query) => {
    try {
      const response = await apiClient.get(`/transactions/search?q=${encodeURIComponent(query)}`);
      console.log('✅ Recherche transactions:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur search:', error);
      throw error;
    }
  },

  /**
   * Export Transactions (CSV)
   * @param {Object} filters - Filters
   * @returns {Promise} - CSV data
   */
  export: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.accountId) params.append('accountId', filters.accountId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/transactions/export?${params}`, {
        responseType: 'blob' // Pour fichier CSV
      });
      
      console.log('✅ Export transactions');
      return response;
    } catch (error) {
      console.error('❌ Erreur export:', error);
      throw error;
    }
  },
};

export default transactionsAPI;