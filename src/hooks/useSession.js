// src/hooks/useSession.js - HOOK POUR LA GESTION DE SESSION
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore.js';

export function useSession() {
  const {
    getSessionStats,
    getSessionTimeRemaining,
    checkSessionValidity,
    updateActivity,
    extendSession
  } = useAuthStore();

  const [sessionStats, setSessionStats] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mettre à jour les stats de session en temps réel
  useEffect(() => {
    const updateStats = () => {
      const stats = getSessionStats();
      const remaining = getSessionTimeRemaining();
      
      setSessionStats(stats);
      setTimeRemaining(remaining);
    };

    // Mise à jour initiale
    updateStats();

    // Mise à jour chaque seconde
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, [getSessionStats, getSessionTimeRemaining]);

  return {
    // État de session
    sessionStats,
    timeRemaining,
    isUnlimited: timeRemaining === -1,
    isExpiringSoon: timeRemaining > 0 && timeRemaining < 300, // Moins de 5 minutes
    
    // Actions
    updateActivity,
    extendSession: (minutes = 30) => extendSession(minutes),
    checkValidity: checkSessionValidity,
    
    // Utilitaires
    formatTimeRemaining: () => {
      if (timeRemaining === -1) return 'Illimitée';
      if (timeRemaining <= 0) return 'Expirée';
      
      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      const seconds = timeRemaining % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    },
    
    getSessionColor: () => {
      if (timeRemaining === -1) return 'text-green-600';
      if (timeRemaining < 300) return 'text-red-600'; // Moins de 5 minutes
      if (timeRemaining < 900) return 'text-yellow-600'; // Moins de 15 minutes
      return 'text-green-600';
    }
  };
}
