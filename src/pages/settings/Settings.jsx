// src/pages/settings/Settings.jsx - Avec paramètres de taux de change
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Upload,
  Globe,
  DollarSign,
  Smartphone,
  Clock
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import ExchangeWidget from '../../components/ui/ExchangeWidget';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User, emoji: '👤' },
    { id: 'exchange', label: 'Taux de Change', icon: DollarSign, emoji: '💱' },
    { id: 'notifications', label: 'Notifications', icon: Bell, emoji: '🔔' },
    { id: 'appearance', label: 'Apparence', icon: Palette, emoji: '🎨' },
    { id: 'security', label: 'Sécurité', icon: Shield, emoji: '🔒' },
    { id: 'data', label: 'Données', icon: Database, emoji: '💾' }
  ];

  const ProfileTab = () => (
    <div className="space-y-6">
      <Card title="👤 Informations Personnelles">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom complet"
              value={user?.name || ''}
              placeholder="Votre nom"
            />
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              placeholder="votre@email.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pays/Région
              </label>
              <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="HT">🇭🇹 Haïti</option>
                <option value="US">🇺🇸 États-Unis</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="FR">🇫🇷 France</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Langue
              </label>
              <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="fr">🇫🇷 Français</option>
                <option value="ht">🇭🇹 Kreyòl Ayisyen</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Sauvegarder les modifications</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const ExchangeTab = () => (
    <div className="space-y-6">
      <ExchangeWidget showConverter={true} showSettings={true} />
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <Card title="🔔 Préférences de Notifications">
        <div className="space-y-4">
          {[
            { id: 'push', label: 'Notifications push', description: 'Recevoir des notifications sur votre appareil' },
            { id: 'email', label: 'Notifications par email', description: 'Recevoir des résumés par email' },
            { id: 'budget', label: 'Alertes de budget', description: 'Être averti en cas de dépassement' },
            { id: 'income', label: 'Revenus automatiques', description: 'Notifications pour les paiements automatiques' },
            { id: 'goals', label: 'Objectifs d\'épargne', description: 'Rappels pour vos objectifs financiers' },
            { id: 'weekly', label: 'Résumé hebdomadaire', description: 'Rapport de vos finances chaque semaine' }
          ].map(notification => (
            <label key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{notification.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</div>
              </div>
              <input
                type="checkbox"
                defaultChecked={notification.id !== 'email'}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card title="📱 Canaux de Notification">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Horaires de notification
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                defaultValue="08:00"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="time"
                defaultValue="20:00"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Notifications silencieuses en dehors de ces heures
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fréquence des résumés
            </label>
            <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="daily">Quotidien</option>
              <option value="weekly" selected>Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="never">Jamais</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const AppearanceTab = () => (
    <div className="space-y-6">
      <Card title="🎨 Thème et Apparence">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Thème d'interface
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'light', icon: '☀️', label: 'Clair', description: 'Interface claire et lumineuse' },
                { value: 'dark', icon: '🌙', label: 'Sombre', description: 'Interface sombre pour les yeux' }
              ].map(themeOption => (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    theme === themeOption.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{themeOption.icon}</span>
                    <div>
                      <div className="font-medium">{themeOption.label}</div>
                      <div className="text-xs opacity-75">{themeOption.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Couleur d'accent
            </label>
            <div className="flex space-x-2">
              {['blue', 'green', 'purple', 'red', 'yellow', 'pink'].map(color => {
                const colorClasses = {
                  blue: 'bg-blue-500',
                  green: 'bg-green-500',
                  purple: 'bg-purple-500',
                  red: 'bg-red-500',
                  yellow: 'bg-yellow-500',
                  pink: 'bg-pink-500'
                };
                return (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${colorClasses[color]} ${
                      color === 'blue' ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Densité d'affichage
            </label>
            <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="compact">Compact</option>
              <option value="normal" selected>Normal</option>
              <option value="comfortable">Confortable</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <Card title="🔒 Sécurité du Compte">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-300">Compte sécurisé</p>
                <p className="text-sm text-green-700 dark:text-green-400">Toutes les mesures de sécurité sont activées</p>
              </div>
            </div>
            <Badge variant="success">Actif</Badge>
          </div>

          {[
            { 
              id: 'password', 
              label: 'Changer le mot de passe', 
              description: 'Modifiez votre mot de passe régulièrement',
              action: 'Modifier',
              status: 'ok'
            },
            { 
              id: 'session', 
              label: 'Expiration de session', 
              description: 'Actuellement: 30 minutes d\'inactivité',
              action: 'Configurer',
              status: 'ok'
            },
            { 
              id: '2fa', 
              label: 'Authentification à deux facteurs', 
              description: 'Protection supplémentaire par SMS',
              action: 'Activer',
              status: 'soon'
            },
            { 
              id: 'biometric', 
              label: 'Connexion biométrique', 
              description: 'Empreinte digitale ou Face ID',
              action: 'Configurer',
              status: 'soon'
            }
          ].map(security => (
            <div key={security.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">{security.label}</span>
                  {security.status === 'soon' && (
                    <Badge variant="warning" size="sm">Bientôt</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{security.description}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                disabled={security.status === 'soon'}
              >
                {security.action}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="📊 Sessions Actives">
        <div className="space-y-3">
          {[
            { device: 'Navigateur Web', location: 'Port-au-Prince, HT', current: true, lastActive: 'Maintenant' },
            { device: 'Application Mobile', location: 'Port-au-Prince, HT', current: false, lastActive: 'Il y a 2 jours' }
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">{session.device}</span>
                    {session.current && <Badge variant="success" size="sm">Actuelle</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">Révoquer</Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      <Card title="💾 Sauvegarde et Restauration">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Download className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Exporter mes données</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Téléchargez toutes vos données en format JSON
              </p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Importer des données</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Restaurez vos données depuis une sauvegarde
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">📁 Sauvegarde automatique</h4>
            <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
              Vos données sont automatiquement sauvegardées localement toutes les heures.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-400">
                Dernière sauvegarde: Il y a 23 minutes
              </span>
              <Button variant="outline" size="sm">Configurer</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="🗑️ Gestion des Données">
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Zone de Danger</h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-4">
              Ces actions sont irréversibles. Assurez-vous d'avoir une sauvegarde.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Réinitialiser toutes les préférences
              </Button>
              <Button variant="danger" className="w-full">
                Supprimer toutes les données
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'exchange': return <ExchangeTab />;
      case 'notifications': return <NotificationsTab />;
      case 'appearance': return <AppearanceTab />;
      case 'security': return <SecurityTab />;
      case 'data': return <DataTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gérez vos préférences et configurez votre application
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <span className="text-base">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;