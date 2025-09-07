// src/components/forms/BudgetForm.jsx
import React, { useState } from 'react';
import { Button, Input, Card } from '../ui';
import { DollarSign, Calendar, Tag, Target } from 'lucide-react';

const BudgetForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    amount: initialData?.amount || 0,
    currency: initialData?.currency || 'HTG',
    period: initialData?.period || 'monthly',
    start_date: initialData?.start_date ? 
      new Date(initialData.start_date).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date ? 
      new Date(initialData.end_date).toISOString().split('T')[0] : '',
    categories: initialData?.categories || [],
    alert_threshold: initialData?.alert_threshold || 80,
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Catégories disponibles pour les budgets
  const availableCategories = [
    { value: 'food', label: '🍽️ Alimentation', color: '#EF4444' },
    { value: 'transport', label: '🚗 Transport', color: '#3B82F6' },
    { value: 'housing', label: '🏠 Logement', color: '#10B981' },
    { value: 'health', label: '🏥 Santé', color: '#F59E0B' },
    { value: 'entertainment', label: '🎉 Loisirs', color: '#8B5CF6' },
    { value: 'education', label: '📚 Éducation', color: '#EC4899' },
    { value: 'shopping', label: '🛍️ Achats', color: '#06B6D4' },
    { value: 'utilities', label: '⚡ Services', color: '#84CC16' },
    { value: 'other', label: '📝 Autre', color: '#6B7280' }
  ];

  // Types de période
  const periodTypes = [
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  // Devises
  const currencies = [
    { value: 'HTG', label: 'Gourde Haïtienne (HTG)' },
    { value: 'USD', label: 'Dollar Américain (USD)' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nom du budget requis';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Montant du budget requis et supérieur à 0';
    }
    
    if (formData.period === 'custom') {
      if (!formData.start_date) {
        newErrors.start_date = 'Date de début requise pour une période personnalisée';
      }
      if (!formData.end_date) {
        newErrors.end_date = 'Date de fin requise pour une période personnalisée';
      }
      if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
        newErrors.end_date = 'La date de fin doit être après la date de début';
      }
    }
    
    if (formData.alert_threshold < 0 || formData.alert_threshold > 100) {
      newErrors.alert_threshold = 'Le seuil d\'alerte doit être entre 0 et 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Préparer les données à envoyer
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        alert_threshold: parseInt(formData.alert_threshold),
        start_date: formData.period === 'custom' ? new Date(formData.start_date) : null,
        end_date: formData.period === 'custom' ? new Date(formData.end_date) : null
      };

      await onSubmit(budgetData);
    } catch (err) {
      setErrors({ submit: 'Erreur lors de l\'enregistrement du budget' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleCategory = (categoryValue) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryValue)
        ? prev.categories.filter(cat => cat !== categoryValue)
        : [...prev.categories, categoryValue]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <Card title="📊 Informations du Budget">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom du budget"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Ex: Budget Alimentation Janvier"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Montant du budget *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                  className={`
                    block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:text-white
                    ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}
                  `}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Devise
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Période
              </label>
              <select
                value={formData.period}
                onChange={(e) => handleChange('period', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {periodTypes.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates personnalisées */}
          {formData.period === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Input
                label="Date de début"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                error={errors.start_date}
                required
              />

              <Input
                label="Date de fin"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                error={errors.end_date}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Seuil d'alerte (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.alert_threshold}
                onChange={(e) => handleChange('alert_threshold', parseInt(e.target.value) || 0)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="80"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
            {errors.alert_threshold && <p className="text-sm text-red-600">{errors.alert_threshold}</p>}
            <p className="text-xs text-gray-500">
              Vous recevrez une alerte quand vous atteignez ce pourcentage de votre budget
            </p>
          </div>
        </Card>

        {/* Sélection des catégories */}
        <Card title="🏷️ Catégories Incluses">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sélectionnez les catégories de dépenses à inclure dans ce budget. 
              Si aucune catégorie n'est sélectionnée, toutes les dépenses seront comptabilisées.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableCategories.map((category) => (
                <div
                  key={category.value}
                  onClick={() => toggleCategory(category.value)}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${formData.categories.includes(category.value)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        formData.categories.includes(category.value)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {formData.categories.includes(category.value) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Catégories sélectionnées:</strong> {formData.categories.length === 0 ? 
                  'Toutes les dépenses' : 
                  formData.categories.map(cat => availableCategories.find(c => c.value === cat)?.label).join(', ')
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Description optionnelle */}
        <Card title="📝 Description (Optionnelle)">
          <div className="space-y-2">
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="Ajoutez une description ou des notes pour ce budget..."
            />
          </div>
        </Card>

        {/* Messages d'erreur */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Enregistrement...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>{initialData ? 'Modifier' : 'Créer'} le Budget</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;