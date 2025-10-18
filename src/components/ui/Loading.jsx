// src/components/ui/Loading.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Composant Loading avec spinner et skeleton loaders
 * Support overlay, inline, différentes tailles
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Loading = forwardRef(({
  type = 'spinner',
  size = 'md',
  color = 'teal',
  overlay = false,
  fullPage = false,
  text,
  className = '',
  ...props
}, ref) => {

  // Classes de taille pour spinner
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Classes de couleur pour spinner
  const spinnerColors = {
    teal: 'text-haiti-teal dark:text-haiti-teal-light',
    blue: 'text-haiti-blue dark:text-blue-400',
    red: 'text-haiti-red dark:text-red-400',
    gray: 'text-gray-600 dark:text-gray-400',
    white: 'text-white',
  };

  // Rendu Spinner
  if (type === 'spinner') {
    const spinnerContent = (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <Loader2 
          className={`${spinnerSizes[size]} ${spinnerColors[color]} animate-spin`}
        />
        {text && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    );

    // Full page overlay
    if (fullPage) {
      return (
        <div 
          ref={ref}
          className="fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center"
          {...props}
        >
          {spinnerContent}
        </div>
      );
    }

    // Simple overlay (relatif au parent)
    if (overlay) {
      return (
        <div 
          ref={ref}
          className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
          {...props}
        >
          {spinnerContent}
        </div>
      );
    }

    // Inline spinner
    return (
      <div ref={ref} {...props}>
        {spinnerContent}
      </div>
    );
  }

  // Rendu Dots (3 points animés)
  if (type === 'dots') {
    const dotSizes = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-5 h-5',
    };

    return (
      <div 
        ref={ref}
        className={`flex items-center gap-2 ${className}`}
        {...props}
      >
        <div className={`${dotSizes[size]} ${spinnerColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${dotSizes[size]} ${spinnerColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${dotSizes[size]} ${spinnerColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        {text && (
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {text}
          </span>
        )}
      </div>
    );
  }

  // Rendu Pulse (cercle pulsant)
  if (type === 'pulse') {
    const pulseSizes = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20',
    };

    const pulseColors = {
      teal: 'bg-haiti-teal',
      blue: 'bg-haiti-blue',
      red: 'bg-haiti-red',
      gray: 'bg-gray-600',
      white: 'bg-white',
    };

    return (
      <div 
        ref={ref}
        className={`flex flex-col items-center justify-center gap-3 ${className}`}
        {...props}
      >
        <div className={`${pulseSizes[size]} ${pulseColors[color]} rounded-full animate-pulse`} />
        {text && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Rendu Skeleton (par défaut)
  return null;
});

Loading.displayName = 'Loading';

// Sous-composant Skeleton
Loading.Skeleton = forwardRef(({ 
  variant = 'text',
  width,
  height,
  className = '',
  ...props 
}, ref) => {
  
  const baseClasses = `
    bg-gray-200 dark:bg-gray-700
    animate-pulse
    rounded
  `;

  const variantClasses = {
    text: 'h-4',
    title: 'h-6',
    avatar: 'rounded-full',
    card: 'h-32',
    button: 'h-10',
    input: 'h-10',
  };

  const widthClass = width ? `w-[${width}]` : variant === 'avatar' ? 'w-12 h-12' : 'w-full';
  const heightClass = height ? `h-[${height}]` : '';

  return (
    <div
      ref={ref}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${widthClass}
        ${heightClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    />
  );
});
Loading.Skeleton.displayName = 'Loading.Skeleton';

// Sous-composant Skeleton Card (card complète)
Loading.SkeletonCard = forwardRef(({ className = '', ...props }, ref) => (
  <div 
    ref={ref}
    className={`glass-light dark:glass-dark glass-card space-y-4 ${className}`}
    {...props}
  >
    <div className="flex items-center gap-3">
      <Loading.Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Loading.Skeleton variant="title" width="60%" />
        <Loading.Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Loading.Skeleton variant="card" />
    <div className="space-y-2">
      <Loading.Skeleton variant="text" />
      <Loading.Skeleton variant="text" width="80%" />
      <Loading.Skeleton variant="text" width="90%" />
    </div>
  </div>
));
Loading.SkeletonCard.displayName = 'Loading.SkeletonCard';

// Sous-composant Skeleton List
Loading.SkeletonList = forwardRef(({ count = 3, className = '', ...props }, ref) => (
  <div ref={ref} className={`space-y-3 ${className}`} {...props}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 glass-light dark:glass-dark rounded-lg">
        <Loading.Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Loading.Skeleton variant="text" width="70%" />
          <Loading.Skeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
));
Loading.SkeletonList.displayName = 'Loading.SkeletonList';

// Sous-composant Skeleton Table
Loading.SkeletonTable = forwardRef(({ rows = 5, columns = 4, className = '', ...props }, ref) => (
  <div ref={ref} className={`glass-light dark:glass-dark glass-card ${className}`} {...props}>
    {/* Header */}
    <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Loading.Skeleton key={i} variant="title" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div 
        key={rowIndex} 
        className="grid gap-4 mb-3" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Loading.Skeleton key={colIndex} variant="text" />
        ))}
      </div>
    ))}
  </div>
));
Loading.SkeletonTable.displayName = 'Loading.SkeletonTable';

// PropTypes
Loading.propTypes = {
  /** Type de loading */
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'skeleton']),
  
  /** Taille */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  
  /** Couleur (Haiti colors) */
  color: PropTypes.oneOf(['teal', 'blue', 'red', 'gray', 'white']),
  
  /** Overlay relatif au parent */
  overlay: PropTypes.bool,
  
  /** Full page overlay */
  fullPage: PropTypes.bool,
  
  /** Texte d'accompagnement */
  text: PropTypes.string,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

Loading.Skeleton.propTypes = {
  /** Variante du skeleton */
  variant: PropTypes.oneOf(['text', 'title', 'avatar', 'card', 'button', 'input']),
  
  /** Largeur personnalisée */
  width: PropTypes.string,
  
  /** Hauteur personnalisée */
  height: PropTypes.string,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

// Valeurs par défaut
Loading.defaultProps = {
  type: 'spinner',
  size: 'md',
  color: 'teal',
  overlay: false,
  fullPage: false,
  className: '',
};

export default Loading;