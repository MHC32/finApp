// src/store/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ===================================================================
// CONSTANTES
// ===================================================================

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

const STORAGE_KEY = 'finapp-theme';

// ===================================================================
// HELPER - Récupérer thème depuis localStorage
// ===================================================================

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
  } catch (error) {
    console.warn('Impossible de lire le thème depuis localStorage:', error);
  }
  
  // Fallback: détecter préférence système
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }
  
  return THEMES.LIGHT;
};

// ===================================================================
// HELPER - Sauvegarder thème dans localStorage
// ===================================================================

const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Impossible de sauvegarder le thème:', error);
  }
};

// ===================================================================
// HELPER - Appliquer thème au document
// ===================================================================

const applyTheme = (theme) => {
  if (theme === THEMES.DARK) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// ===================================================================
// ÉTAT INITIAL
// ===================================================================

const initialState = {
  currentTheme: getInitialTheme(),
  isDark: getInitialTheme() === THEMES.DARK
};

// Appliquer le thème initial
applyTheme(initialState.currentTheme);

// ===================================================================
// SLICE
// ===================================================================

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * Toggle entre light et dark
     */
    toggleTheme: (state) => {
      const newTheme = state.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      state.currentTheme = newTheme;
      state.isDark = newTheme === THEMES.DARK;
      
      // Sauvegarder et appliquer
      saveTheme(newTheme);
      applyTheme(newTheme);
    },
    
    /**
     * Set un thème spécifique
     */
    setTheme: (state, action) => {
      const newTheme = action.payload;
      
      if (!Object.values(THEMES).includes(newTheme)) {
        console.warn(`Thème invalide: ${newTheme}`);
        return;
      }
      
      state.currentTheme = newTheme;
      state.isDark = newTheme === THEMES.DARK;
      
      // Sauvegarder et appliquer
      saveTheme(newTheme);
      applyTheme(newTheme);
    },
    
    /**
     * Initialiser le thème (au démarrage de l'app)
     */
    initTheme: (state) => {
      const theme = getInitialTheme();
      state.currentTheme = theme;
      state.isDark = theme === THEMES.DARK;
      applyTheme(theme);
    }
  }
});

// ===================================================================
// EXPORTS
// ===================================================================

export const { toggleTheme, setTheme, initTheme } = themeSlice.actions;

export default themeSlice.reducer;

// Export des constantes pour utilisation externe
export { THEMES };