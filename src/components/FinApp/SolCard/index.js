// src/components/FinApp/SolCard/index.js
import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepIcon from "@mui/material/StepIcon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Configuration des statuts de sol
const SOL_STATUS = {
  active: { label: "Actif", color: "success", icon: "check_circle" },
  pending: { label: "En attente", color: "warning", icon: "schedule" },
  completed: { label: "Terminé", color: "info", icon: "task_alt" },
  paused: { label: "Suspendu", color: "error", icon: "pause_circle" },
};

// Utilitaire pour calculer les données du sol
const calculateSolData = (participants, currentRound, amount, frequency) => {
  const totalRounds = participants.length;
  const totalAmount = amount * participants.length;
  const progressPercentage = (currentRound / totalRounds) * 100;
  
  // Calcul prochaine date (simulation)
  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + (frequency === "weekly" ? 7 : 30));
  
  return {
    totalRounds,
    totalAmount,
    progressPercentage,
    nextDate,
    roundsLeft: totalRounds - currentRound,
  };
};

function SolCard({
  solName = "Sol Famille",
  amount = 5000,
  currency = "HTG",
  frequency = "monthly",
  participants = [],
  currentRound = 1,
  userPosition = 1,
  status = "active",
  nextPaymentDate = null,
  userHasPaid = false,
  lastWinner = null,
  description = "",
  color = "info",
  showDetails = true,
  showActions = true,
  onClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Calculs du sol
  const solData = calculateSolData(participants, currentRound, amount, frequency);
  const statusConfig = SOL_STATUS[status] || SOL_STATUS.active;
  
  // Participant actuel (qui reçoit ce tour)
  const currentWinner = participants[currentRound - 1];
  const isUserTurn = currentWinner?.id === "user"; // Simulation - remplacer par vraie logique
  
  // Prochaine échéance
  const daysUntilPayment = nextPaymentDate ? 
    Math.ceil((new Date(nextPaymentDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Montant que l'utilisateur va recevoir
  const userWillReceive = solData.totalAmount - (amount * (userPosition - 1));

  return (
    <Card
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: onClick ? "translateY(-4px)" : "none",
          boxShadow: ({ boxShadows: { xl } }) => xl,
        },
        border: isUserTurn ? 2 : 0,
        borderColor: isUserTurn ? "success.main" : "transparent",
        bgcolor: isUserTurn ? "success.50" : "background.paper",
      }}
      onClick={handleCardClick}
      {...other}
    >
      <MDBox p={2.5}>
        {/* Header avec nom du sol et statut */}
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox>
            <MDBox display="flex" alignItems="center" gap={1} mb={1}>
              <MDTypography variant="h6" fontWeight="medium">
                {solName}
              </MDTypography>
              {isUserTurn && (
                <Chip 
                  label="Votre tour !" 
                  size="small" 
                  color="success"
                  icon={<Icon fontSize="small">celebration</Icon>}
                />
              )}
            </MDBox>
            
            <MDBox display="flex" alignItems="center" gap={1}>
              <Chip 
                label={statusConfig.label}
                size="small"
                color={statusConfig.color}
                icon={<Icon fontSize="small">{statusConfig.icon}</Icon>}
              />
              <Chip 
                label={`${participants.length} participants`}
                size="small"
                variant="outlined"
              />
              <Chip 
                label={frequency === "weekly" ? "Hebdomadaire" : "Mensuel"}
                size="small"
                variant="outlined"
              />
            </MDBox>
          </MDBox>

          {/* Menu actions */}
          {showActions && (
            <MDBox>
              <Tooltip title="Actions sol">
                <IconButton size="small" onClick={handleMenuOpen}>
                  <Icon fontSize="small">more_vert</Icon>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">visibility</Icon>
                  Voir détails
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">payment</Icon>
                  Effectuer paiement
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">history</Icon>
                  Historique paiements
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">people</Icon>
                  Gérer participants
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Icon sx={{ mr: 1 }} fontSize="small">notifications</Icon>
                  Rappels
                </MenuItem>
              </Menu>
            </MDBox>
          )}
        </MDBox>

        {/* Montants et progression */}
        <MDBox mb={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDBox>
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Cotisation par tour
              </MDTypography>
              <CurrencyDisplay
                amount={amount}
                currency={currency}
                variant="h5"
                color={color}
                fontWeight="bold"
                showSymbol={true}
                animate={false}
              />
            </MDBox>
            
            <MDBox textAlign="right">
              <MDTypography variant="caption" color="text" fontWeight="medium">
                Total à recevoir
              </MDTypography>
              <CurrencyDisplay
                amount={solData.totalAmount}
                currency={currency}
                variant="h6"
                color="success"
                fontWeight="medium"
                showSymbol={true}
                animate={false}
              />
            </MDBox>
          </MDBox>

          {/* Progression du sol */}
          <MDBox mb={1}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <MDTypography variant="caption" color="text">
                Progression (Tour {currentRound}/{solData.totalRounds})
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {solData.progressPercentage.toFixed(0)}%
              </MDTypography>
            </MDBox>
            
            <MDProgress 
              value={solData.progressPercentage} 
              color={color}
              variant="gradient"
            />
          </MDBox>
        </MDBox>

        {/* Participants avec avatars */}
        <MDBox mb={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDTypography variant="button" fontWeight="medium">
              Participants
            </MDTypography>
            <MDButton
              variant="text"
              size="small"
              onClick={() => setShowAllParticipants(!showAllParticipants)}
            >
              {showAllParticipants ? "Moins" : "Tous"}
            </MDButton>
          </MDBox>
          
          <AvatarGroup 
            max={showAllParticipants ? participants.length : 6}
            sx={{ 
              justifyContent: "flex-start",
              "& .MuiAvatar-root": { 
                width: 32, 
                height: 32,
                fontSize: "0.875rem",
                border: 2,
                borderColor: "background.paper"
              }
            }}
          >
            {participants.map((participant, index) => (
              <Tooltip key={participant.id} title={`${participant.name} - Position ${index + 1}`}>
                <Avatar
                  src={participant.avatar}
                  sx={{
                    bgcolor: index + 1 === currentRound ? "success.main" : 
                             index + 1 === userPosition ? "primary.main" : 
                             index + 1 < currentRound ? "grey.400" : "info.main",
                    border: index + 1 === currentRound ? "2px solid" : "1px solid",
                    borderColor: index + 1 === currentRound ? "success.main" : "grey.300"
                  }}
                >
                  {!participant.avatar && participant.name.charAt(0)}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
          
          {/* Légende positions */}
          <MDBox mt={1} display="flex" gap={2} flexWrap="wrap">
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <Avatar sx={{ width: 16, height: 16, bgcolor: "success.main" }} />
              <MDTypography variant="caption" color="text">Tour actuel</MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <Avatar sx={{ width: 16, height: 16, bgcolor: "primary.main" }} />
              <MDTypography variant="caption" color="text">Votre position</MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <Avatar sx={{ width: 16, height: 16, bgcolor: "grey.400" }} />
              <MDTypography variant="caption" color="text">Tours passés</MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Informations détaillées */}
        {showDetails && (
          <MDBox mb={2}>
            <MDBox 
              display="flex" 
              justifyContent="space-between" 
              p={1.5}
              borderRadius={1}
              bgcolor="grey.50"
            >
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Votre position
                </MDTypography>
                <MDTypography variant="h6" fontWeight="medium" color="primary">
                  #{userPosition}
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Prochaine échéance
                </MDTypography>
                <MDTypography 
                  variant="button" 
                  fontWeight="medium" 
                  color={daysUntilPayment <= 3 ? "warning" : "text"}
                >
                  {daysUntilPayment > 0 ? `${daysUntilPayment} jours` : "Aujourd'hui"}
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">
                  Statut paiement
                </MDTypography>
                <Chip
                  label={userHasPaid ? "Payé" : "En attente"}
                  size="small"
                  color={userHasPaid ? "success" : "warning"}
                  variant="outlined"
                />
              </MDBox>
            </MDBox>

            {/* Tour actuel et gagnant */}
            {currentWinner && (
              <MDBox mt={1.5} p={1.5} borderRadius={1} bgcolor={isUserTurn ? "success.50" : "info.50"}>
                <MDTypography variant="button" fontWeight="medium" color={isUserTurn ? "success" : "info"}>
                  {isUserTurn ? "🎉 C'est votre tour de recevoir !" : `Tour de ${currentWinner.name}`}
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block" mt={0.5}>
                  {isUserTurn ? 
                    `Vous recevrez ${solData.totalAmount.toLocaleString()} ${currency} ce tour` :
                    `${currentWinner.name} reçoit ${solData.totalAmount.toLocaleString()} ${currency}`
                  }
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        )}

        {/* Actions rapides */}
        {showActions && (
          <MDBox display="flex" gap={1}>
            {!userHasPaid ? (
              <MDButton
                variant="gradient"
                color="success"
                size="small"
                startIcon={<Icon>payment</Icon>}
                sx={{ flex: 1 }}
              >
                Payer ({amount.toLocaleString()} {currency})
              </MDButton>
            ) : (
              <MDButton
                variant="outlined"
                color="success"
                size="small"
                startIcon={<Icon>check</Icon>}
                sx={{ flex: 1 }}
                disabled
              >
                Payé ✓
              </MDButton>
            )}
            
            <MDButton
              variant="outlined"
              color={color}
              size="small"
              startIcon={<Icon>history</Icon>}
              sx={{ flex: 1 }}
            >
              Historique
            </MDButton>
            
            <MDButton
              variant="outlined"
              color={color}
              size="small"
              startIcon={<Icon>people</Icon>}
              sx={{ flex: 1 }}
            >
              Participants
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

// Props par défaut
SolCard.defaultProps = {
  solName: "Sol Famille",
  amount: 5000,
  currency: "HTG",
  frequency: "monthly",
  participants: [],
  currentRound: 1,
  userPosition: 1,
  status: "active",
  nextPaymentDate: null,
  userHasPaid: false,
  lastWinner: null,
  description: "",
  color: "info",
  showDetails: true,
  showActions: true,
  onClick: null,
};

// Validation des props
SolCard.propTypes = {
  solName: PropTypes.string,
  amount: PropTypes.number,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  frequency: PropTypes.oneOf(["weekly", "monthly"]),
  participants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  })),
  currentRound: PropTypes.number,
  userPosition: PropTypes.number,
  status: PropTypes.oneOf(Object.keys(SOL_STATUS)),
  nextPaymentDate: PropTypes.string,
  userHasPaid: PropTypes.bool,
  lastWinner: PropTypes.object,
  description: PropTypes.string,
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  showDetails: PropTypes.bool,
  showActions: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SolCard;

// Export des utilitaires
export { SOL_STATUS, calculateSolData };