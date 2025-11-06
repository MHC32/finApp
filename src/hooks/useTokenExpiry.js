// src/hooks/useTokenExpiry.js
import { useEffect, useRef } from 'react';
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
  const CHECK_INTERVAL = 30000; // Vérifier toutes les 30 secondes

  const checkTokenExpiry = () => {
    if (!tokenExpiresAt || !isAuthenticated) return;

    const now = Date.now();
    const timeLeft = tokenExpiresAt - now;
    const minutesLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60)));

    console.log(`⏰ Token expire dans: ${minutesLeft} minutes`);

    // Afficher modal si moins de 2 minutes
    if (minutesLeft <= WARNING_THRESHOLD_MINUTES && minutesLeft > 0) {
      if (!showTokenExpiryModal) {
        dispatch(showTokenExpiryModal({ countdown: minutesLeft }));
      } else {
        dispatch(updateTokenExpiryCountdown(minutesLeft));
      }
    }

    // Déconnexion automatique si expiré
    if (timeLeft <= 0) {
      console.log('🔐 Token expiré - Déconnexion automatique');
      dispatch(logout());
      dispatch(hideTokenExpiryModal());
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && tokenExpiresAt) {
      checkTokenExpiry();
      intervalRef.current = setInterval(checkTokenExpiry, CHECK_INTERVAL);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isAuthenticated, tokenExpiresAt]);

  const extendSession = async () => {
    try {
      await dispatch(refreshToken()).unwrap();
      dispatch(hideTokenExpiryModal());
      return { success: true };
    } catch (error) {
      console.error('Erreur refresh:', error);
      return { success: false, error };
    }
  };

  const letSessionExpire = () => {
    dispatch(hideTokenExpiryModal());
  };

  return {
    showTokenExpiryModal,
    tokenExpiryCountdown,
    refreshLoading,
    extendSession,
    letSessionExpire
  };
};