// src/pages/auth/Setup.jsx
import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { completeSetup } = useAuthStore();
  const navigate = useNavigate();

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    
    // Simulation d'une configuration
    setTimeout(() => {
      completeSetup();
      setIsLoading(false);
      navigate('/', { replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration Initiale</h1>
          <p className="text-gray-600">Finalisons la configuration de votre compte FinApp Haiti</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Compte créé avec succès</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Base de données initialisée</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800">Interface prête à utiliser</span>
          </div>
        </div>

        <button
          onClick={handleCompleteSetup}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Configuration...</span>
            </>
          ) : (
            <>
              <span>Commencer à utiliser FinApp</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Setup;