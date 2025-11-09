import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  MapPin, 
  Receipt, 
  Calendar, 
  Tag, 
  FileText,
  Edit3,
  Trash2,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight
} from 'lucide-react';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/format';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import Modal from '../../../components/ui/Modal';

/**
 * Composant TransactionDetails - Détails complets d'une transaction
 * 
 * @example
 * <TransactionDetails
 *   transaction={transaction}
 *   isOpen={isDetailsOpen}
 *   onClose={handleCloseDetails}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onDuplicate={handleDuplicate}
 * />
 */
const TransactionDetails = ({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  className = ''
}) => {
  const { mode } = useSelector((state) => state.theme);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const isDark = mode === 'dark';
  const categoryInfo = TRANSACTION_CATEGORIES[transaction.category] || TRANSACTION_CATEGORIES.autre;

  // Icône selon le type
  const getTypeIcon = () => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case TRANSACTION_TYPES.EXPENSE:
        return <ArrowDownLeft className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case TRANSACTION_TYPES.TRANSFER:
        return <ArrowLeftRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  // Couleur du montant selon le type
  const getAmountColor = () => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return 'text-green-600 dark:text-green-400';
      case TRANSACTION_TYPES.EXPENSE:
        return 'text-red-600 dark:text-red-400';
      case TRANSACTION_TYPES.TRANSFER:
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Signe du montant
  const getAmountSign = () => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return '+';
      case TRANSACTION_TYPES.EXPENSE:
        return '-';
      case TRANSACTION_TYPES.TRANSFER:
        return '→';
      default:
        return '';
    }
  };

  if (!transaction) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails de la Transaction"
        size="lg"
        className={className}
      >
        <div className="space-y-6">
          {/* Header avec montant et actions */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  name={categoryInfo.name}
                  size="lg"
                  className="bg-gradient-to-br from-teal-500 to-blue-600"
                />
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon()}
                    <span className={`text-2xl font-bold ${getAmountColor()}`}>
                      {getAmountSign()}{formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      color={
                        transaction.type === TRANSACTION_TYPES.INCOME ? 'green' :
                        transaction.type === TRANSACTION_TYPES.EXPENSE ? 'red' : 'blue'
                      }
                    >
                      {transaction.type}
                    </Badge>
                    
                    {transaction.isRecurring && (
                      <Badge color="purple" variant="subtle">
                        Récurrent
                      </Badge>
                    )}
                    
                    {transaction.isConfirmed === false && (
                      <Badge color="orange" variant="subtle">
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={() => onEdit(transaction)}
                >
                  Modifier
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={Copy}
                  onClick={() => onDuplicate(transaction)}
                >
                  Dupliquer
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDelete(transaction)}
                  className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>

          {/* Informations principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche - Informations de base */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Informations
              </h3>
              
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">
                    {transaction.description}
                  </p>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Catégorie
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                    <span className="text-gray-900 dark:text-white">
                      {categoryInfo.name}
                    </span>
                    {transaction.subcategory && (
                      <Badge color="gray" variant="subtle" size="sm">
                        {transaction.subcategory}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                {/* Compte */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Compte
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {transaction.account?.name || 'Non spécifié'}
                  </p>
                </div>

                {/* Compte destinataire (transfert) */}
                {transaction.type === TRANSACTION_TYPES.TRANSFER && transaction.toAccount && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Compte destinataire
                    </label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {transaction.toAccount.name}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Colonne droite - Métadonnées */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Métadonnées
              </h3>
              
              <div className="space-y-4">
                {/* Notes */}
                {transaction.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notes
                    </label>
                    <p className="text-gray-900 dark:text-white mt-1 italic">
                      "{transaction.notes}"
                    </p>
                  </div>
                )}

                {/* Tags */}
                {transaction.tags && transaction.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {transaction.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          color="gray" 
                          variant="subtle"
                          size="sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Localisation */}
                {transaction.hasLocation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Localisation
                    </label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {transaction.location?.name || transaction.location?.address || 'Localisation enregistrée'}
                    </p>
                  </div>
                )}

                {/* Reçu */}
                {transaction.hasReceipt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Receipt className="w-4 h-4" />
                      Reçu
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReceipt(true)}
                      className="mt-2"
                    >
                      Voir le reçu
                    </Button>
                  </div>
                )}

                {/* Informations système */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Informations système
                  </label>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    <p>Créé le: {formatDate(transaction.createdAt)}</p>
                    {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
                      <p>Modifié le: {formatDate(transaction.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Modal>

      {/* Modal du reçu */}
      {transaction.hasReceipt && (
        <Modal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          title="Reçu de la transaction"
          size="xl"
        >
          <div className="flex flex-col items-center">
            <img 
              src={transaction.receipt?.url} 
              alt={`Reçu pour ${transaction.description}`}
              className="max-w-full max-h-96 object-contain rounded-lg"
            />
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Reçu uploadé le: {formatDate(transaction.receipt?.uploadedAt)}</p>
              {transaction.receipt?.originalName && (
                <p>Nom original: {transaction.receipt.originalName}</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

TransactionDetails.propTypes = {
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
    isRecurring: PropTypes.bool,
    isConfirmed: PropTypes.bool,
    account: PropTypes.shape({
      name: PropTypes.string
    }),
    toAccount: PropTypes.shape({
      name: PropTypes.string
    }),
    hasLocation: PropTypes.bool,
    location: PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string
    }),
    hasReceipt: PropTypes.bool,
    receipt: PropTypes.shape({
      url: PropTypes.string,
      originalName: PropTypes.string,
      uploadedAt: PropTypes.string
    }),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  className: PropTypes.string
};

export default TransactionDetails;