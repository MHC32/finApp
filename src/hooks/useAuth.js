// src/hooks/useAuth.js - NOUVEAU HOOK POUR MIGRATION
import { useState, useEffect } from 'react';
import authService from '../services/auth/AuthService.js';
import sessionService from '../services/auth/SessionService.js';
import eventBus, { AUTH_EVENTS } from '../services/core/EventBus.js';
import validationService from '../services/core/ValidationService.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [error, setError] = useState(null);

  // Synchroniser avec les services au montage
  useEffect(() => {
    // Initialiser l'état depuis les services
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setSetupCompleted(currentUser.setup_completed || false);
    }

    // Écouter les événements d'authentification
    const unsubscribeLogin = eventBus.on(AUTH_EVENTS.LOGIN_SUCCESS, (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
      setSetupCompleted(data.user.setup_completed || false);
      setIsLoading(false);
      setError(null);
    });

    const unsubscribeLogout = eventBus.on(AUTH_EVENTS.LOGOUT, () => {
      setUser(null);
      setIsAuthenticated(false);
      setSetupCompleted(false);
      setIsLoading(false);
      setError(null);
    });

    const unsubscribeLoginFailure = eventBus.on(AUTH_EVENTS.LOGIN_FAILURE, (data) => {
      setIsLoading(false);
      setError(data.error);
    });

    const unsubscribeError = eventBus.on(AUTH_EVENTS.APP_ERROR, (data) => {
      if (data.type === 'auth_error') {
        setError(data.error);
      }
    });

    // Nettoyage
    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
      unsubscribeLoginFailure();
      unsubscribeError();
    };
  }, []);

  // Actions d'authentification
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation des identifiants
      const validation = validateCredentials(credentials);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Connexion via AuthService
      const user = await authService.login(credentials);
      
      // L'état sera mis à jour via les événements
      return user;

    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation des données utilisateur
      const validation = validateRegistration(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Inscription via AuthService
      const user = await authService.register(userData);
      
      return user;

    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      // L'état sera mis à jour via les événements
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      // Forcer le nettoyage même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
      setSetupCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updatePreferences = async (preferences) => {
    try {
      const updatedPrefs = await authService.updatePreferences(preferences);
      
      // Mettre à jour l'utilisateur local
      setUser(prev => ({
        ...prev,
        preferences: updatedPrefs
      }));
      
      return updatedPrefs;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateSecuritySettings = async (securitySettings) => {
    try {
      const updatedSettings = await authService.updateSecuritySettings(securitySettings);
      
      // Mettre à jour l'utilisateur local
      setUser(prev => ({
        ...prev,
        security_settings: updatedSettings
      }));
      
      return updatedSettings;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Fonctions de validation utilisant ValidationService
  const validateCredentials = (credentials) => {
    const errors = [];

    if (!credentials.email) {
      errors.push('Email requis');
    } else if (!validationService.isValidEmail(credentials.email)) {
      errors.push('Format email invalide');
    }

    // En développement, le mot de passe peut être optionnel
    if (process.env.NODE_ENV !== 'development' && !credentials.password) {
      errors.push('Mot de passe requis');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateRegistration = (userData) => {
    const validation = validationService.validate('user', {
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    });

    return {
      isValid: validation.isValid,
      errors: validation.errors.map(err => err.message)
    };
  };

  // Informations de session
  const getSessionStats = () => {
    return sessionService.getStats();
  };

  const getSessionTimeRemaining = () => {
    return sessionService.getTimeRemaining();
  };

  const updateActivity = () => {
    sessionService.updateActivity();
  };

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    setupCompleted,
    error,

    // Actions principales
    login,
    register,
    logout,
    updatePreferences,
    updateSecuritySettings,
    clearError,

    // Validation
    validateCredentials,
    validateRegistration,

    // Session
    getSessionStats,
    getSessionTimeRemaining,
    updateActivity,

    // Utilitaires
    getCurrentUser: () => user,
    isLoggedIn: () => isAuthenticated,
    needsSetup: () => isAuthenticated && !setupCompleted,
    hasError: () => !!error
  };
}