// src/hooks/useTransactions.js - VERSION MISE À JOUR avec déclenchement budgets
import { useState, useEffect } from 'react';
import { db } from '../database/db';
import { useAuthStore } from '../store/authStore';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // Charger toutes les transactions
  const loadTransactions = async (filters = {}) => {
    try {
      setLoading(true);
      let query = db.transactions.where('user_id').equals(user?.id);
      
      // Appliquer les filtres
      if (filters.account_id) {
        query = query.and(t => t.account_id === filters.account_id);
      }
      
      if (filters.category) {
        query = query.and(t => t.category === filters.category);
      }
      
      if (filters.dateFrom) {
        query = query.and(t => t.date >= filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.and(t => t.date <= filters.dateTo);
      }

      const userTransactions = await query
        .reverse()
        .sortBy('date');
      
      setTransactions(userTransactions);
    } catch (err) {
      setError('Erreur lors du chargement des transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FONCTION POUR DÉCLENCHER LES RECHARGEMENTS
  const triggerUpdates = () => {
    console.log("🔔 DEBUG: Déclenchement des mises à jour");
    
    // Déclencher le rechargement des comptes
    window.dispatchEvent(new CustomEvent('accountsChanged'));
    console.log("📡 DEBUG: Événement 'accountsChanged' émis");
    
    // ✅ NOUVEAU: Déclencher le rechargement des budgets
    window.dispatchEvent(new CustomEvent('budgetsChanged'));
    console.log("📡 DEBUG: Événement 'budgetsChanged' émis");
    
    // ✅ NOUVEAU: Déclencher le rechargement des transactions elles-mêmes
    window.dispatchEvent(new CustomEvent('transactionsChanged'));
    console.log("📡 DEBUG: Événement 'transactionsChanged' émis");
  };

  // Ajouter une transaction
  const addTransaction = async (transactionData) => {
    try {
      console.log('🟢 === DÉBUT ADD TRANSACTION ===');
      console.log('📥 Données reçues:', transactionData);
      
      // Préparer les données de transaction
      const newTransaction = {
        ...transactionData,
        user_id: user?.id,
        amount: parseFloat(transactionData.amount),
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

      // Mettre à jour le solde du compte
      const account = await db.accounts.get(transactionData.account_id);
      if (account) {
        const newBalance = parseFloat(account.current_balance) + parseFloat(transactionData.amount);
        
        console.log('💰 Mise à jour du solde:');
        console.log('  - Solde actuel:', account.current_balance);
        console.log('  - Montant transaction:', transactionData.amount);
        console.log('  - Nouveau solde:', newBalance);

        await db.accounts.update(transactionData.account_id, {
          current_balance: newBalance,
          updated_at: new Date()
        });

        console.log('✅ Solde du compte mis à jour');
      }

      // Mettre à jour le state local
      setTransactions(prev => [createdTransaction, ...prev]);

      // ✅ DÉCLENCHER TOUTES LES MISES À JOUR
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

  // Modifier une transaction
  const updateTransaction = async (id, updates) => {
    try {
      console.log('✏️ === DÉBUT UPDATE TRANSACTION ===');
      console.log('ID:', id, 'Updates:', updates);

      // Récupérer l'ancienne transaction pour calculer la différence
      const oldTransaction = await db.transactions.get(id);
      if (!oldTransaction) {
        throw new Error('Transaction non trouvée');
      }

      console.log('📄 Ancienne transaction:', oldTransaction);

      // Préparer les nouvelles données
      const updatedData = {
        ...updates,
        amount: parseFloat(updates.amount),
        date: new Date(updates.date),
        updated_at: new Date()
      };

      // Mettre à jour la transaction
      await db.transactions.update(id, updatedData);
      console.log('✅ Transaction mise à jour');

      // Recalculer les soldes si nécessaire
      if (updates.amount !== undefined || updates.account_id !== undefined) {
        // Annuler l'effet de l'ancienne transaction
        if (oldTransaction.account_id) {
          const oldAccount = await db.accounts.get(oldTransaction.account_id);
          if (oldAccount) {
            const revertedBalance = parseFloat(oldAccount.current_balance) - parseFloat(oldTransaction.amount);
            await db.accounts.update(oldTransaction.account_id, {
              current_balance: revertedBalance,
              updated_at: new Date()
            });
            console.log('💰 Solde ancien compte restauré:', revertedBalance);
          }
        }

        // Appliquer l'effet de la nouvelle transaction
        const newAccountId = updates.account_id || oldTransaction.account_id;
        const newAccount = await db.accounts.get(newAccountId);
        if (newAccount) {
          const newBalance = parseFloat(newAccount.current_balance) + parseFloat(updatedData.amount);
          await db.accounts.update(newAccountId, {
            current_balance: newBalance,
            updated_at: new Date()
          });
          console.log('💰 Nouveau solde appliqué:', newBalance);
        }
      }

      // Récupérer la transaction mise à jour
      const updatedTransaction = await db.transactions.get(id);
      
      // Mettre à jour le state local
      setTransactions(prev => 
        prev.map(transaction => transaction.id === id ? updatedTransaction : transaction)
      );

      // ✅ DÉCLENCHER TOUTES LES MISES À JOUR
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

  // Supprimer une transaction
  const deleteTransaction = async (id) => {
    try {
      console.log('🗑️ === DÉBUT DELETE TRANSACTION ===');
      console.log('ID:', id);

      // Récupérer la transaction à supprimer
      const transaction = await db.transactions.get(id);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      console.log('📄 Transaction à supprimer:', transaction);

      // Annuler l'effet sur le solde du compte
      if (transaction.account_id) {
        const account = await db.accounts.get(transaction.account_id);
        if (account) {
          const revertedBalance = parseFloat(account.current_balance) - parseFloat(transaction.amount);
          await db.accounts.update(transaction.account_id, {
            current_balance: revertedBalance,
            updated_at: new Date()
          });
          console.log('💰 Solde du compte restauré:', revertedBalance);
        }
      }

      // Supprimer la transaction
      await db.transactions.delete(id);
      console.log('✅ Transaction supprimée');

      // Mettre à jour le state local
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));

      // ✅ DÉCLENCHER TOUTES LES MISES À JOUR
      triggerUpdates();

      console.log('🎉 === FIN DELETE TRANSACTION SUCCÈS ===');

    } catch (err) {
      console.error('❌ === ERREUR DELETE TRANSACTION ===');
      console.error('Erreur détaillée:', err);
      setError('Erreur lors de la suppression de la transaction');
      throw err;
    }
  };

  // Obtenir les statistiques des transactions
  const getStats = (filters = {}) => {
    let filteredTransactions = transactions;

    // Appliquer les filtres pour les stats
    if (filters.dateFrom || filters.dateTo || filters.account_id || filters.category) {
      filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        
        if (filters.dateFrom && transactionDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && transactionDate > new Date(filters.dateTo)) return false;
        if (filters.account_id && transaction.account_id !== filters.account_id) return false;
        if (filters.category && transaction.category !== filters.category) return false;
        
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
};