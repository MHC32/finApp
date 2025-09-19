// src/layouts/accounts/index.js
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
import LinearProgress from '@mui/material/LinearProgress';

// @mui icons
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SyncIcon from '@mui/icons-material/Sync';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import FinAppNavbar from 'components/FinApp/FinAppNavbar';
import FinAppSidenav from 'components/FinApp/FinAppSidenav';
import HaitiBankCard from 'components/FinApp/HaitiBankCard';
import CurrencyDisplay from 'components/FinApp/CurrencyDisplay';

// Layout components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Données mockées des comptes bancaires haïtiens
const MOCK_ACCOUNTS = [
  {
    id: 1,
    bank: 'Sogebank',
    accountType: 'Compte Courant',
    accountNumber: '0001-4521-789',
    balance: 45750,
    currency: 'HTG',
    isDefault: true,
    status: 'active',
    lastUpdate: '2024-01-16T10:30:00',
    features: ['Mobile Banking', 'Carte Débite', 'Transferts'],
    monthlyData: {
      income: 85000,
      expenses: 39250,
      transactions: 47
    },
    trend: {
      direction: 'up',
      percentage: 5.2,
      description: 'Augmentation ce mois'
    }
  },
  {
    id: 2,
    bank: 'Unibank',
    accountType: 'Épargne USD',
    accountNumber: '2890-7892-456',
    balance: 850,
    currency: 'USD',
    isDefault: false,
    status: 'active',
    lastUpdate: '2024-01-16T09:15:00',
    features: ['Épargne Rémunérée', 'Transferts Internationaux'],
    monthlyData: {
      income: 300,
      expenses: 50,
      transactions: 8
    },
    trend: {
      direction: 'up',
      percentage: 12.8,
      description: 'Croissance épargne'
    }
  },
  {
    id: 3,
    bank: 'BNC',
    accountType: 'Business',
    accountNumber: '1234-1234-890',
    balance: 28300,
    currency: 'HTG',
    isDefault: false,
    status: 'active',
    lastUpdate: '2024-01-16T11:45:00',
    features: ['Compte Business', 'Prêts', 'Cartes Multiples'],
    monthlyData: {
      income: 125000,
      expenses: 96700,
      transactions: 89
    },
    trend: {
      direction: 'down',
      percentage: 2.1,
      description: 'Dépenses élevées'
    }
  },
  {
    id: 4,
    bank: 'Capital Bank',
    accountType: 'Épargne HTG',
    accountNumber: '5678-9012-345',
    balance: 12500,
    currency: 'HTG',
    isDefault: false,
    status: 'active',
    lastUpdate: '2024-01-16T08:20:00',
    features: ['Épargne Programmée', 'Objectifs'],
    monthlyData: {
      income: 15000,
      expenses: 2500,
      transactions: 12
    },
    trend: {
      direction: 'up',
      percentage: 8.3,
      description: 'Épargne régulière'
    }
  },
  {
    id: 5,
    bank: 'BMPAD',
    accountType: 'Microfinance',
    accountNumber: '9876-5432-123',
    balance: 3750,
    currency: 'HTG',
    isDefault: false,
    status: 'limited',
    lastUpdate: '2024-01-15T16:30:00',
    features: ['Microcrédit', 'Tontines Digitales'],
    monthlyData: {
      income: 8000,
      expenses: 4250,
      transactions: 23
    },
    trend: {
      direction: 'up',
      percentage: 15.6,
      description: 'Activité micro-business'
    }
  }
];

function AccountsPage() {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('HTG');
  const [showBalances, setShowBalances] = useState(true);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [isLoading, setIsLoading] = useState(false);

  // Calcul des totaux
  const [totals, setTotals] = useState({
    HTG: { total: 0, accounts: 0 },
    USD: { total: 0, accounts: 0 }
  });

  useEffect(() => {
    const newTotals = accounts.reduce((acc, account) => {
      if (account.status === 'active') {
        acc[account.currency].total += account.balance;
        acc[account.currency].accounts += 1;
      }
      return acc;
    }, { HTG: { total: 0, accounts: 0 }, USD: { total: 0, accounts: 0 } });
    
    setTotals(newTotals);
  }, [accounts]);

  // Filtrer les comptes
  const filteredAccounts = accounts.filter(account => {
    switch (selectedFilter) {
      case 'htg': return account.currency === 'HTG';
      case 'usd': return account.currency === 'USD';
      case 'active': return account.status === 'active';
      case 'savings': return account.accountType.includes('Épargne');
      default: return true;
    }
  });

  const handleSidenavToggle = () => setSidenavOpen(!sidenavOpen);

  const handleSyncAccounts = async () => {
    setIsLoading(true);
    // Simulation sync
    setTimeout(() => {
      setIsLoading(false);
      console.log('Comptes synchronisés');
    }, 2000);
  };

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

  const handleAccountAction = (accountId, action) => {
    console.log(`Action ${action} sur compte ${accountId}`);
    // Ici, intégrer avec le système de gestion des comptes
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'htg': return 'HTG seulement';
      case 'usd': return 'USD seulement';
      case 'active': return 'Comptes actifs';
      case 'savings': return 'Comptes épargne';
      default: return 'Tous les comptes';
    }
  };

  return (
    <DashboardLayout>
      {/* Navigation */}
      <FinAppNavbar 
        onSidenavToggle={handleSidenavToggle}
        currency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        notifications={3}
      />
      
      <FinAppSidenav 
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        activePage="accounts"
      />

      {/* Contenu principal */}
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          
          {/* Header avec résumé */}
          <MDBox mb={4}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Mes Comptes
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Gérez tous vos comptes bancaires haïtiens en un seul endroit
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'success.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h6" color="success.dark">
                          HTG
                        </MDTypography>
                        {showBalances ? (
                          <CurrencyDisplay
                            amount={totals.HTG.total}
                            currency="HTG"
                            variant="h5"
                            fontWeight="bold"
                            color="success.dark"
                            showTrend={false}
                          />
                        ) : (
                          <MDTypography variant="h5" color="success.dark">••••••</MDTypography>
                        )}
                        <MDTypography variant="caption" color="success.dark">
                          {totals.HTG.accounts} compte(s)
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'info.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h6" color="info.dark">
                          USD
                        </MDTypography>
                        {showBalances ? (
                          <CurrencyDisplay
                            amount={totals.USD.total}
                            currency="USD"
                            variant="h5"
                            fontWeight="bold"
                            color="info.dark"
                            showTrend={false}
                          />
                        ) : (
                          <MDTypography variant="h5" color="info.dark">••••••</MDTypography>
                        )}
                        <MDTypography variant="caption" color="info.dark">
                          {totals.USD.accounts} compte(s)
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>

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
                    Tous les comptes
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleFilterSelect('htg')}>
                    HTG seulement
                  </MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('usd')}>
                    USD seulement
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleFilterSelect('active')}>
                    Comptes actifs
                  </MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('savings')}>
                    Comptes épargne
                  </MenuItem>
                </Menu>
              </Grid>
              
              <Grid item>
                <IconButton 
                  onClick={() => setShowBalances(!showBalances)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  {showBalances ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Grid>
              
              <Grid item>
                <MDButton 
                  variant="outlined" 
                  size="small" 
                  startIcon={<SyncIcon />}
                  onClick={handleSyncAccounts}
                  disabled={isLoading}
                >
                  Synchroniser
                </MDButton>
              </Grid>
              
              <Grid item xs />
              
              <Grid item>
                <MDButton 
                  variant="contained" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => console.log('Ajouter compte')}
                >
                  Ajouter un compte
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          {/* Barre de progression si sync en cours */}
          {isLoading && (
            <MDBox mb={2}>
              <LinearProgress />
            </MDBox>
          )}

          {/* Alerte informative */}
          <MDBox mb={3}>
            <Alert severity="info" sx={{ alignItems: 'center' }}>
              <MDTypography variant="body2">
                <strong>Conseil :</strong> Vos données bancaires sont sécurisées et chiffrées. 
                La synchronisation se fait via l'API sécurisée de chaque banque haïtienne.
              </MDTypography>
            </Alert>
          </MDBox>

          {/* Liste des comptes */}
          <Grid container spacing={3}>
            {filteredAccounts.map((account) => (
              <Grid item xs={12} md={6} lg={4} key={account.id}>
                <HaitiBankCard
                  bank={account.bank}
                  accountType={account.accountType}
                  accountNumber={account.accountNumber}
                  balance={showBalances ? account.balance : null}
                  currency={account.currency}
                  isDefault={account.isDefault}
                  status={account.status}
                  lastUpdate={account.lastUpdate}
                  features={account.features}
                  monthlyData={account.monthlyData}
                  trend={account.trend}
                  onViewDetails={() => handleAccountAction(account.id, 'view')}
                  onAddTransaction={() => handleAccountAction(account.id, 'transaction')}
                  onTransfer={() => handleAccountAction(account.id, 'transfer')}
                  onSettings={() => handleAccountAction(account.id, 'settings')}
                />
              </Grid>
            ))}
          </Grid>

          {/* Message si aucun compte ne correspond au filtre */}
          {filteredAccounts.length === 0 && (
            <MDBox textAlign="center" py={6}>
              <AccountBalanceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <MDTypography variant="h6" color="text" mb={1}>
                Aucun compte trouvé
              </MDTypography>
              <MDTypography variant="body2" color="text" mb={3}>
                Essayez de modifier vos filtres ou ajoutez un nouveau compte
              </MDTypography>
              <MDButton 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => console.log('Ajouter compte')}
              >
                Ajouter mon premier compte
              </MDButton>
            </MDBox>
          )}

          {/* Statistiques rapides */}
          {filteredAccounts.length > 0 && (
            <MDBox mt={4}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Statistiques du mois
                  </MDTypography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h5" color="success.main" fontWeight="bold">
                          {filteredAccounts.reduce((acc, account) => acc + account.monthlyData.income, 0).toLocaleString()}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          Revenus totaux (HTG)
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h5" color="error.main" fontWeight="bold">
                          {filteredAccounts.reduce((acc, account) => acc + account.monthlyData.expenses, 0).toLocaleString()}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          Dépenses totales (HTG)
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h5" color="info.main" fontWeight="bold">
                          {filteredAccounts.reduce((acc, account) => acc + account.monthlyData.transactions, 0)}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          Transactions
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <MDBox textAlign="center">
                        <MDTypography variant="h5" color="primary.main" fontWeight="bold">
                          {((filteredAccounts.reduce((acc, account) => acc + account.monthlyData.income, 0) - 
                             filteredAccounts.reduce((acc, account) => acc + account.monthlyData.expenses, 0)) /
                             filteredAccounts.reduce((acc, account) => acc + account.monthlyData.income, 0) * 100).toFixed(1)}%
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          Taux d'épargne
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </MDBox>
          )}
        </Container>
      </MDBox>

      {/* Bouton flottant pour ajouter un compte */}
      <Fab
        color="primary"
        aria-label="add-account"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 16 },
          right: 16,
          zIndex: 1000
        }}
        onClick={() => console.log('Ouvrir formulaire ajout compte')}
      >
        <AddIcon />
      </Fab>
    </DashboardLayout>
  );
}

export default AccountsPage;