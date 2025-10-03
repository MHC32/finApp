/**
 * =========================================================
 * FinApp Haiti - Routes principales
 * Configuration React Router v6
 * =========================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages - Auth
import Login from 'layouts/authentication/sign-in';
import Register from 'layouts/authentication/sign-up';

// Pages - Dashboard
import Dashboard from 'layouts/dashboard';
import Profile from 'layouts/profile';

// Pages - Finances (NOUVELLE ARCHITECTURE)
import AccountsPage from 'pages/Finances/Accounts/AccountsPage';
import AccountDetailsPage from 'pages/Finances/Accounts/AccountDetailsPage';

// 404 Page
const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>404 - Page non trouvée</h1>
    <p>La page que vous recherchez n'existe pas.</p>
  </div>
);

/**
 * Configuration des routes principales
 */
function AppRoutes() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  return (
    <Routes>
      {/* Routes publiques avec PublicRoute (gère uniquement la redirection) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Routes protégées avec DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Finances - Accounts */}
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/accounts/:accountId" element={<AccountDetailsPage />} />
        
        {/* Finances - Transactions (À créer) */}
        {/* <Route path="/transactions" element={<TransactionsPage />} /> */}
        {/* <Route path="/transactions/:transactionId" element={<TransactionDetailsPage />} /> */}
        
        {/* Finances - Budgets (À créer) */}
        {/* <Route path="/budgets" element={<BudgetsPage />} /> */}
        {/* <Route path="/budgets/:budgetId" element={<BudgetDetailsPage />} /> */}
        
        {/* Sols (À créer) */}
        {/* <Route path="/sols" element={<SolsPage />} /> */}
        {/* <Route path="/sols/:solId" element={<SolDetailsPage />} /> */}
      </Route>

      {/* Redirection racine */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;