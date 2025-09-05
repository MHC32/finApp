// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  PieChart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { Card, Button, Badge, LoadingSpinner } from '../../components/ui';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard = () => {
  const { accounts, loading: accountsLoading, getTotalBalance } = useAccounts();
  const { transactions, loading: transactionsLoading, getStats } = useTransactions();

  const [timeFrame, setTimeFrame] = useState('month'); // week, month, year

  const isLoading = accountsLoading || transactionsLoading;

  // Calculer les statistiques pour différentes périodes
  const getStatsForPeriod = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'week':
        startDate = subDays(now, 7);
        endDate = now;
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const income = periodTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = periodTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      income,
      expenses,
      net: income - expenses,
      transactionCount: periodTransactions.length
    };
  };

  const currentStats = getStatsForPeriod(timeFrame);

  // Transactions récentes (5 dernières)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Dépenses par catégorie (mois actuel)
  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const startOfCurrentMonth = startOfMonth(new Date());
      const endOfCurrentMonth = endOfMonth(new Date());
      return t.amount < 0 && transactionDate >= startOfCurrentMonth && transactionDate <= endOfCurrentMonth;
    })
    .reduce((acc, t) => {
      const category = t.category || 'other';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const formatCurrency = (amount, currency = 'HTG') => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: currency === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour ! 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos finances pour {timeFrame === 'week' ? 'cette semaine' : timeFrame === 'month' ? 'ce mois' : 'cette année'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Solde Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalBalance())}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-green-600">
                +{formatCurrency(currentStats.income)}
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
                -{formatCurrency(currentStats.expenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${currentStats.net >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <DollarSign className={`w-6 h-6 ${currentStats.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${currentStats.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {currentStats.net >= 0 ? '+' : ''}{formatCurrency(currentStats.net)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes Comptes */}
        <Card title="Mes Comptes" subtitle={`${accounts.length} compte${accounts.length > 1 ? 's' : ''} configuré${accounts.length > 1 ? 's' : ''}`}>
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucun compte configuré</p>
                <Link to="/accounts">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un compte
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {accounts.slice(0, 3).map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(account.current_balance, account.currency)}
                      </p>
                      <Badge variant={account.is_active ? "success" : "default"} size="sm">
                        {account.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {accounts.length > 3 && (
                  <Link to="/accounts" className="block">
                    <Button variant="outline" className="w-full">
                      Voir tous les comptes ({accounts.length})
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Transactions Récentes */}
        <Card title="Transactions Récentes" subtitle={`${currentStats.transactionCount} transaction${currentStats.transactionCount > 1 ? 's' : ''} ${timeFrame === 'week' ? 'cette semaine' : timeFrame === 'month' ? 'ce mois' : 'cette année'}`}>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucune transaction récente</p>
                <Link to="/transactions">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une transaction
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {recentTransactions.map((transaction) => {
                  const account = accounts.find(acc => acc.id === transaction.account_id);
                  return (
                    <Link
                      key={transaction.id}
                      to={`/transactions/${transaction.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {getTransactionIcon(transaction.category)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                            <p className="text-sm text-gray-600">
                              {getCategoryLabel(transaction.category)}
                              {account && ` • ${account.name}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(transaction.date), 'd MMM', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <Link to="/transactions" className="block">
                  <Button variant="outline" className="w-full">
                    Voir toutes les transactions
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Dépenses par Catégorie */}
      {Object.keys(monthlyExpenses).length > 0 && (
        <Card title="Dépenses par Catégorie" subtitle="Répartition de vos dépenses ce mois">
          <div className="space-y-4">
            {Object.entries(monthlyExpenses)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([category, amount]) => {
                const percentage = (amount / currentStats.expenses) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTransactionIcon(category)}</span>
                        <span className="font-medium text-gray-900">
                          {getCategoryLabel(category)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card title="Actions Rapides">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/transactions/add">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="w-6 h-6" />
              <span className="text-sm">Transaction</span>
            </Button>
          </Link>

          <Link to="/accounts/add">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Compte</span>
            </Button>
          </Link>

          <Link to="/budgets">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <PieChart className="w-6 h-6" />
              <span className="text-sm">Budget</span>
            </Button>
          </Link>

          <Link to="/sols">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Sol</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;