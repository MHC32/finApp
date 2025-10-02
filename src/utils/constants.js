/**
 * =========================================================
 * FinApp Haiti - Constants
 * Constantes globales de l'application
 * =========================================================
 */

/**
 * API Configuration
 */
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 secondes

/**
 * Devises supportées
 */
export const CURRENCIES = {
  HTG: 'HTG',
  USD: 'USD',
  EUR: 'EUR',
  CAD: 'CAD',
};

export const CURRENCY_SYMBOLS = {
  HTG: 'G',
  USD: '$',
  EUR: '€',
  CAD: 'C$',
};

export const DEFAULT_CURRENCY = 'HTG';

/**
 * Langues supportées
 */
export const LANGUAGES = {
  FR: 'fr',
  HT: 'ht',
  EN: 'en',
};

export const LANGUAGE_NAMES = {
  fr: 'Français',
  ht: 'Kreyòl',
  en: 'English',
};

export const DEFAULT_LANGUAGE = 'fr';

/**
 * Types de comptes
 */
export const ACCOUNT_TYPES = {
  CHECKING: 'checking',      // Compte courant
  SAVINGS: 'savings',        // Compte épargne
  CASH: 'cash',              // Liquide
  CREDIT_CARD: 'credit_card', // Carte de crédit
  INVESTMENT: 'investment',   // Investissement
  OTHER: 'other',            // Autre
};

export const ACCOUNT_TYPE_LABELS = {
  checking: 'Compte courant',
  savings: 'Compte épargne',
  cash: 'Liquide',
  credit_card: 'Carte de crédit',
  investment: 'Investissement',
  other: 'Autre',
};

/**
 * Types de transactions
 */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
};

export const TRANSACTION_TYPE_LABELS = {
  income: 'Revenu',
  expense: 'Dépense',
  transfer: 'Transfert',
};

/**
 * Catégories de revenus
 */
export const INCOME_CATEGORIES = [
  'Salaire',
  'Freelance',
  'Business',
  'Investissements',
  'Cadeaux',
  'Remboursements',
  'Autres revenus',
];

/**
 * Catégories de dépenses
 */
export const EXPENSE_CATEGORIES = [
  'Alimentation',
  'Transport',
  'Logement',
  'Éducation',
  'Santé',
  'Loisirs',
  'Vêtements',
  'Téléphone',
  'Internet',
  'Électricité',
  'Eau',
  'Assurance',
  'Cadeaux',
  'Dons',
  'Autres dépenses',
];

/**
 * Périodes de budget
 */
export const BUDGET_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const BUDGET_PERIOD_LABELS = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  yearly: 'Annuel',
};

/**
 * Cycles de Sol (Tontine)
 */
export const SOL_CYCLES = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
};

export const SOL_CYCLE_LABELS = {
  weekly: 'Hebdomadaire',
  biweekly: 'Bimensuel',
  monthly: 'Mensuel',
};

/**
 * Statuts de Sol
 */
export const SOL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SOL_STATUS_LABELS = {
  active: 'Actif',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

/**
 * Types d'investissement
 */
export const INVESTMENT_TYPES = {
  STOCKS: 'stocks',
  CRYPTO: 'crypto',
  REAL_ESTATE: 'real_estate',
  BUSINESS: 'business',
  OTHER: 'other',
};

export const INVESTMENT_TYPE_LABELS = {
  stocks: 'Actions',
  crypto: 'Crypto-monnaies',
  real_estate: 'Immobilier',
  business: 'Business',
  other: 'Autre',
};

/**
 * Niveaux de risque
 */
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const RISK_LEVEL_LABELS = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
};

/**
 * Périodes de statistiques
 */
export const STAT_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: 'all',
};

export const STAT_PERIOD_LABELS = {
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  year: 'Année',
  all: 'Tout',
};

/**
 * Formats de date
 */
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
};

/**
 * Formats de nombres
 */
export const NUMBER_FORMATS = {
  DECIMAL_SEPARATOR: ',',
  THOUSANDS_SEPARATOR: ' ',
  CURRENCY_DECIMALS: 2,
  PERCENTAGE_DECIMALS: 1,
};

/**
 * Limites de pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

/**
 * Tailles de fichiers
 */
export const FILE_SIZE = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_PDF_SIZE: 10 * 1024 * 1024,  // 10 MB
};

