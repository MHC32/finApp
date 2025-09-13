// src/hooks/useAuth.js - NOUVEAU HOOK AVEC ARCHITECTURE SERVICES
import { useAuthStore } from '../stores/authStore.js';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    setupCompleted,
    error,
    login,
    register,
    logout,
    updatePreferences,
    updateSecuritySettings,
    clearError
  } = useAuthStore();

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    setupCompleted,
    error,
    
    // Actions
    login,
    register,
    logout,
    updatePreferences,
    updateSecuritySettings,
    clearError,
    
    // Utilitaires
    getCurrentUser: () => user,
    isLoggedIn: () => isAuthenticated,
    needsSetup: () => isAuthenticated && !setupCompleted,
    hasError: () => !!error
  };
}