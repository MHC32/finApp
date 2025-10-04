// ===================================================================
// SOL TYPES - FinApp Haiti
// Synchronisé avec Backend models/Sol.js
// ===================================================================

/**
 * Types de sols/tontines
 * Correspond EXACTEMENT à solSchema.type.enum dans le backend
 */
export const SolType = {
  CLASSIC: 'classic',
  INVESTMENT: 'investment',
  EMERGENCY: 'emergency',
  PROJECT: 'project',
  BUSINESS: 'business'
};

/**
 * Fréquences de paiement sols
 * Correspond EXACTEMENT à solSchema.frequency.enum dans le backend
 */
export const SolFrequency = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
};

/**
 * Statuts de sols
 * Correspond EXACTEMENT à solSchema.status.enum dans le backend
 */
export const SolStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Statuts de paiement participant
 * Correspond EXACTEMENT à participantSchema.paymentStatus.enum dans le backend
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  EXEMPT: 'exempt'
};

/**
 * Statuts de rounds
 * Correspond EXACTEMENT à roundSchema.status.enum dans le backend
 */
export const RoundStatus = {
  SCHEDULED: 'scheduled',
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Rôles des participants
 * Correspond EXACTEMENT à participantSchema.role.enum dans le backend
 */
export const ParticipantRole = {
  CREATOR: 'creator',
  PARTICIPANT: 'participant'
};

/**
 * Labels français pour les types de sols
 */
export const SolTypeLabels = {
  [SolType.CLASSIC]: 'Sol classique',
  [SolType.INVESTMENT]: 'Sol investissement',
  [SolType.EMERGENCY]: 'Sol urgence',
  [SolType.PROJECT]: 'Sol projet',
  [SolType.BUSINESS]: 'Sol business'
};

/**
 * Descriptions des types de sols
 */
export const SolTypeDescriptions = {
  [SolType.CLASSIC]: 'Tontine traditionnelle haïtienne pour épargne régulière',
  [SolType.INVESTMENT]: 'Sol pour investissement collectif avec rendement',
  [SolType.EMERGENCY]: 'Fonds d\'urgence entre membres',
  [SolType.PROJECT]: 'Sol pour financer un projet spécifique',
  [SolType.BUSINESS]: 'Sol pour créer ou développer un business'
};

/**
 * Labels français pour les fréquences
 */
export const SolFrequencyLabels = {
  [SolFrequency.WEEKLY]: 'Hebdomadaire',
  [SolFrequency.BIWEEKLY]: 'Bi-hebdomadaire',
  [SolFrequency.MONTHLY]: 'Mensuel',
  [SolFrequency.QUARTERLY]: 'Trimestriel'
};

/**
 * Labels français pour les statuts de sol
 */
export const SolStatusLabels = {
  [SolStatus.DRAFT]: 'Brouillon',
  [SolStatus.PENDING]: 'En attente',
  [SolStatus.ACTIVE]: 'Actif',
  [SolStatus.PAUSED]: 'En pause',
  [SolStatus.COMPLETED]: 'Terminé',
  [SolStatus.CANCELLED]: 'Annulé'
};

/**
 * Labels français pour les statuts de paiement
 */
export const PaymentStatusLabels = {
  [PaymentStatus.PENDING]: 'En attente',
  [PaymentStatus.PAID]: 'Payé',
  [PaymentStatus.OVERDUE]: 'En retard',
  [PaymentStatus.EXEMPT]: 'Exempté'
};

/**
 * Labels français pour les statuts de rounds
 */
export const RoundStatusLabels = {
  [RoundStatus.SCHEDULED]: 'Planifié',
  [RoundStatus.PENDING]: 'En attente',
  [RoundStatus.ACTIVE]: 'En cours',
  [RoundStatus.COMPLETED]: 'Terminé',
  [RoundStatus.CANCELLED]: 'Annulé'
};

/**
 * Couleurs pour les statuts de sol
 */
export const SolStatusColors = {
  [SolStatus.DRAFT]: '#9E9E9E',
  [SolStatus.PENDING]: '#FF9800',
  [SolStatus.ACTIVE]: '#4CAF50',
  [SolStatus.PAUSED]: '#FFC107',
  [SolStatus.COMPLETED]: '#2196F3',
  [SolStatus.CANCELLED]: '#F44336'
};

/**
 * Couleurs pour les statuts de paiement
 */
export const PaymentStatusColors = {
  [PaymentStatus.PENDING]: '#FF9800',
  [PaymentStatus.PAID]: '#4CAF50',
  [PaymentStatus.OVERDUE]: '#F44336',
  [PaymentStatus.EXEMPT]: '#9E9E9E'
};

/**
 * Icônes Material-UI pour les types de sols
 */
export const SolTypeIcons = {
  [SolType.CLASSIC]: 'savings',
  [SolType.INVESTMENT]: 'trending_up',
  [SolType.EMERGENCY]: 'local_hospital',
  [SolType.PROJECT]: 'engineering',
  [SolType.BUSINESS]: 'business_center'
};

/**
 * @typedef {Object} SolParticipant
 * @property {string} user - User ID (ref User)
 * @property {number} position - Position dans le sol (1-20)
 * @property {Date} joinedAt - Date d'adhésion
 * @property {string} role - Rôle (creator/participant)
 * @property {string} paymentStatus - Statut paiement
 * @property {number} receivedAmount - Montant reçu
 * @property {number} totalPaid - Total payé
 * @property {Date} [lastPaymentDate] - Dernière date de paiement
 * @property {Object[]} paymentHistory - Historique paiements
 */

/**
 * @typedef {Object} SolRound
 * @property {number} roundNumber - Numéro du tour
 * @property {Date} startDate - Date de début
 * @property {Date} endDate - Date de fin
 * @property {Date} dueDate - Date limite paiement
 * @property {string} status - Statut du round
 * @property {string} [recipient] - Bénéficiaire ID
 * @property {number} expectedAmount - Montant attendu
 * @property {number} actualAmount - Montant réel collecté
 * @property {Object[]} payments - Paiements du round
 * @property {Date} [completedDate] - Date de complétion
 * @property {boolean} isDistributed - Montant distribué
 * @property {Date} [distributionDate] - Date de distribution
 */

/**
 * @typedef {Object} Sol
 * @property {string} _id - MongoDB ID
 * @property {string} creator - Créateur ID (ref User)
 * @property {string} name - Nom du sol
 * @property {string} [description] - Description
 * @property {string} type - Type de sol
 * @property {number} contributionAmount - Montant contribution
 * @property {string} currency - Devise (HTG/USD)
 * @property {number} maxParticipants - Max participants (3-20)
 * @property {string} frequency - Fréquence paiements
 * @property {Date} startDate - Date de début
 * @property {Date} [actualStartDate] - Date début réelle
 * @property {number} [duration] - Durée en mois
 * @property {number} paymentDay - Jour de paiement (1-31)
 * @property {number} interestRate - Taux d'intérêt (%)
 * @property {number} serviceFee - Frais service (%)
 * @property {number} lateFee - Pénalité retard (%)
 * @property {string} [accessCode] - Code d'accès
 * @property {boolean} isPrivate - Sol privé
 * @property {string} status - Statut du sol
 * @property {SolParticipant[]} participants - Participants
 * @property {SolRound[]} rounds - Tours du sol
 * @property {Object} metrics - Métriques
 * @property {Date} createdAt - Date création
 * @property {Date} updatedAt - Date modification
 */

/**
 * Valeurs par défaut pour un nouveau sol
 */
export const defaultSol = {
  name: '',
  description: '',
  type: SolType.CLASSIC,
  contributionAmount: 0,
  currency: 'HTG',
  maxParticipants: 10,
  frequency: SolFrequency.MONTHLY,
  paymentDay: 1,
  interestRate: 0,
  serviceFee: 0,
  lateFee: 5,
  isPrivate: false,
  status: SolStatus.DRAFT,
  participants: [],
  rounds: []
};

/**
 * Règles de validation pour le formulaire Sol
 */
export const solValidationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Le nom doit contenir entre 3 et 100 caractères'
  },
  type: {
    required: true,
    enum: Object.values(SolType),
    message: 'Type de sol invalide'
  },
  contributionAmount: {
    required: true,
    min: 500, // HTG
    message: 'Le montant minimum est 500 HTG'
  },
  maxParticipants: {
    required: true,
    min: 3,
    max: 20,
    message: 'Le nombre de participants doit être entre 3 et 20'
  },
  frequency: {
    required: true,
    enum: Object.values(SolFrequency),
    message: 'Fréquence invalide'
  },
  startDate: {
    required: true,
    message: 'La date de début est requise'
  },
  paymentDay: {
    required: true,
    min: 1,
    max: 31,
    message: 'Le jour de paiement doit être entre 1 et 31'
  }
};

