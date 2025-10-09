/**
 * =========================================================
 * FinApp Haiti - Error Handler Service
 * Gestionnaire centralisé des erreurs API Frontend
 * ✅ Synchronisé avec backend errorHandler.js
 * ✅ Intégré avec MDSnackbar et Redux
 * =========================================================
 */

import { store } from 'store';
import { showNotification } from 'store/slices/uiSlice';
import { logout } from 'store/slices/authSlice';
import { 
  HttpStatusCode, 
  ApiErrorMessages,
  isNetworkError,
  isAuthError,
  isValidationError
} from 'types/api.types';

// ===================================================================
// CONFIGURATION
// ===================================================================

const ERROR_CONFIG = {
  // Afficher notifications automatiquement
  AUTO_NOTIFY: true,
  
  // Logger en console (dev uniquement)
  LOG_ERRORS: process.env.NODE_ENV === 'development',
  
  // Rediriger vers login sur 401
  AUTO_REDIRECT_ON_AUTH_ERROR: true,
  
  // Durée affichage notifications (ms)
  NOTIFICATION_DURATION: 6000,
  
  // Retry automatique pour erreurs réseau
  ENABLE_RETRY: false, // À implémenter plus tard avec apiHelpers.js
};

// ===================================================================
// LOGGER UTILITAIRE
// ===================================================================

/**
 * Logger une erreur en développement
 * @private
 */
const logError = (context, error, details = {}) => {
  if (!ERROR_CONFIG.LOG_ERRORS) return;
  
  console.group(`❌ ERROR: ${context}`);
  console.error('Message:', error.message);
  console.error('Status:', error.response?.status);
  console.error('Data:', error.response?.data);
  console.error('Details:', details);
  console.error('Full Error:', error);
  console.groupEnd();
};

/**
 * Logger un warning en développement
 * @private
 */
const logWarning = (context, message, data = {}) => {
  if (!ERROR_CONFIG.LOG_ERRORS) return;
  
  console.group(`⚠️ WARNING: ${context}`);
  console.warn('Message:', message);
  console.warn('Data:', data);
  console.groupEnd();
};

// ===================================================================
// EXTRACTION DONNÉES ERREUR
// ===================================================================

/**
 * Extraire le message d'erreur principal
 * @param {Error} error - Erreur Axios
 * @returns {string} - Message lisible
 */
const extractErrorMessage = (error) => {
  // 1. Erreur réseau (pas de réponse serveur)
  if (isNetworkError(error)) {
    return ApiErrorMessages.NETWORK_ERROR;
  }
  
  // 2. Message custom du backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // 3. Messages par code HTTP
  const status = error.response?.status;
  
  switch (status) {
    case HttpStatusCode.BAD_REQUEST:
      return ApiErrorMessages.VALIDATION_ERROR;
      
    case HttpStatusCode.UNAUTHORIZED:
      return ApiErrorMessages.UNAUTHORIZED;
      
    case HttpStatusCode.FORBIDDEN:
      return ApiErrorMessages.FORBIDDEN;
      
    case HttpStatusCode.NOT_FOUND:
      return ApiErrorMessages.NOT_FOUND;
      
    case HttpStatusCode.CONFLICT:
      return error.response?.data?.message || 'Conflit détecté (donnée dupliquée)';
      
    case HttpStatusCode.UNPROCESSABLE_ENTITY:
      return ApiErrorMessages.VALIDATION_ERROR;
      
    case HttpStatusCode.TOO_MANY_REQUESTS:
      const retryAfter = error.response?.data?.retryAfter || '15 minutes';
      return `Trop de requêtes. Réessayez dans ${retryAfter}.`;
      
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return ApiErrorMessages.SERVER_ERROR;
      
    case HttpStatusCode.SERVICE_UNAVAILABLE:
      return 'Service temporairement indisponible. Réessayez dans quelques instants.';
      
    default:
      return error.message || ApiErrorMessages.UNKNOWN_ERROR;
  }
};

/**
 * Extraire le code d'erreur backend
 * @param {Error} error - Erreur Axios
 * @returns {string|null} - Code erreur ou null
 */
const extractErrorCode = (error) => {
  return error.response?.data?.error || null;
};

/**
 * Extraire les détails de validation
 * @param {Error} error - Erreur Axios
 * @returns {Array} - Tableau d'erreurs de validation
 * 
 * Format backend:
 * {
 *   error: {
 *     details: [
 *       { field: 'email', message: 'Email invalide' },
 *       { field: 'password', message: 'Trop court' }
 *     ]
 *   }
 * }
 */
const extractValidationErrors = (error) => {
  const details = error.response?.data?.error?.details;
  
  if (!details || !Array.isArray(details)) {
    return [];
  }
  
  return details.map(detail => ({
    field: detail.field || 'unknown',
    message: detail.message || 'Erreur de validation'
  }));
};

