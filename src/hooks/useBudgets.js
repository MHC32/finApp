// src/hooks/useBudgets.js
import { useState, useEffect } from 'react';
import { db } from '../database/db';
import { useAuthStore } from '../store/authStore';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // Charger tous les budgets
  const loadBudgets = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des budgets...');
      
      if (!user?.id) return;

      const userBudgets = await db.budgets
        .where('user_id')
        .equals(user.id)
        .toArray();

      console.log('📊 Budgets chargés:', userBudgets.length);
      
      // Calculer les dépenses actuelles pour chaque budget
      const budgetsWithSpent = await Promise.all(
        userBudgets.map(async (budget) => {
          const spent = await calculateCurrentSpent(budget);
          return { ...budget, current_spent: spent };
        })
      );

      setBudgets(budgetsWithSpent);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des budgets:', err);
      setError('Erreur lors du chargement des budgets');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les dépenses actuelles d'un budget
  const calculateCurrentSpent = async (budget) => {
    try {
      const now = new Date();
      let startDate, endDate;

      // Déterminer la période selon le type de budget
      switch (budget.period) {
        case 'monthly':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'weekly':
          // Semaine courante (lundi à dimanche)
          const today = new Date();
          const dayOfWeek = today.getDay();
          const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          startDate = new Date(today.setDate(diff));
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          break;
        case 'custom':
          startDate = budget.start_date ? new Date(budget.start_date) : startOfMonth(now);
          endDate = budget.end_date ? new Date(budget.end_date) : endOfMonth(now);
          break;
        default:
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
      }

      // Récupérer toutes les transactions de l'utilisateur dans la période
      const transactions = await db.transactions
        .where('user_id')
        .equals(user.id)
        .and(transaction => {
          const transactionDate = new Date(transaction.date);
          return isWithinInterval(transactionDate, { start: startDate, end: endDate });
        })
        .toArray();

      // Filtrer par catégories si spécifiées
      const relevantTransactions = transactions.filter(transaction => {
        // Si aucune catégorie spécifiée, inclure toutes les dépenses
        if (!budget.categories || budget.categories.length === 0) {
          return transaction.amount < 0; // Dépenses uniquement
        }
        
        // Sinon, filtrer par catégories
        return budget.categories.includes(transaction.category) && transaction.amount < 0;
      });

      // Calculer le total des dépenses (montants négatifs)
      const totalSpent = relevantTransactions.reduce((sum, transaction) => {
        return sum + Math.abs(transaction.amount);
      }, 0);

      console.log(`💰 Budget "${budget.name}" - Dépensé: ${totalSpent}/${budget.amount}`);
      return totalSpent;

    } catch (err) {
      console.error('❌ Erreur calcul dépenses budget:', err);
      return 0;
    }
  };

  // Ajouter un budget
  const addBudget = async (budgetData) => {
    try {
      console.log('➕ Ajout budget:', budgetData);
      
      const newBudget = {
        ...budgetData,
        user_id: user?.id,
        current_spent: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      const budgetId = await db.budgets.add(newBudget);
      const createdBudget = await db.budgets.get(budgetId);
      
      setBudgets(prev => [...prev, createdBudget]);
      console.log('✅ Budget ajouté avec succès');
      
      return createdBudget;
    } catch (err) {
      console.error('❌ Erreur ajout budget:', err);
      setError('Erreur lors de l\'ajout du budget');
      throw err;
    }
  };

  // Modifier un budget
  const updateBudget = async (id, updates) => {
    try {
      console.log('✏️ Modification budget:', id, updates);

      await db.budgets.update(id, {
        ...updates,
        updated_at: new Date()
      });

      const updatedBudget = await db.budgets.get(id);
      const currentSpent = await calculateCurrentSpent(updatedBudget);
      const budgetWithSpent = { ...updatedBudget, current_spent: currentSpent };
      
      setBudgets(prev => 
        prev.map(budget => budget.id === id ? budgetWithSpent : budget)
      );

      console.log('✅ Budget modifié avec succès');
      return budgetWithSpent;
    } catch (err) {
      console.error('❌ Erreur modification budget:', err);
      setError('Erreur lors de la modification');
      throw err;
    }
  };

  // Supprimer un budget
  const deleteBudget = async (id) => {
    try {
      console.log('🗑️ Suppression budget:', id);

      await db.budgets.delete(id);
      setBudgets(prev => prev.filter(budget => budget.id !== id));

      console.log('✅ Budget supprimé avec succès');
    } catch (err) {
      console.error('❌ Erreur suppression budget:', err);
      setError('Erreur lors de la suppression');
      throw err;
    }
  };

  // Activer/Désactiver un budget
  const toggleBudget = async (id, isActive) => {
    try {
      await updateBudget(id, { is_active: isActive });
      console.log(`🔄 Budget ${isActive ? 'activé' : 'désactivé'}`);
    } catch (err) {
      console.error('❌ Erreur toggle budget:', err);
      throw err;
    }
  };

  // Obtenir les statistiques des budgets
  const getBudgetsStats = () => {
    const activeBudgets = budgets.filter(b => b.is_active);
    const totalBudget = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = activeBudgets.reduce((sum, budget) => sum + (budget.current_spent || 0), 0);
    const budgetsOverLimit = activeBudgets.filter(budget => (budget.current_spent || 0) > budget.amount);
    const budgetsNearLimit = activeBudgets.filter(budget => {
      const percentage = ((budget.current_spent || 0) / budget.amount) * 100;
      return percentage > 80 && percentage <= 100;
    });

    return {
      totalBudgets: budgets.length,
      activeBudgets: activeBudgets.length,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      overLimitCount: budgetsOverLimit.length,
      nearLimitCount: budgetsNearLimit.length,
      averageUsage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
  };

  // Obtenir les budgets en alerte
  const getBudgetAlerts = () => {
    return budgets.filter(budget => {
      if (!budget.is_active) return false;
      
      const percentage = ((budget.current_spent || 0) / budget.amount) * 100;
      return percentage > 80; // Alerte à partir de 80%
    }).map(budget => ({
      ...budget,
      alertType: (budget.current_spent || 0) > budget.amount ? 'danger' : 'warning',
      percentage: ((budget.current_spent || 0) / budget.amount) * 100
    }));
  };

  // Charger les budgets au montage et quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      loadBudgets();
    }
  }, [user?.id]);

  // ✅ ÉCOUTER LES CHANGEMENTS DE TRANSACTIONS POUR RECALCULER
  useEffect(() => {
    const handleBudgetsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT BUDGETS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement des budgets');
      loadBudgets();
    };

    const handleTransactionsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT TRANSACTIONS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Recalcul des budgets');
      loadBudgets(); // Recalculer les dépenses actuelles
    };

    console.log('👂 Installation des listeners budgets et transactions');
    window.addEventListener('budgetsChanged', handleBudgetsChanged);
    window.addEventListener('transactionsChanged', handleTransactionsChanged);

    return () => {
      console.log('🧹 Nettoyage des listeners budgets et transactions');
      window.removeEventListener('budgetsChanged', handleBudgetsChanged);
      window.removeEventListener('transactionsChanged', handleTransactionsChanged);
    };
  }, [user?.id]);

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    toggleBudget,
    loadBudgets,
    getBudgetsStats,
    getBudgetAlerts,
    calculateCurrentSpent
  };
};