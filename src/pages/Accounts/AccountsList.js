/**
 * =========================================================
 * FinApp Haiti - Accounts List Page
 * Page de liste des comptes financiers
 * =========================================================
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Redux
import {
  fetchAccountsAsync,
  selectAllAccounts,
  selectTotalBalance,
  selectAccountsLoading,
  selectAccountsError,
} from "store/slices/accountsSlice";

/**
 * Account Card Component
 */
function AccountCard({ account, onEdit, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(account);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(account);
  };

  // Couleur selon le type de compte
  const getTypeColor = (type) => {
    switch (type) {
      case "cash":
        return "success";
      case "bank":
        return "info";
      case "mobile_money":
        return "warning";
      case "savings":
        return "primary";
      default:
        return "secondary";
    }
  };

  // Icône selon le type
  const getTypeIcon = (type) => {
    switch (type) {
      case "cash":
        return "payments";
      case "bank":
        return "account_balance";
      case "mobile_money":
        return "phone_android";
      case "savings":
        return "savings";
      default:
        return "account_balance_wallet";
    }
  };

  // Nom du type en français
  const getTypeName = (type) => {
    switch (type) {
      case "cash":
        return "Espèces";
      case "bank":
        return "Banque";
      case "mobile_money":
        return "Mobile Money";
      case "savings":
        return "Épargne";
      default:
        return "Autre";
    }
  };

  return (
    <Card>
      <MDBox p={3}>
        {/* Header avec menu actions */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox display="flex" alignItems="center">
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="3rem"
              height="3rem"
              borderRadius="lg"
              variant="gradient"
              bgColor={getTypeColor(account.type)}
              color="white"
              mr={2}
            >
              <Icon fontSize="medium">{getTypeIcon(account.type)}</Icon>
            </MDBox>
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                {account.name}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {getTypeName(account.type)}
              </MDTypography>
            </MDBox>
          </MDBox>

          <IconButton onClick={handleMenuOpen} size="small">
            <Icon>more_vert</Icon>
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <Icon fontSize="small" sx={{ mr: 1 }}>edit</Icon>
              Modifier
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <Icon fontSize="small" sx={{ mr: 1 }}>delete</Icon>
              Supprimer
            </MenuItem>
          </Menu>
        </MDBox>

        <Divider />

        {/* Balance */}
        <MDBox mt={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold">
            SOLDE
          </MDTypography>
          <MDTypography variant="h4" fontWeight="bold" color={account.balance >= 0 ? "success" : "error"}>
            {account.balance?.toLocaleString("fr-HT")} {account.currency}
          </MDTypography>
        </MDBox>

        {/* Description si existe */}
        {account.description && (
          <MDBox mt={2}>
            <MDTypography variant="caption" color="text">
              {account.description}
            </MDTypography>
          </MDBox>
        )}

        {/* Status */}
        <MDBox mt={2} display="flex" alignItems="center">
          <MDBox
            width="8px"
            height="8px"
            borderRadius="50%"
            bgcolor={account.isActive ? "success.main" : "error.main"}
            mr={1}
          />
          <MDTypography variant="caption" color="text">
            {account.isActive ? "Actif" : "Inactif"}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

/**
 * Accounts List Page
 */
function AccountsList() {
  const dispatch = useDispatch();

  // Redux state
  const accounts = useSelector(selectAllAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);

  // Charger les comptes au montage
  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  // Handlers
  const handleCreateAccount = () => {
    console.log("Créer un compte");
    // TODO: Ouvrir modal création
  };

  const handleEditAccount = (account) => {
    console.log("Modifier compte:", account);
    // TODO: Ouvrir modal édition
  };

  const handleDeleteAccount = (account) => {
    console.log("Supprimer compte:", account);
    // TODO: Confirmer et supprimer
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
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
                <Grid item xs={12} md={4}>
                  <MDBox>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      COMPTES ACTIFS
                    </MDTypography>
                    <MDTypography variant="h3" fontWeight="bold">
                      {accounts.filter(acc => acc.isActive).length}
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
            <MDTypography variant="h6" color="text">
              Chargement des comptes...
            </MDTypography>
          </MDBox>
        )}

        {/* Empty State */}
        {!loading && accounts.length === 0 && (
          <MDBox textAlign="center" py={6}>
            <Icon fontSize="large" color="disabled" sx={{ fontSize: 64 }}>
              account_balance_wallet
            </Icon>
            <MDTypography variant="h6" color="text" mt={2}>
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
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AccountsList;