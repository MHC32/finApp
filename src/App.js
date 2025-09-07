// src/App.js - VERSION COMPLÈTE AVEC TAUX DE CHANGE
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useExchangeStore } from './store/exchangeStore';
import {  Menu } from 'lucide-react';
import { useActivityTracker } from './hooks/useActivityTracker';
import Header from './components/layout/Header';

// ✅ NOUVEAU: Import du service de revenus automatiques
import { IncomeService } from './services/incomeService';

// Pages Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Setup from './pages/auth/Setup';

// Pages principales
import Dashboard from './pages/dashboard/Dashboard';

// Pages Comptes
import AccountsList from './pages/accounts/AccountsList';
import AddAccount from './pages/accounts/AddAccount';

// Pages Transactions
import TransactionsList from './pages/transactions/TransactionsList';
import AddTransaction from './pages/transactions/AddTransaction';
import TransactionDetails from './pages/transactions/TransactionDetails';

// Pages Budgets
import BudgetsList from './pages/budgets/BudgetsList';

// Pages Sols
import SolsList from './pages/sols/SolsList';

// ✅ NOUVEAU: Pages Revenus
import IncomeSourcesList from './pages/income/IncomeSourcesList';

// Pages Paramètres
import Settings from './pages/settings/Settings';

// Components
import Navigation from './components/layout/Navigation';
// ✅ NOUVEAU: Centre de notifications
import NotificationCenter from './components/notifications/NotificationCenter';

// Layout avec Navigation
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
   useActivityTracker();


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ Header Mobile avec NotificationCenter */}
        <Header />
        <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">FinApp Haiti</h1>
            </div>
            <NotificationCenter />
          </div>
        </header>

        {/* ✅ Header Desktop avec NotificationCenter */}
        <header className="hidden lg:flex bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div></div>
            <NotificationCenter />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Route Protection (inchangé)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setupCompleted } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!setupCompleted) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
};

// Auth Route (inchangé)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, setupCompleted } = useAuthStore();
  
  if (isAuthenticated && setupCompleted) {
    return <Navigate to="/" replace />;
  }
  
  if (isAuthenticated && !setupCompleted) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
};

function App() {
  const { initTheme } = useThemeStore();
  const { isAuthenticated, setupCompleted } = useAuthStore();
  const { initialize: initExchange } = useExchangeStore();

  // ✅ NOUVEAU: Initialiser le thème au démarrage
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // ✅ NOUVEAU: Initialiser TOUS les services
  useEffect(() => {
    // Initialiser seulement si l'utilisateur est connecté et a terminé le setup
    if (isAuthenticated && setupCompleted) {
      console.log('🚀 Initialisation des services FinApp Haiti...');
      
      // Initialiser le service de revenus automatiques
      IncomeService.initialize().then(() => {
        console.log('✅ Service de revenus automatiques initialisé');
      }).catch(error => {
        console.error('❌ Erreur lors de l\'initialisation des services:', error);
      });

      // ✅ NOUVEAU: Initialiser le service de taux de change
      initExchange().then(() => {
        console.log('✅ Service de taux de change initialisé');
      }).catch(error => {
        console.error('❌ Erreur lors de l\'initialisation du taux de change:', error);
      });
    }
  }, [isAuthenticated, setupCompleted, initExchange]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ========================= */}
          {/*       ROUTES AUTH         */}
          {/* ========================= */}
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          
          <Route path="/register" element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } />
          
          <Route path="/setup" element={<Setup />} />

          {/* ========================= */}
          {/*    ROUTES PROTÉGÉES       */}
          {/* ========================= */}
          
          {/* Dashboard Principal */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== ROUTES COMPTES ===== */}
          <Route path="/accounts" element={
            <ProtectedRoute>
              <AppLayout>
                <AccountsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/accounts/add" element={
            <ProtectedRoute>
              <AppLayout>
                <AddAccount />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== ROUTES TRANSACTIONS ===== */}
          <Route path="/transactions" element={
            <ProtectedRoute>
              <AppLayout>
                <TransactionsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/transactions/add" element={
            <ProtectedRoute>
              <AppLayout>
                <AddTransaction />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/transactions/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <TransactionDetails />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== ROUTES BUDGETS ===== */}
          <Route path="/budgets" element={
            <ProtectedRoute>
              <AppLayout>
                <BudgetsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== NOUVEAU: ROUTES REVENUS ===== */}
          <Route path="/income" element={
            <ProtectedRoute>
              <AppLayout>
                <IncomeSourcesList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== ROUTES SOLS ===== */}
          <Route path="/sols" element={
            <ProtectedRoute>
              <AppLayout>
                <SolsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== ROUTES PARAMÈTRES ===== */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;