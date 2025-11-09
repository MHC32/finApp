// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import accountsReducer from './slices/accountSlice';
import transactionsReducer from './slices/transactionsSlice'; // ← AJOUTER CETTE LIGNE

// ===================================================================
// CONFIGURATION STORE REDUX
// ===================================================================

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer, // ← AJOUTER CETTE LIGNE
    // Autres slices à ajouter ici au fur et à mesure :
    // budgets: budgetsReducer,
    // sols: solsReducer,
    // etc.
  },
  
  // Redux DevTools configuré automatiquement en développement
  devTools: import.meta.env.DEV,
  
  // Middleware par défaut de Redux Toolkit
  // (thunk est inclus automatiquement)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Options pour serialization check
      serializableCheck: {
        // Ignorer ces actions qui peuvent contenir des non-serializable values
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignorer ces paths dans le state
        ignoredPaths: ['auth.sessionExpiresAt']
      }
    })
});

export default store;