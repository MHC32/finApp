/**
 * =========================================================
 * FinApp Haiti - NotificationMenu
 * Menu déroulant notifications
 * =========================================================
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// @mui material components
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Exemples de notifications (à remplacer par Redux + API)
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'info',
    icon: 'info',
    title: 'Nouveau sol disponible',
    message: 'Un nouveau sol "Épargne Noël 2025" est disponible',
    time: 'Il y a 2h',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    icon: 'warning',
    title: 'Budget dépassé',
    message: 'Votre budget "Transport" a dépassé 90%',
    time: 'Il y a 5h',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    icon: 'check_circle',
    title: 'Paiement reçu',
    message: 'Jean a payé son sol 5000 HTG',
    time: 'Hier',
    read: true,
  },
];

/**
 * NotificationItem Component
 */
function NotificationItem({ notification, onClick }) {
  const iconColors = {
    info: 'info.main',
    warning: 'warning.main',
    error: 'error.main',
    success: 'success.main',
  };

  return (
    <MenuItem
      onClick={onClick}
      sx={{
        py: 1.5,
        backgroundColor: notification.read ? 'transparent' : 'rgba(33, 150, 243, 0.08)',
        '&:hover': {
          backgroundColor: notification.read ? 'action.hover' : 'rgba(33, 150, 243, 0.12)',
        },
      }}
    >
      <MDBox sx={{ display: 'flex', gap: 2, width: '100%' }}>
        {/* Icon */}
        <Icon sx={{ color: iconColors[notification.type] || 'text.secondary' }}>
          {notification.icon}
        </Icon>

        {/* Content */}
        <MDBox sx={{ flex: 1, minWidth: 0 }}>
          <MDTypography
            variant="button"
            fontWeight={notification.read ? 'regular' : 'medium'}
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {notification.title}
          </MDTypography>
          <MDTypography
            variant="caption"
            color="text"
            display="block"
            sx={{ mt: 0.5 }}
          >
            {notification.message}
          </MDTypography>
          <MDTypography
            variant="caption"
            color="text"
            display="block"
            sx={{ mt: 0.5, fontSize: '0.65rem' }}
          >
            {notification.time}
          </MDTypography>
        </MDBox>

        {/* Unread indicator */}
        {!notification.read && (
          <MDBox
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'info.main',
              mt: 0.5,
            }}
          />
        )}
      </MDBox>
    </MenuItem>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

/**
 * NotificationMenu Component
 */
function NotificationMenu() {
  const navigate = useNavigate();

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Compter non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Ouvrir/fermer menu
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Marquer une notification comme lue
  const handleNotificationClick = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
    handleClose();
    // TODO: Naviguer vers la page liée à la notification
  };

  // Voir toutes les notifications
  const handleViewAll = () => {
    handleClose();
    navigate('/notifications');
  };

  return (
    <>
      {/* Notification Button */}
      <IconButton onClick={handleOpen} size="medium">
        <Badge badgeContent={unreadCount} color="error">
          <Icon>notifications</Icon>
        </Badge>
      </IconButton>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 360,
            maxWidth: 400,
            maxHeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        {/* Header */}
        <MDBox sx={{ px: 2, py: 1.5 }}>
          <MDTypography variant="h6" fontWeight="medium">
            Notifications
          </MDTypography>
          {unreadCount > 0 && (
            <MDTypography variant="caption" color="text">
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </MDTypography>
          )}
        </MDBox>

        <Divider />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <MDBox sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Icon sx={{ fontSize: 48, color: 'text.disabled' }}>notifications_none</Icon>
            <MDTypography variant="button" color="text" display="block" sx={{ mt: 1 }}>
              Aucune notification
            </MDTypography>
          </MDBox>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification.id)}
            />
          ))
        )}

        <Divider />

        {/* Footer */}
        <MDBox sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
          <MDButton variant="text" color="info" size="small" onClick={handleViewAll}>
            Voir toutes les notifications
          </MDButton>
        </MDBox>
      </Menu>
    </>
  );
}

export default NotificationMenu;