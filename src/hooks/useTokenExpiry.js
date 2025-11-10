// src/hooks/useTokenExpiry.js
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  showTokenExpiryModal, 
  hideTokenExpiryModal, 
  updateTokenExpiryCountdown,
  refreshToken,
  logout
} from '../store/slices/authSlice';

export const useTokenExpiry = () => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  
  const { 
    tokenExpiresAt, 
    showTokenExpiryModal, 
    tokenExpiryCountdown,
    isAuthenticated,
    refreshLoading 
  } = useSelector(state => state.auth);

  const WARNING_THRESHOLD_MINUTES = 2; // Afficher modal 2 minutes avant
  const CHECK_INTERVAL = 10000; // Vérifier toutes les 10 secondes pour plus de précision

  const checkTokenExpiry = useCallback(() => {
    if (!tokenExpiresAt || !isAuthenticated) {
      console.log('🔐 Aucun token à vérifier ou utilisateur non authentifié');
      return;
    }

    const now = Date.now();
    const timeLeft = tokenExpiresAt - now;
    
    if (timeLeft < 0) {
      // Token déjà expiré
      console.log('🔐 Token expiré - Déconnexion automatique');
      dispatch(logout());
      dispatch(hideTokenExpiryModal());
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const minutesLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60)));
    const secondsLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000));

    console.log(`⏰ Token expire dans: ${minutesLeft}m ${secondsLeft}s`);

    // Afficher modal si moins de 2 minutes
    if (minutesLeft <= WARNING_THRESHOLD_MINUTES && minutesLeft >= 0) {
      if (!showTokenExpiryModal) {
        console.log(`🚨 Affichage modal d'expiration - ${minutesLeft} minute(s) restante(s)`);
        dispatch(showTokenExpiryModal({ countdown: minutesLeft }));
      } else if (tokenExpiryCountdown !== minutesLeft) {
        // Mettre à jour le compte à rebours
        dispatch(updateTokenExpiryCountdown(minutesLeft));
      }
    } else if (showTokenExpiryModal && minutesLeft > WARNING_THRESHOLD_MINUTES) {
      // Cacher le modal si le token a été rafraîchi et qu'il reste plus de 2 minutes
      console.log('✅ Token rafraîchi - Masquage du modal');
      dispatch(hideTokenExpiryModal());
    }
  }, [tokenExpiresAt, isAuthenticated, showTokenExpiryModal, tokenExpiryCountdown, dispatch]);

  useEffect(() => {
    if (isAuthenticated && tokenExpiresAt) {
      console.log('🔐 Surveillance du token activée');
      
      // Vérifier immédiatement au montage
      checkTokenExpiry();
      
      // Configurer l'intervalle de vérification
      intervalRef.current = setInterval(checkTokenExpiry, CHECK_INTERVAL);
      
      return () => {
        if (intervalRef.current) {
          console.log('🔐 Nettoyage de la surveillance du token');
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Nettoyer l'intervalle si non authentifié
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // S'assurer que le modal est caché si non authentifié
      if (showTokenExpiryModal) {
        dispatch(hideTokenExpiryModal());
      }
    }
  }, [isAuthenticated, tokenExpiresAt, checkTokenExpiry, showTokenExpiryModal, dispatch]);

  const extendSession = async () => {
    try {
      console.log('🔄 Tentative de rafraîchissement du token...');
      const result = await dispatch(refreshToken()).unwrap();
      
      console.log('✅ Token rafraîchi avec succès');
      dispatch(hideTokenExpiryModal());
      
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      
      // En cas d'erreur, déconnecter l'utilisateur
      dispatch(logout());
      
      return { 
        success: false, 
        error: error.message || 'Erreur lors du rafraîchissement de la session'
      };
    }
  };

  const letSessionExpire = () => {
    console.log('👋 Déconnexion manuelle - Session expirée');
    dispatch(logout());
    dispatch(hideTokenExpiryModal());
  };

  // Fonction pour forcer la vérification manuellement (utile pour le débogage)
  const forceCheck = () => {
    console.log('🔍 Vérification forcée du token');
    checkTokenExpiry();
  };

  return {
    showTokenExpiryModal,
    tokenExpiryCountdown,
    refreshLoading,
    extendSession,
    letSessionExpire,
    forceCheck // Export pour débogage
  };
};