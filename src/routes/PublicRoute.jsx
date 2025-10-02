/**
 * =========================================================
 * FinApp Haiti - Public Route
 * Route guard pour pages publiques (login, register)
 * =========================================================
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material Dashboard 2 React example components
import PageLayout from 'examples/LayoutContainers/PageLayout';

/**
 * Public Route Component
 * Redirige vers dashboard si déjà authentifié
 * Sinon affiche la page publique (login, register)
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

  // Sinon, afficher la page publique avec PageLayout
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

export default PublicRoute;