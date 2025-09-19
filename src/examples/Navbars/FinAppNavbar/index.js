// src/examples/Navbars/FinAppNavbar/index.js
import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";

// FinApp components
import CurrencySelector from "components/FinApp/CurrencySelector";
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Custom styles for FinAppNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Hook pour données utilisateur (simulation - remplacer par vraie API)
const useUserData = () => {
  return {
    name: "Jean Baptiste",
    avatar: null, // URL de l'avatar
    totalBalance: 45750.50,
    currency: "HTG",
    notifications: {
      total: 6,
      unread: 3,
      recent: [
        {
          id: 1,
          type: "sol",
          title: "Sol Famille - Tour prochain",
          description: "Votre tour dans 3 jours",
          time: "il y a 1h",
          read: false
        },
        {
          id: 2,
          type: "budget", 
          title: "Budget Alimentation dépassé",
          description: "105% du budget mensuel utilisé",
          time: "il y a 2h",
          read: false
        },
        {
          id: 3,
          type: "investment",
          title: "Élevage Porcs - ROI positif",
          description: "+15% ce mois",
          time: "il y a 1 jour",
          read: true
        }
      ]
    }
  };
};

function FinAppNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  
  // Menus états
  const [openNotificationsMenu, setOpenNotificationsMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("HTG");
  
  const route = useLocation().pathname.split("/").slice(1);
  const userData = useUserData();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    // The event listener for window scroll.
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  
  // Handlers menus
  const handleNotificationsMenu = (event) => setOpenNotificationsMenu(event.currentTarget);
  const handleCloseNotificationsMenu = () => setOpenNotificationsMenu(false);
  
  const handleUserMenu = (event) => setOpenUserMenu(event.currentTarget);
  const handleCloseUserMenu = () => setOpenUserMenu(false);

  const handleCurrencyChange = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    // TODO: Mettre à jour contexte global et persister choix
  };

  // Render notifications menu
  const renderNotificationsMenu = () => (
    <Menu
      anchorEl={openNotificationsMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openNotificationsMenu)}
      onClose={handleCloseNotificationsMenu}
      sx={{ mt: 2, maxWidth: 360 }}
    >
      {/* Header notifications */}
      <MDBox px={2} py={1}>
        <MDTypography variant="h6" fontWeight="medium">
          Notifications
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {userData.notifications.unread} non lues sur {userData.notifications.total}
        </MDTypography>
      </MDBox>
      
      <Divider />
      
      {/* Liste notifications */}
      {userData.notifications.recent.map((notification) => (
        <MenuItem 
          key={notification.id}
          onClick={handleCloseNotificationsMenu}
          sx={{ 
            py: 1, 
            px: 2,
            bgcolor: !notification.read ? "action.hover" : "transparent"
          }}
        >
          <MDBox display="flex" alignItems="flex-start" width="100%" gap={1}>
            <Icon 
              fontSize="small" 
              color={
                notification.type === "sol" ? "info" :
                notification.type === "budget" ? "warning" : "success"
              }
            >
              {notification.type === "sol" ? "people" :
               notification.type === "budget" ? "account_balance_wallet" : "trending_up"}
            </Icon>
            <MDBox flexGrow={1}>
              <MDTypography variant="button" fontWeight={notification.read ? "regular" : "medium"}>
                {notification.title}
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block">
                {notification.description}
              </MDTypography>
              <MDTypography variant="caption" color="secondary">
                {notification.time}
              </MDTypography>
            </MDBox>
            {!notification.read && (
              <Badge color="error" variant="dot" />
            )}
          </MDBox>
        </MenuItem>
      ))}
      
      <Divider />
      
      {/* Footer notifications */}
      <MDBox px={2} py={1}>
        <MDButton
          variant="text"
          color="info"
          size="small"
          fullWidth
          component={Link}
          to="/notifications"
        >
          Voir toutes les notifications
        </MDButton>
      </MDBox>
    </Menu>
  );

  // Render user menu
  const renderUserMenu = () => (
    <Menu
      anchorEl={openUserMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Boolean(openUserMenu)}
      onClose={handleCloseUserMenu}
      sx={{ mt: 2 }}
    >
      <MDBox px={2} py={1}>
        <MDTypography variant="h6" fontWeight="medium">
          {userData.name}
        </MDTypography>
        <CurrencyDisplay
          amount={userData.totalBalance}
          currency={userData.currency}
          variant="caption"
          color="text"
          showSymbol={true}
        />
      </MDBox>
      
      <Divider />
      
      <MenuItem onClick={handleCloseUserMenu} component={Link} to="/profile">
        <Icon sx={{ mr: 1 }}>person</Icon>
        Mon Profil
      </MenuItem>
      
      <MenuItem onClick={handleCloseUserMenu} component={Link} to="/profile/settings">
        <Icon sx={{ mr: 1 }}>settings</Icon>
        Paramètres
      </MenuItem>
      
      <MenuItem onClick={handleCloseUserMenu} component={Link} to="/help">
        <Icon sx={{ mr: 1 }}>help</Icon>
        Aide
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleCloseUserMenu}>
        <Icon sx={{ mr: 1 }}>logout</Icon>
        Déconnexion
      </MenuItem>
    </Menu>
  );

  // Navbar icons configuration
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {/* Breadcrumbs */}
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          
          {/* Icône toggle sidebar (mobile) */}
          <IconButton
            sx={navbarMobileMenu}
            color="inherit"
            disableRipple
            onClick={handleMiniSidenav}
          >
            <Icon sx={iconsStyle} fontSize="medium">
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
        </MDBox>

        {/* Actions navbar */}
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* Currency selector */}
            <MDBox mx={2}>
              <CurrencySelector
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                size="small"
                showExchangeRate={false}
              />
            </MDBox>

            {/* Recherche rapide */}
            <MDBox pr={1}>
              <MDInput
                placeholder="Rechercher transaction..."
                size="small"
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <Icon fontSize="small">search</Icon>
                  )
                }}
              />
            </MDBox>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                sx={navbarIconButton}
                color="inherit"
                disableRipple
                onClick={handleNotificationsMenu}
              >
                <Badge badgeContent={userData.notifications.unread} color="error">
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
            </Tooltip>
            
            {renderNotificationsMenu()}

            {/* Profil utilisateur */}
            <Tooltip title="Profil">
              <IconButton
                sx={navbarIconButton}
                color="inherit"
                disableRipple
                onClick={handleUserMenu}
              >
                {userData.avatar ? (
                  <Avatar src={userData.avatar} sx={{ width: 24, height: 24 }} />
                ) : (
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "info.main" }}>
                    {userData.name.charAt(0)}
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
            
            {renderUserMenu()}

            {/* Configurateur */}
            <Tooltip title="Paramètres">
              <IconButton
                sx={navbarIconButton}
                color="inherit"
                disableRipple
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of FinAppNavbar
FinAppNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the FinAppNavbar
FinAppNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default FinAppNavbar;