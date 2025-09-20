/**
=========================================================
* FinApp Haiti - BudgetProgressChart Component
=========================================================

* Graphique en barres horizontales pour visualiser
* la progression des budgets par catégorie
* Utilise Chart.js + react-chartjs-2 + Material Dashboard 2 React
=========================================================
*/

import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LinearProgress from "@mui/material/LinearProgress";

// @mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Configuration des catégories budgets haïtiennes
const BUDGET_CATEGORIES = {
  alimentation: {
    label: "Alimentation",
    icon: RestaurantIcon,
    color: colors.success.main,
    description: "Courses, restaurants, snacks"
  },
  transport: {
    label: "Transport", 
    icon: DirectionsCarIcon,
    color: colors.info.main,
    description: "Tap-tap, essence, voiture"
  },
  logement: {
    label: "Logement",
    icon: HomeIcon,
    color: colors.primary.main,
    description: "Loyer, charges, entretien"
  },
  sante: {
    label: "Santé",
    icon: LocalHospitalIcon,
    color: colors.error.main,
    description: "Médecin, médicaments, assurance"
  },
  education: {
    label: "Éducation",
    icon: SchoolIcon,
    color: colors.secondary.main,
    description: "École, formations, livres"
  },
  loisirs: {
    label: "Loisirs",
    icon: SportsEsportsIcon,
    color: colors.warning.main,
    description: "Sorties, sports, divertissement"
  }
};

function BudgetProgressChart({
  budgets = [],
  currency = "HTG",
  period = "monthly",
  title = "Progression des Budgets",
  showPredictions = true,
  showComparison = true,
  showAlerts = true,
  size = "large",
  viewMode = "progress", // "progress", "amounts", "remaining"
  onBudgetClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedViewMode, setSelectedViewMode] = useState(viewMode);
  const [sortBy, setSortBy] = useState("percentage"); // "percentage", "amount", "remaining", "name"

  // Calculer les données pour le graphique
  const chartData = useMemo(() => {
    if (budgets.length === 0) return null;

    // Traiter et enrichir les données budgets
    const processedBudgets = budgets.map(budget => {
      const categoryConfig = BUDGET_CATEGORIES[budget.category] || BUDGET_CATEGORIES.alimentation;
      const percentage = (budget.spent / budget.budget) * 100;
      const remaining = budget.budget - budget.spent;
      const isOverBudget = budget.spent > budget.budget;
      
      // Calculs de prédiction
      const daysElapsed = budget.totalDays ? budget.totalDays - budget.daysRemaining : 15;
      const dailyAverage = daysElapsed > 0 ? budget.spent / daysElapsed : 0;
      const projectedTotal = dailyAverage * (budget.totalDays || 30);
      const willExceed = projectedTotal > budget.budget;

      // Statut budget
      let status, statusColor;
      if (isOverBudget) {
        status = "Dépassé";
        statusColor = colors.error.main;
      } else if (percentage > 90) {
        status = "Critique";
        statusColor = colors.warning.main;
      } else if (percentage > 75) {
        status = "Attention";
        statusColor = colors.warning.main;
      } else if (percentage > 50) {
        status = "En cours";
        statusColor = colors.info.main;
      } else {
        status = "Bon";
        statusColor = colors.success.main;
      }

      return {
        ...budget,
        categoryConfig,
        percentage: Math.min(percentage, 100), // Cap à 100% pour l'affichage
        actualPercentage: percentage, // Pourcentage réel (peut dépasser 100%)
        remaining,
        isOverBudget,
        projectedTotal,
        willExceed,
        status,
        statusColor,
        formattedSpent: new Intl.NumberFormat('fr-HT').format(budget.spent),
        formattedBudget: new Intl.NumberFormat('fr-HT').format(budget.budget),
        formattedRemaining: new Intl.NumberFormat('fr-HT').format(Math.abs(remaining))
      };
    });

    // Trier selon le critère sélectionné
    const sortedBudgets = [...processedBudgets].sort((a, b) => {
      switch (sortBy) {
        case "percentage":
          return b.actualPercentage - a.actualPercentage;
        case "amount":
          return b.spent - a.spent;
        case "remaining":
          return a.remaining - b.remaining;
        case "name":
          return a.budgetName.localeCompare(b.budgetName);
        default:
          return b.actualPercentage - a.actualPercentage;
      }
    });

    // Préparer les données pour Chart.js selon le mode de vue
    let chartLabels, chartValues, backgroundColors, borderColors;

    switch (selectedViewMode) {
      case "amounts":
        chartLabels = sortedBudgets.map(b => b.budgetName);
        chartValues = sortedBudgets.map(b => b.spent);
        backgroundColors = sortedBudgets.map(b => b.categoryConfig.color + '80');
        borderColors = sortedBudgets.map(b => b.categoryConfig.color);
        break;
      
      case "remaining":
        chartLabels = sortedBudgets.map(b => b.budgetName);
        chartValues = sortedBudgets.map(b => Math.max(b.remaining, 0));
        backgroundColors = sortedBudgets.map(b => 
          b.remaining > 0 ? colors.success.main + '80' : colors.error.main + '80'
        );
        borderColors = sortedBudgets.map(b => 
          b.remaining > 0 ? colors.success.main : colors.error.main
        );
        break;
      
      default: // "progress"
        chartLabels = sortedBudgets.map(b => b.budgetName);
        chartValues = sortedBudgets.map(b => b.percentage);
        backgroundColors = sortedBudgets.map(b => {
          if (b.isOverBudget) return colors.error.main + '80';
          if (b.percentage > 90) return colors.warning.main + '80';
          if (b.percentage > 75) return colors.warning.main + '60';
          if (b.percentage > 50) return colors.info.main + '80';
          return colors.success.main + '80';
        });
        borderColors = sortedBudgets.map(b => {
          if (b.isOverBudget) return colors.error.main;
          if (b.percentage > 90) return colors.warning.main;
          if (b.percentage > 75) return colors.warning.main;
          if (b.percentage > 50) return colors.info.main;
          return colors.success.main;
        });
        break;
    }

    return {
      labels: chartLabels,
      datasets: [
        {
          label: selectedViewMode === "progress" ? "Progression %" 
                : selectedViewMode === "amounts" ? `Dépensé (${currency})`
                : `Restant (${currency})`,
          data: chartValues,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 4,
          maxBarThickness: 40,
        }
      ],
      budgetDetails: sortedBudgets
    };
  }, [budgets, selectedViewMode, sortBy, currency]);

  // Statistiques globales
  const statistics = useMemo(() => {
    if (!chartData) return null;

    const details = chartData.budgetDetails;
    const totalBudget = details.reduce((sum, b) => sum + b.budget, 0);
    const totalSpent = details.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    
    const overBudgetCount = details.filter(b => b.isOverBudget).length;
    const warningCount = details.filter(b => b.percentage > 75 && !b.isOverBudget).length;
    const goodCount = details.filter(b => b.percentage <= 75).length;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      overallPercentage: (totalSpent / totalBudget) * 100,
      overBudgetCount,
      warningCount,
      goodCount,
      averagePercentage: details.reduce((sum, b) => sum + b.actualPercentage, 0) / details.length
    };
  }, [chartData]);

  // Handlers
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode) {
      setSelectedViewMode(newViewMode);
    }
  };

  // Configuration Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Barres horizontales
    plugins: {
      legend: {
        display: false // Masqué car les couleurs sont explicites
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            return chartData.budgetDetails[context[0].dataIndex].budgetName;
          },
          label: function(context) {
            const budget = chartData.budgetDetails[context.dataIndex];
            const lines = [
              `${budget.categoryConfig.label}`,
              `Dépensé: ${budget.formattedSpent} ${currency}`,
              `Budget: ${budget.formattedBudget} ${currency}`,
              `Progression: ${budget.actualPercentage.toFixed(1)}%`
            ];

            if (budget.remaining > 0) {
              lines.push(`Restant: ${budget.formattedRemaining} ${currency}`);
            } else {
              lines.push(`Dépassement: ${budget.formattedRemaining} ${currency}`);
            }

            if (showPredictions && budget.projectedTotal) {
              const projectedFormatted = new Intl.NumberFormat('fr-HT').format(budget.projectedTotal);
              lines.push(`Projection: ${projectedFormatted} ${currency}`);
              if (budget.willExceed && !budget.isOverBudget) {
                lines.push("⚠️ Risque de dépassement");
              }
            }

            return lines;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            if (selectedViewMode === "progress") {
              return value + '%';
            } else {
              return (value / 1000).toFixed(0) + 'k';
            }
          }
        },
        max: selectedViewMode === "progress" ? 100 : undefined
      },
      y: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onBudgetClick && chartData) {
        const index = elements[0].index;
        const budgetData = chartData.budgetDetails[index];
        onBudgetClick(budgetData, index);
      }
    }
  };

  // Configuration de taille
  const sizeConfig = {
    small: { height: 250, padding: 2 },
    medium: { height: 350, padding: 3 },
    large: { height: 450, padding: 3 }
  };

  const config = sizeConfig[size] || sizeConfig.large;

  if (!chartData) {
    return (
      <Card sx={{ p: config.padding }} {...other}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            {title}
          </MDTypography>
        </MDBox>
        <MDBox 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={config.height}
        >
          <MDBox textAlign="center">
            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <MDTypography variant="h6" color="text" gutterBottom>
              Aucun budget trouvé
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Créez des budgets pour voir leur progression
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ p: config.padding }} {...other}>
      {/* Header avec statistiques */}
      <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium" gutterBottom>
            {title}
          </MDTypography>
          {statistics && (
            <MDBox display="flex" gap={1} flexWrap="wrap">
              <Chip 
                icon={<CheckCircleIcon />}
                label={`${statistics.goodCount} budgets OK`}
                color="success"
                size="small"
                variant="outlined"
              />
              {statistics.warningCount > 0 && (
                <Chip 
                  icon={<WarningIcon />}
                  label={`${statistics.warningCount} attention`}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              )}
              {statistics.overBudgetCount > 0 && (
                <Chip 
                  icon={<ErrorIcon />}
                  label={`${statistics.overBudgetCount} dépassés`}
                  color="error"
                  size="small"
                />
              )}
            </MDBox>
          )}
        </MDBox>
        
        <MDBox display="flex" alignItems="center" gap={1}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Tri</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Tri"
            >
              <MenuItem value="percentage">Progression</MenuItem>
              <MenuItem value="amount">Montant</MenuItem>
              <MenuItem value="remaining">Restant</MenuItem>
              <MenuItem value="name">Nom</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </MDBox>
      </MDBox>

      {/* Contrôles de vue */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <ToggleButtonGroup
          value={selectedViewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="progress">
            Progression %
          </ToggleButton>
          <ToggleButton value="amounts">
            Montants
          </ToggleButton>
          <ToggleButton value="remaining">
            Restants
          </ToggleButton>
        </ToggleButtonGroup>

        {statistics && (
          <MDBox display="flex" alignItems="center" gap={2}>
            <MDTypography variant="caption" color="text">
              Total: {new Intl.NumberFormat('fr-HT').format(statistics.totalSpent)} / {new Intl.NumberFormat('fr-HT').format(statistics.totalBudget)} {currency}
            </MDTypography>
            <MDTypography variant="caption" color={statistics.overallPercentage > 100 ? "error" : "success"} fontWeight="bold">
              {statistics.overallPercentage.toFixed(1)}%
            </MDTypography>
          </MDBox>
        )}
      </MDBox>

      {/* Graphique */}
      <MDBox height={config.height}>
        <Bar data={chartData} options={chartOptions} />
      </MDBox>

      {/* Alertes et prédictions */}
      {showAlerts && size !== "small" && chartData && (
        <MDBox mt={3}>
          <Grid container spacing={1}>
            {chartData.budgetDetails
              .filter(budget => budget.isOverBudget || (budget.willExceed && showPredictions))
              .slice(0, 3)
              .map((budget, index) => (
                <Grid item xs={12} key={index}>
                  <MDBox 
                    p={1.5} 
                    borderRadius={1} 
                    bgcolor={budget.isOverBudget ? "error.light" : "warning.light"}
                    color="white"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {budget.isOverBudget ? <ErrorIcon /> : <WarningIcon />}
                    <MDBox flex={1}>
                      <MDTypography variant="caption" fontWeight="bold" color="white">
                        {budget.budgetName}: {budget.isOverBudget ? "Budget dépassé" : "Risque de dépassement"}
                      </MDTypography>
                      <MDTypography variant="caption" color="white" display="block">
                        {budget.isOverBudget 
                          ? `Dépassement de ${budget.formattedRemaining} ${currency}`
                          : `Projection: ${new Intl.NumberFormat('fr-HT').format(budget.projectedTotal)} ${currency}`
                        }
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Grid>
              ))
            }
          </Grid>
        </MDBox>
      )}

      {/* Menu actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          Exporter progression
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Ajuster budgets
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Analyser tendances
        </MenuItem>
      </Menu>
    </Card>
  );
}

BudgetProgressChart.propTypes = {
  budgets: PropTypes.array,
  currency: PropTypes.oneOf(['HTG', 'USD']),
  period: PropTypes.string,
  title: PropTypes.string,
  showPredictions: PropTypes.bool,
  showComparison: PropTypes.bool,
  showAlerts: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  viewMode: PropTypes.oneOf(['progress', 'amounts', 'remaining']),
  onBudgetClick: PropTypes.func,
};

export default BudgetProgressChart;