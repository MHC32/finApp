// src/services/incomeService.js
import { db, INCOME_FREQUENCIES, PAYMENT_STATUS } from '../database/db';
import { addDays, addWeeks, addMonths, format, isWeekend, nextMonday, isBefore, isToday } from 'date-fns';

export class IncomeService {
  
  // ✅ CALCULER LA PROCHAINE DATE DE PAIEMENT
  static calculateNextPaymentDate(frequency, paymentDay, lastPaymentDate = null) {
    const now = new Date();
    let nextDate;

    switch (frequency) {
      case INCOME_FREQUENCIES.MONTHLY:
        // Tous les X du mois (ex: tous les 30)
        nextDate = new Date(now.getFullYear(), now.getMonth(), paymentDay);
        
        // Si on a dépassé ce mois, passer au mois suivant
        if (nextDate <= now) {
          nextDate = new Date(now.getFullYear(), now.getMonth() + 1, paymentDay);
        }
        break;

      case INCOME_FREQUENCIES.BI_MONTHLY:
        // 2 fois par mois (15 et 30 par exemple)
        const day15 = new Date(now.getFullYear(), now.getMonth(), 15);
        const day30 = new Date(now.getFullYear(), now.getMonth(), 30);
        
        if (now < day15) {
          nextDate = day15;
        } else if (now < day30) {
          nextDate = day30;
        } else {
          // Mois suivant, 15
          nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 15);
        }
        break;

      case INCOME_FREQUENCIES.WEEKLY:
        // Chaque semaine, même jour (ex: chaque vendredi)
        nextDate = new Date(now);
        nextDate.setDate(now.getDate() + ((paymentDay - now.getDay() + 7) % 7) || 7);
        break;

      case INCOME_FREQUENCIES.BI_WEEKLY:
        // Toutes les 2 semaines depuis la dernière date
        if (lastPaymentDate) {
          nextDate = addWeeks(new Date(lastPaymentDate), 2);
        } else {
          // Première fois, utiliser le jour de la semaine
          nextDate = new Date(now);
          nextDate.setDate(now.getDate() + ((paymentDay - now.getDay() + 7) % 7) || 7);
        }
        break;

      default:
        nextDate = addDays(now, 1);
    }

    // ✅ GESTION DES JOURS FÉRIÉS/WEEKEND
    return this.adjustForWeekends(nextDate);
  }

  // ✅ AJUSTER POUR LES WEEKENDS (reporter au lundi)
  static adjustForWeekends(date) {
    if (isWeekend(date)) {
      return nextMonday(date);
    }
    return date;
  }

  // ✅ CRÉER UNE SOURCE DE REVENUS
  static async createIncomeSource(userId, incomeData) {
    const nextPaymentDate = this.calculateNextPaymentDate(
      incomeData.frequency, 
      incomeData.payment_day
    );

    const incomeSource = {
      user_id: userId,
      name: incomeData.name,
      employer: incomeData.employer || '',
      amount: parseFloat(incomeData.amount),
      currency: incomeData.currency,
      frequency: incomeData.frequency,
      payment_day: incomeData.payment_day,
      payment_time: incomeData.payment_time || '08:00',
      destination_account_id: parseInt(incomeData.destination_account_id),
      category: incomeData.category || 'salary',
      is_active: true,
      next_payment_date: nextPaymentDate,
      created_at: new Date(),
      updated_at: new Date()
    };

    const id = await db.income_sources.add(incomeSource);
    
    // Programmer la première notification
    await this.scheduleNotification(id, nextPaymentDate);
    
    return await db.income_sources.get(id);
  }

  // ✅ PROGRAMMER UNE NOTIFICATION (1h avant)
  static async scheduleNotification(incomeSourceId, paymentDate) {
    const incomeSource = await db.income_sources.get(incomeSourceId);
    if (!incomeSource) return;

    // Notification 1h avant
    const notificationDate = new Date(paymentDate);
    notificationDate.setHours(notificationDate.getHours() - 1);

    const notification = {
      user_id: incomeSource.user_id,
      type: 'income_reminder',
      title: 'Salaire à venir',
      message: `Votre ${incomeSource.name} de ${incomeSource.amount.toLocaleString()} ${incomeSource.currency} sera ajouté dans 1 heure`,
      data: {
        income_source_id: incomeSourceId,
        expected_amount: incomeSource.amount,
        currency: incomeSource.currency
      },
      is_read: false,
      scheduled_for: notificationDate,
      created_at: new Date()
    };

    return await db.notifications.add(notification);
  }

  // ✅ VÉRIFIER ET TRAITER LES PAIEMENTS DUS
  static async processPendingPayments() {
    const now = new Date();
    console.log('🔄 Vérification des paiements automatiques...');

    // Récupérer toutes les sources actives dont la date est due
    const dueIncomeSources = await db.income_sources
      .where('is_active')
      .equals(1)
      .and(source => source.next_payment_date <= now)
      .toArray();

    console.log(`💰 ${dueIncomeSources.length} paiement(s) à traiter`);

    for (const incomeSource of dueIncomeSources) {
      try {
        await this.processPayment(incomeSource);
      } catch (error) {
        console.error(`❌ Erreur lors du traitement du paiement ${incomeSource.id}:`, error);
      }
    }
  }

  // ✅ TRAITER UN PAIEMENT SPÉCIFIQUE
  static async processPayment(incomeSource) {
    console.log(`💵 Traitement du paiement: ${incomeSource.name}`);

    try {
      // 1. Créer la transaction
      const transaction = {
        user_id: incomeSource.user_id,
        account_id: incomeSource.destination_account_id,
        date: new Date(),
        amount: incomeSource.amount,
        description: `${incomeSource.name} - ${incomeSource.employer}`,
        category: 'income',
        subcategory: incomeSource.category,
        payment_method: 'automatic',
        created_at: new Date(),
        updated_at: new Date()
      };

      const transactionId = await db.transactions.add(transaction);

      // 2. Mettre à jour le solde du compte
      const account = await db.accounts.get(incomeSource.destination_account_id);
      if (account) {
        const newBalance = parseFloat(account.current_balance) + parseFloat(incomeSource.amount);
        await db.accounts.update(incomeSource.destination_account_id, {
          current_balance: newBalance,
          updated_at: new Date()
        });

        // Déclencher la mise à jour des comptes
        window.dispatchEvent(new CustomEvent('accountsChanged'));
      }

      // 3. Enregistrer le paiement automatique
      await db.automatic_payments.add({
        income_source_id: incomeSource.id,
        transaction_id: transactionId,
        expected_date: incomeSource.next_payment_date,
        actual_date: new Date(),
        amount: incomeSource.amount,
        status: PAYMENT_STATUS.COMPLETED,
        created_at: new Date()
      });

      // 4. Calculer la prochaine date de paiement
      const nextPaymentDate = this.calculateNextPaymentDate(
        incomeSource.frequency,
        incomeSource.payment_day,
        new Date()
      );

      // 5. Mettre à jour la source de revenus
      await db.income_sources.update(incomeSource.id, {
        next_payment_date: nextPaymentDate,
        updated_at: new Date()
      });

      // 6. Programmer la prochaine notification
      await this.scheduleNotification(incomeSource.id, nextPaymentDate);

      // 7. Notification de confirmation
      await db.notifications.add({
        user_id: incomeSource.user_id,
        type: 'income_processed',
        title: 'Paiement reçu',
        message: `${incomeSource.name}: +${incomeSource.amount.toLocaleString()} ${incomeSource.currency} ajouté à votre compte`,
        data: {
          income_source_id: incomeSource.id,
          transaction_id: transactionId,
          amount: incomeSource.amount,
          currency: incomeSource.currency
        },
        is_read: false,
        scheduled_for: new Date(),
        created_at: new Date()
      });

      console.log(`✅ Paiement traité avec succès: ${incomeSource.name}`);

    } catch (error) {
      // Enregistrer l'échec
      await db.automatic_payments.add({
        income_source_id: incomeSource.id,
        transaction_id: null,
        expected_date: incomeSource.next_payment_date,
        actual_date: new Date(),
        amount: incomeSource.amount,
        status: PAYMENT_STATUS.FAILED,
        created_at: new Date()
      });

      throw error;
    }
  }

  // ✅ OBTENIR LES NOTIFICATIONS NON LUES
  static async getUnreadNotifications(userId) {
    const now = new Date();
    return await db.notifications
      .where(['user_id', 'is_read'])
      .equals([userId, false])
      .and(notification => notification.scheduled_for <= now)
      .reverse()
      .sortBy('scheduled_for');
  }

  // ✅ MARQUER UNE NOTIFICATION COMME LUE
  static async markNotificationAsRead(notificationId) {
    return await db.notifications.update(notificationId, { is_read: true });
  }

  // ✅ INITIALISER LE SERVICE (à appeler au démarrage)
  static async initialize() {
    console.log('🚀 Initialisation du service de revenus automatiques');
    
    // Traiter immédiatement les paiements en retard
    await this.processPendingPayments();
    
    // Programmer une vérification toutes les heures
    setInterval(() => {
      this.processPendingPayments();
    }, 60 * 60 * 1000); // 1 heure
  }
}