/**
 * =========================================================
 * FinApp Haiti - Account Modal (UTILISANT AccountForm)
 * Modal élégant qui intègre AccountForm
 * =========================================================
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// @mui material components
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

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
// ACCOUNT MODAL COMPONENT
// ===================================================================

function AccountModal({ open, onClose, account = null }) {
  const dispatch = useDispatch();
  const isEditMode = !!account;

  // Redux state
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);

  // UI state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // ================================================================
  // EFFECTS
  // ================================================================

  // Nettoyer erreur quand le modal s'ouvre/ferme
  useEffect(() => {
    if (open) {
      dispatch(clearError());
      setSuccessMessage('');
    }
  }, [open, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

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
      } else {
        // Mode création
        await dispatch(createAccountAsync(formData)).unwrap();
        setSuccessMessage('🎉 Compte créé avec succès !');
      }

      setShowSuccessSnackbar(true);
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Erreur dans AccountModal:', error);
      // L'erreur est déjà dans le Redux state, elle s'affichera automatiquement
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    handleClose();
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    if (!loading) {
      dispatch(clearError());
      setSuccessMessage('');
      setShowSuccessSnackbar(false);
      onClose();
    }
  };

  // ================================================================
  // RENDER HELPERS
  // ================================================================

  /**
   * Header moderne avec gradient
   */
  const renderHeader = () => (
    <MDBox
      sx={{
        background: isEditMode
          ? 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)'
          : 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 3,
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
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" alignItems="center" gap={2}>
            {/* Icon */}
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={56}
              height={56}
              borderRadius="50%"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Icon fontSize="large" sx={{ color: 'white' }}>
                {isEditMode ? 'edit' : 'add_circle'}
              </Icon>
            </MDBox>

            {/* Titre */}
            <MDBox>
              <MDTypography
                variant="h4"
                fontWeight="bold"
                color="white"
                sx={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {isEditMode ? 'Modifier le compte' : 'Nouveau compte'}
              </MDTypography>
              <MDTypography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                {isEditMode
                  ? 'Mettez à jour les informations du compte'
                  : 'Remplissez les informations du nouveau compte'}
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Bouton fermer */}
          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: 'white',
              background: 'rgba(255, 255, 255, 0.15)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
              },
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );

  /**
   * Alert d'erreur
   */
  const renderErrorAlert = () => {
    if (!error) return null;

    return (
      <MDBox
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
          borderRadius: 2,
          p: 2.5,
          mb: 3,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
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
        <IconButton
          size="small"
          onClick={() => dispatch(clearError())}
          sx={{
            color: 'white',
            opacity: 0.8,
            '&:hover': { opacity: 1 },
          }}
        >
          <Icon fontSize="small">close</Icon>
        </IconButton>
      </MDBox>
    );
  };

  /**
   * Overlay de chargement
   */
  const renderLoadingOverlay = () => {
    if (!loading) return null;

    return (
      <MDBox
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
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
              background: isEditMode
                ? 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)'
                : 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
              mb: 2,
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(26, 115, 232, 0.4)',
                },
                '70%': {
                  boxShadow: '0 0 0 20px rgba(26, 115, 232, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(26, 115, 232, 0)',
                },
              },
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
    );
  };

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
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          },
        }}
        BackdropProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        {/* Header */}
        {renderHeader()}

        {/* Content */}
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <MDBox
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              minHeight: 400,
            }}
          >
            {/* Error Alert */}
            {renderErrorAlert()}

            {/* Account Form */}
            <AccountForm
              account={account}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />

            {/* Loading Overlay */}
            {renderLoadingOverlay()}
          </MDBox>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <MDSnackbar
        color="success"
        icon="check_circle"
        title="Succès"
        content={successMessage}
        open={showSuccessSnackbar}
        onClose={() => setShowSuccessSnackbar(false)}
        close={() => setShowSuccessSnackbar(false)}
        bgWhite
      />
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