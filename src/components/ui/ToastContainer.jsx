// src/components/ui/ToastContainer.jsx
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Toast from './Toast';

/**
 * Container pour afficher plusieurs toasts
 * Gère le positionnement et l'empilement des notifications
 */
const ToastContainer = ({ toasts, position = 'top-right', onRemove }) => {
  
  // Classes de positionnement
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  // Classes du container
  const containerClasses = `
    fixed ${positionClasses[position]}
    z-50
    flex flex-col gap-3
    pointer-events-none
  `.trim().replace(/\s+/g, ' ');

  // Filtrer les toasts pour cette position
  const positionToasts = toasts.filter(toast => toast.position === position);

  if (positionToasts.length === 0) return null;

  return createPortal(
    <div className={containerClasses}>
      {positionToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            onClose={onRemove}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

ToastContainer.propTypes = {
  /** Liste des toasts à afficher */
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
    position: PropTypes.oneOf([
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
      'top-center',
      'bottom-center'
    ]),
  })).isRequired,
  
  /** Position par défaut (si non spécifiée dans le toast) */
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center'
  ]),
  
  /** Fonction pour retirer un toast */
  onRemove: PropTypes.func.isRequired,
};

export default ToastContainer;