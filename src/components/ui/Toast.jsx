// src/components/ui/Toast.jsx
import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Composant Toast pour notifications temporaires
 * Support auto-dismiss, positions multiples, animations
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Toast = forwardRef(({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  position = 'top-right',
  onClose,
  className = '',
  ...props
}, ref) => {

  const [isExiting, setIsExiting] = useState(false);

  // Auto-dismiss après duration
  useEffect(() => {
    if (duration === 0) return; // 0 = pas d'auto-dismiss

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Handler pour fermeture avec animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Durée de l'animation de sortie
  };

  // Icônes selon le type
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };
  const Icon = icons[type];

  // Classes selon le type
  const typeClasses = {
    success: `
      glass-light dark:glass-dark
      border-l-4 border-green-500
    `,
    error: `
      glass-light dark:glass-dark
      border-l-4 border-red-500
    `,
    warning: `
      glass-light dark:glass-dark
      border-l-4 border-orange-500
    `,
    info: `
      glass-light dark:glass-dark
      border-l-4 border-haiti-teal
    `,
  };

  // Classes d'animation selon la position
  const animationClasses = {
    'top-right': isExiting ? 'animate-slideOutRight' : 'animate-slideInRight',
    'top-left': isExiting ? 'animate-slideOutLeft' : 'animate-slideInLeft',
    'bottom-right': isExiting ? 'animate-slideOutRight' : 'animate-slideInRight',
    'bottom-left': isExiting ? 'animate-slideOutLeft' : 'animate-slideInLeft',
    'top-center': isExiting ? 'animate-slideOutUp' : 'animate-slideInDown',
    'bottom-center': isExiting ? 'animate-slideOutDown' : 'animate-slideInUp',
  };

  // Couleur de l'icône selon le type
  const iconColorClasses = {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
    warning: 'text-orange-500 dark:text-orange-400',
    info: 'text-haiti-teal dark:text-haiti-teal-light',
  };

  // Classes du toast
  const toastClasses = `
    ${typeClasses[type]}
    ${animationClasses[position]}
    flex items-start gap-3
    p-4
    rounded-lg
    shadow-lg
    min-w-[320px] max-w-md
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div ref={ref} className={toastClasses} {...props}>
      {/* Icône */}
      <div className={`flex-shrink-0 ${iconColorClasses[type]}`}>
        <Icon size={20} />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>

      {/* Bouton fermeture */}
      <button
        onClick={handleClose}
        className="
          flex-shrink-0
          text-gray-400 hover:text-gray-600
          dark:text-gray-500 dark:hover:text-gray-300
          transition-colors
          focus:outline-none
        "
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

// PropTypes
Toast.propTypes = {
  /** ID unique du toast (géré par ToastContainer) */
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Type de notification */
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  
  /** Titre du toast */
  title: PropTypes.string,
  
  /** Message du toast */
  message: PropTypes.string.isRequired,
  
  /** Durée d'affichage en ms (0 = infini) */
  duration: PropTypes.number,
  
  /** Position du toast */
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center'
  ]),
  
  /** Fonction appelée à la fermeture */
  onClose: PropTypes.func,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string,
};

// Valeurs par défaut
Toast.defaultProps = {
  type: 'info',
  duration: 5000,
  position: 'top-right',
  className: '',
};

export default Toast;