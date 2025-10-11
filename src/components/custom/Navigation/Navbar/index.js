/**
 * =========================================================
 * FinApp Haiti - Navbar (AMÉLIORÉE)
 * Barre de navigation supérieure modulaire
 * =========================================================
 */
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// @mui material components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Sous-composants
import UserMenu from 'components/custom/Navigation/Navbar/UserMenu';
import NotificationMenu from 'components/custom/Navigation/Navbar/NotificationMenu';

// Redux
import { selectDarkMode, toggleDarkMode, selectMiniSidenav } from 'store/slices/uiSlice';

// Routes labels (pour afficher le titre de la page)
const ROUTE_LABELS = {
  '/dashboard': 'Tableau de bord',
  '/accounts': 'Mes Comptes',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/sols': 'Sols',
  '/investments': 'Investissements',
  '/debts': 'Dettes',
  '/reports': 'Rapports',
  '/notifications': 'Notifications',
  '/profile': 'Mon Profil',
  '/settings': 'Paramètres',
};

/**
 * Navbar Component
 */
function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const darkMode = useSelector(selectDarkMode);
  const miniSidenav = useSelector(selectMiniSidenav);

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  // Obtenir le titre de la page courante
  const getPageTitle = () => {
    return ROUTE_LABELS[location.pathname] || 'FinApp Haiti';
  };

  return (
    <AppBar
      position="sticky"
      sx={({ palette, functions: { pxToRem, rgba } }) => ({
        backgroundColor: darkMode
          ? palette.background.paper
          : rgba(palette.white.main, 0.95),
        color: darkMode ? palette.white.main : palette.text.main,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${
          darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }`,
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
      })}
    >
      <Toolbar
        sx={{
          minHeight: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: { xs: 2, md: 3 },
        }}
      >
        {/* Left: Page Title */}
        <MDBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <MDTypography
            variant="h6"
            fontWeight="medium"
            sx={{
              color: darkMode ? 'white' : 'dark.main',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {getPageTitle()}
          </MDTypography>

          {/* Mobile: Logo ou icône */}
          <MDBox
            sx={{
              display: { xs: 'block', sm: 'none' },
            }}
          >
            <Icon sx={{ color: 'info.main', fontSize: 28 }}>dashboard</Icon>
          </MDBox>
        </MDBox>

        {/* Right: Actions */}
        <MDBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, md: 1 },
          }}
        >
          {/* Search Button (à implémenter plus tard) */}
          <IconButton
            size="medium"
            sx={{
              display: { xs: 'none', md: 'flex' },
              color: darkMode ? 'white' : 'dark.main',
            }}
          >
            <Icon>search</Icon>
          </IconButton>

          {/* Dark Mode Toggle */}
          <IconButton
            onClick={handleToggleDarkMode}
            size="medium"
            sx={{
              color: darkMode ? 'white' : 'dark.main',
            }}
          >
            <Icon>{darkMode ? 'light_mode' : 'dark_mode'}</Icon>
          </IconButton>

          {/* Notification Menu */}
          <NotificationMenu />

          {/* User Menu */}
          <UserMenu />
        </MDBox>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;