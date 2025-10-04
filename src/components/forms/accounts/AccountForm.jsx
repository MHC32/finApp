/**
 * =========================================================
 * FinApp Haiti - Accounts Page (CORRIGÉ)
 * Page principale de gestion des comptes financiers
 * ✅ Import getCurrencySymbol corrigé
 * =========================================================
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Redux
import {
  fetchAccountsAsync,
  deleteAccountAsync,
  selectAllAccounts,
  selectTotalBalance,
  selectAccountsLoading,
  selectAccountsError,
  selectActiveAccounts,
  clearError,
} from 'store/slices/accountsSlice';

// Components
import AccountModal from 'components/modals/accounts/AccountModal';
import AccountCard from 'components/cards/accounts/AccountCard';
import AccountDeleteDialog from 'components/modals/accounts/AccountDeleteDialog';

// Types
import { getCurrencySymbol } from 'types/account.types';

// ===================================================================
// ACCOUNTS PAGE COMPONENT
// ===================================================================

function AccountsPage() {
  const dispatch = useDispatch();

  // Redux state
  const accounts = useSelector(selectAllAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);
  const activeAccounts = useSelector(selectActiveAccounts);

  // Local state - Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // ================================================================
  // EFFECTS
  // ================================================================

  // Charger les comptes au montage
  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  // Nettoyer erreur au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Ouvrir modal création
   */
  const handleOpenCreateModal = () => {
    setSelectedAccount(null);
    setModalOpen(true);
  };

  /**
   * Ouvrir modal édition
   */
  const handleOpenEditModal = (account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  /**
   * Fermer modal
   */
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccount(null);
  };

  /**
   * Ouvrir dialogue de suppression
   */
  const handleOpenDeleteDialog = (account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  /**
   * Fermer dialogue de suppression
   */
  const handleCloseDeleteDialog = (deleted = false) => {
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
    
    // Si suppression réussie, rafraîchir la liste
    if (deleted) {
      dispatch(fetchAccountsAsync());
    }
  };

  /**
   * Rafraîchir la liste
   */
  const handleRefresh = () => {
    dispatch(fetchAccountsAsync());
  };

  // ================================================================
  // RENDER HELPERS
  // ================================================================

  /**
   * Rendu card statistiques
   */
  const renderStatsCard = () => (
    <Card>
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            Résumé des comptes
          </MDTypography>
          <MDButton
            variant="outlined"
            color="info"
            size="small"
            iconOnly
            circular
            onClick={handleRefresh}
          >
            <Icon>refresh</Icon>
          </MDButton>
        </MDBox>

        <Divider />

        <MDBox mt={2}>
          {/* Total par devise */}
          {Object.keys(totalBalance).map((currency) => {
            const amount = totalBalance[currency];
            if (amount === 0) return null;

            return (
              <MDBox
                key={currency}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <MDTypography variant="button" color="text">
                  Total {currency}
                </MDTypography>
                <MDTypography variant="h5" fontWeight="medium" color="dark">
                  {amount.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {getCurrencySymbol(currency)}
                </MDTypography>
              </MDBox>
            );
          })}

          <Divider sx={{ my: 2 }} />

          {/* Statistiques */}
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDTypography variant="button" color="text">
              Comptes actifs
            </MDTypography>
            <MDTypography variant="button" fontWeight="medium" color="dark">
              {activeAccounts.length} / {accounts.length}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );

  /**
   * Rendu grille comptes
   */
  const renderAccountsGrid = () => {
    if (loading && accounts.length === 0) {
      return (
        <MDBox textAlign="center" py={6}>
          <Icon fontSize="large" sx={{ fontSize: 64, mb: 2 }}>
            hourglass_empty
          </Icon>
          <MDTypography variant="h6" color="text">
            Chargement des comptes...
          </MDTypography>
        </MDBox>
      );
    }

    if (accounts.length === 0) {
      return (
        <MDBox textAlign="center" py={6}>
          <Icon fontSize="large" sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }}>
            account_balance_wallet
          </Icon>
          <MDTypography variant="h6" color="text" mb={1}>
            Aucun compte
          </MDTypography>
          <MDTypography variant="button" color="text" mb={3}>
            Créez votre premier compte pour commencer
          </MDTypography>
          <MDButton variant="gradient" color="info" onClick={handleOpenCreateModal}>
            <Icon sx={{ mr: 1 }}>add</Icon>
            Créer mon premier compte
          </MDButton>
        </MDBox>
      );
    }

    return (
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} md={6} lg={4} key={account._id}>
            <AccountCard
              account={account}
              onEdit={() => handleOpenEditModal(account)}
              onDelete={() => handleOpenDeleteDialog(account)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* Header */}
        <MDBox mb={3}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Mes Comptes
              </MDTypography>
              <MDTypography variant="button" color="text">
                Gérez vos comptes bancaires et espèces
              </MDTypography>
            </MDBox>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleOpenCreateModal}
              disabled={loading}
            >
              <Icon sx={{ mr: 1 }}>add</Icon>
              Nouveau compte
            </MDButton>
          </MDBox>

          {/* Error Alert */}
          {error && (
            <MDAlert color="error" dismissible onClose={() => dispatch(clearError())}>
              <MDTypography variant="body2" color="white">
                <strong>Erreur :</strong> {error}
              </MDTypography>
            </MDAlert>
          )}
        </MDBox>

        {/* Stats Card */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              {renderStatsCard()}
            </Grid>
          </Grid>
        </MDBox>

        {/* Accounts Grid */}
        {renderAccountsGrid()}
      </MDBox>

      <Footer />

      {/* Account Modal (Create/Edit) */}
      <AccountModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        account={selectedAccount} 
      />

      {/* Delete Dialog */}
      <AccountDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        account={accountToDelete}
      />
    </DashboardLayout>
  );
}

export default AccountsPage;