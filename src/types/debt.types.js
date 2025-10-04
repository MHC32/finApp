// ===================================================================
// DEBT TYPES - FinApp Haiti
// Synchronisé avec Backend models/Debt.js
// ===================================================================

/**
 * Types de dettes
 * Correspond EXACTEMENT à debtSchema.type.enum dans le backend
 */
export const DebtType = {
  DEBT: 'debt',  // Je dois de l'argent
  LOAN: 'loan'   // On me doit de l'argent
};

/**
 * Relations de contact
 * Correspond EXACTEMENT à debtSchema.contact.relation.enum dans le backend
 */
export const ContactRelation = {
  FAMILY: 'family',
  FRIEND: 'friend',
  COLLEAGUE: 'colleague',
  BUSINESS: 'business',
  OTHER: 'other'
};

/**
 * Raisons de la dette
 * Correspond EXACTEMENT à debtSchema.reason.enum dans le backend
 */
export const DebtReason = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  EMERGENCY: 'emergency',
  INVESTMENT: 'investment',
  EDUCATION: 'education',
  HEALTH: 'health',
  OTHER: 'other'
};

/**
 * Statuts de dettes
 * Correspond EXACTEMENT à debtSchema.status.enum dans le backend
 */
export const DebtStatus = {
  ACTIVE: 'active',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

/**
 * Priorités de dettes
 * Correspond EXACTEMENT à debtSchema.priority.enum dans le backend
 */
export const DebtPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Labels français pour les types de dettes
 */
export const DebtTypeLabels = {
  [DebtType.DEBT]: 'Dette (je dois)',
  [DebtType.LOAN]: 'Créance (on me doit)'
};

/**
 * Labels français pour les relations
 */
export const ContactRelationLabels = {
  [ContactRelation.FAMILY]: 'Famille',
  [ContactRelation.FRIEND]: 'Ami(e)',
  [ContactRelation.COLLEAGUE]: 'Collègue',
  [ContactRelation.BUSINESS]: 'Business',
  [ContactRelation.OTHER]: 'Autre'
};

/**
 * Labels français pour les raisons
 */
export const DebtReasonLabels = {
  [DebtReason.PERSONAL]: 'Personnel',
  [DebtReason.BUSINESS]: 'Business',
  [DebtReason.EMERGENCY]: 'Urgence',
  [DebtReason.INVESTMENT]: 'Investissement',
  [DebtReason.EDUCATION]: 'Éducation',
  [DebtReason.HEALTH]: 'Santé',
  [DebtReason.OTHER]: 'Autre'
};

/**
 * Labels français pour les statuts
 */
export const DebtStatusLabels = {
  [DebtStatus.ACTIVE]: 'Actif',
  [DebtStatus.PARTIALLY_PAID]: 'Partiellement payé',
  [DebtStatus.PAID]: 'Payé',
  [DebtStatus.OVERDUE]: 'En retard',
  [DebtStatus.CANCELLED]: 'Annulé'
};

/**
 * Labels français pour les priorités
 */
export const DebtPriorityLabels = {
  [DebtPriority.LOW]: 'Faible',
  [DebtPriority.MEDIUM]: 'Moyenne',
  [DebtPriority.HIGH]: 'Haute',
  [DebtPriority.URGENT]: 'Urgente'
};

/**
 * Couleurs pour les types de dettes
 */
export const DebtTypeColors = {
  [DebtType.DEBT]: '#F44336',  // Rouge (je dois)
  [DebtType.LOAN]: '#4CAF50'   // Vert (on me doit)
};

/**
 * Couleurs pour les statuts
 */
export const DebtStatusColors = {
  [DebtStatus.ACTIVE]: '#2196F3',
  [DebtStatus.PARTIALLY_PAID]: '#FF9800',
  [DebtStatus.PAID]: '#4CAF50',
  [DebtStatus.OVERDUE]: '#F44336',
  [DebtStatus.CANCELLED]: '#9E9E9E'
};

/**
 * Couleurs pour les priorités
 */
export const DebtPriorityColors = {
  [DebtPriority.LOW]: '#4CAF50',
  [DebtPriority.MEDIUM]: '#FF9800',
  [DebtPriority.HIGH]: '#F44336',
  [DebtPriority.URGENT]: '#9C27B0'
};

/**
 * Icônes Material-UI pour les types
 */
export const DebtTypeIcons = {
  [DebtType.DEBT]: 'trending_down',
  [DebtType.LOAN]: 'trending_up'
};

/**
 * @typedef {Object} DebtContact
 * @property {string} name - Nom du contact
 * @property {string} [phone] - Téléphone
 * @property {string} [email] - Email
 * @property {string} relation - Relation (family/friend/etc)
 */

/**
 * @typedef {Object} DebtPayment
 * @property {number} amount - Montant payé
 * @property {Date} date - Date du paiement
 * @property {string} [description] - Description
 * @property {string} [transactionRef] - Référence transaction
 */

/**
 * @typedef {Object} Debt
 * @property {string} _id - MongoDB ID
 * @property {string} user - User ID (ref User)
 * @property {string} type - Type (debt/loan)
 * @property {DebtContact} contact - Contact
 * @property {number} amount - Montant total
 * @property {string} currency - Devise (HTG/USD)
 * @property {number} amountPaid - Montant payé
 * @property {number} amountRemaining - Montant restant
 * @property {string} [description] - Description
 * @property {string} reason - Raison
 * @property {Date} borrowedDate - Date emprunt
 * @property {Date} [dueDate] - Date limite
 * @property {string} status - Statut
 * @property {string} priority - Priorité
 * @property {DebtPayment[]} payments - Historique paiements
 * @property {Date} createdAt - Date création
 * @property {Date} updatedAt - Date modification
 */

/**
 * Valeurs par défaut pour une nouvelle dette
 */
export const defaultDebt = {
  type: DebtType.DEBT,
  contact: {
    name: '',
    phone: '',
    email: '',
    relation: ContactRelation.OTHER
  },
  amount: 0,
  currency: 'HTG',
  amountPaid: 0,
  description: '',
  reason: DebtReason.OTHER,
  borrowedDate: new Date().toISOString(),
  status: DebtStatus.ACTIVE,
  priority: DebtPriority.MEDIUM,
  payments: []
};

/**
 * Valeurs par défaut pour un paiement
 */
export const defaultPayment = {
  amount: 0,
  date: new Date().toISOString(),
  description: ''
};

/**
 * Règles de validation pour le formulaire Debt
 */
export const debtValidationRules = {
  type: {
    required: true,
    enum: Object.values(DebtType),
    message: 'Type de dette invalide'
  },
  contactName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Le nom doit contenir entre 2 et 100 caractères'
  },
  contactRelation: {
    required: true,
    enum: Object.values(ContactRelation),
    message: 'Relation invalide'
  },
  amount: {
    required: true,
    min: 1,
    message: 'Le montant doit être supérieur à 0'
  },
  reason: {
    required: true,
    enum: Object.values(DebtReason),
    message: 'Raison invalide'
  },
  borrowedDate: {
    required: true,
    message: 'La date d\'emprunt est requise'
  },
  priority: {
    required: true,
    enum: Object.values(DebtPriority),
    message: 'Priorité invalide'
  }
};

