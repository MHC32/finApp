/**
 * =========================================================
 * FinApp Haiti - Base API Client
 * Configuration Axios avec interceptors JWT
 * =========================================================
 */

import axios from 'axios';

// Configuration de base
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Créer instance Axios
const apiClient = axios.create({
  baseURL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================================================================
// REQUEST INTERCEPTOR (Ajouter JWT token)
// ===================================================================

apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token');

    // Ajouter le token à l'en-tête Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Erreur request interceptor:', error);
    return Promise.reject(error);
  }
);

// ===================================================================
// RESPONSE INTERCEPTOR (Gérer erreurs & token refresh)
// ===================================================================

apiClient.interceptors.response.use(
  (response) => {
    // Log succès en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Retourner directement response.data pour simplifier
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log erreur
    console.error('❌ Erreur API:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    // ===============================================================
    // GESTION TOKEN EXPIRÉ (401 Unauthorized)
    // ===============================================================
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Récupérer refresh token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // Pas de refresh token, rediriger vers login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Tenter de renouveler le token
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        if (response.data?.success && response.data?.data?.tokens?.accessToken) {
          // Sauvegarder nouveau token
          const newToken = response.data.data.tokens.accessToken;
          localStorage.setItem('token', newToken);

          // Mettre à jour l'en-tête de la requête originale
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Réessayer la requête originale
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh échoué');
        }
      } catch (refreshError) {
        // Refresh échoué, déconnecter l'utilisateur
        console.error('❌ Token refresh échoué:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // ===============================================================
    // AUTRES CODES D'ERREUR
    // ===============================================================

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error('⛔ Accès refusé (403)');
      // Optionnel: Rediriger ou afficher message
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      console.error('🔍 Ressource non trouvée (404)');
    }

    // 500 Server Error
    if (error.response?.status >= 500) {
      console.error('🔥 Erreur serveur (500+)');
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Timeout de la requête');
    }

    // Pas de connexion réseau
    if (!error.response) {
      console.error('🌐 Erreur réseau - Pas de connexion');
    }

    return Promise.reject(error);
  }
);

export default apiClient;