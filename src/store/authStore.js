// src/stores/authStore.js - NOUVELLE VERSION AVEC ARCHITECTURE SERVICES
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/auth/AuthService.js';
import sessionService from '../services/auth/SessionService.js';
import setupService from '../services/auth/SetupService.js';
import eventBus, { AUTH_EVENTS } from '../services/core/EventBus.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ✅ ÉTAT SIMPLIFIÉ - SEULES LES DONNÉES NÉCESSAIRES
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setupCompleted: false,
      
      // État de session (géré par SessionService)
      sessionStats: null,
      
      // État de setup (géré par SetupService)
      setupState: null,
      
      // Messages d'erreur et notifications
      error: null,
      notifications: [],
      
      // ✅ ACTIONS SIMPLIFIÉES - DÉLÈGUENT AUX SERVICES
      
      /**
       * Initialiser le store et les services
       */
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          // Initialiser tous les services
          await authService.initialize();
          await sessionService.initialize();
          
          // Configurer les listeners d'événements
          get().setupEventListeners();
          
          // Vérifier s'il y a un utilisateur persisté
          const persistedUser = get().user;
          if (persistedUser) {
            // Valider la session persistée
            const validation = await authService.validateSession();
            if (validation.isValid) {
              authService.currentUser = persistedUser;
              set({ 
                isAuthenticated: true,
                setupCompleted: persistedUser.setup_completed || false
              });
              
              // Démarrer la surveillance de session
              if (persistedUser.security_settings) {
                sessionService.startMonitoring(persistedUser.security_settings);
              }
            } else {
              // Session invalide, nettoyer
              set({
                user: null,
                isAuthenticated: false,
                setupCompleted: false
              });
            }
          }
          
          set({ isLoading: false });
          
        } catch (error) {
          console.error('❌ Erreur initialisation store:', error);
          set({ 
            isLoading: false, 
            error: 'Erreur lors de l\'initialisation'
          });
        }
      },
      
      /**
       * Connexion utilisateur
       */
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await authService.login(credentials);
          
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              created_at: user.created_at,
              last_login: user.last_login,
              setup_completed: user.setup_completed,
              preferences: user.preferences,
              security_settings: user.security_settings
            },
            isAuthenticated: true,
            setupCompleted: user.setup_completed || false,
            isLoading: false
          });
          
          return user;
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      /**
       * Inscription utilisateur
       */
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await authService.register(userData);
          
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              created_at: user.created_at,
              last_login: user.last_login,
              setup_completed: false, // Toujours false après inscription
              preferences: user.preferences,
              security_settings: user.security_settings
            },
            isAuthenticated: true,
            setupCompleted: false,
            isLoading: false
          });
          
          return user;
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      /**
       * Déconnexion utilisateur
       */
      logout: async () => {
        try {
          await authService.logout();
          sessionService.stopMonitoring();
          setupService.reset();
          
          set({
            user: null,
            isAuthenticated: false,
            setupCompleted: false,
            sessionStats: null,
            setupState: null,
            error: null,
            notifications: []
          });
          
        } catch (error) {
          console.error('❌ Erreur déconnexion:', error);
          // Même en cas d'erreur, nettoyer l'état local
          set({
            user: null,
            isAuthenticated: false,
            setupCompleted: false,
            sessionStats: null,
            setupState: null
          });
        }
      },
      
      /**
       * Finaliser le setup
       */
      completeSetup: async (setupData) => {
        try {
          set({ isLoading: true, error: null });
          
          await setupService.completeSetup(setupData);
          
          // Rafraîchir les données utilisateur
          const updatedUser = await authService.refreshUserData();
          
          set({
            user: updatedUser,
            setupCompleted: true,
            isLoading: false
          });
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      /**
       * Mettre à jour les préférences utilisateur
       */
      updatePreferences: async (preferences) => {
        try {
          const updatedPrefs = await authService.updatePreferences(preferences);
          const currentUser = get().user;
          
          set({
            user: {
              ...currentUser,
              preferences: updatedPrefs
            }
          });
          
          return updatedPrefs;
          
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },
      
      /**
       * Mettre à jour les paramètres de sécurité
       */
      updateSecuritySettings: async (securitySettings) => {
        try {
          const updatedSettings = await authService.updateSecuritySettings(securitySettings);
          const currentUser = get().user;
          
          set({
            user: {
              ...currentUser,
              security_settings: updatedSettings
            }
          });
          
          return updatedSettings;
          
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },
      
      /**
       * Obtenir les statistiques de session
       */
      getSessionStats: () => {
        return sessionService.getStats();
      },
      
      /**
       * Obtenir le temps restant de session
       */
      getSessionTimeRemaining: () => {
        return sessionService.getTimeRemaining();
      },
      
      /**
       * Vérifier la validité de session
       */
      checkSessionValidity: () => {
        return sessionService.checkValidity();
      },
      
      /**
       * Mettre à jour l'activité utilisateur
       */
      updateActivity: () => {
        sessionService.updateActivity();
      },
      
      /**
       * Prolonger la session
       */
      extendSession: (minutes) => {
        return sessionService.extendSession(minutes);
      },
      
      /**
       * Obtenir l'état du setup
       */
      getSetupState: () => {
        return setupService.getSetupState();
      },
      
      /**
       * Valider une étape du setup
       */
      validateSetupStep: async (stepNumber, data) => {
        return await setupService.validateStep(stepNumber, data);
      },
      
      /**
       * Sauvegarder une étape du setup
       */
      saveSetupStep: async (stepNumber, data) => {
        const result = await setupService.saveStep(stepNumber, data);
        set({ setupState: setupService.getSetupState() });
        return result;
      },
      
      /**
       * Nettoyer les erreurs
       */
      clearError: () => {
        set({ error: null });
      },
      
      /**
       * Ajouter une notification
       */
      addNotification: (notification) => {
        const notifications = get().notifications;
        set({
          notifications: [...notifications, {
            id: Date.now(),
            timestamp: new Date(),
            ...notification
          }]
        });
      },
      
      /**
       * Supprimer une notification
       */
      removeNotification: (id) => {
        const notifications = get().notifications.filter(n => n.id !== id);
        set({ notifications });
      },
      
      /**
       * Configurer les listeners d'événements
       */
      setupEventListeners: () => {
        // Écouter les événements d'authentification
        eventBus.on(AUTH_EVENTS.LOGIN_SUCCESS, (data) => {
          const { user } = data;
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              created_at: user.created_at,
              last_login: user.last_login,
              setup_completed: user.setup_completed,
              preferences: user.preferences,
              security_settings: user.security_settings
            },
            isAuthenticated: true,
            setupCompleted: user.setup_completed || false
          });
        });

        eventBus.on(AUTH_EVENTS.LOGOUT, () => {
          set({
            user: null,
            isAuthenticated: false,
            setupCompleted: false,
            sessionStats: null
          });
        });

        // Écouter les événements de session
        eventBus.on(AUTH_EVENTS.SESSION_START, () => {
          set({ sessionStats: sessionService.getStats() });
        });

        eventBus.on(AUTH_EVENTS.SESSION_ACTIVITY, () => {
          set({ sessionStats: sessionService.getStats() });
        });

        eventBus.on(AUTH_EVENTS.SESSION_WARNING, (data) => {
          get().addNotification({
            type: 'warning',
            title: 'Session expire bientôt',
            message: `Votre session expire dans ${data.minutes} minute(s)`,
            actions: [
              {
                label: 'Prolonger',
                action: () => sessionService.extendSession()
              }
            ]
          });
        });

        eventBus.on(AUTH_EVENTS.SESSION_EXPIRED, () => {
          get().addNotification({
            type: 'error',
            title: 'Session expirée',
            message: 'Votre session a expiré. Vous avez été déconnecté.'
          });
        });

        // Écouter les événements de mise à jour utilisateur
        eventBus.on(AUTH_EVENTS.USER_DATA_UPDATED, (data) => {
          set({ user: data.user });
        });

        eventBus.on(AUTH_EVENTS.USER_PREFERENCES_UPDATED, (data) => {
          const currentUser = get().user;
          if (currentUser && currentUser.id === data.userId) {
            set({
              user: {
                ...currentUser,
                preferences: data.preferences
              }
            });
          }
        });

        eventBus.on(AUTH_EVENTS.USER_SECURITY_UPDATED, (data) => {
          const currentUser = get().user;
          if (currentUser && currentUser.id === data.userId) {
            set({
              user: {
                ...currentUser,
                security_settings: data.securitySettings
              }
            });
          }
        });

        // Écouter les événements de setup
        eventBus.on(AUTH_EVENTS.SETUP_STEP_COMPLETE, () => {
          set({ setupState: setupService.getSetupState() });
        });

        eventBus.on(AUTH_EVENTS.SETUP_COMPLETE, () => {
          set({ 
            setupCompleted: true,
            setupState: null
          });
          
          get().addNotification({
            type: 'success',
            title: 'Configuration terminée',
            message: 'Votre application FinApp Haiti est prête à l\'emploi!'
          });
        });

        eventBus.on(AUTH_EVENTS.SETUP_ERROR, (data) => {
          set({ error: `Erreur setup: ${data.error}` });
        });

        // Écouter les erreurs générales
        eventBus.on(AUTH_EVENTS.APP_ERROR, (data) => {
          set({ error: data.error || 'Une erreur est survenue' });
        });

        console.log('🎧 Event listeners configurés');
      }
    }),
    {
      name: 'finapp-auth-store',
      partialize: (state) => ({
        // Persister seulement les données essentielles
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        setupCompleted: state.setupCompleted
        // sessionStats et setupState ne sont PAS persistés
      }),
      onRehydrateStorage: () => (state) => {
        // Après réhydratation, initialiser les services
        if (state) {
          state.initialize();
        }
      }
    }
  )
);

// Initialiser automatiquement le store au démarrage
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}

export default useAuthStore;