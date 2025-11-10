import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Filter,
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  Plus
} from 'lucide-react';

// Composants
import BudgetStats from '../components/BudgetStats';
import BudgetAnalytics from '../components/BudgetAnalytics';
import BudgetProgress from '../components/BudgetProgress';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/common/EmptyState';
import Tabs from '../../../components/ui/Tabs';
import Select from '../../../components/ui/Select';

// Hooks et store
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../utils/constants';

/**
 * Page d'analytics et statistiques détaillées des budgets
 */
const BudgetAnalyticsPage = () => {
  const navigate = useNavigate();
  
  const {
    // État
    budgets,
    budgetProgress,
    budgetTrends,
    userStats,
    loading,
    analyticsLoading,
    
    // Actions
    getBudgetProgress,
    getBudgetTrends,
    getUserBudgetStats
  } = useBudget();

  const { success, error } = useToast();

  // États locaux
  const [timeRange, setTimeRange] = useState('month');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  // Chargement initial
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  // Charger les données d'analytics
  const loadAnalyticsData = useCallback(async () => {
    try {
      await Promise.all([
        getBudgetProgress({ period: timeRange }),
        getBudgetTrends({ months: 6 }),
        getUserBudgetStats()
      ]);
    } catch (err) {
      error('Erreur lors du chargement des analytics');
    }
  }, [timeRange, getBudgetProgress, getBudgetTrends, getUserBudgetStats, error]);

  // Données combinées pour les analytics
  const analyticsData = {
    overview: userStats || {},
    trends: budgetTrends || {},
    progress: budgetProgress || {},
    budgets: budgets || []
  };

  // Exporter les rapports
  const handleExport = async (format = 'pdf') => {
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      success(`Rapport ${format.toUpperCase()} généré avec succès`);
    } catch (err) {
      error('Erreur lors de l\'export du rapport');
    }
  };

  // Filtrer par budget spécifique
  const handleBudgetSelect = (budgetId) => {
    const budget = budgets.find(b => b._id === budgetId);
    setSelectedBudget(budget || null);
  };

  // Obtenir les données pour l'analyse détaillée
  const getDetailedAnalytics = () => {
    if (selectedBudget) {
      return {
        budget: selectedBudget,
        analytics: {
          monthlyTrends: budgetTrends?.monthlyData || [],
          categoryBreakdown: Object.entries(selectedBudget.categories || {}).map(([category, amount]) => ({
            category,
            spent: selectedBudget.categorySpent?.[category] || 0,
            budgeted: amount
          })),
          comparison: budgetTrends?.comparison || {},
          alerts: budgetProgress?.alerts || [],
          recommendations: generateRecommendations(selectedBudget)
        }
      };
    }
    return null;
  };

  // Générer des recommandations basées sur les données du budget
  const generateRecommendations = (budget) => {
    const recommendations = [];
    const totalSpent = budget.totalSpent || 0;
    const totalBudgeted = Object.values(budget.categories || {}).reduce((sum, amount) => sum + amount, 0);
    const utilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    // Recommandation d'optimisation
    if (utilization < 60) {
      recommendations.push({
        title: 'Budget sous-utilisé',
        description: `Seulement ${Math.round(utilization)}% de votre budget est utilisé. Envisagez de réallouer les fonds.`,
        priority: 'medium'
      });
    }

    // Recommandation pour les catégories critiques
    Object.entries(budget.categories || {}).forEach(([category, budgeted]) => {
      const spent = budget.categorySpent?.[category] || 0;
      const categoryUtilization = budgeted > 0 ? (spent / budgeted) * 100 : 0;
      
      if (categoryUtilization >= 95) {
        recommendations.push({
          title: `Catégorie ${category} critique`,
          description: `La catégorie ${category} est utilisée à ${Math.round(categoryUtilization)}%. Envisagez d'augmenter le budget.`,
          priority: 'high'
        });
      }
    });

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de page */}
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics Budgets
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  Analysez les performances et tendances de vos budgets
                </p>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex items-center gap-3">
              {/* Sélecteur de période */}
              <Select
                options={[
                  { value: 'week', label: '7 derniers jours' },
                  { value: 'month', label: '30 derniers jours' },
                  { value: 'quarter', label: '3 derniers mois' },
                  { value: 'year', label: '12 derniers mois' }
                ]}
                value={timeRange}
                onChange={setTimeRange}
                size="sm"
                icon={Filter}
              />

              {/* Actions d'export */}
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                leftIcon={Download}
                size="sm"
              >
                Exporter PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <Tabs value={activeView} onChange={setActiveView}>
            <Tabs.List>
              <Tabs.Tab value="overview" icon={BarChart3}>
                Vue d'ensemble
              </Tabs.Tab>
              <Tabs.Tab value="trends" icon={TrendingUp}>
                Tendances
              </Tabs.Tab>
              <Tabs.Tab value="details" icon={PieChart}>
                Analyse détaillée
              </Tabs.Tab>
              <Tabs.Tab value="progress" icon={Target}>
                Progression
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        {/* Contenu principal */}
        {loading || analyticsLoading ? (
          <div className="space-y-6">
            <Loading.SkeletonCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Loading.SkeletonCard />
              <Loading.SkeletonCard />
            </div>
          </div>
        ) : budgets.length === 0 ? (
          <EmptyState
            variant="nodata"
            title="Aucune donnée d'analyse"
            description="Créez votre premier budget pour voir les analyses et statistiques"
            action={
              <Button
                onClick={() => navigate(ROUTES.BUDGETS_CREATE)}
                leftIcon={Plus}
              >
                Créer un budget
              </Button>
            }
          />
        ) : (
          <div className="space-y-8">
            {/* Vue d'ensemble */}
            {activeView === 'overview' && (
              <div className="space-y-6">
                <BudgetStats
                  stats={analyticsData}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  variant="detailed"
                />
                
                {/* KPIs rapides */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                      {budgets.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Budgets totaux
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {budgets.filter(b => !b.isArchived).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Budgets actifs
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {Math.round(analyticsData.overview.averageUtilization || 0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Utilisation moyenne
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {analyticsData.trends.savingsRate || 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Taux d'épargne
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tendances */}
            {activeView === 'trends' && (
              <div className="space-y-6">
                <BudgetStats
                  stats={analyticsData}
                  timeRange={timeRange}
                  variant="compact"
                />
                
                {/* Graphiques de tendances détaillés */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Évolution des dépenses
                    </h3>
                    {/* Placeholder pour graphique de tendances */}
                    <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Graphique des tendances à implémenter
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Répartition par période
                    </h3>
                    {/* Placeholder pour graphique de répartition */}
                    <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Graphique de répartition à implémenter
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analyse détaillée */}
            {activeView === 'details' && (
              <div className="space-y-6">
                {/* Sélecteur de budget */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analyser un budget spécifique
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Tous les budgets' },
                      ...budgets.map(budget => ({
                        value: budget._id,
                        label: budget.name
                      }))
                    ]}
                    value={selectedBudget?._id || ''}
                    onChange={handleBudgetSelect}
                    placeholder="Choisir un budget..."
                  />
                </div>

                {selectedBudget ? (
                  <BudgetAnalytics
                    budget={selectedBudget}
                    analytics={getDetailedAnalytics()?.analytics}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                  />
                ) : (
                  <EmptyState
                    variant="info"
                    title="Sélectionnez un budget"
                    description="Choisissez un budget spécifique pour voir son analyse détaillée"
                  />
                )}
              </div>
            )}

            {/* Progression */}
            {activeView === 'progress' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Progression des budgets
                </h2>
                
                {budgets.filter(b => !b.isArchived).map(budget => (
                  <div key={budget._id} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {budget.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((budget.totalSpent / budget.totalBudgeted) * 100)}% utilisé
                      </span>
                    </div>
                    
                    <BudgetProgress
                      budgeted={budget.totalBudgeted}
                      spent={budget.totalSpent}
                      currency={budget.currency}
                      showDetails={true}
                      size="lg"
                    />
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Période</div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {budget.period}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Jours restants</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {Math.ceil((new Date(budget.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Statut</div>
                        <div className={`font-medium ${
                          budget.status === 'active' ? 'text-green-600 dark:text-green-400' :
                          budget.status === 'exceeded' ? 'text-red-600 dark:text-red-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {budget.status === 'active' ? 'Actif' : 
                           budget.status === 'exceeded' ? 'Dépassé' : 'Terminé'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAnalyticsPage;