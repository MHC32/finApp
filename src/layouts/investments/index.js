// src/layouts/investments/index.js
import React, { useState, useMemo } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

// @mui icons
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 2 React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// FinApp components
import FinAppNavbar from 'components/FinApp/FinAppNavbar';
import FinAppSidenav from 'components/FinApp/FinAppSidenav';
import InvestmentForm from 'components/FinApp/InvestmentForm';
import InvestmentCard from 'components/FinApp/InvestmentCard';
import CurrencyDisplay from 'components/FinApp/CurrencyDisplay';

// Données mockées d'investissements
const MOCK_INVESTMENTS = [
  {
    id: 'inv_001',
    name: 'Élevage de Porcs - Croix-des-Bouquets',
    type: 'agriculture',
    totalInvestment: 50000,
    personalContribution: 30000,
    personalPercentage: 60,
    currency: 'HTG',
    startDate: '2024-01-15',
    expectedDuration: 18,
    projections: {
      monthlyProfit: 3500,
      annualProfit: 42000,
      roi: 84,
      breakEven: 14
    },
    riskLevel: 'medium',
    status: 'active',
    partners: [
      { name: 'Jean-Pierre Michel', contribution: 20000, percentage: 40 }
    ],
    monthlyRevenue: 8000,
    monthlyExpenses: 4500,
    currentValue: 52000,
    performance: '+4%'
  },
  {
    id: 'inv_002',
    name: 'Boutique Neighborhood - Delmas',
    type: 'commerce',
    totalInvestment: 25000,
    personalContribution: 25000,
    personalPercentage: 100,
    currency: 'HTG',
    startDate: '2023-11-01',
    expectedDuration: 12,
    projections: {
      monthlyProfit: 2800,
      annualProfit: 33600,
      roi: 134.4,
      breakEven: 9
    },
    riskLevel: 'medium',
    status: 'active',
    partners: [],
    monthlyRevenue: 12000,
    monthlyExpenses: 9200,
    currentValue: 28500,
    performance: '+14%'
  },
  {
    id: 'inv_003',
    name: 'Duplex Location - Pétion-Ville',
    type: 'immobilier',
    totalInvestment: 150000,
    personalContribution: 75000,
    personalPercentage: 50,
    currency: 'USD',
    startDate: '2023-08-01',
    expectedDuration: 60,
    projections: {
      monthlyProfit: 800,
      annualProfit: 9600,
      roi: 6.4,
      breakEven: 156
    },
    riskLevel: 'low',
    status: 'active',
    partners: [
      { name: 'Marie Dubois', contribution: 75000, percentage: 50 }
    ],
    monthlyRevenue: 1200,
    monthlyExpenses: 400,
    currentValue: 155000,
    performance: '+3.3%'
  },
  {
    id: 'inv_004',
    name: 'Service Transport - Tap-tap',
    type: 'transport',
    totalInvestment: 35000,
    personalContribution: 35000,
    personalPercentage: 100,
    currency: 'HTG',
    startDate: '2024-02-01',
    expectedDuration: 24,
    projections: {
      monthlyProfit: 1800,
      annualProfit: 21600,
      roi: 61.7,
      breakEven: 19
    },
    riskLevel: 'medium',
    status: 'planning',
    partners: [],
    monthlyRevenue: 4500,
    monthlyExpenses: 2700,
    currentValue: 35000,
    performance: '0%'
  },
  {
    id: 'inv_005',
    name: 'Portfolio Crypto - Bitcoin/USDC',
    type: 'crypto',
    totalInvestment: 2500,
    personalContribution: 2500,
    personalPercentage: 100,
    currency: 'USD',
    startDate: '2024-01-01',
    expectedDuration: 12,
    projections: {
      monthlyProfit: 125,
      annualProfit: 1500,
      roi: 60,
      breakEven: 20
    },
    riskLevel: 'high',
    status: 'active',
    partners: [],
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    currentValue: 2800,
    performance: '+12%'
  }
];

// Configuration des types d'investissements
const INVESTMENT_TYPES = {
  agriculture: { 
    name: 'Agriculture/Élevage', 
    icon: AgricultureIcon, 
    color: 'success',
    haitiSpecific: true 
  },
  commerce: { 
    name: 'Commerce/Business', 
    icon: StorefrontIcon, 
    color: 'primary',
    haitiSpecific: true 
  },
  immobilier: { 
    name: 'Immobilier', 
    icon: HomeIcon, 
    color: 'warning',
    haitiSpecific: false 
  },
  transport: { 
    name: 'Transport', 
    icon: LocalShippingIcon, 
    color: 'info',
    haitiSpecific: true 
  },
  finance: { 
    name: 'Produits financiers', 
    icon: AccountBalanceIcon, 
    color: 'secondary',
    haitiSpecific: false 
  },
  crypto: { 
    name: 'Cryptomonnaies', 
    icon: CurrencyBitcoinIcon, 
    color: 'error',
    haitiSpecific: false 
  }
};

