import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Lightbulb, 
  History, 
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { TRANSACTION_CATEGORIES } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/format';
import { useTransaction } from '../hooks/useTransaction';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';

/**
 * Composant TransactionSuggestions - Suggestions intelligentes basées sur l'historique
 * 
 * @example
 * <TransactionSuggestions
 *   onSuggestionSelect={handleSuggestionSelect}
 *   currentTransaction={currentTransaction}
 *   className="mb-6"
 * />
 */
const TransactionSuggestions = ({
  onSuggestionSelect,
  currentTransaction = {},
  limit = 5,
  className = ''
}) => {
  const { getTransactionSuggestions, searchTransactions } = useTransaction();
  const { mode } = useSelector((state) => state.theme);
  
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isDark = mode === 'dark';

  // Charger les suggestions
  useEffect(() => {
    loadSuggestions();
  }, [currentTransaction, limit]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        ...(currentTransaction.category && { category: currentTransaction.category }),
        ...(currentTransaction.description && { description: currentTransaction.description })
      };

      const result = await getTransactionSuggestions(params);
      
      if (result.success) {
        setSuggestions(result.data.personalSuggestions || []);
      }
    } catch (error) {
      console.error('Erreur chargement suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion) => {
    const transactionData = {
      description: suggestion.description,
      category: suggestion.category,
      amount: suggestion.suggestedAmount,
      // Autres champs basés sur la suggestion
    };
    
    onSuggestionSelect?.(transactionData);
  };

  // Obtenir l'icône selon le type de suggestion
  const getSuggestionIcon = (suggestion, index) => {
    if (index === 0) {
      return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
    }
    
    if (suggestion.frequency > 5) {
      return <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
    }
    
    return <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  };

  // Obtenir le badge de score
  const getScoreBadge = (suggestion) => {
    if (suggestion.frequency > 10) {
      return <Badge color="green" size="sm">Très fréquent</Badge>;
    }
    if (suggestion.frequency > 5) {
      return <Badge color="orange" size="sm">Fréquent</Badge>;
    }
    return <Badge color="blue" size="sm">Occasionnel</Badge>;
  };

  if (isLoading || suggestions.length === 0) {
    return null;
  }

  return (
    <Card variant="glass" className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Suggestions Intelligentes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Basé sur vos habitudes de transaction
            </p>
          </div>
        </div>

        <Badge color="teal" variant="subtle">
          {suggestions.length} suggestions
        </Badge>
      </div>

      {/* Liste des suggestions */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const categoryInfo = TRANSACTION_CATEGORIES[suggestion.category] || TRANSACTION_CATEGORIES.autre;
          
          return (
            <Card
              key={`${suggestion.description}-${suggestion.category}-${index}`}
              variant="glass"
              hoverable
              clickable
              onClick={() => handleSuggestionSelect(suggestion)}
              className="p-3 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Icône */}
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0">
                    {getSuggestionIcon(suggestion, index)}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {suggestion.description}
                      </h4>
                      {getScoreBadge(suggestion)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoryInfo.color }}
                        />
                        {categoryInfo.name}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(suggestion.lastUsed)}
                      </span>

                      <span>
                        Utilisé {suggestion.frequency} fois
                      </span>
                    </div>

                    {/* Montant suggéré */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                        {formatCurrency(suggestion.suggestedAmount, 'HTG')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (moyenne)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="flex-shrink-0 ml-2"
                >
                  Utiliser
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pied de page */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            💡 Les suggestions s'améliorent avec l'utilisation
          </span>
          <button
            onClick={loadSuggestions}
            className="text-teal-600 dark:text-teal-400 hover:underline"
          >
            Actualiser
          </button>
        </div>
      </div>
    </Card>
  );
};

TransactionSuggestions.propTypes = {
  onSuggestionSelect: PropTypes.func,
  currentTransaction: PropTypes.shape({
    description: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number
  }),
  limit: PropTypes.number,
  className: PropTypes.string
};

export default TransactionSuggestions;