import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant ProgressBar - Barre de progression
 * 
 * Features:
 * - Progression linéaire
 * - Progression circulaire
 * - Couleurs personnalisées
 * - Labels et valeurs
 * - Animations smooth
 * - Support Light/Dark
 * 
 * @example
 * <ProgressBar
 *   value={75}
 *   max={100}
 *   label="Budget utilisé"
 *   showValue
 *   color="teal"
 * />
 */
const ProgressBar = forwardRef(({
  // Valeur
  value = 0,
  max = 100,
  
  // Labels
  label = '',
  showValue = false,
  valueFormat = 'percent', // 'percent', 'fraction', 'custom'
  valueFormatter = null,
  
  // Style
  size = 'md',
  color = 'teal',
  variant = 'default',
  striped = false,
  animated = false,
  
  // Type
  type = 'linear', // 'linear', 'circular'
  
  className = ''
}, ref) => {
  // Calculer le pourcentage
  const percentage = Math.min((value / max) * 100, 100);

  // Formater la valeur affichée
  const getFormattedValue = () => {
    if (valueFormatter) {
      return valueFormatter(value, max);
    }

    switch (valueFormat) {
      case 'percent':
        return `${Math.round(percentage)}%`;
      case 'fraction':
        return `${value} / ${max}`;
      default:
        return `${value}`;
    }
  };

  // Classes de couleur
  const colorClasses = {
    teal: 'bg-teal-600 dark:bg-teal-500',
    blue: 'bg-blue-600 dark:bg-blue-500',
    red: 'bg-red-600 dark:bg-red-500',
    green: 'bg-green-600 dark:bg-green-500',
    yellow: 'bg-yellow-500 dark:bg-yellow-400',
    orange: 'bg-orange-600 dark:bg-orange-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    gray: 'bg-gray-600 dark:bg-gray-500'
  };

  // Classes de taille pour linear
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };

  // Classes de taille pour circular
  const circularSizes = {
    sm: { size: 60, strokeWidth: 4 },
    md: { size: 80, strokeWidth: 6 },
    lg: { size: 120, strokeWidth: 8 },
    xl: { size: 160, strokeWidth: 10 }
  };

  if (type === 'circular') {
    const { size: circleSize, strokeWidth } = circularSizes[size];
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div ref={ref} className={`inline-flex flex-col items-center gap-2 ${className}`}>
        <div className="relative" style={{ width: circleSize, height: circleSize }}>
          <svg
            width={circleSize}
            height={circleSize}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            
            {/* Progress circle */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClasses[color]} transition-all duration-500 ease-out`}
            />
          </svg>

          {/* Center value */}
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-bold ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-xl'} text-gray-900 dark:text-white`}>
                {getFormattedValue()}
              </span>
            </div>
          )}
        </div>

        {/* Label */}
        {label && (
          <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
            {label}
          </span>
        )}
      </div>
    );
  }

  // Linear progress bar
  return (
    <div ref={ref} className={`w-full ${className}`}>
      {/* Header: Label + Value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {getFormattedValue()}
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div
        className={`
          ${sizeClasses[size]}
          w-full
          ${variant === 'rounded' ? 'rounded-full' : variant === 'square' ? 'rounded-none' : 'rounded'}
          bg-gray-200 dark:bg-gray-700
          overflow-hidden
        `}
      >
        {/* Progress bar */}
        <div
          className={`
            ${sizeClasses[size]}
            ${colorClasses[color]}
            ${striped ? 'bg-striped' : ''}
            ${animated ? 'animate-progress' : ''}
            transition-all duration-500 ease-out
            ${variant === 'rounded' ? 'rounded-full' : variant === 'square' ? 'rounded-none' : 'rounded'}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

ProgressBar.propTypes = {
  // Valeur
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  
  // Labels
  label: PropTypes.string,
  showValue: PropTypes.bool,
  valueFormat: PropTypes.oneOf(['percent', 'fraction', 'custom']),
  valueFormatter: PropTypes.func,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'green', 'yellow', 'orange', 'purple', 'gray']),
  variant: PropTypes.oneOf(['default', 'rounded', 'square']),
  striped: PropTypes.bool,
  animated: PropTypes.bool,
  
  // Type
  type: PropTypes.oneOf(['linear', 'circular']),
  
  className: PropTypes.string
};

export default ProgressBar;