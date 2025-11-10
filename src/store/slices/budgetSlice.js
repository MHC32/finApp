// src/store/slices/budgetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetApi from '../../api/endpoints/budgetApi';

// ===================================================================
// THUNKS ASYNCHRONES
// ===================================================================

/**
 * Créer un nouveau budget
 */
export const createBudget = createAsyncThunk(
  'budgets/create',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await budgetApi.createBudget(budgetData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création du budget'
      );
    }
  }
);

/**
 * Créer budget depuis template
 */
export const createBudgetFromTemplate = createAsyncThunk(
  'budgets/createFromTemplate',
  async ({ templateName, customData = {} }, { rejectWithValue }) => {
    try {
      const response = await budgetApi.createBudgetFromTemplate({
        templateName,
        customData
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création depuis template'
      );
    }
  }
);

/**
 * Récupérer les budgets de l'utilisateur
 */
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getBudgets(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des budgets'
      );
    }
  }
);

/**
 * Récupérer un budget spécifique
 */
export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchById',
  async (budgetId, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getBudgetById(budgetId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération du budget'
      );
    }
  }
);

/**
 * Mettre à jour un budget
 */
export const updateBudget = createAsyncThunk(
  'budgets/update',
  async ({ budgetId, updateData }, { rejectWithValue }) => {
    try {
      const response = await budgetApi.updateBudget(budgetId, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour du budget'
      );
    }
  }
);

/**
 * Supprimer un budget
 */
export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async (budgetId, { rejectWithValue }) => {
    try {
      const response = await budgetApi.deleteBudget(budgetId);
      return { budgetId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la suppression du budget'
      );
    }
  }
);

/**
 * Ajuster budget d'une catégorie
 */
export const adjustCategoryBudget = createAsyncThunk(
  'budgets/adjustCategory',
  async ({ budgetId, category, newAmount, reason = '' }, { rejectWithValue }) => {
    try {
      const response = await budgetApi.adjustCategoryBudget(budgetId, {
        category,
        newAmount,
        reason
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'ajustement du budget'
      );
    }
  }
);

/**
 * Créer snapshot mensuel
 */
export const createBudgetSnapshot = createAsyncThunk(
  'budgets/createSnapshot',
  async (budgetId, { rejectWithValue }) => {
    try {
      const response = await budgetApi.createBudgetSnapshot(budgetId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création du snapshot'
      );
    }
  }
);

/**
 * Archiver/désarchiver budget
 */
export const toggleArchiveBudget = createAsyncThunk(
  'budgets/toggleArchive',
  async ({ budgetId, archive = true }, { rejectWithValue }) => {
    try {
      const response = await budgetApi.toggleArchiveBudget(budgetId, { archive });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'archivage'
      );
    }
  }
);

/**
 * Récupérer analytics de progression
 */
export const fetchBudgetProgress = createAsyncThunk(
  'budgets/fetchProgress',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getBudgetProgress(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de la progression'
      );
    }
  }
);

/**
 * Récupérer tendances
 */
export const fetchBudgetTrends = createAsyncThunk(
  'budgets/fetchTrends',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getBudgetTrends(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des tendances'
      );
    }
  }
);

/**
 * Récupérer alertes budgets
 */
export const fetchBudgetAlerts = createAsyncThunk(
  'budgets/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getBudgetAlerts();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des alertes'
      );
    }
  }
);

/**
 * Récupérer templates
 */
export const fetchBudgetTemplates = createAsyncThunk(
  'budgets/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getBudgetTemplates();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des templates'
      );
    }
  }
);

/**
 * Récupérer statistiques utilisateur
 */
