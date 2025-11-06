// src/features/auth/components/LoginForm.jsx
import { useState } from 'react';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FormInput from '../../../components/forms/FormInput';
import FormCheckbox from '../../../components/forms/FormCheckbox';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';

/**
 * Composant LoginForm - Formulaire de connexion
 * Support email ET téléphone comme identifiant
 * Aligné avec le backend authController.js
 * 
 * @example
 * <LoginForm onSuccess={() => navigate('/dashboard')} />
 */
const LoginForm = ({ 
  onSuccess = () => {},
  onSwitchToRegister = () => {},
  onSwitchToForgotPassword = () => {},
  className = ''
}) => {
  const { login, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Déterminer si l'identifiant est un email ou téléphone
  const isEmail = formData.identifier.includes('@');
  const leftIcon = isEmail ? Mail : Phone;
  const placeholder = isEmail ? 'votre@email.com' : '+509XXXXXXXX';

  // Gérer les changements de formulaire
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.identifier.trim()) {
      errors.identifier = 'Email ou téléphone requis';
    } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) {
      errors.identifier = 'Format d\'email invalide';
    } else if (!isEmail && !/^(\+509)?[2-4]\d{7}$/.test(formData.identifier)) {
      errors.identifier = 'Format téléphone haïtien invalide';
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData);
    
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Connexion
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Accédez à votre compte FinApp Haiti 🇭🇹
        </p>
      </div>

      {/* Alert d'erreur globale */}
      {error && (
        <Alert
          type="error"
          title="Erreur de connexion"
          description={error}
          dismissible
          onClose={() => setValidationErrors({})}
        />
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifiant (Email ou Téléphone) */}
        <FormInput
          label="Email ou Téléphone"
          name="identifier"
          type="text"
          value={formData.identifier}
          onChange={(e) => handleChange('identifier', e.target.value)}
          placeholder={placeholder}
          leftIcon={leftIcon}
          error={validationErrors.identifier}
          required
          autoComplete="email"
          autoFocus
        />

        {/* Mot de passe */}
        <FormInput
          label="Mot de passe"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Votre mot de passe"
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          error={validationErrors.password}
          required
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <FormCheckbox
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={(checked) => handleChange('rememberMe', checked)}
            label="Se souvenir de moi"
          />
          
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Bouton de connexion */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      {/* Lien vers inscription */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pas encore de compte ?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
          >
            Créer un compte
          </button>
        </p>
      </div>

      {/* Informations de test (à retirer en production) */}
      {process.env.NODE_ENV === 'development' && (
        <Alert
          type="info"
          title="Mode développement"
          description="Utilisez email: demo@finapp.ht / téléphone: +50932123456 / password: Demo123!"
          variant="subtle"
          size="sm"
        />
      )}
    </div>
  );
};

export default LoginForm;