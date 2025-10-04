// ===================================================================
// INVESTMENT TYPES - FinApp Haiti
// Synchronisé avec Backend models/Investment.js
// ===================================================================

/**
 * Types d'investissements
 * Correspond EXACTEMENT à investmentSchema.type.enum dans le backend
 */
export const InvestmentType = {
  SMALL_BUSINESS: 'small_business',
  AGRICULTURE: 'agriculture',
  COMMERCE: 'commerce',
  REAL_ESTATE: 'real_estate',
  TECHNOLOGY: 'technology',
  SERVICES: 'services',
  OTHER: 'other'
};

/**
 * Catégories d'investissements
 * Correspond EXACTEMENT à investmentSchema.category.enum dans le backend
 */
export const InvestmentCategory = {
  AGRICULTURE: 'agriculture',
  COMMERCE: 'commerce',
  IMMOBILIER: 'immobilier',
  TECHNOLOGIE: 'technologie',
  SERVICES: 'services',
  INDUSTRIE: 'industrie',
  AUTRE: 'autre'
};

/**
 * Sources de revenus
 * Correspond EXACTEMENT à revenueSchema.source.enum dans le backend
 */
export const RevenueSource = {
  SALES: 'sales',
  RENT: 'rent',
  DIVIDEND: 'dividend',
  INTEREST: 'interest',
  PROFIT_SHARE: 'profit_share',
  OTHER: 'other'
};

/**
 * Catégories de dépenses
 * Correspond EXACTEMENT à expenseSchema.category.enum dans le backend
 */
export const ExpenseCategory = {
  MAINTENANCE: 'maintenance',
  SUPPLIES: 'supplies',
  LABOR: 'labor',
  MARKETING: 'marketing',
  EQUIPMENT: 'equipment',
  UTILITIES: 'utilities',
  RENT: 'rent',
  INSURANCE: 'insurance',
  TAXES: 'taxes',
  OTHER: 'other'
};

/**
 * Labels français pour les types d'investissements
 */
export const InvestmentTypeLabels = {
  [InvestmentType.SMALL_BUSINESS]: 'Petit commerce',
  [InvestmentType.AGRICULTURE]: 'Agriculture',
  [InvestmentType.COMMERCE]: 'Commerce',
  [InvestmentType.REAL_ESTATE]: 'Immobilier',
  [InvestmentType.TECHNOLOGY]: 'Technologie',
  [InvestmentType.SERVICES]: 'Services',
  [InvestmentType.OTHER]: 'Autre'
};

/**
 * Labels français pour les catégories
 */
export const InvestmentCategoryLabels = {
  [InvestmentCategory.AGRICULTURE]: 'Agriculture',
  [InvestmentCategory.COMMERCE]: 'Commerce',
  [InvestmentCategory.IMMOBILIER]: 'Immobilier',
  [InvestmentCategory.TECHNOLOGIE]: 'Technologie',
  [InvestmentCategory.SERVICES]: 'Services',
  [InvestmentCategory.INDUSTRIE]: 'Industrie',
  [InvestmentCategory.AUTRE]: 'Autre'
};

/**
 * Labels français pour les sources de revenus
 */
export const RevenueSourceLabels = {
  [RevenueSource.SALES]: 'Ventes',
  [RevenueSource.RENT]: 'Loyer',
  [RevenueSource.DIVIDEND]: 'Dividendes',
  [RevenueSource.INTEREST]: 'Intérêts',
  [RevenueSource.PROFIT_SHARE]: 'Partage bénéfices',
  [RevenueSource.OTHER]: 'Autre'
};

/**
 * Labels français pour les catégories de dépenses
 */
export const ExpenseCategoryLabels = {
  [ExpenseCategory.MAINTENANCE]: 'Maintenance',
  [ExpenseCategory.SUPPLIES]: 'Fournitures',
  [ExpenseCategory.LABOR]: 'Main d\'œuvre',
  [ExpenseCategory.MARKETING]: 'Marketing',
  [ExpenseCategory.EQUIPMENT]: 'Équipement',
  [ExpenseCategory.UTILITIES]: 'Services publics',
  [ExpenseCategory.RENT]: 'Loyer',
  [ExpenseCategory.INSURANCE]: 'Assurance',
  [ExpenseCategory.TAXES]: 'Taxes',
  [ExpenseCategory.OTHER]: 'Autre'
};

