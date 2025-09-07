// src/components/forms/IncomeSourceForm.jsx - FORMULAIRE REVENUS AUTO COMPLET
import React, { useState } from 'react';
import { DollarSign, Calendar, Clock, Building, Tag, CreditCard } from 'lucide-react';
import { Button, Input } from '../ui';
import { useAccounts } from '../../hooks/useAccounts';

const IncomeSourceForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { accounts } = useAccounts();
  
  const [formData, setFormData] = useState({
    name: '',
    employer: '',
    amount: '',
    currency: 'HTG',
    frequency: 'monthly',
    payment_day: 30,
    payment_time: '08:00',
    destination_account_id: '',
    category: 'salary',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ FRÉQUENCES AVEC EXPLICATIONS
  const frequencies = [
    { 
      value: 'monthly', 
      label: '📅 Mensuel', 
      description: 'Une fois par mois',
      example: 'Le 30 de chaque mois'
    },
    { 
      value: 'bi_monthly', 
      label: '📅 Bi-mensuel', 
      description: 'Deux fois par mois',
      example: 'Le 15 et le 30 de chaque mois'
    },
    { 
      value: 'weekly', 
      label: '📅 Hebdomadaire', 
      description: 'Chaque semaine',
      example: 'Tous les vendredis'
    },
    { 
      value: 'bi_weekly', 
      label: '📅 Bi-hebdomadaire', 
      description: 'Toutes les deux semaines',
      example: 'Un vendredi sur deux'
    }
  ];

  // ✅ CATÉGORIES DE REVENUS
  const incomeCategories = [
    { value: 'salary', label: '💼 Salaire fixe', emoji: '💼' },
    { value: 'freelance', label: '🚀 Freelance', emoji: '🚀' },
    { value: 'business', label: '🏢 Revenus d\'entreprise', emoji: '🏢' },
    { value: 'rental', label: '🏠 Revenus locatifs', emoji: '🏠' },
    { value: 'investment', label: '📈 Investissements', emoji: '📈' },
    { value: 'pension', label: '👴 Pension/Retraite', emoji: '👴' },
    { value: 'other', label: '💰 Autre revenu', emoji: '💰' }
  ];

  // ✅ VALIDATION COMPLÈTE
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nom de la source de revenus requis';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Montant requis et doit être positif';
    }
    
    if (!formData.destination_account_id) {
      newErrors.destination_account_id = 'Compte de destination requis';
    }
    
    if (formData.frequency === 'monthly' && (formData.payment_day < 1 || formData.payment_day > 31)) {
      newErrors.payment_day = 'Jour de paiement invalide (1-31)';
    }
    
    if (formData.frequency === 'weekly' && (formData.payment_day < 0 || formData.payment_day > 6)) {
      newErrors.payment_day = 'Jour de la semaine invalide (0=Dimanche, 6=Samedi)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SOUMISSION DU FORMULAIRE
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

  // ✅ GESTION DES CHANGEMENTS
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ✅ OBTENIR L'AIDE POUR LE JOUR DE PAIEMENT
  const getPaymentDayHelper = () => {
    switch (formData.frequency) {
      case 'monthly':
      case 'bi_monthly':
        return 'Jour du mois (1-31). Ex: 30 pour le 30 de chaque mois';
      case 'weekly':
      case 'bi_weekly':
        return 'Jour de la semaine (0=Dimanche, 1=Lundi, ..., 6=Samedi)';
      default:
        return '';
    }
  };

  // ✅ CALCULER L'ESTIMATION MENSUELLE
  const getMonthlyEstimate = () => {
    const amount = parseFloat(formData.amount) || 0;
    let monthlyAmount = amount;
    
    switch (formData.frequency) {
      case 'weekly':
        monthlyAmount = amount * 4.33;
        break;
      case 'bi_weekly':
        monthlyAmount = amount * 2.17;
        break;
      case 'bi_monthly':
        monthlyAmount = amount * 2;
        break;
      // monthly reste tel quel
    }
    
    return monthlyAmount;
  };

  const selectedCategory = incomeCategories.find(cat => cat.value === formData.category);
  const selectedFrequency = frequencies.find(freq => freq.value === formData.frequency);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ✅ En-tête avec aperçu */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{selectedCategory?.emoji || '💰'}</span>
            <div>
              <h3 className="font-medium text-gray-900">
                {formData.name || 'Nouvelle source de revenus'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedFrequency?.description || 'Choisissez une fréquence'}
              </p>
            </div>
          </div>
          
          {/* Aperçu du montant */}
          {formData.amount && (
            <div className="bg-white rounded-lg p-3 border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Montant par paiement :</span>
                  <div className="font-semibold text-green-600">
                    {parseFloat(formData.amount).toLocaleString()} {formData.currency}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Estimation mensuelle :</span>
                  <div className="font-semibold text-blue-600">
                    ~{getMonthlyEstimate().toLocaleString()} {formData.currency}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nom de la source *"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Ex: Salaire BUH, Freelance Design..."
            icon={Tag}
            required
          />

          <Input
            label="Employeur / Source"
            value={formData.employer}
            onChange={(e) => handleChange('employer', e.target.value)}
            placeholder="Ex: Banque de l'Union Haïtienne"
            icon={Building}
          />
        </div>

        {/* ✅ Montant et devise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant par paiement *
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
            {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HTG">🇭🇹 HTG (Gourdes)</option>
              <option value="USD">🇺🇸 USD (Dollars)</option>
            </select>
          </div>
        </div>

        {/* ✅ Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Catégorie de revenus
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {incomeCategories.map(category => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleChange('category', category.value)}
                className={`
                  p-3 border-2 rounded-lg transition-all duration-200 text-left
                  ${formData.category === category.value 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-xl mb-1">{category.emoji}</div>
                <div className="text-xs font-medium">{category.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Fréquence de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Fréquence de paiement
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {frequencies.map(frequency => (
              <button
                key={frequency.value}
                type="button"
                onClick={() => handleChange('frequency', frequency.value)}
                className={`
                  p-4 border-2 rounded-lg transition-all duration-200 text-left
                  ${formData.frequency === frequency.value 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="font-medium">{frequency.label}</div>
                <div className="text-sm text-gray-600">{frequency.description}</div>
                <div className="text-xs text-gray-500 mt-1">{frequency.example}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Configuration temporelle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.frequency.includes('weekly') ? 'Jour de la semaine' : 'Jour du mois'}
            </label>
            <input
              type="number"
              min={formData.frequency.includes('weekly') ? 0 : 1}
              max={formData.frequency.includes('weekly') ? 6 : 31}
              value={formData.payment_day}
              onChange={(e) => handleChange('payment_day', parseInt(e.target.value))}
              className={`
                block w-full px-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.payment_day ? 'border-red-500' : ''}
              `}
            />
            <p className="text-xs text-gray-500 mt-1">{getPaymentDayHelper()}</p>
            {errors.payment_day && <p className="text-sm text-red-600 mt-1">{errors.payment_day}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure de traitement
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={formData.payment_time}
                onChange={(e) => handleChange('payment_time', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Heure à laquelle créer la transaction</p>
          </div>
        </div>

        {/* ✅ Compte de destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compte de destination *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.destination_account_id}
              onChange={(e) => handleChange('destination_account_id', e.target.value)}
              className={`
                block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.destination_account_id ? 'border-red-500' : ''}
              `}
              required
            >
              <option value="">Sélectionner un compte</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.bank_name} ({account.currency})
                </option>
              ))}
            </select>
          </div>
          {errors.destination_account_id && (
            <p className="text-sm text-red-600 mt-1">{errors.destination_account_id}</p>
          )}
        </div>

        {/* ✅ Message d'erreur général */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* ✅ Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 
             initialData ? 'Modifier la source' : 'Créer la source'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IncomeSourceForm;