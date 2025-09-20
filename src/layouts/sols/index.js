// src/layouts/sols/index.js - MISE À JOUR avec SolsTable
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// @mui icons
import PeopleIcon from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import FinAppNavbar from '../../examples/Navbars/FinAppNavbar';
import FinAppSidenav from '../../examples/Sidenav/FinAppSidenav';
import Footer from 'examples/Footer';

// Composants Sols
import SolCard from '../../components/FinApp/SolCard/index';
import CurrencyDisplay from '../../components/FinApp/CurrencyDisplay/index';
import SolTimelineChart from '../../examples/Charts/FinanceCharts/SolChart';
import SolPerformanceChart from '../../components/FinApp/SolPerformanceChart';

// NOUVEAU: Composant SolsTable
import SolsTable from '../../components/FinApp/SolsTable';

// Données mockées des sols COMPLÈTES et ÉTENDUES
const MOCK_SOLS = [
  {
    id: 1,
    name: "Sol Famille Janvier",
    solType: "family",
    participants: 8,
    amount: 5000,
    currency: "HTG",
    frequency: "monthly",
    nextPayment: "2024-02-01",
    myPosition: 3,
    currentTurn: 2,
    status: "active",
    description: "Sol familial mensuel pour soutien mutuel",
    organizer: "Marie Dupont",
    startDate: "2024-01-01",
    endDate: "2024-08-01",
    totalAmount: 40000,
    participantsList: [
      { id: 1, name: "Marie D.", position: 1, status: "paid", avatar: null },
      { id: 2, name: "Jean P.", position: 2, status: "current", avatar: null },
      { id: 3, name: "Vous", position: 3, status: "upcoming", avatar: null },
      { id: 4, name: "Sophie L.", position: 4, status: "upcoming", avatar: null },
      { id: 5, name: "Pierre M.", position: 5, status: "upcoming", avatar: null },
      { id: 6, name: "Anna C.", position: 6, status: "upcoming", avatar: null },
      { id: 7, name: "David R.", position: 7, status: "upcoming", avatar: null },
      { id: 8, name: "Lisa T.", position: 8, status: "upcoming", avatar: null }
    ],
    payments: [
      { participantId: 1, round: 1, paid: true, amount: 5000, date: "2024-01-01" },
      { participantId: 2, round: 1, paid: true, amount: 5000, date: "2024-01-05" },
      { participantId: 3, round: 1, paid: true, amount: 5000, date: "2024-01-07" },
      { participantId: 4, round: 1, paid: true, amount: 5000, date: "2024-01-10" },
      { participantId: 5, round: 1, paid: false, amount: 5000, date: null },
      { participantId: 1, round: 2, paid: true, amount: 5000, date: "2024-02-01" },
      { participantId: 2, round: 2, paid: false, amount: 5000, date: null }
    ]
  },
  {
    id: 2,
    name: "Sol Bureau Hebdomadaire",
    solType: "work",
    participants: 12,
    amount: 2000,
    currency: "HTG",
    frequency: "weekly",
    nextPayment: "2024-01-22",
    myPosition: 7,
    currentTurn: 5,
    status: "active",
    description: "Sol hebdomadaire entre collègues",
    organizer: "Paul Martin",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    totalAmount: 24000,
    participantsList: [
      { id: 1, name: "Paul M.", position: 1, status: "paid", avatar: null },
      { id: 2, name: "Claire S.", position: 2, status: "paid", avatar: null },
      { id: 3, name: "Marc L.", position: 3, status: "paid", avatar: null },
      { id: 4, name: "Julie D.", position: 4, status: "paid", avatar: null },
      { id: 5, name: "Alex B.", position: 5, status: "current", avatar: null },
      { id: 6, name: "Sarah K.", position: 6, status: "upcoming", avatar: null },
      { id: 7, name: "Vous", position: 7, status: "upcoming", avatar: null },
      { id: 8, name: "Thomas R.", position: 8, status: "upcoming", avatar: null },
      { id: 9, name: "Emma L.", position: 9, status: "upcoming", avatar: null },
      { id: 10, name: "Lucas M.", position: 10, status: "upcoming", avatar: null },
      { id: 11, name: "Olivia D.", position: 11, status: "upcoming", avatar: null },
      { id: 12, name: "Noah S.", position: 12, status: "upcoming", avatar: null }
    ],
    payments: [
      { participantId: 1, round: 1, paid: true, amount: 2000, date: "2024-01-01" },
      { participantId: 2, round: 1, paid: true, amount: 2000, date: "2024-01-01" },
      { participantId: 3, round: 1, paid: true, amount: 2000, date: "2024-01-02" }
    ]
  },
  {
    id: 3,
    name: "Sol Investissement",
    solType: "investment",
    participants: 5,
    amount: 10000,
    currency: "HTG",
    frequency: "monthly",
    nextPayment: "2024-02-15",
    myPosition: 2,
    currentTurn: 1,
    status: "active",
    description: "Sol pour financer des investissements communs",
    organizer: "Vous",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    totalAmount: 50000,
    participantsList: [
      { id: 1, name: "Vous", position: 1, status: "current", avatar: null },
      { id: 2, name: "Michel C.", position: 2, status: "upcoming", avatar: null },
      { id: 3, name: "Carla P.", position: 3, status: "upcoming", avatar: null },
      { id: 4, name: "Roger D.", position: 4, status: "upcoming", avatar: null },
      { id: 5, name: "Nina L.", position: 5, status: "upcoming", avatar: null }
    ],
    payments: [
      { participantId: 1, round: 1, paid: true, amount: 10000, date: "2024-01-15" },
      { participantId: 2, round: 1, paid: true, amount: 10000, date: "2024-01-16" },
      { participantId: 3, round: 1, paid: false, amount: 10000, date: null }
    ]
  },
  {
    id: 4,
    name: "Sol Quartier Delmas",
    solType: "neighborhood",
    participants: 15,
    amount: 1500,
    currency: "HTG",
    frequency: "weekly",
    nextPayment: "2024-01-25",
    myPosition: 10,
    currentTurn: 3,
    status: "active",
    description: "Sol communautaire du quartier",
    organizer: "Madame Rose",
    startDate: "2024-01-08",
    endDate: "2024-04-15",
    totalAmount: 22500,
    participantsList: [
      { id: 1, name: "Madame Rose", position: 1, status: "paid", avatar: null },
      { id: 2, name: "Ti Pierre", position: 2, status: "paid", avatar: null },
      { id: 3, name: "Manman Claudette", position: 3, status: "current", avatar: null },
      { id: 4, name: "Jean-Claude", position: 4, status: "upcoming", avatar: null },
      { id: 5, name: "Marie-Ange", position: 5, status: "upcoming", avatar: null }
      // ... autres participants
    ],
    payments: []
  },
  {
    id: 5,
    name: "Sol Business Partagé",
    solType: "business",
    participants: 6,
    amount: 8000,
    currency: "HTG",
    frequency: "monthly",
    nextPayment: "2024-02-05",
    myPosition: 4,
    currentTurn: 2,
    status: "active",
    description: "Sol pour financer projets business",
    organizer: "Entrepreneur Group",
    startDate: "2024-01-05",
    endDate: "2024-07-05",
    totalAmount: 48000,
    participantsList: [
      { id: 1, name: "Boss Steeve", position: 1, status: "paid", avatar: null },
      { id: 2, name: "Madame Jean", position: 2, status: "current", avatar: null },
      { id: 3, name: "Ti Kom", position: 3, status: "upcoming", avatar: null },
      { id: 4, name: "Vous", position: 4, status: "upcoming", avatar: null },
      { id: 5, name: "Manman Paul", position: 5, status: "upcoming", avatar: null },
      { id: 6, name: "Boss Michel", position: 6, status: "upcoming", avatar: null }
    ],
    payments: []
  },
  {
    id: 6,
    name: "Sol Amis Université",
    solType: "friends",
    participants: 10,
    amount: 3000,
    currency: "HTG",
    frequency: "biweekly",
    nextPayment: "2024-01-30",
    myPosition: 8,
    currentTurn: 4,
    status: "active",
    description: "Sol entre anciens camarades d'université",
    organizer: "Groupe UEH 2020",
    startDate: "2024-01-02",
    endDate: "2024-05-30",
    totalAmount: 30000,
    participantsList: [],
    payments: []
  }
];

