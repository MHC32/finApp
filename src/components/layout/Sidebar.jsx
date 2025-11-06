import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  CreditCard,
  ArrowLeftRight,
  PieChart,
  Users,
  Wallet,
  TrendingUp,
  Bell,
  Settings,
  HelpCircle,
  X,
  ChevronDown
} from 'lucide-react';
import Badge from '../ui/Badge';

/**
 * Composant Sidebar - Menu latéral de navigation
 * 
 * Features:
 * - Navigation hiérarchique
 * - Sous-menus accordéon
 * - Icônes pour chaque item
 * - Badge notifications
 * - État actif/sélectionné
 * - Responsive (mobile overlay)
 * - Support Light/Dark
 * 
 * @example
 * <Sidebar 
 *   isOpen={isSidebarOpen}
 *   onClose={handleCloseSidebar}
 * />
 */
const Sidebar = forwardRef(({
  isOpen = true,
  onClose = () => {},
  className = ''
}, ref) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['main']);

  // Configuration du menu
  const menuItems = [
    {
      id: 'main',
      title: 'Principal',
      items: [
        {
          icon: Home,
          label: 'Tableau de bord',
          path: '/dashboard',
          badge: null
        },
        {
          icon: CreditCard,
          label: 'Comptes',
          path: '/accounts',
          badge: '4'
        },
        {
          icon: ArrowLeftRight,
          label: 'Transactions',
          path: '/transactions',
          badge: '12',
          badgeColor: 'teal'
        }
      ]
    },
    {
      id: 'finance',
      title: 'Finance',
      items: [
        {
          icon: PieChart,
          label: 'Budgets',
          path: '/budgets',
          badge: null
        },
        {
          icon: Users,
          label: 'Sols (Tontines)',
          path: '/sols',
          badge: '2',
          badgeColor: 'blue'
        },
        {
          icon: Wallet,
          label: 'Dettes',
          path: '/debts',
          badge: null
        },
        {
          icon: TrendingUp,
          label: 'Investissements',
          path: '/investments',
          badge: null
        }
      ]
    },
    {
      id: 'other',
      title: 'Autre',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          path: '/notifications',
          badge: '3',
          badgeColor: 'red'
        },
        {
          icon: Settings,
          label: 'Paramètres',
          path: '/settings',
          badge: null
        },
        {
          icon: HelpCircle,
          label: 'Aide & Support',
          path: '/help',
          badge: null
        }
      ]
    }
  ];

  // Toggle section
  const toggleSection = (sectionId) => {
    setExpandedMenus(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Vérifier si un item est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Gérer la fermeture sur mobile
  const handleMobileClose = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-64 h-screen
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header avec bouton fermer (Mobile) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {menuItems.map((section) => {
              const isExpanded = expandedMenus.includes(section.id);

              return (
                <div key={section.id}>
                  {/* Section Title */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between mb-2 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Menu Items */}
                  {isExpanded && (
                    <div className="space-y-1">
                      {section.items.map((item, index) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                          <Link
                            key={index}
                            to={item.path}
                            onClick={handleMobileClose}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg
                              transition-all duration-200
                              ${
                                active
                                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }
                            `}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="flex-1 text-left text-sm">
                              {item.label}
                            </span>
                            {item.badge && (
                              <Badge
                                size="sm"
                                color={item.badgeColor || 'gray'}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white">
              <p className="text-sm font-semibold mb-1">
                🇭🇹 FinApp Haiti
              </p>
              <p className="text-xs opacity-90">
                Gérez vos finances facilement
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string
};

export default Sidebar;