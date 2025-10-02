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

// Routes
import AppRoutes from './routes';

// Debugging
console.log('🔍 AppRoutes importé:', AppRoutes);
console.log('🔍 Type de AppRoutes:', typeof AppRoutes);
console.log('🔍 AppRoutes est une fonction?', typeof AppRoutes === 'function');
console.log('🔍 AppRoutes est un objet?', typeof AppRoutes === 'object' && AppRoutes !== null);

// Composant de secours
const FallbackComponent = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>⚠️ Erreur de chargement</h1>
    <p>Le composant AppRoutes n'est pas valide.</p>
    <p>Type: {typeof AppRoutes}</p>
    <p>Valeur: {JSON.stringify(AppRoutes)}</p>
  </div>
);

// Composant validé
const ValidatedAppRoutes = () => {
  if (!AppRoutes) {
    console.error('❌ AppRoutes est undefined');
    return <FallbackComponent />;
  }
  
  if (typeof AppRoutes === 'function') {
    return <AppRoutes />;
  }
  
  if (React.isValidElement(AppRoutes)) {
    return AppRoutes;
  }
  
  console.error('❌ AppRoutes est de type invalide:', typeof AppRoutes, AppRoutes);
  return <FallbackComponent />;
};

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
          <ValidatedAppRoutes />
          
          {/* React Query DevTools (dev uniquement) */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}