/**
 * =========================================================
 * FinApp Haiti - React Query Configuration
 * Configuration QueryClient pour gestion du cache et des appels API
 * =========================================================
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Configuration par défaut du QueryClient
 */
const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Temps avant qu'une requête soit considérée comme "stale"
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Temps avant que le cache soit supprimé (garbage collection)
      gcTime: 1000 * 60 * 30, // 30 minutes (anciennement cacheTime)
      
      // Retry logic
      retry: (failureCount, error) => {
        // Ne pas retry sur les erreurs 4xx (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry max 2 fois pour les autres erreurs
        return failureCount < 2;
      },
      
      // Délai entre les retries (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch automatique
      refetchOnWindowFocus: false, // Évite les refetch trop fréquents
      refetchOnReconnect: true,    // Refetch quand internet revient
      refetchOnMount: true,         // Refetch au montage du composant
      
      // Network mode
      networkMode: 'online', // Requêtes uniquement en ligne
      
      // Suspense (pour React Suspense)
      suspense: false,
      
      // UseErrorBoundary
      useErrorBoundary: false,
      
      // Fonction onError globale
      onError: (error) => {
        console.error('Query error:', error);
        // Ici vous pouvez ajouter du tracking ou notifications
      },
    },
    
    mutations: {
      // Retry pour mutations (généralement désactivé)
      retry: false,
      
      // Network mode
      networkMode: 'online',
      
      // useErrorBoundary
      useErrorBoundary: false,
      
      // Fonction onError globale pour mutations
      onError: (error) => {
        console.error('Mutation error:', error);
        // Tracking ou notifications
      },
      
      // onSuccess global (optionnel)
      onSuccess: () => {
        // console.log('Mutation successful');
      },
    },
  },
};

/**
 * Instance QueryClient
 */
export const queryClient = new QueryClient(queryClientConfig);

/**
 * Query Keys - Centralisées pour éviter les typos
 * Organisation par feature
 */
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'],
    profile: ['auth', 'profile'],
  },
  
  // Accounts
  accounts: {
    all: ['accounts'],
    list: (filters) => ['accounts', 'list', filters],
    detail: (id) => ['accounts', 'detail', id],
    summary: ['accounts', 'summary'],
    transactions: (accountId, filters) => ['accounts', accountId, 'transactions', filters],
  },
  
  // Transactions
  transactions: {
    all: ['transactions'],
    list: (filters) => ['transactions', 'list', filters],
    detail: (id) => ['transactions', 'detail', id],
    recent: (limit) => ['transactions', 'recent', limit],
    stats: (period) => ['transactions', 'stats', period],
  },
  
  // Budgets
  budgets: {
    all: ['budgets'],
    list: (filters) => ['budgets', 'list', filters],
    detail: (id) => ['budgets', 'detail', id],
    current: ['budgets', 'current'],
    summary: (period) => ['budgets', 'summary', period],
  },
  
  // Sols (Plans de paiement)
  sols: {
    all: ['sols'],
    list: (filters) => ['sols', 'list', filters],
    detail: (id) => ['sols', 'detail', id],
    active: ['sols', 'active'],
    upcoming: ['sols', 'upcoming'],
    statistics: ['sols', 'statistics'],
  },
  
  // Categories
  categories: {
    all: ['categories'],
    list: ['categories', 'list'],
    stats: (period) => ['categories', 'stats', period],
  },
  
  // Dashboard
  dashboard: {
    overview: ['dashboard', 'overview'],
    analytics: (period) => ['dashboard', 'analytics', period],
    recentActivity: ['dashboard', 'recent-activity'],
  },
  
  // Reports
  reports: {
    financial: (period) => ['reports', 'financial', period],
    spending: (params) => ['reports', 'spending', params],
    income: (params) => ['reports', 'income', params],
  },
  
  // AI
  ai: {
    suggestions: ['ai', 'suggestions'],
    analysis: (type) => ['ai', 'analysis', type],
  },
  
  // Settings
  settings: {
    all: ['settings'],
    notifications: ['settings', 'notifications'],
    privacy: ['settings', 'privacy'],
  },
};

/**
 * Helpers pour invalidation de cache
 */
export const invalidateQueries = {
  /**
   * Invalider toutes les requêtes d'un module
   */
  all: (module) => {
    queryClient.invalidateQueries({ queryKey: [module] });
  },
  
  /**
   * Invalider les comptes
   */
  accounts: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
  },
  
  /**
   * Invalider les transactions
   */
  transactions: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
  },
  
  /**
   * Invalider les budgets
   */
  budgets: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
  },
  
  /**
   * Invalider les sols
   */
  sols: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.sols.all });
  },
  
  /**
   * Invalider le dashboard
   */
  dashboard: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
  },
  
  /**
   * Invalider tout après login/logout
   */
  afterAuth: () => {
    queryClient.clear(); // Clear tout le cache
  },
};

/**
 * Helpers pour préfetch
 */
export const prefetchQueries = {
  /**
   * Précharger les données du dashboard
   */
  dashboard: async (fetchFn) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.overview,
      queryFn: fetchFn,
    });
  },
  
  /**
   * Précharger les comptes
   */
  accounts: async (fetchFn) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.accounts.all,
      queryFn: fetchFn,
    });
  },
};

/**
 * Export du client et des utilitaires
 */
export default queryClient;