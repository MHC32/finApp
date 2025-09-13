// src/services/core/ValidationService.js
import eventBus, { AUTH_EVENTS } from './EventBus.js';

class ValidationService {
  constructor() {
    this.schemas = new Map();
    this.errorHistory = [];
    this.setupSchemas();
  }

  // === SCHÉMAS DE VALIDATION ===

  setupSchemas() {
    // Schéma utilisateur
    this.schemas.set('user', {
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      email: { type: 'email', required: true },
      created_at: { type: 'date', required: true },
      updated_at: { type: 'date', required: true },
      last_login: { type: 'date', required: false },
      preferences: { type: 'object', required: false, schema: 'userPreferences' },
      security_settings: { type: 'object', required: false, schema: 'securitySettings' }
    });

    // Schéma préférences utilisateur
    this.schemas.set('userPreferences', {
      currency: { type: 'string', required: true, enum: ['HTG', 'USD', 'BOTH'] },
      theme: { type: 'string', required: true, enum: ['light', 'dark'] },
      language: { type: 'string', required: true, enum: ['fr', 'ht', 'en'] },
      timezone: { type: 'string', required: false, default: 'America/Port-au-Prince' },
      notifications: { type: 'object', required: false, schema: 'notificationSettings' }
    });

    // Schéma paramètres de sécurité
    this.schemas.set('securitySettings', {
      session_timeout: { type: 'number', required: true, min: -1, max: 1440 },
      two_factor_enabled: { type: 'boolean', required: true, default: false },
      biometric_login: { type: 'boolean', required: true, default: false },
      auto_backup: { type: 'boolean', required: true, default: true },
      login_notifications: { type: 'boolean', required: true, default: true }
    });

    // Schéma notifications
    this.schemas.set('notificationSettings', {
      budget_alerts: { type: 'boolean', required: true, default: true },
      income_reminders: { type: 'boolean', required: true, default: true },
      goal_notifications: { type: 'boolean', required: true, default: true },
      weekly_summary: { type: 'boolean', required: true, default: true }
    });

    // Schéma compte bancaire
    this.schemas.set('account', {
      user_id: { type: 'number', required: true },
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      bank_name: { type: 'string', required: true, maxLength: 200 },
      account_type: { type: 'string', required: true, enum: ['checking', 'savings', 'credit', 'cash'] },
      currency: { type: 'string', required: true, enum: ['HTG', 'USD'] },
      current_balance: { type: 'number', required: true },
      color: { type: 'string', required: false, pattern: /^#[0-9A-F]{6}$/i },
      is_active: { type: 'boolean', required: true, default: true },
      account_number: { type: 'string', required: false, maxLength: 50 },
      description: { type: 'string', required: false, maxLength: 500 },
      created_at: { type: 'date', required: true },
      updated_at: { type: 'date', required: true }
    });

    // Schéma transaction
    this.schemas.set('transaction', {
      user_id: { type: 'number', required: true },
      account_id: { type: 'number', required: true },
      description: { type: 'string', required: true, minLength: 1, maxLength: 500 },
      amount: { type: 'number', required: true },
      type: { type: 'string', required: true, enum: ['income', 'expense', 'transfer'] },
      category: { type: 'string', required: true, maxLength: 100 },
      payment_method: { type: 'string', required: false, maxLength: 50 },
      date: { type: 'date', required: true },
      created_at: { type: 'date', required: true },
      updated_at: { type: 'date', required: true }
    });

    // Schéma source de revenus
    this.schemas.set('incomeSource', {
      user_id: { type: 'number', required: true },
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      employer: { type: 'string', required: false, maxLength: 200 },
      amount: { type: 'number', required: true, min: 0 },
      currency: { type: 'string', required: true, enum: ['HTG', 'USD'] },
      frequency: { type: 'string', required: true, enum: ['monthly', 'bi_monthly', 'weekly', 'bi_weekly'] },
      payment_day: { type: 'number', required: true, min: 0, max: 31 },
      payment_time: { type: 'string', required: true, pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
      destination_account_id: { type: 'number', required: true },
      category: { type: 'string', required: true, maxLength: 100 },
      is_active: { type: 'boolean', required: true, default: true },
      next_payment_date: { type: 'date', required: true },
      created_at: { type: 'date', required: true },
      updated_at: { type: 'date', required: true }
    });

    // Schéma données de setup
    this.schemas.set('setupData', {
      profile: { type: 'object', required: true, schema: 'userPreferences' },
      security: { type: 'object', required: true, schema: 'securitySettings' },
      accounts: { type: 'array', required: false, itemSchema: 'setupAccount' },
      income_sources: { type: 'array', required: false, itemSchema: 'setupIncomeSource' },
      categories: { type: 'array', required: false, itemSchema: 'setupCategory' },
      goals: { type: 'object', required: false }
    });

    // Schémas simplifiés pour le setup
    this.schemas.set('setupAccount', {
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      bank_name: { type: 'string', required: true, maxLength: 200 },
      account_type: { type: 'string', required: true, enum: ['checking', 'savings', 'credit', 'cash'] },
      currency: { type: 'string', required: true, enum: ['HTG', 'USD'] },
      current_balance: { type: 'string', required: true }, // String pendant le setup
      color: { type: 'string', required: false }
    });

    this.schemas.set('setupIncomeSource', {
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      employer: { type: 'string', required: false, maxLength: 200 },
      amount: { type: 'string', required: true }, // String pendant le setup
      currency: { type: 'string', required: true, enum: ['HTG', 'USD'] },
      frequency: { type: 'string', required: true, enum: ['monthly', 'bi_monthly', 'weekly', 'bi_weekly'] },
      payment_day: { type: 'number', required: true },
      payment_time: { type: 'string', required: true },
      destination_account_id: { type: 'string', required: true }, // String pendant le setup
      category: { type: 'string', required: true }
    });

    this.schemas.set('setupCategory', {
      name: { type: 'string', required: true, maxLength: 100 },
      emoji: { type: 'string', required: true },
      type: { type: 'string', required: true, enum: ['income', 'expense'] },
      color: { type: 'string', required: true },
      enabled: { type: 'boolean', required: true }
    });
  }

  // === MÉTHODES PUBLIQUES ===

  /**
   * Valider des données selon un schéma
   * @param {string} schemaName - Nom du schéma
   * @param {*} data - Données à valider
   * @param {Object} options - Options de validation
   */
  validate(schemaName, data, options = {}) {
    const result = {
      isValid: true,
      errors: [],
      sanitizedData: null,
      warnings: []
    };

    try {
      const schema = this.schemas.get(schemaName);
      if (!schema) {
        throw new Error(`Schéma "${schemaName}" introuvable`);
      }

      // Sanitiser d'abord
      const sanitized = this.sanitize(data, schema);
      
      // Puis valider
      const validation = this.validateAgainstSchema(sanitized, schema, schemaName);
      
      result.sanitizedData = sanitized;
      result.errors = validation.errors;
      result.warnings = validation.warnings;
      result.isValid = validation.errors.length === 0;

      // Logger si erreurs
      if (!result.isValid) {
        this.logValidationError(schemaName, data, result.errors);
        
        eventBus.emit(AUTH_EVENTS.APP_ERROR, {
          type: 'validation_error',
          schema: schemaName,
          errors: result.errors
        });
      }

    } catch (error) {
      result.isValid = false;
      result.errors.push({
        field: 'global',
        message: error.message,
        type: 'system_error'
      });
    }

    return result;
  }

  /**
   * Valider spécifiquement un utilisateur
   * @param {Object} userData - Données utilisateur
   */
  validateUser(userData) {
    return this.validate('user', userData);
  }

  /**
   * Valider spécifiquement un compte
   * @param {Object} accountData - Données de compte
   */
  validateAccount(accountData) {
    return this.validate('account', accountData);
  }

  /**
   * Valider spécifiquement une transaction
   * @param {Object} transactionData - Données de transaction
   */
  validateTransaction(transactionData) {
    return this.validate('transaction', transactionData);
  }

  /**
   * Valider spécifiquement une source de revenus
   * @param {Object} incomeData - Données de source de revenus
   */
  validateIncomeSource(incomeData) {
    return this.validate('incomeSource', incomeData);
  }

  /**
   * Valider des données de setup complet
   * @param {Object} setupData - Toutes les données de setup
   */
  validateSetupData(setupData) {
    return this.validate('setupData', setupData);
  }

  /**
   * Sanitiser des données d'entrée
   * @param {*} data - Données à sanitiser
   * @param {Object} schema - Schéma de référence (optionnel)
   */
  sanitize(data, schema = null) {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (typeof data === 'object' && !Array.isArray(data)) {
      return this.sanitizeObject(data, schema);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    return data;
  }

  /**
   * Vérifier si un email est valide
   * @param {string} email - Email à vérifier
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Vérifier si un montant est valide
   * @param {*} amount - Montant à vérifier
   */
  isValidAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && isFinite(num);
  }

  /**
   * Obtenir les erreurs de validation récentes
   * @param {number} limit - Nombre d'erreurs à retourner
   */
  getValidationErrors(limit = 50) {
    return this.errorHistory.slice(-limit);
  }

  /**
   * Nettoyer l'historique des erreurs
   */
  clearErrorHistory() {
    this.errorHistory = [];
  }

  // === MÉTHODES PRIVÉES ===

  validateAgainstSchema(data, schema, schemaName) {
    const errors = [];
    const warnings = [];

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const value = data[fieldName];

      // Vérifier si requis
      if (fieldSchema.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: fieldName,
          message: `Le champ "${fieldName}" est requis`,
          type: 'required'
        });
        continue;
      }

      // Si pas de valeur et pas requis, appliquer la valeur par défaut
      if (value === undefined && fieldSchema.default !== undefined) {
        data[fieldName] = fieldSchema.default;
        continue;
      }

      // Si pas de valeur, passer au suivant
      if (value === undefined || value === null) {
        continue;
      }

      // Valider le type
      const typeValidation = this.validateFieldType(value, fieldSchema, fieldName);
      if (!typeValidation.isValid) {
        errors.push(...typeValidation.errors);
      }

      // Valider les contraintes spécifiques
      const constraintValidation = this.validateFieldConstraints(value, fieldSchema, fieldName);
      if (!constraintValidation.isValid) {
        errors.push(...constraintValidation.errors);
      }
      warnings.push(...constraintValidation.warnings);

      // Valider les schémas imbriqués
      if (fieldSchema.schema && typeof value === 'object') {
        const nestedSchema = this.schemas.get(fieldSchema.schema);
        if (nestedSchema) {
          const nestedValidation = this.validateAgainstSchema(value, nestedSchema, fieldSchema.schema);
          errors.push(...nestedValidation.errors.map(err => ({
            ...err,
            field: `${fieldName}.${err.field}`
          })));
        }
      }

      // Valider les tableaux avec schéma d'éléments
      if (fieldSchema.itemSchema && Array.isArray(value)) {
        const itemSchema = this.schemas.get(fieldSchema.itemSchema);
        if (itemSchema) {
          value.forEach((item, index) => {
            const itemValidation = this.validateAgainstSchema(item, itemSchema, fieldSchema.itemSchema);
            errors.push(...itemValidation.errors.map(err => ({
              ...err,
              field: `${fieldName}[${index}].${err.field}`
            })));
          });
        }
      }
    }

