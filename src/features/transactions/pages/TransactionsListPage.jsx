// src/features/transactions/pages/TransactionsListPage.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp,
  Download,
  Upload,
  Filter
} from 'lucide-react';
import { useTransaction } from '../hooks/useTransactions';
import { useAccount } from '../../accounts/hooks/useAccount';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import Pagination from '../../../components/ui/Pagination';
import TransactionFilters from '../components/TransactionFilters';
import TransactionCard from '../components/TransactionCard';
import CreateTransactionModal from '../components/CreateTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import TransactionDetails from '../components/TransactionDetails';
import QuickTransactionTemplates from '../components/QuickTransactionTemplates';
import { formatCurrency } from '../../../utils/format';

/**
 * Page principale de liste des transactions
 * Affiche toutes les transactions avec filtres, recherche, pagination
 */
const TransactionsListPage = () => {
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  
  // Hooks de données
  const {
    transactions,
    pagination,
    stats,
    isLoading,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    duplicateTransaction,
    filters,
    updateFilters
  } = useTransaction();

  const { accounts, getAccounts, isLoading: accountsLoading } = useAccount();

  // États locaux pour les modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [filters]);

  useEffect(() => {
    if (accounts.length === 0) {
      getAccounts();
    }
  }, []);

  const loadData = async () => {
    await getTransactions(filters);
  };

  // Handlers
  const handleCreateSuccess = (newTransaction) => {
    setIsCreateModalOpen(false);
    loadData();
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedTransaction) => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
    loadData();
  };

  const handleDeleteClick = async (transaction) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      const result = await deleteTransaction(transaction._id);
      if (result.success) {
        loadData();
      }
    }
  };

  const handleDuplicateClick = async (transaction) => {
    const result = await duplicateTransaction(transaction._id);
    if (result.success) {
      loadData();
    }
  };

  const handleDetailsClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleTemplateSelect = (transactionData) => {
    loadData();
  };

  const handleFiltersChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    updateFilters({ ...filters, page: newPage });
  };

  const handleExport = () => {
    // TODO: Implémenter l'export
    console.log('Export des transactions...');
  };

  const handleImport = () => {
    // TODO: Implémenter l'import
    console.log('Import des transactions...');
  };

  const isDark = mode === 'dark';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez toutes vos transactions financières
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/transactions/analytics')}
              icon={TrendingUp}
            >
              Analytics
            </Button>
            
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              icon={Plus}
            >
              Nouvelle Transaction
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenus
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(stats.totalIncome || 0, 'HTG')}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Dépenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {formatCurrency(stats.totalExpense || 0, 'HTG')}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400 rotate-180" />
              </div>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Solde Net
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  (stats.totalIncome - stats.totalExpense) >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency((stats.totalIncome || 0) - (stats.totalExpense || 0), 'HTG')}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                (stats.totalIncome - stats.totalExpense) >= 0
                  ? 'bg-blue-100 dark:bg-blue-900/20'
                  : 'bg-orange-100 dark:bg-orange-900/20'
              }`}>
                <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Templates de transactions rapides */}
        <QuickTransactionTemplates
          onTemplateSelect={handleTemplateSelect}
          accounts={accounts}
        />

        {/* Filtres */}
        <TransactionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          onImport={handleImport}
          accounts={accounts}
        />

        {/* Liste des transactions */}
        {isLoading ? (
          <Card variant="glass" className="p-12">
            <Loading type="spinner" text="Chargement des transactions..." />
          </Card>
        ) : transactions.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-teal-100 dark:bg-teal-900/20 rounded-full">
                <Plus className="w-12 h-12 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Aucune transaction
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Commencez par créer votre première transaction
                </p>
                <Button
                  variant="primary"
                  size="md"
                  icon={Plus}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Créer une transaction
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* En-tête de liste */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pagination.totalCount} transaction(s) trouvée(s)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.currentPage} sur {pagination.totalPages}
              </p>
            </div>

            {/* Transactions groupées par date */}
            <div className="space-y-6">
              {Object.entries(
                transactions.reduce((grouped, transaction) => {
                  const date = new Date(transaction.date).toLocaleDateString('fr-HT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  if (!grouped[date]) {
                    grouped[date] = [];
                  }
                  grouped[date].push(transaction);
                  return grouped;
                }, {})
              ).map(([date, dayTransactions]) => (
                <div key={date} className="space-y-3">
                  {/* Séparateur de date */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white px-3">
                      {date}
                    </p>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Transactions du jour */}
                  <div className="space-y-3">
                    {dayTransactions.map((transaction) => (
                      <TransactionCard
                        key={transaction._id}
                        transaction={transaction}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onDuplicate={handleDuplicateClick}
                        onClick={() => handleDetailsClick(transaction)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                showPageNumbers
                maxPageNumbers={5}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        accounts={accounts}
      />

      {selectedTransaction && (
        <>
          <EditTransactionModal
            transaction={selectedTransaction}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTransaction(null);
            }}
            onSuccess={handleEditSuccess}
            onDelete={handleDeleteClick}
            accounts={accounts}
          />

          <TransactionDetails
            transaction={selectedTransaction}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedTransaction(null);
            }}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onDuplicate={handleDuplicateClick}
          />
        </>
      )}
    </div>
  );
};

export default TransactionsListPage;