/**
 * Helper: Calculer le montant total du sol
 */
export const calculateTotalSolAmount = (contributionAmount, maxParticipants) => {
  return contributionAmount * maxParticipants;
};

/**
 * Helper: Calculer la durée du sol en nombre de rounds
 */
export const calculateSolDuration = (maxParticipants) => {
  return maxParticipants; // Chaque participant reçoit une fois
};

/**
 * Helper: Vérifier si le sol est complet (tous les participants)
 */
export const isSolFull = (sol) => {
  return sol.participants.length >= sol.maxParticipants;
};

/**
 * Helper: Vérifier si l'utilisateur est créateur
 */
export const isCreator = (sol, userId) => {
  return sol.creator === userId;
};

/**
 * Helper: Vérifier si l'utilisateur est participant
 */
export const isParticipant = (sol, userId) => {
  return sol.participants.some(p => p.user === userId);
};

/**
 * Helper: Obtenir la position de l'utilisateur
 */
export const getUserPosition = (sol, userId) => {
  const participant = sol.participants.find(p => p.user === userId);
  return participant ? participant.position : null;
};

/**
 * Helper: Calculer le taux de paiement à temps
 */
export const getOnTimePaymentRate = (sol) => {
  if (!sol.metrics) return 0;
  const total = sol.metrics.onTimePayments + sol.metrics.latePayments;
  if (total === 0) return 0;
  return Math.round((sol.metrics.onTimePayments / total) * 100);
};

