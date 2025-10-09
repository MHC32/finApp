/**
 * =========================================================
 * FinApp Haiti - API Helpers
 * Utilitaires pour communication API et gestion erreurs
 * ✅ Retry logic, logging, formatage
 * =========================================================
 */

import axios from 'axios';
import { 
  HttpStatusCode,
  isNetworkError as apiTypesIsNetworkError,
  isAuthError as apiTypesIsAuthError,
  isValidationError as apiTypesIsValidationError
} from 'types/api.types';

// ===================================================================
// CONFIGURATION
// ===================================================================

const CONFIG = {
  // Retry automatique
  RETRY: {
    ENABLED: true,
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000, // 1 seconde
    MAX_DELAY: 10000, // 10 secondes
    EXPONENTIAL_BACKOFF: true
  },
  
  // Logging
  LOGGING: {
    ENABLED: process.env.NODE_ENV === 'development',
    LOG_REQUESTS: true,
    LOG_RESPONSES: true,
    LOG_ERRORS: true,
    VERBOSE: false // Afficher headers, config, etc.
  },
  
  // Timeout
  DEFAULT_TIMEOUT: 30000 // 30 secondes
};

// ===================================================================
// DÉTECTION TYPE ERREUR
// ===================================================================

/**
 * Vérifier si erreur réseau (pas de réponse serveur)
 */
export const isNetworkError = (error) => {
  return apiTypesIsNetworkError(error);
};

/**
 * Vérifier si erreur d'authentification (401)
 */
export const isAuthError = (error) => {
  return apiTypesIsAuthError(error);
};

/**
 * Vérifier si erreur de validation (400/422)
 */
export const isValidationError = (error) => {
  return apiTypesIsValidationError(error);
};

/**
 * Vérifier si erreur serveur (500+)
 */
export const isServerError = (error) => {
  return error.response?.status >= 500;
};

/**
 * Vérifier si erreur de timeout
 */
export const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
};

/**
 * Vérifier si erreur de rate limiting (429)
 */
export const isRateLimitError = (error) => {
  return error.response?.status === HttpStatusCode.TOO_MANY_REQUESTS;
};

/**
 * Vérifier si erreur 404
 */
export const isNotFoundError = (error) => {
  return error.response?.status === HttpStatusCode.NOT_FOUND;
};

/**
 * Vérifier si erreur 403 (Forbidden)
 */
export const isForbiddenError = (error) => {
  return error.response?.status === HttpStatusCode.FORBIDDEN;
};

/**
 * Vérifier si erreur 409 (Conflict - duplication)
 */
export const isConflictError = (error) => {
  return error.response?.status === HttpStatusCode.CONFLICT;
};

// ===================================================================
// EXTRACTION DONNÉES ERREUR
// ===================================================================

/**
 * Extraire message d'erreur principal
 */
export const extractErrorMessage = (error) => {
  // Réseau
  if (isNetworkError(error)) {
    return 'Pas de connexion internet. Vérifiez votre connexion.';
  }
  
  // Timeout
  if (isTimeoutError(error)) {
    return 'La requête a expiré. Veuillez réessayer.';
  }
  
  // Message backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Message par défaut
  return error.message || 'Une erreur inattendue est survenue';
};

/**
 * Extraire code d'erreur backend
 */
export const extractErrorCode = (error) => {
  return error.response?.data?.error || 
         error.response?.data?.code || 
         error.code || 
         null;
};

/**
 * Extraire détails validation
 */
export const extractValidationErrors = (error) => {
  const details = error.response?.data?.error?.details;
  
  if (!details || !Array.isArray(details)) {
    return [];
  }
  
  return details;
};

/**
 * Extraire hint/suggestion du backend
 */
export const extractHint = (error) => {
  return error.response?.data?.hint || null;
};

/**
 * Extraire retry-after header (rate limiting)
 */
export const extractRetryAfter = (error) => {
  return error.response?.headers?.['retry-after'] || 
         error.response?.data?.retryAfter || 
         null;
};

// ===================================================================
// FORMATAGE DONNÉES
// ===================================================================

/**
 * Formater erreur validation pour affichage formulaire
 * @returns {Object} - { fieldName: errorMessage }
 */
export const formatValidationErrors = (validationErrors) => {
  if (!Array.isArray(validationErrors)) {
    return {};
  }
  
  return validationErrors.reduce((acc, error) => {
    if (error.field) {
      acc[error.field] = error.message;
    }
    return acc;
  }, {});
};

/**
 * Formater réponse API pour consistance
 */
