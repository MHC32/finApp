/**
 * =========================================================
 * FinApp Haiti - Routes Configuration
 * Version : 1.0 - Phase 1
 * =========================================================
 */

import { lazy } from 'react';
import Icon from '@mui/material/Icon';

// Lazy loading des pages principales
const Dashboard = lazy(() => import('layouts/dashboard'));
const Accounts = lazy(() => import('layouts/accounts'));
const Transactions = lazy(() => import('layouts/transactions'));
const Sols = lazy(() => import('layouts/sols'));
const Budgets = lazy(() => import('layouts/budgets'));

// Pages auth
const SignIn = lazy(() => import('layouts/authentication/sign-in'));
const SignUp = lazy(() => import('layouts/authentication/sign-up'));

// Pages futures (placeholders pour l'instant)
const Investments = lazy(() => import('layouts/investments'));
const Education = lazy(() => import('layouts/education'));
const Profile = lazy(() => import('layouts/profile'));

/**
 * Configuration des routes principales
 */
const routes = [
  // ==========================================
  // SECTION 1 - PAGES PRINCIPALES
  // ==========================================
  {
    type: 'title',
    title: 'Gestion Financière',
    key: 'financial-section',
  },
  {
    type: 'collapse',
    name: 'Dashboard',
    key: 'dashboard',
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: '/dashboard',
    component: <Dashboard />,
  },
  {
    type: 'collapse',
    name: 'Comptes Bancaires',
    key: 'accounts',
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: '/accounts',
    component: <Accounts />,
  },
  {
    type: 'collapse',
    name: 'Transactions',
    key: 'transactions',
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: '/transactions',
    component: <Transactions />,
  },
  {
    type: 'collapse',
    name: 'Budgets',
    key: 'budgets',
    icon: <Icon fontSize="small">pie_chart</Icon>,
    route: '/budgets',
    component: <Budgets />,
  },

  // ==========================================
  // SECTION 2 - FONCTIONNALITÉS AVANCÉES
  // ==========================================
  {
    type: 'divider',
    key: 'divider-1',
  },
  {
    type: 'title',
    title: 'Fonctionnalités Avancées',
    key: 'advanced-section',
  },
  {
    type: 'collapse',
    name: 'Sols & Tontines',
    key: 'sols',
    icon: <Icon fontSize="small">people</Icon>,
    route: '/sols',
    component: <Sols />,
  },
  {
    type: 'collapse',
    name: 'Investissements',
    key: 'investments',
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: '/investments',
    component: <Investments />,
  },
  {
    type: 'collapse',
    name: 'Éducation Financière',
    key: 'education',
    icon: <Icon fontSize="small">school</Icon>,
    route: '/education',
    component: <Education />,
  },

  // ==========================================
  // SECTION 3 - COMPTE UTILISATEUR
  // ==========================================
  {
    type: 'divider',
    key: 'divider-2',
  },
  {
    type: 'title',
    title: 'Mon Compte',
    key: 'account-section',
  },
  {
    type: 'collapse',
    name: 'Profil',
    key: 'profile',
    icon: <Icon fontSize="small">person</Icon>,
    route: '/profile',
    component: <Profile />,
  },

  // ==========================================
  // ROUTES CACHÉES (pas dans menu)
  // ==========================================
  
  // Authentication routes
  {
    type: 'route',
    key: 'sign-in',
    route: '/authentication/sign-in',
    component: <SignIn />,
  },
  {
    type: 'route',
    key: 'sign-up',
    route: '/authentication/sign-up',
    component: <SignUp />,
  },
];

export default routes;