// src/layouts/sols/index.js
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
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

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

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import FinAppNavbar from '../../examples/Navbars/FinAppNavbar/index';
import FinAppSidenav from '../../examples/Sidenav/FinAppSidenav';
import SolCard from '../../components/FinApp/SolCard/index';
import CurrencyDisplay from '../../components/FinApp/CurrencyDisplay/index';

// Layout components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Données mockées des sols/tontines
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
    currentTurn: 1,
    status: "active",
    description: "Sol familial mensuel pour soutien mutuel",
    organizer: "Marie Dupont",
    startDate: "2024-01-01",
    endDate: "2024-08-01",
    totalAmount: 40000,
    participantsList: [
      { name: "Marie D.", position: 1, status: "paid", avatar: "/avatar1.jpg" },
      { name: "Jean P.", position: 2, status: "pending", avatar: "/avatar2.jpg" },
      { name: "Vous", position: 3, status: "upcoming", avatar: "/avatar3.jpg" },
      { name: "Sophie L.", position: 4, status: "upcoming", avatar: "/avatar4.jpg" },
      { name: "Pierre M.", position: 5, status: "upcoming", avatar: "/avatar5.jpg" },
      { name: "Anna C.", position: 6, status: "upcoming", avatar: "/avatar6.jpg" },
      { name: "David R.", position: 7, status: "upcoming", avatar: "/avatar7.jpg" },
      { name: "Lisa T.", position: 8, status: "upcoming", avatar: "/avatar8.jpg" }
    ]
  },
  {
    id: 2,
    name: "Sol Bureau Hebdo",
    solType: "work",
    participants: 12,
    amount: 2000,
    currency: "HTG",
    frequency: "weekly",
    nextPayment: "2024-01-22",
    myPosition: 7,
    currentTurn: 5,
    status: "active",
    description: "Sol hebdomadaire entre collègues de bureau",
    organizer: "Paul Martin",
    startDate: "2024-01-01",
    endDate: "2024-03-25",
    totalAmount: 24000,
    participantsList: [
      { name: "Paul M.", position: 1, status: "paid", avatar: "/avatar9.jpg" },
      { name: "Claire S.", position: 2, status: "paid", avatar: "/avatar10.jpg" },
      { name: "Marc L.", position: 3, status: "paid", avatar: "/avatar11.jpg" },
      { name: "Julie D.", position: 4, status: "paid", avatar: "/avatar12.jpg" },
      { name: "Alex B.", position: 5, status: "current", avatar: "/avatar13.jpg" },
      { name: "Nina G.", position: 6, status: "upcoming", avatar: "/avatar14.jpg" },
      { name: "Vous", position: 7, status: "upcoming", avatar: "/avatar15.jpg" }
    ]
  },
  {
    id: 3,
    name: "Sol Investissement",
    solType: "investment",
    participants: 6,
    amount: 10000,
    currency: "HTG",
    frequency: "monthly",
    nextPayment: "2024-02-15",
    myPosition: 2,
    currentTurn: 1,
    status: "active",
    description: "Sol pour investissement collectif en agriculture",
    organizer: "Robert Charles",
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    totalAmount: 60000,
    participantsList: [
      { name: "Robert C.", position: 1, status: "current", avatar: "/avatar16.jpg" },
      { name: "Vous", position: 2, status: "upcoming", avatar: "/avatar17.jpg" },
      { name: "Michel T.", position: 3, status: "upcoming", avatar: "/avatar18.jpg" },
      { name: "Grace M.", position: 4, status: "upcoming", avatar: "/avatar19.jpg" },
      { name: "Jose L.", position: 5, status: "upcoming", avatar: "/avatar20.jpg" },
      { name: "Carmen F.", position: 6, status: "upcoming", avatar: "/avatar21.jpg" }
    ]
  },
  {
    id: 4,
    name: "Sol Étudiant USD",
    solType: "student",
    participants: 10,
    amount: 50,
    currency: "USD",
    frequency: "monthly",
    nextPayment: "2024-02-10",
    myPosition: 5,
    currentTurn: 2,
    status: "active",
    description: "Sol en USD pour étudiants en études supérieures",
    organizer: "Sandra Joseph",
    startDate: "2024-01-10",
    endDate: "2024-10-10",
    totalAmount: 500,
    participantsList: [
      { name: "Sandra J.", position: 1, status: "paid", avatar: "/avatar22.jpg" },
      { name: "Kevin R.", position: 2, status: "current", avatar: "/avatar23.jpg" },
      { name: "Melody P.", position: 3, status: "upcoming", avatar: "/avatar24.jpg" },
      { name: "James L.", position: 4, status: "upcoming", avatar: "/avatar25.jpg" },
      { name: "Vous", position: 5, status: "upcoming", avatar: "/avatar26.jpg" }
    ]
  },
  {
    id: 5,
    name: "Sol Communauté",
    solType: "community",
    participants: 15,
    amount: 3000,
    currency: "HTG",
    frequency: "biweekly",
    nextPayment: "2024-01-25",
    myPosition: 12,
    currentTurn: 3,
    status: "active",
    description: "Sol communautaire bi-mensuel pour entraide sociale",
    organizer: "Father Antoine",
    startDate: "2024-01-01",
    endDate: "2024-08-01",
    totalAmount: 45000,
    participantsList: [
      { name: "Father A.", position: 1, status: "paid", avatar: "/avatar27.jpg" },
      { name: "Maria S.", position: 2, status: "paid", avatar: "/avatar28.jpg" },
      { name: "Carlos M.", position: 3, status: "current", avatar: "/avatar29.jpg" }
    ]
  }
];

function SolsPage() {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('HTG');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('active');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sols, setSols] = useState(MOCK_SOLS);

  // Calcul des statistiques
  const [stats, setStats] = useState({
    totalActive: 0,
    totalAmount: { HTG: 0, USD: 0 },
    nextPayments: 0,
    myTurn: 0
  });

  useEffect(() => {
    const activeSols = sols.filter(sol => sol.status === 'active');
    const newStats = {
      totalActive: activeSols.length,
      totalAmount: activeSols.reduce((acc, sol) => {
        acc[sol.currency] += sol.amount;
        return acc;
      }, { HTG: 0, USD: 0 }),
      nextPayments: activeSols.filter(sol => {
        const nextDate = new Date(sol.nextPayment);
        const today = new Date();
        const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length,
      myTurn: activeSols.filter(sol => sol.myPosition === sol.currentTurn + 1).length
    };
    setStats(newStats);
  }, [sols]);

  // Filtrer les sols
  const filteredSols = sols.filter(sol => {
    switch (selectedFilter) {
      case 'active': return sol.status === 'active';
      case 'my-turn': return sol.myPosition === sol.currentTurn + 1;
      case 'htg': return sol.currency === 'HTG';
      case 'usd': return sol.currency === 'USD';
      case 'family': return sol.solType === 'family';
      case 'work': return sol.solType === 'work';
      case 'investment': return sol.solType === 'investment';
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
      case 'active': return 'Sols actifs';
      case 'my-turn': return 'Mon tour';
      case 'htg': return 'HTG seulement';
      case 'usd': return 'USD seulement';
      case 'family': return 'Famille';
      case 'work': return 'Travail';
      case 'investment': return 'Investissement';
      default: return 'Tous les sols';
    }
  };

  const getUpcomingPayments = () => {
    return sols.filter(sol => {
      const nextDate = new Date(sol.nextPayment);
      const today = new Date();
      const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment));
  };

  return (
    <DashboardLayout>
      {/* Navigation */}
      <FinAppNavbar 
        onSidenavToggle={handleSidenavToggle}
        currency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        notifications={stats.nextPayments}
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
              <Grid item xs={12} md={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Mes Sols/Tontines
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Gérez vos participations aux sols traditionnels haïtiens
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'primary.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h4" color="primary.dark" fontWeight="bold">
                          {stats.totalActive}
                        </MDTypography>
                        <MDTypography variant="caption" color="primary.dark">
                          Sols actifs
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'warning.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h4" color="warning.dark" fontWeight="bold">
                          {stats.nextPayments}
                        </MDTypography>
                        <MDTypography variant="caption" color="warning.dark">
                          Paiements cette semaine
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>

          {/* Alertes importantes */}
          {stats.myTurn > 0 && (
            <MDBox mb={3}>
              <Alert severity="success" sx={{ alignItems: 'center' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <CheckCircleIcon />
                  </Grid>
                  <Grid item xs>
                    <MDTypography variant="body2" fontWeight="medium">
                      <strong>C'est bientôt votre tour !</strong> Vous recevrez 
                      {stats.myTurn === 1 ? ' un paiement' : ` ${stats.myTurn} paiements`} prochainement.
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant="outlined" color="success">
                      Voir détails
                    </MDButton>
                  </Grid>
                </Grid>
              </Alert>
            </MDBox>
          )}

          {stats.nextPayments > 0 && (
            <MDBox mb={3}>
              <Alert severity="warning" sx={{ alignItems: 'center' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <WarningIcon />
                  </Grid>
                  <Grid item xs>
                    <MDTypography variant="body2" fontWeight="medium">
                      <strong>Paiements à effectuer :</strong> Vous avez {stats.nextPayments} paiement
                      {stats.nextPayments > 1 ? 's' : ''} à effectuer cette semaine.
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant="outlined" color="warning">
                      Payer maintenant
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
              <Tab label="Mes Sols" />
              <Tab label="Calendrier" />
              <Tab label="Statistiques" />
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
                      <MenuItem onClick={() => handleFilterSelect('active')}>
                        Sols actifs
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('my-turn')}>
                        Mon tour
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleFilterSelect('htg')}>
                        HTG seulement
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('usd')}>
                        USD seulement
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleFilterSelect('family')}>
                        Famille
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('work')}>
                        Travail
                      </MenuItem>
                      <MenuItem onClick={() => handleFilterSelect('investment')}>
                        Investissement
                      </MenuItem>
                    </Menu>
                  </Grid>
                  
                  <Grid item xs />
                  
                  <Grid item>
                    <MDButton 
                      variant="outlined" 
                      size="small" 
                      startIcon={<QrCodeIcon />}
                      onClick={() => console.log('Rejoindre par QR')}
                    >
                      Scanner QR
                    </MDButton>
                  </Grid>
                  
                  <Grid item>
                    <MDButton 
                      variant="contained" 
                      size="small" 
                      startIcon={<AddIcon />}
                      onClick={() => console.log('Créer sol')}
                    >
                      Créer un sol
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>

              {/* Liste des sols */}
              <Grid container spacing={3}>
                {filteredSols.map((sol) => (
                  <Grid item xs={12} md={6} lg={4} key={sol.id}>
                    <SolCard
                      solName={sol.name}
                      solType={sol.solType}
                      participants={sol.participants}
                      amount={sol.amount}
                      currency={sol.currency}
                      frequency={sol.frequency}
                      nextPayment={sol.nextPayment}
                      myPosition={sol.myPosition}
                      currentTurn={sol.currentTurn}
                      status={sol.status}
                      description={sol.description}
                      onViewDetails={() => console.log('Voir détails', sol.id)}
                      onMakePayment={() => console.log('Effectuer paiement', sol.id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Message si aucun sol */}
              {filteredSols.length === 0 && (
                <MDBox textAlign="center" py={6}>
                  <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <MDTypography variant="h6" color="text" mb={1}>
                    Aucun sol trouvé
                  </MDTypography>
                  <MDTypography variant="body2" color="text" mb={3}>
                    Créez votre premier sol ou rejoignez un sol existant
                  </MDTypography>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <MDButton 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Créer sol')}
                      >
                        Créer un sol
                      </MDButton>
                    </Grid>
                    <Grid item>
                      <MDButton 
                        variant="outlined" 
                        startIcon={<QrCodeIcon />}
                        onClick={() => console.log('Rejoindre sol')}
                      >
                        Rejoindre un sol
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              )}
            </>
          )}

          {/* Onglet Calendrier */}
          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={3}>
                      Prochains paiements
                    </MDTypography>
                    
                    <Timeline>
                      {getUpcomingPayments().map((sol) => (
                        <TimelineItem key={sol.id}>
                          <TimelineSeparator>
                            <TimelineDot color="primary">
                              <CalendarTodayIcon fontSize="small" />
                            </TimelineDot>
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                            <MDBox mb={2}>
                              <MDTypography variant="h6" fontWeight="medium">
                                {sol.name}
                              </MDTypography>
                              <MDTypography variant="body2" color="text">
                                {new Date(sol.nextPayment).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </MDTypography>
                              <CurrencyDisplay
                                amount={sol.amount}
                                currency={sol.currency}
                                variant="h6"
                                color="primary"
                                showTrend={false}
                              />
                            </MDBox>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Résumé mensuel
                    </MDTypography>
                    
                    <MDBox mb={2}>
                      <MDTypography variant="body2" color="text">
                        Total à payer ce mois
                      </MDTypography>
                      <CurrencyDisplay
                        amount={stats.totalAmount.HTG}
                        currency="HTG"
                        variant="h5"
                        fontWeight="bold"
                        showTrend={false}
                      />
                    </MDBox>
                    
                    <MDBox mb={2}>
                      <MDTypography variant="body2" color="text">
                        En USD
                      </MDTypography>
                      <CurrencyDisplay
                        amount={stats.totalAmount.USD}
                        currency="USD"
                        variant="h5"
                        fontWeight="bold"
                        showTrend={false}
                      />
                    </MDBox>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Onglet Statistiques */}
          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={3}>
                      Mes statistiques de sols
                    </MDTypography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={3}>
                        <MDBox textAlign="center">
                          <MDTypography variant="h4" color="primary.main" fontWeight="bold">
                            {sols.filter(s => s.status === 'active').length}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Sols actifs
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <MDBox textAlign="center">
                          <MDTypography variant="h4" color="success.main" fontWeight="bold">
                            {sols.reduce((acc, sol) => acc + sol.participants, 0)}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Total participants
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <MDBox textAlign="center">
                          <MDTypography variant="h4" color="info.main" fontWeight="bold">
                            {sols.reduce((acc, sol) => acc + sol.amount, 0).toLocaleString()}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Montant total mensuel
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <MDBox textAlign="center">
                          <MDTypography variant="h4" color="warning.main" fontWeight="bold">
                            {Math.round(sols.reduce((acc, sol) => acc + sol.amount * sol.participants, 0) / sols.length || 0).toLocaleString()}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            Montant moyen à recevoir
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

      {/* Boutons flottants */}
      <Fab
        color="primary"
        aria-label="create-sol"
        sx={{
          position: 'fixed',
          bottom: { xs: 140, md: 76 },
          right: 16,
          zIndex: 1000
        }}
        onClick={() => console.log('Créer un sol')}
      >
        <AddIcon />
      </Fab>
      
      <Fab
        color="secondary"
        aria-label="join-sol"
        size="small"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 16 },
          right: 16,
          zIndex: 1000
        }}
        onClick={() => console.log('Rejoindre un sol')}
      >
        <PeopleIcon />
      </Fab>
    </DashboardLayout>
  );
}

export default SolsPage;