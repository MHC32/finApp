// src/layouts/dashboard/index.js
import React, { useState, useEffect } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';

// @mui icons
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import FinAppNavbar from '../../examples/Navbars/FinAppNavbar/index';
import FinAppSidenav from '../../examples/Sidenav/FinAppSidenav';
import AccountSummaryCard from '../../components/FinApp/AccountSummaryCard/index';
import BudgetCard from '../../components/FinApp/BudgetCard/index';
import SolCard from '../../components/FinApp/SolCard/index';
import CurrencyDisplay from '../../components/FinApp/CurrencyDisplay/index';

// Layout components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Données mockées pour la démonstration
const MOCK_DATA = {
  accounts: [
    {
      id: 1,
      name: "Compte Principal",
      bank: "Sogebank",
      accountNumber: "****4521",
      balance: 45750,
      currency: "HTG",
      trend: "+5.2%",
      trendDirection: "up",
      transactions: [
        { date: "2024-01-15", amount: -1500, description: "Supermarché" },
        { date: "2024-01-14", amount: 35000, description: "Salaire" },
        { date: "2024-01-13", amount: -800, description: "Transport" }
      ]
    },
    {
      id: 2,
      name: "Épargne USD",
      bank: "Unibank",
      accountNumber: "****7892",
      balance: 850,
      currency: "USD",
      trend: "+12.8%",
      trendDirection: "up",
      transactions: [
        { date: "2024-01-12", amount: 200, description: "Transfert épargne" },
        { date: "2024-01-10", amount: -50, description: "Frais bancaires" }
      ]
    },
    {
      id: 3,
      name: "Business",
      bank: "BNC",
      accountNumber: "****1234",
      balance: 28300,
      currency: "HTG",
      trend: "-2.1%",
      trendDirection: "down",
      transactions: [
        { date: "2024-01-15", amount: 12000, description: "Vente produits" },
        { date: "2024-01-14", amount: -5000, description: "Achat marchandises" }
      ]
    }
  ],
  budgets: [
    {
      id: 1,
      name: "Alimentation",
      spent: 8500,
      budget: 12000,
      currency: "HTG",
      period: "Janvier 2024",
      category: "alimentation",
      daysRemaining: 16,
      predictions: {
        projected: 10200,
        status: "good" // good, warning, danger
      }
    },
    {
      id: 2,
      name: "Transport",
      spent: 4200,
      budget: 5000,
      currency: "HTG",
      period: "Janvier 2024",
      category: "transport",
      daysRemaining: 16,
      predictions: {
        projected: 5800,
        status: "warning"
      }
    }
  ],
  sols: [
    {
      id: 1,
      name: "Sol Famille",
      type: "family",
      participants: 8,
      amount: 5000,
      currency: "HTG",
      frequency: "monthly",
      nextPayment: "2024-02-01",
      myPosition: 3,
      currentTurn: 1,
      status: "active",
      description: "Sol familial mensuel"
    },
    {
      id: 2,
      name: "Sol Bureau",
      type: "work",
      participants: 12,
      amount: 2000,
      currency: "HTG",
      frequency: "weekly",
      nextPayment: "2024-01-22",
      myPosition: 7,
      currentTurn: 5,
      status: "active",
      description: "Sol hebdomadaire entre collègues"
    }
  ],
  notifications: [
    {
      id: 1,
      type: "sol_payment",
      title: "Paiement Sol Bureau",
      message: "Votre tour arrive dans 3 semaines",
      date: "2024-01-16",
      read: false
    },
    {
      id: 2,
      type: "budget_warning",
      title: "Budget Transport",
      message: "84% du budget utilisé",
      date: "2024-01-15",
      read: false
    }
  ]
};

