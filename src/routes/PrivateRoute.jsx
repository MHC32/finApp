/**
 * =========================================================
 * FinApp Haiti - Protected Route (UPDATED)
 * ✅ Utilise le nouveau DashboardLayout custom
 * =========================================================
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ✅ NOUVEAU LAYOUT CUSTOM
import DashboardLayout from 'layouts/DashboardLayout';

// Redux
import { selectIsAuthenticated, selectAuthLoading } from 'store/slices/authSlice';

/**
 * Protected Route Component
 * Protège les routes privées et affiche le layout dashboard
 */
function PrivateRoute() {
  const location = useLocation();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);

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

  // ✅ Authentifié - afficher le nouveau layout custom
  console.log('✅ PrivateRoute - Utilisateur authentifié, affichage nouveau layout');
  
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default PrivateRoute;