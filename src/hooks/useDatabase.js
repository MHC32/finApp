// src/hooks/useDatabase.js - HOOK POUR LES OPÉRATIONS DB
import { useState, useCallback } from 'react';
import databaseService from '../services/core/DatabaseService.js';

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeOperation = useCallback(async (operation) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    // État
    isLoading,
    error,
    
    // Opérations CRUD
    create: useCallback((tableName, data) => {
      return executeOperation(() => databaseService.create(tableName, data));
    }, [executeOperation]),
    
    read: useCallback((tableName, id) => {
      return executeOperation(() => databaseService.read(tableName, id));
    }, [executeOperation]),
    
    update: useCallback((tableName, id, updates) => {
      return executeOperation(() => databaseService.update(tableName, id, updates));
    }, [executeOperation]),
    
    delete: useCallback((tableName, id) => {
      return executeOperation(() => databaseService.delete(tableName, id));
    }, [executeOperation]),
    
    query: useCallback((tableName, filters, options) => {
      return executeOperation(() => databaseService.query(tableName, filters, options));
    }, [executeOperation]),
    
    transaction: useCallback((operation) => {
      return executeOperation(() => databaseService.transaction(operation));
    }, [executeOperation]),
    
    // Utilitaires
    clearError: () => setError(null)
  };
}