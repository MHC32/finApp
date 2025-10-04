/**
 * FinApp Haiti - Routes principales
 * Configuration React Router v6
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Route Guards
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Pages - Auth
import Login from 'layouts/authentication/sign-in';
import Register from 'layouts/authentication/sign-up';

// Pages - Dashboard
import Dashboard from 'layouts/dashboard';
import Profile from 'layouts/profile';
import Notifications from 'layouts/notifications';

// Pages - Finances (les vraies pages seront créées plus tard)
// import AccountsPage from 'pages/Finances/Accounts/AccountsPage';
// import TransactionsPage from 'pages/Finances/Transactions/TransactionsPage';
// etc.

// 404 Page
const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>404 - Page non trouvée</h1>
  </div>
);

function AppRoutes() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  return (
    <Routes>
      {/* Routes publiques */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Routes protégées */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Routes finances - À activer après création pages */}
        {/* <Route path="/accounts" element={<AccountsPage />} /> */}
        {/* <Route path="/transactions" element={<TransactionsPage />} /> */}
        {/* <Route path="/budgets" element={<BudgetsPage />} /> */}
      </Route>

      {/* Redirection racine */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;