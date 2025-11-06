/**
 * Fonctions de validation - FinApp Haiti Frontend
 * Basé sur backend/src/utils/validators.js
 */

import { VALIDATION_PATTERNS, LIMITS, CURRENCIES, HAITI_BANKS } from './constants';

// ===================================================================
// VALIDATION EMAIL
// ===================================================================

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {object} { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'L\'email est requis' };
  }
  
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { valid: false, error: 'Format d\'email invalide' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION MOT DE PASSE
// ===================================================================

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe
 * @param {object} options - Options de validation
 * @returns {object} { valid: boolean, error: string, strength: string }
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;
  
  if (!password) {
    return { valid: false, error: 'Le mot de passe est requis', strength: 'none' };
  }
  
  if (password.length < minLength) {
    return { 
      valid: false, 
      error: `Le mot de passe doit contenir au moins ${minLength} caractères`,
      strength: 'weak'
    };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins une lettre majuscule',
      strength: 'weak'
    };
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins une lettre minuscule',
      strength: 'weak'
    };
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins un chiffre',
      strength: 'medium'
    };
  }
  
  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)',
      strength: 'medium'
    };
  }
  
  // Calculer la force
  let strength = 'strong';
  if (password.length < 12) strength = 'medium';
  if (password.length < 10) strength = 'weak';
  
  return { valid: true, strength };
};

/**
 * Calcule la force d'un mot de passe
 * @param {string} password - Mot de passe
 * @returns {object} { score: number, strength: string, feedback: array }
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, strength: 'none', feedback: [] };
  
  let score = 0;
  const feedback = [];
  
  // Longueur
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  else feedback.push('Utilisez au moins 12 caractères');
  
  // Minuscules
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Ajoutez des lettres minuscules');
  
  // Majuscules
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Ajoutez des lettres majuscules');
  
  // Chiffres
  if (/\d/.test(password)) score += 1;
  else feedback.push('Ajoutez des chiffres');
  
  // Caractères spéciaux
  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Ajoutez des caractères spéciaux');
  
  // Diversité
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
    score += 1;
  }
  
  // Déterminer la force
  let strength = 'weak';
  if (score >= 6) strength = 'strong';
  else if (score >= 4) strength = 'medium';
  
  return { score, strength, feedback };
};

// ===================================================================
// VALIDATION TÉLÉPHONE
// ===================================================================

/**
 * Valide un numéro de téléphone haïtien
 * @param {string} phone - Numéro
 * @returns {object} { valid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Le numéro de téléphone est requis' };
  }
  
  if (!VALIDATION_PATTERNS.HAITI_PHONE.test(phone) && !VALIDATION_PATTERNS.US_PHONE.test(phone)) {
    return { valid: false, error: 'Format de téléphone invalide (ex: +50932123456)' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION MONTANTS
// ===================================================================

/**
 * Valide un montant
 * @param {number} amount - Montant
 * @param {string} currency - Devise
 * @param {string} type - Type (transaction, sol, budget)
 * @returns {object} { valid: boolean, error: string }
 */
