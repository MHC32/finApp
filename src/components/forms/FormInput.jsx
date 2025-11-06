import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Input from '../ui/Input';

/**
 * Composant FormInput - Wrapper Input avec label et validation
 * 
 * Features:
 * - Label automatique
 * - Indicateur required/optional
 * - Messages d'erreur
 * - Helper text
 * - Icônes gauche/droite
 * - Toutes les features d'Input
 * 
 * @example
 * <FormInput
 *   label="Email"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={errors.email}
 *   leftIcon={Mail}
 *   required
 * />
 * 
 * @example
 * <FormInput
 *   label="Password"
 *   name="password"
 *   type={showPassword ? 'text' : 'password'}
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   rightIcon={showPassword ? EyeOff : Eye}
 *   onRightIconClick={() => setShowPassword(!showPassword)}
 *   required
 * />
 */
const FormInput = forwardRef(({
  // Label
  label = '',
  required = false,
  optional = false,
  
  // Validation
  error = '',
  
  // Icônes
  leftIcon,
  rightIcon,
  onRightIconClick,
  
  // Props Input
  helperText = '',
  ...inputProps
}, ref) => {
  // Combiner error et helperText
  const displayHelperText = error || helperText;
  const hasError = !!error;

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputProps.id || inputProps.name}
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

      {/* Input */}
      <Input
        ref={ref}
        error={hasError}
        helperText={displayHelperText}
        required={required}
        
        // Props pour les icônes
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onRightIconClick={onRightIconClick}
        
        // Accessibilité
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={
          displayHelperText 
            ? `${inputProps.id || inputProps.name}-helper` 
            : undefined
        }
        {...inputProps}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  // Label
  label: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  
  // Validation
  error: PropTypes.string,
  
  // Icônes
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  onRightIconClick: PropTypes.func,
  
  // Props Input (héritées)
  helperText: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default FormInput;