/**
 * Extraire un hint si disponible
 * @param {Error} error - Erreur Axios
 * @returns {string|null} - Hint ou null
 */
const extractHint = (error) => {
  return error.response?.data?.hint || null;
};

// ===================================================================
// FORMATAGE ERREUR
// ===================================================================

/**
 * Formater une erreur API en objet standardisé
 * @param {Error} error - Erreur Axios
 * @returns {Object} - Erreur formatée
 * 
 * Retourne:
 * {
 *   message: string,
 *   code: string|null,
 *   status: number|null,
 *   validationErrors: Array,
 *   hint: string|null,
 *   isNetwork: boolean,
 *   isAuth: boolean,
 *   isValidation: boolean,
 *   isServer: boolean,
 *   originalError: Error
 * }
 */
export const formatApiError = (error) => {
  const formatted = {
    message: extractErrorMessage(error),
    code: extractErrorCode(error),
    status: error.response?.status || null,
    validationErrors: extractValidationErrors(error),
    hint: extractHint(error),
    
    // Flags pour identification rapide
    isNetwork: isNetworkError(error),
    isAuth: isAuthError(error),
    isValidation: isValidationError(error),
    isServer: error.response?.status >= 500,
    isRateLimit: error.response?.status === HttpStatusCode.TOO_MANY_REQUESTS,
    
    // Erreur originale pour debug
    originalError: error
  };
  
  return formatted;
};

// ===================================================================
// NOTIFICATIONS UI
// ===================================================================

/**
 * Afficher une notification d'erreur via Redux
 * @param {string} message - Message à afficher
 * @param {Object} options - Options notification
 */
const showErrorNotification = (message, options = {}) => {
  if (!ERROR_CONFIG.AUTO_NOTIFY) return;
  
  store.dispatch(showNotification({
    message,
    type: 'error',
    duration: options.duration || ERROR_CONFIG.NOTIFICATION_DURATION,
    ...options
  }));
};

/**
 * Afficher une notification de succès via Redux
 * @param {string} message - Message à afficher
 * @param {Object} options - Options notification
 */
export const showSuccessNotification = (message, options = {}) => {
  store.dispatch(showNotification({
    message,
    type: 'success',
    duration: options.duration || ERROR_CONFIG.NOTIFICATION_DURATION,
    ...options
  }));
};

/**
 * Afficher une notification de warning via Redux
 * @param {string} message - Message à afficher
 * @param {Object} options - Options notification
 */
export const showWarningNotification = (message, options = {}) => {
  store.dispatch(showNotification({
    message,
    type: 'warning',
    duration: options.duration || ERROR_CONFIG.NOTIFICATION_DURATION,
    ...options
  }));
};

// ===================================================================
// HANDLERS SPÉCIALISÉS
// ===================================================================

/**
 * Gérer erreur d'authentification (401)
 * - Nettoyer tokens
 * - Dispatch logout Redux
 * - Rediriger vers login
 * @param {Object} formattedError - Erreur formatée
 */
const handleAuthError = (formattedError) => {
  logWarning('Auth Error', formattedError.message, {
    code: formattedError.code,
    hint: formattedError.hint
  });
  
  // Nettoyer storage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // Dispatch logout Redux
  store.dispatch(logout());
  
  // Notification
  showErrorNotification(
    formattedError.message || 'Session expirée. Veuillez vous reconnecter.',
    { duration: 4000 }
  );
  
  // Redirection vers login (si activé)
  if (ERROR_CONFIG.AUTO_REDIRECT_ON_AUTH_ERROR) {
    // Attendre 500ms pour laisser la notification s'afficher
    setTimeout(() => {
      window.location.href = '/authentication/sign-in';
    }, 500);
  }
};

/**
 * Gérer erreur de validation (400/422)
 * @param {Object} formattedError - Erreur formatée
 * @returns {Object} - Erreurs formatées pour formulaires
 */
const handleValidationError = (formattedError) => {
  logError('Validation Error', formattedError.originalError, {
    validationErrors: formattedError.validationErrors
  });
  
  // Notification principale
  showErrorNotification(formattedError.message);
  
  // Retourner erreurs pour affichage inline dans formulaires
  return {
    message: formattedError.message,
    fieldErrors: formattedError.validationErrors.reduce((acc, err) => {
      acc[err.field] = err.message;
      return acc;
    }, {})
  };
};

/**
 * Gérer erreur réseau (pas d'internet)
 * @param {Object} formattedError - Erreur formatée
 */
const handleNetworkError = (formattedError) => {
  logError('Network Error', formattedError.originalError);
  
  showErrorNotification(
    'Pas de connexion internet. Vérifiez votre connexion.',
    { duration: 8000 }
  );
};

/**
 * Gérer erreur serveur (500+)
 * @param {Object} formattedError - Erreur formatée
 */
