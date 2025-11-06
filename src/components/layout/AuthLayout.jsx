// src/components/layout/AuthLayout.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

/**
 * Composant AuthLayout - Layout pour les pages d'authentification
 * 
 * Features:
 * - Design épuré pour login/register
 * - Logo et branding FinApp Haiti
 * - Pas de sidebar/navbar complète
 * - Footer simplifié
 * - Support Light/Dark
 * - Responsive design
 * 
 * @example
 * <AuthLayout>
 *   <LoginForm />
 * </AuthLayout>
 */
const AuthLayout = forwardRef(({
  children,
  showFooter = true,
  className = ''
}, ref) => {
  return (
    <div 
      ref={ref}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
    >
      {/* Header simplifié */}
      <header className="flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to={ROUTES.HOME} 
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  FinApp Haiti
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  🇭🇹 Gestion financière
                </p>
              </div>
            </Link>

            {/* Lien retour au site */}
            <Link
              to={ROUTES.HOME}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-md ${className}`}>
          {children}
        </div>
      </main>

      {/* Footer simplifié */}
      {showFooter && (
        <footer className="flex-shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} FinApp Haiti - Sécurisé et fiable
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
});

AuthLayout.displayName = 'AuthLayout';

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showFooter: PropTypes.bool,
  className: PropTypes.string
};

export default AuthLayout;