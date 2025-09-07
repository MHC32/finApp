// src/pages/income/IncomeSourcesList.jsx - VERSION CORRIGÉE COMPLÈTE
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { useIncomeSources } from '../../hooks/useIncomeSources';
import { useAccounts } from '../../hooks/useAccounts';
import { Button, Card, Modal, Badge, LoadingSpinner } from '../../components/ui';
import IncomeSourceForm from '../../components/forms/IncomeSourceForm';
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

  // ✅ OBTENIR LES STATS DE FAÇON SÉCURISÉE
  const rawStats = getIncomeStats();
  
  // ✅ FONCTION HELPER POUR SÉCURISER LES STATS
  const getSafeStats = () => {
    return {
      totalSources: rawStats?.totalSources || 0,
      activeSources: rawStats?.activeSources || 0,
      monthlyTotal: rawStats?.monthlyTotal || 0,
      nextPayment: rawStats?.nextPayment || null
    };
  };

  const stats = getSafeStats();

  // ✅ FONCTION HELPER POUR FORMATER LES MONTANTS
  const formatAmount = (amount, currency = 'HTG') => {
    try {
      const numericAmount = parseFloat(amount) || 0;
      return `${numericAmount.toLocaleString('fr-HT')} ${currency}`;
    } catch (error) {
      console.error('Erreur formatage montant:', error);
      return `0 ${currency}`;
    }
  };

  // ✅ FONCTION HELPER POUR FORMATER LA DEVISE
  const formatCurrency = (amount, currency) => {
    try {
      const numericAmount = parseFloat(amount) || 0;
      return new Intl.NumberFormat('fr-HT', {
        style: 'currency',
        currency: currency === 'HTG' ? 'HTG' : 'USD',
        minimumFractionDigits: 2
      }).format(numericAmount);
    } catch (error) {
      console.error('Erreur formatage devise:', error);
      return `${amount || 0} ${currency}`;
    }
  };

  // ✅ CONFIGURATION DES FRÉQUENCES
  const frequencies = [
    { value: 'monthly', label: '📅 Mensuel' },
    { value: 'bi_monthly', label: '📅 Bi-mensuel' },
    { value: 'weekly', label: '📅 Hebdomadaire' },
    { value: 'bi_weekly', label: '📅 Bi-hebdomadaire' }
  ];

  // ✅ CONFIGURATION DES CATÉGORIES
  const incomeCategories = [
    { value: 'salary', label: '💼 Salaire fixe', emoji: '💼' },
    { value: 'freelance', label: '🚀 Freelance', emoji: '🚀' },
    { value: 'business', label: '🏢 Revenus d\'entreprise', emoji: '🏢' },
    { value: 'rental', label: '🏠 Revenus locatifs', emoji: '🏠' },
    { value: 'investment', label: '📈 Investissements', emoji: '📈' },
    { value: 'pension', label: '👴 Pension/Retraite', emoji: '👴' },
    { value: 'other', label: '💰 Autre revenu', emoji: '💰' }
  ];

  // ✅ FONCTION HELPER POUR OBTENIR LE LABEL DE FRÉQUENCE
  const getFrequencyLabel = (frequency) => {
    try {
      return frequencies.find(f => f.value === frequency)?.label || frequency;
    } catch (error) {
      return frequency || 'Non défini';
    }
  };

  // ✅ FONCTION HELPER POUR OBTENIR L'EMOJI DE CATÉGORIE
  const getCategoryEmoji = (category) => {
    try {
      return incomeCategories.find(cat => cat.value === category)?.emoji || '💰';
    } catch (error) {
      return '💰';
    }
  };

  // ✅ GESTION DE L'AJOUT AVEC PROTECTION D'ERREUR
  const handleAddSource = async (formData) => {
    try {
      await addIncomeSource(formData);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      throw error;
    }
  };

  // ✅ GESTION DE LA MODIFICATION AVEC PROTECTION D'ERREUR
  const handleUpdateSource = async (formData) => {
    try {
      if (!editingSource?.id) {
        throw new Error('Aucune source à modifier');
      }
      await updateIncomeSource(editingSource.id, formData);
      setEditingSource(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error;
    }
  };

  // ✅ GESTION DE LA SUPPRESSION AVEC PROTECTION D'ERREUR
  const handleDeleteSource = async () => {
    try {
      if (!deletingSource?.id) {
        throw new Error('Aucune source à supprimer');
      }
      await deleteIncomeSource(deletingSource.id);
      setDeletingSource(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // ✅ GESTION DU TOGGLE AVEC PROTECTION D'ERREUR
  const handleToggleSource = async (source) => {
    try {
      if (!source?.id) return;
      await toggleIncomeSource(source.id, !source.is_active);
    } catch (error) {
      console.error('Erreur lors du toggle:', error);
    }
  };

  // ✅ AFFICHAGE DU LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ✅ SOURCES SÉCURISÉES
  const safeIncomeSources = Array.isArray(incomeSources) ? incomeSources : [];
  const safeAccounts = Array.isArray(accounts) ? accounts : [];

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

      {/* ✅ STATISTIQUES SÉCURISÉES */}
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
                {formatAmount(stats.monthlyTotal, 'HTG')}
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

      {/* ✅ LISTE DES SOURCES SÉCURISÉE */}
      {safeIncomeSources.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune source de revenus
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ajoutez votre première source de revenus automatique pour commencer.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter ma première source
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeIncomeSources.map(source => {
            const account = safeAccounts.find(acc => acc.id === source.destination_account_id);
            
            return (
              <Card key={source.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryEmoji(source.category)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {source.name || 'Source sans nom'}
                      </h3>
                      {source.employer && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{source.employer}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleSource(source)}
                    >
                      {source.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSource(source)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingSource(source)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(source.amount, source.currency)}
                  </div>
                  <Badge variant={source.is_active ? "success" : "default"}>
                    {source.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{getFrequencyLabel(source.frequency)}</span>
                  </div>
                  {source.next_payment_date && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Prochain: {format(new Date(source.next_payment_date), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  )}
                  {account && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>→ {account.name}</span>
                    </div>
                  )}
                </div>

                {/* ✅ ESTIMATION MENSUELLE SÉCURISÉE */}
                {source.is_active && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Estimation mensuelle:</span>
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        {(() => {
                          try {
                            const amount = parseFloat(source.amount) || 0;
                            let monthlyAmount = amount;
                            
                            switch (source.frequency) {
                              case 'weekly': 
                                monthlyAmount = amount * 4.33; 
                                break;
                              case 'bi_weekly': 
                                monthlyAmount = amount * 2.17; 
                                break;
                              case 'bi_monthly': 
                                monthlyAmount = amount * 2; 
                                break;
                              default: 
                                monthlyAmount = amount;
                            }
                            
                            return formatCurrency(monthlyAmount, source.currency);
                          } catch (error) {
                            return '0 HTG';
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ✅ PROCHAINS PAIEMENTS SÉCURISÉS */}
      {safeIncomeSources.filter(s => s && s.is_active).length > 0 && (
        <Card title="📅 Prochains paiements" className="mt-6">
          <div className="space-y-3">
            {safeIncomeSources
              .filter(source => source && source.is_active && source.next_payment_date)
              .sort((a, b) => {
                try {
                  return new Date(a.next_payment_date) - new Date(b.next_payment_date);
                } catch (error) {
                  return 0;
                }
              })
              .slice(0, 5)
              .map(source => {
                const account = safeAccounts.find(acc => acc.id === source.destination_account_id);
                
                try {
                  const paymentDate = new Date(source.next_payment_date);
                  const today = new Date();
                  const isToday = format(paymentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                  const isTomorrow = format(paymentDate, 'yyyy-MM-dd') === format(addDays(today, 1), 'yyyy-MM-dd');
                  
                  return (
                    <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getCategoryEmoji(source.category)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {source.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account ? `→ ${account.name}` : 'Compte non trouvé'} • 
                            {isToday ? ' Aujourd\'hui' : isTomorrow ? ' Demain' : format(paymentDate, 'dd MMM', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(source.amount, source.currency)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getFrequencyLabel(source.frequency)}
                        </div>
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.error('Erreur affichage paiement:', error);
                  return null;
                }
              })
              .filter(Boolean)} {/* Filtrer les éléments null */}
          </div>
        </Card>
      )}

      {/* ✅ MODALS SÉCURISÉES */}
      
      {/* Modal d'ajout */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Ajouter une source de revenus"
      >
        <IncomeSourceForm
          onSubmit={handleAddSource}
          onCancel={() => setShowForm(false)}
          accounts={safeAccounts}
        />
      </Modal>

      {/* Modal de modification */}
      <Modal
        isOpen={!!editingSource}
        onClose={() => setEditingSource(null)}
        title="Modifier la source de revenus"
      >
        {editingSource && (
          <IncomeSourceForm
            initialData={editingSource}
            onSubmit={handleUpdateSource}
            onCancel={() => setEditingSource(null)}
            accounts={safeAccounts}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal de suppression */}
      <Modal
        isOpen={!!deletingSource}
        onClose={() => setDeletingSource(null)}
        title="Supprimer la source de revenus"
      >
        {deletingSource && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-red-600 dark:text-red-400 text-xl">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-300">
                    Attention - Action irréversible
                  </h3>
                  <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                    Vous êtes sur le point de supprimer définitivement la source de revenus 
                    "<strong>{deletingSource.name}</strong>".
                  </p>
                  <ul className="text-red-600 dark:text-red-400 text-sm mt-2 space-y-1">
                    <li>• Tous les paiements futurs seront annulés</li>
                    <li>• L'historique des transactions restera intact</li>
                    <li>• Cette action ne peut pas être annulée</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Récapitulatif de la source :
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Nom :</span>
                  <span className="font-medium">{deletingSource.name}</span>
                </div>
                {deletingSource.employer && (
                  <div className="flex justify-between">
                    <span>Employeur :</span>
                    <span className="font-medium">{deletingSource.employer}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Montant :</span>
                  <span className="font-medium">
                    {formatCurrency(deletingSource.amount, deletingSource.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fréquence :</span>
                  <span className="font-medium">{getFrequencyLabel(deletingSource.frequency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statut :</span>
                  <Badge variant={deletingSource.is_active ? "success" : "default"} size="sm">
                    {deletingSource.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
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
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer définitivement
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ✅ INFORMATIONS SUPPLÉMENTAIRES */}
      {safeIncomeSources.length > 0 && (
        <Card className="mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              ℹ️ Comment fonctionnent les revenus automatiques
            </h4>
            <div className="text-blue-800 dark:text-blue-400 text-sm space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">🔔 Notifications :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Alerte 1h avant chaque paiement</li>
                    <li>• Confirmation après traitement</li>
                    <li>• Résumé hebdomadaire optionnel</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">📅 Planification :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Paiements weekend → Lundi</li>
                    <li>• Jours fériés pris en compte</li>
                    <li>• Ajustement automatique des dates</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">💰 Traitement :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Ajout automatique au compte choisi</li>
                    <li>• Transaction avec catégorie "Revenus"</li>
                    <li>• Historique complet conservé</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">⚙️ Contrôle :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Activation/désactivation instantanée</li>
                    <li>• Modification à tout moment</li>
                    <li>• Suppression avec confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ✅ AIDE POUR DÉBUTER */}
      {safeIncomeSources.length === 0 && (
        <Card className="mt-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-4">
              🚀 Commencez avec les revenus automatiques
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">💼</div>
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Salaire</h5>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Configurez votre salaire mensuel ou bi-mensuel pour un suivi automatique
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Freelance</h5>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Ajoutez vos revenus récurrents de clients réguliers
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏠</div>
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Revenus passifs</h5>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Loyers, dividendes, ou autres revenus réguliers
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button onClick={() => setShowForm(true)} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter ma première source de revenus
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default IncomeSourcesList;