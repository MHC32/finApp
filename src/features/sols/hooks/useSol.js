// src/features/sols/hooks/useSol.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../hooks/useToast';
import {
  createSol,
  fetchSols,
  fetchSolById,
  joinSol,
  leaveSol,
  makePayment,
  fetchPersonalAnalytics,
  discoverSols,
  fetchSupportedData,
  clearError,
  clearSuccess,
  setCurrentSol,
  updateSolLocally,
  addPaymentLocally,
  clearDiscoveredSols,
  clearAnalytics
} from '../../../store/slices/solSlice';

/**
 * Hook pour la gestion des sols/tontines
 * 
 * Features:
 * - CRUD complet des sols
 * - Gestion participants et paiements
 * - Analytics personnels
 * - Découverte de sols
 * - Gestion d'erreurs et messages
 * - Optimistic updates
 */
export const useSol = () => {
  const dispatch = useDispatch();
  const { success, error: toastError, info } = useToast();
  
  // État global depuis Redux
  const {
    sols,
    currentSol,
    discoveredSols,
    personalAnalytics,
    supportedData,
    loading,
    creating,
    joining,
    leaving,
    paying,
    fetchingAnalytics,
    discovering,
    solsLoaded,
    supportedDataLoaded,
    analyticsLoaded,
    error,
    successMessage
  } = useSelector(state => state.sols);
  
  const [localError, setLocalError] = useState('');

  // ===================================================================
  // GESTION DES MESSAGES GLOBAUX
  // ===================================================================

  useEffect(() => {
    // Gérer les erreurs globales du slice
    if (error) {
      console.log('🔍 useSol - Erreur globale détectée:', error);
      toastError(error);
      dispatch(clearError());
    }

    // Gérer les messages de succès du slice
    if (successMessage) {
      console.log('🔍 useSol - Succès global détecté:', successMessage);
      success(successMessage);
      dispatch(clearSuccess());
    }
  }, [error, successMessage, dispatch, toastError, success]);

  // ===================================================================
  // FONCTIONS PRINCIPALES
  // ===================================================================

  /**
   * Créer un nouveau sol
   */
  const createNewSol = async (solData) => {
    setLocalError('');
    console.log('🔍 useSol - Création sol avec données:', solData);
    try {
      const result = await dispatch(createSol(solData)).unwrap();
      console.log('🔍 useSol - Sol créé avec succès:', result);
      success('Sol créé avec succès ! 🤝');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur création sol:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Récupérer tous les sols de l'utilisateur
   */
  const getAllSols = async (params = {}) => {
    setLocalError('');
    console.log('🔍 useSol - Chargement des sols avec params:', params);
    try {
      const result = await dispatch(fetchSols(params)).unwrap();
      console.log('🔍 useSol - Sols chargés:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur chargement sols:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Récupérer un sol spécifique
   */
  const getSol = async (solId, params = {}) => {
    setLocalError('');
    console.log('🔍 useSol - Chargement sol ID:', solId);
    try {
      const result = await dispatch(fetchSolById({ solId, params })).unwrap();
      console.log('🔍 useSol - Sol chargé:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur chargement sol:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Rejoindre un sol avec code d'accès
   */
  const joinExistingSol = async (accessCode) => {
    setLocalError('');
    console.log('🔍 useSol - Rejoindre sol avec code:', accessCode);
    try {
      const result = await dispatch(joinSol({ accessCode })).unwrap();
      console.log('🔍 useSol - Sol rejoint avec succès:', result);
      success('Vous avez rejoint le sol avec succès ! 🎉');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur rejoindre sol:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Quitter un sol
   */
  const leaveExistingSol = async (solId, reason = '') => {
    setLocalError('');
    console.log('🔍 useSol - Quitter sol:', { solId, reason });
    try {
      const result = await dispatch(leaveSol({ solId, reason })).unwrap();
      console.log('🔍 useSol - Sol quitté avec succès:', result);
      success('Vous avez quitté le sol avec succès ! 👋');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur quitter sol:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Effectuer un paiement pour un sol
   */
  const makeSolPayment = async (solId, paymentData) => {
    setLocalError('');
    console.log('🔍 useSol - Paiement sol:', { solId, paymentData });
    try {
      const result = await dispatch(makePayment({ solId, paymentData })).unwrap();
      console.log('🔍 useSol - Paiement effectué avec succès:', result);
      success('Paiement effectué avec succès ! 💰');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur paiement sol:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Récupérer les analytics personnels
   */
  const getPersonalSolAnalytics = async (params = {}) => {
    setLocalError('');
    console.log('🔍 useSol - Chargement analytics avec params:', params);
    try {
      const result = await dispatch(fetchPersonalAnalytics(params)).unwrap();
      console.log('🔍 useSol - Analytics chargés:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur chargement analytics:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Découvrir des sols disponibles
   */
  const discoverAvailableSols = async (params = {}) => {
    setLocalError('');
    console.log('🔍 useSol - Découverte sols avec params:', params);
    try {
      const result = await dispatch(discoverSols(params)).unwrap();
      console.log('🔍 useSol - Sols découverts:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur découverte sols:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Charger les données supportées
   */
  const loadSupportedData = async () => {
    setLocalError('');
    console.log('🔍 useSol - Chargement données supportées...');
    try {
      const result = await dispatch(fetchSupportedData()).unwrap();
      console.log('🔍 useSol - Données supportées chargées:', {
        solTypes: result?.solTypes,
        frequencies: result?.frequencies
      });
      info('Données supportées chargées 📊');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useSol - Erreur chargement données supportées:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  // ===================================================================
  // FONCTIONS UTILITAIRES
  // ===================================================================

  /**
   * Trouver les sols actifs
   */
  const getActiveSols = useCallback(() => {
    const activeSols = sols.filter(sol => 
      sol.status === 'active' || sol.status === 'recruiting'
    );
    console.log('🔍 useSol - Sols actifs trouvés:', activeSols.length);
    return activeSols;
  }, [sols]);

  /**
   * Calculer le total des contributions mensuelles
   */
  const getMonthlyContributions = useCallback(() => {
    const activeSols = getActiveSols();
    const total = activeSols.reduce((sum, sol) => {
      const monthlyAmount = sol.frequency === 'weekly' ? sol.contributionAmount * 4 :
                           sol.frequency === 'biweekly' ? sol.contributionAmount * 2 :
                           sol.contributionAmount; // mensuel
      return sum + monthlyAmount;
    }, 0);
    
    console.log('🔍 useSol - Contributions mensuelles calculées:', total);
    return total;
  }, [getActiveSols]);

  /**
   * Filtrer les sols par critères
   */
  const filterSols = useCallback((criteria = {}) => {
    console.log('🔍 useSol - Filtrage avec critères:', criteria);
    let filtered = [...sols];
    
    if (criteria.status) {
      filtered = filtered.filter(sol => sol.status === criteria.status);
    }
    
    if (criteria.type) {
      filtered = filtered.filter(sol => sol.type === criteria.type);
    }
    
    if (criteria.currency) {
      filtered = filtered.filter(sol => sol.currency === criteria.currency);
    }
    
    if (criteria.contributionRange) {
      filtered = filtered.filter(sol => 
        sol.contributionAmount >= criteria.contributionRange.min &&
        sol.contributionAmount <= criteria.contributionRange.max
      );
    }
    
    console.log('🔍 useSol - Résultat filtrage:', {
      total: sols.length,
      filtered: filtered.length,
      criteres: criteria
    });
    
    return filtered;
  }, [sols]);

  /**
   * Trouver un sol par son ID
   */
  const findSolById = useCallback((solId) => {
    const sol = sols.find(sol => sol._id === solId) || null;
    console.log('🔍 useSol - Recherche sol par ID:', { solId, trouvé: !!sol });
    return sol;
  }, [sols]);

  /**
   * Obtenir le prochain paiement dû
   */
  const getNextPaymentDue = useCallback(() => {
    const activeSols = getActiveSols();
    let nextPayment = null;
    
    activeSols.forEach(sol => {
      if (sol.nextPaymentDate) {
        const paymentDate = new Date(sol.nextPaymentDate);
        if (!nextPayment || paymentDate < nextPayment.date) {
          nextPayment = {
            solId: sol._id,
            solName: sol.name,
            date: paymentDate,
            amount: sol.contributionAmount,
            currency: sol.currency
          };
        }
      }
    });
    
    console.log('🔍 useSol - Prochain paiement trouvé:', nextPayment);
    return nextPayment;
  }, [getActiveSols]);

  /**
   * Mettre à jour localement (optimistic update)
   */
  const updateSolLocal = useCallback((solData) => {
    console.log('🔍 useSol - Mise à jour locale:', solData);
    dispatch(updateSolLocally(solData));
  }, [dispatch]);

  /**
   * Ajouter un paiement localement (optimistic update)
   */
  const addPaymentLocal = useCallback((solId, roundIndex, payment) => {
    console.log('🔍 useSol - Ajout paiement local:', { solId, roundIndex, payment });
    dispatch(addPaymentLocally({ solId, roundIndex, payment }));
  }, [dispatch]);

  /**
   * Définir le sol courant
   */
  const setCurrent = useCallback((sol) => {
    console.log('🔍 useSol - Définition sol courant:', sol);
    dispatch(setCurrentSol(sol));
  }, [dispatch]);

  /**
   * Nettoyer les sols découverts
   */
  const clearDiscovered = useCallback(() => {
    console.log('🔍 useSol - Nettoyage sols découverts');
    dispatch(clearDiscoveredSols());
  }, [dispatch]);

  /**
   * Nettoyer les analytics
   */
  const clearAnalyticsData = useCallback(() => {
    console.log('🔍 useSol - Nettoyage analytics');
    dispatch(clearAnalytics());
  }, [dispatch]);

  // ===================================================================
  // CHARGEMENT AUTOMATIQUE DES DONNÉES
  // ===================================================================

  // Charger les sols au montage si pas déjà chargés
  useEffect(() => {
    console.log('🔍 useSol - Vérification chargement sols:', {
      solsLoaded,
      loading,
      solsCount: sols?.length
    });
    
    if (!solsLoaded && !loading) {
      console.log('🔍 useSol - Déclenchement chargement automatique sols');
      getAllSols();
    }
  }, [solsLoaded, loading]);

  // Charger les données supportées au montage si pas déjà chargées
  useEffect(() => {
    console.log('🔍 useSol - Vérification chargement données supportées:', {
      supportedDataLoaded,
      loading,
      solTypesCount: supportedData?.solTypes?.length,
      frequenciesCount: supportedData?.frequencies?.length
    });
    
    if (!supportedDataLoaded && !loading) {
      console.log('🔍 useSol - Déclenchement chargement automatique données supportées');
      loadSupportedData();
    }
  }, [supportedDataLoaded, loading]);

  // ===================================================================
  // EXPORT DU HOOK
  // ===================================================================

  const hookReturn = {
    // État
    sols,
    currentSol,
    discoveredSols,
    personalAnalytics,
    supportedData,
    isLoading: loading,
    isCreating: creating,
    isJoining: joining,
    isLeaving: leaving,
    isPaying: paying,
    isFetchingAnalytics: fetchingAnalytics,
    isDiscovering: discovering,
    solsLoaded,
    supportedDataLoaded,
    analyticsLoaded,
    error: localError,
    
    // Fonctions principales
    createSol: createNewSol,
    getSols: getAllSols,
    getSol,
    joinSol: joinExistingSol,
    leaveSol: leaveExistingSol,
    makePayment: makeSolPayment,
    getPersonalAnalytics: getPersonalSolAnalytics,
    discoverSols: discoverAvailableSols,
    loadSupportedData,
    
    // Fonctions utilitaires
    getActiveSols,
    getMonthlyContributions,
    filterSols,
    findSolById,
    getNextPaymentDue,
    updateSolLocal,
    addPaymentLocal,
    setCurrentSol: setCurrent,
    clearDiscoveredSols: clearDiscovered,
    clearAnalytics: clearAnalyticsData,
    
    // Nettoyage
    clearError: () => setLocalError('')
  };

  console.log('🔍 useSol - Hook retourné:', {
    supportedData: hookReturn.supportedData,
    solsCount: hookReturn.sols?.length,
    isLoading: hookReturn.isLoading
  });

  return hookReturn;
};

export default useSol;