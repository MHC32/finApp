/**
=========================================================
* FinApp Haiti - Transaction Page MISE À JOUR
=========================================================

* Page complète de gestion des transactions avec TransactionTable
* Intègre le nouveau composant TransactionTable développé
* Pattern cohérent avec les autres pages FinApp
=========================================================
*/

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// FinApp components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import FinAppNavbar from "../../examples/Navbars/FinAppNavbar";
import FinAppSidenav from "../../examples/Sidenav/FinAppSidenav";
import Footer from "examples/Footer";

// Nouveau composant TransactionTable
import TransactionTable from "../../components/FinApp/TransactionTable";

// Composants graphiques pour analyse
import ExpenseChart from "../../components/FinApp/ExpenseChart";
import IncomeExpenseChart from "../../components/FinApp/IncomeExpenseChart";

function TransactionsPage() {
  // États pour navigation
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("HTG");
  const [activeTab, setActiveTab] = useState(0);

  const handleSidenavToggle = () => {
    setSidenavOpen(!sidenavOpen);
  };

  // Données mockées des transactions haïtiennes ÉTENDUES
  const mockTransactions = [
    {
      id: 1,
      type: "expense",
      amount: -500,
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
      note: "Déjeuner famille",
      balance: 24500
    },
    {
      id: 2,
      type: "income",
      amount: 25000,
      currency: "HTG",
      description: "Salaire septembre",
      category: "travail",
      categoryLabel: "Revenus",
      account: "sogebank_checking",
      accountLabel: "Sogebank Courant",
      date: "2024-09-20",
      time: "08:00",
      location: "Virement bancaire",
      tags: ["mensuel", "fixe"],
      receipt: null,
      note: "",
      balance: 25000
    },
    {
      id: 3,
      type: "expense",
      amount: -150,
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
      note: "Aller-retour travail",
      balance: 1850
    },
    {
      id: 4,
      type: "expense",
      amount: -50,
      currency: "USD",
      description: "Internet mensuel",
      category: "logement",
      categoryLabel: "Logement",
      account: "unibank_checking",
      accountLabel: "Unibank Courant",
      date: "2024-09-19",
      time: "14:20",
      location: "Digicel Store",
      tags: ["mensuel", "nécessaire"],
      receipt: "recu_internet_sept.jpg",
      note: "Package 5GB",
      balance: 450
    },
    {
      id: 5,
      type: "income",
      amount: 8000,
      currency: "HTG",
      description: "Vente légumes",
      category: "autre",
      categoryLabel: "Business",
      account: "cash",
      accountLabel: "Liquide",
      date: "2024-09-18",
      time: "18:30",
      location: "Marché local",
      tags: ["business", "agriculture"],
      receipt: null,
      note: "Tomates et épinards",
      balance: 2000
    },
    {
      id: 6,
      type: "expense",
      amount: -1200,
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
      note: "Contrôle de routine",
      balance: 18800
    },
    {
      id: 7,
      type: "expense",
      amount: -3500,
      currency: "HTG",
      description: "Électricité (EDH)",
      category: "logement",
      categoryLabel: "Logement",
      account: "sogebank_checking",
      accountLabel: "Sogebank Courant", 
      date: "2024-09-17",
      time: "11:00",
      location: "Bureau EDH",
      tags: ["mensuel", "nécessaire"],
      receipt: "facture_edh_sept.jpg",
      note: "Facture septembre",
      balance: 21500
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
      note: "Manman nan Miami",
      balance: 500
    },
    {
      id: 9,
      type: "expense",
      amount: -2500,
      currency: "HTG",
      description: "Courses mois",
      category: "alimentation",
      categoryLabel: "Alimentation",
      account: "sogebank_checking",
      accountLabel: "Sogebank Courant",
      date: "2024-09-15",
      time: "09:30",
      location: "Supermarché Caribbean",
      tags: ["courses", "famille"],
      receipt: "recu_courses_sept.jpg",
      note: "Courses famille pour la semaine",
      balance: 23500
    },
    {
      id: 10,
      type: "expense",
      amount: -800,
      currency: "HTG",
      description: "Médicaments",
      category: "sante",
      categoryLabel: "Santé",
      account: "cash",
      accountLabel: "Liquide",
      date: "2024-09-14",
      time: "14:45",
      location: "Pharmacie Centrale",
      tags: ["santé", "médicaments"],
      receipt: "facture_pharmacie.jpg",
      note: "Vitamines et paracétamol",
      balance: 1200
    },
    {
      id: 11,
      type: "income",
      amount: 15000,
      currency: "HTG",
      description: "Freelance web",
      category: "travail",
      categoryLabel: "Revenus",
      account: "unibank_checking",
      accountLabel: "Unibank Courant",
      date: "2024-09-13",
      time: "16:00",
      location: "Virement client",
      tags: ["freelance", "web"],
      receipt: null,
      note: "Site web restaurant",
      balance: 500
    },
    {
      id: 12,
      type: "expense",
      amount: -450,
      currency: "HTG",
      description: "Carburant moto",
      category: "transport",
      categoryLabel: "Transport",
      account: "cash",
      accountLabel: "Liquide",
      date: "2024-09-12",
      time: "07:20",
      location: "Station Texaco",
      tags: ["carburant", "moto"],
      receipt: null,
      note: "Plein essence",
      balance: 2000
    }
  ];

  // Gestionnaires d'événements pour TransactionTable
  const handleTransactionEdit = (transaction) => {
    console.log("Modifier transaction:", transaction);
    // TODO: Ouvrir modal d'édition
  };

  const handleTransactionDelete = (transactionId) => {
    console.log("Supprimer transaction:", transactionId);
    // TODO: Supprimer de la liste après confirmation
  };

  const handleTransactionDuplicate = (transaction) => {
    console.log("Dupliquer transaction:", transaction);
    // TODO: Créer nouvelle transaction basée sur l'existante
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log(`Action groupée ${action} sur:`, selectedIds);
    // TODO: Exécuter l'action sur les transactions sélectionnées
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Préparer données pour graphiques
  const expenseData = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {});

  const incomeExpenseData = mockTransactions
    .reduce((acc, transaction) => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += Math.abs(transaction.amount);
      }
      return acc;
    }, {});

  // Calculer statistiques
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.currency === 'USD' ? t.amount * 113 : t.amount), 0);
  
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.currency === 'USD' ? Math.abs(t.amount) * 113 : Math.abs(t.amount)), 0);

  const balance = totalIncome - totalExpenses;

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Statistiques rapides */}
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <MDTypography variant="body2" fontWeight="medium">
            Page Transactions avec TransactionTable intégrée
          </MDTypography>
          <MDTypography variant="caption">
            Table avancée avec filtres, tri, export et actions CRUD
          </MDTypography>
        </Alert>
      </Grid>

      {/* Table des transactions */}
      <Grid item xs={12}>
        <TransactionTable
          transactions={mockTransactions}
          currency={selectedCurrency}
          title="Mes Transactions"
          showQuickAdd={true}
          showFilters={true}
          showExport={true}
          height={600}
          pageSize={25}
          onTransactionEdit={handleTransactionEdit}
          onTransactionDelete={handleTransactionDelete}
          onTransactionDuplicate={handleTransactionDuplicate}
          onBulkAction={handleBulkAction}
        />
      </Grid>
    </Grid>
  );

  const renderCategoriesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ExpenseChart
          expenses={expenseData}
          currency={selectedCurrency}
          title="Dépenses par Catégorie"
          showLegend={true}
          height={400}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <IncomeExpenseChart
          data={incomeExpenseData}
          currency={selectedCurrency}
          title="Évolution Revenus/Dépenses"
          height={400}
          showPredictions={true}
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
              Analyses Financières Avancées
            </MDTypography>
            
            <Alert severity="info">
              <MDTypography variant="body2" fontWeight="medium">
                Analyses détaillées à venir
              </MDTypography>
              <MDTypography variant="caption">
                Tendances, prévisions, recommandations intelligentes
              </MDTypography>
            </Alert>
          </MDBox>
        </Card>
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
        notifications={5}
      />
      
      <FinAppSidenav 
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        activePage="transactions"
      />

      {/* Contenu principal */}
      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          
          {/* Header */}
          <MDBox mb={4}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={8}>
                <MDTypography variant="h3" fontWeight="bold" color="dark">
                  Transactions
                </MDTypography>
                <MDTypography variant="h6" color="text" mt={1}>
                  Gérez tous vos revenus et dépenses avec une table avancée
                </MDTypography>
              </Grid>
              
              <Grid item xs={12} lg={4}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'success.light', p: 2 }}>
                      <MDTypography variant="button" color="success.dark" fontWeight="bold">
                        Revenus
                      </MDTypography>
                      <MDTypography variant="h6" color="success.dark">
                        +{totalIncome.toLocaleString()}
                      </MDTypography>
                      <MDTypography variant="caption" color="success.dark">
                        {selectedCurrency}
                      </MDTypography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Card sx={{ textAlign: 'center', bgcolor: 'error.light', p: 2 }}>
                      <MDTypography variant="button" color="error.dark" fontWeight="bold">
                        Dépenses
                      </MDTypography>
                      <MDTypography variant="h6" color="error.dark">
                        -{totalExpenses.toLocaleString()}
                      </MDTypography>
                      <MDTypography variant="caption" color="error.dark">
                        {selectedCurrency}
                      </MDTypography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      bgcolor: balance >= 0 ? 'success.light' : 'warning.light', 
                      p: 2 
                    }}>
                      <MDTypography 
                        variant="button" 
                        color={balance >= 0 ? 'success.dark' : 'warning.dark'} 
                        fontWeight="bold"
                      >
                        Balance
                      </MDTypography>
                      <MDTypography 
                        variant="h6" 
                        color={balance >= 0 ? 'success.dark' : 'warning.dark'}
                      >
                        {balance >= 0 ? '+' : ''}{balance.toLocaleString()}
                      </MDTypography>
                      <MDTypography 
                        variant="caption" 
                        color={balance >= 0 ? 'success.dark' : 'warning.dark'}
                      >
                        {selectedCurrency}
                      </MDTypography>
                    </Card>
                  </Grid>
                </Grid>
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
                <Tab label="Analyse Graphique" />
                <Tab label="Prévisions" />
              </Tabs>
            </Card>
          </MDBox>

          {/* Contenu des onglets */}
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderCategoriesTab()}
          {activeTab === 2 && renderAnalyticsTab()}

        </Container>
      </MDBox>
      
      <Footer />
    </DashboardLayout>
  );
}

export default TransactionsPage;