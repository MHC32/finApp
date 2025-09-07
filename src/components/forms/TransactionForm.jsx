// src/components/forms/TransactionForm.jsx - VERSION CORRIGÉE COMPLÈTE
import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Minus, ArrowUpDown, Info } from 'lucide-react';
import { Button, Input } from '../ui';
import { useAccounts } from '../../hooks/useAccounts';

const TransactionForm = ({ initialData = null, onSubmit, onCancel }) => {
  const { accounts } = useAccounts();
  
  // ✅ CORRECTION: État initial avec normalisation
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    account_id: '',
    type: 'expense', // Type par défaut
    date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ TYPES DE TRANSACTIONS (inchangé mais clarifié)
  const transactionTypes = [
    { 
      value: 'income', 
      label: 'Revenu', 
      icon: Plus, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      description: 'Argent qui entre'
    },
    { 
      value: 'expense', 
      label: 'Dépense', 
      icon: Minus, 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      description: 'Argent qui sort'
    },
    { 
      value: 'transfer', 
      label: 'Transfert', 
      icon: ArrowUpDown, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      description: 'Entre vos comptes'
    }
  ];

  // ✅ CATÉGORIES (organisées par type)
  const categories = [
    // Revenus
    { value: 'salary', label: '💼 Salaire', type: 'income' },
    { value: 'business', label: '🏢 Business', type: 'income' },
    { value: 'freelance', label: '💻 Freelance', type: 'income' },
    { value: 'investment', label: '📈 Investissement', type: 'income' },
    { value: 'rental', label: '🏠 Location', type: 'income' },
    { value: 'gift_received', label: '🎁 Cadeau reçu', type: 'income' },
    { value: 'refund', label: '↩️ Remboursement', type: 'income' },
    { value: 'other_income', label: '💰 Autre revenu', type: 'income' },
    
    // Dépenses
    { value: 'food', label: '🍽️ Alimentation', type: 'expense' },
    { value: 'transport', label: '🚗 Transport', type: 'expense' },
    { value: 'utilities', label: '💡 Services publics', type: 'expense' },
    { value: 'rent', label: '🏠 Loyer', type: 'expense' },
    { value: 'healthcare', label: '🏥 Santé', type: 'expense' },
    { value: 'education', label: '📚 Éducation', type: 'expense' },
    { value: 'entertainment', label: '🎬 Divertissement', type: 'expense' },
    { value: 'shopping', label: '🛒 Achats', type: 'expense' },
    { value: 'insurance', label: '🛡️ Assurance', type: 'expense' },
    { value: 'taxes', label: '📊 Impôts', type: 'expense' },
    { value: 'gift_given', label: '🎁 Cadeau offert', type: 'expense' },
    { value: 'other_expense', label: '💸 Autre dépense', type: 'expense' },
    
    // Transferts
    { value: 'transfer', label: '↔️ Transfert entre comptes', type: 'transfer' }
  ];

  const paymentMethods = [
    { value: 'cash', label: '💵 Espèces' },
    { value: 'transfer', label: '🏦 Virement' },
    { value: 'check', label: '📄 Chèque' },
    { value: 'mobile', label: '📱 Paiement mobile' },
    { value: 'card', label: '💳 Carte' }
  ];

  // ✅ CORRECTION: Filtrer les catégories selon le type
  const getFilteredCategories = () => {
    return categories.filter(cat => cat.type === formData.type);
  };

  // ✅ CORRECTION MAJEURE: Validation renforcée
  const validateForm = () => {
    const newErrors = {};
    
    // Description
    if (!formData.description?.trim()) {
      newErrors.description = 'Description requise';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description trop courte (min. 3 caractères)';
    }
    
    // Montant
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'Montant requis et valide';
    } else if (amount <= 0) {
      newErrors.amount = 'Le montant doit être positif';
    } else if (amount > 999999999) {
      newErrors.amount = 'Montant trop élevé';
    }
    
    // Catégorie
    if (!formData.category) {
      newErrors.category = 'Catégorie requise';
    }
    
    // Compte
    if (!formData.account_id) {
      newErrors.account_id = 'Compte requis';
    } else {
      // Vérifier que le compte existe
      const accountExists = accounts.some(acc => acc.id.toString() === formData.account_id.toString());
      if (!accountExists) {
        newErrors.account_id = 'Compte sélectionné invalide';
      }
    }
    
    // Date
    if (!formData.date) {
      newErrors.date = 'Date requise';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      if (selectedDate > today) {
        newErrors.date = 'La date ne peut pas être dans le futur';
      } else if (selectedDate < oneYearAgo) {
        newErrors.date = 'Date trop ancienne (max 1 an)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ CORRECTION MAJEURE: Calcul du montant final avec le bon signe
  const calculateFinalAmount = () => {
    const baseAmount = Math.abs(parseFloat(formData.amount) || 0);
    
    switch (formData.type) {
      case 'income':
        return baseAmount; // Positif pour les revenus
      case 'expense':
        return -baseAmount; // Négatif pour les dépenses
      case 'transfer':
        return baseAmount; // Positif pour les transferts (géré différemment)
      default:
        return baseAmount;
    }
  };

  // ✅ CORRECTION: Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('❌ Validation échouée:', errors);
      return;
    }
    
    setLoading(true);
    try {
      // ✅ CALCUL DU MONTANT FINAL AVEC SIGNE CORRECT
      const finalAmount = calculateFinalAmount();
      
      // ✅ NORMALISATION DES DONNÉES
      const processedData = {
        ...formData,
        description: formData.description.trim(),
        amount: finalAmount, // Montant avec le bon signe
        account_id: parseInt(formData.account_id, 10), // Normaliser l'ID
        date: formData.date
      };
      
      console.log('📤 Données soumises:', processedData);
      
      await onSubmit(processedData);
      
      // Réinitialiser le formulaire après succès
      if (!initialData) {
        setFormData({
          description: '',
          amount: '',
          category: '',
          account_id: '',
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
          payment_method: 'cash'
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      setErrors({ submit: error.message || 'Erreur lors de l\'enregistrement' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION: Gestion des changements avec validation en temps réel
  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset de la catégorie si on change de type
      if (field === 'type' && value !== prev.type) {
        newData.category = '';
      }
      
      return newData;
    });
    
    // Supprimer l'erreur pour ce champ s'il y en avait une
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // ✅ OBTENIR LES INFOS DU TYPE SÉLECTIONNÉ
  const selectedType = transactionTypes.find(type => type.value === formData.type);
  const selectedCategory = categories.find(cat => cat.value === formData.category);

  // ✅ CALCUL DE L'APERÇU DU MONTANT
  const getAmountPreview = () => {
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      return null;
    }
    
    const amount = parseFloat(formData.amount);
    const finalAmount = calculateFinalAmount();
    
    return {
      baseAmount: amount,
      finalAmount: finalAmount,
      sign: finalAmount >= 0 ? '+' : '-',
      impact: finalAmount >= 0 ? 'augmenté' : 'diminué'
    };
  };

  const amountPreview = getAmountPreview();

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ✅ SÉLECTION DU TYPE DE TRANSACTION */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${isSelected ? type.color : 'text-gray-400 dark:text-gray-500'}`} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{type.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ APERÇU DU MONTANT */}
        {amountPreview && (
          <div className={`p-4 rounded-lg border-2 ${selectedType?.bgColor || 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Impact sur le solde :
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${selectedType?.color || 'text-gray-600'}`}>
                  {amountPreview.sign}{Math.abs(amountPreview.baseAmount).toLocaleString('fr-HT')} HTG
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (solde {amountPreview.impact})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ✅ DESCRIPTION ET MONTANT */}
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
            maxLength={100}
            className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Montant * <span className="text-xs text-gray-500 dark:text-gray-400">(en valeur positive)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="999999999"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`
                  block w-full pl-10 pr-3 py-2 border rounded-lg 
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  focus:border-transparent
                  bg-white dark:bg-gray-800 
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  ${errors.amount ? 'border-red-500 dark:border-red-400' : ''}
                `}
                placeholder="0.00"
                required
              />
            </div>
            {errors.amount && <p className="text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
          </div>
        </div>

        {/* ✅ CATÉGORIE ET COMPTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`
                block w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                bg-white dark:bg-gray-800 
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                ${errors.category ? 'border-red-500 dark:border-red-400' : ''}
              `}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {getFilteredCategories().map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Compte *
            </label>
            <select
              value={formData.account_id}
              onChange={(e) => handleChange('account_id', e.target.value)}
              className={`
                block w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                bg-white dark:bg-gray-800 
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                ${errors.account_id ? 'border-red-500 dark:border-red-400' : ''}
              `}
              required
            >
              <option value="">Sélectionner un compte</option>
              {accounts
                .filter(account => account.is_active)
                .map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.current_balance?.toLocaleString('fr-HT')} HTG)
                </option>
              ))}
            </select>
            {errors.account_id && <p className="text-sm text-red-600 dark:text-red-400">{errors.account_id}</p>}
          </div>
        </div>

        {/* ✅ DATE ET MÉTHODE DE PAIEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`
                block w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                bg-white dark:bg-gray-800 
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                ${errors.date ? 'border-red-500 dark:border-red-400' : ''}
              `}
              required
            />
            {errors.date && <p className="text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Méthode de paiement
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ AFFICHAGE DES ERREURS GÉNÉRALES */}
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{errors.submit}</p>
          </div>
        )}

        {/* ✅ BOUTONS D'ACTION */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || Object.keys(errors).length > 0}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? 'Enregistrement...' : (initialData ? 'Modifier' : 'Ajouter')}
          </Button>
        </div>

        {/* ✅ RÉSUMÉ DE LA TRANSACTION (si valid) */}
        {!Object.keys(errors).length && formData.description && formData.amount && formData.category && formData.account_id && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              📋 Résumé de la transaction
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Type:</strong> {selectedType?.label}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Catégorie:</strong> {selectedCategory?.label}</p>
              <p><strong>Compte:</strong> {accounts.find(acc => acc.id.toString() === formData.account_id.toString())?.name}</p>
              <p><strong>Montant:</strong> {amountPreview?.sign}{Math.abs(parseFloat(formData.amount) || 0).toLocaleString('fr-HT')} HTG</p>
              <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;