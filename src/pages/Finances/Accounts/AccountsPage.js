/**
 * =========================================================
 * FinApp Haiti - Accounts Page (REFACTORÉ)
 * Page principale de gestion des comptes financiers
 * ✅ Utilise accountsSlice + AccountModal + AccountCard
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

// Types & Constants
import { getCurrencySymbol } from 'types/account.types';
import { CURRENCIES } from 'utils/constants/constants';

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
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
   * Ouvrir confirmation suppression
   */
  const handleOpenDeleteConfirm = (account) => {
    setAccountToDelete(account);
    setDeleteConfirmOpen(true);
  };

  /**
   * Fermer confirmation suppression
   */
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setAccountToDelete(null);
  };

  /**
   * Confirmer suppression
   */
  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      await dispatch(
        deleteAccountAsync({
          accountId: accountToDelete._id,
          permanent: false, // Soft delete par défaut
        })
      ).unwrap();

      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Erreur suppression:', error);
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
              onDelete={() => handleOpenDeleteConfirm(account)}
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

      {/* Modals */}
      <AccountModal open={modalOpen} onClose={handleCloseModal} account={selectedAccount} />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <Card
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1300,
            minWidth: 400,
            boxShadow: 24,
          }}
        >
          <MDBox p={3}>
            <MDTypography variant="h5" mb={2}>
              Confirmer la suppression
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={3}>
              Êtes-vous sûr de vouloir supprimer le compte "
              <strong>{accountToDelete?.name}</strong>" ?
            </MDTypography>
            <MDBox display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" onClick={handleCloseDeleteConfirm}>
                Annuler
              </MDButton>
              <MDButton variant="gradient" color="error" onClick={handleConfirmDelete}>
                Supprimer
              </MDButton>
            </MDBox>
          </MDBox>
        </Card>
      )}
    </DashboardLayout>
  );
}

export default AccountsPage;