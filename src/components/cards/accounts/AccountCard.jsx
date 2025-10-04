/**
 * =========================================================
 * FinApp Haiti - Account Card (CORRIGÉ)
 * Carte d'affichage d'un compte
 * ✅ Toutes les fonctions helpers disponibles
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
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// MD components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Types & helpers
import {
  getAccountTypeLabel,
  getAccountTypeIcon,
  getAccountTypeColor,
  getBankLabel,
  getCurrencySymbol,
} from 'types/account.types';

// ===================================================================
// ACCOUNT CARD COMPONENT
// ===================================================================

function AccountCard({ account, onEdit, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null);

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

  // ================================================================
  // RENDER HELPERS
  // ================================================================

  const typeColor = getAccountTypeColor(account.type);
  const typeIcon = getAccountTypeIcon(account.type);
  const typeLabel = getAccountTypeLabel(account.type);

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <MDBox p={2.5}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox display="flex" alignItems="center" flex={1}>
            {/* Icon avec couleur dynamique */}
            <Icon
              fontSize="large"
              sx={{
                color: typeColor,
                backgroundColor: `${typeColor}20`,
                borderRadius: '8px',
                p: 1,
                mr: 1.5,
              }}
            >
              {typeIcon}
            </Icon>

            {/* Nom & Type */}
            <MDBox flex={1}>
              <MDTypography variant="h6" fontWeight="medium" noWrap>
                {account.name}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {typeLabel}
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Menu actions */}
          <IconButton size="small" onClick={handleMenuOpen}>
            <Icon>more_vert</Icon>
          </IconButton>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>
              <Icon fontSize="small" sx={{ mr: 1 }}>
                edit
              </Icon>
              Modifier
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Icon fontSize="small" sx={{ mr: 1 }}>
                delete
              </Icon>
              Supprimer
            </MenuItem>
          </Menu>
        </MDBox>

        {/* Badges statut */}
        <MDBox display="flex" gap={0.5} mb={2} flexWrap="wrap">
          {account.isDefault && (
            <Chip label="Défaut" size="small" color="primary" variant="outlined" />
          )}
          {!account.isActive && (
            <Chip label="Inactif" size="small" color="error" variant="outlined" />
          )}
          {account.isArchived && (
            <Chip label="Archivé" size="small" color="warning" variant="outlined" />
          )}
        </MDBox>

        <Divider />

        {/* Balance */}
        <MDBox mt={2} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold">
            SOLDE ACTUEL
          </MDTypography>
          <MDBox display="flex" alignItems="baseline" gap={0.5}>
            <MDTypography variant="h4" fontWeight="bold" color="dark">
              {(account.currentBalance || 0).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </MDTypography>
            <MDTypography variant="h6" color="text">
              {getCurrencySymbol(account.currency)}
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Infos complémentaires */}
        <MDBox>
          {/* Banque (si applicable) */}
          {account.bankName && (
            <MDTypography variant="caption" color="text" display="block" mb={0.5}>
              <Icon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }}>
                account_balance
              </Icon>
              {getBankLabel(account.bankName)}
            </MDTypography>
          )}

          {/* Devise */}
          <MDTypography variant="caption" color="text" display="block" mb={0.5}>
            <Icon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }}>
              attach_money
            </Icon>
            {account.currency}
          </MDTypography>

          {/* Solde minimum (si défini) */}
          {account.minimumBalance > 0 && (
            <MDTypography variant="caption" color="text" display="block">
              <Icon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }}>
                trending_down
              </Icon>
              Minimum: {account.minimumBalance.toLocaleString('fr-FR')}{' '}
              {getCurrencySymbol(account.currency)}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>

      {/* Footer statut */}
      <MDBox
        p={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: account.isActive ? 'success.main' : 'error.main',
          opacity: 0.1,
        }}
      >
        <MDBox display="flex" alignItems="center" p={1}>
          <Icon
            fontSize="small"
            sx={{
              color: account.isActive ? 'success.main' : 'error.main',
              mr: 0.5,
            }}
          >
            {account.isActive ? 'check_circle' : 'cancel'}
          </Icon>
          <MDTypography variant="caption" fontWeight="medium">
            {account.isActive ? 'Actif' : 'Inactif'}
          </MDTypography>
        </MDBox>
      </MDBox>
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
    bankName: PropTypes.string,
    minimumBalance: PropTypes.number,
    isActive: PropTypes.bool,
    isDefault: PropTypes.bool,
    isArchived: PropTypes.bool,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default AccountCard;