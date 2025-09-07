// src/pages/budgets/AddBudget.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Target } from 'lucide-react';
import { useBudgets } from '../../hooks/useBudgets';
import { Button, Card } from '../../components/ui';
import BudgetForm from '../../components/forms/BudgetForm';

const AddBudget = () => {
  const navigate = useNavigate();
  const { addBudget } = useBudgets();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBudget, setCreatedBudget] = useState(null);

  const handleSubmit = async (budgetData) => {
    try {
      const newBudget = await addBudget(budgetData);
      setCreatedBudget(newBudget);
      setIsSuccess(true);
      
      // Rediriger vers la liste après 2 secondes
      setTimeout(() => {
        navigate('/budgets');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création du budget:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/budgets');
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Budget créé avec succès !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Le budget "{createdBudget?.name}" a été ajouté et est maintenant actif.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800 dark:text-blue-300">Montant du budget:</span>
                <span className="font-semibold text-blue-900 dark:text-blue-200">
                  {new Intl.NumberFormat('fr-HT', {
                    style: 'currency',
                    currency: createdBudget?.currency === 'HTG' ? 'HTG' : 'USD'
                  }).format(createdBudget?.amount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-blue-800 dark:text-blue-300">Période:</span>
                <span className="font-semibold text-blue-900 dark:text-blue-200">
                  {createdBudget?.period === 'monthly' ? 'Mensuel' : 
                   createdBudget?.period === 'weekly' ? 'Hebdomadaire' : 'Personnalisé'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirection vers vos budgets...
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span>📊 Nouveau Budget</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez un budget pour suivre et contrôler vos dépenses
          </p>
        </div>
      </div>

      {/* Conseils et informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>💡 Conseils pour créer un budget efficace</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>Soyez réaliste:</strong> Basez-vous sur vos dépenses passées</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>Choisissez les bonnes catégories:</strong> Sélectionnez seulement les catégories pertinentes</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>Définissez des alertes:</strong> 80% est un bon seuil d'alerte</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>Révisez régulièrement:</strong> Ajustez vos budgets selon vos besoins</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Formulaire */}
      <BudgetForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddBudget;