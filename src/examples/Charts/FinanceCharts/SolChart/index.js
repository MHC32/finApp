/**
=========================================================
* FinApp Haiti - SolTimelineChart Component
=========================================================

* Graphique timeline horizontale pour visualiser
* la progression des tours de sols/tontines
* Utilise Chart.js + react-chartjs-2 + Material Dashboard 2 React
* 
* LOCALISATION: src/examples/Charts/FinanceCharts/SolChart/index.js
* (selon structure définie)
=========================================================
*/

import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

// @mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ErrorIcon from "@mui/icons-material/Error";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Configuration des statuts des tours
const ROUND_STATUS = {
  completed: { 
    color: colors.success.main, 
    bgColor: colors.success.main + '20',
    icon: CheckCircleIcon, 
    label: "Complété" 
  },
  current: { 
    color: colors.info.main, 
    bgColor: colors.info.main + '20',
    icon: RadioButtonCheckedIcon, 
    label: "En cours" 
  },
  pending: { 
    color: colors.grey[400], 
    bgColor: colors.grey[100],
    icon: RadioButtonUncheckedIcon, 
    label: "À venir" 
  },
  overdue: { 
    color: colors.error.main, 
    bgColor: colors.error.main + '20',
    icon: ErrorIcon, 
    label: "En retard" 
  },
};

function SolTimelineChart({
  solData = {},
  viewMode = "timeline", // "timeline", "stepper", "chart"
  orientation = "horizontal", // "horizontal", "vertical"
  showPaymentStatus = true,
  showDates = true,
  showAmounts = true,
  showParticipants = true,
  size = "large",
  title = "Timeline du Sol",
  onRoundClick,
  ...other
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedViewMode, setSelectedViewMode] = useState(viewMode);
  const [selectedOrientation, setSelectedOrientation] = useState(orientation);
  const [expandedRound, setExpandedRound] = useState(solData.currentTurn || 1);

  // Extraire les données du sol
  const {
    name = "Sol Sans Nom",
    participants = 8,
    participantsList = [],
    amount = 5000,
    currency = "HTG",
    frequency = "monthly",
    currentTurn = 1,
    startDate = new Date().toISOString(),
    status = "active",
    payments = []
  } = solData;

  // Générer les dates des tours
  const generateSolDates = (start, freq, totalRounds) => {
    const dates = [];
    const startDate = new Date(start);
    
    for (let i = 0; i < totalRounds; i++) {
      const date = new Date(startDate);
      if (freq === "weekly") {
        date.setDate(startDate.getDate() + (i * 7));
      } else if (freq === "monthly") {
        date.setMonth(startDate.getMonth() + i);
      } else {
        date.setDate(startDate.getDate() + (i * 14)); // bi-weekly
      }
      dates.push(date);
    }
    
    return dates;
  };

  // Calculer les données de la timeline
  const timelineData = useMemo(() => {
    const totalRounds = participantsList.length || participants;
    const solDates = generateSolDates(startDate, frequency, totalRounds);
    const now = new Date();

    const rounds = Array.from({ length: totalRounds }, (_, index) => {
      const roundNumber = index + 1;
      const roundDate = solDates[index];
      const participant = participantsList[index] || { 
        name: `Participant ${roundNumber}`, 
        position: roundNumber,
        status: "upcoming"
      };

      // Déterminer le statut du tour
      let roundStatus;
      if (roundNumber < currentTurn) {
        roundStatus = "completed";
      } else if (roundNumber === currentTurn) {
        roundStatus = roundDate < now ? "overdue" : "current";
      } else {
        roundStatus = "pending";
      }

      // Calculer les statistiques de paiement
      const roundPayments = payments.filter(p => p.round === roundNumber);
      const paidCount = roundPayments.filter(p => p.paid).length;
      const paymentPercentage = totalRounds > 0 ? (paidCount / totalRounds) * 100 : 0;

      return {
        roundNumber,
        date: roundDate,
        participant,
        status: roundStatus,
        statusConfig: ROUND_STATUS[roundStatus],
        paidCount,
        totalAmount: amount * totalRounds,
        paymentPercentage,
        isUserTurn: participant.name === "Vous" || roundNumber === solData.myPosition,
        formattedDate: roundDate.toLocaleDateString('fr-HT', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        formattedAmount: new Intl.NumberFormat('fr-HT').format(amount * totalRounds)
      };
    });

    return rounds;
  }, [solData, participantsList, participants, amount, currency, frequency, currentTurn, startDate, payments]);

  // Préparer les données pour Chart.js
  const chartData = useMemo(() => {
    if (selectedViewMode !== "chart") return null;

    const labels = timelineData.map(round => round.formattedDate);
    const statusValues = timelineData.map(round => {
      switch (round.status) {
        case "completed": return 100;
        case "current": return 50;
        case "overdue": return 25;
        default: return 0;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Progression du Sol",
          data: statusValues,
          borderColor: colors.primary.main,
          backgroundColor: colors.primary.main + '20',
          pointBackgroundColor: timelineData.map(round => round.statusConfig.color),
          pointBorderColor: timelineData.map(round => round.statusConfig.color),
          pointRadius: 8,
          pointHoverRadius: 12,
          borderWidth: 3,
          tension: 0.1,
          fill: true
        }
      ]
    };
  }, [timelineData, selectedViewMode]);

  // Configuration Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            const round = timelineData[context[0].dataIndex];
            return `Tour ${round.roundNumber} - ${round.participant.name}`;
          },
          label: function(context) {
            const round = timelineData[context.dataIndex];
            return [
              `Date: ${round.formattedDate}`,
              `Montant: ${round.formattedAmount} ${currency}`,
              `Statut: ${round.statusConfig.label}`,
              round.isUserTurn ? "🎯 Votre tour" : ""
            ].filter(Boolean);
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11
          }
        }
      },
      y: {
        display: false,
        min: 0,
        max: 100
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onRoundClick) {
        const index = elements[0].index;
        const roundData = timelineData[index];
        onRoundClick(roundData, index);
      }
    }
  };

  // Handlers
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode) {
      setSelectedViewMode(newViewMode);
    }
  };

  const handleOrientationChange = () => {
    setSelectedOrientation(prev => prev === "horizontal" ? "vertical" : "horizontal");
  };

  // Rendu Stepper
  const renderStepper = () => (
    <Stepper 
      activeStep={currentTurn - 1} 
      orientation={selectedOrientation}
      sx={{ 
        width: "100%",
        ...(selectedOrientation === "horizontal" && {
          overflowX: "auto",
          "& .MuiStepConnector-root": {
            top: 22
          }
        })
      }}
    >
      {timelineData.map((round, index) => (
        <Step key={round.roundNumber}>
          <StepLabel
            StepIconComponent={() => (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: round.statusConfig.color,
                  color: "white",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  border: round.isUserTurn ? "3px solid" : "1px solid",
                  borderColor: round.isUserTurn ? colors.warning.main : "transparent"
                }}
                onClick={() => onRoundClick && onRoundClick(round, index)}
              >
                {round.status === "completed" ? "✓" : round.roundNumber}
              </Avatar>
            )}
          >
            <MDBox textAlign="center">
              <MDTypography variant="caption" fontWeight="medium">
                {round.participant.name}
              </MDTypography>
              {showDates && (
                <MDTypography variant="caption" color="text" display="block">
                  {round.formattedDate}
                </MDTypography>
              )}
              {showAmounts && (
                <MDTypography variant="caption" color="primary" display="block">
                  {round.formattedAmount} {currency}
                </MDTypography>
              )}
            </MDBox>
          </StepLabel>
          {selectedOrientation === "vertical" && (
            <StepContent>
              <MDBox p={1}>
                <Chip 
                  label={round.statusConfig.label}
                  color={round.status === "completed" ? "success" : round.status === "current" ? "info" : "default"}
                  size="small"
                />
                {round.isUserTurn && (
                  <Chip 
                    label="Votre tour"
                    color="warning"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </MDBox>
            </StepContent>
          )}
        </Step>
      ))}
    </Stepper>
  );

  // Rendu Timeline simple
  const renderTimeline = () => (
    <MDBox>
      <Grid container spacing={2} alignItems="center">
        {timelineData.map((round, index) => (
          <Grid item key={round.roundNumber}>
            <MDBox 
              textAlign="center" 
              sx={{ 
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover"
                }
              }}
              onClick={() => onRoundClick && onRoundClick(round, index)}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: round.statusConfig.bgColor,
                  color: round.statusConfig.color,
                  border: round.isUserTurn ? "2px solid" : "none",
                  borderColor: round.isUserTurn ? colors.warning.main : "transparent",
                  mb: 1
                }}
              >
                {round.status === "completed" ? "✓" : round.roundNumber}
              </Avatar>
              <MDTypography variant="caption" fontWeight="medium" display="block">
                {round.participant.name}
              </MDTypography>
              {showDates && (
                <MDTypography variant="caption" color="text" display="block">
                  {round.formattedDate}
                </MDTypography>
              )}
            </MDBox>
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );

  // Configuration de taille
  const sizeConfig = {
    small: { height: 200, padding: 2 },
    medium: { height: 300, padding: 3 },
    large: { height: 400, padding: 3 }
  };

  const config = sizeConfig[size] || sizeConfig.large;

  return (
    <Card sx={{ p: config.padding }} {...other}>
      {/* Header avec contrôles */}
      <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium" gutterBottom>
            {title} - {name}
          </MDTypography>
          <MDBox display="flex" gap={1} flexWrap="wrap">
            <Chip 
              icon={<PeopleIcon />}
              label={`${participants} participants`}
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Tour ${currentTurn}/${participants}`}
              color="primary"
              size="small"
            />
            <Chip 
              label={`${frequency === "weekly" ? "Hebdomadaire" : "Mensuel"}`}
              size="small"
              variant="outlined"
            />
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={handleOrientationChange}>
            <ViewColumnIcon />
          </IconButton>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </MDBox>
      </MDBox>

      {/* Contrôles de vue */}
      <MDBox display="flex" justifyContent="center" mb={3}>
        <ToggleButtonGroup
          value={selectedViewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="timeline">
            <TimelineIcon sx={{ mr: 0.5 }} />
            Timeline
          </ToggleButton>
          <ToggleButton value="stepper">
            <CalendarTodayIcon sx={{ mr: 0.5 }} />
            Étapes
          </ToggleButton>
          <ToggleButton value="chart">
            <TimelineIcon sx={{ mr: 0.5 }} />
            Graphique
          </ToggleButton>
        </ToggleButtonGroup>
      </MDBox>

      {/* Contenu selon le mode */}
      <MDBox height={selectedViewMode === "chart" ? config.height : "auto"}>
        {selectedViewMode === "timeline" && renderTimeline()}
        {selectedViewMode === "stepper" && renderStepper()}
        {selectedViewMode === "chart" && chartData && (
          <Line data={chartData} options={chartOptions} />
        )}
      </MDBox>

      {/* Statistiques */}
      {showPaymentStatus && (
        <MDBox mt={3} pt={2} borderTop={1} borderColor="grey.200">
          <Grid container spacing={2}>
            {Object.entries(ROUND_STATUS).map(([key, config]) => {
              const count = timelineData.filter(r => r.status === key).length;
              if (count === 0) return null;
              
              return (
                <Grid item key={key}>
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: config.color,
                        borderRadius: "50%"
                      }}
                    />
                    <MDTypography variant="caption">
                      {count} {config.label.toLowerCase()}
                    </MDTypography>
                  </MDBox>
                </Grid>
              );
            })}
          </Grid>
        </MDBox>
      )}

      {/* Menu actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          Voir détails complets
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Exporter calendrier
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Partager timeline
        </MenuItem>
      </Menu>
    </Card>
  );
}

SolTimelineChart.propTypes = {
  solData: PropTypes.object,
  viewMode: PropTypes.oneOf(['timeline', 'stepper', 'chart']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  showPaymentStatus: PropTypes.bool,
  showDates: PropTypes.bool,
  showAmounts: PropTypes.bool,
  showParticipants: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string,
  onRoundClick: PropTypes.func,
};

export default SolTimelineChart;