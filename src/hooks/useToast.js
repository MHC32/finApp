// src/hooks/useToast.js
import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les toasts
 * Usage simple : const { showToast, toasts, removeToast } = useToast();
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Ajouter un toast
  const showToast = useCallback(({
    type = 'info',
    title,
    message,
    duration = 5000,
    position = 'top-right',
  }) => {
    const id = Date.now() + Math.random(); // ID unique
    
    const newToast = {
      id,
      type,
      title,
      message,
      duration,
      position,
    };

    setToasts(prev => [...prev, newToast]);
    
    return id; // Retourner l'ID au cas où on veuille le retirer manuellement
  }, []);

  // Retirer un toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Retirer tous les toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Méthodes de raccourci pour chaque type
  const success = useCallback((message, options = {}) => {
    return showToast({ type: 'success', message, ...options });
  }, [showToast]);

  const error = useCallback((message, options = {}) => {
    return showToast({ type: 'error', message, ...options });
  }, [showToast]);

  const warning = useCallback((message, options = {}) => {
    return showToast({ type: 'warning', message, ...options });
  }, [showToast]);

  const info = useCallback((message, options = {}) => {
    return showToast({ type: 'info', message, ...options });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    // Méthodes raccourcies
    success,
    error,
    warning,
    info,
  };
};

export default useToast;