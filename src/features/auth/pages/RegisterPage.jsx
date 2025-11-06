// src/features/auth/pages/RegisterPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import Loading from '../../../components/ui/Loading';
import RegisterForm from '../components/RegisterForm';
import { ROUTES } from '../../../utils/constants';

/**
 * Page d'inscription dédiée
 * Alternative à la page login qui gère plusieurs formulaires
 * 
 * @example
 * <RegisterPage />
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

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

  // Retour à la connexion
  const handleSwitchToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

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

  // Redirection si déjà connecté
  if (isAuthenticated) {
    return null;
  }

  return (
    <MainLayout 
      showSidebar={false} 
      showFooter={false}
      showBreadcrumbs={false}
    >
      {/* Metadata pour SEO */}
      <title>Créer un compte - FinApp Haiti</title>
      <meta 
        name="description" 
        content="Rejoignez FinApp Haiti pour gérer vos finances en toute simplicité. Inscription gratuite et sécurisée." 
      />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Section présentation */}
            <div className="space-y-6">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Rejoignez FinApp Haiti
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  La solution de gestion financière conçue pour les Haïtiens 🇭🇹
                </p>
              </div>

              {/* Liste des avantages */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Suivi des comptes en HTG et USD
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Gestion des Sols (Tontines)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Budgets personnalisés
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Support dédié Haïtien
                  </span>
                </div>
              </div>

              {/* Témoignage (optionnel) */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                <p className="text-sm text-teal-800 dark:text-teal-200 italic">
                  "FinApp m'aide à mieux gérer mes finances et mes sols. Simple et adapté à notre réalité haïtienne !"
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-2">
                  - Marie J., Port-au-Prince
                </p>
              </div>
            </div>

            {/* Formulaire d'inscription */}
            <div>
              <Card 
                variant="glass"
                className="p-8"
                hoverable={false}
              >
                <RegisterForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToLogin={handleSwitchToLogin}
                />
              </Card>

              {/* Informations légales */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  En créant un compte, vous acceptez nos{' '}
                  <a href="/terms" className="text-teal-600 dark:text-teal-400 hover:underline">
                    Conditions d'utilisation
                  </a>{' '}
                  et notre{' '}
                  <a href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">
                    Politique de confidentialité
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;