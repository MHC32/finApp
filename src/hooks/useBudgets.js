// src/hooks/useBudgets.js - VERSION CORRIGÉE SANS DOUBLONS NOTIFICATIONS
import { useState, useEffect } from 'react';
import { db } from '../database/db';
import { useAuthStore } from '../store/authStore';
import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ CORRECTION MAJEURE: Fonction pour générer une clé unique de notification
  const getNotificationKey = (budget, period = 'current') => {
    // Créer une clé unique basée sur le budget, la période et le seuil
    const now = new Date();
    let periodKey;
    
    switch (budget.period) {
      case 'monthly':
        periodKey = format(now, 'yyyy-MM'); // Ex: "2024-09"
        break;
      case 'weekly':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        periodKey = format(weekStart, 'yyyy-ww'); // Ex: "2024-w36"
        break;
      case 'custom':
        periodKey = `${format(new Date(budget.start_date), 'yyyy-MM-dd')}_${format(new Date(budget.end_date), 'yyyy-MM-dd')}`;
        break;
      default:
        periodKey = format(now, 'yyyy-MM');
    }
    
    return `budget_${budget.id}_${periodKey}`;
  };

  // ✅ CORRECTION MAJEURE: Vérification intelligente des notifications existantes
  const hasRecentNotification = async (budget, percentage) => {
    try {
      const notificationKey = getNotificationKey(budget);
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      console.log(`🔍 Vérification notification existante pour clé: ${notificationKey}`);
      
      // Chercher une notification récente (dernières 24h) pour ce budget et cette période
      const recentNotifications = await db.notifications
        .where('user_id')
        .equals(user.id)
        .and(notification => {
          const isForThisBudget = notification.type === 'budget_alert' && 
                                 notification.data?.budget_id === budget.id;
          
          const isRecent = new Date(notification.created_at) > oneDayAgo;
          
          // Vérifier si c'est pour la même période (clé de notification)
          const isSamePeriod = notification.data?.notification_key === notificationKey;
          
          // Vérifier si le seuil est similaire (±5% pour éviter les micro-changements)
          const currentPercentage = notification.data?.percentage || 0;
          const percentageDiff = Math.abs(currentPercentage - percentage);
          const isSimilarThreshold = percentageDiff <= 5;
          
          return isForThisBudget && isRecent && (isSamePeriod || isSimilarThreshold);
        })
        .toArray();
      
      if (recentNotifications.length > 0) {
        console.log(`✅ Notification récente trouvée pour ${budget.name}, évitement du doublon`);
        return true;
      }
      
      console.log(`❌ Aucune notification récente pour ${budget.name}, création autorisée`);
      return false;
      
    } catch (error) {
      console.error('❌ Erreur vérification notification existante:', error);
      return false; // En cas d'erreur, autoriser la création
    }
  };

  // ✅ CORRECTION MAJEURE: Fonction de création de notification intelligente
  const createBudgetNotification = async (budget, percentage, forceCreate = false) => {
    try {
      console.log(`🚨 === CRÉATION NOTIFICATION BUDGET ===`);
      console.log(`Budget: ${budget.name}, Pourcentage: ${percentage.toFixed(1)}%`);
      
      // ✅ ÉTAPE 1: Vérifier si une notification est nécessaire
      if (percentage < 80) {
        console.log(`⚪ Pourcentage sous le seuil (${percentage.toFixed(1)}% < 80%), pas de notification`);
        return null;
      }
      
      // ✅ ÉTAPE 2: Vérifier les doublons (sauf si forcé)
      if (!forceCreate) {
        const hasRecent = await hasRecentNotification(budget, percentage);
        if (hasRecent) {
          console.log(`🚫 Notification récente détectée, évitement du doublon`);
          return null;
        }
      }
      
      // ✅ ÉTAPE 3: Déterminer le type d'alerte
      let alertType, title, message;
      
      if (percentage >= 100) {
        alertType = 'danger';
        title = '🚨 Budget dépassé !';
        message = `Votre budget "${budget.name}" est dépassé de ${(percentage - 100).toFixed(1)}%. Vous avez dépensé ${budget.current_spent.toLocaleString()} ${budget.currency} sur ${budget.amount.toLocaleString()} ${budget.currency}.`;
      } else if (percentage >= 90) {
        alertType = 'warning';
        title = '🔴 Budget presque épuisé';
        message = `Attention ! Votre budget "${budget.name}" est utilisé à ${percentage.toFixed(1)}% (${budget.current_spent.toLocaleString()} ${budget.currency} / ${budget.amount.toLocaleString()} ${budget.currency}).`;
      } else if (percentage >= 80) {
        alertType = 'info';
        title = '⚠️ Budget bientôt atteint';
        message = `Information : Vous avez utilisé ${percentage.toFixed(1)}% de votre budget "${budget.name}" (${budget.current_spent.toLocaleString()} ${budget.currency} / ${budget.amount.toLocaleString()} ${budget.currency}).`;
      }
      
      // ✅ ÉTAPE 4: Créer la notification avec clé unique
      const notificationKey = getNotificationKey(budget);
      
      const notification = {
        user_id: user.id,
        type: 'budget_alert',
        title,
        message,
        data: {
          budget_id: budget.id,
          budget_name: budget.name,
          percentage: Math.round(percentage * 100) / 100, // Arrondir à 2 décimales
          amount_spent: budget.current_spent,
          budget_amount: budget.amount,
          currency: budget.currency,
          alert_type: alertType,
          notification_key: notificationKey, // Clé unique pour éviter les doublons
          period: budget.period,
          created_period: format(new Date(), 'yyyy-MM-dd')
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      };
      
      const notificationId = await db.notifications.add(notification);
      console.log(`✅ Notification budget créée avec ID: ${notificationId}`);
      console.log(`🔑 Clé de notification: ${notificationKey}`);
      
      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged'));
      
      return notificationId;
      
    } catch (error) {
      console.error('❌ Erreur création notification budget:', error);
      return null;
    }
  };

  // ✅ CORRECTION MAJEURE: Vérification d'alerte avec logique améliorée
  const checkAndCreateBudgetAlert = async (budget, reason = 'unknown') => {
    try {
      console.log(`🔍 === VÉRIFICATION ALERTE BUDGET ===`);
      console.log(`Budget: ${budget.name}, Raison: ${reason}`);
      
      // Vérifications préliminaires
      if (!budget.is_active) {
        console.log(`⚪ Budget "${budget.name}" inactif, pas de vérification`);
        return;
      }
      
      if (!budget.current_spent || budget.amount === 0) {
        console.log(`⚪ Budget "${budget.name}" sans dépenses ou montant nul`);
        return;
      }
      
      const percentage = (budget.current_spent / budget.amount) * 100;
      console.log(`📊 Pourcentage d'utilisation: ${percentage.toFixed(1)}%`);
      
      // Seuil d'alerte (peut être personnalisé par budget)
      const alertThreshold = budget.alert_threshold || 80;
      
      if (percentage >= alertThreshold) {
        console.log(`🚨 Seuil atteint (${percentage.toFixed(1)}% >= ${alertThreshold}%), vérification de notification`);
        
        // ✅ LOGIQUE INTELLIGENTE: Créer seulement si nécessaire
        const shouldNotify = reason === 'manual' || // Vérification manuelle
                           reason === 'new_transaction' || // Nouvelle transaction
                           reason === 'budget_updated'; // Budget modifié
        
        if (shouldNotify) {
          await createBudgetNotification(budget, percentage, reason === 'manual');
        } else {
          console.log(`⚪ Raison "${reason}" ne justifie pas une nouvelle notification`);
        }
      } else {
        console.log(`✅ Sous le seuil d'alerte, aucune notification nécessaire`);
      }
      
    } catch (error) {
      console.error('❌ Erreur vérification alerte budget:', error);
    }
  };

  // ✅ FONCTION UTILITAIRE: Nettoyer les anciennes notifications
  const cleanupOldNotifications = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const oldNotifications = await db.notifications
        .where('user_id')
        .equals(user.id)
        .and(notification => 
          notification.type === 'budget_alert' &&
          notification.is_read &&
          new Date(notification.created_at) < oneWeekAgo
        )
        .toArray();
      
      if (oldNotifications.length > 0) {
        const deletePromises = oldNotifications.map(notif => 
          db.notifications.delete(notif.id)
        );
        
        await Promise.all(deletePromises);
        console.log(`🧹 ${oldNotifications.length} anciennes notifications nettoyées`);
      }
      
    } catch (error) {
      console.error('❌ Erreur nettoyage notifications:', error);
    }
  };

  // ✅ CORRECTION MAJEURE: Charger les budgets avec logique améliorée
  const loadBudgets = async (reason = 'initial_load') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 === CHARGEMENT BUDGETS ===`);
      console.log(`Raison: ${reason}`);
      
      if (!user?.id) {
        console.log('⚠️ Pas d\'utilisateur connecté');
        setBudgets([]);
        return;
      }

      const userBudgets = await db.budgets
        .where('user_id')
        .equals(user.id)
        .toArray();

      console.log(`📊 ${userBudgets.length} budgets trouvés`);
      
      // Calculer les dépenses actuelles pour chaque budget
      const budgetsWithSpent = await Promise.all(
        userBudgets.map(async (budget, index) => {
          const spent = await calculateCurrentSpent(budget);
          const budgetWithSpent = { ...budget, current_spent: spent };
          
          console.log(`💰 Budget ${index + 1} "${budget.name}": ${spent}/${budget.amount} (${((spent/budget.amount)*100).toFixed(1)}%)`);
          
          // ✅ CORRECTION CRITIQUE: Vérifier les alertes seulement dans certains cas
          if (reason === 'new_transaction' || reason === 'budget_updated' || reason === 'manual_check') {
            await checkAndCreateBudgetAlert(budgetWithSpent, reason);
          } else {
            console.log(`⚪ Raison "${reason}" - Pas de vérification d'alerte automatique`);
          }
          
          return budgetWithSpent;
        })
      );

      setBudgets(budgetsWithSpent);
      
      // Nettoyer les anciennes notifications de temps en temps
      if (reason === 'initial_load' && Math.random() < 0.1) { // 10% de chance
        await cleanupOldNotifications();
      }
      
      console.log(`✅ ${budgetsWithSpent.length} budgets chargés avec succès`);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des budgets:', err);
      setError('Erreur lors du chargement des budgets');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FONCTION HELPER: Démarrer de la semaine
  const startOfWeek = (date, options = {}) => {
    const { weekStartsOn = 1 } = options; // 1 = Lundi
    const day = date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    const result = new Date(date);
    result.setDate(date.getDate() - diff);
    return result;
  };

  // ✅ CORRECTION: Calculer les dépenses actuelles (inchangé mais documenté)
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
          startDate = startOfWeek(now, { weekStartsOn: 1 });
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

      return totalSpent;

    } catch (err) {
      console.error('❌ Erreur calcul dépenses budget:', err);
      return 0;
    }
  };

  // ✅ CRUD OPERATIONS (inchangées mais documentées)
  
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

      // ✅ CORRECTION: Vérifier les alertes après modification avec la bonne raison
      await checkAndCreateBudgetAlert(budgetWithSpent, 'budget_updated');
      
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

  const toggleBudget = async (id, isActive) => {
    try {
      await updateBudget(id, { is_active: isActive });
      console.log(`🔄 Budget ${isActive ? 'activé' : 'désactivé'}`);
    } catch (err) {
      console.error('❌ Erreur toggle budget:', err);
      throw err;
    }
  };

  // ✅ FONCTIONS UTILITAIRES (inchangées)
  
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

  const getBudgetAlerts = () => {
    return budgets.filter(budget => {
      if (!budget.is_active) return false;
      
      const percentage = ((budget.current_spent || 0) / budget.amount) * 100;
      return percentage > 80;
    }).map(budget => ({
      ...budget,
      alertType: (budget.current_spent || 0) > budget.amount ? 'danger' : 'warning',
      percentage: ((budget.current_spent || 0) / budget.amount) * 100
    }));
  };

  // ✅ FONCTION PUBLIQUE: Forcer une vérification manuelle
  const forceCheckAlerts = async () => {
    console.log('🔍 === VÉRIFICATION MANUELLE DES ALERTES ===');
    
    for (const budget of budgets) {
      if (budget.is_active) {
        await checkAndCreateBudgetAlert(budget, 'manual_check');
      }
    }
  };

  // ✅ CORRECTION MAJEURE: Event listeners avec logique améliorée
  useEffect(() => {
    const handleBudgetsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT BUDGETS CHANGED REÇU ===');
      loadBudgets('budgets_changed');
    };

    const handleTransactionsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT TRANSACTIONS CHANGED REÇU ===');
      // ✅ CORRECTION CRITIQUE: Indiquer qu'il y a eu une nouvelle transaction
      loadBudgets('new_transaction');
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

  // ✅ CHARGEMENT INITIAL
  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Chargement initial des budgets pour user:', user.id);
      loadBudgets('initial_load');
    } else {
      console.log('❌ Pas d\'utilisateur - reset des budgets');
      setBudgets([]);
      setLoading(false);
    }
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
    calculateCurrentSpent,
    forceCheckAlerts, // ✅ NOUVELLE FONCTION pour vérification manuelle
    checkAndCreateBudgetAlert // ✅ EXPOSER pour debug
  };
};