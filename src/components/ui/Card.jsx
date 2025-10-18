// src/components/ui/Card.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Card avec glassmorphism
 * Support Light/Dark mode, sections Header/Body/Footer, variantes
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Card = forwardRef(({
  children,
  variant = 'glass',
  bordered = false,
  borderColor = 'default',
  hoverable = false,
  clickable = false,
  padding = 'md',
  className = '',
  onClick,
  
  // Sections optionnelles
  header,
  footer,
  
  ...props
}, ref) => {

  // Classes de base
  const baseClasses = `
    rounded-2xl
    transition-all duration-200
  `;

  // Classes selon la variante
  const variantClasses = {
    // Glassmorphism (par défaut) - Utilise les classes CSS de index.css
    glass: `
      glass-light dark:glass-dark
    `,
    
    // Glassmorphism intense (plus opaque)
    'glass-intense': `
      glass-intense-light dark:glass-intense-dark
    `,
    
    // Solid blanc/gris
    solid: `
      bg-white dark:bg-gray-800
      shadow-lg
      border border-gray-200 dark:border-gray-700
    `,
    
    // Teal accent (bordure Teal) 🌊
    teal: `
      glass-light dark:glass-dark
      border-2 border-haiti-teal dark:border-haiti-teal-light
    `,
    
    // Blue accent (bordure Bleu Haiti)
    blue: `
      glass-light dark:glass-dark
      border-2 border-haiti-blue dark:border-blue-400
    `,
    
    // Red accent (bordure Rouge Haiti)
    red: `
      glass-light dark:glass-dark
      border-2 border-haiti-red dark:border-red-400
    `,
    
    // Outline simple
    outline: `
      bg-transparent
      border-2 border-gray-300 dark:border-gray-600
    `,
  };

  // Classes pour bordure supplémentaire (si bordered=true)
  const borderClasses = {
    default: '',
    teal: 'border-2 border-haiti-teal dark:border-haiti-teal-light',
    blue: 'border-2 border-haiti-blue dark:border-blue-400',
    red: 'border-2 border-haiti-red dark:border-red-400',
    gray: 'border-2 border-gray-300 dark:border-gray-600',
  };

  // Classes de padding
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Classes pour hover effect
  const hoverClasses = hoverable ? `
    hover:shadow-xl
    hover:scale-[1.02]
    hover:-translate-y-1
  ` : '';

  // Classes pour clickable
  const clickableClasses = clickable || onClick ? `
    cursor-pointer
    active:scale-[0.98]
  ` : '';

  // Combiner toutes les classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${bordered ? borderClasses[borderColor] : ''}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Classes pour les sections
  const headerClasses = `
    pb-4
    border-b border-gray-200 dark:border-gray-700
    mb-6
  `;

  const footerClasses = `
    pt-4
    border-t border-gray-200 dark:border-gray-700
    mt-6
  `;

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      {...props}
    >
      {/* Wrapper avec padding si pas de sections */}
      {!header && !footer ? (
        <div className={paddingClasses[padding]}>
          {children}
        </div>
      ) : (
        // Avec sections Header/Footer
        <div className={paddingClasses[padding]}>
          {/* Header */}
          {header && (
            <div className={headerClasses}>
              {header}
            </div>
          )}

          {/* Body */}
          <div>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={footerClasses}>
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

// Sous-composants pour faciliter l'usage
Card.Header = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`
      text-lg font-bold
      text-gray-900 dark:text-white
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));
Card.Header.displayName = 'Card.Header';

Card.Title = forwardRef(({ children, className = '', ...props }, ref) => (
  <h3
    ref={ref}
    className={`
      text-xl font-bold
      text-gray-900 dark:text-white
      ${className}
    `}
    {...props}
  >
    {children}
  </h3>
));
Card.Title.displayName = 'Card.Title';

Card.Description = forwardRef(({ children, className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`
      text-sm
      text-gray-600 dark:text-gray-400
      ${className}
    `}
    {...props}
  >
    {children}
  </p>
));
Card.Description.displayName = 'Card.Description';

Card.Body = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`
      text-gray-700 dark:text-gray-300
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));
Card.Body.displayName = 'Card.Body';

Card.Footer = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`
      flex items-center justify-between
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));
Card.Footer.displayName = 'Card.Footer';

// PropTypes
Card.propTypes = {
  /** Contenu de la card */
  children: PropTypes.node.isRequired,
  
  /** Variante visuelle de la card */
  variant: PropTypes.oneOf([
    'glass',
    'glass-intense',
    'solid',
    'teal',
    'blue',
    'red',
    'outline'
  ]),
  
  /** Ajouter une bordure supplémentaire */
  bordered: PropTypes.bool,
  
  /** Couleur de la bordure si bordered=true */
  borderColor: PropTypes.oneOf(['default', 'teal', 'blue', 'red', 'gray']),
  
  /** Effet hover (shadow + scale) */
  hoverable: PropTypes.bool,
  
  /** Card cliquable (cursor pointer + active state) */
  clickable: PropTypes.bool,
  
  /** Padding interne */
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
  
  /** Fonction appelée au clic */
  onClick: PropTypes.func,
  
  /** Contenu du header (optionnel) */
  header: PropTypes.node,
  
  /** Contenu du footer (optionnel) */
  footer: PropTypes.node,
};

// Valeurs par défaut
Card.defaultProps = {
  variant: 'glass',
  bordered: false,
  borderColor: 'default',
  hoverable: false,
  clickable: false,
  padding: 'md',
  className: '',
};

export default Card;