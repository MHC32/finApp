// src/components/notifications/NotificationCenter.jsx - VERSION UNIFIÉE
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, DollarSign, AlertCircle, Target, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Button, Badge } from '../ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'income_reminder':
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'income_processed':
        return <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'budget_alert':
        return <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'goal_milestone':
        return <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getNotificationColor = (type, isRead = false) => {
    const baseOpacity = isRead ? 'dark:bg-gray-800/50' : 'dark:bg-gray-800';
    const borderOpacity = isRead ? 'opacity-60' : '';
    
    switch (type) {
      case 'income_reminder':
        return `border-l-blue-500 bg-blue-50 ${baseOpacity} ${borderOpacity}`;
      case 'income_processed':
        return `border-l-green-500 bg-green-50 ${baseOpacity} ${borderOpacity}`;
      case 'budget_alert':
        return `border-l-orange-500 bg-orange-50 ${baseOpacity} ${borderOpacity}`;
      case 'goal_milestone':
        return `border-l-purple-500 bg-purple-50 ${baseOpacity} ${borderOpacity}`;
      default:
        return `border-l-gray-500 bg-gray-50 ${baseOpacity} ${borderOpacity}`;
    }
  };

  const getNotificationTitle = (notification) => {
    // Utiliser le titre de la notification ou un titre par défaut selon le type
    if (notification.title) {
      return notification.title;
    }

    switch (notification.type) {
      case 'income_reminder':
        return '📅 Rappel de revenus';
      case 'income_processed':
        return '💰 Revenus reçus';
      case 'budget_alert':
        return '🚨 Alerte budget';
      case 'goal_milestone':
        return '🎯 Objectif atteint';
      default:
        return '🔔 Notification';
    }
  };

  const formatNotificationTime = (notification) => {
    const date = new Date(notification.scheduled_for || notification.created_at);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    
    return format(date, 'dd MMM à HH:mm', { locale: fr });
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation(); // Empêcher de fermer le dropdown
    await deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="font-medium">Aucune notification</p>
                  <p className="text-sm mt-1">Vos alertes et rappels apparaîtront ici</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        getNotificationColor(notification.type, notification.is_read)
                      } ${notification.is_read ? 'opacity-75' : ''}`}
                      onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {getNotificationTitle(notification)}
                            </h4>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.is_read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(notification.id, e)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 pr-6">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatNotificationTime(notification)}
                            </p>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Données spécifiques selon le type */}
                          {notification.type === 'budget_alert' && notification.data && (
                            <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/20 rounded text-xs">
                              <div className="flex justify-between">
                                <span>Budget:</span>
                                <span className="font-medium">
                                  {notification.data.amount_spent?.toLocaleString()} / {notification.data.budget_amount?.toLocaleString()} {notification.data.currency}
                                </span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span>Utilisation:</span>
                                <span className={`font-medium ${notification.data.percentage > 100 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                  {notification.data.percentage?.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                  {unreadCount > 0 ? (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Marquer tout comme lu
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Toutes les notifications sont lues
                    </span>
                  )}
                  
                  {notifications.length > 10 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      +{notifications.length - 10} autres
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;