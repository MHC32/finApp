// src/features/auth/pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import Loading from '../../../components/ui/Loading';
import FormInput from '../../../components/forms/FormInput';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../../../utils/constants';

/**
 * Page de réinitialisation de mot de passe
 * Valide le token et permet de définir un nouveau mot de passe
 * 
 * @example
 * <ResetPasswordPage />
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Récupère le token depuis l'URL
  const { isAuthenticated, isLoading: authLoading } = useSelector(state => state.auth);
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Vérifier la validité du token au chargement
  useEffect(() => {
    if (!token) {
      setTokenError('Token de réinitialisation manquant ou invalide');
    } else if (token.length < 10) {
      setTokenError('Format de token invalide');
    }
  }, [token]);

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

    if (field === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!passwordStrength.hasUpperCase || 
               !passwordStrength.hasLowerCase || 
               !passwordStrength.hasNumber || 
               !passwordStrength.hasSpecialChar) {
      errors.newPassword = 'Le mot de passe ne respecte pas les exigences de sécurité';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'La confirmation ne correspond pas au mot de passe';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const result = await resetPassword(
      token,
      formData.newPassword,
      formData.confirmPassword
    );
    
    if (result.success) {
      setIsSuccess(true);
      // Redirection automatique après 3 secondes
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    }

    setIsSubmitting(false);
  };

  // Afficher le loader pendant la vérification d'authentification
  if (authLoading) {
    return (
      <MainLayout showSidebar={false} showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loading type="spinner" size="lg" text="Vérification..." />
        </div>
      </MainLayout>
    );
  }

  // Redirection si déjà connecté
  if (isAuthenticated) {
    return null;
  }

  // Si token invalide
  if (tokenError) {
    return (
      <MainLayout showSidebar={false} showFooter={false}>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <Card variant="glass" className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Lien invalide
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {tokenError || 'Ce lien de réinitialisation est invalide ou a expiré.'}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                  variant="primary"
                  fullWidth
                >
                  Demander un nouveau lien
                </Button>
                
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  variant="outline"
                  fullWidth
                >
                  Retour à la connexion
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si réinitialisation réussie
  if (isSuccess) {
    return (
      <MainLayout showSidebar={false} showFooter={false}>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <Card variant="glass" className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Mot de passe réinitialisé !
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
              </p>

              <Loading type="dots" text="Redirection..." />
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Indicateur de force du mot de passe
  const passwordRequirements = [
    { key: 'hasMinLength', label: '8 caractères minimum' },
    { key: 'hasUpperCase', label: '1 majuscule' },
    { key: 'hasLowerCase', label: '1 minuscule' },
    { key: 'hasNumber', label: '1 chiffre' },
    { key: 'hasSpecialChar', label: '1 caractère spécial' }
  ];

  return (
    <MainLayout 
      showSidebar={false} 
      showFooter={false}
      showBreadcrumbs={false}
    >
      <title>Réinitialiser le mot de passe - FinApp Haiti</title>
      <meta 
        name="description" 
        content="Réinitialisez votre mot de passe FinApp Haiti" 
      />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Logo et en-tête */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouveau mot de passe
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {/* Carte du formulaire */}
          <Card 
            variant="glass"
            className="p-8"
            hoverable={false}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nouveau mot de passe */}
              <FormInput
                label="Nouveau mot de passe"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                placeholder="Créez un mot de passe sécurisé"
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                error={validationErrors.newPassword}
                required
                autoComplete="new-password"
                autoFocus
              />

              {/* Indicateur force mot de passe */}
              {formData.newPassword && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exigences de sécurité:
                  </p>
                  <div className="space-y-1">
                    {passwordRequirements.map(req => (
                      <div key={req.key} className="flex items-center gap-2 text-xs">
                        {passwordStrength[req.key] ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
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

              {/* Bouton de réinitialisation */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="mt-6"
              >
                {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          </Card>

          {/* Lien vers connexion */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Link 
                to={ROUTES.LOGIN}
                className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
              >
                ← Retour à la connexion
              </Link>
            </p>
          </div>

          {/* Informations de sécurité */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              🔒 <strong>Sécurité :</strong> Votre nouveau mot de passe sera chiffré et protégé. 
              Nous recommandons d'utiliser un mot de passe unique que vous n'utilisez nulle part ailleurs.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPasswordPage;