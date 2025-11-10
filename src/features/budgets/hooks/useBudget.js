// src/features/budgets/hooks/useBudget.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createBudget,
  createBudgetFromTemplate,
  fetchBudgets,
  fetchBudgetById,
  updateBudget,
  deleteBudget,
  adjustCategoryBudget,
  createBudgetSnapshot,
  toggleArchiveBudget,
  fetchBudgetProgress,
  fetchBudgetTrends,
  fetchBudgetAlerts,
  fetchBudgetTemplates,
  fetchUserBudgetStats,
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  clearAnalytics,
  invalidateCache
} from '../../../store/slices/budgetSlice';
import { useToast } from '../../../hooks/useToast';

/**
 * Hook de gestion des budgets utilisant le budgetSlice existant
 * Aligné avec les createAsyncThunk du slice
 */
export const useBudget = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  
  // État global depuis Redux
  const { 
    budgets,
    currentBudget,
    budgetProgress,
    budgetTrends,
    budgetAlerts,
    budgetTemplates,
    userStats,
    filters,
    pagination,
    loading,
    creating,
    updating,
    deleting,
    analyticsLoading,
    templatesLoading,
    error: sliceError,
    successMessage
  } = useSelector(state => state.budgets);
  
  const [localError, setLocalError] = useState('');

  // ===================================================================
  // GESTION DES MESSAGES GLOBAUX
  // ===================================================================

  useEffect(() => {
    // Gérer les erreurs globales du slice
    if (sliceError) {
      error(sliceError);
      dispatch(clearError());
    }

    // Gérer les messages de succès du slice
    if (successMessage) {
      success(successMessage);
      dispatch(clearSuccess());
    }
  }, [sliceError, successMessage, dispatch, error, success]);

  // ===================================================================
  // FONCTIONS DE GESTION DES BUDGETS
  // ===================================================================

  /**
   * Créer un nouveau budget
   */
  const create = async (budgetData) => {
    setLocalError('');
    const result = await dispatch(createBudget(budgetData));
    
    if (createBudget.fulfilled.match(result)) {
      success('Votre budget a été créé avec succès ! 📊');
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la création');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Créer budget depuis template
   */
  const createFromTemplate = async (templateName, customData = {}) => {
    setLocalError('');
    const result = await dispatch(createBudgetFromTemplate({ templateName, customData }));
    
    if (createBudgetFromTemplate.fulfilled.match(result)) {
      success(`Budget "${templateName}" créé avec succès ! 🎯`);
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la création depuis template');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les budgets avec filtres
   */
  const getBudgets = async (customFilters = {}) => {
    setLocalError('');
    const result = await dispatch(fetchBudgets(customFilters));
    
    if (fetchBudgets.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des budgets');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer un budget spécifique
   */
  const getBudget = async (budgetId) => {
    setLocalError('');
    const result = await dispatch(fetchBudgetById(budgetId));
    
    if (fetchBudgetById.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement du budget');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Mettre à jour un budget
   */
  const update = async (budgetId, updateData) => {
    setLocalError('');
    const result = await dispatch(updateBudget({ budgetId, updateData }));
    
    if (updateBudget.fulfilled.match(result)) {
      success('Votre budget a été modifié avec succès ! ✏️');
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la mise à jour');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Supprimer un budget
   */
  const remove = async (budgetId) => {
    setLocalError('');
    const result = await dispatch(deleteBudget(budgetId));
    
    if (deleteBudget.fulfilled.match(result)) {
      const message = result.payload.action === 'archived' 
        ? 'Votre budget a été archivé avec succès ! 📁'
        : 'Votre budget a été supprimé avec succès ! 🗑️';
      success(message);
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la suppression');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Ajuster budget d'une catégorie
   */
  const adjustCategory = async (budgetId, category, newAmount, reason = '') => {
    setLocalError('');
    const result = await dispatch(adjustCategoryBudget({ 
      budgetId, 
      category, 
      newAmount, 
      reason 
    }));
    
    if (adjustCategoryBudget.fulfilled.match(result)) {
      success(`Budget ${category} ajusté à ${newAmount} ! 📈`);
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de l\'ajustement');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Créer snapshot mensuel
   */
  const createSnapshot = async (budgetId) => {
    setLocalError('');
    const result = await dispatch(createBudgetSnapshot(budgetId));
    
    if (createBudgetSnapshot.fulfilled.match(result)) {
      success('Snapshot mensuel créé avec succès ! 📸');
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la création du snapshot');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Archiver/désarchiver un budget
   */
  const toggleArchive = async (budgetId, archive = true) => {
    setLocalError('');
    const result = await dispatch(toggleArchiveBudget({ budgetId, archive }));
    
    if (toggleArchiveBudget.fulfilled.match(result)) {
      const message = archive 
        ? 'Budget archivé avec succès ! 📁'
        : 'Budget désarchivé avec succès ! 📂';
      success(message);
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de l\'archivage');
      return { success: false, error: result.payload };
    }
  };

  // ===================================================================
  // FONCTIONS D'ANALYTICS ET RECHERCHE
  // ===================================================================

  /**
   * Récupérer la progression des budgets
   */
  const getBudgetProgress = async (params = {}) => {
    setLocalError('');
    const result = await dispatch(fetchBudgetProgress(params));
    
    if (fetchBudgetProgress.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement de la progression');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les tendances
   */
  const getBudgetTrends = async (params = {}) => {
    setLocalError('');
    const result = await dispatch(fetchBudgetTrends(params));
    
    if (fetchBudgetTrends.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des tendances');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les alertes budgets
   */
  const getBudgetAlerts = async () => {
    setLocalError('');
    const result = await dispatch(fetchBudgetAlerts());
    
    if (fetchBudgetAlerts.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des alertes');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les templates disponibles
   */
  const getTemplates = async () => {
    setLocalError('');
    const result = await dispatch(fetchBudgetTemplates());
    
    if (fetchBudgetTemplates.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des templates');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les statistiques utilisateur
   */
  const getUserStats = async () => {
    setLocalError('');
    const result = await dispatch(fetchUserBudgetStats());
    
    if (fetchUserBudgetStats.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des statistiques');
      return { success: false, error: result.payload };
    }
  };

  // ===================================================================
  // FONCTIONS DE GESTION D'ÉTAT
  // ===================================================================

  /**
   * Mettre à jour les filtres
   */
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  /**
   * Réinitialiser les filtres
   */
  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  /**
   * Effacer les analytics
   */
  const clearAllAnalytics = useCallback(() => {
    dispatch(clearAnalytics());
  }, [dispatch]);

  /**
   * Invalider le cache pour forcer le rechargement
   */
  const refreshData = useCallback(() => {
    dispatch(invalidateCache());
  }, [dispatch]);

  // ===================================================================
  // EXPORT DU HOOK
  // ===================================================================

  return {
    // État
    budgets,
    currentBudget,
    budgetProgress,
    budgetTrends,
    budgetAlerts,
    budgetTemplates,
    userStats,
    filters,
    pagination,
    
    // États de chargement
    isLoading: loading,
    isCreating: creating,
    isUpdating: updating,
    isDeleting: deleting,
    isAnalyticsLoading: analyticsLoading,
    isTemplatesLoading: templatesLoading,
    
    // Erreurs
    error: localError,
    
    // Fonctions CRUD
    createBudget: create,
    createBudgetFromTemplate: createFromTemplate,
    getBudgets,
    getBudget,
    updateBudget: update,
    deleteBudget: remove,
    adjustCategoryBudget: adjustCategory,
    createBudgetSnapshot: createSnapshot,
    toggleArchiveBudget: toggleArchive,
    
    // Fonctions d'analytics
    getBudgetProgress,
    getBudgetTrends,
    getBudgetAlerts,
    getBudgetTemplates: getTemplates,
    getUserBudgetStats: getUserStats,
    
    // Gestion d'état
    updateFilters,
    resetFilters: resetAllFilters,
    clearAnalytics: clearAllAnalytics,
    refreshData,
    
    // Utilitaires
    clearError: () => setLocalError('')
  };
};

export default useBudget;