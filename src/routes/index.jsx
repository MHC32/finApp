/**
 * =========================================================
 * FinApp Haiti - Routes principales
 * Configuration React Router v6
 * =========================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages - Auth
import Login from 'layouts/authentication/sign-in';
import Register from 'layouts/authentication/sign-up';

// Pages - Dashboard
import Dashboard from 'layouts/dashboard';
import Profile from 'layouts/profile';

// Pages - FinApp (à créer progressivement)
// import AccountsList from 'pages/Accounts/AccountsList';
// import TransactionsList from 'pages/Transactions/TransactionsList';
// import BudgetsList from 'pages/Budgets/BudgetsList';
// import SolsList from 'pages/Sols/SolsList';

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
      {/* Routes publiques */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Routes protégées avec DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Routes FinApp - À activer progressivement */}
        {/* <Route path="/accounts" element={<AccountsList />} /> */}
        {/* <Route path="/accounts/:id" element={<AccountDetail />} /> */}
        {/* <Route path="/transactions" element={<TransactionsList />} /> */}
        {/* <Route path="/budgets" element={<BudgetsList />} /> */}
        {/* <Route path="/sols" element={<SolsList />} /> */}
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