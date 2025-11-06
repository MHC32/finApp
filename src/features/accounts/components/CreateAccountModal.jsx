// src/features/accounts/components/CreateAccountModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextarea from '../../../components/forms/FormTextarea';
import FormCurrencyInput from '../../../components/forms/FormCurrencyInput';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';

/**
 * Modal de création d'un nouveau compte bancaire
 * Avec validation et chargement des données supportées
 */
const CreateAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { createAccount, supportedData, isCreating, loadSupportedData } = useAccount();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    bankName: '',
    currency: 'HTG',
    accountNumber: '',
    initialBalance: '0',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Charger les données supportées à l'ouverture
  useEffect(() => {
    if (isOpen && supportedData.banks.length === 0) {
      console.log('🔍 CreateAccountModal - Chargement des données supportées...');
      loadSupportedData();
    }
  }, [isOpen, supportedData.banks.length, loadSupportedData]);

  // DEBUG: Log des données supportées
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 CreateAccountModal - supportedData:', supportedData);
      console.log('🔍 CreateAccountModal - banks:', supportedData.banks);
      console.log('🔍 CreateAccountModal - accountTypes:', supportedData.accountTypes);
      console.log('🔍 CreateAccountModal - currencies:', supportedData.currencies);
    }
  }, [isOpen, supportedData]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du compte est requis';
    }

    if (!formData.type) {
      newErrors.type = 'Le type de compte est requis';
    }

    if (!formData.bankName) {
      newErrors.bankName = 'La banque est requise';
    }

    if (!formData.currency) {
      newErrors.currency = 'La devise est requise';
    }

    if (formData.initialBalance === '' || isNaN(parseFloat(formData.initialBalance))) {
      newErrors.initialBalance = 'Le solde initial est invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (formError) {
      setFormError('');
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const accountData = {
        ...formData,
        initialBalance: parseFloat(formData.initialBalance)
      };

      const result = await createAccount(accountData);
      
      if (result.success) {
        onSuccess?.(result.data);
        handleClose();
      } else {
        setFormError(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      setFormError('Erreur lors de la création du compte');
    }
  };

  // Fermeture et reset
  const handleClose = () => {
    setFormData({
      name: '',
      type: '',
      bankName: '',
      currency: 'HTG',
      accountNumber: '',
      initialBalance: '0',
      description: ''
    });
    setErrors({});
    setFormError('');
    onClose();
  };

  // Options pour les selects
  const typeOptions = supportedData.accountTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

  const bankOptions = supportedData.banks.map(bank => ({
    value: bank.id,
    label: bank.name
  }));

  const currencyOptions = supportedData.currencies.map(currency => ({
    value: currency.code,
    label: `${currency.name} (${currency.symbol})`
  }));

  // DEBUG: Log des options
  console.log('🔍 CreateAccountModal - bankOptions:', bankOptions);
  console.log('🔍 CreateAccountModal - typeOptions:', typeOptions);
  console.log('🔍 CreateAccountModal - currencyOptions:', currencyOptions);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Créer un nouveau compte"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erreur générale */}
        {formError && (
          <Alert type="error" title="Erreur" description={formError} dismissible />
        )}

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nom du compte"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="ex: Compte Principal"
            required
          />

          <FormSelect
            label="Type de compte"
            name="type"
            options={typeOptions}
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            error={errors.type}
            placeholder="Sélectionner un type"
            required
          />
        </div>

        {/* Informations bancaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Banque"
            name="bankName"
            options={bankOptions}
            value={formData.bankName}
            onChange={(value) => handleInputChange('bankName', value)}
            error={errors.bankName}
            placeholder="Sélectionner une banque"
            required
          />

          <FormInput
            label="Numéro de compte"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            placeholder="Optionnel"
            optional
          />
        </div>

        {/* Devise et solde */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Devise"
            name="currency"
            options={currencyOptions}
            value={formData.currency}
            onChange={(value) => handleInputChange('currency', value)}
            error={errors.currency}
            required
          />

          <FormCurrencyInput
            label="Solde initial"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={(value) => handleInputChange('initialBalance', value)}
            currency={formData.currency}
            onCurrencyChange={(value) => handleInputChange('currency', value)}
            error={errors.initialBalance}
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <FormTextarea
          label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description optionnelle du compte..."
            rows={3}
            optional
          />

        {/* Actions */}
        <Modal.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Annuler
          </Button>
          
          <Button
            type="submit"
            leftIcon={Plus}
            isLoading={isCreating}
            disabled={isCreating}
          >
            Créer le compte
          </Button>
        </Modal.Footer>
      </form>

      {/* Loading overlay */}
      {isCreating && <Loading overlay />}
    </Modal>
  );
};

CreateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateAccountModal;