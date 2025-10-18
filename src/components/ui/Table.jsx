import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ArrowUp, ArrowDown, ChevronsUpDown, MoreVertical } from 'lucide-react';
import Checkbox from './Checkbox';

/**
 * Composant Table - Tableau de données
 * 
 * Features:
 * - Tri par colonne
 * - Sélection multiple (checkbox)
 * - Actions par ligne
 * - Colonnes personnalisables
 * - États (loading, empty)
 * - Responsive
 * - Support Light/Dark
 * 
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Nom', sortable: true },
 *     { key: 'amount', label: 'Montant', sortable: true }
 *   ]}
 *   data={transactions}
 *   onSort={handleSort}
 *   selectable
 *   onSelectionChange={handleSelection}
 * />
 */
const Table = forwardRef(({
  // Données
  columns = [],
  data = [],
  
  // Tri
  sortable = false,
  sortColumn = null,
  sortDirection = 'asc',
  onSort = () => {},
  
  // Sélection
  selectable = false,
  selectedRows = [],
  onSelectionChange = () => {},
  
  // Actions
  actions = null,
  
  // États
  loading = false,
  emptyText = 'Aucune donnée',
  
  // Style
  variant = 'default',
  striped = false,
  hoverable = true,
  compact = false,
  className = ''
}, ref) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  // Gérer le tri
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column || !column.sortable) return;

    let newDirection = 'asc';
    if (sortColumn === columnKey) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    onSort(columnKey, newDirection);
  };

  // Gérer sélection d'une ligne
  const handleRowSelect = (rowIndex, checked) => {
    let newSelection = [...selectedRows];
    
    if (checked) {
      if (!newSelection.includes(rowIndex)) {
        newSelection.push(rowIndex);
      }
    } else {
      newSelection = newSelection.filter(idx => idx !== rowIndex);
    }
    
    onSelectionChange(newSelection);
  };

  // Gérer "Tout sélectionner"
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIndexes = data.map((_, index) => index);
      onSelectionChange(allIndexes);
    } else {
      onSelectionChange([]);
    }
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  // Obtenir l'icône de tri
  const getSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      : <ArrowDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
  };

  // Classes de variantes
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    bordered: 'border-2 border-gray-300 dark:border-gray-600',
    card: 'glass-card'
  };

  return (
    <div ref={ref} className={`${variantClasses[variant]} rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {/* Checkbox colonne */}
              {selectable && (
                <th className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} w-12`}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                    size="sm"
                  />
                </th>
              )}

              {/* Colonnes */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                    text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider
                    ${column.sortable && sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700/50' : ''}
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}
                  `}
                  onClick={() => column.sortable && sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}

              {/* Colonne Actions */}
              {actions && (
                <th className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} w-16 text-center`}>
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-500 border-t-transparent" />
                    <span>Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    {emptyText}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/30' : ''}
                    ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                    ${selectedRows.includes(rowIndex) ? 'bg-teal-50 dark:bg-teal-900/20' : ''}
                    transition-colors duration-150
                  `}
                >
                  {/* Checkbox */}
                  {selectable && (
                    <td className={`${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onChange={(checked) => handleRowSelect(rowIndex, checked)}
                        size="sm"
                      />
                    </td>
                  )}

                  {/* Données */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                        text-sm text-gray-900 dark:text-gray-100
                        ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}
                      `}
                    >
                      {column.render 
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]
                      }
                    </td>
                  ))}

                  {/* Actions */}
                  {actions && (
                    <td className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} text-center`}>
                      <button
                        className={`
                          p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700
                          text-gray-600 dark:text-gray-400
                          transition-colors
                          ${hoveredRow === rowIndex ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                        `}
                        onClick={() => actions(row, rowIndex)}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      {!loading && data.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {selectable && selectedRows.length > 0 ? (
                <span className="font-medium text-teal-600 dark:text-teal-400">
                  {selectedRows.length} ligne(s) sélectionnée(s)
                </span>
              ) : (
                <span>
                  Total : <span className="font-medium">{data.length}</span> ligne(s)
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  // Données
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      width: PropTypes.string,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  
  // Tri
  sortable: PropTypes.bool,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  
  // Sélection
  selectable: PropTypes.bool,
  selectedRows: PropTypes.array,
  onSelectionChange: PropTypes.func,
  
  // Actions
  actions: PropTypes.func,
  
  // États
  loading: PropTypes.bool,
  emptyText: PropTypes.string,
  
  // Style
  variant: PropTypes.oneOf(['default', 'bordered', 'card']),
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string
};

export default Table;