// src/pages/income/IncomeSourcesList.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { useIncomeSources } from '../../hooks/useIncomeSources';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card, Modal, Badge, LoadingSpinner } from '../../components/ui';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const IncomeSourcesList = () => {
  const { 
    incomeSources, 
    loading, 
    addIncomeSource, 
    updateIncomeSource, 
    deleteIncomeSource, 
    toggleIncomeSource,
    getIncomeStats,
    processPendingPayments
  } = useIncomeSources();
  
  const { accounts } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [deletingSource, setDeletingSource] = useState(null);

  const stats = getIncomeStats();

  const frequencies = [
    { value: 'monthly', label: '📅 Mensuel' },
    { value: 'bi_monthly', label: '📅 Bi-mensuel' },
    { value: 'weekly', label: '📅 Hebdomadaire' },
    { value: 'bi_weekly', label: '📅 Bi-hebdomadaire' }
  ];

  const incomeCategories = [
    { value: 'salary', label: '💼 Salaire fixe', emoji: '💼' },
    { value: 'freelance', label: '🚀 Freelance', emoji: '🚀' },
    { value: 'business', label: '🏢 Revenus d\'entreprise', emoji: '🏢' },
    { value: 'rental', label: '🏠 Revenus locatifs', emoji: '🏠' },
    { value: 'investment', label: '📈 Investissements', emoji: '📈' },
    { value: 'pension', label: '👴 Pension/Retraite', emoji: '👴' },
    { value: 'other', label: '💰 Autre revenu', emoji: '💰' }
  ];

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: currency === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getFrequencyLabel = (frequency) => {
    return frequencies.find(f => f.value === frequency)?.label || frequency;
  };

  const getCategoryEmoji = (category) => {
    return incomeCategories.find(cat => cat.value === category)?.emoji || '💰';
  };

  const handleDeleteSource = async () => {
    try {
      await deleteIncomeSource(deletingSource.id);
      setDeletingSource(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">💰 Revenus Automatiques</h1>
          <p className="text-gray-600">Gérez vos sources de revenus récurrents</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => processPendingPayments()}
            className="flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Traiter maintenant</span>
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Source
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Sources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSources}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Sources Actives</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeSources}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Revenus Mensuels</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.monthlyTotal, 'HTG')}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Prochain Paiement</p>
              <p className="text-sm font-bold text-orange-600">
                {stats.nextPayment ? 
                  format(new Date(stats.nextPayment.next_payment_date), 'd MMM', { locale: fr }) : 
                  'Aucun'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sources List */}
      {incomeSources.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune source de revenus</h3>
            <p className="text-gray-600 mb-4">
              Configurez vos premiers revenus automatiques pour un suivi simplifié
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer ma première source
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {incomeSources.map((source) => {
            const account = accounts.find(acc => acc.id === source.destination_account_id);
            const category = incomeCategories.find(cat => cat.value === source.category);
            
            return (
              <Card key={source.id} className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryEmoji(source.category)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{source.name}</h3>
                      {source.employer && (
                        <p className="text-sm text-gray-600">{source.employer}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleIncomeSource(source.id, !source.is_active)}
                      className={`p-1 rounded ${
                        source.is_active 
                          ? 'text-green-600 hover:text-green-800' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={source.is_active ? 'Désactiver' : 'Activer'}
                    >
                      {source.is_active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingSource(source)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingSource(source)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Montant */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Montant</span>
                    <span className="font-semibold text-lg text-green-600">
                      +{formatCurrency(source.amount, source.currency)}
                    </span>
                  </div>

                  {/* Fréquence */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fréquence</span>
                    <Badge variant="default">
                      {getFrequencyLabel(source.frequency)}
                    </Badge>
                  </div>

                  {/* Compte de destination */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Compte</span>
                    <span className="text-sm font-medium text-gray-900">
                      {account ? `${account.name}` : 'Compte supprimé'}
                    </span>
                  </div>

                  {/* Prochain paiement */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prochain paiement</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(source.next_payment_date), 'dd MMM yyyy', { locale: fr })}
                      </p>
                      <p className="text-xs text-gray-500">
                        à {source.payment_time}
                      </p>
                    </div>
                  </div>

                  {/* Statut */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut</span>
                    <Badge variant={source.is_active ? "success" : "default"}>
                      {source.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>

                {/* Estimation mensuelle */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Estimation mensuelle:</span>
                    <span className="text-xs font-medium text-purple-600">
                      {(() => {
                        let monthlyAmount = source.amount;
                        switch (source.frequency) {
                          case 'weekly': monthlyAmount *= 4.33; break;
                          case 'bi_weekly': monthlyAmount *= 2.17; break;
                          case 'bi_monthly': monthlyAmount *= 2; break;
                        }
                        return `~${formatCurrency(monthlyAmount, source.currency)}`;
                      })()}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Prochains paiements */}
      {incomeSources.filter(s => s.is_active).length > 0 && (
        <Card title="📅 Prochains paiements" className="mt-6">
          <div className="space-y-3">
            {incomeSources
              .filter(source => source.is_active)
              .sort((a, b) => new Date(a.next_payment_date) - new Date(b.next_payment_date))
              .slice(0, 5)
              .map(source => {
                const account = accounts.find(acc => acc.id === source.destination_account_id);
                const isToday = format(new Date(source.next_payment_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const isTomorrow = format(new Date(source.next_payment_date), 'yyyy-MM-dd') === format(addDays(new Date(), 1), 'yyyy-MM-dd');
                
                return (
                  <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryEmoji(source.category)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{source.name}</h4>
                        <p className="text-sm text-gray-600">
                          {account?.name} • {source.payment_time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(source.amount, source.currency)}
                      </p>
                      <div className="flex items-center space-x-1">
                        {isToday && (
                          <Badge variant="success" size="sm">Aujourd'hui</Badge>
                        )}
                        {isTomorrow && (
                          <Badge variant="warning" size="sm">Demain</Badge>
                        )}
                        <p className="text-xs text-gray-500">
                          {format(new Date(source.next_payment_date), 'dd MMM', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingSource}
        onClose={() => setDeletingSource(null)}
        title="Supprimer la source de revenus"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer la source "{deletingSource?.name}" ?
            Cette action est irréversible et annulera tous les paiements automatiques futurs.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 font-medium">⚠️ Attention</p>
            <p className="text-red-700 text-sm">
              Les transactions déjà créées ne seront pas supprimées, mais les paiements futurs n'auront plus lieu.
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setDeletingSource(null)}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteSource}
            >
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IncomeSourcesList;