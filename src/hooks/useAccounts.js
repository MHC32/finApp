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
      const userAccounts = await db.accounts
        .where('user_id')
        .equals(user?.id)
        .toArray();
      setAccounts(userAccounts);
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un compte
  const addAccount = async (accountData) => {
    try {
      const newAccount = {
        ...accountData,
        user_id: user?.id,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const id = await db.accounts.add(newAccount);
      const account = await db.accounts.get(id);
      setAccounts(prev => [...prev, account]);
      return account;
    } catch (err) {
      setError('Erreur lors de l\'ajout du compte');
      throw err;
    }
  };

  // Modifier un compte
  const updateAccount = async (id, updates) => {
    try {
      await db.accounts.update(id, {
        ...updates,
        updated_at: new Date()
      });
      
      const updatedAccount = await db.accounts.get(id);
      setAccounts(prev => 
        prev.map(account => 
          account.id === id ? updatedAccount : account
        )
      );
      return updatedAccount;
    } catch (err) {
      setError('Erreur lors de la modification du compte');
      throw err;
    }
  };

  // Supprimer un compte
  const deleteAccount = async (id) => {
    try {
      await db.accounts.delete(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du compte');
      throw err;
    }
  };

  // Calculer le solde total
  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      if (account.is_active) {
        return total + (account.current_balance || 0);
      }
      return total;
    }, 0);
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
    getTotalBalance
  };
};