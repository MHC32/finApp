// src/services/auth/SessionService.js
import authService from './AuthService.js';
import eventBus, { AUTH_EVENTS } from '../core/EventBus.js';

class SessionService {
  constructor() {
    this.sessionData = {
      startTime: null,
      lastActivity: null,
      timeout: 30, // minutes
      warningShown: false,
      isActive: false
    };
    
    this.timers = {
      activity: null,
      warning: null,
      expiration: null,
      heartbeat: null
    };
    
    this.config = {
      warningBeforeExpiry: 5, // minutes
      heartbeatInterval: 30, // secondes
      activityEvents: [
        'mousedown', 'mousemove', 'keypress', 'scroll', 
        'touchstart', 'click', 'focus', 'input', 'wheel'
      ],
      storageKey: 'finapp-session-data'
    };
    
    this.isInitialized = false;
    this.activityHandler = null;
  }

  /**
   * Initialiser le service de session
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Écouter les événements d'authentification
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('⏱️ SessionService initialisé');
      
    } catch (error) {
      console.error('❌ Erreur initialisation SessionService:', error);
      throw error;
    }
  }

  /**
   * Démarrer la surveillance de session
   * @param {Object} securitySettings - Paramètres de sécurité
   */
  startMonitoring(securitySettings = {}) {
    try {
      this.sessionData.timeout = securitySettings.session_timeout || 30;
      this.sessionData.startTime = Date.now();
      this.sessionData.lastActivity = Date.now();
      this.sessionData.isActive = true;
      this.sessionData.warningShown = false;

      // Session illimitée
      if (this.sessionData.timeout === -1) {
        console.log('⏱️ Session illimitée configurée');
        this.startHeartbeat();
        eventBus.emit(AUTH_EVENTS.SESSION_START, { unlimited: true });
        return;
      }

      console.log(`⏱️ Surveillance session démarrée: ${this.sessionData.timeout} minutes`);

      // Démarrer la surveillance d'activité
      this.startActivityTracking();
      
      // Démarrer le heartbeat
      this.startHeartbeat();
      
      // Programmer les timers
      this.scheduleTimers();
      
      // Sauvegarder l'état de session
      this.saveSessionState();

      eventBus.emit(AUTH_EVENTS.SESSION_START, {
        timeout: this.sessionData.timeout,
        startTime: this.sessionData.startTime
      });

    } catch (error) {
      console.error('❌ Erreur démarrage surveillance:', error);
    }
  }

  /**
   * Arrêter la surveillance de session
   */
  stopMonitoring() {
    try {
      this.sessionData.isActive = false;
      
      // Arrêter le suivi d'activité
      this.stopActivityTracking();
      
      // Nettoyer tous les timers
      this.clearAllTimers();
      
      // Nettoyer le stockage
      this.clearSessionState();
      
      console.log('🛑 Surveillance session arrêtée');
      
    } catch (error) {
      console.error('❌ Erreur arrêt surveillance:', error);
    }
  }

  /**
   * Mettre à jour l'activité utilisateur
   */
  updateActivity() {
    if (!this.sessionData.isActive) return;

    try {
      const now = Date.now();
      this.sessionData.lastActivity = now;
      this.sessionData.warningShown = false;

      // Re-programmer les timers
      this.scheduleTimers();
      
      // Sauvegarder l'état
      this.saveSessionState();

      eventBus.emit(AUTH_EVENTS.SESSION_ACTIVITY, {
        timestamp: now,
        timeRemaining: this.getTimeRemaining()
      });

    } catch (error) {
      console.error('❌ Erreur mise à jour activité:', error);
    }
  }

  /**
   * Vérifier la validité de la session
   */
  checkValidity() {
    if (!this.sessionData.isActive) {
      return { isValid: false, reason: 'inactive' };
    }

    // Session illimitée
    if (this.sessionData.timeout === -1) {
      return { isValid: true, unlimited: true };
    }

    const timeElapsed = Date.now() - this.sessionData.lastActivity;
    const timeoutMs = this.sessionData.timeout * 60 * 1000;

    if (timeElapsed > timeoutMs) {
      this.handleExpiration();
      return { isValid: false, reason: 'expired' };
    }

    // Vérifier si avertissement nécessaire
    const warningThreshold = timeoutMs - (this.config.warningBeforeExpiry * 60 * 1000);
    if (timeElapsed > warningThreshold && !this.sessionData.warningShown) {
      this.showWarning();
      return { isValid: true, warning: true };
    }

    return { isValid: true };
  }

