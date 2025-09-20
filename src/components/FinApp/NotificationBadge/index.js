// src/components/FinApp/NotificationBadge/index.js
import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';

// @mui icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import CircleIcon from '@mui/icons-material/Circle';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ClearAllIcon from '@mui/icons-material/ClearAll';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';

// Configuration des types de notifications avec leurs icônes et couleurs
const NOTIFICATION_TYPES = {
  payment: {
    icon: PaymentIcon,
    color: '#F57C00',
    label: 'Paiements'
  },
  sol: {
    icon: PeopleIcon,
    color: '#4CAF50',
    label: 'Sols'
  },
  account: {
    icon: AccountBalanceIcon,
    color: '#2196F3',
    label: 'Comptes'
  },
  budget: {
    icon: BarChartIcon,
    color: '#9C27B0',
    label: 'Budgets'
  },
  investment: {
    icon: TrendingUpIcon,
    color: '#FF5722',
    label: 'Investissements'
  },
  savings: {
    icon: SavingsIcon,
    color: '#607D8B',
    label: 'Épargne'
  }
};

// Configuration des niveaux de priorité
const PRIORITY_LEVELS = {
  critical: {
    color: '#D32F2F',
    pulse: true,
    icon: ErrorIcon
  },
  high: {
    color: '#F57C00',
    pulse: false,
    icon: WarningIcon
  },
  medium: {
    color: '#1976D2',
    pulse: false,
    icon: InfoIcon
  },
  low: {
    color: '#388E3C',
    pulse: false,
    icon: CheckCircleIcon
  }
};

// Styles pour les animations
const badgeAnimations = {
  pulse: {
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
        opacity: 1,
      },
      '50%': {
        transform: 'scale(1.1)',
        opacity: 0.7,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1,
      },
    },
    animation: 'pulse 2s infinite',
  },
  bounce: {
    '@keyframes bounce': {
      '0%, 20%, 53%, 80%, 100%': {
        transform: 'translate3d(0,0,0)',
      },
      '40%, 43%': {
        transform: 'translate3d(0, -8px, 0)',
      },
      '70%': {
        transform: 'translate3d(0, -4px, 0)',
      },
      '90%': {
        transform: 'translate3d(0, -2px, 0)',
      },
    },
    animation: 'bounce 1s ease-in-out',
  }
};

