// src/features/sols/components/SolFilters.jsx
import { forwardRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Switch from '../../../components/ui/Switch';

/**
 * Composant SolFilters - Filtres et recherche pour les sols/tontines
 * 
 * Features:
 * - Recherche en temps réel
 * - Filtres multiples (statut, type, montant, etc.)
 * - Mode compact/étendu
 * - Badges filtres actifs
 * - Reset facile
 * - Responsive design
 * - Support Light/Dark
 * 
 * @example
 * <SolFilters
 *   filters={activeFilters}
 *   onFiltersChange={handleFiltersChange}
 *   searchQuery={searchQuery}
 *   onSearchChange={handleSearchChange}
 *   supportedData={supportedData}
 * />
 */
const SolFilters = forwardRef(({
  // Filtres actifs
  filters = {},
  onFiltersChange = () => {},
  
  // Recherche
  searchQuery = '',
  onSearchChange = () => {},
  
  // Données supportées
  supportedData = {},
  
  // Options d'affichage
  defaultExpanded = false,
  showResultCount = true,
  className = ''
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Données supportées avec fallback
  const {
    solTypes = [
      { value: 'classic', label: 'Sol Classique' },
      { value: 'business', label: 'Sol Business' },
      { value: 'emergency', label: 'Sol Urgence' },
      { value: 'project', label: 'Sol Projet' },
      { value: 'savings', label: 'Sol Épargne' }
    ],
    frequencies = [
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'biweekly', label: 'Bi-hebdomadaire' },
      { value: 'monthly', label: 'Mensuel' },
      { value: 'quarterly', label: 'Trimestriel' }
    ]
  } = supportedData;

  // Options de statut
  const statusOptions = [
    { value: 'recruiting', label: 'En recrutement' },
    { value: 'active', label: 'Actif' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  // Options de tri
  const sortOptions = [
    { value: 'name_asc', label: 'Nom (A-Z)' },
    { value: 'name_desc', label: 'Nom (Z-A)' },
    { value: 'contribution_asc', label: 'Contribution (Croissant)' },
    { value: 'contribution_desc', label: 'Contribution (Décroissant)' },
    { value: 'participants_asc', label: 'Participants (Croissant)' },
    { value: 'participants_desc', label: 'Participants (Décroissant)' },
    { value: 'created_desc', label: 'Récent' },
    { value: 'created_asc', label: 'Ancien' }
  ];

  // Options de plage de montant
  const amountRanges = [
    { value: '0-1000', label: 'Moins de 1,000 HTG' },
    { value: '1000-5000', label: '1,000 - 5,000 HTG' },
    { value: '5000-10000', label: '5,000 - 10,000 HTG' },
    { value: '10000-20000', label: '10,000 - 20,000 HTG' },
    { value: '20000+', label: 'Plus de 20,000 HTG' }
  ];

  // Compter les filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    if (filters.status && filters.status.length > 0) count++;
    if (filters.type && filters.type.length > 0) count++;
    if (filters.frequency && filters.frequency.length > 0) count++;
    if (filters.amountRange) count++;
    if (filters.participantsRange) count++;
    if (filters.sortBy) count++;
    if (filters.showOnlyMySols) count++;
    if (filters.showOnlyActive) count++;
    
    return count;
  }, [filters]);

  // Gestion de la recherche avec debounce
  const handleSearchChange = (value) => {
    setLocalSearch(value);
    onSearchChange(value);
  };

  // Gestion des changements de filtres
  const handleFilterChange = (filterName, value) => {
    onFiltersChange({
      ...filters,
      [filterName]: value
    });
  };

  // Reset d'un filtre spécifique
  const handleResetFilter = (filterName) => {
    const newFilters = { ...filters };
    delete newFilters[filterName];
    onFiltersChange(newFilters);
  };

  // Reset tous les filtres
  const handleResetAll = () => {
    setLocalSearch('');
    onSearchChange('');
    onFiltersChange({});
  };

  // Obtenir le label d'un filtre pour le badge
  const getFilterLabel = (filterName, value) => {
    switch (filterName) {
      case 'status':
        return statusOptions.find(opt => opt.value === value[0])?.label || 'Statut';
      
      case 'type':
        return solTypes.find(opt => opt.value === value[0])?.label || 'Type';
      
      case 'frequency':
        return frequencies.find(opt => opt.value === value[0])?.label || 'Fréquence';
      
      case 'amountRange':
        return amountRanges.find(opt => opt.value === value)?.label || 'Montant';
      
      case 'sortBy':
        return sortOptions.find(opt => opt.value === value)?.label || 'Tri';
      
      case 'showOnlyMySols':
        return 'Mes sols seulement';
      
      case 'showOnlyActive':
        return 'Actifs seulement';
      
      default:
        return filterName;
    }
  };

  return (
    <Card
      ref={ref}
      variant="glass"
      className={`space-y-4 ${className}`}
    >
      {/* Header - Recherche et toggle filtres */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Recherche */}
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            placeholder="Rechercher un sol par nom, description..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftIcon={Search}
            rightIcon={localSearch ? X : undefined}
            onRightIconClick={() => handleSearchChange('')}
            size="md"
          />
        </div>

        {/* Contrôles droite */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Compteur résultats */}
          {showResultCount && filters.resultCount !== undefined && (
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {filters.resultCount} résultat{filters.resultCount !== 1 ? 's' : ''}
            </div>
          )}

          {/* Badge filtres actifs */}
          {activeFiltersCount > 0 && (
            <Badge color="teal" size="sm">
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}

          {/* Bouton filtres */}
          <Button
            variant={isExpanded ? "primary" : "outline"}
            size="sm"
            leftIcon={isExpanded ? X : SlidersHorizontal}
            onClick={() => setIsExpanded(!isExpanded)}
            className="whitespace-nowrap"
          >
            {isExpanded ? 'Masquer' : 'Filtres'}
          </Button>

          {/* Reset tous */}
          {(activeFiltersCount > 0 || localSearch) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              className="text-gray-500 hover:text-red-500"
            >
              Tout effacer
            </Button>
          )}
        </div>
      </div>

      {/* Badges filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || key === 'resultCount') return null;
            
            return (
              <Badge
                key={key}
                color="teal"
                variant="subtle"
                removable
                onRemove={() => handleResetFilter(key)}
                className="animate-fadeIn"
              >
                {getFilterLabel(key, value)}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Filtres étendus */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <Select
              options={statusOptions}
              value={filters.status?.[0] || ''}
              onChange={(value) => handleFilterChange('status', value ? [value] : [])}
              placeholder="Tous les statuts"
              clearable
              searchable={false}
              size="sm"
            />
          </div>

          {/* Type de sol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <Select
              options={solTypes}
              value={filters.type?.[0] || ''}
              onChange={(value) => handleFilterChange('type', value ? [value] : [])}
              placeholder="Tous les types"
              clearable
              searchable={false}
              size="sm"
            />
          </div>

          {/* Fréquence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fréquence
            </label>
            <Select
              options={frequencies}
              value={filters.frequency?.[0] || ''}
              onChange={(value) => handleFilterChange('frequency', value ? [value] : [])}
              placeholder="Toutes fréquences"
              clearable
              searchable={false}
              size="sm"
            />
          </div>

          {/* Plage de montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contribution
            </label>
            <Select
              options={amountRanges}
              value={filters.amountRange || ''}
              onChange={(value) => handleFilterChange('amountRange', value)}
              placeholder="Tous montants"
              clearable
              searchable={false}
              size="sm"
            />
          </div>

          {/* Tri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trier par
            </label>
            <Select
              options={sortOptions}
              value={filters.sortBy || 'created_desc'}
              onChange={(value) => handleFilterChange('sortBy', value)}
              size="sm"
            />
          </div>

          {/* Filtres booléens */}
          <div className="space-y-3">
            <Switch
              checked={filters.showOnlyMySols || false}
              onChange={(checked) => handleFilterChange('showOnlyMySols', checked)}
              label="Mes sols seulement"
              size="sm"
            />
            
            <Switch
              checked={filters.showOnlyActive || false}
              onChange={(checked) => handleFilterChange('showOnlyActive', checked)}
              label="Actifs seulement"
              size="sm"
            />
          </div>

          {/* Actions rapides */}
          <div className="flex items-end">
            <div className="space-y-2 w-full">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => handleFilterChange('status', ['active'])}
                leftIcon={Users}
              >
                Sols actifs
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => handleFilterChange('status', ['recruiting'])}
                leftIcon={DollarSign}
              >
                En recrutement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mode mobile - Bouton filtres simple */}
      {!isExpanded && activeFiltersCount === 0 && (
        <div className="flex sm:hidden justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            rightIcon={ChevronDown}
            className="text-gray-500"
          >
            Plus de filtres
          </Button>
        </div>
      )}
    </Card>
  );
});

SolFilters.displayName = 'SolFilters';

SolFilters.propTypes = {
  /** Filtres actifs */
  filters: PropTypes.shape({
    status: PropTypes.array,
    type: PropTypes.array,
    frequency: PropTypes.array,
    amountRange: PropTypes.string,
    participantsRange: PropTypes.string,
    sortBy: PropTypes.string,
    showOnlyMySols: PropTypes.bool,
    showOnlyActive: PropTypes.bool,
    resultCount: PropTypes.number
  }),
  
  /** Callback changement de filtres */
  onFiltersChange: PropTypes.func,
  
  /** Requête de recherche */
  searchQuery: PropTypes.string,
  
  /** Callback changement recherche */
  onSearchChange: PropTypes.func,
  
  /** Données supportées */
  supportedData: PropTypes.shape({
    solTypes: PropTypes.array,
    frequencies: PropTypes.array
  }),
  
  /** Filtres étendus par défaut */
  defaultExpanded: PropTypes.bool,
  
  /** Afficher le compteur de résultats */
  showResultCount: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default SolFilters;