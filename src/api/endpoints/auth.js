// src/api/interceptors.js
import axios from 'axios';
import api from '../axios';
import store from '../../store/index';
import { logout, setTokens } from '../../store/slices/authSlice';

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
    // Récupérer le token depuis le store Redux
    const state = store.getState();
    const token = state.auth.token;
    
    // Si token existe, l'ajouter dans les headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===================================================================
// RESPONSE INTERCEPTOR - Gestion erreurs + refresh automatique
// ===================================================================

api.interceptors.response.use(
  // Succès : retourner la réponse telle quelle
  (response) => {
    return response;
  },
  
  // Erreur : gérer 401 et refresh token
  async (error) => {
    const originalRequest = error.config;
    
    // Si erreur 401 (Unauthorized) et on n'a pas déjà retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Si déjà en train de refresh, mettre en queue
      if (isRefreshing) {
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
        store.dispatch(logout());
        return Promise.reject(error);
      }
      
      try {
        // Tenter de refresh le token
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
        
        // Mettre à jour les tokens dans Redux
        store.dispatch(setTokens({ 
          token: accessToken, 
          refreshToken: newRefreshToken 
        }));
        
        // Traiter la queue avec le nouveau token
        processQueue(null, accessToken);
        
        // Retry la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh a échoué, traiter la queue avec erreur
        processQueue(refreshError, null);
        
        // Déconnecter l'utilisateur
        store.dispatch(logout());
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Pour toutes les autres erreurs, rejeter normalement
    return Promise.reject(error);
  }
);

// ===================================================================
// HELPERS POUR REQUÊTES (optionnel)
// ===================================================================

/**
 * Helper GET avec gestion d'erreur simplifiée
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur réseau' 
    };
  }
};

/**
 * Helper POST avec gestion d'erreur simplifiée
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur réseau' 
    };
  }
};

/**
 * Helper PUT avec gestion d'erreur simplifiée
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur réseau' 
    };
  }
};

/**
 * Helper DELETE avec gestion d'erreur simplifiée
 */
export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur réseau' 
    };
  }
};

export default api;