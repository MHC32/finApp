// src/features/sols/components/SolAnalytics.jsx
import { forwardRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Filter,
  Target
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Tabs from '../../../components/ui/Tabs';
import LineChart from '../../../components/charts/LineChart';
import DonutChart from '../../../components/charts/DonutChart';
import BarChart from '../../../components/charts/BarChart';
import ProgressBar from '../../../components/ui/ProgressBar';
import Select from '../../../components/ui/Select';
import EmptyState from '../../../components/common/EmptyState';

/**
 * Composant SolAnalytics - Analytics détaillés pour les sols/tontines
 * 
 * Features:
 * - Vue d'ensemble avec KPIs
 * - Évolution des contributions
 * - Répartition par participant
 * - Performance des rounds
 * - Comparaison avec objectifs
 * - Export de données
 * - Filtres temporels
 * 
 * @example
 * <SolAnalytics
 *   analytics={analyticsData}
 *   timeRange="month"
 *   onTimeRangeChange={setTimeRange}
 *   onExport={handleExport}
 *   loading={false}
 * />
 */
const SolAnalytics = forwardRef(({
  analytics = {},
  timeRange = 'month',
  onTimeRangeChange = () => {},
  onExport = () => {},
  loading = false,
  className = ''
}, ref) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Options de période
  const timeRangeOptions = [
    { value: 'week', label: '7 derniers jours' },
    { value: 'month', label: '30 derniers jours' },
    { value: 'quarter', label: '3 derniers mois' },
    { value: 'year', label: '12 derniers mois' },
    { value: 'all', label: 'Toute la période' }
  ];

  // Données calculées
  const calculatedData = useMemo(() => {
    if (!analytics) return null;

    const {
      totalContributions = 0,
      totalParticipants = 0,
      activeSols = 0,
      completedRounds = 0,
      upcomingPayments = 0,
      paymentRate = 0,
      contributionTrend = [],
      participantDistribution = [],
      roundPerformance = [],
      solPerformance = []
    } = analytics;

    // KPIs principaux
    const kpis = [
      {
        label: 'Contributions totales',
        value: totalContributions,
        currency: 'HTG',
        icon: DollarSign,
        color: 'teal',
        change: '+12%',
        description: 'Montant total collecté'
      },
      {
        label: 'Participants actifs',
        value: totalParticipants,
        icon: Users,
        color: 'blue',
        change: '+5%',
        description: 'Membres dans vos sols'
      },
      {
        label: 'Sols actifs',
        value: activeSols,
        icon: TrendingUp,
        color: 'green',
        change: '+2',
        description: 'Sols en cours'
      },
      {
        label: 'Taux de paiement',
        value: paymentRate,
        suffix: '%',
        icon: Target,
        color: 'purple',
        change: '+8%',
        description: 'Paiements à temps'
      }
    ];

    // Données pour le graphique d'évolution
    const trendData = contributionTrend.length > 0 
      ? contributionTrend 
      : generateMockTrendData(timeRange);

    // Données pour la répartition
    const distributionData = participantDistribution.length > 0
      ? participantDistribution
      : generateMockDistributionData();

    // Données pour la performance des rounds
    const performanceData = roundPerformance.length > 0
      ? roundPerformance
      : generateMockPerformanceData();

    return {
      kpis,
      trendData,
      distributionData,
      performanceData,
      solPerformance
    };
  }, [analytics, timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading.SkeletonCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading.SkeletonCard />
          <Loading.SkeletonCard />
        </div>
      </div>
    );
  }

  if (!analytics || Object.keys(analytics).length === 0) {
    return (
      <EmptyState
        variant="nodata"
        title="Aucune donnée d'analyse"
        description="Les analyses de vos sols apparaîtront ici une fois que vous aurez des activités."
        action={
          <Button leftIcon={PieChart}>
            Créer un premier sol
          </Button>
        }
      />
    );
  }

  return (
    <div ref={ref} className={`space-y-6 ${className}`}>
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics des Sols
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analyse détaillée de vos tontines et contributions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={onTimeRangeChange}
            size="sm"
            icon={Filter}
          />
          
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={onExport}
          >
            Exporter
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" icon={BarChart3}>
            Vue d'ensemble
          </Tabs.Tab>
          <Tabs.Tab value="contributions" icon={TrendingUp}>
            Contributions
          </Tabs.Tab>
          <Tabs.Tab value="participants" icon={Users}>
            Participants
          </Tabs.Tab>
          <Tabs.Tab value="performance" icon={Target}>
            Performance
          </Tabs.Tab>
        </Tabs.List>

        {/* Vue d'ensemble */}
        <Tabs.Panel value="overview">
          <OverviewTab data={calculatedData} />
        </Tabs.Panel>

        {/* Contributions */}
        <Tabs.Panel value="contributions">
          <ContributionsTab data={calculatedData} />
        </Tabs.Panel>

        {/* Participants */}
        <Tabs.Panel value="participants">
          <ParticipantsTab data={calculatedData} />
        </Tabs.Panel>

        {/* Performance */}
        <Tabs.Panel value="performance">
          <PerformanceTab data={calculatedData} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
});

SolAnalytics.displayName = 'SolAnalytics';

// ===================================================================
// SOUS-COMPOSANTS DES ONGLETS
// ===================================================================

/**
 * Onglet Vue d'ensemble
 */
const OverviewTab = ({ data }) => (
  <div className="space-y-6">
    {/* KPIs */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} variant="glass" hoverable>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {kpi.value.toLocaleString()}
                    {kpi.suffix}
                  </p>
                  {kpi.currency && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {kpi.currency}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Badge color={kpi.color} size="sm">
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {kpi.description}
                  </span>
                </div>
              </div>
              <div className={`p-2 bg-${kpi.color}-100 dark:bg-${kpi.color}-900/20 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>

    {/* Graphiques principaux */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution des contributions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Évolution des contributions
        </h3>
        <LineChart
          data={data.trendData}
          lines={[
            {
              dataKey: 'contributions',
              name: 'Contributions',
              color: '#0d9488'
            }
          ]}
          xAxisKey="date"
          height={250}
          showGrid
          showTooltip
          curved
        />
      </Card>

      {/* Répartition par type de sol */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Répartition par type
        </h3>
        <DonutChart
          data={data.distributionData}
          height={250}
          showLegend
          showTooltip
          centerText="Total"
          centerLabel={`${data.distributionData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} HTG`}
        />
      </Card>
    </div>

    {/* Prochaines échéances */}
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Prochaines échéances
      </h3>
      <div className="space-y-3">
        {[1, 2, 3].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Sol Business Entrepreneurs
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prochain paiement dans 3 jours
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                5,000 HTG
              </p>
              <Badge color="teal" size="sm">
                À payer
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

/**
 * Onglet Contributions
 */
const ContributionsTab = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Contributions mensuelles
        </h4>
        <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
          45,000 HTG
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          +12% vs mois dernier
        </p>
      </Card>

      <Card>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Contribution moyenne
        </h4>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          3,750 HTG
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Par participant
        </p>
      </Card>

      <Card>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Objectif mensuel
        </h4>
        <div className="space-y-2">
          <ProgressBar value={75} max={100} color="teal" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            75% atteint
          </p>
        </div>
      </Card>
    </div>

    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Historique des contributions
      </h3>
      <BarChart
        data={data.trendData}
        bars={[
          {
            dataKey: 'contributions',
            name: 'Contributions',
            color: '#0d9488'
          }
        ]}
        xAxisKey="date"
        height={300}
        showGrid
        showTooltip
      />
    </Card>
  </div>
);

/**
 * Onglet Participants
 */
const ParticipantsTab = ({ data }) => (
  <div className="space-y-6">
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance des participants
      </h3>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                name={`Participant ${index + 1}`}
                size="sm"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Jean D.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3 sols actifs
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                95% de paiement
              </p>
              <ProgressBar value={95} max={100} size="sm" color="teal" />
            </div>
          </div>
        ))}
      </div>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Répartition géographique
        </h3>
        <DonutChart
          data={[
            { name: 'Port-au-Prince', value: 45, color: '#0d9488' },
            { name: 'Cap-Haïtien', value: 25, color: '#3b82f6' },
            { name: 'Jacmel', value: 15, color: '#8b5cf6' },
            { name: 'Autres', value: 15, color: '#f59e0b' }
          ]}
          height={250}
          showLegend
          showTooltip
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Taux de participation
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Paiements à temps</span>
            <span className="font-semibold text-gray-900 dark:text-white">92%</span>
          </div>
          <ProgressBar value={92} max={100} color="green" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Retards</span>
            <span className="font-semibold text-gray-900 dark:text-white">5%</span>
          </div>
          <ProgressBar value={5} max={100} color="orange" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Impayés</span>
            <span className="font-semibold text-gray-900 dark:text-white">3%</span>
          </div>
          <ProgressBar value={3} max={100} color="red" />
        </div>
      </Card>
    </div>
  </div>
);

/**
 * Onglet Performance
 */
const PerformanceTab = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance des sols
        </h3>
        <div className="space-y-4">
          {data.solPerformance && data.solPerformance.length > 0 ? (
            data.solPerformance.map((sol, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {sol.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sol.completedRounds}/{sol.totalRounds} rounds
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {sol.performance}%
                  </p>
                  <Badge 
                    color={sol.performance >= 80 ? 'green' : sol.performance >= 60 ? 'orange' : 'red'}
                    size="sm"
                  >
                    {sol.performance >= 80 ? 'Excellent' : sol.performance >= 60 ? 'Bon' : 'À améliorer'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <EmptyState
                variant="nodata"
                title="Aucune donnée de performance"
                description="Les données de performance apparaîtront lorsque vos sols seront actifs."
                size="sm"
              />
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Objectifs vs Réalisation
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contributions mensuelles
              </span>
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                45K / 50K HTG
              </span>
            </div>
            <ProgressBar value={90} max={100} color="teal" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Taux de participation
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                92% / 95%
              </span>
            </div>
            <ProgressBar value={97} max={100} color="blue" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rounds complétés
              </span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                24 / 30
              </span>
            </div>
            <ProgressBar value={80} max={100} color="green" />
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tendances de performance
      </h3>
      <LineChart
        data={data.performanceData}
        lines={[
          {
            dataKey: 'performance',
            name: 'Performance',
            color: '#0d9488'
          },
          {
            dataKey: 'target',
            name: 'Objectif',
            color: '#ef4444'
          }
        ]}
        xAxisKey="period"
        height={300}
        showGrid
        showTooltip
        showLegend
      />
    </Card>
  </div>
);

// ===================================================================
// FONCTIONS UTILITAIRES
// ===================================================================

/**
 * Génère des données mock pour l'évolution
 */
function generateMockTrendData(timeRange) {
  const data = [];
  const points = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12;
  
  for (let i = 0; i < points; i++) {
    data.push({
      date: `Jour ${i + 1}`,
      contributions: Math.floor(Math.random() * 10000) + 5000
    });
  }
  
  return data;
}

/**
 * Génère des données mock pour la répartition
 */
function generateMockDistributionData() {
  return [
    { name: 'Sol Classique', value: 45, color: '#0d9488' },
    { name: 'Sol Business', value: 25, color: '#3b82f6' },
    { name: 'Sol Urgence', value: 15, color: '#f59e0b' },
    { name: 'Sol Projet', value: 10, color: '#8b5cf6' },
    { name: 'Sol Épargne', value: 5, color: '#10b981' }
  ];
}

/**
 * Génère des données mock pour la performance
 */
function generateMockPerformanceData() {
  return [
    { period: 'Jan', performance: 85, target: 80 },
    { period: 'Fév', performance: 78, target: 80 },
    { period: 'Mar', performance: 92, target: 80 },
    { period: 'Avr', performance: 88, target: 85 },
    { period: 'Mai', performance: 95, target: 85 },
    { period: 'Jun', performance: 90, target: 85 }
  ];
}

// ===================================================================
// PROP TYPES
// ===================================================================

SolAnalytics.propTypes = {
  /** Données d'analyse */
  analytics: PropTypes.shape({
    totalContributions: PropTypes.number,
    totalParticipants: PropTypes.number,
    activeSols: PropTypes.number,
    completedRounds: PropTypes.number,
    upcomingPayments: PropTypes.number,
    paymentRate: PropTypes.number,
    contributionTrend: PropTypes.array,
    participantDistribution: PropTypes.array,
    roundPerformance: PropTypes.array,
    solPerformance: PropTypes.array
  }),
  
  /** Période sélectionnée */
  timeRange: PropTypes.oneOf(['week', 'month', 'quarter', 'year', 'all']),
  
  /** Callback changement de période */
  onTimeRangeChange: PropTypes.func,
  
  /** Callback export */
  onExport: PropTypes.func,
  
  /** État de chargement */
  loading: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default SolAnalytics;