function InvestmentsPage() {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('HTG');
  const [tabValue, setTabValue] = useState(0);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [investments, setInvestments] = useState(MOCK_INVESTMENTS);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // Gestion des événements
  const handleSidenavToggle = () => setSidenavOpen(!sidenavOpen);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddInvestment = () => {
    setEditingInvestment(null);
    setFormDialogOpen(true);
  };

  const handleEditInvestment = (investment) => {
    setEditingInvestment(investment);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (investmentData) => {
    setLoading(true);
    try {
      if (editingInvestment) {
        // Modifier investissement existant
        setInvestments(prev => 
          prev.map(inv => inv.id === editingInvestment.id ? { ...inv, ...investmentData } : inv)
        );
      } else {
        // Ajouter nouvel investissement
        setInvestments(prev => [...prev, { ...investmentData, id: `inv_${Date.now()}` }]);
      }
      setFormDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données filtrées
  const filteredInvestments = useMemo(() => {
    return investments.filter(investment => {
      const typeMatch = filterType === 'all' || investment.type === filterType;
      const statusMatch = filterStatus === 'all' || investment.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [investments, filterType, filterStatus]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    
    const totalInvested = activeInvestments.reduce((sum, inv) => {
      // Convertir en HTG pour le calcul (approximatif)
      const amount = inv.currency === 'USD' ? inv.personalContribution * 130 : inv.personalContribution;
      return sum + amount;
    }, 0);

    const totalCurrentValue = activeInvestments.reduce((sum, inv) => {
      const amount = inv.currency === 'USD' ? inv.currentValue * 130 : inv.currentValue;
      return sum + amount;
    }, 0);

    const totalMonthlyProfit = activeInvestments.reduce((sum, inv) => {
      const amount = inv.currency === 'USD' ? inv.projections.monthlyProfit * 130 : inv.projections.monthlyProfit;
      return sum + amount;
    }, 0);

    const avgROI = activeInvestments.length > 0 ? 
      activeInvestments.reduce((sum, inv) => sum + inv.projections.roi, 0) / activeInvestments.length : 0;

    return {
      totalInvestments: investments.length,
      activeInvestments: activeInvestments.length,
      totalInvested,
      totalCurrentValue,
      totalGain: totalCurrentValue - totalInvested,
      totalMonthlyProfit,
      avgROI
    };
  }, [investments]);

  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Vue d'ensemble
        return (
          <Grid container spacing={3}>
            {filteredInvestments.map((investment) => (
              <Grid item xs={12} md={6} lg={4} key={investment.id}>
                <InvestmentCard
                  projectName={investment.name}
                  investmentType={investment.type}
                  totalAmount={investment.totalInvestment}
                  personalAmount={investment.personalContribution}
                  currency={investment.currency}
                  startDate={investment.startDate}
                  expectedROI={investment.projections.roi}
                  monthlyProfit={investment.projections.monthlyProfit}
                  status={investment.status}
                  riskLevel={investment.riskLevel}
                  hasPartners={investment.partners.length > 0}
                  partnerCount={investment.partners.length}
                  currentValue={investment.currentValue}
                  performance={investment.performance}
                  onClick={() => handleEditInvestment(investment)}
                />
              </Grid>
            ))}
            
            {filteredInvestments.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <MDTypography variant="body2">
                    Aucun investissement trouvé pour les filtres sélectionnés.
                  </MDTypography>
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 1: // Par type
        return (
          <Grid container spacing={3}>
            {Object.entries(INVESTMENT_TYPES).map(([typeId, typeConfig]) => {
              const typeInvestments = filteredInvestments.filter(inv => inv.type === typeId);
              const IconComponent = typeConfig.icon;
              
              if (typeInvestments.length === 0) return null;
              
              return (
                <Grid item xs={12} key={typeId}>
                  <Card>
                    <CardContent>
                      <MDBox display="flex" alignItems="center" mb={2}>
                        <IconComponent sx={{ fontSize: 32, color: `${typeConfig.color}.main`, mr: 2 }} />
                        <MDBox>
                          <MDTypography variant="h6" fontWeight="medium">
                            {typeConfig.name}
                          </MDTypography>
                          <MDTypography variant="body2" color="text">
                            {typeInvestments.length} investissement{typeInvestments.length > 1 ? 's' : ''}
                            {typeConfig.haitiSpecific && (
                              <Chip label="Populaire en Haïti" size="small" color="success" sx={{ ml: 1 }} />
                            )}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      
                      <Grid container spacing={2}>
                        {typeInvestments.map((investment) => (
                          <Grid item xs={12} md={6} lg={4} key={investment.id}>
                            <InvestmentCard
                              projectName={investment.name}
                              investmentType={investment.type}
                              totalAmount={investment.totalInvestment}
                              personalAmount={investment.personalContribution}
                              currency={investment.currency}
                              startDate={investment.startDate}
                              expectedROI={investment.projections.roi}
                              monthlyProfit={investment.projections.monthlyProfit}
                              status={investment.status}
                              riskLevel={investment.riskLevel}
                              hasPartners={investment.partners.length > 0}
                              partnerCount={investment.partners.length}
                              currentValue={investment.currentValue}
                              performance={investment.performance}
                              onClick={() => handleEditInvestment(investment)}
                              showDetails={false}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        );

      case 2: // Performance
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                <MDTypography variant="body2" fontWeight="medium">
                  Analyse de performance détaillée
                </MDTypography>
                <MDTypography variant="caption">
                  Cette fonctionnalité sera disponible avec les composants de graphiques (Phase 4)
                </MDTypography>
              </Alert>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Navigation */}
      <FinAppNavbar 
        onSidenavToggle={handleSidenavToggle}
        currency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />
      
      <FinAppSidenav 
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        activePage="investments"
      />

      {/* Contenu principal */}
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          
          {/* Header avec statistiques */}
          <MDBox mb={4}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Mes Investissements
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Gérez et suivez la performance de vos projets
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'primary.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h4" color="primary.dark" fontWeight="bold">
                          {stats.activeInvestments}
                        </MDTypography>
                        <MDTypography variant="caption" color="primary.dark">
                          Actifs
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'success.light' }}>
                      <CardContent sx={{ py: 2 }}>
                        <MDTypography variant="h4" color="success.dark" fontWeight="bold">
                          {stats.avgROI.toFixed(1)}%
                        </MDTypography>
                        <MDTypography variant="caption" color="success.dark">
                          ROI moyen
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>

          {/* Résumé financier */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MDTypography variant="caption" color="text">
                    Total investi
                  </MDTypography>
                  <CurrencyDisplay
                    amount={stats.totalInvested}
                    currency="HTG"
                    variant="h5"
                    fontWeight="medium"
                    color="primary"
                    showTrend={false}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MDTypography variant="caption" color="text">
                    Valeur actuelle
                  </MDTypography>
                  <CurrencyDisplay
                    amount={stats.totalCurrentValue}
                    currency="HTG"
                    variant="h5"
                    fontWeight="medium"
                    color="info"
                    showTrend={false}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MDTypography variant="caption" color="text">
                    Gain/Perte
                  </MDTypography>
                  <MDBox display="flex" alignItems="center" justifyContent="center">
                    {stats.totalGain >= 0 ? (
                      <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
                    )}
                    <CurrencyDisplay
                      amount={Math.abs(stats.totalGain)}
                      currency="HTG"
                      variant="h5"
                      fontWeight="medium"
                      color={stats.totalGain >= 0 ? 'success' : 'error'}
                      showTrend={false}
                    />
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MDTypography variant="caption" color="text">
                    Revenus mensuels
                  </MDTypography>
                  <CurrencyDisplay
                    amount={stats.totalMonthlyProfit}
                    currency="HTG"
                    variant="h5"
                    fontWeight="medium"
                    color="warning"
                    showTrend={false}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filtres et onglets */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Vue d'ensemble" />
                  <Tab label="Par type" />
                  <Tab label="Performance" />
                </Tabs>
                
                <MDBox display="flex" gap={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={filterType}
                      label="Type"
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <MenuItem value="all">Tous</MenuItem>
                      {Object.entries(INVESTMENT_TYPES).map(([id, config]) => (
                        <MenuItem key={id} value={id}>{config.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Statut"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="all">Tous</MenuItem>
                      <MenuItem value="active">Actif</MenuItem>
                      <MenuItem value="planning">Planification</MenuItem>
                      <MenuItem value="completed">Terminé</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
              </MDBox>
              
              {/* Contenu des onglets */}
              {renderTabContent()}
            </CardContent>
          </Card>

        </Container>
      </MDBox>

      {/* Bouton d'ajout flottant */}
      <Fab
        color="primary"
        aria-label="Ajouter investissement"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 1000
        }}
        onClick={handleAddInvestment}
      >
        <AddIcon />
      </Fab>

      {/* Dialog formulaire d'investissement */}
      <Dialog 
        open={formDialogOpen} 
        onClose={() => setFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5" fontWeight="medium">
              {editingInvestment ? 'Modifier l\'investissement' : 'Nouvel investissement'}
            </MDTypography>
            <IconButton onClick={() => setFormDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        
        <DialogContent>
          <InvestmentForm
            investment={editingInvestment}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormDialogOpen(false)}
            isEditing={!!editingInvestment}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default InvestmentsPage;