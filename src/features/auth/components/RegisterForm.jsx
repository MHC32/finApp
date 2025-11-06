// src/features/auth/components/RegisterForm.jsx
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  User, 
  MapPin,
  Eye, 
  EyeOff,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormCheckbox from '../../../components/forms/FormCheckbox';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { HAITI_REGIONS } from '../../../utils/constants';

/**
 * Composant RegisterForm - Formulaire d'inscription
 * Validation complète alignée avec backend express-validator
 * Champs spécifiques au contexte haïtien
 * 
 * @example
 * <RegisterForm onSuccess={() => navigate('/dashboard')} />
 */
const RegisterForm = ({ 
  onSuccess = () => {},
  onSwitchToLogin = () => {},
  className = ''
}) => {
  const { register, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    region: '',
    city: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Options des régions haïtiennes pour le select
  const regionOptions = Object.values(HAITI_REGIONS).map(region => ({
    value: region.code,
    label: `${region.name} (${region.capital})`
  }));

  // Villes par région (simplifié)
  const getCityOptions = () => {
    const region = HAITI_REGIONS[formData.region];
    if (!region) return [];
    
    // En production, on pourrait avoir une liste complète des villes
    const mainCities = [region.capital, 'Autre ville'];
    return mainCities.map(city => ({
      value: city,
      label: city
    }));
  };

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

    // Vérifier la force du mot de passe
    if (field === 'password') {
      checkPasswordStrength(value);
    }
  };

  // Vérifier la force du mot de passe
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    // Prénom
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s-']+$/.test(formData.firstName)) {
      errors.firstName = 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes';
    }

    // Nom
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom de famille est requis';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Le nom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s-']+$/.test(formData.lastName)) {
      errors.lastName = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    // Téléphone (optionnel mais validé si fourni)
    if (formData.phone && !/^(\+509)?[0-9]{8}$/.test(formData.phone)) {
      errors.phone = 'Format de téléphone haïtien invalide (ex: +50932123456)';
    }

    // Mot de passe
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!passwordStrength.hasUpperCase || 
               !passwordStrength.hasLowerCase || 
               !passwordStrength.hasNumber || 
               !passwordStrength.hasSpecialChar) {
      errors.password = 'Le mot de passe ne respecte pas les exigences de sécurité';
    }

    // Confirmation mot de passe
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'La confirmation ne correspond pas au mot de passe';
    }

    // Région
    if (!formData.region) {
      errors.region = 'La région est requise';
    }

    // Ville
    if (!formData.city.trim()) {
      errors.city = 'La ville est requise';
    }

    // Conditions d'utilisation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(formData);
    
    if (result.success) {
      onSuccess();
    }
  };

  // Indicateur de force du mot de passe
  const passwordRequirements = [
    { key: 'hasMinLength', label: '8 caractères minimum' },
    { key: 'hasUpperCase', label: '1 majuscule' },
    { key: 'hasLowerCase', label: '1 minuscule' },
    { key: 'hasNumber', label: '1 chiffre' },
    { key: 'hasSpecialChar', label: '1 caractère spécial' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Créer un compte
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Rejoignez FinApp Haiti pour gérer vos finances 🇭🇹
        </p>
      </div>

      {/* Alert d'erreur globale */}
      {error && (
        <Alert
          type="error"
          title="Erreur d'inscription"
          description={error}
          dismissible
          onClose={() => setValidationErrors({})}
        />
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prénom et Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Prénom"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Votre prénom"
            leftIcon={User}
            error={validationErrors.firstName}
            required
            autoComplete="given-name"
          />

          <FormInput
            label="Nom de famille"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Votre nom"
            error={validationErrors.lastName}
            required
            autoComplete="family-name"
          />
        </div>

        {/* Email et Téléphone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="votre@email.com"
            leftIcon={Mail}
            error={validationErrors.email}
            required
            autoComplete="email"
          />

          <FormInput
            label="Téléphone (optionnel)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+509XXXXXXXX"
            leftIcon={Phone}
            error={validationErrors.phone}
            optional
            autoComplete="tel"
            helperText="Format haïtien: +509XXXXXXXX"
          />
        </div>

        {/* Région et Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Région"
            name="region"
            options={regionOptions}
            value={formData.region}
            onChange={(value) => handleChange('region', value)}
            placeholder="Sélectionnez votre région"
            leftIcon={MapPin}
            error={validationErrors.region}
            required
          />

          <FormSelect
            label="Ville"
            name="city"
            options={getCityOptions()}
            value={formData.city}
            onChange={(value) => handleChange('city', value)}
            placeholder="Sélectionnez votre ville"
            error={validationErrors.city}
            required
            disabled={!formData.region}
          />
        </div>

        {/* Mot de passe */}
        <FormInput
          label="Mot de passe"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Créez un mot de passe sécurisé"
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          error={validationErrors.password}
          required
          autoComplete="new-password"
        />

        {/* Indicateur force mot de passe */}
        {formData.password && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Exigences de sécurité:
            </p>
            <div className="space-y-1">
              {passwordRequirements.map(req => (
                <div key={req.key} className="flex items-center gap-2 text-xs">
                  {passwordStrength[req.key] ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-red-500" />
                  )}
                  <span className={
                    passwordStrength[req.key] 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation mot de passe */}
        <FormInput
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder="Retapez votre mot de passe"
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          error={validationErrors.confirmPassword}
          required
          autoComplete="new-password"
        />

        {/* Conditions d'utilisation */}
        <FormCheckbox
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={(checked) => handleChange('agreeToTerms', checked)}
          label={
            <span>
              J'accepte les{' '}
              <a href="/terms" className="text-teal-600 dark:text-teal-400 hover:underline">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">
                politique de confidentialité
              </a>
            </span>
          }
          error={validationErrors.agreeToTerms}
          required
        />

        {/* Bouton d'inscription */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? 'Création du compte...' : 'Créer mon compte'}
        </Button>
      </form>

      {/* Lien vers connexion */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;