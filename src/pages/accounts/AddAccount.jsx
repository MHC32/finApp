// src/pages/accounts/AddAccount.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card } from '../../components/ui';
import AccountForm from '../../components/forms/AccountForm';

const AddAccount = () => {
  const navigate = useNavigate();
  const { addAccount } = useAccounts();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);

  const handleSubmit = async (accountData) => {
    try {
      const newAccount = await addAccount(accountData);
      setCreatedAccount(newAccount);
      setIsSuccess(true);
      
      // Rediriger vers la liste après 2 secondes
      setTimeout(() => {
        navigate('/accounts');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/accounts');
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compte créé avec succès !</h2>
            <p className="text-gray-600 mb-4">
              Le compte "{createdAccount?.name}" a été ajouté à votre portefeuille.
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers vos comptes...
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
          <h1 className="text-2xl font-bold text-gray-900">🏦 Nouveau Compte Bancaire</h1>
          <p className="text-gray-600">Ajoutez un nouveau compte à votre portefeuille</p>
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <AccountForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
};

export default AddAccount;