import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Filter,
  Download,
  TrendingUp,
  PieChart
} from 'lucide-react';

// Composants
import BudgetCard from '../components/BudgetCard';
import BudgetFilters from '../components/BudgetFilters';
import BudgetStats from '../components/BudgetStats';
import CreateBudgetModal from '../components/CreateBudgetModal';
import EmptyState from '../../../components/common/EmptyState';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import Pagination from '../../../components/ui/Pagination';

// Hooks et store
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../utils/constants';

/**
 * Page de liste des budgets avec filtres, statistiques et création
 */
const BudgetsListPage = () => {
  const navigate = useNavigate();
  
  const {
    // État
    budgets,
    userStats,
    filters,
    pagination,
    loading,
    isCreating,
    
    // Actions
    getBudgets,
    createBudget,
    deleteBudget,
    toggleArchiveBudget,
    updateFilters,
    refreshData,
    duplicateBudget
  } = useBudget();

  const { success, error } = useToast();

  // États locaux
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Chargement initial
  useEffect(() => {
    loadBudgets();
  }, []);

  // Charger les budgets avec les filtres actuels
  const loadBudgets = useCallback(async () => {
    try {
      await getBudgets(filters);
    } catch (err) {
      error('Erreur lors du chargement des budgets');
    }
  }, [filters, getBudgets, error]);

  // Gérer les changements de filtres
  const handleFiltersChange = useCallback((newFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  // Gérer la pagination
  const handlePageChange = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  // Créer un nouveau budget
  const handleCreateBudget = async (budgetData) => {
    try {
      const result = await createBudget(budgetData);
      if (result.success) {
        setShowCreateModal(false);
        success('Budget créé avec succès !');
        await loadBudgets();
      }
    } catch (err) {
      error('Erreur lors de la création du budget');
    }
  };

  // Archiver un budget
  const handleArchiveBudget = async (budget) => {
    setActionLoading(`archive-${budget._id}`);
    try {
      const result = await toggleArchiveBudget(budget._id, !budget.isArchived);
      if (result.success) {
        success(`Budget ${budget.isArchived ? 'désarchivé' : 'archivé'} avec succès`);
        await loadBudgets();
      }
    } catch (err) {
      error('Erreur lors de l\'archivage du budget');
    } finally {
      setActionLoading(null);
    }
  };

  // Dupliquer un budget
  const handleDuplicateBudget = async (budget) => {
    setActionLoading(`duplicate-${budget._id}`);
    try {
      const result = await duplicateBudget(budget._id);
      if (result.success) {
        success('Budget dupliqué avec succès');
        await loadBudgets();
      }
    } catch (err) {
      error('Erreur lors de la duplication du budget');
    } finally {
      setActionLoading(null);
    }
  };

  // Exporter un budget spécifique
  const handleExportBudget = async (budget) => {
    setActionLoading(`export-${budget._id}`);
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 1500));
      success(`Budget "${budget.name}" exporté avec succès`);
    } catch (err) {
      error('Erreur lors de l\'export du budget');
    } finally {
      setActionLoading(null);
    }
  };

  // Exporter tous les budgets
  const handleExportAll = async () => {
    setExportLoading(true);
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Export des budgets généré avec succès');
    } catch (err) {
      error('Erreur lors de l\'export');
    } finally {
      setExportLoading(false);
    }
  };

  // Supprimer un budget
  const handleDeleteBudget = async (budget) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le budget "${budget.name}" ? Cette action est irréversible.`)) {
      setActionLoading(`delete-${budget._id}`);
      try {
        const result = await deleteBudget(budget._id);
        if (result.success) {
          success('Budget supprimé avec succès');
          await loadBudgets();
        }
      } catch (err) {
        error('Erreur lors de la suppression du budget');
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Rafraîchir les données
  const handleRefresh = async () => {
    await refreshData();
    await loadBudgets();
  };

  // Voir les détails d'un budget
  const handleViewBudget = (budget) => {
    navigate(ROUTES.BUDGETS_DETAIL.replace(':id', budget._id));
  };

  // Éditer un budget - Redirection vers la page de détails pour l'instant
  const handleEditBudget = (budget) => {
    // Si la route d'édition n'existe pas, on redirige vers les détails
    // Vous pouvez remplacer par ROUTES.BUDGETS_EDIT quand elle sera créée
    navigate(ROUTES.BUDGETS_DETAIL.replace(':id', budget._id));
  };

  // Actions supplémentaires via le dropdown
  const handleMoreActions = (budget, action) => {
    console.log(`Action "${action}" pour le budget:`, budget.name);
    // Vous pouvez ajouter d'autres actions personnalisées ici
  };

  // Statistiques pour la page
  const pageStats = {
    overview: {
      totalBudgets: pagination.totalCount || 0,
      activeBudgets: budgets.filter(b => !b.isArchived).length,
      totalBudgeted: budgets.reduce((sum, b) => sum + b.totalBudgeted, 0),
      totalSpent: budgets.reduce((sum, b) => sum + b.totalSpent, 0),
      averageUtilization: budgets.length > 0 ? 
        budgets.reduce((sum, b) => sum + (b.totalSpent / b.totalBudgeted * 100), 0) / budgets.length : 0,
      budgetsOnTrack: budgets.filter(b => 
        !b.isArchived && 
        (b.totalSpent / b.totalBudgeted) <= 0.9
      ).length,
      budgetsExceeded: budgets.filter(b => 
        !b.isArchived && 
        (b.totalSpent / b.totalBudgeted) > 1
      ).length
    },
    trends: {
      spendingTrend: 5.2,
      savingsRate: 0.15,
      monthlyGrowth: 2.1
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de page */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Budgets
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Surveillez et gérez tous vos budgets en un seul endroit
              </p>
            </div>

            <div className="mt-4 lg:mt-0 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExportAll}
                isLoading={exportLoading}
                leftIcon={Download}
                size="lg"
              >
                Exporter
              </Button>

              <Button
                onClick={() => setShowCreateModal(true)}
                leftIcon={Plus}
                size="lg"
              >
                Nouveau Budget
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="mb-8">
          <BudgetStats
            stats={pageStats}
            loading={loading}
            variant="compact"
          />
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <BudgetFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onRefresh={handleRefresh}
            onExport={handleExportAll}
            loading={loading}
            totalCount={pagination.totalCount}
            filteredCount={budgets.length}
            showAdvanced={true}
          />
        </div>

        {/* Contenu principal */}
        <div className="space-y-6">
          {loading ? (
            // État de chargement
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Loading.SkeletonCard key={i} />
              ))}
            </div>
          ) : budgets.length > 0 ? (
            // Liste des budgets
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => (
                  <BudgetCard
                    key={budget._id}
                    budget={budget}
                    onView={handleViewBudget}
                    onEdit={handleEditBudget}
                    onArchive={handleArchiveBudget}
                    onDuplicate={handleDuplicateBudget}
                    onExport={handleExportBudget}
                    onDelete={handleDeleteBudget}
                    onMoreActions={handleMoreActions}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalCount}
                    pageSize={filters.limit || 10}
                    onPageChange={handlePageChange}
                    onPageSizeChange={(newSize) => updateFilters({ limit: newSize, page: 1 })}
                  />
                </div>
              )}
            </>
          ) : (
            // État vide
            <EmptyState
              variant="empty"
              title="Aucun budget trouvé"
              description={
                filters.search || filters.status !== 'active' || filters.includeArchived
                  ? "Aucun budget ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                  : "Commencez par créer votre premier budget pour gérer vos finances efficacement."
              }
              action={
                <Button
                  onClick={() => setShowCreateModal(true)}
                  leftIcon={Plus}
                  size="lg"
                >
                  Créer mon premier budget
                </Button>
              }
              secondaryAction={
                (filters.search || filters.status !== 'active' || filters.includeArchived) && (
                  <Button
                    variant="outline"
                    onClick={() => updateFilters({
                      search: '',
                      status: 'active',
                      includeArchived: false,
                      page: 1
                    })}
                  >
                    Réinitialiser les filtres
                  </Button>
                )
              }
            />
          )}
        </div>

        {/* Actions rapides en bas de page */}
        {budgets.length > 0 && !loading && (
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              leftIcon={Plus}
              size="lg"
              className="shadow-lg bg-teal-600 hover:bg-teal-700 text-white"
            >
              Nouveau Budget
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.BUDGETS_ANALYTICS)}
              leftIcon={TrendingUp}
              size="lg"
              className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Voir Analytics
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.BUDGETS_TEMPLATES)}
              leftIcon={PieChart}
              size="lg"
              className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Modèles
            </Button>
          </div>
        )}
      </div>

      {/* Modal de création */}
      <CreateBudgetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBudget}
        loading={isCreating}
      />
    </div>
  );
};

export default BudgetsListPage;