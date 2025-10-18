import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../ui/Loading';

/**
 * Composant PrivateRoute - Protection des routes authentifiées
 * 
 * Features:
 * - Vérifie si l'utilisateur est authentifié
 * - Redirige vers /login si non authentifié
 * - Sauvegarde la location pour redirection après login
 * - Affiche un loader pendant la vérification
 * - Support des rôles/permissions (optionnel)
 * 
 * @example
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <PrivateRoute>
 *       <DashboardPage />
 *     </PrivateRoute>
 *   } 
 * />
 */
const PrivateRoute = ({ 
  children,
  requiredRoles = [],
  fallback = null
}) => {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Afficher loader pendant la vérification
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" text="Vérification de l'authentification..." />
      </div>
    );
  }

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    // Sauvegarder la location pour redirection après login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles si requis
  if (requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // Utilisateur authentifié mais sans les permissions
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Utilisateur authentifié et autorisé, afficher le contenu
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  fallback: PropTypes.node
};

export default PrivateRoute;