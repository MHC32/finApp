// src/App.jsx
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initTheme } from './store/slices/themeSlice';
import { fetchUser, restoreAuth } from './store/slices/authSlice';
import ThemeInitializer from './components/ThemeInitializer';
import ToastContainer from './components/ui/ToastContainer';
import TokenExpiryModal from './components/TokenExpiryModal';
import useToast from './hooks/useToast';

import AppRouter from './routes/AppRouter'; 

function App() {
  const dispatch = useDispatch();
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    // Initialiser le thème
    dispatch(initTheme());
    
    // Restaurer l'authentification depuis le localStorage
    dispatch(restoreAuth());
    
    // Vérifier si un token existe et récupérer l'utilisateur
    const token = localStorage.getItem('auth');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.token && authData.user) {
          dispatch(fetchUser());
        }
      } catch (error) {
        console.error('Erreur lors de la restauration de l\'auth:', error);
        localStorage.removeItem('auth');
      }
    }
  }, [dispatch]);

  return (
    <>
      <ThemeInitializer />
      <AppRouter />
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
      />
      <TokenExpiryModal />
    </>
  );
}

export default App;