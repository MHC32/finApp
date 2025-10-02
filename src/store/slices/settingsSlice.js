/**
 * =========================================================
 * FinApp Haiti - Settings Slice
 * Gestion des paramètres utilisateur
 * =========================================================
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Constantes
 */
const STORAGE_KEYS = {
  CURRENCY_PREFERENCE: 'finapp_currency_pref',
  LANGUAGE: 'finapp_language',
};

const DEFAULT_CURRENCY = 'HTG';
const SUPPORTED_LANGUAGES = ['fr', 'ht', 'en'];
const SUPPORTED_CURRENCIES = ['HTG', 'USD', 'EUR', 'CAD'];

/**
 * Initial State
 */
const initialState = {
  // Currency Settings
  preferredCurrency: DEFAULT_CURRENCY,
  exchangeRates: {
    HTG: 1,
    USD: 135,
    EUR: 145,
    CAD: 100,
  },
  
  // Language Settings
  language: 'fr',
  
  // Notification Settings
  notifications: {
    email: true,
    push: true,
    budgetAlerts: true,
    solReminders: true,
    transactionNotifications: true,
  },
  
  // Privacy Settings
  privacy: {
    shareAnalytics: false,
    publicProfile: false,
  },
  
  // Display Settings
  display: {
    compactMode: false,
    showWelcomeTour: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    firstDayOfWeek: 1,
  },
  
  // Budget Settings
  budget: {
    defaultPeriod: 'monthly',
    showWarningsAt: 80,
    categoriesOrder: [],
  },
  
  // Transaction Settings
  transaction: {
    defaultCategory: null,
    requireNotes: false,
    autoClassify: true,
  },
  
  // Loading States
  isLoading: false,
  isSaving: false,
  
  // Error Handling
  error: null,
};

