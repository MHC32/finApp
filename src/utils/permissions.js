// src/utils/permissions.js
/**
 * Système de permissions FinApp Haiti
 * Aligné avec la structure backend et le modèle User
 * 
 * Rôles définis dans le backend:
 * - admin: Accès complet
 * - user: Utilisateur standard
 * - manager: Gestionnaire (à implémenter)
 * - support: Support client (à implémenter)
 */

// ===================================================================
// RÔLES UTILISATEURS
// ===================================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager', // Pour gestion de groupes/sols
  SUPPORT: 'support'  // Support client
};

// ===================================================================
// PERMISSIONS PAR MODULE
// ===================================================================

export const PERMISSIONS = {
  // =================================================================
  // ADMINISTRATION
  // =================================================================
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_USERS: 'admin:users',
  ADMIN_ANALYTICS: 'admin:analytics',
  ADMIN_SETTINGS: 'admin:settings',

  // =================================================================
  // COMPTES BANCAIRES
  // =================================================================
  ACCOUNTS_VIEW: 'accounts:view',
  ACCOUNTS_CREATE: 'accounts:create',
  ACCOUNTS_EDIT: 'accounts:edit',
  ACCOUNTS_DELETE: 'accounts:delete',
  ACCOUNTS_TRANSFER: 'accounts:transfer',

  // =================================================================
  // TRANSACTIONS
  // =================================================================
  TRANSACTIONS_VIEW: 'transactions:view',
  TRANSACTIONS_CREATE: 'transactions:create',
  TRANSACTIONS_EDIT: 'transactions:edit',
  TRANSACTIONS_DELETE: 'transactions:delete',
  TRANSACTIONS_CATEGORIZE: 'transactions:categorize',

  // =================================================================
  // BUDGETS
  // =================================================================
  BUDGETS_VIEW: 'budgets:view',
  BUDGETS_CREATE: 'budgets:create',
  BUDGETS_EDIT: 'budgets:edit',
  BUDGETS_DELETE: 'budgets:delete',

  // =================================================================
  // SOLS (TONTINES) - SPÉCIFIQUE HAÏTI
  // =================================================================
  SOLS_VIEW: 'sols:view',
  SOLS_CREATE: 'sols:create',
  SOLS_JOIN: 'sols:join',
  SOLS_MANAGE: 'sols:manage',
  SOLS_INVITE: 'sols:invite',
  SOLS_TRANSACTIONS: 'sols:transactions',

  // =================================================================
  // DETTES & CRÉDITS
  // =================================================================
  DEBTS_VIEW: 'debts:view',
  DEBTS_CREATE: 'debts:create',
  DEBTS_EDIT: 'debts:edit',
  DEBTS_DELETE: 'debts:delete',
  DEBTS_SETTLE: 'debts:settle',

  // =================================================================
  // INVESTISSEMENTS
  // =================================================================
  INVESTMENTS_VIEW: 'investments:view',
  INVESTMENTS_CREATE: 'investments:create',
  INVESTMENTS_EDIT: 'investments:edit',
  INVESTMENTS_DELETE: 'investments:delete',

  // =================================================================
  // PROFIL & PARAMÈTRES
  // =================================================================
  PROFILE_VIEW: 'profile:view',
  PROFILE_EDIT: 'profile:edit',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',

  // =================================================================
  // IA & ANALYTICS
  // =================================================================
  AI_USE: 'ai:use',
  ANALYTICS_VIEW: 'analytics:view',
  REPORTS_GENERATE: 'reports:generate',

  // =================================================================
  // NOTIFICATIONS
  // =================================================================
  NOTIFICATIONS_VIEW: 'notifications:view',
  NOTIFICATIONS_MANAGE: 'notifications:manage'
};

// ===================================================================
// DÉFINITION DES PERMISSIONS DE BASE PAR RÔLE
// ===================================================================

