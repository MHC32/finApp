/**
=========================================================
* FinApp Haiti - ExpenseChart Component
=========================================================

* Graphique en secteurs (Doughnut Chart) pour visualiser
* la répartition des dépenses par catégorie
* Utilise Chart.js + react-chartjs-2 + Material Dashboard 2 React
=========================================================
*/

import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
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

// @mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhoneIcon from "@mui/icons-material/Phone";
import FaceIcon from "@mui/icons-material/Face";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Configuration des catégories haïtiennes
const EXPENSE_CATEGORIES = {
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
    description: "Tap-tap, essence, réparations"
  },
  sante: {
    label: "Santé",
    icon: LocalHospitalIcon,
    color: colors.error.main,
    description: "Médecin, médicaments, hôpital"
  },
  utilities: {
    label: "Services",
    icon: HomeIcon,
    color: colors.warning.main,
    description: "EDH, DINEPA, internet"
  },
  education: {
    label: "Éducation",
    icon: SchoolIcon,
    color: colors.secondary.main,
    description: "École, université, formations"
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingCartIcon,
    color: colors.primary.main,
    description: "Vêtements, électronique"
  },
  abonnements: {
    label: "Abonnements",
    icon: PhoneIcon,
    color: colors.dark.main,
    description: "Téléphone, internet, streaming"
  },
  autre: {
    label: "Autre",
    icon: FaceIcon,
    color: "#795548",
    description: "Autres dépenses"
  }
};

// Couleurs prédéfinies pour le graphique
const CHART_COLORS = [
  colors.success.main,
  colors.info.main,
  colors.error.main,
  colors.warning.main,
  colors.secondary.main,
  colors.primary.main,
  colors.dark.main,
  "#795548",
  "#00bcd4",
  "#ffc107"
];

function ExpenseChart({
  transactions = [],
  currency = "HTG",
  period = "month",
  title = "Répartition des Dépenses",
  showLegend = true,
  showTooltip = true,
  showPercentages = true,
  showAmounts = true,
  size = "medium",
  onCategoryClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [viewMode, setViewMode] = useState("amount"); // "amount" ou "count"

  // Calculer les données pour le graphique
  const chartData = useMemo(() => {
    // Filtrer seulement les dépenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
      return null;
    }

    // Grouper par catégorie
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const category = transaction.category || 'autre';
      const categoryConfig = EXPENSE_CATEGORIES[category] || EXPENSE_CATEGORIES.autre;
      
      // Convertir en HTG pour uniformité
      const amountInHTG = transaction.currency === 'USD' 
        ? transaction.amount * 113 
        : transaction.amount;

      if (!acc[category]) {
        acc[category] = {
          category,
          label: categoryConfig.label,
          icon: categoryConfig.icon,
          color: categoryConfig.color,
          description: categoryConfig.description,
          total: 0,
          count: 0,
          transactions: []
        };
      }

      acc[category].total += amountInHTG;
      acc[category].count += 1;
      acc[category].transactions.push(transaction);

      return acc;
    }, {});

    // Convertir en array et calculer les pourcentages
    const categories = Object.values(categoryTotals);
    const grandTotal = categories.reduce((sum, cat) => sum + cat.total, 0);
    const totalTransactions = categories.reduce((sum, cat) => sum + cat.count, 0);

    const sortedCategories = categories
      .map((cat, index) => ({
        ...cat,
        value: viewMode === "amount" ? cat.total : cat.count,
        percentage: viewMode === "amount" 
          ? (cat.total / grandTotal) * 100 
          : (cat.count / totalTransactions) * 100,
        color: cat.color || CHART_COLORS[index % CHART_COLORS.length],
        formattedAmount: new Intl.NumberFormat('fr-HT').format(cat.total),
        formattedValue: viewMode === "amount" 
          ? new Intl.NumberFormat('fr-HT').format(cat.total) + " HTG"
          : `${cat.count} transaction${cat.count > 1 ? 's' : ''}`
      }))
      .sort((a, b) => b.value - a.value); // Trier par valeur décroissante

    // Préparer les données pour Chart.js
    return {
      labels: sortedCategories.map(cat => cat.label),
      datasets: [
        {
          data: sortedCategories.map(cat => cat.value),
          backgroundColor: sortedCategories.map(cat => cat.color),
          borderColor: sortedCategories.map(cat => cat.color),
          borderWidth: 2,
          hoverBackgroundColor: sortedCategories.map(cat => cat.color + "CC"),
          hoverBorderWidth: 3,
        }
      ],
      categoryDetails: sortedCategories
    };
  }, [transactions, viewMode]);

  const totalAmount = useMemo(() => {
    if (!chartData) return 0;
    return chartData.categoryDetails.reduce((sum, item) => sum + item.total, 0);
  }, [chartData]);

  const totalTransactions = useMemo(() => {
    if (!chartData) return 0;
    return chartData.categoryDetails.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  // Handlers
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Configuration Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend && size !== "small",
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: showTooltip,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            if (!chartData) return '';
            const categoryDetail = chartData.categoryDetails[context.dataIndex];
            const percentage = categoryDetail.percentage.toFixed(1);
            return [
              `${categoryDetail.label}: ${categoryDetail.formattedValue}`,
              `${percentage}% du total`,
              `${categoryDetail.count} transaction${categoryDetail.count > 1 ? 's' : ''}`
            ];
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onCategoryClick && chartData) {
        const index = elements[0].index;
        const categoryData = chartData.categoryDetails[index];
        onCategoryClick(categoryData, index);
      }
    },
    cutout: size === "large" ? "50%" : "40%", // Doughnut hole size
  };

  // Configuration de taille
  const sizeConfig = {
    small: { height: 200, padding: 2 },
    medium: { height: 300, padding: 3 },
    large: { height: 400, padding: 3 }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

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
            <MDTypography variant="h6" color="text" gutterBottom>
              Aucune dépense trouvée
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Ajoutez des transactions pour voir la répartition
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ p: config.padding }} {...other}>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium">
            {title}
          </MDTypography>
          <MDBox display="flex" alignItems="center" gap={2} mt={1}>
            <MDTypography variant="body2" color="text">
              Total: {new Intl.NumberFormat('fr-HT').format(totalAmount)} HTG
            </MDTypography>
            <Chip 
              label={`${totalTransactions} transaction${totalTransactions > 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
            />
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center" gap={1}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Vue</InputLabel>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              label="Vue"
            >
              <MenuItem value="amount">Montants</MenuItem>
              <MenuItem value="count">Nombre</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </MDBox>
      </MDBox>

      {/* Graphique */}
      <MDBox height={config.height} position="relative">
        <Doughnut data={chartData} options={chartOptions} />
        
        {/* Centre du doughnut avec total */}
        {size === "large" && (
          <MDBox
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none"
            }}
          >
            <MDTypography variant="h4" fontWeight="bold" color="dark">
              {(totalAmount / 1000).toFixed(0)}k
            </MDTypography>
            <MDTypography variant="caption" color="text">
              HTG total
            </MDTypography>
          </MDBox>
        )}
      </MDBox>

      {/* Légende personnalisée pour petite taille */}
      {size === "small" && showLegend && (
        <MDBox mt={2}>
          <MDBox display="flex" flexWrap="wrap" gap={1}>
            {chartData.categoryDetails.slice(0, 4).map((item, index) => (
              <Chip
                key={index}
                label={`${item.label} (${item.percentage.toFixed(1)}%)`}
                size="small"
                sx={{
                  backgroundColor: item.color,
                  color: "white",
                  "& .MuiChip-label": {
                    fontSize: "0.75rem"
                  }
                }}
              />
            ))}
            {chartData.categoryDetails.length > 4 && (
              <Chip
                label={`+${chartData.categoryDetails.length - 4} autres`}
                size="small"
                variant="outlined"
              />
            )}
          </MDBox>
        </MDBox>
      )}

      {/* Détails par catégorie */}
      {size === "large" && (
        <MDBox mt={3}>
          <Grid container spacing={1}>
            {chartData.categoryDetails.slice(0, 6).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MDBox 
                    display="flex" 
                    alignItems="center" 
                    gap={1}
                    p={1}
                    borderRadius={1}
                    sx={{ 
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover"
                      }
                    }}
                    onClick={() => onCategoryClick && onCategoryClick(item, index)}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: "50%"
                      }}
                    />
                    <IconComponent sx={{ fontSize: 16, color: item.color }} />
                    <MDBox flex={1}>
                      <MDTypography variant="caption" fontWeight="medium">
                        {item.label}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" display="block">
                        {item.formattedValue}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Grid>
              );
            })}
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
          Exporter graphique
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Personnaliser couleurs
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Filtrer par période
        </MenuItem>
      </Menu>
    </Card>
  );
}

ExpenseChart.propTypes = {
  transactions: PropTypes.array,
  currency: PropTypes.oneOf(['HTG', 'USD']),
  period: PropTypes.string,
  title: PropTypes.string,
  showLegend: PropTypes.bool,
  showTooltip: PropTypes.bool,
  showPercentages: PropTypes.bool,
  showAmounts: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onCategoryClick: PropTypes.func,
};

export default ExpenseChart;