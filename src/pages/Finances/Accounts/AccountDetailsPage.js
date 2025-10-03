/**
 * =========================================================
 * FinApp Haiti - Account Details Page
 * Page détaillée d'un compte avec historique et statistiques
 * =========================================================
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Redux
import {
  selectAccountById,
  selectAccountsLoading,
  fetchAccountsAsync,
} from "store/slices/accountsSlice";

// Components
import AccountModal from "components/modals/accounts/AccountModal";
import AccountDeleteDialog from "components/modals/accounts/AccountDeleteDialog";

/**
 * Account Details Page Component
 * Affiche les détails complets d'un compte
 */
function AccountDetailsPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const account = useSelector((state) => selectAccountById(state, accountId));
  const loading = useSelector(selectAccountsLoading);

  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Charger le compte si pas en store
  useEffect(() => {
    if (!account && !loading) {
      dispatch(fetchAccountsAsync());
    }
  }, [account, loading, dispatch]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    // Après suppression, retour à la liste
    navigate("/accounts");
  };

  const handleBack = () => {
    navigate("/accounts");
  };

  // Loading state
  if (loading && !account) {
    return (
      <MDBox py={3}>
        <MDBox textAlign="center" py={6}>
          <Icon fontSize="large" sx={{ fontSize: 64, mb: 2 }}>
            hourglass_empty
          </Icon>
          <MDTypography variant="h6" color="text">
            Chargement du compte...
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  // Account not found
  if (!account) {
    return (
      <MDBox py={3}>
        <MDBox textAlign="center" py={6}>
          <Icon fontSize="large" color="error" sx={{ fontSize: 64, mb: 2 }}>
            error_outline
          </Icon>
          <MDTypography variant="h6" color="text" mb={3}>
            Compte introuvable
          </MDTypography>
          <MDButton variant="gradient" color="info" onClick={handleBack}>
            Retour aux comptes
          </MDButton>
        </MDBox>
      </MDBox>
    );
  }

  return (
    <MDBox py={3}>
      {/* Back Button */}
      <MDBox mb={3}>
        <MDButton
          variant="outlined"
          color="secondary"
          startIcon={<Icon>arrow_back</Icon>}
          onClick={handleBack}
        >
          Retour
        </MDButton>
      </MDBox>

      {/* Account Header Card */}
      <Card sx={{ mb: 3 }}>
        <MDBox p={3}>
          <Grid container spacing={3} alignItems="center">
            {/* Icon & Name */}
            <Grid item xs={12} md={6}>
              <MDBox display="flex" alignItems="center">
                <MDAvatar
                  sx={{
                    bgcolor: account.type === "checking" ? "info.main" : "success.main",
                    width: 64,
                    height: 64,
                    mr: 2,
                  }}
                >
                  <Icon fontSize="large">
                    {account.type === "checking" ? "account_balance" : "savings"}
                  </Icon>
                </MDAvatar>
                <MDBox>
                  <MDTypography variant="h4" fontWeight="medium">
                    {account.name}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {account.bankName || "N/A"} • {account.currency}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={6}>
              <MDBox display="flex" justifyContent="flex-end" gap={1}>
                <MDButton
                  variant="outlined"
                  color="info"
                  startIcon={<Icon>edit</Icon>}
                  onClick={handleEdit}
                >
                  Modifier
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="error"
                  startIcon={<Icon>delete</Icon>}
                  onClick={handleDelete}
                >
                  Supprimer
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Quick Stats */}
          <Grid container spacing={3}>
            {/* Solde actuel */}
            <Grid item xs={12} md={4}>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="bold">
                  SOLDE ACTUEL
                </MDTypography>
                <MDTypography variant="h3" fontWeight="bold" color="success">
                  {account.currentBalance?.toLocaleString("fr-HT") || 0} {account.currency}
                </MDTypography>
              </MDBox>
            </Grid>

            {/* Type de compte */}
            <Grid item xs={12} md={4}>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="bold">
                  TYPE DE COMPTE
                </MDTypography>
                <MDTypography variant="h6" fontWeight="medium">
                  {account.type === "checking" ? "Compte Courant" : "Compte Épargne"}
                </MDTypography>
              </MDBox>
            </Grid>

            {/* Statut */}
            <Grid item xs={12} md={4}>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="bold">
                  STATUT
                </MDTypography>
                <MDBox display="flex" alignItems="center" mt={1}>
                  <Icon
                    fontSize="medium"
                    sx={{
                      color: account.isActive ? "success.main" : "error.main",
                      mr: 1,
                    }}
                  >
                    {account.isActive ? "check_circle" : "cancel"}
                  </Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {account.isActive ? "Actif" : "Inactif"}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>

      {/* Tabs */}
      <Card>
        <MDBox pt={2} px={2}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Informations" icon={<Icon>info</Icon>} />
            <Tab label="Historique" icon={<Icon>history</Icon>} />
            <Tab label="Statistiques" icon={<Icon>bar_chart</Icon>} />
          </Tabs>
        </MDBox>

        <Divider />

        <MDBox p={3}>
          {/* Tab 0: Informations */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Informations générales */}
              <Grid item xs={12} md={6}>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Informations Générales
                  </MDTypography>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Nom du compte
                    </MDTypography>
                    <MDTypography variant="body2">{account.name}</MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Banque
                    </MDTypography>
                    <MDTypography variant="body2">
                      {account.bankName || "N/A"}
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Numéro de compte
                    </MDTypography>
                    <MDTypography variant="body2">
                      {account.accountNumber || "N/A"}
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Type de compte
                    </MDTypography>
                    <MDTypography variant="body2">
                      {account.type === "checking" ? "Compte Courant" : "Compte Épargne"}
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Devise
                    </MDTypography>
                    <MDTypography variant="body2">{account.currency}</MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>

              {/* Détails financiers */}
              <Grid item xs={12} md={6}>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Détails Financiers
                  </MDTypography>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Solde actuel
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="bold" color="success">
                      {account.currentBalance?.toLocaleString("fr-HT") || 0}{" "}
                      {account.currency}
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Solde minimum
                    </MDTypography>
                    <MDTypography variant="body2">
                      {account.minimumBalance?.toLocaleString("fr-HT") || 0}{" "}
                      {account.currency}
                    </MDTypography>
                  </MDBox>

                  {account.type === "credit" && (
                    <MDBox mb={2}>
                      <MDTypography variant="caption" color="text" fontWeight="bold">
                        Limite de crédit
                      </MDTypography>
                      <MDTypography variant="body2">
                        {account.creditLimit?.toLocaleString("fr-HT") || 0}{" "}
                        {account.currency}
                      </MDTypography>
                    </MDBox>
                  )}

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Inclus dans total général
                    </MDTypography>
                    <MDTypography variant="body2">
                      {account.includeInTotal ? "Oui" : "Non"}
                    </MDTypography>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      Solde négatif autorisé
                    </MDTypography>
                    <MDTypography variant="body2">
                      {account.allowNegativeBalance ? "Oui" : "Non"}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>

              {/* Description */}
              {account.description && (
                <Grid item xs={12}>
                  <MDBox>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Description
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      {account.description}
                    </MDTypography>
                  </MDBox>
                </Grid>
              )}
            </Grid>
          )}

          {/* Tab 1: Historique */}
          {activeTab === 1 && (
            <MDBox textAlign="center" py={6}>
              <Icon fontSize="large" color="disabled" sx={{ fontSize: 64, mb: 2 }}>
                history
              </Icon>
              <MDTypography variant="h6" color="text">
                Historique des transactions
              </MDTypography>
              <MDTypography variant="body2" color="text" mt={1}>
                Cette fonctionnalité sera disponible prochainement
              </MDTypography>
            </MDBox>
          )}

          {/* Tab 2: Statistiques */}
          {activeTab === 2 && (
            <MDBox textAlign="center" py={6}>
              <Icon fontSize="large" color="disabled" sx={{ fontSize: 64, mb: 2 }}>
                bar_chart
              </Icon>
              <MDTypography variant="h6" color="text">
                Statistiques du compte
              </MDTypography>
              <MDTypography variant="body2" color="text" mt={1}>
                Graphiques et analyses seront disponibles prochainement
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </Card>

      {/* Modals */}
      <AccountModal
        open={modalOpen}
        onClose={handleCloseModal}
        account={account}
        mode="edit"
      />

      <AccountDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        account={account}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </MDBox>
  );
}

export default AccountDetailsPage;