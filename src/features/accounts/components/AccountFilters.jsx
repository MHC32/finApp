// src/features/accounts/components/AccountFilters.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Filter, X } from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Switch from '../../../components/ui/Switch';
import Badge from '../../../components/ui/Badge';

/**
 * Composant de filtrage pour les comptes bancaires
 * Avec recherche, filtres par type/devise/banque, et états
 */
const AccountFilters = ({ onFiltersChange, className = '' }) => {
  const { supportedData, filterAccounts } = useAccount();
  
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    currency: '',
    bankName: '',
    activeOnly: true,
    includeArchived: false,
    includeInactive: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // DEBUG: Log des données supportées
  useEffect(() => {
    console.log('🔍 AccountFilters - supportedData:', supportedData);
    console.log('🔍 AccountFilters - banks:', supportedData.banks);
    console.log('🔍 AccountFilters - accountTypes:', supportedData.accountTypes);
    console.log('🔍 AccountFilters - currencies:', supportedData.currencies);
  }, [supportedData]);

  // Compter les filtres actifs
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === 'search') return value !== '';
      if (key === 'activeOnly') return !value; // Inversé car activeOnly=true est l'état par défaut
      if (key === 'includeArchived' || key === 'includeInactive') return value;
      return value !== '';
    }).length;
    
    setActiveFilterCount(count);
  }, [filters]);

  // Appliquer les filtres
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: '',
      currency: '',
      bankName: '',
      activeOnly: true,
      includeArchived: false,
      includeInactive: false
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // Options pour les selects
  const typeOptions = supportedData.accountTypes.map(type => ({
    value: type.id, 
    label: type.name
  }));

  const currencyOptions = supportedData.currencies.map(currency => ({
    value: currency.code,
    label: `${currency.name} (${currency.symbol})`
  }));

  const bankOptions = supportedData.banks.map(bank => ({
    value: bank.id,
    label: bank.name
  }));

  // DEBUG: Log des options
  console.log('🔍 AccountFilters - bankOptions:', bankOptions);
  console.log('🔍 AccountFilters - typeOptions:', typeOptions);
  console.log('🔍 AccountFilters - currencyOptions:', currencyOptions);

  return (
    <Card variant="glass" className={className}>
      <div className="space-y-4">
        {/* En-tête avec compteur de filtres */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Filtres
            </h3>
            {activeFilterCount > 0 && (
              <Badge color="teal" size="sm">
                {activeFilterCount} actif(s)
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                Réinitialiser
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Basique' : 'Avancé'}
            </Button>
          </div>
        </div>

        {/* Filtres de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <Input
            leftIcon={Search}
            placeholder="Rechercher un compte..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="sm"
          />

          {/* Type de compte */}
          <Select
            options={[{ value: '', label: 'Tous les types' }, ...typeOptions]}
            value={filters.type}
            onChange={handleFilterChange.bind(null, 'type')}
            placeholder="Type de compte"
            size="sm"
          />

          {/* Devise */}
          <Select
            options={[{ value: '', label: 'Toutes devises' }, ...currencyOptions]}
            value={filters.currency}
            onChange={handleFilterChange.bind(null, 'currency')}
            placeholder="Devise"
            size="sm"
          />

          {/* Banque */}
          <Select
            options={[{ value: '', label: 'Toutes banques' }, ...bankOptions]}
            value={filters.bankName}
            onChange={handleFilterChange.bind(null, 'bankName')}
            placeholder="Banque"
            size="sm"
          />
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Switch
              checked={filters.activeOnly}
              onChange={(checked) => handleFilterChange('activeOnly', checked)}
              label="Comptes actifs seulement"
              size="sm"
            />

            <Switch
              checked={filters.includeInactive}
              onChange={(checked) => handleFilterChange('includeInactive', checked)}
              label="Inclure comptes inactifs"
              size="sm"
            />

            <Switch
              checked={filters.includeArchived}
              onChange={(checked) => handleFilterChange('includeArchived', checked)}
              label="Inclure comptes archivés"
              size="sm"
            />
          </div>
        )}

        {/* Résumé des filtres actifs */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.search && (
              <Badge variant="subtle" color="blue" removable onRemove={() => handleFilterChange('search', '')}>
                Recherche: "{filters.search}"
              </Badge>
            )}
            
            {filters.type && (
              <Badge variant="subtle" color="teal" removable onRemove={() => handleFilterChange('type', '')}>
                Type: {typeOptions.find(t => t.value === filters.type)?.label}
              </Badge>
            )}
            
            {filters.currency && (
              <Badge variant="subtle" color="green" removable onRemove={() => handleFilterChange('currency', '')}>
                Devise: {filters.currency}
              </Badge>
            )}
            
            {filters.bankName && (
              <Badge variant="subtle" color="purple" removable onRemove={() => handleFilterChange('bankName', '')}>
                Banque: {bankOptions.find(b => b.value === filters.bankName)?.label}
              </Badge>
            )}
            
            {!filters.activeOnly && (
              <Badge variant="subtle" color="orange" removable onRemove={() => handleFilterChange('activeOnly', true)}>
                Inclure inactifs
              </Badge>
            )}
            
            {filters.includeArchived && (
              <Badge variant="subtle" color="gray" removable onRemove={() => handleFilterChange('includeArchived', false)}>
                Inclure archivés
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

AccountFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default AccountFilters;