// src/components/layout/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loading from '../ui/Loading';

/**
 * Composant AdminRoute - Protection des routes administrateur
 * Vérifie si l'utilisateur est admin
 */
const AdminRoute = ({ children, fallback = null }) => {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" text="Vérification des permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur est admin
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default AdminRoute;