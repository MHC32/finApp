// src/components/FinApp/FinAppSidenav/index.js
import React from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Routes par défaut si non fournies
const DEFAULT_ROUTES = [
  {
    type: "collapse",
    name: "Dashboard Financier",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
  },
  {
    type: "collapse",
    name: "Mes Comptes",
    key: "accounts",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/accounts",
  },
  {
    type: "collapse",
    name: "Sols/Tontines",
    key: "sols",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/sols",
  },
  {
    type: "collapse",
    name: "Budgets",
    key: "budgets",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/budgets",
  },
];

function FinAppSidenav({ 
  open = false, 
  onClose, 
  activePage = "dashboard",
  routes = DEFAULT_ROUTES, // Valeur par défaut
  ...other 
}) {

  const handleNavigation = (route) => {
    console.log('Navigation vers:', route);
    // Ici, intégrer avec React Router
    if (onClose) onClose();
  };

  const renderNavItems = () => {
    // Vérification de sécurité
    if (!routes || !Array.isArray(routes)) {
      return null;
    }

    return routes.map((item) => {
      if (item.type === "collapse") {
        return (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={activePage === item.key}
              onClick={() => handleNavigation(item.route)}
              sx={{
                minHeight: 48,
                px: 2.5,
                backgroundColor: activePage === item.key ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color: activePage === item.key ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name}
                sx={{
                  color: activePage === item.key ? 'primary.main' : 'text.primary',
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: activePage === item.key ? 600 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      } else if (item.type === "divider") {
        return <Divider key={`divider-${Math.random()}`} sx={{ my: 1 }} />;
      } else if (item.type === "title") {
        return (
          <MDBox key={`title-${Math.random()}`} px={2} py={1}>
            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
              {item.title}
            </MDTypography>
          </MDBox>
        );
      }
      return null;
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
      {...other}
    >
      {/* Header */}
      <MDBox p={2} textAlign="center">
        <MDTypography variant="h6" fontWeight="bold" color="primary">
          FinApp Haiti
        </MDTypography>
        <MDTypography variant="caption" color="text">
          Gestion financière haïtienne
        </MDTypography>
      </MDBox>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ px: 1 }}>
        {renderNavItems()}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <MDTypography variant="caption" color="text" textAlign="center">
          Version 1.0.0
        </MDTypography>
      </Box>
    </Drawer>
  );
}

FinAppSidenav.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  activePage: PropTypes.string,
  routes: PropTypes.array, // Ajout de la prop routes
};

export default FinAppSidenav;