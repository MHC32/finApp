// ===================================================================
// API TYPES - FinApp Haiti
// Types pour les réponses API et communication Frontend-Backend
// ===================================================================

/**
 * Types de réponses API
 */
export const ApiResponseType = {
  SUCCESS: 'success',
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error'
};

/**
 * Codes d'erreur HTTP courants
 */
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * @typedef {Object} ApiSuccessResponse
 * @property {boolean} success - Toujours true pour succès
 * @property {string} [message] - Message de succès optionnel
 * @property {*} data - Données retournées (type varie selon endpoint)
 */

/**
 * @typedef {Object} ValidationErrorDetail
 * @property {string} field - Champ concerné
 * @property {string} message - Message d'erreur
 * @property {*} [value] - Valeur invalide fournie
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {boolean} success - Toujours false pour erreur
 * @property {string} message - Message d'erreur principal
 * @property {Object} [error] - Détails de l'erreur
 * @property {string} [error.type] - Type d'erreur
 * @property {number} [error.code] - Code d'erreur
 * @property {ValidationErrorDetail[]} [error.details] - Détails validation (si applicable)
 * @property {string} [error.stack] - Stack trace (dev only)
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - Numéro de page (commence à 1)
 * @property {number} limit - Nombre d'items par page
 * @property {string} [sortBy] - Champ de tri
 * @property {('asc'|'desc')} [sortOrder] - Ordre de tri
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page - Page actuelle
 * @property {number} limit - Items par page
 * @property {number} total - Total d'items
 * @property {number} pages - Nombre total de pages
 * @property {boolean} hasNext - Page suivante disponible
 * @property {boolean} hasPrev - Page précédente disponible
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success - Succès
 * @property {Array} data - Données paginées
 * @property {PaginationMeta} pagination - Métadonnées pagination
 */

/**
 * @typedef {Object} FilterParams
 * @property {Date} [startDate] - Date de début
 * @property {Date} [endDate] - Date de fin
 * @property {string} [status] - Filtre par statut
 * @property {string} [type] - Filtre par type
 * @property {string} [category] - Filtre par catégorie
 * @property {string} [search] - Recherche textuelle
 */

/**
 * Valeurs par défaut pour la pagination
 */
export const defaultPagination = {
  page: 1,
  limit: 20,
  sortOrder: 'desc'
};

/**
 * Limites de pagination
 */
export const paginationLimits = {
  minLimit: 1,
  maxLimit: 100,
  defaultLimit: 20
};

/**
 * Messages d'erreur standard
 */
export const ApiErrorMessages = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  TIMEOUT: 'La requête a expiré. Veuillez réessayer.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: 'Vous n\'avez pas accès à cette ressource.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Données invalides. Vérifiez vos informations.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite.'
};

/**
 * Helper: Créer une réponse de succès standardisée
 */
export const createSuccessResponse = (data, message = null) => {
  return {
    success: true,
    ...(message && { message }),
    data
  };
};

/**
 * Helper: Créer une réponse d'erreur standardisée
 */
export const createErrorResponse = (message, details = null) => {
  return {
    success: false,
    message,
    ...(details && { error: { details } })
  };
};

/**
 * Helper: Extraire le message d'erreur d'une réponse
 */
export const getErrorMessage = (error) => {
  // Erreur réseau
  if (!error.response) {
    return ApiErrorMessages.NETWORK_ERROR;
  }
  
  // Erreur avec réponse du serveur
  const { status, data } = error.response;
  
  // Message personnalisé du serveur
  if (data?.message) {
    return data.message;
  }
  
  // Messages par code HTTP
  switch (status) {
    case HttpStatusCode.UNAUTHORIZED:
      return ApiErrorMessages.UNAUTHORIZED;
    case HttpStatusCode.FORBIDDEN:
      return ApiErrorMessages.FORBIDDEN;
    case HttpStatusCode.NOT_FOUND:
      return ApiErrorMessages.NOT_FOUND;
    case HttpStatusCode.UNPROCESSABLE_ENTITY:
      return ApiErrorMessages.VALIDATION_ERROR;
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return ApiErrorMessages.SERVER_ERROR;
    default:
      return ApiErrorMessages.UNKNOWN_ERROR;
  }
};

/**
 * Helper: Extraire les détails de validation d'une erreur
 */
export const getValidationErrors = (error) => {
  if (!error.response?.data?.error?.details) {
    return [];
  }
  
  return error.response.data.error.details;
};

/**
 * Helper: Vérifier si une erreur est une erreur de validation
 */
export const isValidationError = (error) => {
  return error.response?.status === HttpStatusCode.UNPROCESSABLE_ENTITY;
};

/**
 * Helper: Vérifier si une erreur est une erreur d'authentification
 */
export const isAuthError = (error) => {
  return error.response?.status === HttpStatusCode.UNAUTHORIZED;
};

/**
 * Helper: Vérifier si une erreur est une erreur réseau
 */
export const isNetworkError = (error) => {
  return !error.response;
};

/**
 * Helper: Calculer les métadonnées de pagination
 */
export const calculatePaginationMeta = (page, limit, total) => {
  const pages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1
  };
};

/**
 * Helper: Valider les paramètres de pagination
 */
export const validatePaginationParams = (params) => {
  const validated = { ...params };
  
  // Valider page
  validated.page = Math.max(1, parseInt(params.page) || 1);
  
  // Valider limit
  const limit = parseInt(params.limit) || paginationLimits.defaultLimit;
  validated.limit = Math.min(
    Math.max(paginationLimits.minLimit, limit),
    paginationLimits.maxLimit
  );
  
  // Valider sortOrder
  if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
    validated.sortOrder = 'desc';
  }
  
  return validated;
};

/**
 * Helper: Construire query string pour filtres
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      // Gérer les dates
      if (value instanceof Date) {
        query.append(key, value.toISOString());
      } 
      // Gérer les tableaux
      else if (Array.isArray(value)) {
        value.forEach(v => query.append(key, v));
      }
      // Gérer les autres valeurs
      else {
        query.append(key, value);
      }
    }
  });
  
  return query.toString();
};

/**
 * Helper: Parser les dates dans une réponse API
 */
export const parseDates = (obj, dateFields = ['createdAt', 'updatedAt', 'date']) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const parsed = Array.isArray(obj) ? [...obj] : { ...obj };
  
  Object.keys(parsed).forEach(key => {
    const value = parsed[key];
    
    // Parser les dates
    if (dateFields.includes(key) && typeof value === 'string') {
      parsed[key] = new Date(value);
    }
    // Récursif pour les objets imbriqués
    else if (value && typeof value === 'object') {
      parsed[key] = parseDates(value, dateFields);
    }
  });
  
  return parsed;
};

/**
 * Helper: Formater les données pour envoi API
 */
export const formatForApi = (data) => {
  const formatted = { ...data };
  
  Object.keys(formatted).forEach(key => {
    const value = formatted[key];
    
    // Convertir les dates en ISO string
    if (value instanceof Date) {
      formatted[key] = value.toISOString();
    }
    // Supprimer les valeurs undefined
    else if (value === undefined) {
      delete formatted[key];
    }
    // Convertir null en undefined pour être supprimé
    else if (value === null) {
      delete formatted[key];
    }
  });
  
  return formatted;
};

// Export par défaut de tous les types API
export default {
  ApiResponseType,
  HttpStatusCode,
  ApiErrorMessages,
  defaultPagination,
  paginationLimits,
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
  getValidationErrors,
  isValidationError,
  isAuthError,
  isNetworkError,
  calculatePaginationMeta,
  validatePaginationParams,
  buildQueryString,
  parseDates,
  formatForApi
};