/**
 * =========================================================
 * FinApp Haiti - Accounts Page
 * Page principale de gestion des comptes financiers
 * =========================================================
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Redux
import {
  fetchAccountsAsync,
  selectAllAccounts,
  selectTotalBalance,
  selectAccountsLoading,
  selectAccountsError,
} from "store/slices/accountsSlice";

// Components
import AccountCard from "components/cards/accounts/AccountCard";
import AccountModal from "components/modals/accounts/AccountModal";
import AccountDeleteDialog from "components/modals/accounts/AccountDeleteDialog";

/**
 * Accounts Page Component
 * Page de liste et gestion des comptes
 */
function AccountsPage() {
  const dispatch = useDispatch();

  // Redux state
  const accounts = useSelector(selectAllAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);

  // Local state - Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  // Charger les comptes au montage
  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  // Handlers
  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteAccount = (account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccount(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAccount(null);
  };

  return (
    <MDBox py={3}>
      {/* Header Section */}
      <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox>
          <MDTypography variant="h4" fontWeight="medium">
            Mes Comptes
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Gérez tous vos comptes financiers
          </MDTypography>
        </MDBox>
        <MDButton
          variant="gradient"
          color="info"
          startIcon={<Icon>add</Icon>}
          onClick={handleCreateAccount}
        >
          Nouveau Compte
        </MDButton>
      </MDBox>

      {/* Summary Card */}
      <MDBox mb={3}>
        <Card>
          <MDBox p={3}>
            <Grid container spacing={3}>
              {/* Nombre de comptes */}
              <Grid item xs={12} md={4}>
                <MDBox>
                  <MDTypography variant="caption" color="text" fontWeight="bold">
                    NOMBRE DE COMPTES
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold">
                    {accounts.length}
                  </MDTypography>
                </MDBox>
              </Grid>

              {/* Solde total */}
              <Grid item xs={12} md={4}>
                <MDBox>
                  <MDTypography variant="caption" color="text" fontWeight="bold">
                    SOLDE TOTAL
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold" color="success">
                    {totalBalance.toLocaleString("fr-HT")} HTG
                  </MDTypography>
                </MDBox>
              </Grid>

              {/* Comptes actifs */}
              <Grid item xs={12} md={4}>
                <MDBox>
                  <MDTypography variant="caption" color="text" fontWeight="bold">
                    COMPTES ACTIFS
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold">
                    {accounts.filter((acc) => acc.isActive).length}
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>

      {/* Error Message */}
      {error && (
        <MDBox mb={3}>
          <Card>
            <MDBox p={2} bgcolor="error.main">
              <MDTypography variant="body2" color="white">
                ❌ {error}
              </MDTypography>
            </MDBox>
          </Card>
        </MDBox>
      )}

      {/* Loading State */}
      {loading && accounts.length === 0 && (
        <MDBox textAlign="center" py={6}>
          <Icon fontSize="large" sx={{ fontSize: 64, mb: 2 }}>
            hourglass_empty
          </Icon>
          <MDTypography variant="h6" color="text">
            Chargement des comptes...
          </MDTypography>
        </MDBox>
      )}

      {/* Empty State */}
      {!loading && accounts.length === 0 && (
        <MDBox textAlign="center" py={6}>
          <Icon fontSize="large" color="disabled" sx={{ fontSize: 64, mb: 2 }}>
            account_balance_wallet
          </Icon>
          <MDTypography variant="h6" color="text" mb={1}>
            Aucun compte trouvé
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={3}>
            Créez votre premier compte pour commencer
          </MDTypography>
          <MDButton
            variant="gradient"
            color="info"
            startIcon={<Icon>add</Icon>}
            onClick={handleCreateAccount}
          >
            Créer un Compte
          </MDButton>
        </MDBox>
      )}

      {/* Accounts Grid */}
      {!loading && accounts.length > 0 && (
        <Grid container spacing={3}>
          {accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account._id}>
              <AccountCard
                account={account}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modals */}
      <AccountModal
        open={modalOpen}
        onClose={handleCloseModal}
        account={selectedAccount}
        mode={modalMode}
      />

      <AccountDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        account={selectedAccount}
      />
    </MDBox>
  );
}

export default AccountsPage;