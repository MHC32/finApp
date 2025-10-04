/**
 * =========================================================
 * FinApp Haiti - Constants
 * Toutes les constantes de l'application
 * =========================================================
 */

/**
 * ==========================================
 * API CONFIGURATION
 * ==========================================
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  API_VERSION: '/api/v1',
  TIMEOUT: 30000, // 30 secondes
};

/**
 * ==========================================
 * ROUTES
 * ==========================================
 */
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Private
  DASHBOARD: '/dashboard',
  
  // Accounts
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: '/accounts/:id',
  ACCOUNT_CREATE: '/accounts/new',
  ACCOUNT_EDIT: '/accounts/:id/edit',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: '/transactions/:id',
  TRANSACTION_CREATE: '/transactions/new',
  TRANSACTION_EDIT: '/transactions/:id/edit',
  
  // Budgets
  BUDGETS: '/budgets',
  BUDGET_DETAIL: '/budgets/:id',
  BUDGET_CREATE: '/budgets/new',
  BUDGET_EDIT: '/budgets/:id/edit',
  
  // Sols (Plans de paiement)
  SOLS: '/sols',
  SOL_DETAIL: '/sols/:id',
  SOL_CREATE: '/sols/new',
  SOL_EDIT: '/sols/:id/edit',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Reports
  REPORTS: '/reports',
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_SPENDING: '/reports/spending',
  
  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PRIVACY: '/settings/privacy',
  
  // Other
  PROFILE: '/profile',
  HELP: '/help',
  NOT_FOUND: '/404',
};

/**
 * ==========================================
 * CURRENCIES
 * ==========================================
 */
export const CURRENCIES = {
  HTG: {
    code: 'HTG',
    symbol: 'G',
    name: 'Gourde Haïtienne',
    locale: 'fr-HT',
    position: 'after', // symbol après le montant
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dollar Américain',
    locale: 'en-US',
    position: 'before',
  },
};

export const DEFAULT_CURRENCY = 'HTG';

/**
 * ==========================================
 * LANGUAGES
 * ==========================================
 */
export const LANGUAGES = {
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
  },
  ht: {
    code: 'ht',
    name: 'Kreyòl',
    flag: '🇭🇹',
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
};

export const DEFAULT_LANGUAGE = 'fr';

/**
 * ==========================================
 * ACCOUNT TYPES
 * ==========================================
 */
export const ACCOUNT_TYPES = {
  BANK: 'bank',
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  SAVINGS: 'savings',
  INVESTMENT: 'investment',
  LOAN: 'loan',
  OTHER: 'other',
};

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.BANK]: 'Compte Bancaire',
  [ACCOUNT_TYPES.CASH]: 'Espèces',
  [ACCOUNT_TYPES.CREDIT_CARD]: 'Carte de Crédit',
  [ACCOUNT_TYPES.SAVINGS]: 'Épargne',
  [ACCOUNT_TYPES.INVESTMENT]: 'Investissement',
  [ACCOUNT_TYPES.LOAN]: 'Prêt',
  [ACCOUNT_TYPES.OTHER]: 'Autre',
};

/**
 * ==========================================
 * TRANSACTION TYPES
 * ==========================================
 */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Revenu',
  [TRANSACTION_TYPES.EXPENSE]: 'Dépense',
  [TRANSACTION_TYPES.TRANSFER]: 'Transfert',
};

/**
 * ==========================================
 * TRANSACTION STATUS
 * ==========================================
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
};

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.PENDING]: 'En attente',
  [TRANSACTION_STATUS.COMPLETED]: 'Complétée',
  [TRANSACTION_STATUS.CANCELLED]: 'Annulée',
  [TRANSACTION_STATUS.FAILED]: 'Échouée',
};

/**
 * ==========================================
 * BUDGET PERIODS
 * ==========================================
 */
export const BUDGET_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
};

export const BUDGET_PERIOD_LABELS = {
  [BUDGET_PERIODS.WEEKLY]: 'Hebdomadaire',
  [BUDGET_PERIODS.MONTHLY]: 'Mensuel',
  [BUDGET_PERIODS.QUARTERLY]: 'Trimestriel',
  [BUDGET_PERIODS.YEARLY]: 'Annuel',
};

/**
 * ==========================================
 * SOL (PLAN DE PAIEMENT) STATUS
 * ==========================================
 */
export const SOL_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SOL_STATUS_LABELS = {
  [SOL_STATUS.ACTIVE]: 'Actif',
  [SOL_STATUS.PAUSED]: 'En pause',
  [SOL_STATUS.COMPLETED]: 'Complété',
  [SOL_STATUS.CANCELLED]: 'Annulé',
};

