import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Inbox, 
  Search, 
  FileX, 
  Database,
  Filter,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';

/**
 * Composant EmptyState - Affichage états vides
 * 
 * Features:
 * - Plusieurs variantes (empty, search, error, filtered)
 * - Icônes personnalisables
 * - Titre + description
 * - Actions optionnelles (boutons)
 * - Illustrations optionnelles
 * - Support Light/Dark
 * 
 * @example
 * <EmptyState
 *   variant="empty"
 *   title="Aucune transaction"
 *   description="Commencez par ajouter votre première transaction"
 *   action={
 *     <Button onClick={handleAddTransaction}>
 *       Ajouter une transaction
 *     </Button>
 *   }
 * />
 */
const EmptyState = forwardRef(({
  // Contenu
  title = '',
  description = '',
  
  // Type
  variant = 'empty',
  icon: CustomIcon = null,
  showIcon = true,
  
  // Actions
  action = null,
  secondaryAction = null,
  
  // Style
  size = 'md',
  className = ''
}, ref) => {
  // Icônes par défaut selon variante
  const defaultIcons = {
    empty: Inbox,
    search: Search,
    error: AlertCircle,
    filtered: Filter,
    nodata: Database,
    notfound: FileX
  };

  const Icon = CustomIcon || defaultIcons[variant];

  // Classes de taille
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      iconBg: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      iconBg: 'w-28 h-28',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      iconBg: 'w-36 h-36',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };

  // Couleurs selon variante
  const variantColors = {
    empty: {
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      icon: 'text-gray-400 dark:text-gray-500'
    },
    search: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    error: {
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400'
    },
    filtered: {
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400'
    },
    nodata: {
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    notfound: {
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      icon: 'text-gray-400 dark:text-gray-500'
    }
  };

  const sizes = sizeClasses[size];
  const colors = variantColors[variant];

  return (
    <div
      ref={ref}
      className={`${sizes.container} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto px-4">
        {/* Icône */}
        {showIcon && Icon && (
          <div className={`${sizes.iconBg} ${colors.iconBg} rounded-full flex items-center justify-center`}>
            <Icon className={`${sizes.icon} ${colors.icon}`} />
          </div>
        )}

        {/* Titre */}
        {title && (
          <h3 className={`${sizes.title} font-semibold text-gray-900 dark:text-white`}>
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className={`${sizes.description} text-gray-600 dark:text-gray-400`}>
            {description}
          </p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  // Contenu
  title: PropTypes.string,
  description: PropTypes.string,
  
  // Type
  variant: PropTypes.oneOf(['empty', 'search', 'error', 'filtered', 'nodata', 'notfound']),
  icon: PropTypes.elementType,
  showIcon: PropTypes.bool,
  
  // Actions
  action: PropTypes.node,
  secondaryAction: PropTypes.node,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default EmptyState;