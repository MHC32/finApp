/**
 * =========================================================
 * FinApp Haiti - DashboardLayout
 * Layout principal custom pour l'application
 * =========================================================
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// @mui material components
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Navigation components
import Sidebar from 'components/custom/Navigation/Sidebar';
import Navbar from 'components/custom/Navigation/Navbar';
import MobileNav from 'components/custom/Navigation/MobileNav';

// Redux
import { selectMiniSidenav, setMiniSidenav } from 'store/slices/uiSlice';

// Context (pour compatibilité)
import { useMaterialUIController, setLayout } from 'context';

/**
 * DashboardLayout Component
 * Layout principal avec Sidebar + Navbar + Content
 */
function DashboardLayout({ children }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const miniSidenav = useSelector(selectMiniSidenav);

  // Context (pour compatibilité avec les composants MD existants)
  const [, contextDispatch] = useMaterialUIController();

  // Responsive
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Set layout type au montage
  useEffect(() => {
    setLayout(contextDispatch, 'dashboard');
  }, [pathname, contextDispatch]);

  // Auto-collapse sidebar sur mobile
  useEffect(() => {
    if (isMobile && !miniSidenav) {
      dispatch(setMiniSidenav(true));
    }
  }, [isMobile, miniSidenav, dispatch]);

  return (
    <MDBox
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <MDBox
        component="main"
        sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          
          // Responsive margin pour la sidebar
          marginLeft: {
            xs: 0, // Mobile: pas de margin
            lg: miniSidenav ? pxToRem(80) : pxToRem(250), // Desktop: selon miniSidenav
          },

          // Transition smooth
          transition: transitions.create(['margin-left', 'margin-right'], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),

          // Full width sur mobile
          [breakpoints.down('lg')]: {
            marginLeft: 0,
          },
        })}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <MDBox
          sx={({ functions: { pxToRem } }) => ({
            flex: 1,
            padding: {
              xs: pxToRem(16), // 16px mobile
              sm: pxToRem(24), // 24px tablette
              md: pxToRem(32), // 32px desktop
            },
            paddingTop: pxToRem(24), // Moins de padding en haut
          })}
        >
          {children}
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// PropTypes
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;