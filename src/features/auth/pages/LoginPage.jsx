// src/features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import Loading from '../../../components/ui/Loading';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { ROUTES } from '../../../utils/constants';

/**
 * Page de connexion/inscription/réinitialisation
 * Gère les trois états dans une seule page pour une UX fluide
 * Redirection automatique si déjà connecté
 * 
 * @example
 * <LoginPage />
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  
  const [activeForm, setActiveForm] = useState('login'); // 'login' | 'register' | 'forgot-password'

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Gérer la redirection après succès
  const handleAuthSuccess = () => {
    const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
    navigate(from, { replace: true });
  };

  // Changer de formulaire
  const handleSwitchToRegister = () => setActiveForm('register');
  const handleSwitchToLogin = () => setActiveForm('login');
  const handleSwitchToForgotPassword = () => setActiveForm('forgot-password');

  // Afficher le loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <MainLayout showSidebar={false} showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loading type="spinner" size="lg" text="Vérification..." />
        </div>
      </MainLayout>
    );
  }

  // Redirection si déjà connecté (safety check)
  if (isAuthenticated) {
    return null;
  }

  // Titres et descriptions selon le formulaire actif
  const getPageConfig = () => {
    switch (activeForm) {
      case 'register':
        return {
          title: 'Créer un compte - FinApp Haiti',
          description: 'Rejoignez FinApp Haiti pour gérer vos finances en toute simplicité'
        };
      case 'forgot-password':
        return {
          title: 'Mot de passe oublié - FinApp Haiti',
          description: 'Réinitialisez votre mot de passe FinApp Haiti'
        };
      default:
        return {
          title: 'Connexion - FinApp Haiti',
          description: 'Connectez-vous à votre compte FinApp Haiti'
        };
    }
  };

  const { title, description } = getPageConfig();

  return (
    <MainLayout 
      showSidebar={false} 
      showFooter={false}
      showBreadcrumbs={false}
    >
      {/* Metadata pour SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Logo et en-tête */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              FinApp Haiti
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              🇭🇹 Gestion financière pour tous
            </p>
          </div>

          {/* Carte du formulaire */}
          <Card 
            variant="glass"
            className="p-8"
            hoverable={false}
          >
            {/* Login Form */}
            {activeForm === 'login' && (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={handleSwitchToRegister}
                onSwitchToForgotPassword={handleSwitchToForgotPassword}
              />
            )}

            {/* Register Form */}
            {activeForm === 'register' && (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            )}

            {/* Forgot Password Form */}
            {activeForm === 'forgot-password' && (
              <ForgotPasswordForm
                onSuccess={() => {
                  // Revenir au login après envoi réussi
                  setActiveForm('login');
                }}
                onBackToLogin={handleSwitchToLogin}
              />
            )}
          </Card>

          {/* Informations supplémentaires */}
          <div className="text-center space-y-4">
            {/* Sécurité */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                🔒 <strong>Sécurité garantie :</strong> Vos données sont chiffrées et protégées
              </p>
            </div>

            {/* Support */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Besoin d'aide ?{' '}
                <a 
                  href="mailto:support@finapp.ht" 
                  className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
                >
                  Contactez le support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;