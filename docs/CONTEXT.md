# 📘 CONTEXT - FinApp Haiti Frontend

> **Vue d'ensemble du projet**

---

## 🎯 Qu'est-ce que FinApp Haiti ?

**FinApp Haiti** est une application web de gestion financière moderne, spécialement adaptée au contexte haïtien 🇭🇹.

### Mission
Offrir aux Haïtiens un outil de gestion financière accessible, en français, qui comprend leur réalité économique et culturelle.

### Particularités Haiti
- **Multi-devises** : HTG (Gourde) et USD
- **Banques locales** : BUH, Sogebank, BNC, Unibank, Capital Bank
- **Portefeuilles mobiles** : MonCash (Digicel), NatCash (Natcom)
- **Sols/Tontines** : Concept culturel unique haïtien de solidarité financière
- **10 régions** : Ouest, Nord, Sud, Artibonite, Centre, etc.

---

## 🏗️ Architecture Technique

### Stack Frontend
- **Framework** : React 18 avec Hooks
- **Build Tool** : Vite (rapide et moderne)
- **State Management** : Redux Toolkit
- **Routing** : React Router v6
- **Styling** : Tailwind CSS v3 (classes core uniquement)
- **API Client** : Axios avec intercepteurs
- **Charts** : Recharts
- **Icons** : lucide-react
- **Forms** : Validation custom + helpers

### Stack Backend (séparé)
- **Runtime** : Node.js + Express
- **Database** : MongoDB + Mongoose
- **Auth** : JWT (Access + Refresh tokens)
- **API** : RESTful

---

## 📂 Structure du Projet

```
finapp-haiti-frontend/
├── src/
│   ├── api/                    # Configuration API ✅
│   │   ├── axios.js            # Instance Axios
│   │   ├── interceptors.js     # Intercepteurs
│   │   └── endpoints/          # Endpoints par module
│   │       └── auth.js         # 14 endpoints auth
│   │
│   ├── store/                  # Redux Store ✅
│   │   ├── index.js            # Configuration store
│   │   └── slices/
│   │       ├── authSlice.js    # Auth (8 thunks)
│   │       └── themeSlice.js   # Thème Light/Dark
│   │
│   ├── components/             # Composants UI ✅
│   │   ├── ui/                 # 17 composants de base
│   │   ├── forms/              # 6 wrappers formulaires
│   │   ├── common/             # 3 composants communs
│   │   ├── layout/             # 6 composants layout
│   │   └── charts/             # 4 composants graphiques
│   │
│   ├── features/               # Modules métier ⏳
│   │   ├── auth/               # À faire (Session 4)
│   │   ├── dashboard/          # À faire
│   │   ├── accounts/           # À faire
│   │   ├── transactions/       # À faire
│   │   ├── budgets/            # À faire
│   │   ├── sols/               # À faire
│   │   ├── debts/              # À faire
│   │   ├── investments/        # À faire
│   │   ├── notifications/      # À faire
│   │   └── ai/                 # À faire
│   │
│   ├── hooks/                  # Custom hooks ⏳
│   │   └── useToast.js         # ✅ Hook toast créé
│   │
│   ├── utils/                  # Utilitaires ✅ NOUVEAU
│   │   ├── constants.js        # Constantes globales (570 lignes)
│   │   ├── format.js           # Formatage (450 lignes)
│   │   ├── validation.js       # Validation (530 lignes)
│   │   ├── helpers.js          # Helpers (600 lignes)
│   │   └── permissions.js      # Permissions (450 lignes)
│   │
│   ├── routes/                 # Configuration routing ✅ NOUVEAU
│   │   ├── index.jsx           # Routes principales (280 lignes)
│   │   ├── publicRoutes.jsx    # Routes publiques (120 lignes)
│   │   ├── privateRoutes.jsx   # Routes privées (580 lignes)
│   │   └── adminRoutes.jsx     # Routes admin (180 lignes)
│   │
│   ├── styles/                 # Styles globaux ✅
│   │   └── index.css           # Glassmorphism + animations
│   │
│   ├── App.jsx                 # Composant racine
│   └── main.jsx                # Point d'entrée
│
├── public/                     # Assets statiques
├── .env.development            # Variables dev
├── .env.production             # Variables prod
├── tailwind.config.js          # Config Tailwind ✅
├── vite.config.js              # Config Vite
└── package.json                # Dépendances
```

