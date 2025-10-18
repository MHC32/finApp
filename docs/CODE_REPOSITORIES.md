# 💻 CODE REPOSITORIES - FinApp Haiti

## 📦 Repositories Intégrés

**IMPORTANT** : Les repositories COMPLETS backend et frontend sont intégrés dans ce projet Claude !

Tu n'as PAS besoin d'aller sur GitHub. Le code est disponible DIRECTEMENT ici.

---

## 🎯 Pourquoi c'est génial ?

✅ **Accès instantané** au code source complet  
✅ **Pas besoin de liens** ou d'ouvrir GitHub  
✅ **Recherche rapide** dans tout le code  
✅ **Consultation en temps réel** pendant le dev  
✅ **Cohérence garantie** backend ↔ frontend  

---

## 📂 Structure Backend

```
backend/
├── src/
│   ├── models/              # 🔍 CONSULTER EN PRIORITÉ
│   │   ├── User.js          # Schéma utilisateur
│   │   ├── Account.js       # Schéma compte bancaire
│   │   ├── Transaction.js   # Schéma transaction
│   │   ├── Budget.js        # Schéma budget
│   │   ├── Sol.js           # Schéma sol/tontine
│   │   ├── Debt.js          # Schéma dette
│   │   ├── Investment.js    # Schéma investissement
│   │   └── Notification.js  # Schéma notification
│   │
│   ├── routes/              # 🔍 ENDPOINTS DISPONIBLES
│   │   ├── auth.js          # Routes authentification
│   │   ├── accounts.js      # Routes comptes
│   │   ├── transactions.js  # Routes transactions
│   │   ├── budgets.js       # Routes budgets
│   │   ├── sols.js          # Routes sols
│   │   ├── debts.js         # Routes dettes
│   │   ├── investments.js   # Routes investissements
│   │   ├── notifications.js # Routes notifications
│   │   └── ai.js            # Routes IA
│   │
│   ├── controllers/         # 🔍 LOGIQUE MÉTIER
│   │   ├── authController.js
│   │   ├── accountController.js
│   │   ├── transactionController.js
│   │   └── [...]
│   │
│   ├── middleware/          # Authentification, validation
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   │
│   ├── utils/               # Utilitaires
│   │   ├── constants.js
│   │   └── [...]
│   │
│   └── server.js            # Point d'entrée
│
└── package.json
```

---

## 📂 Structure Frontend

```
frontend/
├── src/
│   ├── api/                 # 🚧 EN DÉVELOPPEMENT
│   │   ├── axios.js
│   │   └── endpoints/
│   │
│   ├── store/               # 🚧 EN DÉVELOPPEMENT
│   │   ├── index.js
│   │   └── slices/
│   │
│   ├── components/          # 🚧 EN DÉVELOPPEMENT
│   │   ├── ui/
│   │   ├── layout/
│   │   └── [...]
│   │
│   ├── features/            # 🚧 À IMPLÉMENTER
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── [...]
│   │
│   └── [...]
│
└── package.json
```

---

## 🔍 Comment Consulter le Code Backend

### Avant d'implémenter un module frontend :

#### 1️⃣ Identifier le module
Exemple : Tu veux implémenter les **Transactions**

#### 2️⃣ Consulter le modèle
```
📁 Cherche : backend/src/models/Transaction.js

📝 Regarde :
- Quels champs existent ? (amount, type, category, etc.)
- Quels champs sont requis ?
- Quelles sont les validations ?
- Quels sont les types de données ?
- Y a-t-il des relations (ref vers d'autres modèles) ?
```

#### 3️⃣ Consulter les routes
```
📁 Cherche : backend/src/routes/transactions.js

📝 Regarde :
- Quels endpoints sont disponibles ?
  * GET /transactions (liste)
  * POST /transactions (création)
  * GET /transactions/:id (détails)
  * PUT /transactions/:id (modification)
  * DELETE /transactions/:id (suppression)
- Quels middlewares sont utilisés ? (auth, validation)
- Quels paramètres sont attendus ?
```

#### 4️⃣ Consulter le controller
```
📁 Cherche : backend/src/controllers/transactionController.js

📝 Regarde :
- Quelle est la logique métier ?
- Comment les données sont validées ?
- Comment les erreurs sont gérées ?
- Quel est le format de réponse ?
- Y a-t-il des calculs spéciaux ?
```

#### 5️⃣ Implémenter le frontend
Maintenant tu as TOUTES les infos pour créer :
- `src/api/endpoints/transactions.js` (appels API exacts)
- `src/store/slices/transactionsSlice.js` (Redux)
- `src/features/transactions/` (composants)

---

## 🎯 Exemples Pratiques

### Exemple 1 : Module Comptes (Accounts)

**Étape 1 : Consulter le modèle**
```javascript
// backend/src/models/Account.js
{
  name: String (required),
  type: String (enum: courant, epargne, moncash, natcash, cash),
  currency: String (enum: HTG, USD),
  currentBalance: Number,
  accountNumber: String,
  // ... etc
}
```

**Étape 2 : Consulter les routes**
```javascript
// backend/src/routes/accounts.js
GET    /accounts              // Liste
POST   /accounts              // Création
GET    /accounts/:id          // Détails
PUT    /accounts/:id          // Modification
DELETE /accounts/:id          // Suppression
GET    /accounts/summary      // Résumé
```

**Étape 3 : Implémenter frontend**
```javascript
// src/api/endpoints/accounts.js
export const accountsApi = {
  getAll: () => api.get('/accounts'),
  create: (data) => api.post('/accounts', data),
  // ... correspond exactement au backend
}
```

### Exemple 2 : Module Sols (Tontines)

**Consulter d'abord :**
1. `backend/src/models/Sol.js` → Structure unique (participants, tours, etc.)
2. `backend/src/routes/sols.js` → Endpoints spéciaux (join, payment, etc.)
3. `backend/src/controllers/solController.js` → Logique complexe des tours

**Résultat :** Tu comprends EXACTEMENT comment implémenter le frontend

---

## 🔍 Recherche Rapide

### Dans le code backend, cherche :

| Ce que tu veux | Où chercher |
|----------------|-------------|
| Structure de données | `backend/src/models/[Module].js` |
| Endpoints disponibles | `backend/src/routes/[module].js` |
| Logique métier | `backend/src/controllers/[module]Controller.js` |
| Validations | Controllers + `backend/src/middleware/validate.js` |
| Authentification | `backend/src/middleware/auth.js` |
| Constantes | `backend/src/utils/constants.js` |

---

## ✅ Checklist Avant Implémentation

Avant d'implémenter un nouveau module frontend :

- [ ] J'ai consulté `backend/src/models/[Module].js`
- [ ] Je connais tous les champs et leurs types
- [ ] Je connais les champs requis
- [ ] J'ai consulté `backend/src/routes/[module].js`
- [ ] Je connais tous les endpoints disponibles
- [ ] J'ai consulté le controller correspondant
- [ ] Je comprends la logique métier
- [ ] Je connais le format des réponses
- [ ] Je peux maintenant implémenter le frontend

---

## 🚫 Ne JAMAIS Deviner

❌ **MAUVAIS** :
```
"Je suppose que l'endpoint est GET /transactions"
"Je pense que le champ s'appelle 'amount'"
"Probablement que ça retourne un array"
```

✅ **BON** :
```
"J'ai consulté backend/src/routes/transactions.js"
"Le modèle définit 'amount' comme Number required"
"Le controller retourne { success, data: { transactions: [] } }"
```

---

## 💡 Principe Fondamental

**Le code backend est la SOURCE DE VÉRITÉ absolue.**

Ne te base JAMAIS sur :
- ❌ Des suppositions
- ❌ De la documentation ancienne
- ❌ Ce que tu crois savoir

TOUJOURS consulter :
- ✅ Le code backend actuel
- ✅ Les modèles Mongoose
- ✅ Les routes Express
- ✅ Les controllers

---

## 🎯 Avantage Énorme

Avec le code intégré dans ce projet Claude :

**Avant** :
1. Ouvrir GitHub
2. Naviguer dans les dossiers
3. Lire le code
4. Retourner sur Claude
5. Implémenter

**Maintenant** :
1. Consulter directement le code ici
2. Implémenter immédiatement
3. Cohérence garantie à 100%

**Gain de temps : ÉNORME ! ⚡**

---

**Le code est là, utilise-le ! 🔥**