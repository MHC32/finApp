import Dexie from 'dexie';

export class FinAppDatabase extends Dexie {
  constructor() {
    super('FinAppHaitiDB');
    
    this.version(1).stores({
      // Configuration utilisateur
      user_profile: '++id, user_id, name, email, created_at, updated_at',
      
      // Comptes bancaires
      accounts: '++id, user_id, name, bank_name, account_type, currency, current_balance, is_active, color, created_at, updated_at',
      
      // Transactions personnelles
      transactions: '++id, user_id, account_id, date, amount, description, category, subcategory, payment_method, created_at, updated_at',

       // ✅ NOUVEAU: Sources de revenus automatiques
      income_sources: '++id, user_id, name, employer, amount, currency, frequency, payment_day, payment_time, destination_account_id, category, is_active, next_payment_date, created_at, updated_at',
      
      // ✅ NOUVEAU: Historique des paiements automatiques
      automatic_payments: '++id, income_source_id, transaction_id, expected_date, actual_date, amount, status, created_at',
      
      // ✅ NOUVEAU: Notifications
      notifications: '++id, user_id, type, title, message, data, is_read, scheduled_for, created_at',
      
      
      // Budgets
      budgets: '++id, user_id, name, category, monthly_limit, current_spent, alert_threshold, is_active, created_at, updated_at',
      
      // Objectifs d'épargne
      goals: '++id, user_id, title, target_amount, current_amount, target_date, category, priority, created_at, updated_at',
      
      // Dettes et créances
      debts: '++id, user_id, person_name, person_contact, type, initial_amount, remaining_amount, due_date, status, created_at, updated_at',
      debt_payments: '++id, debt_id, amount, payment_date, note, created_at',
      
      // Sols haïtiens
      sols: '++id, user_id, name, total_members, weekly_contribution, my_position, current_week, start_date, status, created_at, updated_at',
      sol_payments: '++id, sol_id, week_number, amount, payment_date, type, status, created_at',
      
      // Projets business
      business_projects: '++id, user_id, name, my_share_percentage, initial_investment, current_value, status, created_at, updated_at',
      project_transactions: '++id, project_id, date, description, amount, type, category, my_share_amount, created_at, updated_at',
      project_partners: '++id, project_id, name, share_percentage, initial_contribution, contact',
      
      // Catégories personnalisées
      categories: '++id, user_id, name, type, emoji, color, is_default, created_at, updated_at'
    });
  }
}

export const db = new FinAppDatabase();

// ✅ TYPES DE FRÉQUENCES
export const INCOME_FREQUENCIES = {
  MONTHLY: 'monthly',
  BI_MONTHLY: 'bi_monthly', 
  WEEKLY: 'weekly',
  BI_WEEKLY: 'bi_weekly',
  DAILY: 'daily'
};

// ✅ STATUTS DES PAIEMENTS
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed', 
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// ✅ TYPES DE NOTIFICATIONS
export const NOTIFICATION_TYPES = {
  INCOME_REMINDER: 'income_reminder',
  INCOME_PROCESSED: 'income_processed',
  BUDGET_ALERT: 'budget_alert',
  GOAL_MILESTONE: 'goal_milestone'
};