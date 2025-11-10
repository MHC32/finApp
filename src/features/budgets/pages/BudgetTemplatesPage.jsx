// src/features/budgets/pages/BudgetTemplatesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus,
  Search,
  Filter,
  Star,
  Rocket
} from 'lucide-react';

// Composants
import BudgetTemplates from '../components/BudgetTemplates';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/common/EmptyState';

// Hooks et store
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../utils/constants';

/**
 * Page dédiée aux templates de budgets
 */
const BudgetTemplatesPage = () => {
  const navigate = useNavigate();
  
  const {
    // État
    budgetTemplates,
    templatesLoading,
    isCreating,
    
    // Actions
    createBudgetFromTemplate,
    getBudgetTemplates
  } = useBudget();

  const { success, error } = useToast();

  // États locaux
  const [userPreferences, setUserPreferences] = useState({
    incomeRange: 50000,
    currency: 'HTG',
    lifestyle: 'moderate'
  });

  // Chargement des templates
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      await getBudgetTemplates();
    } catch (err) {
      error('Erreur lors du chargement des templates');
    }
  };

  // Créer un budget depuis un template
  const handleTemplateSelect = async (templateData) => {
    try {
      const result = await createBudgetFromTemplate(
        templateData.templateId,
        templateData
      );
      
      if (result.success) {
        success('Budget créé avec succès depuis le template !');
        navigate(`/budgets/${result.data.budget._id}`);
      }
    } catch (err) {
      error('Erreur lors de la création du budget depuis template');
    }
  };

  // Créer un budget personnalisé
  const handleCustomCreate = () => {
    navigate(ROUTES.BUDGETS_CREATE);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de page */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(ROUTES.BUDGETS)}
                leftIcon={ArrowLeft}
                size="sm"
              >
                Retour
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Modèles de Budgets
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  Découvrez nos modèles optimisés pour différents profils
                </p>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCustomCreate}
                leftIcon={Plus}
                size="lg"
              >
                Créer personnalisé
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques des templates */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {Object.keys(budgetTemplates).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Modèles disponibles
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              85%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Taux de réussite
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              2 min
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Configuration moyenne
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              4.8/5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Satisfaction utilisateurs
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {templatesLoading ? (
          <div className="space-y-6">
            <Loading.SkeletonCard />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Loading.SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : (
          <BudgetTemplates
            templates={budgetTemplates}
            userPreferences={userPreferences}
            onTemplateSelect={handleTemplateSelect}
            onCustomCreate={handleCustomCreate}
            loading={isCreating}
          />
        )}

        {/* Section d'aide */}
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-4">
                Besoin d'aide pour choisir ?
              </h2>
              <p className="text-teal-100 mb-6">
                Notre assistant IA peut vous recommander le modèle parfait 
                en fonction de vos revenus, dépenses et objectifs financiers.
              </p>
              <Button
                variant="white"
                leftIcon={Rocket}
                size="lg"
                onClick={() => navigate(ROUTES.AI_BUDGET_ADVICE)}
              >
                Obtenir une recommandation IA
              </Button>
            </div>
            
            <div className="lg:w-1/3 flex justify-center mt-6 lg:mt-0">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-16 h-16 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTemplatesPage;