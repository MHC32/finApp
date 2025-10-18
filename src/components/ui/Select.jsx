import { useState, useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Search, X, Check } from 'lucide-react';

/**
 * Composant Select - Dropdown de sélection avec recherche
 * 
 * Features:
 * - Single & Multi-select
 * - Recherche/filtrage
 * - Groupes d'options
 * - États (error, success, disabled)
 * - Icônes personnalisées
 * - Glassmorphism
 * - Navigation clavier
 * - Support Light/Dark
 * 
 * @example
 * <Select
 *   options={[
 *     { value: 'buh', label: 'BUH' },
 *     { value: 'sogebank', label: 'Sogebank' }
 *   ]}
 *   value={selectedBank}
 *   onChange={setSelectedBank}
 *   placeholder="Sélectionner une banque"
 * />
 */
const Select = forwardRef(({
  // Options
  options = [],
  value = null,
  onChange = () => {},
  
  // Configuration
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  
  // Labels
  placeholder = 'Sélectionner...',
  searchPlaceholder = 'Rechercher...',
  noOptionsText = 'Aucune option',
  
  // États
  error = false,
  success = false,
  helperText = '',
  
  // Style
  size = 'md',
  className = '',
  
  // Icônes
  icon: Icon = null,
  
  // Callbacks
  onBlur = () => {},
  onFocus = () => {}
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        onBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  // Focus sur search input quand dropdown s'ouvre
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filtrer les options selon la recherche
  const filteredOptions = searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Obtenir le label de la valeur sélectionnée
  const getSelectedLabel = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option?.label || placeholder;
      }
      return `${value.length} sélectionné(s)`;
    }
    
    const option = options.find(opt => opt.value === value);
    return option?.label || placeholder;
  };

  // Toggle dropdown
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      onFocus();
    } else {
      onBlur();
    }
  };

  // Sélectionner une option
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.indexOf(optionValue);
      
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }
      
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      onBlur();
    }
    
    setSearchQuery('');
  };

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
    setSearchQuery('');
  };

  // Navigation clavier
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        onBlur();
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;

      default:
        break;
    }
  };

  // Vérifier si une option est sélectionnée
  const isSelected = (optionValue) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Classes de taille
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  // Classes d'état
  const stateClasses = error
    ? 'border-red-500 dark:border-red-400 focus-within:ring-red-500/20'
    : success
    ? 'border-teal-500 dark:border-teal-400 focus-within:ring-teal-500/20'
    : 'border-gray-300 dark:border-gray-600 focus-within:ring-teal-500/20';

  const hasValue = multiple ? (Array.isArray(value) && value.length > 0) : value !== null;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Select Button */}
      <div
        ref={ref}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          ${sizeClasses[size]}
          ${stateClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-teal-400 dark:hover:border-teal-500'}
          w-full px-3 rounded-lg border-2
          bg-white dark:bg-gray-800
          flex items-center justify-between gap-2
          transition-all duration-200
          focus-within:ring-4
          ${isOpen ? 'ring-4 border-teal-500 dark:border-teal-400' : ''}
        `}
      >
        {/* Icône gauche */}
        {Icon && (
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        )}

        {/* Label */}
        <span className={`
          flex-1 text-left truncate
          ${hasValue ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
        `}>
          {getSelectedLabel()}
        </span>

        {/* Actions à droite */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          <ChevronDown className={`
            w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `} />
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className={`
          mt-1 text-sm
          ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
        `}>
          {helperText}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 w-full mt-2 py-1 rounded-lg border-2 shadow-xl
          bg-white/95 dark:bg-gray-800/95
          backdrop-blur-md
          border-gray-200 dark:border-gray-700
          max-h-60 overflow-y-auto
          animate-slideDown
        `}>
          {/* Search Input */}
          {searchable && (
            <div className="px-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="
                    w-full h-8 pl-9 pr-3 rounded-md
                    bg-gray-50 dark:bg-gray-700/50
                    border border-gray-200 dark:border-gray-600
                    text-sm text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-teal-500/20
                  "
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div role="listbox" className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {noOptionsText}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected(option.value)}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    px-3 py-2 cursor-pointer
                    flex items-center justify-between gap-2
                    transition-colors duration-150
                    ${
                      highlightedIndex === index
                        ? 'bg-teal-50 dark:bg-teal-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                    ${
                      isSelected(option.value)
                        ? 'text-teal-600 dark:text-teal-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <span className="flex-1 text-sm">{option.label}</span>
                  
                  {isSelected(option.value) && (
                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  // Options
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  
  // Configuration
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  
  // Labels
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  noOptionsText: PropTypes.string,
  
  // États
  error: PropTypes.bool,
  success: PropTypes.bool,
  helperText: PropTypes.string,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  
  // Icônes
  icon: PropTypes.elementType,
  
  // Callbacks
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

export default Select;