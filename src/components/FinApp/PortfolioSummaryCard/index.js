// src/components/FinApp/PortfolioSummaryCard/index.js
import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";
import { INVESTMENT_TYPES } from "components/FinApp/InvestmentCard";

// Mini Pie Chart simulé (remplacer par Chart.js)
const MiniPieChart = ({ data, size = 120 }) => {
  // Calcul des angles pour le SVG
  let currentAngle = 0;
  const paths = data.map((segment, index) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (segment.percentage / 100) * 360;
    currentAngle = endAngle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = Math.cos(startAngleRad) * (size / 2 - 10);
    const y1 = Math.sin(startAngleRad) * (size / 2 - 10);
    const x2 = Math.cos(endAngleRad) * (size / 2 - 10);
    const y2 = Math.sin(endAngleRad) * (size / 2 - 10);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return {
      path: `M 0 0 L ${x1} ${y1} A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      color: segment.color,
      label: segment.label,
      value: segment.value
    };
  });

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <svg width={size} height={size} viewBox={`-${size/2} -${size/2} ${size} ${size}`}>
        {paths.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      
      {/* Centre avec total */}
      <MDBox
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: "translate(-50%, -50%)",
          textAlign: "center"
        }}
      >
        <MDTypography variant="caption" color="text" fontWeight="bold">
          Total
        </MDTypography>
      </MDBox>
    </Box>
  );
};

// Calculs du portfolio
const calculatePortfolioMetrics = (investments) => {
  if (!investments || investments.length === 0) {
    return {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalReturn: 0,
      totalROI: 0,
      bestPerformer: null,
      worstPerformer: null,
      activeCount: 0,
      averageROI: 0,
      byType: {},
      topPerformers: []
    };
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.initialInvestment, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturn = totalCurrentValue - totalInvested;
  const totalROI = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  
  // Classement par performance
  const investmentsWithROI = investments.map(inv => ({
    ...inv,
    roi: inv.initialInvestment > 0 ? ((inv.currentValue - inv.initialInvestment) / inv.initialInvestment) * 100 : 0
  }));
  
  const sortedByROI = [...investmentsWithROI].sort((a, b) => b.roi - a.roi);
  const bestPerformer = sortedByROI[0];
  const worstPerformer = sortedByROI[sortedByROI.length - 1];
  
  // Répartition par type
  const byType = {};
  investments.forEach(inv => {
    if (!byType[inv.type]) {
      byType[inv.type] = {
        count: 0,
        totalInvested: 0,
        totalValue: 0,
        percentage: 0
      };
    }
    byType[inv.type].count++;
    byType[inv.type].totalInvested += inv.initialInvestment;
    byType[inv.type].totalValue += inv.currentValue;
  });
  
  // Calcul pourcentages par type
  Object.keys(byType).forEach(type => {
    byType[type].percentage = (byType[type].totalValue / totalCurrentValue) * 100;
  });
  
  const activeCount = investments.filter(inv => inv.status === "active").length;
  const roiValues = investmentsWithROI.map(inv => inv.roi);
  const averageROI = roiValues.length > 0 ? roiValues.reduce((sum, roi) => sum + roi, 0) / roiValues.length : 0;
  
  return {
    totalInvested,
    totalCurrentValue,
    totalReturn,
    totalROI,
    bestPerformer,
    worstPerformer,
    activeCount,
    averageROI,
    byType,
    topPerformers: sortedByROI.slice(0, 3)
  };
};

function PortfolioSummaryCard({
  investments = [],
  currency = "HTG",
  title = "Portfolio d'Investissements",
  showChart = true,
  showTopPerformers = true,
  showTypeBreakdown = true,
  showActions = true,
  size = "large",
  timeframe = "all",
  onClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

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

  // Filtrer investments selon timeframe si nécessaire
  const filteredInvestments = investments; // TODO: Implémenter filtrage par période

  // Calculs des métriques
  const metrics = calculatePortfolioMetrics(filteredInvestments);

  // Données pour graphique circulaire
  const chartData = Object.entries(metrics.byType).map(([type, data]) => {
    const typeConfig = INVESTMENT_TYPES[type] || INVESTMENT_TYPES.autre;
    return {
      label: typeConfig.label,
      value: data.totalValue,
      percentage: data.percentage,
      color: `var(--mui-palette-${typeConfig.color}-main)`, // Couleur MUI
      count: data.count
    };
  }).sort((a, b) => b.percentage - a.percentage);

  // Configuration de taille
  const sizeConfig = {
    medium: { 
      titleVariant: "h6", 
      padding: 2.5,
      chartSize: 100,
      showExtended: false
    },
    large: { 
      titleVariant: "h5", 
      padding: 3,
      chartSize: 120,
      showExtended: true
    }
  };

  const config = sizeConfig[size] || sizeConfig.large;

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
      <MDBox p={config.padding}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox>
            <MDTypography variant={config.titleVariant} fontWeight="medium" gutterBottom>
              {title}
            </MDTypography>
            <MDBox display="flex" alignItems="center" gap={1}>
              <Chip 
                label={`${investments.length} projets`}
                size="small"
                color="info"
                variant="outlined"
              />
              <Chip 
                label={`${metrics.activeCount} actifs`}
                size="small"
                color="success"
                variant="outlined"
              />
            </MDBox>
          </MDBox>

          {/* Menu actions */}
          {showActions && (
            <MDBox>
              <Tooltip title="Actions portfolio">
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
                  Nouveau projet
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">analytics</Icon>
                  Analyse complète
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">file_download</Icon>
                  Exporter rapport
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">settings</Icon>
                  Paramètres
                </MenuItem>
              </Menu>
            </MDBox>
          )}
        </MDBox>

        {/* Métriques principales */}
        <Grid container spacing={2} mb={3}>
          {/* Valeur totale */}
          <Grid item xs={6}>
            <MDBox>
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Valeur totale
              </MDTypography>
              <CurrencyDisplay
                amount={metrics.totalCurrentValue}
                currency={currency}
                variant="h4"
                color="auto"
                fontWeight="bold"
                showSymbol={true}
                showTrend={true}
                previousAmount={metrics.totalInvested}
                animate={true}
              />
            </MDBox>
          </Grid>
          
          {/* ROI global */}
          <Grid item xs={6}>
            <MDBox textAlign="right">
              <MDTypography variant="caption" color="text" fontWeight="medium">
                ROI Global
              </MDTypography>
              <MDBox display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                <Icon 
                  fontSize="medium" 
                  color={metrics.totalROI >= 0 ? "success" : "error"}
                >
                  {metrics.totalROI >= 0 ? "trending_up" : "trending_down"}
                </Icon>
                <MDTypography 
                  variant="h4" 
                  fontWeight="bold"
                  color={metrics.totalROI >= 0 ? "success" : "error"}
                >
                  {metrics.totalROI >= 0 ? "+" : ""}{metrics.totalROI.toFixed(1)}%
                </MDTypography>
              </MDBox>
              <MDTypography variant="caption" color="text">
                Moyenne: {metrics.averageROI.toFixed(1)}%
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>

        {/* Graphique et répartition */}
        {showChart && chartData.length > 0 && (
          <MDBox mb={3}>
            <Grid container spacing={3} alignItems="center">
              {/* Mini graphique */}
              <Grid item xs={5}>
                <MDBox display="flex" justifyContent="center">
                  <MiniPieChart data={chartData} size={config.chartSize} />
                </MDBox>
              </Grid>
              
              {/* Légende */}
              <Grid item xs={7}>
                <MDBox>
                  <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                    Répartition par secteur
                  </MDTypography>
                  {chartData.slice(0, 4).map((segment, index) => (
                    <MDBox key={index} display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: segment.color
                          }}
                        />
                        <MDTypography variant="caption" color="text">
                          {segment.label}
                        </MDTypography>
                      </MDBox>
                      <MDTypography variant="caption" fontWeight="medium">
                        {segment.percentage.toFixed(1)}%
                      </MDTypography>
                    </MDBox>
                  ))}
                  {chartData.length > 4 && (
                    <MDTypography variant="caption" color="text" style={{ fontStyle: "italic" }}>
                      +{chartData.length - 4} autres secteurs
                    </MDTypography>
                  )}
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        )}

        {/* Top performers */}
        {showTopPerformers && metrics.topPerformers.length > 0 && (
          <MDBox mb={3}>
            <MDTypography variant="button" fontWeight="medium" mb={1.5} display="block">
              Meilleurs performeurs
            </MDTypography>
            
            {metrics.topPerformers.slice(0, 3).map((investment, index) => (
              <MDBox key={investment.id || index} mb={1.5}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDBox
                      sx={{
                        width: 6,
                        height: 20,
                        borderRadius: 1,
                        bgcolor: index === 0 ? "success.main" : 
                               index === 1 ? "info.main" : "warning.main"
                      }}
                    />
                    <MDTypography variant="button" fontWeight="medium">
                      {investment.projectName}
                    </MDTypography>
                  </MDBox>
                  
                  <MDBox textAlign="right">
                    <MDTypography 
                      variant="button" 
                      fontWeight="bold"
                      color={investment.roi >= 0 ? "success" : "error"}
                    >
                      {investment.roi >= 0 ? "+" : ""}{investment.roi.toFixed(1)}%
                    </MDTypography>
                  </MDBox>
                </MDBox>
                
                <MDProgress 
                  value={Math.min(Math.abs(investment.roi), 100)} 
                  color={investment.roi >= 0 ? "success" : "error"}
                  variant="gradient"
                />
              </MDBox>
            ))}
          </MDBox>
        )}

        {/* Métriques détaillées */}
        {config.showExtended && (
          <MDBox mb={3}>
            <MDBox 
              display="flex" 
              justifyContent="space-between" 
              p={2}
              borderRadius={1}
              bgcolor="grey.50"
            >
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Investi total
                </MDTypography>
                <CurrencyDisplay
                  amount={metrics.totalInvested}
                  currency={currency}
                  variant="h6"
                  color="text"
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                />
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Gain/Perte
                </MDTypography>
                <CurrencyDisplay
                  amount={metrics.totalReturn}
                  currency={currency}
                  variant="h6"
                  color={metrics.totalReturn >= 0 ? "success" : "error"}
                  fontWeight="medium"
                  showSymbol={true}
                  animate={false}
                />
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Meilleur projet
                </MDTypography>
                <MDTypography variant="button" fontWeight="medium" display="block">
                  {metrics.bestPerformer ? `+${metrics.bestPerformer.roi.toFixed(1)}%` : "N/A"}
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        )}

        {/* Actions rapides */}
        {showActions && (
          <MDBox display="flex" gap={1}>
            <MDButton
              variant="gradient"
              color="info"
              size="small"
              startIcon={<Icon>add</Icon>}
              sx={{ flex: 1 }}
            >
              Nouveau Projet
            </MDButton>
            <MDButton
              variant="outlined"
              color="info"
              size="small"
              startIcon={<Icon>analytics</Icon>}
              sx={{ flex: 1 }}
            >
              Analyse
            </MDButton>
            <MDButton
              variant="outlined"
              color="info"
              size="small"
              startIcon={<Icon>file_download</Icon>}
              sx={{ flex: 1 }}
            >
              Export
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

// Props par défaut
PortfolioSummaryCard.defaultProps = {
  investments: [],
  currency: "HTG",
  title: "Portfolio d'Investissements",
  showChart: true,
  showTopPerformers: true,
  showTypeBreakdown: true,
  showActions: true,
  size: "large",
  timeframe: "all",
  onClick: null,
};

// Validation des props
PortfolioSummaryCard.propTypes = {
  investments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    projectName: PropTypes.string,
    type: PropTypes.string,
    initialInvestment: PropTypes.number,
    currentValue: PropTypes.number,
    status: PropTypes.string,
  })),
  currency: PropTypes.oneOf(["HTG", "USD"]),
  title: PropTypes.string,
  showChart: PropTypes.bool,
  showTopPerformers: PropTypes.bool,
  showTypeBreakdown: PropTypes.bool,
  showActions: PropTypes.bool,
  size: PropTypes.oneOf(["medium", "large"]),
  timeframe: PropTypes.oneOf(["all", "1month", "3months", "6months", "1year"]),
  onClick: PropTypes.func,
};

export default PortfolioSummaryCard;

// Export des utilitaires
export { calculatePortfolioMetrics };