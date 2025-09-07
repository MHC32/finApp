// src/services/notificationService.js - VERSION CORRIGÉE ANTI-DOUBLONS
import { db, NOTIFICATION_TYPES } from '../database/db';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export class NotificationService {
  
  // ✅ CORRECTION MAJEURE: Créer une notification de budget avec logique anti-doublons
  static async createBudgetAlert(userId, budgetId, budgetName, percentage, amountSpent, budgetAmount, currency, period = 'monthly') {
    try {
      console.log('🚨 === SERVICE NOTIFICATION BUDGET ===');
      console.log(`Budget: ${budgetName}, Pourcentage: ${percentage.toFixed(1)}%`);

      // ✅ ÉTAPE 1: Valider les paramètres
      if (!userId || !budgetId || !budgetName || percentage < 0) {
        console.log('❌ Paramètres invalides pour notification budget');
        return null;
      }

      // ✅ ÉTAPE 2: Déterminer si une notification est nécessaire
      if (percentage < 80) {
        console.log(`⚪ Pourcentage sous le seuil (${percentage.toFixed(1)}% < 80%)`);
        return null;
      }

      // ✅ ÉTAPE 3: Générer une clé unique pour éviter les doublons
      const notificationKey = this.generateNotificationKey(budgetId, period);
      console.log(`🔑 Clé de notification: ${notificationKey}`);

      // ✅ ÉTAPE 4: Vérifier les doublons récents
      const isDuplicate = await this.checkForDuplicateNotification(userId, budgetId, notificationKey, percentage);
      if (isDuplicate) {
        console.log('🚫 Notification en doublon évitée');
        return null;
      }

      // ✅ ÉTAPE 5: Déterminer le type d'alerte et le message
      const alertData = this.determineAlertType(percentage, budgetName, amountSpent, budgetAmount, currency);
      
      // ✅ ÉTAPE 6: Créer la notification
      const notification = {
        user_id: userId,
        type: NOTIFICATION_TYPES.BUDGET_ALERT,
        title: alertData.title,
        message: alertData.message,
        data: {
          budget_id: budgetId,
          budget_name: budgetName,
          percentage: Math.round(percentage * 100) / 100,
          amount_spent: amountSpent,
          budget_amount: budgetAmount,
          currency,
          alert_type: alertData.alertType,
          notification_key: notificationKey,
          period: period,
          threshold_reached: this.getThresholdLevel(percentage),
          created_period: format(new Date(), 'yyyy-MM-dd'),
          severity: this.getSeverityScore(percentage)
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      };

      const notificationId = await db.notifications.add(notification);
      console.log(`✅ Notification budget créée avec ID: ${notificationId}`);

      // ✅ ÉTAPE 7: Déclencher l'événement UI
      window.dispatchEvent(new CustomEvent('notificationsChanged', {
        detail: { type: 'budget_alert', budgetId, severity: notification.data.severity }
      }));

      return notificationId;

    } catch (error) {
      console.error('❌ Erreur création notification budget:', error);
      return null;
    }
  }

  // ✅ FONCTION HELPER: Générer une clé unique de notification
  static generateNotificationKey(budgetId, period) {
    const now = new Date();
    let periodKey;
    
    switch (period) {
      case 'monthly':
        periodKey = format(now, 'yyyy-MM');
        break;
      case 'weekly':
        const startOfWeek = this.getStartOfWeek(now);
        periodKey = format(startOfWeek, 'yyyy-ww');
        break;
      case 'daily':
        periodKey = format(now, 'yyyy-MM-dd');
        break;
      case 'custom':
        // Pour les budgets personnalisés, utiliser le mois actuel
        periodKey = format(now, 'yyyy-MM');
        break;
      default:
        periodKey = format(now, 'yyyy-MM');
    }
    
    return `budget_${budgetId}_${periodKey}`;
  }

  // ✅ FONCTION HELPER: Obtenir le début de la semaine
  static getStartOfWeek(date, weekStartsOn = 1) {
    const day = date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    const result = new Date(date);
    result.setDate(date.getDate() - diff);
    return result;
  }

  // ✅ FONCTION HELPER: Vérifier les doublons
  static async checkForDuplicateNotification(userId, budgetId, notificationKey, currentPercentage) {
    try {
      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 heures

      // Chercher des notifications récentes pour ce budget
      const recentNotifications = await db.notifications
        .where('user_id')
        .equals(userId)
        .and(notification => {
          const isForBudget = notification.type === NOTIFICATION_TYPES.BUDGET_ALERT && 
                             notification.data?.budget_id === budgetId;
          
          const isRecent = new Date(notification.created_at) > sixHoursAgo;
          
          // Vérifier la clé de notification
          const hasSameKey = notification.data?.notification_key === notificationKey;
          
          // Vérifier si le pourcentage est similaire (±3% pour éviter le spam)
          const notifPercentage = notification.data?.percentage || 0;
          const percentageDiff = Math.abs(notifPercentage - currentPercentage);
          const isSimilarPercentage = percentageDiff <= 3;
          
          return isForBudget && isRecent && (hasSameKey || isSimilarPercentage);
        })
        .toArray();

      if (recentNotifications.length > 0) {
        const latestNotif = recentNotifications[0];
        console.log(`🔍 Notification similaire trouvée:`, {
          id: latestNotif.id,
          created: latestNotif.created_at,
          percentage: latestNotif.data?.percentage,
          key: latestNotif.data?.notification_key
        });
        return true;
      }

      return false;

    } catch (error) {
      console.error('❌ Erreur vérification doublons:', error);
      return false;
    }
  }

  // ✅ FONCTION HELPER: Déterminer le type d'alerte
  static determineAlertType(percentage, budgetName, amountSpent, budgetAmount, currency) {
    let alertType, title, message;

    if (percentage >= 120) {
      alertType = 'critical';
      title = '🔥 Budget largement dépassé !';
      message = `URGENT : Votre budget "${budgetName}" est dépassé de ${(percentage - 100).toFixed(1)}% ! Vous avez dépensé ${amountSpent.toLocaleString()} ${currency} sur ${budgetAmount.toLocaleString()} ${currency}. Action immédiate recommandée.`;
    } else if (percentage >= 100) {
      alertType = 'danger';
      title = '🚨 Budget dépassé !';
      message = `Votre budget "${budgetName}" est dépassé de ${(percentage - 100).toFixed(1)}%. Vous avez dépensé ${amountSpent.toLocaleString()} ${currency} sur ${budgetAmount.toLocaleString()} ${currency}.`;
    } else if (percentage >= 95) {
      alertType = 'warning';
      title = '🔴 Budget presque épuisé';
      message = `Attention ! Votre budget "${budgetName}" est utilisé à ${percentage.toFixed(1)}% (${amountSpent.toLocaleString()} ${currency} / ${budgetAmount.toLocaleString()} ${currency}). Plus que ${((budgetAmount - amountSpent)).toLocaleString()} ${currency} disponibles.`;
    } else if (percentage >= 80) {
      alertType = 'info';
      title = '⚠️ Budget bientôt atteint';
      message = `Information : Vous avez utilisé ${percentage.toFixed(1)}% de votre budget "${budgetName}" (${amountSpent.toLocaleString()} ${currency} / ${budgetAmount.toLocaleString()} ${currency}).`;
    }

    return { alertType, title, message };
  }

  // ✅ FONCTION HELPER: Obtenir le niveau de seuil atteint
  static getThresholdLevel(percentage) {
    if (percentage >= 120) return 'critical';
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 95) return 'nearly_exhausted';
    if (percentage >= 90) return 'high';
    if (percentage >= 80) return 'medium';
    return 'low';
  }

  // ✅ FONCTION HELPER: Calculer un score de sévérité
  static getSeverityScore(percentage) {
    if (percentage >= 120) return 5; // Critique
    if (percentage >= 100) return 4; // Danger
    if (percentage >= 95) return 3;  // Avertissement élevé
    if (percentage >= 90) return 2;  // Avertissement
    if (percentage >= 80) return 1;  // Information
    return 0; // Aucune alerte
  }

  // ✅ CORRECTION: Créer une notification de revenus
  static async createIncomeNotification(userId, incomeSourceId, type, title, message, data = {}) {
    try {
      const notification = {
        user_id: userId,
        type: type,
        title,
        message,
        data: {
          income_source_id: incomeSourceId,
          notification_type: type,
          created_period: format(new Date(), 'yyyy-MM-dd'),
          ...data
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      };

      const notificationId = await db.notifications.add(notification);
      console.log('✅ Notification revenus créée:', notificationId);

      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged', {
        detail: { type: 'income', incomeSourceId }
      }));

      return notificationId;

    } catch (error) {
      console.error('❌ Erreur création notification revenus:', error);
      return null;
    }
  }

  // ✅ CORRECTION: Récupérer toutes les notifications d'un utilisateur
  static async getUserNotifications(userId, includeRead = false, limit = 50) {
    try {
      let query = db.notifications.where('user_id').equals(userId);
      
      if (!includeRead) {
        query = query.and(notification => !notification.is_read);
      }

      const notifications = await query
        .reverse()
        .sortBy('created_at');

      // Limiter le nombre de résultats
      return notifications.slice(0, limit);

    } catch (error) {
      console.error('❌ Erreur récupération notifications:', error);
      return [];
    }
  }

  // ✅ NOUVELLE FONCTION: Marquer une notification comme lue
  static async markNotificationAsRead(notificationId) {
    try {
      await db.notifications.update(notificationId, {
        is_read: true,
        read_at: new Date()
      });

      console.log(`✅ Notification ${notificationId} marquée comme lue`);
      
      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged', {
        detail: { type: 'mark_read', notificationId }
      }));

      return true;

    } catch (error) {
      console.error('❌ Erreur marquage notification comme lue:', error);
      return false;
    }
  }

  // ✅ NOUVELLE FONCTION: Supprimer une notification
  static async deleteNotification(notificationId) {
    try {
      await db.notifications.delete(notificationId);
      
      console.log(`✅ Notification ${notificationId} supprimée`);
      
      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged', {
        detail: { type: 'delete', notificationId }
      }));

      return true;

    } catch (error) {
      console.error('❌ Erreur suppression notification:', error);
      return false;
    }
  }

  // ✅ NOUVELLE FONCTION: Nettoyer les anciennes notifications
  static async cleanupOldNotifications(userId, daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const oldNotifications = await db.notifications
        .where('user_id')
        .equals(userId)
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

        // Déclencher l'événement pour mettre à jour l'UI
        window.dispatchEvent(new CustomEvent('notificationsChanged', {
          detail: { type: 'cleanup', count: oldNotifications.length }
        }));
      }

      return oldNotifications.length;

    } catch (error) {
      console.error('❌ Erreur nettoyage notifications:', error);
      return 0;
    }
  }

  // ✅ NOUVELLE FONCTION: Obtenir les statistiques des notifications
  static async getNotificationStats(userId) {
    try {
      const allNotifications = await db.notifications
        .where('user_id')
        .equals(userId)
        .toArray();

      const unreadCount = allNotifications.filter(n => !n.is_read).length;
      const budgetAlerts = allNotifications.filter(n => n.type === NOTIFICATION_TYPES.BUDGET_ALERT).length;
      const incomeNotifications = allNotifications.filter(n => n.type === NOTIFICATION_TYPES.INCOME_REMINDER || n.type === NOTIFICATION_TYPES.INCOME_PROCESSED).length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayNotifications = allNotifications.filter(n => 
        new Date(n.created_at) >= today
      ).length;

      return {
        total: allNotifications.length,
        unread: unreadCount,
        read: allNotifications.length - unreadCount,
        budgetAlerts,
        incomeNotifications,
        today: todayNotifications
      };

    } catch (error) {
      console.error('❌ Erreur statistiques notifications:', error);
      return {
        total: 0,
        unread: 0,
        read: 0,
        budgetAlerts: 0,
        incomeNotifications: 0,
        today: 0
      };
    }
  }

  // ✅ NOUVELLE FONCTION: Tester la création d'une notification (pour debug)
  static async testBudgetNotification(userId, budgetData) {
    console.log('🧪 === TEST NOTIFICATION BUDGET ===');
    
    const result = await this.createBudgetAlert(
      userId,
      budgetData.id,
      budgetData.name,
      budgetData.percentage,
      budgetData.spent,
      budgetData.amount,
      budgetData.currency,
      budgetData.period
    );

    console.log('🧪 Résultat test:', result ? 'Notification créée' : 'Notification non créée');
    return result;
  }
}