export const fetchUserBudgetStats = createAsyncThunk(
  'budgets/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetApi.getUserBudgetStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const initialState = {
  // Données principales
  budgets: [],
  currentBudget: null,
  
  // Analytics et statistiques
  budgetProgress: null,
  budgetTrends: null,
  budgetAlerts: null,
  budgetTemplates: [],
  userStats: null,
  
  // Filtres et pagination
  filters: {
    page: 1,
    limit: 10,
    status: 'active',
    period: null,
    sort: '-startDate',
    includeArchived: false
  },
  
  // Pagination info
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false
  },
  
  // États de chargement
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  analyticsLoading: false,
  templatesLoading: false,
  
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

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    // Réinitialiser l'état
    clearBudgets: (state) => {
      state.budgets = [];
      state.currentBudget = null;
      state.pagination = initialState.pagination;
      state.userStats = null;
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
    
    // Mettre à jour un budget dans la liste
    updateBudgetInList: (state, action) => {
      const index = state.budgets.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    
    // Supprimer un budget de la liste
    removeBudgetFromList: (state, action) => {
      state.budgets = state.budgets.filter(b => b._id !== action.payload);
    },
    
    // Effacer les analytics
    clearAnalytics: (state) => {
      state.budgetProgress = null;
      state.budgetTrends = null;
      state.budgetAlerts = null;
    },
    
    // Marquer comme expiré pour forcer le re-fetch
    invalidateCache: (state) => {
      state.lastFetched = null;
    }
  },
  
  extraReducers: (builder) => {
    // CREATE BUDGET
    builder
      .addCase(createBudget.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.creating = false;
        state.budgets.unshift(action.payload.budget);
        state.successMessage = 'Budget créé avec succès !';
        state.lastFetched = null; // Invalider le cache
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // CREATE BUDGET FROM TEMPLATE
    builder
      .addCase(createBudgetFromTemplate.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createBudgetFromTemplate.fulfilled, (state, action) => {
        state.creating = false;
        state.budgets.unshift(action.payload.budget);
        state.successMessage = `Budget créé depuis template "${action.payload.budget.templateUsed}" !`;
        state.lastFetched = null;
      })
      .addCase(createBudgetFromTemplate.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // FETCH BUDGETS
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload.budgets;
        state.pagination = action.payload.pagination;
        state.userStats = action.payload.stats;
        state.lastFetched = Date.now();
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH BUDGET BY ID
    builder
      .addCase(fetchBudgetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBudget = action.payload.budget;
      })
      .addCase(fetchBudgetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE BUDGET
    builder
      .addCase(updateBudget.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.updating = false;
        
        // Mettre à jour dans la liste
        const index = state.budgets.findIndex(b => b._id === action.payload.budget._id);
        if (index !== -1) {
          state.budgets[index] = action.payload.budget;
        }
        
        // Mettre à jour le budget courant
        if (state.currentBudget && state.currentBudget._id === action.payload.budget._id) {
          state.currentBudget = action.payload.budget;
        }
        
        state.successMessage = 'Budget mis à jour avec succès !';
        state.lastFetched = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // DELETE BUDGET
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.deleting = false;
        
        // Supprimer de la liste
        state.budgets = state.budgets.filter(b => b._id !== action.payload.budgetId);
        
        // Effacer le budget courant si c'est celui qui est supprimé
        if (state.currentBudget && state.currentBudget._id === action.payload.budgetId) {
          state.currentBudget = null;
        }
        
        state.successMessage = action.payload.action === 'archived' 
          ? 'Budget archivé avec succès !' 
          : 'Budget supprimé avec succès !';
        state.lastFetched = null;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });

    // ADJUST CATEGORY BUDGET
    builder
      .addCase(adjustCategoryBudget.fulfilled, (state, action) => {
        // Mettre à jour dans la liste
        const index = state.budgets.findIndex(b => b._id === action.payload.budget._id);
        if (index !== -1) {
          state.budgets[index] = action.payload.budget;
        }
        
        // Mettre à jour le budget courant
        if (state.currentBudget && state.currentBudget._id === action.payload.budget._id) {
          state.currentBudget = action.payload.budget;
        }
        
        state.successMessage = 'Budget de catégorie ajusté avec succès !';
        state.lastFetched = null;
      });

    // CREATE BUDGET SNAPSHOT
    builder
      .addCase(createBudgetSnapshot.fulfilled, (state, action) => {
        // Mettre à jour le budget courant
        if (state.currentBudget && state.currentBudget._id === action.payload.snapshot.budgetId) {
          state.currentBudget.monthlySnapshots.push(action.payload.snapshot);
        }
        
        state.successMessage = 'Snapshot mensuel créé avec succès !';
      });

    // TOGGLE ARCHIVE
    builder
      .addCase(toggleArchiveBudget.fulfilled, (state, action) => {
        // Mettre à jour dans la liste
        const index = state.budgets.findIndex(b => b._id === action.payload.budget._id);
        if (index !== -1) {
          state.budgets[index] = action.payload.budget;
        }
        
        state.successMessage = action.payload.budget.isArchived 
          ? 'Budget archivé avec succès !' 
          : 'Budget désarchivé avec succès !';
        state.lastFetched = null;
      });

    // BUDGET PROGRESS
    builder
      .addCase(fetchBudgetProgress.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetProgress.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.budgetProgress = action.payload.progression;
      })
      .addCase(fetchBudgetProgress.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      });

    // BUDGET TRENDS
    builder
      .addCase(fetchBudgetTrends.fulfilled, (state, action) => {
        state.budgetTrends = action.payload;
      });

    // BUDGET ALERTS
    builder
      .addCase(fetchBudgetAlerts.fulfilled, (state, action) => {
        state.budgetAlerts = action.payload;
      });

    // BUDGET TEMPLATES
    builder
      .addCase(fetchBudgetTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.budgetTemplates = action.payload.templates;
      })
      .addCase(fetchBudgetTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      });

    // USER BUDGET STATS
    builder
      .addCase(fetchUserBudgetStats.fulfilled, (state, action) => {
        state.userStats = action.payload.stats;
      });
  }
});