function SolsPage() {
  // États pour navigation
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("HTG");
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // États pour gestion des sols
  const [sols, setSols] = useState(MOCK_SOLS);
  const [selectedSol, setSelectedSol] = useState(null);

  const handleSidenavToggle = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Gestionnaires d'événements pour SolsTable
  const handleSolJoin = (joinData) => {
    console.log("Rejoindre sol:", joinData);
    // TODO: Intégrer avec l'API pour rejoindre un sol
  };

  const handleSolCreate = (solData) => {
    console.log("Créer sol:", solData);
    // TODO: Intégrer avec l'API pour créer un nouveau sol
    const newSol = {
      ...solData,
      id: Date.now(),
      status: 'active',
      currentTurn: 1,
      myPosition: 1, // Créateur est en position 1
      organizer: "Vous"
    };
    setSols([...sols, newSol]);
  };

  const handleSolPayment = (sol) => {
    console.log("Effectuer paiement pour sol:", sol);
    // TODO: Ouvrir modal de paiement
  };

  const handleSolDetails = (sol) => {
    console.log("Voir détails du sol:", sol);
    setSelectedSol(sol);
    // TODO: Ouvrir modal ou naviguer vers page détail
  };

  const handleSolLeave = (solId) => {
    console.log("Quitter sol:", solId);
    // TODO: Intégrer avec l'API pour quitter le sol
    setSols(sols.filter(s => s.id !== solId));
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log(`Action groupée ${action} sur:`, selectedIds);
    // TODO: Implémenter actions groupées
  };

  const handleRoundClick = (roundData, roundIndex) => {
    console.log('Tour cliqué:', roundData, 'Index:', roundIndex);
    // TODO: Ouvrir modal avec détails du tour
  };

  // Calculer les statistiques globales
  const stats = {
    totalSols: sols.length,
    activeSols: sols.filter(s => s.status === "active").length,
    totalInvested: sols.reduce((sum, sol) => {
      const myContributions = Math.min(sol.currentTurn, sol.myPosition) * sol.amount;
      return sum + myContributions;
    }, 0),
    totalToReceive: sols.reduce((sum, sol) => sum + (sol.amount * sol.participants), 0),
    nextPayments: sols.filter(s => s.status === "active").length,
    upcomingReceptions: sols.filter(s => {
      const turnsUntilMe = (s.myPosition - s.currentTurn + s.participants) % s.participants;
      return turnsUntilMe <= 2 && turnsUntilMe > 0;
    }).length
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Statistiques principales */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color="primary" fontWeight="medium">
                Sols Actifs
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold">
                {stats.activeSols}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Sur {stats.totalSols} total
              </MDTypography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light' }}>
              <MDTypography variant="h6" color="error.dark" fontWeight="medium">
                Total Investi
              </MDTypography>
              <CurrencyDisplay
                amount={stats.totalInvested}
                currency={selectedCurrency}
                variant="h4"
                fontWeight="bold"
                color="error.dark"
                showSymbol={true}
              />
              <MDTypography variant="body2" color="error.dark">
                Contributions
              </MDTypography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light' }}>
              <MDTypography variant="h6" color="success.dark" fontWeight="medium">
                À Recevoir
              </MDTypography>
              <CurrencyDisplay
                amount={stats.totalToReceive}
                currency={selectedCurrency}
                variant="h4"
                fontWeight="bold"
                color="success.dark"
                showSymbol={true}
              />
              <MDTypography variant="body2" color="success.dark">
                Potentiel total
              </MDTypography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light' }}>
              <MDTypography variant="h6" color="warning.dark" fontWeight="medium">
                Tours Proches
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold" color="warning.dark">
                {stats.upcomingReceptions}
              </MDTypography>
              <MDTypography variant="body2" color="warning.dark">
                Bientôt votre tour
              </MDTypography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* NOUVEAU: SolsTable intégrée */}
      <Grid item xs={12}>
        <SolsTable
          sols={sols}
          currency={selectedCurrency}
          title="Mes Sols/Tontines"
          showQuickAdd={true}
          showFilters={true}
          showExport={true}
          height={600}
          pageSize={25}
          viewMode="table"
          onSolJoin={handleSolJoin}
          onSolCreate={handleSolCreate}
          onSolPayment={handleSolPayment}
          onSolDetails={handleSolDetails}
          onSolLeave={handleSolLeave}
          onBulkAction={handleBulkAction}
        />
      </Grid>
    </Grid>
  );

  const renderTimelineTab = () => (
    <Grid container spacing={3}>
      {/* Charts de performance */}
      <Grid item xs={12} md={6}>
        <SolPerformanceChart
          sols={sols}
          currency={selectedCurrency}
          title="Performance des Sols"
          defaultPeriod="6m"
          height={400}
          onSolClick={handleSolDetails}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <SolTimelineChart
          solData={selectedSol || sols[0]}
          viewMode="timeline"
          orientation="horizontal"
          size="large"
          onRoundClick={handleRoundClick}
        />
      </Grid>

      {/* Cartes individuelles des sols */}
      <Grid item xs={12}>
        <MDTypography variant="h6" fontWeight="medium" mb={2}>
          Vue Cartes des Sols
        </MDTypography>
        <Grid container spacing={3}>
          {sols.slice(0, 4).map((sol) => (
            <Grid item xs={12} sm={6} lg={3} key={sol.id}>
              <SolCard
                sol={sol}
                currency={selectedCurrency}
                showActions={true}
                onClick={() => handleSolDetails(sol)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info">
          <MDTypography variant="body2" fontWeight="medium">
            Analytics Sols avancées
          </MDTypography>
          <MDTypography variant="caption">
            Analyses de performance, prédictions de cash-flow, optimisation des positions
          </MDTypography>
        </Alert>
      </Grid>
      
      {/* Performance globale */}
      <Grid item xs={12}>
        <SolPerformanceChart
          sols={sols}
          currency={selectedCurrency}
          title="Analyse Complète de Performance"
          defaultPeriod="1y"
          defaultView="comparison"
          height={500}
          showComparison={true}
          onSolClick={handleSolDetails}
        />
      </Grid>
    </Grid>
  );

  return (
    <DashboardLayout>
      {/* Navigation */}
      <FinAppNavbar 
        onSidenavToggle={handleSidenavToggle}
        currency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        notifications={stats.upcomingReceptions + stats.nextPayments}
      />
      
      <FinAppSidenav 
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        activePage="sols"
      />

      {/* Contenu principal */}
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          
          {/* Header */}
          <MDBox mb={4}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Mes Sols/Tontines
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Gérez tous vos sols avec une table avancée et des analytics
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <MDBox display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
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
                <Tab label="Table Avancée" />
                <Tab label="Timeline & Cartes" />
                <Tab label="Analytics" />
              </Tabs>
            </Card>
          </MDBox>

          {/* Contenu des onglets */}
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderTimelineTab()}
          {activeTab === 2 && renderAnalyticsTab()}

        </Container>
      </MDBox>

      {/* Menu actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { console.log('Créer sol'); handleMenuClose(); }}>
          Créer un nouveau sol
        </MenuItem>
        <MenuItem onClick={() => { console.log('Rejoindre sol'); handleMenuClose(); }}>
          Rejoindre un sol
        </MenuItem>
        <MenuItem onClick={() => { console.log('Export rapport'); handleMenuClose(); }}>
          Exporter rapport
        </MenuItem>
        <MenuItem onClick={() => { console.log('Paramètres sols'); handleMenuClose(); }}>
          Paramètres
        </MenuItem>
      </Menu>
      
      <Footer />
    </DashboardLayout>
  );
}

export default SolsPage;