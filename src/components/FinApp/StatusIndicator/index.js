// src/components/FinApp/StatusIndicator/index.js
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';

// @mui icons
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SyncIcon from '@mui/icons-material/Sync';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellular0BarIcon from '@mui/icons-material/SignalCellular0Bar';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Configuration des statuts prédéfinis
const STATUS_CONFIGS = {
  // Statuts généraux
  active: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: CheckCircleIcon,
    label: 'Actif',
    pulse: false
  },
  inactive: {
    color: '#9E9E9E',
    bgColor: '#F5F5F5',
    icon: PauseCircleIcon,
    label: 'Inactif',
    pulse: false
  },
  pending: {
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: ScheduleIcon,
    label: 'En attente',
    pulse: true
  },
  error: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: ErrorIcon,
    label: 'Erreur',
    pulse: true
  },
  warning: {
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: WarningIcon,
    label: 'Attention',
    pulse: false
  },
  info: {
    color: '#2196F3',
    bgColor: '#E3F2FD',
    icon: InfoIcon,
    label: 'Information',
    pulse: false
  },
  success: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: CheckCircleIcon,
    label: 'Succès',
    pulse: false
  },

  // Statuts de synchronisation
  synced: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: CloudDoneIcon,
    label: 'Synchronisé',
    pulse: false
  },
  syncing: {
    color: '#2196F3',
    bgColor: '#E3F2FD',
    icon: SyncIcon,
    label: 'Synchronisation',
    pulse: true,
    rotate: true
  },
  sync_failed: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: CloudOffIcon,
    label: 'Sync échouée',
    pulse: false
  },

  // Statuts de connexion
  online: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: SignalCellularAltIcon,
    label: 'En ligne',
    pulse: false
  },
  offline: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: SignalCellular0BarIcon,
    label: 'Hors ligne',
    pulse: false
  },

  // Statuts de paiement
  paid: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: CheckCircleIcon,
    label: 'Payé',
    pulse: false
  },
  unpaid: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: ErrorIcon,
    label: 'Non payé',
    pulse: true
  },
  overdue: {
    color: '#D32F2F',
    bgColor: '#FFCDD2',
    icon: ErrorIcon,
    label: 'En retard',
    pulse: true
  },
  partial: {
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: WarningIcon,
    label: 'Partiel',
    pulse: false
  },

  // Statuts d'investissement
  profitable: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: TrendingUpIcon,
    label: 'Rentable',
    pulse: false
  },
  losing: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: TrendingDownIcon,
    label: 'En perte',
    pulse: false
  },
  stable: {
    color: '#2196F3',
    bgColor: '#E3F2FD',
    icon: TrendingFlatIcon,
    label: 'Stable',
    pulse: false
  },

  // Statuts de compte
  account_healthy: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: AccountBalanceIcon,
    label: 'Sain',
    pulse: false
  },
  account_low: {
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: WarningIcon,
    label: 'Solde bas',
    pulse: false
  },
  account_critical: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: ErrorIcon,
    label: 'Critique',
    pulse: true
  },

  // Statuts de sol
  sol_active: {
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: PeopleIcon,
    label: 'Sol actif',
    pulse: false
  },
  sol_waiting: {
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: ScheduleIcon,
    label: 'En attente',
    pulse: true
  },
  sol_completed: {
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    icon: CheckCircleIcon,
    label: 'Terminé',
    pulse: false
  },
  sol_issue: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: ErrorIcon,
    label: 'Problème',
    pulse: true
  }
};

// Styles pour les animations
const animationStyles = {
  pulse: {
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 1 }
    },
    animation: 'pulse 2s infinite'
  },
  rotate: {
    '@keyframes rotate': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    animation: 'rotate 2s linear infinite'
  },
  fadeIn: {
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'scale(0.8)' },
      '100%': { opacity: 1, transform: 'scale(1)' }
    },
    animation: 'fadeIn 0.3s ease-out'
  }
};