const CORRECTED_SOLS_DATA = [
  {
    id: 1,
    name: "Sol Famille",
    solType: "family",
    participants: 8, // Nombre de participants
    participantsList: [ // Liste des participants pour SolCard
      { name: "Marie D.", position: 1, status: "paid" },
      { name: "Jean P.", position: 2, status: "pending" },
      { name: "Vous", position: 3, status: "upcoming" },
      { name: "Sophie L.", position: 4, status: "upcoming" },
      { name: "Pierre M.", position: 5, status: "upcoming" },
      { name: "Anna C.", position: 6, status: "upcoming" },
      { name: "David R.", position: 7, status: "upcoming" },
      { name: "Lisa T.", position: 8, status: "upcoming" }
    ],
    amount: 5000,
    currency: "HTG",
    frequency: "monthly",
    nextPayment: "2024-02-01",
    myPosition: 3,
    currentTurn: 1,
    status: "active",
    description: "Sol familial mensuel"
  },
  {
    id: 2,
    name: "Sol Bureau",
    solType: "work",
    participants: 12,
    participantsList: [
      { name: "Paul M.", position: 1, status: "paid" },
      { name: "Claire S.", position: 2, status: "paid" },
      { name: "Marc L.", position: 3, status: "paid" },
      { name: "Julie D.", position: 4, status: "paid" },
      { name: "Alex B.", position: 5, status: "current" },
      { name: "Nina G.", position: 6, status: "upcoming" },
      { name: "Vous", position: 7, status: "upcoming" }
    ],
    amount: 2000,
    currency: "HTG",
    frequency: "weekly",
    nextPayment: "2024-01-22",
    myPosition: 7,
    currentTurn: 5,
    status: "active",
    description: "Sol hebdomadaire entre collègues"
  }
];

