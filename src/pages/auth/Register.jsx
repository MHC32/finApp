// src/pages/auth/Register.jsx - VERSION MIGRÉE AVEC NOUVEAUX SERVICES
import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    isLoading,
    error,
    clearError,
    validateRegistration
  } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validation spéciale pour confirmation de mot de passe
    if (field === 'password' && touched.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let fieldError = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          fieldError = 'Nom requis';
        } else if (value.trim().length < 2) {
          fieldError = 'Nom trop court (minimum 2 caractères)';
        } else if (value.trim().length > 100) {
          fieldError = 'Nom trop long (maximum 100 caractères)';
        }
        break;

      case 'email':
        if (!value) {
          fieldError = 'Email requis';
        } else {
          // Utiliser la validation centralisée
          const tempUserData = { email: value, name: 'temp', created_at: new Date(), updated_at: new Date() };
          const validation = validateRegistration(tempUserData);
          if (!validation.isValid) {
            const emailErrors = validation.errors.filter(err => err.toLowerCase().includes('email'));
            if (emailErrors.length > 0) {
              fieldError = emailErrors[0];
            }
          }
        }
        break;

      case 'password':
        if (!value) {
          fieldError = 'Mot de passe requis';
        } else if (value.length < 6) {
          fieldError = 'Minimum 6 caractères';
        } else if (value.length > 128) {
          fieldError = 'Mot de passe trop long (maximum 128 caractères)';
        } else if (!/(?=.*[a-z])/.test(value)) {
          fieldError = 'Au moins une lettre minuscule requise';
        } else if (!/(?=.*\d)/.test(value)) {
          fieldError = 'Au moins un chiffre requis';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          fieldError = 'Confirmation requise';
        } else if (value !== formData.password) {
          fieldError = 'Mots de passe différents';
        }
        break;

      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));

    return !fieldError;
  };

  const validateForm = () => {
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    let isValid = true;

    // Valider tous les champs
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    // Marquer tous les champs comme touchés
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validation additionnelle avec ValidationService
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email,
        created_at: new Date(),
        updated_at: new Date()
      };

      const validation = validateRegistration(userData);
      if (!validation.isValid && isValid) {
        // Si la validation locale passe mais pas la validation centralisée
        validation.errors.forEach(error => {
          if (error.includes('nom') || error.includes('name')) {
            setFieldErrors(prev => ({ ...prev, name: error }));
          } else if (error.includes('email')) {
            setFieldErrors(prev => ({ ...prev, email: error }));
          }
        });
        isValid = false;
      }
    } catch (error) {
      console.warn('Erreur validation centralisée:', error);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim()
        // Note: en production, inclure le hash du mot de passe
      };

      const user = await register(userData);
      
      // Redirection automatique vers setup après inscription
      navigate('/setup', { 
        replace: true,
        state: { 
          message: `Bienvenue ${user.name} ! Configurons votre application.`,
          newUser: true
        }
      });
      
    } catch (error) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur inscription:', error);
    }
  };

  const getFieldError = (field) => {
    return touched[field] ? fieldErrors[field] : '';
  };

  const hasFieldError = (field) => {
    return touched[field] && !!fieldErrors[field];
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let score = 0;
    let feedback = [];

    // Critères de force
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/(?=.*[a-z])/.test(password)) score += 1;
    if (/(?=.*[A-Z])/.test(password)) score += 1;
    if (/(?=.*\d)/.test(password)) score += 1;
    if (/(?=.*[!@#$%^&*])/.test(password)) score += 1;

    // Évaluation
    if (score < 3) {
      return { strength: score, label: 'Faible', color: 'text-red-600' };
    } else if (score < 5) {
      return { strength: score, label: 'Moyen', color: 'text-yellow-600' };
    } else {
      return { strength: score, label: 'Fort', color: 'text-green-600' };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Commencez à gérer vos finances aujourd'hui
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
          {/* Champ Nom */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Votre nom"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${hasFieldError('name') 
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
              />
            </div>
            {getFieldError('name') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError('name')}
              </p>
            )}
          </div>

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

            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength < 3 ? 'bg-red-500' :
                        passwordStrength.strength < 5 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Recommandations : 10+ caractères, majuscules, chiffres, symboles
                </div>
              </div>
            )}

            {getFieldError('password') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError('password')}
              </p>
            )}
          </div>

          {/* Champ Confirmation mot de passe */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="••••••••"
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${hasFieldError('confirmPassword') 
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {getFieldError('confirmPassword') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError('confirmPassword')}
              </p>
            )}
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Création...</span>
              </>
            ) : (
              <>
                <span>Créer mon compte</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Lien vers connexion */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Déjà un compte ?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Se connecter
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
                  formData: { ...formData, password: '***', confirmPassword: '***' },
                  fieldErrors,
                  touched,
                  passwordStrength,
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

export default Register;