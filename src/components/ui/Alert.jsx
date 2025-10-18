import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  X,
  Lightbulb
} from 'lucide-react';

/**
 * Composant Alert - Messages informatifs statiques
 * 
 * Features:
 * - 4 types (info, success, warning, error)
 * - Variants (solid, outlined, subtle, left-accent)
 * - Icônes personnalisables
 * - Titre + description
 * - Bouton fermer (dismissible)
 * - Actions personnalisées
 * - Support Light/Dark
 * 
 * @example
 * <Alert
 *   type="success"
 *   title="Succès !"
 *   description="Votre transaction a été enregistrée."
 *   onClose={() => {}}
 * />
 */
const Alert = forwardRef(({
  // Type
  type = 'info',
  
  // Contenu
  title = '',
  description = '',
  children,
  
  // Configuration
  variant = 'subtle',
  icon: CustomIcon = null,
  showIcon = true,
  dismissible = false,
  onClose = () => {},
  
  // Actions
  actions = null,
  
  // Style
  size = 'md',
  className = ''
}, ref) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  // Icônes par défaut selon le type
  const defaultIcons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    tip: Lightbulb
  };

  const Icon = CustomIcon || defaultIcons[type];

  // Configuration des couleurs par type
  const typeConfig = {
    info: {
      solid: 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500',
      outlined: 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 border-blue-500 dark:border-blue-400',
      subtle: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'left-accent': 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-l-blue-600 dark:border-l-blue-400',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    success: {
      solid: 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500',
      outlined: 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 border-green-500 dark:border-green-400',
      subtle: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      'left-accent': 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-l-green-600 dark:border-l-green-400',
      icon: 'text-green-600 dark:text-green-400'
    },
    warning: {
      solid: 'bg-orange-600 dark:bg-orange-500 text-white border-orange-600 dark:border-orange-500',
      outlined: 'bg-white dark:bg-gray-900 text-orange-700 dark:text-orange-400 border-orange-500 dark:border-orange-400',
      subtle: 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      'left-accent': 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-l-orange-600 dark:border-l-orange-400',
      icon: 'text-orange-600 dark:text-orange-400'
    },
    error: {
      solid: 'bg-red-600 dark:bg-red-500 text-white border-red-600 dark:border-red-500',
      outlined: 'bg-white dark:bg-gray-900 text-red-700 dark:text-red-400 border-red-500 dark:border-red-400',
      subtle: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      'left-accent': 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-l-red-600 dark:border-l-red-400',
      icon: 'text-red-600 dark:text-red-400'
    },
    tip: {
      solid: 'bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500',
      outlined: 'bg-white dark:bg-gray-900 text-teal-700 dark:text-teal-400 border-teal-500 dark:border-teal-400',
      subtle: 'bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      'left-accent': 'bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 border-l-teal-600 dark:border-l-teal-400',
      icon: 'text-teal-600 dark:text-teal-400'
    }
  };

  // Classes de taille
  const sizeClasses = {
    sm: 'p-3 text-sm gap-2',
    md: 'p-4 text-base gap-3',
    lg: 'p-5 text-lg gap-4'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const config = typeConfig[type];
  const colorClasses = config[variant];
  const iconColorClass = variant === 'solid' ? '' : config.icon;

  return (
    <div
      ref={ref}
      role="alert"
      className={`
        ${sizeClasses[size]}
        ${colorClasses}
        ${variant === 'left-accent' ? 'border-l-4 border-y border-r' : 'border'}
        rounded-lg
        flex items-start
        ${className}
      `}
    >
      {/* Icône */}
      {showIcon && Icon && (
        <div className="flex-shrink-0">
          <Icon className={`${iconSizes[size]} ${iconColorClass}`} />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold ${description || children ? 'mb-1' : ''}`}>
            {title}
          </h4>
        )}
        
        {description && (
          <p className={`${variant === 'solid' ? 'opacity-90' : 'opacity-80'}`}>
            {description}
          </p>
        )}
        
        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="mt-3 flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Bouton fermer */}
      {dismissible && (
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 p-1 rounded
            ${variant === 'solid' 
              ? 'hover:bg-white/20' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
          `}
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

Alert.propTypes = {
  // Type
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'tip']),
  
  // Contenu
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  
  // Configuration
  variant: PropTypes.oneOf(['solid', 'outlined', 'subtle', 'left-accent']),
  icon: PropTypes.elementType,
  showIcon: PropTypes.bool,
  dismissible: PropTypes.bool,
  onClose: PropTypes.func,
  
  // Actions
  actions: PropTypes.node,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Alert;