export const validateAmount = (amount, currency = 'HTG', type = 'transaction') => {
  if (amount === undefined || amount === null || amount === '') {
    return { valid: false, error: 'Le montant est requis' };
  }
  
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Le montant doit être un nombre valide' };
  }
  
  if (numAmount <= 0) {
    return { valid: false, error: 'Le montant doit être positif' };
  }
  
  // Limites selon le type
  const limits = LIMITS[type.toUpperCase()] || LIMITS.TRANSACTION;
  
  const minAmount = limits.MIN_AMOUNT || 1;
  const maxAmount = currency === 'HTG' 
    ? limits[`MAX_AMOUNT_${currency}`] || limits.MAX_AMOUNT_HTG
    : limits[`MAX_AMOUNT_${currency}`] || limits.MAX_AMOUNT_USD;
  
  if (numAmount < minAmount) {
    return { 
      valid: false, 
      error: `Le montant minimum est ${minAmount} ${currency}` 
    };
  }
  
  if (numAmount > maxAmount) {
    return { 
      valid: false, 
      error: `Le montant maximum est ${maxAmount} ${currency}` 
    };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION DEVISES
// ===================================================================

/**
 * Valide une devise
 * @param {string} currency - Code devise
 * @returns {object} { valid: boolean, error: string }
 */
export const validateCurrency = (currency) => {
  if (!currency) {
    return { valid: false, error: 'La devise est requise' };
  }
  
  if (!CURRENCIES[currency]) {
    return { valid: false, error: 'Devise non supportée. Utilisez HTG ou USD.' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION DATES
// ===================================================================

/**
 * Valide une date
 * @param {Date|string} date - Date
 * @param {object} options - Options
 * @returns {object} { valid: boolean, error: string }
 */
export const validateDate = (date, options = {}) => {
  const { allowFuture = true, allowPast = true } = options;
  
  if (!date) {
    return { valid: false, error: 'La date est requise' };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Date invalide' };
  }
  
  const now = new Date();
  
  if (!allowFuture && dateObj > now) {
    return { valid: false, error: 'La date ne peut pas être dans le futur' };
  }
  
  if (!allowPast && dateObj < now) {
    return { valid: false, error: 'La date ne peut pas être dans le passé' };
  }
  
  return { valid: true };
};

/**
 * Valide une plage de dates
 * @param {Date|string} startDate - Date début
 * @param {Date|string} endDate - Date fin
 * @returns {object} { valid: boolean, error: string }
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Date de début invalide' };
  }
  
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Date de fin invalide' };
  }
  
  if (start > end) {
    return { valid: false, error: 'La date de début doit être antérieure à la date de fin' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION POURCENTAGES
// ===================================================================

/**
 * Valide un pourcentage
 * @param {number} percentage - Pourcentage
 * @returns {object} { valid: boolean, error: string }
 */
export const validatePercentage = (percentage) => {
  if (percentage === undefined || percentage === null) {
    return { valid: false, error: 'Le pourcentage est requis' };
  }
  
  const num = Number(percentage);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Le pourcentage doit être un nombre valide' };
  }
  
  if (num < 0 || num > 100) {
    return { valid: false, error: 'Le pourcentage doit être entre 0 et 100' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION BANQUES
// ===================================================================

/**
 * Valide un code banque
 * @param {string} bankCode - Code banque
 * @returns {object} { valid: boolean, error: string }
 */
export const validateBankCode = (bankCode) => {
  if (!bankCode) {
    return { valid: false, error: 'La banque est requise' };
  }
  
  if (!HAITI_BANKS[bankCode]) {
    return { valid: false, error: 'Banque haïtienne non reconnue' };
  }
  
  return { valid: true };
};

/**
 * Valide un numéro de compte bancaire
 * @param {string} accountNumber - Numéro de compte
 * @returns {object} { valid: boolean, error: string }
 */
export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) {
    return { valid: false, error: 'Le numéro de compte est requis' };
  }
  
  if (!VALIDATION_PATTERNS.ACCOUNT_NUMBER.test(accountNumber)) {
    return { valid: false, error: 'Format de numéro de compte invalide (6-16 chiffres)' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION FICHIERS
// ===================================================================

/**
 * Valide un fichier uploadé
 * @param {File} file - Fichier
 * @param {object} options - Options
 * @returns {object} { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = LIMITS.UPLOAD.MAX_FILE_SIZE,
    allowedTypes = [...LIMITS.UPLOAD.ALLOWED_IMAGE_TYPES, ...LIMITS.UPLOAD.ALLOWED_DOCUMENT_TYPES]
  } = options;
  
  if (!file) {
    return { valid: false, error: 'Le fichier est requis' };
  }
  
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / 1024 / 1024);
    return { valid: false, error: `Le fichier ne doit pas dépasser ${maxMB} Mo` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé' };
  }
  
  return { valid: true };
};

// ===================================================================
// VALIDATION FORMULAIRES
// ===================================================================

/**
 * Valide un formulaire complet
 * @param {object} data - Données du formulaire
 * @param {object} rules - Règles de validation
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let valid = true;
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    // Required
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = rule.requiredMessage || 'Ce champ est requis';
      valid = false;
      return;
    }
    
    // Skip autres validations si vide et pas requis
    if (!value && !rule.required) return;
    
    // Min length
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `Minimum ${rule.minLength} caractères`;
      valid = false;
      return;
    }
    
    // Max length
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `Maximum ${rule.maxLength} caractères`;
      valid = false;
      return;
    }
    
    // Pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || 'Format invalide';
      valid = false;
      return;
    }
    
    // Custom validator
    if (rule.validator) {
      const result = rule.validator(value, data);
      if (!result.valid) {
        errors[field] = result.error;
        valid = false;
        return;
      }
    }
  });
  
  return { valid, errors };
};

// ===================================================================
// VALIDATION RÉACTIVE (pour formulaires en temps réel)
// ===================================================================

/**
 * Valide un champ en temps réel
 * @param {string} fieldName - Nom du champ
 * @param {*} value - Valeur
 * @param {object} rules - Règles
 * @returns {string|null} Message d'erreur ou null
 */
export const validateField = (fieldName, value, rules) => {
  const rule = rules[fieldName];
  if (!rule) return null;
  
  // Required
  if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return rule.requiredMessage || 'Ce champ est requis';
  }
  
  // Skip autres validations si vide et pas requis
  if (!value && !rule.required) return null;
  
  // Min length
  if (rule.minLength && value.length < rule.minLength) {
    return rule.minLengthMessage || `Minimum ${rule.minLength} caractères`;
  }
  
  // Max length
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.maxLengthMessage || `Maximum ${rule.maxLength} caractères`;
  }
  
  // Pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.patternMessage || 'Format invalide';
  }
  
  // Custom validator
  if (rule.validator) {
    const result = rule.validator(value);
    if (!result.valid) {
      return result.error;
    }
  }
  
  return null;
};

// ===================================================================
// HELPERS DE VALIDATION
// ===================================================================

/**
 * Vérifie si un objet a des erreurs de validation
 * @param {object} errors - Objet d'erreurs
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Obtient la première erreur d'un objet d'erreurs
 * @param {object} errors - Objet d'erreurs
 * @returns {string|null}
 */
export const getFirstError = (errors) => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

/**
 * Nettoie les erreurs vides
 * @param {object} errors - Objet d'erreurs
 * @returns {object}
 */
export const cleanErrors = (errors) => {
  const cleaned = {};
  Object.keys(errors).forEach(key => {
    if (errors[key]) cleaned[key] = errors[key];
  });
  return cleaned;
};