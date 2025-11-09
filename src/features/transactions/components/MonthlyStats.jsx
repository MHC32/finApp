import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { TRANSACTION_TYPES } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/format';
import { useTransaction } from '../hooks/useTransactions';
import Card from '../../../components/ui/Card';
import LineChart from '../../../components/charts/LineChart';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Loading from '../../../components/ui/Loading';

/**
 * Composant MonthlyStats - Statistiques mensuelles avec graphiques
 * 
 * @example
 * <MonthlyStats
 *   year={2024}
 *   onYearChange={setYear}
 *   className="mb-6"
 * />
 */
const MonthlyStats = ({
  year = new Date().getFullYear(),
  onYearChange,
  months = 12,
  className = ''
}) => {
  const { getMonthlyStats, monthlyStats, isAnalyticsLoading } = useTransaction();
  const { mode } = useSelector((state) => state.theme);
  
  const [selectedMetric, setSelectedMetric] = useState('net'); // 'net', 'income', 'expense'

  const isDark = mode === 'dark';

  // Options pour les années
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  // Charger les statistiques
  useEffect(() => {
    loadStats();
  }, [year, months]);

  const loadStats = async () => {
    try {
      await getMonthlyStats({ year, months });
    } catch (error) {
      console.error('Erreur chargement stats mensuelles:', error);
    }
  };

  // Préparer les données pour le graphique
  const getChartData = () => {
    if (!monthlyStats || monthlyStats.length === 0) {
      return [];
    }

    return monthlyStats.map(month => {
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthName = monthNames[month.month - 1];
      
      return {
        name: `${monthName} ${month.year}`,
        income: month.income || 0,
        expense: month.expense || 0,
        net: month.net || 0,
        totalTransactions: month.totalTransactions || 0
      };
    });
  };

  const chartData = getChartData();

  // Configuration des lignes du graphique selon la métrique sélectionnée
  const getChartLines = () => {
    switch (selectedMetric) {
      case 'income':
        return [{
          dataKey: 'income',
          name: 'Revenus',
          color: '#10b981' // green-500
        }];
      
      case 'expense':
        return [{
          dataKey: 'expense',
          name: 'Dépenses',
          color: '#ef4444' // red-500
        }];
      
      case 'net':
      default:
        return [
          {
            dataKey: 'income',
            name: 'Revenus',
            color: '#10b981'
          },
          {
            dataKey: 'expense',
            name: 'Dépenses',
            color: '#ef4444'
          },
          {
            dataKey: 'net',
            name: 'Solde Net',
            color: '#3b82f6' // blue-500
          }
        ];
    }
  };

  // Calculer les totaux
  const totals = monthlyStats ? monthlyStats.reduce((acc, month) => ({
    income: acc.income + (month.income || 0),
    expense: acc.expense + (month.expense || 0),
    net: acc.net + (month.net || 0),
    transactions: acc.transactions + (month.totalTransactions || 0)
  }), { income: 0, expense: 0, net: 0, transactions: 0 }) : null;

  // Trouver les meilleurs/moins bons mois
  const bestMonth = monthlyStats && monthlyStats.length > 0 
    ? monthlyStats.reduce((best, month) => month.net > best.net ? month : best)
    : null;

  const worstMonth = monthlyStats && monthlyStats.length > 0 
    ? monthlyStats.reduce((worst, month) => month.net < worst.net ? month : worst)
    : null;

  return (
    <Card variant="glass" className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Statistiques Mensuelles
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Évolution des finances sur {months} mois
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sélecteur de métrique */}
          <Select
            options={[
              { value: 'net', label: 'Solde Net' },
              { value: 'income', label: 'Revenus' },
              { value: 'expense', label: 'Dépenses' }
            ]}
            value={selectedMetric}
            onChange={setSelectedMetric}
            size="sm"
          />

          {/* Sélecteur d'année */}
          <Select
            options={yearOptions}
            value={year}
            onChange={onYearChange}
            size="sm"
          />
        </div>
      </div>

      {isAnalyticsLoading ? (
        <Loading type="spinner" text="Chargement des statistiques..." />
      ) : !monthlyStats || monthlyStats.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune donnée disponible
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Aucune transaction trouvée pour l'année {year}
          </p>
        </div>
      ) : (
        <>
          {/* Graphique */}
          <div className="mb-8">
            <LineChart
              data={chartData}
              lines={getChartLines()}
              height={300}
              xAxisKey="name"
              showGrid
              showLegend
              curved
            />
          </div>

          {/* Résumé des totaux */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card variant="glass" className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Revenus Totaux
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totals.income, 'HTG')}
              </p>
            </Card>

            <Card variant="glass" className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Dépenses Totales
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totals.expense, 'HTG')}
              </p>
            </Card>

            <Card variant="glass" className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Solde Net
                </span>
              </div>
              <p className={`text-2xl font-bold ${
                totals.net >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(totals.net, 'HTG')}
              </p>
            </Card>

            <Card variant="glass" className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ArrowDownLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Transactions
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totals.transactions}
              </p>
            </Card>
          </div>

          {/* Meilleurs/moins bons mois */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meilleur mois */}
            {bestMonth && bestMonth.net > 0 && (
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Meilleur mois
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(bestMonth.year, bestMonth.month - 1).toLocaleDateString('fr-HT', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge color="green" size="lg">
                    +{formatCurrency(bestMonth.net, 'HTG')}
                  </Badge>
                </div>
              </Card>
            )}

            {/* Mois le plus difficile */}
            {worstMonth && worstMonth.net < 0 && (
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Mois le plus difficile
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(worstMonth.year, worstMonth.month - 1).toLocaleDateString('fr-HT', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge color="red" size="lg">
                    {formatCurrency(worstMonth.net, 'HTG')}
                  </Badge>
                </div>
              </Card>
            )}
          </div>

          {/* Statistiques avancées */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Statistiques Avancées
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">Revenu moyen/mois</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.income / monthlyStats.length, 'HTG')}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">Dépense moyenne/mois</p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(totals.expense / monthlyStats.length, 'HTG')}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">Transactions/mois</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">
                  {Math.round(totals.transactions / monthlyStats.length)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

MonthlyStats.propTypes = {
  year: PropTypes.number,
  onYearChange: PropTypes.func,
  months: PropTypes.number,
  className: PropTypes.string
};

export default MonthlyStats;