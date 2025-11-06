import { useState, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Search,
  Wallet
} from 'lucide-react';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logoutUser } from '../../store/slices/authSlice';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Composant Navbar - Barre de navigation principale
 * 
 * Features:
 * - Logo et titre avec badge FinApp
 * - Toggle sidebar mobile
 * - Recherche globale (optionnelle)
 * - Notifications avec compteur
 * - Menu utilisateur amélioré
 * - Toggle thème Light/Dark
 * - Indicateur de connexion
 * - Support Light/Dark
 * - Responsive design
 * 
 * @example
 * <Navbar onToggleSidebar={handleToggleSidebar} showSearch={true} />
 */
const Navbar = forwardRef(({
  onToggleSidebar = () => {},
  showSearch = false,
  className = ''
}, ref) => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  // Toggle thème
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Gérer déconnexion
  const handleLogout = () => {
    dispatch(logoutUser());
    setShowUserMenu(false);
  };

  // Recherche
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
    // Implémenter la logique de recherche
  };

  return (
    <nav
      ref={ref}
      className={`
        sticky top-0 z-40
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50
        supports-backdrop-blur:bg-white/60 supports-backdrop-blur:dark:bg-gray-900/60
        ${className}
      `}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Toggle Sidebar Button (Mobile) */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    FinApp Haiti
                  </h1>
                </div>
                
              </div>
            </div>
          </div>

          {/* Center Section - Search (Optional) */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher transactions, comptes, budgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
              aria-label={`Passer en mode ${mode === 'dark' ? 'clair' : 'sombre'}`}
            >
              {mode === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 z-50 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl animate-slideDown">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <Badge variant="primary" size="sm">
                          {notificationCount} nouvelles
                        </Badge>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {/* Notification Items */}
                      <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <p className="text-sm text-gray-900 dark:text-white">
                          Nouvelle transaction ajoutée
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Il y a 2 minutes
                        </p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <p className="text-sm text-gray-900 dark:text-white">
                          Rappel de budget
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Il y a 1 heure
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full text-center text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 py-2">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
              >
                <Avatar
                  name={user?.firstName || 'User'}
                  size="sm"
                  status={isAuthenticated ? "online" : "offline"}
                  className="ring-2 ring-transparent group-hover:ring-teal-200 dark:group-hover:ring-teal-800 transition-all"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.firstName || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAuthenticated ? 'Connecté' : 'Déconnecté'}
                  </p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-64 z-50 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl animate-slideDown">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={user?.firstName || 'User'}
                          size="md"
                          status={isAuthenticated ? "online" : "offline"}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {isAuthenticated ? 'En ligne' : 'Hors ligne'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Mon profil</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Paramètres</span>
                      </button>
                    </div>

                    {/* Logout */}
                    {isAuthenticated && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func,
  showSearch: PropTypes.bool,
  className: PropTypes.string
};

export default Navbar;