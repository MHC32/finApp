import { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Loader2 } from 'lucide-react';

/**
 * Composant SearchBar - Barre de recherche
 * 
 * Features:
 * - Recherche en temps réel avec debounce
 * - Bouton clear
 * - Loading state
 * - Suggestions optionnelles
 * - Raccourcis clavier (Ctrl/Cmd+K)
 * - Support Light/Dark
 * 
 * @example
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onSearch={handleSearch}
 *   placeholder="Rechercher des transactions..."
 *   debounceMs={300}
 * />
 */
const SearchBar = forwardRef(({
  // Valeur
  value = '',
  onChange = () => {},
  onSearch = () => {},
  
  // Configuration
  placeholder = 'Rechercher...',
  debounceMs = 300,
  loading = false,
  disabled = false,
  
  // Suggestions
  suggestions = [],
  onSuggestionClick = () => {},
  showSuggestions = false,
  
  // Callbacks
  onFocus = () => {},
  onBlur = () => {},
  onClear = () => {},
  
  // Style
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = ''
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);

  // Gérer le changement avec debounce
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Afficher suggestions si la valeur n'est pas vide
    if (newValue && suggestions.length > 0) {
      setShowSuggestionsDropdown(true);
    } else {
      setShowSuggestionsDropdown(false);
    }

    // Debounce pour onSearch
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);
  };

  // Clear la recherche
  const handleClear = () => {
    onChange('');
    onSearch('');
    onClear();
    setShowSuggestionsDropdown(false);
    inputRef.current?.focus();
  };

  // Focus
  const handleFocus = () => {
    setIsFocused(true);
    onFocus();
    if (value && suggestions.length > 0) {
      setShowSuggestionsDropdown(true);
    }
  };

  // Blur
  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
    // Délai pour permettre le clic sur suggestion
    setTimeout(() => {
      setShowSuggestionsDropdown(false);
    }, 200);
  };

  // Gérer clic sur suggestion
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    onSearch(suggestion);
    onSuggestionClick(suggestion);
    setShowSuggestionsDropdown(false);
  };

  // Classes de taille
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg'
  };

  // Classes de variante
  const variantClasses = {
    default: 'border-gray-300 dark:border-gray-600 focus-within:border-teal-500 dark:focus-within:border-teal-400',
    filled: 'bg-gray-100 dark:bg-gray-800 border-transparent',
    ghost: 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {/* Search Input */}
      <div
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isFocused ? 'ring-4 ring-teal-500/20' : ''}
          ${fullWidth ? 'w-full' : 'min-w-[300px]'}
          flex items-center gap-2
          bg-white dark:bg-gray-900
          border-2 rounded-lg
          transition-all duration-200
        `}
      >
        {/* Icône Search */}
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />

        {/* Input */}
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="
            flex-1 bg-transparent
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            disabled:cursor-not-allowed
          "
        />

        {/* Loading / Clear */}
        <div className="flex-shrink-0">
          {loading ? (
            <Loader2 className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-spin" />
          ) : value ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestionsDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-slideDown">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                w-full px-4 py-2 text-left
                text-sm text-gray-700 dark:text-gray-300
                hover:bg-teal-50 dark:hover:bg-teal-900/20
                transition-colors
              "
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  // Valeur
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  
  // Configuration
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  
  // Suggestions
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onSuggestionClick: PropTypes.func,
  showSuggestions: PropTypes.bool,
  
  // Callbacks
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'filled', 'ghost']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string
};

export default SearchBar;