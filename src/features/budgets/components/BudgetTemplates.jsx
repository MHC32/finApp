// src/features/budgets/components/BudgetTemplates.jsx
import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Rocket, 
  Briefcase, 
  Users, 
  GraduationCap,
  CheckCircle2,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';

// Composants réutilisables
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import ProgressBar from '../../../components/ui/ProgressBar';
import EmptyState from '../../../components/common/EmptyState';
import SearchBar from '../../../components/common/SearchBar';
import Tabs from '../../../components/ui/Tabs';

// Utilitaires
import { BUDGET_TEMPLATES, TRANSACTION_CATEGORIES } from '../../../utils/constants';
import { formatCurrency, formatPercentage } from '../../../utils/format';

/**
 * Composant BudgetTemplates - Sélection et prévisualisation de modèles de budgets
 * 
 * Features:
 * - Gallery de templates avec prévisualisation
 * - Filtrage par type et popularité
 * - Détails complets avec répartition catégories
 * - Personnalisation avant création
 * - Templates recommandés
 * - Support création rapide
 */
const BudgetTemplates = forwardRef(({
  templates = BUDGET_TEMPLATES,
  userPreferences = {},
  onTemplateSelect = () => {},
  onCustomCreate = () => {},
  loading = false,
  className = '',
  ...props
}, ref) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customization, setCustomization] = useState({});

  // Icônes pour les templates
  const templateIcons = {
    student: GraduationCap,
    young_professional: Briefcase,
    family: Users,
    entrepreneur: Rocket
  };

  // Catégories de filtrage
  const categories = [
    { id: 'all', label: 'Tous les modèles', count: Object.keys(templates).length },
    { id: 'student', label: 'Étudiant', icon: GraduationCap, count: 1 },
    { id: 'young_professional', label: 'Jeune pro', icon: Briefcase, count: 1 },
    { id: 'family', label: 'Famille', icon: Users, count: 1 },
    { id: 'entrepreneur', label: 'Entrepreneur', icon: Rocket, count: 1 }
  ];

  // Filtrer les templates
  const filteredTemplates = Object.entries(templates)
    .filter(([id, template]) => {
      const matchesCategory = activeCategory === 'all' || id === activeCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .map(([id, template]) => ({
      id,
      ...template,
      icon: templateIcons[id] || Target
    }));

  // Templates recommandés (basé sur les préférences utilisateur)
  const recommendedTemplates = filteredTemplates
    .filter(template => {
      if (!userPreferences.incomeRange) return true;
      
      const incomeMatch = Math.abs(template.targetIncome - userPreferences.incomeRange) <= 10000;
      return incomeMatch;
    })
    .slice(0, 2);

  // Gérer la sélection d'un template
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Initialiser la personnalisation avec les valeurs du template
    setCustomization({
      name: `${template.name} ${new Date().getFullYear()}`,
      currency: userPreferences.currency || 'HTG',
      categories: { ...template.categories },
      totalAmount: template.targetIncome
    });
  };

  // Personnaliser une catégorie
  const handleCategoryCustomize = (categoryId, amount) => {
    setCustomization(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: amount
      },
      totalAmount: Object.values({
        ...prev.categories,
        [categoryId]: amount
      }).reduce((sum, amt) => sum + amt, 0)
    }));
  };

  // Créer le budget personnalisé
  const handleCreateBudget = () => {
    if (!selectedTemplate) return;

    onTemplateSelect({
      templateId: selectedTemplate.id,
      ...customization,
      period: 'monthly', // Par défaut mensuel
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
  };

  // Obtenir le nom d'affichage d'une catégorie
  const getCategoryName = (categoryKey) => {
    return TRANSACTION_CATEGORIES[categoryKey]?.name || categoryKey;
  };

  // Obtenir la couleur d'une catégorie
  const getCategoryColor = (categoryKey) => {
    return TRANSACTION_CATEGORIES[categoryKey]?.color || 'gray';
  };

  return (
    <div ref={ref} className={`space-y-6 ${className}`} {...props}>
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Modèles de Budgets
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Commencez rapidement avec un modèle prédéfini adapté à votre situation, 
          ou créez un budget personnalisé from scratch.
        </p>
      </div>

      {/* Recherche et filtres */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <SearchBar
            value={searchQuery}
            onSearch={setSearchQuery}
            placeholder="Rechercher un modèle..."
            size="md"
            className="lg:flex-1"
          />
          
          <Button
            variant="outline"
            onClick={onCustomCreate}
            leftIcon={Zap}
            size="md"
          >
            Créer personnalisé
          </Button>
        </div>

        {/* Catégories */}
        <Tabs value={activeCategory} onChange={setActiveCategory} variant="pills">
          <Tabs.List className="justify-center">
            {categories.map(category => (
              <Tabs.Tab
                key={category.id}
                value={category.id}
                icon={category.icon}
                badge={category.count}
              >
                {category.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </div>

      {/* Templates recommandés */}
      {recommendedTemplates.length > 0 && activeCategory === 'all' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Recommandé pour vous
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {recommendedTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                isRecommended={true}
                onSelect={handleTemplateSelect}
                currency={userPreferences.currency}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gallery de templates */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
              currency={userPreferences.currency}
              isSelected={selectedTemplate?.id === template.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="search"
          title="Aucun modèle trouvé"
          description="Essayez de modifier vos critères de recherche"
          action={
            <Button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              Voir tous les modèles
            </Button>
          }
        />
      )}

      {/* Panneau de personnalisation */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* En-tête */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedTemplate.icon className="w-8 h-8 text-teal-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Personnaliser le modèle
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>
                
                <Badge color="teal" variant="subtle" leftIcon={CheckCircle2}>
                  Recommandé
                </Badge>
              </div>

              {/* Informations du template */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                  <div className="text-sm text-teal-800 dark:text-teal-300">Budget total</div>
                  <div className="font-bold text-teal-600 dark:text-teal-400">
                    {formatCurrency(selectedTemplate.targetIncome, userPreferences.currency)}
                  </div>
                </div>
                
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">Catégories</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {Object.keys(selectedTemplate.categories).length}
                  </div>
                </div>
                
                <div className="text-center">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm text-purple-800 dark:text-purple-300">Période</div>
                  <div className="font-bold text-purple-600 dark:text-purple-400">
                    Mensuel
                  </div>
                </div>
              </div>

              {/* Personnalisation du nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de votre budget
                </label>
                <input
                  type="text"
                  value={customization.name}
                  onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="Donnez un nom à votre budget..."
                />
              </div>

              {/* Éditeur de catégories */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Répartition du budget
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(selectedTemplate.categories).map(([categoryId, amount]) => {
                    const percentage = (amount / selectedTemplate.targetIncome) * 100;
                    
                    return (
                      <div key={categoryId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: `var(--color-${getCategoryColor(categoryId)})` 
                              }}
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {getCategoryName(categoryId)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatPercentage(percentage)} du budget
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={customization.categories[categoryId] || amount}
                              onChange={(e) => handleCategoryCustomize(categoryId, Number(e.target.value))}
                              className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                              min="0"
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                              {userPreferences.currency}
                            </span>
                          </div>
                        </div>
                        
                        <ProgressBar
                          value={percentage}
                          max={100}
                          size="sm"
                          color={getCategoryColor(categoryId)}
                          showValue={false}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Total personnalisé */}
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-800 dark:text-teal-300">
                      Total personnalisé:
                    </span>
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {formatCurrency(customization.totalAmount, userPreferences.currency)}
                    </span>
                  </div>
                  
                  {customization.totalAmount !== selectedTemplate.targetIncome && (
                    <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">
                      {customization.totalAmount > selectedTemplate.targetIncome ? 
                        `+${formatCurrency(customization.totalAmount - selectedTemplate.targetIncome, userPreferences.currency)} vs modèle original` :
                        `-${formatCurrency(selectedTemplate.targetIncome - customization.totalAmount, userPreferences.currency)} vs modèle original`
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleTemplateSelect(selectedTemplate)}
                    disabled={loading}
                  >
                    Réinitialiser
                  </Button>
                  
                  <Button
                    onClick={handleCreateBudget}
                    isLoading={loading}
                    leftIcon={Rocket}
                  >
                    Créer le budget
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
});

BudgetTemplates.displayName = 'BudgetTemplates';

// Sous-composant TemplateCard
const TemplateCard = forwardRef(({
  template,
  onSelect,
  currency = 'HTG',
  isRecommended = false,
  isSelected = false,
  className = ''
}, ref) => {
  const TemplateIcon = template.icon;
  const totalAmount = template.targetIncome;
  
  // Calculer la répartition pour le graphique
  const categoryData = Object.entries(template.categories)
    .map(([categoryId, amount]) => ({
      name: categoryId,
      value: amount,
      percentage: (amount / totalAmount) * 100,
      color: TRANSACTION_CATEGORIES[categoryId]?.color || 'gray'
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3); // Top 3 catégories

  return (
    <Card
      ref={ref}
      variant={isSelected ? 'teal' : 'glass'}
      hoverable={true}
      clickable={true}
      onClick={() => onSelect(template)}
      className={`relative overflow-hidden transition-all duration-300 ${
        isSelected ? 'ring-2 ring-teal-500 scale-105' : 'hover:scale-105'
      } ${className}`}
    >
      {/* Badge recommandé */}
      {isRecommended && (
        <div className="absolute top-3 right-3 z-10">
          <Badge color="yellow" variant="solid" leftIcon={Star}>
            Recommandé
          </Badge>
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
          <TemplateIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>

      {/* Budget total */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">
          {formatCurrency(totalAmount, currency)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Budget mensuel recommandé
        </div>
      </div>

      {/* Top catégories */}
      <div className="space-y-3 mb-4">
        {categoryData.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ 
                  backgroundColor: `var(--color-${category.color})` 
                }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {TRANSACTION_CATEGORIES[category.name]?.name || category.name}
              </span>
            </div>
            
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(category.value, currency)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatPercentage(category.percentage)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression globale */}
      <ProgressBar
        value={100}
        max={100}
        size="sm"
        color="teal"
        showValue={false}
      />

      {/* Footer avec nombre de catégories */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {Object.keys(template.categories).length} catégories
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template);
          }}
        >
          Utiliser
        </Button>
      </div>
    </Card>
  );
});

TemplateCard.displayName = 'TemplateCard';

TemplateCard.propTypes = {
  template: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  currency: PropTypes.string,
  isRecommended: PropTypes.bool,
  isSelected: PropTypes.bool,
  className: PropTypes.string
};

BudgetTemplates.propTypes = {
  /** Liste des templates disponibles */
  templates: PropTypes.object,
  
  /** Préférences utilisateur pour les recommandations */
  userPreferences: PropTypes.shape({
    incomeRange: PropTypes.number,
    currency: PropTypes.string,
    lifestyle: PropTypes.string
  }),
  
  /** Callback sélection template */
  onTemplateSelect: PropTypes.func,
  
  /** Callback création personnalisée */
  onCustomCreate: PropTypes.func,
  
  /** État de chargement */
  loading: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default BudgetTemplates;