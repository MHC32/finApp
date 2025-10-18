import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Check, Minus } from 'lucide-react';

/**
 * Composant Checkbox - Case à cocher
 * 
 * Features:
 * - État checked/unchecked/indeterminate
 * - 3 tailles (sm, md, lg)
 * - Couleurs personnalisées
 * - Label intégré
 * - États disabled et error
 * - Support Light/Dark
 * 
 * @example
 * <Checkbox
 *   checked={acceptTerms}
 *   onChange={setAcceptTerms}
 *   label="J'accepte les conditions"
 * />
 */
const Checkbox = forwardRef(({
  // État
  checked = false,
  indeterminate = false,
  onChange = () => {},
  
  // Configuration
  disabled = false,
  error = false,
  
  // Label
  label = '',
  description = '',
  
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
      box: 'w-4 h-4',
      icon: 'w-3 h-3',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      box: 'w-5 h-5',
      icon: 'w-4 h-4',
      label: 'text-base',
      description: 'text-sm'
    },
    lg: {
      box: 'w-6 h-6',
      icon: 'w-5 h-5',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  // Classes de couleur
  const colorClasses = {
    teal: {
      checked: 'bg-teal-600 dark:bg-teal-500 border-teal-600 dark:border-teal-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500'
    },
    blue: {
      checked: 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
    },
    red: {
      checked: 'bg-red-600 dark:bg-red-500 border-red-600 dark:border-red-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500'
    },
    green: {
      checked: 'bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
    }
  };

  const handleChange = (e) => {
    if (!disabled) {
      onChange(e.target.checked, e);
    }
  };

  const isChecked = checked || indeterminate;
  const sizes = sizeClasses[size];
  const colors = colorClasses[color];

  return (
    <label
      className={`
        inline-flex items-start gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
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
        className="sr-only"
        {...props}
      />

      {/* Custom Checkbox */}
      <div className="relative flex-shrink-0 pt-0.5">
        <div
          className={`
            ${sizes.box}
            ${isChecked ? colors.checked : colors.unchecked}
            ${error ? 'border-red-500 dark:border-red-400' : ''}
            border-2 rounded
            flex items-center justify-center
            transition-all duration-200
            ${!disabled && !isChecked ? 'hover:border-opacity-80' : ''}
          `}
        >
          {/* Checkmark ou Minus */}
          {isChecked && (
            <div className="text-white animate-scaleIn">
              {indeterminate ? (
                <Minus className={sizes.icon} strokeWidth={3} />
              ) : (
                <Check className={sizes.icon} strokeWidth={3} />
              )}
            </div>
          )}
        </div>

        {/* Focus Ring */}
        <div
          className={`
            absolute inset-0 rounded
            ${!disabled ? 'peer-focus-visible:ring-4 ring-teal-500/20' : ''}
          `}
        />
      </div>

      {/* Label & Description */}
      {(label || description) && (
        <div className="flex-1 space-y-0.5">
          {label && (
            <span
              className={`
                ${sizes.label}
                ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}
                font-medium
                select-none
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
                select-none
              `}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  // État
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  
  // Configuration
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  
  // Label
  label: PropTypes.string,
  description: PropTypes.string,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'green']),
  className: PropTypes.string,
  
  // Props HTML
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default Checkbox;