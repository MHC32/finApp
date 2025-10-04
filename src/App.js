/**
 * =========================================================
 * FinApp Haiti - Application principale (VERSION FINALE)
 * ✅ Auth check optimisé avec timeout
 * ✅ Gestion d'erreur robuste
 * ✅ Pas de boucle infinie
 * =========================================================
 */
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

// Store & Query Client
import store from './store';
import queryClient from './config/queryClient';

// Routes
import AppRoutes from './routes/index.jsx';

// Redux actions & selectors
import { 
  checkAuthAsync, 
  selectAuthLoading, 
  selectIsAuthenticated 
} from './store/slices/authSlice';

/**
 * Auth Check Component
 * ✅ Vérifie l'auth avec timeout pour éviter boucle infinie
 * ✅ Gère tous les cas d'erreur proprement
 */
function AuthCheck({ children }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [authChecked, setAuthChecked] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      // ✅ Timeout de sécurité (10 secondes max)
      timeoutId = setTimeout(() => {
        console.warn('⏱️ Timeout - Auth check trop long');
        setTimeoutReached(true);
        setAuthChecked(true);
      }, 10000);
      
      if (token) {
        console.log('🔍 Token trouvé, vérification avec backend...');
        
        try {
          await dispatch(checkAuthAsync()).unwrap();
          console.log('✅ Authentification vérifiée');
        } catch (error) {
          console.error('❌ Token invalide ou expiré:', error);
          // Le slice gère déjà le nettoyage du token
        }
      } else {
        console.log('ℹ️ Pas de token - Utilisateur non connecté');
      }
      
      // Clear timeout si terminé avant
      clearTimeout(timeoutId);
      setAuthChecked(true);
    };

    checkAuth();
    
    // Cleanup timeout au démontage
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dispatch]);

  // ✅ Afficher spinner SEULEMENT si auth pas checked ET pas timeout
  if (!authChecked || (loading && !timeoutReached)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          Vérification de l'authentification...
        </Box>
      </Box>
    );
  }

  // ✅ Auth vérifié, afficher l'app
  return children;
}

/**
 * App Component
 */
function AppContent() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Log de démarrage en développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 FinApp Haiti - Application démarrée');
      console.log('📍 Environment:', process.env.NODE_ENV);
      console.log('🔗 API URL:', 'http://localhost:3001/api');
    }
  }, []);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      
      {/* Vérifier auth avant d'afficher les routes */}
      <AuthCheck>
        <AppRoutes />
      </AuthCheck>
      
      {/* React Query DevTools (dev uniquement) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </ThemeProvider>
  );
}

/**
 * App avec Providers
 */
export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}