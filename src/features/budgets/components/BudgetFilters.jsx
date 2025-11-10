// src/features/budgets/components/BudgetFilters.jsx
import { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Filter, 
  Search, 
  Calendar,
  RefreshCw,
  Download,
  SlidersHorizontal
} from 'lucide-react';

// Composants réutilisables
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

/**
 * Composant BudgetFilters - Filtres et recherche pour la liste des budgets
 * 
 * Features:
 * - Recherche en temps réel avec debounce
 * - Filtres multiples (statut, période, archivage)
 * - Mode avancé/compact
 * - Actions globales (rafraîchir, exporter)
 * - Reset des filtres
 * - Historique des filtres
 * 
 * @example
 * <BudgetFilters
 *   filters={{
 *     search: '',
 *     status: 'active',
 *     period: 'monthly',
 *     includeArchived: false
 *   }}
 *   onFiltersChange={handleFiltersChange}
 *   onRefresh={handleRefresh}
 *   onExport={handleExport}
 *   loading={false}
 * />
 */
const BudgetFilters = forwardRef(({
  // Filtres actuels
  filters = {
    search: '',
    status: 'active',
    period: '',
    includeArchived: false
  },
  
  // Callbacks
  onFiltersChange = () => {},
  onRefresh = () => {},
  onExport = () => {},
  onReset = () => {},
  
  // États
  loading = false,
  totalCount = 0,
  filteredCount = 0,
  
  // Configuration
  showAdvanced = false,
  defaultAdvanced = false,
  
  className = '',
  ...props
}, ref) => {
  const [isAdvanced, setIsAdvanced] = useState(defaultAdvanced);
  const [localFilters, setLocalFilters] = useState(filters);

  // Synchroniser les filtres locaux avec les props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Mettre à jour les filtres avec debounce
  const updateFilters = (newFilters) => {
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Gérer changement recherche
  const handleSearch = (searchTerm) => {
    updateFilters({ ...localFilters, search: searchTerm });
  };

  // Gérer changement filtre
  const handleFilterChange = (key, value) => {
    updateFilters({ ...localFilters, [key]: value });
  };

  // Reset tous les filtres
  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: 'active',
      period: '',
      includeArchived: false
    };
    setLocalFilters(resetFilters);
    onReset(resetFilters);
  };

  // Options pour les selects
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actifs' },
    { value: 'completed', label: 'Terminés' },
    { value: 'exceeded', label: 'Dépassés' },
    { value: 'paused', label: 'En pause' },
    { value: 'draft', label: 'Brouillons' }
  ];

  const periodOptions = [
    { value: '', label: 'Toutes les périodes' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'quarterly', label: 'Trimestriel' },
    { value: 'yearly', label: 'Annuel' }
  ];

  const sortOptions = [
    { value: '-startDate', label: 'Plus récent' },
    { value: 'startDate', label: 'Plus ancien' },
    { value: 'name', label: 'Nom (A-Z)' },
    { value: '-name', label: 'Nom (Z-A)' },
    { value: '-totalBudgeted', label: 'Budget élevé' },
    { value: 'totalBudgeted', label: 'Budget faible' }
  ];

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = 
    localFilters.search !== '' ||
    localFilters.status !== 'active' ||
    localFilters.period !== '' ||
    localFilters.includeArchived !== false;

  return (
    <Card
      ref={ref}
      variant="glass"
      className={`space-y-4 ${className}`}
      {...props}
    >
      {/* Header avec compteurs et actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Filtres
            </h3>
          </div>
          
          {/* Compteurs */}
          {(totalCount > 0 || filteredCount > 0) && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredCount !== totalCount ? (
                <>
                  <span className="font-medium text-teal-600 dark:text-teal-400">
                    {filteredCount}
                  </span>
                  {' sur '}
                  <span className="font-medium">{totalCount}</span>
                  {' budget(s)'}
                </>
              ) : (
                <span className="font-medium">{totalCount} budget(s)</span>
              )}
            </div>
          )}
        </div>

        {/* Actions globales */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle mode avancé */}
          {showAdvanced && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdvanced(!isAdvanced)}
              leftIcon={SlidersHorizontal}
              className={isAdvanced ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800' : ''}
            >
              {isAdvanced ? 'Simple' : 'Avancé'}
            </Button>
          )}

          {/* Reset filtres */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800"
            >
              Réinitialiser
            </Button>
          )}

          {/* Exporter */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={Download}
            disabled={loading}
          >
            Exporter
          </Button>

          {/* Rafraîchir */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            leftIcon={RefreshCw}
            isLoading={loading}
            disabled={loading}
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="lg:col-span-2">
          <SearchBar
            value={localFilters.search}
            onSearch={handleSearch}
            placeholder="Rechercher un budget..."
            loading={loading}
            size="md"
            fullWidth
          />
        </div>

        {/* Statut */}
        <Select
          options={statusOptions}
          value={localFilters.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Statut"
          size="md"
          clearable={false}
        />

        {/* Période */}
        <Select
          options={periodOptions}
          value={localFilters.period}
          onChange={(value) => handleFilterChange('period', value)}
          placeholder="Période"
          size="md"
          clearable={true}
          icon={Calendar}
        />
      </div>

      {/* Filtres avancés */}
      {isAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Tri */}
          <Select
            options={sortOptions}
            value={localFilters.sortBy || '-startDate'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            placeholder="Trier par"
            size="md"
            clearable={false}
          />

          {/* Archives */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <input
              type="checkbox"
              id="includeArchived"
              checked={localFilters.includeArchived}
              onChange={(e) => handleFilterChange('includeArchived', e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <label 
              htmlFor="includeArchived"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Inclure les archives
            </label>
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              À partir du
            </label>
            <input
              type="date"
              value={localFilters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jusqu'au
            </label>
            <input
              type="date"
              value={localFilters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      )}

      {/* Tags filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Filtres actifs:
          </span>
          
          {localFilters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded text-xs">
              Recherche: "{localFilters.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-1 hover:text-teal-600"
              >
                ×
              </button>
            </span>
          )}
          
          {localFilters.status && localFilters.status !== 'active' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
              Statut: {statusOptions.find(opt => opt.value === localFilters.status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'active')}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          
          {localFilters.period && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs">
              Période: {periodOptions.find(opt => opt.value === localFilters.period)?.label}
              <button
                onClick={() => handleFilterChange('period', '')}
                className="ml-1 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
          
          {localFilters.includeArchived && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded text-xs">
              Archives incluses
              <button
                onClick={() => handleFilterChange('includeArchived', false)}
                className="ml-1 hover:text-orange-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </Card>
  );
});

BudgetFilters.displayName = 'BudgetFilters';

BudgetFilters.propTypes = {
  /** Filtres actuels */
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.oneOf(['all', 'active', 'completed', 'exceeded', 'paused', 'draft']),
    period: PropTypes.oneOf(['', 'weekly', 'monthly', 'quarterly', 'yearly']),
    includeArchived: PropTypes.bool,
    sortBy: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  
  /** Callback changement filtres */
  onFiltersChange: PropTypes.func,
  
  /** Callback rafraîchissement */
  onRefresh: PropTypes.func,
  
  /** Callback export */
  onExport: PropTypes.func,
  
  /** Callback reset */
  onReset: PropTypes.func,
  
  /** État de chargement */
  loading: PropTypes.bool,
  
  /** Nombre total de budgets */
  totalCount: PropTypes.number,
  
  /** Nombre de budgets filtrés */
  filteredCount: PropTypes.number,
  
  /** Afficher le toggle mode avancé */
  showAdvanced: PropTypes.bool,
  
  /** Mode avancé par défaut */
  defaultAdvanced: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default BudgetFilters;