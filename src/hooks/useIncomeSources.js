// src/hooks/useIncomeSources.js - VERSION CORRIGÉE COMPLÈTE
import { useState, useEffect } from 'react';
import { db, INCOME_FREQUENCIES } from '../database/db';
import { useAuthStore } from '../store/authStore';
import { IncomeService } from '../services/incomeService';

export const useIncomeSources = () => {
  const [incomeSources, setIncomeSources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ CHARGER LES SOURCES DE REVENUS
  const loadIncomeSources = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        setIncomeSources([]);
        return;
      }

      const userIncomeSources = await db.income_sources
        .where('user_id')
        .equals(user.id)
        .toArray();

      console.log('📥 Sources de revenus chargées:', userIncomeSources.length);
      setIncomeSources(userIncomeSources || []);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des sources:', err);
      setError('Erreur lors du chargement des revenus');
      setIncomeSources([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHARGER LES NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      if (!user?.id) {
        setNotifications([]);
        return;
      }

      const unreadNotifications = await IncomeService.getUnreadNotifications(user.id);
      setNotifications(unreadNotifications || []);
      
      console.log('🔔 Notifications non lues:', (unreadNotifications || []).length);
    } catch (err) {
      console.error('❌ Erreur notifications:', err);
      setNotifications([]);
    }
  };

  // ✅ AJOUTER UNE SOURCE DE REVENUS
  const addIncomeSource = async (incomeData) => {
    try {
      console.log('➕ Ajout source de revenus:', incomeData);
      
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }

      const newIncomeSource = await IncomeService.createIncomeSource(user.id, incomeData);
      
      setIncomeSources(prev => [...(prev || []), newIncomeSource]);
      console.log('✅ Source ajoutée avec succès');
      
      return newIncomeSource;
    } catch (err) {
      console.error('❌ Erreur ajout source:', err);
      setError('Erreur lors de l\'ajout de la source de revenus');
      throw err;
    }
  };

  // ✅ MODIFIER UNE SOURCE DE REVENUS
  const updateIncomeSource = async (id, updates) => {
    try {
      console.log('✏️ Modification source:', id, updates);

      // Recalculer la prochaine date si la fréquence change
      if (updates.frequency || updates.payment_day) {
        const nextPaymentDate = IncomeService.calculateNextPaymentDate(
          updates.frequency,
          updates.payment_day
        );
        updates.next_payment_date = nextPaymentDate;

        // Reprogrammer la notification
        await IncomeService.scheduleNotification(id, nextPaymentDate);
      }

      await db.income_sources.update(id, {
        ...updates,
        updated_at: new Date()
      });

      const updatedSource = await db.income_sources.get(id);
      
      setIncomeSources(prev => 
        (prev || []).map(source => source.id === id ? updatedSource : source)
      );

      console.log('✅ Source modifiée avec succès');
      return updatedSource;
    } catch (err) {
      console.error('❌ Erreur modification source:', err);
      setError('Erreur lors de la modification');
      throw err;
    }
  };

  // ✅ SUPPRIMER UNE SOURCE DE REVENUS
  const deleteIncomeSource = async (id) => {
    try {
      console.log('🗑️ Suppression source:', id);

      await db.income_sources.delete(id);
      setIncomeSources(prev => (prev || []).filter(source => source.id !== id));

      console.log('✅ Source supprimée avec succès');
    } catch (err) {
      console.error('❌ Erreur suppression source:', err);
      setError('Erreur lors de la suppression');
      throw err;
    }
  };

  // ✅ ACTIVER/DÉSACTIVER UNE SOURCE
  const toggleIncomeSource = async (id, isActive) => {
    try {
      await updateIncomeSource(id, { is_active: isActive });
      console.log(`🔄 Source ${isActive ? 'activée' : 'désactivée'}`);
    } catch (err) {
      console.error('❌ Erreur toggle source:', err);
      throw err;
    }
  };

  // ✅ MARQUER UNE NOTIFICATION COMME LUE
  const markNotificationAsRead = async (notificationId) => {
    try {
      await IncomeService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        (prev || []).map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error('❌ Erreur marquer notification:', err);
    }
  };

  // ✅ FORCER LE TRAITEMENT DES PAIEMENTS (pour test)
  const processPendingPayments = async () => {
    try {
      await IncomeService.processPendingPayments();
      await loadIncomeSources(); // Recharger pour voir les mises à jour
      await loadNotifications();
    } catch (err) {
      console.error('❌ Erreur traitement paiements:', err);
    }
  };

  // ✅ OBTENIR LES STATISTIQUES - VERSION CORRIGÉE
  const getIncomeStats = () => {
    // Vérification de sécurité pour incomeSources
    const safeIncomeSources = Array.isArray(incomeSources) ? incomeSources : [];
    const activeIncomeSources = safeIncomeSources.filter(source => source && source.is_active);
    
    // ✅ CORRECTION: Calcul sécurisé du total mensuel
    const monthlyTotal = activeIncomeSources.reduce((total, source) => {
      // Vérifier que source et source.amount existent et sont valides
      if (!source || !source.amount) return total;
      
      // Convertir en nombre et vérifier la validité
      const amount = parseFloat(source.amount);
      if (isNaN(amount) || amount < 0) return total;
      
      let monthlyAmount = amount;
      
      // Convertir selon la fréquence avec vérifications
      const frequency = source.frequency;
      switch (frequency) {
        case INCOME_FREQUENCIES.WEEKLY:
        case 'weekly':
          monthlyAmount = amount * 4.33; // ~4.33 semaines par mois
          break;
        case INCOME_FREQUENCIES.BI_WEEKLY:
        case 'bi_weekly':
          monthlyAmount = amount * 2.17; // ~2.17 fois par mois
          break;
        case INCOME_FREQUENCIES.BI_MONTHLY:
        case 'bi_monthly':
          monthlyAmount = amount * 2;
          break;
        case INCOME_FREQUENCIES.DAILY:
        case 'daily':
          monthlyAmount = amount * 30;
          break;
        case INCOME_FREQUENCIES.MONTHLY:
        case 'monthly':
        default:
          monthlyAmount = amount; // Reste tel quel
          break;
      }
      
      // Vérifier que le résultat est un nombre valide
      return total + (isNaN(monthlyAmount) ? 0 : monthlyAmount);
    }, 0);

    // ✅ CORRECTION: Calcul sécurisé du prochain paiement
    let nextPayment = null;
    try {
      const activeSources = activeIncomeSources.filter(source => 
        source && source.next_payment_date
      );
      
      if (activeSources.length > 0) {
        nextPayment = activeSources.sort((a, b) => {
          const dateA = new Date(a.next_payment_date);
          const dateB = new Date(b.next_payment_date);
          return dateA - dateB;
        })[0];
      }
    } catch (err) {
      console.error('❌ Erreur calcul prochain paiement:', err);
      nextPayment = null;
    }

    // ✅ RETOUR SÉCURISÉ avec valeurs par défaut
    const stats = {
      totalSources: safeIncomeSources.length || 0,
      activeSources: activeIncomeSources.length || 0,
      monthlyTotal: Math.max(0, monthlyTotal || 0), // Assurer un nombre positif
      nextPayment: nextPayment
    };

    console.log('📊 Stats calculées:', stats);
    return stats;
  };

  // ✅ EFFET DE CHARGEMENT INITIAL
  useEffect(() => {
    if (user?.id) {
      loadIncomeSources();
      loadNotifications();
    } else {
      // Réinitialiser si pas d'utilisateur
      setIncomeSources([]);
      setNotifications([]);
      setLoading(false);
    }
  }, [user?.id]);

  // ✅ EFFET POUR RECHARGER PÉRIODIQUEMENT
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(interval);
  }, [user?.id]);

  // ✅ EFFET POUR ÉCOUTER LES CHANGEMENTS DE TRANSACTIONS
  useEffect(() => {
    const handleTransactionsChanged = () => {
      console.log('🔔 Transactions changées - Rechargement des revenus');
      if (user?.id) {
        loadIncomeSources();
      }
    };

    window.addEventListener('transactionsChanged', handleTransactionsChanged);
    
    return () => {
      window.removeEventListener('transactionsChanged', handleTransactionsChanged);
    };
  }, [user?.id]);

  return {
    incomeSources: incomeSources || [],
    notifications: notifications || [],
    loading,
    error,
    addIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
    toggleIncomeSource,
    markNotificationAsRead,
    processPendingPayments,
    getIncomeStats,
    loadIncomeSources,
    loadNotifications
  };
};