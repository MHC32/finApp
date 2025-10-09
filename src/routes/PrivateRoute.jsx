/**
 * =========================================================
 * FinApp Haiti - Protected Route 
 * ✅ Utilise UNIQUEMENT le authSlice Redux
 * =========================================================
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material Dashboard 2 React components
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

// ✅ UNIQUEMENT REDUX
import { selectIsAuthenticated, selectAuthLoading } from 'store/slices/authSlice';

/**
 * Protected Route Component - VERSION REDUX SEULEMENT
 */
function PrivateRoute() {
  const location = useLocation();
  
  // ✅ UNIQUEMENT REDUX pour l'authentification
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

  // ✅ Si Redux est en train de vérifier l'auth, ne rien afficher
  // (le spinner est géré par App.js)
  if (authLoading) {
    console.log('🔄 PrivateRoute - En attente vérification Redux');
    return null;
  }

  // ✅ Si NON authentifié selon Redux, rediriger vers login
  if (!isAuthenticated) {
    console.log('🔐 PrivateRoute - Non authentifié, redirection vers /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Authentifié selon Redux - afficher le layout
  console.log('✅ PrivateRoute - Utilisateur authentifié, affichage layout');
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
        <Outlet />
      </DashboardLayout>
    </>
  );
}

export default PrivateRoute;