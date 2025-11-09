import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createTransaction,
  fetchTransactions,
  fetchTransactionById,
  updateTransaction,
  deleteTransaction,
  fetchCategoryAnalytics,
  fetchMonthlyStats,
  searchTransactions,
  duplicateTransaction,
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  clearSearchResults,
  invalidateCache
} from '../../../store/slices/transactionsSlice';
import { useToast } from '../../../hooks/useToast';

/**
 * Hook de gestion des transactions utilisant le transactionsSlice existant
 * Aligné avec les createAsyncThunk du slice
 */
export const useTransaction = () => {
  const dispatch = useDispatch();
  const { showToast, success, error: toastError } = useToast(); // ← CORRECTION ICI
  
  // État global depuis Redux
  const { 
    transactions,
    currentTransaction,
    categoryAnalytics,
    monthlyStats,
    searchResults,
    filters,
    pagination,
    stats,
    loading,
    creating,
    updating,
    deleting,
    analyticsLoading,
    searchLoading,
    error,
    successMessage
  } = useSelector(state => state.transactions);
  
  const [localError, setLocalError] = useState('');

  // ===================================================================
  // GESTION DES MESSAGES GLOBAUX
  // ===================================================================

  useEffect(() => {
    // Gérer les erreurs globales du slice
    if (error) {
      toastError(error); // ← CORRECTION ICI
      dispatch(clearError());
    }

    // Gérer les messages de succès du slice
    if (successMessage) {
      success(successMessage); // ← CORRECTION ICI
      dispatch(clearSuccess());
    }
  }, [error, successMessage, dispatch, toastError, success]);

  // ===================================================================
  // FONCTIONS DE GESTION DES TRANSACTIONS
  // ===================================================================

  /**
   * Créer une nouvelle transaction
   */
  const create = async (transactionData) => {
    setLocalError('');
    const result = await dispatch(createTransaction(transactionData));
    
    if (createTransaction.fulfilled.match(result)) {
      success('Votre transaction a été enregistrée avec succès ! 💰'); // ← CORRECTION ICI
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la création');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les transactions avec filtres
   */
  const getTransactions = async (customFilters = {}) => {
    setLocalError('');
    const result = await dispatch(fetchTransactions(customFilters));
    
    if (fetchTransactions.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer une transaction spécifique
   */
  const getTransaction = async (transactionId) => {
    setLocalError('');
    const result = await dispatch(fetchTransactionById(transactionId));
    
    if (fetchTransactionById.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Mettre à jour une transaction
   */
  const update = async (transactionId, updateData) => {
    setLocalError('');
    const result = await dispatch(updateTransaction({ transactionId, updateData }));
    
    if (updateTransaction.fulfilled.match(result)) {
      success('Votre transaction a été modifiée avec succès ! ✏️'); // ← CORRECTION ICI
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la mise à jour');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Supprimer une transaction
   */
  const remove = async (transactionId, options = {}) => {
    setLocalError('');
    const result = await dispatch(deleteTransaction({ transactionId, options }));
    
    if (deleteTransaction.fulfilled.match(result)) {
      success('Votre transaction a été supprimée avec succès ! 🗑️'); // ← CORRECTION ICI
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la suppression');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Dupliquer une transaction
   */
  const duplicate = async (transactionId, duplicateData = {}) => {
    setLocalError('');
    const result = await dispatch(duplicateTransaction({ transactionId, duplicateData }));
    
    if (duplicateTransaction.fulfilled.match(result)) {
      success('Votre transaction a été dupliquée avec succès ! 📋'); // ← CORRECTION ICI
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la duplication');
      return { success: false, error: result.payload };
    }
  };

  // ===================================================================
  // FONCTIONS D'ANALYTICS ET RECHERCHE
  // ===================================================================

  /**
   * Récupérer les analytics par catégorie
   */
  const getCategoryAnalytics = async (params = {}) => {
    setLocalError('');
    const result = await dispatch(fetchCategoryAnalytics(params));
    
    if (fetchCategoryAnalytics.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des analytics');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Récupérer les statistiques mensuelles
   */
  const getMonthlyStats = async (params = {}) => {
    setLocalError('');
    const result = await dispatch(fetchMonthlyStats(params));
    
    if (fetchMonthlyStats.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors du chargement des statistiques');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Rechercher des transactions
   */
  const search = async (searchParams) => {
    setLocalError('');
    const result = await dispatch(searchTransactions(searchParams));
    
    if (searchTransactions.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur lors de la recherche');
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
   * Effacer les résultats de recherche
   */
  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
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
    transactions,
    currentTransaction,
    categoryAnalytics,
    monthlyStats,
    searchResults,
    filters,
    pagination,
    stats,
    
    // États de chargement
    isLoading: loading,
    isCreating: creating,
    isUpdating: updating,
    isDeleting: deleting,
    isAnalyticsLoading: analyticsLoading,
    isSearchLoading: searchLoading,
    
    // Erreurs
    error: localError,
    
    // Fonctions CRUD
    createTransaction: create,
    getTransactions,
    getTransaction,
    updateTransaction: update,
    deleteTransaction: remove,
    duplicateTransaction: duplicate,
    
    // Fonctions d'analytics et recherche
    getCategoryAnalytics,
    getMonthlyStats,
    searchTransactions: search,
    
    // Gestion d'état
    updateFilters,
    resetFilters: resetAllFilters,
    clearSearchResults: clearSearch,
    refreshData,
    
    // Utilitaires
    clearError: () => setLocalError('')
  };
};

export default useTransaction;