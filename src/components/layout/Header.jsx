import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, Clock, Shield, Settings } from 'lucide-react';

const Header = () => {
  const { 
    user, 
    logout, 
    getSessionTimeRemaining, 
    getSessionStats,
    securitySettings
  } = useAuthStore();
  
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mettre à jour les informations de session en temps réel
  useEffect(() => {
    if (securitySettings.session_timeout === -1) return; // Session illimitée

    const updateSessionInfo = () => {
      const remaining = getSessionTimeRemaining();
      const stats = getSessionStats();
      
      setTimeRemaining(remaining);
      setSessionStats(stats);
    };

    // Mise à jour initiale
    updateSessionInfo();

    // Mise à jour chaque seconde
    const interval = setInterval(updateSessionInfo, 1000);

    return () => clearInterval(interval);
  }, [getSessionTimeRemaining, getSessionStats, securitySettings.session_timeout]);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  const formatTime = (seconds) => {
    if (seconds <= 0 || securitySettings.session_timeout === -1) return null;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getSessionColor = () => {
    if (!timeRemaining || securitySettings.session_timeout === -1) return 'text-green-600';
    
    if (timeRemaining < 300) return 'text-red-600'; // Moins de 5 minutes
    if (timeRemaining < 900) return 'text-yellow-600'; // Moins de 15 minutes
    return 'text-green-600';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            FinApp Haiti
          </h1>
          
          {/* Indicateur de session depuis Zustand */}
          {securitySettings.session_timeout !== -1 && timeRemaining !== null && (
            <div className={`flex items-center space-x-1 text-xs px-3 py-1 rounded-full border ${getSessionColor()} bg-opacity-10 border-current`}>
              <Clock className="w-3 h-3" />
              <span className="font-medium">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Menu utilisateur avec données Zustand */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium hidden md:block">
                {user?.name || 'Utilisateur'}
              </span>
            </button>

            {/* Menu déroulant */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-2">
                  
                  {/* Informations utilisateur */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  
                  {/* Statistiques de session */}
                  {sessionStats && (
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Session</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Connecté depuis:</span>
                          <span className="font-mono">
                            {Math.floor(sessionStats.sessionDuration / 60)}m
                          </span>
                        </div>
                        {sessionStats.timeRemaining > 0 && (
                          <div className="flex justify-between">
                            <span>Temps restant:</span>
                            <span className="font-mono">
                              {formatTime(sessionStats.timeRemaining)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions du menu */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigation vers profil/paramètres
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span>Mon Profil</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigation vers paramètres de sécurité
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Sécurité</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigation vers paramètres généraux
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </button>
                    
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;