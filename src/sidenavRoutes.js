/**
 * =========================================================
 * FinApp Haiti - Sidenav Routes Configuration
 * Configuration pour le menu latéral Material Dashboard
 * =========================================================
 */

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

/**
 * Routes configuration pour Material Dashboard Sidenav
 * 
 * Structure requise pour chaque route:
 * - type: "collapse" pour sidebar items
 * - name: Nom affiché
 * - key: Clé unique
 * - icon: Icône Material-UI
 * - route: Chemin URL
 * - component: Composant React
 */
const sidenavRoutes = [
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

export default sidenavRoutes;