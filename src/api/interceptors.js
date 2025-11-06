// src/api/interceptors.js
import axios from 'axios';
import api from './axios';
import store from '../store';
import { logout, setTokens } from '../store/slices/authSlice';

// ===================================================================
// CONFIGURATION
// ===================================================================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// ===================================================================
// GESTION QUEUE REQUÊTES (pour refresh token)
// ===================================================================

let isRefreshing = false;
let failedQueue = [];

/**
 * Traiter la queue de requêtes en attente
 * @param {Error} error - Erreur éventuelle
 * @param {string} token - Nouveau token si succès
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ===================================================================
// REQUEST INTERCEPTOR - Ajouter le token à chaque requête
// ===================================================================

api.interceptors.request.use(
  (config) => {
    // DEBUG: Afficher les détails de la requête
    console.log('🚀 REQUÊTE INTERCEPTÉE:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers
    });

    // Récupérer le token depuis le store Redux
    const state = store.getState();
    const token = state.auth.token;

    // Si token existe, l'ajouter dans les headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token ajouté aux headers');
    } else {
      console.log('🔐 Aucun token trouvé dans le store');
    }

    return config;
  },
  (error) => {
    console.error('❌ ERREUR REQUEST INTERCEPTOR:', error);
    return Promise.reject(error);
  }
);

// ===================================================================
// RESPONSE INTERCEPTOR - Gestion erreurs + refresh automatique
// ===================================================================

api.interceptors.response.use(
  // Succès : retourner la réponse telle quelle
  (response) => {
    console.log('✅ RÉPONSE REÇUE:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },

  // Erreur : gérer 401 et refresh token
  async (error) => {
    console.error('❌ ERREUR API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data
    });

    const originalRequest = error.config;

    // Si erreur 401 (Unauthorized) et on n'a pas déjà retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔐 Erreur 401 détectée - Tentative de refresh token...');

      // Si déjà en train de refresh, mettre en queue
      if (isRefreshing) {
        console.log('⏳ Refresh déjà en cours - Mise en queue de la requête');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Marquer qu'on va retry cette requête
      originalRequest._retry = true;
      isRefreshing = true;

      // Récupérer le refresh token
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      // Si pas de refresh token, déconnecter
      if (!refreshToken) {
        console.log('❌ Aucun refresh token disponible - Déconnexion');
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        console.log('🔄 Tentative de refresh token...', { refreshToken: refreshToken.substring(0, 10) + '...' });

        // ✅ CORRECTION : Utiliser BASE_URL directement au lieu de api.defaults.baseURL
        // pour éviter les problèmes d'import circulaire
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        console.log('✅ Refresh token réussi:', response.data);

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

        // Mettre à jour les tokens dans Redux
        store.dispatch(setTokens({
          token: accessToken,
          refreshToken: newRefreshToken,
          expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
        }));;

        // Traiter la queue avec le nouveau token
        processQueue(null, accessToken);

        // Retry la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log('🔄 Retry de la requête originale avec le nouveau token');
        return api(originalRequest);

      } catch (refreshError) {
        console.error('❌ Échec du refresh token:', refreshError);

        // Refresh a échoué, traiter la queue avec erreur
        processQueue(refreshError, null);

        // Déconnecter l'utilisateur
        console.log('🚪 Déconnexion de l\'utilisateur suite à l\'échec du refresh');
        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Pour toutes les autres erreurs, rejeter normalement
    console.log('📨 Rejet de l\'erreur (non-401 ou déjà retry)');
    return Promise.reject(error);
  }
);

// ===================================================================
// HELPERS POUR REQUÊTES AVEC GESTION D'ERREUR AMÉLIORÉE
// ===================================================================

/**
 * Helper GET avec gestion d'erreur simplifiée
 */
export const get = async (url, config = {}) => {
  try {
    console.log(`📨 GET ${url}`, config);
    const response = await api.get(url, config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ ERREUR GET ${url}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erreur réseau',
      status: error.response?.status,
      code: error.code
    };
  }
};

/**
 * Helper POST avec gestion d'erreur simplifiée
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    console.log(`📨 POST ${url}`, { data, config });
    const response = await api.post(url, data, config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ ERREUR POST ${url}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erreur réseau',
      status: error.response?.status,
      code: error.code
    };
  }
};

/**
 * Helper PUT avec gestion d'erreur simplifiée
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    console.log(`📨 PUT ${url}`, { data, config });
    const response = await api.put(url, data, config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ ERREUR PUT ${url}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erreur réseau',
      status: error.response?.status,
      code: error.code
    };
  }
};

/**
 * Helper DELETE avec gestion d'erreur simplifiée
 */
export const del = async (url, config = {}) => {
  try {
    console.log(`📨 DELETE ${url}`, config);
    const response = await api.delete(url, config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ ERREUR DELETE ${url}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erreur réseau',
      status: error.response?.status,
      code: error.code
    };
  }
};

/**
 * Helper PATCH avec gestion d'erreur simplifiée
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    console.log(`📨 PATCH ${url}`, { data, config });
    const response = await api.patch(url, data, config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ ERREUR PATCH ${url}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erreur réseau',
      status: error.response?.status,
      code: error.code
    };
  }
};

// ===================================================================
// FONCTION DE TEST DE CONNEXION
// ===================================================================

/**
 * Fonction de test pour diagnostiquer les problèmes de connexion
 */
export const testConnection = async (credentials = null) => {
  try {
    console.log('🧪 TEST DE CONNEXION DÉMARRÉ...');

    const testCredentials = credentials || {
      email: "test@example.com",
      password: "testpassword"
    };

    console.log('📤 Envoi des credentials:', {
      email: testCredentials.email,
      password: '***'
    });

    const response = await api.post('/auth/login', testCredentials);

    console.log('✅ TEST RÉUSSI - Réponse serveur:', {
      status: response.status,
      data: response.data
    });

    return {
      success: true,
      data: response.data,
      status: response.status
    };

  } catch (error) {
    console.error('❌ TEST ÉCHOUÉ - Erreur complète:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });

    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.code
    };
  }
};

// ===================================================================
// EXPORT
// ===================================================================

export default api;