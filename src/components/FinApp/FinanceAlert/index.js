// src/components/FinApp/FinanceAlert/index.js
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// @mui icons
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';

// Types d'alertes financières avec configurations
const ALERT_TYPES = {
  // Alertes budgets
  budget_exceeded: {
    severity: 'error',
    icon: ErrorIcon,
    color: '#F44336',
    category: 'budget',
    priority: 'high',
    title: 'Budget Dépassé',
    autoHide: false,
    actions: ['adjust_budget', 'view_expenses', 'set_alert']
  },
  budget_warning: {
    severity: 'warning',
    icon: WarningIcon,
    color: '#FF9800',
    category: 'budget',
    priority: 'high',
    title: 'Attention Budget',
    autoHide: false,
    actions: ['reduce_expenses', 'view_budget', 'set_reminder']
  },
  budget_low: {
    severity: 'info',
    icon: InfoIcon,
    color: '#2196F3',
    category: 'budget',
    priority: 'medium',
    title: 'Budget Restant Faible',
    autoHide: true,
    autoHideDelay: 8000,
    actions: ['view_remaining', 'plan_expenses']
  },

  // Alertes comptes
  account_balance_critical: {
    severity: 'error',
    icon: AccountBalanceIcon,
    color: '#F44336',
    category: 'account',
    priority: 'high',
    title: 'Solde Critique',
    autoHide: false,
    actions: ['add_funds', 'view_account', 'emergency_budget']
  },
  account_balance_low: {
    severity: 'warning',
    icon: AccountBalanceIcon,
    color: '#FF9800',
    category: 'account',
    priority: 'medium',
    title: 'Solde Faible',
    autoHide: true,
    autoHideDelay: 10000,
    actions: ['add_funds', 'view_transactions']
  },
  account_overdraft: {
    severity: 'error',
    icon: CreditCardIcon,
    color: '#F44336',
    category: 'account',
    priority: 'high',
    title: 'Découvert Bancaire',
    autoHide: false,
    actions: ['immediate_payment', 'contact_bank']
  },

  // Alertes sols/tontines
  sol_payment_due: {
    severity: 'warning',
    icon: PaymentIcon,
    color: '#FF9800',
    category: 'sol',
    priority: 'high',
    title: 'Paiement Sol Dû',
    autoHide: false,
    actions: ['make_payment', 'contact_organizer', 'view_sol']
  },
  sol_turn_approaching: {
    severity: 'info',
    icon: PeopleIcon,
    color: '#4CAF50',
    category: 'sol',
    priority: 'medium',
    title: 'Votre Tour Approche',
    autoHide: true,
    autoHideDelay: 12000,
    actions: ['prepare_reception', 'view_schedule']
  },
  sol_payment_overdue: {
    severity: 'error',
    icon: TimelapseIcon,
    color: '#F44336',
    category: 'sol',
    priority: 'high',
    title: 'Paiement En Retard',
    autoHide: false,
    actions: ['urgent_payment', 'explain_delay', 'contact_organizer']
  },

  // Alertes investissements
  investment_milestone: {
    severity: 'success',
    icon: TrendingUpIcon,
    color: '#4CAF50',
    category: 'investment',
    priority: 'low',
    title: 'Objectif Atteint',
    autoHide: true,
    autoHideDelay: 15000,
    actions: ['view_performance', 'reinvest', 'withdraw']
  },
  investment_loss: {
    severity: 'warning',
    icon: TrendingDownIcon,
    color: '#FF9800',
    category: 'investment',
    priority: 'medium',
    title: 'Baisse Investissement',
    autoHide: true,
    autoHideDelay: 10000,
    actions: ['review_portfolio', 'cut_losses', 'wait_recovery']
  },

  // Alertes épargne
  savings_goal_reached: {
    severity: 'success',
    icon: CheckCircleIcon,
    color: '#4CAF50',
    category: 'savings',
    priority: 'low',
    title: 'Objectif Épargne Atteint',
    autoHide: true,
    autoHideDelay: 20000,
    actions: ['set_new_goal', 'invest_savings', 'celebrate']
  },
  savings_behind_schedule: {
    severity: 'warning',
    icon: SavingsIcon,
    color: '#FF9800',
    category: 'savings',
    priority: 'medium',
    title: 'Retard sur Épargne',
    autoHide: true,
    autoHideDelay: 12000,
    actions: ['increase_savings', 'adjust_goal', 'review_budget']
  },

  // Alertes générales
  financial_tip: {
    severity: 'info',
    icon: LightbulbIcon,
    color: '#2196F3',
    category: 'education',
    priority: 'low',
    title: 'Conseil Financier',
    autoHide: true,
    autoHideDelay: 15000,
    actions: ['learn_more', 'apply_tip']
  },
  unusual_spending: {
    severity: 'warning',
    icon: BarChartIcon,
    color: '#FF9800',
    category: 'analysis',
    priority: 'medium',
    title: 'Dépense Inhabituelle',
    autoHide: true,
    autoHideDelay: 10000,
    actions: ['review_expenses', 'categorize', 'ignore']
  }
};