/**
 * ==========================================
 * SOL FREQUENCIES
 * ==========================================
 */
export const SOL_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
};

export const SOL_FREQUENCY_LABELS = {
  [SOL_FREQUENCIES.DAILY]: 'Quotidien',
  [SOL_FREQUENCIES.WEEKLY]: 'Hebdomadaire',
  [SOL_FREQUENCIES.BIWEEKLY]: 'Bimensuel',
  [SOL_FREQUENCIES.MONTHLY]: 'Mensuel',
};

/**
 * ==========================================
 * CATEGORIES
 * ==========================================
 */
export const DEFAULT_CATEGORIES = {
  // Income
  SALARY: { id: 'salary', name: 'Salaire', type: 'income', icon: '💰', color: '#4CAF50' },
  BUSINESS: { id: 'business', name: 'Entreprise', type: 'income', icon: '💼', color: '#2196F3' },
  INVESTMENT: { id: 'investment', name: 'Investissement', type: 'income', icon: '📈', color: '#9C27B0' },
  OTHER_INCOME: { id: 'other_income', name: 'Autre revenu', type: 'income', icon: '💵', color: '#00BCD4' },
  
  // Expenses
  FOOD: { id: 'food', name: 'Alimentation', type: 'expense', icon: '🍽️', color: '#FF9800' },
  TRANSPORT: { id: 'transport', name: 'Transport', type: 'expense', icon: '🚗', color: '#FF5722' },
  HOUSING: { id: 'housing', name: 'Logement', type: 'expense', icon: '🏠', color: '#795548' },
  UTILITIES: { id: 'utilities', name: 'Services publics', type: 'expense', icon: '⚡', color: '#FFC107' },
  HEALTH: { id: 'health', name: 'Santé', type: 'expense', icon: '🏥', color: '#F44336' },
  EDUCATION: { id: 'education', name: 'Éducation', type: 'expense', icon: '📚', color: '#3F51B5' },
  ENTERTAINMENT: { id: 'entertainment', name: 'Loisirs', type: 'expense', icon: '🎮', color: '#E91E63' },
  SHOPPING: { id: 'shopping', name: 'Achats', type: 'expense', icon: '🛒', color: '#673AB7' },
  OTHER_EXPENSE: { id: 'other_expense', name: 'Autre dépense', type: 'expense', icon: '💸', color: '#607D8B' },
};

/**
 * ==========================================
 * DATE FORMATS
 * ==========================================
 */
export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm:ss',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm',
  MONTH_YEAR: 'MMMM YYYY',
  SHORT_DATE: 'DD/MM/YY',
  ISO: 'YYYY-MM-DD',
};

/**
 * ==========================================
 * PAGINATION
 * ==========================================
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
};

/**
 * ==========================================
 * TOAST TYPES
 * ==========================================
 */
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * ==========================================
 * LOADING STATES
 * ==========================================
 */
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * ==========================================
 * LOCAL STORAGE KEYS
 * ==========================================
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LANGUAGE: 'finapp_language',
  CURRENCY: 'finapp_currency_pref',
  THEME: 'finapp_theme',
  SIDEBAR_STATE: 'finapp_sidebar_state',
};

/**
 * ==========================================
 * VALIDATION RULES
 * ==========================================
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PHONE_REGEX: /^(\+509)?[0-9]{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

/**
 * ==========================================
 * THEME COLORS
 * ==========================================
 */
export const THEME_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  dark: '#424242',
  light: '#f5f5f5',
};

/**
 * ==========================================
 * CHART COLORS
 * ==========================================
 */
export const CHART_COLORS = [
  '#1976d2',
  '#dc004e',
  '#4caf50',
  '#ff9800',
  '#9c27b0',
  '#00bcd4',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#e91e63',
];

/**
 * ==========================================
 * EXPORT DEFAULT
 * ==========================================
 */
export default {
  API_CONFIG,
  ROUTES,
  CURRENCIES,
  DEFAULT_CURRENCY,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_LABELS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_LABELS,
  BUDGET_PERIODS,
  BUDGET_PERIOD_LABELS,
  SOL_STATUS,
  SOL_STATUS_LABELS,
  SOL_FREQUENCIES,
  SOL_FREQUENCY_LABELS,
  DEFAULT_CATEGORIES,
  DATE_FORMATS,
  PAGINATION,
  TOAST_TYPES,
  LOADING_STATES,
  STORAGE_KEYS,
  VALIDATION,
  THEME_COLORS,
  CHART_COLORS,
};