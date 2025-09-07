// src/hooks/useAccounts.js - VERSION CORRIGÉE AVEC MAPPING DES CHAMPS
import { useState, useEffect } from 'react';
import { db } from '../database/db';
import { useAuthStore } from '../store/authStore';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ FONCTION POUR NORMALISER LES IDS (inchangée)
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

  // ✅ CORRECTION MAJEURE: Fonction de mapping intelligent des champs
  const mapAccountFields = (inputData) => {
    console.log('🔄 === MAPPING DES CHAMPS COMPTE ===');
    console.log('📥 Données d\'entrée:', inputData);
    
    // Créer un objet de sortie normalisé
    const mappedData = {};
    
    // ✅ MAPPING INTELLIGENT DES CHAMPS
    
    // Nom du compte
    mappedData.name = inputData.name || inputData.account_name || '';
    
    // Type de compte (plusieurs variantes possibles)
    mappedData.type = inputData.type || inputData.account_type || '';
    
    // Solde - gérer initial_balance ET current_balance
    if (inputData.initial_balance !== undefined) {
      mappedData.initial_balance = inputData.initial_balance;
    } else if (inputData.current_balance !== undefined) {
      mappedData.initial_balance = inputData.current_balance;
    } else {
      mappedData.initial_balance = undefined;
    }
    
    // Banque
    mappedData.bank = inputData.bank || inputData.bank_name || '';
    
    // Devise
    mappedData.currency = inputData.currency || 'HTG';
    
    // Numéro de compte
    mappedData.account_number = inputData.account_number || inputData.number || '';
    
    // Statut actif
    mappedData.is_active = inputData.is_active !== undefined ? inputData.is_active : true;
    
    // Description
    mappedData.description = inputData.description || inputData.notes || '';
    
    // Couleur
    mappedData.color = inputData.color || '#3B82F6';
    
    console.log('📤 Données mappées:', mappedData);
    return mappedData;
  };

  // ✅ CORRECTION MAJEURE: Validation avec mapping automatique
  const validateAccountData = (rawAccountData) => {
    console.log('🔍 === VALIDATION DONNÉES COMPTE ===');
    
    // Étape 1: Mapper les champs vers le format attendu
    const accountData = mapAccountFields(rawAccountData);
    
    const errors = [];
    
    // Validation du nom
    if (!accountData.name?.trim()) {
      errors.push('Nom du compte requis');
    } else if (accountData.name.trim().length < 2) {
      errors.push('Nom du compte trop court (min. 2 caractères)');
    }
    
    // Validation du solde initial
    if (accountData.initial_balance === undefined || accountData.initial_balance === null) {
      errors.push('Solde initial requis');
    } else {
      const balance = parseFloat(accountData.initial_balance);
      if (isNaN(balance)) {
        errors.push('Solde initial invalide (doit être un nombre)');
      } else if (balance < -999999999) {
        errors.push('Solde initial trop faible');
      } else if (balance > 999999999) {
        errors.push('Solde initial trop élevé');
      }
    }
    
    // Validation du type
    if (!accountData.type?.trim()) {
      errors.push('Type de compte requis');
    } else {
      const validTypes = ['checking', 'savings', 'credit', 'investment', 'cash', 'other'];
      if (!validTypes.includes(accountData.type)) {
        errors.push(`Type de compte invalide. Types valides: ${validTypes.join(', ')}`);
      }
    }
    
    // Validation de la devise
    if (!accountData.currency?.trim()) {
      errors.push('Devise requise');
    } else {
      const validCurrencies = ['HTG', 'USD', 'EUR'];
      if (!validCurrencies.includes(accountData.currency)) {
        errors.push(`Devise invalide. Devises valides: ${validCurrencies.join(', ')}`);
      }
    }
    
    // Validation de la couleur (format hexadécimal)
    if (accountData.color && !/^#[0-9A-F]{6}$/i.test(accountData.color)) {
      errors.push('Format de couleur invalide (ex: #3B82F6)');
    }
    
    console.log(`📊 Validation terminée: ${errors.length} erreur(s)`);
    if (errors.length > 0) {
      console.log('❌ Erreurs trouvées:', errors);
    }
    
    return { isValid: errors.length === 0, errors, mappedData: accountData };
  };

  // ✅ CHARGER TOUS LES COMPTES (inchangé mais documenté)
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
      
      // Validation et nettoyage des données
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
      
      // Trier les comptes (actifs en premier, puis par nom)
      const sortedAccounts = validAccounts.sort((a, b) => {
        if (a.is_active !== b.is_active) {
          return a.is_active ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
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

  // ✅ CORRECTION MAJEURE: Ajouter un compte avec validation et mapping complets
  const addAccount = async (rawAccountData) => {
    try {
      console.log('➕ === AJOUT COMPTE (VERSION CORRIGÉE) ===');
      console.log('📥 Données brutes reçues:', rawAccountData);
      
      // Étape 1: Validation avec mapping automatique
      const validation = validateAccountData(rawAccountData);
      
      if (!validation.isValid) {
        const errorMessage = `Données invalides: ${validation.errors.join(', ')}`;
        console.error('❌ Validation échouée:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const accountData = validation.mappedData;
      console.log('✅ Données validées et mappées:', accountData);
      
      // Étape 2: Vérifier l'unicité du nom
      const existingAccount = accounts.find(acc => 
        acc.name.toLowerCase().trim() === accountData.name.toLowerCase().trim()
      );
      
      if (existingAccount) {
        const errorMessage = 'Un compte avec ce nom existe déjà';
        console.error('❌ Nom en doublon:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Étape 3: Préparer les données pour la base de données
      const initialBalance = parseFloat(accountData.initial_balance) || 0;
      
      const newAccount = {
        user_id: user.id,
        name: accountData.name.trim(),
        type: accountData.type,
        bank: accountData.bank?.trim() || '',
        account_number: accountData.account_number?.trim() || '',
        currency: accountData.currency,
        initial_balance: initialBalance,
        current_balance: initialBalance, // Le solde courant commence au solde initial
        is_active: accountData.is_active,
        description: accountData.description?.trim() || '',
        color: accountData.color || '#3B82F6',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('💾 Compte à sauvegarder en base:', newAccount);
      
      // Étape 4: Sauvegarder en base de données
      const accountId = await db.accounts.add(newAccount);
      console.log('✅ Compte sauvegardé avec ID:', accountId);
      
      // Étape 5: Récupérer le compte créé
      const createdAccount = await db.accounts.get(accountId);
      console.log('📄 Compte récupéré de la base:', createdAccount);
      
      // Étape 6: Mettre à jour le state local
      setAccounts(prev => {
        const updated = [...prev, createdAccount].sort((a, b) => {
          if (a.is_active !== b.is_active) {
            return a.is_active ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        
        console.log(`🔄 State comptes mis à jour: ${updated.length} comptes total`);
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

  // ✅ MODIFIER UN COMPTE (avec validation améliorée)
  const updateAccount = async (accountId, rawUpdates) => {
    try {
      console.log('✏️ === MODIFICATION COMPTE ===');
      console.log('🎯 Compte ID:', accountId, 'Mises à jour brutes:', rawUpdates);
      
      const numericAccountId = normalizeId(accountId);
      if (!numericAccountId) {
        throw new Error('ID de compte invalide');
      }
      
      // Vérifier que le compte existe
      const existingAccount = await db.accounts.get(numericAccountId);
      if (!existingAccount) {
        throw new Error('Compte non trouvé');
      }
      
      // Mapper et valider les mises à jour (seulement les champs modifiés)
      const updates = mapAccountFields(rawUpdates);
      
      // Validation spécifique pour les mises à jour
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
      
      // Préparer les données de mise à jour
      const updateData = {
        ...updates,
        updated_at: new Date()
      };
      
      // Nettoyer les champs texte
      if (updateData.bank) updateData.bank = updateData.bank.trim();
      if (updateData.account_number) updateData.account_number = updateData.account_number.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      
      console.log('📄 Données de mise à jour finales:', updateData);
      
      // Mettre à jour en base
      await db.accounts.update(numericAccountId, updateData);
      console.log('✅ Compte mis à jour en base');
      
      // Récupérer le compte mis à jour
      const updatedAccount = await db.accounts.get(numericAccountId);
      
      // Mettre à jour le state local
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

  // ✅ SUPPRIMER UN COMPTE (inchangé mais sécurisé)
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
      
      // Vérifier s'il y a des transactions liées
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
      
      // Mettre à jour le state local
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

  // ✅ FONCTIONS UTILITAIRES (inchangées)
  
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

  const getAccountById = (accountId) => {
    const numericId = normalizeId(accountId);
    return accounts.find(acc => acc.id === numericId) || null;
  };

  const refreshAccounts = async () => {
    console.log('🔄 === RECHARGEMENT FORCÉ DES COMPTES ===');
    await loadAccounts();
  };

  // ✅ EVENT LISTENERS (inchangés)
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

  // Chargement initial
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
    normalizeId,
    // ✅ NOUVELLES FONCTIONS EXPOSÉES POUR DEBUG
    mapAccountFields,
    validateAccountData
  };
};