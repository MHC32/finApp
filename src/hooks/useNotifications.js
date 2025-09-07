// src/hooks/useNotifications.js - VERSION SIMPLIFIÉE POUR SYSTÈME ACTUEL
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../database/db';

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

      let query = db.notifications.where('user_id').equals(user.id);
      
      if (!includeRead) {
        query = query.and(notification => !notification.is_read);
      }

      const userNotifications = await query
        .reverse()
        .sortBy('created_at');

      setNotifications(userNotifications);

      // Compter les non lues
      const unreadCount = userNotifications.filter(n => !n.is_read).length;
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
      const unreadNotifications = await db.notifications
        .where('user_id')
        .equals(user.id)
        .and(notification => !notification.is_read)
        .toArray();

      for (const notification of unreadNotifications) {
        await db.notifications.update(notification.id, {
          is_read: true,
          read_at: new Date()
        });
      }
      
      // Mettre à jour le state local
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date()
        }))
      );

      setUnreadCount(0);

      console.log(`✅ ${unreadNotifications.length} notifications marquées comme lues`);

    } catch (err) {
      console.error('❌ Erreur marquage toutes notifications:', err);
      setError('Erreur lors du marquage des notifications');
    }
  };

  // ✅ SUPPRIMER UNE NOTIFICATION
  const deleteNotification = async (notificationId) => {
    try {
      await db.notifications.delete(notificationId);
      
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

  // ✅ OBTENIR LES NOTIFICATIONS PAR TYPE
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // ✅ OBTENIR LES NOTIFICATIONS NON LUES
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.is_read);
  };

  // ✅ ÉCOUTER LES CHANGEMENTS DE NOTIFICATIONS
  useEffect(() => {
    const handleNotificationsChanged = () => {
      console.log('🔔 === ÉVÉNEMENT NOTIFICATIONS CHANGED REÇU ===');
      console.log('📡 Event listener déclenché - Rechargement des notifications');
      loadNotifications(true); // Charger toutes les notifications (lues + non lues)
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
      loadNotifications(true); // Charger toutes les notifications au démarrage
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType,
    getUnreadNotifications
  };
};