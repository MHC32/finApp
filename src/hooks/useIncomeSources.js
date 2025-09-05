// src/hooks/useIncomeSources.js
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
      
      if (!user?.id) return;

      const userIncomeSources = await db.income_sources
        .where('user_id')
        .equals(user.id)
        .toArray();

      console.log('📥 Sources de revenus chargées:', userIncomeSources.length);
      setIncomeSources(userIncomeSources);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des sources:', err);
      setError('Erreur lors du chargement des revenus');
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHARGER LES NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      if (!user?.id) return;

      const unreadNotifications = await IncomeService.getUnreadNotifications(user.id);
      setNotifications(unreadNotifications);
      
      console.log('🔔 Notifications non lues:', unreadNotifications.length);
    } catch (err) {
      console.error('❌ Erreur notifications:', err);
    }
  };

  // ✅ AJOUTER UNE SOURCE DE REVENUS
  const addIncomeSource = async (incomeData) => {
    try {
      console.log('➕ Ajout source de revenus:', incomeData);
      
      const newIncomeSource = await IncomeService.createIncomeSource(user.id, incomeData);
      
      setIncomeSources(prev => [...prev, newIncomeSource]);
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
        prev.map(source => source.id === id ? updatedSource : source)
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
      setIncomeSources(prev => prev.filter(source => source.id !== id));

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
        prev.map(notif => 
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

  // ✅ OBTENIR LES STATISTIQUES
  const getIncomeStats = () => {
    const activeIncomeSources = incomeSources.filter(source => source.is_active);
    
    const monthlyTotal = activeIncomeSources.reduce((total, source) => {
      let monthlyAmount = source.amount;
      
      // Convertir selon la fréquence
      switch (source.frequency) {
        case INCOME_FREQUENCIES.WEEKLY:
          monthlyAmount = source.amount * 4.33; // ~4.33 semaines par mois
          break;
        case INCOME_FREQUENCIES.BI_WEEKLY:
          monthlyAmount = source.amount * 2.17; // ~2.17 fois par mois
          break;
        case INCOME_FREQUENCIES.BI_MONTHLY:
          monthlyAmount = source.amount * 2;
          break;
        case INCOME_FREQUENCIES.DAILY:
          monthlyAmount = source.amount * 30;
          break;
        // MONTHLY reste tel quel
      }
      
      return total + monthlyAmount;
    }, 0);

    return {
      totalSources: incomeSources.length,
      activeSources: activeIncomeSources.length,
      monthlyTotal,
      nextPayment: activeIncomeSources
        .sort((a, b) => new Date(a.next_payment_date) - new Date(b.next_payment_date))[0] || null
    };
  };

  // ✅ EFFET DE CHARGEMENT INITIAL
  useEffect(() => {
    if (user?.id) {
      loadIncomeSources();
      loadNotifications();
    }
  }, [user?.id]);

  // ✅ EFFET POUR RECHARGER PÉRIODIQUEMENT
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(interval);
  }, [user?.id]);

  return {
    incomeSources,
    notifications,
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