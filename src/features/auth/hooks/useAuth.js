// src/features/auth/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  loginUser,
  registerUser,
  logoutUser,
  fetchUser,
  clearError,
  clearSuccess
} from '../../../store/slices/authSlice';
// SUPPRIMER les imports qui n'existent plus
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../utils/constants';

/**
 * Hook d'authentification utilisant le authSlice existant
 * Aligné avec les createAsyncThunk du slice
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // État global depuis Redux
  const { 
    user, 
    token, 
    isAuthenticated, 
    loading,
    loginLoading,
    registerLoading,
    error,
    successMessage 
  } = useSelector(state => state.auth);
  
  const [localError, setLocalError] = useState('');

  // ===================================================================
  // GESTION DES MESSAGES GLOBAUX
  // ===================================================================

  useEffect(() => {
    // Gérer les erreurs globales du slice
    if (error) {
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error,
        duration: 5000
      });
      dispatch(clearError());
    }

    // Gérer les messages de succès du slice
    if (successMessage) {
      showToast({
        type: 'success',
        title: 'Succès',
        message: successMessage,
        duration: 3000
      });
      dispatch(clearSuccess());
    }
  }, [error, successMessage, dispatch, showToast]);

  // ===================================================================
  // FONCTIONS D'AUTHENTIFICATION
  // ===================================================================

  /**
   * Connexion utilisateur
   */
  const login = async (credentials) => {
    setLocalError('');
    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(result)) {
      showToast({
        type: 'success',
        title: 'Connexion réussie',
        message: `Bon retour ${result.payload.user.firstName} ! 👋`,
        duration: 3000
      });
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur de connexion');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Enregistrement utilisateur
   */
  const register = async (userData) => {
    setLocalError('');
    const result = await dispatch(registerUser(userData));
    
    if (registerUser.fulfilled.match(result)) {
      showToast({
        type: 'success',
        title: 'Inscription réussie',
        message: `Bienvenue dans FinApp Haiti ${result.payload.user.firstName} ! 🇭🇹`,
        duration: 3000
      });
      return { success: true, data: result.payload };
    } else {
      setLocalError(result.payload || 'Erreur d\'inscription');
      return { success: false, error: result.payload };
    }
  };

  /**
   * Déconnexion utilisateur
   */
  const logout = async (allDevices = false) => {
    try {
      await dispatch(logoutUser()).unwrap();
      
      // Nettoyage côté frontend
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();

      // Redirection vers login
      navigate(ROUTES.LOGIN);
      
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      // Déconnexion forcée même en cas d'erreur
      localStorage.removeItem('refreshToken');
      navigate(ROUTES.LOGIN);
    }
  };

  /**
   * Récupérer le profil utilisateur
   */
  const getProfile = async () => {
    try {
      const result = await dispatch(fetchUser()).unwrap();
      return { success: true, user: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  // ===================================================================
  // SUPPRIMER LES FONCTIONS QUI N'EXISTENT PLUS
  // ===================================================================

  // SUPPRIMER ces fonctions car elles ne sont plus dans authSlice:
  // - requestPasswordReset (forgotPassword)
  // - resetPassword  
  // - changePassword

  // ===================================================================
  // EXPORT DU HOOK
  // ===================================================================

  return {
    // État
    user,
    token,
    isLoading: loading,
    isAuthenticated,
    error: localError,
    
    // Fonctions d'authentification
    login,
    register,
    logout,
    getProfile,
    
    // SUPPRIMER les exports qui n'existent plus:
    // forgotPassword: requestPasswordReset,
    // resetPassword,
    // changePassword,
    
    // Utilitaires
    clearError: () => setLocalError('')
  };
};

export default useAuth;