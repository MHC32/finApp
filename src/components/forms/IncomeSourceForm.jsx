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

  // ✅ FIX 1: VALIDATION RENFORCÉE
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

    // Validation spécifique selon la fréquence
    if (formData.frequency === 'monthly' && (formData.payment_day < 1 || formData.payment_day > 31)) {
      newErrors.payment_day = 'Le jour doit être entre 1 et 31';
    }

    if (formData.frequency === 'weekly' && (formData.payment_day < 0 || formData.payment_day > 6)) {
      newErrors.payment_day = 'Jour de la semaine invalide';
    }
    
    return newErrors;
  };

  // ✅ FIX 2: GESTION SOUMISSION AMÉLIORÉE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // ✅ CORRECTION CRITIQUE: S'assurer que les IDs sont des nombres
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        payment_day: parseInt(formData.payment_day),
        destination_account_id: parseInt(formData.destination_account_id)
      };
      
      console.log('📤 Soumission données formulaire:', submitData);
      await onSubmit(submitData);
      
    } catch (error) {
      console.error('❌ Erreur formulaire revenus:', error);
      setErrors({ submit: 'Erreur lors de l\'ajout de la source de revenus' });
    } finally {
      setLoading(false);
    }
  };

  const frequencies = [
    { value: 'monthly', label: '📅 Mensuel', description: 'Une fois par mois' },
    { value: 'bi_monthly', label: '📅 Bi-mensuel', description: 'Deux fois par mois' },
    { value: 'weekly', label: '📅 Hebdomadaire', description: 'Chaque semaine' },
    { value: 'bi_weekly', label: '📅 Bi-hebdomadaire', description: 'Toutes les deux semaines' }
  ];

  const incomeCategories = [
    { value: 'salary', label: '💼 Salaire fixe' },
    { value: 'freelance', label: '🚀 Freelance' },
    { value: 'business', label: '🏢 Entreprise' },
    { value: 'rental', label: '🏠 Locatif' },
    { value: 'investment', label: '📈 Investissement' },
    { value: 'pension', label: '👴 Pension' },
    { value: 'other', label: '💰 Autre' }
  ];

  // Générer les options de jour selon la fréquence
  const getPaymentDayOptions = () => {
    switch (formData.frequency) {
      case 'monthly':
        return Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }));
      case 'weekly':
      case 'bi_weekly':
        return [
          { value: 1, label: 'Lundi' },
          { value: 2, label: 'Mardi' },
          { value: 3, label: 'Mercredi' },
          { value: 4, label: 'Jeudi' },
          { value: 5, label: 'Vendredi' },
          { value: 6, label: 'Samedi' },
          { value: 0, label: 'Dimanche' }
        ];
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom de la source"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          placeholder="Ex: Salaire principal"
          required
        />

        <Input
          label="Employeur (optionnel)"
          value={formData.employer}
          onChange={(e) => setFormData(prev => ({ ...prev, employer: e.target.value }))}
          placeholder="Ex: Mon entreprise"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Montant"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          error={errors.amount}
          placeholder="0.00"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Devise
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="HTG">🇭🇹 Gourde (HTG)</option>
            <option value="USD">🇺🇸 Dollar (USD)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compte de destination
        </label>
        <select
          value={formData.destination_account_id}
          onChange={(e) => setFormData(prev => ({ ...prev, destination_account_id: e.target.value }))}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Sélectionner un compte</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name} - {account.bank_name} ({account.currency})
            </option>
          ))}
        </select>
        {errors.destination_account_id && (
          <p className="text-red-600 text-sm mt-1">{errors.destination_account_id}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fréquence
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {frequencies.map(freq => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        {formData.frequency !== 'bi_monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.frequency === 'monthly' ? 'Jour du mois' : 'Jour de la semaine'}
            </label>
            <select
              value={formData.payment_day}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_day: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {getPaymentDayOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.payment_day && (
              <p className="text-red-600 text-sm mt-1">{errors.payment_day}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Catégorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {incomeCategories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Heure de traitement"
          type="time"
          value={formData.payment_time}
          onChange={(e) => setFormData(prev => ({ ...prev, payment_time: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default IncomeSourceForm;