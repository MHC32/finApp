/**
 * =========================================================
 * FinApp Haiti - Application Principale (VERSION CORRIGÉE)
 * ✅ Lit UNIQUEMENT depuis Redux State
 * ✅ Pas de localStorage manuel
 * ✅ Redux Persist gère tout
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

// API Services
import apiClient from './services/api/baseClient';

// Redux actions & selectors
import { 
  checkAuthAsync,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectUser
} from './store/slices/authSlice';

// ===================================================================
// TESTS & DIAGNOSTICS
// ===================================================================

/**
 * Test complet de connexion backend
 */
const testBackend = async () => {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║ 🧪 TEST COMPLET BACKEND                               ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  
  try {
    console.log('\n1. 📍 Test endpoint racine...');
    const response = await apiClient.get('/');
    console.log('   ✅ Endpoint racine accessible:', response?.success);
    
    console.log('\n2. ❤️  Test endpoint health...');
    const health = await apiClient.get('/health');
    console.log('   ✅ Health endpoint:', health?.status);
    
    console.log('\n3. 🌐 Test CORS...');
    const corsTest = await fetch('http://localhost:3001/api');
    console.log('   ✅ CORS test:', corsTest.status, corsTest.statusText);
    
    console.log('\n4. ⏱️  Test performance...');
    const startTime = Date.now();
    await apiClient.get('/');
    const endTime = Date.now();
    console.log('   ✅ Temps de réponse:', endTime - startTime + 'ms');
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🎉 BACKEND CONNECTÉ AVEC SUCCÈS!                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    return true;
  } catch (error) {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ ❌ ERREUR CONNEXION BACKEND                           ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log('║ Message:', error.message);
    console.log('║ URL testée: http://localhost:3001/api');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    return false;
  }
};

/**
 * Test rapide de santé backend
 */
const quickHealthCheck = async () => {
  console.log('\n🔍 TEST RAPIDE BACKEND...');
  try {
    const response = await apiClient.get('/health');
    console.log('   ✅ Backend accessible:', response?.status || 'OK');
    return true;
  } catch (error) {
    console.log('   ❌ Backend inaccessible:', error.message);
    return false;
  }
};

/**
 * Composant de diagnostic automatique
 */
const BackendDiagnostic = () => {
  useEffect(() => {
    const runDiagnostic = async () => {
      console.log('\n🔧 DIAGNOSTIC BACKEND AUTOMATIQUE');
      await quickHealthCheck();
    };
    
    runDiagnostic();
  }, []);
  
  return null;
};

// ===================================================================
// COMPOSANT DE VÉRIFICATION D'AUTHENTIFICATION
// ===================================================================

/**
 * AuthCheck - Vérifie l'authentification au démarrage
 * ✅ VERSION CORRIGÉE : Lit UNIQUEMENT depuis Redux
 */
