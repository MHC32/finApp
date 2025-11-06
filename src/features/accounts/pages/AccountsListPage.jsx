// src/features/accounts/pages/AccountsListPage.jsx
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  PieChart,
  TrendingUp,
  Wallet,
  Building,
  CreditCard
} from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import AccountCard from '../components/AccountCard';
import AccountFilters from '../components/AccountFilters';
import CreateAccountModal from '../components/CreateAccountModal';
import EditAccountModal from '../components/EditAccountModal';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Loading from '../../../components/ui/Loading';
import Alert from '../../../components/ui/Alert';
import ProgressBar from '../../../components/ui/ProgressBar';
import EmptyState from '../../../components/common/EmptyState';

/**
 * Page principale de liste des comptes bancaires
 * Avec dashboard, filtres, et actions globales
 */
const AccountsListPage = () => {
  const { 
    accounts, 
    getAccounts, 
    getTotalBalances, 
    filterAccounts,
    isLoading,
    accountsLoaded 
  } = useAccount();

  const [filters, setFilters] = useState({});
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  // Charger les comptes au montage
  useEffect(() => {
    if (!accountsLoaded) {
      getAccounts();
    }
  }, [accountsLoaded, getAccounts]);

  // Appliquer les filtres
  useEffect(() => {
    if (accounts.length > 0) {
      const filtered = filterAccounts(filters);
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [accounts, filters, filterAccounts]);

  // Gestion des modals
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    getAccounts(); // Recharger la liste
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
    getAccounts(); // Recharger la liste
  };

  const handleViewDetails = (account) => {
    // Navigation vers la page détails (à implémenter avec React Router)
    console.log('Voir détails:', account);
    // history.push(`/accounts/${account._id}`);
  };

  // Calcul des métriques
  const totalBalances = getTotalBalances();
  const activeAccounts = accounts.filter(acc => acc.isActive && !acc.isArchived).length;
  const archivedAccounts = accounts.filter(acc => acc.isArchived).length;
  const totalAccounts = accounts.length;

  // Statistiques par type de compte
  const accountTypeStats = accounts.reduce((stats, account) => {
    if (!stats[account.type]) {
      stats[account.type] = { count: 0, total: 0 };
    }
    stats[account.type].count += 1;
    stats[account.type].total += account.currentBalance;
    return stats;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de page */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Comptes Bancaires
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gérez tous vos comptes bancaires en un seul endroit
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              {/* Toggle vue */}
              <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded ${
                    view === 'grid' 
                      ? 'bg-teal-500 text-white' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded ${
                    view === 'list' 
                      ? 'bg-teal-500 text-white' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  List
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={Download}
              >
                Exporter
              </Button>
              
              <Button
                leftIcon={Plus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Nouveau Compte
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total des comptes */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Comptes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalAccounts}
                  </p>
                </div>
                <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Badge color="green" size="sm">
                  {activeAccounts} actifs
                </Badge>
                {archivedAccounts > 0 && (
                  <Badge color="gray" size="sm">
                    {archivedAccounts} archivés
                  </Badge>
                )}
              </div>
            </Card>

            {/* Solde total HTG */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total HTG
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'HTG'
                    }).format(totalBalances.HTG || 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            {/* Solde total USD */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total USD
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(totalBalances.USD || 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <PieChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            {/* Compte par défaut */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Compte Défaut
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {accounts.find(acc => acc.isDefault)?.name || 'Aucun'}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filtres */}
        <AccountFilters 
          onFiltersChange={setFilters}
          className="mb-6"
        />

        {/* Contenu principal */}
        {isLoading && !accountsLoaded ? (
          <Loading.SkeletonCard count={3} />
        ) : filteredAccounts.length === 0 ? (
          <EmptyState
            icon={Building}
            title={accounts.length === 0 ? "Aucun compte bancaire" : "Aucun résultat"}
            description={
              accounts.length === 0 
                ? "Commencez par créer votre premier compte bancaire"
                : "Aucun compte ne correspond à vos critères de recherche"
            }
            action={
              accounts.length === 0 && (
                <Button
                  leftIcon={Plus}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Créer un compte
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* En-tête résultats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredAccounts.length} compte(s) trouvé(s)
                </h3>
                {Object.keys(filters).some(key => filters[key]) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Filtres appliqués
                  </p>
                )}
              </div>

              {/* Actions groupées */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" leftIcon={Upload}>
                  Importer
                </Button>
              </div>
            </div>

            {/* Grille/Liste des comptes */}
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account._id}
                    account={account}
                    onEdit={handleEditAccount}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account._id}
                    account={account}
                    onEdit={handleEditAccount}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {/* Statistiques détaillées */}
            {accounts.length > 0 && (
              <Card variant="glass" className="mt-8 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Répartition par type
                </h3>
                <div className="space-y-4">
                  {Object.entries(accountTypeStats).map(([type, stats]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {type}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {stats.count} compte(s) •{' '}
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'HTG'
                          }).format(stats.total)}
                        </span>
                      </div>
                      <ProgressBar
                        value={(stats.count / totalAccounts) * 100}
                        max={100}
                        size="sm"
                        color="teal"
                        showValue={false}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Modals */}
        <CreateAccountModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        <EditAccountModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAccount(null);
          }}
          account={selectedAccount}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
};

export default AccountsListPage;