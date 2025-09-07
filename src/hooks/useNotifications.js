// src/hooks/useNotifications.js - HOOK COMPLET POUR NOTIFICATIONS
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db, NOTIFICATION_TYPES } from '../database/db';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ FONCTION POUR CHARGER TOUTES LES NOTIFICATIONS
  const loadNotifications = async (includeRead = true) => {
    if (!user?.id) {
      console.log('⚠️ Pas d\'utilisateur connecté pour charger les notifications');
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔔 === CHARGEMENT NOTIFICATIONS ===');
      console.log('👤 User ID:', user.id);

      // Récupérer les notifications de l'utilisateur
      let query = db.notifications.where('user_id').equals(user.id);
      
      // Filtrer par statut lu/non-lu si demandé
      if (!includeRead) {
        query = query.and(notification => !notification.is_read);
      }

      const userNotifications = await query
        .reverse()
        .sortBy('created_at');

      console.log(`📊 ${userNotifications.length} notifications chargées`);
      
      // Validation et nettoyage des données
      const validNotifications = userNotifications.filter((notification, index) => {
        const isValid = notification.id && 
                       notification.title && 
                       notification.message;
        
        if (!isValid) {
          console.warn(`⚠️ Notification ${index + 1} invalide ignorée:`, notification);
        }
        
        return isValid;
      });

      // Trier par priorité puis par date
      const sortedNotifications = validNotifications.sort((a, b) => {
        // D'abord par statut lu/non-lu
        if (a.is_read !== b.is_read) {
          return a.is_read ? 1 : -1; // Non-lues en premier
        }
        
        // Puis par sévérité si c'est une alerte budget
        if (a.type === 'budget_alert' && b.type === 'budget_alert') {
          const severityA = a.data?.severity || 0;
          const severityB = b.data?.severity || 0;
          if (severityA !== severityB) {
            return severityB - severityA; // Plus haute sévérité en premier
          }
        }
        
        // Finalement par date
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setNotifications(sortedNotifications);
      console.log(`✅ ${sortedNotifications.length} notifications valides chargées`);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des notifications:', err);
      setError('Erreur lors du chargement des notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CALCULER LE NOMBRE DE NOTIFICATIONS NON LUES
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // ✅ MARQUER UNE NOTIFICATION COMME LUE
  const markAsRead = async (notificationId) => {
    try {
      console.log('✅ Marquage notification comme lue:', notificationId);
      
      await db.notifications.update(notificationId, {
        is_read: true,
        read_at: new Date()
      });

      // Mettre à jour le state local
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true, read_at: new Date() }
            : notification
        )
      );

      console.log('✅ Notification marquée comme lue avec succès');

    } catch (err) {
      console.error('❌ Erreur marquage notification comme lue:', err);
      setError('Erreur lors du marquage comme lu');
      throw err;
    }
  };

  // ✅ MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  const markAllAsRead = async () => {
    try {
      console.log('✅ Marquage de toutes les notifications comme lues');
      
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      if (unreadNotifications.length === 0) {
        console.log('📭 Aucune notification non lue à marquer');
        return;
      }

      // Marquer toutes en base
      const updatePromises = unreadNotifications.map(notification =>
        db.notifications.update(notification.id, {
          is_read: true,
          read_at: new Date()
        })
      );

      await Promise.all(updatePromises);

      // Mettre à jour le state local
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          is_read: true,
          read_at: notification.read_at || new Date()
        }))
      );

      console.log(`✅ ${unreadNotifications.length} notifications marquées comme lues`);

    } catch (err) {
      console.error('❌ Erreur marquage toutes notifications comme lues:', err);
      setError('Erreur lors du marquage global');
      throw err;
    }
  };

  // ✅ SUPPRIMER UNE NOTIFICATION
  const deleteNotification = async (notificationId) => {
    try {
      console.log('🗑️ Suppression notification:', notificationId);
      
      await db.notifications.delete(notificationId);

      // Mettre à jour le state local
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );

      console.log('✅ Notification supprimée avec succès');

    } catch (err) {
      console.error('❌ Erreur suppression notification:', err);
      setError('Erreur lors de la suppression');
      throw err;
    }
  };

  // ✅ SUPPRIMER TOUTES LES NOTIFICATIONS LUES
  const deleteReadNotifications = async () => {
    try {
      console.log('🗑️ Suppression de toutes les notifications lues');
      
      const readNotifications = notifications.filter(n => n.is_read);
      
      if (readNotifications.length === 0) {
        console.log('📭 Aucune notification lue à supprimer');
        return;
      }

      // Supprimer toutes en base
      const deletePromises = readNotifications.map(notification =>
        db.notifications.delete(notification.id)
      );

      await Promise.all(deletePromises);

      // Mettre à jour le state local
      setNotifications(prev =>
        prev.filter(notification => !notification.is_read)
      );

      console.log(`✅ ${readNotifications.length} notifications lues supprimées`);

    } catch (err) {
      console.error('❌ Erreur suppression notifications lues:', err);
      setError('Erreur lors de la suppression');
      throw err;
    }
  };

  // ✅ CRÉER UNE NOTIFICATION MANUELLEMENT (POUR TEST)
  const createTestNotification = async (type = 'budget_alert') => {
    try {
      console.log('🧪 Création notification de test');
      
      const testNotification = {
        user_id: user.id,
        type: type,
        title: '🧪 Notification de test',
        message: 'Ceci est une notification de test pour vérifier le système.',
        data: {
          test: true,
          created_by: 'manual',
          severity: 3
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      };

      const notificationId = await db.notifications.add(testNotification);
      console.log('✅ Notification de test créée avec ID:', notificationId);

      // Recharger les notifications
      await loadNotifications();

      return notificationId;

    } catch (err) {
      console.error('❌ Erreur création notification de test:', err);
      throw err;
    }
  };

  // ✅ OBTENIR LES STATISTIQUES DES NOTIFICATIONS
  const getStats = () => {
    const total = notifications.length;
    const unread = unreadCount;
    const read = total - unread;
    
    const budgetAlerts = notifications.filter(n => n.type === 'budget_alert').length;
    const incomeNotifications = notifications.filter(n => 
      n.type === 'income_reminder' || n.type === 'income_processed'
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNotifications = notifications.filter(n => 
      new Date(n.created_at) >= today
    ).length;

    return {
      total,
      unread,
      read,
      budgetAlerts,
      incomeNotifications,
      today: todayNotifications
    };
  };

  // ✅ NETTOYER LES ANCIENNES NOTIFICATIONS (AUTO)
  const cleanupOldNotifications = async (daysToKeep = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const oldNotifications = await db.notifications
        .where('user_id')
        .equals(user.id)
        .and(notification => 
          notification.is_read &&
          new Date(notification.created_at) < cutoffDate
        )
        .toArray();

      if (oldNotifications.length > 0) {
        const deletePromises = oldNotifications.map(notif => 
          db.notifications.delete(notif.id)
        );

        await Promise.all(deletePromises);
        console.log(`🧹 ${oldNotifications.length} anciennes notifications nettoyées`);

        // Recharger les notifications
        await loadNotifications();
      }

      return oldNotifications.length;

    } catch (error) {
      console.error('❌ Erreur nettoyage notifications:', error);
      return 0;
    }
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE NOTIFICATIONS (événements)
  useEffect(() => {
    const handleNotificationsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT NOTIFICATIONS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement notifications');
      loadNotifications();
    };

    console.log('👂 Installation du listener notificationsChanged');
    window.addEventListener('notificationsChanged', handleNotificationsChanged);

    return () => {
      console.log('🧹 Nettoyage du listener notificationsChanged');
      window.removeEventListener('notificationsChanged', handleNotificationsChanged);
    };
  }, [user?.id]);

  // ✅ CHARGEMENT INITIAL DES NOTIFICATIONS
  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Chargement initial des notifications pour user:', user.id);
      loadNotifications();
      
      // Nettoyer les anciennes notifications de temps en temps (20% de chance)
      if (Math.random() < 0.2) {
        cleanupOldNotifications();
      }
    } else {
      console.log('❌ Pas d\'utilisateur - reset des notifications');
      setNotifications([]);
      setLoading(false);
    }
  }, [user?.id]);

  // ✅ FUNCTIONS ET ÉTATS EXPOSÉS
  return {
    // États
    notifications,
    loading,
    error,
    unreadCount,
    
    // Actions
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
    
    // Utilitaires
    getStats,
    createTestNotification,
    cleanupOldNotifications
  };
};