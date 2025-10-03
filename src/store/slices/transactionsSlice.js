/**
 * =========================================================
 * FinApp Haiti - Transactions Slice
 * Gestion des transactions financières
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Initial State
 */
const initialState = {
  items: [], // Liste des transactions
  filters: {
    accountId: null,
    type: null, // 'income' | 'expense' | 'transfer'
    category: null,
    startDate: null,
    endDate: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  statistics: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  },
  loading: false,
  error: null,
};

// =============================================================================
// ASYNC THUNKS
// =============================================================================

/**
 * Fetch Transactions
 */
export const fetchTransactionsAsync = createAsyncThunk(
  'transactions/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { transactionsAPI } = await import('../../services/api/transactions.api');
      const response = await transactionsAPI.getAll(filters);
      
      if (response.success && response.data) {
        return {
          transactions: response.data.transactions,
          pagination: response.data.pagination,
          statistics: response.data.statistics,
        };
      }
      
      return rejectWithValue('Format de réponse invalide');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur chargement transactions'
      );
    }
  }
);

/**
 * Create Transaction
 */
export const createTransactionAsync = createAsyncThunk(
  'transactions/create',
  async (transactionData, { rejectWithValue }) => {
    try {
      const { transactionsAPI } = await import('../../services/api/transactions.api');
      const response = await transactionsAPI.create(transactionData);
      
      if (response.success && response.data) {
        return response.data.transaction;
      }
      
      return rejectWithValue('Erreur création transaction');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors de la création de la transaction'
      );
    }
  }
);

/**
 * Update Transaction
 */
export const updateTransactionAsync = createAsyncThunk(
  'transactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { transactionsAPI } = await import('../../services/api/transactions.api');
      const response = await transactionsAPI.update(id, data);
      
      if (response.success && response.data) {
        return response.data.transaction;
      }
      
      return rejectWithValue('Erreur mise à jour transaction');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors de la mise à jour de la transaction'
      );
    }
  }
);

/**
 * Delete Transaction
 */
export const deleteTransactionAsync = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { transactionsAPI } = await import('../../services/api/transactions.api');
      await transactionsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors de la suppression de la transaction'
      );
    }
  }
);

// =============================================================================
// TRANSACTIONS SLICE
// =============================================================================

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    /**
     * Set Filters
     */
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    /**
     * Clear Filters
     */
    clearFilters: (state) => {
      state.filters = {
        accountId: null,
        type: null,
        category: null,
        startDate: null,
        endDate: null,
      };
    },

    /**
     * Set Page
     */
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    /**
     * Clear Error
     */
    clearError: (state) => {
      state.error = null;
    },
  },

  // =============================================================================
  // EXTRA REDUCERS
  // =============================================================================
  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // FETCH TRANSACTIONS
    // -------------------------------------------------------------------------
    builder
      .addCase(fetchTransactionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
        state.items = action.payload.transactions;
        state.pagination = action.payload.pagination || state.pagination;
        state.statistics = action.payload.statistics || state.statistics;
        state.loading = false;

        console.log('✅ Transactions chargées:', action.payload.transactions.length);
      })
      .addCase(fetchTransactionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur chargement transactions';
        
        console.error('❌ Erreur fetch transactions:', action.payload);
      });

    // -------------------------------------------------------------------------
    // CREATE TRANSACTION
    // -------------------------------------------------------------------------
    builder
      .addCase(createTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransactionAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Ajouter au début
        state.loading = false;

        console.log('✅ Transaction créée:', action.payload.description);
      })
      .addCase(createTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur création transaction';
        
        console.error('❌ Erreur création transaction:', action.payload);
      });

    // -------------------------------------------------------------------------
    // UPDATE TRANSACTION
    // -------------------------------------------------------------------------
    builder
      .addCase(updateTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;

        console.log('✅ Transaction mise à jour');
      })
      .addCase(updateTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur mise à jour transaction';
        
        console.error('❌ Erreur update transaction:', action.payload);
      });

    // -------------------------------------------------------------------------
    // DELETE TRANSACTION
    // -------------------------------------------------------------------------
    builder
      .addCase(deleteTransactionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
        state.loading = false;

        console.log('✅ Transaction supprimée');
      })
      .addCase(deleteTransactionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur suppression transaction';
        
        console.error('❌ Erreur delete transaction:', action.payload);
      });
  },
});

// =============================================================================
// EXPORT ACTIONS
// =============================================================================
export const {
  setFilters,
  clearFilters,
  setPage,
  clearError,
} = transactionsSlice.actions;

// =============================================================================
// SELECTORS
// =============================================================================
export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionFilters = (state) => state.transactions.filters;
export const selectTransactionPagination = (state) => state.transactions.pagination;
export const selectTransactionStatistics = (state) => state.transactions.statistics;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export const selectTransactionsError = (state) => state.transactions.error;

// Selector pour transactions par compte
export const selectTransactionsByAccount = (state, accountId) =>
  state.transactions.items.filter(t => t.accountId === accountId);

// Selector pour transactions par type
export const selectTransactionsByType = (state, type) =>
  state.transactions.items.filter(t => t.type === type);

// =============================================================================
// EXPORT REDUCER
// =============================================================================
export default transactionsSlice.reducer;