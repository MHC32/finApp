/**
 * Constantes globales - FinApp Haiti Frontend
 * Synchronisé avec backend/src/utils/constants.js
 */

// ===================================================================
// DEVISES HAÏTIENNES
// ===================================================================
export const CURRENCIES = {
  HTG: {
    code: 'HTG',
    name: 'Gourde Haïtienne',
    symbol: 'G',
    decimals: 2
  },
  USD: {
    code: 'USD',
    name: 'Dollar Américain',
    symbol: '$',
    decimals: 2
  }
};

// Taux de change par défaut (peut être mis à jour dynamiquement)
export const DEFAULT_EXCHANGE_RATE = 130; // 1 USD = 130 HTG

// ===================================================================
// BANQUES HAÏTIENNES
// ===================================================================
export const HAITI_BANKS = {
  buh: {
    code: 'buh',
    name: 'Banque de l\'Union Haïtienne (BUH)',
    shortName: 'BUH',
    type: 'traditional'
  },
  sogebank: {
    code: 'sogebank',
    name: 'Sogebank',
    shortName: 'Sogebank',
    type: 'traditional'
  },
  bnc: {
    code: 'bnc',
    name: 'Banque Nationale de Crédit (BNC)',
    shortName: 'BNC',
    type: 'traditional'
  },
  unibank: {
    code: 'unibank',
    name: 'Unibank',
    shortName: 'Unibank',
    type: 'traditional'
  },
  capital_bank: {
    code: 'capital_bank',
    name: 'Capital Bank',
    shortName: 'Capital Bank',
    type: 'traditional'
  },
  moncash: {
    code: 'moncash',
    name: 'MonCash (Digicel)',
    shortName: 'MonCash',
    type: 'mobile_money'
  },
  natcash: {
    code: 'natcash',
    name: 'NatCash (Natcom)',
    shortName: 'NatCash',
    type: 'mobile_money'
  },
  cash: {
    code: 'cash',
    name: 'Espèces',
    shortName: 'Cash',
    type: 'cash'
  },
  other: {
    code: 'other',
    name: 'Autre',
    shortName: 'Autre',
    type: 'other'
  }
};

// ===================================================================
// RÉGIONS HAÏTIENNES
// ===================================================================
export const HAITI_REGIONS = {
  ouest: { code: 'ouest', name: 'Ouest', capital: 'Port-au-Prince' },
  nord: { code: 'nord', name: 'Nord', capital: 'Cap-Haïtien' },
  sud: { code: 'sud', name: 'Sud', capital: 'Les Cayes' },
  artibonite: { code: 'artibonite', name: 'Artibonite', capital: 'Gonaïves' },
  centre: { code: 'centre', name: 'Centre', capital: 'Hinche' },
  grand_anse: { code: 'grand_anse', name: 'Grand\'Anse', capital: 'Jérémie' },
  nippes: { code: 'nippes', name: 'Nippes', capital: 'Miragoâne' },
  nord_est: { code: 'nord_est', name: 'Nord-Est', capital: 'Fort-Liberté' },
  nord_ouest: { code: 'nord_ouest', name: 'Nord-Ouest', capital: 'Port-de-Paix' },
  sud_est: { code: 'sud_est', name: 'Sud-Est', capital: 'Jacmel' }
};

// ===================================================================
// TYPES DE COMPTES
// ===================================================================
export const ACCOUNT_TYPES = {
  checking: {
    code: 'checking',
    name: 'Compte Courant',
    icon: 'Wallet',
    color: 'blue'
  },
  savings: {
    code: 'savings',
    name: 'Compte Épargne',
    icon: 'PiggyBank',
    color: 'green'
  },
  moncash: {
    code: 'moncash',
    name: 'MonCash',
    icon: 'Smartphone',
    color: 'red'
  },
  natcash: {
    code: 'natcash',
    name: 'NatCash',
    icon: 'Smartphone',
    color: 'orange'
  },
  cash: {
    code: 'cash',
    name: 'Espèces',
    icon: 'Banknote',
    color: 'gray'
  },
  other: {
    code: 'other',
    name: 'Autre',
    icon: 'CircleDot',
    color: 'purple'
  }
};