export const {
  clearBudgets,
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  setPage,
  updateBudgetInList,
  removeBudgetFromList,
  clearAnalytics,
  invalidateCache
} = budgetSlice.actions;

// ===================================================================
// SELECTEURS
// ===================================================================

export const selectBudgets = (state) => state.budgets.budgets;
export const selectCurrentBudget = (state) => state.budgets.currentBudget;
export const selectBudgetLoading = (state) => state.budgets.loading;
export const selectBudgetCreating = (state) => state.budgets.creating;
export const selectBudgetUpdating = (state) => state.budgets.updating;
export const selectBudgetDeleting = (state) => state.budgets.deleting;
export const selectBudgetError = (state) => state.budgets.error;
export const selectBudgetSuccess = (state) => state.budgets.successMessage;
export const selectBudgetFilters = (state) => state.budgets.filters;
export const selectBudgetPagination = (state) => state.budgets.pagination;
export const selectBudgetProgress = (state) => state.budgets.budgetProgress;
export const selectBudgetTrends = (state) => state.budgets.budgetTrends;
export const selectBudgetAlerts = (state) => state.budgets.budgetAlerts;
export const selectBudgetTemplates = (state) => state.budgets.budgetTemplates;
export const selectUserBudgetStats = (state) => state.budgets.userStats;
export const selectAnalyticsLoading = (state) => state.budgets.analyticsLoading;
export const selectTemplatesLoading = (state) => state.budgets.templatesLoading;

// Sélecteur pour vérifier si le cache est valide
export const selectShouldFetchBudgets = (state) => {
  const { lastFetched, cacheDuration } = state.budgets;
  return !lastFetched || (Date.now() - lastFetched) > cacheDuration;
};

// Sélecteur pour les budgets actifs
export const selectActiveBudgets = (state) => {
  return state.budgets.budgets.filter(budget => 
    budget.isActive && !budget.isArchived
  );
};

// Sélecteur pour les budgets archivés
export const selectArchivedBudgets = (state) => {
  return state.budgets.budgets.filter(budget => budget.isArchived);
};

// Sélecteur pour les budgets nécessitant attention
export const selectBudgetsNeedingAttention = (state) => {
  return state.budgets.budgets.filter(budget => {
    if (!budget.isActive || budget.isArchived) return false;
    
    // Budget dépassé
    if (budget.isOverBudget) return true;
    
    // Catégorie critique
    const hasCriticalCategory = budget.categories.some(category => {
      const percentage = (category.spentAmount / category.budgetedAmount) * 100;
      return percentage >= budget.alertSettings.criticalThreshold;
    });
    
    if (hasCriticalCategory) return true;
    
    // Fin de période proche
    return budget.remainingDays <= 7;
  });
};

// Sélecteur pour les budgets groupés par statut
export const selectBudgetsGroupedByStatus = (state) => {
  const budgets = state.budgets.budgets;
  
  const grouped = {
    active: [],
    exceeded: [],
    completed: [],
    archived: []
  };
  
  budgets.forEach(budget => {
    if (budget.isArchived) {
      grouped.archived.push(budget);
    } else if (budget.isOverBudget) {
      grouped.exceeded.push(budget);
    } else if (budget.status === 'completed') {
      grouped.completed.push(budget);
    } else {
      grouped.active.push(budget);
    }
  });
  
  return grouped;
};

export default budgetSlice.reducer;