const NotificationBadge = ({
  notifications = [],
  maxCount = 99,
  showZero = false,
  variant = 'standard',
  size = 'medium',
  position = 'top-right',
  color = 'error',
  showPreview = true,
  previewCount = 3,
  anchorOrigin,
  onNotificationClick,
  onMarkAllRead,
  onOpenSettings,
  enableGrouping = true,
  enablePriority = true,
  animateOnUpdate = true,
  customIcon,
  children,
  ...other
}) => {
  // États internes
  const [anchorEl, setAnchorEl] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  // Filtrer et traiter les notifications
  const processedNotifications = useMemo(() => {
    const unreadNotifications = notifications.filter(notif => !notif.read);
    
    // Grouper par type si activé
    if (enableGrouping) {
      const grouped = unreadNotifications.reduce((acc, notif) => {
        const type = notif.category || notif.type || 'general';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(notif);
        return acc;
      }, {});
      
      return grouped;
    }
    
    return unreadNotifications;
  }, [notifications, enableGrouping]);

  // Calculer le nombre total de notifications non lues
  const unreadCount = useMemo(() => {
    if (enableGrouping) {
      return Object.values(processedNotifications).reduce((total, group) => total + group.length, 0);
    }
    return processedNotifications.length;
  }, [processedNotifications, enableGrouping]);

  // Déterminer la priorité la plus élevée
  const highestPriority = useMemo(() => {
    if (!enablePriority || unreadCount === 0) return 'low';
    
    const notificationsList = enableGrouping 
      ? Object.values(processedNotifications).flat()
      : processedNotifications;
    
    const priorities = notificationsList.map(notif => notif.priority || 'low');
    
    if (priorities.includes('critical')) return 'critical';
    if (priorities.includes('high')) return 'high';
    if (priorities.includes('medium')) return 'medium';
    return 'low';
  }, [processedNotifications, enablePriority, unreadCount, enableGrouping]);

  // Animation lors du changement de nombre
  useEffect(() => {
    if (animateOnUpdate && unreadCount !== lastCount && unreadCount > lastCount) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      setLastCount(unreadCount);
      return () => clearTimeout(timer);
    }
    setLastCount(unreadCount);
  }, [unreadCount, lastCount, animateOnUpdate]);

  // Gestionnaires d'événements
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    handleClose();
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleMarkAllRead = () => {
    handleClose();
    if (onMarkAllRead) {
      onMarkAllRead();
    }
  };

  const handleOpenSettings = () => {
    handleClose();
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  // Déterminer l'icône à afficher
  const getDisplayIcon = () => {
    if (customIcon) return customIcon;
    
    if (unreadCount === 0) {
      return <NotificationsIcon />;
    }
    
    if (highestPriority === 'critical') {
      return <NotificationsActiveIcon />;
    }
    
    return <NotificationsIcon />;
  };

  // Déterminer la couleur du badge
  const getBadgeColor = () => {
    if (enablePriority && unreadCount > 0) {
      return PRIORITY_LEVELS[highestPriority].color;
    }
    return color;
  };

  // Render du contenu du badge
  const renderBadgeContent = () => {
    if (unreadCount === 0 && !showZero) return null;
    
    const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount;
    
    return displayCount;
  };

  // Render des notifications groupées
  const renderGroupedNotifications = () => {
    return Object.entries(processedNotifications).map(([type, notifications]) => {
      const typeConfig = NOTIFICATION_TYPES[type] || {
        icon: InfoIcon,
        color: '#2196F3',
        label: type
      };
      
      const IconComponent = typeConfig.icon;
      
      return (
        <React.Fragment key={type}>
          <ListItem sx={{ bgcolor: 'grey.50', py: 1 }}>
            <ListItemIcon>
              <IconComponent sx={{ color: typeConfig.color }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <MDTypography variant="subtitle2" fontWeight="medium">
                    {typeConfig.label}
                  </MDTypography>
                  <Chip
                    label={notifications.length}
                    size="small"
                    sx={{ 
                      bgcolor: typeConfig.color + '20',
                      color: typeConfig.color,
                      fontSize: 10,
                      height: 20
                    }}
                  />
                </MDBox>
              }
            />
          </ListItem>
          
          {notifications.slice(0, previewCount).map((notification) => (
            <ListItem
              key={notification.id}
              button
              onClick={() => handleNotificationClick(notification)}
              sx={{ pl: 4, py: 0.5 }}
            >
              <ListItemText
                primary={
                  <MDTypography variant="body2" fontSize={13}>
                    {notification.title}
                  </MDTypography>
                }
                secondary={
                  <MDTypography variant="caption" color="text">
                    {notification.timeAgo || 'Maintenant'}
                  </MDTypography>
                }
              />
            </ListItem>
          ))}
          
          {notifications.length > previewCount && (
            <ListItem button sx={{ pl: 4, py: 0.5 }}>
              <ListItemText>
                <MDTypography variant="caption" color="primary">
                  +{notifications.length - previewCount} autres notifications
                </MDTypography>
              </ListItemText>
            </ListItem>
          )}
          
          <Divider />
        </React.Fragment>
      );
    });
  };

  // Render des notifications non groupées
  const renderNotificationsList = () => {
    return processedNotifications.slice(0, previewCount * 2).map((notification) => {
      const typeConfig = NOTIFICATION_TYPES[notification.category || notification.type] || {
        icon: InfoIcon,
        color: '#2196F3'
      };
      
      const IconComponent = typeConfig.icon;
      
      return (
        <ListItem
          key={notification.id}
          button
          onClick={() => handleNotificationClick(notification)}
        >
          <ListItemAvatar>
            <Avatar
              sx={{ 
                bgcolor: typeConfig.color + '20',
                color: typeConfig.color,
                width: 32,
                height: 32
              }}
            >
              <IconComponent sx={{ fontSize: 16 }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <MDTypography variant="body2" fontWeight="medium">
                {notification.title}
              </MDTypography>
            }
            secondary={
              <MDBox>
                <MDTypography variant="caption" color="text">
                  {notification.message}
                </MDTypography>
                {notification.amount && (
                  <MDBox mt={0.5}>
                    <CurrencyDisplay
                      amount={notification.amount}
                      currency={notification.currency || 'HTG'}
                      variant="caption"
                      fontWeight="medium"
                    />
                  </MDBox>
                )}
              </MDBox>
            }
          />
        </ListItem>
      );
    });
  };

  // Render du preview des notifications
  const renderNotificationPreview = () => {
    if (!showPreview || unreadCount === 0) return null;

    return (
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
          ...anchorOrigin
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          sx: { maxWidth: 400, maxHeight: 500 }
        }}
      >
        <Card elevation={0}>
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <MDBox p={2} borderBottom={1} borderColor="divider">
              <MDBox display="flex" alignItems="center" justifyContent="space-between">
                <MDTypography variant="h6" fontWeight="medium">
                  Notifications
                </MDTypography>
                <Chip
                  label={unreadCount}
                  color="primary"
                  size="small"
                />
              </MDBox>
            </MDBox>

            {/* Liste des notifications */}
            <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
              {enableGrouping ? renderGroupedNotifications() : renderNotificationsList()}
            </List>

            {/* Actions footer */}
            <MDBox p={2} borderTop={1} borderColor="divider">
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDButton
                  variant="text"
                  size="small"
                  startIcon={<MarkEmailReadIcon />}
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                >
                  Tout marquer lu
                </MDButton>
                
                <MDButton
                  variant="text"
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={handleOpenSettings}
                >
                  Paramètres
                </MDButton>
              </MDBox>
            </MDBox>
          </CardContent>
        </Card>
      </Popover>
    );
  };

  // Configuration du badge
  const badgeProps = {
    badgeContent: renderBadgeContent(),
    variant,
    color: 'error', // Utilisé comme fallback MUI
    max: maxCount,
    showZero,
    anchorOrigin: {
      vertical: position.includes('top') ? 'top' : 'bottom',
      horizontal: position.includes('right') ? 'right' : 'left'
    },
    sx: {
      '& .MuiBadge-badge': {
        bgcolor: getBadgeColor(),
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12,
        minWidth: size === 'small' ? 16 : size === 'large' ? 24 : 20,
        height: size === 'small' ? 16 : size === 'large' ? 24 : 20,
        ...(animate && badgeAnimations.bounce),
        ...(enablePriority && highestPriority === 'critical' && PRIORITY_LEVELS.critical.pulse && badgeAnimations.pulse)
      }
    },
    ...other
  };

  return (
    <MDBox>
      <Tooltip
        title={unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification'}
        arrow
      >
        <Badge {...badgeProps}>
          {children || (
            <IconButton
              onClick={handleClick}
              sx={{
                color: unreadCount > 0 ? getBadgeColor() : 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              {getDisplayIcon()}
            </IconButton>
          )}
        </Badge>
      </Tooltip>

      {renderNotificationPreview()}
    </MDBox>
  );
};

NotificationBadge.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    priority: PropTypes.oneOf(['critical', 'high', 'medium', 'low']),
    read: PropTypes.bool,
    timestamp: PropTypes.string,
    timeAgo: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string
  })),
  maxCount: PropTypes.number,
  showZero: PropTypes.bool,
  variant: PropTypes.oneOf(['standard', 'dot']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  color: PropTypes.string,
  showPreview: PropTypes.bool,
  previewCount: PropTypes.number,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'right'])
  }),
  onNotificationClick: PropTypes.func,
  onMarkAllRead: PropTypes.func,
  onOpenSettings: PropTypes.func,
  enableGrouping: PropTypes.bool,
  enablePriority: PropTypes.bool,
  animateOnUpdate: PropTypes.bool,
  customIcon: PropTypes.node,
  children: PropTypes.node
};

export default NotificationBadge;