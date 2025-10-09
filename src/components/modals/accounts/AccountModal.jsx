/**
 * =========================================================
 * FinApp Haiti - Account Modal (DESIGN MODERNE)
 * Modal élégant pour création/modification de compte
 * Design épuré avec animations fluides
 * =========================================================
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// @mui material components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import { keyframes } from '@mui/material/styles';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDSnackbar from 'components/MDSnackbar';

// Components
import AccountForm from 'components/forms/accounts/AccountForm';

// Redux
import {
  createAccountAsync,
  updateAccountAsync,
  selectAccountsLoading,
  selectAccountsError,
  clearError,
} from 'store/slices/accountsSlice';

// ===================================================================
// ANIMATIONS
// ===================================================================

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(26, 115, 232, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(26, 115, 232, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(26, 115, 232, 0);
  }
`;

// ===================================================================
// ACCOUNT MODAL COMPONENT
// ===================================================================

function AccountModal({ open, onClose, account = null }) {
  const dispatch = useDispatch();
  const isEditMode = !!account;

  // Redux state
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);

  // Local state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Nettoyer erreur au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Nettoyer erreur quand le modal s'ouvre/ferme
  useEffect(() => {
    if (open) {
      dispatch(clearError());
      setSuccessMessage('');
      setIsClosing(false);
    }
  }, [open, dispatch]);

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Handle form submit
   */
  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        // Mode édition
        await dispatch(
          updateAccountAsync({
            accountId: account._id,
            updateData: formData,
          })
        ).unwrap();

        setSuccessMessage('✅ Compte modifié avec succès !');
        setShowSuccessSnackbar(true);
        
        // Fermer le modal après un court délai
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        // Mode création
        await dispatch(createAccountAsync(formData)).unwrap();

        setSuccessMessage('🎉 Compte créé avec succès !');
        setShowSuccessSnackbar(true);
        
        // Fermer le modal après un court délai
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur dans AccountModal:', error);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    handleClose();
  };

  /**
   * Handle close avec animation
   */
  const handleClose = () => {
    if (!loading) {
      setIsClosing(true);
      setTimeout(() => {
        dispatch(clearError());
        setSuccessMessage('');
        setShowSuccessSnackbar(false);
        onClose();
        setIsClosing(false);
      }, 300);
    }
  };

  /**
   * Close success snackbar
   */
  const handleCloseSuccessSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  // ================================================================
  // COMPOSANTS DE DESIGN MODERNE
  // ================================================================

  /**
   * Header moderne avec gradient
   */
  const ModernHeader = () => (
    <DialogTitle sx={{ p: 0 }}>
      <MDBox
        sx={{
          background: isEditMode 
            ? 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)'
            : 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
          position: 'relative',
          overflow: 'hidden',
          p: 4,
          color: 'white',
        }}
      >
        {/* Background pattern */}
        <MDBox
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          sx={{
            opacity: 0.1,
            background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <MDBox position="relative" zIndex={1}>
          <MDBox display="flex" alignItems="center" gap={2} mb={1}>
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={60}
              height={60}
              borderRadius="50%"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                animation: `${pulse} 2s infinite`,
              }}
            >
              <Icon fontSize="large" sx={{ color: 'white' }}>
                {isEditMode ? 'edit' : 'add_circle'}
              </Icon>
            </MDBox>
            <MDBox>
              <MDTypography 
                variant="h3" 
                fontWeight="bold" 
                color="white"
                sx={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: '1.75rem'
                }}
              >
                {isEditMode ? 'Modifier le compte' : 'Nouveau compte'}
              </MDTypography>
              <MDTypography 
                variant="body2" 
                color="white" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: '0.9rem'
                }}
              >
                {isEditMode 
                  ? 'Mettez à jour les informations de votre compte' 
                  : 'Créez un nouveau compte bancaire ou espèces'
                }
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Bouton fermer */}
        <MDBox
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
              transform: 'rotate(90deg)',
            },
          }}
        >
          <Icon sx={{ color: 'white', fontSize: '1.5rem' }}>close</Icon>
        </MDBox>
      </MDBox>
    </DialogTitle>
  );

  /**
   * Alert d'erreur moderne
   */
  const ModernErrorAlert = () => (
    <MDBox
      sx={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        borderRadius: 3,
        p: 2.5,
        mb: 3,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        animation: `${slideInUp} 0.4s ease-out`,
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Icon sx={{ fontSize: '1.5rem' }}>error_outline</Icon>
      <MDBox flex={1}>
        <MDTypography variant="h6" fontWeight="bold" color="white" mb={0.5}>
          Erreur
        </MDTypography>
        <MDTypography variant="body2" color="white" sx={{ opacity: 0.9 }}>
          {error}
        </MDTypography>
      </MDBox>
      <Icon 
        onClick={() => dispatch(clearError())}
        sx={{ 
          cursor: 'pointer',
          opacity: 0.8,
          transition: 'opacity 0.3s ease',
          '&:hover': { opacity: 1 }
        }}
      >
        close
      </Icon>
    </MDBox>
  );

  /**
   * Snackbar de succès moderne
   */
  const ModernSuccessSnackbar = () => (
    <MDSnackbar
      color="success"
      icon="check_circle"
      title="Succès"
      content={successMessage}
      open={showSuccessSnackbar}
      onClose={handleCloseSuccessSnackbar}
      close={handleCloseSuccessSnackbar}
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        border: 'none',
        '& .MuiSnackbarContent-message': {
          color: 'white',
        }
      }}
    />
  );

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            animation: isClosing 
              ? 'none' 
              : `${slideInUp} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            opacity: isClosing ? 0 : 1,
            transform: isClosing ? 'translateY(50px) scale(0.95)' : 'translateY(0) scale(1)',
            transition: 'all 0.3s ease',
          },
        }}
        BackdropProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
          },
        }}
      >
        {/* Header moderne */}
        <ModernHeader />

        {/* Content */}
        <DialogContent sx={{ p: 0 }}>
          <MDBox 
            sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              minHeight: 400,
            }}
          >
            {/* Error Alert */}
            {error && <ModernErrorAlert />}

            {/* Account Form */}
            <MDBox
              sx={{
                animation: error 
                  ? 'none'
                  : `${slideInUp} 0.6s ease-out 0.2s both`,
              }}
            >
              <AccountForm
                account={account}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
              />
            </MDBox>

            {/* Indicateur de chargement overlay */}
            {loading && (
              <MDBox
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  zIndex: 10,
                }}
              >
                <MDBox textAlign="center">
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width={80}
                    height={80}
                    borderRadius="50%"
                    sx={{
                      background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
                      animation: `${pulse} 1.5s infinite`,
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 40, color: 'white' }}>
                      {isEditMode ? 'edit' : 'add_circle'}
                    </Icon>
                  </MDBox>
                  <MDTypography variant="h6" fontWeight="bold" color="dark">
                    {isEditMode ? 'Modification en cours...' : 'Création en cours...'}
                  </MDTypography>
                  <MDTypography variant="body2" color="text" sx={{ opacity: 0.8 }}>
                        Veuillez patienter
                  </MDTypography>
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar moderne */}
      <ModernSuccessSnackbar />

      {/* Styles globaux pour les animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ===================================================================
// PROP TYPES
// ===================================================================

AccountModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.object,
};

export default AccountModal;