/**
 * =========================================================
 * FinApp Haiti - Navbar
 * Barre de navigation supérieure avec user menu
 * =========================================================
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// @mui material components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Redux
import { logoutAsync, selectUser } from 'store/slices/authSlice';
import { selectDarkMode, toggleDarkMode, selectMiniSidenav } from 'store/slices/uiSlice';

/**
 * Navbar Component
 */
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  const miniSidenav = useSelector(selectMiniSidenav);

  // Local state pour menus
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notifMenuAnchor, setNotifMenuAnchor] = useState(null);

  // Ouvrir/fermer user menu
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  // Ouvrir/fermer notifications menu
  const handleNotifMenuOpen = (event) => setNotifMenuAnchor(event.currentTarget);
  const handleNotifMenuClose = () => setNotifMenuAnchor(null);

  // Logout
  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  // Navigation vers profil
  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  // Navigation vers paramètres
  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  return (
    <AppBar
      position="sticky"
      sx={({ palette, functions: { pxToRem } }) => ({
        backgroundColor: darkMode ? palette.background.paper : palette.white.main,
        color: darkMode ? palette.white.main : palette.text.main,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        backdropFilter: 'blur(10px)',
      })}
    >
      <Toolbar
        sx={{
          minHeight: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          paddingX: { xs: 2, md: 3 },
        }}
      >
        {/* Left: Search or Breadcrumb (à ajouter plus tard) */}
        <MDBox sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <MDTypography
            variant="h6"
            fontWeight="medium"
            sx={{ color: darkMode ? 'white' : 'dark.main' }}
          >
            {/* Titre de la page courante (à améliorer avec breadcrumb) */}
          </MDTypography>
        </MDBox>

        {/* Right: Actions */}
        <MDBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Dark Mode Toggle */}
          <IconButton onClick={handleToggleDarkMode} size="medium">
            <Icon sx={{ color: darkMode ? 'white' : 'dark.main' }}>
              {darkMode ? 'light_mode' : 'dark_mode'}
            </Icon>
          </IconButton>

          {/* Notifications */}
          <IconButton onClick={handleNotifMenuOpen} size="medium">
            <Badge badgeContent={3} color="error">
              <Icon sx={{ color: darkMode ? 'white' : 'dark.main' }}>notifications</Icon>
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton onClick={handleUserMenuOpen} size="medium">
            <Icon sx={{ color: darkMode ? 'white' : 'dark.main' }}>account_circle</Icon>
          </IconButton>
        </MDBox>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifMenuAnchor}
        open={Boolean(notifMenuAnchor)}
        onClose={handleNotifMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxWidth: 360,
            maxHeight: 400,
          },
        }}
      >
        {/* Header */}
        <MDBox sx={{ px: 2, py: 1.5 }}>
          <MDTypography variant="h6" fontWeight="medium">
            Notifications
          </MDTypography>
        </MDBox>

        <Divider />

        {/* Notifications list (exemple) */}
        <MenuItem onClick={handleNotifMenuClose}>
          <MDBox sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Icon sx={{ color: 'info.main' }}>info</Icon>
            <MDBox>
              <MDTypography variant="button" fontWeight="medium">
                Nouveau sol disponible
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block">
                Il y a 2 heures
              </MDTypography>
            </MDBox>
          </MDBox>
        </MenuItem>

        <MenuItem onClick={handleNotifMenuClose}>
          <MDBox sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Icon sx={{ color: 'warning.main' }}>warning</Icon>
            <MDBox>
              <MDTypography variant="button" fontWeight="medium">
                Budget dépassé
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block">
                Il y a 5 heures
              </MDTypography>
            </MDBox>
          </MDBox>
        </MenuItem>

        <MenuItem onClick={handleNotifMenuClose}>
          <MDBox sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Icon sx={{ color: 'success.main' }}>check_circle</Icon>
            <MDBox>
              <MDTypography variant="button" fontWeight="medium">
                Paiement reçu
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block">
                Hier
              </MDTypography>
            </MDBox>
          </MDBox>
        </MenuItem>

        <Divider />

        <MDBox sx={{ px: 2, py: 1, textAlign: 'center' }}>
          <MDButton variant="text" color="info" size="small">
            Voir toutes les notifications
          </MDButton>
        </MDBox>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { mt: 1, minWidth: 200 },
        }}
      >
        {/* User Info */}
        <MDBox sx={{ px: 2, py: 1.5 }}>
          <MDTypography variant="button" fontWeight="medium" display="block">
            {user?.firstName} {user?.lastName}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            {user?.email}
          </MDTypography>
        </MDBox>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleProfile}>
          <Icon sx={{ mr: 2 }}>person</Icon>
          <MDTypography variant="button">Profil</MDTypography>
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <Icon sx={{ mr: 2 }}>settings</Icon>
          <MDTypography variant="button">Paramètres</MDTypography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <Icon sx={{ mr: 2, color: 'error.main' }}>logout</Icon>
          <MDTypography variant="button" color="error">
            Déconnexion
          </MDTypography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;