---

## 📊 État d'avancement

### Phase 1 : Fondations - 95% ✅

#### Terminé ✅
- [x] Configuration initiale (Vite, Tailwind, ESLint)
- [x] Configuration API (Axios, intercepteurs, endpoints auth)
- [x] Redux Store (auth + theme)
- [x] Système thème Light/Dark
- [x] 36 composants UI production-ready
- [x] 5 modules utils complets ⭐ NOUVEAU
- [x] 4 fichiers routes configurés ⭐ NOUVEAU

#### En cours ⏳
- [ ] AdminRoute guard (1 composant, 5 min)
- [ ] Pages Authentication (5 pages, 2-3h)

#### À faire
- [ ] Dashboard page
- [ ] Modules métier (8 modules)

---

## 🎨 Design System

### Palette de couleurs

#### Couleurs Haiti 🇭🇹
- **Primary** : `#1e40af` (Bleu Haiti)
- **Secondary** : `#dc2626` (Rouge Haiti)
- **Success** : `#10b981` (Vert)
- **Warning** : `#f59e0b` (Orange)
- **Error** : `#ef4444` (Rouge)
- **Info** : `#0ea5e9` (Bleu ciel)

#### Palette Teal (Turquoise) 🌊
Utilisée pour les éléments secondaires et accents.

### Glassmorphism
Tous les composants cards utilisent l'effet glassmorphism :
- Fond semi-transparent
- Backdrop blur
- Bordures subtiles
- Ombres douces

