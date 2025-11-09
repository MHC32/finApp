import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Plus, 
  Clock, 
  Star,
  Zap,
  Edit3
} from 'lucide-react';
import { QUICK_TRANSACTION_TEMPLATES, TRANSACTION_CATEGORIES } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/format';
import { useTransaction } from '../hooks/useTransactions';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

/**
 * Composant QuickTransactionTemplates - Templates de transactions rapides
 * 
 * @example
 * <QuickTransactionTemplates
 *   onTemplateSelect={handleTemplateSelect}
 *   accounts={accounts}
 *   className="mb-6"
 * />
 */
const QuickTransactionTemplates = ({
  onTemplateSelect,
  accounts = [],
  className = ''
}) => {
  const { createTransaction, isCreating } = useTransaction();
  const { mode } = useSelector((state) => state.theme);
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    label: '',
    amount: '',
    currency: 'HTG',
    category: ''
  });
  const [recentTemplates, setRecentTemplates] = useState([]);

  const isDark = mode === 'dark';

  // Templates prédéfinis + récents
  const allTemplates = [
    ...QUICK_TRANSACTION_TEMPLATES,
    ...recentTemplates
  ];

  // Gérer la sélection d'un template
  const handleTemplateSelect = async (template) => {
    try {
      // Trouver un compte par défaut
      const defaultAccount = accounts.find(acc => acc.isDefault) || accounts[0];
      
      if (!defaultAccount) {
        console.error('Aucun compte disponible');
        return;
      }

      const transactionData = {
        amount: template.amount,
        currency: template.currency || 'HTG',
        description: template.label,
        category: template.category,
        type: TRANSACTION_CATEGORIES[template.category]?.type === 'income' ? 'income' : 'expense',
        account: defaultAccount._id,
        date: new Date().toISOString().split('T')[0]
      };

      const result = await createTransaction(transactionData);
      
      if (result.success) {
        // Ajouter aux templates récents
        addToRecentTemplates(template);
        onTemplateSelect?.(result.data);
      }
    } catch (error) {
      console.error('Erreur création transaction rapide:', error);
    }
  };

  // Ajouter un template aux récents
  const addToRecentTemplates = (template) => {
    setRecentTemplates(prev => {
      const existingIndex = prev.findIndex(t => 
        t.label === template.label && t.amount === template.amount
      );
      
      if (existingIndex !== -1) {
        // Déplacer en tête
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        return [existing, ...updated];
      }
      
      // Limiter à 5 templates récents
      return [template, ...prev.slice(0, 4)];
    });
  };

  // Créer un template personnalisé
  const handleCreateCustomTemplate = () => {
    if (!customTemplate.label || !customTemplate.amount || !customTemplate.category) {
      return;
    }

    const newTemplate = {
      label: customTemplate.label,
      amount: parseFloat(customTemplate.amount),
      currency: customTemplate.currency,
      category: customTemplate.category
    };

    addToRecentTemplates(newTemplate);
    setShowCustomModal(false);
    setCustomTemplate({ label: '', amount: '', currency: 'HTG', category: '' });
    
    // Utiliser directement le nouveau template
    handleTemplateSelect(newTemplate);
  };

  // Options de catégories pour le template personnalisé
  const categoryOptions = Object.entries(TRANSACTION_CATEGORIES)
    .filter(([key, category]) => category.type === 'expense' || category.type === 'both')
    .map(([key, category]) => ({
      value: key,
      label: category.name
    }));

  return (
    <>
      <Card variant="glass" className={className}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transactions Rapides
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Templates pour transactions fréquentes
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setShowCustomModal(true)}
          >
            Personnaliser
          </Button>
        </div>

        {/* Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Templates prédéfinis */}
          {allTemplates.map((template, index) => {
            const categoryInfo = TRANSACTION_CATEGORIES[template.category] || TRANSACTION_CATEGORIES.autre;
            const isRecent = index >= QUICK_TRANSACTION_TEMPLATES.length;
            
            return (
              <Card
                key={`${template.label}-${template.amount}-${index}`}
                variant="glass"
                hoverable
                clickable
                onClick={() => handleTemplateSelect(template)}
                className="p-4 text-center transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3">
                  {isRecent ? (
                    <Badge color="blue" size="sm" icon={Clock}>
                      Récent
                    </Badge>
                  ) : (
                    <Badge color="teal" size="sm" icon={Star}>
                      Populaire
                    </Badge>
                  )}
                  
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: categoryInfo.color }}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {template.label}
                  </h4>
                  
                  <p className={`text-lg font-bold ${
                    categoryInfo.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(template.amount, template.currency)}
                  </p>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {categoryInfo.name}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  className="w-full mt-3"
                  loading={isCreating}
                >
                  Utiliser
                </Button>
              </Card>
            );
          })}

          {/* Carte pour créer un template personnalisé */}
          <Card
            variant="outline"
            hoverable
            clickable
            onClick={() => setShowCustomModal(true)}
            className="p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-200"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-full">
                <Edit3 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Template Personnalisé
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Créer votre propre template
              </p>
            </div>
          </Card>
        </div>

        {/* Aide */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                Astuce rapide
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Les templates que vous utilisez fréquemment apparaîtront ici pour un accès rapide.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal de création de template personnalisé */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Créer un Template Personnalisé"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={customTemplate.label}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Courses supermarché"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant
              </label>
              <input
                type="number"
                value={customTemplate.amount}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Devise
              </label>
              <select
                value={customTemplate.currency}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="HTG">HTG</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={customTemplate.category}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setShowCustomModal(false)}
            >
              Annuler
            </Button>
            
            <Button
              onClick={handleCreateCustomTemplate}
              disabled={!customTemplate.label || !customTemplate.amount || !customTemplate.category}
              icon={Plus}
            >
              Créer le Template
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

QuickTransactionTemplates.propTypes = {
  onTemplateSelect: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isDefault: PropTypes.bool
  })),
  className: PropTypes.string
};

export default QuickTransactionTemplates;