// src/components/FinApp/ROIChart/index.js
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import { Card, CardContent, CardHeader, Box, Tabs, Tab, Chip, Button, Menu, MenuItem } from '@mui/material';
import { Icon } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import CurrencyDisplay from '../CurrencyDisplay';

// Enregistrer Chart.js plugins
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

// Types d'investissements avec couleurs
const INVESTMENT_TYPES = {
  agriculture: { label: 'Agriculture', color: 'success', bgColor: '#4caf50' },
  commerce: { label: 'Commerce', color: 'info', bgColor: '#2196f3' },
  immobilier: { label: 'Immobilier', color: 'warning', bgColor: '#ff9800' },
  transport: { label: 'Transport', color: 'primary', bgColor: '#9c27b0' },
  crypto: { label: 'Crypto', color: 'error', bgColor: '#f44336' },
  autre: { label: 'Autre', color: 'secondary', bgColor: '#607d8b' }
};

// Périodes d'analyse
const TIME_PERIODS = {
  '3m': { label: '3 mois', months: 3 },
  '6m': { label: '6 mois', months: 6 },
  '1y': { label: '1 an', months: 12 },
  '2y': { label: '2 ans', months: 24 },
  'all': { label: 'Tout', months: null }
};

function ROIChart({
  investments = [],
  currency = "HTG",
  title = "Évolution ROI - Investissements",
  showComparison = true,
  showIndividual = true,
  defaultPeriod = "6m",
  defaultView = "combined",
  height = 400,
  showToolbar = true,
  showLegend = true,
  showGrid = true,
  onInvestmentClick,
  ...other
}) {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [selectedView, setSelectedView] = useState(defaultView); // 'combined', 'individual', 'types'
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Générer données historiques ROI pour chaque investissement
  const generateROIHistory = (investment, months) => {
    const history = [];
    const startDate = new Date(investment.startDate);
    const endDate = new Date();
    
    // Calculer le nombre de mois réels écoulés
    const monthsElapsed = Math.min(
      Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30)),
      months || 24
    );
    
    for (let i = 0; i <= monthsElapsed; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Simuler évolution ROI progressive avec quelques variations
      const baseROI = (investment.performance?.replace(/[+%]/g, '') || 0) * 1;
      const progressRatio = i / Math.max(monthsElapsed, 1);
      const randomVariation = (Math.sin(i * 0.5) * 0.1 + Math.cos(i * 0.3) * 0.05);
      const currentROI = baseROI * progressRatio + randomVariation;
      
      history.push({
        date: date.toISOString().slice(0, 7), // YYYY-MM format
        roi: Math.max(currentROI, i === 0 ? 0 : history[i-1]?.roi - 2), // Éviter les chutes trop brutales
        value: investment.initialInvestment * (1 + currentROI / 100),
        monthIndex: i
      });
    }
    
    return history;
  };

  // Préparer les données selon la période sélectionnée
  const chartData = useMemo(() => {
    if (!investments || investments.length === 0) return null;

    const periodConfig = TIME_PERIODS[selectedPeriod];
    
    // Générer historique pour chaque investissement
    const investmentHistories = investments.map(inv => ({
      ...inv,
      history: generateROIHistory(inv, periodConfig.months)
    }));

    // Créer les labels de mois
    const allDates = new Set();
    investmentHistories.forEach(inv => {
      inv.history.forEach(point => allDates.add(point.date));
    });
    const sortedDates = Array.from(allDates).sort();

    if (selectedView === 'combined') {
      // Vue combinée - ROI moyen pondéré
      const avgROIData = sortedDates.map(date => {
        let totalValue = 0;
        let totalInvestment = 0;
        
        investmentHistories.forEach(inv => {
          const point = inv.history.find(h => h.date === date);
          if (point) {
            totalValue += point.value;
            totalInvestment += inv.initialInvestment;
          }
        });
        
        return totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment) * 100 : 0;
      });

      return {
        labels: sortedDates.map(date => {
          const d = new Date(date + '-01');
          return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        }),
        datasets: [
          {
            label: 'ROI Moyen Portfolio',
            data: avgROIData,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      };
    }

    if (selectedView === 'individual') {
      // Vue individuelle - une ligne par investissement
      const datasets = investmentHistories.slice(0, 6).map((inv, index) => {
        const typeConfig = INVESTMENT_TYPES[inv.type] || INVESTMENT_TYPES.autre;
        const colors = [
          '#667eea', '#4ecdc4', '#ffeaa7', '#fd79a8', '#6c5ce7', '#a8edea'
        ];
        
        const roiData = sortedDates.map(date => {
          const point = inv.history.find(h => h.date === date);
          return point ? point.roi : null;
        });

        return {
          label: inv.name.length > 20 ? inv.name.substring(0, 20) + '...' : inv.name,
          data: roiData,
          borderColor: colors[index % colors.length],
          backgroundColor: `${colors[index % colors.length]}20`,
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: colors[index % colors.length],
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5
        };
      });

      return {
        labels: sortedDates.map(date => {
          const d = new Date(date + '-01');
          return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        }),
        datasets
      };
    }

    if (selectedView === 'types') {
      // Vue par types d'investissement
      const typeROIs = {};
      
      // Grouper par type
      investmentHistories.forEach(inv => {
        const type = inv.type || 'autre';
        if (!typeROIs[type]) {
          typeROIs[type] = {
            investments: [],
            totalInvestment: 0
          };
        }
        typeROIs[type].investments.push(inv);
        typeROIs[type].totalInvestment += inv.initialInvestment;
      });

      // Calculer ROI moyen par type
      const datasets = Object.entries(typeROIs).map(([type, data]) => {
        const typeConfig = INVESTMENT_TYPES[type] || INVESTMENT_TYPES.autre;
        
        const avgROIData = sortedDates.map(date => {
          let totalValue = 0;
          let totalInvestment = 0;
          
          data.investments.forEach(inv => {
            const point = inv.history.find(h => h.date === date);
            if (point) {
              totalValue += point.value;
              totalInvestment += inv.initialInvestment;
            }
          });
          
          return totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment) * 100 : 0;
        });

        return {
          label: typeConfig.label,
          data: avgROIData,
          borderColor: typeConfig.bgColor,
          backgroundColor: `${typeConfig.bgColor}20`,
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: typeConfig.bgColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5
        };
      });

      return {
        labels: sortedDates.map(date => {
          const d = new Date(date + '-01');
          return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        }),
        datasets
      };
    }

    return null;
  }, [investments, selectedPeriod, selectedView]);

  // Configuration du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        display: showGrid,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'Période'
        }
      },
      y: {
        display: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'ROI (%)'
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(0) + '%';
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    onClick: (event, activeElements) => {
      if (activeElements.length > 0 && onInvestmentClick) {
        const clickedDataset = activeElements[0].datasetIndex;
        const clickedIndex = activeElements[0].index;
        onInvestmentClick({
          dataset: chartData.datasets[clickedDataset],
          dataIndex: clickedIndex,
          investments
        });
      }
    }
  };

  // Calculer métriques du portfolio
  const portfolioMetrics = useMemo(() => {
    if (!investments || investments.length === 0) return null;

    const totalInvested = investments.reduce((sum, inv) => sum + inv.initialInvestment, 0);
    const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturn = totalCurrent - totalInvested;
    const avgROI = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    const bestPerformer = investments.reduce((best, current) => {
      const currentROI = parseFloat(current.performance?.replace(/[+%]/g, '') || 0);
      const bestROI = parseFloat(best.performance?.replace(/[+%]/g, '') || 0);
      return currentROI > bestROI ? current : best;
    }, investments[0]);

    return {
      totalInvested,
      totalCurrent,
      totalReturn,
      avgROI,
      bestPerformer,
      activeCount: investments.filter(inv => inv.status === 'active').length
    };
  }, [investments]);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleExport = () => {
    // TODO: Implémenter export des données
    console.log('Export ROI data');
    handleMenuClose();
  };

  if (!chartData || !portfolioMetrics) {
    return (
      <Card {...other}>
        <CardContent>
          <MDBox textAlign="center" py={6}>
            <Icon color="action" style={{ fontSize: 48, marginBottom: 16 }}>
              insert_chart
            </Icon>
            <MDTypography variant="h6" color="text" fontWeight="medium">
              Aucune donnée d'investissement
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Ajoutez des investissements pour voir l'évolution du ROI
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card {...other}>
      <CardHeader
        title={
          <MDBox display="flex" alignItems="center" justifyContent="space-between">
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                {title}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Portfolio de {portfolioMetrics.activeCount} investissement{portfolioMetrics.activeCount > 1 ? 's' : ''} actif{portfolioMetrics.activeCount > 1 ? 's' : ''}
              </MDTypography>
            </MDBox>
            
            {showToolbar && (
              <MDBox display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleMenuOpen}
                  startIcon={<Icon>more_vert</Icon>}
                >
                  Options
                </Button>
              </MDBox>
            )}
          </MDBox>
        }
      />
      
      <CardContent>
        {/* Métriques rapides */}
        <MDBox mb={3}>
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            <Chip
              label={`ROI Moyen: ${portfolioMetrics.avgROI >= 0 ? '+' : ''}${portfolioMetrics.avgROI.toFixed(1)}%`}
              color={portfolioMetrics.avgROI >= 0 ? "success" : "error"}
              variant="filled"
            />
            <Chip
              label={`Meilleur: ${portfolioMetrics.bestPerformer.name.substring(0, 15)}...`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Total investi: ${portfolioMetrics.totalInvested.toLocaleString()} ${currency}`}
              color="info"
              variant="outlined"
            />
          </Box>
        </MDBox>

        {/* Contrôles */}
        <MDBox mb={3}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
            {/* Sélecteur de période */}
            <Box>
              <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                Période
              </MDTypography>
              <Tabs
                value={selectedPeriod}
                onChange={(e, newValue) => setSelectedPeriod(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {Object.entries(TIME_PERIODS).map(([key, period]) => (
                  <Tab
                    key={key}
                    label={period.label}
                    value={key}
                    sx={{ minWidth: 'auto', px: 2 }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Sélecteur de vue */}
            <Box>
              <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                Affichage
              </MDTypography>
              <Tabs
                value={selectedView}
                onChange={(e, newValue) => setSelectedView(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Combiné" value="combined" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="Individuel" value="individual" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="Par Type" value="types" sx={{ minWidth: 'auto', px: 2 }} />
              </Tabs>
            </Box>
          </Box>
        </MDBox>

        {/* Graphique */}
        <MDBox height={height}>
          <Line data={chartData} options={chartOptions} />
        </MDBox>

        {/* Performance actuelle */}
        <MDBox mt={3} pt={2} borderTop="1px solid" borderColor="grey.200">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <MDTypography variant="button" fontWeight="medium" color="text">
                Performance actuelle
              </MDTypography>
              <CurrencyDisplay
                amount={portfolioMetrics.totalReturn}
                currency={currency}
                variant="h6"
                color="auto"
                fontWeight="bold"
                showSymbol={true}
                showTrend={true}
                previousAmount={0}
              />
            </Box>
            
            <Box textAlign="right">
              <MDTypography variant="button" fontWeight="medium" color="text">
                Valeur totale
              </MDTypography>
              <CurrencyDisplay
                amount={portfolioMetrics.totalCurrent}
                currency={currency}
                variant="h6"
                fontWeight="bold"
                showSymbol={true}
              />
            </Box>
          </Box>
        </MDBox>
      </CardContent>

      {/* Menu options */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExport}>
          <Icon sx={{ mr: 1 }}>download</Icon>
          Exporter données
        </MenuItem>
        <MenuItem onClick={() => { console.log('Analyser tendances'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>analytics</Icon>
          Analyser tendances
        </MenuItem>
        <MenuItem onClick={() => { console.log('Comparer avec marché'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>compare_arrows</Icon>
          Comparer avec marché
        </MenuItem>
      </Menu>
    </Card>
  );
}

ROIChart.propTypes = {
  investments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    initialInvestment: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    performance: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    status: PropTypes.string
  })),
  currency: PropTypes.string,
  title: PropTypes.string,
  showComparison: PropTypes.bool,
  showIndividual: PropTypes.bool,
  defaultPeriod: PropTypes.oneOf(['3m', '6m', '1y', '2y', 'all']),
  defaultView: PropTypes.oneOf(['combined', 'individual', 'types']),
  height: PropTypes.number,
  showToolbar: PropTypes.bool,
  showLegend: PropTypes.bool,
  showGrid: PropTypes.bool,
  onInvestmentClick: PropTypes.func
};

export default ROIChart;