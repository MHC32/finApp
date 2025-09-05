// src/pages/accounts/AccountsList.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, CreditCard, DollarSign } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card, Modal, Badge, LoadingSpinner } from '../../components/ui';
import AccountForm from '../../components/forms/AccountForm';

const AccountsList = () => {
  const { accounts, loading, addAccount, updateAccount, deleteAccount, getTotalBalance } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);

  // Types de comptes définis localement
  const accountTypes = [
    { value: 'checking', label: 'Compte Courant' },
    { value: 'savings', label: 'Compte d\'Épargne' },
    { value: 'credit', label: 'Carte de Crédit' },
    { value: 'cash', label: 'Espèces' }
  ];

  const handleAddAccount = async (data) => {
    try {
      await addAccount(data);
      setShowForm(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleUpdateAccount = async (data) => {
    try {
      await updateAccount(editingAccount.id, data);
      setEditingAccount(null);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(deletingAccount.id);
      setDeletingAccount(null);
    } catch (err) {
      // Error handled in hook
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: currency === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🏦 Mes Comptes Bancaires</h1>
          <p className="text-gray-600">Gérez vos comptes et suivez vos soldes</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Compte
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total des Comptes</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Solde Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalBalance(), 'HTG')}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Comptes Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {accounts.filter(acc => acc.is_active).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun compte</h3>
            <p className="text-gray-600 mb-4">Commencez par ajouter votre premier compte bancaire</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un compte
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: account.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600">{account.bank_name}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingAccount(account)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingAccount(account)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Solde</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(account.current_balance, account.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge variant="default">
                    {accountTypes.find(t => t.value === account.account_type)?.label || 'Autre'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Statut</span>
                  <div className="flex items-center space-x-1">
                    {account.is_active ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Badge variant={account.is_active ? "success" : "default"}>
                      {account.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Account Modal */}
      <Modal
        isOpen={showForm || editingAccount}
        onClose={() => {
          setShowForm(false);
          setEditingAccount(null);
        }}
        title={editingAccount ? "Modifier le compte" : "Nouveau compte"}
        size="lg"
      >
        <AccountForm
          initialData={editingAccount}
          onSubmit={editingAccount ? handleUpdateAccount : handleAddAccount}
          onCancel={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        title="Supprimer le compte"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le compte "{deletingAccount?.name}" ?
            Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setDeletingAccount(null)}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountsList;