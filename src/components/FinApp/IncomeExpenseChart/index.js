/**
=========================================================
* FinApp Haiti - IncomeExpenseChart Component
=========================================================

* Graphique en ligne (Line Chart) pour visualiser
* l'évolution temporelle des revenus vs dépenses
* Utilise Chart.js + react-chartjs-2 + Material Dashboard 2 React
=========================================================
*/

import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// @mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Périodes disponibles
const TIME_PERIODS = {
  '7d': { label: '7 jours', days: 7 },
  '30d': { label: '30 jours', days: 30 },
  '3m': { label: '3 mois', days: 90 },
  '6m': { label: '6 mois', days: 180 },
  '1y': { label: '1 an', days: 365 }
};

// Types de vue
const VIEW_MODES = {
  daily: { label: 'Journalier', groupBy: 'day' },
  weekly: { label: 'Hebdomadaire', groupBy: 'week' },
  monthly: { label: 'Mensuel', groupBy: 'month' }
};

function IncomeExpenseChart({
  transactions = [],
  currency = "HTG",
  period = "30d",
  viewMode = "daily",
  title = "Évolution Revenus vs Dépenses",
  showNet = true,
  showTrend = true,
  showComparison = true,
  size = "large",
  onPeriodClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedViewMode, setSelectedViewMode] = useState(viewMode);

  // Calculer les données pour le graphique
  const chartData = useMemo(() => {
    if (transactions.length === 0) return null;

    // Déterminer la période d'analyse
    const periodConfig = TIME_PERIODS[selectedPeriod];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - periodConfig.days);

    // Filtrer les transactions dans la période
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Grouper les données selon le mode de vue
    const groupedData = {};
    
    // Générer toutes les dates de la période
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      let key;
      let label;
      
      if (selectedViewMode === 'daily') {
        key = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        label = currentDate.toLocaleDateString('fr-HT', { day: '2-digit', month: 'short' });
      } else if (selectedViewMode === 'weekly') {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        key = weekStart.toISOString().split('T')[0];
        label = `Sem. ${getWeekNumber(currentDate)}`;
      } else { // monthly
        key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        label = currentDate.toLocaleDateString('fr-HT', { month: 'short', year: 'numeric' });
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          label: label,
          income: 0,
          expenses: 0,
          net: 0,
          incomeCount: 0,
          expensesCount: 0
        };
      }

      // Incrémenter selon le mode
      if (selectedViewMode === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (selectedViewMode === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Ajouter les transactions aux groupes correspondants
    filteredTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      let key;

      if (selectedViewMode === 'daily') {
        key = transaction.date;
      } else if (selectedViewMode === 'weekly') {
        const weekStart = new Date(transactionDate);
        weekStart.setDate(transactionDate.getDate() - transactionDate.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      }

      if (groupedData[key]) {
        // Convertir en HTG pour uniformité
        const amountInHTG = transaction.currency === 'USD' 
          ? transaction.amount * 113 
          : transaction.amount;

        if (transaction.type === 'income') {
          groupedData[key].income += amountInHTG;
          groupedData[key].incomeCount += 1;
        } else {
          groupedData[key].expenses += amountInHTG;
          groupedData[key].expensesCount += 1;
        }
      }
    });

    // Calculer le net et convertir en array
    const sortedData = Object.values(groupedData)
      .map(item => ({
        ...item,
        net: item.income - item.expenses
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Préparer les données pour Chart.js
    const datasets = [];

    // Dataset revenus
    datasets.push({
      label: 'Revenus',
      data: sortedData.map(item => item.income),
      borderColor: colors.success.main,
      backgroundColor: colors.success.main + '20',
      pointBackgroundColor: colors.success.main,
      pointBorderColor: colors.success.main,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 3,
      tension: 0.1,
      fill: false
    });

    // Dataset dépenses
    datasets.push({
      label: 'Dépenses',
      data: sortedData.map(item => item.expenses),
      borderColor: colors.error.main,
      backgroundColor: colors.error.main + '20',
      pointBackgroundColor: colors.error.main,
      pointBorderColor: colors.error.main,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 3,
      tension: 0.1,
      fill: false
    });

    // Dataset net si activé
    if (showNet) {
      datasets.push({
        label: 'Net',
        data: sortedData.map(item => item.net),
        borderColor: colors.info.main,
        backgroundColor: colors.info.main + '20',
        pointBackgroundColor: colors.info.main,
        pointBorderColor: colors.info.main,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      });
    }

    return {
      labels: sortedData.map(item => item.label),
      datasets: datasets,
      rawData: sortedData
    };
  }, [transactions, selectedPeriod, selectedViewMode, showNet]);

  // Calculer les statistiques
  const statistics = useMemo(() => {
    if (!chartData) return null;

    const data = chartData.rawData;
    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const totalNet = totalIncome - totalExpenses;
    
    const avgIncome = totalIncome / data.length;
    const avgExpenses = totalExpenses / data.length;
    
    // Tendances (comparer première et dernière période)
    const firstPeriod = data[0];
    const lastPeriod = data[data.length - 1];
    
    const incomeTrend = firstPeriod && firstPeriod.income > 0 
      ? ((lastPeriod.income - firstPeriod.income) / firstPeriod.income) * 100 
      : 0;
    const expensesTrend = firstPeriod && firstPeriod.expenses > 0 
      ? ((lastPeriod.expenses - firstPeriod.expenses) / firstPeriod.expenses) * 100 
      : 0;

    return {
      totalIncome,
      totalExpenses,
      totalNet,
      avgIncome,
      avgExpenses,
      incomeTrend,
      expensesTrend,
      savingsRate: totalIncome > 0 ? (totalNet / totalIncome) * 100 : 0
    };
  }, [chartData]);

  // Fonctions utilitaires
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-HT').format(amount) + ' HTG';
  };

  // Handlers
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod) {
      setSelectedPeriod(newPeriod);
    }
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
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            return chartData.rawData[context[0].dataIndex].label;
          },
          label: function(context) {
            const dataPoint = chartData.rawData[context.dataIndex];
            const value = context.parsed.y;
            const formattedValue = new Intl.NumberFormat('fr-HT').format(value);
            
            let extraInfo = '';
            if (context.dataset.label === 'Revenus') {
              extraInfo = ` (${dataPoint.incomeCount} transaction${dataPoint.incomeCount > 1 ? 's' : ''})`;
            } else if (context.dataset.label === 'Dépenses') {
              extraInfo = ` (${dataPoint.expensesCount} transaction${dataPoint.expensesCount > 1 ? 's' : ''})`;
            }
            
            return `${context.dataset.label}: ${formattedValue} HTG${extraInfo}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return `${(value / 1000).toFixed(0)}k`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
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
            <TimelineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <MDTypography variant="h6" color="text" gutterBottom>
              Aucune donnée trouvée
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Ajoutez des transactions pour voir l'évolution
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ p: config.padding }} {...other}>
      {/* Header avec contrôles */}
      <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium" gutterBottom>
            {title}
          </MDTypography>
          {statistics && (
            <MDBox display="flex" gap={2} flexWrap="wrap">
              <Chip 
                icon={<TrendingUpIcon />}
                label={`Revenus: ${formatCurrency(statistics.totalIncome)}`}
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip 
                icon={<TrendingDownIcon />}
                label={`Dépenses: ${formatCurrency(statistics.totalExpenses)}`}
                color="error"
                variant="outlined"
                size="small"
              />
              {showNet && (
                <Chip 
                  label={`Net: ${formatCurrency(statistics.totalNet)}`}
                  color={statistics.totalNet >= 0 ? "success" : "error"}
                  size="small"
                />
              )}
            </MDBox>
          )}
        </MDBox>
        
        <MDBox display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </MDBox>
      </MDBox>

      {/* Contrôles de période et vue */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <ToggleButtonGroup
          value={selectedPeriod}
          exclusive
          onChange={handlePeriodChange}
          size="small"
        >
          {Object.entries(TIME_PERIODS).map(([key, config]) => (
            <ToggleButton key={key} value={key}>
              {config.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        
        <ToggleButtonGroup
          value={selectedViewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="daily">
            <DateRangeIcon sx={{ mr: 0.5 }} />
            Jour
          </ToggleButton>
          <ToggleButton value="weekly">
            <CalendarViewMonthIcon sx={{ mr: 0.5 }} />
            Semaine
          </ToggleButton>
          <ToggleButton value="monthly">
            <TimelineIcon sx={{ mr: 0.5 }} />
            Mois
          </ToggleButton>
        </ToggleButtonGroup>
      </MDBox>

      {/* Graphique */}
      <MDBox height={config.height}>
        <Line data={chartData} options={chartOptions} />
      </MDBox>

      {/* Statistiques en bas */}
      {statistics && showComparison && size !== "small" && (
        <MDBox mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <MDBox textAlign="center" p={1} borderRadius={1} bgcolor="success.light" color="white">
                <MDTypography variant="caption" fontWeight="bold">Taux d'épargne</MDTypography>
                <MDTypography variant="h6" fontWeight="bold">
                  {statistics.savingsRate.toFixed(1)}%
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <MDBox textAlign="center" p={1} borderRadius={1} bgcolor="info.light" color="white">
                <MDTypography variant="caption" fontWeight="bold">Revenus moy.</MDTypography>
                <MDTypography variant="h6" fontWeight="bold">
                  {(statistics.avgIncome / 1000).toFixed(0)}k HTG
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <MDBox textAlign="center" p={1} borderRadius={1} bgcolor="warning.light" color="white">
                <MDTypography variant="caption" fontWeight="bold">Dépenses moy.</MDTypography>
                <MDTypography variant="h6" fontWeight="bold">
                  {(statistics.avgExpenses / 1000).toFixed(0)}k HTG
                </MDTypography>
              </MDBox>
            </Grid>
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
          Exporter données
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Personnaliser vue
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Comparer périodes
        </MenuItem>
      </Menu>
    </Card>
  );
}

IncomeExpenseChart.propTypes = {
  transactions: PropTypes.array,
  currency: PropTypes.oneOf(['HTG', 'USD']),
  period: PropTypes.oneOf(['7d', '30d', '3m', '6m', '1y']),
  viewMode: PropTypes.oneOf(['daily', 'weekly', 'monthly']),
  title: PropTypes.string,
  showNet: PropTypes.bool,
  showTrend: PropTypes.bool,
  showComparison: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onPeriodClick: PropTypes.func,
};

export default IncomeExpenseChart;