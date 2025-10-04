// ===================================================================
// ACCOUNT TYPES - FinApp Haiti
// Synchronisé avec Backend models/Account.js
// ===================================================================

/**
 * Types de comptes bancaires et financiers
 * Correspond EXACTEMENT à accountSchema.type.enum dans le backend
 */
export const AccountType = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
  INVESTMENT: 'investment'
};

/**
 * Devises supportées
 * Correspond EXACTEMENT à accountSchema.currency.enum dans le backend
 */
export const Currency = {
  HTG: 'HTG',
  USD: 'USD'
};

/**
 * Banques haïtiennes
 * Correspond EXACTEMENT à HAITI_BANKS dans backend utils/constants.js
 */
export const HaitiBank = {
  BNC: 'Banque Nationale de Crédit (BNC)',
  BUH: 'Banque de l\'Union Haïtienne (BUH)',
  SOGEBANK: 'Sogebank',
  UNIBANK: 'Unibank',
  CAPITAL_BANK: 'Capital Bank',
  SOGEBEL: 'Sogebel',
  BPH: 'Banque Populaire Haïtienne (BPH)',
  MONCASH: 'MonCash (Digicel)',
  NATCASH: 'NatCash (Natcom)',
  OTHER: 'Autre'
};

/**
 * Labels français pour les types de comptes
 */
export const AccountTypeLabels = {
  [AccountType.CHECKING]: 'Compte courant',
  [AccountType.SAVINGS]: 'Compte épargne',
  [AccountType.CASH]: 'Espèces',
  [AccountType.MOBILE_MONEY]: 'Mobile Money',
  [AccountType.INVESTMENT]: 'Investissement'
};

/**
 * Icônes Material-UI pour les types de comptes
 */
export const AccountTypeIcons = {
  [AccountType.CHECKING]: 'account_balance',
  [AccountType.SAVINGS]: 'savings',
  [AccountType.CASH]: 'payments',
  [AccountType.MOBILE_MONEY]: 'smartphone',
  [AccountType.INVESTMENT]: 'trending_up'
};

/**
 * Couleurs pour les types de comptes
 */
export const AccountTypeColors = {
  [AccountType.CHECKING]: '#2196F3',
  [AccountType.SAVINGS]: '#4CAF50',
  [AccountType.CASH]: '#FF9800',
  [AccountType.MOBILE_MONEY]: '#9C27B0',
  [AccountType.INVESTMENT]: '#00BCD4'
};

/**
 * @typedef {Object} Account
 * @property {string} _id - MongoDB ID
 * @property {string} user - User ID (ref User)
 * @property {string} name - Nom du compte
 * @property {string} type - Type de compte (checking/savings/cash/mobile_money/investment)
 * @property {string} [bankName] - Nom de la banque (requis si type = checking/savings)
 * @property {string} currency - Devise (HTG/USD)
 * @property {string} [accountNumber] - Numéro de compte
 * @property {number} currentBalance - Solde actuel
 * @property {number} availableBalance - Solde disponible
 * @property {number} minimumBalance - Solde minimum
 * @property {number} creditLimit - Limite de crédit
 * @property {string} [description] - Description du compte
 * @property {string[]} [tags] - Tags personnalisés
 * @property {boolean} isDefault - Compte par défaut
 * @property {boolean} isActive - Compte actif
 * @property {boolean} isArchived - Compte archivé
 * @property {boolean} includeInTotal - Inclure dans le total
 * @property {Object[]} balanceHistory - Historique des soldes
 * @property {Date} balanceHistory[].date - Date de la modification
 * @property {number} balanceHistory[].balance - Solde à cette date
 * @property {number} balanceHistory[].change - Variation du solde
 * @property {string} balanceHistory[].reason - Raison de la variation
 * @property {string} balanceHistory[].description - Description de la variation
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de dernière modification
 */

/**
 * Valeurs par défaut pour un nouveau compte
 */
export const defaultAccount = {
  name: '',
  type: AccountType.CASH,
  bankName: '',
  currency: Currency.HTG,
  accountNumber: '',
  currentBalance: 0,
  availableBalance: 0,
  minimumBalance: 0,
  creditLimit: 0,
  description: '',
  tags: [],
  isDefault: false,
  isActive: true,
  isArchived: false,
  includeInTotal: true
};

/**
 * Règles de validation pour le formulaire Account
 */
