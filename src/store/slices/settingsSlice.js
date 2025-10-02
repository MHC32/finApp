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
    USD: 135, // Example rate
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
    firstDayOfWeek: 1, // 0 = Sunday, 1 = Monday
  },
  
  // Budget Settings
  budget: {
    defaultPeriod: 'monthly', // weekly, monthly, yearly
    showWarningsAt: 80, // Show warning at 80% of budget
    carryOverUnspent: false,
  },
  
  // Sol Settings
  sol: {
    defaultCycle: 'monthly', // weekly, biweekly, monthly
    reminderDays: [1, 15], // Days of month for reminders
    autoCalculateShares: true,
  },
  
  // Export Settings
  export: {
    defaultFormat: 'pdf', // pdf, excel, csv
    includeCharts: true,
    includeNotes: false,
  },
};

/**
 * Settings Slice
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    /**
     * Update Currency
     */
    setPreferredCurrency: (state, action) => {
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

    /**
     * Set Language
     */
    setLanguage: (state, action) => {
      const language = action.payload;
      if (SUPPORTED_LANGUAGES.includes(language)) {
        state.language = language;
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
        // Update document lang attribute
        document.documentElement.lang = language;
      }
    },

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
     * Toggle specific notification
     */
    toggleNotification: (state, action) => {
      const notificationType = action.payload;
      if (state.notifications.hasOwnProperty(notificationType)) {
        state.notifications[notificationType] = !state.notifications[notificationType];
      }
    },

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
     * Disable Welcome Tour
     */
    disableWelcomeTour: (state) => {
      state.display.showWelcomeTour = false;
    },

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
     * Update Sol Settings
     */
    updateSolSettings: (state, action) => {
      state.sol = {
        ...state.sol,
        ...action.payload,
      };
    },

    /**
     * Update Export Settings
     */
    updateExportSettings: (state, action) => {
      state.export = {
        ...state.export,
        ...action.payload,
      };
    },

    /**
     * Reset All Settings
     */
    resetSettings: () => initialState,

    /**
     * Import Settings
     * Permet d'importer des settings depuis un backup
     */
    importSettings: (state, action) => {
      const importedSettings = action.payload;
      
      // Validate and merge settings
      return {
        ...initialState,
        ...importedSettings,
        // Ensure critical settings are valid
        preferredCurrency: SUPPORTED_CURRENCIES.includes(importedSettings.preferredCurrency)
          ? importedSettings.preferredCurrency
          : DEFAULT_CURRENCY,
        language: SUPPORTED_LANGUAGES.includes(importedSettings.language)
          ? importedSettings.language
          : 'fr',
      };
    },
  },
});

/**
 * Export Actions
 */
export const {
  setPreferredCurrency,
  updateExchangeRates,
  setLanguage,
  updateNotificationSettings,
  toggleNotification,
  updatePrivacySettings,
  updateDisplaySettings,
  toggleCompactMode,
  disableWelcomeTour,
  updateBudgetSettings,
  updateSolSettings,
  updateExportSettings,
  resetSettings,
  importSettings,
} = settingsSlice.actions;

/**
 * Selectors
 */
export const selectPreferredCurrency = (state) => state.settings.preferredCurrency;
export const selectExchangeRates = (state) => state.settings.exchangeRates;
export const selectLanguage = (state) => state.settings.language;
export const selectNotificationSettings = (state) => state.settings.notifications;
export const selectPrivacySettings = (state) => state.settings.privacy;
export const selectDisplaySettings = (state) => state.settings.display;
export const selectBudgetSettings = (state) => state.settings.budget;
export const selectSolSettings = (state) => state.settings.sol;
export const selectExportSettings = (state) => state.settings.export;
export const selectCompactMode = (state) => state.settings.display.compactMode;
export const selectShowWelcomeTour = (state) => state.settings.display.showWelcomeTour;

/**
 * Selector avec calcul : convertir un montant
 */
export const selectConvertedAmount = (amount, fromCurrency, toCurrency) => (state) => {
  const rates = state.settings.exchangeRates;
  const htgAmount = amount / rates[fromCurrency]; // Convert to HTG first
  return htgAmount * rates[toCurrency]; // Then to target currency
};

/**
 * Export Reducer
 */
export default settingsSlice.reducer;