// src/components/ui/Avatar.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { User } from 'lucide-react';

/**
 * Composant Avatar pour photos de profil
 * Support images, initiales, status, tailles
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Avatar = forwardRef(({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  shape = 'circle',
  status,
  statusColor = 'green',
  fallback,
  className = '',
  ...props
}, ref) => {

  // Générer les initiales depuis le nom
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = name ? getInitials(name) : fallback || '';

  // Classes de taille
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  // Classes de forme
  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  // Classes de base
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold
    bg-gradient-to-br from-haiti-teal to-haiti-blue
    text-white
    overflow-hidden
    flex-shrink-0
    relative
  `;

  // Combiner les classes
  const avatarClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${shapeClasses[shape]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Taille du status indicator
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  // Couleurs du status
  const statusColors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    gray: 'bg-gray-400',
    teal: 'bg-haiti-teal',
    blue: 'bg-haiti-blue',
  };

  return (
    <div
      ref={ref}
      className={avatarClasses}
      {...props}
    >
      {/* Image si disponible */}
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback vers initiales si l'image ne charge pas
            e.target.style.display = 'none';
          }}
        />
      ) : initials ? (
        // Initiales
        <span className="select-none">{initials}</span>
      ) : (
        // Icône par défaut
        <User size={size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : size === 'xl' ? 32 : 40} />
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[statusColor]}
            ${shape === 'circle' ? 'rounded-full' : 'rounded'}
            border-2 border-white dark:border-gray-900
          `}
          aria-label={status}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// Sous-composant Avatar.Group (groupe d'avatars empilés)
Avatar.Group = forwardRef(({ 
  children,
  max = 3,
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  
  const childrenArray = Array.isArray(children) ? children : [children];
  const displayChildren = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  // Espacement selon la taille
  const spacingClasses = {
    xs: '-space-x-2',
    sm: '-space-x-2',
    md: '-space-x-3',
    lg: '-space-x-3',
    xl: '-space-x-4',
    '2xl': '-space-x-5',
  };

  return (
    <div
      ref={ref}
      className={`flex ${spacingClasses[size]} ${className}`}
      {...props}
    >
      {displayChildren.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-white dark:ring-gray-900"
          style={{ zIndex: displayChildren.length - index }}
        >
          {child}
        </div>
      ))}
      
      {/* Avatar +N si plus d'avatars que max */}
      {remaining > 0 && (
        <div
          className="ring-2 ring-white dark:ring-gray-900"
          style={{ zIndex: 0 }}
        >
          <Avatar
            size={size}
            fallback={`+${remaining}`}
            className="bg-gray-500"
          />
        </div>
      )}
    </div>
  );
});
Avatar.Group.displayName = 'Avatar.Group';

// PropTypes
Avatar.propTypes = {
  /** URL de l'image */
  src: PropTypes.string,
  
  /** Texte alternatif de l'image */
  alt: PropTypes.string,
  
  /** Nom complet (pour générer les initiales) */
  name: PropTypes.string,
  
  /** Taille de l'avatar */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  
  /** Forme de l'avatar */
  shape: PropTypes.oneOf(['circle', 'rounded', 'square']),
  
  /** Afficher un status indicator */
  status: PropTypes.string,
  
  /** Couleur du status indicator */
  statusColor: PropTypes.oneOf(['green', 'red', 'orange', 'gray', 'teal', 'blue']),
  
  /** Texte de fallback si pas de nom ni d'image */
  fallback: PropTypes.string,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

Avatar.Group.propTypes = {
  /** Avatars à afficher */
  children: PropTypes.node.isRequired,
  
  /** Nombre maximum d'avatars à afficher */
  max: PropTypes.number,
  
  /** Taille des avatars */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

// Valeurs par défaut
Avatar.defaultProps = {
  alt: 'Avatar',
  size: 'md',
  shape: 'circle',
  statusColor: 'green',
  className: '',
};

Avatar.Group.defaultProps = {
  max: 3,
  size: 'md',
  className: '',
};

export default Avatar;