const StatusIndicator = ({
  status,
  label,
  variant = 'dot',
  size = 'medium',
  showLabel = false,
  showIcon = true,
  showTooltip = true,
  customColor,
  customIcon,
  progress,
  trend,
  animated = true,
  onClick,
  style,
  ...other
}) => {
  // Configuration du statut
  const statusConfig = useMemo(() => {
    const config = STATUS_CONFIGS[status] || {
      color: customColor || '#9E9E9E',
      bgColor: customColor ? `${customColor}20` : '#F5F5F5',
      icon: customIcon || CircleIcon,
      label: label || status || 'Inconnu',
      pulse: false
    };

    // Override avec props personnalisées
    return {
      ...config,
      label: label || config.label,
      icon: customIcon || config.icon,
      color: customColor || config.color
    };
  }, [status, label, customColor, customIcon]);

  // Dimensions selon la taille
  const dimensions = useMemo(() => {
    switch (size) {
      case 'small':
        return { 
          dotSize: 8, 
          chipHeight: 20, 
          iconSize: 14, 
          fontSize: 11,
          avatarSize: 24
        };
      case 'large':
        return { 
          dotSize: 16, 
          chipHeight: 32, 
          iconSize: 20, 
          fontSize: 14,
          avatarSize: 40
        };
      default:
        return { 
          dotSize: 12, 
          chipHeight: 24, 
          iconSize: 16, 
          fontSize: 12,
          avatarSize: 32
        };
    }
  }, [size]);

  // Render du composant selon la variante
  const renderIndicator = () => {
    const IconComponent = statusConfig.icon;
    const isClickable = Boolean(onClick);

    const commonSx = {
      ...(animated && statusConfig.pulse && animationStyles.pulse),
      ...(animated && statusConfig.rotate && animationStyles.rotate),
      ...(animated && animationStyles.fadeIn),
      ...(isClickable && { cursor: 'pointer' }),
      ...style
    };

    switch (variant) {
      case 'dot':
        return (
          <MDBox
            component={isClickable ? 'button' : 'div'}
            onClick={onClick}
            sx={{
              width: dimensions.dotSize,
              height: dimensions.dotSize,
              borderRadius: '50%',
              bgcolor: statusConfig.color,
              border: 'none',
              outline: 'none',
              ...commonSx
            }}
            {...other}
          />
        );

      case 'icon':
        return (
          <MDBox
            component={isClickable ? IconButton : 'div'}
            onClick={onClick}
            sx={{
              color: statusConfig.color,
              p: isClickable ? 0.5 : 0,
              ...commonSx
            }}
            {...other}
          >
            <IconComponent sx={{ fontSize: dimensions.iconSize }} />
          </MDBox>
        );

      case 'chip':
        return (
          <Chip
            icon={showIcon ? <IconComponent sx={{ fontSize: dimensions.iconSize }} /> : undefined}
            label={showLabel ? statusConfig.label : ''}
            size={size}
            onClick={onClick}
            sx={{
              bgcolor: statusConfig.bgColor,
              color: statusConfig.color,
              height: dimensions.chipHeight,
              fontSize: dimensions.fontSize,
              '& .MuiChip-icon': {
                color: statusConfig.color
              },
              ...commonSx
            }}
            {...other}
          />
        );

      case 'avatar':
        return (
          <Avatar
            onClick={onClick}
            sx={{
              bgcolor: statusConfig.bgColor,
              color: statusConfig.color,
              width: dimensions.avatarSize,
              height: dimensions.avatarSize,
              ...(isClickable && { cursor: 'pointer' }),
              ...commonSx
            }}
            {...other}
          >
            <IconComponent sx={{ fontSize: dimensions.iconSize }} />
          </Avatar>
        );

      case 'progress':
        return (
          <MDBox sx={{ width: '100%', ...commonSx }} {...other}>
            <MDBox display="flex" alignItems="center" mb={0.5}>
              {showIcon && (
                <IconComponent 
                  sx={{ 
                    fontSize: dimensions.iconSize, 
                    color: statusConfig.color, 
                    mr: 1 
                  }} 
                />
              )}
              {showLabel && (
                <MDTypography variant="caption" color="text" fontSize={dimensions.fontSize}>
                  {statusConfig.label}
                </MDTypography>
              )}
              {progress !== undefined && (
                <MDTypography variant="caption" color="text" ml="auto" fontSize={dimensions.fontSize}>
                  {Math.round(progress)}%
                </MDTypography>
              )}
            </MDBox>
            <LinearProgress
              variant="determinate"
              value={progress || 0}
              sx={{
                height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
                borderRadius: 3,
                bgcolor: statusConfig.bgColor,
                '& .MuiLinearProgress-bar': {
                  bgcolor: statusConfig.color,
                  borderRadius: 3
                }
              }}
            />
          </MDBox>
        );

      case 'circular':
        return (
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            sx={{ ...commonSx }}
            {...other}
          >
            <CircularProgress
              variant={progress !== undefined ? "determinate" : "indeterminate"}
              value={progress}
              size={dimensions.avatarSize}
              thickness={4}
              sx={{
                color: statusConfig.color,
                ...(progress === undefined && statusConfig.pulse && animationStyles.pulse)
              }}
            />
            {showIcon && (
              <MDBox
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconComponent sx={{ fontSize: dimensions.iconSize, color: statusConfig.color }} />
              </MDBox>
            )}
          </MDBox>
        );

      case 'badge':
        return (
          <MDBox
            component={isClickable ? 'button' : 'div'}
            onClick={onClick}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: statusConfig.bgColor,
              color: statusConfig.color,
              fontSize: dimensions.fontSize,
              fontWeight: 'medium',
              border: 'none',
              outline: 'none',
              ...commonSx
            }}
            {...other}
          >
            {showIcon && (
              <IconComponent sx={{ fontSize: dimensions.iconSize, mr: showLabel ? 0.5 : 0 }} />
            )}
            {showLabel && statusConfig.label}
          </MDBox>
        );

      default:
        return (
          <MDBox sx={commonSx} {...other}>
            <IconComponent sx={{ fontSize: dimensions.iconSize, color: statusConfig.color }} />
          </MDBox>
        );
    }
  };

  // Wrapper avec tooltip si activé
  const indicator = renderIndicator();

  if (showTooltip && !showLabel) {
    return (
      <Tooltip title={statusConfig.label} arrow>
        {indicator}
      </Tooltip>
    );
  }

  return indicator;
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(Object.keys(STATUS_CONFIGS)).isRequired,
  label: PropTypes.string,
  variant: PropTypes.oneOf(['dot', 'icon', 'chip', 'avatar', 'progress', 'circular', 'badge']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
  showIcon: PropTypes.bool,
  showTooltip: PropTypes.bool,
  customColor: PropTypes.string,
  customIcon: PropTypes.elementType,
  progress: PropTypes.number,
  trend: PropTypes.oneOf(['up', 'down', 'stable']),
  animated: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object
};

export default StatusIndicator;