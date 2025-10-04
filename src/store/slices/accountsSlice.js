/**
 * =========================================================
 * FinApp Haiti - Accounts Slice (REFACTORÉ)
 * Gestion Redux des comptes financiers
 * ✅ Utilise accounts.service.js (Backend Node.js)
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountsService from '../../services/api/accounts.service';

// ===================================================================
// INITIAL STATE
// ===================================================================

const initialState = {
  // Données
  items: [],                    // Liste des comptes
  selectedAccount: null,        // Compte sélectionné pour détails
  summary: null,                // Résumé (totaux par devise, stats)
  
  // Totaux calculés (legacy - à retirer si summary suffit)
  totalBalance: {
    HTG: 0,
    USD: 0,
    EUR: 0,
    CAD: 0,
  },
  
  // UI State
  loading: false,
  error: null,
  
  // Filtres actifs (optionnel)
  filters: {
    includeInactive: false,
    includeArchived: false,
    type: null,
    currency: null,
    bankName: null,
  },
};

// ===================================================================
// ASYNC THUNKS
// ===================================================================

/**
 * Fetch All Accounts
 * GET /api/accounts
 */
export const fetchAccountsAsync = createAsyncThunk(
  'accounts/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await accountsService.getAccounts(filters);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Format de réponse invalide');
      }
      
      return response.data; // { accounts, totals, totalAccounts, activeAccounts }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur chargement comptes'
      );
    }
  }
);

/**
 * Fetch Account By ID
 * GET /api/accounts/:accountId
 */
export const fetchAccountByIdAsync = createAsyncThunk(
  'accounts/fetchById',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountsService.getAccountById(accountId);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Compte introuvable');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur chargement compte'
      );
    }
  }
);

/**
 * Create Account
 * POST /api/accounts
 */
export const createAccountAsync = createAsyncThunk(
  'accounts/create',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await accountsService.createAccount(accountData);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur création compte');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur création compte'
      );
    }
  }
);

/**
 * Update Account
 * PUT /api/accounts/:accountId
 */
export const updateAccountAsync = createAsyncThunk(
  'accounts/update',
  async ({ accountId, updateData }, { rejectWithValue }) => {
    try {
      const response = await accountsService.updateAccount(accountId, updateData);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur mise à jour compte');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur mise à jour compte'
      );
    }
  }
);

/**
 * Delete Account
 * DELETE /api/accounts/:accountId
 */
export const deleteAccountAsync = createAsyncThunk(
  'accounts/delete',
  async ({ accountId, permanent = false }, { rejectWithValue }) => {
    try {
      const response = await accountsService.deleteAccount(accountId, permanent);
      
      if (!response.success) {
        return rejectWithValue('Erreur suppression compte');
      }
      
      return accountId; // Retourner l'ID pour le retirer du state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur suppression compte'
      );
    }
  }
);

/**
 * Adjust Balance
 * PUT /api/accounts/:accountId/adjust-balance
 */
export const adjustBalanceAsync = createAsyncThunk(
  'accounts/adjustBalance',
  async ({ accountId, adjustmentData }, { rejectWithValue }) => {
    try {
      const response = await accountsService.adjustBalance(accountId, adjustmentData);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur ajustement solde');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur ajustement solde'
      );
    }
  }
);

/**
 * Transfer Between Accounts
 * POST /api/accounts/:fromAccountId/transfer
 */
export const transferBetweenAccountsAsync = createAsyncThunk(
  'accounts/transfer',
  async ({ fromAccountId, transferData }, { rejectWithValue }) => {
    try {
      const response = await accountsService.transferBetweenAccounts(fromAccountId, transferData);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur transfert');
      }
      
      // Retourner les deux comptes mis à jour
      return {
        fromAccount: response.data.fromAccount,
        toAccount: response.data.toAccount,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur transfert'
      );
    }
  }
);

/**
 * Set Default Account
 * PUT /api/accounts/:accountId/set-default
 */
export const setDefaultAccountAsync = createAsyncThunk(
  'accounts/setDefault',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountsService.setDefault(accountId);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur définition compte par défaut');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur définition compte par défaut'
      );
    }
  }
);

