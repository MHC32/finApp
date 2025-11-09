import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Save,
  X,
  Loader2,
  Trash2
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
import Alert from '../../../components/ui/Alert';
import { formatCurrency } from '../../../utils/format';

/**
 * Modal d'édition de transaction
 * 
 * @example
 * <EditTransactionModal
 *   transaction={selectedTransaction}
 *   isOpen={isEditModalOpen}
 *   onClose={() => setIsEditModalOpen(false)}
 *   onSuccess={handleTransactionUpdated}
 *   onDelete={handleTransactionDeleted}
 * />
 */
const EditTransactionModal = ({
  transaction,
  isOpen,
  onClose,
  onSuccess,
  onDelete,
  accounts = [],
  className = ''
}) => {
  const { updateTransaction, deleteTransaction, isUpdating, isDeleting } = useTransaction();
  const { mode } = useSelector((state) => state.theme);
  
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isDark = mode === 'dark';

  // Initialiser le formulaire avec les données de la transaction
  useEffect(() => {
    if (transaction && isOpen) {
      setFormData({
        amount: transaction.amount?.toString() || '',
        currency: transaction.currency || 'HTG',
        description: transaction.description || '',
        category: transaction.category || '',
        subcategory: transaction.subcategory || '',
        account: transaction.account?._id || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: transaction.notes || '',
        tags: Array.isArray(transaction.tags) ? transaction.tags.join(', ') : transaction.tags || ''
      });
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [transaction, isOpen]);

  // Options pour les selects
  const categoryOptions = Object.entries(TRANSACTION_CATEGORIES)
    .filter(([key, category]) => category.type === 'both' || category.type === transaction?.type)
    .map(([key, category]) => ({
      value: key,
      label: category.name,
      color: category.color
    }));

  const accountOptions = accounts.map(account => ({
    value: account._id,
    label: `${account.name} (${HAITI_BANKS[account.bank]?.name || account.bank}) - ${account.currentBalance} ${account.currency}`
  }));

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
      
      return newData;
    });

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const updateData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      const result = await updateTransaction(transaction._id, updateData);
      
      if (result.success) {
        onSuccess?.(result.data);
        onClose();
      }
    } catch (error) {
      console.error('Erreur modification transaction:', error);
    }
  };

  // Supprimer la transaction
  const handleDelete = async () => {
    try {
      const result = await deleteTransaction(transaction._id);
      
      if (result.success) {
        onDelete?.(transaction._id);
        onClose();
      }
    } catch (error) {
      console.error('Erreur suppression transaction:', error);
    }
  };

  if (!transaction) return null;

  return (
    <>
      <Modal
        isOpen={isOpen && !showDeleteConfirm}
        onClose={onClose}
        title="Modifier la Transaction"
        size="lg"
        className={className}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations sur la transaction originale */}
          <Alert
            type="info"
            variant="subtle"
            title="Transaction originale"
            description={`Type: ${transaction.type} • Créée le: ${new Date(transaction.createdAt).toLocaleDateString('fr-HT')}`}
          />

          {/* Formulaire d'édition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Montant et devise */}
            <FormCurrencyInput
              label="Montant"
              name="amount"
              value={formData.amount || ''}
              onChange={(value) => handleChange('amount', value)}
              currency={formData.currency}
              onCurrencyChange={(value) => handleChange('currency', value)}
              error={errors.amount}
              required
            />

            {/* Date */}
            <FormDatePicker
              label="Date"
              name="date"
              value={formData.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />

            {/* Description */}
            <div className="md:col-span-2">
              <FormInput
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description de la transaction..."
                error={errors.description}
                required
              />
            </div>

            {/* Catégorie et sous-catégorie */}
            <FormSelect
              label="Catégorie"
              name="category"
              options={categoryOptions}
              value={formData.category || ''}
              onChange={(value) => handleChange('category', value)}
              placeholder="Sélectionner une catégorie"
              error={errors.category}
              required
            />

            <FormSelect
              label="Sous-catégorie"
              name="subcategory"
              options={subcategoryOptions}
              value={formData.subcategory || ''}
              onChange={(value) => handleChange('subcategory', value)}
              placeholder="Sous-catégorie (optionnel)"
              disabled={!formData.category}
            />

            {/* Compte */}
            <div className="md:col-span-2">
              <FormSelect
                label="Compte"
                name="account"
                options={accountOptions}
                value={formData.account || ''}
                onChange={(value) => handleChange('account', value)}
                placeholder="Sélectionner un compte"
                error={errors.account}
                required
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <FormTextarea
                label="Notes"
                name="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Notes supplémentaires..."
                rows={3}
                optional
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <FormInput
                label="Tags"
                name="tags"
                value={formData.tags || ''}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3..."
                helperText="Séparez les tags par des virgules"
                optional
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              icon={Trash2}
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isUpdating}
              className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Supprimer
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isUpdating}
              >
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={isUpdating}
                icon={isUpdating ? Loader2 : Save}
              >
                {isUpdating ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <Alert
            type="error"
            title="Attention"
            description="Cette action est irréversible. La transaction sera définitivement supprimée."
          />

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white">
              {transaction.description}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(transaction.amount, transaction.currency)} • {TRANSACTION_CATEGORIES[transaction.category]?.name}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              loading={isDeleting}
              icon={Trash2}
              className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

EditTransactionModal.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.oneOf(Object.values(TRANSACTION_TYPES)).isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    subcategory: PropTypes.string,
    date: PropTypes.string.isRequired,
    currency: PropTypes.string,
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    account: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onDelete: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    currentBalance: PropTypes.number.isRequired
  })),
  className: PropTypes.string
};

export default EditTransactionModal;