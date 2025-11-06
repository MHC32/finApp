// src/features/accounts/hooks/useAccount.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../hooks/useToast';
import {
  createAccount,
  fetchAccounts,
  fetchAccountById,
  updateAccount,
  deleteAccount,
  adjustAccountBalance,
  setDefaultAccount,
  fetchSupportedData,
  clearError,
  clearSuccess,
  setCurrentAccount,
  updateAccountLocally,
  updateBalanceLocally
} from '../../../store/slices/accountSlice';

/**
 * Hook pour la gestion des comptes bancaires
 * 
 * Features:
 * - CRUD complet des comptes
 * - Gestion des soldes
 * - Compte par défaut
 * - Données supportées (banques, devises, types)
 * - Gestion d'erreurs et messages
 * - Optimistic updates
 */
export const useAccount = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  // État global depuis Redux
  const {
    accounts,
    currentAccount,
    supportedData,
    loading,
    creating,
    updating,
    deleting,
    adjustingBalance,
    accountsLoaded,
    supportedDataLoaded,
    error,
    successMessage
  } = useSelector(state => state.accounts);
  
  const [localError, setLocalError] = useState('');

  // DEBUG: Log de l'état initial
  useEffect(() => {
    console.log('🔍 useAccount - État initial:', {
      accountsCount: accounts?.length,
      supportedData,
      supportedDataLoaded,
      accountsLoaded,
      loading
    });
  }, []);

  // DEBUG: Log quand supportedData change
  useEffect(() => {
    console.log('🔍 useAccount - supportedData mis à jour:', {
      banks: supportedData?.banks,
      accountTypes: supportedData?.accountTypes,
      currencies: supportedData?.currencies,
      supportedDataLoaded
    });
  }, [supportedData, supportedDataLoaded]);

  // ===================================================================
  // GESTION DES MESSAGES GLOBAUX
  // ===================================================================

  useEffect(() => {
    // Gérer les erreurs globales du slice
    if (error) {
      console.log('🔍 useAccount - Erreur globale détectée:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error,
        duration: 5000
      });
      dispatch(clearError());
    }

    // Gérer les messages de succès du slice
    if (successMessage) {
      console.log('🔍 useAccount - Succès global détecté:', successMessage);
      showToast({
        type: 'success',
        title: 'Succès',
        message: successMessage,
        duration: 3000
      });
      dispatch(clearSuccess());
    }
  }, [error, successMessage, dispatch, showToast]);

  // ===================================================================
  // FONCTIONS PRINCIPALES
  // ===================================================================

  /**
   * Créer un nouveau compte
   */
  const createNewAccount = async (accountData) => {
    setLocalError('');
    console.log('🔍 useAccount - Création compte avec données:', accountData);
    try {
      const result = await dispatch(createAccount(accountData)).unwrap();
      console.log('🔍 useAccount - Compte créé avec succès:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur création compte:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Récupérer tous les comptes
   */
  const getAllAccounts = async (params = {}) => {
    setLocalError('');
    console.log('🔍 useAccount - Chargement des comptes avec params:', params);
    try {
      const result = await dispatch(fetchAccounts(params)).unwrap();
      console.log('🔍 useAccount - Comptes chargés:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur chargement comptes:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Récupérer un compte spécifique
   */
  const getAccount = async (accountId) => {
    setLocalError('');
    console.log('🔍 useAccount - Chargement compte ID:', accountId);
    try {
      const result = await dispatch(fetchAccountById(accountId)).unwrap();
      console.log('🔍 useAccount - Compte chargé:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur chargement compte:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Mettre à jour un compte
   */
  const updateExistingAccount = async (accountId, updateData) => {
    setLocalError('');
    console.log('🔍 useAccount - Mise à jour compte:', { accountId, updateData });
    try {
      const result = await dispatch(updateAccount({ accountId, updateData })).unwrap();
      console.log('🔍 useAccount - Compte mis à jour:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur mise à jour compte:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Supprimer un compte
   */
  const deleteExistingAccount = async (accountId, permanent = false) => {
    setLocalError('');
    console.log('🔍 useAccount - Suppression compte:', { accountId, permanent });
    try {
      await dispatch(deleteAccount({ accountId, permanent })).unwrap();
      console.log('🔍 useAccount - Compte supprimé avec succès');
      return { success: true };
    } catch (error) {
      console.error('❌ useAccount - Erreur suppression compte:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Ajuster le solde d'un compte
   */
  const adjustBalance = async (accountId, amount, description) => {
    setLocalError('');
    console.log('🔍 useAccount - Ajustement solde:', { accountId, amount, description });
    try {
      const result = await dispatch(adjustAccountBalance({
        accountId,
        adjustmentData: { amount, description }
      })).unwrap();
      console.log('🔍 useAccount - Solde ajusté:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur ajustement solde:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Définir comme compte par défaut
   */
  const setAsDefaultAccount = async (accountId) => {
    setLocalError('');
    console.log('🔍 useAccount - Définition compte par défaut:', accountId);
    try {
      const result = await dispatch(setDefaultAccount(accountId)).unwrap();
      console.log('🔍 useAccount - Compte par défaut défini:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur définition compte par défaut:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  /**
   * Charger les données supportées
   */
  const loadSupportedData = async () => {
    setLocalError('');
    console.log('🔍 useAccount - Chargement données supportées...');
    try {
      const result = await dispatch(fetchSupportedData()).unwrap();
      console.log('🔍 useAccount - Données supportées chargées:', {
        banks: result?.banks,
        accountTypes: result?.accountTypes,
        currencies: result?.currencies
      });
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ useAccount - Erreur chargement données supportées:', error);
      setLocalError(error);
      return { success: false, error };
    }
  };

  // ===================================================================
  // FONCTIONS UTILITAIRES
  // ===================================================================

  /**
   * Trouver le compte par défaut
   */
  const getDefaultAccount = useCallback(() => {
    const defaultAccount = accounts.find(account => account.isDefault) || accounts[0] || null;
    console.log('🔍 useAccount - Compte par défaut trouvé:', defaultAccount);
    return defaultAccount;
  }, [accounts]);

  /**
   * Calculer le total des soldes par devise
   */
  const getTotalBalances = useCallback(() => {
    const totals = {};
    
    accounts.forEach(account => {
      if (account.includeInTotal && account.isActive) {
        if (!totals[account.currency]) {
          totals[account.currency] = 0;
        }
        totals[account.currency] += account.currentBalance;
      }
    });
    
    console.log('🔍 useAccount - Totaux calculés:', totals);
    return totals;
  }, [accounts]);

  /**
   * Filtrer les comptes par critères
   */
  const filterAccounts = useCallback((criteria = {}) => {
    console.log('🔍 useAccount - Filtrage avec critères:', criteria);
    let filtered = [...accounts];
    
    if (criteria.type) {
      filtered = filtered.filter(account => account.type === criteria.type);
    }
    
    if (criteria.currency) {
      filtered = filtered.filter(account => account.currency === criteria.currency);
    }
    
    if (criteria.bankName) {
      filtered = filtered.filter(account => account.bankName === criteria.bankName);
    }
    
    if (criteria.activeOnly) {
      filtered = filtered.filter(account => account.isActive);
    }
    
    console.log('🔍 useAccount - Résultat filtrage:', {
      total: accounts.length,
      filtered: filtered.length,
      criteres: criteria
    });
    
    return filtered;
  }, [accounts]);

  /**
   * Trouver un compte par son ID
   */
  const findAccountById = useCallback((accountId) => {
    const account = accounts.find(account => account._id === accountId) || null;
    console.log('🔍 useAccount - Recherche compte par ID:', { accountId, trouvé: !!account });
    return account;
  }, [accounts]);

  /**
   * Mettre à jour localement (optimistic update)
   */
  const updateAccountLocal = useCallback((accountData) => {
    console.log('🔍 useAccount - Mise à jour locale:', accountData);
    dispatch(updateAccountLocally(accountData));
  }, [dispatch]);

  /**
   * Mettre à jour le solde localement (optimistic update)
   */
  const updateBalanceLocal = useCallback((accountId, newBalance) => {
    console.log('🔍 useAccount - Mise à jour solde local:', { accountId, newBalance });
    dispatch(updateBalanceLocally({ accountId, newBalance }));
  }, [dispatch]);

  /**
   * Définir le compte courant
   */
  const setCurrent = useCallback((account) => {
    console.log('🔍 useAccount - Définition compte courant:', account);
    dispatch(setCurrentAccount(account));
  }, [dispatch]);

  // ===================================================================
  // CHARGEMENT AUTOMATIQUE DES DONNÉES
  // ===================================================================

  // Charger les comptes au montage si pas déjà chargés
  useEffect(() => {
    console.log('🔍 useAccount - Vérification chargement comptes:', {
      accountsLoaded,
      loading,
      accountsCount: accounts?.length
    });
    
    if (!accountsLoaded && !loading) {
      console.log('🔍 useAccount - Déclenchement chargement automatique comptes');
      getAllAccounts();
    }
  }, [accountsLoaded, loading]);

  // Charger les données supportées au montage si pas déjà chargées
  useEffect(() => {
    console.log('🔍 useAccount - Vérification chargement données supportées:', {
      supportedDataLoaded,
      loading,
      banksCount: supportedData?.banks?.length,
      accountTypesCount: supportedData?.accountTypes?.length,
      currenciesCount: supportedData?.currencies?.length
    });
    
    if (!supportedDataLoaded && !loading) {
      console.log('🔍 useAccount - Déclenchement chargement automatique données supportées');
      loadSupportedData();
    }
  }, [supportedDataLoaded, loading]);

  // DEBUG: Log quand les comptes changent
  useEffect(() => {
    console.log('🔍 useAccount - Comptes mis à jour:', {
      count: accounts?.length,
      accounts: accounts?.map(acc => ({ id: acc._id, name: acc.name, type: acc.type }))
    });
  }, [accounts]);

  // ===================================================================
  // EXPORT DU HOOK
  // ===================================================================

  const hookReturn = {
    // État
    accounts,
    currentAccount,
    supportedData,
    isLoading: loading,
    isCreating: creating,
    isUpdating: updating,
    isDeleting: deleting,
    isAdjustingBalance: adjustingBalance,
    accountsLoaded,
    supportedDataLoaded,
    error: localError,
    
    // Fonctions principales
    createAccount: createNewAccount,
    getAccounts: getAllAccounts,
    getAccount,
    updateAccount: updateExistingAccount,
    deleteAccount: deleteExistingAccount,
    adjustBalance,
    setDefaultAccount: setAsDefaultAccount,
    loadSupportedData,
    
    // Fonctions utilitaires
    getDefaultAccount,
    getTotalBalances,
    filterAccounts,
    findAccountById,
    updateAccountLocal,
    updateBalanceLocal,
    setCurrentAccount: setCurrent,
    
    // Nettoyage
    clearError: () => setLocalError('')
  };

  console.log('🔍 useAccount - Hook retourné:', {
    supportedData: hookReturn.supportedData,
    accountsCount: hookReturn.accounts?.length,
    isLoading: hookReturn.isLoading
  });

  return hookReturn;
};

export default useAccount;