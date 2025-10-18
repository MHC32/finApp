# 📋 CONTEXT - FinApp Haiti

> **Vue d'ensemble complète du projet - Document de référence principal**

---

## 🎯 Vue d'ensemble

**FinApp Haiti** est une application web de gestion financière personnelle adaptée au contexte haïtien 🇭🇹.

### Objectifs principaux
- Gérer comptes bancaires et portefeuilles mobiles (MonCash, NatCash)
- Suivre transactions en multi-devises (HTG Gourde + USD)
- Créer et suivre budgets
- Gérer dettes et investissements
- **Participer à des Sols (Tontines)** - Concept culturel haïtien unique
- Analyses IA pour conseils personnalisés

### Public cible
- Utilisateurs haïtiens (diaspora incluse)
- Particuliers gérant finances personnelles
- Participants à des tontines traditionnelles (Sols)

---

## 🏗️ Architecture Technique

### Frontend (React)
```
finapp-haiti-frontend/
├── src/
│   ├── api/                  # Configuration API
│   │   ├── axios.js          ✅ Instance Axios
│   │   ├── interceptors.js   ✅ Request/Response interceptors
│   │   └── endpoints/        # Endpoints organisés par module
│   │       └── auth.js       ✅ 14 fonctions auth
│   │
│   ├── store/                # Redux Toolkit
│   │   ├── index.js          ✅ Store configuré
│   │   └── slices/
│   │       ├── authSlice.js  ✅ 8 thunks (login, register, etc.)
│   │       └── themeSlice.js ✅ Toggle Light/Dark
│   │
│   ├── components/           # Composants réutilisables
│   │   ├── ui/               ⏳ Button, Input, Card, Modal...
│   │   ├── forms/            ⏳ FormInput, FormSelect...
│   │   ├── layout/           ⏳ MainLayout, Navbar, Sidebar...
│   │   ├── charts/           ⏳ LineChart, BarChart...
│   │   ├── ThemeInitializer.jsx ✅
│   │   └── common/           ⏳ ErrorBoundary, Pagination...
│   │
│   ├── features/             # Modules par fonctionnalité
│   │   ├── auth/             ⏳ LoginPage, RegisterPage...
│   │   ├── dashboard/        ⏳ DashboardPage, StatCard...
│   │   ├── accounts/         ⏳ AccountsList, AccountCard...
│   │   ├── transactions/     ⏳ TransactionsList...
│   │   ├── budgets/          ⏳ BudgetsList...
│   │   ├── sols/             ⏳ SolsList (Tontines)...
│   │   ├── debts/            ⏳ DebtsList...
│   │   ├── investments/      ⏳ InvestmentPortfolio...
│   │   ├── notifications/    ⏳ NotificationsList...
│   │   └── ai/               ⏳ AIAnalytics...
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useTheme.js       ⏳
│   │   ├── useToast.js       ⏳
│   │   └── useDebounce.js    ⏳
│   │
│   ├── utils/                # Utilitaires
│   │   ├── constants.js      ⏳
│   │   ├── format.js         ⏳
│   │   └── validation.js     ⏳
│   │
│   ├── styles/               # Styles globaux
│   │   └── index.css         ✅ Glassmorphism + animations
│   │
│   ├── App.jsx               ✅ Version test actuelle
│   └── main.jsx              ✅ Entry point avec Redux Provider
│
├── public/                   # Assets statiques
├── tailwind.config.js        ✅ Config avec couleurs Haiti
├── .env.development          ✅ Variables dev
├── .env.production           ✅ Variables prod
└── package.json              ✅ Dépendances installées
```

### Backend (Node.js/Express)
```
finapp-haiti-backend/
├── src/
│   ├── models/               # Modèles Mongoose
│   ├── routes/               # Routes Express
│   ├── controllers/          # Logique métier
│   ├── middleware/           # Auth, validation...
│   ├── services/             # Services métier
│   └── config/               # Configuration
│
└── URL: http://localhost:3001/api
```

---

## 🛠️ Stack Technique

