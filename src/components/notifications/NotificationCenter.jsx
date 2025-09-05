// src/components/notifications/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useIncomeSources } from '../../hooks/useIncomeSources';
import { Button, Badge } from '../ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationCenter = () => {
  const { notifications, markNotificationAsRead } = useIncomeSources();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.is_read).length);
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'income_reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'income_processed':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'budget_alert':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'income_reminder':
        return 'border-l-blue-500 bg-blue-50';
      case 'income_processed':
        return 'border-l-green-500 bg-green-50';
      case 'budget_alert':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  🔔 Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 hover:bg-gray-50 transition-colors ${
                        getNotificationColor(notification.type)
                      } ${notification.is_read ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                                title="Marquer comme lu"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(notification.scheduled_for), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    // Marquer toutes comme lues
                    notifications.forEach(notification => {
                      if (!notification.is_read) {
                        markNotificationAsRead(notification.id);
                      }
                    });
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marquer tout comme lu
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;