const handleServerError = (formattedError) => {
  logError('Server Error', formattedError.originalError, {
    status: formattedError.status,
    code: formattedError.code
  });
  
  showErrorNotification(
    formattedError.message || 'Erreur serveur. Veuillez réessayer plus tard.',
    { duration: 8000 }
  );
};

/**
 * Gérer erreur de rate limiting (429)
 * @param {Object} formattedError - Erreur formatée
 */
const handleRateLimitError = (formattedError) => {
  logWarning('Rate Limit', formattedError.message, {
    hint: formattedError.hint
  });
  
  showErrorNotification(
    formattedError.message,
    { duration: 10000 }
  );
};

/**
 * Gérer erreur 404 Not Found
 * @param {Object} formattedError - Erreur formatée
 */
const handleNotFoundError = (formattedError) => {
  logWarning('Not Found', formattedError.message);
  
  showErrorNotification(
    formattedError.message || 'Ressource non trouvée.',
    { duration: 5000 }
  );
};

/**
 * Gérer erreur 409 Conflict (duplication)
 * @param {Object} formattedError - Erreur formatée
 */
const handleConflictError = (formattedError) => {
  logWarning('Conflict', formattedError.message);
  
  showErrorNotification(
    formattedError.message || 'Cette donnée existe déjà.',
    { duration: 6000 }
  );
};

// ===================================================================
// HANDLER PRINCIPAL
// ===================================================================

/**
 * Gestionnaire principal d'erreurs API
 * Point d'entrée unique pour toutes les erreurs
 * 
 * @param {Error} error - Erreur Axios
 * @param {Object} options - Options de gestion
 * @param {boolean} options.notify - Afficher notification (défaut: true)
 * @param {boolean} options.rethrow - Re-throw l'erreur après traitement (défaut: false)
 * @param {string} options.context - Contexte pour logging
 * @returns {Object} - Erreur formatée
 * 
 * Usage:
 * ```javascript
 * try {
 *   await accountsService.createAccount(data);
 * } catch (error) {
 *   const formattedError = handleApiError(error, {
 *     context: 'Create Account',
 *     notify: true
 *   });
 *   // Faire quelque chose avec formattedError si nécessaire
 * }
 * ```
 */
export const handleApiError = (error, options = {}) => {
  const {
    notify = true,
    rethrow = false,
    context = 'API Call'
  } = options;
  
  // 1. Formater l'erreur
  const formattedError = formatApiError(error);
  
  // 2. Logger si activé
  if (ERROR_CONFIG.LOG_ERRORS) {
    logError(context, error, {
      formatted: formattedError,
      options
    });
  }
  
  // 3. Router vers handler spécialisé
  if (formattedError.isAuth) {
    handleAuthError(formattedError);
  } else if (formattedError.isNetwork) {
    handleNetworkError(formattedError);
  } else if (formattedError.isValidation) {
    return handleValidationError(formattedError);
  } else if (formattedError.isServer) {
    handleServerError(formattedError);
  } else if (formattedError.isRateLimit) {
    handleRateLimitError(formattedError);
  } else if (formattedError.status === HttpStatusCode.NOT_FOUND) {
    handleNotFoundError(formattedError);
  } else if (formattedError.status === HttpStatusCode.CONFLICT) {
    handleConflictError(formattedError);
  } else {
    // Erreur générique
    if (notify) {
      showErrorNotification(formattedError.message);
    }
  }
  
  // 4. Re-throw si demandé
  if (rethrow) {
    throw error;
  }
  
  // 5. Retourner erreur formatée
  return formattedError;
};

// ===================================================================
// EXPORTS UTILITAIRES
// ===================================================================

/**
 * Wrapper pour Redux Thunks
 * Simplifie la gestion d'erreurs dans les thunks
 * 
 * Usage dans un slice:
 * ```javascript
 * export const createAccountAsync = createAsyncThunk(
 *   'accounts/create',
 *   async (data, { rejectWithValue }) => {
 *     try {
 *       const response = await accountsService.createAccount(data);
 *       return response.data;
 *     } catch (error) {
 *       return handleThunkError(error, rejectWithValue, {
 *         context: 'Create Account'
 *       });
 *     }
 *   }
 * );
 * ```
 */
export const handleThunkError = (error, rejectWithValue, options = {}) => {
  const formattedError = handleApiError(error, {
    notify: true,
    ...options
  });
  
  return rejectWithValue({
    message: formattedError.message,
    code: formattedError.code,
    validationErrors: formattedError.validationErrors
  });
};

/**
 * Configuration du error handler
 * Permet de modifier le comportement global
 */
export const configureErrorHandler = (config = {}) => {
  Object.assign(ERROR_CONFIG, config);
};

// ===================================================================
// EXPORTS PAR DÉFAUT
// ===================================================================

export default {
  handleApiError,
  handleThunkError,
  formatApiError,
  showSuccessNotification,
  showWarningNotification,
  configureErrorHandler
};