function FinancialDashboard() {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [totalBalance, setTotalBalance] = useState({ HTG: 0, USD: 0 });
  const [selectedCurrency, setSelectedCurrency] = useState('HTG');

  // Calculer le solde total
  useEffect(() => {
    const totals = MOCK_DATA.accounts.reduce((acc, account) => {
      acc[account.currency] += account.balance;
      return acc;
    }, { HTG: 0, USD: 0 });
    
    setTotalBalance(totals);
  }, []);

  const handleSidenavToggle = () => setSidenavOpen(!sidenavOpen);

  const unreadNotifications = MOCK_DATA.notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      {/* Navigation */}
      <FinAppNavbar 
        onSidenavToggle={handleSidenavToggle}
        currency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        notifications={unreadNotifications}
      />
      
      <FinAppSidenav 
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        activePage="dashboard"
      />

      {/* Contenu principal */}
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          
          {/* Header avec solde total */}
          <MDBox mb={4}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Tableau de bord
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Bonjour ! Voici un aperçu de vos finances
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <CardContent>
                    <MDTypography variant="h6" color="white" opacity={0.8}>
                      Solde Total
                    </MDTypography>
                    <CurrencyDisplay
                      amount={totalBalance[selectedCurrency]}
                      currency={selectedCurrency}
                      variant="h4"
                      fontWeight="bold"
                      color="white"
                      showTrend={false}
                    />
                    <Chip 
                      label={`${selectedCurrency} • ${MOCK_DATA.accounts.length} comptes`}
                      size="small"
                      sx={{ 
                        mt: 1, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white' 
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </MDBox>

          {/* Section 1: Comptes */}
          <MDBox mb={4}>
            <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h5" fontWeight="medium">
                Mes Comptes
              </MDTypography>
              <MDButton variant="outlined" size="small" startIcon={<AddIcon />}>
                Ajouter un compte
              </MDButton>
            </MDBox>
            
            <Grid container spacing={3}>
              {MOCK_DATA.accounts.map((account) => (
                <Grid item xs={12} md={6} lg={4} key={account.id}>
                  <AccountSummaryCard
                    accountName={account.name}
                    bankName={account.bank}
                    accountNumber={account.accountNumber}
                    balance={account.balance}
                    currency={account.currency}
                    trend={account.trend}
                    trendDirection={account.trendDirection}
                    recentTransactions={account.transactions}
                    onViewDetails={() => console.log('Voir détails', account.id)}
                    onAddTransaction={() => console.log('Ajouter transaction', account.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>

          {/* Section 2: Budgets */}
          <MDBox mb={4}>
            <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h5" fontWeight="medium">
                Budgets en cours
              </MDTypography>
              <MDButton variant="outlined" size="small" startIcon={<AddIcon />}>
                Créer un budget
              </MDButton>
            </MDBox>
            
            <Grid container spacing={3}>
              {MOCK_DATA.budgets.map((budget) => (
                <Grid item xs={12} md={6} key={budget.id}>
                  <BudgetCard
                    budgetName={budget.name}
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
          </MDBox>

          {/* Section 3: Sols actifs */}
          <MDBox mb={4}>
            <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h5" fontWeight="medium">
                Sols/Tontines actifs
              </MDTypography>
              <MDButton variant="outlined" size="small" startIcon={<PeopleIcon />}>
                Rejoindre un sol
              </MDButton>
            </MDBox>
            
            <Grid container spacing={3}>
              {MOCK_DATA.sols.map((sol) => (
                <Grid item xs={12} md={6} key={sol.id}>
                  <SolCard
                    solName={sol.name}
                    solType={sol.type}
                    participants={sol.participants}
                    amount={sol.amount}
                    currency={sol.currency}
                    frequency={sol.frequency}
                    nextPayment={sol.nextPayment}
                    myPosition={sol.myPosition}
                    currentTurn={sol.currentTurn}
                    status={sol.status}
                    description={sol.description}
                    onViewDetails={() => console.log('Voir détails sol', sol.id)}
                    onMakePayment={() => console.log('Effectuer paiement', sol.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>

          {/* Section 4: Actions rapides */}
          <MDBox mb={4}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Actions rapides
                </MDTypography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDButton 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<AddIcon />}
                      onClick={() => console.log('Ajouter transaction')}
                    >
                      Transaction
                    </MDButton>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <MDButton 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<AccountBalanceWalletIcon />}
                      onClick={() => console.log('Voir comptes')}
                    >
                      Comptes
                    </MDButton>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <MDButton 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<PeopleIcon />}
                      onClick={() => console.log('Créer sol')}
                    >
                      Créer Sol
                    </MDButton>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <MDButton 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<TrendingUpIcon />}
                      onClick={() => console.log('Voir investissements')}
                    >
                      Investir
                    </MDButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </MDBox>

          {/* Section 5: Notifications importantes */}
          {MOCK_DATA.notifications.length > 0 && (
            <MDBox mb={4}>
              <Card sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                <CardContent>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <Badge badgeContent={unreadNotifications} color="error">
                      <NotificationsIcon sx={{ mr: 1 }} />
                    </Badge>
                    <MDTypography variant="h6" fontWeight="medium">
                      Notifications importantes
                    </MDTypography>
                  </MDBox>
                  
                  {MOCK_DATA.notifications.slice(0, 2).map((notification) => (
                    <MDBox key={notification.id} mb={1}>
                      <MDTypography variant="body2" fontWeight="medium">
                        {notification.title}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {notification.message}
                      </MDTypography>
                    </MDBox>
                  ))}
                  
                  {MOCK_DATA.notifications.length > 2 && (
                    <MDButton size="small" sx={{ mt: 1 }}>
                      Voir toutes les notifications
                    </MDButton>
                  )}
                </CardContent>
              </Card>
            </MDBox>
          )}
        </Container>
      </MDBox>

      {/* Bouton flottant pour transaction rapide */}
      <Fab
        color="primary"
        aria-label="add-transaction"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 16 }, // Plus haut sur mobile pour éviter la bottom nav
          right: 16,
          zIndex: 1000
        }}
        onClick={() => console.log('Ouvrir formulaire transaction rapide')}
      >
        <AddIcon />
      </Fab>
    </DashboardLayout>
  );
}

export default FinancialDashboard;