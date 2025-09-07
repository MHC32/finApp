import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useActivityTracker = () => {
  const { updateActivity, checkSessionValidity, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Liste des événements à surveiller pour l'activité
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'focus', 'input'
    ];
    
    // Gestionnaire d'activité qui met à jour Zustand
    const handleActivity = () => {
      updateActivity();
    };

    // Ajouter tous les écouteurs d'événements
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Vérification périodique de la validité de session
    const sessionCheckInterval = setInterval(() => {
      const validity = checkSessionValidity();
      
      if (validity === 'warning') {
        // Session bientôt expirée, on pourrait afficher une notification
        console.log('⚠️ Session expire dans moins de 5 minutes');
      }
    }, 30000); // Vérifier toutes les 30 secondes

    // Nettoyage lors du démontage
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [updateActivity, checkSessionValidity, isAuthenticated]);

  // Ce hook ne retourne rien, il surveille silencieusement
};
