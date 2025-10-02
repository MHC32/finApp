/**
 * =========================================================
 * FinApp Haiti - Public Route
 * Route guard pour pages publiques (login, register)
 * =========================================================
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Public Route Component
 * Redirige vers dashboard si déjà authentifié
 * N'ajoute PAS de layout car les pages auth ont déjà BasicLayout/CoverLayout
 */
function PublicRoute() {
  const location = useLocation();
  
  // Redux state
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  // Si déjà authentifié, rediriger vers dashboard (ou page demandée)
  if (isAuthenticated) {
    // Récupérer la page d'origine si elle existe
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // ✅ CORRECTION : Pas de PageLayout ici car les pages auth l'ont déjà
  // Juste retourner l'Outlet pour afficher la route enfant
  return <Outlet />;
}

export default PublicRoute;