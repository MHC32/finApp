// src/features/budgets/components/CategoryBudgetAdjuster.jsx
import { forwardRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  PieChart,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Sparkles
} from 'lucide-react';

// Composants réutilisables
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ProgressBar from '../../../components/ui/ProgressBar';
import Alert from '../../../components/ui/Alert';

// Utilitaires
import { formatCurrency, formatPercentage } from '../../../utils/format';
import { TRANSACTION_CATEGORIES } from '../../../utils/constants';

/**
 * Composant CategoryBudgetAdjuster - Ajusteur intelligent de budget de catégorie
 * 
 * Features:
 * - Ajustement manuel et automatique
 * - Suggestions intelligentes basées sur l'historique
 * - Impact sur le budget global
 * - Simulations et projections
 * - Recommandations IA
 * - Historique des ajustements
 */
const CategoryBudgetAdjuster = forwardRef(({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  category,
  budget,
  historicalData = {},
  loading = false,
  className = '',
  ...props
}, ref) => {
  const [adjustmentType, setAdjustmentType] = useState('manual'); // 'manual', 'percentage', 'auto'
  const [adjustmentData, setAdjustmentData] = useState({
    newAmount: 0,
    adjustmentPercentage: 0,
    reason: '',
    applyToFuture: false
  });

  const [simulation, setSimulation] = useState(null);

  // Données calculées
  const computedData = useMemo(() => {
    if (!category || !budget) return null;

    const currentAmount = budget.categories?.[category.category] || 0;
    const spentAmount = category.spentAmount || 0;
    const spentPercentage = currentAmount > 0 ? (spentAmount / currentAmount) * 100 : 0;
    
    // Données historiques
    const historicalSpending = historicalData.monthlyAverage || 0;
    const trend = historicalData.trend || 0;
    const seasonality = historicalData.seasonality || {};

    // Suggestions automatiques
    const suggestions = generateSuggestions({
      currentAmount,
      spentAmount,
      spentPercentage,
      historicalSpending,
      trend,
      seasonality,
      budget
    });

    return {
      currentAmount,
      spentAmount,
      spentPercentage: Math.round(spentPercentage),
      remaining: Math.max(0, currentAmount - spentAmount),
      historicalSpending,
      trend,
      suggestions,
      isOverBudget: spentAmount > currentAmount,
      overspentAmount: Math.max(0, spentAmount - currentAmount)
    };
  }, [category, budget, historicalData]);

  // Générer des suggestions intelligentes
  const generateSuggestions = (data) => {
    const suggestions = [];

    // Suggestion basée sur l'historique
    if (data.historicalSpending > 0) {
      const historicalDiff = Math.abs(data.currentAmount - data.historicalSpending);
      const historicalPercentage = (historicalDiff / data.currentAmount) * 100;

      if (historicalPercentage > 20) {
        suggestions.push({
          type: 'historical',
          title: 'Ajustement historique',
          description: `Basé sur la moyenne de ${formatCurrency(data.historicalSpending, budget.currency)}`,
          newAmount: data.historicalSpending,
          confidence: 'high',
          reason: 'Alignement avec les dépenses historiques'
        });
      }
    }

    // Suggestion basée sur la tendance
    if (Math.abs(data.trend) > 10) {
      const trendAdjusted = data.currentAmount * (1 + data.trend / 100);
      suggestions.push({
        type: 'trend',
        title: 'Ajustement tendance',
        description: `Tendance ${data.trend > 0 ? 'haussière' : 'baissière'} de ${Math.abs(data.trend)}%`,
        newAmount: trendAdjusted,
        confidence: data.trend > 20 || data.trend < -20 ? 'high' : 'medium',
        reason: `Ajustement pour la tendance ${data.trend > 0 ? 'croissante' : 'décroissante'}`
      });
    }

    // Suggestion basée sur l'utilisation
    if (data.spentPercentage > 90) {
      const increaseAmount = data.spentAmount * 1.1; // 10% au-dessus des dépenses actuelles
      suggestions.push({
        type: 'utilization',
        title: 'Augmentation nécessaire',
        description: `Catégorie utilisée à ${data.spentPercentage}%`,
        newAmount: increaseAmount,
        confidence: 'high',
        reason: 'Budget insuffisant pour les dépenses actuelles'
      });
    } else if (data.spentPercentage < 50 && data.spentPercentage > 0) {
      const decreaseAmount = data.spentAmount * 1.2; // 20% au-dessus pour la marge
      suggestions.push({
        type: 'utilization',
        title: 'Optimisation possible',
        description: `Seulement ${data.spentPercentage}% utilisé`,
        newAmount: decreaseAmount,
        confidence: 'medium',
        reason: 'Réduction possible sans impact'
      });
    }

    // Suggestion de réallocation si dépassement
    if (data.isOverBudget) {
      suggestions.push({
        type: 'correction',
        title: 'Correction de dépassement',
        description: `Dépassement de ${formatCurrency(data.overspentAmount, budget.currency)}`,
        newAmount: data.spentAmount * 1.05, // 5% au-dessus pour la marge
        confidence: 'high',
        reason: 'Nécessaire pour couvrir le dépassement'
      });
    }

    return suggestions.sort((a, b) => {
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    });
  };

  // Gérer les changements de données d'ajustement
  const handleAdjustmentChange = (field, value) => {
    const newData = {
      ...adjustmentData,
      [field]: value
    };

    // Recalculer le pourcentage si le montant change
    if (field === 'newAmount' && computedData) {
      const percentageChange = ((value - computedData.currentAmount) / computedData.currentAmount) * 100;
      newData.adjustmentPercentage = Math.round(percentageChange * 100) / 100;
    }

    // Recalculer le montant si le pourcentage change
    if (field === 'adjustmentPercentage' && computedData) {
      const newAmount = computedData.currentAmount * (1 + value / 100);
      newData.newAmount = Math.round(newAmount * 100) / 100;
    }

    setAdjustmentData(newData);

    // Générer une simulation
    if (computedData && (field === 'newAmount' || field === 'adjustmentPercentage')) {
      generateSimulation(newData.newAmount);
    }
  };

  // Générer une simulation d'impact
  const generateSimulation = (newAmount) => {
    if (!computedData || !budget) return;

    const currentTotal = Object.values(budget.categories || {}).reduce((sum, amount) => sum + amount, 0);
    const newTotal = currentTotal - computedData.currentAmount + newAmount;
    const totalChange = newTotal - currentTotal;
    const totalChangePercentage = (totalChange / currentTotal) * 100;

    const impact = {
      newTotal,
      totalChange,
      totalChangePercentage: Math.round(totalChangePercentage * 100) / 100,
      categoryChange: newAmount - computedData.currentAmount,
      categoryChangePercentage: ((newAmount - computedData.currentAmount) / computedData.currentAmount) * 100,
      newUtilization: computedData.spentAmount > 0 ? (computedData.spentAmount / newAmount) * 100 : 0
    };

    setSimulation(impact);
  };

  // Appliquer une suggestion
  const applySuggestion = (suggestion) => {
    setAdjustmentData({
      newAmount: suggestion.newAmount,
      adjustmentPercentage: ((suggestion.newAmount - computedData.currentAmount) / computedData.currentAmount) * 100,
      reason: suggestion.reason,
      applyToFuture: true
    });
    setAdjustmentType('manual');
    generateSimulation(suggestion.newAmount);
  };

  // Soumettre l'ajustement
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!computedData) return;

    onSubmit({
      category: category.category,
      previousAmount: computedData.currentAmount,
      newAmount: adjustmentData.newAmount,
      adjustmentPercentage: adjustmentData.adjustmentPercentage,
      reason: adjustmentData.reason,
      applyToFuture: adjustmentData.applyToFuture,
      impact: simulation
    });
  };

  // Réinitialiser
  const handleReset = () => {
    if (!computedData) return;

    setAdjustmentData({
      newAmount: computedData.currentAmount,
      adjustmentPercentage: 0,
      reason: '',
      applyToFuture: false
    });
    setSimulation(null);
  };

  if (!computedData) return null;

  const categoryConfig = TRANSACTION_CATEGORIES[category.category] || {
    name: category.category,
    color: 'gray'
  };

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Ajuster le budget - ${categoryConfig.name}`}
      variant="glass"
      className={className}
      {...props}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête avec statut actuel */}
        <Card variant="teal">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: `var(--color-${categoryConfig.color})` 
                  }}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {categoryConfig.name}
                </h3>
              </div>
              
              <Badge
                color={
                  computedData.spentPercentage >= 95 ? 'red' :
                  computedData.spentPercentage >= 80 ? 'orange' :
                  computedData.spentPercentage >= 50 ? 'teal' : 'green'
                }
                variant="subtle"
              >
                {computedData.spentPercentage}% utilisé
              </Badge>
            </div>

            {/* Statistiques actuelles */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Actuel</div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(computedData.currentAmount, budget.currency)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Dépensé</div>
                <div className="font-semibold text-teal-600 dark:text-teal-400">
                  {formatCurrency(computedData.spentAmount, budget.currency)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Restant</div>
                <div className={`font-semibold ${
                  computedData.remaining > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(computedData.remaining, budget.currency)}
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <ProgressBar
              value={Math.min(computedData.spentPercentage, 100)}
              max={100}
              size="sm"
              color={
                computedData.spentPercentage >= 95 ? 'red' :
                computedData.spentPercentage >= 80 ? 'orange' : 'teal'
              }
              variant="rounded"
              showValue={true}
              className="mt-3"
            />
          </div>
        </Card>

        {/* Suggestions intelligentes */}
        {computedData.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Suggestions intelligentes
            </h4>
            
            <div className="space-y-2">
              {computedData.suggestions.slice(0, 3).map((suggestion, index) => (
                <Card
                  key={index}
                  variant="glass"
                  hoverable={true}
                  clickable={true}
                  onClick={() => applySuggestion(suggestion)}
                  className="p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {suggestion.title}
                        </span>
                        <Badge
                          size="sm"
                          color={
                            suggestion.confidence === 'high' ? 'green' :
                            suggestion.confidence === 'medium' ? 'orange' : 'gray'
                          }
                          variant="subtle"
                        >
                          {suggestion.confidence === 'high' ? 'Élevée' : 
                           suggestion.confidence === 'medium' ? 'Moyenne' : 'Faible'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {suggestion.description}
                      </p>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="font-semibold text-teal-600 dark:text-teal-400 text-sm">
                        {formatCurrency(suggestion.newAmount, budget.currency)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPercentage(((suggestion.newAmount - computedData.currentAmount) / computedData.currentAmount) * 100 / 100)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Ajustement manuel */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Ajustement manuel
          </h4>

          {/* Montant et pourcentage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nouveau montant
              </label>
              <Input
                type="number"
                value={adjustmentData.newAmount}
                onChange={(e) => handleAdjustmentChange('newAmount', Number(e.target.value))}
                leftIcon={DollarSign}
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pourcentage de changement
              </label>
              <Input
                type="number"
                value={adjustmentData.adjustmentPercentage}
                onChange={(e) => handleAdjustmentChange('adjustmentPercentage', Number(e.target.value))}
                leftIcon={adjustmentData.adjustmentPercentage >= 0 ? TrendingUp : TrendingDown}
                step="1"
              />
            </div>
          </div>

          {/* Raison de l'ajustement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raison de l'ajustement
            </label>
            <textarea
              value={adjustmentData.reason}
              onChange={(e) => handleAdjustmentChange('reason', e.target.value)}
              placeholder="Expliquez pourquoi vous ajustez ce budget..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
            />
          </div>

          {/* Option d'application future */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={adjustmentData.applyToFuture}
              onChange={(e) => handleAdjustmentChange('applyToFuture', e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                Appliquer aux périodes futures
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Utiliser ce nouveau montant pour les prochains budgets
              </div>
            </div>
          </label>
        </div>

        {/* Simulation d'impact */}
        {simulation && (
          <Card variant="blue">
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                Impact de l'ajustement
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Changement catégorie:</span>
                  <span className={`font-semibold ${
                    simulation.categoryChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {simulation.categoryChange >= 0 ? '+' : ''}{formatCurrency(simulation.categoryChange, budget.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nouvelle utilisation:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPercentage(simulation.newUtilization / 100)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Impact budget total:</span>
                  <span className={`font-semibold ${
                    simulation.totalChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {simulation.totalChange >= 0 ? '+' : ''}{formatPercentage(simulation.totalChangePercentage / 100)}
                  </span>
                </div>

                {simulation.newUtilization > 100 && (
                  <Alert
                    type="warning"
                    variant="subtle"
                    size="sm"
                    icon={AlertTriangle}
                    title="Attention: Dépassement actuel"
                    description="Les dépenses actuelles dépassent le nouveau budget proposé"
                  />
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              leftIcon={RotateCcw}
              disabled={loading}
            >
              Réinitialiser
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </Button>

              <Button
                type="submit"
                isLoading={loading}
                leftIcon={CheckCircle2}
                disabled={adjustmentData.newAmount === computedData.currentAmount}
              >
                Appliquer l'ajustement
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
});

CategoryBudgetAdjuster.displayName = 'CategoryBudgetAdjuster';

CategoryBudgetAdjuster.propTypes = {
  /** Modal ouvert/fermé */
  isOpen: PropTypes.bool,

  /** Callback fermeture */
  onClose: PropTypes.func,

  /** Callback soumission */
  onSubmit: PropTypes.func,

  /** Données de la catégorie */
  category: PropTypes.shape({
    category: PropTypes.string.isRequired,
    spentAmount: PropTypes.number.isRequired
  }),

  /** Données du budget */
  budget: PropTypes.shape({
    currency: PropTypes.string.isRequired,
    categories: PropTypes.object.isRequired
  }),

  /** Données historiques */
  historicalData: PropTypes.shape({
    monthlyAverage: PropTypes.number,
    trend: PropTypes.number,
    seasonality: PropTypes.object
  }),

  /** État de chargement */
  loading: PropTypes.bool,

  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default CategoryBudgetAdjuster;