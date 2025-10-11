/**
 * =========================================================
 * FinApp Haiti - Sidebar Navigation
 * Sidebar custom 250px avec items de menu
 * =========================================================
 */
import { useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// @mui material components
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Redux
import { selectMiniSidenav, selectDarkMode, setMiniSidenav } from 'store/slices/uiSlice';

// Routes du menu
import routes from 'sidenavRoutes';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

// Largeur de la sidebar
const SIDEBAR_WIDTH = 250;
const SIDEBAR_MINI_WIDTH = 80;

/**
 * SidebarItem Component
 * Item individuel du menu
 */
function SidebarItem({ route, active }) {
  const darkMode = useSelector(selectDarkMode);
  const miniSidenav = useSelector(selectMiniSidenav);

  return (
    <MDBox
      component={NavLink}
      to={route.route}
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        padding: '12px 20px',
        margin: '4px 12px',
        borderRadius: '8px',
        transition: 'all 0.2s',
        cursor: 'pointer',
        backgroundColor: active ? (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
        
        '&:hover': {
          backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
          transform: 'translateX(4px)',
        },
      }}
    >
      {/* Icon */}
      <MDBox
        sx={{
          minWidth: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? 'info.main' : (darkMode ? 'white' : 'dark.main'),
        }}
      >
        {typeof route.icon === 'string' ? (
          <Icon sx={{ fontSize: '20px !important' }}>{route.icon}</Icon>
        ) : (
          route.icon
        )}
      </MDBox>

      {/* Label (caché si mini) */}
      {!miniSidenav && (
        <MDBox sx={{ flex: 1 }}>
          <MDTypography
            variant="button"
            fontWeight={active ? 'medium' : 'regular'}
            sx={{
              color: active ? 'info.main' : (darkMode ? 'white' : 'dark.main'),
              fontSize: '0.875rem',
            }}
          >
            {route.name}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
}

SidebarItem.propTypes = {
  route: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
};

/**
 * Sidebar Component Principal
 */
function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const miniSidenav = useSelector(selectMiniSidenav);
  const darkMode = useSelector(selectDarkMode);

  // Responsive
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isOpen = !miniSidenav || !isMobile;

  // Fermer sidebar sur mobile après navigation
  useEffect(() => {
    if (isMobile) {
      dispatch(setMiniSidenav(true));
    }
  }, [location.pathname, isMobile, dispatch]);

  // Toggle sidebar
  const handleToggle = () => {
    dispatch(setMiniSidenav(!miniSidenav));
  };

  // Render menu items
  const renderRoutes = routes.map((route) => {
    const { key, type, name, icon, route: path } = route;
    const isActive = location.pathname === path;

    // Title
    if (type === 'title' && !miniSidenav) {
      return (
        <MDBox key={key} sx={{ mt: 3, mb: 1, px: 3 }}>
          <MDTypography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            sx={{
              color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)',
              fontSize: '0.75rem',
              letterSpacing: '0.5px',
            }}
          >
            {route.title}
          </MDTypography>
        </MDBox>
      );
    }

    // Divider
    if (type === 'divider') {
      return (
        <Divider
          key={key}
          sx={{
            margin: '12px 0',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        />
      );
    }

    // Collapse (menu item)
    if (type === 'collapse') {
      return <SidebarItem key={key} route={route} active={isActive} />;
    }

    return null;
  });

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isOpen}
      onClose={handleToggle}
      sx={{
        width: miniSidenav ? SIDEBAR_MINI_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        
        '& .MuiDrawer-paper': {
          width: miniSidenav ? SIDEBAR_MINI_WIDTH : SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: darkMode ? 'background.paper' : 'white',
          borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo & Brand */}
      <MDBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: miniSidenav ? 'center' : 'space-between',
          padding: '20px 16px',
          minHeight: '64px',
        }}
      >
        {/* Logo */}
        <MDBox
          component="img"
          src={darkMode ? brandWhite : brandDark}
          alt="FinApp Haiti"
          sx={{
            height: '32px',
            width: 'auto',
          }}
        />

        {/* Brand Name (caché si mini) */}
        {!miniSidenav && (
          <MDTypography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: darkMode ? 'white' : 'dark.main',
              ml: 2,
            }}
          >
            FinApp Haiti
          </MDTypography>
        )}

        {/* Toggle Button (desktop seulement) */}
        {!isMobile && (
          <IconButton onClick={handleToggle} size="small">
            <Icon sx={{ color: darkMode ? 'white' : 'dark.main' }}>
              {miniSidenav ? 'chevron_right' : 'chevron_left'}
            </Icon>
          </IconButton>
        )}
      </MDBox>

      <Divider sx={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

      {/* Menu Items */}
      <MDBox
        component={List}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingY: 2,

          // Custom scrollbar
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        {renderRoutes}
      </MDBox>

      {/* Footer (Version) */}
      {!miniSidenav && (
        <MDBox sx={{ p: 2, textAlign: 'center' }}>
          <MDTypography
            variant="caption"
            sx={{
              color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
              fontSize: '0.7rem',
            }}
          >
            FinApp Haiti v1.0.0
          </MDTypography>
        </MDBox>
      )}
    </Drawer>
  );
}

export default Sidebar;