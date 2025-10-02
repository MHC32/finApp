/**
 * =========================================================
 * FinApp Haiti - React Query Configuration
 * Configuration du QueryClient pour TanStack Query
 * =========================================================
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Configuration par défaut pour toutes les queries
 */
const defaultQueryOptions = {
  queries: {
    // Temps avant que les données soient considérées comme stale (5 minutes)
    staleTime: 5 * 60 * 1000,
    
    // Temps avant que les données en cache soient supprimées (10 minutes)
    cacheTime: 10 * 60 * 1000,
    
    // Nombre de tentatives en cas d'échec
    retry: 1,
    
    // Délai entre les tentatives (ms)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch automatique quand la fenêtre reprend le focus
    refetchOnWindowFocus: false,
    
    // Refetch automatique lors de la reconnexion
    refetchOnReconnect: true,
    
    // Refetch automatique au montage du composant
    refetchOnMount: true,
    
    // Fonction pour déterminer si une erreur doit être retentée
    retryOnMount: true,
    
    // Ne pas suspendre pendant le chargement (pour éviter Suspense)
    suspense: false,
  },
  
  mutations: {
    // Nombre de tentatives pour les mutations
    retry: 0,
    
    // Fonction appelée en cas d'erreur de mutation
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  },
};

/**
 * Configuration du QueryClient
 */
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

/**
 * Query Keys Factory
 * Centralise la génération des query keys pour éviter les doublons
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
    transactions: (id, filters) => ['accounts', id, 'transactions', filters],
    balance: (id) => ['accounts', id, 'balance'],
  },
  
  // Transactions
  transactions: {
    all: ['transactions'],
    list: (filters) => ['transactions', 'list', filters],
    detail: (id) => ['transactions', 'detail', id],
    recent: (limit) => ['transactions', 'recent', limit],
    byCategory: (filters) => ['transactions', 'by-category', filters],
  },
  
  // Budgets
  budgets: {
    all: ['budgets'],
    list: (filters) => ['budgets', 'list', filters],
    detail: (id) => ['budgets', 'detail', id],
    progress: (id) => ['budgets', id, 'progress'],
    active: ['budgets', 'active'],
  },
  
  // Savings
  savings: {
    all: ['savings'],
    list: () => ['savings', 'list'],
    detail: (id) => ['savings', 'detail', id],
    progress: (id) => ['savings', id, 'progress'],
  },
  
  // Sols (Tontines)
  sols: {
    all: ['sols'],
    list: (filters) => ['sols', 'list', filters],
    detail: (id) => ['sols', 'detail', id],
    members: (id) => ['sols', id, 'members'],
    payments: (id, filters) => ['sols', id, 'payments', filters],
    calendar: (id) => ['sols', id, 'calendar'],
  },
  
  // Investments
  investments: {
    all: ['investments'],
    list: (filters) => ['investments', 'list', filters],
    detail: (id) => ['investments', 'detail', id],
    roi: (id) => ['investments', id, 'roi'],
  },
  
  // Stats & Analytics
  stats: {
    dashboard: (period) => ['stats', 'dashboard', period],
    overview: (filters) => ['stats', 'overview', filters],
    categories: (filters) => ['stats', 'categories', filters],
    trends: (period) => ['stats', 'trends', period],
    comparison: (filters) => ['stats', 'comparison', filters],
  },
  
  // Categories
  categories: {
    all: ['categories'],
    income: ['categories', 'income'],
    expense: ['categories', 'expense'],
  },
  
  // Exchange Rates
  exchangeRates: {
    current: ['exchange-rates', 'current'],
    history: (period) => ['exchange-rates', 'history', period],
  },
};

/**
 * Helpers pour invalidation de queries
 */
export const invalidateQueries = {
  // Invalider toutes les queries d'un domaine
  accounts: () => queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all }),
  transactions: () => queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }),
  budgets: () => queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all }),
  sols: () => queryClient.invalidateQueries({ queryKey: queryKeys.sols.all }),
  investments: () => queryClient.invalidateQueries({ queryKey: queryKeys.investments.all }),
  stats: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  
  // Invalider tout
  all: () => queryClient.invalidateQueries(),
};

/**
 * Helpers pour préfetching
 */
export const prefetchQueries = {
  // Précharger les données du dashboard
  dashboard: async (period = 'month') => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.stats.dashboard(period),
      // La fonction de fetch sera importée depuis le service
    });
  },
  
  // Précharger les comptes
  accounts: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.accounts.all,
      // La fonction de fetch sera importée depuis le service
    });
  },
};

/**
 * Configuration des mutations globales
 */
export const mutationConfig = {
  // Optimistic updates pour les mutations
  optimistic: {
    onMutate: async (newData) => {
      // Annuler les queries en cours
      // Sauvegarder snapshot pour rollback
      return { previousData: newData };
    },
    
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousData) {
        // Restaurer les données précédentes
      }
    },
    
    onSettled: () => {
      // Toujours refetch après mutation
      queryClient.invalidateQueries();
    },
  },
};

/**
 * DevTools configuration
 * Affiche React Query DevTools seulement en développement
 */
export const devToolsConfig = {
  initialIsOpen: false,
  position: 'bottom-right',
};

/**
 * Export du QueryClient configuré
 */
export default queryClient;