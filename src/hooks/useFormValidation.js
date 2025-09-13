// src/hooks/useFormValidation.js - HOOK POUR LA VALIDATION DE FORMULAIRES
import { useState, useCallback } from 'react';
import validationService from '../services/core/ValidationService.js';

export function useFormValidation(schemaName, initialData = {}) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName, value) => {
    // Validation d'un champ spécifique
    const fieldData = { [fieldName]: value };
    const validation = validationService.validate(schemaName, fieldData, { partial: true });
    
    const fieldErrors = validation.errors.filter(err => err.field === fieldName);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors[0].message : null
    }));
    
    return fieldErrors.length === 0;
  }, [schemaName]);

  const validateAll = useCallback(() => {
    const validation = validationService.validate(schemaName, data);
    
    const errorMap = {};
    validation.errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    
    setErrors(errorMap);
    setIsValid(validation.isValid);
    
    return validation;
  }, [schemaName, data]);

  const updateField = useCallback((fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validation en temps réel pour les champs touchés
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  }, [touched, validateField]);

  const touchField = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, data[fieldName]);
  }, [data, validateField]);

  const reset = useCallback((newData = initialData) => {
    setData(newData);
    setErrors({});
    setIsValid(false);
    setTouched({});
  }, [initialData]);

  return {
    // État
    data,
    errors,
    isValid,
    touched,
    
    // Actions
    updateField,
    touchField,
    validateAll,
    reset,
    
    // Utilitaires
    getFieldError: (fieldName) => touched[fieldName] ? errors[fieldName] : null,
    hasFieldError: (fieldName) => touched[fieldName] && !!errors[fieldName],
    hasErrors: () => Object.keys(errors).some(key => errors[key]),
    isFieldTouched: (fieldName) => !!touched[fieldName]
  };
}