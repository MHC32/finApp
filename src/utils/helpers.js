/**
 * Fonctions utilitaires - FinApp Haiti Frontend
 * Basé sur backend/src/utils/helpers.js
 */

// ===================================================================
// GÉNÉRATION ID & CODES
// ===================================================================

/**
 * Génère un ID unique
 * @param {string} prefix - Préfixe optionnel
 * @returns {string} ID unique
 */
export const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
};

/**
 * Génère un code numérique aléatoire
 * @param {number} length - Longueur (défaut: 6)
 * @returns {string} Code
 */
export const generateNumericCode = (length = 6) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

/**
 * Génère un code alphanumérique aléatoire
 * @param {number} length - Longueur (défaut: 8)
 * @returns {string} Code
 */
export const generateAlphanumericCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ===================================================================
// MANIPULATION OBJETS
// ===================================================================

/**
 * Nettoie un objet (retire clés undefined/null)
 * @param {object} obj - Objet
 * @returns {object} Objet nettoyé
 */
export const cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Vérifie si une valeur est un objet
 * @param {*} value - Valeur
 * @returns {boolean}
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Clone profond d'un objet
 * @param {*} obj - Objet
 * @returns {*} Clone
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key]);
  });
  return cloned;
};

/**
 * Fusionne profondément deux objets
 * @param {object} target - Objet cible
 * @param {object} source - Objet source
 * @returns {object} Objet fusionné
 */
export const deepMerge = (target, source) => {
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(target[key])) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  
  return result;
};

/**
 * Obtient une valeur nestée dans un objet
 * @param {object} obj - Objet
 * @param {string} path - Chemin (ex: 'user.profile.name')
 * @param {*} defaultValue - Valeur par défaut
 * @returns {*} Valeur
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    value = value[key];
  }
  
  return value !== undefined ? value : defaultValue;
};

/**
 * Définit une valeur nestée dans un objet
 * @param {object} obj - Objet
 * @param {string} path - Chemin
 * @param {*} value - Valeur
 * @returns {object} Objet modifié
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

// ===================================================================
// MANIPULATION TABLEAUX
// ===================================================================

/**
 * Retire les doublons d'un tableau
 * @param {array} arr - Tableau
 * @param {string} key - Clé pour objets
 * @returns {array} Tableau sans doublons
 */
