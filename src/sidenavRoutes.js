/**
 * FinApp Haiti - Sidenav Routes Configuration
 */
import Icon from "@mui/material/Icon";

// Import pages (temporaire, on créera les vraies pages après)
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import Notifications from "layouts/notifications";
import AccountsPage from "pages/Finances/Accounts/AccountsPage";

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
    type: "title",
    title: "Finances",
    key: "finances-title",
  },
  {
    type: "collapse",
    name: "Comptes",
    key: "accounts",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/accounts",
    component: <AccountsPage/>, // À remplacer
  },
  {
    type: "collapse",
    name: "Transactions",
    key: "transactions",
    icon: <Icon fontSize="small">receipt</Icon>,
    route: "/transactions",
    component: null, // À créer
  },
  {
    type: "collapse",
    name: "Budgets",
    key: "budgets",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    route: "/budgets",
    component: null, // À créer
  },
  {
    type: "divider",
    key: "divider-1",
  },
  {
    type: "title",
    title: "Épargne & Investissements",
    key: "savings-title",
  },
  {
    type: "collapse",
    name: "Sols",
    key: "sols",
    icon: <Icon fontSize="small">savings</Icon>,
    route: "/sols",
    component: null, // À créer
  },
  {
    type: "collapse",
    name: "Investissements",
    key: "investments",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/investments",
    component: null, // À créer
  },
  {
    type: "collapse",
    name: "Dettes",
    key: "debts",
    icon: <Icon fontSize="small">credit_card</Icon>,
    route: "/debts",
    component: null, // À créer
  },
  {
    type: "divider",
    key: "divider-2",
  },
  {
    type: "title",
    title: "Outils",
    key: "tools-title",
  },
  {
    type: "collapse",
    name: "Rapports",
    key: "reports",
    icon: <Icon fontSize="small">assessment</Icon>,
    route: "/reports",
    component: null, // À créer
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "divider",
    key: "divider-3",
  },
  {
    type: "collapse",
    name: "Profil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
];

export default routes;