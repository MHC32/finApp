/**
 * Fonctions de formatage - FinApp Haiti Frontend
 * Basé sur backend/src/utils/formatters.js + dateUtils.js
 */

import { CURRENCIES, HAITI_BANKS, ACCOUNT_TYPES, TRANSACTION_CATEGORIES } from './constants';

// ===================================================================
// FORMATAGE MONTANTS ET DEVISES
// ===================================================================

/**
 * Formate un montant en devise
 * @param {number} amount - Montant
 * @param {string} currency - Devise (HTG ou USD)
 * @param {object} options - Options de formatage
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount, currency = 'HTG', options = {}) => {
  const {
    decimals = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.',
    showSymbol = true
  } = options;
  
  // Arrondir le montant
  const rounded = Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
  
  // Séparer partie entière et décimale
  const [integerPart, decimalPart = ''] = rounded.toFixed(decimals).split('.');
  
  // Ajouter séparateurs de milliers
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  // Construire le résultat
  let result = formattedInteger;
  if (decimals > 0) {
    result += decimalSeparator + decimalPart;
  }
  
  // Ajouter symbole devise
  if (showSymbol) {
    const symbol = CURRENCIES[currency]?.symbol || currency;
    result = currency === 'USD' ? `${symbol}${result}` : `${result} ${symbol}`;
  }
  
  return result;
};

/**
 * Formate un montant HTG
 * @param {number} amount - Montant
 * @param {object} options - Options
 * @returns {string} Montant formaté
 */
export const formatHTG = (amount, options = {}) => {
  return formatCurrency(amount, 'HTG', options);
};

/**
 * Formate un montant USD
 * @param {number} amount - Montant
 * @param {object} options - Options
 * @returns {string} Montant formaté
 */
export const formatUSD = (amount, options = {}) => {
  return formatCurrency(amount, 'USD', options);
};

/**
 * Formate un pourcentage
 * @param {number} value - Valeur
 * @param {number} decimals - Décimales (défaut: 2)
 * @returns {string} Pourcentage formaté
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formate un nombre avec séparateurs
 * @param {number} number - Nombre
 * @param {object} options - Options
 * @returns {string} Nombre formaté
 */
export const formatNumber = (number, options = {}) => {
  const {
    decimals = 0,
    thousandsSeparator = ',',
    decimalSeparator = '.'
  } = options;
  
  const rounded = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  const [integerPart, decimalPart = ''] = rounded.toFixed(decimals).split('.');
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  if (decimals > 0) {
    return formattedInteger + decimalSeparator + decimalPart;
  }
  
  return formattedInteger;
};

// ===================================================================
// FORMATAGE DATES
// ===================================================================

/**
 * Formate une date
 * @param {Date|string} date - Date
 * @param {string} format - Format (short, medium, long, full, custom)
 * @returns {string} Date formatée
 */
export const formatDate = (date, format = 'medium') => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Date invalide';
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  };
  
  return d.toLocaleDateString('fr-HT', options[format] || options.medium);
};

/**
 * Formate date + heure
 * @param {Date|string} date - Date
 * @param {string} format - Format
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (date, format = 'medium') => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Date invalide';
  
  const dateOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' }
  };
  
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  const dateStr = d.toLocaleDateString('fr-HT', dateOptions[format] || dateOptions.medium);
  const timeStr = d.toLocaleTimeString('fr-HT', timeOptions);
  
  return `${dateStr} à ${timeStr}`;
};

/**
 * Formate une heure
 * @param {Date|string} date - Date
 * @returns {string} Heure formatée
 */
export const formatTime = (date) => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Heure invalide';
  
  return d.toLocaleTimeString('fr-HT', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format relatif (il y a X temps)
 * @param {Date|string} date - Date
 * @returns {string} Temps relatif
 */
export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSec < 60) return `il y a ${diffSec} seconde${diffSec > 1 ? 's' : ''}`;
  if (diffMin < 60) return `il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  if (diffWeeks < 4) return `il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
  if (diffMonths < 12) return `il y a ${diffMonths} mois`;
  return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
};

/**
 * Formate une durée (secondes → texte)
 * @param {number} seconds - Durée en secondes
 * @returns {string} Durée formatée
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

// ===================================================================
// FORMATAGE TÉLÉPHONE
// ===================================================================

/**
 * Formate un numéro de téléphone haïtien
 * @param {string} phone - Téléphone
 * @param {string} format - Format (international, national, compact)
 * @returns {string} Téléphone formaté
 */
export const formatPhoneNumber = (phone, format = 'international') => {
  if (!phone) return '';
  
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '');
  
  // Extraire les parties
  let countryCode = '509';
  let number = cleaned;
  
  if (cleaned.startsWith('509')) {
    number = cleaned.slice(3);
  } else if (cleaned.startsWith('1509')) {
    number = cleaned.slice(4);
  }
  
  // Vérifier longueur
  if (number.length !== 8) return phone;
  
  // Formater selon le type
  const part1 = number.slice(0, 4);
  const part2 = number.slice(4, 8);
  
  switch (format) {
    case 'international':
      return `+${countryCode} ${part1}-${part2}`;
    case 'national':
      return `${part1}-${part2}`;
    case 'compact':
      return number;
    default:
      return `+${countryCode} ${part1}-${part2}`;
  }
};

// ===================================================================
// FORMATAGE FICHIERS
// ===================================================================

/**
 * Formate une taille de fichier
 * @param {number} bytes - Taille en octets
 * @param {number} decimals - Décimales
 * @returns {string} Taille formatée
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Octets';
  
  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

// ===================================================================
// FORMATAGE NOMS
// ===================================================================

/**
 * Formate un nom complet
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom
 * @param {string} format - Format (full, initials, last_first)
 * @returns {string} Nom formaté
 */
export const formatName = (firstName, lastName, format = 'full') => {
  if (!firstName && !lastName) return '';
  
  if (format === 'full') {
    return `${firstName || ''} ${lastName || ''}`.trim();
  }
  
  if (format === 'initials') {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }
  
  if (format === 'last_first') {
    return `${lastName || ''}, ${firstName || ''}`.trim().replace(/,\s*$/, '');
  }
  
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// ===================================================================
// FORMATAGE LABELS
// ===================================================================

/**
 * Obtient le nom d'affichage d'une banque
 * @param {string} bankCode - Code banque
 * @returns {string} Nom de la banque
 */
export const getBankLabel = (bankCode) => {
  return HAITI_BANKS[bankCode]?.name || bankCode;
};

/**
 * Obtient le nom d'affichage d'un type de compte
 * @param {string} accountType - Type de compte
 * @returns {string} Nom du type
 */
export const getAccountTypeLabel = (accountType) => {
  return ACCOUNT_TYPES[accountType]?.name || accountType;
};

/**
 * Obtient le nom d'affichage d'une catégorie
 * @param {string} categoryCode - Code catégorie
 * @returns {string} Nom de la catégorie
 */
export const getCategoryLabel = (categoryCode) => {
  return TRANSACTION_CATEGORIES[categoryCode]?.name || categoryCode;
};

/**
 * Obtient le symbole d'une devise
 * @param {string} currencyCode - Code devise
 * @returns {string} Symbole
 */
export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || currencyCode;
};

// ===================================================================
// FORMATAGE TEXTE
// ===================================================================

/**
 * Tronque un texte
 * @param {string} text - Texte
 * @param {number} length - Longueur max
 * @param {string} suffix - Suffixe (défaut: '...')
 * @returns {string} Texte tronqué
 */
export const truncate = (text, length, suffix = '...') => {
  if (!text || text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
};

/**
 * Capitalise la première lettre
 * @param {string} text - Texte
 * @returns {string} Texte capitalisé
 */
export const capitalize = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalise chaque mot
 * @param {string} text - Texte
 * @returns {string} Texte avec chaque mot capitalisé
 */
export const titleCase = (text) => {
  if (!text) return text;
  return text.split(' ').map(word => capitalize(word)).join(' ');
};

/**
 * Convertit en slug (URL-friendly)
 * @param {string} text - Texte
 * @returns {string} Slug
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// ===================================================================
// CONVERSIONS DEVISES
// ===================================================================

/**
 * Convertit HTG vers USD
 * @param {number} amount - Montant en HTG
 * @param {number} exchangeRate - Taux de change
 * @returns {number} Montant en USD
 */
export const convertHTGtoUSD = (amount, exchangeRate = 130) => {
  return Math.round((amount / exchangeRate) * 100) / 100;
};

/**
 * Convertit USD vers HTG
 * @param {number} amount - Montant en USD
 * @param {number} exchangeRate - Taux de change
 * @returns {number} Montant en HTG
 */
export const convertUSDtoHTG = (amount, exchangeRate = 130) => {
  return Math.round((amount * exchangeRate) * 100) / 100;
};

/**
 * Convertit un montant entre devises
 * @param {number} amount - Montant
 * @param {string} from - Devise source
 * @param {string} to - Devise cible
 * @param {number} exchangeRate - Taux de change
 * @returns {number} Montant converti
 */
export const convertCurrency = (amount, from, to, exchangeRate = 130) => {
  if (from === to) return amount;
  
  if (from === 'HTG' && to === 'USD') {
    return convertHTGtoUSD(amount, exchangeRate);
  }
  
  if (from === 'USD' && to === 'HTG') {
    return convertUSDtoHTG(amount, exchangeRate);
  }
  
  return amount;
};