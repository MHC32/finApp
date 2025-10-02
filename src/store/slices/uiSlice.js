/**
 * =========================================================
 * FinApp Haiti - UI Slice
 * Gestion de l'état UI (remplace progressivement le Context)
 * =========================================================
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial State
 */
const initialState = {
  // Navigation
  sidenavOpen: true,
  miniSidenav: false,
  
  // Theme
  darkMode: false,
  themeColor: 'info', // info, primary, success, warning, error
  transparentNavbar: true,
  fixedNavbar: false,
  
  // Modals
  modals: {
    addAccount: false,
    addTransaction: false,
    addBudget: false,
    addSol: false,
    quickTransaction: false,
  },
  
  // Loading
  globalLoading: false,
  pageLoading: false,
  
  // Toasts/Notifications
  toastQueue: [],
};

/**
 * UI Slice
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ==========================================
    // NAVIGATION
    // ==========================================
    
    /**
     * Toggle Sidenav
     */
    toggleSidenav: (state) => {
      state.sidenavOpen = !state.sidenavOpen;
    },

    /**
     * Set Sidenav Open
     */
    setSidenavOpen: (state, action) => {
      state.sidenavOpen = action.payload;
    },

    /**
     * Toggle Mini Sidenav
     */
    toggleMiniSidenav: (state) => {
      state.miniSidenav = !state.miniSidenav;
    },

    /**
     * Set Mini Sidenav
     */
    setMiniSidenav: (state, action) => {
      state.miniSidenav = action.payload;
    },

    // ==========================================
    // THEME
    // ==========================================

    /**
     * Toggle Dark Mode
     */
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },

    /**
     * Set Dark Mode
     */
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },

    /**
     * Set Theme Color
     */
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
    },

    /**
     * Set Transparent Navbar
     */
    setTransparentNavbar: (state, action) => {
      state.transparentNavbar = action.payload;
    },

    /**
     * Set Fixed Navbar
     */
    setFixedNavbar: (state, action) => {
      state.fixedNavbar = action.payload;
    },

    // ==========================================
    // MODALS
    // ==========================================

    /**
     * Open Modal
     */
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },

    /**
     * Close Modal
     */
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },

    /**
     * Close All Modals
     */
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },

    /**
     * Toggle Modal
     */
    toggleModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = !state.modals[modalName];
      }
    },

    // ==========================================
    // LOADING
    // ==========================================

    /**
     * Set Global Loading
     */
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    /**
     * Set Page Loading
     */
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },

    // ==========================================
    // TOASTS/NOTIFICATIONS
    // ==========================================

    /**
     * Add Toast
     */
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info', // success, error, warning, info
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: Date.now(),
      };
      state.toastQueue.push(toast);
    },

    /**
     * Remove Toast
     */
    removeToast: (state, action) => {
      state.toastQueue = state.toastQueue.filter(
        (toast) => toast.id !== action.payload
      );
    },

    /**
     * Clear All Toasts
     */
    clearAllToasts: (state) => {
      state.toastQueue = [];
    },

    // ==========================================
    // RESET
    // ==========================================

    /**
     * Reset UI State
     */
    resetUI: () => initialState,
  },
});

/**
 * Export Actions
 */
export const {
  toggleSidenav,
  setSidenavOpen,
  toggleMiniSidenav,
  setMiniSidenav,
  toggleDarkMode,
  setDarkMode,
  setThemeColor,
  setTransparentNavbar,
  setFixedNavbar,
  openModal,
  closeModal,
  closeAllModals,
  toggleModal,
  setGlobalLoading,
  setPageLoading,
  addToast,
  removeToast,
  clearAllToasts,
  resetUI,
} = uiSlice.actions;

/**
 * Selectors
 */
export const selectSidenavOpen = (state) => state.ui.sidenavOpen;
export const selectMiniSidenav = (state) => state.ui.miniSidenav;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectThemeColor = (state) => state.ui.themeColor;
export const selectTransparentNavbar = (state) => state.ui.transparentNavbar;
export const selectFixedNavbar = (state) => state.ui.fixedNavbar;
export const selectModalState = (modalName) => (state) => state.ui.modals[modalName];
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectPageLoading = (state) => state.ui.pageLoading;
export const selectToastQueue = (state) => state.ui.toastQueue;

/**
 * Export Reducer
 */
export default uiSlice.reducer;