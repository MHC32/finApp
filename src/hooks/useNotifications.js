// src/hooks/useNotifications.js - HOOK POUR LES NOTIFICATIONS
import { useAuthStore } from '../store/authStore.js';

export function useNotifications() {
  const {
    notifications,
    addNotification,
    removeNotification
  } = useAuthStore();

  return {
    // État
    notifications,
    hasNotifications: notifications.length > 0,
    unreadCount: notifications.filter(n => !n.read).length,
    
    // Actions
    add: (notification) => addNotification(notification),
    remove: (id) => removeNotification(id),
    clear: () => {
      notifications.forEach(n => removeNotification(n.id));
    },
    
    // Utilitaires par type
    addSuccess: (title, message) => addNotification({
      type: 'success',
      title,
      message,
      duration: 5000
    }),
    
    addError: (title, message) => addNotification({
      type: 'error',
      title,
      message,
      duration: 0 // Persistent
    }),
    
    addWarning: (title, message) => addNotification({
      type: 'warning',
      title,
      message,
      duration: 8000
    }),
    
    addInfo: (title, message) => addNotification({
      type: 'info',
      title,
      message,
      duration: 6000
    })
  };
}
