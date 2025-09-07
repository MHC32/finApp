// src/pages/budgets/BudgetsList.jsx - VERSION COMPLÈTE
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { useBudgets } from '../../hooks/useBudgets';
import { Button, Card, Modal, Badge, LoadingSpinner, Input } from '../../components/ui';
import BudgetForm from '../../components/forms/BudgetForm';
import CurrencyDisplay from '../../components/ui/CurrencyDisplay';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const BudgetsList = () => {
  const { 
    budgets, 
    loading, 
    addBudget, 
    updateBudget, 
    deleteBudget, 
    toggleBudget,
    getBudgetsStats,
    getBudgetAlerts
  } = useBudgets();

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // all, active, inactive
    period: 'all'   // all, monthly, weekly, custom
  });
  const [showFilters, setShowFilters] = useState(false);

  // Statistiques
  const stats = getBudgetsStats();
  const alerts = getBudgetAlerts();

  useEffect(() => {
    console.log('📊 Budgets chargés:', budgets);
    console.log('📈 Stats:', stats);
    console.log('🚨 Alertes:', alerts);
  }, [budgets, stats, alerts]);

  const handleAddBudget = async (budgetData) => {
    try {
      await addBudget(budgetData);
      setShowForm(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du budget:', err);
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    try {
      await updateBudget(editingBudget.id, budgetData);
      setEditingBudget(null);
    } catch (err) {
      console.error('Erreur lors de la modification du budget:', err);
    }
  };

  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(deletingBudget.id);
      setDeletingBudget(null);
    } catch (err) {
      console.error('Erreur lors de la suppression du budget:', err);
    }
  };

  const handleToggleBudget = async (budget) => {
    try {
      await toggleBudget(budget.id, !budget.is_active);
    } catch (err) {
      console.error('Erreur lors du toggle du budget:', err);
    }
  };

  // Filtrer les budgets
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         (budget.description && budget.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && budget.is_active) ||
                         (filters.status === 'inactive' && !budget.is_active);
    
    const matchesPeriod = filters.period === 'all' || budget.period === filters.period;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // Obtenir le statut d'un budget
  const getBudgetStatus = (budget) => {
    if (!budget.is_active) return { type: 'inactive', label: 'Inactif', color: 'gray' };
    
    const percentage = ((budget.current_spent || 0) / budget.amount) * 100;
    
    if (percentage > 100) return { type: 'over', label: 'Dépassé', color: 'red' };
    if (percentage > 80) return { type: 'warning', label: 'Attention', color: 'orange' };
    if (percentage > 50) return { type: 'progress', label: 'En cours', color: 'blue' };
    return { type: 'good', label: 'Bon', color: 'green' };
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status) => {
    switch (status.type) {
      case 'over': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'progress': return <TrendingUp className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Formatage de la période
  const formatPeriod = (budget) => {
    switch (budget.period) {
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      case 'custom': 
        if (budget.start_date && budget.end_date) {
          return `${format(new Date(budget.start_date), 'd MMM', { locale: fr })} - ${format(new Date(budget.end_date), 'd MMM yyyy', { locale: fr })}`;
        }
        return 'Personnalisé';
      default: return budget.period;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Mes Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez et suivez vos budgets mensuels et personnalisés</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Budget
          </Button>
        </div>
      </div>

      {/* Alertes de budgets */}
      {alerts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900 dark:text-orange-300">Budgets en alerte</h3>
              <ul className="mt-2 space-y-1">
                {alerts.map((alert) => (
                  <li key={alert.id} className="text-sm text-orange-800 dark:text-orange-400">
                    <strong>{alert.name}</strong> - {alert.percentage.toFixed(1)}% utilisé
                    {alert.alertType === 'danger' && ' (dépassé)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Budgets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBudgets}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeBudgets}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget Total</p>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                <CurrencyDisplay amount={stats.totalBudget} currency="HTG" size="lg" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stats.averageUsage > 80 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <TrendingUp className={`w-6 h-6 ${stats.averageUsage > 80 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Utilisation Moy.</p>
              <p className={`text-2xl font-bold ${stats.averageUsage > 80 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {stats.averageUsage.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Recherche"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Nom du budget..."
              icon={<Search className="w-4 h-4" />}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Période
              </label>
              <select
                value={filters.period}
                onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les périodes</option>
                <option value="monthly">Mensuel</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des budgets */}
      {filteredBudgets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {budgets.length === 0 ? 'Aucun budget créé' : 'Aucun budget trouvé'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {budgets.length === 0 
                ? 'Commencez par créer votre premier budget pour suivre vos dépenses.'
                : 'Aucun budget ne correspond à vos critères de recherche.'
              }
            </p>
            {budgets.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier budget
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => {
            const status = getBudgetStatus(budget);
            const percentage = ((budget.current_spent || 0) / budget.amount) * 100;
            const remaining = budget.amount - (budget.current_spent || 0);

            return (
              <Card key={budget.id} className="relative">
                <div className="space-y-4">
                  {/* Header du budget */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {budget.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPeriod(budget)}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleBudget(budget)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title={budget.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {budget.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingBudget(budget)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingBudget(budget)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Statut et badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={status.color}
                      className="flex items-center space-x-1"
                    >
                      {getStatusIcon(status)}
                      <span>{status.label}</span>
                    </Badge>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                      <CurrencyDisplay 
                        amount={budget.amount} 
                        currency={budget.currency} 
                        size="sm" 
                      />
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Dépensé: <CurrencyDisplay amount={budget.current_spent || 0} currency={budget.currency} size="sm" />
                      </span>
                      <span className={`font-medium ${percentage > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          percentage > 100 
                            ? 'bg-red-500' 
                            : percentage > 80 
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={`${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {remaining >= 0 ? 'Restant: ' : 'Dépassement: '}
                        <CurrencyDisplay amount={Math.abs(remaining)} currency={budget.currency} size="sm" />
                      </span>
                    </div>
                  </div>

                  {/* Catégories */}
                  {budget.categories && budget.categories.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Catégories:</p>
                      <div className="flex flex-wrap gap-1">
                        {budget.categories.slice(0, 3).map((category) => (
                          <span
                            key={category}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {category}
                          </span>
                        ))}
                        {budget.categories.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                            +{budget.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal formulaire d'ajout */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="📊 Nouveau Budget"
        size="lg"
      >
        <BudgetForm
          onSubmit={handleAddBudget}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Modal formulaire de modification */}
      <Modal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        title="✏️ Modifier le Budget"
        size="lg"
      >
        {editingBudget && (
          <BudgetForm
            initialData={editingBudget}
            onSubmit={handleUpdateBudget}
            onCancel={() => setEditingBudget(null)}
          />
        )}
      </Modal>

      {/* Modal confirmation suppression */}
      <Modal
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        title="🗑️ Supprimer le Budget"
      >
        {deletingBudget && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-300">
                  Attention - Suppression définitive
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Cette action ne peut pas être annulée.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">
              Êtes-vous sûr de vouloir supprimer le budget <strong>"{deletingBudget.name}"</strong> ?
            </p>
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setDeletingBudget(null)}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteBudget}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer définitivement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BudgetsList;