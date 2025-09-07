// src/pages/transactions/AddTransaction.jsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Receipt, Info } from 'lucide-react';
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
      console.log('📥 === NOUVELLE TRANSACTION SOUMISE ===');
      console.log('Données du formulaire:', transactionData);
      
      const newTransaction = await addTransaction(transactionData);
      setCreatedTransaction(newTransaction);
      setIsSuccess(true);
      
      // Rediriger vers la liste après 3 secondes
      setTimeout(() => {
        navigate('/transactions');
      }, 3000);
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

  // ✅ CORRECTION BUG 1: Formatage amélioré du type de transaction
  const getTransactionTypeInfo = (transaction) => {
    if (!transaction) return { type: '', color: '', icon: '' };
    
    if (transaction.amount > 0) {
      return {
        type: 'Revenu',
        color: 'text-green-600',
        icon: '💰',
        impact: 'augmenté'
      };
    } else {
      return {
        type: 'Dépense',
        color: 'text-red-600',
        icon: '💸',
        impact: 'diminué'
      };
    }
  };

  if (isSuccess) {
    const typeInfo = getTransactionTypeInfo(createdTransaction);
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {typeInfo.icon} {typeInfo.type} enregistré{typeInfo.type === 'Dépense' ? 'e' : ''} !
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Description :</span>
                  <span className="font-medium">{createdTransaction?.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant :</span>
                  <span className={`font-bold ${typeInfo.color}`}>
                    {createdTransaction?.amount >= 0 ? '+' : '-'}{formatCurrency(createdTransaction?.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impact :</span>
                  <span className={typeInfo.color}>
                    Solde {typeInfo.impact} de {formatCurrency(createdTransaction?.amount)}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Redirection vers vos transactions dans quelques secondes...
            </p>
            
            <Button onClick={() => navigate('/transactions')}>
              Voir mes transactions
            </Button>
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
          <p className="text-gray-600">Enregistrez un revenu, une dépense ou un transfert</p>
        </div>
      </div>

      {/* ✅ CORRECTION BUG 1: Instructions améliorées */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-2">✨ Nouveau système simplifié</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="font-medium text-green-800 mb-1">💰 Revenus</div>
                  <div className="text-green-700 text-xs">
                    Saisissez le montant en positif<br/>
                    Le solde augmentera automatiquement
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="font-medium text-red-800 mb-1">💸 Dépenses</div>
                  <div className="text-red-700 text-xs">
                    Saisissez le montant en positif<br/>
                    Le solde diminuera automatiquement
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="font-medium text-blue-800 mb-1">↔️ Transferts</div>
                  <div className="text-blue-700 text-xs">
                    Entre vos comptes<br/>
                    Pas d'impact sur le total
                  </div>
                </div>
              </div>
              <p className="text-blue-700 mt-2">
                <strong>Plus besoin de saisir des montants négatifs !</strong> Le système calcule automatiquement l'impact sur vos soldes.
              </p>
            </div>
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

      {/* ✅ NOUVEAU: Exemples pratiques */}
      <Card title="💡 Exemples pratiques">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Exemples de revenus :</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span>💼 Salaire janvier</span>
                <span className="text-green-600 font-medium">+25,000 HTG</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span>💻 Projet freelance</span>
                <span className="text-green-600 font-medium">+5,000 HTG</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span>🎁 Cadeau reçu</span>
                <span className="text-green-600 font-medium">+1,000 HTG</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Exemples de dépenses :</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>🍽️ Restaurant</span>
                <span className="text-red-600 font-medium">-500 HTG</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>🚗 Carburant</span>
                <span className="text-red-600 font-medium">-1,200 HTG</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>🛒 Courses</span>
                <span className="text-red-600 font-medium">-3,000 HTG</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddTransaction;