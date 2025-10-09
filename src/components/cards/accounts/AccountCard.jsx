/**
 * =========================================================
 * FinApp Haiti - Account Card (DESIGN ULTRA MODERNE)
 * Carte premium avec effets glassmorphism et animations fluides
 * =========================================================
 */

import { useState } from 'react';
import PropTypes from 'prop-types';

// @mui components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { keyframes } from '@mui/material/styles';

// MD components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Types & helpers
import {
  getAccountTypeLabel,
  getAccountTypeIcon,
  getAccountTypeColor,
  getBankLabel,
  getCurrencySymbol,
} from 'types/account.types';

// ===================================================================
// ANIMATIONS
// ===================================================================

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(26, 115, 232, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 115, 232, 0.6); }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// ===================================================================
// ACCOUNT CARD COMPONENT
// ===================================================================

function AccountCard({ 
  account, 
  onEdit, 
  onDelete, 
  showAmounts = false, 
  onToggleAmounts,
  animationDelay = 0 
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) onEdit(account);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(account);
  };

  const handleBalanceClick = () => {
    if (!showAmounts && onToggleAmounts) {
      onToggleAmounts();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // ================================================================
  // FORMATAGE DES MONTANTS
  // ================================================================

  const formatAmount = (amount, currency, showValue = true) => {
    if (!showValue) {
      return '•••••';
    }
    
    if (!amount && amount !== 0) return '0.00';
    
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ================================================================
  // VARIABLES & COULEURS
  // ================================================================

  const typeColor = getAccountTypeColor(account.type);
  const typeIcon = getAccountTypeIcon(account.type);
  const typeLabel = getAccountTypeLabel(account.type);

  // Gradient dynamique selon la devise et le type
  const getGradient = () => {
    if (account.currency === 'USD') {
      return 'linear-gradient(135deg, #0F9D58 0%, #1E8E3E 100%)';
    }
    
    // HTG avec variations selon le type
    switch(account.type) {
      case 'savings':
        return 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)';
      case 'mobile_money':
        return 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)';
      case 'cash':
        return 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)';
      default: // checking
        return 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)';
    }
  };

  const gradientColor = getGradient();

  // ================================================================
  // COMPOSANTS DE DESIGN MODERNE
  // ================================================================

  /**
   * Header avec effet glassmorphism
   */
  const ModernHeader = () => (
    <MDBox
      sx={{
        background: gradientColor,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 140,
        p: 3,
      }}
    >
      {/* Background pattern animé */}
      <MDBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        sx={{
          opacity: 0.1,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Effets de lumière */}
      <MDBox
        position="absolute"
        top={-50}
        right={-50}
        width={100}
        height={100}
        borderRadius="50%"
        sx={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: `${floatAnimation} 4s ease-in-out infinite`,
        }}
      />

      <MDBox position="relative" zIndex={2}>
        {/* Top bar - Type & Menu */}
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
          <Chip
            label={typeLabel}
            size="small"
            sx={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.65rem',
              height: 26,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '& .MuiChip-icon': {
                color: 'white !important',
                fontSize: '14px !important',
                marginLeft: '8px',
              },
            }}
            icon={<Icon>{typeIcon}</Icon>}
          />

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              color: 'white',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              width: 34,
              height: 34,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'rotate(90deg)',
              },
            }}
          >
            <Icon fontSize="small">more_vert</Icon>
          </IconButton>
        </MDBox>

        {/* Nom du compte et banque */}
        <MDBox>
          <MDTypography
            variant="h5"
            color="white"
            fontWeight="bold"
            sx={{
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              lineHeight: 1.2,
              fontSize: '1.25rem',
              mb: 1,
            }}
          >
            {account.name}
          </MDTypography>

          {account.bankName && (
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ fontSize: 16, color: 'white', opacity: 0.9 }}>account_balance</Icon>
              <MDTypography 
                variant="caption" 
                color="white" 
                fontWeight="medium" 
                sx={{ 
                  opacity: 0.9, 
                  fontSize: '0.75rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {getBankLabel(account.bankName)}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
    </MDBox>
  );

  /**
   * Carte de solde interactive
   */
  const BalanceCard = () => (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: 3,
        mb: 2.5,
        mt: -5,
        position: 'relative',
        cursor: !showAmounts ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        animation: !showAmounts ? `${glowAnimation} 2s ease-in-out infinite` : 'none',
        '&:hover': !showAmounts ? {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        } : {
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleBalanceClick}
    >
      <MDBox p={2.5} textAlign="center">
        <MDBox 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          gap={0.5}
          mb={1.5}
        >
          {!showAmounts && (
            <Tooltip title="Cliquer pour révéler le montant">
              <Icon sx={{ 
                fontSize: 18, 
                color: 'text.secondary',
                animation: `${pulse} 2s ease-in-out infinite`,
              }}>
                visibility_off
              </Icon>
            </Tooltip>
          )}
          <MDTypography 
            variant="caption" 
            color="text" 
            fontWeight="bold" 
            sx={{ 
              fontSize: '0.7rem', 
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            Solde Actuel
          </MDTypography>
        </MDBox>
        
        <MDBox display="flex" justifyContent="center" alignItems="baseline" gap={1}>
          <MDTypography 
            variant="h3" 
            fontWeight="bold" 
            color="dark" 
            sx={{ 
              fontSize: '1.75rem',
              filter: showAmounts ? 'none' : 'blur(8px)',
              transition: 'all 0.3s ease',
              userSelect: 'none',
              background: showAmounts ? 'none' : 'linear-gradient(90deg, #666 0%, #999 100%)',
              backgroundClip: showAmounts ? 'none' : 'text',
              WebkitBackgroundClip: showAmounts ? 'none' : 'text',
              WebkitTextFillColor: showAmounts ? 'inherit' : 'transparent',
            }}
          >
            {formatAmount(account.currentBalance, account.currency, showAmounts)}
          </MDTypography>
          <MDTypography 
            variant="h5" 
            color="text" 
            fontWeight="medium" 
            sx={{ 
              fontSize: '1rem',
              filter: showAmounts ? 'none' : 'blur(4px)',
              opacity: 0.8,
            }}
          >
            {getCurrencySymbol(account.currency)}
          </MDTypography>
        </MDBox>

        {/* Indication interactive */}
        {!showAmounts && (
          <MDBox 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            gap={0.5}
            mt={1.5}
            sx={{ 
              animation: `${floatAnimation} 2s ease-in-out infinite`,
            }}
          >
            <Icon sx={{ fontSize: 14, color: 'primary.main' }}>touch_app</Icon>
            <MDTypography 
              variant="caption" 
              color="primary" 
              fontWeight="medium"
              sx={{ fontSize: '0.7rem' }}
            >
              Toucher pour afficher
            </MDTypography>
          </MDBox>
        )}

        {/* Solde disponible */}
        {showAmounts && account.availableBalance !== account.currentBalance && (
          <MDTypography 
            variant="caption" 
            color="text" 
            mt={1.5} 
            display="block"
            sx={{ 
              fontSize: '0.7rem',
              background: 'rgba(0,0,0,0.03)',
              padding: '4px 8px',
              borderRadius: 1,
              display: 'inline-block',
            }}
          >
            💰 Disponible: {formatAmount(account.availableBalance, account.currency, showAmounts)} {getCurrencySymbol(account.currency)}
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );

  /**
   * Badges de statut modernes
   */
  const StatusBadges = () => (
    <MDBox display="flex" gap={1} mb={2.5} flexWrap="wrap" justifyContent="center">
      {account.isDefault && (
        <Tooltip title="Compte par défaut">
          <Chip
            label="Défaut"
            size="small"
            color="success"
            sx={{ 
              fontSize: '0.6rem', 
              height: 22,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
            }}
            icon={<Icon sx={{ fontSize: '12px !important', color: 'white' }}>star</Icon>}
          />
        </Tooltip>
      )}
      {!account.isActive && (
        <Tooltip title="Compte inactif">
          <Chip 
            label="Inactif" 
            size="small" 
            color="error" 
            sx={{ 
              fontSize: '0.6rem', 
              height: 22,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              color: 'white',
            }}
          />
        </Tooltip>
      )}
      {account.isArchived && (
        <Tooltip title="Compte archivé">
          <Chip 
            label="Archivé" 
            size="small" 
            color="warning"
            sx={{ 
              fontSize: '0.6rem', 
              height: 22,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
              color: 'white',
            }}
          />
        </Tooltip>
      )}
    </MDBox>
  );

  /**
   * Section d'informations détaillées
   */
  const InfoSection = () => (
    <MDBox 
      sx={{ 
        mb: 2.5,
        p: 2,
        background: 'rgba(0,0,0,0.02)',
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Devise */}
      <InfoRow 
        icon="payments" 
        label="Devise" 
        value={account.currency}
        showValue={true}
      />

      {/* Solde minimum */}
      {account.minimumBalance > 0 && (
        <InfoRow 
          icon="trending_down" 
          label="Solde min." 
          value={`${formatAmount(account.minimumBalance, account.currency, showAmounts)} ${getCurrencySymbol(account.currency)}`}
          showValue={showAmounts}
        />
      )}

      {/* Numéro de compte */}
      {account.accountNumber && (
        <InfoRow 
          icon="numbers" 
          label="N° compte" 
          value={account.accountNumber}
          showValue={true}
        />
      )}

      {/* Statut */}
      <InfoRow 
        icon="info" 
        label="Statut" 
        value={
          <MDBox display="flex" alignItems="center" gap={0.5}>
            <Icon
              fontSize="small"
              sx={{
                color: account.isActive ? 'success.main' : 'error.main',
                fontSize: 16,
              }}
            >
              {account.isActive ? 'check_circle' : 'cancel'}
            </Icon>
            <MDTypography
              variant="caption"
              fontWeight="bold"
              sx={{
                color: account.isActive ? 'success.main' : 'error.main',
              }}
            >
              {account.isActive ? 'Actif' : 'Inactif'}
            </MDTypography>
          </MDBox>
        }
        showValue={true}
      />
    </MDBox>
  );

  /**
   * Ligne d'information réutilisable
   */
  const InfoRow = ({ icon, label, value, showValue = true }) => (
    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
      <MDBox display="flex" alignItems="center" gap={1.5}>
        <Icon fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }}>
          {icon}
        </Icon>
        <MDTypography variant="caption" color="text" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
          {label}
        </MDTypography>
      </MDBox>
      <MDTypography 
        variant="caption" 
        fontWeight="bold" 
        color="dark" 
        sx={{ 
          fontSize: '0.75rem',
          filter: showValue ? 'none' : 'blur(4px)',
        }}
      >
        {value}
      </MDTypography>
    </MDBox>
  );

  /**
   * Actions rapides
   */
  const ActionButtons = () => (
    <MDBox display="flex" gap={1.5}>
      <MDButton
        variant="gradient"
        color="info"
        fullWidth
        onClick={handleEdit}
        sx={{ 
          borderRadius: 2,
          fontSize: '0.75rem',
          py: 1,
          minHeight: 'auto',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
          boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(26, 115, 232, 0.4)',
          },
        }}
      >
        <Icon sx={{ mr: 0.5, fontSize: '16px' }}>edit</Icon>
        Modifier
      </MDButton>
      <Tooltip title="Supprimer le compte">
        <IconButton
          onClick={handleDelete}
          sx={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            color: 'white',
            borderRadius: 2,
            width: 44,
            height: 44,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ee5a52 0%, #e53935 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
            },
          }}
        >
          <Icon fontSize="small">delete</Icon>
        </IconButton>
      </Tooltip>
    </MDBox>
  );

  // ================================================================
  // RENDER PRINCIPAL
  // ================================================================

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        animation: `${slideIn} 0.6s ease-out ${animationDelay}s both`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header moderne */}
      <ModernHeader />

      {/* Body */}
      <MDBox p={3} pt={0}>
        {/* Carte de solde */}
        <BalanceCard />

        {/* Badges de statut */}
        <StatusBadges />

        {/* Informations détaillées */}
        <InfoSection />

        {/* Actions */}
        <ActionButtons />
      </MDBox>

      {/* Menu contextuel moderne */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            borderRadius: 3,
            minWidth: 160,
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem',
              py: 1.25,
              px: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(26, 115, 232, 0.1)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Icon fontSize="small" sx={{ mr: 1.5, color: 'info.main' }}>
            edit
          </Icon>
          Modifier
        </MenuItem>
        
        {!account.isDefault && (
          <MenuItem onClick={handleMenuClose}>
            <Icon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }}>
              star
            </Icon>
            Définir par défaut
          </MenuItem>
        )}
        
        <MenuItem 
          onClick={handleMenuClose} 
          sx={{ color: 'warning.main' }}
        >
          <Icon fontSize="small" sx={{ mr: 1.5 }}>
            archive
          </Icon>
          Archiver
        </MenuItem>
        
        <MenuItem 
          onClick={handleDelete} 
          sx={{ color: 'error.main' }}
        >
          <Icon fontSize="small" sx={{ mr: 1.5 }}>
            delete
          </Icon>
          Supprimer
        </MenuItem>
      </Menu>
    </Card>
  );
}

// ===================================================================
// PROP TYPES
// ===================================================================

AccountCard.propTypes = {
  account: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    currentBalance: PropTypes.number,
    availableBalance: PropTypes.number,
    bankName: PropTypes.string,
    accountNumber: PropTypes.string,
    minimumBalance: PropTypes.number,
    isActive: PropTypes.bool,
    isDefault: PropTypes.bool,
    isArchived: PropTypes.bool,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showAmounts: PropTypes.bool,
  onToggleAmounts: PropTypes.func,
  animationDelay: PropTypes.number,
};

// Valeurs par défaut
AccountCard.defaultProps = {
  showAmounts: false,
  onEdit: () => {},
  onDelete: () => {},
  onToggleAmounts: () => {},
  animationDelay: 0,
};

export default AccountCard;