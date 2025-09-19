// src/layouts/budgets/index.js
import React, { useState, useEffect } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

// @mui icons
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import FinAppNavbar from 'components/FinApp/FinAppNavbar';
import FinAppSidenav from 'components/FinApp/FinAppSidenav';
import BudgetCard from 'components/FinApp/BudgetCard';
import CurrencyDisplay from 'components/FinApp/CurrencyDisplay';

// Layout components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Données mockées des budgets
const MOCK_BUDGETS = [
  {
    id: 1,
    budgetName: "Alimentation",
    spent: 8500,
    budget: 12000,
    currency: "HTG",
    period: "Janvier 2024",
    category: "alimentation",
    daysRemaining: 16,
    predictions: {
      projected: 10200,
      status: "good"
    },
    transactions: [
      { date: "2024-01-15", amount: 1200, description: "Supermarché Choice" },
      { date: "2024-01-14", amount: 800, description: "Marché de Pétion-Ville" },
      { date: "2024-01-13", amount: 450, description: "Boulangerie locale" },
      { date: "2024-01-12", amount: 2200, description: "Courses hebdomadaires" }
    ],
    weeklyAverage: 2125,
    lastYearSame: 9800
  },
  {
    id: 2,
    budgetName: "Transport",
    spent: 4200,
    budget: 5000,
    currency: "HTG",
    period: "Janvier 2024",
    category: "transport",
    daysRemaining: 16,
    predictions: {
      projected: 5800,
      status: "warning"
    },
    transactions: [
      { date: "2024-01-15", amount: 300, description: "Tap-tap domicile-bureau" },
      { date: "2024-01-14", amount: 250, description: "Transport en commun" },
      { date: "2024-01-13", amount: 500, description: "Taxi pour rendez-vous" },
      { date: "2024-01-12", amount: 150, description: "Moto-taxi" }
    ],
    weeklyAverage: 1050,
    lastYearSame: 4500
  },
  {
    id: 3,
    budgetName: "Logement",
    spent: 15000,
    budget: 18000,
    currency: "HTG",
    period: "Janvier 2024",
    category: "logement",
    daysRemaining: 16,
    predictions: {
      projected: 17500,
      status: "good"
    },
    transactions: [
      { date: "2024-01-01", amount: 15000, description: "Loyer mensuel" }
    ],
    weeklyAverage: 4500,
    lastYearSame: 16000
  },
  {
    id: 4,
    budgetName: "Santé",
    spent: 2800,
    budget: 4000,
    currency: "HTG",
    period: "Janvier 2024",
    category: "sante",
    daysRemaining: 16,
    predictions: {
      projected: 3200,
      status: "good"
    },
    transactions: [
      { date: "2024-01-10", amount: 1500, description: "Consultation médecin" },
      { date: "2024-01-08", amount: 800, description: "Pharmacie - médicaments" },
      { date: "2024-01-05", amount: 500, description: "Vitamines" }
    ],
    weeklyAverage: 700,
    lastYearSame: 3500
  },
  {
    id: 5,
    budgetName: "Loisirs",
    spent: 3200,
    budget: 2500,
    currency: "HTG",
    period: "Janvier 2024",
    category: "loisirs",
    daysRemaining: 16,
    predictions: {
      projected: 4100,
      status: "danger"
    },
    transactions: [
      { date: "2024-01-14", amount: 1200, description: "Sortie restaurant" },
      { date: "2024-01-12", amount: 800, description: "Cinéma avec famille" },
      { date: "2024-01-10", amount: 600, description: "Concert local" },
      { date: "2024-01-08", amount: 600, description: "Sorties diverses" }
    ],
    weeklyAverage: 800,
    lastYearSame: 2200
  },
  {
    id: 6,
    budgetName: "Épargne",
    spent: 5000,
    budget: 8000,
    currency: "HTG",
    period: "Janvier 2024",
    category: "epargne",
    daysRemaining: 16,
    predictions: {
      projected: 7200,
      status: "good"
    },
    transactions: [
      { date: "2024-01-15", amount: 2000, description: "Transfert épargne" },
      { date: "2024-01-01", amount: 3000, description: "Épargne automatique" }
    ],
    weeklyAverage: 2000,
    lastYearSame: 6500
  },
  {
    id: 7,
    budgetName: "Investissement USD",
    spent: 120,
    budget: 200,
    currency: "USD",
    period: "Janvier 2024",
    category: "investissement",
    daysRemaining: 16,
    predictions: {
      projected: 180,
      status: "good"
    },
    transactions: [
      { date: "2024-01-15", amount: 50, description: "Action élevage porcs" },
      { date: "2024-01-10", amount: 70, description: "Prêt microcrédit ami" }
    ],
    weeklyAverage: 45,
    lastYearSame: 150
  }
];

