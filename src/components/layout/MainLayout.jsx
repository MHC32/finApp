import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

/**
 * Composant MainLayout - Layout principal de l'application
 * 
 * Features:
 * - Structure globale (Navbar + Sidebar + Content + Footer)
 * - Gestion état sidebar (open/close)
 * - Breadcrumbs optionnels
 * - Content area scrollable
 * - Responsive mobile/desktop
 * - Support Light/Dark
 * 
 * @example
 * <MainLayout
 *   breadcrumbs={[
 *     { label: 'Accueil', href: '/' },
 *     { label: 'Comptes', href: '/accounts' }
 *   ]}
 * >
 *   <YourPageContent />
 * </MainLayout>
 */
const MainLayout = forwardRef(({
  children,
  breadcrumbs = null,
  showSidebar = true,
  showFooter = true,
  showBreadcrumbs = true,
  currentPath = '/',
  maxWidth = '7xl',
  className = ''
}, ref) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Classes de max-width
  const maxWidthClasses = {
    'full': 'max-w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Navbar */}
      <Navbar onToggleSidebar={handleToggleSidebar} />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleCloseSidebar}
            currentPath={currentPath}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
            {/* Breadcrumbs */}
            {showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {/* Page Content */}
            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ),
  showSidebar: PropTypes.bool,
  showFooter: PropTypes.bool,
  showBreadcrumbs: PropTypes.bool,
  currentPath: PropTypes.string,
  maxWidth: PropTypes.oneOf(['full', '7xl', '6xl', '5xl', '4xl']),
  className: PropTypes.string
};

export default MainLayout;