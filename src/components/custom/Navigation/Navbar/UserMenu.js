/**
 * =========================================================
 * FinApp Haiti - UserMenu
 * Menu déroulant utilisateur (Profil, Settings, Logout)
 * =========================================================
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// @mui material components
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Redux
import { logoutAsync, selectUser } from 'store/slices/authSlice';
import { selectDarkMode } from 'store/slices/uiSlice';

/**
 * UserMenu Component
 */
function UserMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);

  // Ouvrir/fermer menu
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Actions
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings');
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  // Générer initiales pour avatar
  const getInitials = () => {
    if (!user?.firstName || !user?.lastName) return '?';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <>
      {/* Avatar Button */}
      <IconButton onClick={handleOpen} size="medium">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.875rem',
            bgcolor: 'info.main',
            color: 'white',
          }}
        >
          {getInitials()}
        </Avatar>
      </IconButton>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        {/* User Info Header */}
        <MDBox sx={{ px: 2, py: 1.5 }}>
          <MDTypography variant="button" fontWeight="medium" display="block">
            {user?.firstName} {user?.lastName}
          </MDTypography>
          <MDTypography
            variant="caption"
            color="text"
            display="block"
            sx={{ mt: 0.5 }}
          >
            {user?.email}
          </MDTypography>
        </MDBox>

        <Divider sx={{ my: 0.5 }} />

        {/* Menu Items */}
        <MenuItem onClick={handleProfile}>
          <Icon sx={{ mr: 2, color: 'info.main' }}>person</Icon>
          <MDTypography variant="button">Mon Profil</MDTypography>
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <Icon sx={{ mr: 2, color: 'text.secondary' }}>settings</Icon>
          <MDTypography variant="button">Paramètres</MDTypography>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout}>
          <Icon sx={{ mr: 2, color: 'error.main' }}>logout</Icon>
          <MDTypography variant="button" color="error">
            Déconnexion
          </MDTypography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;