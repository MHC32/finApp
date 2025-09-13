// src/services/auth/AuthService.js
import databaseService from '../core/DatabaseService.js';
import validationService from '../core/ValidationService.js';
import eventBus, { AUTH_EVENTS } from '../core/EventBus.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
    this.loginAttempts = new Map(); // Suivi des tentatives de connexion
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Initialiser le service d'authentification
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // S'assurer que la DB est prête
      await databaseService.initialize();
      
      this.isInitialized = true;
      console.log('🔐 AuthService initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation AuthService:', error);
      throw error;
    }
  }

  /**
   * Connexion utilisateur
   * @param {Object} credentials - Identifiants (email, password optionnel pour dev)
   */
  async login(credentials) {
    await this.ensureInitialized();

    try {
      eventBus.emit(AUTH_EVENTS.LOGIN_START, { email: credentials.email });

      // Validation des identifiants
      const validation = this.validateCredentials(credentials);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Vérifier les tentatives de connexion
      await this.checkLoginAttempts(credentials.email);

      // Rechercher l'utilisateur dans la base
      const user = await this.findUserByEmail(credentials.email);

      if (!user) {
        // Pour le développement, créer automatiquement l'utilisateur
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Mode dev: création automatique utilisateur');
          const newUser = await this.createDevUser(credentials);
          return await this.completeLogin(newUser);
        } else {
          await this.recordFailedAttempt(credentials.email);
          throw new Error('Identifiants invalides');
        }
      }

      // En production, ici on vérifierait le mot de passe
      // if (!await this.verifyPassword(credentials.password, user.password_hash)) {
      //   await this.recordFailedAttempt(credentials.email);
      //   throw new Error('Identifiants invalides');
      // }

      // Connexion réussie
      await this.completeLogin(user);
      
      return user;

    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      
      eventBus.emit(AUTH_EVENTS.LOGIN_FAILURE, { 
        email: credentials.email, 
        error: error.message 
      });
      
      throw error;
    }
  }

  /**
   * Inscription utilisateur
   * @param {Object} userData - Données utilisateur
   */
  async register(userData) {
    await this.ensureInitialized();

    try {
      console.log('📝 Inscription utilisateur...');

      // Validation des données
      const validation = validationService.validateUser({
        ...userData,
        created_at: new Date(),
        updated_at: new Date(),
        last_login: new Date(),
        preferences: this.getDefaultPreferences(),
        security_settings: this.getDefaultSecuritySettings()
      });

      if (!validation.isValid) {
        throw new Error(`Validation échouée: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Vérifier si l'email existe déjà
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Créer l'utilisateur
      const userId = await databaseService.create('users', validation.sanitizedData);
      const newUser = await databaseService.read('users', userId);

      console.log('✅ Utilisateur créé avec succès');
      
      // Connexion automatique après inscription
      await this.completeLogin(newUser);
      
      return newUser;

    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout() {
    try {
      if (this.currentUser) {
        // Sauvegarder l'heure de déconnexion
        await databaseService.update('users', this.currentUser.id, {
          last_logout: new Date()
        });

        console.log('🚪 Déconnexion utilisateur:', this.currentUser.email);
        
        eventBus.emit(AUTH_EVENTS.LOGOUT, { 
          userId: this.currentUser.id,
          email: this.currentUser.email
        });
      }

      this.currentUser = null;
      
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      throw error;
    }
  }

  /**
   * Valider la session actuelle
   */
  async validateSession() {
    if (!this.currentUser) {
      return { isValid: false, reason: 'no_user' };
    }

    try {
      // Vérifier que l'utilisateur existe encore en base
      const user = await databaseService.read('users', this.currentUser.id);
      if (!user) {
        this.currentUser = null;
        return { isValid: false, reason: 'user_not_found' };
      }

      // Vérifier si le compte est actif
      if (user.is_disabled) {
        this.currentUser = null;
        return { isValid: false, reason: 'account_disabled' };
      }

      return { isValid: true, user };

    } catch (error) {
      console.error('❌ Erreur validation session:', error);
      return { isValid: false, reason: 'validation_error' };
    }
  }

  /**
   * Rafraîchir les données utilisateur
   */
  async refreshUserData() {
    if (!this.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }

    try {
      const freshUser = await databaseService.read('users', this.currentUser.id);
      if (freshUser) {
        this.currentUser = freshUser;
        
        eventBus.emit(AUTH_EVENTS.USER_DATA_UPDATED, { user: freshUser });
        
        return freshUser;
      }
      
      throw new Error('Utilisateur introuvable');
      
    } catch (error) {
      console.error('❌ Erreur rafraîchissement utilisateur:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les préférences utilisateur
   * @param {Object} preferences - Nouvelles préférences
   */
  async updatePreferences(preferences) {
    if (!this.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }

    try {
      // Validation des préférences
      const validation = validationService.validate('userPreferences', preferences, { partial: true });
      if (!validation.isValid) {
        throw new Error(`Validation préférences: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Fusionner avec les préférences existantes
      const currentPrefs = this.currentUser.preferences || {};
      const newPrefs = { ...currentPrefs, ...validation.sanitizedData };

      // Sauvegarder en base
      await databaseService.update('users', this.currentUser.id, {
        preferences: newPrefs
      });

      // Mettre à jour l'objet utilisateur local
      this.currentUser.preferences = newPrefs;

      eventBus.emit(AUTH_EVENTS.USER_PREFERENCES_UPDATED, { 
        userId: this.currentUser.id,
        preferences: newPrefs 
      });

      console.log('✅ Préférences mises à jour');
      return newPrefs;

    } catch (error) {
      console.error('❌ Erreur mise à jour préférences:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les paramètres de sécurité
   * @param {Object} securitySettings - Nouveaux paramètres
   */
  async updateSecuritySettings(securitySettings) {
    if (!this.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }

    try {
      // Validation des paramètres de sécurité
      const validation = validationService.validate('securitySettings', securitySettings, { partial: true });
      if (!validation.isValid) {
        throw new Error(`Validation sécurité: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Fusionner avec les paramètres existants
      const currentSettings = this.currentUser.security_settings || {};
      const newSettings = { ...currentSettings, ...validation.sanitizedData };

      // Sauvegarder en base
      await databaseService.update('users', this.currentUser.id, {
        security_settings: newSettings
      });

      // Mettre à jour l'objet utilisateur local
      this.currentUser.security_settings = newSettings;

      eventBus.emit(AUTH_EVENTS.USER_SECURITY_UPDATED, { 
        userId: this.currentUser.id,
        securitySettings: newSettings 
      });

      console.log('✅ Paramètres de sécurité mis à jour');
      return newSettings;

    } catch (error) {
      console.error('❌ Erreur mise à jour sécurité:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'utilisateur actuellement connecté
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Vérifier si un utilisateur est connecté
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // === MÉTHODES PRIVÉES ===

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  validateCredentials(credentials) {
    const errors = [];

    if (!credentials.email) {
      errors.push('Email requis');
    } else if (!validationService.isValidEmail(credentials.email)) {
      errors.push('Format email invalide');
    }

    // En développement, le mot de passe peut être optionnel
    if (process.env.NODE_ENV !== 'development' && !credentials.password) {
      errors.push('Mot de passe requis');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async findUserByEmail(email) {
    const users = await databaseService.query('users', { email });
    return users.length > 0 ? users[0] : null;
  }

  async checkLoginAttempts(email) {
    const attempts = this.loginAttempts.get(email);
    
    if (attempts) {
      const { count, lastAttempt } = attempts;
      const timeSinceLastAttempt = Date.now() - lastAttempt;
      
      if (count >= this.maxLoginAttempts && timeSinceLastAttempt < this.lockoutDuration) {
        const remainingTime = Math.ceil((this.lockoutDuration - timeSinceLastAttempt) / 60000);
        throw new Error(`Compte temporairement bloqué. Réessayez dans ${remainingTime} minute(s).`);
      }
      
      // Reset si assez de temps s'est écoulé
      if (timeSinceLastAttempt >= this.lockoutDuration) {
        this.loginAttempts.delete(email);
      }
    }
  }

  async recordFailedAttempt(email) {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    
    attempts.count++;
    attempts.lastAttempt = Date.now();
    
    this.loginAttempts.set(email, attempts);
    
    console.warn(`⚠️ Tentative de connexion échouée pour ${email} (${attempts.count}/${this.maxLoginAttempts})`);
  }

  async createDevUser(credentials) {
    const userData = {
      name: credentials.name || 'Utilisateur Test',
      email: credentials.email,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
      setup_completed: false,
      preferences: this.getDefaultPreferences(),
      security_settings: this.getDefaultSecuritySettings()
    };

    const userId = await databaseService.create('users', userData);
    return await databaseService.read('users', userId);
  }

  async completeLogin(user) {
    // Mettre à jour la dernière connexion
    await databaseService.update('users', user.id, {
      last_login: new Date()
    });

    // Recharger l'utilisateur avec les données mises à jour
    this.currentUser = await databaseService.read('users', user.id);

    // Nettoyer les tentatives de connexion en cas de succès
    this.loginAttempts.delete(user.email);

    eventBus.emit(AUTH_EVENTS.LOGIN_SUCCESS, { 
      user: this.currentUser 
    });

    console.log('✅ Connexion réussie:', this.currentUser.email);
  }

  getDefaultPreferences() {
    return {
      currency: 'HTG',
      theme: 'light',
      language: 'fr',
      timezone: 'America/Port-au-Prince',
      notifications: {
        budget_alerts: true,
        income_reminders: true,
        goal_notifications: true,
        weekly_summary: true
      }
    };
  }

  getDefaultSecuritySettings() {
    return {
      session_timeout: 30,
      two_factor_enabled: false,
      biometric_login: false,
      auto_backup: true,
      login_notifications: true
    };
  }
}

// Instance globale
const authService = new AuthService();

export default authService;