### Thèmes
- **Light mode** : Fond blanc, textes sombres
- **Dark mode** : Fond sombre (#0f172a), textes clairs, contraste optimisé

---

## 🔧 Fonctionnalités Principales

### Phase 2 : Modules Métier ⏳

#### 1. Authentication 🔐
- Login / Register / Logout
- Forgot Password / Reset Password
- Email verification
- Session management
- Refresh tokens automatiques

#### 2. Dashboard 📊
- Vue d'ensemble financière
- Solde total (HTG + USD)
- Graphiques revenus/dépenses
- Transactions récentes
- Budgets en cours
- Alertes et notifications

#### 3. Comptes Bancaires 💳
- Gestion multi-comptes
- Comptes traditionnels (BUH, Sogebank, etc.)
- Portefeuilles mobiles (MonCash, NatCash)
- Cash et autres
- Transferts entre comptes
- Historique complet

#### 4. Transactions 💰
- Enregistrement revenus/dépenses
- Catégorisation automatique
- Recherche et filtres avancés
- Export de données
- Attachement de reçus
- Analytics par catégorie

#### 5. Budgets 📈
- Création de budgets mensuels/annuels
- Templates pré-définis (étudiant, famille, etc.)
- Suivi en temps réel
- Alertes dépassement
- Visualisations graphiques
- Recommandations IA

#### 6. Sols/Tontines 🇭🇹
- Création et gestion de sols
- Invitation participants
- Calendrier des tours
- Notifications paiements
- Historique complet
- 3 types : rotatif, cumulatif, urgence

#### 7. Dettes 📋
- Suivi dettes et crédits
- Échéancier de remboursement
- Calcul intérêts
- Notifications rappels
- Historique paiements

#### 8. Investissements 📊
- Suivi projets d'investissement
- Calcul ROI
- 7 catégories (agriculture, commerce, etc.)
- Mise à jour performance
- Analytics détaillées

#### 9. Notifications 🔔
- Alertes budgets
- Rappels sols
- Paiements à venir
- Soldes faibles
- Maintenance système

#### 10. Assistant IA 🤖
- Conseils financiers personnalisés
- Analyse des dépenses
- Prédictions budgétaires
- Recommandations d'économies
- Chat conversationnel

---

## 🌍 Multi-langue (Prévu)

### Langues supportées
- 🇫🇷 **Français** (par défaut, actuel)
- 🇭🇹 **Créole haïtien** (prévu)
- 🇬🇧 **Anglais** (prévu)

---

## 👥 Rôles Utilisateurs

### User (Gratuit)
- Jusqu'à 5 comptes
- 1000 transactions/mois
- 3 budgets
- 2 sols
- IA basique

### Premium (Payant)
- 20 comptes
- Transactions illimitées
- 10 budgets
- 10 sols
- Export données
- IA avancée
- Support prioritaire

### Admin
- Accès total
- Gestion utilisateurs
- Analytics globales
- Configuration système

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1023px
- **Desktop** : ≥ 1024px

### Adaptation
- Menu hamburger sur mobile
- Grilles adaptatives
- Touch-friendly sur mobile
- Sidebar collapsible

---

## 🔐 Sécurité

### Frontend
- Pas de tokens en localStorage (sécurité)
- Tokens en mémoire Redux uniquement
- HTTPS obligatoire en production
- CSP headers
- XSS protection

### Backend
- JWT Access + Refresh tokens
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- MongoDB injection protection

---

## 📈 Performances

### Optimisations
- Code splitting par route
- Lazy loading composants
- Images optimisées
- Debounce sur recherches
- Pagination côté serveur
- Caching intelligent

---

## 🧪 Tests (À venir)

### Frontend
- Unit tests (Vitest)
- Component tests (React Testing Library)
- E2E tests (Playwright)

### Backend
- Unit tests (Jest)
- Integration tests
- API tests

---

## 🚀 Déploiement (À venir)

### Frontend
- **Vercel** ou **Netlify**
- CI/CD automatique
- Preview deployments
- Environnements (dev, staging, prod)

### Backend
- **Railway** ou **Render**
- MongoDB Atlas
- Variables d'environnement sécurisées

---

## 📚 Documentation

### Documents de référence
1. **CONTEXT.md** (ce fichier) - Vue d'ensemble
2. **SESSION_RESUME.md** - État actuel + prochaine étape
3. **PROGRESS.md** - Avancement détaillé
4. **ROADMAP.md** - Checklist complète (~200 tâches)
5. **ARCHITECTURE.md** - Structure détaillée code
6. **API_DOCUMENTATION.md** - Documentation backend

### Ordre de lecture
1. SESSION_RESUME.md ⭐ (à lire en PREMIER)
2. CONTEXT.md (vue d'ensemble)
3. PROGRESS.md (détails progression)
4. ARCHITECTURE.md (structure code)
5. ROADMAP.md (checklist complète)

---

## 🎯 Prochaines Étapes

### Session 3.8 (5 min)
- Créer `AdminRoute.jsx` guard

### Session 4 (2-3h)
- Créer 5 pages Authentication
- Login, Register, ForgotPassword, ResetPassword, VerifyEmail

### Session 5
- Dashboard principal avec stats

### Phase 2
- Modules métier (Comptes, Transactions, Budgets, Sols, etc.)

---

## 📞 Support

### Ressources
- Documentation Tailwind : https://tailwindcss.com
- Documentation Redux Toolkit : https://redux-toolkit.js.org
- Documentation React Router : https://reactrouter.com
- Documentation Recharts : https://recharts.org
- Documentation Axios : https://axios-http.com

---

## 🎊 Statistiques Actuelles

**Phase 1 - Fondations** : 95% ✅

- **49 fichiers** créés
- **~11,080 lignes** de code
- **36 composants** UI
- **5 modules utils** complets ⭐
- **4 fichiers routes** configurés ⭐
- **0 TODO** ou placeholders
- **100% production-ready**

---

**Version** : 1.3  
**Dernière mise à jour** : 18 octobre 2025, 19h30  
**Statut** : Phase 1 - Fondations (95%) ✅  
**Prochaine étape** : AdminRoute.jsx + Pages Auth 🔐