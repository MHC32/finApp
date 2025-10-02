/**
 * =========================================================
 * FinApp Haiti - Protected Route
 * Route guard pour pages authentifiées
 * =========================================================
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Sidenav from 'examples/Sidenav';

// Material Dashboard 2 React context
import { useMaterialUIController, setMiniSidenav } from 'context';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

// ✅ CORRECTION : Import depuis sidenavRoutes.js
import sidenavRoutes from 'sidenavRoutes';

/**
 * Protected Route Component
 * Vérifie l'authentification et affiche le layout dashboard
 */
function ProtectedRoute() {
  const location = useLocation();

  // Redux state
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  // Material UI Controller
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  // Mouse handlers pour mini sidenav
  const [onMouseEnter, setOnMouseEnter] = React.useState(false);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {/* Sidenav */}
      <Sidenav
        color={sidenavColor}
        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
        brandName="FinApp Haiti"
        routes={sidenavRoutes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />

      {/* Dashboard Layout avec Navbar */}
      <DashboardLayout>
        <DashboardNavbar />

        {/* Page content (Outlet pour nested routes) */}
        <Outlet />

        {/* Footer */}
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default ProtectedRoute;