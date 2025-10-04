// ===================================================================
// BUDGET TYPES - FinApp Haiti
// Synchronisé avec Backend models/Budget.js
// ===================================================================

/**
 * Périodes de budget
 * Correspond EXACTEMENT à budgetSchema.period.enum dans le backend
 */
export const BudgetPeriod = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

/**
 * Statuts de budget
 * Correspond EXACTEMENT à budgetSchema.status.enum dans le backend
 */
export const BudgetStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

/**
 * Templates de budget prédéfinis
 * Correspond EXACTEMENT à BUDGET_TEMPLATES dans backend utils/constants.js
 */
export const BudgetTemplate = {
  BASIC: 'basic',
  STUDENT: 'student',
  FAMILY: 'family',
  ENTREPRENEUR: 'entrepreneur',
  CUSTOM: 'custom'
};

/**
 * Labels français pour les périodes
 */
export const BudgetPeriodLabels = {
  [BudgetPeriod.WEEKLY]: 'Hebdomadaire',
  [BudgetPeriod.BIWEEKLY]: 'Bi-hebdomadaire',
  [BudgetPeriod.MONTHLY]: 'Mensuel',
  [BudgetPeriod.QUARTERLY]: 'Trimestriel',
  [BudgetPeriod.YEARLY]: 'Annuel'
};

/**
 * Labels français pour les statuts
 */
export const BudgetStatusLabels = {
  [BudgetStatus.ACTIVE]: 'Actif',
  [BudgetStatus.PAUSED]: 'En pause',
  [BudgetStatus.COMPLETED]: 'Terminé',
  [BudgetStatus.ARCHIVED]: 'Archivé'
};

/**
 * Labels français pour les templates
 */
export const BudgetTemplateLabels = {
  [BudgetTemplate.BASIC]: 'Budget de base',
  [BudgetTemplate.STUDENT]: 'Budget étudiant',
  [BudgetTemplate.FAMILY]: 'Budget familial',
  [BudgetTemplate.ENTREPRENEUR]: 'Budget entrepreneur',
  [BudgetTemplate.CUSTOM]: 'Budget personnalisé'
};

/**
 * Couleurs pour les statuts de budget
 */
export const BudgetStatusColors = {
  [BudgetStatus.ACTIVE]: '#4CAF50',
  [BudgetStatus.PAUSED]: '#FF9800',
  [BudgetStatus.COMPLETED]: '#2196F3',
  [BudgetStatus.ARCHIVED]: '#9E9E9E'
};

/**
 * Icônes Material-UI pour les templates
 */
export const BudgetTemplateIcons = {
  [BudgetTemplate.BASIC]: 'account_balance_wallet',
  [BudgetTemplate.STUDENT]: 'school',
  [BudgetTemplate.FAMILY]: 'family_restroom',
  [BudgetTemplate.ENTREPRENEUR]: 'business_center',
  [BudgetTemplate.CUSTOM]: 'tune'
};

/**
 * @typedef {Object} BudgetCategory
 * @property {string} category - Nom de la catégorie
 * @property {number} allocated - Montant alloué
 * @property {number} spent - Montant dépensé
 * @property {number} remaining - Montant restant
 * @property {number} percentage - Pourcentage utilisé
 */

/**
 * @typedef {Object} Budget
 * @property {string} _id - MongoDB ID
 * @property {string} user - User ID (ref User)
 * @property {string} name - Nom du budget
 * @property {string} period - Période (weekly/monthly/etc)
 * @property {number} expectedIncome - Revenu attendu
 * @property {number} totalAllocated - Total alloué
 * @property {number} totalSpent - Total dépensé
 * @property {number} totalRemaining - Total restant
 * @property {BudgetCategory[]} categories - Catégories du budget
 * @property {Date} startDate - Date de début
 * @property {Date} endDate - Date de fin
 * @property {string} currency - Devise (HTG/USD)
 * @property {string} status - Statut (active/paused/etc)
 * @property {boolean} isActive - Budget actif
 * @property {boolean} isArchived - Budget archivé
 * @property {number} healthScore - Score santé (0-100)
 * @property {Object[]} snapshots - Historique snapshots
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de dernière modification
 */

/**
 * Valeurs par défaut pour un nouveau budget
 */
export const defaultBudget = {
  name: '',
  period: BudgetPeriod.MONTHLY,
  expectedIncome: 0,
  totalAllocated: 0,
  totalSpent: 0,
  categories: [],
  currency: 'HTG',
  status: BudgetStatus.ACTIVE,
  isActive: true,
  isArchived: false
};

/**
 * Valeurs par défaut pour une catégorie de budget
 */
export const defaultBudgetCategory = {
  category: '',
  allocated: 0,
  spent: 0,
  remaining: 0,
  percentage: 0
};

/**
 * Règles de validation pour le formulaire Budget
 */
export const budgetValidationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Le nom doit contenir entre 3 et 100 caractères'
  },
  period: {
    required: true,
    enum: Object.values(BudgetPeriod),
    message: 'Période invalide'
  },
  expectedIncome: {
    required: true,
    min: 0,
    message: 'Le revenu attendu doit être positif'
  },
  startDate: {
    required: true,
    message: 'La date de début est requise'
  },
  endDate: {
    required: true,
    message: 'La date de fin est requise'
  },
  categories: {
    required: true,
    minLength: 1,
    message: 'Au moins une catégorie est requise'
  }
};

