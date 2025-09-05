import React, { useState } from 'react';
import { Button, Input, Card } from '../ui';
import { CreditCard, DollarSign, Palette } from 'lucide-react';

const AccountForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    bank_name: initialData.bank_name || '',
    account_type: initialData.account_type || 'checking',
    currency: initialData.currency || 'HTG',
    current_balance: initialData.current_balance || 0,
    color: initialData.color || '#3B82F6',
    is_active: initialData.is_active !== undefined ? initialData.is_active : true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const accountTypes = [
    { value: 'checking', label: 'Compte Courant' },
    { value: 'savings', label: 'Compte d\'Épargne' },
    { value: 'credit', label: 'Carte de Crédit' },
    { value: 'cash', label: 'Espèces' }
  ];

  const currencies = [
    { value: 'HTG', label: 'Gourde Haïtienne (HTG)' },
    { value: 'USD', label: 'Dollar Américain (USD)' }
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nom du compte requis';
    }
    
    if (!formData.bank_name.trim()) {
      newErrors.bank_name = 'Nom de la banque requis';
    }
    
    if (isNaN(formData.current_balance) || formData.current_balance < 0) {
      newErrors.current_balance = 'Solde invalide';
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

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nom du compte"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Mon compte principal"
            required
          />

          <Input
            label="Banque"
            value={formData.bank_name}
            onChange={(e) => handleChange('bank_name', e.target.value)}
            error={errors.bank_name}
            placeholder="Unibank, BNC, Sogebank..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type de compte *
            </label>
            <select
              value={formData.account_type}
              onChange={(e) => handleChange('account_type', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {accountTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Devise *
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Solde actuel"
          type="number"
          step="0.01"
          value={formData.current_balance}
          onChange={(e) => handleChange('current_balance', parseFloat(e.target.value) || 0)}
          error={errors.current_balance}
          placeholder="0.00"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Couleur du compte
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
            Compte actif
          </label>
        </div>

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
    </Card>
  );
};