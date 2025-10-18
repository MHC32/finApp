// src/components/ThemeInitializer.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initTheme } from '../store/slices/themeSlice';

/**
 * Composant qui initialise le thème au démarrage de l'application
 * À utiliser dans App.jsx
 */
const ThemeInitializer = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialiser le thème depuis localStorage ou préférence système
    dispatch(initTheme());
  }, [dispatch]);
  
  return null; // Ce composant ne rend rien
};

export default ThemeInitializer;