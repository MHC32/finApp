// src/hooks/useTransactions.js - VERSION CORRIGÉE COMPLÈTE
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../database/db';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ CORRECTION CRITIQUE: Fonction pour normaliser les IDs
  const normalizeId = (id) => {
    if (id === null || id === undefined) {
      console.warn('⚠️ ID null ou undefined détecté');
      return null;
    }
    
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(numericId)) {
      console.error('❌ ID invalide:', id);
      return null;
    }
    
    return numericId;
  };

  // ✅ CORRECTION: Fonction pour déclencher les mises à jour (simplifiée)
  const triggerUpdates = () => {
    console.log('📡 === DÉCLENCHEMENT MISES À JOUR ===');
    
    // Déclencher les événements dans l'ordre logique
    window.dispatchEvent(new CustomEvent('accountsChanged'));
    window.dispatchEvent(new CustomEvent('budgetsChanged'));
    window.dispatchEvent(new CustomEvent('transactionsChanged'));
    
    console.log('✅ Tous les événements de mise à jour émis');
  };

  // ✅ CORRECTION MAJEURE: Mise à jour simplifiée du solde
  const updateAccountBalance = async (accountId, transactionAmount) => {
    try {
      console.log('💰 === MISE À JOUR SOLDE COMPTE ===');
      
      const numericAccountId = normalizeId(accountId);
      if (!numericAccountId) {
        throw new Error(`ID de compte invalide: ${accountId}`);
      }

      console.log(`📊 Compte ID: ${numericAccountId}, Montant: ${transactionAmount}`);

      // Récupérer le compte
      const account = await db.accounts.get(numericAccountId);
      if (!account) {
        console.error(`❌ Compte ${numericAccountId} introuvable`);
        // Lister tous les comptes pour debug
        const allAccounts = await db.accounts.toArray();
        console.log('📋 Comptes disponibles:', allAccounts.map(acc => `${acc.id}: ${acc.name}`));
        throw new Error(`Compte ${numericAccountId} non trouvé`);
      }

      console.log(`✅ Compte trouvé: ${account.name} (Solde actuel: ${account.current_balance})`);

      // ✅ LOGIQUE SIMPLIFIÉE: Addition directe du montant calculé
      const currentBalance = parseFloat(account.current_balance) || 0;
      const amount = parseFloat(transactionAmount) || 0;
      const newBalance = currentBalance + amount;

      console.log(`🧮 Calcul: ${currentBalance} + ${amount} = ${newBalance}`);

      // Mettre à jour le solde
      await db.accounts.update(numericAccountId, {
        current_balance: newBalance,
        updated_at: new Date()
      });

      console.log(`✅ Solde mis à jour: ${account.name} → ${newBalance}`);
      return newBalance;

    } catch (error) {
      console.error('❌ Erreur mise à jour solde:', error);
      throw error;
    }
  };

  // ✅ CORRECTION: Charger les transactions
  const loadTransactions = async () => {
    if (!user?.id) {
      console.log('⚠️ Pas d\'utilisateur connecté');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📖 === CHARGEMENT TRANSACTIONS ===');
      console.log('👤 User ID:', user.id);

      const userTransactions = await db.transactions
        .where('user_id')
        .equals(user.id)
        .reverse()
        .sortBy('date');

      console.log(`✅ ${userTransactions.length} transactions chargées`);
      
      // Validation des données
      const validTransactions = userTransactions.filter(t => {
        const isValid = t.id && t.account_id && typeof t.amount === 'number';
        if (!isValid) {
          console.warn('⚠️ Transaction invalide ignorée:', t);
        }
        return isValid;
      });

      setTransactions(validTransactions);
      console.log(`📊 ${validTransactions.length} transactions valides chargées`);

    } catch (error) {
      console.error('❌ Erreur chargement transactions:', error);
      setError('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION MAJEURE: Ajouter une transaction
  const addTransaction = async (transactionData) => {
    try {
      console.log('➕ === AJOUT TRANSACTION (VERSION CORRIGÉE) ===');
      console.log('📥 Données reçues:', transactionData);

      // Validation des données essentielles
      if (!transactionData.type) {
        throw new Error('Type de transaction requis');
      }
      
      if (!transactionData.account_id) {
        throw new Error('Compte requis');
      }
      
      if (!transactionData.amount || parseFloat(transactionData.amount) === 0) {
        throw new Error('Montant requis et non nul');
      }

      // Normaliser l'ID du compte
      const accountId = normalizeId(transactionData.account_id);
      if (!accountId) {
        throw new Error('ID de compte invalide');
      }

      // ✅ CALCUL FINAL DU MONTANT (déjà fait dans le formulaire, mais on s'assure)
      let finalAmount = parseFloat(transactionData.amount);
      
      // Le montant doit déjà avoir le bon signe du formulaire, mais on vérifie
      switch (transactionData.type) {
        case 'income':
          finalAmount = Math.abs(finalAmount); // Toujours positif
          break;
        case 'expense':
          finalAmount = -Math.abs(finalAmount); // Toujours négatif
          break;
        case 'transfer':
          finalAmount = Math.abs(finalAmount); // Positif pour transferts
          break;
        default:
          throw new Error(`Type de transaction invalide: ${transactionData.type}`);
      }

      console.log(`💡 Montant final: ${finalAmount} (type: ${transactionData.type})`);

      // Préparer la nouvelle transaction
      const newTransaction = {
        user_id: user.id,
        account_id: accountId,
        description: transactionData.description.trim(),
        amount: finalAmount,
        type: transactionData.type,
        category: transactionData.category,
        payment_method: transactionData.payment_method || 'cash',
        date: new Date(transactionData.date),
        created_at: new Date(),
        updated_at: new Date()
      };

      console.log('💾 Transaction à sauvegarder:', newTransaction);

      // Sauvegarder la transaction
      const transactionId = await db.transactions.add(newTransaction);
      console.log('✅ Transaction sauvegardée avec ID:', transactionId);

      // Récupérer la transaction créée
      const createdTransaction = await db.transactions.get(transactionId);
      
      // ✅ MISE À JOUR DU SOLDE (logique simplifiée)
      await updateAccountBalance(accountId, finalAmount);

      // Mettre à jour le state local
      setTransactions(prev => [createdTransaction, ...prev]);

      // Déclencher les mises à jour
      triggerUpdates();

      console.log('🎉 === TRANSACTION AJOUTÉE AVEC SUCCÈS ===');
      return createdTransaction;

    } catch (error) {
      console.error('❌ === ERREUR AJOUT TRANSACTION ===', error);
      setError(error.message || 'Erreur lors de l\'ajout de la transaction');
      throw error;
    }
  };

  // ✅ CORRECTION MAJEURE: Modifier une transaction
  const updateTransaction = async (transactionId, updates) => {
    try {
      console.log('✏️ === MODIFICATION TRANSACTION ===');
      console.log('🎯 ID:', transactionId, 'Mises à jour:', updates);

      const numericTransactionId = normalizeId(transactionId);
      if (!numericTransactionId) {
        throw new Error('ID de transaction invalide');
      }

      // Récupérer l'ancienne transaction
      const oldTransaction = await db.transactions.get(numericTransactionId);
      if (!oldTransaction) {
        throw new Error('Transaction non trouvée');
      }

      console.log('📄 Ancienne transaction:', oldTransaction);

      // Calculer le nouveau montant si nécessaire
      let newAmount = updates.amount !== undefined ? parseFloat(updates.amount) : oldTransaction.amount;
      
      if (updates.type !== undefined || updates.amount !== undefined) {
        const transactionType = updates.type || oldTransaction.type;
        
        switch (transactionType) {
          case 'income':
            newAmount = Math.abs(newAmount);
            break;
          case 'expense':
            newAmount = -Math.abs(newAmount);
            break;
          case 'transfer':
            newAmount = Math.abs(newAmount);
            break;
        }
      }

      // Normaliser les IDs de comptes
      const oldAccountId = normalizeId(oldTransaction.account_id);
      const newAccountId = updates.account_id ? normalizeId(updates.account_id) : oldAccountId;

      if (!oldAccountId || !newAccountId) {
        throw new Error('IDs de compte invalides');
      }

      // Préparer les nouvelles données
      const updatedData = {
        ...updates,
        account_id: newAccountId,
        amount: newAmount,
        date: updates.date ? new Date(updates.date) : oldTransaction.date,
        updated_at: new Date()
      };

      console.log('📄 Nouvelles données:', updatedData);

      // ✅ GESTION DES SOLDES (logique simplifiée)
      // 1. Annuler l'effet de l'ancienne transaction
      await updateAccountBalance(oldAccountId, -oldTransaction.amount);
      console.log('💰 Ancien effet annulé');

      // 2. Appliquer l'effet de la nouvelle transaction
      await updateAccountBalance(newAccountId, newAmount);
      console.log('💰 Nouvel effet appliqué');

      // 3. Mettre à jour la transaction
      await db.transactions.update(numericTransactionId, updatedData);
      console.log('✅ Transaction mise à jour');

      // Récupérer la transaction mise à jour
      const updatedTransaction = await db.transactions.get(numericTransactionId);

      // Mettre à jour le state local
      setTransactions(prev =>
        prev.map(t => t.id === numericTransactionId ? updatedTransaction : t)
      );

      // Déclencher les mises à jour
      triggerUpdates();

      console.log('🎉 === TRANSACTION MODIFIÉE AVEC SUCCÈS ===');
      return updatedTransaction;

    } catch (error) {
      console.error('❌ === ERREUR MODIFICATION TRANSACTION ===', error);
      setError(error.message || 'Erreur lors de la modification de la transaction');
      throw error;
    }
  };

  // ✅ CORRECTION MAJEURE: Supprimer une transaction
  const deleteTransaction = async (transactionId) => {
    try {
      console.log('🗑️ === SUPPRESSION TRANSACTION ===');
      console.log('🎯 ID à supprimer:', transactionId);

      const numericTransactionId = normalizeId(transactionId);
      if (!numericTransactionId) {
        throw new Error('ID de transaction invalide');
      }

      // Récupérer la transaction à supprimer
      const transaction = await db.transactions.get(numericTransactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      console.log('📄 Transaction à supprimer:', transaction);

      const accountId = normalizeId(transaction.account_id);
      if (!accountId) {
        throw new Error('ID de compte invalide');
      }

      // ✅ ANNULER L'EFFET SUR LE SOLDE (logique simplifiée)
      await updateAccountBalance(accountId, -transaction.amount);
      console.log('💰 Effet sur le solde annulé');

      // Supprimer la transaction
      await db.transactions.delete(numericTransactionId);
      console.log('✅ Transaction supprimée de la base');

      // Mettre à jour le state local
      setTransactions(prev => prev.filter(t => t.id !== numericTransactionId));

      // Déclencher les mises à jour
      triggerUpdates();

      console.log('🎉 === TRANSACTION SUPPRIMÉE AVEC SUCCÈS ===');

    } catch (error) {
      console.error('❌ === ERREUR SUPPRESSION TRANSACTION ===', error);
      setError(error.message || 'Erreur lors de la suppression de la transaction');
      throw error;
    }
  };

  // ✅ FONCTION DE STATISTIQUES (améliorée)
  const getStats = (filters = {}) => {
    try {
      let filteredTransactions = transactions;

      // Filtrer par compte si spécifié
      if (filters.account_id) {
        const accountId = normalizeId(filters.account_id);
        if (accountId) {
          filteredTransactions = filteredTransactions.filter(t => 
            normalizeId(t.account_id) === accountId
          );
        }
      }

      // Filtrer par date si spécifié
      if (filters.dateFrom || filters.dateTo) {
        filteredTransactions = filteredTransactions.filter(t => {
          const transDate = new Date(t.date);
          
          if (filters.dateFrom && transDate < new Date(filters.dateFrom)) {
            return false;
          }
          
          if (filters.dateTo && transDate > new Date(filters.dateTo)) {
            return false;
          }
          
          return true;
        });
      }

      // Calculer les statistiques
      const income = filteredTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = filteredTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        income,
        expenses,
        net: income - expenses,
        count: filteredTransactions.length
      };

    } catch (error) {
      console.error('❌ Erreur calcul statistiques:', error);
      return { income: 0, expenses: 0, net: 0, count: 0 };
    }
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE TRANSACTIONS
  useEffect(() => {
    const handleTransactionsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT TRANSACTIONS CHANGED REÇU ===');
      loadTransactions();
    };

    console.log('👂 Installation du listener transactionsChanged');
    window.addEventListener('transactionsChanged', handleTransactionsChanged);

    return () => {
      console.log('🧹 Nettoyage du listener transactionsChanged');
      window.removeEventListener('transactionsChanged', handleTransactionsChanged);
    };
  }, [user?.id]);

  // Charger les transactions au montage
  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user?.id]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    getStats
  };
}