// Permissions de base pour chaque rôle (sans dépendances circulaires)
const BASE_ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Administration
    PERMISSIONS.ADMIN_DASHBOARD,
    PERMISSIONS.ADMIN_USERS,
    PERMISSIONS.ADMIN_ANALYTICS,
    PERMISSIONS.ADMIN_SETTINGS,

    // Comptes - Tous les droits
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_CREATE,
    PERMISSIONS.ACCOUNTS_EDIT,
    PERMISSIONS.ACCOUNTS_DELETE,
    PERMISSIONS.ACCOUNTS_TRANSFER,

    // Transactions - Tous les droits
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_CREATE,
    PERMISSIONS.TRANSACTIONS_EDIT,
    PERMISSIONS.TRANSACTIONS_DELETE,
    PERMISSIONS.TRANSACTIONS_CATEGORIZE,

    // Budgets - Tous les droits
    PERMISSIONS.BUDGETS_VIEW,
    PERMISSIONS.BUDGETS_CREATE,
    PERMISSIONS.BUDGETS_EDIT,
    PERMISSIONS.BUDGETS_DELETE,

    // Sols - Tous les droits
    PERMISSIONS.SOLS_VIEW,
    PERMISSIONS.SOLS_CREATE,
    PERMISSIONS.SOLS_JOIN,
    PERMISSIONS.SOLS_MANAGE,
    PERMISSIONS.SOLS_INVITE,
    PERMISSIONS.SOLS_TRANSACTIONS,

    // Dettes - Tous les droits
    PERMISSIONS.DEBTS_VIEW,
    PERMISSIONS.DEBTS_CREATE,
    PERMISSIONS.DEBTS_EDIT,
    PERMISSIONS.DEBTS_DELETE,
    PERMISSIONS.DEBTS_SETTLE,

    // Investissements - Tous les droits
    PERMISSIONS.INVESTMENTS_VIEW,
    PERMISSIONS.INVESTMENTS_CREATE,
    PERMISSIONS.INVESTMENTS_EDIT,
    PERMISSIONS.INVESTMENTS_DELETE,

    // Profil & Settings - Tous les droits
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,

    // IA & Analytics - Tous les droits
    PERMISSIONS.AI_USE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,

    // Notifications - Tous les droits
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_MANAGE
  ],

  [USER_ROLES.USER]: [
    // Comptes - Gestion personnelle
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_CREATE,
    PERMISSIONS.ACCOUNTS_EDIT,
    PERMISSIONS.ACCOUNTS_DELETE,
    PERMISSIONS.ACCOUNTS_TRANSFER,

    // Transactions - Gestion personnelle
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_CREATE,
    PERMISSIONS.TRANSACTIONS_EDIT,
    PERMISSIONS.TRANSACTIONS_DELETE,
    PERMISSIONS.TRANSACTIONS_CATEGORIZE,

    // Budgets - Gestion personnelle
    PERMISSIONS.BUDGETS_VIEW,
    PERMISSIONS.BUDGETS_CREATE,
    PERMISSIONS.BUDGETS_EDIT,
    PERMISSIONS.BUDGETS_DELETE,

    // Sols - Participation et création
    PERMISSIONS.SOLS_VIEW,
    PERMISSIONS.SOLS_CREATE,
    PERMISSIONS.SOLS_JOIN,
    PERMISSIONS.SOLS_TRANSACTIONS,

    // Dettes - Gestion personnelle
    PERMISSIONS.DEBTS_VIEW,
    PERMISSIONS.DEBTS_CREATE,
    PERMISSIONS.DEBTS_EDIT,
    PERMISSIONS.DEBTS_DELETE,
    PERMISSIONS.DEBTS_SETTLE,

    // Investissements - Gestion personnelle
    PERMISSIONS.INVESTMENTS_VIEW,
    PERMISSIONS.INVESTMENTS_CREATE,
    PERMISSIONS.INVESTMENTS_EDIT,
    PERMISSIONS.INVESTMENTS_DELETE,

    // Profil & Settings - Gestion personnelle
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,

    // IA & Analytics - Usage personnel
    PERMISSIONS.AI_USE,
    PERMISSIONS.ANALYTICS_VIEW,

    // Notifications - Gestion personnelle
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_MANAGE
  ],

  [USER_ROLES.MANAGER]: [
    // Permissions de base (copie manuelle pour éviter dépendance circulaire)
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_CREATE,
    PERMISSIONS.ACCOUNTS_EDIT,
    PERMISSIONS.ACCOUNTS_DELETE,
    PERMISSIONS.ACCOUNTS_TRANSFER,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_CREATE,
    PERMISSIONS.TRANSACTIONS_EDIT,
    PERMISSIONS.TRANSACTIONS_DELETE,
    PERMISSIONS.TRANSACTIONS_CATEGORIZE,
    PERMISSIONS.BUDGETS_VIEW,
    PERMISSIONS.BUDGETS_CREATE,
    PERMISSIONS.BUDGETS_EDIT,
    PERMISSIONS.BUDGETS_DELETE,
    PERMISSIONS.SOLS_VIEW,
    PERMISSIONS.SOLS_CREATE,
    PERMISSIONS.SOLS_JOIN,
    PERMISSIONS.SOLS_TRANSACTIONS,
    PERMISSIONS.DEBTS_VIEW,
    PERMISSIONS.DEBTS_CREATE,
    PERMISSIONS.DEBTS_EDIT,
    PERMISSIONS.DEBTS_DELETE,
    PERMISSIONS.DEBTS_SETTLE,
    PERMISSIONS.INVESTMENTS_VIEW,
    PERMISSIONS.INVESTMENTS_CREATE,
    PERMISSIONS.INVESTMENTS_EDIT,
    PERMISSIONS.INVESTMENTS_DELETE,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.AI_USE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_MANAGE,

    // Permissions supplémentaires pour gestion de groupes
    PERMISSIONS.SOLS_MANAGE,
    PERMISSIONS.SOLS_INVITE,
    PERMISSIONS.REPORTS_GENERATE
  ],

  [USER_ROLES.SUPPORT]: [
    // Permissions limitées pour support
    PERMISSIONS.ADMIN_DASHBOARD, // Dashboard limité
    PERMISSIONS.ADMIN_USERS, // Vue utilisateurs seulement
    PERMISSIONS.ANALYTICS_VIEW,
    
    // Accès en lecture seule aux données
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.BUDGETS_VIEW,
    PERMISSIONS.SOLS_VIEW,
    PERMISSIONS.DEBTS_VIEW,
    PERMISSIONS.INVESTMENTS_VIEW
  ]
};

