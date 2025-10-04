/**
 * Account Delete Dialog Component
 * 
 * Dialogue de confirmation pour la suppression d'un compte
 * Affiche un avertissement et demande confirmation avant suppression
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';

// Material-UI components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

// Icons
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Redux
import { deleteAccountAsync } from 'store/slices/accountsSlice';

// Utils
import { formatCurrency } from 'utils/formatters/currency';
import { getAccountTypeLabel } from 'types/account.types';

function AccountDeleteDialog({ open, onClose, account }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle delete confirmation
   */
  const handleDelete = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch(deleteAccountAsync(account._id)).unwrap();
      onClose(true); // true = compte supprimé avec succès
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression du compte');
      setLoading(false);
    }
  };

  /**
   * Handle dialog close
   */
  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose(false);
    }
  };

  if (!account) return null;

  const hasBalance = account.currentBalance !== 0;
  const isDefault = account.isDefault;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24
        }
      }}
    >
      {/* Header */}
      <DialogTitle>
        <MDBox display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" fontSize="large" />
          <MDTypography variant="h5" fontWeight="medium">
            Supprimer le compte
          </MDTypography>
        </MDBox>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <MDBox py={1}>
          {/* Account Info */}
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Attention</AlertTitle>
            Vous êtes sur le point de supprimer le compte suivant :
          </Alert>

          <MDBox 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 2,
              mb: 3 
            }}
          >
            <MDTypography variant="h6" fontWeight="medium" mb={1}>
              {account.name}
            </MDTypography>
            <MDTypography variant="body2" color="text.secondary" mb={0.5}>
              Type : {getAccountTypeLabel(account.type)}
            </MDTypography>
            {account.bankName && (
              <MDTypography variant="body2" color="text.secondary" mb={0.5}>
                Banque : {account.bankName}
              </MDTypography>
            )}
            <MDTypography variant="body2" color="text.secondary">
              Solde actuel : {formatCurrency(account.currentBalance, account.currency)}
            </MDTypography>
          </MDBox>

          {/* Warnings */}
          {(hasBalance || isDefault) && (
            <MDBox mb={3}>
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Avertissements</AlertTitle>
                <List dense disablePadding>
                  {hasBalance && (
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ErrorOutlineIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ce compte a un solde non nul"
                        secondary={`Solde : ${formatCurrency(account.currentBalance, account.currency)}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  )}
                  {isDefault && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ErrorOutlineIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ce compte est défini comme compte par défaut"
                        secondary="Vous devrez choisir un autre compte par défaut"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  )}
                </List>
              </Alert>
            </MDBox>
          )}

          {/* Consequences */}
          <Alert severity="info" icon={<InfoOutlinedIcon />}>
            <AlertTitle>Conséquences de la suppression</AlertTitle>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemText
                  primary="• Toutes les transactions associées seront supprimées"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemText
                  primary="• Les budgets liés seront affectés"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText
                  primary="• Cette action est irréversible"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Alert>

          {/* Error Display */}
          {error && (
            <MDBox mt={3}>
              <MDAlert color="error" dismissible onClose={() => setError(null)}>
                <MDTypography variant="body2" color="white">
                  {error}
                </MDTypography>
              </MDAlert>
            </MDBox>
          )}
        </MDBox>
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ p: 2.5 }}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Annuler
        </MDButton>
        <MDButton
          variant="gradient"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Supprimer'
          )}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

AccountDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    bankName: PropTypes.string,
    currency: PropTypes.string.isRequired,
    currentBalance: PropTypes.number.isRequired,
    isDefault: PropTypes.bool
  })
};

AccountDeleteDialog.defaultProps = {
  account: null
};

export default AccountDeleteDialog;