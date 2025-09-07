import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Shield, Clock, Key, Save, AlertTriangle } from 'lucide-react';
import { Button } from '../ui';

const SecuritySettings = () => {
  const { 
    securitySettings, 
    updateSecuritySettings, 
    getSessionStats,
    user 
  } = useAuthStore();
  
  const [localSettings, setLocalSettings] = useState(securitySettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sessionStats = getSessionStats();

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(securitySettings));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSecuritySettings(localSettings);
      setHasChanges(false);
      
      // Notification de succès
      console.log('✅ Paramètres de sécurité sauvegardés');
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde paramètres:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const timeoutOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes (recommandé)' },
    { value: 60, label: '1 heure' },
    { value: 120, label: '2 heures' },
    { value: 480, label: '8 heures' },
    { value: -1, label: 'Jamais (déconseillé)' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* En-tête avec statistiques de session */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Paramètres de Sécurité
          </h2>
        </div>
        
        {sessionStats && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              📊 Session Actuelle
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300">Connecté depuis:</span>
                <p className="font-mono text-blue-900 dark:text-blue-100">
                  {Math.floor(sessionStats.sessionDuration / 60)} minutes
                </p>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">
                  {sessionStats.isUnlimited ? 'Session:' : 'Temps restant:'}
                </span>
                <p className="font-mono text-blue-900 dark:text-blue-100">
                  {sessionStats.isUnlimited 
                    ? 'Illimitée' 
                    : `${Math.floor(sessionStats.timeRemaining / 60)}m ${sessionStats.timeRemaining % 60}s`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paramètres de session */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Expiration de Session
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Déconnexion automatique après:
            </label>
            <select
              value={localSettings.session_timeout}
              onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {timeoutOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {localSettings.session_timeout === -1 ? (
                <div className="flex items-center space-x-1 text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Session illimitée moins sécurisée</span>
                </div>
              ) : (
                `🔒 Votre session expirera après ${localSettings.session_timeout} minutes d'inactivité`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Autres paramètres de sécurité */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Authentification
          </h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                🔐 Authentification à deux facteurs
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Sécurité renforcée avec code de vérification
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.two_factor_enabled}
              onChange={(e) => handleSettingChange('two_factor_enabled', e.target.checked)}
              disabled={true} // Fonctionnalité à venir
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                        focus:ring-blue-500 dark:bg-gray-600 opacity-50 cursor-not-allowed"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                📱 Connexion biométrique
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Empreinte digitale ou reconnaissance faciale
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.biometric_login}
              onChange={(e) => handleSettingChange('biometric_login', e.target.checked)}
              disabled={true} // Fonctionnalité à venir
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                        focus:ring-blue-500 dark:bg-gray-600 opacity-50 cursor-not-allowed"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                🔔 Notifications de connexion
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Être averti des nouvelles connexions
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.login_notifications}
              onChange={(e) => handleSettingChange('login_notifications', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                        focus:ring-blue-500 dark:bg-gray-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ☁️ Sauvegarde automatique
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Backup chiffré de vos données en base locale
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.auto_backup}
              onChange={(e) => handleSettingChange('auto_backup', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                        focus:ring-blue-500 dark:bg-gray-600"
            />
          </label>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Modifications non sauvegardées
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  setLocalSettings(securitySettings);
                  setHasChanges(false);
                }}
                variant="outline"
                size="sm"
                disabled={isSaving}
              >
                Annuler
              </Button>
              
              <Button
                onClick={handleSave}
                variant="primary"
                size="sm"
                loading={isSaving}
                disabled={isSaving}
                className="flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Informations sur le compte */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          📋 Informations du Compte
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Membre depuis:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
          <p><strong>Dernière connexion:</strong> {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;