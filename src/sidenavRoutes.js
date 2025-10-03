/**
 * =========================================================
 * FinApp Haiti - Routes Configuration
 * Configuration pour le Sidenav Material Dashboard
 * =========================================================
 */

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// FinApp Pages - NOUVELLE ARCHITECTURE
import AccountsPage from "pages/Finances/Accounts/AccountsPage";

// @mui icons
import Icon from "@mui/material/Icon";

/**
 * Routes configuration pour Material Dashboard Sidenav
 */
const routes = [
  {
    type: "collapse",
    name: "Tableau de bord",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Comptes",
    key: "accounts",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/accounts",
    component: <AccountsPage />,
  },
  // {
  //   type: "collapse",
  //   name: "Transactions",
  //   key: "transactions",
  //   icon: <Icon fontSize="small">receipt</Icon>,
  //   route: "/transactions",
  //   component: <TransactionsPage />, // À créer
  // },
  // {
  //   type: "collapse",
  //   name: "Budgets",
  //   key: "budgets",
  //   icon: <Icon fontSize="small">account_balance_wallet</Icon>,
  //   route: "/budgets",
  //   component: <BudgetsPage />, // À créer
  // },
  // {
  //   type: "collapse",
  //   name: "Sols",
  //   key: "sols",
  //   icon: <Icon fontSize="small">savings</Icon>,
  //   route: "/sols",
  //   component: <SolsPage />, // À créer
  // },
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
    name: "Paramètres",
    key: "settings",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/settings",
    component: <Profile />, // Temporaire
  },
  {
    type: "divider",
    key: "divider-1",
  },
  {
    type: "title",
    title: "Authentification",
    key: "auth-title",
  },
  {
    type: "collapse",
    name: "Connexion",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/login",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Inscription",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/register",
    component: <SignUp />,
  },
];

export default routes;