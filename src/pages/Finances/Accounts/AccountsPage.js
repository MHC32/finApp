/**
 * =========================================================
 * FinApp Haiti - Accounts Page (DESIGN MODERNE & ATTRACTIF)
 * Interface épurée avec animations fluides et design premium
 * =========================================================
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { keyframes } from '@mui/material/styles';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

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

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(26, 115, 232, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 115, 232, 0.6); }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
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
  const [showAmounts, setShowAmounts] = useState(false); // Masqué par défaut pour sécurité

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

  // ================================================================
  // FORMATAGE DES MONTANTS
  // ================================================================

  const formatAmount = (amount, currency, showValue = true) => {
    if (!showValue) return '•••••';
    if (!amount && amount !== 0) return '0.00';
    
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ================================================================
  // COMPOSANTS DE DESIGN MODERNE
  // ================================================================

  /**
   * Carte de statistique avec design glassmorphism
   */
  const ModernStatCard = ({ title, value, icon, color, suffix = '', showValue = true, onClick }) => (
    <Card
      sx={{
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        animation: `${slideIn} 0.6s ease-out`,
        '&:hover': {
          transform: onClick ? 'translateY(-8px)' : 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          background: 'rgba(255, 255, 255, 0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
        },
      }}
      onClick={onClick}
    >
      <MDBox p={3} position="relative" zIndex={1}>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
          <MDBox flex={1}>
            <MDTypography 
              variant="button" 
              color="text" 
              fontWeight="medium"
              sx={{ 
                opacity: 0.8,
                fontSize: '0.75rem',
                letterSpacing: '1px'
              }}
            >
              {title}
            </MDTypography>
            <MDBox display="flex" alignItems="baseline" gap={1} mt={1.5}>
              <MDTypography 
                variant="h3" 
                fontWeight="bold" 
                color="dark"
                sx={{
                  fontSize: '2rem',
                  filter: showValue ? 'none' : 'blur(8px)',
                  transition: 'all 0.3s ease',
                  userSelect: 'none',
                  background: showValue ? 'none' : 'linear-gradient(90deg, #666 0%, #999 100%)',
                  backgroundClip: showValue ? 'none' : 'text',
                  WebkitBackgroundClip: showValue ? 'none' : 'text',
                  WebkitTextFillColor: showValue ? 'inherit' : 'transparent',
                }}
              >
                {value}
              </MDTypography>
              {suffix && (
                <MDTypography
                  variant="h6"
                  color="text"
                  fontWeight="medium"
                  sx={{
                    opacity: 0.7,
                    filter: showValue ? 'none' : 'blur(4px)',
                  }}
                >
                  {suffix}
                </MDTypography>
              )}
            </MDBox>
            
            {!showValue && (
              <MDBox 
                display="flex" 
                alignItems="center" 
                gap={0.5} 
                mt={1.5}
                sx={{ 
                  opacity: 0.8,
                  animation: `${floatAnimation} 2s ease-in-out infinite`,
                }}
              >
                <Icon sx={{ fontSize: '1rem' }}>touch_app</Icon>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  Toucher pour afficher
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
          
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="4rem"
            height="4rem"
            borderRadius="50%"
            sx={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
              color: 'white',
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }}
          >
            <Icon fontSize="large">{icon}</Icon>
          </MDBox>
        </MDBox>
      </MDBox>
      
      {/* Effet de brillance */}
      <MDBox
        position="absolute"
        top={-50}
        right={-50}
        width={100}
        height={100}
        borderRadius="50%"
        sx={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          opacity: 0.6,
        }}
      />
    </Card>
  );

  /**
   * Bouton d'action flottant
   */
  const FloatingActionButton = ({ onClick, disabled }) => (
    <MDButton
      variant="gradient"
      color="info"
      onClick={onClick}
      disabled={disabled}
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: '50%',
        minWidth: 'auto',
        boxShadow: '0 8px 25px rgba(26, 115, 232, 0.4)',
        animation: `${glowAnimation} 2s ease-in-out infinite`,
        zIndex: 1000,
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 12px 35px rgba(26, 115, 232, 0.6)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Icon fontSize="large">add</Icon>
    </MDButton>
  );

  /**
   * Header avec design moderne
   */
  const ModernHeader = () => (
    <MDBox mb={4}>
      <MDBox 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          p: 4,
          position: 'relative',
          overflow: 'hidden',
          mb: 3,
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
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <MDBox position="relative" zIndex={1}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={3}>
            <MDBox>
              <MDTypography variant="h2" fontWeight="bold" color="white" mb={1}>
                Mes Comptes
              </MDTypography>
              <MDTypography variant="h6" color="white" opacity={0.9} fontWeight="regular">
                Gérez vos comptes bancaires, Mobile Money et espèces en toute sécurité
              </MDTypography>
            </MDBox>
            
            <MDBox display="flex" gap={2} alignItems="center">
              {/* Switch design moderne */}
              <Card sx={{ 
                px: 2, 
                py: 1, 
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAmounts}
                      onChange={handleToggleAmounts}
                      color="default"
                      sx={{
                        '& .MuiSwitch-track': {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    />
                  }
                  label={
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon fontSize="small" sx={{ color: 'white' }}>
                        {showAmounts ? 'visibility' : 'visibility_off'}
                      </Icon>
                      <MDTypography variant="button" color="white" fontWeight="medium">
                        {showAmounts ? 'Montants visibles' : 'Montants masqués'}
                      </MDTypography>
                    </MDBox>
                  }
                />
              </Card>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Error Alert moderne */}
      {error && (
        <MDBox mb={2}>
          <MDAlert 
            color="error" 
            dismissible 
            onClose={() => dispatch(clearError())}
            sx={{
              borderRadius: 3,
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              color: 'white',
              '& .MuiAlert-message': {
                color: 'white',
              }
            }}
          >
            <Icon fontSize="small" sx={{ mr: 1 }}>error_outline</Icon>
            {error}
          </MDAlert>
        </MDBox>
      )}
    </MDBox>
  );

  /**
   * Section des statistiques
   */
  const StatsSection = () => {
    if (loading && accounts.length === 0) {
      return (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ 
                height: 140, 
                borderRadius: 4,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }} />
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
          <ModernStatCard
            title="SOLDE TOTAL HTG"
            value={formatAmount(totalHTG, 'HTG', showAmounts)}
            icon="account_balance"
            color="#1A73E8"
            suffix="G"
            showValue={showAmounts}
            onClick={!showAmounts ? handleToggleAmounts : undefined}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ModernStatCard
            title="SOLDE TOTAL USD"
            value={formatAmount(totalUSD, 'USD', showAmounts)}
            icon="attach_money"
            color="#0F9D58"
            suffix="$"
            showValue={showAmounts}
            onClick={!showAmounts ? handleToggleAmounts : undefined}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ModernStatCard
            title="COMPTES ACTIFS"
            value={activeAccounts.length}
            icon="check_circle"
            color="#F4B400"
            suffix={`/ ${accounts.length}`}
            showValue={true}
          />
        </Grid>
      </Grid>
    );
  };

  /**
   * Section des comptes
   */
  const AccountsSection = () => (
    <MDBox>
      {/* En-tête de section */}
      <MDBox 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        sx={{
          animation: `${slideIn} 0.6s ease-out 0.2s both`,
        }}
      >
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={0.5}>
            Tous les comptes
          </MDTypography>
          <MDTypography variant="button" color="text" fontWeight="medium">
            {accounts.length} {accounts.length > 1 ? 'comptes' : 'compte'} • {activeAccounts.length} actifs
          </MDTypography>
        </MDBox>
        
        <MDButton
          variant="outlined"
          color="dark"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={<Icon>refresh</Icon>}
          sx={{
            borderRadius: 2,
            px: 3,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              transform: 'rotate(180deg)',
              transition: 'transform 0.6s ease',
            },
          }}
        >
          Actualiser
        </MDButton>
      </MDBox>

      {/* Grille des comptes */}
      <MDBox
        sx={{
          animation: `${slideIn} 0.6s ease-out 0.4s both`,
        }}
      >
        {accounts.length === 0 && !loading ? (
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '2px dashed rgba(26, 115, 232, 0.3)',
              borderRadius: 4,
              textAlign: 'center',
              p: 6,
            }}
          >
            <MDBox
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              width={120}
              height={120}
              borderRadius="50%"
              sx={{
                background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
                mb: 3,
                animation: `${floatAnimation} 3s ease-in-out infinite`,
              }}
            >
              <Icon sx={{ fontSize: 60, color: 'white' }}>account_balance_wallet</Icon>
            </MDBox>
            
            <MDTypography variant="h4" fontWeight="bold" color="dark" mb={2}>
              Commencez votre aventure financière
            </MDTypography>
            
            <MDTypography variant="body1" color="text" mb={4} sx={{ maxWidth: 500, mx: 'auto', opacity: 0.8 }}>
              Créez votre premier compte pour suivre vos finances, analyser vos dépenses et atteindre vos objectifs
            </MDTypography>
            
            <MDButton
              variant="gradient"
              color="info"
              size="large"
              onClick={handleOpenCreateModal}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
              }}
            >
              <Icon sx={{ mr: 1, fontSize: '1.5rem' }}>add_circle</Icon>
              Créer mon premier compte
            </MDButton>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {accounts.map((account, index) => (
              <Grid item xs={12} md={6} lg={4} key={account._id}>
                <AccountCard
                  account={account}
                  onEdit={() => handleOpenEditModal(account)}
                  onDelete={() => handleOpenDeleteConfirm(account)}
                  showAmounts={showAmounts}
                  onToggleAmounts={handleToggleAmounts}
                  animationDelay={index * 0.1}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>
    </MDBox>
  );

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* Header moderne */}
        <ModernHeader />

        {/* Section statistiques */}
        <MDBox mb={4}>
          <StatsSection />
        </MDBox>

        {/* Section comptes */}
        <AccountsSection />

        {/* Bouton d'action flottant */}
        <FloatingActionButton 
          onClick={handleOpenCreateModal}
          disabled={loading}
        />
      </MDBox>

      {/* Modal */}
      <AccountModal
        open={modalOpen}
        onClose={handleCloseModal}
        account={selectedAccount}
      />

      {/* Dialog de suppression */}
      {deleteConfirmOpen && (
        <MDBox
          onClick={handleCloseDeleteConfirm}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            sx={{
              minWidth: 400,
              maxWidth: 500,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              animation: `${slideIn} 0.4s ease-out`,
            }}
          >
            <MDBox p={4} textAlign="center">
              {/* Icon animé */}
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={80}
                height={80}
                borderRadius="50%"
                mx="auto"
                mb={3}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  animation: `${floatAnimation} 2s ease-in-out infinite`,
                }}
              >
                <Icon sx={{ fontSize: 40, color: 'white' }}>warning_amber</Icon>
              </MDBox>

              {/* Titre */}
              <MDTypography variant="h4" fontWeight="bold" color="dark" mb={2}>
                Confirmer la suppression
              </MDTypography>

              {/* Message */}
              <MDTypography variant="body1" color="text" mb={4} sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                Voulez-vous vraiment supprimer le compte <strong>"{accountToDelete?.name}"</strong> ?<br />
                Cette action peut être annulée depuis les archives.
              </MDTypography>

              {/* Actions */}
              <MDBox display="flex" justifyContent="center" gap={2}>
                <MDButton
                  variant="outlined"
                  color="dark"
                  onClick={handleCloseDeleteConfirm}
                  sx={{ 
                    minWidth: 120,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
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
          </Card>
        </MDBox>
      )}

      {/* Styles globaux pour les animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </DashboardLayout>
  );
}

export default AccountsPage;