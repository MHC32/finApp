// src/pages/auth/Login.jsx - VERSION MIGRÉE AVEC NOUVEAUX SERVICES
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const {
    login,
    isLoading,
    error,
    clearError,
    validateCredentials
  } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Nettoyer l'erreur générale si l'utilisateur modifie les champs
    if (error) {
      clearError();
    }

    // Validation en temps réel pour les champs touchés
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    const tempData = { ...formData, [field]: value };
    const validation = validateCredentials(tempData);
    
    // Extraire l'erreur spécifique au champ
    let fieldError = '';
    if (field === 'email' && !value) {
      fieldError = 'Email requis';
    } else if (field === 'email' && value && !validateCredentials({ email: value }).isValid) {
      fieldError = 'Format email invalide';
    } else if (field === 'password' && !value && process.env.NODE_ENV !== 'development') {
      fieldError = 'Mot de passe requis';
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));

    return !fieldError;
  };

  const validateForm = () => {
    const validation = validateCredentials(formData);
    
    if (!validation.isValid) {
      const newFieldErrors = {};
      
      // Mapper les erreurs aux champs
      validation.errors.forEach(error => {
        if (error.includes('Email')) {
          newFieldErrors.email = error;
        } else if (error.includes('mot de passe') || error.includes('password')) {
          newFieldErrors.password = error;
        }
      });
      
      setFieldErrors(newFieldErrors);
      
      // Marquer tous les champs comme touchés
      setTouched({ email: true, password: true });
    }
    
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const user = await login(formData);
      
      // Redirection selon l'état de l'utilisateur
      if (user.setup_completed) {
        navigate('/', { replace: true });
      } else {
        navigate('/setup', { replace: true });
      }
      
    } catch (error) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur connexion:', error);
    }
  };

  const getFieldError = (field) => {
    return touched[field] ? fieldErrors[field] : '';
  };

  const hasFieldError = (field) => {
    return touched[field] && !!fieldErrors[field];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenue !
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connectez-vous à votre compte FinApp Haiti
          </p>
        </div>

        {/* Erreur générale */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="inline-flex text-red-400 hover:text-red-500 focus:outline-none"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="votre@email.com"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${hasFieldError('email') 
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
              />
            </div>
            {getFieldError('email') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="••••••••"
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${hasFieldError('password') 
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {getFieldError('password') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError('password')}
              </p>
            )}
          </div>

          {/* Information de développement */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Mode développement :</strong> Le mot de passe est optionnel. 
                Entrez simplement votre email pour vous connecter.
              </p>
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Lien vers inscription */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Pas encore de compte ?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Debug info en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
            <details>
              <summary className="cursor-pointer text-gray-600 dark:text-gray-400">
                Debug Info
              </summary>
              <pre className="mt-2 text-gray-800 dark:text-gray-200 overflow-auto">
                {JSON.stringify({
                  formData,
                  fieldErrors,
                  touched,
                  isLoading,
                  hasError: !!error
                }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;