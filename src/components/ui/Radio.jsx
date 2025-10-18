import { forwardRef, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * Context pour Radio Group
 */
const RadioGroupContext = createContext({});

/**
 * Composant Radio - Bouton radio
 * 
 * Features:
 * - Choix unique dans un groupe
 * - 3 tailles (sm, md, lg)
 * - Couleurs personnalisées
 * - Label intégré
 * - États disabled et error
 * - Radio.Group pour grouper
 * - Support Light/Dark
 * 
 * @example
 * <Radio.Group value={type} onChange={setType}>
 *   <Radio value="income" label="Revenus" />
 *   <Radio value="expense" label="Dépenses" />
 * </Radio.Group>
 */
const Radio = forwardRef(({
  // État (peut venir du contexte ou props)
  value,
  checked: checkedProp,
  onChange: onChangeProp,
  
  // Configuration
  disabled: disabledProp = false,
  error: errorProp = false,
  
  // Label
  label = '',
  description = '',
  
  // Style
  size: sizeProp = 'md',
  color: colorProp = 'teal',
  className = '',
  
  // Props HTML
  id,
  name: nameProp,
  ...props
}, ref) => {
  // Récupérer le contexte du groupe
  const group = useContext(RadioGroupContext);
  
  // Utiliser les valeurs du groupe si disponibles, sinon les props
  const name = group.name || nameProp;
  const onChange = group.onChange || onChangeProp;
  const disabled = group.disabled || disabledProp;
  const error = group.error || errorProp;
  const size = group.size || sizeProp;
  const color = group.color || colorProp;
  
  // Vérifier si ce radio est sélectionné
  const isChecked = group.value !== undefined
    ? group.value === value
    : checkedProp;

  // Classes de taille
  const sizeClasses = {
    sm: {
      radio: 'w-4 h-4',
      dot: 'w-2 h-2',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      radio: 'w-5 h-5',
      dot: 'w-2.5 h-2.5',
      label: 'text-base',
      description: 'text-sm'
    },
    lg: {
      radio: 'w-6 h-6',
      dot: 'w-3 h-3',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  // Classes de couleur
  const colorClasses = {
    teal: {
      checked: 'border-teal-600 dark:border-teal-500',
      dot: 'bg-teal-600 dark:bg-teal-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500'
    },
    blue: {
      checked: 'border-blue-600 dark:border-blue-500',
      dot: 'bg-blue-600 dark:bg-blue-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
    },
    red: {
      checked: 'border-red-600 dark:border-red-500',
      dot: 'bg-red-600 dark:bg-red-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500'
    },
    green: {
      checked: 'border-green-600 dark:border-green-500',
      dot: 'bg-green-600 dark:bg-green-500',
      unchecked: 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
    }
  };

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(value, e);
    }
  };

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
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />

      {/* Custom Radio */}
      <div className="relative flex-shrink-0 pt-0.5">
        <div
          className={`
            ${sizes.radio}
            ${isChecked ? colors.checked : colors.unchecked}
            ${error ? 'border-red-500 dark:border-red-400' : ''}
            border-2 rounded-full
            flex items-center justify-center
            transition-all duration-200
            bg-white dark:bg-gray-800
            ${!disabled && !isChecked ? 'hover:border-opacity-80' : ''}
          `}
        >
          {/* Dot intérieur */}
          {isChecked && (
            <div
              className={`
                ${sizes.dot}
                ${colors.dot}
                rounded-full
                animate-scaleIn
              `}
            />
          )}
        </div>

        {/* Focus Ring */}
        <div
          className={`
            absolute inset-0 rounded-full
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

Radio.displayName = 'Radio';

Radio.propTypes = {
  // État
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool,
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
  name: PropTypes.string
};

/**
 * Radio.Group - Groupe de boutons radio
 * 
 * @example
 * <Radio.Group
 *   value={selectedType}
 *   onChange={setSelectedType}
 *   name="transactionType"
 * >
 *   <Radio value="income" label="Revenus" />
 *   <Radio value="expense" label="Dépenses" />
 * </Radio.Group>
 */
const RadioGroup = ({
  children,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  size = 'md',
  color = 'teal',
  orientation = 'vertical',
  className = ''
}) => {
  const contextValue = {
    name,
    value,
    onChange,
    disabled,
    error,
    size,
    color
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        className={`
          flex
          ${orientation === 'vertical' ? 'flex-col space-y-3' : 'flex-row flex-wrap gap-4'}
          ${className}
        `}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'green']),
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  className: PropTypes.string
};

// Attacher RadioGroup à Radio
Radio.Group = RadioGroup;

export default Radio;