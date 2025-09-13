// src/services/core/DatabaseService.js
import Dexie from 'dexie';
import eventBus, { AUTH_EVENTS } from './EventBus.js';
import validationService from './ValidationService.js';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.version = 2; // Version de schéma actuelle
    this.migrationHistory = [];
    this.transactionQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Initialiser la base de données
   */
  async initialize() {
    if (this.isInitialized) return this.db;

    try {
      console.log('🗄️ Initialisation de la base de données...');
      
      this.db = new Dexie('FinAppHaitiDB');
      
      // Définir les schémas pour toutes les versions
      this.defineSchemas();
      
      // Configurer les hooks
      this.setupHooks();
      
      // Ouvrir la base
      await this.db.open();
      
      // Vérifier et exécuter les migrations
      await this.runMigrations();
      
      this.isInitialized = true;
      
      eventBus.emit(AUTH_EVENTS.DB_CONNECTED, {
        version: this.version,
        tables: this.db.tables.map(t => t.name)
      });
      
      console.log('✅ Base de données initialisée avec succès');
      return this.db;
      
    } catch (error) {
      console.error('❌ Erreur initialisation DB:', error);
      eventBus.emit(AUTH_EVENTS.DB_ERROR, { error: error.message });
      throw error;
    }
  }

  /**
   * Définir les schémas de base de données
   */
  defineSchemas() {
    // Version 1 - Schéma initial
    this.db.version(1).stores({
      users: '++id, email, name, created_at, updated_at',
      accounts: '++id, user_id, name, bank_name, account_type, currency, is_active, created_at',
      transactions: '++id, user_id, account_id, date, amount, type, category, created_at',
      income_sources: '++id, user_id, name, amount, frequency, destination_account_id, is_active',
      categories: '++id, user_id, name, type, emoji, color, is_custom',
      goals: '++id, user_id, title, target_amount, current_amount, target_date',
      notifications: '++id, user_id, type, title, message, is_read, created_at'
    });

    // Version 2 - Améliorations et nouvelles tables
    this.db.version(2).stores({
      users: '++id, email, name, created_at, updated_at, last_login, setup_completed',
      accounts: '++id, user_id, name, bank_name, account_type, currency, current_balance, is_active, created_at, updated_at',
      transactions: '++id, user_id, account_id, date, amount, type, category, payment_method, created_at, updated_at',
      income_sources: '++id, user_id, name, employer, amount, currency, frequency, payment_day, destination_account_id, is_active, next_payment_date, created_at, updated_at',
      automatic_payments: '++id, income_source_id, transaction_id, expected_date, actual_date, status, created_at',
      categories: '++id, user_id, name, type, emoji, color, is_custom, created_at, updated_at',
      goals: '++id, user_id, title, target_amount, current_amount, target_date, category, priority, created_at, updated_at',
      notifications: '++id, user_id, type, title, message, data, is_read, scheduled_for, created_at',
      budgets: '++id, user_id, name, category, monthly_limit, current_spent, alert_threshold, is_active, created_at, updated_at',
      // Nouvelles tables pour audit et logs
      audit_logs: '++id, user_id, table_name, operation, record_id, old_data, new_data, timestamp',
      system_config: '++id, key, value, updated_at'
    }).upgrade(trans => {
      // Migration automatique v1 → v2
      return this.migrateFromV1ToV2(trans);
    });
  }

  /**
   * Configurer les hooks de base de données
   */
  setupHooks() {
    // Hook pour validation automatique avant insertion
    this.db.users.hook('creating', (primKey, obj, trans) => {
      this.validateBeforeCreate('user', obj);
      this.addTimestamps(obj);
    });

    this.db.accounts.hook('creating', (primKey, obj, trans) => {
      this.validateBeforeCreate('account', obj);
      this.addTimestamps(obj);
    });

    this.db.transactions.hook('creating', (primKey, obj, trans) => {
      this.validateBeforeCreate('transaction', obj);
      this.addTimestamps(obj);
    });

    this.db.income_sources.hook('creating', (primKey, obj, trans) => {
      this.validateBeforeCreate('incomeSource', obj);
      this.addTimestamps(obj);
    });

    // Hook pour mise à jour automatique des timestamps
    ['users', 'accounts', 'transactions', 'income_sources', 'categories', 'goals', 'budgets'].forEach(tableName => {
      this.db[tableName].hook('updating', (modifications, primKey, obj, trans) => {
        modifications.updated_at = new Date();
        
        // Log des modifications pour audit
        this.logAuditTrail(tableName, 'update', primKey, obj, modifications);
      });
    });

    // Hook pour audit des suppressions
    ['users', 'accounts', 'transactions', 'income_sources'].forEach(tableName => {
      this.db[tableName].hook('deleting', (primKey, obj, trans) => {
        this.logAuditTrail(tableName, 'delete', primKey, obj, null);
      });
    });
  }

  /**
   * Exécuter les migrations nécessaires
   */
  async runMigrations() {
    try {
      const currentVersion = await this.getCurrentVersion();
      console.log(`🔄 Version DB actuelle: ${currentVersion}, cible: ${this.version}`);

      if (currentVersion < this.version) {
        eventBus.emit(AUTH_EVENTS.DB_MIGRATION_START, {
          from: currentVersion,
          to: this.version
        });

        // Les migrations sont automatiquement gérées par Dexie
        console.log('✅ Migrations exécutées avec succès');
        
        eventBus.emit(AUTH_EVENTS.DB_MIGRATION_COMPLETE, {
          from: currentVersion,
          to: this.version
        });
      }
    } catch (error) {
      console.error('❌ Erreur pendant les migrations:', error);
      throw error;
    }
  }

  /**
   * Migration de v1 vers v2
   */
  async migrateFromV1ToV2(trans) {
    console.log('🔄 Migration v1 → v2...');

    // Ajouter les nouveaux champs aux utilisateurs existants
    await trans.users.toCollection().modify(user => {
      if (!user.setup_completed) {
        user.setup_completed = true; // Utilisateurs existants considérés comme configurés
      }
      if (!user.last_login) {
        user.last_login = user.created_at || new Date();
      }
    });

    // Ajouter les nouveaux champs aux comptes existants
    await trans.accounts.toCollection().modify(account => {
      if (!account.current_balance && account.balance !== undefined) {
        account.current_balance = account.balance;
      }
      if (!account.updated_at) {
        account.updated_at = account.created_at || new Date();
      }
    });

    // Initialiser la configuration système
    await trans.system_config.add({
      key: 'migration_v2_completed',
      value: new Date().toISOString(),
      updated_at: new Date()
    });

    this.migrationHistory.push({
      from: 1,
      to: 2,
      completedAt: new Date(),
      type: 'schema_upgrade'
    });

    console.log('✅ Migration v1 → v2 terminée');
  }

  // === MÉTHODES CRUD AMÉLIORÉES ===

  /**
   * Créer un enregistrement avec validation
   * @param {string} tableName - Nom de la table
   * @param {Object} data - Données à insérer
   */
  async create(tableName, data) {
    await this.ensureInitialized();

    try {
      // Validation selon le schéma
      const schemaName = this.getSchemaName(tableName);
      if (schemaName) {
        const validation = validationService.validate(schemaName, data);
        if (!validation.isValid) {
          throw new Error(`Validation échouée: ${validation.errors.map(e => e.message).join(', ')}`);
        }
        data = validation.sanitizedData;
      }

      const result = await this.db[tableName].add(data);
      
      eventBus.emit(`db:${tableName}:created`, { id: result, data });
      
      return result;
    } catch (error) {
      console.error(`❌ Erreur création ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Lire un enregistrement par ID
   * @param {string} tableName - Nom de la table
   * @param {number} id - ID de l'enregistrement
   */
  async read(tableName, id) {
    await this.ensureInitialized();
    return await this.db[tableName].get(id);
  }

  /**
   * Mettre à jour un enregistrement
   * @param {string} tableName - Nom de la table
   * @param {number} id - ID de l'enregistrement
   * @param {Object} updates - Données à mettre à jour
   */
  async update(tableName, id, updates) {
    await this.ensureInitialized();

    try {
      // Validation des mises à jour
      const schemaName = this.getSchemaName(tableName);
      if (schemaName) {
        const validation = validationService.validate(schemaName, updates, { partial: true });
        if (!validation.isValid) {
          throw new Error(`Validation échouée: ${validation.errors.map(e => e.message).join(', ')}`);
        }
        updates = validation.sanitizedData;
      }

      const result = await this.db[tableName].update(id, updates);
      
      eventBus.emit(`db:${tableName}:updated`, { id, updates });
      
      return result;
    } catch (error) {
      console.error(`❌ Erreur mise à jour ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Supprimer un enregistrement
   * @param {string} tableName - Nom de la table
   * @param {number} id - ID de l'enregistrement
   */
  async delete(tableName, id) {
    await this.ensureInitialized();

    try {
      const record = await this.read(tableName, id);
      const result = await this.db[tableName].delete(id);
      
      eventBus.emit(`db:${tableName}:deleted`, { id, record });
      
      return result;
    } catch (error) {
      console.error(`❌ Erreur suppression ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Rechercher des enregistrements
   * @param {string} tableName - Nom de la table
   * @param {Object} filters - Filtres de recherche
   * @param {Object} options - Options (limit, offset, orderBy)
   */
  async query(tableName, filters = {}, options = {}) {
    await this.ensureInitialized();

    try {
      let query = this.db[tableName].toCollection();

      // Appliquer les filtres
      for (const [field, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          query = query.filter(item => {
            if (Array.isArray(value)) {
              return value.includes(item[field]);
            }
            return item[field] === value;
          });
        }
      }

      // Tri
      if (options.orderBy) {
        const [field, direction] = options.orderBy.split(' ');
        query = direction === 'desc' ? query.reverse() : query;
        query = query.sortBy(field);
      }

      // Limite et offset
      if (options.offset) {
        query = query.offset(options.offset);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      return await query.toArray();
    } catch (error) {
      console.error(`❌ Erreur requête ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Exécuter une transaction
   * @param {Function} operation - Fonction à exécuter dans la transaction
   */
  async transaction(operation) {
    await this.ensureInitialized();

    try {
      return await this.db.transaction('rw', this.db.tables, async () => {
        return await operation(this.db);
      });
    } catch (error) {
      console.error('❌ Erreur transaction:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder la base de données
   */
  async backup() {
    await this.ensureInitialized();

    try {
      const backup = {
        version: this.version,
        timestamp: new Date().toISOString(),
        data: {}
      };

      // Exporter toutes les tables
      for (const table of this.db.tables) {
        backup.data[table.name] = await table.toArray();
      }

      return backup;
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      throw error;
    }
  }

  /**
   * Restaurer la base de données
   * @param {Object} backup - Données de sauvegarde
   */
  async restore(backup) {
    await this.ensureInitialized();

    try {
      await this.db.transaction('rw', this.db.tables, async () => {
        // Vider toutes les tables
        for (const table of this.db.tables) {
          await table.clear();
        }

        // Restaurer les données
        for (const [tableName, data] of Object.entries(backup.data)) {
          if (this.db[tableName]) {
            await this.db[tableName].bulkAdd(data);
          }
        }
      });

      console.log('✅ Base de données restaurée avec succès');
      eventBus.emit(AUTH_EVENTS.DB_CONNECTED, { restored: true });
    } catch (error) {
      console.error('❌ Erreur restauration:', error);
      throw error;
    }
  }

  // === MÉTHODES PRIVÉES ===

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async getCurrentVersion() {
    try {
      return this.db.verno || 1;
    } catch {
      return 1;
    }
  }

  getSchemaName(tableName) {
    const mapping = {
      users: 'user',
      accounts: 'account',
      transactions: 'transaction',
      income_sources: 'incomeSource'
    };
    return mapping[tableName];
  }

  validateBeforeCreate(schemaName, obj) {
    const validation = validationService.validate(schemaName, obj);
    if (!validation.isValid) {
      throw new Error(`Validation ${schemaName}: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    Object.assign(obj, validation.sanitizedData);
  }

  addTimestamps(obj) {
    const now = new Date();
    if (!obj.created_at) obj.created_at = now;
    if (!obj.updated_at) obj.updated_at = now;
  }

  async logAuditTrail(tableName, operation, recordId, oldData, newData) {
    try {
      if (this.db.audit_logs) {
        await this.db.audit_logs.add({
          table_name: tableName,
          operation,
          record_id: recordId,
          old_data: oldData ? JSON.stringify(oldData) : null,
          new_data: newData ? JSON.stringify(newData) : null,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.warn('⚠️ Erreur log audit:', error);
    }
  }
}

// Instance globale
const databaseService = new DatabaseService();

export default databaseService;

// Export pour compatibilité avec l'ancien système
export { databaseService as db };

// Debug tools
if (process.env.NODE_ENV === 'development') {
  window.debugDatabase = {
    service: databaseService,
    backup: () => databaseService.backup(),
    query: (table, filters) => databaseService.query(table, filters),
    stats: async () => {
      const db = databaseService.db;
      if (!db) return null;
      
      const stats = {};
      for (const table of db.tables) {
        stats[table.name] = await table.count();
      }
      return stats;
    }
  };
}