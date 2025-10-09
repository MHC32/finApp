/**
 * =========================================================
 * FinApp Haiti - Public Route
 * ✅ Utilise UNIQUEMENT le authSlice Redux
 * =========================================================
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ✅ UNIQUEMENT REDUX
import { selectIsAuthenticated } from 'store/slices/authSlice';

/**
 * Public Route Component - VERSION REDUX SEULEMENT
 */
function PublicRoute() {
  const location = useLocation();
  
  // ✅ UNIQUEMENT REDUX pour l'authentification
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Si déjà authentifié selon Redux, rediriger vers dashboard
  if (isAuthenticated) {
    console.log('🔐 PublicRoute - Déjà authentifié, redirection vers /dashboard');
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // ✅ Non authentifié - afficher la page publique (login/register)
  console.log('✅ PublicRoute - Non authentifié, affichage page publique');
  return <Outlet />;
}

export default PublicRoute;