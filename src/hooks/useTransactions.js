// src/hooks/useTransactions.js - VERSION DEBUG
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
    console.log("🔔 DEBUG: triggerAccountsReload() appelée");
    // Émettre un événement personnalisé pour signaler aux autres hooks
    window.dispatchEvent(new CustomEvent('accountsChanged'));
    console.log("📡 DEBUG: Événement 'accountsChanged' émis");
  };

  // Ajouter une transaction
  const addTransaction = async (transactionData) => {
    try {
      console.log('🟢 === DÉBUT ADD TRANSACTION ===');
      console.log('📥 Données reçues:', transactionData);
      
      // ✅ VÉRIFIER LES TYPES DE DONNÉES
      console.log('🔍 Types de données:');
      console.log('- amount type:', typeof transactionData.amount, 'value:', transactionData.amount);
      console.log('- account_id type:', typeof transactionData.account_id, 'value:', transactionData.account_id);
      
      const newTransaction = {
        ...transactionData,
        user_id: user?.id,
        date: new Date(transactionData.date),
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('💾 Transaction à sauvegarder:', newTransaction);
      
      const id = await db.transactions.add(newTransaction);
      console.log('✅ Transaction sauvegardée avec ID:', id);
      
      // ✅ METTRE À JOUR LE SOLDE DU COMPTE
      if (transactionData.account_id) {
        console.log('\n💳 === MISE À JOUR DU COMPTE ===');
        console.log(`🎯 Compte ciblé ID: ${transactionData.account_id}`);
        console.log(`💵 Montant de la transaction: ${transactionData.amount}`);
        
        // ✅ FIX: Conversion du account_id en nombre
        const accountId = parseInt(transactionData.account_id);
        console.log(`🔄 Conversion account_id: "${transactionData.account_id}" → ${accountId}`);
        
        const account = await db.accounts.get(accountId);
        console.log('📊 Compte trouvé:', account);
        
        if (account) {
          console.log(`💰 Solde AVANT: ${account.current_balance} (type: ${typeof account.current_balance})`);
          
          // ✅ CONVERSION EXPLICITE EN NOMBRE
          const currentBalance = parseFloat(account.current_balance) || 0;
          const transactionAmount = parseFloat(transactionData.amount) || 0;
          
          console.log(`🔢 Conversion - Solde: ${currentBalance}, Transaction: ${transactionAmount}`);
          
          // ✅ CALCUL AVEC LOGS DÉTAILLÉS
          const newBalance = currentBalance + transactionAmount;
          
          console.log(`🧮 Calcul: ${currentBalance} + (${transactionAmount}) = ${newBalance}`);
          console.log(`💰 Solde APRÈS: ${newBalance}`);
          
          await db.accounts.update(accountId, {
            current_balance: newBalance,
            updated_at: new Date()
          });
          
          console.log('✅ Compte mis à jour en base de données');
          
          // ✅ VÉRIFIER LA MISE À JOUR
          const updatedAccount = await db.accounts.get(accountId);
          console.log('🔍 Vérification - Nouveau solde en DB:', updatedAccount.current_balance);
          
          // ✅ DÉCLENCHER LE RECHARGEMENT DES COMPTES
          triggerAccountsReload();
          
          console.log('✅ Processus de mise à jour terminé avec succès');
        } else {
          console.error('❌ ERREUR: Compte non trouvé pour ID:', accountId, '(converti depuis:', transactionData.account_id, ')');
        }
      } else {
        console.warn('⚠️ ATTENTION: Aucun account_id fourni');
      }
      
      const transaction = await db.transactions.get(id);
      setTransactions(prev => [transaction, ...prev]);
      
      console.log('🟢 === FIN ADD TRANSACTION ===\n');
      return transaction;
    } catch (err) {
      console.error('❌ === ERREUR ADD TRANSACTION ===');
      console.error('💥 Erreur détaillée:', err);
      console.error('📍 Stack trace:', err.stack);
      setError('Erreur lors de l\'ajout de la transaction');
      throw err;
    }
  };

  // Modifier une transaction
  const updateTransaction = async (id, updates) => {
    try {
      console.log('🟡 === DÉBUT UPDATE TRANSACTION ===');
      console.log('🎯 Transaction ID:', id);
      console.log('📝 Mises à jour:', updates);
      
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
          const oldAccountId = parseInt(oldTransaction.account_id);
          const oldAccount = await db.accounts.get(oldAccountId);
          if (oldAccount) {
            console.log(`🔙 Annulation sur compte ${oldAccount.name}: ${oldTransaction.amount}`);
            const restoredBalance = parseFloat(oldAccount.current_balance) - parseFloat(oldTransaction.amount);
            
            await db.accounts.update(oldAccountId, {
              current_balance: restoredBalance,
              updated_at: new Date()
            });
            
            console.log(`💰 Solde restauré: ${restoredBalance}`);
          }
        }
        
        // ✅ APPLIQUER LA NOUVELLE TRANSACTION
        if (updates.account_id) {
          const newAccountId = parseInt(updates.account_id);
          const newAccount = await db.accounts.get(newAccountId);
          if (newAccount) {
            console.log(`➕ Application sur compte ${newAccount.name}: ${updates.amount}`);
            const newBalance = parseFloat(newAccount.current_balance) + parseFloat(updates.amount);
            
            await db.accounts.update(newAccountId, {
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
      
      console.log('🟡 === FIN UPDATE TRANSACTION ===\n');
      return updatedTransaction;
    } catch (err) {
      console.error('❌ Erreur lors de la modification:', err);
      setError('Erreur lors de la modification de la transaction');
      throw err;
    }
  };

  // Supprimer une transaction
  // Supprimer une transaction
const deleteTransaction = async (id) => {
  try {
    console.log('🔴 === DÉBUT DELETE TRANSACTION ===');
    console.log('🗑️ Suppression transaction ID:', id);
    
    const transaction = await db.transactions.get(id);
    console.log('📋 Transaction à supprimer:', transaction);
    
    // ✅ METTRE À JOUR LE SOLDE DU COMPTE
    if (transaction.account_id) {
      // CORRECTION: Utiliser transaction.account_id directement
      const account = await db.accounts.get(transaction.account_id);
      if (account) {
        console.log(`🔙 Annulation du montant ${transaction.amount} sur ${account.name}`);
        console.log(`💰 Solde avant suppression: ${account.current_balance}`);
        
        // ✅ CONVERSION ET CALCUL
        const currentBalance = parseFloat(account.current_balance);
        const transactionAmount = parseFloat(transaction.amount);
        const newBalance = currentBalance - transactionAmount;
        
        console.log(`🧮 Calcul: ${currentBalance} - (${transactionAmount}) = ${newBalance}`);
        
        // CORRECTION: Utiliser transaction.account_id au lieu de accountId
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
    
    console.log('🔴 === FIN DELETE TRANSACTION ===\n');
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