// src/features/accounts/components/AccountCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Building,
  Wallet,
  Star,
  Archive
} from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import Alert from '../../../components/ui/Alert';

/**
 * Composant Card pour afficher un compte bancaire
 * Avec actions rapides et indicateurs visuels
 */
const AccountCard = ({ account, onEdit, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { setDefaultAccount, archiveAccount, deleteAccount, isUpdating, isDeleting } = useAccount();

  // Icônes selon le type de compte
  const getAccountIcon = (type) => {
    const icons = {
      checking: CreditCard,
      savings: TrendingUp,
      credit: TrendingDown,
      cash: Wallet,
      investment: TrendingUp,
      loan: TrendingDown
    };
    return icons[type] || Building;
  };

  // Couleur selon le type de compte
  const getAccountColor = (type) => {
    const colors = {
      checking: 'blue',
      savings: 'green',
      credit: 'red',
      cash: 'teal',
      investment: 'purple',
      loan: 'orange'
    };
    return colors[type] || 'gray';
  };

  // Formater le solde
  const formatBalance = (balance, currency) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(balance);
  };

  // Actions du menu
  const handleSetDefault = async () => {
    await setDefaultAccount(account._id);
    setShowMenu(false);
  };

  const handleArchive = async () => {
    await archiveAccount(account._id);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      await deleteAccount(account._id);
      setShowMenu(false);
    }
  };

  const Icon = getAccountIcon(account.type);
  const color = getAccountColor(account.type);

  return (
    <Card 
      variant="glass" 
      hoverable 
      className="relative"
      onClick={onViewDetails}
    >
      {/* En-tête avec menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
            <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {account.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {account.bankName} • {account.accountNumber || 'N/A'}
            </p>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-10 w-48 glass-intense-light dark:glass-intense-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(account);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                Modifier
              </button>
              
              {!account.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetDefault();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
                  disabled={isUpdating}
                >
                  <Star className="w-4 h-4" />
                  Définir par défaut
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive();
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
                disabled={isUpdating}
              >
                <Archive className="w-4 h-4" />
                Archiver
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={isDeleting}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Solde et indicateurs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatBalance(account.currentBalance, account.currency)}
          </span>
          
          <div className="flex items-center gap-2">
            {account.isDefault && (
              <Badge color="teal" size="sm">
                <Star className="w-3 h-3" />
                Défaut
              </Badge>
            )}
            
            {!account.isActive && (
              <Badge color="gray" size="sm">
                Inactif
              </Badge>
            )}

            {account.isArchived && (
              <Badge color="orange" size="sm">
                Archivé
              </Badge>
            )}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Type: {account.type}</span>
          <span>Devise: {account.currency}</span>
        </div>

        {/* Description */}
        {account.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {account.description}
          </p>
        )}

        {/* Indicateur d'inclusion dans le total */}
        {!account.includeInTotal && (
          <Badge variant="subtle" color="gray" size="sm">
            Exclu du total général
          </Badge>
        )}
      </div>

      {/* Loading overlay pour actions */}
      {(isUpdating || isDeleting) && (
        <Loading overlay />
      )}
    </Card>
  );
};

AccountCard.propTypes = {
  account: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    bankName: PropTypes.string.isRequired,
    accountNumber: PropTypes.string,
    currency: PropTypes.string.isRequired,
    currentBalance: PropTypes.number.isRequired,
    description: PropTypes.string,
    isDefault: PropTypes.bool,
    isActive: PropTypes.bool,
    isArchived: PropTypes.bool,
    includeInTotal: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
};

export default AccountCard;