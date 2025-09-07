// src/components/ui/Badge.jsx
import React from 'react';
import { XIcon } from 'lucide-react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  icon: Icon,
  className = '',
  ...props 
}) => {
  
  // ✅ Variants avec dark mode complet
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    primary: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
    
    // Variants solides
    'solid-primary': 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500',
    'solid-success': 'bg-green-600 text-white border-green-600 dark:bg-green-500 dark:border-green-500',
    'solid-warning': 'bg-yellow-500 text-white border-yellow-500 dark:bg-yellow-600 dark:border-yellow-600',
    'solid-danger': 'bg-red-600 text-white border-red-600 dark:bg-red-500 dark:border-red-500',
    
    // Variants outline
    'outline-primary': 'bg-transparent text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400',
    'outline-success': 'bg-transparent text-green-600 border-green-600 dark:text-green-400 dark:border-green-400',
    'outline-warning': 'bg-transparent text-yellow-600 border-yellow-600 dark:text-yellow-400 dark:border-yellow-400',
    'outline-danger': 'bg-transparent text-red-600 border-red-600 dark:text-red-400 dark:border-red-400'
  };

  // ✅ Tailles
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-4 py-1 text-base'
  };

  // ✅ Classes de base
  const baseClasses = [
    'inline-flex items-center',
    'font-medium rounded-full border',
    'transition-colors duration-200',
    sizes[size],
    variants[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={baseClasses} {...props}>
      {/* ✅ Icône gauche */}
      {Icon && (
        <Icon className="w-3 h-3 mr-1" />
      )}
      
      {/* ✅ Contenu */}
      {children}
      
      {/* ✅ Bouton de suppression */}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 -mr-0.5 flex-shrink-0 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
        >
          <XIcon className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// ✅ Badge de statut pré-configuré
export const StatusBadge = ({ status, className = '', ...props }) => {
  const statusConfig = {
    active: { variant: 'success', text: 'Actif', icon: '🟢' },
    inactive: { variant: 'default', text: 'Inactif', icon: '⚫' },
    pending: { variant: 'warning', text: 'En attente', icon: '🟡' },
    error: { variant: 'danger', text: 'Erreur', icon: '🔴' },
    success: { variant: 'success', text: 'Succès', icon: '✅' },
    warning: { variant: 'warning', text: 'Attention', icon: '⚠️' },
    info: { variant: 'info', text: 'Info', icon: 'ℹ️' }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge 
      variant={config.variant} 
      className={className}
      {...props}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
};

// ✅ Badge de priorité
export const PriorityBadge = ({ priority, className = '', ...props }) => {
  const priorityConfig = {
    low: { variant: 'success', text: 'Faible', icon: '🟢' },
    medium: { variant: 'warning', text: 'Moyenne', icon: '🟡' },
    high: { variant: 'danger', text: 'Haute', icon: '🔴' },
    urgent: { variant: 'solid-danger', text: 'Urgent', icon: '🚨' }
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge 
      variant={config.variant} 
      className={className}
      {...props}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
};

// ✅ Badge de notification avec compteur
export const NotificationBadge = ({ 
  count, 
  maxCount = 99, 
  showZero = false,
  className = '',
  size = 'sm',
  ...props 
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  if (!showZero && (!count || count === 0)) {
    return null;
  }

  return (
    <Badge 
      variant="solid-danger" 
      size={size}
      className={`${className}`}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// ✅ Badge de devise
export const CurrencyBadge = ({ currency, amount, className = '', ...props }) => {
  const currencyConfig = {
    HTG: { variant: 'primary', symbol: 'G', flag: '🇭🇹' },
    USD: { variant: 'success', symbol: '$', flag: '🇺🇸' },
    EUR: { variant: 'info', symbol: '€', flag: '🇪🇺' }
  };

  const config = currencyConfig[currency] || currencyConfig.HTG;
  
  return (
    <Badge 
      variant={config.variant} 
      className={className}
      {...props}
    >
      <span className="mr-1">{config.flag}</span>
      {amount ? `${config.symbol}${amount.toLocaleString()}` : currency}
    </Badge>
  );
};

// ✅ Badge de catégorie avec émoji
export const CategoryBadge = ({ 
  category, 
  emoji, 
  color = 'default',
  className = '',
  removable = false,
  onRemove,
  ...props 
}) => {
  return (
    <Badge 
      variant={color}
      className={className}
      removable={removable}
      onRemove={onRemove}
      {...props}
    >
      {emoji && <span className="mr-1">{emoji}</span>}
      {category}
    </Badge>
  );
};

// ✅ Badge en ligne (inline) pour les listes
export const InlineBadge = ({ children, className = '', ...props }) => {
  return (
    <Badge 
      size="xs"
      variant="outline-primary"
      className={`ml-2 ${className}`}
      {...props}
    >
      {children}
    </Badge>
  );
};

export default Badge;