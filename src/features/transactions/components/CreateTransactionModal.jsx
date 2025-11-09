import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Plus,
  ArrowLeftRight,
  Loader2
} from 'lucide-react';
import { 
  TRANSACTION_CATEGORIES, 
  TRANSACTION_TYPES, 
  HAITI_BANKS 
} from '../../../utils/constants';
import { useTransaction } from '../hooks/useTransactions';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import FormInput from '../../../components/forms/FormInput';
import FormCurrencyInput from '../../../components/forms/FormCurrencyInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormDatePicker from '../../../components/forms/FormDatePicker';
import FormTextarea from '../../../components/forms/FormTextarea';
import Radio from '../../../components/ui/Radio';
import Alert from '../../../components/ui/Alert';

/**
 * Modal de création de transaction
 * 
 * @example
 * <CreateTransactionModal
 *   isOpen={isCreateModalOpen}
 *   onClose={() => setIsCreateModalOpen(false)}
 *   onSuccess={handleTransactionCreated}
 *   defaultValues={defaultValues}
 * />
 */
const CreateTransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValues = {},
  accounts = [],
  className = ''
}) => {
  const { createTransaction, isCreating } = useTransaction();
  const { mode } = useSelector((state) => state.theme);
  
  const [formData, setFormData] = useState({
    type: TRANSACTION_TYPES.EXPENSE,
    amount: '',
    currency: 'HTG',
    description: '',
    category: '',
    subcategory: '',
    account: '',
    toAccount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        ...defaultValues,
        date: defaultValues.date || new Date().toISOString().split('T')[0]
      }));
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen, defaultValues]);

  // Options pour les selects
  const categoryOptions = Object.entries(TRANSACTION_CATEGORIES)
    .filter(([key, category]) => category.type === 'both' || category.type === formData.type)
    .map(([key, category]) => ({
      value: key,
      label: category.name,
      color: category.color
    }));

  const accountOptions = accounts.map(account => ({
    value: account._id,
    label: `${account.name} (${HAITI_BANKS[account.bank]?.name || account.bank}) - ${account.currentBalance} ${account.currency}`,
    balance: account.currentBalance
  }));

  const toAccountOptions = accountOptions.filter(acc => acc.value !== formData.account);

  // Sous-catégories selon la catégorie sélectionnée
  const subcategoryOptions = formData.category 
    ? (TRANSACTION_CATEGORIES[formData.category]?.subcategories || []).map(sub => ({
        value: sub,
        label: sub
      }))
    : [];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être positif';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.account) {
      newErrors.account = 'Le compte est requis';
    }

    if (formData.type === TRANSACTION_TYPES.TRANSFER && !formData.toAccount) {
      newErrors.toAccount = 'Le compte destinataire est requis pour un transfert';
    }

    if (formData.type === TRANSACTION_TYPES.TRANSFER && formData.account === formData.toAccount) {
      newErrors.toAccount = 'Impossible de transférer vers le même compte';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer les changements
  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Réinitialiser les champs dépendants
      if (field === 'category') {
        newData.subcategory = '';
      }
      if (field === 'type' && value !== TRANSACTION_TYPES.TRANSFER) {
        newData.toAccount = '';
      }
      
      return newData;
    });

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const result = await createTransaction(transactionData);
      
      if (result.success) {
        onSuccess?.(result.data);
        onClose();
      }
    } catch (error) {
      console.error('Erreur création transaction:', error);
    }
  };

  // Étapes suivantes/précédentes
  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      stepErrors.amount = 'Le montant doit être positif';
    }
    if (!formData.description?.trim()) {
      stepErrors.description = 'La description est requise';
    }
    if (!formData.account) {
      stepErrors.account = 'Le compte est requis';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle Transaction"
      size="lg"
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 mx-2 ${
              currentStep >= 2 ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Étape 1: Informations de base */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Type de transaction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type de transaction
              </label>
              <Radio.Group
                value={formData.type}
                onChange={(value) => handleChange('type', value)}
                orientation="horizontal"
              >
                <Radio 
                  value={TRANSACTION_TYPES.EXPENSE} 
                  label="Dépense" 
                />
                <Radio 
                  value={TRANSACTION_TYPES.INCOME} 
                  label="Revenu" 
                />
                <Radio 
                  value={TRANSACTION_TYPES.TRANSFER} 
                  label="Transfert" 
                />
              </Radio.Group>
            </div>

            {/* Montant et devise */}
            <div className="grid grid-cols-2 gap-4">
              <FormCurrencyInput
                label="Montant"
                name="amount"
                value={formData.amount}
                onChange={(value) => handleChange('amount', value)}
                currency={formData.currency}
                onCurrencyChange={(value) => handleChange('currency', value)}
                error={errors.amount}
                required
              />

              <FormDatePicker
                label="Date"
                name="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Courses supermarché, Salaire..."
              error={errors.description}
              required
            />

            {/* Compte */}
            <FormSelect
              label="Compte"
              name="account"
              options={accountOptions}
              value={formData.account}
              onChange={(value) => handleChange('account', value)}
              placeholder="Sélectionner un compte"
              error={errors.account}
              required
            />

            {/* Compte destinataire (transfert seulement) */}
            {formData.type === TRANSACTION_TYPES.TRANSFER && (
              <FormSelect
                label="Compte destinataire"
                name="toAccount"
                options={toAccountOptions}
                value={formData.toAccount}
                onChange={(value) => handleChange('toAccount', value)}
                placeholder="Sélectionner le compte destinataire"
                error={errors.toAccount}
                required
              />
            )}
          </div>
        )}

        {/* Étape 2: Catégorisation et détails */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Catégorie et sous-catégorie */}
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Catégorie"
                name="category"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleChange('category', value)}
                placeholder="Sélectionner une catégorie"
                error={errors.category}
                required
              />

              <FormSelect
                label="Sous-catégorie"
                name="subcategory"
                options={subcategoryOptions}
                value={formData.subcategory}
                onChange={(value) => handleChange('subcategory', value)}
                placeholder="Sous-catégorie (optionnel)"
                disabled={!formData.category}
              />
            </div>

            {/* Notes */}
            <FormTextarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Notes supplémentaires..."
              rows={3}
              optional
            />

            {/* Tags */}
            <FormInput
              label="Tags"
              name="tags"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="tag1, tag2, tag3..."
              helperText="Séparez les tags par des virgules"
              optional
            />

            {/* Avertissement solde insuffisant */}
            {formData.type === TRANSACTION_TYPES.EXPENSE && formData.account && (
              <Alert
                type="warning"
                variant="subtle"
                title="Vérification du solde"
                description="Le solde du compte sera vérifié avant la création de la transaction."
              />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {currentStep === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isCreating}
              >
                Retour
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isCreating}
            >
              Annuler
            </Button>

            {currentStep === 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                rightIcon={ArrowLeftRight}
              >
                Continuer
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isCreating}
                icon={isCreating ? Loader2 : Plus}
                className="animate-pulse"
              >
                {isCreating ? 'Création...' : 'Créer la transaction'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

CreateTransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  defaultValues: PropTypes.object,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    currentBalance: PropTypes.number.isRequired
  })),
  className: PropTypes.string
};

export default CreateTransactionModal;