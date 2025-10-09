/**
 * =========================================================
 * FinApp Haiti - Redux Store Configuration (CORRIGÉ)
 * ✅ auth est maintenant persisté
 * =========================================================
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import des slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';
import accountsReducer from './slices/accountsSlice';
import transactionsReducer from './slices/transactionsSlice';

/**
 * Configuration Redux Persist - VERSION CORRIGÉE
 * ✅ auth EST persisté pour garder la session
 */
const persistConfig = {
  key: 'finapp-haiti-root',
  version: 1,
  storage,
  whitelist: ['auth', 'settings'], // ✅ AJOUT de 'auth'
  blacklist: ['ui', 'accounts', 'transactions'], // Juste les données temporaires
};

/**
 * Root Reducer
 */
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  settings: settingsReducer,
  accounts: accountsReducer,
  transactions: transactionsReducer,
});

/**
 * Persisted Reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Store
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Persistor
 */
export const persistor = persistStore(store);

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;