/**
 * Archive Account
 * PUT /api/accounts/:accountId/archive
 */
export const archiveAccountAsync = createAsyncThunk(
  'accounts/archive',
  async ({ accountId, reason }, { rejectWithValue }) => {
    try {
      const response = await accountsService.archiveAccount(accountId, reason);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur archivage compte');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur archivage compte'
      );
    }
  }
);

/**
 * Unarchive Account
 * PUT /api/accounts/:accountId/unarchive
 */
export const unarchiveAccountAsync = createAsyncThunk(
  'accounts/unarchive',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountsService.unarchiveAccount(accountId);
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur désarchivage compte');
      }
      
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur désarchivage compte'
      );
    }
  }
);

/**
 * Fetch Accounts Summary
 * GET /api/accounts/summary/all
 */
export const fetchAccountsSummaryAsync = createAsyncThunk(
  'accounts/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountsService.getSummary();
      
      if (!response.success || !response.data) {
        return rejectWithValue('Erreur chargement résumé');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Erreur chargement résumé'
      );
    }
  }
);

// ===================================================================
// SLICE
// ===================================================================

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  
  reducers: {
    /**
     * Select Account
     */
    selectAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },

    /**
     * Clear Selected Account
     */
    clearSelectedAccount: (state) => {
      state.selectedAccount = null;
    },

    /**
     * Clear Error
     */
    clearError: (state) => {
      state.error = null;
    },

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
      state.filters = initialState.filters;
    },

    /**
     * Calculate Total Balance (Legacy - peut être retiré si on utilise summary)
     */
    calculateTotalBalance: (state) => {
      const totals = { HTG: 0, USD: 0, EUR: 0, CAD: 0 };
      
      state.items.forEach((account) => {
        if (account.includeInTotal && account.isActive) {
          const currency = account.currency || 'HTG';
          totals[currency] = (totals[currency] || 0) + (account.currentBalance || 0);
        }
      });
      
      state.totalBalance = totals;
    },
  },

  // ===================================================================
  // EXTRA REDUCERS (Async Thunks)
  // ===================================================================
  
  extraReducers: (builder) => {
    
    // -----------------------------------------------------------------
    // FETCH ALL ACCOUNTS
    // -----------------------------------------------------------------
    builder
      .addCase(fetchAccountsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsAsync.fulfilled, (state, action) => {
        state.items = action.payload.accounts || [];
        state.loading = false;
        
        // Stocker les totaux retournés par le backend
        if (action.payload.totals) {
          state.totalBalance = action.payload.totals;
        } else {
          // Fallback: calculer localement si backend ne retourne pas
          accountsSlice.caseReducers.calculateTotalBalance(state);
        }
      })
      .addCase(fetchAccountsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // FETCH ACCOUNT BY ID
    // -----------------------------------------------------------------
    builder
      .addCase(fetchAccountByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountByIdAsync.fulfilled, (state, action) => {
        state.selectedAccount = action.payload;
        state.loading = false;
        
        // Si le compte n'est pas dans items, l'ajouter
        const existingIndex = state.items.findIndex(acc => acc._id === action.payload._id);
        if (existingIndex === -1) {
          state.items.push(action.payload);
        } else {
          state.items[existingIndex] = action.payload;
        }
      })
      .addCase(fetchAccountByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // CREATE ACCOUNT
    // -----------------------------------------------------------------
    builder
      .addCase(createAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
        
        // Recalculer totaux
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(createAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // UPDATE ACCOUNT
    // -----------------------------------------------------------------
    builder
      .addCase(updateAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        // Update selected account si c'est celui-là
        if (state.selectedAccount?._id === action.payload._id) {
          state.selectedAccount = action.payload;
        }
        
        state.loading = false;
        
        // Recalculer totaux
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(updateAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // DELETE ACCOUNT
    // -----------------------------------------------------------------
    builder
      .addCase(deleteAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccountAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(acc => acc._id !== action.payload);
        
        // Clear selected si c'était celui-là
        if (state.selectedAccount?._id === action.payload) {
          state.selectedAccount = null;
        }
        
        state.loading = false;
        
        // Recalculer totaux
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(deleteAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // ADJUST BALANCE
    // -----------------------------------------------------------------
    builder
      .addCase(adjustBalanceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adjustBalanceAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        // Update selected account si c'est celui-là
        if (state.selectedAccount?._id === action.payload._id) {
          state.selectedAccount = action.payload;
        }
        
        state.loading = false;
        
        // Recalculer totaux
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(adjustBalanceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // TRANSFER BETWEEN ACCOUNTS
    // -----------------------------------------------------------------
    builder
      .addCase(transferBetweenAccountsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferBetweenAccountsAsync.fulfilled, (state, action) => {
        const { fromAccount, toAccount } = action.payload;
        
        // Update from account
        const fromIndex = state.items.findIndex(acc => acc._id === fromAccount._id);
        if (fromIndex !== -1) {
          state.items[fromIndex] = fromAccount;
        }
        
        // Update to account
        const toIndex = state.items.findIndex(acc => acc._id === toAccount._id);
        if (toIndex !== -1) {
          state.items[toIndex] = toAccount;
        }
        
        state.loading = false;
        
        // Recalculer totaux (normalement pas de changement total, mais pour sûreté)
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(transferBetweenAccountsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // SET DEFAULT ACCOUNT
    // -----------------------------------------------------------------
    builder
      .addCase(setDefaultAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAccountAsync.fulfilled, (state, action) => {
        // Désactiver isDefault sur tous les autres comptes
        state.items.forEach((account) => {
          account.isDefault = account._id === action.payload._id;
        });
        
        // Update le compte qui est maintenant default
        const index = state.items.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        state.loading = false;
      })
      .addCase(setDefaultAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // ARCHIVE ACCOUNT
    // -----------------------------------------------------------------
    builder
      .addCase(archiveAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveAccountAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        state.loading = false;
        
        // Recalculer totaux (compte archivé n'est plus inclus)
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(archiveAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // UNARCHIVE ACCOUNT
    // -----------------------------------------------------------------
    builder
      .addCase(unarchiveAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unarchiveAccountAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        state.loading = false;
        
        // Recalculer totaux
        accountsSlice.caseReducers.calculateTotalBalance(state);
      })
      .addCase(unarchiveAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------------------------------------------
    // FETCH SUMMARY
    // -----------------------------------------------------------------
    builder
      .addCase(fetchAccountsSummaryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsSummaryAsync.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccountsSummaryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ===================================================================
// EXPORT ACTIONS
// ===================================================================

export const {
  selectAccount,
  clearSelectedAccount,
  clearError,
  setFilters,
  clearFilters,
  calculateTotalBalance,
} = accountsSlice.actions;

// ===================================================================
// SELECTORS
// ===================================================================

export const selectAllAccounts = (state) => state.accounts.items;
export const selectSelectedAccount = (state) => state.accounts.selectedAccount;
export const selectTotalBalance = (state) => state.accounts.totalBalance;
export const selectAccountsSummary = (state) => state.accounts.summary;
export const selectAccountsLoading = (state) => state.accounts.loading;
export const selectAccountsError = (state) => state.accounts.error;
export const selectAccountsFilters = (state) => state.accounts.filters;

// Selector pour compte par ID
export const selectAccountById = (state, accountId) => 
  state.accounts.items.find(acc => acc._id === accountId);

// Selector pour comptes par type
export const selectAccountsByType = (state, type) =>
  state.accounts.items.filter(acc => acc.type === type);

// Selector pour comptes par devise
export const selectAccountsByCurrency = (state, currency) =>
  state.accounts.items.filter(acc => acc.currency === currency);

// Selector pour comptes actifs uniquement
export const selectActiveAccounts = (state) =>
  state.accounts.items.filter(acc => acc.isActive === true);

// Selector pour compte par défaut
export const selectDefaultAccount = (state) =>
  state.accounts.items.find(acc => acc.isDefault === true);

// ===================================================================
// EXPORT REDUCER
// ===================================================================

export default accountsSlice.reducer;