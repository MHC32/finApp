// src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { NotificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // ✅ CHARGER TOUTES LES NOTIFICATIONS
  const loadNotifications = async (includeRead = false) => {
    try {
      setLoading(true);
      
      if (!user?.id) return;

      const userNotifications = await NotificationService.getUserNotifications(user.id, includeRead);
      setNotifications(userNotifications);

      // Compter les non lues
      const unreadCount = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(unreadCount);

      console.log('📥 Notifications chargées:', userNotifications.length, 'Non lues:', unreadCount);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des notifications:', err);
      setError('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARQUER UNE NOTIFICATION COMME LUE
  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
      // Mettre à jour le state local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date() }
            : notification
        )
      );

      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1));

      console.log('✅ Notification marquée comme lue:', notificationId);

    } catch (err) {
      console.error('❌ Erreur marquage notification:', err);
      setError('Erreur lors du marquage de la notification');
    }
  };

  // ✅ MARQUER TOUTES COMME LUES
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(user.id);
      
      // Mettre à jour le state local
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date()
        }))
      );

      setUnreadCount(0);

      console.log('✅ Toutes les notifications marquées comme lues');

    } catch (err) {
      console.error('❌ Erreur marquage toutes notifications:', err);
      setError('Erreur lors du marquage des notifications');
    }
  };

  // ✅ SUPPRIMER UNE NOTIFICATION
  const deleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      
      // Mettre à jour le state local
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));

      // Mettre à jour le compteur si c'était une notification non lue
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      console.log('✅ Notification supprimée:', notificationId);

    } catch (err) {
      console.error('❌ Erreur suppression notification:', err);
      setError('Erreur lors de la suppression');
    }
  };

  // ✅ CRÉER UNE NOTIFICATION DE BUDGET
  const createBudgetAlert = async (budgetId, budgetName, percentage, amountSpent, budgetAmount, currency) => {
    try {
      if (!user?.id) return;

      const notificationId = await NotificationService.createBudgetAlert(
        user.id,
        budgetId, 
        budgetName, 
        percentage, 
        amountSpent, 
        budgetAmount, 
        currency
      );

      if (notificationId) {
        console.log('✅ Alerte budget créée:', notificationId);
        // Les notifications seront rechargées par l'événement
      }

      return notificationId;

    } catch (err) {
      console.error('❌ Erreur création alerte budget:', err);
      setError('Erreur lors de la création de l\'alerte');
    }
  };

  // ✅ NETTOYER LES ANCIENNES NOTIFICATIONS
  const cleanupOldNotifications = async () => {
    try {
      if (!user?.id) return;

      await NotificationService.cleanupOldNotifications(user.id);
      console.log('🧹 Nettoyage des anciennes notifications effectué');

    } catch (err) {
      console.error('❌ Erreur nettoyage notifications:', err);
    }
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE NOTIFICATIONS
  useEffect(() => {
    const handleNotificationsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT NOTIFICATIONS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement des notifications');
      loadNotifications();
    };

    console.log('👂 Installation du listener notificationsChanged');
    window.addEventListener('notificationsChanged', handleNotificationsChanged);

    return () => {
      console.log('🧹 Nettoyage du listener notificationsChanged');
      window.removeEventListener('notificationsChanged', handleNotificationsChanged);
    };
  }, [user?.id]);

  // ✅ CHARGER LES NOTIFICATIONS AU MONTAGE
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      
      // Nettoyer les anciennes notifications une fois par session
      cleanupOldNotifications();
    }
  }, [user?.id]);

  // ✅ OBTENIR LES NOTIFICATIONS PAR TYPE
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // ✅ OBTENIR LES NOTIFICATIONS NON LUES
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.is_read);
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createBudgetAlert,
    getNotificationsByType,
    getUnreadNotifications,
    cleanupOldNotifications
  };
};