// ===================================================================
// CATÉGORIES DE TRANSACTIONS
// ===================================================================
export const TRANSACTION_CATEGORIES = {
  // REVENUS
  salary: {
    code: 'salary',
    name: 'Salaire',
    type: 'income',
    icon: 'Briefcase',
    color: 'green'
  },
  freelance: {
    code: 'freelance',
    name: 'Freelance',
    type: 'income',
    icon: 'Laptop',
    color: 'blue'
  },
  business: {
    code: 'business',
    name: 'Business',
    type: 'income',
    icon: 'TrendingUp',
    color: 'teal'
  },
  investment: {
    code: 'investment',
    name: 'Investissement',
    type: 'income',
    icon: 'LineChart',
    color: 'indigo'
  },
  gift: {
    code: 'gift',
    name: 'Cadeau/Don',
    type: 'income',
    icon: 'Gift',
    color: 'pink'
  },
  
  // DÉPENSES ESSENTIELLES
  alimentation: {
    code: 'alimentation',
    name: 'Alimentation',
    type: 'expense',
    icon: 'ShoppingCart',
    color: 'orange'
  },
  logement: {
    code: 'logement',
    name: 'Logement',
    type: 'expense',
    icon: 'Home',
    color: 'blue'
  },
  transport: {
    code: 'transport',
    name: 'Transport',
    type: 'expense',
    icon: 'Car',
    color: 'yellow'
  },
  sante: {
    code: 'sante',
    name: 'Santé',
    type: 'expense',
    icon: 'Heart',
    color: 'red'
  },
  education: {
    code: 'education',
    name: 'Éducation',
    type: 'expense',
    icon: 'GraduationCap',
    color: 'purple'
  },
  factures: {
    code: 'factures',
    name: 'Factures',
    type: 'expense',
    icon: 'FileText',
    color: 'gray'
  },
  
  // DÉPENSES OPTIONNELLES
  loisirs: {
    code: 'loisirs',
    name: 'Loisirs',
    type: 'expense',
    icon: 'Gamepad',
    color: 'pink'
  },
  shopping: {
    code: 'shopping',
    name: 'Shopping',
    type: 'expense',
    icon: 'ShoppingBag',
    color: 'violet'
  },
  restaurant: {
    code: 'restaurant',
    name: 'Restaurant',
    type: 'expense',
    icon: 'UtensilsCrossed',
    color: 'amber'
  },
  voyage: {
    code: 'voyage',
    name: 'Voyage',
    type: 'expense',
    icon: 'Plane',
    color: 'sky'
  },
  
  // AUTRES
  autre: {
    code: 'autre',
    name: 'Autre',
    type: 'both',
    icon: 'MoreHorizontal',
    color: 'gray'
  }
};

// ===================================================================
// TYPES DE TRANSACTIONS
// ===================================================================
export const TRANSACTION_TYPES = {
  income: { code: 'income', name: 'Revenu', color: 'green' },
  expense: { code: 'expense', name: 'Dépense', color: 'red' },
  transfer: { code: 'transfer', name: 'Transfert', color: 'blue' }
};

// ===================================================================
// STATUTS
// ===================================================================
export const STATUSES = {
  active: { code: 'active', name: 'Actif', color: 'green' },
  inactive: { code: 'inactive', name: 'Inactif', color: 'gray' },
  pending: { code: 'pending', name: 'En attente', color: 'yellow' },
  completed: { code: 'completed', name: 'Terminé', color: 'green' },
  cancelled: { code: 'cancelled', name: 'Annulé', color: 'red' },
  archived: { code: 'archived', name: 'Archivé', color: 'gray' }
};

// ===================================================================
// RÔLES UTILISATEURS
// ===================================================================
export const USER_ROLES = {
  user: { code: 'user', name: 'Utilisateur', permissions: ['read', 'write'] },
  premium: { code: 'premium', name: 'Premium', permissions: ['read', 'write', 'export'] },
  admin: { code: 'admin', name: 'Administrateur', permissions: ['all'] }
};

// ===================================================================
// PÉRIODES BUDGETS
// ===================================================================
export const BUDGET_PERIODS = {
  weekly: { code: 'weekly', name: 'Hebdomadaire', days: 7 },
  monthly: { code: 'monthly', name: 'Mensuel', days: 30 },
  quarterly: { code: 'quarterly', name: 'Trimestriel', days: 90 },
  yearly: { code: 'yearly', name: 'Annuel', days: 365 }
};

// ===================================================================
// FRÉQUENCES SOLS (TONTINES)
// ===================================================================
export const SOL_FREQUENCIES = {
  weekly: { code: 'weekly', name: 'Hebdomadaire', days: 7 },
  biweekly: { code: 'biweekly', name: 'Bi-hebdomadaire', days: 14 },
  monthly: { code: 'monthly', name: 'Mensuel', days: 30 }
};

