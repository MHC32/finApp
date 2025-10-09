/**
 * =========================================================
 * FinApp Haiti - Base API Client (VERSION PROPRE)
 * ✅ Lit le token depuis Redux
 * ✅ Pas de localStorage manuel
 * =========================================================
 */

import axios from 'axios';
import store from '../../store/index'; // ✅ Import du store Redux
import { selectToken, selectRefreshToken, updateTokens, logout } from '../../store/slices/authSlice';

const baseURL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================================================================
// REQUEST INTERCEPTOR - LIT DEPUIS REDUX
// ===================================================================

apiClient.interceptors.request.use(
  (config) => {
    // ✅ Lire le token depuis Redux state
    const state = store.getState();
    const token = selectToken(state);
    
    console.log('📤 [REQUEST] Token depuis Redux:', token ? 'PRÉSENT' : 'ABSENT');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [REQUEST-ERROR]', error);
    return Promise.reject(error);
  }
);

// ===================================================================
// RESPONSE INTERCEPTOR - GESTION REFRESH TOKEN
// ===================================================================

apiClient.interceptors.response.use(
  (response) => {
    // Retourner response.data pour compatibilité
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Erreur réseau
    if (!error.response) {
      console.error('🌐 [NETWORK-ERROR]', error.message);
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: error.message,
      });
    }

    // Gestion 401 - Token expiré
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ✅ Lire refreshToken depuis Redux
      const state = store.getState();
      const refreshToken = selectRefreshToken(state);

      if (!refreshToken) {
        console.warn('🔐 Pas de refresh token - déconnexion');
        store.dispatch(logout());
        return Promise.reject({
          type: 'AUTH_ERROR',
          message: 'Session expirée',
          redirect: true,
        });
      }

      try {
        console.log('🔄 Tentative refresh token...');
        
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.data?.success && refreshResponse.data?.data?.tokens) {
          const newTokens = refreshResponse.data.data.tokens;
          
          // ✅ Mettre à jour Redux (Redux Persist sauvegarde auto)
          store.dispatch(updateTokens({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          }));

          // Réessayer la requête originale
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Invalid refresh response');
        }
      } catch (refreshError) {
        console.error('❌ Refresh token échoué', refreshError);
        store.dispatch(logout());
        return Promise.reject({
          type: 'REFRESH_ERROR',
          message: 'Session expirée',
        });
      }
    }

    // Autres erreurs HTTP
    return Promise.reject({
      type: 'HTTP_ERROR',
      status: error.response.status,
      data: error.response.data,
    });
  }
);

export default apiClient;