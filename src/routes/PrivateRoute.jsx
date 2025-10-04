/**
 * =========================================================
 * FinApp Haiti - Protected Route (CORRIGÉE)
 * ✅ Correction: Redirection immédiate si non authentifié
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

// Routes
import sidenavRoutes from 'sidenavRoutes';

// Redux selectors
import { selectIsAuthenticated, selectAuthLoading } from 'store/slices/authSlice';

/**
 * Protected Route Component
 * Vérifie l'authentification et affiche le layout dashboard
 */
function PrivateRoute() {
  const location = useLocation();

  // ✅ CORRECTION: Utiliser les selectors Redux appropriés
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);

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

  // ✅ CORRECTION: Ne pas rediriger pendant le chargement initial
  // (App.js gère déjà le loading spinner)
  if (authLoading) {
    return null; // ou <LoadingSpinner />
  }

  // ✅ CORRECTION: Si non authentifié, rediriger IMMÉDIATEMENT vers login
  if (!isAuthenticated) {
    console.log('🚫 Accès refusé - Redirection vers /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Si authentifié, afficher le layout dashboard
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

export default PrivateRoute;