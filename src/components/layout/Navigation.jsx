// src/components/layout/Navigation.jsx - Avec support du thème sombre
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Receipt, 
  PieChart, 
  Settings,
  Users,
  TrendingUp,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const Navigation = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', emoji: '🏠' },
    { path: '/accounts', icon: CreditCard, label: 'Comptes', emoji: '🏦' },
    { path: '/transactions', icon: Receipt, label: 'Transactions', emoji: '💰' },
    { path: '/budgets', icon: PieChart, label: 'Budgets', emoji: '📊' },
    { path: '/sols', icon: Users, label: 'Sols', emoji: '👥' },
    { path: '/settings', icon: Settings, label: 'Paramètres', emoji: '⚙️' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-gray-800 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinApp</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Haiti</p>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Toggle & User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t dark:border-gray-700 space-y-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Mode sombre</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-300">Mode clair</span>
              </>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Utilisateur</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Version 1.0</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;