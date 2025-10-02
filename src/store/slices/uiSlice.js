/**
 * =========================================================
 * FinApp Haiti - UI Slice
 * Gestion de l'état de l'interface utilisateur (non persisté)
 * =========================================================
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * État initial de l'UI
 */
const initialState = {
  // Navigation
  sidenavOpen: false,
  miniSidenav: false,
  
  // Theme
  darkMode: false,
  themeColor: 'info',
  
  // Navbar
  transparentNavbar: true,
  fixedNavbar: true,
  
  // Modals
  modals: {
    addAccount: false,
    addTransaction: false,
    addBudget: false,
    addSol: false,
    quickTransaction: false,
  },
  
  // Loading states
  globalLoading: false,
  pageLoading: false,
  
  // Notifications (UI only, pas les notifications backend)
  toastQueue: [],
};

/**
 * UI Slice
 * Gère l'état de l'interface (sidenav, modals, loading, etc.)
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ==========================================
    // SIDENAV
    // ==========================================
    
    /**
     * Toggle Sidenav
     * Ouvre/ferme le sidenav
     */
    toggleSidenav: (state) => {
      state.sidenavOpen = !state.sidenavOpen;
    },

    /**
     * Set Sidenav Open
     * Définit l'état du sidenav
     */
    setSidenavOpen: (state, action) => {
      state.sidenavOpen = action.payload;
    },

    /**
     * Toggle Mini Sidenav
     * Bascule mode mini du sidenav
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
     * Bascule entre mode clair et sombre
     */
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Sauvegarder dans localStorage pour session suivante
      localStorage.setItem('darkMode', state.darkMode.toString());
    },

    /**
     * Set Dark Mode
     */
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload.toString());
    },

    /**
     * Set Theme Color
     * Change la couleur du thème (primary, info, success, etc.)
     */
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
    },

    // ==========================================
    // NAVBAR
    // ==========================================

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
     * Ouvre un modal spécifique
     * @param {string} action.payload - Nom du modal
     */
    openModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = true;
      }
    },

    /**
     * Close Modal
     * Ferme un modal spécifique
     * @param {string} action.payload - Nom du modal
     */
    closeModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = false;
      }
    },

    /**
     * Close All Modals
     * Ferme tous les modals
     */
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },

    /**
     * Toggle Modal
     * Bascule l'état d'un modal
     * @param {string} action.payload - Nom du modal
     */
    toggleModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = !state.modals[action.payload];
      }
    },

    // ==========================================
    // LOADING
    // ==========================================

    /**
     * Set Global Loading
     * Loading qui bloque toute l'interface
     */
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    /**
     * Set Page Loading
     * Loading spécifique à une page
     */
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },

    // ==========================================
    // TOASTS (UI uniquement)
    // ==========================================

    /**
     * Add Toast
     * Ajoute un toast à la queue
     */
    addToast: (state, action) => {
      state.toastQueue.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },

    /**
     * Remove Toast
     * Retire un toast de la queue
     */
    removeToast: (state, action) => {
      state.toastQueue = state.toastQueue.filter(
        toast => toast.id !== action.payload
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
     * Remet l'UI à l'état initial
     */
    resetUI: () => initialState,
  },
});

// Export des actions
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

// Selectors
export const selectSidenavOpen = (state) => state.ui.sidenavOpen;
export const selectMiniSidenav = (state) => state.ui.miniSidenav;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectThemeColor = (state) => state.ui.themeColor;
export const selectModalState = (modalName) => (state) => state.ui.modals[modalName];
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectPageLoading = (state) => state.ui.pageLoading;
export const selectToastQueue = (state) => state.ui.toastQueue;

// Export du reducer
export default uiSlice.reducer;