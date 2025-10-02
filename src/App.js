/**
 * =========================================================
 * FinApp Haiti - Application principale
 * Version nettoyée - Redux + React Query
 * =========================================================
 */

import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

// Store & Query Client
import store from './store';
import queryClient from './config/queryClient';

// ✅ CORRECTION : Import EXPLICITE du composant routes
import AppRoutes from './routes/index.jsx';

// ❌ NE PAS FAIRE : import AppRoutes from './routes'; 
// Car JavaScript va chercher routes.js (l'array) au lieu de routes/index.jsx

export default function App() {
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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          
          {/* ✅ AppRoutes est maintenant le bon composant */}
          <AppRoutes />
          
          {/* React Query DevTools (dev uniquement) */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}