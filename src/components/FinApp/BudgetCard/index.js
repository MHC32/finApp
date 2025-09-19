// src/components/FinApp/BudgetCard/index.js
import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Configuration des catégories avec icônes et couleurs
const BUDGET_CATEGORIES = {
  alimentation: { 
    icon: "restaurant", 
    color: "success",
    label: "Alimentation"
  },
  transport: { 
    icon: "directions_car", 
    color: "info",
    label: "Transport"
  },
  logement: { 
    icon: "home", 
    color: "primary",
    label: "Logement"
  },
  sante: { 
    icon: "medical_services", 
    color: "error",
    label: "Santé"
  },
  education: { 
    icon: "school", 
    color: "warning",
    label: "Éducation"
  },
  loisirs: { 
    icon: "sports_esports", 
    color: "secondary",
    label: "Loisirs"
  },
  epargne: { 
    icon: "savings", 
    color: "success",
    label: "Épargne"
  },
  autres: { 
    icon: "category", 
    color: "dark",
    label: "Autres"
  }
};

function BudgetCard({
  category = "alimentation",
  budgetAmount = 10000,
  spentAmount = 7500,
  currency = "HTG",
  period = "mensuel",
  daysLeft = 15,
  totalDays = 30,
  lastExpenses = [],
  showDetails = true,
  showActions = true,
  color = "auto",
  size = "medium",
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

  // Configuration de la catégorie
  const categoryConfig = BUDGET_CATEGORIES[category] || BUDGET_CATEGORIES.autres;
  const cardColor = color === "auto" ? categoryConfig.color : color;

  // Calculs budget
  const percentage = (spentAmount / budgetAmount) * 100;
  const remainingAmount = budgetAmount - spentAmount;
  const isOverBudget = spentAmount > budgetAmount;
  const dailyAverage = spentAmount / (totalDays - daysLeft);
  const projectedSpending = dailyAverage * totalDays;
  const willExceed = projectedSpending > budgetAmount;

  // État du budget
  const getBudgetStatus = () => {
    if (isOverBudget) return { label: "Dépassé", color: "error" };
    if (percentage > 90) return { label: "Critique", color: "warning" };
    if (percentage > 75) return { label: "Attention", color: "warning" };
    if (percentage > 50) return { label: "En cours", color: "info" };
    return { label: "Bon", color: "success" };
  };

  const budgetStatus = getBudgetStatus();

  // Configuration de taille
  const sizeConfig = {
    small: { 
      titleVariant: "button", 
      amountVariant: "h6",
      padding: 2
    },
    medium: { 
      titleVariant: "h6", 
      amountVariant: "h5",
      padding: 2.5
    },
    large: { 
      titleVariant: "h5", 
      amountVariant: "h4",
      padding: 3
    }
  };

  const config = sizeConfig[size];

  return (
    <Card
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: onClick ? "translateY(-2px)" : "none",
          boxShadow: ({ boxShadows: { lg } }) => lg,
        },
        border: isOverBudget ? 2 : 0,
        borderColor: isOverBudget ? "error.main" : "transparent"
      }}
      onClick={handleCardClick}
      {...other}
    >
      <MDBox p={config.padding}>
        {/* Header avec catégorie et actions */}
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox display="flex" alignItems="center" gap={1}>
            <MDBox
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: ({ palette: { gradients } }) =>
                  gradients[cardColor] ? 
                    `linear-gradient(135deg, ${gradients[cardColor].main}, ${gradients[cardColor].state})` :
                    gradients.dark.main,
                color: "white"
              }}
            >
              <Icon>{categoryConfig.icon}</Icon>
            </MDBox>
            
            <MDBox>
              <MDTypography variant={config.titleVariant} fontWeight="medium">
                {categoryConfig.label}
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={1}>
                <Chip 
                  label={budgetStatus.label}
                  size="small"
                  color={budgetStatus.color}
                  variant="outlined"
                />
                <MDTypography variant="caption" color="text">
                  Budget {period}
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Menu actions */}
          {showActions && (
            <MDBox>
              <Tooltip title="Actions budget">
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
                  <Icon sx={{ mr: 1 }} fontSize="small">add</Icon>
                  Ajouter dépense
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">edit</Icon>
                  Modifier budget
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">history</Icon>
                  Voir historique
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">analytics</Icon>
                  Analyse détaillée
                </MenuItem>
              </Menu>
            </MDBox>
          )}
        </MDBox>

        {/* Montants et progression */}
        <MDBox mb={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
            <MDBox>
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Dépensé
              </MDTypography>
              <CurrencyDisplay
                amount={spentAmount}
                currency={currency}
                variant={config.amountVariant}
                color={isOverBudget ? "error" : "text"}
                fontWeight="bold"
                showSymbol={true}
                animate={false}
              />
            </MDBox>
            
            <MDBox textAlign="right">
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Budget total
              </MDTypography>
              <CurrencyDisplay
                amount={budgetAmount}
                currency={currency}
                variant="button"
                color="text"
                fontWeight="medium"
                showSymbol={true}
                animate={false}
              />
            </MDBox>
          </MDBox>

          {/* Barre de progression */}
          <MDBox mb={1}>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentage, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: ({ palette: { gradients } }) => {
                    if (isOverBudget) return gradients.error.main;
                    if (percentage > 75) return gradients.warning.main;
                    return gradients[cardColor]?.main || gradients.success.main;
                  }
                }
              }}
            />
            
            {/* Indicateur de dépassement */}
            {isOverBudget && (
              <LinearProgress
                variant="determinate"
                value={((percentage - 100) / 100) * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: "transparent",
                  mt: 0.5,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 2,
                    background: ({ palette: { gradients } }) => gradients.error.main,
                    opacity: 0.7
                  }
                }}
              />
            )}
          </MDBox>

          {/* Pourcentage et montant restant */}
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography 
              variant="button" 
              fontWeight="medium"
              color={isOverBudget ? "error" : percentage > 75 ? "warning" : "success"}
            >
              {percentage.toFixed(1)}% utilisé
            </MDTypography>
            
            <MDTypography variant="caption" color="text">
              {isOverBudget ? "Dépassé de " : "Reste "}
              <CurrencyDisplay
                amount={Math.abs(remainingAmount)}
                currency={currency}
                variant="caption"
                color={isOverBudget ? "error" : "success"}
                fontWeight="medium"
                showSymbol={true}
                animate={false}
                size="small"
              />
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Détails et prédictions */}
        {showDetails && (
          <MDBox mb={2}>
            <MDBox 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              p={1.5}
              borderRadius={1}
              bgcolor="grey.50"
            >
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Jours restants
                </MDTypography>
                <MDTypography variant="button" fontWeight="medium" display="block">
                  {daysLeft}
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Moyenne/jour
                </MDTypography>
                <CurrencyDisplay
                  amount={dailyAverage}
                  currency={currency}
                  variant="caption"
                  color="text"
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                  size="small"
                />
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color={willExceed ? "warning" : "success"}>
                  Projection
                </MDTypography>
                <CurrencyDisplay
                  amount={projectedSpending}
                  currency={currency}
                  variant="caption"
                  color={willExceed ? "warning" : "success"}
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                  size="small"
                />
              </MDBox>
            </MDBox>
            
            {/* Alerte prédiction */}
            {willExceed && !isOverBudget && (
              <MDBox mt={1} p={1} bgcolor="warning.50" borderRadius={1} border={1} borderColor="warning.200">
                <MDTypography variant="caption" color="warning.main" fontWeight="medium">
                  ⚠️ Risque de dépassement - Réduire les dépenses de {((projectedSpending - budgetAmount) / daysLeft).toFixed(0)} {currency}/jour
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        )}

        {/* Actions rapides */}
        {showActions && (
          <MDBox display="flex" gap={1}>
            <MDButton
              variant="outlined"
              color={cardColor}
              size="small"
              startIcon={<Icon>add</Icon>}
              sx={{ flex: 1 }}
            >
              Dépense
            </MDButton>
            <MDButton
              variant="outlined"
              color={cardColor}
              size="small"
              startIcon={<Icon>edit</Icon>}
              sx={{ flex: 1 }}
            >
              Modifier
            </MDButton>
            <MDButton
              variant="outlined"
              color={cardColor}
              size="small"
              startIcon={<Icon>analytics</Icon>}
              sx={{ flex: 1 }}
            >
              Analyse
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

// Props par défaut
BudgetCard.defaultProps = {
  category: "alimentation",
  budgetAmount: 10000,
  spentAmount: 7500,
  currency: "HTG",
  period: "mensuel",
  daysLeft: 15,
  totalDays: 30,
  lastExpenses: [],
  showDetails: true,
  showActions: true,
  color: "auto",
  size: "medium",
  onClick: null,
};

// Validation des props
BudgetCard.propTypes = {
  category: PropTypes.oneOf(Object.keys(BUDGET_CATEGORIES)),
  budgetAmount: PropTypes.number,
  spentAmount: PropTypes.number,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  period: PropTypes.oneOf(["hebdomadaire", "mensuel", "annuel"]),
  daysLeft: PropTypes.number,
  totalDays: PropTypes.number,
  lastExpenses: PropTypes.array,
  showDetails: PropTypes.bool,
  showActions: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.oneOf(["auto", "primary", "secondary", "info", "success", "warning", "error", "dark"]),
    PropTypes.string
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
};

export default BudgetCard;

// Export des utilitaires
export { BUDGET_CATEGORIES };