### Frontend ✅
- **Framework** : React 18.x
- **Build Tool** : Vite 5.x (rapide, moderne)
- **Styling** : Tailwind CSS v3 (classes core uniquement)
- **State Management** : Redux Toolkit 2.x
- **API Client** : Axios 1.x (avec interceptors)
- **Routing** : React Router v6 (à implémenter)
- **Icons** : lucide-react 0.263.1
- **Charts** : recharts 2.x
- **Form Validation** : À définir (Yup/Zod)

### Backend
- **Runtime** : Node.js
- **Framework** : Express
- **Database** : MongoDB (Mongoose)
- **Auth** : JWT (Access + Refresh tokens)
- **Upload** : Multer (pour reçus)
- **IA** : OpenAI API (conseils)

---

## 🎨 Design System

### Couleurs Haiti 🇭🇹
```javascript
// Couleurs principales
--haiti-blue: #1e40af   // Bleu du drapeau
--haiti-red: #dc2626    // Rouge du drapeau

// Couleurs système
--color-success: #10b981  // Vert
--color-warning: #f59e0b  // Jaune/Orange
--color-error: #ef4444    // Rouge
--color-info: #3b82f6     // Bleu
```

### Glassmorphism ✅
Style principal pour toutes les cards :
```css
/* Light mode */
.glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
}

/* Dark mode */
.glass-dark {
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
}
```

### Thème Light/Dark ✅
- Toggle fonctionnel avec persistence localStorage
- Classes Tailwind `dark:` pour tous les composants
- Transition smooth entre thèmes
- Détection préférence système au premier chargement

---

## 📡 API & État

### Configuration API ✅ TERMINÉ

**Instance Axios** (`src/api/axios.js`)
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

**Interceptors** (`src/api/interceptors.js`)
- ✅ Request Interceptor : Ajout automatique du token
- ✅ Response Interceptor : Gestion erreurs 401
- ✅ Refresh token automatique
- ✅ Queue de requêtes pendant refresh
- ✅ Déconnexion si refresh échoue

**Endpoints Auth** (`src/api/endpoints/auth.js`)
```javascript
✅ register(data)
✅ login(credentials)
✅ logout()
✅ refresh(refreshToken)
✅ me()
✅ changePassword(data)
✅ forgotPassword(email)
✅ resetPassword(data)
✅ verifyToken(token)
✅ getSessions()
✅ deleteSession(sessionId)
✅ logoutAll()
✅ verifyEmail(token)
✅ resendVerificationEmail()
```

### Redux Store ✅ TERMINÉ

**authSlice** (`src/store/slices/authSlice.js`)
```javascript
// État
{
  user: null,              // Objet utilisateur
  token: null,             // Access token (en mémoire)
  refreshToken: null,      // Refresh token (en mémoire)
  sessionId: null,         // ID de session
  sessionExpiresAt: null,  // Date expiration
  isAuthenticated: false,  // Boolean
  loading: false,          // Boolean
  error: null,             // String
  successMessage: null     // String
}

// Thunks disponibles
✅ registerUser(userData)
✅ loginUser(credentials)
✅ logoutUser()
✅ fetchUser()
✅ changePassword(data)
✅ forgotPassword(email)
✅ resetPassword(data)

// Actions
✅ setTokens({ token, refreshToken })
✅ logout()
✅ updateUser(data)
✅ clearError()
✅ clearSuccess()
```

**themeSlice** (`src/store/slices/themeSlice.js`)
```javascript
// État
{
  currentTheme: 'light' | 'dark',
  isDark: boolean
}

// Actions
✅ toggleTheme()
✅ setTheme(theme)
✅ initTheme()
```

---

## 🔐 Authentification

### Flow implémenté ✅

1. **Register/Login**
   - Dispatch `registerUser()` ou `loginUser()`
   - Backend retourne : `{ user, tokens, session }`
   - Redux store : user + tokens + sessionId
   - Redirection vers dashboard (à implémenter)

2. **Requêtes authentifiées**
   - Interceptor ajoute automatiquement `Authorization: Bearer {token}`
   - Si 401 → Refresh automatique
   - Retry de la requête avec nouveau token

3. **Refresh token**
   - Automatique via interceptor
   - Queue de requêtes pendant refresh
   - Déconnexion si refresh échoue

4. **Logout**
   - Dispatch `logoutUser()`
   - Backend supprime session
   - Redux : clear user + tokens
   - Redirection login (à implémenter)

