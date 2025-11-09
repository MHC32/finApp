// src/features/transactions/pages/TransactionDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Copy,
  MapPin,
  Receipt,
  Calendar,
  Tag,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight
} from 'lucide-react';
import { useTransaction } from '../hooks/useTransactions';
import { useAccount } from '../../accounts/hooks/useAccount';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import Loading from '../../../components/ui/Loading';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';
import EditTransactionModal from '../components/EditTransactionModal';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/format';

/**
 * Page de détails d'une transaction individuelle
 * Affiche toutes les informations avec possibilité d'éditer/supprimer
 */
const TransactionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  
  const {
    currentTransaction,
    isLoading,
    getTransaction,
    deleteTransaction,
    duplicateTransaction
  } = useTransaction();

  const { accounts, getAccounts } = useAccount();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Charger la transaction
  useEffect(() => {
    if (id) {
      loadTransaction();
    }
  }, [id]);

  useEffect(() => {
    if (accounts.length === 0) {
      getAccounts();
    }
  }, []);

  const loadTransaction = async () => {
    const result = await getTransaction(id);
    if (!result.success) {
      navigate('/transactions');
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    loadTransaction();
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      const result = await deleteTransaction(id);
      if (result.success) {
        navigate('/transactions');
      }
    }
  };

  const handleDuplicate = async () => {
    const result = await duplicateTransaction(id);
    if (result.success) {
      navigate('/transactions');
    }
  };

  const isDark = mode === 'dark';

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Transactions', href: '/transactions' },
    { label: currentTransaction?.description || 'Détails', href: `/transactions/${id}` }
  ];

  if (isLoading || !currentTransaction) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card variant="glass" className="p-12">
            <Loading type="spinner" text="Chargement de la transaction..." />
          </Card>
        </div>
      </div>
    );
  }

  const categoryInfo = TRANSACTION_CATEGORIES[currentTransaction.category] || TRANSACTION_CATEGORIES.autre;

  // Icône selon le type
  const getTypeIcon = () => {
    switch (currentTransaction.type) {
      case TRANSACTION_TYPES.income.code:
        return <ArrowUpRight className="w-8 h-8 text-green-600 dark:text-green-400" />;
      case TRANSACTION_TYPES.expense.code:
        return <ArrowDownLeft className="w-8 h-8 text-red-600 dark:text-red-400" />;
      case TRANSACTION_TYPES.transfer.code:
        return <ArrowLeftRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  // Couleur du montant
  const getAmountColor = () => {
    switch (currentTransaction.type) {
      case TRANSACTION_TYPES.income.code:
        return 'text-green-600 dark:text-green-400';
      case TRANSACTION_TYPES.expense.code:
        return 'text-red-600 dark:text-red-400';
      case TRANSACTION_TYPES.transfer.code:
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Signe du montant
  const getAmountSign = () => {
    switch (currentTransaction.type) {
      case TRANSACTION_TYPES.income.code:
        return '+';
      case TRANSACTION_TYPES.expense.code:
        return '-';
      case TRANSACTION_TYPES.transfer.code:
        return '→';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate('/transactions')}
          >
            Retour
          </Button>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Header avec montant et actions */}
        <Card variant="glass" className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left - Info principale */}
            <div className="flex items-start gap-6">
              <Avatar
                name={categoryInfo.name}
                size="xl"
                className="bg-gradient-to-br from-teal-500 to-blue-600"
              />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {getTypeIcon()}
                  <span className={`text-4xl font-bold ${getAmountColor()}`}>
                    {getAmountSign()}{formatCurrency(currentTransaction.amount, currentTransaction.currency)}
                  </span>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentTransaction.description}
                </h1>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    color={
                      currentTransaction.type === TRANSACTION_TYPES.income.code ? 'green' :
                      currentTransaction.type === TRANSACTION_TYPES.expense.code ? 'red' : 'blue'
                    }
                  >
                    {TRANSACTION_TYPES[currentTransaction.type]?.name}
                  </Badge>
                  
                  {currentTransaction.isRecurring && (
                    <Badge color="purple" variant="subtle">
                      Récurrent
                    </Badge>
                  )}
                  
                  {currentTransaction.isConfirmed === false && (
                    <Badge color="orange" variant="subtle">
                      En attente
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                icon={Edit3}
                onClick={handleEdit}
              >
                Modifier
              </Button>
              
              <Button
                variant="outline"
                size="md"
                icon={Copy}
                onClick={handleDuplicate}
              >
                Dupliquer
              </Button>
              
              <Button
                variant="outline"
                size="md"
                icon={Trash2}
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Card>

        {/* Contenu principal - 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche - Informations principales */}
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Informations
            </h2>
            
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Description
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {currentTransaction.description}
                </p>
              </div>

              {/* Catégorie */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Catégorie
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: categoryInfo.color }}
                  />
                  <span className="text-lg text-gray-900 dark:text-white">
                    {categoryInfo.name}
                  </span>
                  {currentTransaction.subcategory && (
                    <Badge color="gray" variant="subtle">
                      {currentTransaction.subcategory}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {formatDate(currentTransaction.date)}
                </p>
              </div>

              {/* Compte */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Compte
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {currentTransaction.account?.name || 'Non spécifié'}
                </p>
              </div>

              {/* Compte destinataire (transfert) */}
              {currentTransaction.type === TRANSACTION_TYPES.transfer.code && currentTransaction.toAccount && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Compte destinataire
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {currentTransaction.toAccount.name}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Colonne droite - Métadonnées */}
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Métadonnées
            </h2>
            
            <div className="space-y-6">
              {/* Notes */}
              {currentTransaction.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Notes
                  </label>
                  <p className="text-gray-900 dark:text-white italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    "{currentTransaction.notes}"
                  </p>
                </div>
              )}

              {/* Tags */}
              {currentTransaction.tags && currentTransaction.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currentTransaction.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        color="gray" 
                        variant="subtle"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Localisation */}
              {currentTransaction.hasLocation && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Localisation
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {currentTransaction.location?.name || 
                     currentTransaction.location?.address || 
                     'Localisation enregistrée'}
                  </p>
                </div>
              )}

              {/* Reçu */}
              {currentTransaction.hasReceipt && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4" />
                    Reçu
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReceiptModal(true)}
                  >
                    Voir le reçu
                  </Button>
                </div>
              )}

              {/* Informations système */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-3">
                  Informations système
                </label>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <p>
                    <span className="font-medium">Créé le:</span> {formatDate(currentTransaction.createdAt)}
                  </p>
                  {currentTransaction.updatedAt && currentTransaction.updatedAt !== currentTransaction.createdAt && (
                    <p>
                      <span className="font-medium">Modifié le:</span> {formatDate(currentTransaction.updatedAt)}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">ID:</span> {currentTransaction._id}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={currentTransaction}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        onDelete={handleDelete}
        accounts={accounts}
      />

      {/* Receipt Modal */}
      {currentTransaction.hasReceipt && showReceiptModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowReceiptModal(false)}
        >
          <Card 
            variant="glass" 
            className="max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Reçu de la transaction
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReceiptModal(false)}
              >
                Fermer
              </Button>
            </div>
            
            <div className="flex flex-col items-center">
              <img 
                src={currentTransaction.receipt?.url} 
                alt={`Reçu pour ${currentTransaction.description}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                <p>Reçu uploadé le: {formatDate(currentTransaction.receipt?.uploadedAt)}</p>
                {currentTransaction.receipt?.originalName && (
                  <p>Nom original: {currentTransaction.receipt.originalName}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransactionDetailsPage;