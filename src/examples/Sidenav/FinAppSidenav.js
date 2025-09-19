// src/examples/Sidenav/FinAppSidenav.js
import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Hook pour notifications (simulation - remplacer par vraie API)
const useFinAppNotifications = () => {
  return {
    sols: 3,        // 3 échéances sols cette semaine
    budgets: 1,     // 1 budget dépassé
    investments: 2, // 2 projets nécessitent attention
    total: 6,       // Total notifications non lues
  };
};

// Hook pour solde rapide (simulation - remplacer par vraie API)
const useQuickBalance = () => {
  return {
    total: 45750.50,
    currency: "HTG",
    accounts: [
      { bank: "Sogebank", balance: 25750.50, currency: "HTG" },
      { bank: "Unibank", balance: 1500.75, currency: "USD" },
    ]
  };
};

function FinAppSidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  
  // Hooks FinApp
  const notifications = useFinAppNotifications();
  const balance = useQuickBalance();

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    // Event listener for window resize
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, transparentSidenav, whiteSidenav]);

  // Render les items de navigation avec badges de notification
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route, badge }) => {
    let returnValue;

    // Fonction pour obtenir les notifications par route
    const getNotificationCount = (routeKey) => {
      switch (routeKey) {
        case "sols": return notifications.sols;
        case "investments": return notifications.investments;  
        case "budgets": return notifications.budgets;
        case "notifications": return notifications.total;
        default: return 0;
      }
    };

    if (type === "collapse") {
      const notificationCount = getNotificationCount(key);
      
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={notificationCount > 0 ? (
              <Badge badgeContent={notificationCount} color="error" variant="dot">
                {icon}
              </Badge>
            ) : icon}
            active={key === collapseName}
            {...rest}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse
            name={name}
            icon={notificationCount > 0 ? (
              <Badge badgeContent={notificationCount} color="error" max={99}>
                {icon}
              </Badge>
            ) : icon}
            active={key === collapseName}
            {...rest}
          />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      {/* Header avec logo et nom */}
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && (
            <MDBox component="img" src={brand} alt="Brand" width="2rem" />
          )}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Widget solde rapide (seulement si pas mini) */}
      {!miniSidenav && (
        <MDBox px={2} mb={2}>
          <MDBox
            sx={{
              background: ({ palette: { gradients }, functions: { linearGradient } }) =>
                linearGradient(gradients.info.main, gradients.info.state),
              borderRadius: "0.75rem",
              p: 2,
              color: "white",
            }}
          >
            <MDTypography variant="caption" color="white" fontWeight="medium" opacity={0.8}>
              Solde Total
            </MDTypography>
            <CurrencyDisplay
              amount={balance.total}
              currency={balance.currency}
              variant="h6"
              color="white"
              fontWeight="bold"
              showSymbol={true}
              animate={false}
            />
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="caption" color="white" opacity={0.7}>
                {balance.accounts.length} comptes
              </MDTypography>
              <MDButton
                variant="text"
                color="white"
                size="small"
                component={NavLink}
                to="/accounts"
                sx={{
                  minWidth: "auto",
                  p: 0.5,
                  "& .MuiButton-root": {
                    minWidth: "auto"
                  }
                }}
              >
                <Icon fontSize="small">arrow_forward</Icon>
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      )}

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      {/* Navigation principale */}
      <List>{renderRoutes}</List>

      {/* Footer avec actions rapides (seulement si pas mini) */}
      {!miniSidenav && (
        <>
          <Divider
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
          <MDBox px={2} my={2}>
            <MDTypography variant="caption" color={textColor} fontWeight="medium" pl={1} mb={1}>
              Actions Rapides
            </MDTypography>
            <MDBox display="flex" flexDirection="column" gap={1}>
              <MDButton
                variant="outlined"
                color={sidenavColor}
                size="small"
                startIcon={<Icon>add</Icon>}
                component={NavLink}
                to="/transactions/add"
                fullWidth
              >
                Transaction
              </MDButton>
              <MDButton
                variant="outlined"
                color={sidenavColor}
                size="small"
                startIcon={<Icon>people</Icon>}
                component={NavLink}
                to="/sols/create"
                fullWidth
              >
                Nouveau Sol
              </MDButton>
            </MDBox>
          </MDBox>
        </>
      )}

      {/* Badge notifications global (version mini) */}
      {miniSidenav && notifications.total > 0 && (
        <MDBox position="absolute" bottom={20} right={10}>
          <Badge badgeContent={notifications.total} color="error" max={99}>
            <Icon fontSize="medium" sx={{ color: textColor }}>
              notifications
            </Icon>
          </Badge>
        </MDBox>
      )}
    </SidenavRoot>
  );
}

// Typechecking props for the FinAppSidenav
FinAppSidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FinAppSidenav;