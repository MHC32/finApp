// ===================================================================
// NOTIFICATION TYPES - FinApp Haiti
// Synchronisé avec Backend models/Notification.js
// ===================================================================

/**
 * Sources de notifications
 * Correspond EXACTEMENT à notificationSchema.source.enum dans le backend
 */
export const NotificationSource = {
  AI_ADVICE: 'ai_advice',
  AI_ANOMALY: 'ai_anomaly',
  AI_PREDICTION: 'ai_prediction',
  BUDGET_ALERT: 'budget_alert',
  SOL_REMINDER: 'sol_reminder',
  SOL_TURN: 'sol_turn',
  DEBT_REMINDER: 'debt_reminder',
  TRANSACTION: 'transaction',
  ACCOUNT: 'account',
  SYSTEM: 'system'
};

/**
 * Types de notifications
 * Correspond EXACTEMENT à notificationSchema.type.enum dans le backend
 */
export const NotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  URGENT: 'urgent'
};

/**
 * Priorités de notifications
 * Correspond EXACTEMENT à notificationSchema.priority.enum dans le backend
 */
export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Statuts de notifications
 * Correspond EXACTEMENT à notificationSchema.status.enum dans le backend
 */
export const NotificationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  ACTED: 'acted',
  DISMISSED: 'dismissed',
  FAILED: 'failed'
};

/**
 * Labels français pour les sources
 */
export const NotificationSourceLabels = {
  [NotificationSource.AI_ADVICE]: 'Conseil IA',
  [NotificationSource.AI_ANOMALY]: 'Anomalie détectée',
  [NotificationSource.AI_PREDICTION]: 'Prédiction',
  [NotificationSource.BUDGET_ALERT]: 'Alerte budget',
  [NotificationSource.SOL_REMINDER]: 'Rappel sol',
  [NotificationSource.SOL_TURN]: 'Tour de sol',
  [NotificationSource.DEBT_REMINDER]: 'Rappel dette',
  [NotificationSource.TRANSACTION]: 'Transaction',
  [NotificationSource.ACCOUNT]: 'Compte',
  [NotificationSource.SYSTEM]: 'Système'
};

/**
 * Labels français pour les types
 */
export const NotificationTypeLabels = {
  [NotificationType.INFO]: 'Information',
  [NotificationType.SUCCESS]: 'Succès',
  [NotificationType.WARNING]: 'Avertissement',
  [NotificationType.ERROR]: 'Erreur',
  [NotificationType.URGENT]: 'Urgent'
};

/**
 * Labels français pour les priorités
 */
export const NotificationPriorityLabels = {
  [NotificationPriority.LOW]: 'Faible',
  [NotificationPriority.MEDIUM]: 'Moyenne',
  [NotificationPriority.HIGH]: 'Haute',
  [NotificationPriority.URGENT]: 'Urgente'
};

/**
 * Labels français pour les statuts
 */
export const NotificationStatusLabels = {
  [NotificationStatus.PENDING]: 'En attente',
  [NotificationStatus.SENT]: 'Envoyée',
  [NotificationStatus.DELIVERED]: 'Délivrée',
  [NotificationStatus.READ]: 'Lue',
  [NotificationStatus.ACTED]: 'Action effectuée',
  [NotificationStatus.DISMISSED]: 'Ignorée',
  [NotificationStatus.FAILED]: 'Échec'
};

/**
 * Couleurs pour les types de notifications
 */
export const NotificationTypeColors = {
  [NotificationType.INFO]: '#2196F3',
  [NotificationType.SUCCESS]: '#4CAF50',
  [NotificationType.WARNING]: '#FF9800',
  [NotificationType.ERROR]: '#F44336',
  [NotificationType.URGENT]: '#9C27B0'
};

/**
 * Couleurs pour les priorités
 */
export const NotificationPriorityColors = {
  [NotificationPriority.LOW]: '#4CAF50',
  [NotificationPriority.MEDIUM]: '#FF9800',
  [NotificationPriority.HIGH]: '#F44336',
  [NotificationPriority.URGENT]: '#9C27B0'
};

/**
 * Icônes Material-UI pour les sources
 */
export const NotificationSourceIcons = {
  [NotificationSource.AI_ADVICE]: 'lightbulb',
  [NotificationSource.AI_ANOMALY]: 'warning',
  [NotificationSource.AI_PREDICTION]: 'insights',
  [NotificationSource.BUDGET_ALERT]: 'account_balance_wallet',
  [NotificationSource.SOL_REMINDER]: 'savings',
  [NotificationSource.SOL_TURN]: 'event',
  [NotificationSource.DEBT_REMINDER]: 'credit_card',
  [NotificationSource.TRANSACTION]: 'receipt',
  [NotificationSource.ACCOUNT]: 'account_balance',
  [NotificationSource.SYSTEM]: 'settings'
};

/**
 * Icônes Material-UI pour les types
 */
export const NotificationTypeIcons = {
  [NotificationType.INFO]: 'info',
  [NotificationType.SUCCESS]: 'check_circle',
  [NotificationType.WARNING]: 'warning',
  [NotificationType.ERROR]: 'error',
  [NotificationType.URGENT]: 'priority_high'
};

/**
 * @typedef {Object} NotificationChannels
 * @property {boolean} inApp - Notification in-app
 * @property {boolean} push - Notification push
 * @property {boolean} email - Notification email
 * @property {boolean} sms - Notification SMS
 */

