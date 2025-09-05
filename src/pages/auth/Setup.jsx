// src/pages/auth/Setup.jsx
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, User, DollarSign, CreditCard, Tag, Globe, Bell, Palette, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { completeSetup } = useAuthStore();
  const navigate = useNavigate();

  const [setupData, setSetupData] = useState({
    profile: {
      currency_preference: 'HTG',
      language: 'fr',
      timezone: 'America/Port-au-Prince',
      theme: 'light',
      notifications_enabled: true,
      weekly_summary: true,
      budget_alerts: true,
      goal_reminders: true
    },
    security: {
      two_factor: false,
      biometric_login: false,
      session_timeout: 30,
      data_backup: true
    },
    accounts: [],
    categories: [
      { name: 'Alimentation', emoji: '🍽️', type: 'expense', color: '#EF4444', enabled: true },
      { name: 'Transport', emoji: '🚗', type: 'expense', color: '#3B82F6', enabled: true },
      { name: 'Logement', emoji: '🏠', type: 'expense', color: '#10B981', enabled: true },
      { name: 'Santé', emoji: '🏥', type: 'expense', color: '#F59E0B', enabled: true },
      { name: 'Loisirs', emoji: '🎉', type: 'expense', color: '#8B5CF6', enabled: true },
      { name: 'Éducation', emoji: '📚', type: 'expense', color: '#EC4899', enabled: true },
      { name: 'Vêtements', emoji: '👕', type: 'expense', color: '#06B6D4', enabled: true },
      { name: 'Salaire', emoji: '💼', type: 'income', color: '#10B981', enabled: true },
      { name: 'Freelance', emoji: '🚀', type: 'income', color: '#8B5CF6', enabled: true },
      { name: 'Investissement', emoji: '📈', type: 'income', color: '#F59E0B', enabled: true }
    ],
    goals: {
      emergency_fund: { enabled: false, target: 0 },
      vacation: { enabled: false, target: 0 },
      house_deposit: { enabled: false, target: 0 },
      education: { enabled: false, target: 0 }
    }
  });

  const steps = [
    { number: 1, title: 'Profil', description: 'Préférences personnelles', icon: User },
    { number: 2, title: 'Sécurité', description: 'Paramètres de sécurité', icon: Shield },
    { number: 3, title: 'Comptes', description: 'Comptes bancaires', icon: CreditCard },
    { number: 4, title: 'Catégories', description: 'Organisation des dépenses', icon: Tag },
    { number: 5, title: 'Objectifs', description: 'Objectifs d\'épargne', icon: DollarSign },
    { number: 6, title: 'Terminé', description: 'Configuration complète', icon: CheckCircle }
  ];

  // Étape 1: Profil et Préférences
  const ProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration de votre profil</h2>
        <p className="text-gray-600">Personnalisez votre expérience FinApp Haiti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Devise principale</label>
          <select 
            value={setupData.profile.currency_preference}
            onChange={(e) => setSetupData(prev => ({
              ...prev,
              profile: { ...prev.profile, currency_preference: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HTG">🇭🇹 Gourde Haïtienne (HTG)</option>
            <option value="USD">🇺🇸 Dollar Américain (USD)</option>
            <option value="BOTH">💱 Les deux (HTG + USD)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
          <select 
            value={setupData.profile.language}
            onChange={(e) => setSetupData(prev => ({
              ...prev,
              profile: { ...prev.profile, language: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="ht">🇭🇹 Kreyòl Ayisyen</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
          <div className="grid grid-cols-2 gap-3">
            {['light', 'dark'].map(theme => (
              <button
                key={theme}
                onClick={() => setSetupData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, theme }
                }))}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  setupData.profile.theme === theme
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {theme === 'light' ? '☀️' : '🌙'} {theme === 'light' ? 'Clair' : 'Sombre'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Notifications</label>
          <div className="space-y-3">
            {[
              { key: 'notifications_enabled', label: 'Notifications générales', icon: '🔔' },
              { key: 'weekly_summary', label: 'Résumé hebdomadaire', icon: '📊' },
              { key: 'budget_alerts', label: 'Alertes budget', icon: '⚠️' },
              { key: 'goal_reminders', label: 'Rappels objectifs', icon: '🎯' }
            ].map(({ key, label, icon }) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={setupData.profile[key]}
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, [key]: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{icon} {label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 2: Sécurité
  const SecurityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sécurité de votre compte</h2>
        <p className="text-gray-600">Protégez vos données financières</p>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Sécurité recommandée</p>
              <p className="text-green-700 text-sm">
                FinApp Haiti utilise un chiffrement de bout en bout pour protéger vos données.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Authentification</h3>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">🔐 Authentification à deux facteurs</span>
                <p className="text-xs text-gray-600">Sécurité supplémentaire avec SMS</p>
              </div>
              <input
                type="checkbox"
                checked={setupData.security.two_factor}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, two_factor: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">👆 Connexion biométrique</span>
                <p className="text-xs text-gray-600">Empreinte digitale ou Face ID</p>
              </div>
              <input
                type="checkbox"
                checked={setupData.security.biometric_login}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, biometric_login: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Session et Données</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏱️ Expiration de session (minutes)
              </label>
              <select
                value={setupData.security.session_timeout}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, session_timeout: parseInt(e.target.value) }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 heure</option>
                <option value={120}>2 heures</option>
                <option value={-1}>Jamais</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">☁️ Sauvegarde automatique</span>
                <p className="text-xs text-gray-600">Backup chiffré de vos données</p>
              </div>
              <input
                type="checkbox"
                checked={setupData.security.data_backup}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, data_backup: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 3: Comptes Bancaires
  const AccountsStep = () => {
    const [newAccount, setNewAccount] = useState({
      name: '',
      bank_name: '',
      account_type: 'checking',
      currency: setupData.profile.currency_preference === 'BOTH' ? 'HTG' : setupData.profile.currency_preference,
      current_balance: ''
    });

    const haitianBanks = [
      'BUH (Banque de l\'Union Haïtienne)',
      'Sogebank',
      'Capital Bank',
      'BNC (Banque Nationale de Crédit)',
      'Unibank',
      'BBDA (Banque de Borlette de l\'Artibonite)',
      'Banque Populaire Haïtienne',
      'SOFIHDES',
      'Autre'
    ];

    const addAccount = () => {
      if (newAccount.name && newAccount.bank_name && newAccount.current_balance) {
        setSetupData(prev => ({
          ...prev,
          accounts: [...prev.accounts, { ...newAccount, id: Date.now(), color: '#3B82F6' }]
        }));
        setNewAccount({
          name: '',
          bank_name: '',
          account_type: 'checking',
          currency: setupData.profile.currency_preference === 'BOTH' ? 'HTG' : setupData.profile.currency_preference,
          current_balance: ''
        });
      }
    };

    const removeAccount = (id) => {
      setSetupData(prev => ({
        ...prev,
        accounts: prev.accounts.filter(acc => acc.id !== id)
      }));
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos comptes bancaires</h2>
          <p className="text-gray-600">Connectez vos comptes pour un suivi complet</p>
        </div>

        {/* Quick Setup Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setNewAccount({
              name: 'Compte Principal',
              bank_name: 'Sogebank',
              account_type: 'checking',
              currency: 'HTG',
              current_balance: '0'
            })}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Configuration rapide</p>
            <p className="text-xs text-gray-500">Sogebank - Compte courant</p>
          </button>
          
          <button
            onClick={() => setNewAccount({
              name: 'Épargne',
              bank_name: 'BUH',
              account_type: 'savings',
              currency: 'USD',
              current_balance: '0'
            })}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Compte épargne</p>
            <p className="text-xs text-gray-500">BUH - Épargne USD</p>
          </button>

          <button
            onClick={() => setNewAccount({
              name: 'Espèces',
              bank_name: 'Portefeuille',
              account_type: 'cash',
              currency: 'HTG',
              current_balance: '0'
            })}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
          >
            <span className="text-2xl block mb-2">💰</span>
            <p className="text-sm font-medium text-gray-700">Argent liquide</p>
            <p className="text-xs text-gray-500">Portefeuille - Cash</p>
          </button>
        </div>

        {/* Formulaire manuel */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Ou ajoutez manuellement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newAccount.name}
              onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nom du compte"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={newAccount.bank_name}
              onChange={(e) => setNewAccount(prev => ({ ...prev, bank_name: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une banque</option>
              {haitianBanks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>

            <select
              value={newAccount.account_type}
              onChange={(e) => setNewAccount(prev => ({ ...prev, account_type: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="checking">🏦 Compte Courant</option>
              <option value="savings">💰 Compte Épargne</option>
              <option value="credit">💳 Carte de Crédit</option>
              <option value="cash">🪙 Espèces</option>
            </select>

            <div className="flex space-x-2">
              <input
                type="number"
                value={newAccount.current_balance}
                onChange={(e) => setNewAccount(prev => ({ ...prev, current_balance: e.target.value }))}
                placeholder="Solde actuel"
                step="0.01"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newAccount.currency}
                onChange={(e) => setNewAccount(prev => ({ ...prev, currency: e.target.value }))}
                className="w-20 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HTG">HTG</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <button
            onClick={addAccount}
            disabled={!newAccount.name || !newAccount.bank_name || !newAccount.current_balance}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            ➕ Ajouter ce compte
          </button>
        </div>

        {/* Liste des comptes ajoutés */}
        {setupData.accounts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Comptes configurés ({setupData.accounts.length})</h3>
            {setupData.accounts.map(account => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="font-medium text-gray-900">{account.name}</div>
                    <div className="text-sm text-gray-600">
                      {account.bank_name} • {account.account_type} • {account.currency}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">
                    {parseFloat(account.current_balance).toLocaleString()} {account.currency}
                  </span>
                  <button
                    onClick={() => removeAccount(account.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Étape 4: Catégories
  const CategoriesStep = () => {
    const toggleCategory = (index) => {
      setSetupData(prev => ({
        ...prev,
        categories: prev.categories.map((cat, i) => 
          i === index ? { ...cat, enabled: !cat.enabled } : cat
        )
      }));
    };

    const updateCategoryColor = (index, color) => {
      setSetupData(prev => ({
        ...prev,
        categories: prev.categories.map((cat, i) => 
          i === index ? { ...cat, color } : cat
        )
      }));
    };

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Tag className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Catégories de transactions</h2>
          <p className="text-gray-600">Organisez vos dépenses et revenus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-red-500 mr-2">📉</span> Dépenses
            </h3>
            <div className="space-y-2">
              {setupData.categories.filter(cat => cat.type === 'expense').map((category, index) => {
                const originalIndex = setupData.categories.findIndex(cat => cat.name === category.name);
                return (
                  <div key={category.name} className={`p-3 rounded-lg border-2 transition-colors ${
                    category.enabled ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={category.enabled}
                          onChange={() => toggleCategory(originalIndex)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-lg">{category.emoji}</span>
                        <span className={`font-medium ${category.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          {category.name}
                        </span>
                      </label>
                      {category.enabled && (
                        <div className="flex space-x-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateCategoryColor(originalIndex, color)}
                              className={`w-5 h-5 rounded-full border-2 ${
                                category.color === color ? 'border-gray-900' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-green-500 mr-2">📈</span> Revenus
            </h3>
            <div className="space-y-2">
              {setupData.categories.filter(cat => cat.type === 'income').map((category, index) => {
                const originalIndex = setupData.categories.findIndex(cat => cat.name === category.name);
                return (
                  <div key={category.name} className={`p-3 rounded-lg border-2 transition-colors ${
                    category.enabled ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={category.enabled}
                          onChange={() => toggleCategory(originalIndex)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-lg">{category.emoji}</span>
                        <span className={`font-medium ${category.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          {category.name}
                        </span>
                      </label>
                      {category.enabled && (
                        <div className="flex space-x-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateCategoryColor(originalIndex, color)}
                              className={`w-5 h-5 rounded-full border-2 ${
                                category.color === color ? 'border-gray-900' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            ✅ {setupData.categories.filter(c => c.enabled).length} catégories activées
          </p>
          <p className="text-blue-700 text-sm">
            Vous pourrez ajouter d'autres catégories plus tard dans les paramètres.
          </p>
        </div>
      </div>
    );
  };

  // Étape 5: Objectifs d'épargne
  const GoalsStep = () => {
    const updateGoal = (goalKey, field, value) => {
      setSetupData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [goalKey]: {
            ...prev.goals[goalKey],
            [field]: field === 'target' ? parseFloat(value) || 0 : value
          }
        }
      }));
    };

    const goalTemplates = [
      {
        key: 'emergency_fund',
        name: 'Fonds d\'urgence',
        emoji: '🚨',
        description: 'Équivalent de 3-6 mois de dépenses',
        suggestedAmount: 50000,
        color: 'red'
      },
      {
        key: 'vacation',
        name: 'Vacances',
        emoji: '🏖️',
        description: 'Voyage ou vacances de rêve',
        suggestedAmount: 25000,
        color: 'blue'
      },
      {
        key: 'house_deposit',
        name: 'Acompte maison',
        emoji: '🏠',
        description: 'Acompte pour achat immobilier',
        suggestedAmount: 100000,
        color: 'green'
      },
      {
        key: 'education',
        name: 'Éducation',
        emoji: '🎓',
        description: 'Formation ou études',
        suggestedAmount: 30000,
        color: 'purple'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Objectifs d'épargne</h2>
          <p className="text-gray-600">Fixez vos objectifs financiers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goalTemplates.map(template => {
            const goal = setupData.goals[template.key];
            const colorClasses = {
              red: 'border-red-200 bg-red-50',
              blue: 'border-blue-200 bg-blue-50',
              green: 'border-green-200 bg-green-50',
              purple: 'border-purple-200 bg-purple-50'
            };

            return (
              <div key={template.key} className={`p-4 rounded-lg border-2 transition-colors ${
                goal.enabled ? colorClasses[template.color] : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{template.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={goal.enabled}
                    onChange={(e) => updateGoal(template.key, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {goal.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objectif ({setupData.profile.currency_preference})
                      </label>
                      <input
                        type="number"
                        value={goal.target}
                        onChange={(e) => updateGoal(template.key, 'target', e.target.value)}
                        placeholder={template.suggestedAmount.toString()}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => updateGoal(template.key, 'target', template.suggestedAmount)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      💡 Utiliser le montant suggéré: {template.suggestedAmount.toLocaleString()} {setupData.profile.currency_preference}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            🎯 {Object.values(setupData.goals).filter(g => g.enabled).length} objectif(s) configuré(s)
          </p>
          <p className="text-green-700 text-sm">
            Objectif total: {Object.values(setupData.goals).reduce((sum, goal) => 
              goal.enabled ? sum + goal.target : sum, 0
            ).toLocaleString()} {setupData.profile.currency_preference}
          </p>
        </div>
      </div>
    );
  };

  // Étape 6: Terminé
  const CompletedStep = () => (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Configuration terminée !</h2>
        <p className="text-gray-600 text-lg">
          Votre application FinApp Haiti est prête à l'emploi
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Récapitulatif de votre configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">💰 Devise principale:</span>
              <span className="font-medium">{setupData.profile.currency_preference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🏦 Comptes bancaires:</span>
              <span className="font-medium">{setupData.accounts.length} compte(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🏷️ Catégories actives:</span>
              <span className="font-medium">{setupData.categories.filter(c => c.enabled).length} catégorie(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🎯 Objectifs d'épargne:</span>
              <span className="font-medium">{Object.values(setupData.goals).filter(g => g.enabled).length} objectif(s)</span>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">🌍 Langue:</span>
              <span className="font-medium">{setupData.profile.language === 'fr' ? 'Français' : setupData.profile.language === 'ht' ? 'Kreyòl' : 'English'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🔐 Sécurité 2FA:</span>
              <span className="font-medium">{setupData.security.two_factor ? 'Activée' : 'Désactivée'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🔔 Notifications:</span>
              <span className="font-medium">{setupData.profile.notifications_enabled ? 'Activées' : 'Désactivées'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🎨 Thème:</span>
              <span className="font-medium">{setupData.profile.theme === 'light' ? 'Clair' : 'Sombre'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">🚀 Prochaines étapes suggérées</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Enregistrez votre première transaction</li>
            <li>• Configurez vos premiers budgets mensuels</li>
            <li>• Explorez les fonctionnalités des sols haïtiens</li>
            <li>• Invitez vos proches à rejoindre vos sols</li>
          </ul>
        </div>
        
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              completeSetup();
              setIsLoading(false);
              navigate('/', { replace: true });
            }, 1500);
          }}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-4 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Finalisation...</span>
            </>
          ) : (
            <>
              <span>🎊 Commencer à utiliser FinApp Haiti</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <ProfileStep />;
      case 2: return <SecurityStep />;
      case 3: return <AccountsStep />;
      case 4: return <CategoriesStep />;
      case 5: return <GoalsStep />;
      case 6: return <CompletedStep />;
      default: return <ProfileStep />;
    }
  };

  const canProceed = () => {
    switch(currentStep) {
      case 1: return setupData.profile.currency_preference && setupData.profile.language;
      case 2: return true; // Sécurité est optionnelle
      case 3: return setupData.accounts.length > 0;
      case 4: return setupData.categories.filter(c => c.enabled).length > 0;
      case 5: return true; // Objectifs sont optionnels
      case 6: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-lg mb-8 p-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center min-w-0">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold ${
                    step.number === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step.number < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{step.title}</div>
                    <div className="text-xs text-gray-500 hidden md:block truncate">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                    step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Skip option for optional steps */}
              {(currentStep === 2 || currentStep === 5) && (
                <button
                  onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                >
                  Ignorer cette étape
                </button>
              )}
              
              <button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-lg">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression</span>
            <span>{Math.round((currentStep / 6) * 100)}% terminé</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;