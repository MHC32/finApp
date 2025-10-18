import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Switch - Toggle On/Off
 * 
 * Features:
 * - Toggle animé smooth
 * - 3 tailles (sm, md, lg)
 * - Couleurs personnalisées
 * - Label intégré (gauche ou droite)
 * - États disabled et error
 * - Icônes optionnelles
 * - Support Light/Dark
 * 
 * @example
 * <Switch
 *   checked={notifications}
 *   onChange={setNotifications}
 *   label="Activer les notifications"
 * />
 */
const Switch = forwardRef(({
  // État
  checked = false,
  onChange = () => {},
  
  // Configuration
  disabled = false,
  error = false,
  
  // Label
  label = '',
  description = '',
  labelPosition = 'right',
  
  // Style
  size = 'md',
  color = 'teal',
  className = '',
  
  // Props HTML
  id,
  name,
  value,
  ...props
}, ref) => {
  // Classes de taille
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      label: 'text-base',
      description: 'text-sm'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  // Classes de couleur
  const colorClasses = {
    teal: {
      checked: 'bg-teal-600 dark:bg-teal-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600'
    },
    blue: {
      checked: 'bg-blue-600 dark:bg-blue-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600'
    },
    red: {
      checked: 'bg-red-600 dark:bg-red-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600'
    },
    green: {
      checked: 'bg-green-600 dark:bg-green-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600'
    },
    purple: {
      checked: 'bg-purple-600 dark:bg-purple-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600'
    }
  };

  const handleChange = (e) => {
    if (!disabled) {
      onChange(e.target.checked, e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  const sizes = sizeClasses[size];
  const colors = colorClasses[color];

  const switchElement = (
    <div className="relative flex-shrink-0">
      {/* Hidden Input */}
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />

      {/* Track */}
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={`
          ${sizes.track}
          ${checked ? colors.checked : colors.unchecked}
          ${error ? 'ring-2 ring-red-500 dark:ring-red-400' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          rounded-full
          transition-all duration-200
          peer-focus-visible:ring-4 ring-teal-500/20
          relative
        `}
      >
        {/* Thumb (bouton qui bouge) */}
        <div
          className={`
            ${sizes.thumb}
            ${checked ? sizes.translate : 'translate-x-0.5'}
            bg-white
            rounded-full
            shadow-md
            transition-transform duration-200
            absolute top-1/2 -translate-y-1/2
          `}
        />
      </div>
    </div>
  );

  // Si pas de label, retourner juste le switch
  if (!label && !description) {
    return switchElement;
  }

  // Avec label
  return (
    <label
      className={`
        inline-flex items-start gap-3
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${labelPosition === 'left' ? 'flex-row-reverse' : ''}
        ${className}
      `}
    >
      {switchElement}

      {/* Label & Description */}
      <div className="flex-1 space-y-0.5 select-none pt-0.5">
        {label && (
          <span
            className={`
              ${sizes.label}
              ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}
              font-medium
            `}
          >
            {label}
          </span>
        )}
        {description && (
          <p
            className={`
              ${sizes.description}
              ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
            `}
          >
            {description}
          </p>
        )}
      </div>
    </label>
  );
});

Switch.displayName = 'Switch';

Switch.propTypes = {
  // État
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  
  // Configuration
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  
  // Label
  label: PropTypes.string,
  description: PropTypes.string,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'green', 'purple']),
  className: PropTypes.string,
  
  // Props HTML
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default Switch;