export const accountValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Le nom doit contenir entre 2 et 100 caractères'
  },
  type: {
    required: true,
    enum: Object.values(AccountType),
    message: 'Type de compte invalide'
  },
  bankName: {
    required: (formData) => {
      return ['checking', 'savings'].includes(formData.type);
    },
    enum: Object.values(HaitiBank),
    message: 'Banque invalide'
  },
  currency: {
    required: true,
    enum: Object.values(Currency),
    message: 'Devise invalide'
  },
  accountNumber: {
    required: false,
    pattern: /^[0-9]{6,16}$/,
    message: 'Numéro de compte invalide (6-16 chiffres)'
  },
  currentBalance: {
    required: false,
    min: 0,
    message: 'Le solde doit être positif'
  },
  minimumBalance: {
    required: false,
    min: 0,
    message: 'Le solde minimum doit être positif'
  },
  creditLimit: {
    required: false,
    min: 0,
    message: 'La limite de crédit doit être positive'
  }
};

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Helper: Vérifier si un type de compte nécessite une banque
 */
export const requiresBankName = (accountType) => {
  return [AccountType.CHECKING, AccountType.SAVINGS].includes(accountType);
};

/**
 * Helper: Vérifier si un type de compte est basé sur une banque
 * (Alias de requiresBankName pour compatibilité)
 */
export const isAccountTypeBankBased = (accountType) => {
  return requiresBankName(accountType);
};

/**
 * Helper: Obtenir le label d'un type de compte
 */
export const getAccountTypeLabel = (accountType) => {
  return AccountTypeLabels[accountType] || accountType;
};

/**
 * Helper: Obtenir l'icône d'un type de compte
 */
export const getAccountTypeIcon = (accountType) => {
  return AccountTypeIcons[accountType] || 'account_balance_wallet';
};

/**
 * Helper: Obtenir la couleur d'un type de compte
 */
export const getAccountTypeColor = (accountType) => {
  return AccountTypeColors[accountType] || '#9E9E9E';
};

/**
 * Helper: Obtenir le label d'une banque
 */
export const getBankLabel = (bankValue) => {
  // Si c'est déjà le label complet, le retourner
  if (Object.values(HaitiBank).includes(bankValue)) {
    return bankValue;
  }
  // Sinon chercher la clé
  return HaitiBank[bankValue] || bankValue;
};

/**
 * Helper: Obtenir le symbole d'une devise
 */
export const getCurrencySymbol = (currency) => {
  const symbols = {
    [Currency.HTG]: 'G',
    [Currency.USD]: '$'
  };
  return symbols[currency] || currency;
};

/**
 * Helper: Obtenir le label d'une devise
 */
export const getCurrencyLabel = (currency) => {
  const labels = {
    [Currency.HTG]: 'Gourde haïtienne',
    [Currency.USD]: 'Dollar américain'
  };
  return labels[currency] || currency;
};

/**
 * Helper: Formater le nom complet d'un compte
 */
export const getAccountDisplayName = (account) => {
  if (!account) return '';
  
  const parts = [account.name];
  
  if (account.bankName && account.bankName !== 'Autre') {
    // Extraire juste le sigle (ex: "BNC" de "Banque Nationale de Crédit (BNC)")
    const match = account.bankName.match(/\(([^)]+)\)/);
    if (match) {
      parts.push(`(${match[1]})`);
    }
  }
  
  if (account.accountNumber) {
    parts.push(`***${account.accountNumber.slice(-4)}`);
  }
  
  return parts.join(' ');
};

/**
 * Helper: Vérifier si le compte est en découvert
 */
export const isOverdrawn = (account) => {
  return account.currentBalance < account.minimumBalance;
};

/**
 * Helper: Calculer le solde disponible effectif
 */
export const getEffectiveBalance = (account) => {
  if (account.type === AccountType.CHECKING && account.creditLimit > 0) {
    return account.availableBalance + account.creditLimit;
  }
  return account.availableBalance;
};

// Export par défaut de tous les types Account
export default {
  AccountType,
  Currency,
  HaitiBank,
  AccountTypeLabels,
  AccountTypeIcons,
  AccountTypeColors,
  defaultAccount,
  accountValidationRules,
  requiresBankName,
  isAccountTypeBankBased,
  getAccountTypeLabel,
  getAccountTypeIcon,
  getAccountTypeColor,
  getBankLabel,
  getCurrencySymbol,
  getCurrencyLabel,
  getAccountDisplayName,
  isOverdrawn,
  getEffectiveBalance
};