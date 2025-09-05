import React, { useState, useEffect } from 'react';
import { Button, Input, Card } from '../ui';
import { useAccounts } from '../../hooks/useAccounts';
import { Calendar, DollarSign, Tag } from 'lucide-react';

const TransactionForm = ({ onSubmit, initialData, onCancel }) => {
  const { accounts } = useAccounts();
  
  // ✅ Correction: Gérer le cas où initialData est null/undefined
  const [formData, setFormData] = useState({
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    account_id: initialData?.account_id || '',
    payment_method: initialData?.payment_method || 'card',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'food', label: '🍽️ Alimentation', subcategories: ['Restaurant', 'Épicerie', 'Fast-food'] },
    { value: 'transport', label: '🚗 Transport', subcategories: ['Essence', 'Taxi', 'Transport public', 'Réparation'] },
    { value: 'housing', label: '🏠 Logement', subcategories: ['Loyer', 'Électricité', 'Eau', 'Internet'] },
    { value: 'health', label: '🏥 Santé', subcategories: ['Médecin', 'Pharmacie', 'Assurance'] },
    { value: 'entertainment', label: '🎉 Loisirs', subcategories: ['Cinéma', 'Sport', 'Sorties'] },
    { value: 'education', label: '📚 Éducation', subcategories: ['Cours', 'Livres', 'Formation'] },
    { value: 'shopping', label: '🛍️ Achats', subcategories: ['Vêtements', 'Électronique', 'Maison'] },
    { value: 'income', label: '💰 Revenus', subcategories: ['Salaire', 'Freelance', 'Bonus', 'Autre'] },
    { value: 'transfer', label: '↔️ Transfert', subcategories: ['Entre comptes', 'Famille', 'Amis'] },
    { value: 'other', label: '📝 Autre', subcategories: ['Divers'] }
  ];

  const paymentMethods = [
    { value: 'card', label: 'Carte bancaire' },
    { value: 'cash', label: 'Espèces' },
    { value: 'transfer', label: 'Virement' },
    { value: 'check', label: 'Chèque' },
    { value: 'mobile', label: 'Paiement mobile' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description requise';
    }
    
    if (!formData.amount || formData.amount === 0) {
      newErrors.amount = 'Montant requis';
    }
    
    if (!formData.category) {
      newErrors.category = 'Catégorie requise';
    }
    
    if (!formData.account_id) {
      newErrors.account_id = 'Compte requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: 'Erreur lors de l\'enregistrement' });
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

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            placeholder="Ex: Courses au supermarché"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Montant *
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
                  block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                  placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent
                  ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}
                `}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
            <p className="text-xs text-gray-500">
              Utilisez un montant négatif pour les dépenses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Catégorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                handleChange('category', e.target.value);
                handleChange('subcategory', ''); // Reset subcategory
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

          {selectedCategory && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sous-catégorie
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une sous-catégorie</option>
                {selectedCategory.subcategories.map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Compte *
            </label>
            <select
              value={formData.account_id}
              onChange={(e) => handleChange('account_id', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un compte</option>
              {accounts.filter(acc => acc.is_active).map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.bank_name}
                </option>
              ))}
            </select>
            {errors.account_id && <p className="text-sm text-red-600">{errors.account_id}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mode de paiement
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          required
        />

        {errors.submit && (
          <div className="text-red-600 text-sm">{errors.submit}</div>
        )}

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;