/**
 * Helper: Calculer le pourcentage d'utilisation du budget
 */
export const getBudgetUsagePercentage = (spent, allocated) => {
  if (allocated === 0) return 0;
  return Math.round((spent / allocated) * 100);
};

/**
 * Helper: Obtenir le statut de santé du budget
 */
export const getBudgetHealth = (spent, allocated) => {
  const percentage = getBudgetUsagePercentage(spent, allocated);
  
  if (percentage < 70) return 'good';
  if (percentage < 90) return 'warning';
  if (percentage < 100) return 'critical';
  return 'exceeded';
};

/**
 * Helper: Obtenir la couleur selon la santé du budget
 */
export const getBudgetHealthColor = (spent, allocated) => {
  const health = getBudgetHealth(spent, allocated);
  
  switch (health) {
    case 'good':
      return '#4CAF50'; // Vert
    case 'warning':
      return '#FF9800'; // Orange
    case 'critical':
      return '#F44336'; // Rouge
    case 'exceeded':
      return '#9C27B0'; // Violet
    default:
      return '#9E9E9E'; // Gris
  }
};

/**
 * Helper: Vérifier si le budget est dépassé
 */
export const isBudgetExceeded = (spent, allocated) => {
  return spent > allocated;
};

/**
 * Helper: Calculer les jours restants dans la période
 */
export const getDaysRemaining = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Helper: Calculer la moyenne journalière disponible
 */
export const getDailyAverage = (remaining, daysLeft) => {
  if (daysLeft === 0) return 0;
  return remaining / daysLeft;
};

/**
 * Helper: Obtenir la durée en jours selon la période
 */
export const getPeriodDuration = (period) => {
  switch (period) {
    case BudgetPeriod.WEEKLY:
      return 7;
    case BudgetPeriod.BIWEEKLY:
      return 14;
    case BudgetPeriod.MONTHLY:
      return 30;
    case BudgetPeriod.QUARTERLY:
      return 90;
    case BudgetPeriod.YEARLY:
      return 365;
    default:
      return 30;
  }
};

/**
 * Helper: Calculer les dates de début/fin selon la période
 */
export const calculatePeriodDates = (period, startDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(start);
  
  const duration = getPeriodDuration(period);
  end.setDate(end.getDate() + duration - 1);
  
  return {
    startDate: start,
    endDate: end
  };
};

/**
 * Helper: Vérifier si le budget est actif (dans la période)
 */
export const isBudgetActive = (budget) => {
  const now = new Date();
  const start = new Date(budget.startDate);
  const end = new Date(budget.endDate);
  
  return now >= start && now <= end && budget.status === BudgetStatus.ACTIVE;
};

/**
 * Helper: Obtenir le template par défaut selon le type
 */
export const getDefaultTemplate = (templateType) => {
  const templates = {
    [BudgetTemplate.BASIC]: [
      { category: 'food', percentage: 30 },
      { category: 'housing', percentage: 25 },
      { category: 'transport', percentage: 15 },
      { category: 'utilities', percentage: 10 },
      { category: 'savings', percentage: 10 },
      { category: 'other', percentage: 10 }
    ],
    [BudgetTemplate.STUDENT]: [
      { category: 'food', percentage: 25 },
      { category: 'housing', percentage: 30 },
      { category: 'education', percentage: 20 },
      { category: 'transport', percentage: 10 },
      { category: 'entertainment', percentage: 10 },
      { category: 'other', percentage: 5 }
    ],
    [BudgetTemplate.FAMILY]: [
      { category: 'food', percentage: 35 },
      { category: 'housing', percentage: 25 },
      { category: 'education', percentage: 15 },
      { category: 'health', percentage: 10 },
      { category: 'transport', percentage: 10 },
      { category: 'other', percentage: 5 }
    ],
    [BudgetTemplate.ENTREPRENEUR]: [
      { category: 'business', percentage: 40 },
      { category: 'food', percentage: 15 },
      { category: 'housing', percentage: 20 },
      { category: 'transport', percentage: 10 },
      { category: 'savings', percentage: 10 },
      { category: 'other', percentage: 5 }
    ]
  };
  
  return templates[templateType] || templates[BudgetTemplate.BASIC];
};

// Export par défaut de tous les types Budget
export default {
  BudgetPeriod,
  BudgetStatus,
  BudgetTemplate,
  BudgetPeriodLabels,
  BudgetStatusLabels,
  BudgetTemplateLabels,
  BudgetStatusColors,
  BudgetTemplateIcons,
  defaultBudget,
  defaultBudgetCategory,
  budgetValidationRules,
  getBudgetUsagePercentage,
  getBudgetHealth,
  getBudgetHealthColor,
  isBudgetExceeded,
  getDaysRemaining,
  getDailyAverage,
  getPeriodDuration,
  calculatePeriodDates,
  isBudgetActive,
  getDefaultTemplate
};