# 🏗️ ARCHITECTURE - FinApp Haiti

> **Structure complète du projet et conventions de code**

---

## 📂 Structure des dossiers

```
finapp-haiti/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── assets/
│       └── flags/
│           └── haiti.svg
│
├── src/
│   ├── api/                      # Configuration API
│   │   ├── axios.js              # Instance Axios principale
│   │   ├── interceptors.js       # Request/Response interceptors
│   │   └── endpoints/            # Endpoints organisés
│   │       ├── auth.js
│   │       ├── accounts.js
│   │       ├── transactions.js
│   │       ├── budgets.js
│   │       ├── sols.js
│   │       ├── debts.js
│   │       ├── investments.js
│   │       ├── notifications.js
│   │       └── ai.js
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── ui/                   # Composants UI de base
│   │   │   ├── Button.jsx   # ✅ 9 variantes, 3 tailles
│   │   │   ├── Input.jsx    # ✅ 12+ types
│   │   │   ├── Card.jsx     # ✅ 7 variantes
│   │   │   ├── Modal.jsx    # ✅ 8 tailles
│   │   │   ├── Toast.jsx    # ✅ 4 types
            ├── ToastContainer.jsx # ✅ Gestion multi-toasts
│   │   │   ├── Loading.jsx   # ✅ 3 types + skeletons
│   │   │   ├── Avatar.jsx    # ✅ 6 tailles + groupes
│   │   │   ├── Badge.jsx     # ✅ 3 variantes + dot
            ├── Checkbox.jsx   # ✅ Session 3.5 - États + indeterminate
            ├── Radio.jsx      # ✅ Session 3.5 - Radio.Group
            ├── Switch.jsx     # ✅ Session 3.5 - Toggle animé
            ├── Table.jsx      # ✅ Session 3.5 - Tri + sélection
            ├── Pagination.jsx # ✅ Session 3.5 - Navigation pages
            ├── ProgressBar.jsx # ✅ Session 3.5 - Linear/Circular
            ├── Tabs.jsx
            ├── Select.jsx   # ✅ Session 3.5 - Single/Multi-select 
            └── Alert.jsx    # ✅ Session 3.5 - 5 types
│   │   │
│   │   ├── forms/                    # Composants de formulaire
│   │   │   ├── FormInput.jsx         # ✅ Wrapper Input avec
│   │   │   ├── FormSelect.jsx        # ✅ Wrapper Select avec
│   │   │   ├── FormTextarea.jsx      # ✅ Textarea + compteur caractères
│   │   │   ├── FormCheckbox.jsx      # ✅ Wrapper Checkbox avec validation
│   │   │   ├── FormDatePicker.jsx    # ✅ Date picker natif + icône
│   │   │   └── FormCurrencyInput.jsx # ✅ Input HTG/USD avec formatage
│   │   │
│   │   ├── layout/                   # Composants de layout
│   │   │   ├── MainLayout.jsx        # ✅ Structure globale complète
│   │   │   ├── Navbar.jsx            # ✅ Barre navigation top
│   │   │   ├── Sidebar.jsx           # ✅ Menu latéral 
│   │   │   ├── Footer.jsx            # ✅ Pied de page Haiti 🇭🇹
│   │   │   ├── Breadcrumbs.jsx       # ✅ Fil d'Ariane 
│   │   │   └── PrivateRoute.jsx      # ✅ Protection routes auth
│   │   │
│   │   ├── charts/               # Composants graphiques
│   │   │   ├── LineChart.jsx     # ✅ Graphique linéaire (recharts)
│   │   │   ├── BarChart.jsx      # ✅ Graphique barres
│   │   │   ├── PieChart.jsx      # ✅ Camembert
│   │   │   └── DonutChart.jsx    # ✅ Donut avec texte centre
│   │   │
│   │   └── common/                  # Autres composants communs
│   │   |    ├── ErrorBoundary.jsx    # ✅ Gestion erreurs React
│   │   |    ├── EmptyState.jsx       # ✅ États vides (6 variants)
│   │   |    └── SearchBar.jsx        # ✅ Recherche avec debounce
│   │   │
│   │   └── ThemeInitializer.jsx      # ✅ Init thème au démarrage
│   │
│   ├── features/                 # Modules par fonctionnalité
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ForgotPasswordForm.jsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   └── hooks/
│   │   │       └── useAuth.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── RecentTransactions.jsx
│   │   │   │   └── BudgetProgress.jsx
│   │   │   └── pages/
│   │   │       └── DashboardPage.jsx
│   │   │
│   │   ├── accounts/
│   │   │   ├── components/
│   │   │   │   ├── AccountCard.jsx
│   │   │   │   ├── AccountFilters.jsx
│   │   │   │   ├── CreateAccountModal.jsx
│   │   │   │   └── EditAccountModal.jsx
│   │   │   ├── pages/
│   │   │   │   ├── AccountsListPage.jsx
│   │   │   │   └── AccountDetailsPage.jsx
│   │   │   └── hooks/
│   │   │       └── useAccounts.js
│   │   │
│   │   ├── transactions/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── budgets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── sols/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── debts/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── investments/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── notifications/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   └── ai/
│   │       ├── components/
│   │       ├── pages/
│   │       └── hooks/
│   │
│   ├── store/                    # Redux store
│   │   ├── index.js              # ✅ Configuration store
│   │   └── slices/
│   │       ├── authSlice.js      # ✅ Auth avec 8 thunks
│   │       ├── themeSlice.js     # ✅ Thème avec 
│   │       ├── accountsSlice.js
│   │       ├── transactionsSlice.js
│   │       ├── budgetsSlice.js
│   │       ├── solsSlice.js
│   │       ├── debtsSlice.js
│   │       ├── investmentsSlice.js
│   │       ├── notificationsSlice.js
│   │       └── aiSlice.js
│   │
│   ├── hooks/                    # Custom hooks globaux
│   │   ├── useTheme.js
│   │   ├── useToast.js  # ✅ Hook toast 
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   └── useLocalStorage.js
│   │
│   ├── contexts/                 # React contexts
│   │   ├── ThemeContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── utils/                    # Fonctions utilitaires
│   │   ├── constants.js          # Constantes globales
│   │   ├── format.js             # Formatage dates, montants
│   │   ├── validation.js         # Schémas de validation
│   │   ├── helpers.js            # Fonctions helpers
│   │   └── permissions.js        # Gestion permissions
│   │
│   ├── styles/                   # Styles globaux
│   │   ├── index.css             # Point d'entrée CSS
│   │   ├── tailwind.css          # Config Tailwind
│   │   ├── themes/
│   │   │   ├── light.css
│   │   │   └── dark.css
│   │   └── glassmorphism.css     # Styles glass
│   │
│   ├── routes/                   # Configuration routing
│   │   ├── index.jsx             # Routes principales
│   │   ├── publicRoutes.jsx
│   │   ├── privateRoutes.jsx
│   │   └── adminRoutes.jsx
│   │
│   ├── config/                   # Configuration app
│   │   ├── env.js                # Variables d'environnement
│   │   └── constants.js          # Constantes de config
│   │
│   ├── App.jsx                   # Composant principal
│   ├── main.jsx                  # Point d'entrée
│   └── index.css                # ✅ Styles Tailwind + custom
│
├── .env.development              # Variables dev
├── .env.production               # Variables prod
├── .eslintrc.js                  # Config ESLint
├── .prettierrc                   # Config Prettier
├── tailwind.config.js            # Config Tailwind
├── vite.config.js                # Config Vite
├── package.json
└── README.md
```

---

## 🎨 Conventions de code

### Nommage

```javascript
// Composants React : PascalCase
LoginForm.jsx
AccountCard.jsx
CreateBudgetModal.jsx

// Hooks : camelCase avec préfixe "use"
useAuth.js
useAccounts.js
useTheme.js

// Utilitaires : camelCase
formatCurrency.js
validateEmail.js

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3001/api';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

### Structure d'un composant

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Description du composant
 * @param {Object} props - Props du composant
 */
const MonComposant = ({ title, onClose, variant = 'primary' }) => {
  // 1. Hooks Redux
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  // 2. State local
  const [isOpen, setIsOpen] = useState(false);

  // 3. Effects
  useEffect(() => {
    // Logic
  }, []);

  // 4. Handlers
  const handleClick = () => {
    // Logic
  };

  // 5. Render helpers (si nécessaire)
  const renderContent = () => {
    return <div>Content</div>;
  };

  // 6. Render principal
  return (
    <div className="mon-composant">
      {/* JSX */}
    </div>
  );
};

// PropTypes
MonComposant.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])
};

// Default props
MonComposant.defaultProps = {
  variant: 'primary'
};

export default MonComposant;
```

### Classes Tailwind

```jsx
// ✅ BON : Classes organisées et lisibles
<button 
  className="
    px-4 py-2 
    bg-blue-600 hover:bg-blue-700 
    text-white font-medium 
    rounded-lg 
    transition-colors duration-200
    disabled:opacity-50
  "
>
  Cliquer
</button>

// ❌ MAUVAIS : Tout sur une ligne
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50">

// 💡 ASTUCE : Utiliser clsx pour classes conditionnelles
import clsx from 'clsx';

<button 
  className={clsx(
    'px-4 py-2 rounded-lg',
    variant === 'primary' && 'bg-blue-600 hover:bg-blue-700',
    variant === 'danger' && 'bg-red-600 hover:bg-red-700',
    isDisabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### Glassmorphism

```jsx
// Card glassmorphism light
<div className="
  bg-white/70 
  backdrop-blur-lg 
  border border-white/20 
  rounded-2xl 
  shadow-xl
  p-6
