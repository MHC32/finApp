import { useState, useEffect, useCallback, useMemo } from 'react';
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
 * Modal de création de transaction - COMPLÈTEMENT CORRIGÉ
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
    type: TRANSACTION_TYPES.expense.code, // CORRECTION: utiliser .code
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

  // Debug: surveiller les changements de type
  useEffect(() => {
    console.log('=== DEBUG FORM DATA ===');
    console.log('🎯 formData.type:', formData.type);
    console.log('📋 Type de formData.type:', typeof formData.type);
    console.log('🔍 Valeur complète formData:', formData);
  }, [formData, formData.type]);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: defaultValues.type || TRANSACTION_TYPES.expense.code, // CORRECTION: utiliser .code
        amount: defaultValues.amount?.toString() || '',
        currency: defaultValues.currency || 'HTG',
        description: defaultValues.description || '',
        category: defaultValues.category || '',
        subcategory: defaultValues.subcategory || '',
        account: defaultValues.account || '',
        toAccount: defaultValues.toAccount || '',
        date: defaultValues.date || new Date().toISOString().split('T')[0],
        notes: defaultValues.notes || '',
        tags: defaultValues.tags || []
      });
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen]);

  // CORRECTION : Options pour les catégories selon le type
  const categoryOptions = useMemo(() => {
    console.log('🔍 Calcul des catégories pour type:', formData.type);
    
    const filteredCategories = Object.entries(TRANSACTION_CATEGORIES)
      .filter(([key, category]) => {
        // CORRECTION : Logique de compatibilité améliorée
        const isCompatible = 
          category.type === 'both' || 
          category.type === formData.type ||
          (formData.type === 'expense' && category.type === 'expense') ||
          (formData.type === 'income' && category.type === 'income');
        
        console.log(`📁 ${category.name}: type=${category.type}, compatible=${isCompatible}`);
        return isCompatible;
      })
      .map(([key, category]) => ({
        value: key,
        label: category.name,
        color: category.color
      }));
    
    console.log('✅ Catégories filtrées:', filteredCategories.map(c => c.label));
    return filteredCategories;
  }, [formData.type]);

  // Options pour les comptes
  const accountOptions = useMemo(() => {
    return accounts.map(account => ({
      value: account._id,
      label: `${account.name} (${HAITI_BANKS[account.bank]?.name || account.bank}) - ${account.currentBalance} ${account.currency}`,
      balance: account.currentBalance
    }));
  }, [accounts]);

  // Options pour les comptes destinataires
  const toAccountOptions = useMemo(() => {
    return accountOptions.filter(acc => acc.value !== formData.account);
  }, [accountOptions, formData.account]);

  // Sous-catégories
  const subcategoryOptions = useMemo(() => {
    return formData.category && TRANSACTION_CATEGORIES[formData.category]?.subcategories
      ? TRANSACTION_CATEGORIES[formData.category].subcategories.map(sub => ({
          value: sub,
          label: sub
        }))
      : [];
  }, [formData.category]);

  // Validation
  const validateForm = useCallback(() => {
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

    // CORRECTION: Vérifier que le type est présent
    if (!formData.type) {
      newErrors.type = 'Le type de transaction est requis';
    }

    if (formData.type === 'transfer' && !formData.toAccount) {
      newErrors.toAccount = 'Le compte destinataire est requis pour un transfert';
    }

    if (formData.type === 'transfer' && formData.account === formData.toAccount) {
      newErrors.toAccount = 'Impossible de transférer vers le même compte';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gérer les changements - CORRIGÉ AVEC CONSOLE.LOG
  const handleChange = useCallback((field, value) => {
    console.log(`🔄 handleChange appelé - field: ${field}, value:`, value);
    
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Réinitialiser les champs dépendants
      if (field === 'category') {
        newData.subcategory = '';
      }
      
      // CORRECTION : Gestion du changement de type
      if (field === 'type') {
        console.log('🎯 Type changé à:', value);
        if (value !== 'transfer') {
          newData.toAccount = '';
        }
        // Réinitialiser la catégorie si incompatible
        if (newData.category && 
            TRANSACTION_CATEGORIES[newData.category]?.type !== 'both' && 
            TRANSACTION_CATEGORIES[newData.category]?.type !== value) {
          newData.category = '';
          newData.subcategory = '';
        }
      }
      
      return newData;
    });

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Soumettre le formulaire - CORRIGÉ
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== TENTATIVE DE SOUMISSION ===');
    console.log('📋 Données avant validation:', formData);
    
    if (!validateForm()) {
      console.log('❌ Validation échouée, erreurs:', errors);
      return;
    }

    try {
      // CORRECTION: Inclure explicitement tous les champs
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description.trim(),
        category: formData.category,
        account: formData.account,
        date: formData.date,
        // Champs optionnels
        ...(formData.subcategory && { subcategory: formData.subcategory }),
        ...(formData.notes && { notes: formData.notes.trim() }),
        ...(formData.tags && { 
          tags: Array.isArray(formData.tags) 
            ? formData.tags 
            : formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
        // Pour les transferts seulement
        ...(formData.type === 'transfer' && formData.toAccount && { toAccount: formData.toAccount })
      };

      console.log('📤 DONNÉES ENVOYÉES AU SERVEUR:', JSON.stringify(transactionData, null, 2));
      
      const result = await createTransaction(transactionData);
      
      if (result.success) {
        console.log('✅ Transaction créée avec succès!');
        onSuccess?.(result.data);
        onClose();
      } else {
        console.log('❌ Erreur du serveur:', result);
      }
    } catch (error) {
      console.error('💥 Erreur création transaction:', error);
    }
  };

  // Validation étape 1
  const validateStep1 = useCallback(() => {
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
    // CORRECTION: Vérifier le type aussi
    if (!formData.type) {
      stepErrors.type = 'Le type de transaction est requis';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [formData]);

  // Navigation entre étapes
  const nextStep = useCallback(() => {
    console.log('➡️ Tentative de passage à l\'étape 2');
    if (currentStep === 1 && validateStep1()) {
      console.log('✅ Validation étape 1 réussie, passage à étape 2');
      setCurrentStep(2);
    } else {
      console.log('❌ Validation étape 1 échouée');
    }
  }, [currentStep, validateStep1]);

  const prevStep = useCallback(() => {
    setCurrentStep(1);
  }, []);

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
            {/* Type de transaction - COMPLÈTEMENT CORRIGÉ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type de transaction
              </label>
              <Radio.Group
                value={formData.type}
                onChange={(value) => {
                  console.log('=== CLIC SUR RADIO ===');
                  console.log('🎯 Valeur reçue:', value);
                  console.log('📋 Type de valeur:', typeof value);
                  
                  // CORRECTION: S'assurer que c'est bien une string
                  const finalValue = typeof value === 'object' ? value.code : value;
                  
                  console.log('✅ Valeur finale envoyée:', finalValue);
                  handleChange('type', finalValue);
                }}
                orientation="horizontal"
                name="transactionType"
                color="teal"
              >
                <Radio 
                  value={TRANSACTION_TYPES.expense.code} 
                  label={TRANSACTION_TYPES.expense.name} 
                  description="Argent qui sort"
                />
                <Radio 
                  value={TRANSACTION_TYPES.income.code} 
                  label={TRANSACTION_TYPES.income.name} 
                  description="Argent qui entre"
                />
                <Radio 
                  value={TRANSACTION_TYPES.transfer.code} 
                  label={TRANSACTION_TYPES.transfer.name} 
                  description="Entre comptes"
                />
              </Radio.Group>
              
              {/* Debug affiché à l'écran */}
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <strong>Debug Type:</strong> <code>{formData.type}</code> | 
                <strong> Status:</strong> {formData.type ? '✅ Sélectionné' : '❌ Manquant'}
              </div>
              
              {/* Affichage des erreurs de type */}
              {errors.type && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.type}</p>
              )}
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
            {formData.type === 'transfer' && (
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
            {/* Catégorie et sous-catégorie - CORRIGÉ */}
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
                disabled={!formData.category || subcategoryOptions.length === 0}
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
            {formData.type === 'expense' && formData.account && (
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