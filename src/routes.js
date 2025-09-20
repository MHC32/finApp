/**
=========================================================
* FinApp Haiti - Routes Configuration
* Based on Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui icons
import Icon from "@mui/material/Icon";

// FinApp Haiti layouts - nos nouvelles pages
import FinancialDashboard from "layouts/dashboard";
import AccountsPage from "layouts/accounts";
import SolsPage from "layouts/sols";
import BudgetsPage from "layouts/budgets";
import TransactionsPage from "layouts/transactions"; // NOUVELLE PAGE AJOUTÉE

// Material Dashboard 2 React layouts (gardées pour compatibilité)
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

const routes = [
  // Pages principales FinApp Haiti
  {
    type: "collapse",
    name: "Dashboard Financier",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <FinancialDashboard />,
  },
  {
    type: "collapse",
    name: "Mes Comptes",
    key: "accounts",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/accounts",
    component: <AccountsPage />,
  },
  {
    type: "collapse",
    name: "Transactions", // NOUVELLE ROUTE AJOUTÉE
    key: "transactions",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/transactions",
    component: <TransactionsPage />,
  },
  {
    type: "collapse",
    name: "Sols/Tontines",
    key: "sols",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/sols",
    component: <SolsPage />,
  },
  {
    type: "collapse",
    name: "Budgets",
    key: "budgets",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/budgets",
    component: <BudgetsPage />,
  },
  
  // Divider
  {
    type: "divider",
  },
  
  // Sections à venir (placeholders pour Phase 4+)
  {
    type: "title",
    title: "À venir",
  },
  {
    type: "collapse",
    name: "Investissements",
    key: "investments",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/investments",
    component: <div>Page Investissements - En construction</div>,
  },
  {
    type: "collapse",
    name: "Éducation Financière",
    key: "education",
    icon: <Icon fontSize="small">school</Icon>,
    route: "/education",
    component: <div>Page Éducation - En construction</div>,
  },
  
  // Divider
  {
    type: "divider",
  },
  
  // Pages système (gardées)
  {
    type: "title",
    title: "Compte et Paramètres",
  },
  {
    type: "collapse",
    name: "Profil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  
  // Authentication (cachées en mode connecté)
  {
    type: "collapse",
    name: "Se connecter",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    // Cette route sera cachée quand l'utilisateur est connecté
    hidden: true,
  },
  {
    type: "collapse",
    name: "Créer un compte",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    // Cette route sera cachée quand l'utilisateur est connecté
    hidden: true,
  },
];

export default routes;