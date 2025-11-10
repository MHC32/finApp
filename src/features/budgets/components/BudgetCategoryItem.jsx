// src/features/budgets/components/BudgetCategoryItem.jsx
import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  MoreVertical, 
  Edit3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Composants réutilisables
import ProgressBar from '../../../components/ui/ProgressBar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

/**
 * Composant BudgetCategoryItem - Item d'une catégorie dans un budget
 * 
 * Features:
 * - Affichage détaillé catégorie avec progression
 * - Mode expandable pour détails avancés
 * - Indicateurs visuels (dépassement, bon suivi)
 * - Actions rapides (éditer, ajuster)
 * - Support transactions récentes
 * - Couleurs selon catégories
 * 
 * @example
 * <BudgetCategoryItem
 *   category={{
 *     category: 'alimentation',
 *     budgetedAmount: 15000,
 *     spentAmount: 12000,
 *     priority: 'high',
 *     isFlexible: true,
 *     recentTransactions: [...]
 *   }}
 *   currency="HTG"
 *   alertSettings={{ warningThreshold: 80, criticalThreshold: 95 }}
 *   onEdit={handleEditCategory}
 *   expandable={true}
 * />
 */
const BudgetCategoryItem = forwardRef(({
  category,
  currency = 'HTG',
  alertSettings = {
    warningThreshold: 80,
    criticalThreshold: 95
  },
  onEdit = () => {},
  onAdjust = () => {},
  onViewTransactions = () => {},
  expandable = false,
  defaultExpanded = false,
  showTransactions = false,
  className = '',
  ...props
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!category) return null;

  // Calculs
  const spentPercentage = category.budgetedAmount > 0 
    ? Math.round((category.spentAmount / category.budgetedAmount) * 100)
    : 0;
  const remaining = Math.max(0, category.budgetedAmount - category.spentAmount);
  const isOverBudget = category.spentAmount > category.budgetedAmount;
  const overspentAmount = isOverBudget ? category.spentAmount - category.budgetedAmount : 0;

  // Déterminer le statut
  const getCategoryStatus = () => {
    if (isOverBudget) return 'exceeded';
    if (spentPercentage >= alertSettings.criticalThreshold) return 'critical';
    if (spentPercentage >= alertSettings.warningThreshold) return 'warning';
    return 'healthy';
  };

  // Configuration des couleurs par catégorie
  const categoryColors = {
    alimentation: { primary: '#ef4444', light: '#fef2f2', dark: '#7f1d1d' },
    transport: { primary: '#3b82f6', light: '#eff6ff', dark: '#1e3a8a' },
    logement: { primary: '#8b5cf6', light: '#faf5ff', dark: '#4c1d95' },
    sante: { primary: '#10b981', light: '#f0fdf4', dark: '#064e3b' },
    education: { primary: '#f59e0b', light: '#fffbeb', dark: '#78350f' },
    loisirs: { primary: '#ec4899', light: '#fdf2f8', dark: '#831843' },
    factures: { primary: '#6b7280', light: '#f9fafb', dark: '#374151' },
    vetements: { primary: '#06b6d4', light: '#ecfeff', dark: '#164e63' },
    epargne: { primary: '#84cc16', light: '#f7fee7', dark: '#365314' },
    investment: { primary: '#f97316', light: '#fff7ed', dark: '#7c2d12' },
    sol: { primary: '#7c3aed', light: '#faf5ff', dark: '#4c1d95' },
    other: { primary: '#6b7280', light: '#f9fafb', dark: '#374151' }
  };

  // Configuration selon statut
  const statusConfig = {
    healthy: {
      color: 'green',
      icon: CheckCircle2,
      badgeVariant: 'subtle',
      progressColor: 'teal'
    },
    warning: {
      color: 'orange',
      icon: AlertTriangle,
      badgeVariant: 'subtle',
      progressColor: 'orange'
    },
    critical: {
      color: 'red',
      icon: TrendingUp,
      badgeVariant: 'subtle',
      progressColor: 'red'
    },
    exceeded: {
      color: 'red',
      icon: TrendingDown,
      badgeVariant: 'solid',
      progressColor: 'red'
    }
  };

  const status = getCategoryStatus();
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const categoryColor = categoryColors[category.category] || categoryColors.other;

  // Formater la devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: currency === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('HTG', 'G');
  };

  // Obtenir le nom d'affichage de la catégorie
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

  return (
    <div
      ref={ref}
      className={`
        bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700
        transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600
        ${isExpanded ? 'shadow-sm' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Header principal */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Colonne gauche - Info catégorie */}
          <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
              {/* Indicateur couleur catégorie */}
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: categoryColor.primary }}
              />

              {/* Nom catégorie et badge */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {getCategoryName(category.category)}
                </h4>
                
                <Badge
                  size="sm"
                  color={config.color}
                  variant={config.badgeVariant}
                  leftIcon={StatusIcon}
                >
                  {spentPercentage}%
                </Badge>

                {category.priority === 'high' && (
                  <Badge size="sm" color="red" variant="subtle">
                    Prioritaire
                  </Badge>
                )}

                {category.isFlexible && (
                  <Badge size="sm" color="blue" variant="subtle">
                    Flexible
                  </Badge>
                )}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-2">
              <ProgressBar
                value={Math.min(spentPercentage, 100)}
                max={100}
                size="sm"
                color={config.progressColor}
                variant="rounded"
                showValue={false}
                striped={status === 'warning' || status === 'critical'}
                animated={status === 'exceeded'}
              />
            </div>

            {/* Chiffres clés */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Budgeté</div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(category.budgetedAmount)}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Dépensé</div>
                <div className={`font-semibold ${
                  status === 'healthy' ? 'text-teal-600 dark:text-teal-400' :
                  status === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(category.spentAmount)}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Restant</div>
                <div className={`font-semibold ${
                  remaining > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(remaining)}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Actions */}
          <div className="flex items-start gap-1 flex-shrink-0">
            {expandable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              leftIcon={Edit3}
              className="text-gray-500 hover:text-blue-600"
            >
              Ajuster
            </Button>
          </div>
        </div>
      </div>

      {/* Section expandable - Détails avancés */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Notes de la catégorie */}
          {category.notes && (
            <div className="mb-3">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded px-3 py-2">
                {category.notes}
              </p>
            </div>
          )}

          {/* Détails du dépassement */}
          {isOverBudget && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                <TrendingDown className="w-4 h-4" />
                <span className="font-medium">Dépassement de budget</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Vous avez dépassé le budget de {formatCurrency(overspentAmount)} ({Math.round((overspentAmount / category.budgetedAmount) * 100)}%)
              </p>
            </div>
          )}

          {/* Transactions récentes */}
          {showTransactions && category.recentTransactions && category.recentTransactions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Dernières transactions
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTransactions(category)}
                  className="text-xs text-teal-600 dark:text-teal-400"
                >
                  Voir tout
                </Button>
              </div>
              
              <div className="space-y-2">
                {category.recentTransactions.slice(0, 3).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                    <span className="text-gray-700 dark:text-gray-300 truncate">
                      {transaction.description || 'Transaction'}
                    </span>
                    <span className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions supplémentaires */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAdjust(category)}
              className="text-xs"
            >
              Ajuster le budget
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewTransactions(category)}
              className="text-xs"
            >
              Voir transactions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

BudgetCategoryItem.displayName = 'BudgetCategoryItem';

BudgetCategoryItem.propTypes = {
  /** Données de la catégorie */
  category: PropTypes.shape({
    category: PropTypes.oneOf([
      'alimentation', 'transport', 'logement', 'sante', 'education',
      'loisirs', 'factures', 'vetements', 'epargne', 'investment',
      'sol', 'other'
    ]).isRequired,
    budgetedAmount: PropTypes.number.isRequired,
    spentAmount: PropTypes.number.isRequired,
    priority: PropTypes.oneOf(['high', 'medium', 'low']),
    isFlexible: PropTypes.bool,
    notes: PropTypes.string,
    recentTransactions: PropTypes.array
  }).isRequired,
  
  /** Devise */
  currency: PropTypes.oneOf(['HTG', 'USD']),
  
  /** Paramètres d'alerte */
  alertSettings: PropTypes.shape({
    warningThreshold: PropTypes.number,
    criticalThreshold: PropTypes.number
  }),
  
  /** Callback édition */
  onEdit: PropTypes.func,
  
  /** Callback ajustement budget */
  onAdjust: PropTypes.func,
  
  /** Callback voir transactions */
  onViewTransactions: PropTypes.func,
  
  /** Peut être expandé */
  expandable: PropTypes.bool,
  
  /** Expandé par défaut */
  defaultExpanded: PropTypes.bool,
  
  /** Afficher les transactions */
  showTransactions: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default BudgetCategoryItem;