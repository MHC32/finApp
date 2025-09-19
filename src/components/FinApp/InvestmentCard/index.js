// src/components/FinApp/InvestmentCard/index.js
import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Configuration des types d'investissement
const INVESTMENT_TYPES = {
  elevage: {
    icon: "pets",
    color: "success", 
    label: "Élevage",
    description: "Porcs, volaille, bétail"
  },
  commerce: {
    icon: "store",
    color: "info",
    label: "Commerce", 
    description: "Boutique, vente, import"
  },
  immobilier: {
    icon: "home",
    color: "primary",
    label: "Immobilier",
    description: "Terrain, maison, location"
  },
  agriculture: {
    icon: "grass",
    color: "success",
    label: "Agriculture",
    description: "Cultures, plantations"
  },
  transport: {
    icon: "directions_car",
    color: "warning",
    label: "Transport",
    description: "Véhicules, moto-taxi"
  },
  technologie: {
    icon: "computer",
    color: "info",
    label: "Technologie",
    description: "Crypto, digital, tech"
  },
  artisanat: {
    icon: "handyman",
    color: "secondary",
    label: "Artisanat",
    description: "Couture, menuiserie, art"
  },
  autre: {
    icon: "business",
    color: "dark",
    label: "Autre",
    description: "Autres secteurs"
  }
};

// Statuts d'investissement
const INVESTMENT_STATUS = {
  active: { label: "Actif", color: "success", icon: "trending_up" },
  planning: { label: "Planifié", color: "info", icon: "schedule" },
  paused: { label: "Suspendu", color: "warning", icon: "pause" },
  completed: { label: "Terminé", color: "dark", icon: "task_alt" },
  failed: { label: "Échoué", color: "error", icon: "cancel" },
};

// Calculs ROI et métriques
const calculateInvestmentMetrics = (initialInvestment, currentValue, startDate, projectedValue = null) => {
  const totalReturn = currentValue - initialInvestment;
  const roiPercentage = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;
  
  // Calcul durée en mois
  const start = new Date(startDate);
  const now = new Date();
  const monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const monthsElapsedDisplay = Math.max(1, monthsElapsed); // Minimum 1 mois
  
  // ROI annualisé
  const annualizedROI = monthsElapsedDisplay > 0 ? (roiPercentage / monthsElapsedDisplay) * 12 : 0;
  
  // Progression vers objectif (si objectif défini)
  const progressToTarget = projectedValue ? (currentValue / projectedValue) * 100 : null;
  
  return {
    totalReturn,
    roiPercentage,
    annualizedROI,
    monthsElapsed: monthsElapsedDisplay,
    progressToTarget,
    isPositive: totalReturn > 0,
    monthlyAverage: monthsElapsedDisplay > 0 ? totalReturn / monthsElapsedDisplay : 0
  };
};

function InvestmentCard({
  projectName = "Élevage Porcs",
  type = "elevage",
  initialInvestment = 50000,
  currentValue = 65000,
  projectedValue = null,
  currency = "HTG",
  startDate = new Date().toISOString(),
  status = "active",
  partners = [],
  userShare = 100,
  lastUpdate = new Date().toISOString(),
  nextMilestone = null,
  description = "",
  color = "auto",
  showChart = true,
  showPartners = true,
  showActions = true,
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

  // Configuration du type d'investissement
  const typeConfig = INVESTMENT_TYPES[type] || INVESTMENT_TYPES.autre;
  const statusConfig = INVESTMENT_STATUS[status] || INVESTMENT_STATUS.active;
  const cardColor = color === "auto" ? typeConfig.color : color;

  // Calculs des métriques
  const metrics = calculateInvestmentMetrics(initialInvestment, currentValue, startDate, projectedValue);

  // Montant de l'utilisateur (selon sa part)
  const userInvestment = (initialInvestment * userShare) / 100;
  const userCurrentValue = (currentValue * userShare) / 100;
  const userReturn = userCurrentValue - userInvestment;

  // Configuration de taille
  const sizeConfig = {
    small: { 
      titleVariant: "button", 
      amountVariant: "h6",
      padding: 2,
      showExtended: false
    },
    medium: { 
      titleVariant: "h6", 
      amountVariant: "h5",
      padding: 2.5,
      showExtended: true
    },
    large: { 
      titleVariant: "h5", 
      amountVariant: "h4",
      padding: 3,
      showExtended: true
    }
  };

  const config = sizeConfig[size];

  // Formatage des dates
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-HT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
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
        border: status === "active" && metrics.isPositive ? 1 : 0,
        borderColor: status === "active" && metrics.isPositive ? "success.main" : "transparent",
      }}
      onClick={handleCardClick}
      {...other}
    >
      <MDBox p={config.padding}>
        {/* Header avec type et statut */}
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
              <Icon>{typeConfig.icon}</Icon>
            </MDBox>
            
            <MDBox>
              <MDTypography variant={config.titleVariant} fontWeight="medium">
                {projectName}
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={1}>
                <Chip 
                  label={statusConfig.label}
                  size="small"
                  color={statusConfig.color}
                  icon={<Icon fontSize="small">{statusConfig.icon}</Icon>}
                />
                <Chip 
                  label={typeConfig.label}
                  size="small"
                  variant="outlined"
                />
                {userShare < 100 && (
                  <Chip 
                    label={`${userShare}% part`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Menu actions */}
          {showActions && (
            <MDBox>
              <Tooltip title="Actions investissement">
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
                  <Icon sx={{ mr: 1 }} fontSize="small">add</Icon>
                  Ajouter fonds
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">trending_up</Icon>
                  Mettre à jour valeur
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">analytics</Icon>
                  Analyse détaillée
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">edit</Icon>
                  Modifier projet
                </MenuItem>
              </Menu>
            </MDBox>
          )}
        </MDBox>

        {/* Valeurs et ROI */}
        <MDBox mb={2}>
          <Grid container spacing={2} alignItems="center">
            {/* Valeur actuelle */}
            <Grid item xs={userShare < 100 ? 6 : 8}>
              <MDBox>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {userShare < 100 ? "Votre part" : "Valeur actuelle"}
                </MDTypography>
                <CurrencyDisplay
                  amount={userShare < 100 ? userCurrentValue : currentValue}
                  currency={currency}
                  variant={config.amountVariant}
                  color={metrics.isPositive ? "success" : "error"}
                  fontWeight="bold"
                  showSymbol={true}
                  showTrend={true}
                  previousAmount={userShare < 100 ? userInvestment : initialInvestment}
                  animate={true}
                />
              </MDBox>
            </Grid>
            
            {/* ROI */}
            <Grid item xs={userShare < 100 ? 6 : 4}>
              <MDBox textAlign="right">
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  ROI
                </MDTypography>
                <MDBox display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                  <Icon 
                    fontSize="small" 
                    color={metrics.isPositive ? "success" : "error"}
                  >
                    {metrics.isPositive ? "trending_up" : "trending_down"}
                  </Icon>
                  <MDTypography 
                    variant="h6" 
                    fontWeight="bold"
                    color={metrics.isPositive ? "success" : "error"}
                  >
                    {metrics.roiPercentage > 0 ? "+" : ""}{metrics.roiPercentage.toFixed(1)}%
                  </MDTypography>
                </MDBox>
                <MDTypography variant="caption" color="text">
                  {metrics.annualizedROI.toFixed(1)}% annualisé
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Progression vers objectif (si défini) */}
        {projectedValue && metrics.progressToTarget && (
          <MDBox mb={2}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Progression vers objectif
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {metrics.progressToTarget.toFixed(0)}%
              </MDTypography>
            </MDBox>
            
            <LinearProgress
              variant="determinate"
              value={Math.min(metrics.progressToTarget, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  background: ({ palette: { gradients } }) => 
                    metrics.progressToTarget >= 100 ? gradients.success.main :
                    metrics.progressToTarget >= 75 ? gradients.info.main :
                    gradients.warning.main
                }
              }}
            />
            
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
              <CurrencyDisplay
                amount={currentValue}
                currency={currency}
                variant="caption"
                color="text"
                showSymbol={true}
                animate={false}
                size="small"
              />
              <CurrencyDisplay
                amount={projectedValue}
                currency={currency}
                variant="caption"
                color="success"
                showSymbol={true}
                animate={false}
                size="small"
              />
            </MDBox>
          </MDBox>
        )}

        {/* Partenaires */}
        {showPartners && partners.length > 0 && (
          <MDBox mb={2}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <MDTypography variant="button" fontWeight="medium">
                Partenaires ({partners.length})
              </MDTypography>
              <MDTypography variant="caption" color="text">
                Votre part: {userShare}%
              </MDTypography>
            </MDBox>
            
            <AvatarGroup 
              max={4}
              sx={{ 
                justifyContent: "flex-start",
                "& .MuiAvatar-root": { 
                  width: 32, 
                  height: 32,
                  fontSize: "0.875rem",
                  border: 2,
                  borderColor: "background.paper"
                }
              }}
            >
              {partners.map((partner) => (
                <Tooltip key={partner.id} title={`${partner.name} - ${partner.share}%`}>
                  <Avatar src={partner.avatar}>
                    {!partner.avatar && partner.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </MDBox>
        )}

        {/* Métriques détaillées */}
        {config.showExtended && (
          <MDBox mb={2}>
            <MDBox 
              display="flex" 
              justifyContent="space-between" 
              p={1.5}
              borderRadius={1}
              bgcolor="grey.50"
            >
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Investi total
                </MDTypography>
                <CurrencyDisplay
                  amount={initialInvestment}
                  currency={currency}
                  variant="button"
                  color="text"
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                  size="small"
                />
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Gain/Perte
                </MDTypography>
                <CurrencyDisplay
                  amount={userReturn}
                  currency={currency}
                  variant="button"
                  color={metrics.isPositive ? "success" : "error"}
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                  size="small"
                />
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Durée
                </MDTypography>
                <MDTypography variant="button" fontWeight="medium" display="block">
                  {metrics.monthsElapsed} mois
                </MDTypography>
              </MDBox>
            </MDBox>
            
            {/* Prochaine étape */}
            {nextMilestone && (
              <MDBox mt={1.5} p={1} bgcolor="info.50" borderRadius={1} border={1} borderColor="info.200">
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Icon fontSize="small" color="info">flag</Icon>
                  <MDBox>
                    <MDTypography variant="caption" color="info.main" fontWeight="medium">
                      Prochaine étape: {nextMilestone.title}
                    </MDTypography>
                    {nextMilestone.date && (
                      <MDTypography variant="caption" color="text" display="block">
                        Prévu pour {formatDate(nextMilestone.date)}
                      </MDTypography>
                    )}
                  </MDBox>
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        )}

        {/* Dernière mise à jour */}
        <MDBox mb={showActions ? 2 : 0} pt={2} borderTop={1} borderColor="grey.200">
          <MDTypography variant="caption" color="text">
            Dernière mise à jour: {formatDate(lastUpdate)}
          </MDTypography>
        </MDBox>

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
              Ajouter
            </MDButton>
            <MDButton
              variant="outlined"
              color={cardColor}
              size="small"
              startIcon={<Icon>update</Icon>}
              sx={{ flex: 1 }}
            >
              Maj Valeur
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
InvestmentCard.defaultProps = {
  projectName: "Élevage Porcs",
  type: "elevage",
  initialInvestment: 50000,
  currentValue: 65000,
  projectedValue: null,
  currency: "HTG",
  startDate: new Date().toISOString(),
  status: "active",
  partners: [],
  userShare: 100,
  lastUpdate: new Date().toISOString(),
  nextMilestone: null,
  description: "",
  color: "auto",
  showChart: true,
  showPartners: true,
  showActions: true,
  size: "medium",
  onClick: null,
};

// Validation des props
InvestmentCard.propTypes = {
  projectName: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(INVESTMENT_TYPES)),
  initialInvestment: PropTypes.number,
  currentValue: PropTypes.number,
  projectedValue: PropTypes.number,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  startDate: PropTypes.string,
  status: PropTypes.oneOf(Object.keys(INVESTMENT_STATUS)),
  partners: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
    share: PropTypes.number,
  })),
  userShare: PropTypes.number,
  lastUpdate: PropTypes.string,
  nextMilestone: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
  }),
  description: PropTypes.string,
  color: PropTypes.oneOfType([
    PropTypes.oneOf(["auto", "primary", "secondary", "info", "success", "warning", "error", "dark"]),
    PropTypes.string
  ]),
  showChart: PropTypes.bool,
  showPartners: PropTypes.bool,
  showActions: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
};

export default InvestmentCard;

// Export des utilitaires
export { INVESTMENT_TYPES, INVESTMENT_STATUS, calculateInvestmentMetrics };