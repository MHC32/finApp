import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical,
  Edit3,
  Eye,
  Archive,
  Trash2,
  Copy,
  Download,
  Loader
} from 'lucide-react';

// Composants réutilisables
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ProgressBar from '../../../components/ui/ProgressBar';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';

/**
 * Composant BudgetCard - Carte d'affichage d'un budget
 */
const BudgetCard = forwardRef(({
  budget,
  onView = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onDuplicate = () => {},
  onExport = () => {},
  onDelete = () => {},
  onMoreActions = () => {},
  actionLoading = null,
  className = '',
  ...props
}, ref) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!budget) return null;

  // Calculer le pourcentage de dépense
  const spentPercentage = budget.totalBudgeted > 0 
    ? Math.round((budget.totalSpent / budget.totalBudgeted) * 100)
    : 0;

  // Déterminer le statut visuel
  const getBudgetStatus = () => {
    if (budget.isArchived) return 'archived';
    if (budget.status === 'completed') return 'completed';
    if (budget.status === 'exceeded' || spentPercentage > 100) return 'exceeded';
    if (spentPercentage >= 95) return 'critical';
    if (spentPercentage >= 80) return 'warning';
    return 'active';
  };

  // Configuration des couleurs selon le statut
  const statusConfig = {
    active: {
      badge: { color: 'green', variant: 'subtle' },
      progress: { color: 'teal' },
      icon: TrendingUp,
      label: 'Actif'
    },
    warning: {
      badge: { color: 'orange', variant: 'subtle' },
      progress: { color: 'orange' },
      icon: TrendingUp,
      label: 'Attention'
    },
    critical: {
      badge: { color: 'red', variant: 'subtle' },
      progress: { color: 'red' },
      icon: TrendingUp,
      label: 'Critique'
    },
    exceeded: {
      badge: { color: 'red', variant: 'solid' },
      progress: { color: 'red' },
      icon: TrendingDown,
      label: 'Dépassé'
    },
    completed: {
      badge: { color: 'blue', variant: 'subtle' },
      progress: { color: 'blue' },
      icon: TrendingUp,
      label: 'Terminé'
    },
    archived: {
      badge: { color: 'gray', variant: 'subtle' },
      progress: { color: 'gray' },
      icon: Archive,
      label: 'Archivé'
    }
  };

  const status = getBudgetStatus();
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-HT', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Formater la devise
  const formatCurrency = (amount, currency = 'HTG') => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: currency === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('HTG', 'G');
  };

  // Calculer les jours restants
  const getRemainingDays = () => {
    const endDate = new Date(budget.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const remainingDays = getRemainingDays();

  // Vérifier si une action est en cours
  const isActionLoading = (actionType) => {
    return actionLoading === `${actionType}-${budget._id}`;
  };

  // Gérer les actions du dropdown
  const handleMoreActions = (action) => {
    setShowDropdown(false);
    switch (action) {
      case 'duplicate':
        onDuplicate(budget);
        break;
      case 'export':
        onExport(budget);
        break;
      case 'archive':
        onArchive(budget);
        break;
      case 'delete':
        onDelete(budget);
        break;
      default:
        onMoreActions(budget, action);
    }
  };

  return (
    <Card
      ref={ref}
      variant="glass"
      hoverable={!budget.isArchived}
      className={`relative overflow-hidden ${budget.isArchived ? 'opacity-75' : ''} ${className}`}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {/* Nom et Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {budget.name}
            </h3>
            <Badge
              size="sm"
              color={config.badge.color}
              variant={config.badge.variant}
              leftIcon={StatusIcon}
            >
              {config.label}
            </Badge>
          </div>

          {/* Période et Dates */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="capitalize">
                {budget.period === 'monthly' ? 'Mensuel' : 
                 budget.period === 'weekly' ? 'Hebdomadaire' : 
                 budget.period === 'yearly' ? 'Annuel' : 'Trimestriel'}
              </span>
            </div>
            <span>•</span>
            <span>
              {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
            </span>
            {remainingDays > 0 && (
              <>
                <span>•</span>
                <span className={remainingDays <= 7 ? 'text-orange-500 font-medium' : ''}>
                  {remainingDays} jour{remainingDays > 1 ? 's' : ''} restant{remainingDays > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Menu Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(budget)}
            leftIcon={Eye}
            className="text-gray-500 hover:text-teal-600"
            title="Voir les détails"
            disabled={isActionLoading('view')}
          >
            Voir
          </Button>
          
          {!budget.isArchived && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(budget)}
              leftIcon={Edit3}
              className="text-gray-500 hover:text-blue-600"
              title="Modifier le budget"
              disabled={isActionLoading('edit')}
            >
              Éditer
            </Button>
          )}
          
          {/* Dropdown pour plus d'actions */}
          <Dropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDropdown(!showDropdown)}
                leftIcon={MoreVertical}
                className="text-gray-500 hover:text-gray-700"
                title="Plus d'actions"
                disabled={isActionLoading('more')}
              />
            }
            placement="bottom-end"
          >
            <Dropdown.Item
              onClick={() => handleMoreActions('duplicate')}
              leftIcon={isActionLoading('duplicate') ? Loader : Copy}
              disabled={isActionLoading('duplicate')}
              className={isActionLoading('duplicate') ? 'opacity-50' : ''}
            >
              {isActionLoading('duplicate') ? 'Duplication...' : 'Dupliquer'}
            </Dropdown.Item>
            
            <Dropdown.Item
              onClick={() => handleMoreActions('export')}
              leftIcon={isActionLoading('export') ? Loader : Download}
              disabled={isActionLoading('export')}
              className={isActionLoading('export') ? 'opacity-50' : ''}
            >
              {isActionLoading('export') ? 'Export...' : 'Exporter'}
            </Dropdown.Item>
            
            <Dropdown.Separator />
            
            <Dropdown.Item
              onClick={() => handleMoreActions('archive')}
              leftIcon={isActionLoading('archive') ? Loader : Archive}
              disabled={isActionLoading('archive')}
              className={`${isActionLoading('archive') ? 'opacity-50' : ''} ${
                budget.isArchived ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {isActionLoading('archive') 
                ? 'Archivage...' 
                : budget.isArchived ? 'Désarchiver' : 'Archiver'
              }
            </Dropdown.Item>
            
            <Dropdown.Item
              onClick={() => handleMoreActions('delete')}
              leftIcon={isActionLoading('delete') ? Loader : Trash2}
              disabled={isActionLoading('delete')}
              className={`${isActionLoading('delete') ? 'opacity-50' : ''} text-red-600`}
            >
              {isActionLoading('delete') ? 'Suppression...' : 'Supprimer'}
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      {/* Barre de Progression */}
      <div className="mb-4">
        <ProgressBar
          value={Math.min(spentPercentage, 100)}
          max={100}
          size="md"
          color={config.progress.color}
          variant="rounded"
          showValue={false}
          striped={spentPercentage >= 80}
          animated={spentPercentage >= 95}
        />
        
        {/* Légende Progression */}
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600 dark:text-gray-400">
            {spentPercentage}% utilisé
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(budget.totalSpent, budget.currency)} / {formatCurrency(budget.totalBudgeted, budget.currency)}
          </span>
        </div>
      </div>

      {/* Stats Rapides */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400 mb-1">Restant</div>
          <div className="font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(budget.totalBudgeted - budget.totalSpent, budget.currency)}
          </div>
        </div>
        
        <div>
          <div className="text-gray-500 dark:text-gray-400 mb-1">Moyenne/jour</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(
              budget.totalSpent / Math.max(1, (new Date() - new Date(budget.startDate)) / (1000 * 60 * 60 * 24)), 
              budget.currency
            )}
          </div>
        </div>
      </div>

      {/* Indicateur d'alerte visuel */}
      {(status === 'warning' || status === 'critical' || status === 'exceeded') && (
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-current to-transparent opacity-20">
          <div className={`w-full h-full ${
            status === 'warning' ? 'bg-orange-500' :
            status === 'critical' ? 'bg-red-500' :
            'bg-red-600'
          }`} />
        </div>
      )}

      {/* Overlay de chargement */}
      {actionLoading && actionLoading.includes(budget._id) && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center rounded-lg">
          <Loader className="w-6 h-6 text-teal-600 animate-spin" />
        </div>
      )}
    </Card>
  );
});

BudgetCard.displayName = 'BudgetCard';

BudgetCard.propTypes = {
  budget: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    period: PropTypes.oneOf(['weekly', 'monthly', 'quarterly', 'yearly']).isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    totalBudgeted: PropTypes.number.isRequired,
    totalSpent: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['draft', 'active', 'completed', 'exceeded', 'paused']),
    isArchived: PropTypes.bool,
    currency: PropTypes.oneOf(['HTG', 'USD'])
  }).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
  onDuplicate: PropTypes.func,
  onExport: PropTypes.func,
  onDelete: PropTypes.func,
  onMoreActions: PropTypes.func,
  actionLoading: PropTypes.string,
  className: PropTypes.string
};

export default BudgetCard;