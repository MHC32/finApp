// src/components/TokenExpiryModal.jsx
import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useTokenExpiry } from '../hooks/useTokenExpiry';

const TokenExpiryModal = () => {
  const {
    showTokenExpiryModal,
    tokenExpiryCountdown,
    refreshLoading,
    extendSession,
    letSessionExpire
  } = useTokenExpiry();

  const handleExtend = async () => {
    await extendSession();
  };

  const handleLogout = () => {
    letSessionExpire();
  };

  return (
    <Modal
      isOpen={showTokenExpiryModal}
      onClose={handleLogout}
      size="md"
      closeOnOverlayClick={false}
      closeOnEsc={false}
      showCloseButton={false}
      variant="teal"
    >
      <div className="text-center p-6">
        {/* Icône */}
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⏰</span>
        </div>
        
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Session sur le point d'expirer
        </h3>
        
        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Votre session expirera dans{' '}
          <span className="font-bold text-orange-500">
            {tokenExpiryCountdown} minute{tokenExpiryCountdown > 1 ? 's' : ''}
          </span>
          . Souhaitez-vous rester connecté ?
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={refreshLoading}
          >
            Se déconnecter
          </Button>
          
          <Button
            onClick={handleExtend}
            disabled={refreshLoading}
            isLoading={refreshLoading}
          >
            Rester connecté
          </Button>
        </div>
        
        {/* Message de chargement */}
        {refreshLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Prolongement de votre session...
          </p>
        )}
      </div>
    </Modal>
  );
};

export default TokenExpiryModal;