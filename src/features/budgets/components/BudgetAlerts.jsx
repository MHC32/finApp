// src/features/budgets/components/BudgetAlerts.jsx
import { forwardRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  AlertTriangle, 
  Bell, 
  BellOff,
  Settings,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  Archive
} from 'lucide-react';

// Composants réutilisables
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Alert from '../../../components/ui/Alert';
import EmptyState from '../../../components/ui/EmptyState';
import Tabs from '../../../components/ui/Tabs';
import Select from '../../../components/ui/Select';
import Loading from '../../../components/ui/Loading';

// Utilitaires
import { formatCurrency, formatDate, formatRelativeTime } from '../../../utils/formatters';

/**
 * Composant BudgetAlerts - Gestionnaire d'alertes et notifications budgets
 * 
 * Features:
 * - Liste des alertes actives et archivées
 * - Filtrage par type et sévérité
 * - Actions rapides (marquer comme lu, archiver)
 * - Paramètres de notifications
 * - Alertes intelligentes basées sur les tendances
 * - Support multi-budgets
 */
const BudgetAlerts = forwardRef(({
  alerts = [],
  budgets = [],
  onMarkAsRead = () => {},
  onArchiveAlert = () => {},
  onDismissAlert = () => {},
  onConfigureNotifications = () => {},
  loading = false,
  className = '',
  ...props
}, ref) => {
  const [activeTab, setActiveTab] = useState('active');
  const [filters, setFilters] = useState({
    severity: 'all',
    budget: 'all',
    type: 'all'
  });

  // Types d'alertes
  const ALERT_TYPES = {
    BUDGET_EXCEEDED: {
      code: 'budget_exceeded',
      name: 'Budget dépassé',
      icon: TrendingUp,
      color: 'red',
      description: 'Le budget a été dépassé'
    },
    CATEGORY_CRITICAL: {
      code: 'category_critical',
      name: 'Catégorie critique',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Une catégorie approche du budget'
    },
    TREND_WARNING: {
      code: 'trend_warning',
      name: 'Tendance inquiétante',
      icon: TrendingUp,
      color: 'yellow',
      description: 'Dépenses plus élevées que prévu'
    },
    UPCOMING_DEADLINE: {
      code: 'upcoming_deadline',
      name: 'Échéance proche',
      icon: Clock,
      color: 'blue',
      description: 'Fin de période budgétaire approchant'
    },
    LOW_BALANCE: {
      code: 'low_balance',
      name: 'Solde faible',
      icon: DollarSign,
      color: 'purple',
      description: 'Solde insuffisant pour les dépenses prévues'
    }
  };

  // Filtrer les alertes
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Filtre par statut
      if (activeTab === 'active' && alert.isArchived) return false;
      if (activeTab === 'archived' && !alert.isArchived) return false;
      if (activeTab === 'read' && !alert.isRead) return false;

      // Filtres supplémentaires
      if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
      if (filters.budget !== 'all' && alert.budgetId !== filters.budget) return false;
      if (filters.type !== 'all' && alert.type !== filters.type) return false;

      return true;
    });
  }, [alerts, activeTab, filters]);

  // Statistiques des alertes
  const alertStats = useMemo(() => {
    const activeAlerts = alerts.filter(alert => !alert.isArchived);
    const unreadAlerts = activeAlerts.filter(alert => !alert.isRead);
    const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

    return {
      total: alerts.length,
      active: activeAlerts.length,
      unread: unreadAlerts.length,
      critical: criticalAlerts.length,
      archived: alerts.filter(alert => alert.isArchived).length
    };
  }, [alerts]);

  // Gérer les actions d'alerte
  const handleMarkAsRead = (alertId) => {
    onMarkAsRead(alertId);
  };

  const handleArchiveAlert = (alertId) => {
    onArchiveAlert(alertId);
  };

  const handleDismissAlert = (alertId) => {
    onDismissAlert(alertId);
  };

  // Obtenir la configuration d'un type d'alerte
  const getAlertTypeConfig = (typeCode) => {
    return ALERT_TYPES[typeCode] || {
      code: typeCode,
      name: typeCode,
      icon: Bell,
      color: 'gray',
      description: 'Alerte système'
    };
  };

  // Options de filtrage
  const severityOptions = [
    { value: 'all', label: 'Toutes les sévérités' },
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Élevée' },
    { value: 'critical', label: 'Critique' }
  ];

  const budgetOptions = [
    { value: 'all', label: 'Tous les budgets' },
    ...budgets.map(budget => ({
      value: budget._id,
      label: budget.name
    }))
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    ...Object.values(ALERT_TYPES).map(type => ({
      value: type.code,
      label: type.name
    }))
  ];

  if (loading) {
    return (
      <Card className={className}>
        <Loading.SkeletonCard />
      </Card>
    );
  }

  return (
    <div ref={ref} className={`space-y-6 ${className}`} {...props}>
      {/* En-tête avec statistiques */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alertes Budgets
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Surveillez l'état de vos budgets et recevez des notifications
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Statistiques rapides */}
          <div className="flex items-center gap-4 text-sm">
            {alertStats.unread > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {alertStats.unread} non lue(s)
                </span>
              </div>
            )}
            
            {alertStats.critical > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {alertStats.critical} critique(s)
                </span>
              </div>
            )}
          </div>

          {/* Actions globales */}
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigureNotifications}
            leftIcon={Settings}
          >
            Paramètres
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab 
            value="active" 
            icon={Bell}
            badge={alertStats.unread}
          >
            Alertes actives
          </Tabs.Tab>
          <Tabs.Tab 
            value="archived" 
            icon={Archive}
            badge={alertStats.archived}
          >
            Archivées
          </Tabs.Tab>
          <Tabs.Tab value="settings" icon={Settings}>
            Paramètres
          </Tabs.Tab>
        </Tabs.List>

        {/* Onglet Alertes Actives */}
        <Tabs.Panel value="active">
          <div className="space-y-4">
            {/* Filtres */}
            <Card variant="glass">
              <div className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filtres:
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                    <Select
                      options={severityOptions}
                      value={filters.severity}
                      onChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
                      size="sm"
                    />

                    <Select
                      options={budgetOptions}
                      value={filters.budget}
                      onChange={(value) => setFilters(prev => ({ ...prev, budget: value }))}
                      size="sm"
                    />

                    <Select
                      options={typeOptions}
                      value={filters.type}
                      onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Liste des alertes */}
            {filteredAlerts.length > 0 ? (
              <div className="space-y-3">
                {filteredAlerts.map(alert => (
                  <AlertItem
                    key={alert._id}
                    alert={alert}
                    onMarkAsRead={handleMarkAsRead}
                    onArchive={handleArchiveAlert}
                    onDismiss={handleDismissAlert}
                    getAlertTypeConfig={getAlertTypeConfig}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                variant="success"
                icon={CheckCircle2}
                title="Aucune alerte active"
                description={
                  filters.severity !== 'all' || filters.budget !== 'all' || filters.type !== 'all'
                    ? "Aucune alerte ne correspond à vos filtres actuels"
                    : "Toutes vos alertes sont gérées ! Vos budgets sont en bonne santé."
                }
                action={
                  (filters.severity !== 'all' || filters.budget !== 'all' || filters.type !== 'all') && (
                    <Button
                      onClick={() => setFilters({ severity: 'all', budget: 'all', type: 'all' })}
                    >
                      Réinitialiser les filtres
                    </Button>
                  )
                }
              />
            )}
          </div>
        </Tabs.Panel>

        {/* Onglet Alertes Archivées */}
        <Tabs.Panel value="archived">
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              <div className="space-y-3">
                {filteredAlerts.map(alert => (
                  <AlertItem
                    key={alert._id}
                    alert={alert}
                    onMarkAsRead={handleMarkAsRead}
                    onArchive={handleArchiveAlert}
                    onDismiss={handleDismissAlert}
                    getAlertTypeConfig={getAlertTypeConfig}
                    isArchivedView={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                variant="empty"
                icon={Archive}
                title="Aucune alerte archivée"
                description="Les alertes que vous archivez apparaîtront ici"
              />
            )}
          </div>
        </Tabs.Panel>

        {/* Onglet Paramètres */}
        <Tabs.Panel value="settings">
          <NotificationSettings
            onConfigureNotifications={onConfigureNotifications}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
});

BudgetAlerts.displayName = 'BudgetAlerts';

// Sous-composant AlertItem
const AlertItem = forwardRef(({
  alert,
  onMarkAsRead,
  onArchive,
  onDismiss,
  getAlertTypeConfig,
  isArchivedView = false,
  className = ''
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const alertConfig = getAlertTypeConfig(alert.type);
  const AlertIcon = alertConfig.icon;

  // Couleur selon la sévérité
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'gray',
      medium: 'blue',
      high: 'orange',
      critical: 'red'
    };
    return colors[severity] || 'gray';
  };

  const severityColor = getSeverityColor(alert.severity);

  return (
    <Card
      ref={ref}
      variant={alert.isRead ? 'glass' : 'teal'}
      className={`relative overflow-hidden transition-all duration-200 ${
        !alert.isRead ? 'ring-1 ring-teal-200 dark:ring-teal-800' : ''
      } ${className}`}
    >
      {/* Indicateur de non-lu */}
      {!alert.isRead && (
        <div className="absolute top-4 left-4 w-2 h-2 bg-teal-500 rounded-full"></div>
      )}

      <div className="p-4">
        {/* En-tête de l'alerte */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icône */}
            <div className={`p-2 rounded-lg ${
              severityColor === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
              severityColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20' :
              severityColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
              'bg-gray-100 dark:bg-gray-900/20'
            }`}>
              <AlertIcon className={`w-5 h-5 ${
                severityColor === 'red' ? 'text-red-600 dark:text-red-400' :
                severityColor === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                severityColor === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                'text-gray-600 dark:text-gray-400'
              }`} />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {alert.title}
                </h4>
                
                <Badge
                  size="sm"
                  color={severityColor}
                  variant="subtle"
                >
                  {alertConfig.name}
                </Badge>

                {alert.isArchived && (
                  <Badge size="sm" color="gray" variant="subtle" leftIcon={Archive}>
                    Archivée
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {alert.message}
              </p>

              {/* Métadonnées */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatRelativeTime(alert.createdAt)}</span>
                {alert.budgetName && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{alert.budgetName}</span>
                  </>
                )}
                {alert.amount && (
                  <>
                    <span>•</span>
                    <span className="font-medium">
                      {formatCurrency(alert.amount, alert.currency)}
                    </span>
                  </>
                )}
              </div>

              {/* Détails supplémentaires */}
              {isExpanded && alert.details && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {alert.details}
                  </div>
                  
                  {alert.suggestions && (
                    <div className="mt-2">
                      <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                        Suggestions:
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {alert.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {!isArchivedView && (
              <>
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(alert._id)}
                    className="text-gray-500 hover:text-green-600"
                    title="Marquer comme lu"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-500 hover:text-blue-600"
                  title={isExpanded ? "Réduire" : "Développer"}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onArchive(alert._id)}
                  className="text-gray-500 hover:text-orange-600"
                  title="Archiver l'alerte"
                >
                  <Archive className="w-4 h-4" />
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(alert._id)}
              className="text-gray-500 hover:text-red-600"
              title="Supprimer l'alerte"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

AlertItem.displayName = 'AlertItem';

// Sous-composant NotificationSettings
const NotificationSettings = forwardRef(({
  onConfigureNotifications,
  className = ''
}, ref) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetExceeded: true,
    categoryCritical: true,
    trendWarnings: true,
    upcomingDeadlines: true,
    lowBalance: true,
    weeklyDigest: true,
    monthlyReport: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card ref={ref} className={className}>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Paramètres de notifications
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Configurez comment et quand vous recevez des alertes pour vos budgets
          </p>
        </div>

        {/* Canaux de notification */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Canaux de notification
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Notifications par email
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Recevez des alertes par email
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Notifications push
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Alertes en temps réel dans l'application
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>
          </div>
        </div>

        {/* Types d'alertes */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Types d'alertes
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'budgetExceeded', label: 'Budget dépassé', description: 'Quand un budget est dépassé' },
              { key: 'categoryCritical', label: 'Catégorie critique', description: 'Catégorie proche du budget' },
              { key: 'trendWarnings', label: 'Alertes tendances', description: 'Dépenses anormalement élevées' },
              { key: 'upcomingDeadlines', label: 'Échéances', description: 'Fin de période approchant' },
              { key: 'lowBalance', label: 'Solde faible', description: 'Solde insuffisant prévu' },
              { key: 'weeklyDigest', label: 'Résumé hebdomadaire', description: 'Synthèse de la semaine' }
            ].map(setting => (
              <label key={setting.key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[setting.key]}
                  onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {setting.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {setting.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => setSettings({
              emailNotifications: true,
              pushNotifications: true,
              budgetExceeded: true,
              categoryCritical: true,
              trendWarnings: true,
              upcomingDeadlines: true,
              lowBalance: true,
              weeklyDigest: true,
              monthlyReport: false
            })}
          >
            Réinitialiser
          </Button>

          <Button onClick={onConfigureNotifications}>
            Enregistrer les paramètres
          </Button>
        </div>
      </div>
    </Card>
  );
});

NotificationSettings.displayName = 'NotificationSettings';

BudgetAlerts.propTypes = {
  /** Liste des alertes */
  alerts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['low', 'medium', 'high', 'critical']).isRequired,
    isRead: PropTypes.bool,
    isArchived: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
    budgetId: PropTypes.string,
    budgetName: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string,
    details: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string)
  })),
  
  /** Liste des budgets pour le filtrage */
  budgets: PropTypes.array,
  
  /** Callback marquer comme lu */
  onMarkAsRead: PropTypes.func,
  
  /** Callback archiver alerte */
  onArchiveAlert: PropTypes.func,
  
  /** Callback supprimer alerte */
  onDismissAlert: PropTypes.func,
  
  /** Callback configuration notifications */
  onConfigureNotifications: PropTypes.func,
  
  /** État de chargement */
  loading: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default BudgetAlerts;