// src/pages/transactions/AddTransaction.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Receipt } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { Button, Card } from '../../components/ui';
import TransactionForm from '../../components/forms/TransactionForm';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTransaction, setCreatedTransaction] = useState(null);

  const handleSubmit = async (transactionData) => {
    try {
      const newTransaction = await addTransaction(transactionData);
      setCreatedTransaction(newTransaction);
      setIsSuccess(true);
      
      // Rediriger vers la liste après 2 secondes
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: 'HTG',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction enregistrée !</h2>
            <p className="text-gray-600 mb-4">
              Transaction "{createdTransaction?.description}" de{' '}
              <span className={`font-semibold ${createdTransaction?.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {createdTransaction?.amount >= 0 ? '+' : '-'}{formatCurrency(createdTransaction?.amount)}
              </span>
              {' '}a été ajoutée avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers vos transactions...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💰 Nouvelle Transaction</h1>
          <p className="text-gray-600">Enregistrez un revenu ou une dépense</p>
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Receipt className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">💡 Conseils pour saisir une transaction</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Utilisez un <strong>montant positif</strong> pour les revenus (ex: +1000)</li>
              <li>• Utilisez un <strong>montant négatif</strong> pour les dépenses (ex: -500)</li>
              <li>• Choisissez la bonne catégorie pour un meilleur suivi</li>
              <li>• Sélectionnez le compte concerné par cette transaction</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Formulaire */}
      <Card>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>

      {/* Actions rapides */}
      <Card title="🚀 Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              // Pré-remplir avec des données courantes
              const today = new Date().toISOString().split('T')[0];
              // Cette logique pourrait être implémentée pour pré-remplir le formulaire
            }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">💰</div>
            <p className="font-medium text-gray-900">Revenus récurrents</p>
            <p className="text-sm text-gray-600">Salaire, freelance, bonus...</p>
          </button>

          <button
            onClick={() => {
              // Pré-remplir avec des données de dépenses
            }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">🛒</div>
            <p className="font-medium text-gray-900">Dépenses courantes</p>
            <p className="text-sm text-gray-600">Courses, transport, repas...</p>
          </button>

          <button
            onClick={() => {
              // Pré-remplir avec des données de transfert
            }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">↔️</div>
            <p className="font-medium text-gray-900">Transferts</p>
            <p className="text-sm text-gray-600">Entre comptes, famille...</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AddTransaction;