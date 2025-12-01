// src/features/sols/components/SolCard.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import ProgressBar from '../../../components/ui/ProgressBar';
import Avatar from '../../../components/ui/Avatar';

/**
 * Composant SolCard - Carte d'affichage d'un sol/tontine
 * 
 * Features:
 * - Statut visuel du sol (recruiting, active, completed)
 * - Progression des rounds
 * - Participants avec avatars
 * - Actions rapides (rejoindre, payer, voir détails)
 * - Badges pour type et statut
 * - Support Light/Dark + Glassmorphism
 * 
 * @example
 * <SolCard
 *   sol={solData}
 *   onViewDetails={handleViewDetails}
 *   onJoin={handleJoin}
 *   onPayment={handlePayment}
 * />
 */
const SolCard = forwardRef(({
  sol,
  onViewDetails = () => {},
  onJoin = () => {},
  onPayment = () => {},
  onMoreActions = () => {},
  className = ''
}, ref) => {
  // Configuration selon le statut du sol
  const statusConfig = {
    recruiting: {
      color: 'blue',
      icon: Clock,
      label: 'Recrutement',
      action: 'Rejoindre',
      onAction: onJoin
    },
    active: {
      color: 'teal',
      icon: CheckCircle2,
      label: 'Actif',
      action: 'Payer',
      onAction: onPayment
    },
    completed: {
      color: 'green',
      icon: CheckCircle2,
      label: 'Terminé',
      action: 'Voir',
      onAction: onViewDetails
    },
    cancelled: {
      color: 'red',
      icon: AlertCircle,
      label: 'Annulé',
      action: 'Voir',
      onAction: onViewDetails
    }
  };

  // Configuration selon le type de sol
  const typeConfig = {
    classic: { color: 'teal', label: 'Classique' },
    business: { color: 'blue', label: 'Business' },
    emergency: { color: 'orange', label: 'Urgence' },
    project: { color: 'purple', label: 'Projet' },
    savings: { color: 'green', label: 'Épargne' }
  };

  const status = statusConfig[sol.status] || statusConfig.recruiting;
  const type = typeConfig[sol.type] || typeConfig.classic;
  const StatusIcon = status.icon;

  // Calculer la progression
  const progressPercentage = sol.progressPercentage || 
    Math.round((sol.completedRounds / sol.totalRounds) * 100);

  // Participants à afficher (max 4)
  const displayParticipants = sol.participants?.slice(0, 4) || [];
  const remainingParticipants = Math.max(0, (sol.participants?.length || 0) - 4);

  return (
    <Card
      ref={ref}
      variant="glass"
      hoverable
      clickable
      className={`group relative overflow-hidden ${className}`}
      onClick={onViewDetails}
    >
      {/* Header avec badge de statut */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge color={type.color} size="sm">
              {type.label}
            </Badge>
            <Badge 
              color={status.color} 
              variant="subtle" 
              size="sm"
              dot
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {sol.name}
          </h3>
          
          {sol.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {sol.description}
            </p>
          )}
        </div>

        {/* Menu actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onMoreActions(sol);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Contribution</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {sol.contributionAmount?.toLocaleString()} {sol.currency}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Participants</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {sol.participants?.length || 0}/{sol.maxParticipants}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">Fréquence</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
            {sol.frequency === 'monthly' ? 'Mensuel' : 
             sol.frequency === 'weekly' ? 'Hebdo' : 
             sol.frequency === 'biweekly' ? 'Bi-hebdo' : 'Trimestriel'}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span>Progression</span>
          <span>{progressPercentage}%</span>
        </div>
        <ProgressBar
          value={progressPercentage}
          max={100}
          color="teal"
          size="sm"
          striped={sol.status === 'active'}
          animated={sol.status === 'active'}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
          <span>Round {sol.completedRounds || 0}/{sol.totalRounds || sol.maxParticipants}</span>
          {sol.nextPaymentDate && (
            <span>Prochain: {new Date(sol.nextPaymentDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Participants */}
      {displayParticipants.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar.Group size="sm" max={4}>
              {displayParticipants.map((participant, index) => (
                <Avatar
                  key={index}
                  name={participant.user?.firstName + ' ' + participant.user?.lastName}
                  size="sm"
                  status={participant.paymentStatus === 'paid' ? 'online' : 'offline'}
                />
              ))}
            </Avatar.Group>
            
            {remainingParticipants > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{remainingParticipants}
              </span>
            )}
          </div>

          {/* Bouton d'action principal */}
          {sol.status !== 'completed' && sol.status !== 'cancelled' && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                status.onAction(sol);
              }}
              disabled={sol.status === 'completed' || sol.status === 'cancelled'}
            >
              {status.action}
            </Button>
          )}
        </div>
      )}

      {/* Footer avec créateur */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Avatar
            name={sol.creator?.firstName + ' ' + sol.creator?.lastName}
            size="xs"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Par {sol.creator?.firstName}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          rightIcon={ArrowRight}
        >
          Détails
        </Button>
      </div>

      {/* Indicateur de statut (bordure colorée) */}
      <div 
        className={`absolute top-0 left-0 w-1 h-full bg-${status.color}-500`}
        aria-hidden="true"
      />
    </Card>
  );
});

SolCard.displayName = 'SolCard';

SolCard.propTypes = {
  /** Données du sol à afficher */
  sol: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['classic', 'business', 'emergency', 'project', 'savings']).isRequired,
    status: PropTypes.oneOf(['recruiting', 'active', 'completed', 'cancelled']).isRequired,
    description: PropTypes.string,
    contributionAmount: PropTypes.number.isRequired,
    currency: PropTypes.oneOf(['HTG', 'USD']).isRequired,
    maxParticipants: PropTypes.number.isRequired,
    participants: PropTypes.arrayOf(PropTypes.shape({
      user: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      }),
      paymentStatus: PropTypes.string
    })),
    frequency: PropTypes.oneOf(['weekly', 'biweekly', 'monthly', 'quarterly']).isRequired,
    progressPercentage: PropTypes.number,
    completedRounds: PropTypes.number,
    totalRounds: PropTypes.number,
    nextPaymentDate: PropTypes.string,
    creator: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string
    })
  }).isRequired,
  
  /** Callback pour voir les détails */
  onViewDetails: PropTypes.func,
  
  /** Callback pour rejoindre le sol */
  onJoin: PropTypes.func,
  
  /** Callback pour effectuer un paiement */
  onPayment: PropTypes.func,
  
  /** Callback pour plus d'actions */
  onMoreActions: PropTypes.func,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default SolCard;