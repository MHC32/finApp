/**
 * =========================================================
 * FinApp Haiti - Accounts Slice
 * Gestion des comptes financiers
 * =========================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Initial State
 */
const initialState = {
  items: [], // Liste des comptes
  selectedAccount: null, // Compte sélectionné pour détails
  totalBalance: 0, // Balance totale tous comptes
  loading: false,
  error: null,
};

// =============================================================================
// ASYNC THUNKS (Actions Asynchrones)
// =============================================================================

/**
 * Fetch All Accounts
 */
export const fetchAccountsAsync = createAsyncThunk(
  'accounts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Import dynamique pour éviter circular dependency
      const { accountsAPI } = await import('../../services/api/accounts.api');
      const response = await accountsAPI.getAll();
      
      if (response.success && response.data) {
        return response.data.accounts;
      }
      
      return rejectWithValue('Format de réponse invalide');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors du chargement des comptes'
      );
    }
  }
);

/**
 * Create Account
 */
export const createAccountAsync = createAsyncThunk(
  'accounts/create',
  async (accountData, { rejectWithValue }) => {
    try {
      const { accountsAPI } = await import('../../services/api/accounts.api');
      const response = await accountsAPI.create(accountData);
      
      if (response.success && response.data) {
        return response.data.account;
      }
      
      return rejectWithValue('Erreur création compte');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors de la création du compte'
      );
    }
  }
);

/**
 * Update Account
 */
export const updateAccountAsync = createAsyncThunk(
  'accounts/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { accountsAPI } = await import('../../services/api/accounts.api');
      const response = await accountsAPI.update(id, data);
      
      if (response.success && response.data) {
        return response.data.account;
      }
      
      return rejectWithValue('Erreur mise à jour compte');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors de la mise à jour du compte'
      );
    }
  }
);

/**
 * Delete Account
 */
export const deleteAccountAsync = createAsyncThunk(
  'accounts/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { accountsAPI } = await import('../../services/api/accounts.api');
      await accountsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Erreur lors de la suppression du compte'
      );
    }
  }
);

// =============================================================================
// ACCOUNTS SLICE
// =============================================================================

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
     * Calculate Total Balance
     */
    calculateTotalBalance: (state) => {
      state.totalBalance = state.items.reduce((total, account) => {
        return total + (account.balance || 0);
      }, 0);
    },
  },

  // =============================================================================
  // EXTRA REDUCERS (pour gérer les async thunks)
  // =============================================================================
  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // FETCH ACCOUNTS
    // -------------------------------------------------------------------------
    builder
      .addCase(fetchAccountsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        
        // Calculer balance totale
        state.totalBalance = action.payload.reduce((total, account) => {
          return total + (account.balance || 0);
        }, 0);

        console.log('✅ Comptes chargés:', action.payload.length);
      })
      .addCase(fetchAccountsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur chargement comptes';
        
        console.error('❌ Erreur fetch comptes:', action.payload);
      });

    // -------------------------------------------------------------------------
    // CREATE ACCOUNT
    // -------------------------------------------------------------------------
    builder
      .addCase(createAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
        
        // Recalculer balance totale
        state.totalBalance = state.items.reduce((total, account) => {
          return total + (account.balance || 0);
        }, 0);

        console.log('✅ Compte créé:', action.payload.name);
      })
      .addCase(createAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur création compte';
        
        console.error('❌ Erreur création compte:', action.payload);
      });

    // -------------------------------------------------------------------------
    // UPDATE ACCOUNT
    // -------------------------------------------------------------------------
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
        
        // Recalculer balance totale
        state.totalBalance = state.items.reduce((total, account) => {
          return total + (account.balance || 0);
        }, 0);

        console.log('✅ Compte mis à jour:', action.payload.name);
      })
      .addCase(updateAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur mise à jour compte';
        
        console.error('❌ Erreur update compte:', action.payload);
      });

    // -------------------------------------------------------------------------
    // DELETE ACCOUNT
    // -------------------------------------------------------------------------
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
        
        // Recalculer balance totale
        state.totalBalance = state.items.reduce((total, account) => {
          return total + (account.balance || 0);
        }, 0);

        console.log('✅ Compte supprimé');
      })
      .addCase(deleteAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur suppression compte';
        
        console.error('❌ Erreur delete compte:', action.payload);
      });
  },
});

// =============================================================================
// EXPORT ACTIONS
// =============================================================================
export const {
  selectAccount,
  clearSelectedAccount,
  clearError,
  calculateTotalBalance,
} = accountsSlice.actions;

// =============================================================================
// SELECTORS
// =============================================================================
export const selectAllAccounts = (state) => state.accounts.items;
export const selectSelectedAccount = (state) => state.accounts.selectedAccount;
export const selectTotalBalance = (state) => state.accounts.totalBalance;
export const selectAccountsLoading = (state) => state.accounts.loading;
export const selectAccountsError = (state) => state.accounts.error;

// Selector pour compte par ID
export const selectAccountById = (state, accountId) => 
  state.accounts.items.find(acc => acc._id === accountId);

// Selector pour comptes par type
export const selectAccountsByType = (state, type) =>
  state.accounts.items.filter(acc => acc.type === type);

// =============================================================================
// EXPORT REDUCER
// =============================================================================
export default accountsSlice.reducer;