">
  Content
</div>

// Card glassmorphism dark
<div className="
  bg-slate-800/70 
  backdrop-blur-lg 
  border border-white/10 
  rounded-2xl 
  shadow-2xl
  p-6
">
  Content
</div>
```

---

## 🔐 Gestion d'état (Redux)

### Structure d'un slice

```javascript
// src/store/slices/accountsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountsApi } from '@/api/endpoints/accounts';

// Thunks asynchrones
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountsApi.getAll();
      return response.data.accounts;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: [],
    selectedAccount: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedAccount, clearError } = accountsSlice.actions;
export default accountsSlice.reducer;
```

---

## 🌐 Configuration API

### Instance Axios

```javascript
// src/api/axios.js
import axios from 'axios';
import store from '@/store';
import { logout, refreshToken } from '@/store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Ajouter token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Gérer erreurs + refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401 et pas déjà retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter refresh
        const refreshToken = store.getState().auth.refreshToken;
        await store.dispatch(refreshToken({ refreshToken })).unwrap();
        
        // Retry request original
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Endpoints organisés

```javascript
// src/api/endpoints/accounts.js
import api from '../axios';

export const accountsApi = {
  getAll: (params) => api.get('/accounts', { params }),
  
  getById: (id) => api.get(`/accounts/${id}`),
  
  create: (data) => api.post('/accounts', data),
  
  update: (id, data) => api.put(`/accounts/${id}`, data),
  
  delete: (id) => api.delete(`/accounts/${id}`),
  
  getSummary: () => api.get('/accounts/summary')
};
```

---

## 🎨 Système de thème

### ThemeContext

```javascript
// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Charger préférence
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## 🔍 Custom Hooks

### useDebounce

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

---

## 📦 Variables d'environnement

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=FinApp Haiti
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_BASE_URL=https://api.finapphaiti.com/api
VITE_APP_NAME=FinApp Haiti
VITE_ENABLE_DEVTOOLS=false
```

---

## 🧪 Tests

### Structure tests

```
src/
├── components/
│   └── ui/
│       ├── Button.jsx
│       └── Button.test.jsx
```

---

**Cette architecture est évolutive et modulaire. Chaque module est indépendant et peut être développé séparément.**

**Dernière mise à jour** : 16 octobre 2025