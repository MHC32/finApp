import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setupCompleted: false,

      // Actions
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          setupCompleted: false
        });
      },

      register: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          setupCompleted: false,
          isLoading: false
        });
      },

      completeSetup: () => {
        set({ setupCompleted: true });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'finapp-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        setupCompleted: state.setupCompleted
      })
    }
  )
);