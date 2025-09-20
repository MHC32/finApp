// src/components/FinApp/PortfolioAllocationChart/index.js
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Tabs, 
  Tab, 
  Grid, 
  Chip, 
  Button, 
  Menu, 
  MenuItem,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { Icon } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import CurrencyDisplay from '../CurrencyDisplay';

// Enregistrer Chart.js plugins
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title, 
  Tooltip, 
  Legend
);

// Types d'investissements avec couleurs et icônes
const INVESTMENT_TYPES = {
  agriculture: { 
    label: 'Agriculture/Élevage', 
    icon: 'agriculture',
    color: '#4caf50',
    description: 'Projets agricoles et élevage' 
  },
  commerce: { 
    label: 'Commerce/Business', 
    icon: 'store',
    color: '#2196f3',
    description: 'Commerces et business locaux' 
  },
  immobilier: { 
    label: 'Immobilier', 
    icon: 'home',
    color: '#ff9800',
    description: 'Propriétés et locations' 
  },
  transport: { 
    label: 'Transport', 
    icon: 'directions_car',
    color: '#9c27b0',
    description: 'Véhicules et services transport' 
  },
  crypto: { 
    label: 'Crypto/Digital', 
    icon: 'currency_bitcoin',
    color: '#f44336',
    description: 'Cryptomonnaies et actifs digitaux' 
  },
  finance: { 
    label: 'Services Financiers', 
    icon: 'account_balance',
    color: '#607d8b',
    description: 'Prêts et services financiers' 
  },
  autre: { 
    label: 'Autres', 
    icon: 'category',
    color: '#9e9e9e',
    description: 'Autres types d\'investissements' 
  }
};

// Options de vue
const VIEW_MODES = {
  'by-type': { label: 'Par Type', description: 'Répartition par secteur d\'activité' },
  'by-performance': { label: 'Par Performance', description: 'Classement par rendement' },
  'by-risk': { label: 'Par Risque', description: 'Répartition par niveau de risque' },
  'by-status': { label: 'Par Statut', description: 'Répartition par statut actuel' }
};

// Niveaux de risque
const RISK_LEVELS = {
  low: { label: 'Faible', color: '#4caf50', description: 'Risque faible, rendement stable' },
  medium: { label: 'Moyen', color: '#ff9800', description: 'Équilibre risque/rendement' },
  high: { label: 'Élevé', color: '#f44336', description: 'Risque élevé, potentiel élevé' }
};

// Statuts d'investissement
const INVESTMENT_STATUS = {
  active: { label: 'Actif', color: '#4caf50' },
  planning: { label: 'En préparation', color: '#ff9800' },
  completed: { label: 'Terminé', color: '#2196f3' },
  paused: { label: 'En pause', color: '#9e9e9e' }
};

