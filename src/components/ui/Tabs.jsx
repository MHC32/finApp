import { useState, forwardRef, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * Context pour Tabs
 */
const TabsContext = createContext({});

/**
 * Composant Tabs - Onglets de navigation
 * 
 * Features:
 * - Onglets horizontaux/verticaux
 * - Icônes + badges
 * - Contenu lazy-loading
 * - Animations smooth
 * - Variants (line, enclosed, pills)
 * - Support Light/Dark
 * 
 * @example
 * <Tabs defaultValue="overview">
 *   <Tabs.List>
 *     <Tabs.Tab value="overview" icon={Home}>Vue d'ensemble</Tabs.Tab>
 *     <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="overview">
 *     Contenu overview
 *   </Tabs.Panel>
 *   <Tabs.Panel value="transactions">
 *     Contenu transactions
 *   </Tabs.Panel>
 * </Tabs>
 */
const Tabs = forwardRef(({
  children,
  defaultValue,
  value: controlledValue,
  onChange = () => {},
  orientation = 'horizontal',
  variant = 'line',
  size = 'md',
  color = 'teal',
  className = ''
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange(newValue);
  };

  const contextValue = {
    activeValue,
    onChange: handleChange,
    orientation,
    variant,
    size,
    color
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={`
          ${orientation === 'vertical' ? 'flex gap-6' : 'space-y-4'}
          ${className}
        `}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['line', 'enclosed', 'pills']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['teal', 'blue', 'purple', 'red']),
  className: PropTypes.string
};

/**
 * Tabs.List - Liste des onglets
 */
const TabsList = ({ children, className = '' }) => {
  const { orientation, variant } = useContext(TabsContext);

  const variantClasses = {
    line: '',
    enclosed: 'border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-800/50',
    pills: 'gap-2'
  };

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={`
        ${orientation === 'vertical' ? 'flex flex-col w-48 flex-shrink-0' : 'flex'}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Tabs.Tab - Un onglet individuel
 */
const Tab = ({
  value,
  children,
  icon: Icon = null,
  badge = null,
  disabled = false,
  className = ''
}) => {
  const { activeValue, onChange,  variant, size, color } = useContext(TabsContext);
  
  const isActive = activeValue === value;

  // Classes de taille
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Classes de couleur
  const colorClasses = {
    teal: {
      active: 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400'
    },
    blue: {
      active: 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
    },
    purple: {
      active: 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400'
    },
    red: {
      active: 'text-red-600 dark:text-red-400 border-red-600 dark:border-red-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
    }
  };

  // Classes par variante
  const getVariantClasses = () => {
    const colors = colorClasses[color];
    
    switch (variant) {
      case 'line':
        return `
          border-b-2 transition-all duration-200
          ${isActive 
            ? `${colors.active} font-semibold` 
            : `border-transparent ${colors.inactive}`
          }
        `;
      
      case 'enclosed':
        return `
          rounded-md transition-all duration-200
          ${isActive 
            ? `bg-white dark:bg-gray-900 ${colors.active} font-semibold shadow-sm` 
            : `${colors.inactive}`
          }
        `;
      
      case 'pills':
        return `
          rounded-full transition-all duration-200
          ${isActive 
            ? `bg-teal-600 dark:bg-teal-500 text-white font-semibold` 
            : `bg-gray-100 dark:bg-gray-800 ${colors.inactive}`
          }
        `;
      
      default:
        return '';
    }
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={`
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center gap-2 whitespace-nowrap
        focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:ring-offset-2
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
      {badge && (
        <span className={`
          ml-1 px-1.5 py-0.5 text-xs rounded-full
          ${isActive 
            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }
        `}>
          {badge}
        </span>
      )}
    </button>
  );
};

Tab.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Tabs.Panel - Contenu d'un onglet
 */
const TabPanel = ({
  value,
  children,
  keepMounted = false,
  className = ''
}) => {
  const { activeValue } = useContext(TabsContext);
  
  const isActive = activeValue === value;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={`
        ${isActive ? 'animate-fadeIn' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

TabPanel.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  keepMounted: PropTypes.bool,
  className: PropTypes.string
};

// Attacher les sous-composants
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;