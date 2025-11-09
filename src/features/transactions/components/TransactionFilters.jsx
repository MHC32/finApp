import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Filter, 
  Search, 
  Calendar,
  X,
  Download,
  Upload
} from 'lucide-react';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES, HAITI_BANKS } from '../../../utils/constants';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormDatePicker from '../../forms/FormDatePicker';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

/**
 * Composant TransactionFilters - Filtres et recherche pour les transactions
 * 
 * @example
 * <TransactionFilters
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   onExport={handleExport}
 *   onImport={handleImport}
 * />
 */
const TransactionFilters = ({ 
  filters = {},
  onFiltersChange,
  onExport,
  onImport,
  accounts = [],
  className = '' 
}) => {
  const { mode } = useSelector((state) => state.theme);
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Synchroniser les filtres locaux avec les props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const isDark = mode === 'dark';

  // Options pour les selects
  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: TRANSACTION_TYPES.INCOME, label: 'Revenus' },
    { value: TRANSACTION_TYPES.EXPENSE, label: 'Dépenses' },
    { value: TRANSACTION_TYPES.TRANSFER, label: 'Transferts' }
  ];

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    ...Object.entries(TRANSACTION_CATEGORIES)
      .filter(([key, category]) => category.type === 'both' || category.type === filters.type || !filters.type)
      .map(([key, category]) => ({
        value: key,
        label: category.name
      }))
  ];

  const accountOptions = [
    { value: '', label: 'Tous les comptes' },
    ...accounts.map(account => ({
      value: account._id,
      label: `${account.name} (${HAITI_BANKS[account.bank]?.name || account.bank})`
    }))
  ];

  // Gérer le changement de filtre
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Réinitialiser la pagination quand les filtres changent
    if (key !== 'page' && key !== 'limit') {
      newFilters.page = 1;
    }
    
    onFiltersChange(newFilters);
  };

  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    const resetFilters = {
      page: 1,
      limit: 50,
      search: '',
      type: '',
      category: '',
      account: '',
      startDate: '',
      endDate: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // Compter les filtres actifs
  const activeFiltersCount = Object.keys(localFilters).filter(key => 
    key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' && 
    localFilters[key] && localFilters[key] !== ''
  ).length;

  return (
    <Card variant="glass" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtres
          </h3>
          {activeFiltersCount > 0 && (
            <Badge color="teal" size="sm">
              {activeFiltersCount} actif(s)
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Boutons Import/Export */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={onExport}
            >
              Exporter
            </Button>
          )}
          
          {onImport && (
            <Button
              variant="outline"
              size="sm"
              icon={Upload}
              onClick={onImport}
            >
              Importer
            </Button>
          )}

          {/* Bouton Reset */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={handleResetFilters}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Filtres de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <Input
          placeholder="Rechercher transactions..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          leftIcon={Search}
          size="md"
        />

        {/* Type */}
        <Select
          options={typeOptions}
          value={localFilters.type || ''}
          onChange={(value) => handleFilterChange('type', value)}
          placeholder="Type"
          size="md"
        />

        {/* Catégorie */}
        <Select
          options={categoryOptions}
          value={localFilters.category || ''}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Catégorie"
          size="md"
        />

        {/* Compte */}
        <Select
          options={accountOptions}
          value={localFilters.account || ''}
          onChange={(value) => handleFilterChange('account', value)}
          placeholder="Compte"
          size="md"
        />
      </div>

      {/* Filtres avancés */}
      <div className="space-y-4">
        {/* Toggle filtres avancés */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showAdvanced ? 'Masquer' : 'Afficher'} les filtres avancés
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Période */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Période
              </label>
              <div className="grid grid-cols-2 gap-2">
                <FormDatePicker
                  value={localFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  placeholder="Date de début"
                  size="sm"
                />
                <FormDatePicker
                  value={localFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  placeholder="Date de fin"
                  size="sm"
                />
              </div>
            </div>

            {/* Tri */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trier par
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  options={[
                    { value: 'date', label: 'Date' },
                    { value: 'amount', label: 'Montant' },
                    { value: 'description', label: 'Description' }
                  ]}
                  value={localFilters.sortBy || 'date'}
                  onChange={(value) => handleFilterChange('sortBy', value)}
                  size="sm"
                />
                <Select
                  options={[
                    { value: 'desc', label: 'Décroissant' },
                    { value: 'asc', label: 'Croissant' }
                  ]}
                  value={localFilters.sortOrder || 'desc'}
                  onChange={(value) => handleFilterChange('sortOrder', value)}
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {localFilters.search && (
            <Badge 
              color="blue" 
              removable 
              onRemove={() => handleFilterChange('search', '')}
            >
              Recherche: "{localFilters.search}"
            </Badge>
          )}
          
          {localFilters.type && (
            <Badge 
              color="teal" 
              removable 
              onRemove={() => handleFilterChange('type', '')}
            >
              Type: {typeOptions.find(opt => opt.value === localFilters.type)?.label}
            </Badge>
          )}
          
          {localFilters.category && (
            <Badge 
              color="purple" 
              removable 
              onRemove={() => handleFilterChange('category', '')}
            >
              Catégorie: {TRANSACTION_CATEGORIES[localFilters.category]?.name}
            </Badge>
          )}
          
          {localFilters.account && (
            <Badge 
              color="orange" 
              removable 
              onRemove={() => handleFilterChange('account', '')}
            >
              Compte: {accountOptions.find(opt => opt.value === localFilters.account)?.label}
            </Badge>
          )}
          
          {(localFilters.startDate || localFilters.endDate) && (
            <Badge 
              color="green" 
              removable 
              onRemove={() => {
                handleFilterChange('startDate', '');
                handleFilterChange('endDate', '');
              }}
            >
              Période: {localFilters.startDate || 'Début'} → {localFilters.endDate || 'Fin'}
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};

TransactionFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    account: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
    page: PropTypes.number,
    limit: PropTypes.number
  }),
  onFiltersChange: PropTypes.func.isRequired,
  onExport: PropTypes.func,
  onImport: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired
  })),
  className: PropTypes.string
};

export default TransactionFilters;