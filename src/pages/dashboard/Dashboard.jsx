// src/pages/dashboard/Dashboard.jsx - AVEC TAUX DE CHANGE
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
  DollarSign,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { useExchange } from '../../hooks/useExchange';
import { Card, Button, Badge, LoadingSpinner } from '../../components/ui';
import CurrencyDisplay from '../../components/ui/CurrencyDisplay';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard = () => {
  const { accounts, loading: accountsLoading, getTotalBalance } = useAccounts();
  const { transactions, loading: transactionsLoading, getStats } = useTransactions();
  const { 
    isReady: exchangeReady, 
    loading: exchangeLoading, 
    refreshRates, 
    getStatus: getExchangeStatus,
    getCurrentRate,
    convert,
    preferredCurrency,
    setPreferredCurrency
  } = useExchange();

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

  // ✅ CALCUL DU SOLDE TOTAL INTELLIGENT (multi-devises)
  const calculateTotalBalance = () => {
    const balancesByAccount = accounts.map(account => ({
      amount: account.current_balance,
      currency: account.currency,
      account: account.name
    }));

    // Séparer HTG et USD
    const htgAccounts = balancesByAccount.filter(acc => acc.currency === 'HTG');
    const usdAccounts = balancesByAccount.filter(acc => acc.currency === 'USD');

    const totalHTG = htgAccounts.reduce((sum, acc) => sum + acc.amount, 0);
    const totalUSD = usdAccounts.reduce((sum, acc) => sum + acc.amount, 0);

    return { totalHTG, totalUSD };
  };

  const { totalHTG, totalUSD } = calculateTotalBalance();

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

  const exchangeStatus = getExchangeStatus();
  const currentRate = getCurrentRate('USD', 'HTG');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec sélecteur de devise préférée */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bonjour ! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Voici un aperçu de vos finances pour {timeFrame === 'week' ? 'cette semaine' : timeFrame === 'month' ? 'ce mois' : 'cette année'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* ✅ NOUVEAU: Sélecteur de devise préférée */}
          <select
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="HTG">💰 HTG (Gourdes)</option>
            <option value="USD">💵 USD (Dollars)</option>
          </select>

          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* ✅ NOUVEAU: Widget de taux de change */}
      {exchangeReady && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💱</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Taux de change</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {currentRate.formatted}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>{exchangeStatus.message}</p>
                {exchangeStatus.source && (
                  <p>Source: {exchangeStatus.source === 'api' ? 'API live' : exchangeStatus.source}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {exchangeStatus.status === 'stale' && (
                <AlertCircle className="w-4 h-4 text-orange-500" />
              )}
              <button
                onClick={refreshRates}
                disabled={exchangeLoading}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Actualiser les taux"
              >
                <RefreshCw className={`w-4 h-4 ${exchangeLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* ✅ MODIFIÉ: Quick Stats avec conversion automatique */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Solde Total avec vue multi-devises */}
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Solde Total</p>
              {/* Affichage intelligent selon devise préférée */}
              {preferredCurrency === 'HTG' ? (
                <div>
                  <CurrencyDisplay 
                    amount={totalHTG + (exchangeReady ? convert(totalUSD, 'USD', 'HTG') : totalUSD * 133)}
                    currency="HTG"
                    size="2xl"
                    showConversion={false}
                    className="font-bold text-gray-900 dark:text-white"
                  />
                  {exchangeReady && totalUSD > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      HTG: {totalHTG.toLocaleString()} + USD: {totalUSD.toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <CurrencyDisplay 
                    amount={totalUSD + (exchangeReady ? convert(totalHTG, 'HTG', 'USD') : totalHTG / 133)}
                    currency="USD"
                    size="2xl"
                    showConversion={false}
                    className="font-bold text-gray-900 dark:text-white"
                  />
                  {exchangeReady && totalHTG > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      USD: {totalUSD.toLocaleString()} + HTG: {totalHTG.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenus</p>
              <CurrencyDisplay 
                amount={currentStats.income}
                currency={preferredCurrency}
                size="2xl"
                showConversion={exchangeReady}
                className="font-bold text-green-600 dark:text-green-400"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Dépenses</p>
              <CurrencyDisplay 
                amount={currentStats.expenses}
                currency={preferredCurrency}
                size="2xl"
                showConversion={exchangeReady}
                className="font-bold text-red-600 dark:text-red-400"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${currentStats.net >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
              <DollarSign className={`w-6 h-6 ${currentStats.net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
              <CurrencyDisplay 
                amount={currentStats.net}
                currency={preferredCurrency}
                size="2xl"
                showConversion={exchangeReady}
                className={`font-bold ${currentStats.net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ MODIFIÉ: Mes Comptes avec conversion */}
        <Card title="Mes Comptes" subtitle={`${accounts.length} compte${accounts.length > 1 ? 's' : ''} configuré${accounts.length > 1 ? 's' : ''}`}>
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">Aucun compte configuré</p>
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
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{account.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{account.bank_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <CurrencyDisplay 
                        amount={account.current_balance}
                        currency={account.currency}
                        showConversion={exchangeReady}
                        className="font-semibold text-gray-900 dark:text-white"
                      />
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

        {/* ✅ MODIFIÉ: Transactions Récentes avec conversion */}
        <Card title="Transactions Récentes" subtitle={`${currentStats.transactionCount} transaction${currentStats.transactionCount > 1 ? 's' : ''} ${timeFrame === 'week' ? 'cette semaine' : timeFrame === 'month' ? 'ce mois' : 'cette année'}`}>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">Aucune transaction récente</p>
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
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {getTransactionIcon(transaction.category)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {getCategoryLabel(transaction.category)}
                              {account && ` • ${account.name}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <CurrencyDisplay 
                            amount={transaction.amount}
                            currency={account?.currency || 'HTG'}
                            showConversion={exchangeReady}
                            className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
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

      {/* ✅ MODIFIÉ: Dépenses par Catégorie avec conversion */}
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
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getCategoryLabel(category)}
                        </span>
                      </div>
                      <div className="text-right">
                        <CurrencyDisplay 
                          amount={amount}
                          currency={preferredCurrency}
                          showConversion={exchangeReady}
                          className="font-semibold text-gray-900 dark:text-white"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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