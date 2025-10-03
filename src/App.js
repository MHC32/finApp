/**
 * =========================================================
 * FinApp Haiti - Application principale
 * Version avec Auto-Login au démarrage
 * =========================================================
 */

import React, { useEffect } from "react";
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

// Redux actions
import { checkAuthAsync } from './store/slices/authSlice';
import { selectAuthLoading } from './store/slices/authSlice';

/**
 * Auth Check Component
 * Vérifie le token au démarrage de l'app
 */
function AuthCheck({ children }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [authChecked, setAuthChecked] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Vérifier si token existe
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('🔍 Token trouvé, vérification...');
        // Vérifier le token avec le backend
        await dispatch(checkAuthAsync());
      } else {
        console.log('ℹ️ Pas de token, utilisateur non connecté');
      }
      
      setAuthChecked(true);
    };

    checkAuth();
  }, [dispatch]);

  // Afficher spinner pendant la vérification
  if (!authChecked) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

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
      console.log('🔗 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');
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