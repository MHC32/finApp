// src/features/accounts/components/EditAccountModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Save } from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextarea from '../../../components/forms/FormTextarea';
import FormCurrencyInput from '../../../components/forms/FormCurrencyInput';
import Switch from '../../../components/ui/Switch';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';

/**
 * Modal d'édition d'un compte bancaire existant
 * Avec ajustement de solde et paramètres avancés
 */
const EditAccountModal = ({ isOpen, onClose, account, onSuccess }) => {
  const { updateAccount, adjustBalance, isUpdating, isAdjustingBalance } = useAccount();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minimumBalance: '',
    creditLimit: '',
    isActive: true,
    includeInTotal: true
  });

  const [balanceAdjustment, setBalanceAdjustment] = useState({
    amount: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Initialiser le formulaire avec les données du compte
  useEffect(() => {
    if (account && isOpen) {
      setFormData({
        name: account.name || '',
        description: account.description || '',
        minimumBalance: account.minimumBalance?.toString() || '',
        creditLimit: account.creditLimit?.toString() || '',
        isActive: account.isActive !== false,
        includeInTotal: account.includeInTotal !== false
      });
      
      setBalanceAdjustment({
        amount: '',
        description: ''
      });
      
      setErrors({});
      setFormError('');
    }
  }, [account, isOpen]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du compte est requis';
    }

    if (formData.minimumBalance && isNaN(parseFloat(formData.minimumBalance))) {
      newErrors.minimumBalance = 'Le solde minimum est invalide';
    }

    if (formData.creditLimit && isNaN(parseFloat(formData.creditLimit))) {
      newErrors.creditLimit = 'La limite de crédit est invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (formError) {
      setFormError('');
    }
  };

  // Gestion des changements d'ajustement de solde
  const handleBalanceAdjustmentChange = (field, value) => {
    setBalanceAdjustment(prev => ({ ...prev, [field]: value }));
  };

  // Soumission du formulaire principal
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const updateData = {
        ...formData,
        minimumBalance: formData.minimumBalance ? parseFloat(formData.minimumBalance) : undefined,
        creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined
      };

      const result = await updateAccount(account._id, updateData);
      
      if (result.success) {
        onSuccess?.(result.data);
        handleClose();
      } else {
        setFormError(result.error || 'Erreur lors de la mise à jour du compte');
      }
    } catch (error) {
      setFormError('Erreur lors de la mise à jour du compte');
    }
  };

  // Ajustement du solde
  const handleBalanceAdjustment = async (e) => {
    e.preventDefault();

    if (!balanceAdjustment.amount || isNaN(parseFloat(balanceAdjustment.amount))) {
      setFormError('Montant d\'ajustement invalide');
      return;
    }

    try {
      const result = await adjustBalance(
        account._id,
        parseFloat(balanceAdjustment.amount),
        balanceAdjustment.description || 'Ajustement manuel'
      );

      if (result.success) {
        onSuccess?.(result.data.account);
        setBalanceAdjustment({ amount: '', description: '' });
        setFormError('');
      } else {
        setFormError(result.error || 'Erreur lors de l\'ajustement du solde');
      }
    } catch (error) {
      setFormError('Erreur lors de l\'ajustement du solde');
    }
  };

  // Fermeture du modal
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      minimumBalance: '',
      creditLimit: '',
      isActive: true,
      includeInTotal: true
    });
    setBalanceAdjustment({
      amount: '',
      description: ''
    });
    setErrors({});
    setFormError('');
    setActiveTab('general');
    onClose();
  };

  if (!account) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Modifier ${account.name}`}
      size="lg"
    >
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['general', 'balance', 'advanced'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              {tab === 'general' && 'Général'}
              {tab === 'balance' && 'Solde'}
              {tab === 'advanced' && 'Avancé'}
            </button>
          ))}
        </nav>
      </div>

      {/* Erreur générale */}
      {formError && (
        <Alert type="error" title="Erreur" description={formError} dismissible />
      )}

      {/* Tab Général */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              label="Nom du compte"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description du compte..."
              rows={3}
              optional
            />
          </div>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              leftIcon={Save}
              isLoading={isUpdating}
              disabled={isUpdating}
            >
              Enregistrer
            </Button>
          </Modal.Footer>
        </form>
      )}

      {/* Tab Solde */}
      {activeTab === 'balance' && (
        <div className="space-y-6">
          {/* Solde actuel */}
          <div className="glass-card p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Solde actuel
            </h4>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: account.currency
              }).format(account.currentBalance)}
            </p>
          </div>

          {/* Ajustement de solde */}
          <form onSubmit={handleBalanceAdjustment} className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Ajuster le solde
            </h4>

            <FormCurrencyInput
              label="Montant d'ajustement"
              name="adjustmentAmount"
              value={balanceAdjustment.amount}
              onChange={(value) => handleBalanceAdjustmentChange('amount', value)}
              currency={account.currency}
              placeholder="0.00"
              allowNegative
              required
            />

            <FormInput
              label="Raison de l'ajustement"
              name="adjustmentDescription"
              value={balanceAdjustment.description}
              onChange={(e) => handleBalanceAdjustmentChange('description', e.target.value)}
              placeholder="Ex: Correction, oubli..."
              optional
            />

            <Button
              type="submit"
              isLoading={isAdjustingBalance}
              disabled={isAdjustingBalance || !balanceAdjustment.amount}
              fullWidth
            >
              Ajuster le solde
            </Button>
          </form>
        </div>
      )}

      {/* Tab Avancé */}
      {activeTab === 'advanced' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormCurrencyInput
              label="Solde minimum"
              name="minimumBalance"
              value={formData.minimumBalance}
              onChange={(value) => handleInputChange('minimumBalance', value)}
              currency={account.currency}
              placeholder="0.00"
              error={errors.minimumBalance}
              optional
            />

            <FormCurrencyInput
              label="Limite de crédit"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={(value) => handleInputChange('creditLimit', value)}
              currency={account.currency}
              placeholder="0.00"
              error={errors.creditLimit}
              optional
            />
          </div>

          <div className="space-y-4">
            <Switch
              checked={formData.isActive}
              onChange={(checked) => handleInputChange('isActive', checked)}
              label="Compte actif"
              description="Le compte est visible et utilisable"
            />

            <Switch
              checked={formData.includeInTotal}
              onChange={(checked) => handleInputChange('includeInTotal', checked)}
              label="Inclure dans le total général"
              description="Le solde de ce compte est inclus dans le calcul du total"
            />
          </div>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              leftIcon={Save}
              isLoading={isUpdating}
              disabled={isUpdating}
            >
              Enregistrer
            </Button>
          </Modal.Footer>
        </form>
      )}

      {/* Loading overlay */}
      {(isUpdating || isAdjustingBalance) && <Loading overlay />}
    </Modal>
  );
};

EditAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.object,
  onSuccess: PropTypes.func
};

export default EditAccountModal;