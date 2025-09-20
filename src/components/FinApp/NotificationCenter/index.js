// src/components/FinApp/NotificationCenter/index.js
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ButtonGroup from '@mui/material/ButtonGroup';
import Skeleton from '@mui/material/Skeleton';

// @mui icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';

// Types de notifications financières
const NOTIFICATION_TYPES = {
  // Notifications de paiement
  sol_payment_due: {
    label: 'Paiement Sol Dû',
    icon: PaymentIcon,
    color: '#F57C00',
    priority: 'high',
    category: 'payment'
  },
  sol_payment_reminder: {
    label: 'Rappel Paiement Sol',
    icon: CalendarTodayIcon,
    color: '#FF9800',
    priority: 'medium',
    category: 'payment'
  },
  sol_turn_coming: {
    label: 'Votre Tour Approche',
    icon: PeopleIcon,
    color: '#4CAF50',
    priority: 'medium',
    category: 'sol'
  },
  sol_received: {
    label: 'Sol Reçu',
    icon: MonetizationOnIcon,
    color: '#4CAF50',
    priority: 'low',
    category: 'income'
  },

  // Notifications de budget
  budget_warning: {
    label: 'Alerte Budget',
    icon: WarningIcon,
    color: '#FF9800',
    priority: 'high',
    category: 'budget'
  },
  budget_exceeded: {
    label: 'Budget Dépassé',
    icon: ErrorIcon,
    color: '#F44336',
    priority: 'high',
    category: 'budget'
  },
  budget_goal_reached: {
    label: 'Objectif Atteint',
    icon: CheckCircleIcon,
    color: '#4CAF50',
    priority: 'low',
    category: 'achievement'
  },

  // Notifications de compte
  account_balance_low: {
    label: 'Solde Faible',
    icon: AccountBalanceIcon,
    color: '#F44336',
    priority: 'high',
    category: 'account'
  },
  account_transaction: {
    label: 'Nouvelle Transaction',
    icon: ReceiptIcon,
    color: '#2196F3',
    priority: 'low',
    category: 'transaction'
  },
  account_sync_error: {
    label: 'Erreur Synchronisation',
    icon: ErrorIcon,
    color: '#F44336',
    priority: 'medium',
    category: 'technical'
  },

  // Notifications d'investissement
  investment_update: {
    label: 'Mise à jour Investissement',
    icon: TrendingUpIcon,
    color: '#9C27B0',
    priority: 'medium',
    category: 'investment'
  },
  investment_milestone: {
    label: 'Étape Investissement',
    icon: StarIcon,
    color: '#FF9800',
    priority: 'low',
    category: 'achievement'
  },

  // Notifications d'épargne
  savings_goal_progress: {
    label: 'Progrès Épargne',
    icon: SavingsIcon,
    color: '#4CAF50',
    priority: 'low',
    category: 'savings'
  },
  savings_goal_achieved: {
    label: 'Objectif Épargne Atteint',
    icon: CheckCircleIcon,
    color: '#4CAF50',
    priority: 'medium',
    category: 'achievement'
  },

  // Notifications système
  system_update: {
    label: 'Mise à jour Système',
    icon: InfoIcon,
    color: '#2196F3',
    priority: 'low',
    category: 'system'
  },
  educational_tip: {
    label: 'Conseil Financier',
    icon: InfoIcon,
    color: '#2196F3',
    priority: 'low',
    category: 'education'
  }
};

// Priorités de notification
const NOTIFICATION_PRIORITIES = {
  high: {
    label: 'Haute',
    color: 'error',
    icon: PriorityHighIcon
  },
  medium: {
    label: 'Moyenne',
    color: 'warning',
    icon: WarningIcon
  },
  low: {
    label: 'Basse',
    color: 'info',
    icon: InfoIcon
  }
};

// Catégories de notifications
const NOTIFICATION_CATEGORIES = {
  payment: 'Paiements',
  sol: 'Sols/Tontines',
  budget: 'Budgets',
  account: 'Comptes',
  transaction: 'Transactions',
  investment: 'Investissements',
  savings: 'Épargne',
  achievement: 'Réussites',
  technical: 'Technique',
  system: 'Système',
  education: 'Éducation',
  income: 'Revenus'
};

const NotificationCenter = ({
  notifications = [],
  title = "Centre de Notifications",
  onNotificationClick,
  onNotificationRead,
  onNotificationUnread,
  onNotificationDelete,
  onNotificationStar,
  onBulkAction,
  onRefresh,
  onSettingsOpen,
  showFilters = true,
  showBulkActions = true,
  maxHeight = 600,
  currency = 'HTG',
  ...other
}) => {
  // États pour les filtres
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // États pour les actions
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // États pour les dialogs
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // État de chargement
  const [loading, setLoading] = useState(false);

  // Enrichir les notifications avec des métadonnées
  const enrichedNotifications = useMemo(() => {
    return notifications.map(notification => {
      const type = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system_update;
      const timeDiff = new Date() - new Date(notification.timestamp || notification.date);
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      let timeAgo;
      if (minutesAgo < 1) timeAgo = "À l'instant";
      else if (minutesAgo < 60) timeAgo = `${minutesAgo} min`;
      else if (hoursAgo < 24) timeAgo = `${hoursAgo}h`;
      else timeAgo = `${daysAgo}j`;

      return {
        ...notification,
        typeInfo: type,
        timeAgo,
        timestamp: notification.timestamp || notification.date
      };
    });
  }, [notifications]);

  // Filtrer les notifications
  const filteredNotifications = useMemo(() => {
    let filtered = enrichedNotifications;

    // Filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Filtre par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(n => n.typeInfo.category === filterCategory);
    }

    // Filtre par priorité
    if (filterPriority !== 'all') {
      filtered = filtered.filter(n => n.typeInfo.priority === filterPriority);
    }

    // Filtre non lues seulement
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    // Filtre favorites seulement
    if (showStarredOnly) {
      filtered = filtered.filter(n => n.starred);
    }

    // Trier par priorité puis par date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.typeInfo.priority] - priorityOrder[a.typeInfo.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return filtered;
  }, [enrichedNotifications, filterType, filterCategory, filterPriority, showUnreadOnly, showStarredOnly]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const unreadCount = enrichedNotifications.filter(n => !n.read).length;
    const highPriorityCount = enrichedNotifications.filter(n => n.typeInfo.priority === 'high' && !n.read).length;
    const starredCount = enrichedNotifications.filter(n => n.starred).length;
    const todayCount = enrichedNotifications.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.timestamp);
      return today.toDateString() === notifDate.toDateString();
    }).length;

    return {
      total: enrichedNotifications.length,
      unread: unreadCount,
      highPriority: highPriorityCount,
      starred: starredCount,
      today: todayCount
    };
  }, [enrichedNotifications]);

  // Handlers de sélection
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  // Handlers du menu
  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  // Handlers d'actions
  const handleNotificationClick = useCallback((notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    // Marquer comme lue automatiquement
    if (!notification.read && onNotificationRead) {
      onNotificationRead(notification.id);
    }
  }, [onNotificationClick, onNotificationRead]);

  const handleMarkRead = useCallback(() => {
    handleMenuClose();
    if (onNotificationRead && selectedNotification) {
      onNotificationRead(selectedNotification.id);
    }
  }, [onNotificationRead, selectedNotification]);

  const handleMarkUnread = useCallback(() => {
    handleMenuClose();
    if (onNotificationUnread && selectedNotification) {
      onNotificationUnread(selectedNotification.id);
    }
  }, [onNotificationUnread, selectedNotification]);

  const handleToggleStar = useCallback(() => {
    handleMenuClose();
    if (onNotificationStar && selectedNotification) {
      onNotificationStar(selectedNotification.id);
    }
  }, [onNotificationStar, selectedNotification]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    if (onNotificationDelete && selectedNotification) {
      setConfirmAction(() => () => onNotificationDelete(selectedNotification.id));
      setConfirmDialogOpen(true);
    }
  }, [onNotificationDelete, selectedNotification]);

  // Handlers d'actions en lot
  const handleBulkAction = useCallback((action) => {
    setBulkMenuAnchor(null);
    if (onBulkAction && selectedNotifications.length > 0) {
      if (action === 'delete') {
        setConfirmAction(() => () => {
          onBulkAction(action, selectedNotifications);
          setSelectedNotifications([]);
        });
        setConfirmDialogOpen(true);
      } else {
        onBulkAction(action, selectedNotifications);
        if (action === 'read' || action === 'unread') {
          setSelectedNotifications([]);
        }
      }
    }
  }, [onBulkAction, selectedNotifications]);

  // Handler de rafraîchissement
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setLoading(false);
    }
  }, [onRefresh]);

  // Render d'une notification
  const renderNotification = (notification) => {
    const isSelected = selectedNotifications.includes(notification.id);
    const IconComponent = notification.typeInfo.icon;

    return (
      <ListItem
        key={notification.id}
        disablePadding
        sx={{
          bgcolor: notification.read ? 'transparent' : 'action.hover',
          borderLeft: notification.typeInfo.priority === 'high' ? 3 : 0,
          borderColor: 'error.main'
        }}
      >
        <ListItemButton
          selected={isSelected}
          onClick={() => handleNotificationClick(notification)}
          sx={{ pl: showBulkActions ? 1 : 2 }}
        >
          {showBulkActions && (
            <MDBox mr={1}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectNotification(notification.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </MDBox>
          )}
          
          <ListItemIcon>
            <Badge
              color={notification.typeInfo.priority === 'high' ? 'error' : 'default'}
              variant={notification.read ? 'standard' : 'dot'}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: notification.typeInfo.color + '20',
                  color: notification.typeInfo.color
                }}
              >
                <IconComponent sx={{ fontSize: 20 }} />
              </Avatar>
            </Badge>
          </ListItemIcon>

          <ListItemText
            primary={
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDTypography 
                  variant="body2" 
                  fontWeight={notification.read ? 'regular' : 'medium'}
                  sx={{ flex: 1 }}
                >
                  {notification.title}
                </MDTypography>
                
                {notification.starred && (
                  <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                )}
                
                <Chip
                  label={NOTIFICATION_PRIORITIES[notification.typeInfo.priority].label}
                  color={NOTIFICATION_PRIORITIES[notification.typeInfo.priority].color}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 10, height: 20 }}
                />
              </MDBox>
            }
            secondary={
              <MDBox>
                <MDTypography variant="body2" color="text" sx={{ mb: 0.5 }}>
                  {notification.message || notification.description}
                </MDTypography>
                
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <MDTypography variant="caption" color="text">
                    {notification.timeAgo}
                  </MDTypography>
                  
                  {notification.amount && (
                    <CurrencyDisplay
                      amount={notification.amount}
                      currency={notification.currency || currency}
                      variant="caption"
                      fontWeight="medium"
                    />
                  )}
                </MDBox>
              </MDBox>
            }
          />

          <ListItemSecondaryAction>
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, notification)}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
    );
  };

  // Render du skeleton de chargement
  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton variant="text" width="60%" />}
            secondary={
              <MDBox>
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="40%" />
              </MDBox>
            }
          />
        </ListItem>
      ))}
    </>
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox display="flex" alignItems="center" gap={1}>
                <Badge badgeContent={stats.unread} color="error">
                  <NotificationsIcon />
                </Badge>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    {title}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {stats.total} notification{stats.total > 1 ? 's' : ''} 
                    · {stats.unread} non lue{stats.unread > 1 ? 's' : ''}
                    {stats.highPriority > 0 && ` · ${stats.highPriority} priorité haute`}
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDBox display="flex" alignItems="center" gap={1}>
                {selectedNotifications.length > 0 && showBulkActions && (
                  <MDButton
                    variant="outlined"
                    size="small"
                    onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                  >
                    Actions ({selectedNotifications.length})
                  </MDButton>
                )}
                
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
                
                {showFilters && (
                  <IconButton
                    size="small"
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    color={showFiltersPanel ? "primary" : "default"}
                  >
                    <FilterListIcon />
                  </IconButton>
                )}
                
                <IconButton
                  size="small"
                  onClick={() => setSettingsDialogOpen(true)}
                >
                  <SettingsIcon />
                </IconButton>
              </MDBox>
            </MDBox>
          }
        />

        {/* Panel de filtres */}
        <Collapse in={showFiltersPanel}>
          <CardContent sx={{ pt: 0, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <ButtonGroup size="small" variant="outlined">
                <MDButton
                  variant={filterType === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('all')}
                >
                  Toutes
                </MDButton>
                <MDButton
                  variant={filterType === 'sol_payment_due' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('sol_payment_due')}
                  color="warning"
                >
                  Paiements
                </MDButton>
                <MDButton
                  variant={filterType === 'budget_warning' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('budget_warning')}
                  color="error"
                >
                  Budgets
                </MDButton>
                <MDButton
                  variant={filterCategory === 'achievement' ? 'contained' : 'outlined'}
                  onClick={() => setFilterCategory(filterCategory === 'achievement' ? 'all' : 'achievement')}
                  color="success"
                >
                  Réussites
                </MDButton>
              </ButtonGroup>

              <FormControlLabel
                control={
                  <Switch
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    size="small"
                  />
                }
                label="Non lues"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showStarredOnly}
                    onChange={(e) => setShowStarredOnly(e.target.checked)}
                    size="small"
                  />
                }
                label="Favorites"
              />
            </Stack>
          </CardContent>
        </Collapse>

        {/* Statistiques rapides */}
        <CardContent sx={{ py: 1 }}>
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Aujourd'hui</MDTypography>
              <MDTypography variant="body2" fontWeight="bold">
                {stats.today}
              </MDTypography>
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Priorité Haute</MDTypography>
              <MDTypography variant="body2" fontWeight="bold" color="error">
                {stats.highPriority}
              </MDTypography>
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Favorites</MDTypography>
              <MDTypography variant="body2" fontWeight="bold" color="warning">
                {stats.starred}
              </MDTypography>
            </MDBox>
          </Stack>
        </CardContent>

        {/* Liste des notifications */}
        <CardContent sx={{ p: 0, maxHeight, overflow: 'auto' }}>
          <List>
            {loading ? (
              renderSkeleton()
            ) : filteredNotifications.length === 0 ? (
              <ListItem>
                <Alert severity="info" sx={{ width: '100%' }}>
                  <MDTypography variant="body2">
                    {showUnreadOnly || showStarredOnly || filterType !== 'all'
                      ? 'Aucune notification ne correspond aux critères de filtre.'
                      : 'Aucune notification. Vous êtes à jour !'}
                  </MDTypography>
                </Alert>
              </ListItem>
            ) : (
              filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  {renderNotification(notification)}
                  {index < filteredNotifications.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))
            )}
          </List>
        </CardContent>

        {/* Actions en bas */}
        {showBulkActions && (
          <CardContent sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MDButton
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
              >
                {selectedNotifications.length === filteredNotifications.length ? 'Désélectionner' : 'Sélectionner'} tout
              </MDButton>
              
              {stats.unread > 0 && (
                <MDButton
                  variant="outlined"
                  size="small"
                  onClick={() => handleBulkAction('read_all')}
                >
                  Marquer toutes comme lues
                </MDButton>
              )}
            </Stack>
          </CardContent>
        )}

        {/* Menu d'actions */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={selectedNotification?.read ? handleMarkUnread : handleMarkRead}>
            <ListItemIcon>
              {selectedNotification?.read ? 
                <MarkEmailUnreadIcon fontSize="small" /> : 
                <MarkEmailReadIcon fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText>
              {selectedNotification?.read ? 'Marquer non lue' : 'Marquer lue'}
            </ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleToggleStar}>
            <ListItemIcon>
              {selectedNotification?.starred ? 
                <StarIcon fontSize="small" /> : 
                <StarBorderIcon fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText>
              {selectedNotification?.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer</ListItemText>
          </MenuItem>
        </Menu>

        {/* Menu des actions en lot */}
        <Menu
          anchorEl={bulkMenuAnchor}
          open={Boolean(bulkMenuAnchor)}
          onClose={() => setBulkMenuAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleBulkAction('read')}>
            <ListItemIcon>
              <MarkEmailReadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Marquer comme lues</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleBulkAction('unread')}>
            <ListItemIcon>
              <MarkEmailUnreadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Marquer comme non lues</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleBulkAction('star')}>
            <ListItemIcon>
              <StarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ajouter aux favoris</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteSweepIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer sélection</ListItemText>
          </MenuItem>
        </Menu>
      </Card>

      {/* Dialog de paramètres */}
      <Dialog 
        open={settingsDialogOpen} 
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Paramètres des Notifications
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Paramètres généraux */}
            <MDBox>
              <MDTypography variant="h6" gutterBottom>
                Paramètres généraux
              </MDTypography>
              
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Activer les notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notifications push"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Sons de notification"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Marquer automatiquement comme lues après clic"
                />
              </Stack>
            </MDBox>

            {/* Types de notifications */}
            <MDBox>
              <MDTypography variant="h6" gutterBottom>
                Types de notifications
              </MDTypography>
              
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Paiements de sols"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Alertes de budget"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Soldes de comptes faibles"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Nouvelles transactions"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Mises à jour d'investissements"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Conseils financiers"
                />
              </Stack>
            </MDBox>

            {/* Fréquence */}
            <MDBox>
              <MDTypography variant="h6" gutterBottom>
                Fréquence des rappels
              </MDTypography>
              
              <FormControl fullWidth>
                <InputLabel>Fréquence des rappels de paiement</InputLabel>
                <Select defaultValue="3days" label="Fréquence des rappels de paiement">
                  <MenuItem value="1day">1 jour avant</MenuItem>
                  <MenuItem value="3days">3 jours avant</MenuItem>
                  <MenuItem value="1week">1 semaine avant</MenuItem>
                  <MenuItem value="never">Jamais</MenuItem>
                </Select>
              </FormControl>
            </MDBox>

            {/* Horaires */}
            <MDBox>
              <MDTypography variant="h6" gutterBottom>
                Horaires
              </MDTypography>
              
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Début des notifications"
                  type="time"
                  defaultValue="08:00"
                  fullWidth
                />
                <TextField
                  label="Fin des notifications"
                  type="time"
                  defaultValue="20:00"
                  fullWidth
                />
              </Stack>
              
              <FormControlLabel
                control={<Switch />}
                label="Mode silencieux le weekend"
                sx={{ mt: 1 }}
              />
            </MDBox>
          </Stack>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setSettingsDialogOpen(false)}>
            Annuler
          </MDButton>
          <MDButton 
            variant="contained" 
            color="primary"
            onClick={() => {
              setSettingsDialogOpen(false);
              if (onSettingsOpen) onSettingsOpen();
            }}
          >
            Enregistrer
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cette action est irréversible.
          </Alert>
          <MDTypography variant="body2">
            Êtes-vous sûr de vouloir supprimer {selectedNotifications.length > 1 
              ? `${selectedNotifications.length} notifications` 
              : 'cette notification'} ?
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setConfirmDialogOpen(false)}>
            Annuler
          </MDButton>
          <MDButton 
            variant="contained" 
            color="error"
            onClick={() => {
              setConfirmDialogOpen(false);
              if (confirmAction) confirmAction();
              setConfirmAction(null);
            }}
          >
            Supprimer
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

NotificationCenter.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    description: PropTypes.string,
    timestamp: PropTypes.string,
    date: PropTypes.string,
    read: PropTypes.bool,
    starred: PropTypes.bool,
    amount: PropTypes.number,
    currency: PropTypes.string,
    priority: PropTypes.oneOf(['high', 'medium', 'low']),
    category: PropTypes.string,
    actionUrl: PropTypes.string,
    metadata: PropTypes.object
  })),
  title: PropTypes.string,
  onNotificationClick: PropTypes.func,
  onNotificationRead: PropTypes.func,
  onNotificationUnread: PropTypes.func,
  onNotificationDelete: PropTypes.func,
  onNotificationStar: PropTypes.func,
  onBulkAction: PropTypes.func,
  onRefresh: PropTypes.func,
  onSettingsOpen: PropTypes.func,
  showFilters: PropTypes.bool,
  showBulkActions: PropTypes.bool,
  maxHeight: PropTypes.number,
  currency: PropTypes.string
};

export default NotificationCenter;