// src/store/slices/accountSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountApi from '../../api/endpoints/account';

// ===================================================================
// THUNKS ASYNCHRONES
// ===================================================================

/**
 * Créer un nouveau compte
 */
export const createAccount = createAsyncThunk(
  'accounts/create',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await accountApi.createAccount(accountData);
      return response.data.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création du compte'
      );
    }
  }
);

/**
 * Récupérer tous les comptes
 */
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accountApi.getAccounts(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des comptes'
      );
    }
  }
);

/**
 * Récupérer un compte spécifique
 */
export const fetchAccountById = createAsyncThunk(
  'accounts/fetchById',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountApi.getAccountById(accountId);
      return response.data.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération du compte'
      );
    }
  }
);

/**
 * Mettre à jour un compte
 */
export const updateAccount = createAsyncThunk(
  'accounts/update',
  async ({ accountId, updateData }, { rejectWithValue }) => {
    try {
      const response = await accountApi.updateAccount(accountId, updateData);
      return response.data.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour du compte'
      );
    }
  }
);

/**
 * Supprimer un compte
 */
export const deleteAccount = createAsyncThunk(
  'accounts/delete',
  async ({ accountId, permanent = false }, { rejectWithValue }) => {
    try {
      await accountApi.deleteAccount(accountId, permanent);
      return accountId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la suppression du compte'
      );
    }
  }
);

/**
 * Ajuster le solde d'un compte
 */
export const adjustAccountBalance = createAsyncThunk(
  'accounts/adjustBalance',
  async ({ accountId, adjustmentData }, { rejectWithValue }) => {
    try {
      const response = await accountApi.adjustBalance(accountId, adjustmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'ajustement du solde'
      );
    }
  }
);

/**
 * Définir comme compte par défaut
 */
export const setDefaultAccount = createAsyncThunk(
  'accounts/setDefault',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountApi.setDefaultAccount(accountId);
      return response.data.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la définition du compte par défaut'
      );
    }
  }
);

/**
 * Récupérer les données supportées
 */
export const fetchSupportedData = createAsyncThunk(
  'accounts/fetchSupported',
  async (_, { rejectWithValue }) => {
    try {
      const [banksResponse, currenciesResponse, typesResponse] = await Promise.all([
        accountApi.getSupportedBanks(),
        accountApi.getSupportedCurrencies(),
        accountApi.getSupportedAccountTypes()
      ]);

      return {
        banks: banksResponse.data.data.banks,
        currencies: currenciesResponse.data.data.currencies,
        accountTypes: typesResponse.data.data.accountTypes
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des données supportées'
      );
    }
  }
);

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const initialState = {
  // Données
  accounts: [],
  currentAccount: null,
  supportedData: {
    banks: [],
    currencies: [],
    accountTypes: []
  },
  
  // États de chargement
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  adjustingBalance: false,
  
  // État spécifique
  accountsLoaded: false,
  supportedDataLoaded: false,
  
  // Erreurs
  error: null,
  
  // Messages
  successMessage: null
};