// ===================================================================
// TYPES DE SOLS
// ===================================================================
export const SOL_TYPES = {
  rotating: {
    code: 'rotating',
    name: 'Sol Rotatif',
    description: 'Chacun reçoit le montant total à tour de rôle',
    icon: 'RotateCw'
  },
  accumulating: {
    code: 'accumulating',
    name: 'Sol Cumulatif',
    description: 'L\'argent s\'accumule et est distribué à la fin',
    icon: 'TrendingUp'
  },
  emergency: {
    code: 'emergency',
    name: 'Sol d\'Urgence',
    description: 'Fonds d\'urgence pour les membres',
    icon: 'AlertCircle'
  }
};

// ===================================================================
// TYPES D'INVESTISSEMENTS
// ===================================================================
export const INVESTMENT_TYPES = {
  agriculture: { code: 'agriculture', name: 'Agriculture', icon: 'Sprout', color: 'green' },
  commerce: { code: 'commerce', name: 'Commerce', icon: 'Store', color: 'blue' },
  immobilier: { code: 'immobilier', name: 'Immobilier', icon: 'Building', color: 'orange' },
  technologie: { code: 'technologie', name: 'Technologie', icon: 'Cpu', color: 'purple' },
  services: { code: 'services', name: 'Services', icon: 'Briefcase', color: 'teal' },
  industrie: { code: 'industrie', name: 'Industrie', icon: 'Factory', color: 'gray' },
  autre: { code: 'autre', name: 'Autre', icon: 'MoreHorizontal', color: 'slate' }
};

// ===================================================================
// MODÈLES BUDGETS PRÉ-DÉFINIS
// ===================================================================
export const BUDGET_TEMPLATES = {
  student: {
    id: 'student',
    name: 'Étudiant',
    description: 'Budget pour étudiant universitaire',
    icon: 'GraduationCap',
    targetIncome: 15000,
    categories: {
      alimentation: 5000,
      transport: 3000,
      education: 4000,
      loisirs: 2000,
      factures: 1000
    }
  },
  young_professional: {
    id: 'young_professional',
    name: 'Jeune professionnel',
    description: 'Premier emploi, vie autonome',
    icon: 'Briefcase',
    targetIncome: 35000,
    categories: {
      alimentation: 12000,
      transport: 8000,
      logement: 10000,
      sante: 2000,
      loisirs: 2000,
      factures: 1000
    }
  },
  family: {
    id: 'family',
    name: 'Famille',
    description: 'Couple avec enfants',
    icon: 'Users',
    targetIncome: 60000,
    categories: {
      alimentation: 20000,
      transport: 12000,
      logement: 18000,
      sante: 5000,
      education: 3000,
      loisirs: 2000
    }
  },
  entrepreneur: {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Revenus variables, besoin flexibilité',
    icon: 'Rocket',
    targetIncome: 50000,
    categories: {
      alimentation: 15000,
      transport: 10000,
      logement: 15000,
      sante: 3000,
      education: 2000,
      loisirs: 3000,
      factures: 2000
    }
  }
};

// ===================================================================
// TEMPLATES TRANSACTIONS RAPIDES
// ===================================================================
export const QUICK_TRANSACTION_TEMPLATES = [
  { name: 'Manje (Repas)', category: 'alimentation', amount: 500, currency: 'HTG' },
  { name: 'Transpò (Transport)', category: 'transport', amount: 200, currency: 'HTG' },
  { name: 'Kafe (Café)', category: 'restaurant', amount: 150, currency: 'HTG' },
  { name: 'Recharge Telefòn', category: 'factures', amount: 500, currency: 'HTG' },
  { name: 'Electricity Bill', category: 'factures', amount: 2000, currency: 'HTG' }
];

// ===================================================================
// PATTERNS DE VALIDATION
// ===================================================================
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  HAITI_PHONE: /^(\+509)?[2-4]\d{7}$/,
  US_PHONE: /^(\+1)?[2-9]\d{2}[2-9]\d{6}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ACCOUNT_NUMBER: /^[0-9]{6,16}$/,
  SOL_CODE: /^[A-Z0-9]{6,8}$/
};

// ===================================================================
// LIMITES ET CONTRAINTES
// ===================================================================
export const LIMITS = {
  TRANSACTION: {
    MIN_AMOUNT: 1,
    MAX_AMOUNT_HTG: 1000000,
    MAX_AMOUNT_USD: 10000,
    MAX_DESCRIPTION_LENGTH: 255
  },
  SOL: {
    MIN_PARTICIPANTS: 3,
    MAX_PARTICIPANTS: 50,
    MIN_AMOUNT_HTG: 500,
    MAX_AMOUNT_HTG: 100000,
    MIN_AMOUNT_USD: 5,
    MAX_AMOUNT_USD: 1000
  },
  BUDGET: {
    MIN_AMOUNT: 100,
    MAX_AMOUNT_HTG: 500000,
    MAX_AMOUNT_USD: 5000
  },
  UPLOAD: {
    MAX_FILE_SIZE: 5242880, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
    MAX_FILES_PER_REQUEST: 5
  }
};

