import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';

/**
 * Composant FormDatePicker - Date Picker avec label et validation
 * 
 * Features:
 * - Label automatique
 * - Indicateur required/optional
 * - Messages d'erreur
 * - Helper text
 * - Min/Max dates
 * - Format ISO (YYYY-MM-DD)
 * 
 * @example
 * <FormDatePicker
 *   label="Date de transaction"
 *   name="date"
 *   value={date}
 *   onChange={(e) => setDate(e.target.value)}
 *   error={errors.date}
 *   required
 * />
 */
const FormDatePicker = forwardRef(({
  // Label
  label = '',
  required = false,
  optional = false,
  
  // Validation
  error = '',
  helperText = '',
  
  // Date props
  value = '',
  onChange = () => {},
  placeholder = '',
  disabled = false,
  min,
  max,
  
  // Style
  size = 'md',
  className = '',
  
  // HTML props
  id,
  name,
  ...props
}, ref) => {
  const displayHelperText = error || helperText;
  const hasError = !!error;

  // Classes de taille
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg'
  };

  // Classes d'état
  const stateClasses = hasError
    ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20'
    : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400';

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1" aria-label="requis">
              *
            </span>
          )}
          {optional && !required && (
            <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
              (optionnel)
            </span>
          )}
        </label>
      )}

      {/* Date Input */}
      <div className="relative">
        <input
          ref={ref}
          type="date"
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={displayHelperText ? `${id || name}-helper` : undefined}
          className={`
            ${sizeClasses[size]}
            ${stateClasses}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
            w-full rounded-lg border-2
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            focus:outline-none focus:ring-4
            pr-10
          `}
          {...props}
        />

        {/* Icône Calendrier */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Helper text / Error */}
      {displayHelperText && (
        <p 
          id={`${id || name}-helper`}
          className={`text-sm ${
            hasError 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {displayHelperText}
        </p>
      )}
    </div>
  );
});

FormDatePicker.displayName = 'FormDatePicker';

FormDatePicker.propTypes = {
  // Label
  label: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  
  // Validation
  error: PropTypes.string,
  helperText: PropTypes.string,
  
  // Date props
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  
  // HTML props
  id: PropTypes.string,
  name: PropTypes.string
};

export default FormDatePicker;