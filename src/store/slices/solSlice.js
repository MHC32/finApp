// src/store/slices/solSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import solsApi from '../../api/endpoints/sols';

// ===================================================================
// THUNKS ASYNCHRONES
// ===================================================================

/**
 * Créer un nouveau sol
 */
export const createSol = createAsyncThunk(
  'sols/create',
  async (solData, { rejectWithValue }) => {
    try {
      const response = await solsApi.createSol(solData);
      return response.data.data.sol;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création du sol'
      );
    }
  }
);

/**
 * Récupérer tous les sols de l'utilisateur
 */
export const fetchSols = createAsyncThunk(
  'sols/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await solsApi.getSols(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des sols'
      );
    }
  }
);

/**
 * Récupérer un sol spécifique
 */
export const fetchSolById = createAsyncThunk(
  'sols/fetchById',
  async ({ solId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await solsApi.getSolById(solId, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération du sol'
      );
    }
  }
);

/**
 * Rejoindre un sol
 */
export const joinSol = createAsyncThunk(
  'sols/join',
  async (joinData, { rejectWithValue }) => {
    try {
      const response = await solsApi.joinSol(joinData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'adhésion au sol'
      );
    }
  }
);

/**
 * Quitter un sol
 */
export const leaveSol = createAsyncThunk(
  'sols/leave',
  async ({ solId, reason }, { rejectWithValue }) => {
    try {
      const response = await solsApi.leaveSol(solId, { reason });
      return { solId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la sortie du sol'
      );
    }
  }
);

/**
 * Effectuer un paiement
 */
export const makePayment = createAsyncThunk(
  'sols/makePayment',
  async ({ solId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await solsApi.makePayment(solId, paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors du paiement'
      );
    }
  }
);

/**
 * Récupérer les analytics personnels
 */
export const fetchPersonalAnalytics = createAsyncThunk(
  'sols/fetchPersonalAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await solsApi.getPersonalAnalytics(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des analytics'
      );
    }
  }
);

/**
 * Découvrir des sols
 */
export const discoverSols = createAsyncThunk(
  'sols/discover',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await solsApi.discoverSols(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la découverte de sols'
      );
    }
  }
);

/**
 * Récupérer les données supportées
 */
export const fetchSupportedData = createAsyncThunk(
  'sols/fetchSupported',
  async (_, { rejectWithValue }) => {
    try {
      const [typesResponse, frequenciesResponse] = await Promise.all([
        solsApi.getSupportedSolTypes(),
        solsApi.getSupportedFrequencies()
      ]);

      return {
        solTypes: typesResponse.data.data.types || [],
        frequencies: frequenciesResponse.data.data.frequencies || []
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
  sols: [],
  currentSol: null,
  discoveredSols: [],
  personalAnalytics: null,
  supportedData: {
    solTypes: [],
    frequencies: []
  },
  
  // États de chargement
  loading: false,
  creating: false,
  joining: false,
  leaving: false,
  paying: false,
  fetchingAnalytics: false,
  discovering: false,
  
  // État spécifique
  solsLoaded: false,
  supportedDataLoaded: false,
  analyticsLoaded: false,
  
  // Erreurs
  error: null,
  
  // Messages
  successMessage: null
};

// ===================================================================
// SLICE
// ===================================================================

const solSlice = createSlice({
  name: 'sols',
  initialState,
  reducers: {
    // Réinitialiser l'état
    resetSols: (state) => {
      state.sols = [];
      state.currentSol = null;
      state.solsLoaded = false;
    },
    
    // Nettoyer les erreurs
    clearError: (state) => {
      state.error = null;
    },
    
    // Nettoyer les messages de succès
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    
    // Définir le sol courant
    setCurrentSol: (state, action) => {
      state.currentSol = action.payload;
    },
    
    // Mettre à jour un sol localement
    updateSolLocally: (state, action) => {
      const index = state.sols.findIndex(sol => sol._id === action.payload._id);
      if (index !== -1) {
        state.sols[index] = { ...state.sols[index], ...action.payload };
      }
      if (state.currentSol && state.currentSol._id === action.payload._id) {
        state.currentSol = { ...state.currentSol, ...action.payload };
      }
    },
    
    // Ajouter un paiement localement
    addPaymentLocally: (state, action) => {
      const { solId, roundIndex, payment } = action.payload;
      const sol = state.sols.find(s => s._id === solId);
      
      if (sol && sol.rounds && sol.rounds[roundIndex]) {
        if (!sol.rounds[roundIndex].payments) {
          sol.rounds[roundIndex].payments = [];
        }
        sol.rounds[roundIndex].payments.push(payment);
      }
      
      if (state.currentSol && state.currentSol._id === solId) {
        if (!state.currentSol.rounds[roundIndex].payments) {
          state.currentSol.rounds[roundIndex].payments = [];
        }
        state.currentSol.rounds[roundIndex].payments.push(payment);
      }
    },
    
    // Nettoyer les sols découverts
    clearDiscoveredSols: (state) => {
      state.discoveredSols = [];
    },
    
    // Nettoyer les analytics
    clearAnalytics: (state) => {
      state.personalAnalytics = null;
      state.analyticsLoaded = false;
    }
  },
  
  extraReducers: (builder) => {
    // ===================================================================
    // CREATE SOL
    // ===================================================================
    builder
      .addCase(createSol.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createSol.fulfilled, (state, action) => {
        state.creating = false;
        state.sols.push(action.payload);
        state.successMessage = 'Sol créé avec succès';
      })
      .addCase(createSol.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // ===================================================================
    // FETCH SOLS
    // ===================================================================
    builder
      .addCase(fetchSols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSols.fulfilled, (state, action) => {
        state.loading = false;
        state.sols = action.payload.sols;
        state.solsLoaded = true;
      })
      .addCase(fetchSols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===================================================================
    // FETCH SOL BY ID
    // ===================================================================
    builder
      .addCase(fetchSolById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSol = action.payload.sol;
      })
      .addCase(fetchSolById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===================================================================
    // JOIN SOL
    // ===================================================================
    builder
      .addCase(joinSol.pending, (state) => {
        state.joining = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(joinSol.fulfilled, (state, action) => {
        state.joining = false;
        state.sols.push(action.payload.sol);
        state.successMessage = 'Vous avez rejoint le sol avec succès';
      })
      .addCase(joinSol.rejected, (state, action) => {
        state.joining = false;
        state.error = action.payload;
      });

    // ===================================================================
    // LEAVE SOL
    // ===================================================================
    builder
      .addCase(leaveSol.pending, (state) => {
        state.leaving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(leaveSol.fulfilled, (state, action) => {
        state.leaving = false;
        
        // Retirer de la liste
        state.sols = state.sols.filter(sol => sol._id !== action.payload.solId);
        
        // Nettoyer le sol courant si c'est le même
        if (state.currentSol && state.currentSol._id === action.payload.solId) {
          state.currentSol = null;
        }
        
        state.successMessage = 'Vous avez quitté le sol avec succès';
      })
      .addCase(leaveSol.rejected, (state, action) => {
        state.leaving = false;
        state.error = action.payload;
      });

    // ===================================================================
    // MAKE PAYMENT
    // ===================================================================
    builder
      .addCase(makePayment.pending, (state) => {
        state.paying = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.paying = false;
        
        // Mettre à jour le sol dans la liste
        const updatedSol = action.payload.solProgress;
        const index = state.sols.findIndex(sol => sol._id === updatedSol._id);
        if (index !== -1) {
          state.sols[index] = { ...state.sols[index], ...updatedSol };
        }
        
        // Mettre à jour le sol courant si c'est le même
        if (state.currentSol && state.currentSol._id === updatedSol._id) {
          state.currentSol = { ...state.currentSol, ...updatedSol };
        }
        
        state.successMessage = 'Paiement effectué avec succès';
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.paying = false;
        state.error = action.payload;
      });

    // ===================================================================
    // FETCH PERSONAL ANALYTICS
    // ===================================================================
    builder
      .addCase(fetchPersonalAnalytics.pending, (state) => {
        state.fetchingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchPersonalAnalytics.fulfilled, (state, action) => {
        state.fetchingAnalytics = false;
        state.personalAnalytics = action.payload.analytics;
        state.analyticsLoaded = true;
      })
      .addCase(fetchPersonalAnalytics.rejected, (state, action) => {
        state.fetchingAnalytics = false;
        state.error = action.payload;
      });

    // ===================================================================
    // DISCOVER SOLS
    // ===================================================================
    builder
      .addCase(discoverSols.pending, (state) => {
        state.discovering = true;
        state.error = null;
      })
      .addCase(discoverSols.fulfilled, (state, action) => {
        state.discovering = false;
        state.discoveredSols = action.payload.sols;
      })
      .addCase(discoverSols.rejected, (state, action) => {
        state.discovering = false;
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
  resetSols,
  clearError,
  clearSuccess,
  setCurrentSol,
  updateSolLocally,
  addPaymentLocally,
  clearDiscoveredSols,
  clearAnalytics
} = solSlice.actions;

export default solSlice.reducer;