/**
 * Types de fichiers autorisés
 */
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  DOCUMENTS: ['application/pdf'],
};

/**
 * Messages d'erreur par défaut
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires.",
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Erreur de validation. Vérifiez les champs.',
  UNKNOWN_ERROR: 'Une erreur inattendue est survenue.',
};

/**
 * Clés de stockage local
 */
export const STORAGE_KEYS = {
  TOKEN: 'finapp_token',
  REFRESH_TOKEN: 'finapp_refresh_token',
  USER: 'finapp_user',
  LANGUAGE: 'finapp_language',
  CURRENCY: 'finapp_currency',
  DARK_MODE: 'finapp_dark_mode',
};

/**
 * Durées de cache (en millisecondes)
 */
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 15 * 60 * 1000,    // 15 minutes
  LONG: 60 * 60 * 1000,      // 1 heure
};

/**
 * Routes de l'application
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: '/accounts/:id',
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: '/transactions/:id',
  BUDGETS: '/budgets',
  BUDGET_DETAIL: '/budgets/:id',
  SAVINGS: '/savings',
  SAVING_DETAIL: '/savings/:id',
  SOLS: '/sols',
  SOL_DETAIL: '/sols/:id',
  INVESTMENTS: '/investments',
  INVESTMENT_DETAIL: '/investments/:id',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

/**
 * Couleurs des graphiques
 */
export const CHART_COLORS = [
  '#1976d2', // Bleu
  '#9c27b0', // Violet
  '#2e7d32', // Vert
  '#ed6c02', // Orange
  '#d32f2f', // Rouge
  '#0288d1', // Bleu clair
  '#f57c00', // Orange foncé
  '#388e3c', // Vert foncé
  '#7b1fa2', // Violet foncé
  '#c62828', // Rouge foncé
];

/**
 * Animation durées (en ms)
 */
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

/**
 * Breakpoints responsive (correspond à Material-UI)
 */
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
};

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DRAWER: 1200,
  MODAL: 1300,
  SNACKBAR: 1400,
  TOOLTIP: 1500,
};

/**
 * Regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_HT: /^(\+?509)?[2-4]\d{7}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NUMBERS_ONLY: /^\d+$/,
  DECIMAL: /^\d+\.?\d*$/,
};

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Priorités de notification
 */
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

/**
 * Durée d'affichage des toasts (en ms)
 */
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
};

/**
 * Taux de change par défaut (HTG base)
 * Ces valeurs seront écrasées par les taux récupérés de l'API
 */
export const DEFAULT_EXCHANGE_RATES = {
  HTG: 1,
  USD: 135,
  EUR: 145,
  CAD: 100,
};

/**
 * Limites de validation
 */
export const VALIDATION_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,
  MIN_ACCOUNT_NAME_LENGTH: 2,
  MAX_ACCOUNT_NAME_LENGTH: 50,
  MIN_TRANSACTION_AMOUNT: 0.01,
  MAX_TRANSACTION_AMOUNT: 999999999,
  MIN_BUDGET_AMOUNT: 1,
  MAX_BUDGET_AMOUNT: 999999999,
  MIN_SOL_MEMBERS: 2,
  MAX_SOL_MEMBERS: 50,
  MIN_SOL_AMOUNT: 100,
};

/**
 * Jours de la semaine
 */
export const WEEKDAYS = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

export const WEEKDAY_LABELS = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
  0: 'Dimanche',
};

/**
 * Mois de l'année
 */
export const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

/**
 * Configuration export
 */
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
};

export const EXPORT_FORMAT_LABELS = {
  pdf: 'PDF',
  excel: 'Excel',
  csv: 'CSV',
};

/**
 * Statuts de transaction
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const TRANSACTION_STATUS_LABELS = {
  pending: 'En attente',
  completed: 'Complété',
  cancelled: 'Annulé',
};

/**
 * Configuration des graphiques
 */
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  ANIMATION_DURATION: 300,
  GRID_STROKE_DASHARRAY: '3 3',
};

