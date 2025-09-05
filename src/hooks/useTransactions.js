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

  // Ajouter une transaction
  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = {
        ...transactionData,
        user_id: user?.id,
        date: new Date(transactionData.date),
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const id = await db.transactions.add(newTransaction);
      
      // Mettre à jour le solde du compte
      if (transactionData.account_id) {
        const account = await db.accounts.get(transactionData.account_id);
        if (account) {
          const newBalance = account.current_balance + transactionData.amount;
          await db.accounts.update(transactionData.account_id, {
            current_balance: newBalance,
            updated_at: new Date()
          });
        }
      }
      
      const transaction = await db.transactions.get(id);
      setTransactions(prev => [transaction, ...prev]);
      return transaction;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la transaction');
      throw err;
    }
  };

  // Modifier une transaction
  const updateTransaction = async (id, updates) => {
    try {
      const oldTransaction = await db.transactions.get(id);
      
      await db.transactions.update(id, {
        ...updates,
        date: new Date(updates.date),
        updated_at: new Date()
      });
      
      // Recalculer le solde du compte si nécessaire
      if (oldTransaction.account_id && (
        oldTransaction.amount !== updates.amount || 
        oldTransaction.account_id !== updates.account_id
      )) {
        // Annuler l'ancienne transaction
        const oldAccount = await db.accounts.get(oldTransaction.account_id);
        if (oldAccount) {
          await db.accounts.update(oldTransaction.account_id, {
            current_balance: oldAccount.current_balance - oldTransaction.amount,
            updated_at: new Date()
          });
        }
        
        // Appliquer la nouvelle transaction
        const newAccount = await db.accounts.get(updates.account_id);
        if (newAccount) {
          await db.accounts.update(updates.account_id, {
            current_balance: newAccount.current_balance + updates.amount,
            updated_at: new Date()
          });
        }
      }
      
      const updatedTransaction = await db.transactions.get(id);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      return updatedTransaction;
    } catch (err) {
      setError('Erreur lors de la modification de la transaction');
      throw err;
    }
  };

  // Supprimer une transaction
  const deleteTransaction = async (id) => {
    try {
      const transaction = await db.transactions.get(id);
      
      // Mettre à jour le solde du compte
      if (transaction.account_id) {
        const account = await db.accounts.get(transaction.account_id);
        if (account) {
          await db.accounts.update(transaction.account_id, {
            current_balance: account.current_balance - transaction.amount,
            updated_at: new Date()
          });
        }
      }
      
      await db.transactions.delete(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la transaction');
      throw err;
    }
  };

  // Statistiques
  const getStats = () => {
    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return { income, expenses, net: income - expenses };
  };

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
