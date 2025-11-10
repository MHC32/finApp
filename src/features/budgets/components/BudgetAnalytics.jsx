// src/features/budgets/components/BudgetAnalytics.jsx
import { forwardRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Eye
} from 'lucide-react';

// Composants réutilisables
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Tabs from '../../../components/ui/Tabs';
import Select from '../../../components/ui/Select';
import ProgressBar from '../../../components/ui/ProgressBar';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/common/EmptyState';

// Composants charts
import LineChart from '../../../components/charts/LineChart';
import DonutChart from '../../../components/charts/DonutChart';

// Utilitaires
import { formatCurrency, formatPercentage } from '../../../utils/format';

/**
 * Composant BudgetAnalytics - Analytics détaillés pour un budget
 */
const BudgetAnalytics = forwardRef(({
  budget,
  analytics = {},
  timeRange = 'month',
  onTimeRangeChange = () => {},
  onViewCategory = () => {},
  loading = false,
  className = '',
  ...props
}, ref) => {
  const [activeView, setActiveView] = useState('overview');

  // Utilitaires pour les calculs de dates
  const getDaysInPeriod = (budget) => {
    if (!budget?.startDate) return 1;
    try {
      const start = new Date(budget.startDate);
      const today = new Date();
      const diffTime = today - start;
      return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 1;
    }
  };

  const getTotalDaysInPeriod = (budget) => {
    if (!budget?.startDate || !budget?.endDate) return 1;
    try {
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);
      const diffTime = end - start;
      return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 1;
    }
  };

  const getCategoryName = (categoryKey) => {
    const names = {
      alimentation: 'Alimentation',
      transport: 'Transport',
      logement: 'Logement',
      sante: 'Santé',
      education: 'Éducation',
      loisirs: 'Loisirs',
      factures: 'Factures',
      vetements: 'Vêtements',
      epargne: 'Épargne',
      investment: 'Investissement',
      sol: 'Sol/Tontine',
      other: 'Autre'
    };
    return names[categoryKey] || categoryKey;
  };

  const getCategoryColor = (categoryKey) => {
    const colors = {
      alimentation: '#ef4444',
      transport: '#3b82f6',
      logement: '#8b5cf6',
      sante: '#10b981',
      education: '#f59e0b',
      loisirs: '#ec4899',
      factures: '#6b7280',
      vetements: '#06b6d4',
      epargne: '#84cc16',
      investment: '#f97316',
      sol: '#7c3aed',
      other: '#6b7280'
    };
    return colors[categoryKey] || '#6b7280';
  };

  // Fonctions pour générer des données de démonstration
  const generateDemoTrends = (budget) => {
    const trends = [];
    try {
      const startDate = new Date(budget.startDate);
      const today = new Date();
      
      for (let i = 0; i < 6; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        
        if (date > today) break;
        
        const totalBudgeted = Object.values(budget.categories || {}).reduce(
          (sum, amount) => sum + (Number(amount) || 0), 0
        );
        
        trends.push({
          date: date.toISOString(),
          budgeted: totalBudgeted,
          spent: Math.random() * (Number(budget.totalSpent) || 2500) * 0.8
        });
      }
    } catch (error) {
      console.warn('Erreur génération trends demo:', error);
    }
    
    return trends;
  };

  const generateDemoCategories = (budget) => {
    const categories = budget.categories || {};
    const breakdown = [];
    
    try {
      Object.entries(categories).forEach(([category, budgeted]) => {
        const spent = (Number(budgeted) || 0) * Math.random() * 0.6;
        breakdown.push({
          category,
          spent: spent,
          budgeted: Number(budgeted) || 0
        });
      });
    } catch (error) {
      console.warn('Erreur génération categories demo:', error);
    }
    
    return breakdown;
  };

  // Données calculées avec gestion robuste des NaN
  const analyticsData = useMemo(() => {
    if (!budget) return null;

    const {
      monthlyTrends = [],
      categoryBreakdown = [],
      comparison = {},
      alerts = [],
      recommendations = []
    } = analytics;

    // S'assurer que les tableaux sont valides
    const safeAlerts = Array.isArray(alerts) ? alerts : [];
    const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

    // Calcul des KPIs avec protection contre NaN
    const categories = budget.categories || {};
    const totalBudgeted = Object.values(categories).reduce(
      (sum, amount) => sum + (Number(amount) || 0), 0
    );
    
    const totalSpent = Number(budget.totalSpent) || 0;
    const spentPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    const remaining = Math.max(0, totalBudgeted - totalSpent);
    
    const daysInPeriod = getDaysInPeriod(budget);
    const averageDailySpend = daysInPeriod > 0 ? totalSpent / daysInPeriod : 0;
    
    const totalDaysInPeriod = getTotalDaysInPeriod(budget);
    const projectedEndSpend = averageDailySpend * totalDaysInPeriod;

    // Générer des données de démonstration si les données réelles sont manquantes
    const demoMonthlyTrends = monthlyTrends.length > 0 ? monthlyTrends : generateDemoTrends(budget);
    const demoCategoryBreakdown = categoryBreakdown.length > 0 ? categoryBreakdown : generateDemoCategories(budget);

    // Données pour graphique linéaire
    const lineChartData = demoMonthlyTrends.map((month, index) => ({
      name: `Mois ${index + 1}`,
      budgeté: month.budgeted || 0,
      dépensé: month.spent || 0,
      restant: Math.max(0, (month.budgeted || 0) - (month.spent || 0))
    }));

    // Données pour graphique donut (catégories)
    const donutChartData = demoCategoryBreakdown
      .filter(cat => (cat.spent || 0) > 0)
      .map(cat => ({
        name: getCategoryName(cat.category),
        value: cat.spent || 0,
        color: getCategoryColor(cat.category)
      }));

    // Catégories problématiques
    const problematicCategories = demoCategoryBreakdown.filter(cat => {
      const categoryBudget = categories[cat.category] || 0;
      const categorySpent = cat.spent || 0;
      const spentPercentage = categoryBudget > 0 ? (categorySpent / categoryBudget) * 100 : 0;
      return spentPercentage >= (budget.alertSettings?.criticalThreshold || 95);
    });

    // Ajouter les catégories problématiques aux alertes
    const allAlerts = [
      ...safeAlerts,
      ...problematicCategories.map(cat => {
        const categoryBudget = categories[cat.category] || 1;
        const spentPercentage = Math.round(((cat.spent || 0) / categoryBudget) * 100);
        return {
          type: 'critical',
          message: `${getCategoryName(cat.category)}: ${spentPercentage}% du budget utilisé`,
          category: cat.category
        };
      })
    ];

    return {
      // KPIs
      kpis: {
        totalBudgeted,
        totalSpent,
        spentPercentage: Math.round(spentPercentage),
        remaining,
        averageDailySpend: Math.round(averageDailySpend),
        projectedEndSpend: Math.round(projectedEndSpend),
        projectionStatus: projectedEndSpend > totalBudgeted ? 'over' : 'under'
      },

      // Graphiques
      charts: {
        trends: lineChartData,
        categories: donutChartData
      },

      // Comparaisons
      comparison: {
        previousPeriod: comparison.previousPeriod || {},
        percentageChange: comparison.percentageChange || 0
      },

      // Alertes et recommandations
      alerts: allAlerts,
      recommendations: safeRecommendations,

      // Données détaillées
      details: {
        problematicCategories,
        bestPerforming: demoCategoryBreakdown
          .filter(cat => {
            const categoryBudget = categories[cat.category] || 0;
            const categorySpent = cat.spent || 0;
            return categoryBudget > 0 && (categorySpent / categoryBudget) <= 0.5;
          })
          .slice(0, 3)
      }
    };
  }, [budget, analytics]);

  // Composant de graphique de démonstration
  const DemoChart = ({ title, description, height = 200 }) => (
    <div 
      className="bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4"
      style={{ height: `${height}px` }}
    >
      <div className="text-gray-400 dark:text-gray-500 text-center">
        <BarChart3 className="w-12 h-12 mx-auto mb-2" />
        <div className="font-medium">{title}</div>
        <div className="text-sm mt-1">{description}</div>
      </div>
    </div>
  );

  // Composant de graphique donut de démonstration
  const DemoDonutChart = ({ title, description, height = 200 }) => (
    <div 
      className="bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4"
      style={{ height: `${height}px` }}
    >
      <div className="text-gray-400 dark:text-gray-500 text-center">
        <PieChart className="w-12 h-12 mx-auto mb-2" />
        <div className="font-medium">{title}</div>
        <div className="text-sm mt-1">{description}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6">
          <Loading.SkeletonCard />
        </div>
      </Card>
    );
  }

  if (!budget) {
    return (
      <EmptyState
        variant="nodata"
        title="Aucune donnée d'analyse"
        description="Les analyses ne sont pas disponibles pour ce budget"
        className={className}
      />
    );
  }

  const { kpis, charts, comparison, alerts, recommendations, details } = analyticsData || {};

  // Protection contre les données manquantes
  if (!analyticsData) {
    return (
      <EmptyState
        variant="error"
        title="Erreur de chargement"
        description="Impossible de charger les données d'analyse"
        className={className}
      />
    );
  }

  return (
    <div ref={ref} className={`space-y-6 ${className}`} {...props}>
      {/* En-tête avec sélecteur de période */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analyse du Budget
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Performances et tendances de votre budget
          </p>
        </div>

        <Select
          options={[
            { value: 'week', label: '7 derniers jours' },
            { value: 'month', label: '30 derniers jours' },
            { value: 'quarter', label: '3 derniers mois' },
            { value: 'year', label: '12 derniers mois' }
          ]}
          value={timeRange}
          onChange={onTimeRangeChange}
          size="sm"
          icon={Calendar}
        />
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeView} onChange={setActiveView}>
        <Tabs.List>
          <Tabs.Tab value="overview" icon={BarChart3}>
            Vue d'ensemble
          </Tabs.Tab>
          <Tabs.Tab value="trends" icon={TrendingUp}>
            Tendances
          </Tabs.Tab>
          <Tabs.Tab value="categories" icon={PieChart}>
            Catégories
          </Tabs.Tab>
          <Tabs.Tab value="alerts" icon={AlertTriangle} badge={alerts.length}>
            Alertes
          </Tabs.Tab>
        </Tabs.List>

        {/* Onglet Vue d'ensemble */}
        <Tabs.Panel value="overview">
          <div className="space-y-6">
            {/* KPIs Principaux */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="glass" className="text-center p-4">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                  {formatCurrency(kpis.totalSpent, budget.currency)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Dépensé
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {kpis.spentPercentage}% du budget
                </div>
              </Card>

              <Card variant="glass" className="text-center p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {formatCurrency(kpis.remaining, budget.currency)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Restant
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {100 - kpis.spentPercentage}% disponible
                </div>
              </Card>

              <Card variant="glass" className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {formatCurrency(kpis.averageDailySpend, budget.currency)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Moyenne / jour
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Dépense quotidienne
                </div>
              </Card>

              <Card variant="glass" className="text-center p-4">
                <div className={`text-2xl font-bold mb-1 ${
                  kpis.projectionStatus === 'over' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {formatCurrency(kpis.projectedEndSpend, budget.currency)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Projection fin
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {kpis.projectionStatus === 'over' ? 'Dépassement' : 'Dans le budget'}
                </div>
              </Card>
            </div>

            {/* Barre de progression globale */}
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Progression globale
                  </h3>
                  <Badge
                    color={kpis.spentPercentage >= 95 ? 'red' : kpis.spentPercentage >= 80 ? 'orange' : 'green'}
                    variant="subtle"
                  >
                    {kpis.spentPercentage}% utilisé
                  </Badge>
                </div>
                
                <ProgressBar
                  value={kpis.spentPercentage}
                  max={100}
                  size="lg"
                  color={kpis.spentPercentage >= 95 ? 'red' : kpis.spentPercentage >= 80 ? 'orange' : 'teal'}
                  variant="rounded"
                  showValue={true}
                  striped={kpis.spentPercentage >= 80}
                />

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Objectif</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(kpis.totalBudgeted, budget.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Taux d'utilisation</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatPercentage(kpis.spentPercentage / 100)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Graphiques rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution des dépenses */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Évolution des dépenses
                  </h3>
                  {charts.trends.length > 0 ? (
                    <LineChart
                      data={charts.trends}
                      lines={[
                        { dataKey: 'dépensé', name: 'Dépensé', color: '#ef4444' },
                        { dataKey: 'budgeté', name: 'Budgeté', color: '#10b981' }
                      ]}
                      height={200}
                      xAxisKey="name"
                    />
                  ) : (
                    <DemoChart 
                      title="Graphique d'évolution"
                      description="Les données de tendance seront affichées ici"
                    />
                  )}
                </div>
              </Card>

              {/* Répartition par catégorie */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Répartition par catégorie
                  </h3>
                  {charts.categories.length > 0 ? (
                    <DonutChart
                      data={charts.categories}
                      height={200}
                      showLegend={true}
                      showTooltip={true}
                      centerText={formatCurrency(kpis.totalSpent, budget.currency)}
                      centerLabel="Total dépensé"
                    />
                  ) : (
                    <DemoDonutChart 
                      title="Graphique de répartition"
                      description="La répartition par catégorie sera affichée ici"
                    />
                  )}
                </div>
              </Card>
            </div>
          </div>
        </Tabs.Panel>

        {/* Onglet Tendances */}
        <Tabs.Panel value="trends">
          <div className="space-y-6">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Évolution détaillée du budget
                </h3>
                {charts.trends.length > 0 ? (
                  <LineChart
                    data={charts.trends}
                    lines={[
                      { dataKey: 'budgeté', name: 'Budgeté', color: '#10b981' },
                      { dataKey: 'dépensé', name: 'Dépensé', color: '#ef4444' },
                      { dataKey: 'restant', name: 'Restant', color: '#3b82f6' }
                    ]}
                    height={300}
                    xAxisKey="name"
                    showGrid={true}
                    showLegend={true}
                  />
                ) : (
                  <DemoChart 
                    title="Graphique d'évolution détaillée"
                    description="Les données de tendance détaillées seront affichées ici"
                    height={300}
                  />
                )}
              </div>
            </Card>

            {/* Statistiques de tendance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Tendance mensuelle
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {comparison.percentageChange > 0 ? '+' : ''}{comparison.percentageChange}%
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Jours restants
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {getTotalDaysInPeriod(budget) - getDaysInPeriod(budget)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Économie projetée
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(
                        Math.max(0, kpis.totalBudgeted - kpis.projectedEndSpend), 
                        budget.currency
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Tabs.Panel>

        {/* Onglet Catégories */}
        <Tabs.Panel value="categories">
          <div className="space-y-6">
            {/* Graphique de répartition */}
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Répartition détaillée par catégorie
                </h3>
                {charts.categories.length > 0 ? (
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/2">
                      <DonutChart
                        data={charts.categories}
                        height={250}
                        showLegend={false}
                        showTooltip={true}
                        innerRadius={60}
                        outerRadius={100}
                      />
                    </div>
                    <div className="lg:w-1/2 space-y-3">
                      {charts.categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(category.value, budget.currency)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatPercentage(category.value / kpis.totalSpent)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <DemoDonutChart 
                    title="Graphique de répartition"
                    description="La répartition par catégorie sera affichée ici"
                    height={250}
                  />
                )}
              </div>
            </Card>

            {/* Catégories problématiques */}
            {details.problematicCategories.length > 0 && (
              <Card variant="teal">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Catégories nécessitant attention
                  </h3>
                  <div className="space-y-2">
                    {details.problematicCategories.map((category, index) => {
                      const categoryBudget = budget.categories?.[category.category] || 0;
                      const spentPercentage = Math.round(((category.spent || 0) / categoryBudget) * 100);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getCategoryName(category.category)}
                            </div>
                            <div className="text-sm text-orange-600 dark:text-orange-400">
                              {spentPercentage}% du budget utilisé
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewCategory(category.category)}
                            leftIcon={Eye}
                          >
                            Voir
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* Meilleures performances */}
            {details.bestPerforming.length > 0 && (
              <Card variant="green">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Catégories bien gérées
                  </h3>
                  <div className="space-y-2">
                    {details.bestPerforming.map((category, index) => {
                      const categoryBudget = budget.categories?.[category.category] || 0;
                      const spentPercentage = Math.round(((category.spent || 0) / categoryBudget) * 100);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getCategoryName(category.category)}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">
                              Seulement {spentPercentage}% du budget utilisé
                            </div>
                          </div>
                          <ProgressBar
                            value={spentPercentage}
                            max={100}
                            color="green"
                            size="sm"
                            showValue={false}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Tabs.Panel>

        {/* Onglet Alertes */}
        <Tabs.Panel value="alerts">
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <Alert
                  key={index}
                  type={alert.type === 'critical' ? 'error' : 'warning'}
                  variant="subtle"
                  title={alert.message}
                  dismissible={true}
                  actions={
                    alert.category && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewCategory(alert.category)}
                        leftIcon={Eye}
                      >
                        Voir la catégorie
                      </Button>
                    )
                  }
                />
              ))
            ) : (
              <EmptyState
                variant="success"
                icon={CheckCircle2}
                title="Aucune alerte active"
                description="Votre budget est en bonne santé !"
              />
            )}

            {/* Recommandations */}
            {recommendations.length > 0 && (
              <Card variant="blue">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Recommandations
                  </h3>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {rec.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {rec.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
});

BudgetAnalytics.displayName = 'BudgetAnalytics';

BudgetAnalytics.propTypes = {
  /** Données du budget */
  budget: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    categories: PropTypes.object.isRequired,
    totalSpent: PropTypes.number,
    alertSettings: PropTypes.object
  }),

  /** Données d'analyse */
  analytics: PropTypes.shape({
    monthlyTrends: PropTypes.array,
    categoryBreakdown: PropTypes.array,
    comparison: PropTypes.object,
    alerts: PropTypes.array,
    recommendations: PropTypes.array
  }),

  /** Période d'analyse */
  timeRange: PropTypes.oneOf(['week', 'month', 'quarter', 'year']),

  /** Callback changement période */
  onTimeRangeChange: PropTypes.func,

  /** Callback pour voir une catégorie */
  onViewCategory: PropTypes.func,

  /** État de chargement */
  loading: PropTypes.bool,

  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default BudgetAnalytics;