import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DollarSign } from 'lucide-react';

/**
 * Composant FormCurrencyInput - Input pour montants en HTG/USD
 * 
 * Features:
 * - Label automatique
 * - Sélecteur de devise (HTG/USD)
 * - Formatage automatique (séparateurs milliers)
 * - Validation montants
 * - Messages d'erreur
 * - Support négatif (pour dépenses)
 * 
 * @example
 * <FormCurrencyInput
 *   label="Montant"
 *   name="amount"
 *   value={amount}
 *   onChange={setAmount}
 *   currency={currency}
 *   onCurrencyChange={setCurrency}
 *   error={errors.amount}
 *   required
 * />
 */
const FormCurrencyInput = forwardRef(({
  // Label
  label = '',
  required = false,
  optional = false,
  
  // Validation
  error = '',
  helperText = '',
  
  // Currency props
  value = '',
  onChange = () => {},
  currency = 'HTG',
  onCurrencyChange = () => {},
  allowNegative = false,
  placeholder = '0.00',
  disabled = false,
  
  // Style
  size = 'md',
  className = '',
  
  // HTML props
  id,
  name,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  
  const displayHelperText = error || helperText;
  const hasError = !!error;

  // Formater le nombre avec séparateurs
  const formatNumber = (num) => {
    if (!num) return '';
    
    // Enlever tout sauf chiffres, point et signe moins
    const cleaned = num.toString().replace(/[^\d.-]/g, '');
    
    // Séparer partie entière et décimale
    const parts = cleaned.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1] ? `.${parts[1].slice(0, 2)}` : '';
    
    return integerPart + decimalPart;
  };

  // Gérer le changement de valeur
  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // Enlever tous les séparateurs
    let cleanValue = inputValue.replace(/,/g, '');
    
    // Vérifier si négatif autorisé
    if (!allowNegative && cleanValue.startsWith('-')) {
      cleanValue = cleanValue.substring(1);
    }
    
    // Valider le format nombre
    if (cleanValue === '' || cleanValue === '-' || /^-?\d*\.?\d{0,2}$/.test(cleanValue)) {
      onChange(cleanValue);
    }
  };

  // Classes de taille
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  // Classes d'état
  const stateClasses = hasError
    ? 'border-red-500 dark:border-red-400 focus-within:ring-red-500/20'
    : 'border-gray-300 dark:border-gray-600 focus-within:ring-teal-500/20 focus-within:border-teal-500 dark:focus-within:border-teal-400';

  // Afficher la valeur formatée ou raw
  const displayValue = focused ? value : formatNumber(value);

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

      {/* Input Group */}
      <div
        className={`
          ${sizeClasses[size]}
          ${stateClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
          w-full rounded-lg border-2
          flex items-center
          transition-all duration-200
          focus-within:ring-4
        `}
      >
        {/* Icône Devise */}
        <div className="pl-3 pr-2 flex-shrink-0">
          <DollarSign className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          id={id || name}
          name={name}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={displayHelperText ? `${id || name}-helper` : undefined}
          className="
            flex-1 px-2 bg-transparent
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            disabled:cursor-not-allowed
          "
          {...props}
        />

        {/* Sélecteur de devise */}
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          disabled={disabled}
          className="
            px-3 py-1 mr-1 rounded
            bg-gray-100 dark:bg-gray-800
            text-gray-700 dark:text-gray-300
            text-sm font-medium
            border-0 focus:outline-none focus:ring-2 focus:ring-teal-500/20
            disabled:cursor-not-allowed
          "
        >
          <option value="HTG">HTG</option>
          <option value="USD">USD</option>
        </select>
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

FormCurrencyInput.displayName = 'FormCurrencyInput';

FormCurrencyInput.propTypes = {
  // Label
  label: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  
  // Validation
  error: PropTypes.string,
  helperText: PropTypes.string,
  
  // Currency props
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  currency: PropTypes.oneOf(['HTG', 'USD']),
  onCurrencyChange: PropTypes.func,
  allowNegative: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  
  // HTML props
  id: PropTypes.string,
  name: PropTypes.string
};

export default FormCurrencyInput;