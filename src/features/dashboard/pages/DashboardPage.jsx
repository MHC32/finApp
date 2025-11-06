// src/features/dashboard/pages/DashboardPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../../store/slices/authSlice';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import TokenExpiryModal from '../../../components/TokenExpiryModal';
import { useTokenExpiry } from '../../../hooks/useTokenExpiry';
import { LogOut, TrendingUp, Wallet, PieChart, Users } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Initialiser la surveillance du token
  useTokenExpiry();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Tableau de bord', href: '/dashboard' }
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bonjour, {user?.firstName} ! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bienvenue sur votre tableau de bord financier
          </p>
        </div>
        <Button
          variant="outline-danger"
          onClick={handleLogout}
          leftIcon={LogOut}
        >
          Déconnexion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center hoverable">
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              25,400 HTG
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Solde total
            </p>
          </div>
        </Card>

        <Card className="text-center hoverable">
          <div className="p-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              15,200 HTG
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Revenus ce mois
            </p>
          </div>
        </Card>

        <Card className="text-center hoverable">
          <div className="p-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <PieChart className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              8,500 HTG
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dépenses ce mois
            </p>
          </div>
        </Card>

        <Card className="text-center hoverable">
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              2 Sols
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tontines actives
            </p>
          </div>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="glass-card">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Félicitations !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Votre compte FinApp Haiti est maintenant actif. Commencez à gérer vos finances 
            en créant vos premiers comptes, transactions et budgets.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button>Ajouter un compte</Button>
            <Button variant="outline">Voir le tutoriel</Button>
          </div>
        </div>
      </Card>

      {/* Modal d'expiration de session */}
      <TokenExpiryModal />
    </MainLayout>
  );
};

export default DashboardPage;