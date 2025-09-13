// src/hooks/useActivityTracker.js - HOOK POUR LE SUIVI D'ACTIVITÉ
import { useEffect } from 'react';
import { useAuth } from './useAuth.js';
import { useAuthStore } from '../store/authStore.js';

export function useActivityTracker() {
  const { isAuthenticated } = useAuth();
  const { updateActivity, checkSessionValidity } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Le service de session gère déjà l'activité automatiquement
    // Ce hook peut être utilisé pour des actions manuelles si nécessaire
    
    // Vérification périodique de la validité
    const interval = setInterval(() => {
      checkSessionValidity();
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [isAuthenticated, updateActivity, checkSessionValidity]);

  return {
    // Actions manuelles
    updateActivity,
    checkValidity: checkSessionValidity
  };
}