// src/routes/AppRouter.jsx
/**
 * Router principal simplifié - FinApp Haiti
 * Remplace l'ancien index.jsx complexe
 */

import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts et Guards
import MainLayout from '../components/layout/MainLayout';
import PrivateRoute from '../components/layout/PrivateRoute';
import AdminRoute from '../components/layout/AdminRoute';

// Configuration des routes
import { routeConfig } from './routeConfig';
import NotFoundPage from '../features/404/pages/NotFoundPage';

/**
 * Créer les éléments de route avec les protections appropriées
 */
const createRouteElements = () => {
  return routeConfig.map(route => {
    const { meta } = route;
    
    let element = route.element;
    
    // Appliquer les protections de route
    if (meta.type === 'private') {
      element = <PrivateRoute>{element}</PrivateRoute>;
    } else if (meta.type === 'admin') {
      element = (
        <PrivateRoute>
          <AdminRoute>
            {element}
          </AdminRoute>
        </PrivateRoute>
      );
    }
    
   
    
    return {
      path: route.path,
      element: element,
      id: route.id
    };
  });
};

/**
 * Configuration du router
 */
const router = createBrowserRouter([
  // Redirection racine
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  
  // Routes principales
  ...createRouteElements(),
  
  // 404 - Doit être la dernière
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

/**
 * Composant Router principal
 */
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;