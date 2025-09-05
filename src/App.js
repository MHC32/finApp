// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Setup from './pages/auth/Setup';
import Dashboard from './pages/dashboard/Dashboard';
import AccountsList from './pages/accounts/AccountsList';
import TransactionsList from './pages/transactions/TransactionsList';
import BudgetsList from './pages/budgets/BudgetsList';
import SolsList from './pages/sols/SolsList';
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
          {/* Auth Routes */}
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

          {/* Protected App Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/accounts" element={
            <ProtectedRoute>
              <AppLayout>
                <AccountsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <AppLayout>
                <TransactionsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/budgets" element={
            <ProtectedRoute>
              <AppLayout>
                <BudgetsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/sols" element={
            <ProtectedRoute>
              <AppLayout>
                <SolsList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
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