// src/features/transactions/pages/TransactionAnalyticsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart3,
  Download
} from 'lucide-react';
import { useTransaction } from '../hooks/useTransactions';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Select from '../../../components/ui/Select';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';
import CategoryAnalytics from '../components/CategoryAnalytics';
import MonthlyStats from '../components/MonthlyStats';
import Loading from '../../../components/ui/Loading';
import { formatCurrency } from '../../../utils/format';

/**
 * Page d'analytics complète des transactions
 * Affiche toutes les statistiques, graphiques et analyses
 */
const TransactionAnalyticsPage = () => {
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  
  const {
    stats,
    categoryAnalytics,
    monthlyStats,
    isLoading,
    isAnalyticsLoading,
    getTransactions
  } = useTransaction();

  // États locaux pour les filtres
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const isDark = mode === 'dark';

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await getTransactions();
  };

  const handleExportReport = () => {
    // TODO: Implémenter l'export du rapport
    console.log('Export du rapport analytics...');
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'Analytics', href: '/transactions/analytics' }
  ];

  // Options pour les périodes
  const periodOptions = [
    { value: 'week', label: '7 derniers jours' },
    { value: 'month', label: '30 derniers jours' },
    { value: 'quarter', label: '3 derniers mois' },
    { value: 'year', label: '12 derniers mois' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  // Calculer quelques statistiques avancées
  const calculateAdvancedStats = () => {
    const savingsRate = stats.totalIncome > 0 
      ? ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100 
      : 0;

    const avgDailyExpense = stats.totalExpense / 30; // Moyenne sur 30 jours
    const avgDailyIncome = stats.totalIncome / 30;

    return {
      savingsRate: savingsRate.toFixed(1),
      avgDailyExpense,
      avgDailyIncome,
      netWorth: stats.totalIncome - stats.totalExpense
    };
  };

  const advancedStats = calculateAdvancedStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate('/transactions')}
          >
            Retour
          </Button>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics des Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Vue d'ensemble détaillée de vos finances
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={handleExportReport}
          >
            Exporter le rapport
          </Button>
        </div>

        {/* Statistiques principales */}
        {isLoading ? (
          <Card variant="glass" className="p-12">
            <Loading type="spinner" text="Chargement des statistiques..." />
          </Card>
        ) : (
          <>
            {/* Cartes de statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenus */}
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge color="green" variant="subtle" size="sm">
                    Revenus
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenus
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(stats.totalIncome || 0, 'HTG')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Moyenne/jour: {formatCurrency(advancedStats.avgDailyIncome, 'HTG')}
                </p>
              </Card>

              {/* Total Dépenses */}
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <Badge color="red" variant="subtle" size="sm">
                    Dépenses
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Dépenses
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {formatCurrency(stats.totalExpense || 0, 'HTG')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Moyenne/jour: {formatCurrency(advancedStats.avgDailyExpense, 'HTG')}
                </p>
              </Card>

              {/* Solde Net */}
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg ${
                    advancedStats.netWorth >= 0
                      ? 'bg-blue-100 dark:bg-blue-900/20'
                      : 'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                    <BarChart3 className={`w-6 h-6 ${
                      advancedStats.netWorth >= 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`} />
                  </div>
                  <Badge 
                    color={advancedStats.netWorth >= 0 ? 'blue' : 'orange'} 
                    variant="subtle" 
                    size="sm"
                  >
                    Solde
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Solde Net
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  advancedStats.netWorth >= 0
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {formatCurrency(advancedStats.netWorth, 'HTG')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Différence revenus - dépenses
                </p>
              </Card>

              {/* Taux d'épargne */}
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg ${
                    parseFloat(advancedStats.savingsRate) >= 20
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : parseFloat(advancedStats.savingsRate) >= 10
                        ? 'bg-yellow-100 dark:bg-yellow-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <PieChart className={`w-6 h-6 ${
                      parseFloat(advancedStats.savingsRate) >= 20
                        ? 'text-green-600 dark:text-green-400'
                        : parseFloat(advancedStats.savingsRate) >= 10
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <Badge 
                    color={
                      parseFloat(advancedStats.savingsRate) >= 20 ? 'green' :
                      parseFloat(advancedStats.savingsRate) >= 10 ? 'yellow' : 'red'
                    } 
                    variant="subtle" 
                    size="sm"
                  >
                    Épargne
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taux d'épargne
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  parseFloat(advancedStats.savingsRate) >= 20
                    ? 'text-green-600 dark:text-green-400'
                    : parseFloat(advancedStats.savingsRate) >= 10
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {advancedStats.savingsRate}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {parseFloat(advancedStats.savingsRate) >= 20 ? 'Excellent!' :
                   parseFloat(advancedStats.savingsRate) >= 10 ? 'Bien' : 'À améliorer'}
                </p>
              </Card>
            </div>

            {/* Statistiques mensuelles */}
            <MonthlyStats
              year={selectedYear}
              onYearChange={setSelectedYear}
              months={12}
            />

            {/* Analytics par catégorie */}
            <CategoryAnalytics
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />

            {/* Insights et recommandations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insights financiers */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  💡 Insights Financiers
                </h3>
                
                <div className="space-y-4">
                  {/* Insight 1 */}
                  {parseFloat(advancedStats.savingsRate) < 10 && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                        Taux d'épargne faible
                      </h4>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Votre taux d'épargne est de {advancedStats.savingsRate}%. 
                        L'idéal est d'épargner au moins 20% de vos revenus.
                      </p>
                    </div>
                  )}

                  {/* Insight 2 */}
                  {stats.totalExpense > stats.totalIncome && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        ⚠️ Dépenses supérieures aux revenus
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Vos dépenses dépassent vos revenus de {formatCurrency(stats.totalExpense - stats.totalIncome, 'HTG')}.
                        Identifiez les dépenses à réduire.
                      </p>
                    </div>
                  )}

                  {/* Insight 3 */}
                  {parseFloat(advancedStats.savingsRate) >= 20 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        ✨ Excellente gestion
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Félicitations ! Vous épargnez {advancedStats.savingsRate}% de vos revenus.
                        Continuez sur cette lancée !
                      </p>
                    </div>
                  )}

                  {/* Insight 4 */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      📊 Moyenne quotidienne
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Vous dépensez en moyenne {formatCurrency(advancedStats.avgDailyExpense, 'HTG')} par jour.
                      {advancedStats.avgDailyIncome > 0 && (
                        <> Revenus quotidiens: {formatCurrency(advancedStats.avgDailyIncome, 'HTG')}.</>
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Recommandations */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Recommandations
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Définissez un budget mensuel
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Utilisez la section Budgets pour planifier vos dépenses par catégorie.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Suivez vos catégories de dépenses
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Identifiez les catégories où vous dépensez le plus et trouvez des économies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Automatisez vos transactions récurrentes
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gagnez du temps en configurant des transactions récurrentes automatiques.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Consultez régulièrement vos analytics
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Revenez ici chaque semaine pour suivre l'évolution de vos finances.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/budgets')}
                    className="w-full"
                  >
                    Créer un budget maintenant
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionAnalyticsPage;