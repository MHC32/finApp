/**
 * =========================================================
 * FinApp Haiti - Account Delete Dialog
 * Dialog de confirmation pour suppression de compte
 * =========================================================
 */

import { useState } from "react";
import { useDispatch } from "react-redux";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Redux
import { deleteAccountAsync } from "store/slices/accountsSlice";

/**
 * Account Delete Dialog Component
 */
function AccountDeleteDialog({ open, onClose, account }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle delete
   */
  const handleDelete = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch(deleteAccountAsync(account._id)).unwrap();
      
      console.log("✅ Compte supprimé avec succès");
      onClose();
    } catch (err) {
      console.error("❌ Erreur suppression:", err);
      setError(err.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!account) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* Header */}
      <DialogTitle>
        <MDBox display="flex" alignItems="center">
          <Icon fontSize="large" color="error" mr={2}>
            warning
          </Icon>
          <MDTypography variant="h4" fontWeight="medium">
            Supprimer le compte
          </MDTypography>
        </MDBox>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <MDBox pt={2}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <MDTypography variant="body2" fontWeight="medium">
              Cette action est irréversible !
            </MDTypography>
          </Alert>

          <MDTypography variant="body2" color="text" mb={2}>
            Êtes-vous sûr de vouloir supprimer le compte suivant ?
          </MDTypography>

          <MDBox bgcolor="grey.100" borderRadius="md" p={2} mb={2}>
            <MDTypography variant="h6" fontWeight="bold" mb={1}>
              {account.name}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Type: {account.type === "checking" ? "Compte Courant" : "Épargne"}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Banque: {account.bankName || "N/A"}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Solde: {account.currentBalance?.toLocaleString("fr-HT") || 0} {account.currency}
            </MDTypography>
          </MDBox>

          <MDTypography variant="caption" color="text" fontStyle="italic">
            💡 Conseil: Désactivez le compte au lieu de le supprimer si vous souhaitez le conserver dans l'historique.
          </MDTypography>

          {/* Error Message */}
          {error && (
            <MDBox bgcolor="error.main" borderRadius="md" p={2} mt={2}>
              <MDTypography variant="body2" color="white">
                ❌ {error}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ p: 3 }}>
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
          startIcon={<Icon>delete_forever</Icon>}
        >
          {loading ? "Suppression..." : "Supprimer définitivement"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default AccountDeleteDialog;