function PortfolioAllocationChart({
  investments = [],
  currency = "HTG",
  title = "Répartition du Portfolio",
  defaultView = "by-type",
  chartType = "doughnut", // 'doughnut', 'bar'
  showLegend = true,
  showDetails = true,
  showMetrics = true,
  height = 400,
  onSectionClick,
  ...other
}) {
  const [selectedView, setSelectedView] = useState(defaultView);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Calculer les données selon la vue sélectionnée
  const chartData = useMemo(() => {
    if (!investments || investments.length === 0) return null;

    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    let groupedData = {};
    let colorMap = {};

    switch (selectedView) {
      case 'by-type':
        investments.forEach(inv => {
          const type = inv.type || 'autre';
          const typeConfig = INVESTMENT_TYPES[type] || INVESTMENT_TYPES.autre;
          
          if (!groupedData[type]) {
            groupedData[type] = {
              label: typeConfig.label,
              value: 0,
              count: 0,
              investments: [],
              icon: typeConfig.icon,
              description: typeConfig.description
            };
            colorMap[type] = typeConfig.color;
          }
          
          groupedData[type].value += inv.currentValue;
          groupedData[type].count += 1;
          groupedData[type].investments.push(inv);
        });
        break;

      case 'by-performance':
        // Grouper par niveaux de performance
        investments.forEach(inv => {
          const roi = parseFloat(inv.performance?.replace(/[+%]/g, '') || 0);
          let perfCategory;
          
          if (roi >= 15) perfCategory = 'excellent';
          else if (roi >= 5) perfCategory = 'good';
          else if (roi >= 0) perfCategory = 'moderate';
          else perfCategory = 'poor';
          
          const perfLabels = {
            excellent: { label: 'Excellent (15%+)', color: '#4caf50' },
            good: { label: 'Bon (5-15%)', color: '#8bc34a' },
            moderate: { label: 'Modéré (0-5%)', color: '#ff9800' },
            poor: { label: 'Faible (<0%)', color: '#f44336' }
          };
          
          if (!groupedData[perfCategory]) {
            groupedData[perfCategory] = {
              label: perfLabels[perfCategory].label,
              value: 0,
              count: 0,
              investments: []
            };
            colorMap[perfCategory] = perfLabels[perfCategory].color;
          }
          
          groupedData[perfCategory].value += inv.currentValue;
          groupedData[perfCategory].count += 1;
          groupedData[perfCategory].investments.push(inv);
        });
        break;

      case 'by-risk':
        investments.forEach(inv => {
          const risk = inv.riskLevel || 'medium';
          const riskConfig = RISK_LEVELS[risk] || RISK_LEVELS.medium;
          
          if (!groupedData[risk]) {
            groupedData[risk] = {
              label: riskConfig.label,
              value: 0,
              count: 0,
              investments: [],
              description: riskConfig.description
            };
            colorMap[risk] = riskConfig.color;
          }
          
          groupedData[risk].value += inv.currentValue;
          groupedData[risk].count += 1;
          groupedData[risk].investments.push(inv);
        });
        break;

      case 'by-status':
        investments.forEach(inv => {
          const status = inv.status || 'active';
          const statusConfig = INVESTMENT_STATUS[status] || INVESTMENT_STATUS.active;
          
          if (!groupedData[status]) {
            groupedData[status] = {
              label: statusConfig.label,
              value: 0,
              count: 0,
              investments: []
            };
            colorMap[status] = statusConfig.color;
          }
          
          groupedData[status].value += inv.currentValue;
          groupedData[status].count += 1;
          groupedData[status].investments.push(inv);
        });
        break;

      default:
        return null;
    }

    // Convertir en arrays pour Chart.js
    const sortedEntries = Object.entries(groupedData)
      .sort(([,a], [,b]) => b.value - a.value);
    
    const labels = sortedEntries.map(([, data]) => data.label);
    const values = sortedEntries.map(([, data]) => data.value);
    const colors = sortedEntries.map(([key]) => colorMap[key]);
    const percentages = values.map(value => ((value / totalValue) * 100).toFixed(1));
    
    // Configuration pour graphiques
    const baseDataset = {
      data: values,
      backgroundColor: colors,
      borderColor: colors.map(color => color + '40'),
      borderWidth: selectedChartType === 'doughnut' ? 2 : 1,
      hoverBackgroundColor: colors.map(color => color + 'CC'),
      hoverBorderColor: colors,
      hoverBorderWidth: 3
    };

    return {
      labels,
      datasets: [baseDataset],
      percentages,
      groupedData: Object.fromEntries(sortedEntries),
      totalValue
    };
  }, [investments, selectedView, selectedChartType]);

  // Configuration des options du graphique
  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend && selectedChartType === 'doughnut',
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            generateLabels: function(chart) {
              const data = chart.data;
              return data.labels.map((label, index) => ({
                text: `${label} (${chartData.percentages[index]}%)`,
                fillStyle: data.datasets[0].backgroundColor[index],
                strokeStyle: data.datasets[0].borderColor[index],
                lineWidth: 2,
                pointStyle: 'circle'
              }));
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
              const value = context.parsed;
              const percentage = chartData.percentages[context.dataIndex];
              const total = selectedChartType === 'doughnut' ? value : value;
              return [
                `${context.label}`,
                `Valeur: ${total.toLocaleString()} ${currency}`,
                `Part: ${percentage}%`,
                `Projets: ${Object.values(chartData.groupedData)[context.dataIndex].count}`
              ];
            }
          }
        }
      },
      onClick: (event, activeElements) => {
        if (activeElements.length > 0 && onSectionClick) {
          const clickedIndex = activeElements[0].index;
          const clickedData = Object.values(chartData.groupedData)[clickedIndex];
          onSectionClick(clickedData);
        }
      }
    };

    if (selectedChartType === 'doughnut') {
      return {
        ...baseOptions,
        cutout: '60%',
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            display: false // On gère la légende manuellement
          }
        }
      };
    } else {
      return {
        ...baseOptions,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString() + ' ' + currency;
              }
            },
            title: {
              display: true,
              text: `Valeur (${currency})`
            }
          },
          y: {
            title: {
              display: true,
              text: VIEW_MODES[selectedView].label
            }
          }
        }
      };
    }
  }, [selectedChartType, showLegend, chartData, currency, selectedView, onSectionClick]);

  // Calculer les métriques du portfolio
  const portfolioMetrics = useMemo(() => {
    if (!investments || investments.length === 0) return null;

    const totalInvested = investments.reduce((sum, inv) => sum + inv.initialInvestment, 0);
    const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturn = totalCurrent - totalInvested;
    const avgROI = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    const diversificationScore = Object.keys(chartData?.groupedData || {}).length;
    const maxDiversification = Object.keys(INVESTMENT_TYPES).length;
    const diversificationPercentage = (diversificationScore / maxDiversification) * 100;

    return {
      totalInvested,
      totalCurrent,
      totalReturn,
      avgROI,
      diversificationScore,
      diversificationPercentage,
      totalProjects: investments.length,
      activeProjects: investments.filter(inv => inv.status === 'active').length
    };
  }, [investments, chartData]);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleExport = () => {
    console.log('Export portfolio allocation data');
    handleMenuClose();
  };

  if (!chartData || !portfolioMetrics) {
    return (
      <Card {...other}>
        <CardContent>
          <MDBox textAlign="center" py={6}>
            <Icon color="action" style={{ fontSize: 48, marginBottom: 16 }}>
              pie_chart
            </Icon>
            <MDTypography variant="h6" color="text" fontWeight="medium">
              Aucune donnée de portfolio
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Ajoutez des investissements pour voir la répartition
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = selectedChartType === 'doughnut' ? Doughnut : Bar;

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
                {portfolioMetrics.totalProjects} projet{portfolioMetrics.totalProjects > 1 ? 's' : ''} 
                · {portfolioMetrics.activeProjects} actif{portfolioMetrics.activeProjects > 1 ? 's' : ''}
              </MDTypography>
            </MDBox>
            
            <MDBox display="flex" alignItems="center" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedChartType(selectedChartType === 'doughnut' ? 'bar' : 'doughnut')}
                startIcon={<Icon>{selectedChartType === 'doughnut' ? 'bar_chart' : 'pie_chart'}</Icon>}
              >
                {selectedChartType === 'doughnut' ? 'Barres' : 'Secteurs'}
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={handleMenuOpen}
                startIcon={<Icon>more_vert</Icon>}
              >
                Options
              </Button>
            </MDBox>
          </MDBox>
        }
      />
      
      <CardContent>
        {/* Métriques rapides */}
        {showMetrics && (
          <MDBox mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <MDTypography variant="h4" fontWeight="bold" color="info">
                    {portfolioMetrics.totalProjects}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Projets
                  </MDTypography>
                </MDBox>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <MDTypography variant="h4" fontWeight="bold" color="success">
                    {portfolioMetrics.diversificationScore}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Secteurs
                  </MDTypography>
                </MDBox>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <MDTypography variant="h4" fontWeight="bold" color={portfolioMetrics.avgROI >= 0 ? "success" : "error"}>
                    {portfolioMetrics.avgROI >= 0 ? '+' : ''}{portfolioMetrics.avgROI.toFixed(1)}%
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    ROI Moyen
                  </MDTypography>
                </MDBox>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <MDTypography variant="h4" fontWeight="bold" color="warning">
                    {portfolioMetrics.diversificationPercentage.toFixed(0)}%
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Diversification
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        )}

        {/* Sélecteur de vue */}
        <MDBox mb={3}>
          <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
            Vue par catégorie
          </MDTypography>
          <Tabs
            value={selectedView}
            onChange={(e, newValue) => setSelectedView(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.entries(VIEW_MODES).map(([key, mode]) => (
              <Tab
                key={key}
                label={mode.label}
                value={key}
                sx={{ minWidth: 'auto', px: 2 }}
              />
            ))}
          </Tabs>
          <MDTypography variant="caption" color="text" mt={0.5}>
            {VIEW_MODES[selectedView].description}
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          {/* Graphique */}
          <Grid item xs={12} md={selectedChartType === 'doughnut' ? 7 : 12}>
            <MDBox height={height} position="relative">
              <ChartComponent data={chartData} options={chartOptions} />
              
              {/* Centre du doughnut avec total */}
              {selectedChartType === 'doughnut' && (
                <MDBox
                  position="absolute"
                  top="50%"
                  left="50%"
                  sx={{
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: 'none'
                  }}
                >
                  <MDTypography variant="h4" fontWeight="bold" color="dark">
                    {chartData.totalValue.toLocaleString()}
                  </MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="medium">
                    {currency} Total
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
          </Grid>

          {/* Détails */}
          {showDetails && selectedChartType === 'doughnut' && (
            <Grid item xs={12} md={5}>
              <MDBox>
                <MDTypography variant="button" fontWeight="medium" mb={2} display="block">
                  Détail par catégorie
                </MDTypography>
                
                <List dense>
                  {Object.entries(chartData.groupedData).map(([key, data], index) => (
                    <ListItem 
                      key={key}
                      sx={{ 
                        px: 0,
                        cursor: onSectionClick ? 'pointer' : 'default',
                        '&:hover': onSectionClick ? { bgcolor: 'grey.50' } : {}
                      }}
                      onClick={() => onSectionClick && onSectionClick(data)}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: chartData.datasets[0].backgroundColor[index],
                            color: 'white',
                            width: 40,
                            height: 40
                          }}
                        >
                          <Icon>{data.icon || 'category'}</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="button" fontWeight="medium">
                              {data.label}
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="bold">
                              {chartData.percentages[index]}%
                            </MDTypography>
                          </MDBox>
                        }
                        secondary={
                          <MDBox>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                              <MDTypography variant="caption" color="text">
                                {data.count} projet{data.count > 1 ? 's' : ''}
                              </MDTypography>
                              <CurrencyDisplay
                                amount={data.value}
                                currency={currency}
                                variant="caption"
                                fontWeight="medium"
                                showSymbol={false}
                              />
                            </MDBox>
                            
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(chartData.percentages[index])}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: chartData.datasets[0].backgroundColor[index]
                                }
                              }}
                            />
                            
                            {data.description && (
                              <MDTypography variant="caption" color="text" display="block" mt={0.5}>
                                {data.description}
                              </MDTypography>
                            )}
                          </MDBox>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </MDBox>
            </Grid>
          )}
        </Grid>

        {/* Score de diversification */}
        <MDBox mt={3} pt={2} borderTop="1px solid" borderColor="grey.200">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDTypography variant="button" fontWeight="medium" color="text">
              Score de Diversification
            </MDTypography>
            <Chip
              label={`${portfolioMetrics.diversificationPercentage.toFixed(0)}%`}
              color={
                portfolioMetrics.diversificationPercentage >= 70 ? "success" :
                portfolioMetrics.diversificationPercentage >= 40 ? "warning" : "error"
              }
              size="small"
            />
          </MDBox>
          
          <LinearProgress
            variant="determinate"
            value={portfolioMetrics.diversificationPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: portfolioMetrics.diversificationPercentage >= 70 ? '#4caf50' :
                         portfolioMetrics.diversificationPercentage >= 40 ? '#ff9800' : '#f44336'
              }
            }}
          />
          
          <MDTypography variant="caption" color="text" mt={1}>
            {portfolioMetrics.diversificationScore} secteur{portfolioMetrics.diversificationScore > 1 ? 's' : ''} sur {Object.keys(INVESTMENT_TYPES).length} disponibles
            {portfolioMetrics.diversificationPercentage < 40 && 
              " · Considérez diversifier davantage pour réduire les risques"
            }
          </MDTypography>
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
        <MenuItem onClick={() => { console.log('Analyser diversification'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>analytics</Icon>
          Analyser diversification
        </MenuItem>
        <MenuItem onClick={() => { console.log('Recommandations'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>lightbulb</Icon>
          Recommandations
        </MenuItem>
        <MenuItem onClick={() => { console.log('Comparer secteurs'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>compare_arrows</Icon>
          Comparer secteurs
        </MenuItem>
      </Menu>
    </Card>
  );
}

PortfolioAllocationChart.propTypes = {
  investments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    initialInvestment: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    performance: PropTypes.string,
    riskLevel: PropTypes.string,
    status: PropTypes.string
  })),
  currency: PropTypes.string,
  title: PropTypes.string,
  defaultView: PropTypes.oneOf(['by-type', 'by-performance', 'by-risk', 'by-status']),
  chartType: PropTypes.oneOf(['doughnut', 'bar']),
  showLegend: PropTypes.bool,
  showDetails: PropTypes.bool,
  showMetrics: PropTypes.bool,
  height: PropTypes.number,
  onSectionClick: PropTypes.func
};

export default PortfolioAllocationChart;