// ===================================================================
// MAPPING RÔLES → PERMISSIONS (export final)
// ===================================================================

export const ROLE_PERMISSIONS = { ...BASE_ROLE_PERMISSIONS };

// ===================================================================
// FONCTIONS UTILITAIRES
// ===================================================================

/**
 * Vérifie si un utilisateur a une permission spécifique
 * @param {Object} user - Objet utilisateur (doit contenir role)
 * @param {string} permission - Permission à vérifier
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Vérifie si un utilisateur a au moins une des permissions
 * @param {Object} user - Objet utilisateur
 * @param {string[]} permissions - Liste de permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Vérifie si un utilisateur a toutes les permissions
 * @param {Object} user - Objet utilisateur
 * @param {string[]} permissions - Liste de permissions
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Filtre les routes accessibles pour un utilisateur
 * @param {Object[]} routes - Liste de routes
 * @param {Object} user - Utilisateur connecté
 * @returns {Object[]} Routes accessibles
 */
export const filterAccessibleRoutes = (routes, user) => {
  return routes.filter(route => {
    if (!route.meta || !route.meta.permission) {
      return true; // Pas de permission requise = accessible
    }
    
    return hasPermission(user, route.meta.permission);
  });
};

/**
 * Obtient les permissions d'un rôle spécifique
 * @param {string} role - Rôle utilisateur
 * @returns {string[]} Liste des permissions
 */
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Vérifie si l'utilisateur est admin
 * @param {Object} user - Utilisateur
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN;
};

/**
 * Vérifie si l'utilisateur peut gérer les sols (créateur ou manager)
 * @param {Object} user - Utilisateur
 * @param {Object} sol - Objet sol (optionnel)
 * @returns {boolean}
 */
export const canManageSol = (user, sol = null) => {
  if (!user) return false;
  
  // Admin peut tout gérer
  if (isAdmin(user)) return true;
  
  // Manager a la permission générale
  if (hasPermission(user, PERMISSIONS.SOLS_MANAGE)) return true;
  
  // Vérifier si utilisateur est créateur du sol
  if (sol && sol.createdBy === user.userId) return true;
  
  return false;
};

// ===================================================================
// EXPORT PAR DÉFAUT
// ===================================================================

export default {
  USER_ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  filterAccessibleRoutes,
  getPermissionsForRole,
  isAdmin,
  canManageSol
};