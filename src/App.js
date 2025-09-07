// src/App.js - VERSION COMPLÈTE AVEC ROUTES BUDGETS
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useExchangeStore } from './store/exchangeStore';

// ✅ Import du service de revenus automatiques
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

// ✅ NOUVEAU: Pages Budgets complètes
import BudgetsList from './pages/budgets/BudgetsList';
import AddBudget from './pages/budgets/AddBudget';

// Pages Sols
import SolsList from './pages/sols/SolsList';

// Pages Revenus
import IncomeSourcesList from './pages/income/IncomeSourcesList';

// Pages Paramètres
import Settings from './pages/settings/Settings';

// Components
import Navigation from './components/layout/Navigation';
import NotificationCenter from './components/notifications/NotificationCenter';

// Layout avec Navigation
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white ml-12">FinApp Haiti</h1>
            <NotificationCenter />
          </div>
        </header>

        {/* Header Desktop */}
        <header className="hidden lg:flex bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-3">
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

// Route Protection
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

// Auth Route
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

  // Initialiser le thème au démarrage
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Initialiser TOUS les services
  useEffect(() => {
    if (isAuthenticated && setupCompleted) {
      console.log('🚀 Initialisation des services...');
      
      // Initialiser les taux de change
      initExchange();
      
      // Démarrer le service de revenus automatiques
      IncomeService.processPendingPayments();
      
      // Planifier les vérifications périodiques (toutes les heures)
      const interval = setInterval(() => {
        IncomeService.processPendingPayments();
      }, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, setupCompleted, initExchange]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ===== ROUTES AUTH ===== */}
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
          
          <Route path="/setup" element={
            <Setup />
          } />

          {/* ===== ROUTES PRINCIPALES ===== */}
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
          
          {/* ===== ✅ NOUVEAU: ROUTES BUDGETS COMPLÈTES ===== */}
          <Route path="/budgets" element={
            <ProtectedRoute>
              <AppLayout>
                <BudgetsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/budgets/add" element={
            <ProtectedRoute>
              <AppLayout>
                <AddBudget />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ===== ROUTES REVENUS ===== */}
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