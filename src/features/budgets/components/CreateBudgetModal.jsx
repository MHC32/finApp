// src/features/budgets/components/CreateBudgetModal.jsx
import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Calendar, 
  Target, 
  DollarSign,
  Users,
  FileText,
  Plus,
  Trash2,
  Edit3
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
import Badge from '../../../components/ui/Badge';

// Utilitaires
import { BUDGET_TEMPLATES, BUDGET_PERIODS, TRANSACTION_CATEGORIES } from '../../../utils/constants';

/**
 * Modal de création de budget avec templates
 */
const CreateBudgetModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  loading = false,
  className = ''
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Base
    name: '',
    description: '',
    period: 'monthly',
    startDate: '',
    endDate: '',
    currency: 'HTG',
    template: '',
    expectedIncome: 0, // ✅ AJOUTÉ - requis par l'API
    
    // Étape 2: Catégories
    categories: {},
    customCategories: [],
    
    // Étape 3: Paramètres
    alertSettings: {
      warningThreshold: 80,
      criticalThreshold: 95
    },
    allowOverspending: false,
    notes: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    amount: '',
    type: 'expense'
  });

  // Templates disponibles
  const templateOptions = [
    { value: '', label: 'Créer personnalisé' },
    ...Object.entries(BUDGET_TEMPLATES).map(([id, template]) => ({
      value: id,
      label: template.name,
      description: template.description
    }))
  ];

  // Périodes
  const periodOptions = Object.values(BUDGET_PERIODS).map(period => ({
    value: period.code,
    label: period.name
  }));

  // Catégories prédéfinies
  const predefinedCategories = Object.entries(TRANSACTION_CATEGORIES).map(([key, category]) => ({
    value: key,
    label: category.name,
    color: category.color
  }));

  // Gérer changement formulaire
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Appliquer template
  const handleTemplateChange = (templateId) => {
    if (!templateId) {
      // Reset si template vide
      setFormData(prev => ({
        ...prev,
        template: '',
        categories: {},
        customCategories: [],
        expectedIncome: 0
      }));
      return;
    }

    const template = BUDGET_TEMPLATES[templateId];
    if (template) {
      const totalBudgeted = Object.values(template.categories).reduce((sum, amount) => sum + amount, 0);
      
      setFormData(prev => ({
        ...prev,
        template: templateId,
        name: `${template.name} ${new Date().getFullYear()}`,
        description: template.description,
        categories: { ...template.categories },
        expectedIncome: totalBudgeted, // ✅ Définir les revenus attendus
        customCategories: []
      }));
    }
  };

  // Gérer changement catégorie prédéfinie
  const handleCategoryChange = (categoryId, amount) => {
    const numericAmount = Number(amount) || 0;
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: numericAmount
      }
    }));
  };

  // Ajouter une catégorie personnalisée
  const handleAddCustomCategory = () => {
    if (!newCategory.name || !newCategory.amount) return;

    const categoryKey = newCategory.name.toLowerCase().replace(/\s+/g, '_');
    const numericAmount = Number(newCategory.amount) || 0;
    
    setFormData(prev => ({
      ...prev,
      customCategories: [
        ...prev.customCategories,
        {
          id: categoryKey,
          name: newCategory.name,
          amount: numericAmount,
          type: newCategory.type,
          isCustom: true
        }
      ]
    }));

    // Reset le formulaire
    setNewCategory({
      name: '',
      amount: '',
      type: 'expense'
    });
  };

  // Supprimer une catégorie personnalisée
  const handleRemoveCustomCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      customCategories: prev.customCategories.filter(cat => cat.id !== categoryId)
    }));
  };

  // Calculer le total budgeté
  const totalBudgeted = useMemo(() => {
    const predefinedTotal = Object.values(formData.categories).reduce((sum, amount) => sum + (amount || 0), 0);
    const customTotal = formData.customCategories.reduce((sum, cat) => sum + (cat.amount || 0), 0);
    return predefinedTotal + customTotal;
  }, [formData.categories, formData.customCategories]);

  // Préparer les données pour l'API
  const prepareDataForAPI = () => {
    // Transformer les catégories au format attendu par l'API
    const categoriesArray = [];

    // Catégories prédéfinies
    Object.entries(formData.categories).forEach(([categoryId, amount]) => {
      if (amount > 0) {
        categoriesArray.push({
          category: categoryId,
          budgetedAmount: Number(amount),
          spentAmount: 0, // Initialiser à 0
          isActive: true
        });
      }
    });

    // Catégories personnalisées
    formData.customCategories.forEach(cat => {
      if (cat.amount > 0) {
        categoriesArray.push({
          category: cat.id,
          budgetedAmount: cat.amount,
          spentAmount: 0,
          isActive: true,
          isCustom: true,
          customName: cat.name
        });
      }
    });

    return {
      name: formData.name,
      description: formData.description || `Budget ${formData.period} créé le ${new Date().toLocaleDateString()}`,
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      currency: formData.currency,
      expectedIncome: Math.max(totalBudgeted, formData.expectedIncome || totalBudgeted), // ✅ S'assurer que c'est > 100
      categories: categoriesArray, // ✅ Format tableau d'objets
      alertSettings: formData.alertSettings,
      allowOverspending: formData.allowOverspending,
      notes: formData.notes,
      totalBudgeted: totalBudgeted
    };
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const apiData = prepareDataForAPI();
    
    // Validation finale
    if (apiData.expectedIncome < 100) {
      alert('Les revenus attendus doivent être supérieurs à 100');
      return;
    }

    if (apiData.categories.length === 0) {
      alert('Au moins une catégorie est requise');
      return;
    }

    onSubmit(apiData);
  };

  // Valider étape actuelle
  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.name && formData.period && formData.startDate && formData.endDate;
      case 2:
        return totalBudgeted > 0;
      default:
        return true;
    }
  };

  const canProceed = validateStep();

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        name: '',
        description: '',
        period: 'monthly',
        startDate: '',
        endDate: '',
        currency: 'HTG',
        template: '',
        expectedIncome: 0,
        categories: {},
        customCategories: [],
        alertSettings: {
          warningThreshold: 80,
          criticalThreshold: 95
        },
        allowOverspending: false,
        notes: ''
      });
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Créer un budget ${step > 1 ? `- Étape ${step}/3` : ''}`}
      variant="glass"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Indicateur de progression */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= stepNum 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`w-12 h-1 mx-2
                    ${step > stepNum 
                      ? 'bg-teal-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Configuration de base */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Configuration de base"
              description="Définissez le nom, la période et la durée de votre budget"
            />

            {/* Template */}
            <FormSelect
              label="Modèle de budget"
              options={templateOptions}
              value={formData.template}
              onChange={(value) => handleTemplateChange(value)}
              placeholder="Choisir un modèle..."
              helperText="Utilisez un modèle prédéfini ou créez un budget personnalisé"
              icon={FileText}
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

            {/* Description */}
            <FormInput
              label="Description (optionnel)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de votre budget..."
              multiline
              rows={2}
            />

            {/* Revenus attendus */}
            <FormInput
              label="Revenus attendus"
              type="number"
              value={formData.expectedIncome}
              onChange={(e) => handleInputChange('expectedIncome', Math.max(100, Number(e.target.value)))}
              placeholder="50000"
              required
              min="100"
              helperText="Doit être supérieur à 100"
              leftIcon={DollarSign}
            />

            {/* Période et Devise */}
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Période"
                options={periodOptions}
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
          </div>
        )}

        {/* Le reste du code reste inchangé... */}
        {/* [Étape 2 et Étape 3 identiques au code précédent] */}

        {/* Étape 2: Catégories */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Catégories de dépenses"
              description="Répartissez votre budget total entre les différentes catégories"
            />

            {/* Affichage des catégories du template ou création manuelle */}
            {formData.template ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Catégories basées sur le modèle "{BUDGET_TEMPLATES[formData.template]?.name}"
                  </p>
                  <Badge color="teal" variant="subtle">
                    Template
                  </Badge>
                </div>
                
                {/* Éditeur de catégories du template */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {Object.entries(formData.categories).map(([categoryId, amount]) => (
                    <div key={categoryId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {TRANSACTION_CATEGORIES[categoryId]?.name || categoryId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Recommandé: {BUDGET_TEMPLATES[formData.template]?.categories[categoryId]} {formData.currency}
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => handleCategoryChange(categoryId, e.target.value)}
                        placeholder="0"
                        size="sm"
                        className="w-32"
                        leftIcon={DollarSign}
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ajoutez manuellement vos catégories de dépenses
                </p>
                
                {/* Catégories prédéfinies */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Catégories prédéfinies</h4>
                  {predefinedCategories.map((category) => (
                    <div key={category.value} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {category.label}
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        value={formData.categories[category.value] || ''}
                        onChange={(e) => handleCategoryChange(category.value, e.target.value)}
                        placeholder="0"
                        size="sm"
                        className="w-32"
                        leftIcon={DollarSign}
                        min="0"
                      />
                    </div>
                  ))}
                </div>

                {/* Catégories personnalisées */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Catégories personnalisées</h4>
                  
                  {/* Formulaire d'ajout */}
                  <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nom de la catégorie"
                      size="sm"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={newCategory.amount}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Montant"
                      size="sm"
                      className="w-24"
                      leftIcon={DollarSign}
                      min="0"
                    />
                    <Button
                      onClick={handleAddCustomCategory}
                      size="sm"
                      leftIcon={Plus}
                      disabled={!newCategory.name || !newCategory.amount}
                    >
                      Ajouter
                    </Button>
                  </div>

                  {/* Liste des catégories personnalisées */}
                  {formData.customCategories.map((category) => (
                    <div key={category.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Edit3 className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          Catégorie personnalisée
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {category.amount} {formData.currency}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total budgeté */}
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-teal-800 dark:text-teal-300">
                  Total budgeté:
                </span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  {totalBudgeted} {formData.currency}
                </span>
              </div>
              
              {formData.template && (
                <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">
                  {Object.keys(formData.categories).length} catégories configurées
                </div>
              )}
              
              {!formData.template && (
                <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">
                  {Object.keys(formData.categories).length + formData.customCategories.length} catégories configurées
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étape 3: Paramètres avancés */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Paramètres avancés"
              description="Configurez les alertes et options de votre budget"
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

            {/* Notes */}
            <FormInput
              label="Notes (optionnel)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ajoutez des notes ou des objectifs pour ce budget..."
              multiline
              rows={3}
            />

            {/* Récapitulatif */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Récapitulatif du budget
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Nom:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Période:</span>
                  <span className="font-medium capitalize">{formData.period}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span className="font-medium">
                    {formData.startDate} au {formData.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Revenus attendus:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {Math.max(totalBudgeted, formData.expectedIncome || totalBudgeted)} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total budgeté:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {totalBudgeted} {formData.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              disabled={loading}
            >
              {step === 1 ? 'Annuler' : 'Retour'}
            </Button>

            <div className="flex items-center gap-3">
              {step < 3 && (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed || loading}
                >
                  Continuer
                </Button>
              )}

              {step === 3 && (
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={!canProceed}
                >
                  Créer le budget
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

CreateBudgetModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default CreateBudgetModal;