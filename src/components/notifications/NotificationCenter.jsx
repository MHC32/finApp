// src/components/notifications/NotificationCenter.jsx - VERSION COMPLÈTE ET CORRIGÉE
import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck,
  Clock, 
  DollarSign, 
  AlertCircle, 
  Target, 
  Trash2,
  Settings,
  Filter
} from 'lucide-react';
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
    deleteNotification,
    deleteReadNotifications,
    createTestNotification,
    getStats
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // ✅ FONCTION POUR OBTENIR L'ICÔNE DE NOTIFICATION
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

  // ✅ FONCTION POUR OBTENIR LA COULEUR DE BORDURE
  const getBorderColor = (type, isRead = false) => {
    const opacity = isRead ? '50' : '200';
    
    switch (type) {
      case 'income_reminder':
        return `border-l-blue-${opacity} ${isRead ? 'bg-blue-50/30' : 'bg-blue-50'} dark:${isRead ? 'bg-blue-900/10' : 'bg-blue-900/30'}`;
      case 'income_processed':
        return `border-l-green-${opacity} ${isRead ? 'bg-green-50/30' : 'bg-green-50'} dark:${isRead ? 'bg-green-900/10' : 'bg-green-900/30'}`;
      case 'budget_alert':
        return `border-l-orange-${opacity} ${isRead ? 'bg-orange-50/30' : 'bg-orange-50'} dark:${isRead ? 'bg-orange-900/10' : 'bg-orange-900/30'}`;
      case 'goal_milestone':
        return `border-l-purple-${opacity} ${isRead ? 'bg-purple-50/30' : 'bg-purple-50'} dark:${isRead ? 'bg-purple-900/10' : 'bg-purple-900/30'}`;
      default:
        return `border-l-gray-${opacity} ${isRead ? 'bg-gray-50/30' : 'bg-gray-50'} dark:${isRead ? 'bg-gray-800/30' : 'bg-gray-800/50'}`;
    }
  };

  // ✅ FONCTION POUR FORMATER L'HEURE DE NOTIFICATION
  const formatNotificationTime = (notification) => {
    const now = new Date();
    const notifTime = new Date(notification.created_at);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      return format(notifTime, 'dd MMM', { locale: fr });
    }
  };

  // ✅ FONCTION POUR OBTENIR LE TITRE FORMATÉ
  const getNotificationTitle = (notification) => {
    // Si la notification a déjà un titre, l'utiliser
    if (notification.title) {
      return notification.title;
    }
    
    // Sinon, générer un titre basé sur le type
    switch (notification.type) {
      case 'budget_alert':
        return '🚨 Alerte Budget';
      case 'income_reminder':
        return '💰 Rappel Revenus';
      case 'income_processed':
        return '✅ Revenus Traités';
      case 'goal_milestone':
        return '🎯 Objectif Atteint';
      default:
        return '🔔 Notification';
    }
  };

  // ✅ FONCTIONS DE GESTION DES ACTIONS
  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Erreur marquage tous comme lus:', error);
    }
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
    } catch (error) {
      console.error('Erreur suppression notifications lues:', error);
    }
  };

  const handleCreateTest = async () => {
    try {
      await createTestNotification('budget_alert');
      console.log('Notification de test créée');
    } catch (error) {
      console.error('Erreur création test:', error);
    }
  };

  // ✅ FILTRER LES NOTIFICATIONS SELON LES PRÉFÉRENCES
  const filteredNotifications = showOnlyUnread 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const stats = getStats();

  return (
    <div className="relative">
      {/* ✅ BOUTON PRINCIPAL DE NOTIFICATION */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
                   hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   dark:focus:ring-offset-gray-800"
        title={`${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`}
      >
        <Bell className="w-6 h-6" />
        
        {/* Badge de compteur */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full 
                          h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ✅ PANNEAU DE NOTIFICATIONS */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel principal */}
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
                         border border-gray-200 dark:border-gray-700 z-50 max-h-[32rem] overflow-hidden">
            
            {/* ✅ EN-TÊTE AVEC STATISTIQUES */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r 
                           from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Bouton actions */}
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                              hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Actions"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  
                  {/* Bouton fermer */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                              hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Statistiques */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total: <span className="font-medium text-gray-900 dark:text-white">{stats.total}</span>
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Non lues: <span className="font-medium">{stats.unread}</span>
                  </span>
                </div>
                
                {/* Filtre non lues */}
                <button
                  onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    showOnlyUnread 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  title={showOnlyUnread ? 'Afficher toutes' : 'Afficher non lues seulement'}
                >
                  <Filter className="w-3 h-3" />
                  <span>{showOnlyUnread ? 'Non lues' : 'Toutes'}</span>
                </button>
              </div>
            </div>

            {/* ✅ PANNEAU D'ACTIONS (CONDITIONNEL) */}
            {showActions && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Tout marquer lu
                  </Button>
                  
                  <Button
                    onClick={handleDeleteRead}
                    disabled={stats.read === 0}
                    size="sm"
                    variant="outline"
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Supprimer lues
                  </Button>
                  
                  <Button
                    onClick={handleCreateTest}
                    size="sm"
                    variant="outline"
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    🧪 Test
                  </Button>
                </div>
              </div>
            )}

            {/* ✅ LISTE DES NOTIFICATIONS */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="font-medium mb-1">
                    {showOnlyUnread ? 'Aucune notification non lue' : 'Aucune notification'}
                  </p>
                  <p className="text-sm">
                    {showOnlyUnread 
                      ? 'Toutes vos notifications sont à jour !' 
                      : 'Vos alertes et rappels apparaîtront ici'
                    }
                  </p>
                  
                  {/* Bouton pour créer une notification de test */}
                  {!showOnlyUnread && (
                    <button
                      onClick={handleCreateTest}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 
                                dark:hover:text-blue-300 underline"
                    >
                      Créer une notification de test
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                 transition-all duration-200 cursor-pointer group
                                 ${getBorderColor(notification.type, notification.is_read)}`}
                      onClick={() => !notification.is_read && handleMarkAsRead(notification.id, { stopPropagation: () => {} })}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icône de notification */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            {/* Titre et contenu */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-medium mb-1 ${
                                notification.is_read 
                                  ? 'text-gray-600 dark:text-gray-400' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {getNotificationTitle(notification)}
                              </h4>
                              
                              <p className={`text-sm mb-2 ${
                                notification.is_read 
                                  ? 'text-gray-500 dark:text-gray-500' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {formatNotificationTime(notification)}
                                </p>
                                
                                {/* Indicateur non lu */}
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            {/* Actions (visibles au hover) */}
                            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.is_read && (
                                <button
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 
                                            dark:hover:text-blue-300 transition-colors rounded"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(notification.id, e)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 
                                          transition-colors rounded"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Données spécifiques pour les alertes budget */}
                          {notification.type === 'budget_alert' && notification.data && (
                            <div className="mt-3 p-2 bg-white dark:bg-gray-900/50 border border-orange-200 
                                           dark:border-orange-800 rounded-lg text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-orange-800 dark:text-orange-300 font-medium">
                                  Budget: {notification.data.budget_name}
                                </span>
                                <span className={`font-bold ${
                                  (notification.data.percentage || 0) > 100 
                                    ? 'text-red-600 dark:text-red-400' 
                                    : 'text-orange-600 dark:text-orange-400'
                                }`}>
                                  {(notification.data.percentage || 0).toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between mt-1">
                                <span className="text-orange-800 dark:text-orange-300">Dépensé:</span>
                                <span className="font-medium text-orange-900 dark:text-orange-200">
                                  {(notification.data.amount_spent || 0).toLocaleString()} / {(notification.data.budget_amount || 0).toLocaleString()} {notification.data.currency || 'HTG'}
                                </span>
                              </div>
                              
                              {/* Barre de progression */}
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      (notification.data.percentage || 0) > 100 
                                        ? 'bg-red-500' 
                                        : (notification.data.percentage || 0) > 90 
                                          ? 'bg-orange-500' 
                                          : 'bg-yellow-500'
                                    }`}
                                    style={{ 
                                      width: `${Math.min((notification.data.percentage || 0), 100)}%` 
                                    }}
                                  ></div>
                                </div>
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

            {/* ✅ PIED DE PAGE */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-gray-500 dark:text-gray-400">
                    {filteredNotifications.length > 10 && (
                      <span>Affichage de 10 sur {filteredNotifications.length}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 
                                  dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        Marquer tout comme lu
                      </button>
                    )}
                    
                    {stats.read > 0 && (
                      <button
                        onClick={handleDeleteRead}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 
                                  dark:hover:text-red-300 font-medium transition-colors"
                      >
                        Nettoyer
                      </button>
                    )}
                  </div>
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