// src/layouts/budgets/index.js - MISE À JOUR AVEC BudgetProgressChart

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

// @mui icons
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import BudgetCard from '../../components/FinApp/BudgetCard/index';
import CurrencyDisplay from '../../components/FinApp/CurrencyDisplay/index';
import BudgetProgressChart from '../../components/FinApp/BudgetProgressChart'; // NOUVEAU

// Données mockées des budgets COMPLÈTES ET CORRIGÉES
const MOCK_BUDGETS = [
  {
    id: 1,
    budgetName: "Alimentation",
    spent: 8500,
    budget: 12000,
    currency: "HTG",
    period: "Janvier 2024", 
    category: "alimentation", // CORRECTION : était "education"
    daysRemaining: 16,
    totalDays: 31,
    predictions: {
      projected: 10200,
      status: "good"
    },
    transactions: [
      { date: "2024-01-15", amount: 1200, description: "Supermarché Choice" },
      { date: "2024-01-14", amount: 800, description: "Marché de Pétion-Ville" },
      { date: "2024-01-13", amount: 450, description: "Boulangerie locale" }
    ]
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
    totalDays: 31,
    predictions: {
      projected: 5800,
      status: "warning"
    },
    transactions: [
      { date: "2024-01-15", amount: 300, description: "Tap-tap domicile-bureau" },
      { date: "2024-01-14", amount: 250, description: "Transport en commun" }
    ]
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
    totalDays: 31,
    predictions: {
      projected: 17500,
      status: "good"
    },
    transactions: [
      { date: "2024-01-01", amount: 15000, description: "Loyer mensuel" }
    ]
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
    totalDays: 31,
    predictions: {
      projected: 3200,
      status: "good"
    },
    transactions: [
      { date: "2024-01-10", amount: 1500, description: "Consultation médecin" },
      { date: "2024-01-08", amount: 800, description: "Pharmacie - médicaments" }
    ]
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
    totalDays: 31,
    predictions: {
      projected: 4100,
      status: "danger"
    },
    transactions: [
      { date: "2024-01-14", amount: 1200, description: "Sortie restaurant" },
      { date: "2024-01-12", amount: 800, description: "Cinéma" }
    ]
  },
  {
    id: 6,
    budgetName: "Éducation",
    spent: 1800,
    budget: 3000,
    currency: "HTG",
    period: "Janvier 2024",
    category: "education",
    daysRemaining: 16,
    totalDays: 31,
    predictions: {
      projected: 2400,
      status: "good"
    },
    transactions: [
      { date: "2024-01-05", amount: 1500, description: "Frais universitaires" },
      { date: "2024-01-03", amount: 300, description: "Livres" }
    ]
  }
];