/**
 * Settings Slice
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // ==========================================
    // CURRENCY SETTINGS
    // ==========================================

    /**
     * Set Preferred Currency
     */
    setCurrency: (state, action) => {
      const currency = action.payload;
      if (SUPPORTED_CURRENCIES.includes(currency)) {
        state.preferredCurrency = currency;
        localStorage.setItem(STORAGE_KEYS.CURRENCY_PREFERENCE, currency);
      }
    },

    /**
     * Update Exchange Rates
     */
    updateExchangeRates: (state, action) => {
      state.exchangeRates = {
        ...state.exchangeRates,
        ...action.payload,
      };
    },

    // ==========================================
    // LANGUAGE SETTINGS
    // ==========================================

    /**
     * Set Language
     */
    setLanguage: (state, action) => {
      const language = action.payload;
      if (SUPPORTED_LANGUAGES.includes(language)) {
        state.language = language;
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      }
    },

    // ==========================================
    // NOTIFICATION SETTINGS
    // ==========================================

    /**
     * Update Notification Settings
     */
    updateNotificationSettings: (state, action) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },

    /**
     * Toggle Specific Notification
     */
    toggleNotification: (state, action) => {
      const { type } = action.payload;
      if (state.notifications[type] !== undefined) {
        state.notifications[type] = !state.notifications[type];
      }
    },

    /**
     * Enable All Notifications
     */
    enableAllNotifications: (state) => {
      Object.keys(state.notifications).forEach((key) => {
        state.notifications[key] = true;
      });
    },

    /**
     * Disable All Notifications
     */
    disableAllNotifications: (state) => {
      Object.keys(state.notifications).forEach((key) => {
        state.notifications[key] = false;
      });
    },

    // ==========================================
    // PRIVACY SETTINGS
    // ==========================================

    /**
     * Update Privacy Settings
     */
    updatePrivacySettings: (state, action) => {
      state.privacy = {
        ...state.privacy,
        ...action.payload,
      };
    },

    /**
     * Toggle Privacy Setting
     */
    togglePrivacySetting: (state, action) => {
      const { setting } = action.payload;
      if (state.privacy[setting] !== undefined) {
        state.privacy[setting] = !state.privacy[setting];
      }
    },

    // ==========================================
    // DISPLAY SETTINGS
    // ==========================================

    /**
     * Update Display Settings
     */
    updateDisplaySettings: (state, action) => {
      state.display = {
        ...state.display,
        ...action.payload,
      };
    },

    /**
     * Toggle Compact Mode
     */
    toggleCompactMode: (state) => {
      state.display.compactMode = !state.display.compactMode;
    },

    /**
     * Hide Welcome Tour
     */
    hideWelcomeTour: (state) => {
      state.display.showWelcomeTour = false;
    },

    /**
     * Set Date Format
     */
    setDateFormat: (state, action) => {
      state.display.dateFormat = action.payload;
    },

    /**
     * Set Time Format
     */
    setTimeFormat: (state, action) => {
      state.display.timeFormat = action.payload;
    },

    /**
     * Set First Day of Week
     */
    setFirstDayOfWeek: (state, action) => {
      state.display.firstDayOfWeek = action.payload;
    },

    // ==========================================
    // BUDGET SETTINGS
    // ==========================================

    /**
     * Update Budget Settings
     */
    updateBudgetSettings: (state, action) => {
      state.budget = {
        ...state.budget,
        ...action.payload,
      };
    },

    /**
     * Set Default Budget Period
     */
    setDefaultBudgetPeriod: (state, action) => {
      state.budget.defaultPeriod = action.payload;
    },

    /**
     * Set Budget Warning Threshold
     */
    setBudgetWarningThreshold: (state, action) => {
      state.budget.showWarningsAt = action.payload;
    },

    /**
     * Update Categories Order
     */
    updateCategoriesOrder: (state, action) => {
      state.budget.categoriesOrder = action.payload;
    },

    // ==========================================
    // TRANSACTION SETTINGS
    // ==========================================

    /**
     * Update Transaction Settings
     */
    updateTransactionSettings: (state, action) => {
      state.transaction = {
        ...state.transaction,
        ...action.payload,
      };
    },

    /**
     * Set Default Category
     */
    setDefaultCategory: (state, action) => {
      state.transaction.defaultCategory = action.payload;
    },

    /**
     * Toggle Require Notes
     */
    toggleRequireNotes: (state) => {
      state.transaction.requireNotes = !state.transaction.requireNotes;
    },

    /**
     * Toggle Auto Classify
     */
    toggleAutoClassify: (state) => {
      state.transaction.autoClassify = !state.transaction.autoClassify;
    },

    // ==========================================
    // LOADING STATES
    // ==========================================

    /**
     * Set Loading
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    /**
     * Set Saving
     */
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },

    // ==========================================
    // ERROR HANDLING
    // ==========================================

    /**
     * Set Error
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSaving = false;
    },

    /**
     * Clear Error
     */
    clearError: (state) => {
      state.error = null;
    },

    // ==========================================
    // RESET
    // ==========================================

    /**
     * Reset Settings to Default
     */
    resetSettings: () => initialState,

    /**
     * Reset Specific Section
     */
    resetSection: (state, action) => {
      const section = action.payload;
      if (initialState[section]) {
        state[section] = initialState[section];
      }
    },
  },
});

/**
 * Export Actions
 */
export const {
  setCurrency,
  updateExchangeRates,
  setLanguage,
  updateNotificationSettings,
  toggleNotification,
  enableAllNotifications,
  disableAllNotifications,
  updatePrivacySettings,
  togglePrivacySetting,
  updateDisplaySettings,
  toggleCompactMode,
  hideWelcomeTour,
  setDateFormat,
  setTimeFormat,
  setFirstDayOfWeek,
  updateBudgetSettings,
  setDefaultBudgetPeriod,
  setBudgetWarningThreshold,
  updateCategoriesOrder,
  updateTransactionSettings,
  setDefaultCategory,
  toggleRequireNotes,
  toggleAutoClassify,
  setLoading,
  setSaving,
  setError,
  clearError,
  resetSettings,
  resetSection,
} = settingsSlice.actions;

/**
 * Selectors
 */
export const selectPreferredCurrency = (state) => state.settings.preferredCurrency;
export const selectExchangeRates = (state) => state.settings.exchangeRates;
export const selectLanguage = (state) => state.settings.language;
export const selectNotifications = (state) => state.settings.notifications;
export const selectPrivacy = (state) => state.settings.privacy;
export const selectDisplay = (state) => state.settings.display;
export const selectBudgetSettings = (state) => state.settings.budget;
export const selectTransactionSettings = (state) => state.settings.transaction;
export const selectSettingsLoading = (state) => state.settings.isLoading;
export const selectSettingsSaving = (state) => state.settings.isSaving;
export const selectSettingsError = (state) => state.settings.error;

/**
 * Export Reducer
 */
export default settingsSlice.reducer;