/**
 * =========================================================
 * FinApp Haiti - Accounts Page (MINIMALIST GLASS)
 * Design glassmorphism moderne avec animations fluides
 * =========================================================
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { keyframes } from '@mui/material/styles';

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

// ===================================================================
// ANIMATIONS
// ===================================================================

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

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

  // Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortBy, setSortBy] = useState('default'); // default, balance, name

  // ================================================================
  // EFFECTS
  // ================================================================

  useEffect(() => {
    dispatch(fetchAccountsAsync());
    const savedPreference = localStorage.getItem('accounts_showAmounts');
    if (savedPreference !== null) {
      setShowAmounts(JSON.parse(savedPreference));
    }
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleToggleAmounts = () => {
    const newValue = !showAmounts;
    setShowAmounts(newValue);
    localStorage.setItem('accounts_showAmounts', JSON.stringify(newValue));
  };

  const handleOpenCreateModal = () => {
    setSelectedAccount(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccount(null);
  };

  const handleOpenDeleteConfirm = (account) => {
    setAccountToDelete(account);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setAccountToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      await dispatch(
        deleteAccountAsync({
          accountId: accountToDelete._id,
          permanent: false,
        })
      ).unwrap();
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAccountsAsync());
  };

  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    handleCloseFilterMenu();
  };

  // ================================================================
  // FORMATAGE
  // ================================================================

  const formatAmount = (amount, currency, showValue = true) => {
    if (!showValue) return '•••••';
    if (!amount && amount !== 0) return '0.00';

    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Tri des comptes
  const getSortedAccounts = () => {
    const sorted = [...accounts];
    switch (sortBy) {
      case 'balance':
        return sorted.sort((a, b) => b.currentBalance - a.currentBalance);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted.sort((a, b) => {
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }
  };

  const sortedAccounts = getSortedAccounts();

  // ================================================================
  // RENDER HELPERS - GLASSMORPHISM DESIGN
  // ================================================================

  /**
   * Glass Card avec effet blur
   */
  const GlassCard = ({ children, gradient = false, ...props }) => (
    <Card
      {...props}
      sx={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Card>
  );

  /**
   * Header avec design glass
   */
  const GlassHeader = () => (
    <MDBox mb={4} sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
      <GlassCard gradient>
        <MDBox p={4}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <MDBox>
              <MDTypography variant="h3" fontWeight="bold" color="dark" mb={0.5}>
                Mes Finances
              </MDTypography>
              <MDTypography variant="body2" color="text" fontWeight="regular">
                Vue d'ensemble de vos comptes et soldes
              </MDTypography>
            </MDBox>

            <MDBox display="flex" gap={1.5} alignItems="center">
              {/* Toggle montants */}
              <IconButton
                onClick={handleToggleAmounts}
                sx={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <Icon>{showAmounts ? 'visibility' : 'visibility_off'}</Icon>
              </IconButton>

              {/* Mode sombre (futur) */}
              <IconButton
                sx={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <Icon>dark_mode</Icon>
              </IconButton>
            </MDBox>
          </MDBox>

          {/* Error Alert */}
          {error && (
            <MDBox mt={3}>
              <MDAlert color="error" dismissible onClose={() => dispatch(clearError())}>
                <Icon fontSize="small" sx={{ mr: 1 }}>
                  error_outline
                </Icon>
                {error}
              </MDAlert>
            </MDBox>
          )}
        </MDBox>
      </GlassCard>
    </MDBox>
  );

  /**
   * Carte statistique minimaliste
   */
  const MinimalStatCard = ({ title, value, icon, suffix = '', showValue = true, color }) => (
    <GlassCard sx={{ animation: `${slideInRight} 0.6s ease-out` }}>
      <MDBox p={3}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="medium" sx={{ letterSpacing: 1 }}>
            {title}
          </MDTypography>
          <Icon fontSize="small" sx={{ color, opacity: 0.7 }}>
            {icon}
          </Icon>
        </MDBox>

        <MDBox display="flex" alignItems="baseline" gap={0.5}>
          <MDTypography
            variant="h4"
            fontWeight="bold"
            color="dark"
            sx={{
              filter: showValue ? 'none' : 'blur(8px)',
              transition: 'filter 0.3s ease',
              userSelect: 'none',
            }}
          >
            {value}
          </MDTypography>
          {suffix && (
            <MDTypography variant="body2" color="text" fontWeight="medium">
              {suffix}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </GlassCard>
  );

  /**
   * Barre de répartition des devises
   */
  const CurrencyDistribution = () => {
    const totalHTG = totalBalance.HTG || 0;
    const totalUSD = totalBalance.USD || 0;
    const total = totalHTG + totalUSD * 130; // Approximation pour calcul %

    const htgPercent = total > 0 ? ((totalHTG / total) * 100).toFixed(0) : 0;
   const usdPercent = total > 0 ? +(((totalUSD * 130) / total) * 100).toFixed(0) : 0;

    return (
      <GlassCard sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
        <MDBox p={3}>
          <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
            Répartition par devise
          </MDTypography>

          <MDBox mb={2}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDBox
                  width={12}
                  height={12}
                  borderRadius="50%"
                  sx={{ background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)' }}
                />
                <MDTypography variant="button" color="text" fontWeight="medium">
                  HTG
                </MDTypography>
              </MDBox>
              <MDTypography variant="button" color="dark" fontWeight="bold">
                {htgPercent}%
              </MDTypography>
            </MDBox>
            <LinearProgress
              variant="determinate"
              value={htgPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #1A73E8 0%, #0D47A1 100%)',
                },
              }}
            />
          </MDBox>

          <MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDBox
                  width={12}
                  height={12}
                  borderRadius="50%"
                  sx={{ background: 'linear-gradient(135deg, #0F9D58 0%, #0a7d45 100%)' }}
                />
                <MDTypography variant="button" color="text" fontWeight="medium">
                  USD
                </MDTypography>
              </MDBox>
              <MDTypography variant="button" color="dark" fontWeight="bold">
                {usdPercent}%
              </MDTypography>
            </MDBox>
            <LinearProgress
              variant="determinate"
              value={usdPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(15, 157, 88, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #0F9D58 0%, #0a7d45 100%)',
                },
              }}
            />
          </MDBox>
        </MDBox>
      </GlassCard>
    );
  };

  /**
   * Section des statistiques
   */
  const StatsSection = () => {
    if (loading && accounts.length === 0) {
      return (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <GlassCard>
                <MDBox p={3}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="60%" height={40} sx={{ mt: 2 }} />
                </MDBox>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      );
    }

    const totalHTG = totalBalance.HTG || 0;
    const totalUSD = totalBalance.USD || 0;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MinimalStatCard
            title="HTG"
            value={formatAmount(totalHTG, 'HTG', showAmounts)}
            icon="account_balance_wallet"
            suffix="G"
            showValue={showAmounts}
            color="#1A73E8"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <MinimalStatCard
            title="USD"
            value={formatAmount(totalUSD, 'USD', showAmounts)}
            icon="attach_money"
            suffix="$"
            showValue={showAmounts}
            color="#0F9D58"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <MinimalStatCard
            title="COMPTES"
            value={activeAccounts.length}
            icon="account_balance"
            suffix={`/ ${accounts.length}`}
            showValue={true}
            color="#F4B400"
          />
        </Grid>

        <Grid item xs={12}>
          <CurrencyDistribution />
        </Grid>
      </Grid>
    );
  };

  /**
   * Section liste des comptes
   */
  const AccountsListSection = () => (
    <MDBox sx={{ animation: `${fadeIn} 1s ease-out` }}>
      {/* Header section */}
      <MDBox mb={3}>
        <GlassCard>
          <MDBox p={2.5} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium" color="dark">
                Tous les comptes ({accounts.length})
              </MDTypography>
            </MDBox>

            <MDBox display="flex" gap={1}>
              {/* Bouton filtre */}
              <MDButton
                variant="outlined"
                color="dark"
                onClick={handleOpenFilterMenu}
                startIcon={<Icon>filter_list</Icon>}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                Filtrer
              </MDButton>

              {/* Menu filtre */}
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleCloseFilterMenu}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem onClick={() => handleSort('default')}>
                  <Icon sx={{ mr: 1 }}>sort</Icon>
                  Par défaut
                </MenuItem>
                <MenuItem onClick={() => handleSort('balance')}>
                  <Icon sx={{ mr: 1 }}>trending_down</Icon>
                  Par solde
                </MenuItem>
                <MenuItem onClick={() => handleSort('name')}>
                  <Icon sx={{ mr: 1 }}>sort_by_alpha</Icon>
                  Par nom
                </MenuItem>
              </Menu>

              {/* Bouton refresh */}
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.7)',
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.6s ease',
                }}
              >
                <Icon>refresh</Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        </GlassCard>
      </MDBox>

      {/* Liste des comptes */}
      {accounts.length === 0 && !loading ? (
        <GlassCard>
          <MDBox p={6} textAlign="center">
            <MDBox
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              width={100}
              height={100}
              borderRadius="50%"
              sx={{
                background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.1) 0%, rgba(26, 115, 232, 0.05) 100%)',
                mb: 3,
              }}
            >
              <Icon sx={{ fontSize: 50, color: '#1A73E8' }}>account_balance_wallet</Icon>
            </MDBox>

            <MDTypography variant="h5" fontWeight="bold" color="dark" mb={1}>
              Aucun compte
            </MDTypography>

            <MDTypography variant="body2" color="text" mb={3} sx={{ maxWidth: 400, mx: 'auto' }}>
              Créez votre premier compte pour commencer à gérer vos finances
            </MDTypography>

            <MDButton
              variant="gradient"
              color="info"
              onClick={handleOpenCreateModal}
              sx={{
                px: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
              }}
            >
              <Icon sx={{ mr: 1 }}>add_circle</Icon>
              Créer mon premier compte
            </MDButton>
          </MDBox>
        </GlassCard>
      ) : (
        <Grid container spacing={3}>
          {sortedAccounts.map((account, index) => (
            <Grid item xs={12} md={6} lg={4} key={account._id}>
              <AccountCard
                account={account}
                onEdit={() => handleOpenEditModal(account)}
                onDelete={() => handleOpenDeleteConfirm(account)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </MDBox>
  );

  /**
   * Bouton flottant
   */
  const FloatingButton = () => (
    <MDButton
      variant="gradient"
      color="info"
      onClick={handleOpenCreateModal}
      disabled={loading}
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: '50%',
        minWidth: 'auto',
        background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
        boxShadow: '0 8px 24px rgba(26, 115, 232, 0.4)',
        zIndex: 1000,
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 12px 32px rgba(26, 115, 232, 0.6)',
        },
        transition: 'all 0.3s ease',
        animation: `${pulse} 2s infinite`,
      }}
    >
      <Icon fontSize="large">add</Icon>
    </MDButton>
  );

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* Header */}
        <GlassHeader />

        {/* Stats */}
        <MDBox mb={4}>
          <StatsSection />
        </MDBox>

        {/* Accounts List */}
        <AccountsListSection />

        {/* Floating Button */}
        <FloatingButton />
      </MDBox>

      <Footer />

      {/* Modal */}
      <AccountModal open={modalOpen} onClose={handleCloseModal} account={selectedAccount} />

      {/* Delete Dialog */}
      {deleteConfirmOpen && (
        <MDBox
          onClick={handleCloseDeleteConfirm}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
        >
          <GlassCard
            onClick={(e) => e.stopPropagation()}
            sx={{
              minWidth: 400,
              maxWidth: 500,
              animation: `${fadeIn} 0.3s ease-out`,
            }}
          >
            <MDBox p={4} textAlign="center">
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={64}
                height={64}
                borderRadius="50%"
                mx="auto"
                mb={3}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                }}
              >
                <Icon sx={{ fontSize: 32, color: 'white' }}>warning</Icon>
              </MDBox>

              <MDTypography variant="h5" fontWeight="bold" color="dark" mb={2}>
                Supprimer ce compte ?
              </MDTypography>

              <MDTypography variant="body2" color="text" mb={4}>
                Êtes-vous sûr de vouloir supprimer le compte{' '}
                <strong>"{accountToDelete?.name}"</strong> ?<br />
                Cette action peut être annulée depuis les archives.
              </MDTypography>

              <MDBox display="flex" justifyContent="center" gap={2}>
                <MDButton
                  variant="outlined"
                  color="dark"
                  onClick={handleCloseDeleteConfirm}
                  sx={{ minWidth: 120, borderRadius: 2 }}
                >
                  Annuler
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  onClick={handleConfirmDelete}
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  }}
                >
                  Supprimer
                </MDButton>
              </MDBox>
            </MDBox>
          </GlassCard>
        </MDBox>
      )}
    </DashboardLayout>
  );
}

export default AccountsPage;