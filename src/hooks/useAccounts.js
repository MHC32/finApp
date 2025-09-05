// src/hooks/useAccounts.js - VERSION DEBUG avec synchronisation
import { useState, useEffect } from 'react';
import { db } from '../database/db';
import { useAuthStore } from '../store/authStore';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // Charger tous les comptes
  const loadAccounts = async () => {
    try {
      setLoading(true);
      console.log('🔄 === RECHARGEMENT DES COMPTES ===');
      console.log('👤 User ID:', user?.id);
      
      const userAccounts = await db.accounts
        .where('user_id')
        .equals(user?.id)
        .toArray();
      
      console.log('📊 Comptes chargés depuis la DB:', userAccounts.length);
      userAccounts.forEach((account, index) => {
        console.log(`📋 Compte ${index + 1}:`, {
          id: account.id,
          name: account.name,
          current_balance: account.current_balance,
          balance_type: typeof account.current_balance
        });
      });
      
      setAccounts(userAccounts);
      console.log('✅ State des comptes mis à jour');
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
      console.error('❌ Erreur loadAccounts:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE COMPTES
  useEffect(() => {
    const handleAccountsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT ACCOUNTS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement des comptes');
      loadAccounts();
    };

    console.log('👂 Installation du listener accountsChanged');
    // Écouter l'événement personnalisé
    window.addEventListener('accountsChanged', handleAccountsChanged);

    // Nettoyer l'écouteur au démontage
    return () => {
      console.log('🧹 Nettoyage du listener accountsChanged');
      window.removeEventListener('accountsChanged', handleAccountsChanged);
    };
  }, [user?.id]);

  // Ajouter un compte
  const addAccount = async (accountData) => {
    try {
      console.log('➕ === AJOUT COMPTE ===');
      console.log('📥 Données reçues:', accountData);
      
      const newAccount = {
        ...accountData,
        user_id: user?.id,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('💾 Compte à sauvegarder:', newAccount);
      
      const id = await db.accounts.add(newAccount);
      const account = await db.accounts.get(id);
      
      console.log('✅ Compte ajouté avec ID:', id);
      console.log('📊 Compte récupéré:', account);
      
      setAccounts(prev => {
        const updated = [...prev, account];
        console.log('🔄 State accounts mis à jour, nouveau total:', updated.length);
        return updated;
      });
      
      return account;
    } catch (err) {
      console.error('❌ Erreur ajout compte:', err);
      setError('Erreur lors de l\'ajout du compte');
      throw err;
    }
  };

  // Modifier un compte
  const updateAccount = async (id, updates) => {
    try {
      console.log('✏️ === MODIFICATION COMPTE ===');
      console.log('🎯 Compte ID:', id);
      console.log('📝 Mises à jour:', updates);
      
      await db.accounts.update(id, {
        ...updates,
        updated_at: new Date()
      });
      
      const updatedAccount = await db.accounts.get(id);
      console.log('✅ Compte modifié:', updatedAccount);
      
      setAccounts(prev => 
        prev.map(account => 
          account.id === id ? updatedAccount : account
        )
      );
      return updatedAccount;
    } catch (err) {
      console.error('❌ Erreur modification compte:', err);
      setError('Erreur lors de la modification du compte');
      throw err;
    }
  };

  // Supprimer un compte
  const deleteAccount = async (id) => {
    try {
      console.log('🗑️ === SUPPRESSION COMPTE ===');
      console.log('🎯 Compte ID:', id);
      
      await db.accounts.delete(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
      
      console.log('✅ Compte supprimé');
    } catch (err) {
      console.error('❌ Erreur suppression compte:', err);
      setError('Erreur lors de la suppression du compte');
      throw err;
    }
  };

  // Calculer le solde total
  const getTotalBalance = () => {
    console.log('🧮 === CALCUL SOLDE TOTAL ===');
    
    const total = accounts.reduce((total, account, index) => {
      console.log(`💰 Compte ${index + 1} (${account.name}):`, {
        balance: account.current_balance,
        type: typeof account.current_balance,
        is_active: account.is_active
      });
      
      if (account.is_active) {
        const balance = parseFloat(account.current_balance) || 0;
        console.log(`➕ Ajout au total: ${balance}`);
        return total + balance;
      }
      return total;
    }, 0);
    
    console.log('🎯 Solde total calculé:', total);
    return total;
  };

  // ✅ FONCTION POUR FORCER LE RECHARGEMENT
  const refreshAccounts = async () => {
    console.log('🔄 === RECHARGEMENT FORCÉ DES COMPTES ===');
    await loadAccounts();
  };

  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Chargement initial des comptes pour user:', user.id);
      loadAccounts();
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
    refreshAccounts
  };
};