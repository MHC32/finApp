// src/routes/routeConfig.js
/**
 * Configuration unifiée des routes - FinApp Haiti
 * Routes disponibles seulement - les autres seront ajoutées au fur et à mesure
 */

import { ROUTES } from '../utils/constants';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Pages publiques (EXISTANTES)
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';

// Pages privées (EXISTANTES)
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import AccountsListPage from '../features/accounts/pages/AccountsListPage';
import AccountDetailPage from '../features/accounts/pages/AccountDetailsPage';

// Pages Transactions (NOUVELLES !)
import TransactionsListPage from '../features/transactions/pages/TransactionsListPage';
import TransactionDetailsPage from '../features/transactions/pages/TransactionDetailsPage';
import TransactionAnalyticsPage from '../features/transactions/pages/TransactionAnalyticsPage';

// Pages privées (À CRÉER - commentées pour l'instant)
// import BudgetsListPage from '../features/budgets/pages/BudgetsListPage';
// import SolsListPage from '../features/sols/pages/SolsListPage';
// import ProfilePage from '../features/profile/pages/ProfilePage';
// import SettingsPage from '../features/profile/pages/SettingsPage';

// Pages admin (À CRÉER - commentées pour l'instant)
// import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
// import AdminUsersPage from '../features/admin/pages/AdminUsersPage';
// import AdminAnalyticsPage from '../features/admin/pages/AdminAnalyticsPage';

// Page 404
import NotFoundPage from '../features/404/pages/NotFoundPage';

/**
 * Configuration principale des routes
 * Seules les routes avec pages existantes sont activées
 */
export const routeConfig = [
  // ===================================================================
  // ROUTES PUBLIQUES (EXISTANTES)
  // ===================================================================
  {
    id: 'login',
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    meta: {
      type: 'public',
      layout: 'auth',
      redirectIfAuthenticated: ROUTES.DASHBOARD
    }
  },
  {
    id: 'register',
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
    meta: {
      type: 'public',
      layout: 'auth',
      redirectIfAuthenticated: ROUTES.DASHBOARD
    }
  },
  {
    id: 'reset-password',
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
    meta: {
      type: 'public',
      layout: 'auth'
    }
  },

  // ===================================================================
  // ROUTES PRIVÉES (EXISTANTES)
  // ===================================================================
  {
    id: 'dashboard',
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'dashboard:view'
    }
  },
  {
    id: 'accounts',
    path: ROUTES.ACCOUNTS,
    element: <AccountsListPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'accounts:view'
    }
  },
  {
    id: 'account-detail',
    path: ROUTES.ACCOUNTS_DETAIL,
    element: <AccountDetailPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'accounts:view'
    }
  },

  // ===================================================================
  // ROUTES TRANSACTIONS (NOUVELLES !)
  // ===================================================================
  {
    id: 'transactions',
    path: ROUTES.TRANSACTIONS,
    element: <TransactionsListPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'transactions:view'
    }
  },
  {
    id: 'transaction-details',
    path: ROUTES.TRANSACTIONS_DETAIL, // /transactions/:id
    element: <TransactionDetailsPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'transactions:view'
    }
  },
  {
    id: 'transaction-analytics',
    path: '/transactions/analytics', // Ajouter dans constants si nécessaire
    element: <TransactionAnalyticsPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'transactions:view'
    }
  },

  // ===================================================================
  // ROUTES PRIVÉES (À CRÉER - COMMENTÉES)
  // ===================================================================
  /*
  {
    id: 'budgets',
    path: ROUTES.BUDGETS,
    element: <BudgetsListPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'budgets:view'
    }
  },
  {
    id: 'sols',
    path: ROUTES.SOLS,
    element: <SolsListPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'sols:view'
    }
  },
  {
    id: 'profile',
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'profile:view'
    }
  },
  {
    id: 'settings',
    path: ROUTES.SETTINGS,
    element: <SettingsPage />,
    meta: {
      type: 'private',
      layout: 'main',
      permission: 'settings:view'
    }
  },
  */

  // ===================================================================
  // ROUTES ADMIN (À CRÉER - COMMENTÉES)
  // ===================================================================
  /*
  {
    id: 'admin-dashboard',
    path: ROUTES.ADMIN,
    element: <AdminDashboardPage />,
    meta: {
      type: 'admin',
      layout: 'main',
      permission: 'admin:dashboard'
    }
  },
  {
    id: 'admin-users',
    path: ROUTES.ADMIN_USERS,
    element: <AdminUsersPage />,
    meta: {
      type: 'admin',
      layout: 'main',
      permission: 'admin:users'
    }
  },
  {
    id: 'admin-analytics',
    path: ROUTES.ADMIN_ANALYTICS,
    element: <AdminAnalyticsPage />,
    meta: {
      type: 'admin',
      layout: 'main',
      permission: 'admin:analytics'
    }
  }
  */
];

