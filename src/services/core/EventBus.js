// src/services/core/EventBus.js
class EventBus {
  constructor() {
    this.events = new Map();
    this.debugMode = process.env.NODE_ENV === 'development';
    this.eventHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Émettre un événement
   * @param {string} eventName - Nom de l'événement
   * @param {*} data - Données à transmettre
   * @param {Object} options - Options (async, priority, etc.)
   */
  emit(eventName, data = null, options = {}) {
    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      id: this.generateEventId(),
      ...options
    };

    // Historique pour debug
    this.addToHistory(event);

    // Debug logging
    if (this.debugMode) {
      console.log(`🔔 EventBus: ${eventName}`, { data, options });
    }

    // Récupérer les listeners
    const listeners = this.events.get(eventName) || [];
    
    if (listeners.length === 0) {
      if (this.debugMode) {
        console.warn(`⚠️ EventBus: Aucun listener pour "${eventName}"`);
      }
      return;
    }

    // Exécuter les listeners selon la priorité
    const sortedListeners = this.sortByPriority(listeners);
    
    if (options.async) {
      this.executeAsync(sortedListeners, event);
    } else {
      this.executeSync(sortedListeners, event);
    }
  }

  /**
   * Écouter un événement
   * @param {string} eventName - Nom de l'événement
   * @param {Function} callback - Fonction à exécuter
   * @param {Object} options - Options (priority, once, etc.)
   */
  on(eventName, callback, options = {}) {
    if (typeof callback !== 'function') {
      throw new Error('EventBus: Le callback doit être une fonction');
    }

    const listener = {
      callback,
      priority: options.priority || 0,
      once: options.once || false,
      id: this.generateListenerId(),
      context: options.context || null
    };

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(listener);

    if (this.debugMode) {
      console.log(`👂 EventBus: Listener ajouté pour "${eventName}"`);
    }

    // Retourner fonction de désabonnement
    return () => this.off(eventName, listener.id);
  }

  /**
   * Écouter un événement une seule fois
   * @param {string} eventName - Nom de l'événement
   * @param {Function} callback - Fonction à exécuter
   * @param {Object} options - Options
   */
  once(eventName, callback, options = {}) {
    return this.on(eventName, callback, { ...options, once: true });
  }

  /**
   * Arrêter d'écouter un événement
   * @param {string} eventName - Nom de l'événement
   * @param {string|Function} identifier - ID du listener ou fonction
   */
  off(eventName, identifier) {
    const listeners = this.events.get(eventName);
    if (!listeners) return false;

    let removed = false;

    if (typeof identifier === 'string') {
      // Supprimer par ID
      const index = listeners.findIndex(l => l.id === identifier);
      if (index !== -1) {
        listeners.splice(index, 1);
        removed = true;
      }
    } else if (typeof identifier === 'function') {
      // Supprimer par fonction callback
      const index = listeners.findIndex(l => l.callback === identifier);
      if (index !== -1) {
        listeners.splice(index, 1);
        removed = true;
      }
    }

    // Nettoyer si plus de listeners
    if (listeners.length === 0) {
      this.events.delete(eventName);
    }

    if (this.debugMode && removed) {
      console.log(`🚫 EventBus: Listener supprimé pour "${eventName}"`);
    }

    return removed;
  }

  /**
   * Supprimer tous les listeners d'un événement
   * @param {string} eventName - Nom de l'événement
   */
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }

    if (this.debugMode) {
      console.log(`🧹 EventBus: Tous les listeners supprimés${eventName ? ` pour "${eventName}"` : ''}`);
    }
  }

  /**
   * Vérifier si un événement a des listeners
   * @param {string} eventName - Nom de l'événement
   */
  hasListeners(eventName) {
    const listeners = this.events.get(eventName);
    return listeners && listeners.length > 0;
  }

  /**
   * Obtenir le nombre de listeners pour un événement
   * @param {string} eventName - Nom de l'événement
   */
  listenerCount(eventName) {
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  /**
   * Obtenir la liste des événements enregistrés
   */
  getEventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Obtenir les statistiques du bus d'événements
   */
  getStats() {
    const events = this.getEventNames();
    const totalListeners = events.reduce((total, event) => {
      return total + this.listenerCount(event);
    }, 0);

    return {
      eventCount: events.length,
      totalListeners,
      events: events.map(event => ({
        name: event,
        listenerCount: this.listenerCount(event)
      })),
      historySize: this.eventHistory.length
    };
  }

  /**
   * Obtenir l'historique des événements (debug)
   */
  getHistory(limit = 50) {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Nettoyer l'historique
   */
  clearHistory() {
    this.eventHistory = [];
  }

  // === MÉTHODES PRIVÉES ===

  executeSync(listeners, event) {
    for (const listener of listeners) {
      try {
        listener.callback(event.data, event);
        
        // Supprimer si 'once'
        if (listener.once) {
          this.off(event.name, listener.id);
        }
      } catch (error) {
        console.error(`❌ EventBus: Erreur dans listener "${event.name}":`, error);
      }
    }
  }

  async executeAsync(listeners, event) {
    const promises = listeners.map(async (listener) => {
      try {
        await listener.callback(event.data, event);
        
        // Supprimer si 'once'
        if (listener.once) {
          this.off(event.name, listener.id);
        }
      } catch (error) {
        console.error(`❌ EventBus: Erreur async dans listener "${event.name}":`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  sortByPriority(listeners) {
    return [...listeners].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  addToHistory(event) {
    this.eventHistory.push({
      ...event,
      listenerCount: this.listenerCount(event.name)
    });

    // Limiter la taille de l'historique
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateListenerId() {
    return `lst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Créer une instance globale
const eventBus = new EventBus();

// Événements prédéfinis pour l'authentification
export const AUTH_EVENTS = {
  // Authentification
  LOGIN_START: 'auth:login:start',
  LOGIN_SUCCESS: 'auth:login:success',
  LOGIN_FAILURE: 'auth:login:failure',
  LOGOUT: 'auth:logout',
  
  // Session
  SESSION_START: 'session:start',
  SESSION_ACTIVITY: 'session:activity',
  SESSION_WARNING: 'session:warning',
  SESSION_EXPIRED: 'session:expired',
  
  // Setup
  SETUP_STEP_COMPLETE: 'setup:step:complete',
  SETUP_COMPLETE: 'setup:complete',
  SETUP_ERROR: 'setup:error',
  
  // Données utilisateur
  USER_DATA_UPDATED: 'user:data:updated',
  USER_PREFERENCES_UPDATED: 'user:preferences:updated',
  USER_SECURITY_UPDATED: 'user:security:updated',
  
  // Base de données
  DB_CONNECTED: 'db:connected',
  DB_ERROR: 'db:error',
  DB_MIGRATION_START: 'db:migration:start',
  DB_MIGRATION_COMPLETE: 'db:migration:complete',
  
  // Application
  APP_READY: 'app:ready',
  APP_ERROR: 'app:error'
};

export default eventBus;

// Utilitaires pour debug
if (process.env.NODE_ENV === 'development') {
  window.debugEventBus = {
    bus: eventBus,
    stats: () => eventBus.getStats(),
    history: (limit) => eventBus.getHistory(limit),
    emit: (name, data) => eventBus.emit(name, data),
    events: AUTH_EVENTS
  };
}