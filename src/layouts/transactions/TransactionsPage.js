/**
=========================================================
* FinApp Haiti - Transaction Page
=========================================================

* Page complète de gestion des transactions avec formulaires
* Utilise QuickTransactionForm, TransactionForm, CategorySelector
* Pattern cohérent avec les autres pages FinApp
=========================================================
*/

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

// @mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

// FinApp components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function TransactionsPage() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // États pour la gestion des onglets et filtres
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [dateRange, setDateRange] = useState("30_days");

  // États pour les dialogs
  const [quickTransactionOpen, setQuickTransactionOpen] = useState(false);
  const [fullTransactionOpen, setFullTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Données mockées des transactions haïtiennes
  const transactions = [
    {
      id: 1,
      type: "expense",
      amount: 500,
      currency: "HTG",
      description: "Diri ak pwa",
      category: "alimentation",
      categoryLabel: "Alimentation",
      account: "sogebank_checking",
      accountLabel: "Sogebank Courant",
      date: "2024-09-20",
      time: "12:30",
      location: "Marché Croix-des-Bossales",
      tags: ["nécessaire", "famille"],
      receipt: null,
      note: "Déjeuner famille"
    },
    {
      id: 2,
      type: "income",
      amount: 25000,
      currency: "HTG",
      description: "Salaire septembre",
      category: "salaire",
      categoryLabel: "Salaire",
      account: "sogebank_checking",
      accountLabel: "Sogebank Courant",
      date: "2024-09-20",
      time: "08:00",
      location: "Virement bancaire",
      tags: ["mensuel", "fixe"],
      receipt: null,
      note: ""
    },
    {
      id: 3,
      type: "expense",
      amount: 150,
      currency: "HTG",
      description: "Transport tap-tap",
      category: "transport",
      categoryLabel: "Transport",
      account: "cash",
      accountLabel: "Liquide",
      date: "2024-09-19",
      time: "16:45",
      location: "Route Delmas",
      tags: ["quotidien"],
      receipt: null,
      note: "Aller-retour travail"
    },
    {
      id: 4,
      type: "expense",
      amount: 50,
      currency: "USD",
      description: "Internet mensuel",
      category: "abonnements",
      categoryLabel: "Abonnements",
      account: "unibank_checking",
      accountLabel: "Unibank Courant",
      date: "2024-09-19",
      time: "14:20",
      location: "Digicel Store",
      tags: ["mensuel", "nécessaire"],
      receipt: "recu_internet_sept.jpg",
      note: "Package 5GB"
    },
    {
      id: 5,
      type: "income",
      amount: 8000,
      currency: "HTG",
      description: "Vente légumes",
      category: "business",
      categoryLabel: "Business",
      account: "cash",
      accountLabel: "Liquide",
      date: "2024-09-18",
      time: "18:30",
      location: "Marché local",
      tags: ["business", "agriculture"],
      receipt: null,
      note: "Tomates et épinards"
    },
    {
      id: 6,
      type: "expense",
      amount: 1200,
      currency: "HTG",
      description: "Consultation médecin",
      category: "sante",
      categoryLabel: "Santé",
      account: "sogebank_savings",
      accountLabel: "Sogebank Épargne",
      date: "2024-09-18",
      time: "10:15",
      location: "Hôpital Bernard Mevs",
      tags: ["santé", "urgent"],
      receipt: "facture_medecin.jpg",
      note: "Contrôle de routine"
    },
    {
      id: 7,
      type: "expense",
      amount: 3500,
      currency: "HTG",
      description: "Électricité (EDH)",
      category: "utilities",
      categoryLabel: "Services",
      account: "sogebank_checking",
      accountLabel: "Sogebank Courant", 
      date: "2024-09-17",
      time: "11:00",
      location: "Bureau EDH",
      tags: ["mensuel", "nécessaire"],
      receipt: "facture_edh_sept.jpg",
      note: "Facture septembre"
    },
    {
      id: 8,
      type: "income",
      amount: 100,
      currency: "USD",
      description: "Diaspora famille",
      category: "transfert",
      categoryLabel: "Transferts",
      account: "western_union",
      accountLabel: "Western Union",
      date: "2024-09-16",
      time: "15:30",
      location: "Western Union Delmas",
      tags: ["famille", "diaspora"],
      receipt: null,
      note: "Manman nan Miami"
    }
  ];

  // Fonctions utilitaires
  const getCategoryIcon = (category) => {
    const icons = {
      alimentation: <RestaurantIcon />,
      transport: <DirectionsCarIcon />,
      education: <SchoolIcon />,
      sante: <LocalHospitalIcon />,
      salaire: <WorkIcon />,
      business: <TrendingUpIcon />,
      utilities: <HomeIcon />,
      shopping: <ShoppingCartIcon />
    };
    return icons[category] || <TrendingDownIcon />;
  };

  const formatCurrency = (amount, currency) => {
    const formatted = new Intl.NumberFormat('fr-HT').format(amount);
    return `${formatted} ${currency}`;
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? 'success' : 'error';
  };

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesAccount = selectedAccount === 'all' || transaction.account === selectedAccount;
    
    return matchesSearch && matchesCategory && matchesAccount;
  });

  // Grouper par date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Statistiques pour l'onglet Vue d'ensemble
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.currency === 'USD' ? t.amount * 113 : t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.currency === 'USD' ? t.amount * 113 : t.amount), 0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setFullTransactionOpen(true);
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Statistiques */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color="success" fontWeight="medium">
                Revenus
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold">
                {formatCurrency(totalIncome, 'HTG')}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Ce mois-ci
              </MDTypography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <TrendingDownIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color="error" fontWeight="medium">
                Dépenses
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold">
                {formatCurrency(totalExpenses, 'HTG')}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Ce mois-ci
              </MDTypography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUpIcon color={totalIncome - totalExpenses > 0 ? "success" : "error"} sx={{ fontSize: 40, mb: 1 }} />
              <MDTypography variant="h6" color={totalIncome - totalExpenses > 0 ? "success" : "error"} fontWeight="medium">
                Balance
              </MDTypography>
              <MDTypography variant="h4" fontWeight="bold">
                {formatCurrency(totalIncome - totalExpenses, 'HTG')}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Économies
              </MDTypography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Liste des transactions */}
      <Grid item xs={12}>
        <Card>
          <MDBox p={3}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <MDTypography variant="h6" fontWeight="medium">
                Transactions Récentes
              </MDTypography>
              <MDBox display="flex" gap={1}>
                <IconButton size="small" onClick={handleFilterClick}>
                  <FilterListIcon />
                </IconButton>
                <IconButton size="small" onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
              </MDBox>
            </MDBox>

            {/* Barre de recherche */}
            <MDBox mb={3}>
              <MDInput
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </MDBox>

            {/* Liste groupée par date */}
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .slice(0, 10)
              .map(([date, dayTransactions]) => (
                <Box key={date} mb={3}>
                  <MDTypography variant="overline" color="text" fontWeight="bold">
                    {new Date(date).toLocaleDateString('fr-HT', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </MDTypography>
                  <List dense>
                    {dayTransactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <ListItem 
                          button 
                          onClick={() => handleTransactionClick(transaction)}
                          sx={{ borderRadius: 1, mb: 1 }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: transaction.type === 'income' ? 'success.main' : 'error.main',
                              width: 40,
                              height: 40
                            }}>
                              {getCategoryIcon(transaction.category)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                <MDTypography variant="subtitle2" fontWeight="medium">
                                  {transaction.description}
                                </MDTypography>
                                <MDTypography 
                                  variant="subtitle2" 
                                  color={getTransactionColor(transaction.type)}
                                  fontWeight="bold"
                                >
                                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency)}
                                </MDTypography>
                              </MDBox>
                            }
                            secondary={
                              <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                                <MDBox display="flex" gap={1}>
                                  <Chip 
                                    label={transaction.categoryLabel} 
                                    size="small" 
                                    variant="outlined"
                                    color="primary"
                                  />
                                  <Chip 
                                    label={transaction.accountLabel} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                </MDBox>
                                <MDTypography variant="caption" color="text">
                                  {transaction.time} • {transaction.location}
                                </MDTypography>
                              </MDBox>
                            }
                          />
                        </ListItem>
                        {index < dayTransactions.length - 1 && <Divider variant="inset" component="li" />}
                      </div>
                    ))}
                  </List>
                </Box>
              ))
            }

            {filteredTransactions.length === 0 && (
              <MDBox textAlign="center" py={4}>
                <MDTypography variant="h6" color="text" fontWeight="regular">
                  Aucune transaction trouvée
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Ajustez vos filtres ou ajoutez une nouvelle transaction
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCategoriesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Dépenses par Catégorie
            </MDTypography>
            
            {/* Ici on pourrait ajouter des graphiques avec recharts */}
            <MDBox textAlign="center" py={4}>
              <MDTypography variant="body1" color="text">
                Graphique des catégories à implémenter
              </MDTypography>
            </MDBox>
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Analyse des Dépenses
            </MDTypography>
            
            {/* Ici on pourrait ajouter des analyses détaillées */}
            <MDBox textAlign="center" py={4}>
              <MDTypography variant="body1" color="text">
                Analyses financières à implémenter
              </MDTypography>
            </MDBox>
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
                    Transactions
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Gérez vos revenus et dépenses
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
              <Tab label="Vue d'ensemble" />
              <Tab label="Par catégorie" />
              <Tab label="Analyse" />
            </Tabs>
          </Card>
        </MDBox>

        {/* Contenu des onglets */}
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderCategoriesTab()}
        {activeTab === 2 && renderAnalyticsTab()}

        {/* Bouton flottant pour ajouter une transaction */}
        <Fab
          color="primary"
          aria-label="add transaction"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => setQuickTransactionOpen(true)}
        >
          <AddIcon />
        </Fab>

        {/* Menu actions */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { setQuickTransactionOpen(true); handleMenuClose(); }}>
            Nouvelle transaction
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Exporter données
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Importer CSV
          </MenuItem>
        </Menu>

        {/* Menu filtres */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
        >
          <MenuItem>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="all">Toutes</MenuItem>
                <MenuItem value="alimentation">Alimentation</MenuItem>
                <MenuItem value="transport">Transport</MenuItem>
                <MenuItem value="sante">Santé</MenuItem>
                <MenuItem value="utilities">Services</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
        </Menu>

        {/* Dialog transaction rapide */}
        <Dialog 
          open={quickTransactionOpen} 
          onClose={() => setQuickTransactionOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Nouvelle Transaction</DialogTitle>
          <DialogContent>
            <MDBox py={2}>
              <MDTypography variant="body2" color="text">
                Ici on intégrera le QuickTransactionForm avec CategorySelector
              </MDTypography>
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={() => setQuickTransactionOpen(false)}>
              Annuler
            </MDButton>
            <MDButton variant="contained" onClick={() => setQuickTransactionOpen(false)}>
              Ajouter
            </MDButton>
          </DialogActions>
        </Dialog>

        {/* Dialog détail transaction */}
        <Dialog 
          open={fullTransactionOpen} 
          onClose={() => setFullTransactionOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Détail Transaction
            {selectedTransaction && (
              <MDTypography variant="subtitle2" color="text">
                {selectedTransaction.description}
              </MDTypography>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedTransaction && (
              <MDBox py={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="subtitle2" fontWeight="bold">Montant</MDTypography>
                    <MDTypography variant="h6" color={getTransactionColor(selectedTransaction.type)}>
                      {selectedTransaction.type === 'income' ? '+' : '-'} {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="subtitle2" fontWeight="bold">Catégorie</MDTypography>
                    <MDTypography variant="body1">{selectedTransaction.categoryLabel}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="subtitle2" fontWeight="bold">Compte</MDTypography>
                    <MDTypography variant="body1">{selectedTransaction.accountLabel}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="subtitle2" fontWeight="bold">Date</MDTypography>
                    <MDTypography variant="body1">
                      {new Date(selectedTransaction.date).toLocaleDateString('fr-HT')} à {selectedTransaction.time}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <MDTypography variant="subtitle2" fontWeight="bold">Lieu</MDTypography>
                    <MDTypography variant="body1">{selectedTransaction.location}</MDTypography>
                  </Grid>
                  {selectedTransaction.note && (
                    <Grid item xs={12}>
                      <MDTypography variant="subtitle2" fontWeight="bold">Note</MDTypography>
                      <MDTypography variant="body1">{selectedTransaction.note}</MDTypography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <MDTypography variant="subtitle2" fontWeight="bold">Tags</MDTypography>
                    <MDBox display="flex" gap={1} mt={1}>
                      {selectedTransaction.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            )}
          </DialogContent>
          <DialogActions>
            <MDButton onClick={() => setFullTransactionOpen(false)}>
              Fermer
            </MDButton>
            <MDButton variant="contained">
              Modifier
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TransactionsPage;