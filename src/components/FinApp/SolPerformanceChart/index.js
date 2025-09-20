// src/components/FinApp/SolPerformanceChart/index.js
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Tooltip as MuiTooltip
} from '@mui/material';
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types de sols avec couleurs
const SOL_TYPES = {
  family: { label: 'Familial', color: '#4caf50', icon: 'family_restroom' },
  friends: { label: 'Amis', color: '#2196f3', icon: 'group' },
  work: { label: 'Travail', color: '#ff9800', icon: 'work' },
  neighborhood: { label: 'Quartier', color: '#9c27b0', icon: 'location_city' },
  business: { label: 'Business', color: '#f44336', icon: 'business' }
};

// Statuts de performance
const PERFORMANCE_STATUS = {
  excellent: { label: 'Excellent', color: '#4caf50', threshold: 95 },
  good: { label: 'Bon', color: '#8bc34a', threshold: 85 },
  average: { label: 'Moyen', color: '#ff9800', threshold: 70 },
  poor: { label: 'Faible', color: '#f44336', threshold: 0 }
};

function SolPerformanceChart({
  sols = [],
  currency = "HTG",
  title = "Performance des Sols",
  showComparison = true,
  showTrends = true,
  defaultPeriod = "6m",
  defaultView = "overview",
  height = 400,
  showMetrics = true,
  onSolClick,
  ...other
}) {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [selectedView, setSelectedView] = useState(defaultView); // 'overview', 'payments', 'timeline', 'comparison'
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Générer données de performance pour chaque sol
  const generateSolPerformance = (sol, months = 6) => {
    const performance = [];
    const startDate = new Date(sol.startDate || '2024-01-01');
    const currentDate = new Date();
    
    // Calculer nombre de mois écoulés
    const monthsElapsed = Math.min(
      Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30)),
      months
    );
    
    let cumulativeReceived = 0;
    let cumulativePaid = 0;
    
    for (let i = 0; i <= monthsElapsed; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Simuler paiements/réceptions selon position et tour actuel
      const isPaymentMonth = (i + 1) % (sol.participants || 8) !== 0;
      const isReceiveMonth = (i + 1) === sol.myPosition;
      
      if (isPaymentMonth && i < (sol.currentTurn || 1)) {
        cumulativePaid += sol.amount || 5000;
      }
      
      if (isReceiveMonth && i < (sol.currentTurn || 1)) {
        cumulativeReceived += (sol.amount || 5000) * (sol.participants || 8);
      }
      
      // Calculer métriques de performance
      const expectedPaid = Math.min(i + 1, sol.currentTurn || 1) * (sol.amount || 5000);
      const paymentRate = expectedPaid > 0 ? (cumulativePaid / expectedPaid) * 100 : 100;
      const netBalance = cumulativeReceived - cumulativePaid;
      
      // Score de performance basé sur ponctualité
      const performanceScore = Math.max(0, Math.min(100, 
        paymentRate - (Math.random() * 10 - 5) // Variation réaliste
      ));
      
      performance.push({
        date: date.toISOString().slice(0, 7), // YYYY-MM format
        month: i,
        paid: cumulativePaid,
        received: cumulativeReceived,
        netBalance,
        paymentRate,
        performanceScore,
        formattedDate: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      });
    }
    
    return performance;
  };

  // Préparer les données selon la vue sélectionnée
  const chartData = useMemo(() => {
    if (!sols || sols.length === 0) return null;

    const periodMonths = {
      '3m': 3,
      '6m': 6,
      '1y': 12,
      'all': 24
    };

    const months = periodMonths[selectedPeriod] || 6;
    
    // Générer performance pour chaque sol
    const solsWithPerformance = sols.map(sol => ({
      ...sol,
      performance: generateSolPerformance(sol, months)
    }));

    // Créer les labels de dates
    const allDates = new Set();
    solsWithPerformance.forEach(sol => {
      sol.performance.forEach(point => allDates.add(point.date));
    });
    const sortedDates = Array.from(allDates).sort();
    const labels = sortedDates.map(date => {
      const d = new Date(date + '-01');
      return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    });

    if (selectedView === 'overview') {
      // Vue d'ensemble - Performance score moyenne
      const avgPerformanceData = sortedDates.map(date => {
        const scores = solsWithPerformance.map(sol => {
          const point = sol.performance.find(p => p.date === date);
          return point ? point.performanceScore : null;
        }).filter(score => score !== null);
        
        return scores.length > 0 
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
          : 0;
      });

      return {
        labels,
        datasets: [
          {
            label: 'Performance Moyenne',
            data: avgPerformanceData,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          }
        ]
      };
    }

    if (selectedView === 'payments') {
      // Vue paiements - Montants payés vs reçus
      const totalPaidData = sortedDates.map(date => {
        return solsWithPerformance.reduce((total, sol) => {
          const point = sol.performance.find(p => p.date === date);
          return total + (point ? point.paid : 0);
        }, 0);
      });

      const totalReceivedData = sortedDates.map(date => {
        return solsWithPerformance.reduce((total, sol) => {
          const point = sol.performance.find(p => p.date === date);
          return total + (point ? point.received : 0);
        }, 0);
      });

      return {
        labels,
        datasets: [
          {
            label: 'Montants Payés',
            data: totalPaidData,
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.3
          },
          {
            label: 'Montants Reçus',
            data: totalReceivedData,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.3
          }
        ]
      };
    }

    if (selectedView === 'comparison') {
      // Vue comparaison - Performance par sol
      const datasets = solsWithPerformance.slice(0, 4).map((sol, index) => {
        const colors = ['#667eea', '#4ecdc4', '#ffeaa7', '#fd79a8'];
        const performanceData = sortedDates.map(date => {
          const point = sol.performance.find(p => p.date === date);
          return point ? point.performanceScore : null;
        });

        return {
          label: sol.name.length > 15 ? sol.name.substring(0, 15) + '...' : sol.name,
          data: performanceData,
          borderColor: colors[index],
          backgroundColor: `${colors[index]}20`,
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6
        };
      });

      return { labels, datasets };
    }

    if (selectedView === 'timeline') {
      // Vue timeline - Progression dans le temps
      const progressData = sortedDates.map((date, index) => {
        // Calculer progression moyenne (tours complétés / tours totaux)
        const avgProgress = solsWithPerformance.reduce((total, sol) => {
          const maxTours = sol.participants || 8;
          const currentProgress = Math.min(index + 1, sol.currentTurn || 1);
          return total + (currentProgress / maxTours) * 100;
        }, 0) / solsWithPerformance.length;
        
        return avgProgress;
      });

      return {
        labels,
        datasets: [
          {
            label: 'Progression Globale (%)',
            data: progressData,
            borderColor: '#9c27b0',
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#9c27b0',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7
          }
        ]
      };
    }

    return null;
  }, [sols, selectedPeriod, selectedView]);

  // Configuration graphique
  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
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
              if (selectedView === 'payments') {
                return `${context.dataset.label}: ${value.toLocaleString()} ${currency}`;
              } else if (selectedView === 'timeline') {
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              } else {
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true,
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
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          title: {
            display: true,
            text: selectedView === 'payments' ? `Montant (${currency})` : 'Performance (%)'
          },
          ticks: {
            callback: function(value) {
              if (selectedView === 'payments') {
                return value.toLocaleString() + ' ' + currency;
              } else {
                return value.toFixed(0) + '%';
              }
            }
          }
        }
      },
      onClick: (event, activeElements) => {
        if (activeElements.length > 0 && onSolClick) {
          const clickedIndex = activeElements[0].index;
          onSolClick({
            dataIndex: clickedIndex,
            period: selectedPeriod,
            view: selectedView,
            sols
          });
        }
      }
    };
  }, [selectedView, currency, selectedPeriod, onSolClick, sols]);

  // Calculer métriques globales
  const globalMetrics = useMemo(() => {
    if (!sols || sols.length === 0) return null;

    const totalActive = sols.filter(sol => sol.status === 'active').length;
    const totalCompleted = sols.filter(sol => sol.status === 'completed').length;
    
    // Calculer montants totaux
    const totalPaid = sols.reduce((sum, sol) => {
      const turnsCompleted = Math.min(sol.currentTurn || 1, sol.myPosition || 0);
      return sum + (turnsCompleted * (sol.amount || 0));
    }, 0);
    
    const totalReceived = sols.reduce((sum, sol) => {
      const hasReceived = (sol.currentTurn || 0) >= (sol.myPosition || 999);
      return sum + (hasReceived ? (sol.amount || 0) * (sol.participants || 8) : 0);
    }, 0);
    
    const netBalance = totalReceived - totalPaid;
    
    // Calculer performance moyenne
    const avgPerformance = sols.reduce((sum, sol) => {
      const expectedTurns = sol.currentTurn || 1;
      const expectedPayments = Math.min(expectedTurns, sol.myPosition || 0);
      const performance = expectedPayments > 0 ? 95 + (Math.random() * 10 - 5) : 100; // Simulé
      return sum + performance;
    }, 0) / Math.max(sols.length, 1);

    return {
      totalActive,
      totalCompleted,
      totalSols: sols.length,
      totalPaid,
      totalReceived,
      netBalance,
      avgPerformance
    };
  }, [sols]);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleExport = () => {
    console.log('Export sol performance data');
    handleMenuClose();
  };

  if (!chartData || !globalMetrics) {
    return (
      <Card {...other}>
        <CardContent>
          <MDBox textAlign="center" py={6}>
            <Icon color="action" style={{ fontSize: 48, marginBottom: 16 }}>
              timeline
            </Icon>
            <MDTypography variant="h6" color="text" fontWeight="medium">
              Aucune donnée de sol
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Rejoignez ou créez des sols pour voir les performances
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
                {globalMetrics.totalActive} sol{globalMetrics.totalActive > 1 ? 's' : ''} actif{globalMetrics.totalActive > 1 ? 's' : ''} 
                · {globalMetrics.totalCompleted} terminé{globalMetrics.totalCompleted > 1 ? 's' : ''}
              </MDTypography>
            </MDBox>
            
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
                  <MDTypography variant="h4" fontWeight="bold" color="primary">
                    {globalMetrics.totalSols}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Sols Total
                  </MDTypography>
                </MDBox>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <MDTypography variant="h4" fontWeight="bold" color="success">
                    {globalMetrics.avgPerformance.toFixed(0)}%
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Performance
                  </MDTypography>
                </MDBox>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <CurrencyDisplay
                    amount={globalMetrics.totalPaid}
                    currency={currency}
                    variant="h4"
                    fontWeight="bold"
                    color="error"
                    showSymbol={false}
                  />
                  <MDTypography variant="caption" color="text">
                    Total Payé
                  </MDTypography>
                </MDBox>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <MDBox textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
                  <CurrencyDisplay
                    amount={globalMetrics.totalReceived}
                    currency={currency}
                    variant="h4"
                    fontWeight="bold"
                    color="success"
                    showSymbol={false}
                  />
                  <MDTypography variant="caption" color="text">
                    Total Reçu
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        )}

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
                <Tab label="3 mois" value="3m" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="6 mois" value="6m" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="1 an" value="1y" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="Tout" value="all" sx={{ minWidth: 'auto', px: 2 }} />
              </Tabs>
            </Box>

            {/* Sélecteur de vue */}
            <Box>
              <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                Vue
              </MDTypography>
              <Tabs
                value={selectedView}
                onChange={(e, newValue) => setSelectedView(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Vue d'ensemble" value="overview" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="Paiements" value="payments" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="Comparaison" value="comparison" sx={{ minWidth: 'auto', px: 2 }} />
                <Tab label="Timeline" value="timeline" sx={{ minWidth: 'auto', px: 2 }} />
              </Tabs>
            </Box>
          </Box>
        </MDBox>

        {/* Graphique */}
        <MDBox height={height}>
          <Line data={chartData} options={chartOptions} />
        </MDBox>

        {/* Balance globale */}
        <MDBox mt={3} pt={2} borderTop="1px solid" borderColor="grey.200">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <MDTypography variant="button" fontWeight="medium" color="text">
                Balance Globale
              </MDTypography>
              <CurrencyDisplay
                amount={globalMetrics.netBalance}
                currency={currency}
                variant="h6"
                color="auto"
                fontWeight="bold"
                showSymbol={true}
                showTrend={true}
                previousAmount={0}
              />
            </Box>
            
            <Box display="flex" gap={1}>
              <Chip
                label={`${globalMetrics.avgPerformance.toFixed(1)}% Performance`}
                color={globalMetrics.avgPerformance >= 90 ? "success" : globalMetrics.avgPerformance >= 75 ? "warning" : "error"}
                size="small"
              />
              
              <Chip
                label={`${globalMetrics.totalActive} Actifs`}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </MDBox>

        {/* Liste des sols avec performance */}
        {showComparison && sols.length > 0 && (
          <MDBox mt={3}>
            <MDTypography variant="button" fontWeight="medium" mb={2} display="block">
              Performance par Sol
            </MDTypography>
            
            <List dense>
              {sols.slice(0, 3).map((sol, index) => {
                const solType = SOL_TYPES[sol.type] || SOL_TYPES.friends;
                const performance = 90 + Math.random() * 10; // Simulé
                const status = performance >= 95 ? 'excellent' : 
                             performance >= 85 ? 'good' : 
                             performance >= 70 ? 'average' : 'poor';
                const statusConfig = PERFORMANCE_STATUS[status];
                
                return (
                  <ListItem 
                    key={sol.id}
                    sx={{ 
                      px: 0,
                      cursor: onSolClick ? 'pointer' : 'default',
                      '&:hover': onSolClick ? { bgcolor: 'grey.50' } : {}
                    }}
                    onClick={() => onSolClick && onSolClick(sol)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: solType.color, color: 'white' }}>
                        <Icon>{solType.icon}</Icon>
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                          <MDTypography variant="button" fontWeight="medium">
                            {sol.name}
                          </MDTypography>
                          <Chip
                            label={`${performance.toFixed(0)}%`}
                            color={status === 'excellent' || status === 'good' ? 'success' : 
                                   status === 'average' ? 'warning' : 'error'}
                            size="small"
                          />
                        </MDBox>
                      }
                      secondary={
                        <MDBox>
                          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <MDTypography variant="caption" color="text">
                              {sol.participants} participants · Tour {sol.currentTurn || 1}
                            </MDTypography>
                            <MDTypography variant="caption" fontWeight="medium">
                              {statusConfig.label}
                            </MDTypography>
                          </MDBox>
                          
                          <LinearProgress
                            variant="determinate"
                            value={performance}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: statusConfig.color
                              }
                            }}
                          />
                        </MDBox>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </MDBox>
        )}
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
        <MenuItem onClick={() => { console.log('Comparer avec moyennes'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>compare_arrows</Icon>
          Comparer avec moyennes
        </MenuItem>
        <MenuItem onClick={() => { console.log('Rapport détaillé'); handleMenuClose(); }}>
          <Icon sx={{ mr: 1 }}>description</Icon>
          Rapport détaillé
        </MenuItem>
      </Menu>
    </Card>
  );
}

SolPerformanceChart.propTypes = {
  sols: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    participants: PropTypes.number,
    amount: PropTypes.number,
    currency: PropTypes.string,
    currentTurn: PropTypes.number,
    myPosition: PropTypes.number,
    status: PropTypes.string,
    startDate: PropTypes.string
  })),
  currency: PropTypes.string,
  title: PropTypes.string,
  showComparison: PropTypes.bool,
  showTrends: PropTypes.bool,
  defaultPeriod: PropTypes.oneOf(['3m', '6m', '1y', 'all']),
  defaultView: PropTypes.oneOf(['overview', 'payments', 'timeline', 'comparison']),
  height: PropTypes.number,
  showMetrics: PropTypes.bool,
  onSolClick: PropTypes.func
};

export default SolPerformanceChart;