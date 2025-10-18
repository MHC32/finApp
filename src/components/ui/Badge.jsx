// src/components/ui/Badge.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Composant Badge pour statuts, labels, compteurs
 * Support couleurs Haiti, variantes, tailles, icônes
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Badge = forwardRef(({
  children,
  variant = 'solid',
  color = 'gray',
  size = 'md',
  shape = 'rounded',
  dot = false,
  removable = false,
  onRemove,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  ...props
}, ref) => {

  // Classes de base
  const baseClasses = `
    inline-flex items-center gap-1
    font-medium
    transition-all duration-200
  `;

  // Classes selon la taille
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Classes selon la forme
  const shapeClasses = {
    rounded: 'rounded',
    pill: 'rounded-full',
    square: 'rounded-none',
  };

  // Taille des icônes selon la taille du badge
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  // Classes selon la variante et la couleur
  const getVariantClasses = () => {
    const colorMap = {
      // Teal (Turquoise Haiti) 🌊
      teal: {
        solid: 'bg-haiti-teal text-white',
        outline: 'bg-transparent border border-haiti-teal text-haiti-teal dark:text-haiti-teal-light',
        subtle: 'bg-haiti-teal/10 text-haiti-teal dark:text-haiti-teal-light border border-haiti-teal/20',
      },
      // Blue (Bleu Haiti) 🔵
      blue: {
        solid: 'bg-haiti-blue text-white',
        outline: 'bg-transparent border border-haiti-blue text-haiti-blue dark:text-blue-400',
        subtle: 'bg-haiti-blue/10 text-haiti-blue dark:text-blue-400 border border-haiti-blue/20',
      },
      // Red (Rouge Haiti) 🔴
      red: {
        solid: 'bg-haiti-red text-white',
        outline: 'bg-transparent border border-haiti-red text-haiti-red dark:text-red-400',
        subtle: 'bg-haiti-red/10 text-haiti-red dark:text-red-400 border border-haiti-red/20',
      },
      // Green (Success)
      green: {
        solid: 'bg-green-600 text-white',
        outline: 'bg-transparent border border-green-600 text-green-600 dark:text-green-400',
        subtle: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
      },
      // Orange (Warning)
      orange: {
        solid: 'bg-orange-500 text-white',
        outline: 'bg-transparent border border-orange-500 text-orange-600 dark:text-orange-400',
        subtle: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
      },
      // Yellow
      yellow: {
        solid: 'bg-yellow-500 text-white',
        outline: 'bg-transparent border border-yellow-500 text-yellow-600 dark:text-yellow-400',
        subtle: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
      },
      // Purple
      purple: {
        solid: 'bg-purple-600 text-white',
        outline: 'bg-transparent border border-purple-600 text-purple-600 dark:text-purple-400',
        subtle: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
      },
      // Gray
      gray: {
        solid: 'bg-gray-600 text-white',
        outline: 'bg-transparent border border-gray-400 text-gray-700 dark:text-gray-300',
        subtle: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
      },
    };

    return colorMap[color][variant];
  };

  // Combiner toutes les classes
  const badgeClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${shapeClasses[shape]}
    ${getVariantClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Classes pour le dot
  const dotClasses = `
    w-1.5 h-1.5 rounded-full
    ${variant === 'solid' ? 'bg-white' : `bg-current`}
  `;

  // Handler pour removal
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(e);
  };

  return (
    <span
      ref={ref}
      className={badgeClasses}
      {...props}
    >
      {/* Dot indicator */}
      {dot && <span className={dotClasses} />}

      {/* Icône gauche */}
      {LeftIcon && (
        <LeftIcon size={iconSizes[size]} />
      )}

      {/* Contenu */}
      {children}

      {/* Icône droite */}
      {RightIcon && (
        <RightIcon size={iconSizes[size]} />
      )}

      {/* Bouton remove */}
      {removable && (
        <button
          onClick={handleRemove}
          className="
            ml-0.5 -mr-1
            hover:bg-black/10 dark:hover:bg-white/10
            rounded-full p-0.5
            transition-colors
            focus:outline-none
          "
          aria-label="Retirer"
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

// Sous-composant Badge.Dot (pour notification count sur avatar, etc.)
Badge.Dot = forwardRef(({ 
  count,
  max = 99,
  show = true,
  color = 'red',
  position = 'top-right',
  className = '',
  ...props 
}, ref) => {
  
  if (!show) return null;

  // Classes de position
  const positionClasses = {
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  };

  // Couleurs pour le dot
  const colorClasses = {
    teal: 'bg-haiti-teal',
    blue: 'bg-haiti-blue',
    red: 'bg-haiti-red',
    green: 'bg-green-600',
    orange: 'bg-orange-500',
    gray: 'bg-gray-600',
  };

  // Afficher le count ou juste un dot
  const displayCount = count !== undefined;
  const displayValue = count > max ? `${max}+` : count;

  return (
    <span
      ref={ref}
      className={`
        absolute ${positionClasses[position]}
        ${colorClasses[color]}
        ${displayCount ? 'min-w-[18px] h-[18px] px-1' : 'w-2.5 h-2.5'}
        flex items-center justify-center
        text-white text-xs font-bold
        rounded-full
        border-2 border-white dark:border-gray-900
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {displayCount && displayValue}
    </span>
  );
});
Badge.Dot.displayName = 'Badge.Dot';

// PropTypes
Badge.propTypes = {
  /** Contenu du badge */
  children: PropTypes.node.isRequired,
  
  /** Variante visuelle */
  variant: PropTypes.oneOf(['solid', 'outline', 'subtle']),
  
  /** Couleur du badge */
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'green', 'orange', 'yellow', 'purple', 'gray']),
  
  /** Taille du badge */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  
  /** Forme du badge */
  shape: PropTypes.oneOf(['rounded', 'pill', 'square']),
  
  /** Afficher un dot indicator */
  dot: PropTypes.bool,
  
  /** Badge peut être retiré */
  removable: PropTypes.bool,
  
  /** Fonction appelée au clic sur remove */
  onRemove: PropTypes.func,
  
  /** Icône à gauche (composant lucide-react) */
  leftIcon: PropTypes.elementType,
  
  /** Icône à droite (composant lucide-react) */
  rightIcon: PropTypes.elementType,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

Badge.Dot.propTypes = {
  /** Nombre à afficher (si undefined, juste un dot) */
  count: PropTypes.number,
  
  /** Nombre maximum avant d'afficher "max+" */
  max: PropTypes.number,
  
  /** Afficher ou masquer le dot */
  show: PropTypes.bool,
  
  /** Couleur du dot */
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'green', 'orange', 'gray']),
  
  /** Position du dot */
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

// Valeurs par défaut
Badge.defaultProps = {
  variant: 'solid',
  color: 'gray',
  size: 'md',
  shape: 'rounded',
  dot: false,
  removable: false,
  className: '',
};

Badge.Dot.defaultProps = {
  max: 99,
  show: true,
  color: 'red',
  position: 'top-right',
  className: '',
};

export default Badge;