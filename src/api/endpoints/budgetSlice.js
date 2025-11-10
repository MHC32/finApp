// src/api/endpoints/budgetApi.js
import api from '../axios';

// ===================================================================
// ENDPOINTS DES BUDGETS
// ===================================================================

/**
 * Créer un nouveau budget
 * @param {Object} data - Données du budget
 * @param {string} data.name - Nom du budget
 * @param {string} data.description - Description
 * @param {string} data.currency - Devise (HTG/USD)
 * @param {string} data.period - Période (weekly/monthly/quarterly/yearly)
 * @param {Date} data.startDate - Date de début
 * @param {Date} data.endDate - Date de fin
 * @param {number} data.expectedIncome - Revenus attendus
 * @param {Array} data.categories - Catégories budgétaires
 * @param {Object} data.alertSettings - Paramètres d'alertes
 * @param {Object} data.savingsGoal - Objectif d'épargne
 * @param {Array} data.tags - Tags
 * @returns {Promise}
 */
export const createBudget = (data) => {
  return api.post('/budgets', data);
};

/**
 * Créer budget depuis template
 * @param {Object} data - Données de création
 * @param {string} data.templateName - Nom du template
 * @param {Object} data.customData - Données personnalisées
 * @returns {Promise}
 */
export const createBudgetFromTemplate = (data) => {
  return api.post('/budgets/from-template', data);
};

/**
 * Récupérer les budgets de l'utilisateur
 * @param {Object} params - Paramètres de filtrage
 * @param {number} params.page - Page
 * @param {number} params.limit - Limite par page
 * @param {string} params.status - Statut (active/completed/exceeded/paused/archived/all)
 * @param {string} params.period - Période
 * @param {string} params.sort - Champ de tri
 * @param {boolean} params.includeArchived - Inclure archivés
 * @returns {Promise}
 */
export const getBudgets = (params = {}) => {
  return api.get('/budgets/list', { params });
};

/**
 * Récupérer un budget spécifique
 * @param {string} budgetId - ID du budget
 * @returns {Promise}
 */
export const getBudgetById = (budgetId) => {
  return api.get(`/budgets/${budgetId}`);
};

/**
 * Mettre à jour un budget
 * @param {string} budgetId - ID du budget
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise}
 */
export const updateBudget = (budgetId, data) => {
  return api.put(`/budgets/${budgetId}`, data);
};

/**
 * Supprimer un budget
 * @param {string} budgetId - ID du budget
 * @returns {Promise}
 */
export const deleteBudget = (budgetId) => {
  return api.delete(`/budgets/${budgetId}`);
};

/**
 * Ajuster budget d'une catégorie
 * @param {string} budgetId - ID du budget
 * @param {Object} data - Données d'ajustement
 * @param {string} data.category - Catégorie à ajuster
 * @param {number} data.newAmount - Nouveau montant
 * @param {string} data.reason - Raison de l'ajustement
 * @returns {Promise}
 */
export const adjustCategoryBudget = (budgetId, data) => {
  return api.put(`/budgets/${budgetId}/adjust-category`, data);
};

/**
 * Créer snapshot mensuel
 * @param {string} budgetId - ID du budget
 * @returns {Promise}
 */
export const createBudgetSnapshot = (budgetId) => {
  return api.post(`/budgets/${budgetId}/snapshot`);
};

/**
 * Archiver/désarchiver un budget
 * @param {string} budgetId - ID du budget
 * @param {Object} data - Données d'archivage
 * @param {boolean} data.archive - true pour archiver, false pour désarchiver
 * @returns {Promise}
 */
export const toggleArchiveBudget = (budgetId, data = {}) => {
  return api.put(`/budgets/${budgetId}/archive`, data);
};

// ===================================================================
// ANALYTICS BUDGETS
// ===================================================================

/**
 * Analytics de progression des budgets
 * @param {Object} params - Paramètres
 * @param {string} params.period - Période (current/last_month/last_quarter/custom)
 * @param {string} params.category - Catégorie spécifique
 * @returns {Promise}
 */
export const getBudgetProgress = (params = {}) => {
  return api.get('/budgets/analytics/progress', { params });
};

/**
 * Analytics par période et tendances
 * @param {Object} params - Paramètres
 * @param {number} params.months - Nombre de mois (1-24)
 * @returns {Promise}
 */
export const getBudgetTrends = (params = {}) => {
  return api.get('/budgets/analytics/trends', { params });
};

/**
 * Budgets nécessitant attention
 * @returns {Promise}
 */
export const getBudgetAlerts = () => {
  return api.get('/budgets/alerts');
};

// ===================================================================
// TEMPLATES ET UTILS
// ===================================================================

/**
 * Obtenir templates disponibles
 * @returns {Promise}
 */
export const getBudgetTemplates = () => {
  return api.get('/budgets/templates');
};

/**
 * Statistiques utilisateur globales
 * @returns {Promise}
 */
export const getUserBudgetStats = () => {
  return api.get('/budgets/stats');
};

// ===================================================================
// ADMIN ENDPOINTS
// ===================================================================

/**
 * Statistiques admin globales
 * @returns {Promise}
 */
export const getAdminBudgetStats = () => {
  return api.get('/budgets/admin/stats');
};

// ===================================================================
// VALIDATION ET UTILITAIRES
// ===================================================================

/**
 * Valider les données d'un budget
 * @param {Object} data - Données à valider
 * @returns {Promise}
 */
export const validateBudgetData = (data) => {
  return api.post('/budgets/validate', data);
};

/**
 * Vérifier conflits de période
 * @param {Object} params - Paramètres
 * @param {Date} params.startDate - Date de début
 * @param {Date} params.endDate - Date de fin
 * @param {string} params.period - Période
 * @returns {Promise}
 */
export const checkPeriodConflicts = (params = {}) => {
  return api.get('/budgets/check-conflicts', { params });
};

// ===================================================================
// EXPORT PAR DÉFAUT (objet groupé)
// ===================================================================

const budgetApi = {
  // CRUD
  createBudget,
  createBudgetFromTemplate,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  
  // Actions spéciales
  adjustCategoryBudget,
  createBudgetSnapshot,
  toggleArchiveBudget,
  
  // Analytics
  getBudgetProgress,
  getBudgetTrends,
  getBudgetAlerts,
  
  // Templates et utils
  getBudgetTemplates,
  getUserBudgetStats,
  
  // Admin
  getAdminBudgetStats,
  
  // Validation
  validateBudgetData,
  checkPeriodConflicts
};

export default budgetApi;