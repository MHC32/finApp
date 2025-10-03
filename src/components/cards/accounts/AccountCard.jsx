/**
 * =========================================================
 * FinApp Haiti - Account Card
 * Carte d'affichage d'un compte
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

// MD components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

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

  return (
    <Card sx={{ height: '100%' }}>
      <MDBox p={2}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox display="flex" alignItems="center">
            <Icon
              fontSize="medium"
              color={account.type === 'checking' ? 'info' : 'success'}
            >
              {account.type === 'checking' ? 'account_balance' : 'savings'}
            </Icon>
            <MDTypography variant="h6" fontWeight="medium" ml={1}>
              {account.name}
            </MDTypography>
          </MDBox>

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
            <MenuItem onClick={handleDelete}>
              <Icon fontSize="small" sx={{ mr: 1 }} color="error">
                delete
              </Icon>
              Supprimer
            </MenuItem>
          </Menu>
        </MDBox>

        <Divider />

        {/* Balance */}
        <MDBox mt={2} mb={1}>
          <MDTypography variant="caption" color="text" fontWeight="bold">
            SOLDE ACTUEL
          </MDTypography>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            {account.currentBalance?.toLocaleString('fr-HT') || 0} {account.currency}
          </MDTypography>
        </MDBox>

        {/* Info */}
        <MDBox mt={2}>
          <MDTypography variant="caption" color="text" display="block">
            Banque: {account.bankName || 'N/A'}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            Type: {account.type === 'checking' ? 'Compte Courant' : 'Épargne'}
          </MDTypography>
        </MDBox>

        {/* Status */}
        <MDBox display="flex" alignItems="center" mt={2}>
          <Icon
            fontSize="small"
            sx={{
              color: account.isActive ? 'success.main' : 'error.main',
              mr: 1,
            }}
          >
            {account.isActive ? 'check_circle' : 'cancel'}
          </Icon>
          <MDTypography variant="caption" color="text">
            {account.isActive ? 'Actif' : 'Inactif'}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

AccountCard.propTypes = {
  account: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AccountCard;