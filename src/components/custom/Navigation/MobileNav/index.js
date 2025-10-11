/**
 * =========================================================
 * FinApp Haiti - MobileNav
 * Bottom navigation pour mobile (< 960px)
 * =========================================================
 */
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// @mui material components
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Icon from '@mui/material/Icon';
import Badge from '@mui/material/Badge';

// Redux
import { selectDarkMode } from 'store/slices/uiSlice';

// Items du menu mobile (top 5 pages)
const MOBILE_MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
  },
  {
    label: 'Comptes',
    icon: 'account_balance',
    path: '/accounts',
  },
  {
    label: 'Transactions',
    icon: 'receipt',
    path: '/transactions',
  },
  {
    label: 'Sols',
    icon: 'savings',
    path: '/sols',
    badge: 2, // Exemple: 2 sols actifs
  },
  {
    label: 'Plus',
    icon: 'menu',
    path: '/profile',
  },
];

/**
 * MobileNav Component
 * Affiche une bottom navigation uniquement sur mobile
 */
function MobileNav() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redux
  const darkMode = useSelector(selectDarkMode);

  // Responsive - afficher uniquement sur mobile/tablette
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Ne pas afficher si pas mobile
  if (!isMobile) {
    return null;
  }

  // Trouver l'index de l'item actif
  const activeIndex = MOBILE_MENU_ITEMS.findIndex(
    (item) => location.pathname === item.path
  );

  // Handle navigation
  const handleChange = (event, newValue) => {
    navigate(MOBILE_MENU_ITEMS[newValue].path);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        backgroundColor: darkMode ? 'background.paper' : 'white',
      }}
      elevation={8}
    >
      <BottomNavigation
        value={activeIndex}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'transparent',
          height: '64px',

          '& .MuiBottomNavigationAction-root': {
            minWidth: '60px',
            color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            
            '&.Mui-selected': {
              color: 'info.main',
            },
          },

          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            marginTop: '4px',
            
            '&.Mui-selected': {
              fontSize: '0.7rem',
              fontWeight: 600,
            },
          },
        }}
      >
        {MOBILE_MENU_ITEMS.map((item, index) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={
              item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  <Icon>{item.icon}</Icon>
                </Badge>
              ) : (
                <Icon>{item.icon}</Icon>
              )
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default MobileNav;