  /**
   * Obtenir le temps restant en secondes
   */
  getTimeRemaining() {
    if (!this.sessionData.isActive) return 0;
    if (this.sessionData.timeout === -1) return -1;

    const timeElapsed = Date.now() - this.sessionData.lastActivity;
    const timeoutMs = this.sessionData.timeout * 60 * 1000;
    const remaining = Math.max(0, timeoutMs - timeElapsed);

    return Math.floor(remaining / 1000);
  }

  /**
   * Obtenir les statistiques de session
   */
  getStats() {
    if (!this.sessionData.isActive) return null;

    const sessionDuration = Date.now() - this.sessionData.startTime;
    const timeRemaining = this.getTimeRemaining();

    return {
      sessionStart: new Date(this.sessionData.startTime),
      sessionDuration: Math.floor(sessionDuration / 1000),
      lastActivity: new Date(this.sessionData.lastActivity),
      timeRemaining,
      timeoutSetting: this.sessionData.timeout,
      isUnlimited: this.sessionData.timeout === -1,
      isActive: this.sessionData.isActive
    };
  }

  /**
   * Prolonger la session manuellement
   * @param {number} additionalMinutes - Minutes supplémentaires
   */
  extendSession(additionalMinutes = 30) {
    if (!this.sessionData.isActive) return false;

    try {
      this.sessionData.lastActivity = Date.now();
      this.sessionData.warningShown = false;
      
      // Re-programmer les timers
      this.scheduleTimers();
      
      console.log(`⏱️ Session prolongée de ${additionalMinutes} minutes`);
      
      eventBus.emit(AUTH_EVENTS.SESSION_ACTIVITY, {
        extended: true,
        additionalMinutes
      });

      return true;
    } catch (error) {
      console.error('❌ Erreur prolongation session:', error);
      return false;
    }
  }

  // === MÉTHODES PRIVÉES ===

  setupEventListeners() {
    // Écouter les connexions/déconnexions
    eventBus.on(AUTH_EVENTS.LOGIN_SUCCESS, () => {
      const user = authService.getCurrentUser();
      if (user && user.security_settings) {
        this.startMonitoring(user.security_settings);
      }
    });

    eventBus.on(AUTH_EVENTS.LOGOUT, () => {
      this.stopMonitoring();
    });

    // Écouter les mises à jour de sécurité
    eventBus.on(AUTH_EVENTS.USER_SECURITY_UPDATED, (data) => {
      if (this.sessionData.isActive) {
        this.sessionData.timeout = data.securitySettings.session_timeout;
        this.scheduleTimers(); // Re-programmer avec nouveau timeout
      }
    });

    // Récupération après erreur
    eventBus.on(AUTH_EVENTS.APP_ERROR, (data) => {
      if (data.type === 'session_error') {
        this.recoverFromError();
      }
    });
  }

  startActivityTracking() {
    if (this.activityHandler) return;

    this.activityHandler = () => this.updateActivity();

    this.config.activityEvents.forEach(event => {
      document.addEventListener(event, this.activityHandler, { 
        passive: true,
        capture: true 
      });
    });
  }

  stopActivityTracking() {
    if (!this.activityHandler) return;

    this.config.activityEvents.forEach(event => {
      document.removeEventListener(event, this.activityHandler, { capture: true });
    });

    this.activityHandler = null;
  }

  startHeartbeat() {
    if (this.timers.heartbeat) {
      clearInterval(this.timers.heartbeat);
    }

    this.timers.heartbeat = setInterval(() => {
      this.performHeartbeat();
    }, this.config.heartbeatInterval * 1000);
  }

