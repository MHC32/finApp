import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Composant Pagination - Navigation entre pages
 * 
 * Features:
 * - Navigation page par page
 * - Aller à la première/dernière page
 * - Affichage des numéros de page
 * - Info total items
 * - Sélecteur items par page
 * - Support Light/Dark
 * 
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={95}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 * />
 */
const Pagination = forwardRef(({
  // Pagination
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  
  // Callbacks
  onPageChange = () => {},
  onPageSizeChange = () => {},
  
  // Options
  showFirstLast = true,
  showPageNumbers = true,
  showPageSize = true,
  showInfo = true,
  maxPageNumbers = 7,
  
  // Style
  size = 'md',
  variant = 'default',
  className = ''
}, ref) => {
  // Calculer les pages à afficher
  const getPageNumbers = () => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const leftSide = Math.floor(maxPageNumbers / 2);
    const rightSide = maxPageNumbers - leftSide - 1;

    let startPage = Math.max(currentPage - leftSide, 1);
    let endPage = Math.min(currentPage + rightSide, totalPages);

    if (currentPage <= leftSide) {
      endPage = maxPageNumbers;
    } else if (currentPage >= totalPages - rightSide) {
      startPage = totalPages - maxPageNumbers + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculer les items affichés
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Classes de taille
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  // Classes de variante
  const variantClasses = {
    default: 'border border-gray-300 dark:border-gray-600',
    outlined: 'border-2 border-gray-300 dark:border-gray-600',
    ghost: 'border-0'
  };

  const buttonBaseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    rounded-lg
    font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const pageButtonClasses = (isActive) => `
    ${buttonBaseClasses}
    ${isActive 
      ? 'bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500' 
      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }
  `;

  const navButtonClasses = `
    ${buttonBaseClasses}
    bg-white dark:bg-gray-800
    text-gray-700 dark:text-gray-300
    hover:bg-gray-50 dark:hover:bg-gray-700
    disabled:hover:bg-white dark:disabled:hover:bg-gray-800
  `;

  return (
    <div ref={ref} className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Affichage de <span className="font-medium">{startItem}</span> à{' '}
          <span className="font-medium">{endItem}</span> sur{' '}
          <span className="font-medium">{totalItems}</span> résultat(s)
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {/* Première page */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={navButtonClasses}
            aria-label="Première page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Page précédente */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={navButtonClasses}
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numéros de page */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className={pageButtonClasses(false)}
                >
                  1
                </button>
                {pageNumbers[0] > 2 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
              </>
            )}

            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={pageButtonClasses(page === currentPage)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={pageButtonClasses(false)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        {/* Page suivante */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navButtonClasses}
          aria-label="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dernière page */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={navButtonClasses}
            aria-label="Dernière page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sélecteur items par page */}
      {showPageSize && (
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700 dark:text-gray-300">
            Afficher
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              rounded-lg
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-300
              focus:outline-none focus:ring-2 focus:ring-teal-500/20
              cursor-pointer
            `}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            par page
          </span>
        </div>
      )}
    </div>
  );
});

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  // Pagination
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  
  // Callbacks
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func,
  
  // Options
  showFirstLast: PropTypes.bool,
  showPageNumbers: PropTypes.bool,
  showPageSize: PropTypes.bool,
  showInfo: PropTypes.bool,
  maxPageNumbers: PropTypes.number,
  
  // Style
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'outlined', 'ghost']),
  className: PropTypes.string
};

export default Pagination;