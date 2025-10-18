import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from '../ui/Select';

/**
 * Composant FormSelect - Wrapper Select avec label et validation
 * 
 * Features:
 * - Label automatique
 * - Indicateur required/optional
 * - Messages d'erreur
 * - Helper text
 * - Toutes les features de Select
 * 
 * @example
 * <FormSelect
 *   label="Banque"
 *   name="bank"
 *   options={bankOptions}
 *   value={selectedBank}
 *   onChange={setSelectedBank}
 *   error={errors.bank}
 *   required
 * />
 */
const FormSelect = forwardRef(({
  // Label
  label = '',
  required = false,
  optional = false,
  
  // Validation
  error = '',
  
  // Props Select
  helperText = '',
  ...selectProps
}, ref) => {
  // Combiner error et helperText
  const displayHelperText = error || helperText;
  const hasError = !!error;

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectProps.id || selectProps.name}
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

      {/* Select */}
      <Select
        ref={ref}
        error={hasError}
        helperText={displayHelperText}
        disabled={selectProps.disabled}
        aria-required={required}
        aria-invalid={hasError}
        {...selectProps}
      />
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

FormSelect.propTypes = {
  // Label
  label: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  
  // Validation
  error: PropTypes.string,
  
  // Props Select (héritées)
  helperText: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  clearable: PropTypes.bool
};

export default FormSelect;