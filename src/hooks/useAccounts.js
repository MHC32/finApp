// src/hooks/useAccounts.js - VERSION CORRIGÉE avec synchronisation
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
      console.log('🔄 Rechargement des comptes...');
      
      const userAccounts = await db.accounts
        .where('user_id')
        .equals(user?.id)
        .toArray();
      
      console.log('📊 Comptes chargés:', userAccounts);
      setAccounts(userAccounts);
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE COMPTES
  useEffect(() => {
    const handleAccountsChanged = () => {
      console.log('🔔 Événement accountsChanged reçu - Rechargement des comptes');
      loadAccounts();
    };

    // Écouter l'événement personnalisé
    window.addEventListener('accountsChanged', handleAccountsChanged);

    // Nettoyer l'écouteur au démontage
    return () => {
      window.removeEventListener('accountsChanged', handleAccountsChanged);
    };
  }, [user?.id]);

  // Ajouter un compte
  const addAccount = async (accountData) => {
    try {
      console.log('➕ Ajout compte:', accountData);
      
      const newAccount = {
        ...accountData,
        user_id: user?.id,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const id = await db.accounts.add(newAccount);
      const account = await db.accounts.get(id);
      
      console.log('✅ Compte ajouté:', account);
      setAccounts(prev => [...prev, account]);
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
      console.log('✏️ Modification compte:', id, updates);
      
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
      console.log('🗑️ Suppression compte:', id);
      
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
    const total = accounts.reduce((total, account) => {
      if (account.is_active) {
        return total + (account.current_balance || 0);
      }
      return total;
    }, 0);
    
    console.log('💰 Solde total calculé:', total);
    return total;
  };

  // ✅ FONCTION POUR FORCER LE RECHARGEMENT
  const refreshAccounts = async () => {
    console.log('🔄 Rechargement forcé des comptes');
    await loadAccounts();
  };

  useEffect(() => {
    if (user?.id) {
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
    refreshAccounts // ✅ Nouvelle fonction pour forcer le rechargement
  };
};