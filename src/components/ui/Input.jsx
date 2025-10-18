// src/components/ui/Input.jsx
import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Info } from 'lucide-react';

/**
 * Composant Input réutilisable avec label, icônes, validation
 * Support tous les types HTML5 + états visuels + Light/Dark mode
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Input = forwardRef(({
  // Props de base
  type = 'text',
  name,
  id,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  autoComplete,
  autoFocus = false,
  
  // Label et messages
  label,
  helperText,
  error,
  success,
  
  // Taille
  size = 'md',
  
  // Icônes
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  
  // État
  state,
  
  // Callbacks
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  
  // Style
  className = '',
  inputClassName = '',
  fullWidth = false,
  
  // HTML5 validation
  min,
  max,
  minLength,
  maxLength,
  pattern,
  step,
  
  ...props
}, ref) => {

  // État local pour toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Déterminer le type effectif (pour password toggle)
  const effectiveType = type === 'password' && showPassword ? 'text' : type;

  // Déterminer l'état visuel (priorité: error > success > state)
  const visualState = error ? 'error' : success ? 'success' : state || 'default';

  // Générer un ID si non fourni (pour label association)
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Classes de taille
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  // Padding adjusté pour icônes
  const iconPaddingClasses = {
    left: {
      sm: 'pl-9',
      md: 'pl-10',
      lg: 'pl-12'
    },
    right: {
      sm: 'pr-9',
      md: 'pr-10',
      lg: 'pr-12'
    }
  };

  // Classes de base pour l'input
  const baseInputClasses = `
    w-full
    rounded-lg
    border-2
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:cursor-not-allowed disabled:opacity-60
    placeholder:text-gray-400 dark:placeholder:text-gray-500
  `;

  // Classes selon l'état visuel - MISES À JOUR avec Teal 🌊
  const stateClasses = {
    default: `
      bg-white dark:bg-gray-800
      border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-gray-100
      focus:border-haiti-teal focus:ring-haiti-teal/20
      hover:border-haiti-teal-light dark:hover:border-haiti-teal
    `,
    error: `
      bg-white dark:bg-gray-800
      border-red-500 dark:border-red-400
      text-gray-900 dark:text-gray-100
      focus:border-red-600 focus:ring-red-500/20
    `,
    success: `
      bg-white dark:bg-gray-800
      border-green-500 dark:border-green-400
      text-gray-900 dark:text-gray-100
      focus:border-green-600 focus:ring-green-500/20
    `,
    disabled: `
      bg-gray-100 dark:bg-gray-700
      border-gray-300 dark:border-gray-600
      text-gray-500 dark:text-gray-400
    `
  };

  // Combiner les classes
  const inputClasses = `
    ${baseInputClasses}
    ${sizeClasses[size]}
    ${LeftIcon ? iconPaddingClasses.left[size] : ''}
    ${RightIcon || type === 'password' ? iconPaddingClasses.right[size] : ''}
    ${disabled ? stateClasses.disabled : stateClasses[visualState]}
    ${inputClassName}
  `.trim().replace(/\s+/g, ' ');

  // Taille des icônes selon la taille de l'input
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  // Position des icônes
  const iconPositionClasses = {
    left: {
      sm: 'left-3',
      md: 'left-3.5',
      lg: 'left-4'
    },
    right: {
      sm: 'right-3',
      md: 'right-3.5',
      lg: 'right-4'
    }
  };

  // Handlers
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    onChange?.(e);
  };

  // Icône d'état (error/success)
  const StateIcon = visualState === 'error' 
    ? AlertCircle 
    : visualState === 'success' 
    ? CheckCircle2 
    : null;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={`
            block mb-1.5 text-sm font-medium
            ${visualState === 'error' 
              ? 'text-red-700 dark:text-red-400' 
              : 'text-gray-700 dark:text-gray-300'
            }
            ${disabled ? 'opacity-60' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        
        {/* Icône gauche - Couleur Teal en focus */}
        {LeftIcon && (
          <div className={`
            absolute ${iconPositionClasses.left[size]} top-1/2 -translate-y-1/2
            pointer-events-none
            transition-colors duration-200
            ${isFocused && visualState === 'default' 
              ? 'text-haiti-teal dark:text-haiti-teal-light' 
              : 'text-gray-400 dark:text-gray-500'
            }
            ${visualState === 'error' ? 'text-red-500' : ''}
            ${visualState === 'success' ? 'text-green-500' : ''}
          `}>
            <LeftIcon size={iconSizes[size]} />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={effectiveType}
          id={inputId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          step={step}
          className={inputClasses}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          aria-invalid={visualState === 'error'}
          aria-describedby={
            error ? `${inputId}-error` :
            success ? `${inputId}-success` :
            helperText ? `${inputId}-helper` :
            undefined
          }
          {...props}
        />

        {/* Icône droite ou état ou password toggle */}
        <div className={`
          absolute ${iconPositionClasses.right[size]} top-1/2 -translate-y-1/2
          flex items-center gap-1
        `}>
          
          {/* Icône d'état (error/success) */}
          {StateIcon && !RightIcon && (
            <div className={`
              ${visualState === 'error' ? 'text-red-500' : ''}
              ${visualState === 'success' ? 'text-green-500' : ''}
            `}>
              <StateIcon size={iconSizes[size]} />
            </div>
          )}

          {/* Icône personnalisée droite */}
          {RightIcon && !StateIcon && (
            <div className={`
              transition-colors duration-200
              ${isFocused && visualState === 'default'
                ? 'text-haiti-teal dark:text-haiti-teal-light'
                : 'text-gray-400 dark:text-gray-500'
              }
            `}>
              <RightIcon size={iconSizes[size]} />
            </div>
          )}

          {/* Toggle password visibility */}
          {type === 'password' && !RightIcon && !StateIcon && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                text-gray-400 hover:text-haiti-teal
                dark:text-gray-500 dark:hover:text-haiti-teal-light
                focus:outline-none
                transition-colors duration-200
              "
              tabIndex={-1}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <EyeOff size={iconSizes[size]} />
              ) : (
                <Eye size={iconSizes[size]} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Messages (error > success > helper) */}
      <div className="mt-1.5 min-h-[20px]">
        {/* Message d'erreur */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400 flex items-start gap-1.5"
          >
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Message de succès */}
        {!error && success && (
          <p 
            id={`${inputId}-success`}
            className="text-sm text-green-600 dark:text-green-400 flex items-start gap-1.5"
          >
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </p>
        )}

        {/* Message d'aide */}
        {!error && !success && helperText && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1.5"
          >
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <span>{helperText}</span>
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

// PropTypes
Input.propTypes = {
  // Props de base
  /** Type d'input HTML5 */
  type: PropTypes.oneOf([
    'text', 'password', 'email', 'number', 'tel', 'search', 
    'url', 'date', 'time', 'datetime-local', 'month', 'week'
  ]),
  /** Nom de l'input (pour formulaires) */
  name: PropTypes.string,
  /** ID de l'input */
  id: PropTypes.string,
  /** Valeur contrôlée */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Valeur par défaut (non contrôlé) */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Input désactivé */
  disabled: PropTypes.bool,
  /** Input en lecture seule */
  readOnly: PropTypes.bool,
  /** Champ requis */
  required: PropTypes.bool,
  /** Attribut autocomplete HTML5 */
  autoComplete: PropTypes.string,
  /** Auto-focus au montage */
  autoFocus: PropTypes.bool,

  // Label et messages
  /** Label au-dessus de l'input */
  label: PropTypes.string,
  /** Texte d'aide sous l'input */
  helperText: PropTypes.string,
  /** Message d'erreur */
  error: PropTypes.string,
  /** Message de succès */
  success: PropTypes.string,

  // Apparence
  /** Taille de l'input */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Icône à gauche (composant lucide-react) */
  leftIcon: PropTypes.elementType,
  /** Icône à droite (composant lucide-react) */
  rightIcon: PropTypes.elementType,
  /** État visuel (si pas error/success) */
  state: PropTypes.oneOf(['default', 'error', 'success']),
  /** Input prend toute la largeur */
  fullWidth: PropTypes.bool,

  // Callbacks
  /** Fonction appelée au changement */
  onChange: PropTypes.func,
  /** Fonction appelée au blur */
  onBlur: PropTypes.func,
  /** Fonction appelée au focus */
  onFocus: PropTypes.func,
  /** Fonction appelée sur touche pressée */
  onKeyDown: PropTypes.func,

  // Classes CSS
  /** Classes du container */
  className: PropTypes.string,
  /** Classes de l'input */
  inputClassName: PropTypes.string,

  // Validation HTML5
  /** Valeur minimum (number/date) */
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Valeur maximum (number/date) */
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Longueur minimum */
  minLength: PropTypes.number,
  /** Longueur maximum */
  maxLength: PropTypes.number,
  /** Pattern de validation */
  pattern: PropTypes.string,
  /** Step pour number */
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

// Valeurs par défaut
Input.defaultProps = {
  type: 'text',
  size: 'md',
  disabled: false,
  readOnly: false,
  required: false,
  autoFocus: false,
  fullWidth: false,
  className: '',
  inputClassName: ''
};

export default Input;