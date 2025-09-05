// src/App.js - VERSION COMPLÈTE avec toutes les routes
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

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

// Pages Paramètres
import Settings from './pages/settings/Settings';

// Components
import Navigation from './components/layout/Navigation';

// Layout avec Navigation
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 ml-12">FinApp Haiti</h1>
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

// Auth Route (redirect if already authenticated)
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