// ===================================================================
// TYPES DE NOTIFICATIONS
// ===================================================================
export const NOTIFICATION_TYPES = {
  SOL_PAYMENT_DUE: {
    code: 'sol_payment_due',
    name: 'Paiement Sol à venir',
    icon: 'Clock',
    color: 'yellow'
  },
  SOL_TURN_RECEIVED: {
    code: 'sol_turn_received',
    name: 'Tour de Sol reçu',
    icon: 'CheckCircle',
    color: 'green'
  },
  BUDGET_EXCEEDED: {
    code: 'budget_exceeded',
    name: 'Budget dépassé',
    icon: 'AlertTriangle',
    color: 'red'
  },
  INVESTMENT_UPDATE: {
    code: 'investment_update',
    name: 'Mise à jour investissement',
    icon: 'TrendingUp',
    color: 'blue'
  },
  ACCOUNT_LOW_BALANCE: {
    code: 'account_low_balance',
    name: 'Solde faible',
    icon: 'AlertCircle',
    color: 'orange'
  },
  SYSTEM_MAINTENANCE: {
    code: 'system_maintenance',
    name: 'Maintenance système',
    icon: 'Settings',
    color: 'gray'
  }
};

// ===================================================================
// VALEURS PAR DÉFAUT
// ===================================================================
export const DEFAULTS = {
  CURRENCY: 'HTG',
  REGION: 'ouest',
  LANGUAGE: 'fr',
  THEME: 'light',
  ACCOUNT_TYPE: 'checking',
  BUDGET_PERIOD: 'monthly',
  SOL_FREQUENCY: 'monthly',
  ITEMS_PER_PAGE: 10,
  CHART_COLORS: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
};

// ===================================================================
// MESSAGES D'ERREUR
// ===================================================================
export const ERROR_MESSAGES = {
  INVALID_CURRENCY: 'Devise non valide. Utilisez HTG ou USD.',
  INVALID_REGION: 'Région haïtienne non valide.',
  INVALID_BANK: 'Banque haïtienne non reconnue.',
  INVALID_CATEGORY: 'Catégorie de transaction non valide.',
  INSUFFICIENT_BALANCE: 'Solde insuffisant pour cette transaction.',
  INVALID_SOL_FREQUENCY: 'Fréquence de sol non supportée.',
  DUPLICATE_EMAIL: 'Cette adresse email est déjà utilisée.',
  DUPLICATE_PHONE: 'Ce numéro de téléphone est déjà utilisé.',
  INVALID_PHONE_FORMAT: 'Format de téléphone haïtien invalide (ex: +50932123456).',
  WEAK_PASSWORD: 'Mot de passe trop faible. Minimum 8 caractères.',
  NETWORK_ERROR: 'Erreur réseau. Vérifiez votre connexion.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource introuvable.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.'
};

// ===================================================================
// ROUTES API
// ===================================================================
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    PROFILE: '/auth/me'
  },
  ACCOUNTS: '/accounts',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  SOLS: '/sols',
  DEBTS: '/debts',
  INVESTMENTS: '/investments',
  NOTIFICATIONS: '/notifications',
  AI: '/ai'
};

// ===================================================================
// ROUTES FRONTEND
// ===================================================================
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Private
  DASHBOARD: '/dashboard',
  
  // Comptes
  ACCOUNTS: '/accounts',
  ACCOUNTS_NEW: '/accounts/new',
  ACCOUNTS_DETAIL: '/accounts/:id',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTIONS_NEW: '/transactions/new',
  TRANSACTIONS_DETAIL: '/transactions/:id',
  
  // Budgets
  BUDGETS: '/budgets',
  BUDGETS_NEW: '/budgets/new',
  BUDGETS_DETAIL: '/budgets/:id',
  
  // Sols
  SOLS: '/sols',
  SOLS_NEW: '/sols/new',
  SOLS_DETAIL: '/sols/:id',
  
  // Dettes
  DEBTS: '/debts',
  DEBTS_NEW: '/debts/new',
  DEBTS_DETAIL: '/debts/:id',
  
  // Investissements
  INVESTMENTS: '/investments',
  INVESTMENTS_NEW: '/investments/new',
  INVESTMENTS_DETAIL: '/investments/:id',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  
  // IA
  AI_ASSISTANT: '/ai',
  
  // Profil
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics'
};

// ===================================================================
// COULEURS HAITI 🇭🇹
// ===================================================================
export const HAITI_COLORS = {
  primary: '#1e40af', // Bleu Haiti
  secondary: '#dc2626', // Rouge Haiti
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9'
};