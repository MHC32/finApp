// src/hooks/useSetup.js - HOOK POUR LE PROCESSUS DE SETUP
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore.js';

export function useSetup() {
  const {
    setupCompleted,
    getSetupState,
    validateSetupStep,
    saveSetupStep,
    completeSetup,
    isLoading,
    error
  } = useAuthStore();

  const [setupState, setSetupState] = useState(null);

  useEffect(() => {
    setSetupState(getSetupState());
  }, [getSetupState]);

  return {
    // État du setup
    setupState,
    setupCompleted,
    isLoading,
    error,
    
    // Actions
    validateStep: async (stepNumber, data) => {
      return await validateSetupStep(stepNumber, data);
    },
    
    saveStep: async (stepNumber, data) => {
      const result = await saveSetupStep(stepNumber, data);
      setSetupState(getSetupState());
      return result;
    },
    
    complete: async (allData) => {
      await completeSetup(allData);
      setSetupState(null);
    },
    
    // Utilitaires
    getCurrentStep: () => setupState?.currentStep || 1,
    getTotalSteps: () => setupState?.totalSteps || 7,
    getProgress: () => setupState?.progress || 0,
    isStepCompleted: (stepNumber) => setupState?.completedSteps.includes(stepNumber) || false,
    canProceedToStep: (stepNumber) => {
      if (!setupState) return stepNumber === 1;
      return stepNumber <= setupState.currentStep;
    }
  };
}
