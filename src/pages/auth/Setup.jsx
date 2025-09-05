// src/pages/auth/Setup.jsx - VERSION COMPLÈTE AVEC TOUS LES BUG FIXES
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, User, DollarSign, CreditCard, Tag, Globe, Bell, Palette, Shield, Calendar, Clock, Target } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../database/db';

const Setup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { completeSetup, user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const [setupData, setSetupData] = useState({
    profile: {
      currency_preference: 'HTG',
      language: 'fr',
      timezone: 'America/Port-au-Prince',
      theme: theme,
      notifications_enabled: true,
      weekly_summary: true,
      budget_alerts: true,
      goal_reminders: true
    },
    security: {
      two_factor: false,
      biometric_login: false,
      session_timeout: 30, // ✅ BUG FIX 1: Par défaut 30 minutes
      data_backup: true
    },
    income_sources: [],
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
    { number: 4, title: 'Revenus', description: 'Salaires et revenus', icon: Calendar }, // ← Icône changée
    { number: 5, title: 'Catégories', description: 'Organisation des dépenses', icon: Tag },
    { number: 6, title: 'Objectifs', description: 'Objectifs d\'épargne', icon: Target },
    { number: 7, title: 'Terminé', description: 'Configuration complète', icon: CheckCircle }
  ];

  // ✅ BUG FIX 1: Fonction pour sauvegarder les préférences de session
  const saveSessionPreferences = () => {
    const preferences = {
      sessionTimeout: setupData.security.session_timeout,
      twoFactor: setupData.security.two_factor,
      biometricLogin: setupData.security.biometric_login,
      dataBackup: setupData.security.data_backup
    };

    localStorage.setItem('finapp-security-preferences', JSON.stringify(preferences));
    console.log('💾 Préférences de sécurité sauvegardées:', preferences);
  };

  const saveAccountsToDatabase = async () => {
    if (!user?.id || setupData.accounts.length === 0) return;

    try {
      console.log('💾 Sauvegarde des comptes en base de données...');

      for (const accountData of setupData.accounts) {
        const newAccount = {
          user_id: user.id,
          name: accountData.name,
          bank_name: accountData.bank_name,
          account_type: accountData.account_type,
          currency: accountData.currency,
          current_balance: parseFloat(accountData.current_balance) || 0,
          color: accountData.color || '#3B82F6',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        };

        await db.accounts.add(newAccount);
        console.log(`✅ Compte "${accountData.name}" sauvegardé`);
      }

      console.log(`🎉 ${setupData.accounts.length} compte(s) sauvegardé(s) avec succès`);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des comptes:', error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setSetupData(prev => ({
      ...prev,
      profile: { ...prev.profile, theme: newTheme }
    }));
  };

  // Étape 1: Profil et Préférences
  const ProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Configuration de votre profil</h2>
        <p className="text-gray-600 dark:text-gray-300">Personnalisez votre expérience FinApp Haiti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Devise principale</label>
          <select
            value={setupData.profile.currency_preference}
            onChange={(e) => setSetupData(prev => ({
              ...prev,
              profile: { ...prev.profile, currency_preference: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="HTG">🇭🇹 Gourde Haïtienne (HTG)</option>
            <option value="USD">🇺🇸 Dollar Américain (USD)</option>
            <option value="BOTH">💱 Les deux (HTG + USD)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Langue</label>
          <select
            value={setupData.profile.language}
            onChange={(e) => setSetupData(prev => ({
              ...prev,
              profile: { ...prev.profile, language: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="ht">🇭🇹 Kreyòl Ayisyen</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thème d'apparence</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'light', icon: '☀️', label: 'Clair' },
              { value: 'dark', icon: '🌙', label: 'Sombre' }
            ].map(themeOption => (
              <button
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 relative ${setupData.profile.theme === themeOption.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                <div className="text-2xl mb-2">{themeOption.icon}</div>
                <div className="font-medium">{themeOption.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {themeOption.value === 'light' ? 'Interface claire' : 'Interface sombre'}
                </div>
                {setupData.profile.theme === themeOption.value && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Le thème s'applique immédiatement à toute l'application
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Notifications</label>
          <div className="space-y-3">
            {[
              { key: 'notifications_enabled', label: 'Notifications générales', icon: '🔔' },
              { key: 'weekly_summary', label: 'Résumé hebdomadaire', icon: '📊' },
              { key: 'budget_alerts', label: 'Alertes budget', icon: '⚠️' },
              { key: 'goal_reminders', label: 'Rappels objectifs', icon: '🎯' }
            ].map(({ key, label, icon }) => (
              <label key={key} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  checked={setupData.profile[key]}
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, [key]: e.target.checked }
                  }))}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{icon} {label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ BUG FIX 2: Étape Sécurité avec messages d'indisponibilité
  const SecurityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sécurité de votre compte</h2>
        <p className="text-gray-600 dark:text-gray-300">Protégez vos données financières</p>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-green-800 dark:text-green-300 font-medium">Sécurité recommandée</p>
              <p className="text-green-700 dark:text-green-400 text-sm">
                FinApp Haiti utilise un chiffrement de bout en bout pour protéger vos données.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Authentification</h3>

            {/* ✅ BUG FIX 2: Authentification à deux facteurs avec message */}
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">🔐 Authentification à deux facteurs</span>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full">
                    Bientôt
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sécurité supplémentaire avec SMS (en développement)</p>
              </div>
              <input
                type="checkbox"
                checked={setupData.security.two_factor}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, two_factor: e.target.checked }
                }))}
                disabled={true}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600 opacity-50 cursor-not-allowed"
              />
            </label>

            {/* ✅ BUG FIX 2: Connexion biométrique avec message */}
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">👆 Connexion biométrique</span>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full">
                    Bientôt
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Empreinte digitale ou Face ID (en développement)</p>
              </div>
              <input
                type="checkbox"
                checked={setupData.security.biometric_login}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, biometric_login: e.target.checked }
                }))}
                disabled={true}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600 opacity-50 cursor-not-allowed"
              />
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Session et Données</h3>

            {/* ✅ BUG FIX 1: Gestion de la session avec respect du choix utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ⏱️ Expiration de session (minutes)
              </label>
              <select
                value={setupData.security.session_timeout}
                onChange={(e) => {
                  const newTimeout = parseInt(e.target.value);
                  setSetupData(prev => ({
                    ...prev,
                    security: { ...prev.security, session_timeout: newTimeout }
                  }));
                  console.log('⏱️ Session timeout défini à:', newTimeout === -1 ? 'Jamais' : `${newTimeout} minutes`);
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes (recommandé)</option>
                <option value={60}>1 heure</option>
                <option value={120}>2 heures</option>
                <option value={480}>8 heures</option>
                <option value={-1}>Jamais (déconseillé)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {setupData.security.session_timeout === -1
                  ? "⚠️ Votre session ne expirera jamais (moins sécurisé)"
                  : `🔒 Votre session expirera après ${setupData.security.session_timeout} minutes d'inactivité`
                }
              </p>
            </div>

            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">☁️ Sauvegarde automatique</span>
                <p className="text-xs text-gray-600 dark:text-gray-400">Backup chiffré de vos données localement</p>
              </div>
              <input
                type="checkbox"
                checked={setupData.security.data_backup}
                onChange={(e) => setSetupData(prev => ({
                  ...prev,
                  security: { ...prev.security, data_backup: e.target.checked }
                }))}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ BUG FIX 3 & 5: Étape Comptes avec gestion portefeuille et cartes de crédit
  const AccountsStep = () => {
    const [newAccount, setNewAccount] = useState({
      name: '',
      bank_name: '',
      account_type: 'checking',
      currency: setupData.profile.currency_preference === 'BOTH' ? 'HTG' : setupData.profile.currency_preference,
      current_balance: ''
    });

    // ✅ BUG FIX 5: Banques haïtiennes incluant cartes de crédit
    const haitianBanks = [
      'BUH (Banque de l\'Union Haïtienne)',
      'Sogebank',
      'Capital Bank',
      'BNC (Banque Nationale de Crédit)',
      'Unibank',
      'Banque Populaire Haïtienne (BPH)',
      'SOFIHDES (Société Financière Haïtienne de Développement)',
      'Banque de la République d\'Haïti (BRH) - Banque Centrale',
      'Citibank Haïti',
      'Bank of America Haïti (services limités)',
      'Banque de l\'Habitat Haïtien (BHH)',
      'PromoCapital',
      'Fonkoze (institution de microfinance)',
      'Sogesol (institution de microfinance)',
      'CACR (Caisse d\'Épargne et de Crédit)',
      'Finca Haïti',
      'ACMÉ (Association pour la Coopération avec la Micro-Entreprise)',
      'Fondation Haïtienne d\'Aide aux Petits Entrepreneurs (FHAPE)',
      'CECARE (Caisse d\'Épargne et de Crédit des Artisans)',
      // ✅ BUG FIX 5: Ajout des cartes de crédit
      'Visa Haiti',
      'MasterCard Haiti',
      'American Express Haiti',
      'Diners Club Haiti',
      'Autre institution financière',
      'Autre'
    ];

    // ✅ BUG FIX 3: Validation qui respecte le type de compte
    const addAccount = () => {
      // Validation de base
      if (!newAccount.name || !newAccount.current_balance) {
        alert('Veuillez remplir le nom du compte et le solde');
        return;
      }

      // ✅ BUG FIX 3: Logique spéciale pour les espèces/portefeuille
      if (newAccount.account_type === 'cash') {
        // Pour les espèces, pas besoin de banque
        if (!newAccount.bank_name) {
          newAccount.bank_name = 'Portefeuille Personnel';
        }
      } else {
        // Pour tous les autres types (checking, savings, credit), la banque est requise
        if (!newAccount.bank_name) {
          alert('Veuillez sélectionner une banque pour ce type de compte');
          return;
        }
      }

      setSetupData(prev => ({
        ...prev,
        accounts: [...prev.accounts, { ...newAccount, id: Date.now(), color: '#3B82F6' }]
      }));

      // Reset du formulaire
      setNewAccount({
        name: '',
        bank_name: '',
        account_type: 'checking',
        currency: setupData.profile.currency_preference === 'BOTH' ? 'HTG' : setupData.profile.currency_preference,
        current_balance: ''
      });
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
          <CreditCard className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vos comptes bancaires</h2>
          <p className="text-gray-600 dark:text-gray-300">Connectez vos comptes pour un suivi complet</p>
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
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <CreditCard className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration rapide</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sogebank - Compte courant</p>
          </button>

          <button
            onClick={() => setNewAccount({
              name: 'Épargne',
              bank_name: 'BUH',
              account_type: 'savings',
              currency: 'USD',
              current_balance: '0'
            })}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <DollarSign className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Compte épargne</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">BUH - Épargne USD</p>
          </button>

          {/* ✅ BUG FIX 3: Configuration rapide pour portefeuille */}
          <button
            onClick={() => setNewAccount({
              name: 'Espèces',
              bank_name: 'Portefeuille Personnel', // ✅ Pré-rempli automatiquement
              account_type: 'cash',
              currency: 'HTG',
              current_balance: '0'
            })}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
          >
            <span className="text-2xl block mb-2">💰</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Argent liquide</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Portefeuille - Espèces</p>
          </button>
        </div>

        {/* Formulaire manuel */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Ou ajoutez manuellement</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newAccount.name}
              onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nom du compte"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            {/* ✅ BUG FIX 3: Champ banque conditionnel */}
            <div className="space-y-1">
              <select
                value={newAccount.bank_name}
                onChange={(e) => setNewAccount(prev => ({ ...prev, bank_name: e.target.value }))}
                disabled={newAccount.account_type === 'cash'} // ✅ Désactivé pour espèces
                className={`p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${newAccount.account_type === 'cash' ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''
                  }`}
              >
                <option value="">
                  {newAccount.account_type === 'cash' ? 'Portefeuille (automatique)' : 'Sélectionner une banque'}
                </option>
                {newAccount.account_type !== 'cash' && haitianBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
              {newAccount.account_type === 'cash' && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  💡 Pour les espèces, aucune banque n'est requise
                </p>
              )}
            </div>

            {/* ✅ BUG FIX 5: Types de comptes incluant cartes de crédit */}
            <select
              value={newAccount.account_type}
              onChange={(e) => {
                const newType = e.target.value;
                setNewAccount(prev => ({
                  ...prev,
                  account_type: newType,
                  // ✅ BUG FIX 3: Auto-remplissage pour portefeuille
                  bank_name: newType === 'cash' ? 'Portefeuille Personnel' : ''
                }));
              }}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="checking">🏦 Compte Courant</option>
              <option value="savings">💰 Compte Épargne</option>
              <option value="credit">💳 Carte de Crédit</option> {/* ✅ BUG FIX 5 */}
              <option value="cash">🪙 Espèces / Portefeuille</option>
            </select>

            <div className="flex space-x-2">
              <input
                type="number"
                value={newAccount.current_balance}
                onChange={(e) => setNewAccount(prev => ({ ...prev, current_balance: e.target.value }))}
                placeholder={newAccount.account_type === 'credit' ? 'Limite de crédit' : 'Solde actuel'}
                step="0.01"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <select
                value={newAccount.currency}
                onChange={(e) => setNewAccount(prev => ({ ...prev, currency: e.target.value }))}
                className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="HTG">HTG</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* ✅ Message d'aide pour les cartes de crédit */}
          {newAccount.account_type === 'credit' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                💳 <strong>Carte de crédit :</strong> Entrez votre limite de crédit disponible.
                Les dépenses seront déduites de cette limite.
              </p>
            </div>
          )}

          <button
            onClick={addAccount}
            disabled={!newAccount.name || !newAccount.current_balance || (newAccount.account_type !== 'cash' && !newAccount.bank_name)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            ➕ Ajouter ce compte
          </button>
        </div>

        {/* Liste des comptes ajoutés */}
        {setupData.accounts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Comptes configurés ({setupData.accounts.length})</h3>
            {setupData.accounts.map(account => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{account.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {account.bank_name} • {
                        account.account_type === 'checking' ? 'Compte Courant' :
                          account.account_type === 'savings' ? 'Épargne' :
                            account.account_type === 'credit' ? 'Carte de Crédit' :
                              'Espèces'
                      } • {account.currency}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    {parseFloat(account.current_balance).toLocaleString()} {account.currency}
                    {account.account_type === 'credit' && (
                      <span className="text-xs text-gray-500 ml-1">(limite)</span>
                    )}
                  </span>
                  <button
                    onClick={() => removeAccount(account.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
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
          <Tag className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Catégories de transactions</h2>
          <p className="text-gray-600 dark:text-gray-300">Organisez vos dépenses et revenus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-red-500 mr-2">📉</span> Dépenses
            </h3>
            <div className="space-y-2">
              {setupData.categories.filter(cat => cat.type === 'expense').map((category, index) => {
                const originalIndex = setupData.categories.findIndex(cat => cat.name === category.name);
                return (
                  <div key={category.name} className={`p-3 rounded-lg border-2 transition-colors ${category.enabled
                      ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                    }`}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={category.enabled}
                          onChange={() => toggleCategory(originalIndex)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                        />
                        <span className="text-lg">{category.emoji}</span>
                        <span className={`font-medium ${category.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {category.name}
                        </span>
                      </label>
                      {category.enabled && (
                        <div className="flex space-x-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateCategoryColor(originalIndex, color)}
                              className={`w-5 h-5 rounded-full border-2 transition-all ${category.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600 hover:scale-105'
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-green-500 mr-2">📈</span> Revenus
            </h3>
            <div className="space-y-2">
              {setupData.categories.filter(cat => cat.type === 'income').map((category, index) => {
                const originalIndex = setupData.categories.findIndex(cat => cat.name === category.name);
                return (
                  <div key={category.name} className={`p-3 rounded-lg border-2 transition-colors ${category.enabled
                      ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                    }`}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={category.enabled}
                          onChange={() => toggleCategory(originalIndex)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                        />
                        <span className="text-lg">{category.emoji}</span>
                        <span className={`font-medium ${category.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {category.name}
                        </span>
                      </label>
                      {category.enabled && (
                        <div className="flex space-x-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateCategoryColor(originalIndex, color)}
                              className={`w-5 h-5 rounded-full border-2 transition-all ${category.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600 hover:scale-105'
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

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            ✅ {setupData.categories.filter(c => c.enabled).length} catégories activées
          </p>
          <p className="text-blue-700 dark:text-blue-400 text-sm">
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
          <DollarSign className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Objectifs d'épargne</h2>
          <p className="text-gray-600 dark:text-gray-300">Fixez vos objectifs financiers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goalTemplates.map(template => {
            const goal = setupData.goals[template.key];
            const colorClasses = {
              red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
              blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
              green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
              purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
            };

            return (
              <div key={template.key} className={`p-4 rounded-lg border-2 transition-colors ${goal.enabled ? colorClasses[template.color] : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{template.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={goal.enabled}
                    onChange={(e) => updateGoal(template.key, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>

                {goal.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Objectif ({setupData.profile.currency_preference})
                      </label>
                      <input
                        type="number"
                        value={goal.target}
                        onChange={(e) => updateGoal(template.key, 'target', e.target.value)}
                        placeholder={template.suggestedAmount.toString()}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => updateGoal(template.key, 'target', template.suggestedAmount)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      💡 Utiliser le montant suggéré: {template.suggestedAmount.toLocaleString()} {setupData.profile.currency_preference}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-300 font-medium">
            🎯 {Object.values(setupData.goals).filter(g => g.enabled).length} objectif(s) configuré(s)
          </p>
          <p className="text-green-700 dark:text-green-400 text-sm">
            Objectif total: {Object.values(setupData.goals).reduce((sum, goal) =>
              goal.enabled ? sum + (parseFloat(goal.target) || 0) : sum, 0
            ).toLocaleString()} {setupData.profile.currency_preference}
          </p>
        </div>
      </div>
    );
  };



  // Étape 6: Revenus Automatiques - À ajouter dans Setup.jsx

  const IncomeSourcesStep = () => {
    const [newIncomeSource, setNewIncomeSource] = useState({
      name: '',
      employer: '',
      amount: '',
      currency: setupData.profile.currency_preference === 'BOTH' ? 'HTG' : setupData.profile.currency_preference,
      frequency: 'monthly',
      payment_day: 30,
      payment_time: '08:00',
      destination_account_id: '',
      category: 'salary'
    });

    const frequencies = [
      { value: 'monthly', label: '📅 Mensuel', description: 'Une fois par mois' },
      { value: 'bi_monthly', label: '📅 Bi-mensuel', description: 'Deux fois par mois (15 et 30)' },
      { value: 'weekly', label: '📅 Hebdomadaire', description: 'Chaque semaine' },
      { value: 'bi_weekly', label: '📅 Bi-hebdomadaire', description: 'Toutes les deux semaines' }
    ];

    const incomeCategories = [
      { value: 'salary', label: '💼 Salaire fixe', emoji: '💼' },
      { value: 'freelance', label: '🚀 Freelance', emoji: '🚀' },
      { value: 'business', label: '🏢 Revenus d\'entreprise', emoji: '🏢' },
      { value: 'rental', label: '🏠 Revenus locatifs', emoji: '🏠' },
      { value: 'investment', label: '📈 Investissements', emoji: '📈' },
      { value: 'pension', label: '👴 Pension/Retraite', emoji: '👴' },
      { value: 'other', label: '💰 Autre revenu', emoji: '💰' }
    ];

    const addIncomeSource = () => {
      if (newIncomeSource.name && newIncomeSource.amount && newIncomeSource.destination_account_id) {
        setSetupData(prev => ({
          ...prev,
          income_sources: [...prev.income_sources, { ...newIncomeSource, id: Date.now() }]
        }));

        setNewIncomeSource({
          name: '',
          employer: '',
          amount: '',
          currency: setupData.profile.currency_preference === 'BOTH' ? 'HTG' : setupData.profile.currency_preference,
          frequency: 'monthly',
          payment_day: 30,
          payment_time: '08:00',
          destination_account_id: '',
          category: 'salary'
        });
      }
    };

    const removeIncomeSource = (id) => {
      setSetupData(prev => ({
        ...prev,
        income_sources: prev.income_sources.filter(source => source.id !== id)
      }));
    };

    const getPaymentDayOptions = () => {
      const frequency = newIncomeSource.frequency;

      if (frequency === 'monthly') {
        // Jours du mois (1-31)
        return Array.from({ length: 31 }, (_, i) => ({
          value: i + 1,
          label: `Le ${i + 1} du mois`
        }));
      } else if (frequency === 'bi_monthly') {
        // Bi-mensuel : fixé à 15 et 30
        return [
          { value: 15, label: '15 et 30 du mois' }
        ];
      } else if (frequency === 'weekly' || frequency === 'bi_weekly') {
        // Jours de la semaine
        return [
          { value: 1, label: 'Lundi' },
          { value: 2, label: 'Mardi' },
          { value: 3, label: 'Mercredi' },
          { value: 4, label: 'Jeudi' },
          { value: 5, label: 'Vendredi' },
          { value: 6, label: 'Samedi' },
          { value: 0, label: 'Dimanche' }
        ];
      }
      return [];
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Calendar className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Revenus automatiques</h2>
          <p className="text-gray-600 dark:text-gray-300">Configurez vos salaires et revenus récurrents</p>
        </div>

        {/* Templates rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setNewIncomeSource({
              ...newIncomeSource,
              name: 'Salaire Principal',
              category: 'salary',
              frequency: 'monthly',
              payment_day: 30,
              payment_time: '08:00'
            })}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💼</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Salaire mensuel</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paiement le 30 de chaque mois</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setNewIncomeSource({
              ...newIncomeSource,
              name: 'Freelance Weekend',
              category: 'freelance',
              frequency: 'weekly',
              payment_day: 1,
              payment_time: '10:00'
            })}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Freelance</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paiement chaque lundi</p>
              </div>
            </div>
          </button>
        </div>

        {/* Formulaire d'ajout */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">✨ Ajouter un revenu automatique</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom et Employeur */}
            <input
              type="text"
              value={newIncomeSource.name}
              onChange={(e) => setNewIncomeSource(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nom du revenu (ex: Salaire Principal)"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            <input
              type="text"
              value={newIncomeSource.employer}
              onChange={(e) => setNewIncomeSource(prev => ({ ...prev, employer: e.target.value }))}
              placeholder="Employeur ou source (optionnel)"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            {/* Montant et Devise */}
            <div className="flex space-x-2">
              <input
                type="number"
                value={newIncomeSource.amount}
                onChange={(e) => setNewIncomeSource(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Montant"
                step="0.01"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <select
                value={newIncomeSource.currency}
                onChange={(e) => setNewIncomeSource(prev => ({ ...prev, currency: e.target.value }))}
                className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="HTG">HTG</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Catégorie */}
            <select
              value={newIncomeSource.category}
              onChange={(e) => setNewIncomeSource(prev => ({ ...prev, category: e.target.value }))}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              {incomeCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Fréquence */}
            <select
              value={newIncomeSource.frequency}
              onChange={(e) => setNewIncomeSource(prev => ({
                ...prev,
                frequency: e.target.value,
                payment_day: e.target.value === 'bi_monthly' ? 15 : 30
              }))}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>

            {/* Jour de paiement */}
            <select
              value={newIncomeSource.payment_day}
              onChange={(e) => setNewIncomeSource(prev => ({ ...prev, payment_day: parseInt(e.target.value) }))}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              disabled={newIncomeSource.frequency === 'bi_monthly'}
            >
              {getPaymentDayOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Heure de paiement */}
            <input
              type="time"
              value={newIncomeSource.payment_time}
              onChange={(e) => setNewIncomeSource(prev => ({ ...prev, payment_time: e.target.value }))}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />

            {/* Compte de destination */}
            <select
              value={newIncomeSource.destination_account_id}
              onChange={(e) => setNewIncomeSource(prev => ({ ...prev, destination_account_id: e.target.value }))}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Sélectionner le compte de destination</option>
              {setupData.accounts.map(account => (
                <option key={account.id} value={account.id}>
                  💳 {account.name} - {account.bank_name} ({account.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Aperçu de la fréquence */}
          {newIncomeSource.frequency && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                <strong>Fréquence:</strong> {frequencies.find(f => f.value === newIncomeSource.frequency)?.description}
                {newIncomeSource.payment_day && (
                  <span>
                    {newIncomeSource.frequency === 'monthly' && ` - Le ${newIncomeSource.payment_day} de chaque mois`}
                    {newIncomeSource.frequency === 'bi_monthly' && ` - Les 15 et 30 de chaque mois`}
                    {(newIncomeSource.frequency === 'weekly' || newIncomeSource.frequency === 'bi_weekly') &&
                      ` - ${getPaymentDayOptions().find(d => d.value === newIncomeSource.payment_day)?.label}`}
                  </span>
                )}
                {newIncomeSource.payment_time && ` à ${newIncomeSource.payment_time}`}
              </p>
            </div>
          )}

          <button
            onClick={addIncomeSource}
            disabled={!newIncomeSource.name || !newIncomeSource.amount || !newIncomeSource.destination_account_id}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            ➕ Ajouter cette source de revenus
          </button>
        </div>

        {/* Liste des revenus configurés */}
        {setupData.income_sources.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              💰 Sources de revenus configurées ({setupData.income_sources.length})
            </h3>
            {setupData.income_sources.map(source => {
              const account = setupData.accounts.find(acc => acc.id === parseInt(source.destination_account_id));
              const category = incomeCategories.find(cat => cat.value === source.category);
              const frequency = frequencies.find(freq => freq.value === source.frequency);

              return (
                <div key={source.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category?.emoji || '💰'}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {source.name}
                        {source.employer && <span className="text-gray-600 dark:text-gray-400"> - {source.employer}</span>}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-x-2">
                        <span>📅 {frequency?.label}</span>
                        <span>• 💳 {account?.name}</span>
                        <span>• 🕐 {source.payment_time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                        +{parseFloat(source.amount).toLocaleString()} {source.currency}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {source.frequency === 'monthly' && 'par mois'}
                        {source.frequency === 'bi_monthly' && 'par paiement'}
                        {source.frequency === 'weekly' && 'par semaine'}
                        {source.frequency === 'bi_weekly' && 'par paiement'}
                      </div>
                    </div>
                    <button
                      onClick={() => removeIncomeSource(source.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Récapitulatif mensuel */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">📊 Estimation mensuelle totale</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['HTG', 'USD'].map(currency => {
                  const monthlyTotal = setupData.income_sources
                    .filter(source => source.currency === currency)
                    .reduce((total, source) => {
                      let monthlyAmount = parseFloat(source.amount);

                      // Convertir selon la fréquence en mensuel
                      switch (source.frequency) {
                        case 'weekly':
                          monthlyAmount = monthlyAmount * 4.33;
                          break;
                        case 'bi_weekly':
                          monthlyAmount = monthlyAmount * 2.17;
                          break;
                        case 'bi_monthly':
                          monthlyAmount = monthlyAmount * 2;
                          break;
                        // monthly reste tel quel
                      }

                      return total + monthlyAmount;
                    }, 0);

                  if (monthlyTotal > 0) {
                    return (
                      <div key={currency} className="text-center">
                        <p className="text-green-800 dark:text-green-300 font-semibold text-lg">
                          ~{monthlyTotal.toLocaleString()} {currency} / mois
                        </p>
                        <p className="text-green-700 dark:text-green-400 text-sm">
                          {setupData.income_sources.filter(s => s.currency === currency).length} source(s) en {currency}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Informations importantes */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">ℹ️ Fonctionnement des revenus automatiques</h4>
          <ul className="text-yellow-800 dark:text-yellow-400 text-sm space-y-1">
            <li>• Vous recevrez une <strong>notification 1h avant</strong> chaque paiement automatique</li>
            <li>• Les paiements qui tombens le weekend sont <strong>reportés au lundi</strong></li>
            <li>• Vous pouvez <strong>activer/désactiver</strong> chaque source à tout moment</li>
            <li>• L'historique de tous les paiements est <strong>conservé</strong> pour vos analyses</li>
            <li>• Les montants sont ajoutés automatiquement au compte de destination choisi</li>
          </ul>
        </div>

        {/* Suggestion si pas de comptes */}
        {setupData.accounts.length === 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-300 font-medium">⚠️ Aucun compte configuré</p>
            <p className="text-red-700 dark:text-red-400 text-sm">
              Vous devez d'abord configurer au moins un compte bancaire à l'étape 3 pour pouvoir ajouter des revenus automatiques.
            </p>
          </div>
        )}
      </div>
    );
  };


  // Étape 7: Terminé
  const CompletedStep = () => (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎉 Configuration terminée !</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Votre application FinApp Haiti est prête à l'emploi
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📋 Récapitulatif de votre configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">💰 Devise principale:</span>
              <span className="font-medium text-gray-900 dark:text-white">{setupData.profile.currency_preference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">🏦 Comptes bancaires:</span>
              <span className="font-medium text-gray-900 dark:text-white">{setupData.accounts.length} compte(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">🏷️ Catégories actives:</span>
              <span className="font-medium text-gray-900 dark:text-white">{setupData.categories.filter(c => c.enabled).length} catégorie(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">🎯 Objectifs d'épargne:</span>
              <span className="font-medium text-gray-900 dark:text-white">{Object.values(setupData.goals).filter(g => g.enabled).length} objectif(s)</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">🌍 Langue:</span>
              <span className="font-medium text-gray-900 dark:text-white">{setupData.profile.language === 'fr' ? 'Français' : setupData.profile.language === 'ht' ? 'Kreyòl' : 'English'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">⏱️ Session:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {setupData.security.session_timeout === -1 ? 'Jamais' : `${setupData.security.session_timeout}min`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">🔔 Notifications:</span>
              <span className="font-medium text-gray-900 dark:text-white">{setupData.profile.notifications_enabled ? 'Activées' : 'Désactivées'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">🎨 Thème:</span>
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                {setupData.profile.theme === 'light' ? '☀️ Clair' : '🌙 Sombre'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🚀 Prochaines étapes suggérées</h4>
          <ul className="text-blue-800 dark:text-blue-400 text-sm space-y-1">
            <li>• Enregistrez votre première transaction</li>
            <li>• Configurez vos premiers budgets mensuels</li>
            <li>• Explorez les fonctionnalités des sols haïtiens</li>
            <li>• Invitez vos proches à rejoindre vos sols</li>
          </ul>
        </div>

        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              // ✅ BUG FIX 1: Sauvegarder les préférences de session
              saveSessionPreferences();

              // Sauvegarder les comptes
              await saveAccountsToDatabase();

              setTimeout(() => {
                completeSetup();
                setIsLoading(false);
                navigate('/', { replace: true });
              }, 1500);
            } catch (error) {
              console.error('Erreur lors de la finalisation:', error);
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-medium transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Finalisation et sauvegarde...</span>
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
    switch (currentStep) {
      case 1: return <ProfileStep />;
      case 2: return <SecurityStep />;
      case 3: return <AccountsStep />;
      case 4: return <IncomeSourcesStep />;  // ← Nouvelle étape Revenus
      case 5: return <CategoriesStep />;     // ← Décalé d'une étape
      case 6: return <GoalsStep />;          // ← Décalé d'une étape
      case 7: return <CompletedStep />;      // ← Décalé d'une étape
      default: return <ProfileStep />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return setupData.profile.currency_preference && setupData.profile.language;
      case 2: return true; // Sécurité est optionnelle
      case 3: return setupData.accounts.length > 0; // Au moins un compte requis
      case 4: return true; // Revenus sont optionnels (mais recommandés)
      case 5: return setupData.categories.filter(c => c.enabled).length > 0; // Au moins une catégorie
      case 6: return true; // Objectifs sont optionnels
      case 7: return true; // Étape finale
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center min-w-0">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all duration-300 ${step.number === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : step.number < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                    {step.number < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{step.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block truncate">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-16 h-0.5 mx-4 transition-colors duration-300 ${step.number < currentStep ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 7 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <div className="flex items-center space-x-4">
              {/* Skip option for optional steps */}
              {(currentStep === 2 || currentStep === 5) && (
                <button
                  onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                  className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors duration-300"
                >
                  Ignorer cette étape
                </button>
              )}

              <button
                onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-colors duration-300">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progression</span>
            <span>{Math.round((currentStep / 7) * 100)}% terminé</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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