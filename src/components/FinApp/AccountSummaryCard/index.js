// src/components/FinApp/AccountSummaryCard/index.js
import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Mini chart component (simulation - remplacer par Chart.js)
const MiniChart = ({ data, color = "info", height = 60 }) => (
  <MDBox
    sx={{
      height,
      background: ({ palette: { gradients } }) =>
        `linear-gradient(45deg, ${gradients[color].main}, ${gradients[color].state})`,
      borderRadius: 1,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Simulation graphique - remplacer par vraie courbe */}
    <MDBox
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60%",
        background: "rgba(255,255,255,0.2)",
        clipPath: "polygon(0 100%, 20% 80%, 40% 90%, 60% 70%, 80% 85%, 100% 60%, 100% 100%)",
      }}
    />
    <MDTypography variant="caption" color="white" fontWeight="medium">
      {data.trend > 0 ? "+" : ""}{data.trend.toFixed(1)}%
    </MDTypography>
  </MDBox>
);

function AccountSummaryCard({
  accountName = "Compte Principal",
  accountType = "Épargne",
  bank = "Sogebank",
  balance = 0,
  currency = "HTG",
  previousBalance = 0,
  monthlyChange = 0,
  lastTransaction = null,
  color = "info",
  showChart = true,
  showActions = true,
  onClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Configuration couleur banque
  const bankColors = {
    sogebank: "info",
    unibank: "success", 
    "capital-bank": "warning",
    bnc: "error",
    custom: "dark"
  };

  const cardColor = color !== "info" ? color : bankColors[bank] || "info";

  // Calculs métriques
  const balanceChange = balance - previousBalance;
  const changePercentage = previousBalance !== 0 ? (balanceChange / Math.abs(previousBalance)) * 100 : 0;

  // Données graphique (simulation)
  const chartData = {
    trend: changePercentage,
    points: [previousBalance * 0.95, previousBalance, balance * 0.98, balance] // Simulation courbe
  };

  // Formatage dernière transaction
  const formatLastTransaction = () => {
    if (!lastTransaction) return "Aucune transaction récente";
    
    const amount = lastTransaction.amount;
    const type = amount > 0 ? "Crédit" : "Débit";
    const date = new Date(lastTransaction.date).toLocaleDateString("fr-HT");
    
    return `${type} de ${Math.abs(amount)} ${currency} - ${date}`;
  };

  return (
    <Card
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: onClick ? "translateY(-4px)" : "none",
          boxShadow: ({ boxShadows: { xl } }) => xl,
        },
      }}
      onClick={handleCardClick}
      {...other}
    >
      <MDBox p={2}>
        {/* Header avec nom compte et actions */}
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" gutterBottom>
              {accountName}
            </MDTypography>
            <MDBox display="flex" alignItems="center" gap={1}>
              <Chip 
                label={bank}
                size="small"
                color={cardColor}
                variant="outlined"
              />
              <Chip 
                label={accountType}
                size="small"
                variant="outlined"
              />
            </MDBox>
          </MDBox>

          {/* Menu actions */}
          {showActions && (
            <MDBox>
              <Tooltip title="Plus d'actions">
                <IconButton size="small" onClick={handleMenuOpen}>
                  <Icon fontSize="small">more_vert</Icon>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">visibility</Icon>
                  Voir détails
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">swap_horiz</Icon>
                  Virement
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">history</Icon>
                  Historique
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">edit</Icon>
                  Modifier
                </MenuItem>
              </Menu>
            </MDBox>
          )}
        </MDBox>

        {/* Solde principal avec tendance */}
        <MDBox mb={2}>
          <CurrencyDisplay
            amount={balance}
            currency={currency}
            variant="h4"
            color="auto"
            fontWeight="bold"
            showTrend={true}
            previousAmount={previousBalance}
            showConversion={currency === "HTG"}
            animate={true}
          />
        </MDBox>

        {/* Graphique mini et changement mensuel */}
        <Grid container spacing={2} alignItems="center">
          {/* Mini graphique */}
          {showChart && (
            <Grid item xs={6}>
              <MiniChart 
                data={chartData} 
                color={cardColor} 
                height={50}
              />
            </Grid>
          )}
          
          {/* Métriques changement */}
          <Grid item xs={showChart ? 6 : 12}>
            <MDBox textAlign={showChart ? "right" : "left"}>
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Ce mois
              </MDTypography>
              <MDBox display="flex" alignItems="center" justifyContent={showChart ? "flex-end" : "flex-start"} gap={0.5}>
                <Icon 
                  fontSize="small" 
                  color={monthlyChange >= 0 ? "success" : "error"}
                >
                  {monthlyChange >= 0 ? "trending_up" : "trending_down"}
                </Icon>
                <CurrencyDisplay
                  amount={Math.abs(monthlyChange)}
                  currency={currency}
                  variant="button"
                  color={monthlyChange >= 0 ? "success" : "error"}
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                />
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>

        {/* Dernière transaction */}
        <MDBox mt={2} pt={2} borderTop={1} borderColor="grey.200">
          <MDTypography variant="caption" color="text">
            {formatLastTransaction()}
          </MDTypography>
        </MDBox>

        {/* Actions rapides */}
        {showActions && (
          <MDBox mt={2} display="flex" gap={1}>
            <MDButton
              variant="outlined"
              color={cardColor}
              size="small"
              startIcon={<Icon>add</Icon>}
              sx={{ flex: 1 }}
            >
              Ajouter
            </MDButton>
            <MDButton
              variant="outlined"
              color={cardColor}  
              size="small"
              startIcon={<Icon>remove</Icon>}
              sx={{ flex: 1 }}
            >
              Retirer
            </MDButton>
            <MDButton
              variant="outlined"
              color={cardColor}
              size="small"
              startIcon={<Icon>swap_horiz</Icon>}
              sx={{ flex: 1 }}
            >
              Virer
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

// Props par défaut
AccountSummaryCard.defaultProps = {
  accountName: "Compte Principal",
  accountType: "Épargne",
  bank: "Sogebank",
  balance: 0,
  currency: "HTG",
  previousBalance: 0,
  monthlyChange: 0,
  lastTransaction: null,
  color: "info",
  showChart: true,
  showActions: true,
  onClick: null,
};

// Validation des props
AccountSummaryCard.propTypes = {
  accountName: PropTypes.string,
  accountType: PropTypes.string,
  bank: PropTypes.oneOf(["sogebank", "unibank", "capital-bank", "bnc", "custom"]),
  balance: PropTypes.number,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  previousBalance: PropTypes.number,
  monthlyChange: PropTypes.number,
  lastTransaction: PropTypes.shape({
    amount: PropTypes.number,
    date: PropTypes.string,
    description: PropTypes.string,
  }),
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  showChart: PropTypes.bool,
  showActions: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AccountSummaryCard;