/**
 * Helper: Calculer le montant restant
 */
export const calculateAmountRemaining = (amount, amountPaid) => {
  return Math.max(0, amount - amountPaid);
};

/**
 * Helper: Calculer le pourcentage payé
 */
export const calculatePercentagePaid = (amount, amountPaid) => {
  if (amount === 0) return 0;
  return Math.round((amountPaid / amount) * 100);
};

/**
 * Helper: Vérifier si la dette est en retard
 */
export const isDebtOverdue = (debt) => {
  if (!debt.dueDate || debt.status === DebtStatus.PAID) return false;
  return new Date(debt.dueDate) < new Date() && debt.status !== DebtStatus.PAID;
};

/**
 * Helper: Calculer les jours restants avant échéance
 */
export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Helper: Vérifier si une dette est complètement payée
 */
export const isFullyPaid = (debt) => {
  return debt.status === DebtStatus.PAID || debt.amountRemaining === 0;
};

/**
 * Helper: Obtenir le label du type pour affichage
 */
export const getDebtTypeLabel = (type) => {
  return DebtTypeLabels[type] || type;
};

/**
 * Helper: Obtenir la couleur selon le type
 */
export const getDebtTypeColor = (type) => {
  return DebtTypeColors[type] || '#9E9E9E';
};

/**
 * Helper: Obtenir l'icône selon le type
 */
export const getDebtTypeIcon = (type) => {
  return DebtTypeIcons[type] || 'account_balance';
};

/**
 * Helper: Calculer le total des paiements
 */
export const calculateTotalPayments = (payments) => {
  return payments.reduce((total, payment) => total + payment.amount, 0);
};

/**
 * Helper: Obtenir le prochain paiement suggéré
 */
export const getSuggestedPayment = (amountRemaining, numberOfMonths = 3) => {
  if (amountRemaining <= 0 || numberOfMonths <= 0) return 0;
  return Math.ceil(amountRemaining / numberOfMonths);
};

/**
 * Helper: Vérifier si un rappel est nécessaire
 */
export const needsReminder = (debt, daysBefore = 7) => {
  if (!debt.dueDate || isFullyPaid(debt)) return false;
  const daysUntilDue = getDaysUntilDue(debt.dueDate);
  return daysUntilDue !== null && daysUntilDue <= daysBefore && daysUntilDue >= 0;
};

// Export par défaut de tous les types Debt
export default {
  DebtType,
  ContactRelation,
  DebtReason,
  DebtStatus,
  DebtPriority,
  DebtTypeLabels,
  ContactRelationLabels,
  DebtReasonLabels,
  DebtStatusLabels,
  DebtPriorityLabels,
  DebtTypeColors,
  DebtStatusColors,
  DebtPriorityColors,
  DebtTypeIcons,
  defaultDebt,
  defaultPayment,
  debtValidationRules,
  calculateAmountRemaining,
  calculatePercentagePaid,
  isDebtOverdue,
  getDaysUntilDue,
  isFullyPaid,
  getDebtTypeLabel,
  getDebtTypeColor,
  getDebtTypeIcon,
  calculateTotalPayments,
  getSuggestedPayment,
  needsReminder
};