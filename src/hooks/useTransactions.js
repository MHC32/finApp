// src/hooks/useTransactions.js - VERSION CORRIGÉE
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

  // ✅ FONCTION POUR DÉCLENCHER LE RECHARGEMENT DES COMPTES
  const triggerAccountsReload = () => {
    // Émettre un événement personnalisé pour signaler aux autres hooks
    window.dispatchEvent(new CustomEvent('accountsChanged'));
  };

  // Ajouter une transaction
  const addTransaction = async (transactionData) => {
    try {
      console.log('💰 Ajout transaction:', transactionData);
      
      const newTransaction = {
        ...transactionData,
        user_id: user?.id,
        date: new Date(transactionData.date),
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const id = await db.transactions.add(newTransaction);
      
      // ✅ METTRE À JOUR LE SOLDE DU COMPTE
      if (transactionData.account_id) {
        console.log(`💳 Mise à jour du compte ${transactionData.account_id}`);
        console.log(`💵 Montant: ${transactionData.amount}`);
        
        const account = await db.accounts.get(transactionData.account_id);
        if (account) {
          console.log(`💰 Solde avant: ${account.current_balance}`);
          
          // ✅ LOGIQUE CORRIGÉE: Ajouter le montant tel quel (négatif pour dépenses)
          const newBalance = account.current_balance + transactionData.amount;
          
          console.log(`💰 Solde après: ${newBalance}`);
          
          await db.accounts.update(transactionData.account_id, {
            current_balance: newBalance,
            updated_at: new Date()
          });
          
          // ✅ DÉCLENCHER LE RECHARGEMENT DES COMPTES
          triggerAccountsReload();
          
          console.log('✅ Compte mis à jour avec succès');
        } else {
          console.error('❌ Compte non trouvé');
        }
      }
      
      const transaction = await db.transactions.get(id);
      setTransactions(prev => [transaction, ...prev]);
      return transaction;
    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout de la transaction');
      throw err;
    }
  };

  // Modifier une transaction
  const updateTransaction = async (id, updates) => {
    try {
      console.log('✏️ Modification transaction:', id, updates);
      
      const oldTransaction = await db.transactions.get(id);
      console.log('📋 Ancienne transaction:', oldTransaction);
      
      await db.transactions.update(id, {
        ...updates,
        date: new Date(updates.date),
        updated_at: new Date()
      });
      
      // ✅ RECALCULER LE SOLDE DU COMPTE SI NÉCESSAIRE
      if (oldTransaction.account_id && (
        oldTransaction.amount !== updates.amount || 
        oldTransaction.account_id !== updates.account_id
      )) {
        console.log('🔄 Recalcul des soldes nécessaire');
        
        // ✅ ANNULER L'ANCIENNE TRANSACTION
        if (oldTransaction.account_id) {
          const oldAccount = await db.accounts.get(oldTransaction.account_id);
          if (oldAccount) {
            console.log(`🔙 Annulation sur compte ${oldAccount.name}: ${oldTransaction.amount}`);
            const restoredBalance = oldAccount.current_balance - oldTransaction.amount;
            
            await db.accounts.update(oldTransaction.account_id, {
              current_balance: restoredBalance,
              updated_at: new Date()
            });
            
            console.log(`💰 Solde restauré: ${restoredBalance}`);
          }
        }
        
        // ✅ APPLIQUER LA NOUVELLE TRANSACTION
        if (updates.account_id) {
          const newAccount = await db.accounts.get(updates.account_id);
          if (newAccount) {
            console.log(`➕ Application sur compte ${newAccount.name}: ${updates.amount}`);
            const newBalance = newAccount.current_balance + updates.amount;
            
            await db.accounts.update(updates.account_id, {
              current_balance: newBalance,
              updated_at: new Date()
            });
            
            console.log(`💰 Nouveau solde: ${newBalance}`);
          }
        }
        
        // ✅ DÉCLENCHER LE RECHARGEMENT DES COMPTES
        triggerAccountsReload();
        console.log('✅ Soldes mis à jour avec succès');
      }
      
      const updatedTransaction = await db.transactions.get(id);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      return updatedTransaction;
    } catch (err) {
      console.error('❌ Erreur lors de la modification:', err);
      setError('Erreur lors de la modification de la transaction');
      throw err;
    }
  };

  // Supprimer une transaction
  const deleteTransaction = async (id) => {
    try {
      console.log('🗑️ Suppression transaction:', id);
      
      const transaction = await db.transactions.get(id);
      console.log('📋 Transaction à supprimer:', transaction);
      
      // ✅ METTRE À JOUR LE SOLDE DU COMPTE
      if (transaction.account_id) {
        const account = await db.accounts.get(transaction.account_id);
        if (account) {
          console.log(`🔙 Annulation du montant ${transaction.amount} sur ${account.name}`);
          console.log(`💰 Solde avant suppression: ${account.current_balance}`);
          
          // ✅ LOGIQUE CORRIGÉE: Soustraire le montant de la transaction
          const newBalance = account.current_balance - transaction.amount;
          
          console.log(`💰 Solde après suppression: ${newBalance}`);
          
          await db.accounts.update(transaction.account_id, {
            current_balance: newBalance,
            updated_at: new Date()
          });
          
          // ✅ DÉCLENCHER LE RECHARGEMENT DES COMPTES
          triggerAccountsReload();
          console.log('✅ Solde mis à jour après suppression');
        }
      }
      
      await db.transactions.delete(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      console.log('✅ Transaction supprimée avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
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