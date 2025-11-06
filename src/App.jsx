// src/App.jsx
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initTheme } from './store/slices/themeSlice';
import { fetchUser } from './store/slices/authSlice';
import ThemeInitializer from './components/ThemeInitializer';
import ToastContainer from './components/ui/ToastContainer';
import useToast from './hooks/useToast';

// CORRECTION : Importer directement AppRouter
import AppRouter from './routes/AppRouter'; // ← Changement ici

function App() {
  const dispatch = useDispatch();
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    dispatch(initTheme());
    
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <>
      <ThemeInitializer />
      <AppRouter />
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
      />
    </>
  );
}

export default App;