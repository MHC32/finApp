// src/layouts/sols/index.js - MISE À JOUR AVEC SolTimelineChart

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
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

// @mui icons
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ShareIcon from '@mui/icons-material/Share';
import QrCodeIcon from '@mui/icons-material/QrCode';
import TimelineIcon from '@mui/icons-material/Timeline';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components selon structure définie
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import SolCard from '../../components/FinApp/SolCard/index';
import CurrencyDisplay from '../../components/FinApp/CurrencyDisplay/index';
import SolTimelineChart from '../../examples/Charts/FinanceCharts/SolChart'; // NOUVEAU selon structure

// Données mockées des sols COMPLÈTES pour SolTimelineChart
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
  }
];

function SolsPage() {
  // États pour la gestion des onglets et données
  const [activeTab, setActiveTab] = useState(0);
  const [sols, setSols] = useState(MOCK_SOLS);
  const [selectedSol, setSelectedSol] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Calculer les statistiques globales
  const stats = {
    totalSols: sols.length,
    activeSols: sols.filter(s => s.status === "active").length,
    totalInvested: sols.reduce((sum, sol) => sum + (sol.amount * sol.myPosition), 0),
    totalToReceive: sols.reduce((sum, sol) => sum + (sol.amount * sol.participants), 0),
    nextPayments: sols.filter(s => s.status === "active").length,
    upcomingReceptions: sols.filter(s => s.currentTurn === s.myPosition).length
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

  const handleSolClick = (sol) => {
    setSelectedSol(sol);
    console.log('Sol sélectionné:', sol);
  };

  const handleRoundClick = (roundData, roundIndex) => {
    console.log('Tour cliqué:', roundData, 'Index:', roundIndex);
    // Ici on pourrait ouvrir un modal avec détails du tour
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
                sur {stats.totalSols} total
              </MDTypography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color="success" fontWeight="medium">
                À Recevoir
              </MDTypography>
              <CurrencyDisplay
                amount={stats.totalToReceive}
                currency="HTG"
                variant="h4"
                fontWeight="bold"
              />
              <MDTypography variant="body2" color="text">
                Montants totaux
              </MDTypography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color="warning" fontWeight="medium">
                Investissement
              </MDTypography>
              <CurrencyDisplay
                amount={stats.totalInvested}
                currency="HTG"
                variant="h4"
                fontWeight="bold"
              />
              <MDTypography variant="body2" color="text">
                Total investi
              </MDTypography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircleIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color="info" fontWeight="medium">
                Prochains Tours
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold">
                {stats.upcomingReceptions}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Réceptions à venir
              </MDTypography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Cartes sols individuelles */}
      <Grid item xs={12}>
        <MDBox mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            Mes Sols Actifs
          </MDTypography>
        </MDBox>
        <Grid container spacing={3}>
          {sols.filter(sol => filterStatus === "all" || sol.status === filterStatus).map((sol) => (
            <Grid item xs={12} sm={6} lg={4} key={sol.id}>
              <SolCard
                solType={sol.solType}
                solName={sol.name}
                participants={sol.participants}
                participantsList={sol.participantsList}
                amount={sol.amount}
                currency={sol.currency}
                frequency={sol.frequency}
                nextPayment={sol.nextPayment}
                myPosition={sol.myPosition}
                currentTurn={sol.currentTurn}
                status={sol.status}
                description={sol.description}
                onClick={() => handleSolClick(sol)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  const renderTimelineTab = () => (
    <Grid container spacing={3}>
      {/* Timeline pour chaque sol actif */}
      {sols.filter(sol => sol.status === "active").map((sol) => (
        <Grid item xs={12} key={sol.id}>
          <SolTimelineChart
            solData={sol}
            viewMode="stepper"
            orientation="horizontal"
            showPaymentStatus={true}
            showDates={true}
            showAmounts={true}
            showParticipants={true}
            size="large"
            title="Timeline du Sol"
            onRoundClick={handleRoundClick}
          />
        </Grid>
      ))}

      {/* Vue compacte de tous les sols */}
      <Grid item xs={12}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Vue d'ensemble des Timelines
            </MDTypography>
            
            <Grid container spacing={2}>
              {sols.filter(sol => sol.status === "active").map((sol) => (
                <Grid item xs={12} md={6} key={sol.id}>
                  <SolTimelineChart
                    solData={sol}
                    viewMode="timeline"
                    orientation="horizontal"
                    showPaymentStatus={false}
                    showDates={false}
                    showAmounts={false}
                    showParticipants={true}
                    size="medium"
                    title={sol.name}
                    onRoundClick={(round) => {
                      console.log(`Round cliqué pour ${sol.name}:`, round);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCalendarTab = () => (
    <Grid container spacing={3}>
      {/* Graphique timeline pour sol sélectionné */}
      {selectedSol && (
        <Grid item xs={12}>
          <SolTimelineChart
            solData={selectedSol}
            viewMode="chart"
            orientation="horizontal"
            showPaymentStatus={true}
            showDates={true}
            showAmounts={true}
            showParticipants={true}
            size="large"
            title={`Progression - ${selectedSol.name}`}
            onRoundClick={handleRoundClick}
          />
        </Grid>
      )}

      {/* Sélecteur de sol */}
      <Grid item xs={12}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Calendrier des Sols
            </MDTypography>
            
            <MDBox display="flex" gap={2} mb={3} flexWrap="wrap">
              {sols.map((sol) => (
                <Chip
                  key={sol.id}
                  label={sol.name}
                  onClick={() => setSelectedSol(sol)}
                  color={selectedSol?.id === sol.id ? "primary" : "default"}
                  variant={selectedSol?.id === sol.id ? "filled" : "outlined"}
                />
              ))}
            </MDBox>

            {!selectedSol && (
              <Alert severity="info">
                <MDTypography variant="body2" fontWeight="medium">
                  Sélectionnez un sol pour voir sa timeline détaillée
                </MDTypography>
              </Alert>
            )}
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
                    Mes Sols & Tontines
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Gérez vos participations aux sols
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
                label="Mes Sols" 
                icon={<PeopleIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Timeline" 
                icon={<TimelineIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Calendrier" 
                icon={<CalendarTodayIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Card>
        </MDBox>

        {/* Contenu des onglets */}
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderTimelineTab()}
        {activeTab === 2 && renderCalendarTab()}

        {/* Bouton flottant pour nouveau sol */}
        <Fab
          color="primary"
          aria-label="add sol"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => console.log('Créer nouveau sol')}
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
            Créer nouveau sol
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Rejoindre un sol
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Exporter calendrier
          </MenuItem>
        </Menu>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SolsPage;