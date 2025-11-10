import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Download,
  Share2,
  Archive,
  MoreVertical,
  PieChart,
  BarChart3,
  Target,
  Calendar,
  DollarSign,
  Copy,
  Printer
} from 'lucide-react';

// Composants
import BudgetProgress from '../components/BudgetProgress';
import BudgetAnalytics from '../components/BudgetAnalytics';
import BudgetCategoryItem from '../components/BudgetCategoryItem';
import CategoryBudgetAdjuster from '../components/CategoryBudgetAdjuster';
import EditBudgetModal from '../components/EditBudgetModal';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/common/EmptyState';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Tabs from '../../../components/ui/Tabs';
import Alert from '../../../components/ui/Alert';

// Hooks et store
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../utils/constants';

/**
 * Page de détails d'un budget spécifique
 */
const BudgetDetailsPage = () => {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  
  const {
    // État
    currentBudget,
    budgetProgress,
    budgetTrends,
    loading,
    updating,
    
    // Actions
    getBudget,
    updateBudget,
    deleteBudget,
    toggleArchiveBudget,
    adjustCategoryBudget,
    createBudgetSnapshot
  } = useBudget();

  const { success, error } = useToast();

  // États locaux
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  // Chargement du budget
  useEffect(() => {
    if (budgetId) {
      loadBudget();
    }
  }, [budgetId]);

  const loadBudget = useCallback(async () => {
    try {
      await getBudget(budgetId);
    } catch (err) {
      error('Erreur lors du chargement du budget');
      navigate(ROUTES.BUDGETS);
    }
  }, [budgetId, getBudget, navigate, error]);

  // Mettre à jour le budget
  const handleUpdateBudget = async (updateData) => {
    try {
      const result = await updateBudget(budgetId, updateData);
      if (result.success) {
        setShowEditModal(false);
        success('Budget modifié avec succès');
        await loadBudget();
      }
    } catch (err) {
      error('Erreur lors de la modification du budget');
    }
  };

  // Archiver le budget
  const handleArchiveBudget = async () => {
    try {
      const result = await toggleArchiveBudget(budgetId, !currentBudget.isArchived);
      if (result.success) {
        success(`Budget ${currentBudget.isArchived ? 'désarchivé' : 'archivé'} avec succès`);
        await loadBudget();
      }
    } catch (err) {
      error('Erreur lors de l\'archivage du budget');
    }
  };

  // Ajuster une catégorie
  const handleAdjustCategory = async (adjustmentData) => {
    try {
      const result = await adjustCategoryBudget(
        budgetId,
        adjustmentData.category,
        adjustmentData.newAmount,
        adjustmentData.reason
      );
      if (result.success) {
        setShowAdjuster(false);
        setSelectedCategory(null);
        success('Budget de catégorie ajusté avec succès');
        await loadBudget();
      }
    } catch (err) {
      error('Erreur lors de l\'ajustement de la catégorie');
    }
  };

  // Créer un snapshot
  const handleCreateSnapshot = async () => {
    try {
      const result = await createBudgetSnapshot(budgetId);
      if (result.success) {
        success('Snapshot mensuel créé avec succès');
      }
    } catch (err) {
      error('Erreur lors de la création du snapshot');
    }
  };

  // Exporter le budget
  const handleExport = async () => {
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Budget exporté avec succès');
    } catch (err) {
      error('Erreur lors de l\'export');
    }
  };

  // Dupliquer le budget
  const handleDuplicateBudget = () => {
    navigate(ROUTES.BUDGETS_DUPLICATE.replace(':id', budgetId));
  };

  // Données pour les analytics
  const getAnalyticsData = () => {
    if (!currentBudget) return null;

    return {
      monthlyTrends: budgetTrends?.monthlyData || [],
      categoryBreakdown: Object.entries(currentBudget.categories || {}).map(([category, amount]) => ({
        category,
        spent: currentBudget.categorySpent?.[category] || 0,
        budgeted: amount
      })),
      comparison: budgetTrends?.comparison || {},
      alerts: budgetProgress?.alerts || [],
      recommendations: generateRecommendations()
    };
  };

  // Générer des recommandations
  const generateRecommendations = () => {
    if (!currentBudget) return [];

    const recommendations = [];
    const totalSpent = currentBudget.totalSpent || 0;
    const totalBudgeted = Object.values(currentBudget.categories || {}).reduce((sum, amount) => sum + amount, 0);
    const utilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    // Recommandation basée sur l'utilisation globale
    if (utilization >= 90) {
      recommendations.push({
        title: 'Budget presque épuisé',
        description: `Votre budget est utilisé à ${Math.round(utilization)}%. Envisagez de réduire les dépenses ou d'ajuster le budget.`,
        type: 'warning'
      });
    }

    // Recommandations par catégorie
    Object.entries(currentBudget.categories || {}).forEach(([category, budgeted]) => {
      const spent = currentBudget.categorySpent?.[category] || 0;
      const categoryUtilization = budgeted > 0 ? (spent / budgeted) * 100 : 0;
      
      if (categoryUtilization >= 95) {
        recommendations.push({
          title: `Catégorie ${category} critique`,
          description: `Budget utilisé à ${Math.round(categoryUtilization)}%. Ajustement recommandé.`,
          type: 'critical',
          category: category
        });
      } else if (categoryUtilization < 30 && spent > 0) {
        recommendations.push({
          title: `Catégorie ${category} sous-utilisée`,
          description: `Seulement ${Math.round(categoryUtilization)}% utilisé. Réallocation possible.`,
          type: 'info',
          category: category
        });
      }
    });

    return recommendations;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading.SkeletonCard />
        </div>
      </div>
    );
  }

  if (!currentBudget) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            variant="error"
            title="Budget non trouvé"
            description="Le budget que vous recherchez n'existe pas ou a été supprimé"
            action={
              <Button onClick={() => navigate(ROUTES.BUDGETS)}>
                Retour aux budgets
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const totalBudgeted = Object.values(currentBudget.categories || {}).reduce((sum, amount) => sum + amount, 0);
  const totalSpent = currentBudget.totalSpent || 0;
  const remaining = Math.max(0, totalBudgeted - totalSpent);
  const utilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du budget */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(ROUTES.BUDGETS)}
                leftIcon={ArrowLeft}
                size="sm"
              >
                Retour
              </Button>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentBudget.name}
                  </h1>
                  
                  <Badge
                    color={
                      currentBudget.isArchived ? 'gray' :
                      currentBudget.status === 'exceeded' ? 'red' :
                      currentBudget.status === 'completed' ? 'blue' : 'green'
                    }
                    variant="subtle"
                  >
                    {currentBudget.isArchived ? 'Archivé' :
                     currentBudget.status === 'exceeded' ? 'Dépassé' :
                     currentBudget.status === 'completed' ? 'Terminé' : 'Actif'}
                  </Badge>
                </div>
                
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(currentBudget.startDate).toLocaleDateString()} - {new Date(currentBudget.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span className="capitalize">{currentBudget.period}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{currentBudget.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                leftIcon={Download}
                size="sm"
              >
                Exporter
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                leftIcon={Edit3}
                size="sm"
              >
                Modifier
              </Button>

              <Button
                variant={currentBudget.isArchived ? 'outline' : 'primary'}
                onClick={handleArchiveBudget}
                leftIcon={Archive}
                size="sm"
                isLoading={updating}
              >
                {currentBudget.isArchived ? 'Désarchiver' : 'Archiver'}
              </Button>
            </div>
          </div>
        </div>

        {/* Barre de progression principale */}
        <div className="mb-8">
          <Card>
            <div className="p-6">
              <BudgetProgress
                budgeted={totalBudgeted}
                spent={totalSpent}
                currency={currentBudget.currency}
                alertSettings={currentBudget.alertSettings}
                showDetails={true}
                size="lg"
                label={`Progression du budget ${currentBudget.name}`}
              />
              
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Budget total</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {totalBudgeted} {currentBudget.currency}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Dépensé</div>
                  <div className="font-semibold text-teal-600 dark:text-teal-400">
                    {totalSpent} {currentBudget.currency}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Restant</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {remaining} {currentBudget.currency}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Utilisation</div>
                  <div className="font-semibold text-orange-600 dark:text-orange-400">
                    {Math.round(utilization)}%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-6">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="overview" icon={BarChart3}>
                Vue d'ensemble
              </Tabs.Tab>
              <Tabs.Tab value="categories" icon={PieChart}>
                Catégories
              </Tabs.Tab>
              <Tabs.Tab value="analytics" icon={TrendingUp}>
                Analytics
              </Tabs.Tab>
              <Tabs.Tab value="history" icon={Calendar}>
                Historique
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Statistiques rapides */}
              <Card className="lg:col-span-2">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Statistiques du budget
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Object.keys(currentBudget.categories || {}).length}
                      </div>
                      <div className="text-sm text-blue-800 dark:text-blue-300">
                        Catégories
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round(utilization)}%
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-300">
                        Taux d'utilisation
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {Math.ceil((new Date(currentBudget.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-orange-800 dark:text-orange-300">
                        Jours restants
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {currentBudget.monthlySnapshots?.length || 0}
                      </div>
                      <div className="text-sm text-purple-800 dark:text-purple-300">
                        Snapshots
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions rapides */}
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Actions rapides
                  </h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleCreateSnapshot}
                      leftIcon={Calendar}
                      fullWidth
                    >
                      Créer snapshot
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleDuplicateBudget}
                      leftIcon={Copy}
                      fullWidth
                    >
                      Dupliquer le budget
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      leftIcon={Printer}
                      fullWidth
                    >
                      Imprimer
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Recommandations */}
              {generateRecommendations().length > 0 && (
                <Card className="lg:col-span-3">
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Recommandations
                    </h3>
                    
                    <div className="space-y-3">
                      {generateRecommendations().map((rec, index) => (
                        <Alert
                          key={index}
                          type={rec.type === 'critical' ? 'error' : rec.type === 'warning' ? 'warning' : 'info'}
                          variant="subtle"
                          title={rec.title}
                          description={rec.description}
                          actions={
                            rec.category && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCategory({ category: rec.category });
                                  setShowAdjuster(true);
                                }}
                              >
                                Ajuster
                              </Button>
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Catégories */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Catégories de dépenses
                </h3>
                
                <Badge color="teal" variant="subtle">
                  {Object.keys(currentBudget.categories || {}).length} catégories
                </Badge>
              </div>

              <div className="space-y-3">
                {Object.entries(currentBudget.categories || {}).map(([categoryId, budgetedAmount]) => {
                  const spentAmount = currentBudget.categorySpent?.[categoryId] || 0;
                  
                  return (
                    <BudgetCategoryItem
                      key={categoryId}
                      category={{
                        category: categoryId,
                        budgetedAmount,
                        spentAmount,
                        priority: 'medium',
                        isFlexible: true
                      }}
                      currency={currentBudget.currency}
                      alertSettings={currentBudget.alertSettings}
                      onEdit={(category) => {
                        setSelectedCategory(category);
                        setShowAdjuster(true);
                      }}
                      onAdjust={(category) => {
                        setSelectedCategory(category);
                        setShowAdjuster(true);
                      }}
                      expandable={true}
                      showTransactions={true}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <BudgetAnalytics
              budget={currentBudget}
              analytics={getAnalyticsData()}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          )}

          {/* Historique */}
          {activeTab === 'history' && (
            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Historique du budget
                </h3>
                
                {/* Snapshots mensuels */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Snapshots mensuels
                  </h4>
                  
                  {currentBudget.monthlySnapshots?.length > 0 ? (
                    <div className="space-y-3">
                      {currentBudget.monthlySnapshots.map((snapshot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {new Date(snapshot.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {snapshot.totalSpent} {currentBudget.currency} dépensés
                            </div>
                          </div>
                          
                          <Badge
                            color={
                              snapshot.utilization >= 95 ? 'red' :
                              snapshot.utilization >= 80 ? 'orange' : 'green'
                            }
                            variant="subtle"
                          >
                            {Math.round(snapshot.utilization)}% utilisé
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      variant="nodata"
                      size="sm"
                      title="Aucun snapshot"
                      description="Les snapshots mensuels apparaîtront ici"
                    />
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditBudgetModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateBudget}
        budget={currentBudget}
        loading={updating}
      />

      <CategoryBudgetAdjuster
        isOpen={showAdjuster}
        onClose={() => {
          setShowAdjuster(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleAdjustCategory}
        category={selectedCategory}
        budget={currentBudget}
        loading={updating}
      />
    </div>
  );
};

export default BudgetDetailsPage;