const AuthCheck = () => {
  const dispatch = useDispatch();
  
  // ✅ CORRECTION : Lire depuis Redux State uniquement
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);
  
  // État local pour suivre si la vérification est terminée
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🔄 AUTHCHECK - DÉMARRAGE VÉRIFICATION                ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    
    const checkAuthentication = async () => {
      // Debug : État Redux actuel
      console.log('\n📊 État Redux actuel:');
      console.log('   ├─ Token présent:', !!token);
      console.log('   ├─ isAuthenticated:', isAuthenticated);
      console.log('   ├─ authLoading:', authLoading);
      console.log('   └─ User:', user ? user.email : 'null');

      // ✅ CORRECTION : Vérifier le token dans Redux State
      // Redux Persist a déjà fait la rehydration depuis localStorage
      if (!token) {
        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║ 🔴 PAS DE TOKEN DANS REDUX STATE                     ║');
        console.log('╠═══════════════════════════════════════════════════════╣');
        console.log('║ → Redux Persist n\'a rien restauré                    ║');
        console.log('║ → Utilisateur NON connecté                            ║');
        console.log('║ → Pas besoin d\'appeler l\'API                        ║');
        console.log('║ → Redirection vers /login                             ║');
        console.log('╚═══════════════════════════════════════════════════════╝\n');
        
        setAuthChecked(true);
        return; // ✅ Arrêter ici, pas d'appel API
      }

      // Token existe dans Redux
      console.log('\n╔═══════════════════════════════════════════════════════╗');
      console.log('║ 🟡 TOKEN TROUVÉ DANS REDUX STATE                     ║');
      console.log('╠═══════════════════════════════════════════════════════╣');
      console.log('║ → Redux Persist a restauré les données               ║');
      console.log('║ → Token:', token.substring(0, 20) + '...');
      console.log('║ → Vérification avec le backend...                     ║');
      console.log('╚═══════════════════════════════════════════════════════╝\n');

      try {
        console.log('🔄 Appel checkAuthAsync()...\n');
        
        const result = await dispatch(checkAuthAsync()).unwrap();
        
        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║ 🟢 VÉRIFICATION BACKEND RÉUSSIE                       ║');
        console.log('╠═══════════════════════════════════════════════════════╣');
        console.log('║ → Backend confirme : Token valide                     ║');
        console.log('║ → User:', result.user?.email || 'N/A');
        console.log('║ → Utilisateur AUTHENTIFIÉ                             ║');
        console.log('║ → Accès au dashboard autorisé                         ║');
        console.log('╚═══════════════════════════════════════════════════════╝\n');
        
      } catch (error) {
        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║ 🔴 VÉRIFICATION BACKEND ÉCHOUÉE                       ║');
        console.log('╠═══════════════════════════════════════════════════════╣');
        console.log('║ → Backend refuse : Token invalide/expiré              ║');
        console.log('║ → Erreur:', error?.message || error);
        console.log('║ → Redux va nettoyer le state                          ║');
        console.log('║ → Déconnexion automatique                             ║');
        console.log('║ → Redirection vers /login                             ║');
        console.log('╚═══════════════════════════════════════════════════════╝\n');
        
      } finally {
        console.log('🏁 AuthCheck TERMINÉ\n');
        setAuthChecked(true);
      }
    };

    checkAuthentication();
  }, [dispatch, token]); // ✅ Dépendances correctes

  // Debug render
  console.log('🎯 AUTHCHECK RENDER:', {
    authChecked,
    authLoading,
    isAuthenticated,
    hasToken: !!token
  });

  // ✅ Afficher le spinner pendant la vérification
  if (!authChecked || authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
        sx={{ bgcolor: 'background.default' }}
      >
        <CircularProgress size={60} thickness={4} />
        <Box 
          sx={{ 
            color: 'text.secondary', 
            fontSize: '0.875rem',
            fontWeight: 500 
          }}
        >
          Vérification de votre session...
        </Box>
        <Box 
          sx={{ 
            color: 'text.disabled', 
            fontSize: '0.75rem',
            mt: 1 
          }}
        >
          {!authChecked ? 'Chargement...' : 'Authentification...'}
        </Box>
      </Box>
    );
  }

  // ✅ Vérification terminée - Laisser passer vers les routes
  console.log('✅ AuthCheck COMPLÉTÉ - Affichage des routes\n');
  return null;
};

// ===================================================================
// APP CONTENT (avec providers)
// ===================================================================

/**
 * AppContent - Contenu principal de l'application
 */
function AppContent() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const dispatch = useDispatch();
  
  // États Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // ✅ Effet au démarrage de l'application
  useEffect(() => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║ 🚀 FINAPP HAITI - APPLICATION DÉMARRÉE               ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log('║ Environment:', process.env.NODE_ENV);
    console.log('║ API URL: http://localhost:3001/api');
    console.log('║ Date:', new Date().toLocaleString('fr-FR'));
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    // Test backend au démarrage
    testBackend();
    
    // ✅ CORRECTION : Ne plus lire localStorage ici
    // Redux Persist s'en charge automatiquement via la rehydration
    console.log('📦 Redux Persist va gérer la restauration du state...\n');
    
  }, [dispatch]);

  // Debug : Afficher l'état d'authentification
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('\n✅ Utilisateur connecté:', user.email);
    }
  }, [isAuthenticated, user]);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      
      {/* Diagnostic backend */}
      <BackendDiagnostic />
      
      {/* Vérification authentification */}
      <AuthCheck />
      
      {/* Routes principales */}
      <AppRoutes />
      
      {/* React Query DevTools (développement uniquement) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </ThemeProvider>
  );
}

// ===================================================================
// APP ROOT (avec tous les providers)
// ===================================================================

/**
 * App - Composant racine avec tous les providers
 */
export default function App() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║ 🎬 APP ROOT - INITIALISATION                          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}