// ===================================================================
// HELPERS ET UTILITAIRES
// ===================================================================

/**
 * Trouver une route par son ID
 */
export const findRouteById = (id) => 
  routeConfig.find(route => route.id === id);

/**
 * Trouver une route par son path
 */
export const findRouteByPath = (path) => 
  routeConfig.find(route => route.path === path);

/**
 * Vérifier si une route est publique
 */
export const isPublicRoute = (path) => {
  const route = findRouteByPath(path);
  return route?.meta?.type === 'public';
};

/**
 * Vérifier si une route est privée
 */
export const isPrivateRoute = (path) => {
  const route = findRouteByPath(path);
  return route?.meta?.type === 'private';
};

/**
 * Vérifier si une route est admin
 */
export const isAdminRoute = (path) => {
  const route = findRouteByPath(path);
  return route?.meta?.type === 'admin';
};

/**
 * Obtenir les métadonnées d'une route
 */
export const getRouteMeta = (path) => 
  findRouteByPath(path)?.meta || null;

/**
 * Filtrer les routes accessibles pour un utilisateur
 */
export const getAccessibleRoutes = (user) => {
  return routeConfig.filter(route => {
    const { meta } = route;
    
    // Routes publiques toujours accessibles
    if (meta.type === 'public') return true;
    
    // Vérifier l'authentification pour les routes privées
    if (!user || !user.isAuthenticated) return false;
    
    // Vérifier les permissions pour les routes admin
    if (meta.type === 'admin' && user.role !== 'admin') return false;
    
    // Vérifier les permissions spécifiques si définies
    if (meta.permission) {
      // Implémenter la logique de vérification des permissions
      // Basé sur votre système de permissions
    }
    
    return true;
  });
};

/**
 * Obtenir uniquement les routes actives (non commentées)
 */
export const getActiveRoutes = () => 
  routeConfig.filter(route => route.element !== undefined);

/**
 * Obtenir les routes à créer (pour planification)
 */
export const getRoutesToCreate = () => [
  {
    id: 'budgets',
    path: ROUTES.BUDGETS,
    name: 'Budgets',
    feature: 'budgets'
  },
  {
    id: 'sols',
    path: ROUTES.SOLS,
    name: 'Sols (Tontines)',
    feature: 'sols'
  },
  {
    id: 'profile',
    path: ROUTES.PROFILE,
    name: 'Profil',
    feature: 'profile'
  },
  {
    id: 'settings',
    path: ROUTES.SETTINGS,
    name: 'Paramètres',
    feature: 'profile'
  },
  {
    id: 'admin-dashboard',
    path: ROUTES.ADMIN,
    name: 'Administration',
    feature: 'admin'
  },
  {
    id: 'admin-users',
    path: ROUTES.ADMIN_USERS,
    name: 'Utilisateurs',
    feature: 'admin'
  },
  {
    id: 'admin-analytics',
    path: ROUTES.ADMIN_ANALYTICS,
    name: 'Analytics',
    feature: 'admin'
  }
];

export default routeConfig;