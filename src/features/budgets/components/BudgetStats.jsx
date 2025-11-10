// src/features/budgets/components/BudgetStats.jsx
import { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Zap
} from 'lucide-react';

// Composants réutilisables
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ProgressBar from '../../../components/ui/ProgressBar';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/common/EmptyState';

// Composants charts
import DonutChart from '../../../components/charts/DonutChart';

// Utilitaires
import { formatCurrency, formatPercentage, formatNumber } from '../../../utils/format';

// Fonctions utilitaires (définies AVANT leur utilisation)
const getTrendColor = (value) => {
  if (value > 5) return 'red';
  if (value > 0) return 'orange';
  if (value < -5) return 'green';
  if (value < 0) return 'teal';
  return 'gray';
};

const getTrendIcon = (value) => {
  if (value > 0) return TrendingUp;
  if (value < 0) return TrendingDown;
  return Target;
};

// Sous-composant StatCard (défini AVANT le composant principal)
const StatCard = forwardRef(({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'teal',
  size = 'md',
  className = ''
}, ref) => {
  const TrendIcon = getTrendIcon(trend);
  const trendColor = getTrendColor(trend);

  return (
    <Card
      ref={ref}
      variant="glass"
      className={`relative overflow-hidden ${className}`}
    >
      <div className={`p-${size === 'sm' ? '4' : '6'}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${
            color === 'teal' ? 'bg-teal-100 dark:bg-teal-900/20' :
            color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
            color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
            color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
            color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20' :
            color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
            'bg-gray-100 dark:bg-gray-900/20'
          }`}>
            <Icon className={`w-4 h-4 ${
              color === 'teal' ? 'text-teal-600 dark:text-teal-400' :
              color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
              color === 'green' ? 'text-green-600 dark:text-green-400' :
              color === 'red' ? 'text-red-600 dark:text-red-400' :
              color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
              color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
              'text-gray-600 dark:text-gray-400'
            }`} />
          </div>

          {/* Indicateur de tendance */}
          {trend !== undefined && (
            <Badge
              size="sm"
              color={trendColor}
              variant="subtle"
              leftIcon={TrendIcon}
            >
              {formatPercentage(Math.abs(trend) / 100)}
            </Badge>
          )}
        </div>

        {/* Valeur */}
        <div className={`font-bold ${
          size === 'sm' ? 'text-xl' : 'text-2xl'
        } text-gray-900 dark:text-white mb-1`}>
          {value}
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </div>
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

/**
 * Composant BudgetStats - Tableau de bord statistiques budgets
 * 
 * Features:
 * - KPIs globaux et tendances
 * - Graphiques de répartition
 * - Comparaisons période précédente
 * - Indicateurs de performance
 * - Alertes et insights
 * - Vue responsive et modulable
 */
const BudgetStats = forwardRef(({
  stats = {},
  timeRange = 'month',
  onTimeRangeChange = () => {},
  loading = false,
  variant = 'default', // 'default', 'compact', 'detailed'
  className = '',
  ...props
}, ref) => {
  
  // Fonction generateInsights définie AVANT useMemo
  const generateInsights = (overview, trends, categories) => {
    const insights = [];

    // Insight utilisation
    if (overview.averageUtilization > 90) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Utilisation élevée',
        description: `Vos budgets sont utilisés à ${Math.round(overview.averageUtilization)}% en moyenne`,
        suggestion: 'Envisagez de réviser vos allocations'
      });
    }

    // Insight tendance dépenses
    if (trends.spendingTrend > 10) {
      insights.push({
        type: 'info',
        icon: TrendingUp,
        title: 'Dépenses en hausse',
        description: `Vos dépenses ont augmenté de ${Math.round(trends.spendingTrend)}%`,
        suggestion: 'Analysez les catégories concernées'
      });
    }

    // Insight performance
    if (overview.budgetsOnTrack && overview.activeBudgets && 
        (overview.budgetsOnTrack / overview.activeBudgets > 0.8)) {
      insights.push({
        type: 'success',
        icon: CheckCircle2,
        title: 'Excellente gestion',
        description: `${Math.round((overview.budgetsOnTrack / overview.activeBudgets) * 100)}% de vos budgets sont bien gérés`,
        suggestion: 'Continuez sur cette lancée !'
      });
    }

    // Insight catégorie dominante
    if (categories && categories.length > 0) {
      const topCategory = categories.reduce((prev, current) => 
        (prev?.spent || 0) > (current?.spent || 0) ? prev : current
      );
      const topPercentage = overview.totalSpent > 0 ? 
        ((topCategory.spent || 0) / overview.totalSpent) * 100 : 0;
      
      if (topPercentage > 40) {
        insights.push({
          type: 'info',
          icon: PieChart,
          title: 'Catégorie dominante',
          description: `${topCategory.name || topCategory.category || 'Catégorie'} représente ${Math.round(topPercentage)}% de vos dépenses`,
          suggestion: 'Diversifiez vos allocations'
        });
      }
    }

    return insights;
  };

  // Données calculées
  const computedStats = useMemo(() => {
    if (!stats || Object.keys(stats).length === 0) return null;

    const {
      overview = {},
      trends = {},
      categories = [],
      comparisons = {},
      insights = []
    } = stats;

    // Calcul des KPIs dérivés avec des valeurs par défaut sécurisées
    const totalBudgets = overview.totalBudgets || 0;
    const activeBudgets = overview.activeBudgets || 0;
    const totalBudgeted = overview.totalBudgeted || 0;
    const totalSpent = overview.totalSpent || 0;
    const averageUtilization = overview.averageUtilization || 0;
    const budgetsOnTrack = overview.budgetsOnTrack || 0;
    const budgetsExceeded = overview.budgetsExceeded || 0;

    // Tendance des dépenses avec valeurs par défaut
    const spendingTrend = trends.spendingTrend || 0;
    const savingsRate = trends.savingsRate || 0;
    const projection = trends.projection || {};

    // Catégories principales
    const topCategories = Array.isArray(categories) 
      ? categories
          .filter(cat => cat && typeof cat === 'object')
          .sort((a, b) => (b.spent || 0) - (a.spent || 0))
          .slice(0, 5)
      : [];

    // Performance vs période précédente
    const comparison = comparisons.previousPeriod || {};
    const performance = comparisons.performance || {};

    return {
      // KPIs Principaux
      kpis: {
        totalBudgets,
        activeBudgets,
        totalBudgeted,
        totalSpent,
        averageUtilization: Math.round(averageUtilization),
        budgetsOnTrack,
        budgetsExceeded,
        budgetsAtRisk: Math.max(0, activeBudgets - budgetsOnTrack - budgetsExceeded),
        remainingBudget: Math.max(0, totalBudgeted - totalSpent),
        utilizationRate: totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0
      },

      // Tendances
      trends: {
        spendingTrend,
        savingsRate: Math.round(savingsRate * 100),
        projection,
        monthlyGrowth: trends.monthlyGrowth || 0,
        efficiency: trends.efficiency || 0
      },

      // Catégories
      categories: {
        top: topCategories,
        total: topCategories.length,
        distribution: topCategories.map(cat => ({
          name: cat.name || cat.category || 'Unknown',
          value: cat.spent || 0,
          percentage: totalSpent > 0 ? ((cat.spent || 0) / totalSpent) * 100 : 0,
          color: cat.color || '#6b7280'
        }))
      },

      // Comparaisons
      comparisons: {
        previousPeriod: comparison,
        performance,
        improvement: comparison.spent ? 
          ((totalSpent - comparison.spent) / Math.max(comparison.spent, 1)) * 100 : 0
      },

      // Insights
      insights: Array.isArray(insights) 
        ? insights.concat(generateInsights(
            { ...overview, totalSpent, averageUtilization },
            trends,
            categories
          ))
        : generateInsights(
            { ...overview, totalSpent, averageUtilization },
            trends,
            categories
          )
    };
  }, [stats]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Loading.SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!computedStats) {
    return (
      <EmptyState
        variant="nodata"
        title="Aucune statistique disponible"
        description="Les statistiques apparaîtront au fur et à mesure de l'utilisation"
        className={className}
      />
    );
  }

  const { kpis, trends, categories, comparisons, insights } = computedStats;

  // Variante compacte
  if (variant === 'compact') {
    return (
      <div ref={ref} className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`} {...props}>
        <StatCard
          title="Budget Total"
          value={formatCurrency(kpis.totalBudgeted)}
          icon={DollarSign}
          trend={trends.spendingTrend}
          description="Total alloué"
          size="sm"
        />

        <StatCard
          title="Dépensé"
          value={formatCurrency(kpis.totalSpent)}
          icon={TrendingUp}
          trend={comparisons.improvement}
          description={`${kpis.averageUtilization}% utilisé`}
          size="sm"
        />

        <StatCard
          title="Budgets Actifs"
          value={kpis.activeBudgets}
          icon={Target}
          trend={trends.monthlyGrowth}
          description="Sur track"
          size="sm"
        />

        <StatCard
          title="Taux Épargne"
          value={formatPercentage(trends.savingsRate / 100)}
          icon={PieChart}
          trend={trends.savingsRate - (comparisons.previousPeriod.savingsRate || 0)}
          description="Mensuel"
          size="sm"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={`space-y-6 ${className}`} {...props}>
      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Budget Total"
          value={formatCurrency(kpis.totalBudgeted)}
          icon={DollarSign}
          trend={trends.spendingTrend}
          description="Total alloué à tous les budgets"
          color="blue"
        />

        <StatCard
          title="Dépenses Total"
          value={formatCurrency(kpis.totalSpent)}
          icon={TrendingUp}
          trend={comparisons.improvement}
          description={`${kpis.averageUtilization}% du budget utilisé`}
          color={kpis.averageUtilization > 90 ? 'red' : kpis.averageUtilization > 80 ? 'orange' : 'teal'}
        />

        <StatCard
          title="Budgets Actifs"
          value={kpis.activeBudgets}
          icon={Target}
          trend={trends.monthlyGrowth}
          description={`${kpis.budgetsOnTrack} sur track`}
          color="green"
        />

        <StatCard
          title="Taux d'Épargne"
          value={formatPercentage(trends.savingsRate / 100)}
          icon={PieChart}
          trend={trends.savingsRate - (comparisons.previousPeriod.savingsRate || 0)}
          description="Économies mensuelles"
          color="purple"
        />
      </div>

      {/* Deuxième ligne de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Restant"
          value={formatCurrency(kpis.remainingBudget)}
          icon={DollarSign}
          description="Budget disponible"
          color="green"
          size="sm"
        />

        <StatCard
          title="Sur Track"
          value={kpis.budgetsOnTrack}
          icon={CheckCircle2}
          description="Budgets bien gérés"
          color="green"
          size="sm"
        />

        <StatCard
          title="Dépassés"
          value={kpis.budgetsExceeded}
          icon={AlertTriangle}
          description="Budgets en alerte"
          color="red"
          size="sm"
        />

        <StatCard
          title="À Risque"
          value={kpis.budgetsAtRisk}
          icon={Clock}
          description="Budgets à surveiller"
          color="orange"
          size="sm"
        />
      </div>

      {/* Graphiques et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Répartition par catégorie */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Répartition des Dépenses
              </h3>
              <Badge color="teal" variant="subtle">
                Top {categories.total} catégories
              </Badge>
            </div>

            {categories.distribution.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <DonutChart
                    data={categories.distribution}
                    height={200}
                    showLegend={false}
                    showTooltip={true}
                    centerText={formatCurrency(kpis.totalSpent)}
                    centerLabel="Total dépensé"
                  />
                </div>

                <div className="lg:w-2/3 space-y-4">
                  {categories.distribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {category.name}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(category.value)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPercentage(category.percentage / 100)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                variant="nodata"
                size="sm"
                title="Aucune donnée de catégorie"
              />
            )}
          </div>
        </Card>

        {/* Insights et performances */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
              Insights & Performances
            </h3>

            <div className="space-y-4">
              {/* Efficacité globale */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-teal-800 dark:text-teal-300">
                    Efficacité Budgétaire
                  </span>
                </div>
                <ProgressBar
                  value={trends.efficiency}
                  max={100}
                  size="sm"
                  color="teal"
                  showValue={true}
                />
                <div className="text-sm text-teal-700 dark:text-teal-400 mt-1">
                  Score basé sur la gestion de vos budgets
                </div>
              </div>

              {/* Insights automatiques */}
              {insights.slice(0, 2).map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                    insight.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20' :
                    'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <insight.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      insight.type === 'success' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <div className={`font-medium text-sm ${
                        insight.type === 'success' ? 'text-green-800 dark:text-green-300' :
                        insight.type === 'warning' ? 'text-orange-800 dark:text-orange-300' :
                        'text-blue-800 dark:text-blue-300'
                      }`}>
                        {insight.title}
                      </div>
                      <div className={`text-xs ${
                        insight.type === 'success' ? 'text-green-700 dark:text-green-400' :
                        insight.type === 'warning' ? 'text-orange-700 dark:text-orange-400' :
                        'text-blue-700 dark:text-blue-400'
                      }`}>
                        {insight.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistiques rapides */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Utilisation moyenne</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPercentage(kpis.averageUtilization / 100)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Taux de réussite</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {kpis.activeBudgets > 0 ? formatPercentage(kpis.budgetsOnTrack / kpis.activeBudgets) : '0%'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Dépenses moyennes/jour</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(trends.projection.dailyAverage || 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Détails des performances */}
      {variant === 'detailed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance par période */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Performance Mensuelle
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Dépenses', current: kpis.totalSpent, previous: comparisons.previousPeriod.spent },
                  { label: 'Budget alloué', current: kpis.totalBudgeted, previous: comparisons.previousPeriod.budgeted },
                  { label: 'Budgets actifs', current: kpis.activeBudgets, previous: comparisons.previousPeriod.activeBudgets },
                  { label: 'Taux utilisation', current: kpis.averageUtilization, previous: comparisons.previousPeriod.averageUtilization }
                ].map((item, index) => {
                  const change = item.previous ? 
                    ((item.current - item.previous) / Math.max(item.previous, 1)) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.label}
                      </span>
                      
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {typeof item.current === 'number' ? 
                            (item.label.includes('Taux') ? 
                              formatPercentage(item.current / 100) : 
                              formatCurrency(item.current)) : 
                            item.current
                          }
                        </div>
                        
                        {item.previous && (
                          <div className={`text-xs ${
                            change > 0 ? 'text-red-600 dark:text-red-400' :
                            change < 0 ? 'text-green-600 dark:text-green-400' :
                            'text-gray-500 dark:text-gray-400'
                          }`}>
                            {change > 0 ? '+' : ''}{formatPercentage(change / 100)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Projections */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Projections & Objectifs
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Dépenses projetées (fin de mois)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(trends.projection.monthEnd || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Économies projetées
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(trends.projection.savings || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Objectif épargne
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatPercentage(trends.projection.savingsGoal || 0)}
                  </span>
                </div>

                <ProgressBar
                  value={trends.projection.progress || 0}
                  max={100}
                  label="Progression mensuelle"
                  showValue={true}
                  color="teal"
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
});

BudgetStats.displayName = 'BudgetStats';

BudgetStats.propTypes = {
  /** Données statistiques */
  stats: PropTypes.shape({
    overview: PropTypes.object,
    trends: PropTypes.object,
    categories: PropTypes.array,
    comparisons: PropTypes.object,
    insights: PropTypes.array
  }),

  /** Période d'analyse */
  timeRange: PropTypes.oneOf(['week', 'month', 'quarter', 'year']),

  /** Callback changement période */
  onTimeRangeChange: PropTypes.func,

  /** État de chargement */
  loading: PropTypes.bool,

  /** Variante d'affichage */
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),

  /** Classes CSS additionnelles */
  className: PropTypes.string
};

// Variantes exportées
BudgetStats.Compact = forwardRef((props, ref) => (
  <BudgetStats ref={ref} variant="compact" {...props} />
));
BudgetStats.Compact.displayName = 'BudgetStats.Compact';

BudgetStats.Detailed = forwardRef((props, ref) => (
  <BudgetStats ref={ref} variant="detailed" {...props} />
));
BudgetStats.Detailed.displayName = 'BudgetStats.Detailed';

export default BudgetStats;