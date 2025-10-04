// ===================================================================
// TRANSACTION TYPES - FinApp Haiti
// Synchronisé avec Backend models/Transaction.js
// ===================================================================

/**
 * Types de transactions
 * Correspond EXACTEMENT à transactionSchema.type.enum dans le backend
 */
export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer'
};

/**
 * Catégories de transactions
 * Correspond EXACTEMENT à TRANSACTION_CATEGORIES dans backend utils/constants.js
 */
export const TransactionCategory = {
  // Revenus
  SALARY: 'salary',
  BUSINESS: 'business',
  FREELANCE: 'freelance',
  INVESTMENT_INCOME: 'investment_income',
  OTHER_INCOME: 'other_income',
  
  // Dépenses
  FOOD: 'food',
  TRANSPORT: 'transport',
  HOUSING: 'housing',
  UTILITIES: 'utilities',
  HEALTH: 'health',
  EDUCATION: 'education',
  ENTERTAINMENT: 'entertainment',
  SHOPPING: 'shopping',
  SOL: 'sol',
  DEBT_PAYMENT: 'debt_payment',
  SAVINGS: 'savings',
  OTHER: 'other'
};

/**
 * Statuts de transactions
 * Correspond EXACTEMENT à transactionSchema.status.enum dans le backend
 */
export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

/**
 * Fréquences de récurrence
 * Correspond EXACTEMENT à transactionSchema.recurrenceFrequency.enum dans le backend
 */
export const RecurrenceFrequency = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

/**
 * Labels français pour les types de transactions
 */
export const TransactionTypeLabels = {
  [TransactionType.INCOME]: 'Revenu',
  [TransactionType.EXPENSE]: 'Dépense',
  [TransactionType.TRANSFER]: 'Transfert'
};

/**
 * Labels français pour les catégories
 */
export const TransactionCategoryLabels = {
  // Revenus
  [TransactionCategory.SALARY]: 'Salaire',
  [TransactionCategory.BUSINESS]: 'Business',
  [TransactionCategory.FREELANCE]: 'Freelance',
  [TransactionCategory.INVESTMENT_INCOME]: 'Revenus investissement',
  [TransactionCategory.OTHER_INCOME]: 'Autre revenu',
  
  // Dépenses
  [TransactionCategory.FOOD]: 'Alimentation',
  [TransactionCategory.TRANSPORT]: 'Transport',
  [TransactionCategory.HOUSING]: 'Logement',
  [TransactionCategory.UTILITIES]: 'Services publics',
  [TransactionCategory.HEALTH]: 'Santé',
  [TransactionCategory.EDUCATION]: 'Éducation',
  [TransactionCategory.ENTERTAINMENT]: 'Loisirs',
  [TransactionCategory.SHOPPING]: 'Achats',
  [TransactionCategory.SOL]: 'Sol/Tontine',
  [TransactionCategory.DEBT_PAYMENT]: 'Remboursement dette',
  [TransactionCategory.SAVINGS]: 'Épargne',
  [TransactionCategory.OTHER]: 'Autre'
};

/**
 * Icônes Material-UI pour les catégories
 */
export const TransactionCategoryIcons = {
  // Revenus
  [TransactionCategory.SALARY]: 'attach_money',
  [TransactionCategory.BUSINESS]: 'business_center',
  [TransactionCategory.FREELANCE]: 'work',
  [TransactionCategory.INVESTMENT_INCOME]: 'trending_up',
  [TransactionCategory.OTHER_INCOME]: 'account_balance_wallet',
  
  // Dépenses
  [TransactionCategory.FOOD]: 'restaurant',
  [TransactionCategory.TRANSPORT]: 'directions_car',
  [TransactionCategory.HOUSING]: 'home',
  [TransactionCategory.UTILITIES]: 'flash_on',
  [TransactionCategory.HEALTH]: 'local_hospital',
  [TransactionCategory.EDUCATION]: 'school',
  [TransactionCategory.ENTERTAINMENT]: 'sports_esports',
  [TransactionCategory.SHOPPING]: 'shopping_cart',
  [TransactionCategory.SOL]: 'savings',
  [TransactionCategory.DEBT_PAYMENT]: 'credit_card',
  [TransactionCategory.SAVINGS]: 'account_balance',
  [TransactionCategory.OTHER]: 'more_horiz'
};

/**
 * Couleurs pour les catégories
 */
export const TransactionCategoryColors = {
  // Revenus (teintes vertes)
  [TransactionCategory.SALARY]: '#4CAF50',
  [TransactionCategory.BUSINESS]: '#66BB6A',
  [TransactionCategory.FREELANCE]: '#81C784',
  [TransactionCategory.INVESTMENT_INCOME]: '#00C853',
  [TransactionCategory.OTHER_INCOME]: '#69F0AE',
  
  // Dépenses (teintes variées)
  [TransactionCategory.FOOD]: '#FF5722',
  [TransactionCategory.TRANSPORT]: '#2196F3',
  [TransactionCategory.HOUSING]: '#9C27B0',
  [TransactionCategory.UTILITIES]: '#FFC107',
  [TransactionCategory.HEALTH]: '#F44336',
  [TransactionCategory.EDUCATION]: '#3F51B5',
  [TransactionCategory.ENTERTAINMENT]: '#E91E63',
  [TransactionCategory.SHOPPING]: '#673AB7',
  [TransactionCategory.SOL]: '#00BCD4',
  [TransactionCategory.DEBT_PAYMENT]: '#FF9800',
  [TransactionCategory.SAVINGS]: '#009688',
  [TransactionCategory.OTHER]: '#607D8B'
};

/**
 * Labels français pour les statuts
 */
export const TransactionStatusLabels = {
  [TransactionStatus.PENDING]: 'En attente',
  [TransactionStatus.COMPLETED]: 'Complétée',
  [TransactionStatus.CANCELLED]: 'Annulée',
  [TransactionStatus.FAILED]: 'Échouée'
};

/**
 * Labels français pour les fréquences
 */
export const RecurrenceFrequencyLabels = {
  [RecurrenceFrequency.DAILY]: 'Quotidien',
  [RecurrenceFrequency.WEEKLY]: 'Hebdomadaire',
  [RecurrenceFrequency.BIWEEKLY]: 'Bi-hebdomadaire',
  [RecurrenceFrequency.MONTHLY]: 'Mensuel',
  [RecurrenceFrequency.QUARTERLY]: 'Trimestriel',
  [RecurrenceFrequency.YEARLY]: 'Annuel'
};

/**
 * @typedef {Object} Transaction
 * @property {string} _id - MongoDB ID
 * @property {string} user - User ID (ref User)
 * @property {string} account - Account ID (ref Account)
 * @property {number} amount - Montant de la transaction
 * @property {string} type - Type (income/expense/transfer)
 * @property {string} description - Description de la transaction
 * @property {Date} date - Date de la transaction
 * @property {string} category - Catégorie
 * @property {string} [subcategory] - Sous-catégorie
 * @property {string} [toAccount] - Compte destination (pour transferts)
 * @property {string} [relatedSol] - Sol associé (ref Sol)
 * @property {string} [relatedBudget] - Budget associé (ref Budget)
 * @property {string[]} [tags] - Tags personnalisés
 * @property {boolean} isRecurring - Transaction récurrente
 * @property {string} [recurrenceFrequency] - Fréquence de récurrence
 * @property {Date} [nextOccurrence] - Prochaine occurrence
 * @property {string} [location] - Lieu de la transaction
 * @property {string} [receipt] - URL du reçu
 * @property {string[]} [attachments] - Pièces jointes
 * @property {string} status - Statut de la transaction
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de dernière modification
 */

/**
 * Valeurs par défaut pour une nouvelle transaction
 */
export const defaultTransaction = {
  amount: 0,
  type: TransactionType.EXPENSE,
  description: '',
  date: new Date().toISOString(),
  category: TransactionCategory.OTHER,
  subcategory: '',
  tags: [],
  isRecurring: false,
  recurrenceFrequency: null,
  location: '',
  status: TransactionStatus.COMPLETED
};

/**
 * Règles de validation pour le formulaire Transaction
 */
export const transactionValidationRules = {
  amount: {
    required: true,
    min: 1,
    message: 'Le montant doit être supérieur à 0'
  },
  type: {
    required: true,
    enum: Object.values(TransactionType),
    message: 'Type de transaction invalide'
  },
  description: {
    required: true,
    minLength: 2,
    maxLength: 255,
    message: 'La description doit contenir entre 2 et 255 caractères'
  },
  date: {
    required: true,
    message: 'La date est requise'
  },
  category: {
    required: true,
    enum: Object.values(TransactionCategory),
    message: 'Catégorie invalide'
  },
  account: {
    required: true,
    message: 'Le compte est requis'
  },
  toAccount: {
    required: (formData) => formData.type === TransactionType.TRANSFER,
    message: 'Le compte destination est requis pour un transfert'
  },
  recurrenceFrequency: {
    required: (formData) => formData.isRecurring,
    enum: Object.values(RecurrenceFrequency),
    message: 'Fréquence de récurrence invalide'
  }
};

/**
 * Helper: Obtenir les catégories par type de transaction
 */
export const getCategoriesByType = (transactionType) => {
  const incomeCategories = [
    TransactionCategory.SALARY,
    TransactionCategory.BUSINESS,
    TransactionCategory.FREELANCE,
    TransactionCategory.INVESTMENT_INCOME,
    TransactionCategory.OTHER_INCOME
  ];
  
  const expenseCategories = [
    TransactionCategory.FOOD,
    TransactionCategory.TRANSPORT,
    TransactionCategory.HOUSING,
    TransactionCategory.UTILITIES,
    TransactionCategory.HEALTH,
    TransactionCategory.EDUCATION,
    TransactionCategory.ENTERTAINMENT,
    TransactionCategory.SHOPPING,
    TransactionCategory.SOL,
    TransactionCategory.DEBT_PAYMENT,
    TransactionCategory.SAVINGS,
    TransactionCategory.OTHER
  ];
  
  if (transactionType === TransactionType.INCOME) {
    return incomeCategories;
  } else if (transactionType === TransactionType.EXPENSE) {
    return expenseCategories;
  }
  
  return [];
};

/**
 * Helper: Obtenir la couleur selon le type de transaction
 */
export const getTransactionColor = (type) => {
  switch (type) {
    case TransactionType.INCOME:
      return 'success';
    case TransactionType.EXPENSE:
      return 'error';
    case TransactionType.TRANSFER:
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Helper: Obtenir le label d'une catégorie
 */
export const getCategoryLabel = (category) => {
  return TransactionCategoryLabels[category] || category;
};

/**
 * Helper: Obtenir l'icône d'une catégorie
 */
export const getCategoryIcon = (category) => {
  return TransactionCategoryIcons[category] || 'category';
};

/**
 * Helper: Obtenir la couleur d'une catégorie
 */
export const getCategoryColor = (category) => {
  return TransactionCategoryColors[category] || '#9E9E9E';
};

/**
 * Helper: Vérifier si une transaction est un revenu
 */
export const isIncome = (transaction) => {
  return transaction.type === TransactionType.INCOME;
};

/**
 * Helper: Vérifier si une transaction est une dépense
 */
export const isExpense = (transaction) => {
  return transaction.type === TransactionType.EXPENSE;
};

/**
 * Helper: Vérifier si une transaction est un transfert
 */
export const isTransfer = (transaction) => {
  return transaction.type === TransactionType.TRANSFER;
};

/**
 * Helper: Formater le montant avec signe
 */
export const formatTransactionAmount = (transaction, currency = 'HTG') => {
  const amount = new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: currency
  }).format(transaction.amount);
  
  if (isIncome(transaction)) {
    return `+${amount}`;
  } else if (isExpense(transaction)) {
    return `-${amount}`;
  }
  
  return amount;
};

// Export par défaut de tous les types Transaction
export default {
  TransactionType,
  TransactionCategory,
  TransactionStatus,
  RecurrenceFrequency,
  TransactionTypeLabels,
  TransactionCategoryLabels,
  TransactionCategoryIcons,
  TransactionCategoryColors,
  TransactionStatusLabels,
  RecurrenceFrequencyLabels,
  defaultTransaction,
  transactionValidationRules,
  getCategoriesByType,
  getTransactionColor,
  getCategoryLabel,
  getCategoryIcon,
  getCategoryColor,
  isIncome,
  isExpense,
  isTransfer,
  formatTransactionAmount
};