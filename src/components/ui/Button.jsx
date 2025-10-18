// src/components/ui/Button.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Composant Button réutilisable avec toutes les variantes
 * Support Light/Dark mode, couleurs Haiti 🇭🇹, glassmorphism optional
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  type = 'button',
  className = '',
  ...props
}, ref) => {

  // Classes de base communes à tous les boutons
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  // Classes selon la taille
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  };

  // Classes selon la variante
  const variantClasses = {
    // Primary : Bleu Haiti (couleur principale)
    primary: `
      bg-haiti-blue hover:bg-blue-700 active:bg-blue-800
      text-white
      focus:ring-blue-500
      shadow-md hover:shadow-lg
    `,
    
    // Secondary : Teal Haiti (turquoise Caraïbes) 🌊
    secondary: `
      bg-haiti-teal hover:bg-teal-700 active:bg-teal-800
      dark:bg-haiti-teal dark:hover:bg-teal-600 dark:active:bg-teal-700
      text-white
      focus:ring-teal-500
      shadow-md hover:shadow-lg
    `,
    
    // Danger : Rouge Haiti (couleur secondaire)
    danger: `
      bg-haiti-red hover:bg-red-700 active:bg-red-800
      text-white
      focus:ring-red-500
      shadow-md hover:shadow-lg
    `,
    
    // Success : Vert
    success: `
      bg-green-600 hover:bg-green-700 active:bg-green-800
      text-white
      focus:ring-green-500
      shadow-md hover:shadow-lg
    `,
    
    // Warning : Orange
    warning: `
      bg-orange-500 hover:bg-orange-600 active:bg-orange-700
      text-white
      focus:ring-orange-500
      shadow-md hover:shadow-lg
    `,
    
    // Ghost : Transparent avec hover
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      dark:hover:bg-gray-800 dark:active:bg-gray-700
      text-gray-700 dark:text-gray-300
      focus:ring-gray-400
    `,
    
    // Outline : Bordure bleu Haiti
    outline: `
      bg-transparent border-2
      border-haiti-blue hover:bg-haiti-blue active:bg-blue-700
      text-haiti-blue hover:text-white
      dark:border-blue-400 dark:text-blue-400
      focus:ring-blue-500
    `,
    
    // Outline Secondary : Bordure teal
    'outline-secondary': `
      bg-transparent border-2
      border-haiti-teal hover:bg-haiti-teal active:bg-teal-700
      text-haiti-teal hover:text-white
      dark:border-teal-400 dark:text-teal-400
      focus:ring-teal-500
    `,
    
    // Outline Danger : Bordure rouge
    'outline-danger': `
      bg-transparent border-2
      border-haiti-red hover:bg-haiti-red active:bg-red-700
      text-haiti-red hover:text-white
      dark:border-red-400 dark:text-red-400
      focus:ring-red-500
    `
  };

  // Classe pour fullWidth
  const widthClass = fullWidth ? 'w-full' : '';

  // Combiner toutes les classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Taille du spinner selon la taille du bouton
  const spinnerSize = {
    sm: 14,
    md: 16,
    lg: 18
  };

  // Taille des icônes selon la taille du bouton
  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Icône gauche */}
      {LeftIcon && !isLoading && (
        <LeftIcon size={iconSize[size]} />
      )}

      {/* Spinner de loading */}
      {isLoading && (
        <Loader2 
          size={spinnerSize[size]} 
          className="animate-spin"
        />
      )}

      {/* Texte du bouton */}
      {children}

      {/* Icône droite */}
      {RightIcon && !isLoading && (
        <RightIcon size={iconSize[size]} />
      )}
    </button>
  );
});

Button.displayName = 'Button';

// PropTypes pour documentation et validation
Button.propTypes = {
  /** Contenu du bouton (texte ou éléments) */
  children: PropTypes.node.isRequired,
  
  /** Variante visuelle du bouton */
  variant: PropTypes.oneOf([
    'primary',
    'secondary', 
    'danger',
    'success',
    'warning',
    'ghost',
    'outline',
    'outline-secondary',
    'outline-danger'
  ]),
  
  /** Taille du bouton */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  
  /** Afficher un état de chargement */
  isLoading: PropTypes.bool,
  
  /** Désactiver le bouton */
  disabled: PropTypes.bool,
  
  /** Bouton prend toute la largeur */
  fullWidth: PropTypes.bool,
  
  /** Icône à gauche (composant lucide-react) */
  leftIcon: PropTypes.elementType,
  
  /** Icône à droite (composant lucide-react) */
  rightIcon: PropTypes.elementType,
  
  /** Fonction appelée au clic */
  onClick: PropTypes.func,
  
  /** Type HTML du bouton */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

// Valeurs par défaut
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  type: 'button',
  className: ''
};

export default Button;