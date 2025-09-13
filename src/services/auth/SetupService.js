// src/services/auth/SetupService.js
import authService from './AuthService.js';
import databaseService from '../core/DatabaseService.js';
import validationService from '../core/ValidationService.js';
import eventBus, { AUTH_EVENTS } from '../core/EventBus.js';

class SetupService {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 7;
    this.stepData = new Map();
    this.isProcessing = false;
    this.backupData = null;
  }

  /**
   * Valider une étape du setup
   * @param {number} stepNumber - Numéro de l'étape
   * @param {Object} data - Données de l'étape
   */
  async validateStep(stepNumber, data) {
    try {
      console.log(`🔍 Validation étape ${stepNumber}...`);

      const validator = this.getStepValidator(stepNumber);
      const result = await validator(data);

      if (result.isValid) {
        console.log(`✅ Étape ${stepNumber} validée`);
        
        eventBus.emit(AUTH_EVENTS.SETUP_STEP_COMPLETE, {
          step: stepNumber,
          data: result.sanitizedData
        });
      } else {
        console.warn(`⚠️ Erreurs étape ${stepNumber}:`, result.errors);
      }

      return result;

    } catch (error) {
      console.error(`❌ Erreur validation étape ${stepNumber}:`, error);
      return {
        isValid: false,
        errors: [{ message: error.message, type: 'system_error' }],
        sanitizedData: null
      };
    }
  }

  /**
   * Sauvegarder une étape du setup
   * @param {number} stepNumber - Numéro de l'étape
   * @param {Object} data - Données validées de l'étape
   */
  async saveStep(stepNumber, data) {
    try {
      console.log(`💾 Sauvegarde étape ${stepNumber}...`);

      // Valider avant de sauvegarder
      const validation = await this.validateStep(stepNumber, data);
      if (!validation.isValid) {
        throw new Error(`Validation échouée: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Sauvegarder dans la Map locale
      this.stepData.set(stepNumber, validation.sanitizedData);

      // Mettre à jour l'étape actuelle
      if (stepNumber === this.currentStep) {
        this.currentStep = Math.min(this.totalSteps, stepNumber + 1);
      }

      console.log(`✅ Étape ${stepNumber} sauvegardée`);
      return { success: true, data: validation.sanitizedData };

    } catch (error) {
      console.error(`❌ Erreur sauvegarde étape ${stepNumber}:`, error);
      throw error;
    }
  }

  /**
   * Finaliser le setup complet
   * @param {Object} allData - Toutes les données du setup
   */
  async completeSetup(allData) {
    if (this.isProcessing) {
      throw new Error('Setup déjà en cours de traitement');
    }

    this.isProcessing = true;

    try {
      console.log('🚀 === FINALISATION SETUP COMPLET ===');

      // Créer une sauvegarde avant traitement
      await this.createBackup();

      // Validation complète des données
      const validation = validationService.validateSetupData(allData);
      if (!validation.isValid) {
        throw new Error(`Validation setup: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      const sanitizedData = validation.sanitizedData;
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }

      // Transaction complète pour atomicité
      await databaseService.transaction(async (db) => {
        // 1. Mettre à jour le profil utilisateur
        await this.saveUserProfile(user.id, sanitizedData.profile);

        // 2. Sauvegarder les paramètres de sécurité
        await this.saveSecuritySettings(user.id, sanitizedData.security);

        // 3. Sauvegarder les comptes bancaires
        if (sanitizedData.accounts?.length > 0) {
          await this.saveAccounts(user.id, sanitizedData.accounts);
        }

        // 4. Sauvegarder les sources de revenus
        if (sanitizedData.income_sources?.length > 0) {
          await this.saveIncomeSources(user.id, sanitizedData.income_sources);
        }

        // 5. Sauvegarder les catégories personnalisées
        if (sanitizedData.categories?.length > 0) {
          await this.saveCategories(user.id, sanitizedData.categories);
        }

        // 6. Sauvegarder les objectifs d'épargne
        if (sanitizedData.goals) {
          await this.saveGoals(user.id, sanitizedData.goals);
        }

        // 7. Marquer le setup comme terminé
        await db.users.update(user.id, {
          setup_completed: true,
          setup_completed_at: new Date(),
          updated_at: new Date()
        });
      });

      // Rafraîchir les données utilisateur
      await authService.refreshUserData();

      // Nettoyer les données temporaires
      this.stepData.clear();
      this.currentStep = 1;

      console.log('🎉 Setup terminé avec succès');

      eventBus.emit(AUTH_EVENTS.SETUP_COMPLETE, {
        userId: user.id,
        completedAt: new Date(),
        summary: this.generateSetupSummary(sanitizedData)
      });

      return {
        success: true,
        summary: this.generateSetupSummary(sanitizedData)
      };

    } catch (error) {
      console.error('❌ Erreur finalisation setup:', error);

      // Restaurer la sauvegarde en cas d'erreur
      await this.restoreBackup();

      eventBus.emit(AUTH_EVENTS.SETUP_ERROR, {
        error: error.message,
        step: 'completion'
      });

      throw error;

    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Annuler une étape (rollback)
   * @param {number} stepNumber - Numéro de l'étape à annuler
   */
  async rollbackStep(stepNumber) {
    try {
      console.log(`🔄 Rollback étape ${stepNumber}...`);

      // Supprimer de la Map locale
      this.stepData.delete(stepNumber);

      // Revenir à l'étape précédente si nécessaire
      if (stepNumber <= this.currentStep) {
        this.currentStep = stepNumber;
      }

      console.log(`✅ Rollback étape ${stepNumber} terminé`);
      return { success: true };

    } catch (error) {
      console.error(`❌ Erreur rollback étape ${stepNumber}:`, error);
      throw error;
    }
  }

  /**
   * Obtenir l'état actuel du setup
   */
  getSetupState() {
    const completedSteps = Array.from(this.stepData.keys()).sort();
    const progress = (completedSteps.length / this.totalSteps) * 100;

    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      completedSteps,
      progress: Math.round(progress),
      isProcessing: this.isProcessing,
      stepData: Object.fromEntries(this.stepData)
    };
  }

  /**
   * Réinitialiser le setup
   */
  reset() {
    this.stepData.clear();
    this.currentStep = 1;
    this.isProcessing = false;
    this.backupData = null;
    console.log('🔄 Setup réinitialisé');
  }

  // === VALIDATEURS PAR ÉTAPE ===

  getStepValidator(stepNumber) {
    const validators = {
      1: this.validateProfileStep,
      2: this.validateSecurityStep,
      3: this.validateAccountsStep,
      4: this.validateIncomeSourcesStep,
      5: this.validateCategoriesStep,
      6: this.validateGoalsStep,
      7: this.validateCompletionStep
    };

    return validators[stepNumber] || this.validateGenericStep;
  }

  async validateProfileStep(data) {
    const validation = validationService.validate('userPreferences', data);
    
    // Validations spécifiques au profil
    if (validation.isValid) {
      if (!data.currency_preference) {
        validation.errors.push({ message: 'Devise principale requise', field: 'currency_preference' });
        validation.isValid = false;
      }
      
      if (!data.language) {
        validation.errors.push({ message: 'Langue requise', field: 'language' });
        validation.isValid = false;
      }
    }

    return validation;
  }

  async validateSecurityStep(data) {
    const validation = validationService.validate('securitySettings', data);
    
    // Validations spécifiques à la sécurité
    if (validation.isValid) {
      if (data.session_timeout < -1 || data.session_timeout > 1440) {
        validation.errors.push({ 
          message: 'Timeout de session invalide (entre -1 et 1440 minutes)', 
          field: 'session_timeout' 
        });
        validation.isValid = false;
      }
    }

    return validation;
  }

  async validateAccountsStep(data) {
    if (!Array.isArray(data)) {
      return {
        isValid: false,
        errors: [{ message: 'Les comptes doivent être un tableau', field: 'accounts' }],
        sanitizedData: null
      };
    }

    if (data.length === 0) {
      return {
        isValid: false,
        errors: [{ message: 'Au moins un compte bancaire est requis', field: 'accounts' }],
        sanitizedData: null
      };
    }

    const sanitizedAccounts = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const account = data[i];
      const validation = validationService.validate('setupAccount', account);
      
      if (validation.isValid) {
        // Validation supplémentaire pour les comptes
        const sanitized = validation.sanitizedData;
        
        // Convertir le solde en nombre
        const balance = parseFloat(sanitized.current_balance);
        if (isNaN(balance)) {
          errors.push({ 
            message: `Solde invalide pour le compte "${sanitized.name}"`, 
            field: `accounts[${i}].current_balance` 
          });
          continue;
        }
        
        sanitized.current_balance = balance;
        sanitizedAccounts.push(sanitized);
      } else {
        errors.push(...validation.errors.map(err => ({
          ...err,
          field: `accounts[${i}].${err.field}`
        })));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedAccounts
    };
  }

  async validateIncomeSourcesStep(data) {
    if (!Array.isArray(data)) {
      return {
        isValid: true, // Les revenus sont optionnels
        errors: [],
        sanitizedData: []
      };
    }

    const sanitizedSources = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const source = data[i];
      const validation = validationService.validate('setupIncomeSource', source);
      
      if (validation.isValid) {
        const sanitized = validation.sanitizedData;
        
        // Convertir le montant en nombre
        const amount = parseFloat(sanitized.amount);
        if (isNaN(amount) || amount <= 0) {
          errors.push({ 
            message: `Montant invalide pour "${sanitized.name}"`, 
            field: `income_sources[${i}].amount` 
          });
          continue;
        }
        
        sanitized.amount = amount;
        sanitized.destination_account_id = parseInt(sanitized.destination_account_id);
        
        sanitizedSources.push(sanitized);
      } else {
        errors.push(...validation.errors.map(err => ({
          ...err,
          field: `income_sources[${i}].${err.field}`
        })));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedSources
    };
  }

  async validateCategoriesStep(data) {
    if (!Array.isArray(data)) {
      return {
        isValid: false,
        errors: [{ message: 'Les catégories doivent être un tableau', field: 'categories' }],
        sanitizedData: null
      };
    }

    const enabledCategories = data.filter(cat => cat.enabled);
    if (enabledCategories.length === 0) {
      return {
        isValid: false,
        errors: [{ message: 'Au moins une catégorie doit être activée', field: 'categories' }],
        sanitizedData: null
      };
    }

    const sanitizedCategories = [];
    const errors = [];

    for (let i = 0; i < enabledCategories.length; i++) {
      const category = enabledCategories[i];
      const validation = validationService.validate('setupCategory', category);
      
      if (validation.isValid) {
        sanitizedCategories.push(validation.sanitizedData);
      } else {
        errors.push(...validation.errors.map(err => ({
          ...err,
          field: `categories[${i}].${err.field}`
        })));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedCategories
    };
  }

  async validateGoalsStep(data) {
    if (!data || typeof data !== 'object') {
      return {
        isValid: true, // Les objectifs sont optionnels
        errors: [],
        sanitizedData: {}
      };
    }

    const sanitizedGoals = {};
    const errors = [];

    for (const [goalType, goalData] of Object.entries(data)) {
      if (goalData.enabled) {
        if (!goalData.target || goalData.target <= 0) {
          errors.push({ 
            message: `Montant objectif requis pour "${goalType}"`, 
            field: `goals.${goalType}.target` 
          });
        } else {
          sanitizedGoals[goalType] = {
            enabled: true,
            target: parseFloat(goalData.target)
          };
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedGoals
    };
  }

  async validateCompletionStep(data) {
    // Validation finale avant complétion
    return {
      isValid: true,
      errors: [],
      sanitizedData: data
    };
  }

  async validateGenericStep(data) {
    return {
      isValid: true,
      errors: [],
      sanitizedData: data
    };
  }

  // === MÉTHODES DE SAUVEGARDE ===

  async saveUserProfile(userId, profileData) {
    const currentUser = await databaseService.read('users', userId);
    const updatedPreferences = {
      ...currentUser.preferences,
      ...profileData
    };

    await databaseService.update('users', userId, {
      preferences: updatedPreferences
    });

    console.log('✅ Profil utilisateur mis à jour');
  }

  async saveSecuritySettings(userId, securityData) {
    const currentUser = await databaseService.read('users', userId);
    const updatedSecurity = {
      ...currentUser.security_settings,
      ...securityData
    };

    await databaseService.update('users', userId, {
      security_settings: updatedSecurity
    });

    console.log('✅ Paramètres de sécurité mis à jour');
  }

  async saveAccounts(userId, accountsData) {
    for (const accountData of accountsData) {
      await databaseService.create('accounts', {
        user_id: userId,
        name: accountData.name,
        bank_name: accountData.bank_name,
        account_type: accountData.account_type,
        currency: accountData.currency,
        current_balance: accountData.current_balance,
        color: accountData.color || '#3B82F6',
        is_active: true,
        account_number: accountData.account_number || '',
        description: accountData.description || ''
      });
    }

    console.log(`✅ ${accountsData.length} compte(s) sauvegardé(s)`);
  }

  async saveIncomeSources(userId, incomeSourcesData) {
    for (const sourceData of incomeSourcesData) {
      await databaseService.create('income_sources', {
        user_id: userId,
        name: sourceData.name,
        employer: sourceData.employer || '',
        amount: sourceData.amount,
        currency: sourceData.currency,
        frequency: sourceData.frequency,
        payment_day: sourceData.payment_day,
        payment_time: sourceData.payment_time,
        destination_account_id: sourceData.destination_account_id,
        category: sourceData.category,
        is_active: true,
        next_payment_date: this.calculateNextPaymentDate(sourceData.frequency, sourceData.payment_day)
      });
    }

    console.log(`✅ ${incomeSourcesData.length} source(s) de revenus sauvegardée(s)`);
  }

  async saveCategories(userId, categoriesData) {
    for (const categoryData of categoriesData) {
      await databaseService.create('categories', {
        user_id: userId,
        name: categoryData.name,
        type: categoryData.type,
        emoji: categoryData.emoji,
        color: categoryData.color,
        is_custom: true
      });
    }

    console.log(`✅ ${categoriesData.length} catégorie(s) personnalisée(s) sauvegardée(s)`);
  }

  async saveGoals(userId, goalsData) {
    for (const [goalType, goalData] of Object.entries(goalsData)) {
      if (goalData.enabled) {
        await databaseService.create('goals', {
          user_id: userId,
          title: this.getGoalTitle(goalType),
          target_amount: goalData.target,
          current_amount: 0,
          target_date: this.calculateGoalTargetDate(goalType),
          category: goalType,
          priority: this.getGoalPriority(goalType)
        });
      }
    }

    const enabledGoals = Object.values(goalsData).filter(g => g.enabled);
    console.log(`✅ ${enabledGoals.length} objectif(s) d'épargne sauvegardé(s)`);
  }

  // === UTILITAIRES ===

  async createBackup() {
    const user = authService.getCurrentUser();
    if (user) {
      this.backupData = await databaseService.backup();
      console.log('💾 Sauvegarde créée avant setup');
    }
  }

  async restoreBackup() {
    if (this.backupData) {
      await databaseService.restore(this.backupData);
      console.log('🔄 Sauvegarde restaurée après erreur');
    }
  }

  generateSetupSummary(data) {
    return {
      profile: {
        currency: data.profile?.currency_preference,
        language: data.profile?.language,
        theme: data.profile?.theme
      },
      accounts: data.accounts?.length || 0,
      incomeSourcesCount: data.income_sources?.length || 0,
      categoriesCount: data.categories?.filter(c => c.enabled).length || 0,
      goalsCount: Object.values(data.goals || {}).filter(g => g.enabled).length
    };
  }

  calculateNextPaymentDate(frequency, paymentDay) {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, paymentDay);
    
    switch (frequency) {
      case 'monthly':
        return nextMonth;
      case 'bi_monthly':
        return new Date(now.getFullYear(), now.getMonth() + 2, paymentDay);
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        return nextWeek;
      case 'bi_weekly':
        const nextBiWeek = new Date(now);
        nextBiWeek.setDate(now.getDate() + 14);
        return nextBiWeek;
      default:
        return nextMonth;
    }
  }

  getGoalTitle(goalType) {
    const titles = {
      emergency_fund: 'Fonds d\'urgence',
      vacation: 'Vacances',
      house_deposit: 'Acompte maison',
      education: 'Éducation'
    };
    return titles[goalType] || goalType;
  }

  getGoalPriority(goalType) {
    const priorities = {
      emergency_fund: 'high',
      house_deposit: 'high', 
      education: 'medium',
      vacation: 'low'
    };
    return priorities[goalType] || 'medium';
  }

  calculateGoalTargetDate(goalType) {
    const now = new Date();
    const months = {
      emergency_fund: 6,
      house_deposit: 24,
      education: 12,
      vacation: 8
    };
    
    const targetMonths = months[goalType] || 12;
    return new Date(now.getFullYear(), now.getMonth() + targetMonths, now.getDate());
  }
}

// Instance globale
const setupService = new SetupService();

export default setupService;