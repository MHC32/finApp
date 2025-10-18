// src/components/ui/Modal.jsx
import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Composant Modal avec overlay glassmorphism
 * Support animations, ESC key, click outside, sizes
 * Palette Haiti 🇭🇹 avec Teal Turquoise 🌊
 */
const Modal = forwardRef(({
  isOpen = false,
  onClose,
  children,
  
  // Configuration
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  
  // Sections
  title,
  header,
  footer,
  
  // Style
  variant = 'glass',
  centered = true,
  className = '',
  overlayClassName = '',
  
  ...props
}, ref) => {

  // Bloquer le scroll du body quand modal ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Fermer avec ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Handler pour click sur overlay
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Ne rien rendre si fermé
  if (!isOpen) return null;

  // Classes pour l'overlay
  const overlayClasses = `
    fixed inset-0 z-50
    bg-black/50 backdrop-blur-sm
    flex ${centered ? 'items-center justify-center' : 'items-start justify-center pt-20'}
    p-4
    animate-fadeIn
    ${overlayClassName}
  `.trim().replace(/\s+/g, ' ');

  // Classes selon la taille
  const sizeClasses = {
    sm: 'max-w-sm w-full',
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
    xl: 'max-w-xl w-full',
    '2xl': 'max-w-2xl w-full',
    '3xl': 'max-w-3xl w-full',
    '4xl': 'max-w-4xl w-full',
    full: 'max-w-full w-full h-full',
  };

  // Classes selon la variante
  const variantClasses = {
    glass: 'glass-light dark:glass-dark',
    'glass-intense': 'glass-intense-light dark:glass-intense-dark',
    solid: 'bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700',
    teal: 'glass-light dark:glass-dark border-2 border-haiti-teal dark:border-haiti-teal-light',
    blue: 'glass-light dark:glass-dark border-2 border-haiti-blue dark:border-blue-400',
  };

  // Classes pour le modal
  const modalClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    rounded-2xl
    max-h-[90vh]
    overflow-hidden
    animate-slideUp
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Classes pour le header
  const headerClasses = `
    flex items-center justify-between
    px-6 py-4
    border-b border-gray-200 dark:border-gray-700
  `;

  // Classes pour le body
  const bodyClasses = `
    px-6 py-4
    overflow-y-auto
    max-h-[calc(90vh-140px)]
  `;

  // Classes pour le footer
  const footerClasses = `
    px-6 py-4
    border-t border-gray-200 dark:border-gray-700
    flex items-center justify-end gap-3
  `;

  // Contenu du modal
  const modalContent = (
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div ref={ref} className={modalClasses} {...props}>
        {/* Header */}
        {(title || header || showCloseButton) && (
          <div className={headerClasses}>
            <div className="flex-1">
              {header || (
                title && (
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  ml-4 p-2
                  text-gray-400 hover:text-gray-600
                  dark:text-gray-500 dark:hover:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  rounded-lg
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-haiti-teal
                "
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={bodyClasses}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={footerClasses}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Utiliser un portal pour monter le modal au niveau du body
  return createPortal(modalContent, document.body);
});

Modal.displayName = 'Modal';

// Sous-composants pour faciliter l'usage
Modal.Header = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </div>
));
Modal.Header.displayName = 'Modal.Header';

Modal.Title = forwardRef(({ children, className = '', ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </h2>
));
Modal.Title.displayName = 'Modal.Title';

Modal.Body = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-gray-700 dark:text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </div>
));
Modal.Body.displayName = 'Modal.Body';

Modal.Footer = forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center justify-end gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
));
Modal.Footer.displayName = 'Modal.Footer';

// PropTypes
Modal.propTypes = {
  /** Modal ouvert ou fermé */
  isOpen: PropTypes.bool.isRequired,
  
  /** Fonction appelée pour fermer le modal */
  onClose: PropTypes.func.isRequired,
  
  /** Contenu du modal */
  children: PropTypes.node.isRequired,
  
  /** Taille du modal */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']),
  
  /** Fermer en cliquant sur l'overlay */
  closeOnOverlayClick: PropTypes.bool,
  
  /** Fermer avec la touche ESC */
  closeOnEsc: PropTypes.bool,
  
  /** Afficher le bouton X de fermeture */
  showCloseButton: PropTypes.bool,
  
  /** Titre du modal (simple string) */
  title: PropTypes.string,
  
  /** Header personnalisé (élément React) */
  header: PropTypes.node,
  
  /** Footer personnalisé (élément React) */
  footer: PropTypes.node,
  
  /** Variante visuelle */
  variant: PropTypes.oneOf(['glass', 'glass-intense', 'solid', 'teal', 'blue']),
  
  /** Centrer verticalement */
  centered: PropTypes.bool,
  
  /** Classes CSS additionnelles pour le modal */
  className: PropTypes.string,
  
  /** Classes CSS additionnelles pour l'overlay */
  overlayClassName: PropTypes.string,
};

// Valeurs par défaut
Modal.defaultProps = {
  size: 'md',
  closeOnOverlayClick: true,
  closeOnEsc: true,
  showCloseButton: true,
  variant: 'glass',
  centered: true,
  className: '',
  overlayClassName: '',
};

export default Modal;