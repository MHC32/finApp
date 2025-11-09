import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TrendingUp, Filter, Download } from 'lucide-react';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/format';
import { useTransaction } from '../hooks/useTransactions';
import Card from '../../../components/ui/Card';
import DonutChart from '../../../components/charts/DonutChart';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import FormDatePicker from '../../../components/forms/FormDatePicker';
import ProgressBar from '../../../components/ui/ProgressBar';
import Badge from '../../../components/ui/Badge';
import Loading from '../../../components/ui/Loading';

/**
 * Composant CategoryAnalytics - Analytics par catégorie avec graphiques
 * 
 * @example
 * <CategoryAnalytics
 *   period="month"
 *   onPeriodChange={setPeriod}
 *   className="mb-6"
 * />
 */
const CategoryAnalytics = ({
  period = 'month',
  onPeriodChange,
  className = ''
}) => {
  const { getCategoryAnalytics, categoryAnalytics, isAnalyticsLoading } = useTransaction();
  const { mode } = useSelector((state) => state.theme);
  
  const [filters, setFilters] = useState({
    type: TRANSACTION_TYPES.EXPENSE,
    startDate: '',
    endDate: '',
    limit: 10
  });

  const isDark = mode === 'dark';

  // Options pour les selects
  const typeOptions = [
    { value: TRANSACTION_TYPES.EXPENSE, label: 'Dépenses' },
    { value: TRANSACTION_TYPES.INCOME, label: 'Revenus' }
  ];

  const periodOptions = [
    { value: 'week', label: '7 derniers jours' },
    { value: 'month', label: '30 derniers jours' },
    { value: 'quarter', label: '3 derniers mois' },
    { value: 'year', label: '12 derniers mois' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  // Charger les analytics
  const loadAnalytics = async (newFilters = filters) => {
    try {
      const params = {
        ...newFilters,
        limit: parseInt(newFilters.limit)
      };
      
      // Calculer les dates selon la période
      if (period !== 'custom') {
        const now = new Date();
        const startDate = new Date();
        
        switch (period) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setDate(now.getDate() - 30);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        params.startDate = startDate.toISOString().split('T')[0];
        params.endDate = now.toISOString().split('T')[0];
      }
      
      await getCategoryAnalytics(params);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    }
  };

  // Gérer le changement de filtre
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadAnalytics(newFilters);
  };

  // Données pour le graphique
  const getChartData = () => {
    if (!categoryAnalytics || categoryAnalytics.length === 0) {
      return [];
    }

    return categoryAnalytics.map(item => {
      const categoryInfo = TRANSACTION_CATEGORIES[item._id] || TRANSACTION_CATEGORIES.autre;
      return {
        name: categoryInfo.name,
        value: item.totalAmount,
        color: categoryInfo.color,
        category: item._id,
        percentage: item.percentage
      };
    });
  };

  const chartData = getChartData();
  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  // Couleurs pour le graphique
  const chartColors = [
    '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  return (
    <Card variant="glass" className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Analytics par Catégorie
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Répartition des {filters.type === TRANSACTION_TYPES.INCOME ? 'revenus' : 'dépenses'} par catégorie
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
          >
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <Select
          options={typeOptions}
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
          size="sm"
        />

        <Select
          options={periodOptions}
          value={period}
          onChange={onPeriodChange}
          size="sm"
        />

        <Select
          options={[
            { value: 5, label: 'Top 5' },
            { value: 10, label: 'Top 10' },
            { value: 15, label: 'Top 15' }
          ]}
          value={filters.limit}
          onChange={(value) => handleFilterChange('limit', value)}
          size="sm"
        />

        {period === 'custom' && (
          <div className="grid grid-cols-2 gap-2">
            <FormDatePicker
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              placeholder="Début"
              size="sm"
            />
            <FormDatePicker
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              placeholder="Fin"
              size="sm"
            />
          </div>
        )}
      </div>

      {isAnalyticsLoading ? (
        <Loading type="spinner" text="Chargement des analytics..." />
      ) : chartData.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune donnée disponible
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Aucune transaction trouvée pour la période sélectionnée
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique Donut */}
          <div className="flex flex-col items-center">
            <DonutChart
              data={chartData}
              height={300}
              showLegend={false}
              centerText={formatCurrency(totalAmount, 'HTG')}
              centerLabel={`Total ${filters.type === TRANSACTION_TYPES.INCOME ? 'revenus' : 'dépenses'}`}
            />
            
            <div className="mt-4 text-center">
              <Badge color="teal" size="lg">
                {chartData.length} catégories
              </Badge>
            </div>
          </div>

          {/* Liste détaillée */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Détails par catégorie
            </h4>
            
            {chartData.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.name}
                    </span>
                    <Badge color="gray" variant="subtle" size="sm">
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <span className={`font-semibold ${
                    filters.type === TRANSACTION_TYPES.INCOME 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(item.value, 'HTG')}
                  </span>
                </div>
                
                <ProgressBar
                  value={item.percentage}
                  max={100}
                  size="sm"
                  color={
                    filters.type === TRANSACTION_TYPES.INCOME ? 'green' : 'red'
                  }
                  striped
                  animated
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résumé */}
      {chartData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className={`text-2xl font-bold ${
                filters.type === TRANSACTION_TYPES.INCOME 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(totalAmount, 'HTG')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Catégories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chartData.length}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalAmount / chartData.length, 'HTG')}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

CategoryAnalytics.propTypes = {
  period: PropTypes.oneOf(['week', 'month', 'quarter', 'year', 'custom']),
  onPeriodChange: PropTypes.func,
  className: PropTypes.string
};

export default CategoryAnalytics;