/**
 * Icônes Material-UI pour les types d'investissements
 */
export const InvestmentTypeIcons = {
  [InvestmentType.SMALL_BUSINESS]: 'store',
  [InvestmentType.AGRICULTURE]: 'agriculture',
  [InvestmentType.COMMERCE]: 'shopping_bag',
  [InvestmentType.REAL_ESTATE]: 'home_work',
  [InvestmentType.TECHNOLOGY]: 'computer',
  [InvestmentType.SERVICES]: 'room_service',
  [InvestmentType.OTHER]: 'business'
};

/**
 * Couleurs pour les types d'investissements
 */
export const InvestmentTypeColors = {
  [InvestmentType.SMALL_BUSINESS]: '#FF9800',
  [InvestmentType.AGRICULTURE]: '#4CAF50',
  [InvestmentType.COMMERCE]: '#2196F3',
  [InvestmentType.REAL_ESTATE]: '#9C27B0',
  [InvestmentType.TECHNOLOGY]: '#00BCD4',
  [InvestmentType.SERVICES]: '#E91E63',
  [InvestmentType.OTHER]: '#607D8B'
};

/**
 * @typedef {Object} InvestmentRevenue
 * @property {number} amount - Montant du revenu
 * @property {Date} date - Date du revenu
 * @property {string} description - Description
 * @property {string} source - Source (sales/rent/dividend/etc)
 * @property {boolean} [isRecurring] - Revenu récurrent
 * @property {string} [recurringFrequency] - Fréquence récurrence
 * @property {string} [transactionRef] - Référence transaction
 */

/**
 * @typedef {Object} InvestmentExpense
 * @property {number} amount - Montant de la dépense
 * @property {Date} date - Date de la dépense
 * @property {string} description - Description
 * @property {string} category - Catégorie
 * @property {boolean} [isRecurring] - Dépense récurrente
 * @property {string} [recurringFrequency] - Fréquence récurrence
 * @property {string} [transactionRef] - Référence transaction
 */

/**
 * @typedef {Object} Investment
 * @property {string} _id - MongoDB ID
 * @property {string} user - User ID (ref User)
 * @property {string} name - Nom du projet
 * @property {string} description - Description
 * @property {string} type - Type d'investissement
 * @property {string} category - Catégorie
 * @property {string} currency - Devise (HTG/USD)
 * @property {number} initialInvestment - Investissement initial
 * @property {number} additionalInvestments - Investissements additionnels
 * @property {number} totalInvested - Total investi
 * @property {InvestmentRevenue[]} revenues - Revenus
 * @property {InvestmentExpense[]} expenses - Dépenses
 * @property {number} totalRevenue - Total revenus
 * @property {number} totalExpense - Total dépenses
 * @property {number} netProfit - Profit net
 * @property {number} roi - ROI (%)
 * @property {number} currentValue - Valeur actuelle
 * @property {string} status - Statut
 * @property {Date} [startDate] - Date de début
 * @property {Date} createdAt - Date création
 * @property {Date} updatedAt - Date modification
 */

/**
 * Valeurs par défaut pour un nouveau investissement
 */
export const defaultInvestment = {
  name: '',
  description: '',
  type: InvestmentType.SMALL_BUSINESS,
  category: InvestmentCategory.AUTRE,
  currency: 'HTG',
  initialInvestment: 0,
  additionalInvestments: 0,
  revenues: [],
  expenses: []
};

/**
 * Valeurs par défaut pour un revenu
 */
export const defaultRevenue = {
  amount: 0,
  date: new Date().toISOString(),
  description: '',
  source: RevenueSource.SALES,
  isRecurring: false
};

/**
 * Valeurs par défaut pour une dépense
 */
export const defaultExpense = {
  amount: 0,
  date: new Date().toISOString(),
  description: '',
  category: ExpenseCategory.OTHER,
  isRecurring: false
};

/**
 * Règles de validation pour le formulaire Investment
 */
export const investmentValidationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 150,
    message: 'Le nom doit contenir entre 3 et 150 caractères'
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'La description doit contenir entre 10 et 1000 caractères'
  },
  type: {
    required: true,
    enum: Object.values(InvestmentType),
    message: 'Type d\'investissement invalide'
  },
  category: {
    required: true,
    enum: Object.values(InvestmentCategory),
    message: 'Catégorie invalide'
  },
  initialInvestment: {
    required: true,
    min: 100,
    message: 'L\'investissement initial minimum est 100'
  }
};

/**
 * Helper: Calculer le total des revenus
 */
export const calculateTotalRevenue = (revenues) => {
  return revenues.reduce((total, rev) => total + rev.amount, 0);
};

/**
 * Helper: Calculer le total des dépenses
 */
export const calculateTotalExpense = (expenses) => {
  return expenses.reduce((total, exp) => total + exp.amount, 0);
};

/**
 * Helper: Calculer le profit net
 */
export const calculateNetProfit = (revenues, expenses) => {
  return calculateTotalRevenue(revenues) - calculateTotalExpense(expenses);
};

/**
 * Helper: Calculer le ROI (Return on Investment)
 */
export const calculateROI = (totalInvested, netProfit) => {
  if (totalInvested === 0) return 0;
  return Math.round((netProfit / totalInvested) * 100);
};

/**
 * Helper: Obtenir la couleur du ROI
 */
export const getROIColor = (roi) => {
  if (roi > 20) return '#4CAF50'; // Excellent (vert)
  if (roi > 10) return '#8BC34A'; // Bon (vert clair)
  if (roi > 0) return '#FFC107'; // Moyen (orange)
  if (roi === 0) return '#9E9E9E'; // Neutre (gris)
  return '#F44336'; // Négatif (rouge)
};

/**
 * Helper: Obtenir le statut de performance
 */
export const getPerformanceStatus = (roi) => {
  if (roi > 20) return 'excellent';
  if (roi > 10) return 'good';
  if (roi > 0) return 'average';
  if (roi === 0) return 'break_even';
  return 'loss';
};

/**
 * Helper: Calculer la marge bénéficiaire
 */
export const calculateProfitMargin = (netProfit, totalRevenue) => {
  if (totalRevenue === 0) return 0;
  return Math.round((netProfit / totalRevenue) * 100);
};

/**
 * Helper: Vérifier si l'investissement est rentable
 */
export const isProfitable = (investment) => {
  const netProfit = calculateNetProfit(investment.revenues, investment.expenses);
  return netProfit > 0;
};

/**
 * Helper: Calculer le temps de récupération (payback period)
 */
export const calculatePaybackPeriod = (totalInvested, averageMonthlyProfit) => {
  if (averageMonthlyProfit <= 0) return Infinity;
  return Math.ceil(totalInvested / averageMonthlyProfit);
};

/**
 * Helper: Obtenir les revenus par source
 */
export const getRevenuesBySource = (revenues) => {
  const bySource = {};
  revenues.forEach(rev => {
    if (!bySource[rev.source]) {
      bySource[rev.source] = 0;
    }
    bySource[rev.source] += rev.amount;
  });
  return bySource;
};

/**
 * Helper: Obtenir les dépenses par catégorie
 */
export const getExpensesByCategory = (expenses) => {
  const byCategory = {};
  expenses.forEach(exp => {
    if (!byCategory[exp.category]) {
      byCategory[exp.category] = 0;
    }
    byCategory[exp.category] += exp.amount;
  });
  return byCategory;
};

// Export par défaut de tous les types Investment
export default {
  InvestmentType,
  InvestmentCategory,
  RevenueSource,
  ExpenseCategory,
  InvestmentTypeLabels,
  InvestmentCategoryLabels,
  RevenueSourceLabels,
  ExpenseCategoryLabels,
  InvestmentTypeIcons,
  InvestmentTypeColors,
  defaultInvestment,
  defaultRevenue,
  defaultExpense,
  investmentValidationRules,
  calculateTotalRevenue,
  calculateTotalExpense,
  calculateNetProfit,
  calculateROI,
  getROIColor,
  getPerformanceStatus,
  calculateProfitMargin,
  isProfitable,
  calculatePaybackPeriod,
  getRevenuesBySource,
  getExpensesByCategory
};