// Actions disponibles avec leurs configurations
const ALERT_ACTIONS = {
  // Actions budgets
  adjust_budget: { label: 'Ajuster Budget', color: 'primary', variant: 'contained' },
  view_expenses: { label: 'Voir Dépenses', color: 'primary', variant: 'outlined' },
  reduce_expenses: { label: 'Réduire Dépenses', color: 'warning', variant: 'contained' },
  view_budget: { label: 'Voir Budget', color: 'primary', variant: 'outlined' },
  set_alert: { label: 'Configurer Alerte', color: 'default', variant: 'outlined' },
  set_reminder: { label: 'Rappel', color: 'default', variant: 'outlined' },
  view_remaining: { label: 'Solde Restant', color: 'info', variant: 'outlined' },
  plan_expenses: { label: 'Planifier', color: 'info', variant: 'outlined' },

  // Actions comptes
  add_funds: { label: 'Ajouter Fonds', color: 'success', variant: 'contained' },
  view_account: { label: 'Voir Compte', color: 'primary', variant: 'outlined' },
  emergency_budget: { label: 'Budget Urgence', color: 'error', variant: 'contained' },
  view_transactions: { label: 'Transactions', color: 'primary', variant: 'outlined' },
  immediate_payment: { label: 'Paiement Immédiat', color: 'error', variant: 'contained' },
  contact_bank: { label: 'Contacter Banque', color: 'primary', variant: 'outlined' },

  // Actions sols
  make_payment: { label: 'Payer Maintenant', color: 'warning', variant: 'contained' },
  contact_organizer: { label: 'Contacter Organisateur', color: 'primary', variant: 'outlined' },
  view_sol: { label: 'Voir Sol', color: 'primary', variant: 'outlined' },
  prepare_reception: { label: 'Préparer Réception', color: 'success', variant: 'outlined' },
  view_schedule: { label: 'Voir Calendrier', color: 'info', variant: 'outlined' },
  urgent_payment: { label: 'Paiement Urgent', color: 'error', variant: 'contained' },
  explain_delay: { label: 'Expliquer Retard', color: 'warning', variant: 'outlined' },

  // Actions investissements
  view_performance: { label: 'Voir Performance', color: 'success', variant: 'outlined' },
  reinvest: { label: 'Réinvestir', color: 'success', variant: 'contained' },
  withdraw: { label: 'Retirer', color: 'primary', variant: 'outlined' },
  review_portfolio: { label: 'Réviser Portfolio', color: 'warning', variant: 'outlined' },
  cut_losses: { label: 'Limiter Pertes', color: 'error', variant: 'contained' },
  wait_recovery: { label: 'Attendre Récupération', color: 'default', variant: 'outlined' },

  // Actions épargne
  set_new_goal: { label: 'Nouvel Objectif', color: 'success', variant: 'contained' },
  invest_savings: { label: 'Investir Épargne', color: 'primary', variant: 'outlined' },
  celebrate: { label: 'Célébrer!', color: 'success', variant: 'outlined' },
  increase_savings: { label: 'Augmenter Épargne', color: 'warning', variant: 'contained' },
  adjust_goal: { label: 'Ajuster Objectif', color: 'warning', variant: 'outlined' },
  review_budget: { label: 'Réviser Budget', color: 'primary', variant: 'outlined' },

  // Actions générales
  learn_more: { label: 'En Savoir Plus', color: 'info', variant: 'outlined' },
  apply_tip: { label: 'Appliquer Conseil', color: 'info', variant: 'contained' },
  review_expenses: { label: 'Réviser Dépenses', color: 'warning', variant: 'outlined' },
  categorize: { label: 'Catégoriser', color: 'primary', variant: 'outlined' },
  ignore: { label: 'Ignorer', color: 'default', variant: 'outlined' }
};

const FinanceAlert = ({
  type,
  title,
  message,
  data = {},
  visible = true,
  position = 'top',
  persistent = false,
  showProgress = false,
  showDetails = false,
  onClose,
  onAction,
  onExpand,
  customActions = [],
  severity,
  currency = 'HTG',
  ...other
}) => {
  // États internes
  const [isVisible, setIsVisible] = useState(visible);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(100);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Configuration de l'alerte basée sur le type
  const alertConfig = useMemo(() => {
    return ALERT_TYPES[type] || {
      severity: severity || 'info',
      icon: InfoIcon,
      color: '#2196F3',
      category: 'general',
      priority: 'low',
      title: title || 'Information',
      autoHide: true,
      autoHideDelay: 5000,
      actions: []
    };
  }, [type, severity, title]);

  // Gestion de l'auto-hide
  useEffect(() => {
    if (!persistent && alertConfig.autoHide && isVisible) {
      const duration = alertConfig.autoHideDelay || 5000;
      const interval = 100;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const newProgress = ((steps - currentStep) / steps) * 100;
        setProgress(Math.max(0, newProgress));

        if (currentStep >= steps) {
          clearInterval(timer);
          handleClose();
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [persistent, alertConfig.autoHide, alertConfig.autoHideDelay, isVisible]);

  // Handler de fermeture
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Handler d'expansion
  const handleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (onExpand) onExpand(newExpanded);
  };

  // Handler d'action
  const handleAction = (actionKey) => {
    if (onAction) {
      onAction(actionKey, data);
    }
  };

  // Render du contenu principal
  const renderMainContent = () => {
    const IconComponent = alertConfig.icon;
    
    return (
      <MDBox display="flex" alignItems="flex-start" width="100%">
        <Avatar
          sx={{
            bgcolor: alertConfig.color + '20',
            color: alertConfig.color,
            width: 40,
            height: 40,
            mr: 2,
            mt: 0.5
          }}
        >
          <IconComponent />
        </Avatar>

        <MDBox flex={1}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <MDBox display="flex" alignItems="center" gap={1}>
              <MDTypography variant="h6" fontWeight="medium">
                {title || alertConfig.title}
              </MDTypography>
              
              <Chip
                label={alertConfig.priority.toUpperCase()}
                color={alertConfig.priority === 'high' ? 'error' : 
                       alertConfig.priority === 'medium' ? 'warning' : 'default'}
                size="small"
                sx={{ fontSize: 10, height: 20 }}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" gap={0.5}>
              {showDetails && (
                <IconButton size="small" onClick={() => setDetailsDialogOpen(true)}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              )}
              
              {(data.hasDetails || isExpanded !== undefined) && (
                <IconButton size="small" onClick={handleExpand}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
              
              {!persistent && (
                <IconButton size="small" onClick={handleClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </MDBox>
          </MDBox>

          <MDTypography variant="body2" color="text" sx={{ mb: 2 }}>
            {message}
          </MDTypography>

          {/* Données contextuelles */}
          {data && Object.keys(data).length > 0 && (
            <MDBox mb={2}>
              {data.amount && (
                <MDBox display="flex" alignItems="center" gap={1} mb={1}>
                  <MonetizationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <MDTypography variant="body2" color="text">
                    Montant:
                  </MDTypography>
                  <CurrencyDisplay
                    amount={data.amount}
                    currency={data.currency || currency}
                    variant="body2"
                    fontWeight="medium"
                  />
                </MDBox>
              )}

              {data.percentage && (
                <MDBox display="flex" alignItems="center" gap={1} mb={1}>
                  <BarChartIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <MDTypography variant="body2" color="text">
                    Pourcentage: {data.percentage}%
                  </MDTypography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(data.percentage, 100)}
                    sx={{
                      width: 100,
                      height: 6,
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: data.percentage > 80 ? 'error.main' : 
                                data.percentage > 60 ? 'warning.main' : 'success.main'
                      }
                    }}
                  />
                </MDBox>
              )}

              {data.deadline && (
                <MDBox display="flex" alignItems="center" gap={1} mb={1}>
                  <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <MDTypography variant="body2" color="text">
                    Échéance: {new Date(data.deadline).toLocaleDateString('fr-FR')}
                  </MDTypography>
                </MDBox>
              )}

              {data.accountName && (
                <MDBox display="flex" alignItems="center" gap={1} mb={1}>
                  <AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <MDTypography variant="body2" color="text">
                    Compte: {data.accountName}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          )}

          {/* Actions */}
          <MDBox>
            <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {[...alertConfig.actions, ...customActions].slice(0, 3).map((actionKey) => {
                const action = ALERT_ACTIONS[actionKey];
                if (!action) return null;

                return (
                  <MDButton
                    key={actionKey}
                    variant={action.variant}
                    color={action.color}
                    size="small"
                    onClick={() => handleAction(actionKey)}
                  >
                    {action.label}
                  </MDButton>
                );
              })}
            </ButtonGroup>

            {alertConfig.actions.length + customActions.length > 3 && (
              <MDButton
                variant="text"
                size="small"
                onClick={handleExpand}
                sx={{ mt: 1 }}
              >
                {isExpanded ? 'Moins d\'actions' : 'Plus d\'actions'}
              </MDButton>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    );
  };

  // Render du contenu étendu
  const renderExpandedContent = () => {
    if (!isExpanded) return null;

    const remainingActions = [...alertConfig.actions, ...customActions].slice(3);

    return (
      <MDBox mt={2} pt={2} borderTop={1} borderColor="divider">
        {remainingActions.length > 0 && (
          <MDBox mb={2}>
            <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
              Actions supplémentaires
            </MDTypography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {remainingActions.map((actionKey) => {
                const action = ALERT_ACTIONS[actionKey];
                if (!action) return null;

                return (
                  <MDButton
                    key={actionKey}
                    variant={action.variant}
                    color={action.color}
                    size="small"
                    onClick={() => handleAction(actionKey)}
                  >
                    {action.label}
                  </MDButton>
                );
              })}
            </Stack>
          </MDBox>
        )}

        {data.details && (
          <MDBox>
            <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
              Détails
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {data.details}
            </MDTypography>
          </MDBox>
        )}

        {data.suggestions && (
          <MDBox mt={2}>
            <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
              Suggestions
            </MDTypography>
            <List dense>
              {data.suggestions.map((suggestion, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon>
                    <LightbulbIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <MDTypography variant="body2">
                        {suggestion}
                      </MDTypography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </MDBox>
        )}
      </MDBox>
    );
  };

  // Render de la barre de progression
  const renderProgressBar = () => {
    if (!showProgress || persistent || !alertConfig.autoHide) return null;

    return (
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          borderRadius: 0,
          '& .MuiLinearProgress-bar': {
            bgcolor: alertConfig.color
          }
        }}
      />
    );
  };

  if (!isVisible) return null;

  return (
    <>
      <Collapse in={isVisible} timeout={300}>
        <Card
          sx={{
            position: position === 'fixed' ? 'fixed' : 'relative',
            top: position === 'top' ? 20 : 'auto',
            bottom: position === 'bottom' ? 20 : 'auto',
            left: position === 'fixed' ? 20 : 'auto',
            right: position === 'fixed' ? 20 : 'auto',
            zIndex: position === 'fixed' ? 1300 : 'auto',
            borderLeft: 4,
            borderColor: alertConfig.color,
            boxShadow: position === 'fixed' ? 8 : 1,
            ...other.sx
          }}
          {...other}
        >
          <CardContent sx={{ position: 'relative', pb: persistent ? 2 : 3 }}>
            {renderMainContent()}
            {renderExpandedContent()}
            {renderProgressBar()}
          </CardContent>
        </Card>
      </Collapse>

      {/* Dialog de détails */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={1}>
            {React.createElement(alertConfig.icon, { 
              sx: { color: alertConfig.color } 
            })}
            {title || alertConfig.title}
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <MDTypography variant="body1" paragraph>
            {message}
          </MDTypography>

          {data.technicalDetails && (
            <MDBox>
              <MDTypography variant="h6" gutterBottom>
                Détails Techniques
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {data.technicalDetails}
              </MDTypography>
            </MDBox>
          )}

          {data.recommendations && (
            <MDBox mt={2}>
              <MDTypography variant="h6" gutterBottom>
                Recommandations
              </MDTypography>
              <List>
                {data.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDetailsDialogOpen(false)}>
            Fermer
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

FinanceAlert.propTypes = {
  type: PropTypes.oneOf(Object.keys(ALERT_TYPES)).isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  data: PropTypes.shape({
    amount: PropTypes.number,
    currency: PropTypes.string,
    percentage: PropTypes.number,
    deadline: PropTypes.string,
    accountName: PropTypes.string,
    details: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    technicalDetails: PropTypes.string,
    recommendations: PropTypes.arrayOf(PropTypes.string),
    hasDetails: PropTypes.bool
  }),
  visible: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'bottom', 'fixed', 'relative']),
  persistent: PropTypes.bool,
  showProgress: PropTypes.bool,
  showDetails: PropTypes.bool,
  onClose: PropTypes.func,
  onAction: PropTypes.func,
  onExpand: PropTypes.func,
  customActions: PropTypes.arrayOf(PropTypes.string),
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  currency: PropTypes.string
};

export default FinanceAlert;