  performHeartbeat() {
    try {
      // Vérifier la validité
      const validity = this.checkValidity();
      
      // Valider avec le service d'auth
      authService.validateSession().then(authValid => {
        if (!authValid.isValid && this.sessionData.isActive) {
          console.warn('⚠️ Session invalide détectée par heartbeat');
          this.handleExpiration();
        }
      }).catch(error => {
        console.error('❌ Erreur validation heartbeat:', error);
      });

    } catch (error) {
      console.error('❌ Erreur heartbeat:', error);
    }
  }

  scheduleTimers() {
    // Nettoyer les timers existants
    this.clearTimers();

    if (this.sessionData.timeout === -1) return;

    const timeoutMs = this.sessionData.timeout * 60 * 1000;
    const warningMs = timeoutMs - (this.config.warningBeforeExpiry * 60 * 1000);

    // Timer pour l'avertissement
    if (warningMs > 0) {
      this.timers.warning = setTimeout(() => {
        this.showWarning();
      }, warningMs);
    }

    // Timer pour l'expiration
    this.timers.expiration = setTimeout(() => {
      this.handleExpiration();
    }, timeoutMs);
  }

  clearTimers() {
    if (this.timers.warning) {
      clearTimeout(this.timers.warning);
      this.timers.warning = null;
    }
    
    if (this.timers.expiration) {
      clearTimeout(this.timers.expiration);
      this.timers.expiration = null;
    }
  }

  clearAllTimers() {
    this.clearTimers();
    
    if (this.timers.heartbeat) {
      clearInterval(this.timers.heartbeat);
      this.timers.heartbeat = null;
    }
  }

  showWarning() {
    if (this.sessionData.warningShown) return;

    this.sessionData.warningShown = true;
    const timeRemaining = this.getTimeRemaining();

    console.log(`⚠️ Avertissement: Session expire dans ${Math.floor(timeRemaining / 60)} minute(s)`);

    eventBus.emit(AUTH_EVENTS.SESSION_WARNING, {
      timeRemaining,
      minutes: Math.floor(timeRemaining / 60)
    });
  }

  handleExpiration() {
    console.log('⏰ Session expirée - Déconnexion automatique');

    this.stopMonitoring();

    eventBus.emit(AUTH_EVENTS.SESSION_EXPIRED, {
      sessionDuration: Date.now() - this.sessionData.startTime
    });

    // Déconnecter l'utilisateur
    authService.logout().catch(error => {
      console.error('❌ Erreur déconnexion auto:', error);
    });
  }

  saveSessionState() {
    try {
      const state = {
        startTime: this.sessionData.startTime,
        lastActivity: this.sessionData.lastActivity,
        timeout: this.sessionData.timeout,
        isActive: this.sessionData.isActive
      };

      sessionStorage.setItem(this.config.storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('⚠️ Impossible de sauvegarder l\'état de session:', error);
    }
  }

  loadSessionState() {
    try {
      const state = sessionStorage.getItem(this.config.storageKey);
      if (state) {
        return JSON.parse(state);
      }
    } catch (error) {
      console.warn('⚠️ Impossible de charger l\'état de session:', error);
    }
    return null;
  }

  clearSessionState() {
    try {
      sessionStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.warn('⚠️ Impossible de nettoyer l\'état de session:', error);
    }
  }

  recoverFromError() {
    console.log('🔄 Récupération après erreur de session...');
    
    try {
      const savedState = this.loadSessionState();
      if (savedState && authService.isAuthenticated()) {
        this.sessionData = { ...this.sessionData, ...savedState };
        this.scheduleTimers();
        console.log('✅ Session récupérée');
      } else {
        this.stopMonitoring();
        console.log('❌ Impossible de récupérer la session');
      }
    } catch (error) {
      console.error('❌ Erreur récupération session:', error);
      this.stopMonitoring();
    }
  }
}

// Instance globale
const sessionService = new SessionService();

export default sessionService;

// Debug tools
if (process.env.NODE_ENV === 'development') {
  window.debugSession = {
    service: sessionService,
    stats: () => sessionService.getStats(),
    remaining: () => sessionService.getTimeRemaining(),
    extend: (min) => sessionService.extendSession(min),
    expire: () => sessionService.handleExpiration(),
    activity: () => sessionService.updateActivity()
  };
}