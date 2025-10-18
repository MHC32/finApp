import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Composant Breadcrumbs - Fil d'Ariane de navigation
 * 
 * Features:
 * - Affichage hiérarchique de la navigation
 * - Icône home pour l'accueil
 * - Liens cliquables
 * - Dernier item non cliquable (page actuelle)
 * - Séparateur personnalisable
 * - Support Light/Dark
 * 
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: 'Accueil', href: '/' },
 *     { label: 'Comptes', href: '/accounts' },
 *     { label: 'Détails', href: '/accounts/123' }
 *   ]}
 * />
 */
const Breadcrumbs = forwardRef(({
  items = [],
  showHome = true,
  separator: SeparatorIcon = ChevronRight,
  maxItems = null,
  className = ''
}, ref) => {
  // Si maxItems défini, tronquer les items du milieu
  let displayItems = items;
  if (maxItems && items.length > maxItems) {
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [...firstItems, { label: '...', href: null }, ...lastItems];
  }

  // Gérer le clic sur un item
  const handleClick = (href) => {
    if (href) {
      // En production, utiliser react-router
      // navigate(href);
      console.log('Navigate to:', href);
    }
  };

  return (
    <nav
      ref={ref}
      aria-label="Fil d'Ariane"
      className={`flex items-center ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home icon optionnel */}
        {showHome && (
          <>
            <li>
              <button
                onClick={() => handleClick('/')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                aria-label="Accueil"
              >
                <Home className="w-4 h-4" />
              </button>
            </li>
            {displayItems.length > 0 && (
              <li>
                <SeparatorIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              </li>
            )}
          </>
        )}

        {/* Items du breadcrumb */}
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={index} className="flex items-center gap-2">
              {isEllipsis ? (
                <span className="text-gray-400 dark:text-gray-600">
                  {item.label}
                </span>
              ) : isLast ? (
                // Dernier item (page actuelle) - non cliquable
                <span
                  className="text-gray-900 dark:text-white font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                // Items intermédiaires - cliquables
                <button
                  onClick={() => handleClick(item.href)}
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {item.label}
                </button>
              )}

              {/* Séparateur (sauf pour le dernier) */}
              {!isLast && (
                <SeparatorIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ).isRequired,
  showHome: PropTypes.bool,
  separator: PropTypes.elementType,
  maxItems: PropTypes.number,
  className: PropTypes.string
};

export default Breadcrumbs;