### Endpoints utilisés
- POST `/auth/register` - Inscription
- POST `/auth/login` - Connexion
- POST `/auth/logout` - Déconnexion
- POST `/auth/refresh` - Renouveler token
- GET `/auth/me` - Infos utilisateur connecté
- POST `/auth/change-password` - Changer mot de passe
- POST `/auth/forgot-password` - Demander reset
- POST `/auth/reset-password` - Reset avec token
- GET `/auth/sessions` - Liste sessions actives
- DELETE `/auth/sessions/:id` - Supprimer session
- POST `/auth/logout-all` - Déconnexion globale
- GET `/auth/verify-email/:token` - Vérifier email
- POST `/auth/resend-verification` - Renvoyer email

---

## 🇭🇹 Spécificités Haïtiennes

### Multi-devises
- **HTG (Gourde)** : Devise principale
- **USD (Dollar)** : Devise secondaire
- Taux de change dynamique
- Conversion automatique

### Banques locales
- BUH (Banque de l'Union Haïtienne)
- Sogebank
- BNC (Banque Nationale de Crédit)
- Unibank
- Capital Bank
- Autres...

### Portefeuilles mobiles
- **MonCash** : Le plus populaire
- **NatCash** : Alternative
- Intégration future possible

### Sols (Tontines) 🤝
Concept culturel unique haïtien :
- Groupe de personnes (généralement 10-20)
- Chacun cotise montant fixe régulièrement
- À tour de rôle, un membre reçoit la somme totale
- Système de confiance communautaire
- Gestion des tours, paiements, historique

---

## 📊 État Actuel du Projet

### ✅ Ce qui est FAIT (Sessions 1.2 + 2)

#### Infrastructure ✅
- [x] Projet Vite React créé
- [x] Toutes dépendances installées
- [x] Tailwind CSS v3 configuré
- [x] Structure de dossiers complète
- [x] Variables d'environnement

#### Configuration API ✅
- [x] Instance Axios
- [x] Interceptors (request + response)
- [x] Refresh token automatique
- [x] 14 endpoints auth
- [x] Gestion erreurs propre

#### Redux Store ✅
- [x] Store configuré
- [x] authSlice (8 thunks)
- [x] themeSlice (toggle + persistence)
- [x] Redux DevTools activés

#### Thème & Styles ✅
- [x] Système Light/Dark fonctionnel
- [x] Glassmorphism CSS
- [x] Couleurs Haiti intégrées
- [x] ThemeInitializer component
- [x] Contraste optimisé dark mode

#### Application ✅
- [x] App.jsx de test fonctionnel
- [x] Toggle thème avec icône
- [x] Test Login/Register/Logout
- [x] Messages erreur/succès
- [x] Redux state visible

### ⏳ Ce qui est EN COURS (Session 3)

#### Composants UI de base
- [ ] Button.jsx (toutes variantes)
- [ ] Input.jsx (tous types)
- [ ] Card.jsx (glassmorphism)
- [ ] Modal.jsx (overlay)
- [ ] Toast.jsx (notifications)
- [ ] Loading.jsx (spinner + skeleton)

### 📅 Ce qui est À FAIRE

#### Phase 2 : Authentification
- [ ] Pages Auth (Login, Register, etc.)
- [ ] Formulaires complets
- [ ] Routing React Router
- [ ] PrivateRoute component

#### Phase 3 : Dashboard
- [ ] Page Dashboard
- [ ] StatCards
- [ ] QuickActions
- [ ] Charts

#### Phase 4 : Modules Métier
- [ ] Module Comptes
- [ ] Module Transactions
- [ ] Module Budgets
- [ ] Module Sols (Tontines) 🇭🇹
- [ ] Module Dettes
- [ ] Module Investissements
- [ ] Module Notifications
- [ ] Module IA

#### Phase 5 : Polish & Déploiement
- [ ] Animations
- [ ] Performance
- [ ] Tests
- [ ] Déploiement

---

## 🎯 Priorités de développement

### Phase actuelle : **PHASE 1 - FONDATIONS (50%)**

**Ordre de développement :**
1. ✅ Configuration API client
2. ✅ Redux Store (auth + theme)
3. ✅ Système thème Light/Dark
4. ⏳ Composants UI de base ← **ON EST ICI** 🎯
5. ⏳ Routing React Router
6. ⏳ Layout + Navigation
7. ⏳ Pages Auth (Login/Register)
8. ⏳ Dashboard principal
9. ⏳ Module Comptes
10. ⏳ Module Transactions
11. ⏳ Module Budgets
12. ⏳ Module Sols (Tontines) 🇭🇹
13. ⏳ Autres modules...

---

## ⚠️ Points d'attention

### Limitations techniques
- ❌ Pas de localStorage/sessionStorage pour tokens (sécurité)
- ✅ Tokens en mémoire Redux uniquement
- ✅ Tailwind : Classes core uniquement (pas de custom)
- ✅ React : Hooks disponibles (useState, useEffect, etc.)

### Conventions de code
- ✅ Commentaires en **français**
- ✅ Noms variables/fonctions en **anglais**
- ✅ PropTypes obligatoires
- ✅ Pas de TODO dans le code (code complet)
- ✅ Glassmorphism pour toutes les cards
- ✅ Support Light + Dark pour tout

### Architecture respectée
- ✅ Séparation axios.js / interceptors.js
- ✅ Endpoints organisés par module
- ✅ Slices Redux par feature
- ✅ Composants réutilisables
- ✅ Structure dossiers ARCHITECTURE.md

---

## 🧪 Tests

### Tests manuels faits ✅
- [x] Toggle thème fonctionne
- [x] Thème persiste au refresh
- [x] Glassmorphism visible
- [x] Couleurs Haiti présentes
- [x] Redux DevTools fonctionnels
- [x] Contraste mode dark OK

### Tests à faire
- [ ] Login/Register avec backend lancé
- [ ] Refresh token automatique
- [ ] Gestion erreurs 401
- [ ] Déconnexion
- [ ] Persistence tokens

---

## 📚 Documentation

### Documents de référence
- **CONTEXT.md** (ce fichier) - Vue d'ensemble
- **ROADMAP.md** - Checklist complète (~200 tâches)
- **PROGRESS.md** - État d'avancement détaillé
- **SESSION_RESUME.md** - Résumé sessions
- **ARCHITECTURE.md** - Structure détaillée code
- **API_DOCUMENTATION.md** - Documentation OpenAPI backend

### Comment utiliser ce document

**Au début d'une nouvelle conversation :**
1. Envoie ce fichier CONTEXT.md
2. Envoie SESSION_RESUME.md (état actuel)
3. Dis : "On reprend FinApp Haiti, Session X"

**Pendant le développement :**
- Référence pour comprendre le projet global
- Consultation régulière de PROGRESS.md
- Mise à jour docs après chaque feature

---

## 🚀 Getting Started

### Prérequis
- Node.js 18+
- npm ou yarn
- MongoDB (pour backend)

### Installation
```bash
# Frontend
cd finapp-haiti-frontend
npm install
npm run dev

# Backend (dans un autre terminal)
cd finapp-haiti-backend
npm install
npm run dev
```

### URLs
- Frontend dev : `http://localhost:5173`
- Backend dev : `http://localhost:3001/api`

---

## 📞 Support

### Ressources
- Documentation Tailwind : https://tailwindcss.com
- Documentation Redux Toolkit : https://redux-toolkit.js.org
- Documentation React Router : https://reactrouter.com
- Documentation Axios : https://axios-http.com

---

## 📝 Changelog

### Version 1.1 - 17 octobre 2025
- ✅ Session 1.2 : Configuration API complète
- ✅ Session 2 : Redux Store complet
- ✅ Thème Light/Dark fonctionnel
- ✅ Glassmorphism CSS optimisé
- ✅ Contraste mode dark amélioré
- 🎯 Prochaine : Session 3 - Composants UI

### Version 1.0 - 16 octobre 2025
- ✅ Session 1 : Planning et documentation
- ✅ Création CONTEXT, ROADMAP, ARCHITECTURE
- ✅ Projet Vite initialisé

---

**Version** : 1.1  
**Dernière mise à jour** : 17 octobre 2025  
**Statut** : Phase 1 - Fondations (50%) - En cours  
**Prochaine étape** : Session 3 - Composants UI de base 🎨