    return { errors, warnings };
  }

  validateFieldType(value, fieldSchema, fieldName) {
    const errors = [];
    const type = fieldSchema.type;

    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être une chaîne de caractères`,
            type: 'type_mismatch'
          });
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être un nombre valide`,
            type: 'type_mismatch'
          });
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être un booléen`,
            type: 'type_mismatch'
          });
        }
        break;

      case 'date':
        if (!(value instanceof Date) && !this.isValidDateString(value)) {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être une date valide`,
            type: 'type_mismatch'
          });
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être un email valide`,
            type: 'format_invalid'
          });
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être un objet`,
            type: 'type_mismatch'
          });
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push({
            field: fieldName,
            message: `"${fieldName}" doit être un tableau`,
            type: 'type_mismatch'
          });
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  }

  validateFieldConstraints(value, fieldSchema, fieldName) {
    const errors = [];
    const warnings = [];

    // Contraintes de longueur pour les chaînes
    if (typeof value === 'string') {
      if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
        errors.push({
          field: fieldName,
          message: `"${fieldName}" doit contenir au moins ${fieldSchema.minLength} caractères`,
          type: 'min_length'
        });
      }

      if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
        errors.push({
          field: fieldName,
          message: `"${fieldName}" ne peut pas dépasser ${fieldSchema.maxLength} caractères`,
          type: 'max_length'
        });
      }

      // Pattern regex
      if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
        errors.push({
          field: fieldName,
          message: `"${fieldName}" ne respecte pas le format requis`,
          type: 'pattern_mismatch'
        });
      }
    }

    // Contraintes numériques
    if (typeof value === 'number') {
      if (fieldSchema.min !== undefined && value < fieldSchema.min) {
        errors.push({
          field: fieldName,
          message: `"${fieldName}" doit être supérieur ou égal à ${fieldSchema.min}`,
          type: 'min_value'
        });
      }

      if (fieldSchema.max !== undefined && value > fieldSchema.max) {
        errors.push({
          field: fieldName,
          message: `"${fieldName}" doit être inférieur ou égal à ${fieldSchema.max}`,
          type: 'max_value'
        });
      }
    }

    // Énumérations
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      errors.push({
        field: fieldName,
        message: `"${fieldName}" doit être l'une des valeurs: ${fieldSchema.enum.join(', ')}`,
        type: 'enum_violation'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  sanitizeString(str) {
    if (typeof str !== 'string') return str;

    return str
      .trim()
      .replace(/\s+/g, ' ') // Remplacer espaces multiples par un seul
      .replace(/[<>]/g, ''); // Supprimer caractères dangereux
  }

  sanitizeObject(obj, schema = null) {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
      const fieldSchema = schema ? schema[key] : null;
      
      if (fieldSchema && fieldSchema.type === 'date' && typeof value === 'string') {
        // Convertir les chaînes en dates
        const date = new Date(value);
        sanitized[key] = isNaN(date.getTime()) ? value : date;
      } else if (fieldSchema && fieldSchema.type === 'number' && typeof value === 'string') {
        // Convertir les chaînes en nombres si possible
        const num = parseFloat(value);
        sanitized[key] = isNaN(num) ? value : num;
      } else {
        sanitized[key] = this.sanitize(value);
      }
    }

    return sanitized;
  }

  isValidDateString(value) {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  logValidationError(schemaName, data, errors) {
    const errorEntry = {
      timestamp: new Date(),
      schema: schemaName,
      dataSize: JSON.stringify(data).length,
      errorCount: errors.length,
      errors: errors.map(err => ({
        field: err.field,
        type: err.type,
        message: err.message
      }))
    };

    this.errorHistory.push(errorEntry);

    // Limiter l'historique
    if (this.errorHistory.length > 1000) {
      this.errorHistory = this.errorHistory.slice(-500);
    }

    console.warn('Erreur de validation:', errorEntry);
  }
}

// Instance globale
const validationService = new ValidationService();

export default validationService;

// Debug tools
if (process.env.NODE_ENV === 'development') {
  window.debugValidation = {
    service: validationService,
    validateUser: (data) => validationService.validateUser(data),
    validateAccount: (data) => validationService.validateAccount(data),
    getErrors: () => validationService.getValidationErrors(),
    schemas: Array.from(validationService.schemas.keys())
  };
}