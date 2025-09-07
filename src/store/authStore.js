import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../database/db';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ✅ ÉTAT COMPLET GÉRÉ PAR ZUSTAND UNIQUEMENT
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setupCompleted: false,
      
      // ✅ SESSION GÉRÉE DANS LE STORE
      sessionData: {
        startTime: null,
        lastActivity: null,
        timeout: 30, // minutes par défaut
        warningShown: false,
        autoLogoutTimer: null
      },
      
      // ✅ PRÉFÉRENCES UTILISATEUR DANS LE STORE
      userPreferences: {
        currency: 'HTG',
        theme: 'light',
        language: 'fr',
        notifications: {
          budget_alerts: true,
          income_reminders: true,
          goal_notifications: true,
          weekly_summary: true
        }
      },
      
      // ✅ PARAMÈTRES DE SÉCURITÉ DANS LE STORE
      securitySettings: {
        session_timeout: 30,
        two_factor_enabled: false,
        biometric_login: false,
        auto_backup: true,
        login_notifications: true
      },

      // ✅ FONCTION LOGIN PURE DB
      login: async (credentials) => {
        console.log('🔐 === CONNEXION UTILISATEUR (PURE DB) ===');
        
        try {
          set({ isLoading: true });
          
          // Rechercher l'utilisateur dans la base de données
          let user = await db.users
            .where('email')
            .equals(credentials.email)
            .first();
          
          if (!user) {
            // Pour le développement, créer automatiquement l'utilisateur
            console.log('👤 Création nouvel utilisateur en base');
            
            const newUserId = await db.users.add({
              name: credentials.name || 'Utilisateur',
              email: credentials.email,
              created_at: new Date(),
              updated_at: new Date(),
              last_login: new Date(),
              
              // Préférences par défaut stockées en DB
              preferences: {
                currency: 'HTG',
                theme: 'light',
                language: 'fr',
                timezone: 'America/Port-au-Prince'
              },
              
              // Paramètres de sécurité par défaut en DB
              security_settings: {
                session_timeout: 30,
                two_factor_enabled: false,
                biometric_login: false,
                auto_backup: true,
                login_notifications: true
              }
            });
            
            user = await db.users.get(newUserId);
          } else {
            // Mettre à jour la dernière connexion
            await db.users.update(user.id, {
              last_login: new Date(),
              updated_at: new Date()
            });
          }
          
          // Initialiser la session avec les données DB
          const sessionStartTime = Date.now();
          const sessionTimeout = user.security_settings?.session_timeout || 30;
          
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              created_at: user.created_at,
              last_login: user.last_login
            },
            isAuthenticated: true,
            setupCompleted: true,
            isLoading: false,
            
            // Session initialisée
            sessionData: {
              startTime: sessionStartTime,
              lastActivity: sessionStartTime,
              timeout: sessionTimeout,
              warningShown: false,
              autoLogoutTimer: null
            },
            
            // Préférences chargées depuis DB
            userPreferences: {
              ...get().userPreferences,
              ...user.preferences
            },
            
            // Sécurité chargée depuis DB
            securitySettings: {
              ...get().securitySettings,
              ...user.security_settings
            }
          });
          
          // Démarrer la surveillance de session
          get().startSessionMonitoring();
          
          console.log('✅ Connexion réussie avec données DB chargées');
          return user;
          
        } catch (error) {
          console.error('❌ Erreur lors de la connexion:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // ✅ FONCTION LOGOUT PURE
      logout: async () => {
        console.log('🚪 === DÉCONNEXION COMPLÈTE ===');
        
        const state = get();
        
        // Arrêter la surveillance de session
        if (state.sessionData.autoLogoutTimer) {
          clearTimeout(state.sessionData.autoLogoutTimer);
        }
        
        // Sauvegarder les dernières activités en DB si utilisateur connecté
        if (state.user?.id) {
          try {
            await db.users.update(state.user.id, {
              last_logout: new Date(),
              updated_at: new Date()
            });
            console.log('💾 Heure de déconnexion sauvegardée en DB');
          } catch (error) {
            console.error('⚠️ Erreur sauvegarde logout:', error);
          }
        }
        
        // Reset complet du store
        set({
          user: null,
          isAuthenticated: false,
          setupCompleted: false,
          isLoading: false,
          
          // Reset session
          sessionData: {
            startTime: null,
            lastActivity: null,
            timeout: 30,
            warningShown: false,
            autoLogoutTimer: null
          },
          
          // Garder les préférences de base pour la prochaine connexion
          userPreferences: {
            currency: 'HTG',
            theme: 'light',
            language: 'fr',
            notifications: {
              budget_alerts: true,
              income_reminders: true,
              goal_notifications: true,
              weekly_summary: true
            }
          },
          
          securitySettings: {
            session_timeout: 30,
            two_factor_enabled: false,
            biometric_login: false,
            auto_backup: true,
            login_notifications: true
          }
        });
        
        console.log('✅ Déconnexion complète effectuée');
      },

      // ✅ FONCTION REGISTER PURE DB
      register: async (userData) => {
        console.log('📝 === INSCRIPTION UTILISATEUR (PURE DB) ===');
        
        try {
          set({ isLoading: true });
          
          // Vérifier si l'email existe déjà
          const existingUser = await db.users
            .where('email')
            .equals(userData.email)
            .first();
          
          if (existingUser) {
            throw new Error('Un compte avec cet email existe déjà');
          }
          
          // Créer le nouvel utilisateur avec tous ses paramètres
          const newUserId = await db.users.add({
            name: userData.name,
            email: userData.email,
            created_at: new Date(),
            updated_at: new Date(),
            last_login: new Date(),
            
            // Préférences par défaut
            preferences: {
              currency: 'HTG',
              theme: 'light',
              language: 'fr',
              timezone: 'America/Port-au-Prince'
            },
            
            // Sécurité par défaut
            security_settings: {
              session_timeout: 30,
              two_factor_enabled: false,
              biometric_login: false,
              auto_backup: true,
              login_notifications: true
            }
          });
          
          const newUser = await db.users.get(newUserId);
          
          // Initialiser le store pour nouvel utilisateur
          const sessionStartTime = Date.now();
          
          set({
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              created_at: newUser.created_at,
              last_login: newUser.last_login
            },
            isAuthenticated: true,
            setupCompleted: false, // Setup requis pour nouveaux utilisateurs
            isLoading: false,
            
            sessionData: {
              startTime: sessionStartTime,
              lastActivity: sessionStartTime,
              timeout: 30,
              warningShown: false,
              autoLogoutTimer: null
            },
            
            userPreferences: newUser.preferences,
            securitySettings: newUser.security_settings
          });
          
          console.log('✅ Inscription réussie, redirection vers setup');
          return newUser;
          
        } catch (error) {
          console.error('❌ Erreur lors de l\'inscription:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // ✅ FONCTION SETUP COMPLÈTE PURE DB
      completeSetup: async (setupData) => {
        console.log('⚙️ === FINALISATION SETUP (PURE DB) ===');
        
        try {
          const state = get();
          if (!state.user?.id) {
            throw new Error('Utilisateur non connecté');
          }
          
          set({ isLoading: true });
          
          // Mettre à jour toutes les préférences utilisateur en DB
          await db.users.update(state.user.id, {
            preferences: {
              ...state.userPreferences,
              ...setupData.profile,
              setup_completed_at: new Date()
            },
            security_settings: {
              ...state.securitySettings,
              ...setupData.security,
              setup_completed_at: new Date()
            },
            updated_at: new Date()
          });
          
          // Sauvegarder les comptes de départ en DB
          if (setupData.accounts && setupData.accounts.length > 0) {
            console.log('💾 Sauvegarde des comptes de départ en DB');
            for (const account of setupData.accounts) {
              await db.accounts.add({
                ...account,
                user_id: state.user.id,
                created_at: new Date(),
                updated_at: new Date()
              });
            }
            console.log(`✅ ${setupData.accounts.length} comptes sauvegardés`);
          }
          
          // Sauvegarder les catégories personnalisées en DB
          if (setupData.categories) {
            console.log('💾 Sauvegarde des catégories en DB');
            for (const category of setupData.categories) {
              if (category.enabled) {
                await db.categories.add({
                  name: category.name,
                  emoji: category.emoji,
                  type: category.type,
                  color: category.color,
                  user_id: state.user.id,
                  is_custom: true,
                  created_at: new Date()
                });
              }
            }
            console.log('✅ Catégories personnalisées sauvegardées');
          }
          
          // Sauvegarder les sources de revenus si configurées
          if (setupData.income_sources && setupData.income_sources.length > 0) {
            console.log('💾 Sauvegarde des sources de revenus en DB');
            for (const source of setupData.income_sources) {
              await db.income_sources.add({
                ...source,
                user_id: state.user.id,
                created_at: new Date(),
                updated_at: new Date()
              });
            }
            console.log(`✅ ${setupData.income_sources.length} sources de revenus sauvegardées`);
          }
          
          // Mettre à jour le store avec les nouvelles données
          set({
            setupCompleted: true,
            isLoading: false,
            
            userPreferences: {
              ...state.userPreferences,
              ...setupData.profile
            },
            
            securitySettings: {
              ...state.securitySettings,
              ...setupData.security
            },
            
            // Mettre à jour la session avec les nouveaux paramètres
            sessionData: {
              ...state.sessionData,
              timeout: setupData.security.session_timeout || 30
            }
          });
          
          // Redémarrer la surveillance avec les nouveaux paramètres
          get().startSessionMonitoring();
          
          console.log('✅ Setup complété et toutes les données sauvegardées en DB');
          
        } catch (error) {
          console.error('❌ Erreur lors du setup:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // ✅ GESTION DE SESSION PURE ZUSTAND
      updateActivity: () => {
        const state = get();
        if (state.isAuthenticated) {
          set({
            sessionData: {
              ...state.sessionData,
              lastActivity: Date.now(),
              warningShown: false // Reset warning si nouvelle activité
            }
          });
          
          // Redémarrer la surveillance
          get().startSessionMonitoring();
        }
      },

      // ✅ SURVEILLANCE DE SESSION PURE
      startSessionMonitoring: () => {
        const state = get();
        
        // Arrêter le timer existant
        if (state.sessionData.autoLogoutTimer) {
          clearTimeout(state.sessionData.autoLogoutTimer);
        }
        
        // Session illimitée
        if (state.securitySettings.session_timeout === -1) {
          console.log('⏱️ Session illimitée configurée');
          return;
        }
        
        const timeoutMs = state.securitySettings.session_timeout * 60 * 1000;
        console.log(`⏱️ Surveillance de session démarrée: ${state.securitySettings.session_timeout} minutes`);
        
        // Timer pour déconnexion automatique
        const timer = setTimeout(() => {
          console.log('⏰ Session expirée - Déconnexion automatique');
          get().logout();
          
          // Notification optionnelle à l'utilisateur
          if (typeof window !== 'undefined' && window.confirm) {
            if (window.confirm('Votre session a expiré. Voulez-vous vous reconnecter ?')) {
              window.location.href = '/login';
            }
          }
        }, timeoutMs);
        
        set({
          sessionData: {
            ...state.sessionData,
            autoLogoutTimer: timer
          }
        });
      },

      // ✅ VÉRIFICATION DE VALIDITÉ DE SESSION
      checkSessionValidity: () => {
        const state = get();
        if (!state.isAuthenticated || state.securitySettings.session_timeout === -1) {
          return true;
        }
        
        const timeElapsed = Date.now() - state.sessionData.lastActivity;
        const timeoutMs = state.securitySettings.session_timeout * 60 * 1000;
        
        if (timeElapsed > timeoutMs) {
          console.log('⏰ Session expirée lors de la vérification');
          get().logout();
          return false;
        }
        
        // Afficher un avertissement à 5 minutes de l'expiration
        const warningThreshold = timeoutMs - (5 * 60 * 1000); // 5 minutes avant
        if (timeElapsed > warningThreshold && !state.sessionData.warningShown) {
          set({
            sessionData: {
              ...state.sessionData,
              warningShown: true
            }
          });
          
          console.log('⚠️ Avertissement: Session expire bientôt');
          return 'warning';
        }
        
        return true;
      },

      // ✅ METTRE À JOUR LES PRÉFÉRENCES
      updatePreferences: async (newPreferences) => {
        const state = get();
        if (!state.user?.id) return;
        
        try {
          // Sauvegarder en DB d'abord
          await db.users.update(state.user.id, {
            preferences: {
              ...state.userPreferences,
              ...newPreferences
            },
            updated_at: new Date()
          });
          
          // Puis mettre à jour le store
          set({
            userPreferences: {
              ...state.userPreferences,
              ...newPreferences
            }
          });
          
          console.log('✅ Préférences mises à jour en DB et store');
          
        } catch (error) {
          console.error('❌ Erreur mise à jour préférences:', error);
          throw error;
        }
      },

      // ✅ METTRE À JOUR LES PARAMÈTRES DE SÉCURITÉ
      updateSecuritySettings: async (newSettings) => {
        const state = get();
        if (!state.user?.id) return;
        
        try {
          // Sauvegarder en DB d'abord
          await db.users.update(state.user.id, {
            security_settings: {
              ...state.securitySettings,
              ...newSettings
            },
            updated_at: new Date()
          });
          
          // Mettre à jour le store
          set({
            securitySettings: {
              ...state.securitySettings,
              ...newSettings
            }
          });
          
          // Si le timeout de session a changé, redémarrer la surveillance
          if (newSettings.session_timeout !== undefined) {
            set({
              sessionData: {
                ...state.sessionData,
                timeout: newSettings.session_timeout
              }
            });
            get().startSessionMonitoring();
          }
          
          console.log('✅ Paramètres de sécurité mis à jour');
          
        } catch (error) {
          console.error('❌ Erreur mise à jour sécurité:', error);
          throw error;
        }
      },

      // ✅ OBTENIR TEMPS RESTANT DE SESSION
      getSessionTimeRemaining: () => {
        const state = get();
        if (!state.isAuthenticated || state.securitySettings.session_timeout === -1) {
          return -1; // Session illimitée
        }
        
        const timeElapsed = Date.now() - state.sessionData.lastActivity;
        const timeoutMs = state.securitySettings.session_timeout * 60 * 1000;
        const remaining = Math.max(0, timeoutMs - timeElapsed);
        
        return Math.floor(remaining / 1000); // Retourner en secondes
      },

      // ✅ OBTENIR STATISTIQUES DE SESSION
      getSessionStats: () => {
        const state = get();
        if (!state.isAuthenticated) return null;
        
        const sessionDuration = Date.now() - state.sessionData.startTime;
        const timeRemaining = get().getSessionTimeRemaining();
        
        return {
          sessionStart: new Date(state.sessionData.startTime),
          sessionDuration: Math.floor(sessionDuration / 1000), // en secondes
          lastActivity: new Date(state.sessionData.lastActivity),
          timeRemaining: timeRemaining,
          timeoutSetting: state.securitySettings.session_timeout,
          isUnlimited: state.securitySettings.session_timeout === -1
        };
      },

      // ✅ ACTIONS UTILITAIRES
      setLoading: (loading) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'finapp-auth', // Zustand persist seulement pour les données essentielles
      partialize: (state) => ({
        // Ne persister que les données vraiment nécessaires
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        setupCompleted: state.setupCompleted,
        userPreferences: state.userPreferences,
        securitySettings: state.securitySettings
        // sessionData n'est PAS persisté car il doit être réinitialisé à chaque démarrage
      })
    }
  )
);