// ===================================================================
// SLICE
// ===================================================================

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    // Réinitialiser l'état
    resetAccounts: (state) => {
      state.accounts = [];
      state.currentAccount = null;
      state.accountsLoaded = false;
    },
    
    // Nettoyer les erreurs
    clearError: (state) => {
      state.error = null;
    },
    
    // Nettoyer les messages de succès
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    
    // Définir le compte courant
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    
    // Mettre à jour un compte localement
    updateAccountLocally: (state, action) => {
      const index = state.accounts.findIndex(acc => acc._id === action.payload._id);
      if (index !== -1) {
        state.accounts[index] = { ...state.accounts[index], ...action.payload };
      }
      if (state.currentAccount && state.currentAccount._id === action.payload._id) {
        state.currentAccount = { ...state.currentAccount, ...action.payload };
      }
    },
    
    // Mettre à jour le solde localement
    updateBalanceLocally: (state, action) => {
      const { accountId, newBalance } = action.payload;
      const index = state.accounts.findIndex(acc => acc._id === accountId);
      
      if (index !== -1) {
        state.accounts[index].currentBalance = newBalance;
        state.accounts[index].availableBalance = newBalance;
      }
      
      if (state.currentAccount && state.currentAccount._id === accountId) {
        state.currentAccount.currentBalance = newBalance;
        state.currentAccount.availableBalance = newBalance;
      }
    }
  },
  
  extraReducers: (builder) => {
    // ===================================================================
    // CREATE ACCOUNT
    // ===================================================================
    builder
      .addCase(createAccount.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.creating = false;
        state.accounts.push(action.payload);
        state.successMessage = 'Compte créé avec succès';
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // ===================================================================
    // FETCH ACCOUNTS
    // ===================================================================
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.accounts;
        state.accountsLoaded = true;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===================================================================
    // FETCH ACCOUNT BY ID
    // ===================================================================
    builder
      .addCase(fetchAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===================================================================
    // UPDATE ACCOUNT
    // ===================================================================
    builder
      .addCase(updateAccount.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.updating = false;
        
        // Mettre à jour dans la liste
        const index = state.accounts.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        
        // Mettre à jour le compte courant si c'est le même
        if (state.currentAccount && state.currentAccount._id === action.payload._id) {
          state.currentAccount = action.payload;
        }
        
        state.successMessage = 'Compte mis à jour avec succès';
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // ===================================================================
    // DELETE ACCOUNT
    // ===================================================================
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.deleting = false;
        
        // Retirer de la liste
        state.accounts = state.accounts.filter(acc => acc._id !== action.payload);
        
        // Nettoyer le compte courant si c'est le même
        if (state.currentAccount && state.currentAccount._id === action.payload) {
          state.currentAccount = null;
        }
        
        state.successMessage = 'Compte supprimé avec succès';
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });

    // ===================================================================
    // ADJUST BALANCE
    // ===================================================================
    builder
      .addCase(adjustAccountBalance.pending, (state) => {
        state.adjustingBalance = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(adjustAccountBalance.fulfilled, (state, action) => {
        state.adjustingBalance = false;
        
        const { account, adjustment } = action.payload;
        
        // Mettre à jour dans la liste
        const index = state.accounts.findIndex(acc => acc._id === account._id);
        if (index !== -1) {
          state.accounts[index] = account;
        }
        
        // Mettre à jour le compte courant si c'est le même
        if (state.currentAccount && state.currentAccount._id === account._id) {
          state.currentAccount = account;
        }
        
        state.successMessage = `Solde ajusté de ${adjustment.amount} ${account.currency}`;
      })
      .addCase(adjustAccountBalance.rejected, (state, action) => {
        state.adjustingBalance = false;
        state.error = action.payload;
      });

    // ===================================================================
    // SET DEFAULT ACCOUNT
    // ===================================================================
    builder
      .addCase(setDefaultAccount.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(setDefaultAccount.fulfilled, (state, action) => {
        state.updating = false;
        
        // Retirer le statut default de tous les comptes
        state.accounts.forEach(acc => {
          acc.isDefault = false;
        });
        
        // Appliquer le statut default au compte concerné
        const index = state.accounts.findIndex(acc => acc._id === action.payload._id);
        if (index !== -1) {
          state.accounts[index].isDefault = true;
        }
        
        state.successMessage = 'Compte par défaut mis à jour';
      })
      .addCase(setDefaultAccount.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // ===================================================================
    // FETCH SUPPORTED DATA
    // ===================================================================
    builder
      .addCase(fetchSupportedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportedData.fulfilled, (state, action) => {
        state.loading = false;
        state.supportedData = action.payload;
        state.supportedDataLoaded = true;
      })
      .addCase(fetchSupportedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ===================================================================
// EXPORTS
// ===================================================================

export const {
  resetAccounts,
  clearError,
  clearSuccess,
  setCurrentAccount,
  updateAccountLocally,
  updateBalanceLocally
} = accountSlice.actions;

export default accountSlice.reducer;