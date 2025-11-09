import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  MapPin, 
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight
} from 'lucide-react';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/format';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

/**
 * Composant TransactionCard - Carte d'affichage d'une transaction
 * 
 * @example
 * <TransactionCard
 *   transaction={transaction}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onDuplicate={handleDuplicate}
 * />
 */
const TransactionCard = ({ 
  transaction, 
  onEdit, 
  onDelete, 
  onDuplicate,
  showActions = true,
  className = '' 
}) => {
  const { mode } = useSelector((state) => state.theme);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const isDark = mode === 'dark';
  const categoryInfo = TRANSACTION_CATEGORIES[transaction.category] || TRANSACTION_CATEGORIES.autre;
  
  // Icône selon le type
  const getTypeIcon = () => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case TRANSACTION_TYPES.EXPENSE:
        return <ArrowDownLeft className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case TRANSACTION_TYPES.TRANSFER:
        return <ArrowLeftRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
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

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const description = transaction.description || 'Sans description';
  const displayDescription = showFullDescription 
    ? description 
    : description.length > 60 
      ? `${description.substring(0, 60)}...` 
      : description;

  return (
    <Card 
      variant="glass" 
      hoverable 
      className={`transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        {/* Left Section - Icon & Main Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Category Avatar */}
          <Avatar
            name={categoryInfo.name}
            size="md"
            className="bg-gradient-to-br from-teal-500 to-blue-600"
          />

          {/* Transaction Details */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {getTypeIcon()}
                <span className={`text-lg font-semibold ${getAmountColor()}`}>
                  {getAmountSign()}{formatCurrency(transaction.amount, transaction.currency)}
                </span>
              </div>
              
              {/* Badges */}
              <div className="flex items-center gap-1">
                <Badge 
                  size="sm" 
                  color={
                    transaction.type === TRANSACTION_TYPES.INCOME ? 'green' :
                    transaction.type === TRANSACTION_TYPES.EXPENSE ? 'red' : 'blue'
                  }
                >
                  {transaction.type}
                </Badge>
                
                {transaction.isRecurring && (
                  <Badge size="sm" color="purple" variant="subtle">
                    Récurrent
                  </Badge>
                )}
                
                {transaction.hasReceipt && (
                  <Badge size="sm" color="teal" variant="subtle" dot>
                    Reçu
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p 
                className={`text-gray-900 dark:text-white font-medium cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors ${
                  description.length > 60 ? 'truncate' : ''
                }`}
                onClick={toggleDescription}
                title={description}
              >
                {displayDescription}
              </p>
              {description.length > 60 && (
                <button
                  onClick={toggleDescription}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline mt-1"
                >
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </button>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoryInfo.color }}
                />
                {categoryInfo.name}
                {transaction.subcategory && (
                  <span className="text-gray-500"> • {transaction.subcategory}</span>
                )}
              </span>
              
              <span>{formatDate(transaction.date)}</span>
              
              {transaction.account?.name && (
                <span>• {transaction.account.name}</span>
              )}

              {/* Location Indicator */}
              {transaction.hasLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Localisation
                </span>
              )}
            </div>

            {/* Notes */}
            {transaction.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{transaction.notes}"
              </p>
            )}

            {/* Tags */}
            {transaction.tags && transaction.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {transaction.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    size="sm" 
                    color="gray" 
                    variant="subtle"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        {showActions && (
          <div className="flex items-center gap-1 ml-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              icon={Edit3}
              onClick={() => onEdit(transaction)}
              className="hover:bg-teal-50 dark:hover:bg-teal-900/20"
            />
            
            <Button
              variant="ghost"
              size="sm"
              icon={Copy}
              onClick={() => onDuplicate(transaction)}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => onDelete(transaction)}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

TransactionCard.propTypes = {
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
    account: PropTypes.shape({
      name: PropTypes.string
    }),
    hasLocation: PropTypes.bool,
    hasReceipt: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  showActions: PropTypes.bool,
  className: PropTypes.string
};

export default TransactionCard;