export const formatApiResponse = (response) => {
  // Si baseClient.js retourne déjà response.data
  if (response.success !== undefined) {
    return response;
  }
  
  // Sinon wrapper
  return {
    success: true,
    data: response.data || response,
    message: response.message || null
  };
};

// ===================================================================
// RETRY LOGIC
// ===================================================================

/**
 * Déterminer si une erreur doit être retried
 */
export const shouldRetry = (error, attemptNumber) => {
  // Désactivé globalement
  if (!CONFIG.RETRY.ENABLED) {
    return false;
  }
  
  // Max attempts atteint
  if (attemptNumber >= CONFIG.RETRY.MAX_ATTEMPTS) {
    return false;
  }
  
  // Ne JAMAIS retry ces erreurs
  if (
    isAuthError(error) ||          // 401
    isValidationError(error) ||    // 400/422
    isForbiddenError(error) ||     // 403
    isNotFoundError(error) ||      // 404
    isConflictError(error) ||      // 409
    isRateLimitError(error)        // 429 (géré séparément)
  ) {
    return false;
  }
  
  // Retry ces erreurs
  return (
    isNetworkError(error) ||       // Pas de connexion
    isTimeoutError(error) ||       // Timeout
    isServerError(error)           // 500+
  );
};

/**
 * Calculer délai avant retry (exponential backoff)
 */
export const getRetryDelay = (attemptNumber) => {
  const { BASE_DELAY, MAX_DELAY, EXPONENTIAL_BACKOFF } = CONFIG.RETRY;
  
  if (!EXPONENTIAL_BACKOFF) {
    return BASE_DELAY;
  }
  
  // Exponential backoff: 1s, 2s, 4s, 8s...
  const delay = BASE_DELAY * Math.pow(2, attemptNumber - 1);
  
  // Ajouter jitter (±25%) pour éviter thundering herd
  const jitter = delay * 0.25 * (Math.random() - 0.5);
  
  return Math.min(delay + jitter, MAX_DELAY);
};

/**
 * Exécuter requête avec retry automatique
 * @param {Function} requestFn - Fonction retournant une Promise
 * @param {Object} options - Options retry
 * @returns {Promise}
 */
export const retryRequest = async (requestFn, options = {}) => {
  const {
    maxAttempts = CONFIG.RETRY.MAX_ATTEMPTS,
    onRetry = null // Callback appelé avant chaque retry
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await requestFn();
      
      // Succès
      if (attempt > 1 && CONFIG.LOGGING.ENABLED) {
        console.log(`✅ Requête réussie après ${attempt} tentatives`);
      }
      
      return result;
      
    } catch (error) {
      lastError = error;
      
      // Vérifier si on doit retry
      if (!shouldRetry(error, attempt)) {
        throw error;
      }
      
      // Dernier attempt, ne pas attendre
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Calculer délai
      const delay = getRetryDelay(attempt);
      
      // Log retry
      if (CONFIG.LOGGING.ENABLED) {
        console.warn(`⚠️ Retry ${attempt}/${maxAttempts} dans ${Math.round(delay)}ms`, {
          error: extractErrorMessage(error),
          code: extractErrorCode(error)
        });
      }
      
      // Callback avant retry
      if (onRetry) {
        onRetry(attempt, delay, error);
      }
      
      // Attendre avant retry
      await sleep(delay);
    }
  }
  
  // Si on arrive ici, toutes tentatives ont échoué
  throw lastError;
};

/**
 * Sleep helper pour retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ===================================================================
// LOGGING
// ===================================================================

/**
 * Logger une requête HTTP (dev only)
 */
export const logRequest = (config) => {
  if (!CONFIG.LOGGING.ENABLED || !CONFIG.LOGGING.LOG_REQUESTS) {
    return;
  }
  
  const method = config.method?.toUpperCase() || 'GET';
  const url = config.url || config.baseURL;
  const hasData = !!config.data;
  const hasParams = !!config.params;
  
  console.group(`📤 ${method} ${url}`);
  
  if (hasData) {
    console.log('Body:', config.data);
  }
  
  if (hasParams) {
    console.log('Params:', config.params);
  }
  
  if (CONFIG.LOGGING.VERBOSE) {
    console.log('Headers:', config.headers);
    console.log('Config:', config);
  }
  
  console.groupEnd();
};

/**
 * Logger une réponse HTTP (dev only)
 */