function BudgetsPage() {
  // États pour la gestion des onglets et données
  const [activeTab, setActiveTab] = useState(0);
  const [budgets, setBudgets] = useState(MOCK_BUDGETS);
  const [selectedCurrency, setSelectedCurrency] = useState("HTG");
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Calculer les statistiques globales
  const stats = {
    totalBudget: { HTG: 0, USD: 0 },
    totalSpent: { HTG: 0, USD: 0 },
    budgetsCount: budgets.length,
    overBudgetCount: 0,
    warningCount: 0,
    goodCount: 0
  };

  budgets.forEach(budget => {
    const currency = budget.currency;
    stats.totalBudget[currency] += budget.budget;
    stats.totalSpent[currency] += budget.spent;
    
    const percentage = (budget.spent / budget.budget) * 100;
    if (budget.spent > budget.budget) {
      stats.overBudgetCount++;
    } else if (percentage > 75) {
      stats.warningCount++;
    } else {
      stats.goodCount++;
    }
  });

  // Calcul du taux d'épargne
  const totalBudgetHTG = stats.totalBudget.HTG + (stats.totalBudget.USD * 113);
  const totalSpentHTG = stats.totalSpent.HTG + (stats.totalSpent.USD * 113);
  stats.savingsRate = totalBudgetHTG > 0 ? ((totalBudgetHTG - totalSpentHTG) / totalBudgetHTG) * 100 : 0;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleBudgetClick = (budget) => {
    console.log('Budget cliqué:', budget);
    // Ici on pourrait ouvrir un modal de détails ou navigation
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Statistiques principales */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <MDTypography variant="h6" color="primary" fontWeight="medium">
                Budgets Totaux
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold">
                {stats.budgetsCount}
              </MDTypography>
              <MDBox display="flex" justifyContent="center" gap={1} mt={1}>
                <Chip label={`${stats.goodCount} OK`} color="success" size="small" />
                <Chip label={`${stats.warningCount} ⚠️`} color="warning" size="small" />
                <Chip label={`${stats.overBudgetCount} ❌`} color="error" size="small" />
              </MDBox>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <MDTypography variant="h6" color="info" fontWeight="medium">
                Budget Total
              </MDTypography>
              <CurrencyDisplay
                amount={stats.totalBudget.HTG}
                currency="HTG"
                variant="h4"
                fontWeight="bold"
              />
              {stats.totalBudget.USD > 0 && (
                <CurrencyDisplay
                  amount={stats.totalBudget.USD}
                  currency="USD"
                  variant="body2"
                  color="text"
                />
              )}
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <MDTypography variant="h6" color="warning" fontWeight="medium">
                Total Dépensé
              </MDTypography>
              <CurrencyDisplay
                amount={stats.totalSpent.HTG}
                currency="HTG"
                variant="h4"
                fontWeight="bold"
              />
              {stats.totalSpent.USD > 0 && (
                <CurrencyDisplay
                  amount={stats.totalSpent.USD}
                  currency="USD"
                  variant="body2"
                  color="text"
                />
              )}
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <MDTypography variant="h6" color="success" fontWeight="medium">
                Taux Épargne
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold" color={stats.savingsRate > 20 ? "success" : stats.savingsRate > 10 ? "warning" : "error"}>
                {stats.savingsRate.toFixed(1)}%
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {stats.savingsRate > 20 ? 'Excellent' : stats.savingsRate > 10 ? 'Bon' : 'À améliorer'}
              </MDTypography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Cartes budgets individuelles */}
      <Grid item xs={12}>
        <MDBox mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            Mes Budgets
          </MDTypography>
        </MDBox>
        <Grid container spacing={3}>
          {budgets.map((budget) => (
            <Grid item xs={12} sm={6} lg={4} key={budget.id}>
              <BudgetCard
                category={budget.category}
                budgetAmount={budget.budget}
                spentAmount={budget.spent}
                currency={budget.currency}
                period="mensuel"
                daysLeft={budget.daysRemaining}
                totalDays={budget.totalDays || 31}
                lastExpenses={budget.transactions}
                showDetails={true}
                showActions={true}
                onClick={() => handleBudgetClick(budget)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  const renderProgressTab = () => (
    <Grid container spacing={3}>
      {/* Graphique principal de progression */}
      <Grid item xs={12}>
        <BudgetProgressChart
          budgets={budgets}
          currency="HTG"
          title="Progression des Budgets par Catégorie"
          showPredictions={true}
          showComparison={true}
          showAlerts={true}
          size="large"
          viewMode="progress"
          onBudgetClick={(budget) => {
            console.log('Budget cliqué depuis le graphique:', budget);
            // Navigation vers détail budget ou modal
          }}
        />
      </Grid>

      {/* Vue complémentaire en mode montants */}
      <Grid item xs={12} md={6}>
        <BudgetProgressChart
          budgets={budgets}
          currency="HTG"
          title="Montants Dépensés"
          showPredictions={false}
          showComparison={false}
          showAlerts={false}
          size="medium"
          viewMode="amounts"
          onBudgetClick={handleBudgetClick}
        />
      </Grid>

      {/* Vue complémentaire montants restants */}
      <Grid item xs={12} md={6}>
        <BudgetProgressChart
          budgets={budgets}
          currency="HTG"
          title="Montants Restants"
          showPredictions={false}
          showComparison={false}
          showAlerts={false}
          size="medium"
          viewMode="remaining"
          onBudgetClick={handleBudgetClick}
        />
      </Grid>
    </Grid>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Analyse Budgétaire Avancée
            </MDTypography>
            
            <Alert severity="info">
              <MDTypography variant="body2" fontWeight="medium">
                Analyses avancées à venir
              </MDTypography>
              <MDTypography variant="caption">
                Tendances temporelles, comparaisons mensuelles, prédictions IA
              </MDTypography>
            </Alert>
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h4" fontWeight="medium">
                    Mes Budgets
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Suivez et optimisez vos budgets
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Onglets */}
        <MDBox mb={3}>
          <Card>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab 
                label="Vue d'ensemble" 
                icon={<PieChartIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Progression" 
                icon={<BarChartIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Analyse" 
                icon={<CalendarTodayIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Card>
        </MDBox>

        {/* Contenu des onglets */}
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderProgressTab()}
        {activeTab === 2 && renderAnalyticsTab()}

        {/* Bouton flottant pour nouveau budget */}
        <Fab
          color="primary"
          aria-label="add budget"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => console.log('Créer nouveau budget')}
        >
          <AddIcon />
        </Fab>

        {/* Menu actions */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            Nouveau budget
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Importer données
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Exporter rapports
          </MenuItem>
        </Menu>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default BudgetsPage;