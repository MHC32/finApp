// src/components/ui/Modal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  ...props
}) => {
  // ✅ Tailles de modal
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    full: 'max-w-full mx-4'
  };

  // ✅ Gestion de l'échappement
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // ✅ Gestion du scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ✅ Gestion du clic sur overlay
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      {...props}
    >
      {/* ✅ Backdrop avec dark mode */}
      <div 
        className="flex min-h-screen items-center justify-center p-4 text-center"
        onClick={handleOverlayClick}
      >
        {/* Overlay sombre */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
          aria-hidden="true"
        />

        {/* ✅ Contenu de la modal avec dark mode complet */}
        <div 
          className={`
            relative w-full ${sizes[size]} 
            transform overflow-hidden rounded-lg 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700
            shadow-xl transition-all
            text-left align-middle
            ${className}
          `}
        >
          {/* ✅ Header avec dark mode */}
          {(title || showCloseButton) && (
            <div className={`
              flex items-center justify-between 
              px-6 py-4 
              border-b border-gray-200 dark:border-gray-700
              ${headerClassName}
            `}>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    text-gray-400 hover:text-gray-600 
                    dark:text-gray-500 dark:hover:text-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    dark:focus:ring-blue-400
                    rounded-lg p-1 transition-colors
                  "
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* ✅ Body avec dark mode */}
          <div className={`px-6 py-4 ${bodyClassName}`}>
            {children}
          </div>

          {/* ✅ Footer avec dark mode */}
          {footer && (
            <div className={`
              px-6 py-4 
              border-t border-gray-200 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-750
              flex items-center justify-end space-x-3
              ${footerClassName}
            `}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ✅ Utiliser un portal pour le rendu
  return createPortal(modalContent, document.body);
};

// ✅ Modal de confirmation avec dark mode
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer l\'action',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger', // danger, warning, info
  loading = false,
  ...props
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const variantColors = {
    danger: 'danger',
    warning: 'warning',
    info: 'primary'
  };

  const variantIcons = {
    danger: '⚠️',
    warning: '🚨',
    info: 'ℹ️'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${variantIcons[variant]} ${title}`}
      size="sm"
      {...props}
    >
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variantColors[variant]}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

// ✅ Modal d'alerte simple
export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // success, error, warning, info
  buttonText = 'OK',
  ...props
}) => {
  const typeConfig = {
    success: { icon: '✅', color: 'success' },
    error: { icon: '❌', color: 'danger' },
    warning: { icon: '⚠️', color: 'warning' },
    info: { icon: 'ℹ️', color: 'primary' }
  };

  const config = typeConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${config.icon} ${title}`}
      size="sm"
      {...props}
    >
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button
          variant={config.color}
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default Modal;