/**
 * @typedef {Object} NotificationMetadata
 * @property {number} [amount] - Montant
 * @property {number} [percentage] - Pourcentage
 * @property {string} [entityId] - ID entité liée
 * @property {string} [entityType] - Type entité
 * @property {Object} [relatedData] - Données additionnelles
 */

/**
 * @typedef {Object} Notification
 * @property {string} _id - MongoDB ID
 * @property {string} user - User ID (ref User)
 * @property {string} source - Source de la notification
 * @property {string} type - Type (info/success/warning/error/urgent)
 * @property {string} title - Titre de la notification
 * @property {string} message - Message de la notification
 * @property {string} priority - Priorité
 * @property {boolean} actionable - Action possible
 * @property {string} [actionUrl] - URL de l'action
 * @property {string} [actionLabel] - Label du bouton action
 * @property {NotificationMetadata} [metadata] - Métadonnées
 * @property {NotificationChannels} channels - Canaux de diffusion
 * @property {string} status - Statut
 * @property {Date} [readAt] - Date de lecture
 * @property {Date} [actedAt] - Date d'action
 * @property {Date} [dismissedAt] - Date d'ignorance
 * @property {Date} [expiresAt] - Date d'expiration
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de modification
 */

/**
 * Valeurs par défaut pour une nouvelle notification
 */
export const defaultNotification = {
  source: NotificationSource.SYSTEM,
  type: NotificationType.INFO,
  title: '',
  message: '',
  priority: NotificationPriority.MEDIUM,
  actionable: false,
  channels: {
    inApp: true,
    push: false,
    email: false,
    sms: false
  },
  status: NotificationStatus.PENDING
};

/**
 * Règles de validation pour le formulaire Notification
 */
export const notificationValidationRules = {
  source: {
    required: true,
    enum: Object.values(NotificationSource),
    message: 'Source invalide'
  },
  type: {
    required: true,
    enum: Object.values(NotificationType),
    message: 'Type invalide'
  },
  title: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: 'Le titre doit contenir entre 5 et 200 caractères'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Le message doit contenir entre 10 et 500 caractères'
  },
  priority: {
    required: true,
    enum: Object.values(NotificationPriority),
    message: 'Priorité invalide'
  }
};

/**
 * Helper: Vérifier si la notification est lue
 */
export const isRead = (notification) => {
  return notification.status === NotificationStatus.READ || 
         notification.status === NotificationStatus.ACTED ||
         notification.status === NotificationStatus.DISMISSED;
};

/**
 * Helper: Vérifier si la notification est non lue
 */
export const isUnread = (notification) => {
  return !isRead(notification);
};

/**
 * Helper: Vérifier si la notification est expirée
 */
export const isExpired = (notification) => {
  if (!notification.expiresAt) return false;
  return new Date(notification.expiresAt) < new Date();
};

/**
 * Helper: Vérifier si la notification nécessite une action
 */
export const requiresAction = (notification) => {
  return notification.actionable && 
         notification.status !== NotificationStatus.ACTED &&
         !isExpired(notification);
};

/**
 * Helper: Obtenir la couleur selon le type
 */
export const getNotificationColor = (type) => {
  return NotificationTypeColors[type] || '#9E9E9E';
};

/**
 * Helper: Obtenir l'icône selon le type
 */
export const getNotificationIcon = (type) => {
  return NotificationTypeIcons[type] || 'notifications';
};

/**
 * Helper: Obtenir l'icône selon la source
 */
export const getSourceIcon = (source) => {
  return NotificationSourceIcons[source] || 'notifications';
};

/**
 * Helper: Calculer le temps écoulé depuis création
 */
export const getTimeAgo = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  
  return created.toLocaleDateString('fr-HT');
};

/**
 * Helper: Grouper notifications par date
 */
export const groupByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  notifications.forEach(notification => {
    const notifDate = new Date(notification.createdAt);
    
    if (notifDate >= today) {
      groups.today.push(notification);
    } else if (notifDate >= yesterday) {
      groups.yesterday.push(notification);
    } else if (notifDate >= weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });
  
  return groups;
};

/**
 * Helper: Filtrer notifications par priorité
 */
export const filterByPriority = (notifications, minPriority) => {
  const priorityOrder = {
    [NotificationPriority.LOW]: 1,
    [NotificationPriority.MEDIUM]: 2,
    [NotificationPriority.HIGH]: 3,
    [NotificationPriority.URGENT]: 4
  };
  
  const minLevel = priorityOrder[minPriority] || 1;
  
  return notifications.filter(n => 
    priorityOrder[n.priority] >= minLevel
  );
};

// Export par défaut de tous les types Notification
export default {
  NotificationSource,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationSourceLabels,
  NotificationTypeLabels,
  NotificationPriorityLabels,
  NotificationStatusLabels,
  NotificationTypeColors,
  NotificationPriorityColors,
  NotificationSourceIcons,
  NotificationTypeIcons,
  defaultNotification,
  notificationValidationRules,
  isRead,
  isUnread,
  isExpired,
  requiresAction,
  getNotificationColor,
  getNotificationIcon,
  getSourceIcon,
  getTimeAgo,
  groupByDate,
  filterByPriority
};