/**
 * =========================================================
 * FinApp Haiti - Redux Store Configuration
 * Configuration Redux Toolkit avec Redux Persist
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
import storage from 'redux-persist/lib/storage'; // localStorage

// Import des slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';

/**
 * Configuration Redux Persist
 * - Sauvegarde auth et settings dans localStorage
 * - UI state n'est PAS persisté (état temporaire)
 */
const persistConfig = {
  key: 'finapp-haiti-root',
  version: 1,
  storage,
  whitelist: ['auth', 'settings'], // Seulement ces slices sont persistées
  blacklist: ['ui'], // UI n'est pas persisté
};

/**
 * Root Reducer
 * Combine tous les reducers de l'application
 */
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  settings: settingsReducer,
});

/**
 * Persisted Reducer
 * Wrapper le root reducer avec persist
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Store
 * Configuration du store Redux avec middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions Redux Persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // DevTools seulement en dev
});

/**
 * Persistor
 * Permet de persister le store
 */
export const persistor = persistStore(store);

/**
 * Export des types pour TypeScript (optionnel)
 */
export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;