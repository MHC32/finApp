// src/features/auth/components/ForgotPasswordForm.jsx
import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FormInput from '../../../components/forms/FormInput';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';

/**
 * Composant ForgotPasswordForm - Demande de réinitialisation
 * Aligné avec le backend (forgotPassword controller)
 * 
 * @example
 * <ForgotPasswordForm onSuccess={() => showSuccessMessage()} />
 */
const ForgotPasswordForm = ({ 
  onSuccess = () => {},
  onBackToLogin = () => {},
  className = ''
}) => {
  const { forgotPassword, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Gérer les changements de formulaire
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await forgotPassword(formData.email);
    
    if (result.success) {
      setIsSubmitted(true);
      onSuccess();
    }
  };

  // Si le formulaire a été soumis avec succès
  if (isSubmitted) {
    return (
      <div className={`text-center space-y-6 ${className}`}>
        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Email envoyé !
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Si cet email existe dans notre système, vous recevrez un lien de réinitialisation sous peu.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onBackToLogin}
            variant="outline"
            fullWidth
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Vous n'avez pas reçu l'email ? Vérifiez vos spams ou réessayez.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      {/* Alert d'erreur globale */}
      {error && (
        <Alert
          type="error"
          title="Erreur"
          description={error}
          dismissible
          onClose={() => setValidationErrors({})}
        />
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          autoFocus
          helperText="Nous enverrons un lien de réinitialisation à cette adresse"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </Button>
      </form>

      {/* Informations supplémentaires */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Conseil de sécurité :</strong> Le lien de réinitialisation expirera dans 1 heure pour votre sécurité.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;