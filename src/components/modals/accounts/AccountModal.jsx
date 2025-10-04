/**
 * =========================================================
 * FinApp Haiti - Account Modal
 * Modal pour création/modification de compte
 * ✅ REFACTORÉ - Utilise AccountForm.jsx + accountsSlice
 * =========================================================
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// @mui material components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Alert from '@mui/material/Alert';

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

  // Local state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

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

        setSuccessMessage('Compte modifié avec succès !');
        setShowSuccessSnackbar(true);
        
        // Fermer le modal après un court délai
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        // Mode création
        await dispatch(createAccountAsync(formData)).unwrap();

        setSuccessMessage('Compte créé avec succès !');
        setShowSuccessSnackbar(true);
        
        // Fermer le modal après un court délai
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      // L'erreur est déjà dans le state Redux (selectAccountsError)
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

  /**
   * Close success snackbar
   */
  const handleCloseSuccessSnackbar = () => {
    setShowSuccessSnackbar(false);
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
          sx: { borderRadius: 2 },
        }}
      >
        {/* Header */}
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={2}>
            <Icon fontSize="large" color="info">
              {isEditMode ? 'edit' : 'add_circle'}
            </Icon>
            <MDTypography variant="h4" fontWeight="medium">
              {isEditMode ? 'Modifier le compte' : 'Créer un nouveau compte'}
            </MDTypography>
          </MDBox>
        </DialogTitle>

        <Divider />

        {/* Content */}
        <DialogContent>
          <MDBox pt={2} pb={3}>
            {/* Error Alert */}
            {error && (
              <MDBox mb={3}>
                <Alert severity="error" onClose={() => dispatch(clearError())}>
                  <strong>Erreur :</strong> {error}
                </Alert>
              </MDBox>
            )}

            {/* Account Form */}
            <AccountForm
              account={account}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </MDBox>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <MDSnackbar
        color="success"
        icon="check"
        title="Succès"
        content={successMessage}
        open={showSuccessSnackbar}
        onClose={handleCloseSuccessSnackbar}
        close={handleCloseSuccessSnackbar}
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