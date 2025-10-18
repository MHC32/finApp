import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant FormTextarea - Textarea avec label et validation
 * 
 * Features:
 * - Label automatique
 * - Indicateur required/optional
 * - Messages d'erreur
 * - Helper text
 * - Compteur de caractères
 * - Auto-resize optionnel
 * 
 * @example
 * <FormTextarea
 *   label="Description"
 *   name="description"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   error={errors.description}
 *   maxLength={500}
 *   showCount
 *   required
 * />
 */
const FormTextarea = forwardRef(({
  // Label
  label = '',
  required = false,
  optional = false,
  
  // Validation
  error = '',
  helperText = '',
  
  // Textarea props
  value = '',
  onChange = () => {},
  placeholder = '',
  disabled = false,
  rows = 4,
  maxLength,
  showCount = false,
  resize = true,
  
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
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  // Classes d'état
  const stateClasses = hasError
    ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20'
    : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400';

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
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

          {/* Compteur de caractères */}
          {showCount && maxLength && (
            <span className={`text-xs ${
              value.length > maxLength 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={displayHelperText ? `${id || name}-helper` : undefined}
        className={`
          ${sizeClasses[size]}
          ${stateClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
          ${resize ? 'resize-y' : 'resize-none'}
          w-full rounded-lg border-2
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-200
          focus:outline-none focus:ring-4
        `}
        {...props}
      />

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

FormTextarea.displayName = 'FormTextarea';

FormTextarea.propTypes = {
  // Label
  label: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  
  // Validation
  error: PropTypes.string,
  helperText: PropTypes.string,
  
  // Textarea props
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCount: PropTypes.bool,
  resize: PropTypes.bool,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  
  // HTML props
  id: PropTypes.string,
  name: PropTypes.string
};

export default FormTextarea;