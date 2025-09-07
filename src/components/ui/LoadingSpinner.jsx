// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue',
  variant = 'spinner', // spinner, dots, pulse, bars
  text,
  className = '',
  fullScreen = false,
  overlay = false,
  ...props 
}) => {
  
  // ✅ Tailles avec dark mode
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  // ✅ Couleurs avec support dark mode
  const colors = {
    blue: 'border-blue-600 dark:border-blue-400',
    gray: 'border-gray-600 dark:border-gray-400',
    green: 'border-green-600 dark:border-green-400',
    red: 'border-red-600 dark:border-red-400',
    yellow: 'border-yellow-600 dark:border-yellow-400',
    purple: 'border-purple-600 dark:border-purple-400',
    white: 'border-white'
  };

  // ✅ Variant Spinner classique
  const SpinnerVariant = () => (
    <div
      className={`
        ${sizes[size]} 
        border-2 border-transparent 
        border-t-current 
        rounded-full animate-spin
        ${colors[color]}
        ${className}
      `}
      {...props}
    />
  );

  // ✅ Variant Points qui pulsent
  const DotsVariant = () => {
    const dotSize = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
      '2xl': 'w-4 h-4'
    };

    return (
      <div className={`flex space-x-1 ${className}`} {...props}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              ${dotSize[size]} 
              bg-current rounded-full animate-pulse
              ${colors[color]}
            `}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    );
  };

  // ✅ Variant Pulse (cercle qui grandit/rétrécit)
  const PulseVariant = () => (
    <div
      className={`
        ${sizes[size]} 
        bg-current rounded-full animate-ping
        ${colors[color]}
        ${className}
      `}
      {...props}
    />
  );

  // ✅ Variant Barres qui bougent
  const BarsVariant = () => {
    const barHeight = {
      xs: 'h-3',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
      '2xl': 'h-16'
    };

    const barWidth = {
      xs: 'w-0.5',
      sm: 'w-1',
      md: 'w-1',
      lg: 'w-1.5',
      xl: 'w-2',
      '2xl': 'w-2.5'
    };

    return (
      <div className={`flex items-end space-x-1 ${className}`} {...props}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`
              ${barWidth[size]} 
              ${barHeight[size]} 
              bg-current animate-bounce
              ${colors[color]}
            `}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    );
  };

  // ✅ Sélection du variant
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'bars':
        return <BarsVariant />;
      default:
        return <SpinnerVariant />;
    }
  };

  // ✅ Container avec texte
  const SpinnerWithText = () => (
    <div className="flex flex-col items-center space-y-3">
      {renderSpinner()}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  // ✅ Rendu fullScreen avec overlay dark mode
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <SpinnerWithText />
      </div>
    );
  }

  // ✅ Rendu avec overlay
  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75">
        <SpinnerWithText />
      </div>
    );
  }

  // ✅ Rendu simple
  return text ? <SpinnerWithText /> : renderSpinner();
};

// ✅ Composants pré-configurés
export const PageLoader = ({ text = "Chargement..." }) => (
  <LoadingSpinner 
    fullScreen 
    size="xl" 
    variant="spinner" 
    text={text}
  />
);

export const SectionLoader = ({ text }) => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner 
      size="lg" 
      variant="spinner" 
      text={text}
    />
  </div>
);

export const ButtonLoader = ({ size = 'sm' }) => (
  <LoadingSpinner 
    size={size} 
    variant="spinner" 
    color="white"
  />
);

export const InlineLoader = ({ text }) => (
  <div className="flex items-center space-x-2">
    <LoadingSpinner size="sm" variant="spinner" />
    {text && (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {text}
      </span>
    )}
  </div>
);

// ✅ Skeleton Loader pour les cartes
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);

// ✅ Skeleton pour les listes
export const SkeletonList = ({ count = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;