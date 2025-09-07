// src/hooks/useTransactions.js - VERSION CORRIGÉE AVEC CONVERSION D'IDs
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../database/db';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ CORRECTION BUG CRITIQUE: Fonction pour convertir les IDs en nombres
  const ensureNumericId = (id) => {
    if (typeof id === 'string') {
      const numericId = parseInt(id, 10);
      console.log(`🔄 Conversion ID: "${id}" (string) → ${numericId} (number)`);
      return numericId;
    }
    return id;
  };

  // ✅ CORRECTION BUG 1: Fonction pour déclencher les mises à jour
  const triggerUpdates = () => {
    // Déclencher le rechargement des comptes
    window.dispatchEvent(new CustomEvent('accountsChanged'));
    console.log("📡 DEBUG: Événement 'accountsChanged' émis");
    
    // Déclencher le rechargement des budgets
    window.dispatchEvent(new CustomEvent('budgetsChanged'));
    console.log("📡 DEBUG: Événement 'budgetsChanged' émis");
    
    // Déclencher le rechargement des transactions elles-mêmes
    window.dispatchEvent(new CustomEvent('transactionsChanged'));
    console.log("📡 DEBUG: Événement 'transactionsChanged' émis");
  };

  // ✅ CORRECTION BUG 1: Fonction pour calculer et mettre à jour le solde d'un compte
  const updateAccountBalance = async (accountId, transactionAmount, operation = 'add') => {
    try {
      // ✅ CORRECTION CRITIQUE: Conversion de l'ID en nombre
      const numericAccountId = ensureNumericId(accountId);
      
      console.log(`💰 === MISE À JOUR SOLDE COMPTE ${numericAccountId} ===`);
      console.log(`Operation: ${operation}, Montant: ${transactionAmount}`);
      console.log(`ID original: ${accountId} (${typeof accountId}), ID converti: ${numericAccountId} (${typeof numericAccountId})`);
      
      const account = await db.accounts.get(numericAccountId);
      if (!account) {
        console.error(`❌ Compte ${numericAccountId} non trouvé dans la base de données`);
        // Lister tous les comptes pour debug
        const allAccounts = await db.accounts.toArray();
        console.log('📋 Tous les comptes disponibles:', allAccounts.map(acc => ({ id: acc.id, name: acc.name })));
        throw new Error(`Compte ${numericAccountId} non trouvé`);
      }
      
      console.log(`✅ Compte trouvé: ${account.name}`);
      console.log(`Solde actuel: ${account.current_balance} (${typeof account.current_balance})`);
      
      let newBalance;
      const currentBalance = parseFloat(account.current_balance);
      const amount = parseFloat(transactionAmount);
      
      if (operation === 'add') {
        // ✅ CORRECTION BUG 1: Addition directe du montant (déjà calculé dans le formulaire)
        newBalance = currentBalance + amount;
      } else if (operation === 'remove') {
        // Pour la suppression, on fait l'inverse
        newBalance = currentBalance - amount;
      } else if (operation === 'update') {
        // Pour la modification, on utilise le montant tel quel
        newBalance = currentBalance + amount;
      }
      
      console.log(`Nouveau solde calculé: ${newBalance}`);
      
      await db.accounts.update(numericAccountId, {
        current_balance: newBalance,
        updated_at: new Date()
      });
      
      console.log(`✅ Solde du compte ${account.name} mis à jour: ${newBalance}`);
      return newBalance;
      
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du solde:', err);
      throw err;
    }
  };

  // Charger les transactions
  const loadTransactions = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      console.log('📖 === CHARGEMENT DES TRANSACTIONS ===');
      console.log('User ID:', user.id);

      const userTransactions = await db.transactions
        .where('user_id')
        .equals(user.id)
        .reverse()
        .sortBy('date');

      console.log(`✅ ${userTransactions.length} transactions chargées`);
      setTransactions(userTransactions);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des transactions:', err);
      setError('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION BUG 1: Ajouter une transaction avec gestion de type améliorée
  const addTransaction = async (transactionData) => {
    try {
      console.log('🟢 === DÉBUT ADD TRANSACTION (VERSION CORRIGÉE) ===');
      console.log('📥 Données reçues:', transactionData);
      
      // ✅ CORRECTION BUG 1: Validation du montant selon le type
      if (!transactionData.type) {
        throw new Error('Type de transaction requis');
      }
      
      // ✅ CORRECTION CRITIQUE: Conversion de l'account_id en nombre
      const numericAccountId = ensureNumericId(transactionData.account_id);
      
      // ✅ CORRECTION BUG 1: Assurer que le montant est correctement formaté
      let finalAmount = parseFloat(transactionData.amount);
      
      // Le montant devrait déjà être calculé dans le formulaire, mais on double-check
      switch (transactionData.type) {
        case 'income':
          finalAmount = Math.abs(finalAmount); // Toujours positif
          break;
        case 'expense':
          finalAmount = -Math.abs(finalAmount); // Toujours négatif
          break;
        case 'transfer':
          finalAmount = Math.abs(finalAmount); // Positif pour les transferts
          break;
        default:
          throw new Error('Type de transaction invalide');
      }
      
      console.log(`💡 Montant final calculé: ${finalAmount} (type: ${transactionData.type})`);
      
      // Préparer les données de transaction
      const newTransaction = {
        ...transactionData,
        user_id: user?.id,
        account_id: numericAccountId, // ✅ CORRECTION: Utiliser l'ID numérique
        amount: finalAmount,
        date: new Date(transactionData.date),
        created_at: new Date(),
        updated_at: new Date()
      };

      console.log('💾 Données à sauvegarder:', newTransaction);

      // Sauvegarder la transaction
      const transactionId = await db.transactions.add(newTransaction);
      console.log('✅ Transaction sauvegardée avec ID:', transactionId);

      // Récupérer la transaction créée
      const createdTransaction = await db.transactions.get(transactionId);
      console.log('📄 Transaction créée:', createdTransaction);

      // ✅ CORRECTION BUG 1: Mettre à jour le solde du compte avec la nouvelle logique
      await updateAccountBalance(numericAccountId, finalAmount, 'add');

      // Mettre à jour le state local
      setTransactions(prev => [createdTransaction, ...prev]);

      // Déclencher toutes les mises à jour
      triggerUpdates();

      console.log('🎉 === FIN ADD TRANSACTION SUCCÈS ===');
      return createdTransaction;

    } catch (err) {
      console.error('❌ === ERREUR ADD TRANSACTION ===');
      console.error('Erreur détaillée:', err);
      setError('Erreur lors de l\'ajout de la transaction');
      throw err;
    }
  };

  // ✅ CORRECTION BUG 1: Modifier une transaction avec gestion améliorée
  const updateTransaction = async (id, updates) => {
    try {
      console.log('✏️ === DÉBUT UPDATE TRANSACTION (VERSION CORRIGÉE) ===');
      console.log('ID:', id, 'Updates:', updates);

      // ✅ CORRECTION CRITIQUE: Conversion de l'ID de transaction
      const numericTransactionId = ensureNumericId(id);

      // Récupérer l'ancienne transaction
      const oldTransaction = await db.transactions.get(numericTransactionId);
      if (!oldTransaction) {
        throw new Error('Transaction non trouvée');
      }

      console.log('📄 Ancienne transaction:', oldTransaction);

      // ✅ CORRECTION BUG 1: Calculer le nouveau montant si le type ou le montant change
      let finalAmount = updates.amount !== undefined ? parseFloat(updates.amount) : oldTransaction.amount;
      
      if (updates.type !== undefined || updates.amount !== undefined) {
        const transactionType = updates.type || oldTransaction.type;
        
        switch (transactionType) {
          case 'income':
            finalAmount = Math.abs(finalAmount);
            break;
          case 'expense':
            finalAmount = -Math.abs(finalAmount);
            break;
          case 'transfer':
            finalAmount = Math.abs(finalAmount);
            break;
        }
      }

      // ✅ CORRECTION CRITIQUE: Conversion des account_ids
      const oldAccountId = ensureNumericId(oldTransaction.account_id);
      const newAccountId = updates.account_id ? ensureNumericId(updates.account_id) : oldAccountId;

      // Préparer les nouvelles données
      const updatedData = {
        ...updates,
        account_id: newAccountId, // ✅ CORRECTION: Utiliser l'ID numérique
        amount: finalAmount,
        date: updates.date ? new Date(updates.date) : oldTransaction.date,
        updated_at: new Date()
      };

      console.log('📄 Nouvelles données:', updatedData);

      // ✅ CORRECTION BUG 1: Gestion des changements de solde
      // Annuler l'effet de l'ancienne transaction
      await updateAccountBalance(oldAccountId, -oldTransaction.amount, 'add');
      console.log('💰 Ancien effet annulé');

      // Appliquer l'effet de la nouvelle transaction
      await updateAccountBalance(newAccountId, finalAmount, 'add');
      console.log('💰 Nouvel effet appliqué');

      // Mettre à jour la transaction
      await db.transactions.update(numericTransactionId, updatedData);
      console.log('✅ Transaction mise à jour');

      // Récupérer la transaction mise à jour
      const updatedTransaction = await db.transactions.get(numericTransactionId);
      
      // Mettre à jour le state local
      setTransactions(prev => 
        prev.map(transaction => transaction.id === numericTransactionId ? updatedTransaction : transaction)
      );

      // Déclencher les mises à jour
      triggerUpdates();

      console.log('🎉 === FIN UPDATE TRANSACTION SUCCÈS ===');
      return updatedTransaction;

    } catch (err) {
      console.error('❌ === ERREUR UPDATE TRANSACTION ===');
      console.error('Erreur détaillée:', err);
      setError('Erreur lors de la modification de la transaction');
      throw err;
    }
  };

  // ✅ CORRECTION BUG 1: Supprimer une transaction avec gestion de solde
  const deleteTransaction = async (id) => {
    try {
      console.log('🗑️ === DÉBUT DELETE TRANSACTION (VERSION CORRIGÉE) ===');
      console.log('ID à supprimer:', id);

      // ✅ CORRECTION CRITIQUE: Conversion de l'ID en nombre
      const numericTransactionId = ensureNumericId(id);

      // Récupérer la transaction à supprimer
      const transaction = await db.transactions.get(numericTransactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      console.log('📄 Transaction à supprimer:', transaction);

      // ✅ CORRECTION CRITIQUE: Conversion de l'account_id
      const accountId = ensureNumericId(transaction.account_id);

      // ✅ CORRECTION BUG 1: Annuler l'effet sur le solde
      await updateAccountBalance(accountId, -transaction.amount, 'add');
      console.log('💰 Effet sur le solde annulé');

      // Supprimer la transaction
      await db.transactions.delete(numericTransactionId);
      console.log('✅ Transaction supprimée de la base');

      // Mettre à jour le state local
      setTransactions(prev => prev.filter(t => t.id !== numericTransactionId));

      // Déclencher les mises à jour
      triggerUpdates();

      console.log('🎉 === FIN DELETE TRANSACTION SUCCÈS ===');

    } catch (err) {
      console.error('❌ === ERREUR DELETE TRANSACTION ===');
      console.error('Erreur détaillée:', err);
      setError('Erreur lors de la suppression de la transaction');
      throw err;
    }
  };

  // Obtenir des statistiques
  const getStats = (filters = {}) => {
    let filteredTransactions = transactions;

    // Appliquer les filtres si fournis
    if (filters.account_id) {
      const numericAccountId = ensureNumericId(filters.account_id);
      filteredTransactions = filteredTransactions.filter(t => 
        ensureNumericId(t.account_id) === numericAccountId
      );
    }

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
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE TRANSACTIONS
  useEffect(() => {
    const handleTransactionsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT TRANSACTIONS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement des transactions');
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