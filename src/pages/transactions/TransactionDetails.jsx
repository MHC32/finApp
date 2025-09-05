// src/pages/transactions/TransactionDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  CreditCard, 
  Tag, 
  Receipt,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card, Modal, Badge, LoadingSpinner } from '../../components/ui';
import TransactionForm from '../../components/forms/TransactionForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, updateTransaction, deleteTransaction } = useTransactions();
  const { accounts } = useAccounts();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Chercher la transaction par ID
    const foundTransaction = transactions.find(t => t.id === parseInt(id));
    setTransaction(foundTransaction);
    setLoading(false);
  }, [id, transactions]);

  const handleEdit = async (data) => {
    try {
      await updateTransaction(transaction.id, data);
      setShowEditModal(false);
      // Mettre à jour la transaction locale
      const updatedTransaction = { ...transaction, ...data };
      setTransaction(updatedTransaction);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      setShowDeleteModal(false);
      navigate('/transactions');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: 'HTG',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (category) => {
    const icons = {
      food: '🍽️',
      transport: '🚗',
      housing: '🏠',
      health: '🏥',
      entertainment: '🎉',
      education: '📚',
      shopping: '🛍️',
      income: '💰',
      transfer: '↔️',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      food: 'Alimentation',
      transport: 'Transport',
      housing: 'Logement',
      health: 'Santé',
      entertainment: 'Loisirs',
      education: 'Éducation',
      shopping: 'Achats',
      income: 'Revenus',
      transfer: 'Transfert',
      other: 'Autre'
    };
    return labels[category] || 'Autre';
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      card: 'Carte bancaire',
      cash: 'Espèces',
      transfer: 'Virement',
      check: 'Chèque',
      mobile: 'Paiement mobile'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction non trouvée</h3>
            <p className="text-gray-600 mb-4">
              La transaction demandée n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => navigate('/transactions')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const account = accounts.find(acc => acc.id === transaction.account_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/transactions')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Détails de la transaction</h1>
            <p className="text-gray-600">
              {format(new Date(transaction.date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Transaction principale */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">
              {getTransactionIcon(transaction.category)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{transaction.description}</h2>
              <p className="text-gray-600">
                {getCategoryLabel(transaction.category)}
                {transaction.subcategory && ` • ${transaction.subcategory}`}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
            <Badge variant={transaction.amount >= 0 ? "success" : "danger"}>
              {transaction.amount >= 0 ? 'Revenu' : 'Dépense'}
            </Badge>
          </div>
        </div>

        {/* Détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {format(new Date(transaction.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Compte</p>
                <p className="font-medium">
                  {account ? `${account.name} - ${account.bank_name}` : 'Compte supprimé'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Mode de paiement</p>
                <p className="font-medium">{getPaymentMethodLabel(transaction.payment_method)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Catégorie</p>
                <p className="font-medium">{getCategoryLabel(transaction.category)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Créée le</p>
                <p className="font-medium">
                  {format(new Date(transaction.created_at), 'dd/MM/yyyy à HH:mm')}
                </p>
              </div>
            </div>

            {transaction.updated_at && transaction.updated_at !== transaction.created_at && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Modifiée le</p>
                  <p className="font-medium">
                    {format(new Date(transaction.updated_at), 'dd/MM/yyyy à HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Impact sur le compte */}
      {account && (
        <Card title="💳 Impact sur le compte">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: account.color }}
              />
              <div>
                <h4 className="font-medium text-gray-900">{account.name}</h4>
                <p className="text-sm text-gray-600">{account.bank_name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Solde actuel</p>
              <p className="font-semibold text-lg">
                {formatCurrency(account.current_balance)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions similaires */}
      <Card title="🔍 Transactions similaires">
        <div className="space-y-3">
          {transactions
            .filter(t => 
              t.id !== transaction.id && 
              (t.category === transaction.category || t.account_id === transaction.account_id)
            )
            .slice(0, 3)
            .map(similarTransaction => {
              const similarAccount = accounts.find(acc => acc.id === similarTransaction.account_id);
              return (
                <div key={similarTransaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getTransactionIcon(similarTransaction.category)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{similarTransaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(similarTransaction.date), 'dd MMM yyyy')}
                        {similarAccount && ` • ${similarAccount.name}`}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    similarTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {similarTransaction.amount >= 0 ? '+' : '-'}{formatCurrency(similarTransaction.amount)}
                  </div>
                </div>
              );
            })}
          
          {transactions.filter(t => 
            t.id !== transaction.id && 
            (t.category === transaction.category || t.account_id === transaction.account_id)
          ).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucune transaction similaire trouvée
            </p>
          )}
        </div>
      </Card>

      {/* Modal de modification */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier la transaction"
        size="lg"
      >
        <TransactionForm
          initialData={transaction}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer la transaction"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer la transaction "{transaction.description}" ?
            Cette action est irréversible et affectera le solde de votre compte.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 font-medium">Impact :</span>
              <span className="text-red-800">
                Le solde de {account?.name} sera ajusté de{' '}
                {transaction.amount >= 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
            >
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionDetails;