// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  padding = 'normal', // none, sm, normal, lg
  ...props 
}) => {
  
  // ✅ Variations de padding
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8'
  };

  // ✅ Classes de base avec dark mode complet
  const baseClasses = [
    'bg-white dark:bg-gray-800',
    'border border-gray-200 dark:border-gray-700',
    'rounded-lg shadow-sm',
    'transition-colors duration-200',
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={baseClasses} {...props}>
      {/* ✅ Header avec titre et sous-titre */}
      {(title || subtitle) && (
        <div className={`mb-4 ${headerClassName}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* ✅ Contenu principal */}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

// ✅ Variantes spécialisées de Card
export const AlertCard = ({ 
  children, 
  type = 'info', 
  title,
  className = '',
  ...props 
}) => {
  const alertTypes = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  };

  const textColors = {
    info: 'text-blue-800 dark:text-blue-300',
    success: 'text-green-800 dark:text-green-300',
    warning: 'text-yellow-800 dark:text-yellow-300',
    error: 'text-red-800 dark:text-red-300'
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${alertTypes[type]} ${className}`}
      {...props}
    >
      {title && (
        <h4 className={`font-medium mb-2 ${textColors[type]}`}>
          {title}
        </h4>
      )}
      <div className={textColors[type]}>
        {children}
      </div>
    </div>
  );
};

// ✅ Card avec stats
export const StatsCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className = '',
  ...props 
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <Card className={`${className}`} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {title && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
          )}
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;