export const removeDuplicates = (arr, key = null) => {
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Groupe un tableau par clé
 * @param {array} arr - Tableau
 * @param {string} key - Clé de groupement
 * @returns {object} Objet groupé
 */
export const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Trie un tableau d'objets
 * @param {array} arr - Tableau
 * @param {string} key - Clé de tri
 * @param {string} order - Ordre (asc, desc)
 * @returns {array} Tableau trié
 */
export const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Pagine un tableau
 * @param {array} arr - Tableau
 * @param {number} page - Page (1-based)
 * @param {number} limit - Éléments par page
 * @returns {object} { data, total, page, totalPages }
 */
export const paginate = (arr, page = 1, limit = 10) => {
  const total = arr.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = arr.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

// ===================================================================
// CALCULS FINANCIERS
// ===================================================================

/**
 * Arrondit un nombre
 * @param {number} number - Nombre
 * @param {number} decimals - Décimales (défaut: 2)
 * @returns {number} Nombre arrondi
 */
export const roundNumber = (number, decimals = 2) => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calcule un pourcentage
 * @param {number} partialAmount - Montant partiel
 * @param {number} totalAmount - Montant total
 * @returns {number} Pourcentage
 */
export const calculatePercentage = (partialAmount, totalAmount) => {
  if (totalAmount === 0) return 0;
  return roundNumber((partialAmount / totalAmount) * 100, 2);
};

/**
 * Calcule la variation en pourcentage
 * @param {number} oldValue - Ancienne valeur
 * @param {number} newValue - Nouvelle valeur
 * @returns {number} Variation en %
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return roundNumber(((newValue - oldValue) / oldValue) * 100, 2);
};

/**
 * Calcule la somme d'un tableau de nombres
 * @param {array} arr - Tableau de nombres
 * @param {string} key - Clé si tableau d'objets
 * @returns {number} Somme
 */
export const sum = (arr, key = null) => {
  if (!key) {
    return arr.reduce((total, num) => total + num, 0);
  }
  return arr.reduce((total, item) => total + (item[key] || 0), 0);
};

/**
 * Calcule la moyenne
 * @param {array} arr - Tableau de nombres
 * @param {string} key - Clé si tableau d'objets
 * @returns {number} Moyenne
 */
export const average = (arr, key = null) => {
  if (arr.length === 0) return 0;
  return roundNumber(sum(arr, key) / arr.length, 2);
};

// ===================================================================
// MANIPULATION DATES
// ===================================================================

/**
 * Vérifie si une date est valide
 * @param {*} date - Date
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Obtient le début de la journée
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Obtient la fin de la journée
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Ajoute des jours à une date
 * @param {Date|string} date - Date
 * @param {number} days - Nombre de jours
 * @returns {Date}
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Calcule la différence en jours entre deux dates
 * @param {Date|string} date1 - Date 1
 * @param {Date|string} date2 - Date 2
 * @returns {number} Nombre de jours
 */
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ===================================================================
// ASYNC HELPERS
// ===================================================================

/**
 * Attend un certain temps (Promise)
 * @param {number} ms - Millisecondes
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry avec backoff exponentiel
 * @param {function} fn - Fonction à retenter
 * @param {number} maxRetries - Nombre max de tentatives
 * @param {number} delay - Délai initial (ms)
 * @returns {Promise}
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
};

/**
 * Debounce une fonction
 * @param {function} func - Fonction
 * @param {number} wait - Temps d'attente (ms)
 * @returns {function} Fonction debouncée
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle une fonction
 * @param {function} func - Fonction
 * @param {number} limit - Limite (ms)
 * @returns {function} Fonction throttlée
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===================================================================
// STOCKAGE LOCAL
// ===================================================================

/**
 * Sauvegarde dans localStorage avec expiration
 * @param {string} key - Clé
 * @param {*} value - Valeur
 * @param {number} ttl - Time to live (ms)
 */
export const setLocalStorage = (key, value, ttl = null) => {
  const item = {
    value,
    timestamp: Date.now(),
    ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Lit depuis localStorage avec vérification expiration
 * @param {string} key - Clé
 * @returns {*} Valeur ou null
 */
export const getLocalStorage = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  try {
    const item = JSON.parse(itemStr);
    
    // Vérifier expiration
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch {
    return null;
  }
};

/**
 * Supprime de localStorage
 * @param {string} key - Clé
 */
export const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
};

/**
 * Nettoie les items expirés de localStorage
 */
// export const cleanExpiredLocalStorage = () => {
//   const keys = Object.keys(localStorage);
//   keys.forEach(key => {
//     const item = getLocalStorage(key);
//     // Si getLocalStorage retourne null, l'item était expiré et a été supprimé
//   });
// };

// ===================================================================
// COULEURS
// ===================================================================

/**
 * Convertit hex en RGB
 * @param {string} hex - Couleur hex
 * @returns {object} { r, g, b }
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Génère une couleur aléatoire
 * @returns {string} Couleur hex
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// ===================================================================
// RESPONSIVE
// ===================================================================

/**
 * Détecte si mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return window.innerWidth < 768;
};

/**
 * Détecte si tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Détecte si desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// ===================================================================
// ERREURS
// ===================================================================

/**
 * Formate une erreur API
 * @param {Error} error - Erreur
 * @returns {object} Erreur formatée
 */
export const formatError = (error) => {
  return {
    message: error.message || 'Une erreur est survenue',
    status: error.response?.status,
    data: error.response?.data,
    stack: error.stack
  };
};

/**
 * Extrait le message d'erreur
 * @param {Error} error - Erreur
 * @returns {string} Message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  return error?.response?.data?.message || error?.message || 'Une erreur est survenue';
};

// ===================================================================
// VALIDATIONS RAPIDES
// ===================================================================

/**
 * Vérifie si valeur vide
 * @param {*} value - Valeur
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Convertit en boolean
 * @param {*} value - Valeur
 * @returns {boolean}
 */
export const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
};