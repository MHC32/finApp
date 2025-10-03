/**
 * =========================================================
 * FinApp Haiti - Base API Client
 * Configuration Axios avec intercepteurs
 * =========================================================
 */

import axios from 'axios';
import store from '../../store';
import { logout } from '../../store/slices/authSlice';

/**
 * Configuration API
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Créer instance Axios
 */
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor
 * Ajoute automatiquement le token JWT à toutes les requêtes
 */
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer token depuis localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Gère automatiquement les erreurs et les réponses
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }

    // Retourner directement response.data pour simplifier
    return response.data;
  },
  (error) => {
    // Log erreur
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });

    // Gestion erreurs spécifiques
    if (error.response) {
      const { status, data } = error.response;

      // 401 - Non authentifié → Logout
      if (status === 401) {
        console.log('🔒 Session expirée - Déconnexion');
        store.dispatch(logout());
        
        // Redirection vers login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // 403 - Accès refusé
      if (status === 403) {
        console.log('⛔ Accès refusé');
      }

      // 404 - Ressource non trouvée
      if (status === 404) {
        console.log('🔍 Ressource non trouvée');
      }

      // 500 - Erreur serveur
      if (status === 500) {
        console.log('💥 Erreur serveur');
      }

      // Retourner erreur formatée
      return Promise.reject({
        status,
        message: data?.message || 'Une erreur est survenue',
        error: data?.error,
        data: data
      });
    }

    // Erreur réseau (pas de réponse du serveur)
    if (error.request) {
      console.error('📡 Erreur réseau - Serveur inaccessible');
      return Promise.reject({
        status: 0,
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        error: 'network_error'
      });
    }

    // Autre erreur
    return Promise.reject({
      status: 0,
      message: error.message || 'Une erreur est survenue',
      error: 'unknown_error'
    });
  }
);

/**
 * Helper pour gérer les requêtes
 */
export const apiRequest = {
  /**
   * GET request
   */
  get: (url, config = {}) => apiClient.get(url, config),

  /**
   * POST request
   */
  post: (url, data, config = {}) => apiClient.post(url, data, config),

  /**
   * PUT request
   */
  put: (url, data, config = {}) => apiClient.put(url, data, config),

  /**
   * DELETE request
   */
  delete: (url, config = {}) => apiClient.delete(url, config),

  /**
   * PATCH request
   */
  patch: (url, data, config = {}) => apiClient.patch(url, data, config)
};

export default apiClient;