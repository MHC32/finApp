// src/store/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // État
      theme: 'light', // 'light' | 'dark'
      
      // Actions
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        // Appliquer immédiatement le thème au DOM
        applyThemeToDOM(newTheme);
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      // Initialiser le thème depuis le stockage
      initTheme: () => {
        const currentTheme = get().theme;
        applyThemeToDOM(currentTheme);
      }
    }),
    {
      name: 'finapp-theme',
      partialize: (state) => ({ theme: state.theme })
    }
  )
);

// Fonction pour appliquer le thème au DOM
const applyThemeToDOM = (theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    console.log('🌙 Thème sombre appliqué');
  } else {
    root.classList.remove('dark');
    console.log('☀️ Thème clair appliqué');
  }
  
  // Mettre à jour la couleur de la barre de statut du navigateur
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
  }
};