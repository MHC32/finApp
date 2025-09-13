// src/hooks/useSetup.js - HOOK MIGRÉ POUR LE PROCESSUS DE SETUP
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceManager from '../services/index.js';
import { AUTH_EVENTS } from '../services/core/EventBus.js';

export function useSetup() {
  // Services
  const authService = serviceManager.get('auth');
  const setupService = serviceManager.get('setup');
  const validationService = serviceManager.get('validation');
  const eventBus = serviceManager.get('eventBus');
  const navigate = useNavigate();

  // État local
  const [setupData, setSetupData] = useState({
    profile: {
      full_name: '',
      phone: '',
      language: 'fr',
      currency_preference: 'HTG',
      location: ''
    },
    security: {
      session_timeout: 30,
      two_factor: false,
      biometric_login: false,
      data_backup: true
    },
    accounts: [],
    income_sources: [],
    categories: [
      { name: 'Alimentation', emoji: '🍔', type: 'expense', color: '#EF4444', enabled: true },
      { name: 'Transport', emoji: '🚗', type: 'expense', color: '#3B82F6', enabled: true },
      { name: 'Logement', emoji: '🏠', type: 'expense', color: '#10B981', enabled: true },
      { name: 'Santé', emoji: '⚕️', type: 'expense', color: '#F59E0B', enabled: true },
      { name: 'Divertissement', emoji: '🎮', type: 'expense', color: '#8B5CF6', enabled: true },
      { name: 'Salaire', emoji: '💼', type: 'income', color: '#10B981', enabled: true },
      { name: 'Freelance', emoji: '🚀', type: 'income', color: '#8B5CF6', enabled: true },
      { name: 'Investissement', emoji: '📈', type: 'income', color: '#F59E0B', enabled: true }
    ],
    goals: {
      emergency_fund: { enabled: false, target: 0 },
      vacation: { enabled: false, target: 0 },
      house_deposit: { enabled: false, target: 0 },
      education: { enabled: false, target: 0 }
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [setupState, setSetupState] = useState(null);

  // État de validation par étape
  const [stepValidation, setStepValidation] = useState({
    1: false, 2: true, 3: false, 4: false, 5: true, 6: false, 7: false
  });

  // Initialisation
  useEffect(() => {
    initializeSetup();
    
    // Écouter les événements de setup
    const handleStepComplete = (data) => {
      console.log('✅ Étape complétée:', data);
      setStepValidation(prev => ({
        ...prev,
        [data.step]: true
      }));
    };

    const handleSetupError = (error) => {
      console.error('❌ Erreur setup:', error);
      setErrors(prev => ({
        ...prev,
        [error.step]: error.error
      }));
    };

    eventBus.on(AUTH_EVENTS.SETUP_STEP_COMPLETE, handleStepComplete);
    eventBus.on(AUTH_EVENTS.SETUP_ERROR, handleSetupError);

    return () => {
      eventBus.off(AUTH_EVENTS.SETUP_STEP_COMPLETE, handleStepComplete);
      eventBus.off(AUTH_EVENTS.SETUP_ERROR, handleSetupError);
    };
  }, []);

  const initializeSetup = async () => {
    try {
      const state = setupService.getSetupState();
      setSetupState(state);
      setCurrentStep(state.currentStep);
      
      // Charger les données existantes si disponibles
      if (state.stepData && Object.keys(state.stepData).length > 0) {
        setSetupData(prev => ({
          ...prev,
          ...state.stepData
        }));
      }
    } catch (error) {
      console.error('❌ Erreur initialisation setup:', error);
    }
  };

  // Validation d'une étape
  const validateStep = useCallback(async (stepNumber, data) => {
    try {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, [stepNumber]: null }));

      const validation = await setupService.validateStep(stepNumber, data);
      
      if (!validation.isValid) {
        const stepErrors = {};
        validation.errors.forEach(error => {
          stepErrors[error.field] = error.message;
        });
        setErrors(prev => ({ ...prev, [stepNumber]: stepErrors }));
        return false;
      }

      return true;
    } catch (error) {
      console.error(`❌ Erreur validation étape ${stepNumber}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [stepNumber]: { general: error.message }
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setupService]);

  // Sauvegarder une étape
  const saveStep = useCallback(async (stepNumber, data) => {
    try {
      setIsLoading(true);
      
      const isValid = await validateStep(stepNumber, data);
      if (!isValid) return false;

      const result = await setupService.saveStep(stepNumber, data);
      
      if (result.success) {
        setStepValidation(prev => ({ ...prev, [stepNumber]: true }));
        setSetupState(setupService.getSetupState());
        console.log(`✅ Étape ${stepNumber} sauvegardée`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Erreur sauvegarde étape ${stepNumber}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [stepNumber]: { general: error.message }
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setupService, validateStep]);

  // Naviguer vers l'étape suivante
  const nextStep = useCallback(async () => {
    const currentStepData = getStepData(currentStep);
    const saved = await saveStep(currentStep, currentStepData);
    
    if (saved && currentStep < 7) {
      setCurrentStep(prev => prev + 1);
      setErrors(prev => ({ ...prev, [currentStep + 1]: null }));
    }
  }, [currentStep, saveStep, setupData]);

  // Naviguer vers l'étape précédente
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Ignorer une étape (pour les étapes optionnelles)
  const skipStep = useCallback(() => {
    if (currentStep === 2 || currentStep === 5) {
      setStepValidation(prev => ({ ...prev, [currentStep]: true }));
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  // Finaliser le setup
  const completeSetup = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const result = await setupService.completeSetup(setupData);
      
      if (result.success) {
        console.log('🎉 Setup terminé avec succès');
        
        // Afficher un message de succès
        eventBus.emit(AUTH_EVENTS.NOTIFICATION, {
          type: 'success',
          title: 'Configuration terminée !',
          message: 'Votre FinApp Haiti est prête à l\'emploi',
          duration: 5000
        });

        // Redirection vers le dashboard
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              message: 'Bienvenue dans votre espace financier !',
              setupCompleted: true 
            }
          });
        }, 2000);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erreur finalisation setup:', error);
      setErrors(prev => ({ 
        ...prev, 
        7: { general: 'Erreur lors de la finalisation. Veuillez réessayer.' }
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setupData, setupService, eventBus, navigate]);

  // Utilitaires
  const getStepData = (step) => {
    switch (step) {
      case 1: return setupData.profile;
      case 2: return setupData.security;
      case 3: return { accounts: setupData.accounts };
      case 4: return { income_sources: setupData.income_sources };
      case 5: return { categories: setupData.categories };
      case 6: return { goals: setupData.goals };
      case 7: return setupData;
      default: return {};
    }
  };

  const canProceed = (step = currentStep) => {
    // Étapes 2 et 5 sont optionnelles
    if (step === 2 || step === 5) return true;
    
    return stepValidation[step] || false;
  };

  const getProgress = () => {
    const completedSteps = Object.values(stepValidation).filter(Boolean).length;
    return Math.round((completedSteps / 7) * 100);
  };

  const updateSetupData = (section, data) => {
    setSetupData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const addAccount = (account) => {
    const newAccount = {
      id: Date.now().toString(),
      ...account,
      created_at: new Date().toISOString()
    };
    
    setSetupData(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount]
    }));
  };

  const removeAccount = (accountId) => {
    setSetupData(prev => ({
      ...prev,
      accounts: prev.accounts.filter(acc => acc.id !== accountId)
    }));
  };

  const addIncomeSource = (income) => {
    const newIncome = {
      id: Date.now().toString(),
      ...income,
      created_at: new Date().toISOString()
    };
    
    setSetupData(prev => ({
      ...prev,
      income_sources: [...prev.income_sources, newIncome]
    }));
  };

  const removeIncomeSource = (incomeId) => {
    setSetupData(prev => ({
      ...prev,
      income_sources: prev.income_sources.filter(inc => inc.id !== incomeId)
    }));
  };

  const updateCategory = (index, updates) => {
    setSetupData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, ...updates } : cat
      )
    }));
  };

  const updateGoal = (goalKey, updates) => {
    setSetupData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [goalKey]: { ...prev.goals[goalKey], ...updates }
      }
    }));
  };

  // API du hook
  return {
    // État
    setupData,
    currentStep,
    isLoading,
    errors,
    stepValidation,
    setupState,

    // Navigation
    nextStep,
    prevStep,
    skipStep,
    setCurrentStep,
    canProceed,

    // Actions
    validateStep,
    saveStep,
    completeSetup,
    updateSetupData,

    // Comptes
    addAccount,
    removeAccount,

    // Revenus
    addIncomeSource,
    removeIncomeSource,

    // Catégories
    updateCategory,

    // Objectifs
    updateGoal,

    // Utilitaires
    getProgress,
    getStepData,
    
    // Debug
    resetSetup: () => setupService.reset()
  };
}