/**
 * Helper: Calculer le nombre de places restantes
 */
export const getRemainingSlots = (sol) => {
  return sol.maxParticipants - sol.participants.length;
};

/**
 * Helper: Obtenir le prochain round actif
 */
export const getNextRound = (sol) => {
  return sol.rounds.find(r => 
    r.status === RoundStatus.PENDING || r.status === RoundStatus.ACTIVE
  );
};

/**
 * Helper: Vérifier si un paiement est en retard
 */
export const isPaymentOverdue = (round) => {
  if (!round.dueDate) return false;
  return new Date() > new Date(round.dueDate) && round.status !== RoundStatus.COMPLETED;
};

/**
 * Helper: Générer un code d'accès aléatoire
 */
export const generateAccessCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Export par défaut de tous les types Sol
export default {
  SolType,
  SolFrequency,
  SolStatus,
  PaymentStatus,
  RoundStatus,
  ParticipantRole,
  SolTypeLabels,
  SolTypeDescriptions,
  SolFrequencyLabels,
  SolStatusLabels,
  PaymentStatusLabels,
  RoundStatusLabels,
  SolStatusColors,
  PaymentStatusColors,
  SolTypeIcons,
  defaultSol,
  solValidationRules,
  calculateTotalSolAmount,
  calculateSolDuration,
  isSolFull,
  isCreator,
  isParticipant,
  getUserPosition,
  getOnTimePaymentRate,
  getRemainingSlots,
  getNextRound,
  isPaymentOverdue,
  generateAccessCode
};