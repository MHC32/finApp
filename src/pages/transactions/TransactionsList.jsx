// src/pages/transactions/TransactionsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Edit, Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card, Modal, Badge, LoadingSpinner, Input } from '../../components/ui';
import TransactionForm from '../../components/forms/TransactionForm';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

const TransactionsList = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction, getStats } = useTransactions();
  const { accounts } = useAccounts();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  
  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    account_id: '',
    dateFrom: startOfMonth(new Date()).toISOString().split('T')[0],
    dateTo: endOfMonth(new Date()).toISOString().split('T')[0]
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Statistiques pour la période actuelle
  const stats = getStats();

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      setShowForm(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleUpdateTransaction = async (data) => {
    try {
      await updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    } catch (err) {
      // Error handled in hook
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

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    if (filters.account_id && transaction.account_id !== parseInt(filters.account_id)) {
      return false;
    }
    const transactionDate = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (filters.dateFrom && transactionDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && transactionDate > filters.dateTo) {
      return false;
    }
    return true;
  });

  // Grouper par date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  const categories = [
    { value: 'food', label: '🍽️ Alimentation' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'housing', label: '🏠 Logement' },
    { value: 'health', label: '🏥 Santé' },
    { value: 'entertainment', label: '🎉 Loisirs' },
    { value: 'education', label: '📚 Éducation' },
    { value: 'shopping', label: '🛍️ Achats' },
    { value: 'income', label: '💰 Revenus' },
    { value: 'transfer', label: '↔️ Transfert' },
    { value: 'other', label: '📝 Autre' }
  ];

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💰 Mes Transactions</h1>
          <p className="text-gray-600">Suivez vos revenus et dépenses</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Modal
          </Button>
          <Link to="/transactions/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.income)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Dépenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.expenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stats.net >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <Calendar className={`w-6 h-6 ${stats.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${stats.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Recherche"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Description..."
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Compte</label>
              <select
                value={filters.account_id}
                onChange={(e) => setFilters(prev => ({ ...prev, account_id: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les comptes</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Période</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: '',
                category: '',
                account_id: '',
                dateFrom: startOfMonth(new Date()).toISOString().split('T')[0],
                dateTo: endOfMonth(new Date()).toISOString().split('T')[0]
              })}
            >
              Réinitialiser
            </Button>
          </div>
        </Card>
      )}

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
            <p className="text-gray-600 mb-4">
              {transactions.length === 0 
                ? "Commencez par ajouter votre première transaction"
                : "Aucune transaction ne correspond à vos filtres"
              }
            </p>
            <div className="flex justify-center space-x-3">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Modal
              </Button>
              <Link to="/transactions/add">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Page dédiée
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, dayTransactions]) => (
              <Card key={date}>
                <div className="border-b border-gray-100 pb-2 mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {dayTransactions.length} transaction{dayTransactions.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-3">
                  {dayTransactions.map((transaction) => {
                    const account = accounts.find(acc => acc.id === transaction.account_id);
                    const category = categories.find(cat => cat.value === transaction.category);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        {/* Zone cliquable pour les détails */}
                        <Link 
                          to={`/transactions/${transaction.id}`}
                          className="flex items-center space-x-3 flex-1 cursor-pointer"
                        >
                          <div className="text-2xl">
                            {getTransactionIcon(transaction.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">
                                {transaction.description}
                              </h4>
                              {transaction.subcategory && (
                                <Badge variant="default" size="sm">
                                  {transaction.subcategory}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{category?.label}</span>
                              {account && (
                                <span>• {account.name}</span>
                              )}
                              <span>• {transaction.payment_method}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(transaction.date), 'HH:mm')}
                            </div>
                          </div>
                        </Link>

                        {/* Actions séparées */}
                        <div className="flex space-x-1 ml-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingTransaction(transaction);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setDeletingTransaction(transaction);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={showForm || editingTransaction}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? "Modifier la transaction" : "Nouvelle transaction"}
        size="lg"
      >
        <TransactionForm
          initialData={editingTransaction}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        title="Supprimer la transaction"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer la transaction "{deletingTransaction?.description}" ?
            Cette action est irréversible et affectera le solde de votre compte.
          </p>
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setDeletingTransaction(null)}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteTransaction}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsList;