// src/features/accounts/pages/AccountDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  Building,
  CreditCard,
  Download,
  MoreVertical,
  BarChart3
} from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Loading from '../../../components/ui/Loading';
import Alert from '../../../components/ui/Alert';
import ProgressBar from '../../../components/ui/ProgressBar';
import Tabs from '../../../components/ui/Tabs';
import EditAccountModal from '../components/EditAccountModal';
import EmptyState from '../../../components/common/EmptyState';

/**
 * Page de détails d'un compte bancaire spécifique
 * Avec historique, statistiques et actions détaillées
 */
const AccountDetailsPage = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const {
    getAccount,
    currentAccount,
    accounts,
    isLoading
  } = useAccount();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [accountStats, setAccountStats] = useState(null);

  // Charger les détails du compte
  useEffect(() => {
    if (accountId) {
      getAccount(accountId);
    }
  }, [accountId, getAccount]);

  // Simuler des données pour l'historique et les stats
  useEffect(() => {
    if (currentAccount) {
      // Transactions récentes simulées
      setRecentTransactions([
        {
          id: 1,
          date: '2024-01-15',
          description: 'Dépôt salaire',
          amount: 50000,
          type: 'income',
          category: 'Salaire'
        },
        {
          id: 2,
          date: '2024-01-14',
          description: 'Course supermarché',
          amount: -2500,
          type: 'expense',
          category: 'Alimentation'
        },
        {
          id: 3,
          date: '2024-01-12',
          description: 'Transfert épargne',
          amount: -10000,
          type: 'transfer',
          category: 'Épargne'
        }
      ]);

      // Statistiques simulées
      setAccountStats({
        monthlyIncome: 75000,
        monthlyExpenses: 45000,
        largestTransaction: 50000,
        transactionCount: 15
      });
    }
  }, [currentAccount]);

  // Navigation
  const handleBack = () => {
    navigate('/accounts');
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    getAccount(accountId); // Recharger les détails
  };

  // Formater les montants
  const formatAmount = (amount, currency = currentAccount?.currency) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'HTG'
    }).format(amount);
  };

  // Obtenir la couleur selon le type
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

  if (isLoading && !currentAccount) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading.SkeletonCard />
        </div>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={CreditCard}
            title="Compte non trouvé"
            description="Le compte que vous recherchez n'existe pas ou a été supprimé"
            action={
              <Button onClick={handleBack} leftIcon={ArrowLeft}>
                Retour aux comptes
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const accountColor = getAccountColor(currentAccount.type);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête avec navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            leftIcon={ArrowLeft}
            onClick={handleBack}
            className="mb-4"
          >
            Retour aux comptes
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-${accountColor}-100 dark:bg-${accountColor}-900/20`}>
                  <Building className={`w-8 h-8 text-${accountColor}-600 dark:text-${accountColor}-400`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentAccount.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {currentAccount.bankName} • {currentAccount.accountNumber || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Badges d'état */}
              <div className="flex flex-wrap gap-2">
                <Badge color={accountColor}>
                  {currentAccount.type}
                </Badge>
                {currentAccount.isDefault && (
                  <Badge color="teal">
                    Compte par défaut
                  </Badge>
                )}
                {!currentAccount.isActive && (
                  <Badge color="gray">
                    Inactif
                  </Badge>
                )}
                {currentAccount.isArchived && (
                  <Badge color="orange">
                    Archivé
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <Button variant="outline" leftIcon={Download}>
                Exporter
              </Button>
              <Button
                leftIcon={Edit}
                onClick={() => setIsEditModalOpen(true)}
              >
                Modifier
              </Button>
            </div>
          </div>
        </div>

        {/* Section principale avec tabs */}
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" icon={BarChart3}>
              Vue d'ensemble
            </Tabs.Tab>
            <Tabs.Tab value="transactions" icon={CreditCard}>
              Transactions
            </Tabs.Tab>
            <Tabs.Tab value="settings" icon={MoreVertical}>
              Paramètres
            </Tabs.Tab>
          </Tabs.List>

          {/* Tab Vue d'ensemble */}
          <Tabs.Panel value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              
              {/* Colonne principale - Solde et métriques */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Carte de solde */}
                <Card variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Solde actuel
                    </h3>
                    <Badge color={accountColor} size="lg">
                      {currentAccount.currency}
                    </Badge>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatAmount(currentAccount.currentBalance)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Solde disponible
                    </p>
                  </div>

                  {/* Indicateurs rapides */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatAmount(accountStats?.monthlyIncome || 0)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Revenus mensuels
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatAmount(accountStats?.monthlyExpenses || 0)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dépenses mensuelles
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Statistiques détaillées */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Statistiques du compte
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Nombre de transactions
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {accountStats?.transactionCount || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Plus grosse transaction
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatAmount(accountStats?.largestTransaction || 0)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Solde moyen mensuel
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatAmount(currentAccount.currentBalance * 0.85)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Colonne latérale - Informations et actions */}
              <div className="space-y-6">
                
                {/* Informations du compte */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informations
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Type de compte
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {currentAccount.type}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Devise
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {currentAccount.currency}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Banque
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {currentAccount.bankName}
                      </p>
                    </div>
                    
                    {currentAccount.accountNumber && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Numéro de compte
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {currentAccount.accountNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* État du compte */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    État du compte
                  </h3>
                  
                  <div className="space-y-3">
                    <Switch
                      checked={currentAccount.isActive}
                      label="Compte actif"
                      disabled
                    />
                    
                    <Switch
                      checked={currentAccount.includeInTotal}
                      label="Inclure dans le total"
                      disabled
                    />
                    
                    {currentAccount.creditLimit && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Limite de crédit
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatAmount(currentAccount.creditLimit)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Actions rapides */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Actions
                  </h3>
                  
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth>
                      Nouvelle transaction
                    </Button>
                    <Button variant="outline" fullWidth>
                      Ajuster le solde
                    </Button>
                    <Button variant="outline" fullWidth>
                      Générer rapport
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </Tabs.Panel>

          {/* Tab Transactions */}
          <Tabs.Panel value="transactions">
            <div className="mt-6">
              <Card variant="glass">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Transactions récentes
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-900/20' 
                              : transaction.type === 'expense'
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : 'bg-blue-100 dark:bg-blue-900/20'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : transaction.type === 'expense' ? (
                              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                            ) : (
                              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(transaction.date).toLocaleDateString('fr-FR')}
                              <Tag className="w-3 h-3 ml-2" />
                              {transaction.category}
                            </div>
                          </div>
                        </div>
                        
                        <p className={`font-semibold ${
                          transaction.amount > 0 
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatAmount(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {recentTransactions.length === 0 && (
                  <div className="p-8 text-center">
                    <EmptyState
                      icon={CreditCard}
                      title="Aucune transaction"
                      description="Aucune transaction trouvée pour ce compte"
                      size="sm"
                    />
                  </div>
                )}
              </Card>
            </div>
          </Tabs.Panel>

          {/* Tab Paramètres */}
          <Tabs.Panel value="settings">
            <div className="mt-6">
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Paramètres du compte
                </h3>
                
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentAccount.description || 'Aucune description'}
                    </p>
                  </div>

                  {/* Paramètres de sécurité */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Sécurité
                    </h4>
                    <div className="space-y-3">
                      <Button variant="outline" fullWidth>
                        Changer le numéro de compte
                      </Button>
                      <Button variant="outline" fullWidth>
                        Exporter les données
                      </Button>
                      <Button variant="outline" color="red" fullWidth>
                        Archiver le compte
                      </Button>
                    </div>
                  </div>

                  {/* Actions dangereuses */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-4">
                      Zone dangereuse
                    </h4>
                    <Alert
                      type="error"
                      title="Attention"
                      description="La suppression du compte est irréversible. Toutes les données associées seront perdues."
                      variant="subtle"
                    />
                    <Button variant="outline-danger" fullWidth className="mt-4">
                      Supprimer le compte
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Tabs.Panel>
        </Tabs>

        {/* Modal d'édition */}
        <EditAccountModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          account={currentAccount}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
};

// Composant Switch simple pour l'affichage en lecture seule
const Switch = ({ checked, label, disabled = false }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    <div
      className={`w-10 h-6 rounded-full transition-colors ${
        checked 
          ? 'bg-teal-500' 
          : 'bg-gray-300 dark:bg-gray-600'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform mt-1 ml-1 ${
          checked ? 'transform translate-x-4' : ''
        }`}
      />
    </div>
  </div>
);

export default AccountDetailsPage;