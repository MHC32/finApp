// src/features/budgets/components/EditBudgetModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Calendar, 
  Target, 
  DollarSign,
  FileText,
  Save,
  Copy,
  Archive,
  RefreshCw
} from 'lucide-react';

// Composants réutilisables
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormDatePicker from '../../../components/forms/FormDatePicker';
import Alert from '../../../components/ui/Alert';
import BudgetProgress from './BudgetProgress';

// Utilitaires
import { BUDGET_PERIODS } from '../../../utils/constants';

/**
 * Modal d'édition de budget existant
 */
const EditBudgetModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  onDuplicate = () => {},
  onArchive = () => {},
  budget = null,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    period: 'monthly',
    startDate: '',
    endDate: '',
    currency: 'HTG',
    categories: {},
    alertSettings: {
      warningThreshold: 80,
      criticalThreshold: 95
    },
    allowOverspending: false,
    notes: ''
  });

  const [activeTab, setActiveTab] = useState('general');

  // Initialiser les données du formulaire quand le budget change
  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name || '',
        period: budget.period || 'monthly',
        startDate: budget.startDate || '',
        endDate: budget.endDate || '',
        currency: budget.currency || 'HTG',
        categories: budget.categories || {},
        alertSettings: budget.alertSettings || {
          warningThreshold: 80,
          criticalThreshold: 95
        },
        allowOverspending: budget.allowOverspending || false,
        notes: budget.notes || ''
      });
    }
  }, [budget]);

  // Gérer changement formulaire
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gérer changement catégorie
  const handleCategoryChange = (categoryId, amount) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: amount
      }
    }));
  };

  // Soumettre les modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      _id: budget._id
    });
  };

  // Dupliquer le budget
  const handleDuplicate = () => {
    onDuplicate({
      ...formData,
      name: `${formData.name} - Copie`
    });
  };

  // Archiver le budget
  const handleArchive = () => {
    onArchive(budget._id);
  };

  // Calculer le total budgeté
  const totalBudgeted = Object.values(formData.categories || {}).reduce(
    (sum, amount) => sum + (amount || 0), 0
  );

  // Calculer le total dépensé
  const totalSpent = budget?.totalSpent || 0;

  if (!budget) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={`Modifier le budget - ${budget.name}`}
      variant="glass"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête avec statut et progression */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {budget.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {budget.status === 'active' ? 'Actif' : 
                 budget.status === 'completed' ? 'Terminé' : 
                 budget.status === 'exceeded' ? 'Dépassé' : 'En pause'}
                {budget.isArchived && ' • Archivé'}
              </p>
            </div>
            
            <BudgetProgress.Compact
              budgeted={totalBudgeted}
              spent={totalSpent}
              currency={formData.currency}
              alertSettings={formData.alertSettings}
            />
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'general', label: 'Général', icon: FileText },
              { id: 'categories', label: 'Catégories', icon: Target },
              { id: 'alerts', label: 'Alertes', icon: RefreshCw }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Onglet Général */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Informations générales"
              description="Modifiez les informations de base de votre budget"
            />

            {/* Nom */}
            <FormInput
              label="Nom du budget"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ex: Budget Mensuel Famille"
              required
              leftIcon={Target}
            />

            {/* Période et Devise */}
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Période"
                options={Object.values(BUDGET_PERIODS).map(period => ({
                  value: period.code,
                  label: period.name
                }))}
                value={formData.period}
                onChange={(value) => handleInputChange('period', value)}
                required
                icon={Calendar}
              />

              <FormSelect
                label="Devise"
                options={[
                  { value: 'HTG', label: 'Gourdes (HTG)' },
                  { value: 'USD', label: 'Dollars (USD)' }
                ]}
                value={formData.currency}
                onChange={(value) => handleInputChange('currency', value)}
                required
                icon={DollarSign}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormDatePicker
                label="Date de début"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />

              <FormDatePicker
                label="Date de fin"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate}
                required
              />
            </div>

            {/* Notes */}
            <FormInput
              label="Notes (optionnel)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ajoutez des notes ou des objectifs pour ce budget..."
              multiline
              rows={3}
            />
          </div>
        )}

        {/* Onglet Catégories */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Gestion des catégories"
              description="Ajustez les montants alloués à chaque catégorie"
            />

            {/* Éditeur de catégories */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(formData.categories || {}).map(([categoryId, amount]) => {
                const categorySpent = budget.categorySpent?.[categoryId] || 0;
                const spentPercentage = amount > 0 ? Math.round((categorySpent / amount) * 100) : 0;

                return (
                  <div key={categoryId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {categoryId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {categorySpent} {formData.currency} dépensés ({spentPercentage}%)
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => handleCategoryChange(categoryId, Number(e.target.value))}
                        placeholder="0"
                        size="sm"
                        className="w-32"
                        leftIcon={DollarSign}
                        min="0"
                      />
                    </div>

                    {/* Barre de progression de la catégorie */}
                    <BudgetProgress.Compact
                      budgeted={amount}
                      spent={categorySpent}
                      currency={formData.currency}
                      showDetails={false}
                      showAlerts={false}
                    />
                  </div>
                );
              })}
            </div>

            {/* Résumé des catégories */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-teal-800 dark:text-teal-300 mb-1">
                  Total budgeté
                </div>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                  {totalBudgeted} {formData.currency}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-teal-800 dark:text-teal-300 mb-1">
                  Total dépensé
                </div>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                  {totalSpent} {formData.currency}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-teal-800 dark:text-teal-300 mb-1">
                  Restant
                </div>
                <div className={`text-lg font-bold ${
                  totalBudgeted - totalSpent >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {totalBudgeted - totalSpent} {formData.currency}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Alertes */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Paramètres d'alerte"
              description="Configurez les notifications pour votre budget"
            />

            {/* Seuils d'alerte */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Seuil d'avertissement (%)"
                type="number"
                value={formData.alertSettings.warningThreshold}
                onChange={(e) => handleInputChange('alertSettings', {
                  ...formData.alertSettings,
                  warningThreshold: Number(e.target.value)
                })}
                min="50"
                max="95"
                helperText="Alerte quand le budget atteint ce pourcentage"
              />

              <FormInput
                label="Seuil critique (%)"
                type="number"
                value={formData.alertSettings.criticalThreshold}
                onChange={(e) => handleInputChange('alertSettings', {
                  ...formData.alertSettings,
                  criticalThreshold: Number(e.target.value)
                })}
                min="60"
                max="100"
                helperText="Alerte urgente à ce pourcentage"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowOverspending}
                  onChange={(e) => handleInputChange('allowOverspending', e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Autoriser le dépassement de budget
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Permettre les transactions même si le budget est dépassé
                  </div>
                </div>
              </label>
            </div>

            {/* Aperçu des alertes */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Aperçu des alertes
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Avertissement à {formData.alertSettings.warningThreshold}% du budget
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Alerte critique à {formData.alertSettings.criticalThreshold}% du budget
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {/* Actions secondaires */}
              <Button
                type="button"
                variant="outline"
                onClick={handleDuplicate}
                leftIcon={Copy}
                disabled={loading}
                size="sm"
              >
                Dupliquer
              </Button>

              {!budget.isArchived && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleArchive}
                  leftIcon={Archive}
                  disabled={loading}
                  size="sm"
                >
                  Archiver
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </Button>

              <Button
                type="submit"
                isLoading={loading}
                leftIcon={Save}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

EditBudgetModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onDuplicate: PropTypes.func,
  onArchive: PropTypes.func,
  budget: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    categories: PropTypes.object.isRequired,
    totalSpent: PropTypes.number,
    categorySpent: PropTypes.object,
    status: PropTypes.string,
    isArchived: PropTypes.bool,
    alertSettings: PropTypes.object,
    allowOverspending: PropTypes.bool,
    notes: PropTypes.string
  }),
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default EditBudgetModal;