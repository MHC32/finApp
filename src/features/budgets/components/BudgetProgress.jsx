// src/features/budgets/components/BudgetProgress.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2,
  Info,
  Target
} from 'lucide-react';

// Composants réutilisables
import ProgressBar from '../../../components/ui/ProgressBar';
import Badge from '../../../components/ui/Badge';
import Alert from '../../../components/ui/Alert';

/**
 * Composant BudgetProgress - Barre de progression avancée pour budgets
 * 
 * Features:
 * - Barre de progression avec seuils d'alerte visuels
 * - Indicateurs de seuils (80%, 95%, 100%)
 * - Messages d'alerte contextuels
 * - Mode compact/détaillé
 * - Support multi-devises (HTG/USD)
 * - Animations smooth
 * 
 * @example
 * <BudgetProgress
 *   budgeted={50000}
 *   spent={35000}
 *   currency="HTG"
 *   alertSettings={{
 *     warningThreshold: 80,
 *     criticalThreshold: 95
 *   }}
 *   showDetails={true}
 *   size="md"
 * />
 */
const BudgetProgress = forwardRef(({
  // Données budget
  budgeted = 0,
  spent = 0,
  currency = 'HTG',
  
  // Paramètres d'alerte
  alertSettings = {
    warningThreshold: 80,
    criticalThreshold: 95
  },
  
  // Affichage
  showDetails = true,
  showAlerts = true,
  showThresholds = true,
  size = 'md',
  variant = 'default',
  
  // Labels personnalisés
  label = 'Progression du budget',
  formatValue = null,
  
  className = '',
  ...props
}, ref) => {
  // Calculs
  const remaining = Math.max(0, budgeted - spent);
  const spentPercentage = budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0;
  const isOverBudget = spent > budgeted;
  const overspentAmount = isOverBudget ? spent - budgeted : 0;

  // Formater la devise
  const formatCurrency = (amount, curr = currency) => {
    if (formatValue) return formatValue(amount, curr);
    
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: curr === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('HTG', 'G');
  };


  // Déterminer le statut
  const getBudgetStatus = () => {
    if (spentPercentage >= alertSettings.criticalThreshold || isOverBudget) {
      return 'critical';
    }
    if (spentPercentage >= alertSettings.warningThreshold) {
      return 'warning';
    }
    if (spentPercentage >= 100) {
      return 'exceeded';
    }
    return 'healthy';
  };

  // Configuration selon statut
  const statusConfig = {
    healthy: {
      color: 'teal',
      icon: CheckCircle2,
      message: 'Budget en bonne santé',
      badgeVariant: 'subtle'
    },
    warning: {
      color: 'orange',
      icon: AlertTriangle,
      message: `Attention : ${spentPercentage}% du budget utilisé`,
      badgeVariant: 'subtle'
    },
    critical: {
      color: 'red',
      icon: AlertCircle,
      message: `Critique : ${spentPercentage}% du budget utilisé`,
      badgeVariant: 'solid'
    },
    exceeded: {
      color: 'red',
      icon: AlertCircle,
      message: `Dépassement : ${formatCurrency(overspentAmount, currency)} au-dessus du budget`,
      badgeVariant: 'solid'
    }
  };

  const status = getBudgetStatus();
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  
  // Classes de taille
  const sizeClasses = {
    sm: {
      progress: 'sm',
      text: 'text-sm',
      gap: 'gap-2'
    },
    md: {
      progress: 'md',
      text: 'text-base',
      gap: 'gap-3'
    },
    lg: {
      progress: 'lg',
      text: 'text-lg',
      gap: 'gap-4'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div
      ref={ref}
      className={`space-y-3 ${className}`}
      {...props}
    >
      {/* Header avec label et statut */}
      {showDetails && (
        <div className={`flex items-center justify-between ${sizes.gap}`}>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className={`font-medium text-gray-900 dark:text-white ${sizes.text}`}>
              {label}
            </span>
          </div>
          
          <Badge
            size="sm"
            color={config.color}
            variant={config.badgeVariant}
            leftIcon={StatusIcon}
          >
            {spentPercentage}%
          </Badge>
        </div>
      )}

      {/* Barre de progression avec indicateurs de seuils */}
      <div className="relative">
        <ProgressBar
          value={Math.min(spentPercentage, 100)}
          max={100}
          size={sizes.progress}
          color={config.color}
          variant="rounded"
          striped={status === 'warning' || status === 'critical'}
          animated={status === 'critical' || isOverBudget}
          showValue={false}
        />

        {/* Indicateurs de seuils */}
        {showThresholds && budgeted > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Seuil warning */}
            {alertSettings.warningThreshold > 0 && alertSettings.warningThreshold < 100 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-400"
                style={{ left: `${alertSettings.warningThreshold}%` }}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 rounded-full" />
              </div>
            )}

            {/* Seuil critical */}
            {alertSettings.criticalThreshold > 0 && alertSettings.criticalThreshold < 100 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                style={{ left: `${alertSettings.criticalThreshold}%` }}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Détails chiffrés */}
      {showDetails && (
        <div className={`grid grid-cols-3 gap-4 ${sizes.text}`}>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-1">Budgeté</div>
            <div className="font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(budgeted)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-1">Dépensé</div>
            <div className={`font-semibold ${
              status === 'healthy' ? 'text-teal-600 dark:text-teal-400' :
              status === 'warning' ? 'text-orange-600 dark:text-orange-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(spent)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-1">Restant</div>
            <div className={`font-semibold ${
              remaining > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>
      )}

      {/* Alertes contextuelles */}
      {showAlerts && status !== 'healthy' && (
        <Alert
          type={status === 'warning' ? 'warning' : 'error'}
          variant="subtle"
          size="sm"
          icon={config.icon}
          title={config.message}
          dismissible={false}
        >
          {status === 'exceeded' && (
            <div className="text-sm mt-1">
              Vous avez dépassé votre budget de {formatCurrency(overspentAmount)}.
              {overspentAmount > budgeted * 0.1 && ' Considérez ajuster votre budget.'}
            </div>
          )}
          
          {status === 'critical' && spentPercentage < 100 && (
            <div className="text-sm mt-1">
              À ce rythme, vous risquez de dépasser votre budget avant la fin de la période.
            </div>
          )}
        </Alert>
      )}

      {/* Légende des seuils */}
      {showThresholds && showDetails && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            {alertSettings.warningThreshold > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span>Alerte ({alertSettings.warningThreshold}%)</span>
              </div>
            )}
            
            {alertSettings.criticalThreshold > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Critique ({alertSettings.criticalThreshold}%)</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Seuils configurables</span>
          </div>
        </div>
      )}
    </div>
  );
});

BudgetProgress.displayName = 'BudgetProgress';

BudgetProgress.propTypes = {
  /** Montant budgeté */
  budgeted: PropTypes.number.isRequired,
  
  /** Montant déjà dépensé */
  spent: PropTypes.number.isRequired,
  
  /** Devise (HTG/USD) */
  currency: PropTypes.oneOf(['HTG', 'USD']),
  
  /** Paramètres d'alerte */
  alertSettings: PropTypes.shape({
    warningThreshold: PropTypes.number,
    criticalThreshold: PropTypes.number
  }),
  
  /** Afficher les détails chiffrés */
  showDetails: PropTypes.bool,
  
  /** Afficher les alertes contextuelles */
  showAlerts: PropTypes.bool,
  
  /** Afficher les indicateurs de seuils */
  showThresholds: PropTypes.bool,
  
  /** Taille du composant */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  
  /** Variante d'affichage */
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),
  
  /** Label personnalisé */
  label: PropTypes.string,
  
  /** Fonction de formatage personnalisée */
  formatValue: PropTypes.func,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

// Variantes pré-configurées
BudgetProgress.Compact = forwardRef((props, ref) => (
  <BudgetProgress
    ref={ref}
    showDetails={false}
    showAlerts={false}
    showThresholds={false}
    size="sm"
    {...props}
  />
));
BudgetProgress.Compact.displayName = 'BudgetProgress.Compact';

BudgetProgress.Detailed = forwardRef((props, ref) => (
  <BudgetProgress
    ref={ref}
    showDetails={true}
    showAlerts={true}
    showThresholds={true}
    size="lg"
    {...props}
  />
));
BudgetProgress.Detailed.displayName = 'BudgetProgress.Detailed';

export default BudgetProgress;