// src/hooks/useAccounts.js - VERSION CORRIGÉE COMPLÈTE
import { useState, useEffect } from 'react';
import { db } from '../database/db';
import { useAuthStore } from '../store/authStore';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ FONCTION POUR NORMALISER LES IDS
  const normalizeId = (id) => {
    if (id === null || id === undefined) {
      console.warn('⚠️ ID de compte null ou undefined');
      return null;
    }
    
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(numericId)) {
      console.error('❌ ID de compte invalide:', id);
      return null;
    }
    
    return numericId;
  };

  // ✅ FONCTION POUR VALIDER LES DONNÉES DE COMPTE
  const validateAccountData = (accountData) => {
    const errors = [];
    
    if (!accountData.name?.trim()) {
      errors.push('Nom du compte requis');
    }
    
    if (accountData.initial_balance === undefined || accountData.initial_balance === null) {
      errors.push('Solde initial requis');
    } else if (isNaN(parseFloat(accountData.initial_balance))) {
      errors.push('Solde initial invalide');
    }
    
    if (!accountData.type) {
      errors.push('Type de compte requis');
    }
    
    if (!accountData.currency) {
      errors.push('Devise requise');
    }
    
    return errors;
  };

  // ✅ CHARGER TOUS LES COMPTES AVEC VALIDATION
  const loadAccounts = async () => {
    if (!user?.id) {
      console.log('⚠️ Pas d\'utilisateur connecté pour charger les comptes');
      setAccounts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 === CHARGEMENT DES COMPTES ===');
      console.log('👤 User ID:', user.id);
      
      const userAccounts = await db.accounts
        .where('user_id')
        .equals(user.id)
        .toArray();
      
      console.log(`📊 ${userAccounts.length} comptes trouvés dans la DB`);
      
      // ✅ VALIDATION ET NETTOYAGE DES DONNÉES
      const validAccounts = userAccounts.filter((account, index) => {
        const isValid = account.id && 
                       account.name && 
                       typeof account.current_balance === 'number' &&
                       !isNaN(account.current_balance);
        
        if (!isValid) {
          console.warn(`⚠️ Compte ${index + 1} invalide ignoré:`, account);
        } else {
          console.log(`✅ Compte ${index + 1}:`, {
            id: account.id,
            name: account.name,
            balance: account.current_balance,
            type: account.type,
            is_active: account.is_active
          });
        }
        
        return isValid;
      });
      
      // ✅ TRIER LES COMPTES (actifs en premier, puis par nom)
      const sortedAccounts = validAccounts.sort((a, b) => {
        if (a.is_active !== b.is_active) {
          return a.is_active ? -1 : 1; // Actifs en premier
        }
        return a.name.localeCompare(b.name); // Puis par nom
      });
      
      setAccounts(sortedAccounts);
      console.log(`✅ ${sortedAccounts.length} comptes valides chargés`);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des comptes:', err);
      setError('Erreur lors du chargement des comptes');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AJOUTER UN COMPTE AVEC VALIDATION RENFORCÉE
  const addAccount = async (accountData) => {
    try {
      console.log('➕ === AJOUT COMPTE ===');
      console.log('📥 Données reçues:', accountData);
      
      // Validation des données
      const validationErrors = validateAccountData(accountData);
      if (validationErrors.length > 0) {
        throw new Error(`Données invalides: ${validationErrors.join(', ')}`);
      }
      
      // Vérifier l'unicité du nom
      const existingAccount = accounts.find(acc => 
        acc.name.toLowerCase().trim() === accountData.name.toLowerCase().trim()
      );
      
      if (existingAccount) {
        throw new Error('Un compte avec ce nom existe déjà');
      }
      
      // ✅ PRÉPARER LES DONNÉES NORMALISÉES
      const initialBalance = parseFloat(accountData.initial_balance) || 0;
      
      const newAccount = {
        user_id: user.id,
        name: accountData.name.trim(),
        type: accountData.type,
        bank: accountData.bank?.trim() || '',
        account_number: accountData.account_number?.trim() || '',
        currency: accountData.currency || 'HTG',
        initial_balance: initialBalance,
        current_balance: initialBalance, // Le solde courant commence au solde initial
        is_active: accountData.is_active !== undefined ? accountData.is_active : true,
        description: accountData.description?.trim() || '',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('💾 Compte à sauvegarder:', newAccount);
      
      // Sauvegarder en base
      const accountId = await db.accounts.add(newAccount);
      console.log('✅ Compte sauvegardé avec ID:', accountId);
      
      // Récupérer le compte créé
      const createdAccount = await db.accounts.get(accountId);
      
      // ✅ METTRE À JOUR LE STATE LOCAL
      setAccounts(prev => {
        const updated = [...prev, createdAccount].sort((a, b) => {
          if (a.is_active !== b.is_active) {
            return a.is_active ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        
        console.log(`🔄 State comptes mis à jour: ${updated.length} comptes`);
        return updated;
      });
      
      console.log('🎉 === COMPTE AJOUTÉ AVEC SUCCÈS ===');
      return createdAccount;
      
    } catch (err) {
      console.error('❌ === ERREUR AJOUT COMPTE ===', err);
      setError(err.message || 'Erreur lors de l\'ajout du compte');
      throw err;
    }
  };

  // ✅ MODIFIER UN COMPTE AVEC VALIDATION
  const updateAccount = async (accountId, updates) => {
    try {
      console.log('✏️ === MODIFICATION COMPTE ===');
      console.log('🎯 Compte ID:', accountId, 'Mises à jour:', updates);
      
      const numericAccountId = normalizeId(accountId);
      if (!numericAccountId) {
        throw new Error('ID de compte invalide');
      }
      
      // Vérifier que le compte existe
      const existingAccount = await db.accounts.get(numericAccountId);
      if (!existingAccount) {
        throw new Error('Compte non trouvé');
      }
      
      // Validation des mises à jour
      if (updates.name) {
        updates.name = updates.name.trim();
        if (!updates.name) {
          throw new Error('Le nom du compte ne peut pas être vide');
        }
        
        // Vérifier l'unicité du nom (sauf pour le compte actuel)
        const duplicateAccount = accounts.find(acc => 
          acc.id !== numericAccountId && 
          acc.name.toLowerCase() === updates.name.toLowerCase()
        );
        
        if (duplicateAccount) {
          throw new Error('Un autre compte avec ce nom existe déjà');
        }
      }
      
      // ✅ PRÉPARER LES DONNÉES DE MISE À JOUR
      const updateData = {
        ...updates,
        updated_at: new Date()
      };
      
      // Nettoyer les champs texte
      if (updateData.bank) updateData.bank = updateData.bank.trim();
      if (updateData.account_number) updateData.account_number = updateData.account_number.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      
      console.log('📄 Données de mise à jour:', updateData);
      
      // Mettre à jour en base
      await db.accounts.update(numericAccountId, updateData);
      console.log('✅ Compte mis à jour en base');
      
      // Récupérer le compte mis à jour
      const updatedAccount = await db.accounts.get(numericAccountId);
      
      // ✅ METTRE À JOUR LE STATE LOCAL
      setAccounts(prev => {
        const updated = prev.map(account => 
          account.id === numericAccountId ? updatedAccount : account
        ).sort((a, b) => {
          if (a.is_active !== b.is_active) {
            return a.is_active ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        
        console.log('🔄 State comptes mis à jour après modification');
        return updated;
      });
      
      console.log('🎉 === COMPTE MODIFIÉ AVEC SUCCÈS ===');
      return updatedAccount;
      
    } catch (err) {
      console.error('❌ === ERREUR MODIFICATION COMPTE ===', err);
      setError(err.message || 'Erreur lors de la modification du compte');
      throw err;
    }
  };

  // ✅ SUPPRIMER UN COMPTE AVEC VÉRIFICATIONS
  const deleteAccount = async (accountId) => {
    try {
      console.log('🗑️ === SUPPRESSION COMPTE ===');
      console.log('🎯 Compte ID:', accountId);
      
      const numericAccountId = normalizeId(accountId);
      if (!numericAccountId) {
        throw new Error('ID de compte invalide');
      }
      
      // Vérifier que le compte existe
      const existingAccount = await db.accounts.get(numericAccountId);
      if (!existingAccount) {
        throw new Error('Compte non trouvé');
      }
      
      // ✅ VÉRIFIER S'IL Y A DES TRANSACTIONS LIÉES
      const relatedTransactions = await db.transactions
        .where('account_id')
        .equals(numericAccountId)
        .count();
      
      if (relatedTransactions > 0) {
        console.log(`⚠️ ${relatedTransactions} transactions liées trouvées`);
        throw new Error(`Impossible de supprimer ce compte: ${relatedTransactions} transaction(s) liée(s). Désactivez-le plutôt.`);
      }
      
      // Supprimer de la base
      await db.accounts.delete(numericAccountId);
      console.log('✅ Compte supprimé de la base');
      
      // ✅ METTRE À JOUR LE STATE LOCAL
      setAccounts(prev => {
        const updated = prev.filter(account => account.id !== numericAccountId);
        console.log(`🔄 State comptes mis à jour: ${updated.length} comptes restants`);
        return updated;
      });
      
      console.log('🎉 === COMPTE SUPPRIMÉ AVEC SUCCÈS ===');
      
    } catch (err) {
      console.error('❌ === ERREUR SUPPRESSION COMPTE ===', err);
      setError(err.message || 'Erreur lors de la suppression du compte');
      throw err;
    }
  };

  // ✅ CALCULER LE SOLDE TOTAL AVEC VALIDATION
  const getTotalBalance = () => {
    try {
      console.log('🧮 === CALCUL SOLDE TOTAL ===');
      
      const total = accounts.reduce((total, account, index) => {
        console.log(`💰 Compte ${index + 1} (${account.name}):`, {
          balance: account.current_balance,
          type: typeof account.current_balance,
          is_active: account.is_active
        });
        
        if (account.is_active && typeof account.current_balance === 'number') {
          const balance = account.current_balance;
          console.log(`➕ Ajout au total: ${balance}`);
          return total + balance;
        }
        
        return total;
      }, 0);
      
      console.log('🎯 Solde total calculé:', total);
      return total;
      
    } catch (error) {
      console.error('❌ Erreur calcul solde total:', error);
      return 0;
    }
  };

  // ✅ OBTENIR LES STATISTIQUES DES COMPTES
  const getAccountsStats = () => {
    const activeAccounts = accounts.filter(acc => acc.is_active);
    const inactiveAccounts = accounts.filter(acc => !acc.is_active);
    
    const totalBalance = getTotalBalance();
    const positiveAccounts = activeAccounts.filter(acc => acc.current_balance > 0);
    const negativeAccounts = activeAccounts.filter(acc => acc.current_balance < 0);
    
    return {
      total: accounts.length,
      active: activeAccounts.length,
      inactive: inactiveAccounts.length,
      totalBalance,
      positiveBalance: positiveAccounts.reduce((sum, acc) => sum + acc.current_balance, 0),
      negativeBalance: negativeAccounts.reduce((sum, acc) => sum + acc.current_balance, 0),
      averageBalance: activeAccounts.length > 0 ? totalBalance / activeAccounts.length : 0
    };
  };

  // ✅ OBTENIR UN COMPTE PAR ID
  const getAccountById = (accountId) => {
    const numericId = normalizeId(accountId);
    return accounts.find(acc => acc.id === numericId) || null;
  };

  // ✅ FONCTION POUR FORCER LE RECHARGEMENT
  const refreshAccounts = async () => {
    console.log('🔄 === RECHARGEMENT FORCÉ DES COMPTES ===');
    await loadAccounts();
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE COMPTES
  useEffect(() => {
    const handleAccountsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT ACCOUNTS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement des comptes');
      loadAccounts();
    };

    console.log('👂 Installation du listener accountsChanged');
    window.addEventListener('accountsChanged', handleAccountsChanged);

    return () => {
      console.log('🧹 Nettoyage du listener accountsChanged');
      window.removeEventListener('accountsChanged', handleAccountsChanged);
    };
  }, [user?.id]);

  // ✅ CHARGEMENT INITIAL
  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Chargement initial des comptes pour user:', user.id);
      loadAccounts();
    } else {
      console.log('❌ Pas d\'utilisateur - reset des comptes');
      setAccounts([]);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
    loadAccounts,
    getTotalBalance,
    getAccountsStats,
    getAccountById,
    refreshAccounts,
    // Utilitaires
    normalizeId
  };
};