export const logResponse = (response) => {
  if (!CONFIG.LOGGING.ENABLED || !CONFIG.LOGGING.LOG_RESPONSES) {
    return;
  }
  
  const method = response.config?.method?.toUpperCase() || 'GET';
  const url = response.config?.url || 'unknown';
  const status = response.status;
  const statusText = response.statusText;
  
  console.group(`✅ ${method} ${url} - ${status} ${statusText}`);
  console.log('Data:', response.data);
  
  if (CONFIG.LOGGING.VERBOSE) {
    console.log('Headers:', response.headers);
    console.log('Response:', response);
  }
  
  console.groupEnd();
};

/**
 * Logger une erreur HTTP (dev only)
 */
export const logError = (error) => {
  if (!CONFIG.LOGGING.ENABLED || !CONFIG.LOGGING.LOG_ERRORS) {
    return;
  }
  
  const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
  const url = error.config?.url || 'unknown';
  const status = error.response?.status || 'N/A';
  
  console.group(`❌ ${method} ${url} - ${status}`);
  console.error('Message:', extractErrorMessage(error));
  console.error('Code:', extractErrorCode(error));
  
  if (error.response) {
    console.error('Response Data:', error.response.data);
  }
  
  if (CONFIG.LOGGING.VERBOSE) {
    console.error('Full Error:', error);
    console.error('Stack:', error.stack);
  }
  
  console.groupEnd();
};

// ===================================================================
// UTILITAIRES REQUÊTES
// ===================================================================

/**
 * Créer headers avec token JWT
 */
export const createAuthHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const jwtToken = token || localStorage.getItem('token');
  
  if (jwtToken) {
    headers.Authorization = `Bearer ${jwtToken}`;
  }
  
  return headers;
};

/**
 * Créer config requête avec timeout
 */
export const createRequestConfig = (options = {}) => {
  const {
    timeout = CONFIG.DEFAULT_TIMEOUT,
    headers = {},
    ...rest
  } = options;
  
  return {
    timeout,
    headers: {
      ...createAuthHeaders(),
      ...headers
    },
    ...rest
  };
};

/**
 * Vérifier si réponse API est valide
 */
export const isValidApiResponse = (response) => {
  return (
    response &&
    typeof response === 'object' &&
    response.success !== undefined
  );
};

/**
 * Vérifier si réponse API est un succès
 */
export const isSuccessResponse = (response) => {
  return isValidApiResponse(response) && response.success === true;
};

// ===================================================================
// UTILITAIRES VALIDATION
// ===================================================================

/**
 * Valider email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider téléphone haïtien
 */
export const isValidHaitianPhone = (phone) => {
  // Formats acceptés:
  // +50937123456
  // 50937123456
  // 37123456
  const cleanPhone = phone.replace(/\s+/g, '');
  const phoneRegex = /^(\+?509)?[3-4]\d{7}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Normaliser numéro téléphone haïtien
 */
export const normalizeHaitianPhone = (phone) => {
  let cleaned = phone.replace(/\s+/g, '');
  
  // Ajouter 509 si manquant
  if (cleaned.length === 8 && /^[3-4]\d{7}$/.test(cleaned)) {
    cleaned = '509' + cleaned;
  }
  
  // Ajouter + si manquant
  if (cleaned.startsWith('509') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// ===================================================================
// CONFIGURATION
// ===================================================================

/**
 * Configurer les helpers (modifier comportement global)
 */
export const configureApiHelpers = (config = {}) => {
  if (config.retry) {
    Object.assign(CONFIG.RETRY, config.retry);
  }
  
  if (config.logging) {
    Object.assign(CONFIG.LOGGING, config.logging);
  }
  
  if (config.timeout !== undefined) {
    CONFIG.DEFAULT_TIMEOUT = config.timeout;
  }
};

/**
 * Obtenir config actuelle
 */
export const getConfig = () => {
  return { ...CONFIG };
};

// ===================================================================
// EXPORTS PAR DÉFAUT
// ===================================================================

export default {
  // Détection erreurs
  isNetworkError,
  isAuthError,
  isValidationError,
  isServerError,
  isTimeoutError,
  isRateLimitError,
  isNotFoundError,
  isForbiddenError,
  isConflictError,
  
  // Extraction données
  extractErrorMessage,
  extractErrorCode,
  extractValidationErrors,
  extractHint,
  extractRetryAfter,
  
  // Formatage
  formatValidationErrors,
  formatApiResponse,
  
  // Retry
  shouldRetry,
  getRetryDelay,
  retryRequest,
  
  // Logging
  logRequest,
  logResponse,
  logError,
  
  // Utilitaires
  createAuthHeaders,
  createRequestConfig,
  isValidApiResponse,
  isSuccessResponse,
  isValidEmail,
  isValidHaitianPhone,
  normalizeHaitianPhone,
  
  // Configuration
  configureApiHelpers,
  getConfig
};