import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../ui/Checkbox';

/**
 * Composant FormCheckbox - Wrapper Checkbox avec validation
 * 
 * Features:
 * - Message d'erreur
 * - Validation required
 * - Helper text
 * - Toutes les features de Checkbox
 * 
 * @example
 * <FormCheckbox
 *   name="acceptTerms"
 *   checked={acceptTerms}
 *   onChange={setAcceptTerms}
 *   label="J'accepte les conditions"
 *   description="En cochant, vous acceptez nos CGU"
 *   error={errors.acceptTerms}
 *   required
 * />
 */
const FormCheckbox = forwardRef(({
  // Validation
  error = '',
  helperText = '',
  required = false,
  
  // Props Checkbox
  ...checkboxProps
}, ref) => {
  const displayHelperText = error || helperText;
  const hasError = !!error;

  return (
    <div className="space-y-1">
      {/* Checkbox */}
      <Checkbox
        ref={ref}
        error={hasError}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={
          displayHelperText 
            ? `${checkboxProps.id || checkboxProps.name}-helper` 
            : undefined
        }
        {...checkboxProps}
      />

      {/* Helper text / Error additionnel (si pas dans description) */}
      {displayHelperText && !checkboxProps.description && (
        <p 
          id={`${checkboxProps.id || checkboxProps.name}-helper`}
          className={`ml-8 text-sm ${
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

FormCheckbox.displayName = 'FormCheckbox';

FormCheckbox.propTypes = {
  // Validation
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  
  // Props Checkbox (héritées)
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default FormCheckbox;