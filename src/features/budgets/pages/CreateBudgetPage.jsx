import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Rocket, 
  Target,
  FileText,
  CheckCircle2
} from 'lucide-react';

// Composants
import BudgetTemplates from '../components/BudgetTemplates';
import CreateBudgetModal from '../components/CreateBudgetModal';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/common/EmptyState';
import Loading from '../../../components/ui/Loading';

// Hooks et store
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../../../hooks/useToast';
import { ROUTES } from '../../../utils/constants';

/**
 * Page de création de budget avec templates et assistant
 */
const CreateBudgetPage = () => {
  const navigate = useNavigate();
  
  const {
    // État
    budgetTemplates,
    templatesLoading,
    isCreating,
    
    // Actions
    createBudget,
    createBudgetFromTemplate,
    getBudgetTemplates
  } = useBudget();

  const { success, error } = useToast();

  // États locaux
  const [creationMode, setCreationMode] = useState('template'); // 'template' | 'custom' | 'quick'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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
        navigate(ROUTES.BUDGETS_DETAIL.replace(':id', result.data.budget._id));
      }
    } catch (err) {
      error('Erreur lors de la création du budget depuis template');
    }
  };

  // Créer un budget personnalisé
  const handleCustomCreate = async (budgetData) => {
    try {
      const result = await createBudget(budgetData);
      
      if (result.success) {
        success('Budget personnalisé créé avec succès !');
        navigate(ROUTES.BUDGETS_DETAIL.replace(':id', result.data.budget._id));
      }
    } catch (err) {
      error('Erreur lors de la création du budget personnalisé');
    }
  };

  // Création rapide
  const handleQuickCreate = async (quickData) => {
    try {
      const budgetData = {
        name: quickData.name,
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        currency: userPreferences.currency,
        categories: {
          alimentation: quickData.amount * 0.3,
          transport: quickData.amount * 0.15,
          logement: quickData.amount * 0.25,
          factures: quickData.amount * 0.1,
          loisirs: quickData.amount * 0.1,
          epargne: quickData.amount * 0.1
        },
        alertSettings: {
          warningThreshold: 80,
          criticalThreshold: 95
        }
      };

      const result = await createBudget(budgetData);
      
      if (result.success) {
        success('Budget rapide créé avec succès !');
        navigate(ROUTES.BUDGETS_DETAIL.replace(':id', result.data.budget._id));
      }
    } catch (err) {
      error('Erreur lors de la création du budget rapide');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de page */}
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.BUDGETS)}
            leftIcon={ArrowLeft}
            size="sm"
            className="mb-4"
          >
            Retour aux budgets
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Créer un nouveau budget
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choisissez la méthode qui vous convient le mieux pour créer votre budget
          </p>
        </div>

        {/* Sélection du mode de création */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode Template */}
            <Card
              variant={creationMode === 'template' ? 'teal' : 'glass'}
              hoverable={true}
              clickable={true}
              onClick={() => setCreationMode('template')}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Depuis un modèle
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Utilisez un modèle prédéfini adapté à votre situation
              </p>
              
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 text-left">
                <li>• Modèles optimisés</li>
                <li>• Recommandations intelligentes</li>
                <li>• Configuration rapide</li>
              </ul>
            </Card>

            {/* Mode Personnalisé */}
            <Card
              variant={creationMode === 'custom' ? 'teal' : 'glass'}
              hoverable={true}
              clickable={true}
              onClick={() => setCreationMode('custom')}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Personnalisé
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Créez un budget entièrement personnalisé from scratch
              </p>
              
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 text-left">
                <li>• Contrôle total</li>
                <li>• Catégories personnalisées</li>
                <li>• Paramètres avancés</li>
              </ul>
            </Card>

            {/* Mode Rapide */}
            <Card
              variant={creationMode === 'quick' ? 'teal' : 'glass'}
              hoverable={true}
              clickable={true}
              onClick={() => setCreationMode('quick')}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Création rapide
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Budget simple en 2 minutes pour commencer rapidement
              </p>
              
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 text-left">
                <li>• Configuration minimale</li>
                <li>• Répartition automatique</li>
                <li>• Idéal pour débutants</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Contenu selon le mode sélectionné */}
        <div className="space-y-8">
          {/* Mode Template */}
          {creationMode === 'template' && (
            <div className="animate-fadeIn">
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
                  onCustomCreate={() => setShowCreateModal(true)}
                  loading={isCreating}
                />
              )}
            </div>
          )}

          {/* Mode Personnalisé */}
          {creationMode === 'custom' && (
            <div className="animate-fadeIn">
              <Card>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Création personnalisée
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Créez un budget entièrement personnalisé avec un contrôle total sur 
                    toutes les catégories et paramètres.
                  </p>
                  
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    size="lg"
                    leftIcon={FileText}
                  >
                    Commencer la création personnalisée
                  </Button>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Contrôle total
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Définissez chaque catégorie manuellement
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Paramètres avancés
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Alertes personnalisées et options détaillées
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Flexibilité maximale
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Adapté à toutes les situations complexes
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Mode Rapide */}
          {creationMode === 'quick' && (
            <div className="animate-fadeIn">
              <Card>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Rocket className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Création rapide
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400">
                      Budget simple et efficace en quelques clics
                    </p>
                  </div>

                  {/* Formulaire rapide */}
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du budget
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Budget Personnel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Budget total mensuel ({userPreferences.currency})
                      </label>
                      <input
                        type="number"
                        placeholder="50000"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Devise
                      </label>
                      <select
                        value={userPreferences.currency}
                        onChange={(e) => setUserPreferences(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      >
                        <option value="HTG">Gourdes (HTG)</option>
                        <option value="USD">Dollars (USD)</option>
                      </select>
                    </div>

                    {/* Aperçu de la répartition */}
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">
                        Répartition automatique proposée:
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Alimentation:</span>
                          <span>30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transport:</span>
                          <span>15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Logement:</span>
                          <span>25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Factures:</span>
                          <span>10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loisirs:</span>
                          <span>10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Épargne:</span>
                          <span>10%</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleQuickCreate}
                      isLoading={isCreating}
                      leftIcon={Rocket}
                      fullWidth
                      size="lg"
                    >
                      Créer mon budget rapide
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Vous pourrez ajuster la répartition après la création
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création personnalisée */}
      <CreateBudgetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCustomCreate}
        loading={isCreating}
      />
    </div>
  );
};

export default CreateBudgetPage;