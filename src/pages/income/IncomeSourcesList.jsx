// src/pages/income/IncomeSourcesList.jsx - VERSION CORRIGÉE AVEC FORMULAIRE
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { useIncomeSources } from '../../hooks/useIncomeSources';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card, Modal, Badge, LoadingSpinner } from '../../components/ui';
import IncomeSourceForm from '../../components/forms/IncomeSourceForm'; // ✅ AJOUT DU FORMULAIRE
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

  // ✅ GESTION DE L'AJOUT
  const handleAddSource = async (formData) => {
    try {
      await addIncomeSource(formData);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      throw error; // Laisser le formulaire gérer l'erreur
    }
  };

  // ✅ GESTION DE LA MODIFICATION
  const handleUpdateSource = async (formData) => {
    try {
      await updateIncomeSource(editingSource.id, formData);
      setEditingSource(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error;
    }
  };

  // ✅ GESTION DE LA SUPPRESSION
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Revenus Automatiques</h1>
          <p className="text-gray-600 dark:text-gray-300">Gérez vos sources de revenus récurrents</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={processPendingPayments}
            className="hidden md:flex"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Traiter en attente
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une source
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sources totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSources}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeSources}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimation mensuelle</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {stats.monthlyTotal.toLocaleString()} HTG
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prochain paiement</p>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune source de revenus</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">{source.name}</h3>
                      {source.employer && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{source.employer}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleIncomeSource(source.id, !source.is_active)}
                      className={`p-1 rounded ${
                        source.is_active 
                          ? 'text-green-600 hover:text-green-800 dark:text-green-400' 
                          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                      }`}
                      title={source.is_active ? 'Désactiver' : 'Activer'}
                    >
                      {source.is_active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingSource(source)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingSource(source)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      +{formatCurrency(source.amount, source.currency)}
                    </span>
                    <Badge variant={source.is_active ? "success" : "default"}>
                      {source.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{getFrequencyLabel(source.frequency)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Prochain paiement: {format(new Date(source.next_payment_date), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    {account && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>→ {account.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Estimation mensuelle */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Estimation mensuelle:</span>
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
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
                  <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryEmoji(source.category)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{source.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {account?.name} • {source.payment_time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(source.amount, source.currency)}
                      </p>
                      <div className="flex items-center space-x-1">
                        {isToday && (
                          <Badge variant="success" size="sm">Aujourd'hui</Badge>
                        )}
                        {isTomorrow && (
                          <Badge variant="warning" size="sm">Demain</Badge>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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

      {/* ✅ MODAL FORMULAIRE D'AJOUT */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="➕ Nouvelle source de revenus"
        size="xl"
      >
        <IncomeSourceForm
          onSubmit={handleAddSource}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* ✅ MODAL FORMULAIRE DE MODIFICATION */}
      <Modal
        isOpen={!!editingSource}
        onClose={() => setEditingSource(null)}
        title="✏️ Modifier la source de revenus"
        size="xl"
      >
        {editingSource && (
          <IncomeSourceForm
            initialData={editingSource}
            onSubmit={handleUpdateSource}
            onCancel={() => setEditingSource(null)}
          />
        )}
      </Modal>

      {/* Modal de suppression */}
      <Modal
        isOpen={!!deletingSource}
        onClose={() => setDeletingSource(null)}
        title="Supprimer la source de revenus"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Êtes-vous sûr de vouloir supprimer la source "{deletingSource?.name}" ?
            Cette action est irréversible et annulera tous les paiements automatiques futurs.
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-300 font-medium">⚠️ Attention</p>
            <p className="text-red-700 dark:text-red-400 text-sm">
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