function BudgetsPage() {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('HTG');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);
  const [budgets, setBudgets] = useState(MOCK_BUDGETS);

  // Calcul des statistiques
  const [stats, setStats] = useState({
    totalBudget: { HTG: 0, USD: 0 },
    totalSpent: { HTG: 0, USD: 0 },
    onTrack: 0,
    overBudget: 0,
    savingsRate: 0
  });

  useEffect(() => {
    const newStats = budgets.reduce((acc, budget) => {
      acc.totalBudget[budget.currency] += budget.budget;
      acc.totalSpent[budget.currency] += budget.spent;
      
      const percentage = (budget.spent / budget.budget) * 100;
      if (percentage <= 85) acc.onTrack++;
      else if (percentage > 100) acc.overBudget++;
      
      return acc;
    }, {
      totalBudget: { HTG: 0, USD: 0 },
      totalSpent: { HTG: 0, USD: 0 },
      onTrack: 0,
      overBudget: 0
    });

    // Calcul du taux d'épargne
    const totalIncome = 120000; // Mock income
    const savingsAmount = budgets.find(b => b.category === 'epargne')?.spent || 0;
    newStats.savingsRate = (savingsAmount / totalIncome) * 100;

    setStats(newStats);
  }, [budgets]);

  // Filtrer les budgets
  const filteredBudgets = budgets.filter(budget => {
    switch (selectedFilter) {
      case 'htg': return budget.currency === 'HTG';
      case 'usd': return budget.currency === 'USD';
      case 'on-track': return (budget.spent / budget.budget) <= 0.85;
      case 'warning': return (budget.spent / budget.budget) > 0.85 && (budget.spent / budget.budget) <= 1;
      case 'over-budget': return (budget.spent / budget.budget) > 1;
      case 'food': return budget.category === 'alimentation';
      case 'transport': return budget.category === 'transport';
      case 'savings': return budget.category === 'epargne' || budget.category === 'investissement';
      default: return true;
    }
  });

  const handleSidenavToggle = () => setSidenavOpen(!sidenavOpen);

  const handleFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    handleFilterClose();
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'htg': return 'HTG seulement';
      case 'usd': return 'USD seulement';
      case 'on-track': return 'Sur la bonne voie';
      case 'warning': return 'Attention';
      case 'over-budget': return 'Dépassés';
      case 'food': return 'Alimentation';
      case 'transport': return 'Transport';
      case 'savings': return 'Épargne & Investissement';
      default: return 'Tous les budgets';
    }
  };

  const getBudgetsByStatus = () => {
    return {
      onTrack: budgets.filter(b => (b.spent / b.budget) <= 0.85),
      warning: budgets.filter(b => (b.spent / b.budget) > 0.85 && (b.spent / b.budget) <= 1),
      overBudget: budgets.filter(b => (b.spent / b.budget) > 1)
    };
  };

  const getOverallBudgetHealth = () => {
    const percentage = (stats.totalSpent.HTG / stats.totalBudget.HTG) * 100;
    if (percentage <= 75) return { status: 'excellent', color: 'success', message: 'Excellente gestion' };
    if (percentage <= 85) return { status: 'good', color: 'info', message: 'Bonne gestion' };
    if (percentage <= 95) return { status: 'warning', color: 'warning', message: 'Attention recommandée' };
    return { status: 'danger', color: 'error', message: 'Révision nécessaire' };
  };

  return (
    <DashboardLayout>
      {/* Navigation */}
      <FinAppNavbar 
        onSidenavToggle={handleSidenavToggle}
        currency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        notifications={stats.overBudget}
      />
      
      <FinAppSidenav 
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        activePage="budgets"
      />

      {/* Contenu principal */}
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          
          {/* Header */}
          <MDBox mb={4}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Mes Budgets
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Suivez et contrôlez vos dépenses mensuelles
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'success.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h4" color="success.dark" fontWeight="bold">
                          {stats.onTrack}
                        </MDTypography>
                        <MDTypography variant="caption" color="success.dark">
                          Sur la bonne voie
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'error.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h4" color="error.dark" fontWeight="bold">
                          {stats.overBudget}
                        </MDTypography>
                        <MDTypography variant="caption" color="error.dark">
                          Dépassés
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>

          {/* Alerte de santé budgétaire */}
          <MDBox mb={3}>
            {(() => {
              const health = getOverallBudgetHealth();
              return (
                <Alert severity={health.color} sx={{ alignItems: 'center' }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <CircularProgress 
                        variant="determinate" 
                        value={Math.min((stats.totalSpent.HTG / stats.totalBudget.HTG) * 100, 100)}
                        size={40}
                        color={health.color}
                      />
                    </Grid>
                    <Grid item xs>
                      <MDTypography variant="body2" fontWeight="medium">
                        <strong>Santé budgétaire : {health.message}</strong>
                        <br />
                        Vous avez dépensé {((stats.totalSpent.HTG / stats.totalBudget.HTG) * 100).toFixed(1)}% 
                        de votre budget total ({stats.totalSpent.HTG.toLocaleString()} / {stats.totalBudget.HTG.toLocaleString()} HTG)
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDButton size="small" variant="outlined" color={health.color}>
                        Voir conseils
                      </MDButton>
                    </Grid>
                  </Grid>
                </Alert>
              );
            })()}
          </MDBox>

          {/* Alertes pour budgets dépassés */}
          {stats.overBudget > 0 && (
            <MDBox mb={3}>
              <Alert severity="error" sx={{ alignItems: 'center' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <ErrorIcon />
                  </Grid>
                  <Grid item xs>
                    <MDTypography variant="body2" fontWeight="medium">
                      <strong>Attention !</strong> {stats.overBudget} budget{stats.overBudget > 1 ? 's sont dépassés' : ' est dépassé'}. 
                      Révisez vos dépenses pour le reste du mois.
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant="outlined" color="error">
                      Optimiser
                    </MDButton>
                  </Grid>
                </Grid>
              </Alert>
            </MDBox>
          )}

          {/* Onglets de navigation */}
          <MDBox mb={3}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Mes Budgets" />
              <Tab label="Analyse" />
              <Tab label="Objectifs" />
            </Tabs>
          </MDBox>

          {/* Contenu des onglets */}
          {selectedTab === 0 && (
            <>
              {/* Barre d'actions */}
              <MDBox mb={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <MDButton 
                      variant="outlined" 
                      size="small" 
                      startIcon={<FilterListIcon />}
                      onClick={handleFilterMenu}
                    >
                      {getFilterLabel()}
                    </MDButton>
                    
                    <Menu
                      anchorEl={filterMenuAnchor}
                      open={Boolean(filterMenuAnchor)}
                      onClose={handleFilterClose}
                    >
                      <MenuItem onClick={() => handleFilterSelect('all')}>
                        Tous les budgets
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleFilterSelect('on-track')}>
                        Sur la bonne voie
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('warning')}>
                        Attention
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('over-budget')}>
                        Dépassés
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleFilterSelect('htg')}>
                        HTG seulement
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('usd')}>
                        USD seulement
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleFilterSelect('food')}>
                        Alimentation
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('transport')}>
                        Transport
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('savings')}>
                        Épargne & Investissement
                      </MenuItem>
                    </Menu>
                  </Grid>
                  
                  <Grid item xs />
                  
                  <Grid item>
                    <MDButton 
                      variant="outlined" 
                      size="small" 
                      startIcon={<BarChartIcon />}
                      onClick={() => console.log('Analyser dépenses')}
                    >
                      Analyser
                    </MDButton>
                  </Grid>
                  
                  <Grid item>
                    <MDButton 
                      variant="contained" 
                      size="small" 
                      startIcon={<AddIcon />}
                      onClick={() => console.log('Créer budget')}
                    >
                      Nouveau budget
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>

              {/* Liste des budgets */}
              <Grid container spacing={3}>
                {filteredBudgets.map((budget) => (
                  <Grid item xs={12} md={6} lg={4} key={budget.id}>
                    <BudgetCard
                      budgetName={budget.budgetName}
                      spent={budget.spent}
                      budget={budget.budget}
                      currency={budget.currency}
                      period={budget.period}
                      category={budget.category}
                      daysRemaining={budget.daysRemaining}
                      predictions={budget.predictions}
                      onEdit={() => console.log('Modifier budget', budget.id)}
                      onViewDetails={() => console.log('Voir détails budget', budget.id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Message si aucun budget */}
              {filteredBudgets.length === 0 && (
                <MDBox textAlign="center" py={6}>
                  <BarChartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <MDTypography variant="h6" color="text" mb={1}>
                    Aucun budget trouvé
                  </MDTypography>
                  <MDTypography variant="body2" color="text" mb={3}>
                    Créez votre premier budget pour commencer à suivre vos dépenses
                  </MDTypography>
                  <MDButton 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => console.log('Créer budget')}
                  >
                    Créer un budget
                  </MDButton>
                </MDBox>
              )}
            </>
          )}

          {/* Onglet Analyse */}
          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={3}>
                      Répartition des dépenses
                    </MDTypography>
                    
                    {budgets.filter(b => b.currency === 'HTG').map((budget) => {
                      const percentage = (budget.spent / stats.totalSpent.HTG) * 100;
                      return (
                        <MDBox key={budget.id} mb={2}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={4}>
                              <MDTypography variant="body2" fontWeight="medium">
                                {budget.budgetName}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <LinearProgress 
                                variant="determinate" 
                                value={percentage}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Grid>
                            <Grid item xs={2} textAlign="right">
                              <MDTypography variant="caption" fontWeight="medium">
                                {percentage.toFixed(1)}%
                              </MDTypography>
                            </Grid>
                          </Grid>
                        </MDBox>
                      );
                    })}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Indicateurs clés
                    </MDTypography>
                    
                    <MDBox mb={3}>
                      <MDTypography variant="body2" color="text">
                        Taux d'épargne
                      </MDTypography>
                      <MDTypography variant="h4" color="success.main" fontWeight="bold">
                        {stats.savingsRate.toFixed(1)}%
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Objectif : 20%
                      </MDTypography>
                    </MDBox>
                    
                    <MDBox mb={3}>
                      <MDTypography variant="body2" color="text">
                        Budget restant (HTG)
                      </MDTypography>
                      <CurrencyDisplay
                        amount={stats.totalBudget.HTG - stats.totalSpent.HTG}
                        currency="HTG"
                        variant="h5"
                        fontWeight="bold"
                        color={stats.totalBudget.HTG > stats.totalSpent.HTG ? 'success.main' : 'error.main'}
                        showTrend={false}
                      />
                    </MDBox>
                    
                    <MDBox>
                      <MDTypography variant="body2" color="text">
                        Jours restants
                      </MDTypography>
                      <MDTypography variant="h4" color="info.main" fontWeight="bold">
                        16
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Jusqu'à fin janvier
                      </MDTypography>
                    </MDBox>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Onglet Objectifs */}
          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={3}>
                      Objectifs financiers
                    </MDTypography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <MDBox textAlign="center" p={2} border="1px solid" borderColor="divider" borderRadius={2}>
                          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                          <MDTypography variant="h6" fontWeight="medium">
                            Épargne mensuelle
                          </MDTypography>
                          <MDTypography variant="h4" color="success.main" fontWeight="bold">
                            8000 HTG
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Objectif atteint à 62.5%
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <MDBox textAlign="center" p={2} border="1px solid" borderColor="divider" borderRadius={2}>
                          <TrendingUpIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                          <MDTypography variant="h6" fontWeight="medium">
                            Réduction dépenses
                          </MDTypography>
                          <MDTypography variant="h4" color="info.main" fontWeight="bold">
                            -15%
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Objectif : -20% vs année passée
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <MDBox textAlign="center" p={2} border="1px solid" borderColor="divider" borderRadius={2}>
                          <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                          <MDTypography variant="h6" fontWeight="medium">
                            Fonds d'urgence
                          </MDTypography>
                          <MDTypography variant="h4" color="warning.main" fontWeight="bold">
                            2/6
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Mois de dépenses couvertes
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </MDBox>

      {/* Bouton flottant pour créer un budget */}
      <Fab
        color="primary"
        aria-label="create-budget"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 16 },
          right: 16,
          zIndex: 1000
        }}
        onClick={() => console.log('Créer un budget')}
      >
        <AddIcon />
      </Fab>
    </DashboardLayout>
  );
}

export default BudgetsPage;