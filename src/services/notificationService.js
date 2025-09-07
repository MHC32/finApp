// src/services/notificationService.js
import { db, NOTIFICATION_TYPES } from '../database/db';

export class NotificationService {
  
  // ✅ CRÉER UNE NOTIFICATION DE BUDGET
  static async createBudgetAlert(userId, budgetId, budgetName, percentage, amountSpent, budgetAmount, currency) {
    try {
      console.log('🚨 Création notification budget:', { budgetName, percentage });

      let alertType, title, message;

      if (percentage >= 100) {
        alertType = 'danger';
        title = '🚨 Budget dépassé !';
        message = `Votre budget "${budgetName}" est dépassé de ${(percentage - 100).toFixed(1)}%. Vous avez dépensé ${amountSpent.toLocaleString()} ${currency} sur ${budgetAmount.toLocaleString()} ${currency}.`;
      } else if (percentage >= 80) {
        alertType = 'warning';
        title = '⚠️ Budget bientôt atteint';
        message = `Attention ! Vous avez utilisé ${percentage.toFixed(1)}% de votre budget "${budgetName}" (${amountSpent.toLocaleString()} ${currency} / ${budgetAmount.toLocaleString()} ${currency}).`;
      } else {
        // Pas d'alerte nécessaire
        return null;
      }

      // Vérifier si une notification similaire existe déjà (éviter les doublons)
      const existingNotifications = await db.notifications
        .where('user_id')
        .equals(userId)
        .and(notification => 
          notification.type === NOTIFICATION_TYPES.BUDGET_ALERT &&
          notification.data?.budget_id === budgetId &&
          !notification.is_read
        )
        .toArray();

      // Si une notification non lue existe déjà, la mettre à jour
      if (existingNotifications.length > 0) {
        const existingNotification = existingNotifications[0];
        await db.notifications.update(existingNotification.id, {
          title,
          message,
          data: {
            budget_id: budgetId,
            budget_name: budgetName,
            percentage,
            amount_spent: amountSpent,
            budget_amount: budgetAmount,
            currency,
            alert_type: alertType
          },
          updated_at: new Date()
        });

        console.log('✅ Notification budget mise à jour');
        return existingNotification.id;
      }

      // Créer une nouvelle notification
      const notification = {
        user_id: userId,
        type: NOTIFICATION_TYPES.BUDGET_ALERT,
        title,
        message,
        data: {
          budget_id: budgetId,
          budget_name: budgetName,
          percentage,
          amount_spent: amountSpent,
          budget_amount: budgetAmount,
          currency,
          alert_type: alertType
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      };

      const notificationId = await db.notifications.add(notification);
      console.log('✅ Notification budget créée:', notificationId);

      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged'));

      return notificationId;

    } catch (error) {
      console.error('❌ Erreur création notification budget:', error);
      return null;
    }
  }

  // ✅ CRÉER UNE NOTIFICATION DE REVENUS
  static async createIncomeNotification(userId, incomeSourceId, type, title, message, data = {}) {
    try {
      const notification = {
        user_id: userId,
        type: type,
        title,
        message,
        data: {
          income_source_id: incomeSourceId,
          ...data
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      };

      const notificationId = await db.notifications.add(notification);
      console.log('✅ Notification revenus créée:', notificationId);

      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged'));

      return notificationId;

    } catch (error) {
      console.error('❌ Erreur création notification revenus:', error);
      return null;
    }
  }

  // ✅ RÉCUPÉRER TOUTES LES NOTIFICATIONS D'UN UTILISATEUR
  static async getUserNotifications(userId, includeRead = false) {
    try {
      let query = db.notifications.where('user_id').equals(userId);
      
      if (!includeRead) {
        query = query.and(notification => !notification.is_read);
      }

      const notifications = await query
        .reverse()
        .sortBy('created_at');

      console.log(`📥 Notifications récupérées: ${notifications.length} (includeRead: ${includeRead})`);
      return notifications;

    } catch (error) {
      console.error('❌ Erreur récupération notifications:', error);
      return [];
    }
  }

  // ✅ MARQUER UNE NOTIFICATION COMME LUE
  static async markAsRead(notificationId) {
    try {
      await db.notifications.update(notificationId, {
        is_read: true,
        read_at: new Date()
      });

      console.log('✅ Notification marquée comme lue:', notificationId);
      
      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged'));

    } catch (error) {
      console.error('❌ Erreur marquage notification:', error);
    }
  }

  // ✅ MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  static async markAllAsRead(userId) {
    try {
      const unreadNotifications = await db.notifications
        .where('user_id')
        .equals(userId)
        .and(notification => !notification.is_read)
        .toArray();

      for (const notification of unreadNotifications) {
        await db.notifications.update(notification.id, {
          is_read: true,
          read_at: new Date()
        });
      }

      console.log(`✅ ${unreadNotifications.length} notifications marquées comme lues`);
      
      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged'));

    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications:', error);
    }
  }

  // ✅ SUPPRIMER UNE NOTIFICATION
  static async deleteNotification(notificationId) {
    try {
      await db.notifications.delete(notificationId);
      console.log('✅ Notification supprimée:', notificationId);
      
      // Déclencher l'événement pour mettre à jour l'UI
      window.dispatchEvent(new CustomEvent('notificationsChanged'));

    } catch (error) {
      console.error('❌ Erreur suppression notification:', error);
    }
  }

  // ✅ NETTOYER LES ANCIENNES NOTIFICATIONS (plus de 30 jours)
  static async cleanupOldNotifications(userId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldNotifications = await db.notifications
        .where('user_id')
        .equals(userId)
        .and(notification => 
          notification.is_read && 
          new Date(notification.created_at) < thirtyDaysAgo
        )
        .toArray();

      for (const notification of oldNotifications) {
        await db.notifications.delete(notification.id);
      }

      console.log(`🧹 ${oldNotifications.length} anciennes notifications supprimées`);

    } catch (error) {
      console.error('❌ Erreur nettoyage notifications:', error);
    }
  }

  // ✅ OBTENIR LE NOMBRE DE NOTIFICATIONS NON LUES
  static async getUnreadCount(userId) {
    try {
      const count = await db.notifications
        .where('user_id')
        .equals(userId)
        .and(notification => !notification.is_read)
        .count();

      return count;

    } catch (error) {
      console.error('❌ Erreur comptage notifications:', error);
      return 0;
    }
  }
}