// src/components/forms/TransactionForm.jsx - VERSION CORRIGÉE
import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Minus, ArrowUpDown } from 'lucide-react';
import { Button, Input } from '../ui';
import { useAccounts } from '../../hooks/useAccounts';

const TransactionForm = ({ initialData = null, onSubmit, onCancel }) => {
  const { accounts } = useAccounts();
  
  // ✅ CORRECTION BUG 1: Ajout du type de transaction
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    account_id: '',
    type: 'expense', // ✅ NOUVEAU: Type par défaut = dépense
    date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ CORRECTION BUG 1: Types de transactions avec icônes
  const transactionTypes = [
    { 
      value: 'income', 
      label: 'Revenu', 
      icon: Plus, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      description: 'Argent qui entre dans vos comptes'
    },
    { 
      value: 'expense', 
      label: 'Dépense', 
      icon: Minus, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      description: 'Argent qui sort de vos comptes'
    },
    { 
      value: 'transfer', 
      label: 'Transfert', 
      icon: ArrowUpDown, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Mouvement entre vos comptes'
    }
  ];

  const categories = [
    // Catégories de revenus
    { value: 'salary', label: '💼 Salaire', type: 'income' },
    { value: 'business', label: '🏢 Business', type: 'income' },
    { value: 'freelance', label: '💻 Freelance', type: 'income' },
    { value: 'investment', label: '📈 Investissement', type: 'income' },
    { value: 'rental', label: '🏠 Location', type: 'income' },
    { value: 'gift_received', label: '🎁 Cadeau reçu', type: 'income' },
    { value: 'other_income', label: '💰 Autre revenu', type: 'income' },
    
    // Catégories de dépenses
    { value: 'food', label: '🍽️ Nourriture', type: 'expense' },
    { value: 'transport', label: '🚗 Transport', type: 'expense' },
    { value: 'utilities', label: '💡 Services publics', type: 'expense' },
    { value: 'rent', label: '🏠 Loyer', type: 'expense' },
    { value: 'healthcare', label: '🏥 Santé', type: 'expense' },
    { value: 'education', label: '📚 Éducation', type: 'expense' },
    { value: 'entertainment', label: '🎬 Divertissement', type: 'expense' },
    { value: 'shopping', label: '🛒 Achats', type: 'expense' },
    { value: 'gift_given', label: '🎁 Cadeau offert', type: 'expense' },
    { value: 'other_expense', label: '💸 Autre dépense', type: 'expense' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Espèces' },
    { value: 'transfer', label: 'Virement' },
    { value: 'check', label: 'Chèque' },
    { value: 'mobile', label: 'Paiement mobile' }
  ];

  // ✅ CORRECTION BUG 1: Filtrer les catégories selon le type
  const getFilteredCategories = () => {
    if (formData.type === 'transfer') {
      return [{ value: 'transfer', label: '↔️ Transfert entre comptes', type: 'transfer' }];
    }
    return categories.filter(cat => cat.type === formData.type);
  };

  // ✅ CORRECTION BUG 1: Validation avec vérification du type
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description requise';
    }
    
    if (!formData.amount || formData.amount === 0) {
      newErrors.amount = 'Montant requis';
    }
    
    // ✅ NOUVEAU: Validation spécifique selon le type
    if (formData.type !== 'transfer' && parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être positif';
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

  // ✅ CORRECTION BUG 1: Gestion intelligente du montant selon le type
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // ✅ NOUVEAU: Conversion automatique du montant selon le type
      const processedData = {
        ...formData,
        amount: calculateFinalAmount()
      };
      
      await onSubmit(processedData);
    } catch (err) {
      setErrors({ submit: 'Erreur lors de l\'enregistrement' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION BUG 1: Calcul automatique du montant final
  const calculateFinalAmount = () => {
    const baseAmount = Math.abs(parseFloat(formData.amount));
    
    switch (formData.type) {
      case 'income':
        return baseAmount; // Toujours positif
      case 'expense':
        return -baseAmount; // Toujours négatif
      case 'transfer':
        return baseAmount; // Positif (géré différemment dans le hook)
      default:
        return baseAmount;
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // ✅ NOUVEAU: Reset de la catégorie si on change de type
      if (field === 'type' && value !== prev.type) {
        newData.category = '';
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const selectedType = transactionTypes.find(type => type.value === formData.type);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ✅ NOUVEAU: Sélection du type de transaction */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Type de transaction *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {transactionTypes.map(type => {
              const Icon = type.icon;
              const isSelected = formData.type === type.value;
              
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('type', type.value)}
                  className={`
                    p-4 border-2 rounded-lg transition-all duration-200 text-left
                    ${isSelected 
                      ? `${type.bgColor} border-current ${type.color} shadow-md scale-105` 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${isSelected ? type.color : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ NOUVEAU: Aperçu du montant avec formatage selon le type */}
        {formData.amount && (
          <div className={`p-3 rounded-lg border-2 ${selectedType?.bgColor || 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Impact sur le solde :</span>
              <span className={`text-lg font-bold ${selectedType?.color || 'text-gray-600'}`}>
                {formData.type === 'expense' ? '-' : '+'}
                {Math.abs(parseFloat(formData.amount) || 0).toLocaleString('fr-HT')} HTG
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            placeholder={
              formData.type === 'income' ? "Ex: Salaire janvier" :
              formData.type === 'expense' ? "Ex: Courses au supermarché" :
              "Ex: Transfert vers épargne"
            }
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Montant * <span className="text-xs text-gray-500">(en valeur positive)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`
                  block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                  placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent
                  ${errors.amount ? 'border-red-500' : ''}
                `}
                placeholder="0.00"
                required
              />
            </div>
            {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Catégorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {getFilteredCategories().map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Compte *
            </label>
            <select
              value={formData.account_id}
              onChange={(e) => handleChange('account_id', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un compte</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.bank_name}
                </option>
              ))}
            </select>
            {errors.account_id && <p className="text-sm text-red-600">{errors.account_id}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 
             `Enregistrer ${formData.type === 'income' ? 'le revenu' : 
                          formData.type === 'expense' ? 'la dépense' : 'le transfert'}`
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;