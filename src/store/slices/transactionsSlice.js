import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import transactionsApi from '../../api/endpoints/transactions';

// ===================================================================
// THUNKS ASYNCHRONES
// ===================================================================

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.createTransaction(transactionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création de la transaction'
      );
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransactions(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des transactions'
      );
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchById',
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransactionById(transactionId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de la transaction'
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ transactionId, updateData }, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.updateTransaction(transactionId, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour de la transaction'
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async ({ transactionId, options = {} }, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.deleteTransaction(transactionId, options);
      return { transactionId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la suppression de la transaction'
      );
    }
  }
);

export const fetchCategoryAnalytics = createAsyncThunk(
  'transactions/fetchCategoryAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getCategoryAnalytics(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des analytics'
      );
    }
  }
);

export const fetchMonthlyStats = createAsyncThunk(
  'transactions/fetchMonthlyStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getMonthlyStats(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

export const searchTransactions = createAsyncThunk(
  'transactions/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.searchTransactions(searchParams);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la recherche'
      );
    }
  }
);

export const duplicateTransaction = createAsyncThunk(
  'transactions/duplicate',
  async ({ transactionId, duplicateData }, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.duplicateTransaction(transactionId, duplicateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la duplication'
      );
    }
  }
);

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const initialState = {
  // Données principales
  transactions: [],
  currentTransaction: null,
  
  // Analytics et statistiques
  categoryAnalytics: [],
  monthlyStats: [],
  searchResults: null,
  
  // Filtres et pagination
  filters: {
    page: 1,
    limit: 50,
    account: null,
    category: null,
    type: null,
    startDate: null,
    endDate: null,
    search: null,
    sortBy: 'date',
    sortOrder: 'desc'
  },
  
  // Pagination info
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 50,
    hasNext: false,
    hasPrev: false
  },
  
  // Statistiques globales
  stats: {
    totalIncome: 0,
    totalExpense: 0,
    totalTransactions: 0,
    avgTransactionAmount: 0
  },
  
  // États de chargement
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  analyticsLoading: false,
  searchLoading: false,
  
  // Messages
  error: null,
  successMessage: null,
  
  // Cache et optimisation
  lastFetched: null,
  cacheDuration: 5 * 60 * 1000 // 5 minutes
};

// ===================================================================
// SLICE
// ===================================================================

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Réinitialiser l'état
    clearTransactions: (state) => {
      state.transactions = [];
      state.currentTransaction = null;
      state.pagination = initialState.pagination;
      state.stats = initialState.stats;
    },
    
    // Réinitialiser les erreurs et messages
    clearError: (state) => {
      state.error = null;
    },
    
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    
    // Mettre à jour les filtres
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset à la page 1 quand les filtres changent
    },
    
    // Réinitialiser les filtres
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Mettre à jour la pagination
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      state.filters.page = action.payload;
    },
    
    // Mettre à jour une transaction dans la liste
    updateTransactionInList: (state, action) => {
      const index = state.transactions.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    
    // Supprimer une transaction de la liste
    removeTransactionFromList: (state, action) => {
      state.transactions = state.transactions.filter(t => t._id !== action.payload);
    },
    
    // Effacer les résultats de recherche
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
    
    // Marquer comme expiré pour forcer le re-fetch
    invalidateCache: (state) => {
      state.lastFetched = null;
    }
  },
  
  extraReducers: (builder) => {
    // CREATE TRANSACTION
    builder
      .addCase(createTransaction.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.creating = false;
        state.transactions.unshift(action.payload.transaction);
        state.successMessage = 'Transaction créée avec succès !';
        state.lastFetched = null; // Invalider le cache
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // FETCH TRANSACTIONS
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH TRANSACTION BY ID
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload.transaction;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE TRANSACTION
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.updating = false;
        
        // Mettre à jour dans la liste
        const index = state.transactions.findIndex(t => t._id === action.payload.transaction._id);
        if (index !== -1) {
          state.transactions[index] = action.payload.transaction;
        }
        
        // Mettre à jour la transaction courante
        if (state.currentTransaction && state.currentTransaction._id === action.payload.transaction._id) {
          state.currentTransaction = action.payload.transaction;
        }
        
        state.successMessage = 'Transaction mise à jour avec succès !';
        state.lastFetched = null; // Invalider le cache
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // DELETE TRANSACTION
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleting = false;
        
        // Supprimer de la liste
        state.transactions = state.transactions.filter(t => t._id !== action.payload.transactionId);
        
        // Effacer la transaction courante si c'est celle qui est supprimée
        if (state.currentTransaction && state.currentTransaction._id === action.payload.transactionId) {
          state.currentTransaction = null;
        }
        
        state.successMessage = 'Transaction supprimée avec succès !';
        state.lastFetched = null; // Invalider le cache
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });

    // CATEGORY ANALYTICS
    builder
      .addCase(fetchCategoryAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.categoryAnalytics = action.payload.analytics;
      })
      .addCase(fetchCategoryAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      });

    // MONTHLY STATS
    builder
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.monthlyStats = action.payload.monthlyStats;
      });

    // SEARCH TRANSACTIONS
    builder
      .addCase(searchTransactions.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchTransactions.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchTransactions.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });

    // DUPLICATE TRANSACTION
    builder
      .addCase(duplicateTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload.duplicatedTransaction);
        state.successMessage = 'Transaction dupliquée avec succès !';
        state.lastFetched = null; // Invalider le cache
      });
  }
});

export const {
  clearTransactions,
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  setPage,
  updateTransactionInList,
  removeTransactionFromList,
  clearSearchResults,
  invalidateCache
} = transactionsSlice.actions;

// ===================================================================
// SELECTEURS
// ===================================================================

export const selectTransactions = (state) => state.transactions.transactions;
export const selectCurrentTransaction = (state) => state.transactions.currentTransaction;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export const selectTransactionsCreating = (state) => state.transactions.creating;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectTransactionsSuccess = (state) => state.transactions.successMessage;
export const selectTransactionsFilters = (state) => state.transactions.filters;
export const selectTransactionsPagination = (state) => state.transactions.pagination;
export const selectTransactionsStats = (state) => state.transactions.stats;
export const selectCategoryAnalytics = (state) => state.transactions.categoryAnalytics;
export const selectMonthlyStats = (state) => state.transactions.monthlyStats;
export const selectSearchResults = (state) => state.transactions.searchResults;
export const selectSearchLoading = (state) => state.transactions.searchLoading;

// Sélecteur pour vérifier si le cache est valide
export const selectShouldFetchTransactions = (state) => {
  const { lastFetched, cacheDuration } = state.transactions;
  return !lastFetched || (Date.now() - lastFetched) > cacheDuration;
};

// Sélecteur pour les transactions groupées par date
export const selectTransactionsGroupedByDate = (state) => {
  const transactions = state.transactions.transactions;
  
  const grouped = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('fr-HT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(transaction);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([date, transactions]) => ({
    date,
    transactions,
    totalAmount: transactions.reduce((sum, t) => {
      const amount = t.type === 'expense' ? -t.amount : t.amount;
      return sum + amount;
    }, 0)
  }));
};

// Sélecteur pour les transactions récentes (7 derniers jours)
export const selectRecentTransactions = (state) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return state.transactions.transactions.filter(transaction => 
    new Date(transaction.date) >= weekAgo
  ).slice(0, 10); // Limiter à 10 transactions
};

export default transactionsSlice.reducer;