/**
 * Messages de succès par défaut
 */
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Compte créé avec succès',
  ACCOUNT_UPDATED: 'Compte mis à jour avec succès',
  ACCOUNT_DELETED: 'Compte supprimé avec succès',
  TRANSACTION_CREATED: 'Transaction créée avec succès',
  TRANSACTION_UPDATED: 'Transaction mise à jour avec succès',
  TRANSACTION_DELETED: 'Transaction supprimée avec succès',
  BUDGET_CREATED: 'Budget créé avec succès',
  BUDGET_UPDATED: 'Budget mis à jour avec succès',
  BUDGET_DELETED: 'Budget supprimé avec succès',
  SOL_CREATED: 'Sol créé avec succès',
  SOL_UPDATED: 'Sol mis à jour avec succès',
  SOL_DELETED: 'Sol supprimé avec succès',
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  SETTINGS_SAVED: 'Paramètres sauvegardés avec succès',
  PASSWORD_CHANGED: 'Mot de passe changé avec succès',
};

/**
 * Permissions utilisateur
 */
export const PERMISSIONS = {
  VIEW_ACCOUNTS: 'view_accounts',
  CREATE_ACCOUNTS: 'create_accounts',
  UPDATE_ACCOUNTS: 'update_accounts',
  DELETE_ACCOUNTS: 'delete_accounts',
  VIEW_TRANSACTIONS: 'view_transactions',
  CREATE_TRANSACTIONS: 'create_transactions',
  UPDATE_TRANSACTIONS: 'update_transactions',
  DELETE_TRANSACTIONS: 'delete_transactions',
  VIEW_BUDGETS: 'view_budgets',
  CREATE_BUDGETS: 'create_budgets',
  UPDATE_BUDGETS: 'update_budgets',
  DELETE_BUDGETS: 'delete_budgets',
  VIEW_SOLS: 'view_sols',
  CREATE_SOLS: 'create_sols',
  UPDATE_SOLS: 'update_sols',
  DELETE_SOLS: 'delete_sols',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
};

/**
 * Rôles utilisateur
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

/**
 * Configuration PWA
 */
export const PWA_CONFIG = {
  APP_NAME: 'FinApp Haiti',
  APP_SHORT_NAME: 'FinApp',
  APP_DESCRIPTION: 'Application de gestion financière pour Haiti',
  THEME_COLOR: '#1976d2',
  BACKGROUND_COLOR: '#ffffff',
};

/**
 * URLs externes
 */
export const EXTERNAL_URLS = {
  SUPPORT: 'https://support.finapphaiti.com',
  DOCUMENTATION: 'https://docs.finapphaiti.com',
  PRIVACY_POLICY: 'https://finapphaiti.com/privacy',
  TERMS_OF_SERVICE: 'https://finapphaiti.com/terms',
  FACEBOOK: 'https://facebook.com/finapphaiti',
  TWITTER: 'https://twitter.com/finapphaiti',
  INSTAGRAM: 'https://instagram.com/finapphaiti',
};

/**
 * Configuration Google Analytics (si activé)
 */
export const ANALYTICS_CONFIG = {
  TRACKING_ID: process.env.REACT_APP_GA_ID || '',
  ENABLED: process.env.NODE_ENV === 'production',
};

/**
 * Configuration Sentry (si activé)
 */
export const SENTRY_CONFIG = {
  DSN: process.env.REACT_APP_SENTRY_DSN || '',
  ENVIRONMENT: process.env.NODE_ENV,
  ENABLED: process.env.NODE_ENV === 'production',
};

/**
 * Features flags
 */
export const FEATURES = {
  ENABLE_AI: process.env.REACT_APP_ENABLE_AI === 'true',
  ENABLE_SOL: process.env.REACT_APP_ENABLE_SOL === 'true',
  ENABLE_INVESTMENTS: process.env.REACT_APP_ENABLE_INVESTMENTS === 'true',
  ENABLE_EXPORT: process.env.REACT_APP_ENABLE_EXPORT === 'true',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
};

/**
 * Contact info
 */
export const CONTACT_INFO = {
  EMAIL: 'support@finapphaiti.com',
  PHONE: '+509 XXXX-XXXX',
  WHATSAPP: '+509 XXXX-XXXX',
  ADDRESS: 'Port-au-Prince, Haiti',
};

/**
 * App version
 */
export const APP_VERSION = '1.0.0';
export const APP_BUILD = process.env.REACT_APP_BUILD_NUMBER || 'dev';

/**
 * Environment
 */
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';