// src/components/FinApp/SolTimelineCard/index.js
import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// FinApp components
import CurrencyDisplay from "components/FinApp/CurrencyDisplay";

// Utilitaire pour générer les dates du sol
const generateSolDates = (startDate, frequency, totalRounds) => {
  const dates = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < totalRounds; i++) {
    const date = new Date(start);
    if (frequency === "weekly") {
      date.setDate(start.getDate() + (i * 7));
    } else {
      date.setMonth(start.getMonth() + i);
    }
    dates.push(date);
  }
  
  return dates;
};

// Statut des tours
const ROUND_STATUS = {
  completed: { color: "success", icon: "check_circle", label: "Complété" },
  current: { color: "info", icon: "radio_button_checked", label: "En cours" },
  pending: { color: "grey", icon: "radio_button_unchecked", label: "À venir" },
  overdue: { color: "error", icon: "error", label: "En retard" },
};

function SolTimelineCard({
  solName = "Sol Famille",
  participants = [],
  currentRound = 3,
  amount = 5000,
  currency = "HTG",
  frequency = "monthly",
  startDate = new Date().toISOString(),
  payments = [],
  orientation = "vertical",
  showPaymentStatus = true,
  showDates = true,
  showAmounts = true,
  compact = false,
  maxItems = null,
  ...other
}) {
  const [expandedRound, setExpandedRound] = useState(currentRound);

  // Génération des dates
  const solDates = generateSolDates(startDate, frequency, participants.length);
  
  // Calcul du statut de chaque tour
  const getRoundStatus = (roundIndex) => {
    const roundNumber = roundIndex + 1;
    const roundDate = solDates[roundIndex];
    const now = new Date();
    
    if (roundNumber < currentRound) return "completed";
    if (roundNumber === currentRound) {
      return roundDate < now ? "overdue" : "current";
    }
    return "pending";
  };

  // Vérifier si un participant a payé pour un tour donné
  const hasParticipantPaid = (participantId, round) => {
    return payments.some(p => p.participantId === participantId && p.round === round && p.paid);
  };

  // Obtenir les statistiques de paiement pour un tour
  const getPaymentStats = (round) => {
    const paidCount = participants.filter(p => hasParticipantPaid(p.id, round)).length;
    const totalCount = participants.length;
    return { paid: paidCount, total: totalCount, percentage: (paidCount / totalCount) * 100 };
  };

  // Formatage des dates
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-HT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Items à afficher (avec limite si compact)
  const displayItems = maxItems ? participants.slice(0, maxItems) : participants;
  const hasMore = maxItems && participants.length > maxItems;

  return (
    <Card {...other}>
      <MDBox p={compact ? 2 : 2.5}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              Timeline - {solName}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {participants.length} participants • Tour {currentRound}/{participants.length}
            </MDTypography>
          </MDBox>
          
          <MDBox display="flex" gap={1}>
            <Tooltip title={orientation === "vertical" ? "Vue horizontale" : "Vue verticale"}>
              <IconButton size="small">
                <Icon fontSize="small">
                  {orientation === "vertical" ? "view_column" : "view_agenda"}
                </Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        </MDBox>

        {/* Timeline principale */}
        {orientation === "vertical" ? (
          <Timeline
            sx={{
              p: 0,
              m: 0,
              "& .MuiTimelineItem-root": {
                minHeight: compact ? 60 : 80,
                "&:before": { display: "none" }
              }
            }}
          >
            {displayItems.map((participant, index) => {
              const roundNumber = index + 1;
              const status = getRoundStatus(index);
              const statusConfig = ROUND_STATUS[status];
              const paymentStats = getPaymentStats(roundNumber);
              const isExpanded = expandedRound === roundNumber;
              
              return (
                <TimelineItem key={participant.id}>
                  <TimelineSeparator>
                    <TimelineDot 
                      color={statusConfig.color}
                      sx={{ 
                        cursor: "pointer",
                        width: compact ? 32 : 40,
                        height: compact ? 32 : 40,
                      }}
                      onClick={() => setExpandedRound(isExpanded ? null : roundNumber)}
                    >
                      {status === "completed" ? (
                        <Icon fontSize={compact ? "small" : "medium"}>check</Icon>
                      ) : status === "current" ? (
                        <Avatar 
                          src={participant.avatar} 
                          sx={{ width: compact ? 24 : 32, height: compact ? 24 : 32 }}
                        >
                          {!participant.avatar && participant.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <MDTypography variant="caption" color="white" fontWeight="bold">
                          {roundNumber}
                        </MDTypography>
                      )}
                    </TimelineDot>
                    {index < displayItems.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  
                  <TimelineContent sx={{ py: compact ? 1 : 1.5 }}>
                    <MDBox>
                      {/* Info principale */}
                      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <MDTypography 
                            variant={compact ? "button" : "h6"} 
                            fontWeight="medium"
                          >
                            {participant.name}
                          </MDTypography>
                          <Chip
                            label={statusConfig.label}
                            size="small"
                            color={statusConfig.color}
                            variant="outlined"
                          />
                        </MDBox>
                        
                        {showAmounts && (
                          <CurrencyDisplay
                            amount={amount * participants.length}
                            currency={currency}
                            variant="button"
                            color={status === "completed" ? "success" : "text"}
                            fontWeight="medium"
                            showSymbol={true}
                            animate={false}
                            size="small"
                          />
                        )}
                      </MDBox>

                      {/* Date et position */}
                      <MDBox display="flex" alignItems="center" gap={2} mb={1}>
                        {showDates && (
                          <MDTypography variant="caption" color="text">
                            📅 {formatDate(solDates[index])}
                          </MDTypography>
                        )}
                        <MDTypography variant="caption" color="text">
                          Position #{roundNumber}
                        </MDTypography>
                      </MDBox>

                      {/* Statut des paiements (si étendu) */}
                      {showPaymentStatus && isExpanded && (
                        <MDBox mt={1} p={1} bgcolor="grey.50" borderRadius={1}>
                          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <MDTypography variant="caption" fontWeight="medium">
                              Paiements pour ce tour
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              {paymentStats.paid}/{paymentStats.total} 
                              ({paymentStats.percentage.toFixed(0)}%)
                            </MDTypography>
                          </MDBox>
                          
                          {/* Liste des participants avec statut paiement */}
                          <MDBox display="flex" flexWrap="wrap" gap={0.5}>
                            {participants.map((p) => (
                              <Tooltip 
                                key={p.id} 
                                title={`${p.name} - ${hasParticipantPaid(p.id, roundNumber) ? 'Payé' : 'Non payé'}`}
                              >
                                <Avatar
                                  src={p.avatar}
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: hasParticipantPaid(p.id, roundNumber) ? "success.main" : "grey.300",
                                    border: hasParticipantPaid(p.id, roundNumber) ? "2px solid" : "1px solid",
                                    borderColor: hasParticipantPaid(p.id, roundNumber) ? "success.main" : "grey.400",
                                  }}
                                >
                                  {!p.avatar && p.name.charAt(0)}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </MDBox>
                        </MDBox>
                      )}
                    </MDBox>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        ) : (
          // Version horizontale (Stepper)
          <MDBox sx={{ overflowX: "auto" }}>
            <Stepper 
              activeStep={currentRound - 1} 
              alternativeLabel
              sx={{ minWidth: participants.length * 120 }}
            >
              {displayItems.map((participant, index) => {
                const roundNumber = index + 1;
                const status = getRoundStatus(index);
                const statusConfig = ROUND_STATUS[status];
                
                return (
                  <Step key={participant.id} completed={status === "completed"}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Avatar
                          src={participant.avatar}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: statusConfig.color + ".main",
                            border: status === "current" ? "3px solid" : "1px solid",
                            borderColor: status === "current" ? "primary.main" : "grey.300",
                          }}
                        >
                          {status === "completed" ? (
                            <Icon>check</Icon>
                          ) : !participant.avatar ? (
                            participant.name.charAt(0)
                          ) : null}
                        </Avatar>
                      )}
                    >
                      <MDBox textAlign="center" mt={1}>
                        <MDTypography variant="button" fontWeight="medium">
                          {participant.name}
                        </MDTypography>
                        {showDates && (
                          <MDTypography variant="caption" color="text" display="block">
                            {formatDate(solDates[index])}
                          </MDTypography>
                        )}
                        {showAmounts && (
                          <CurrencyDisplay
                            amount={amount * participants.length}
                            currency={currency}
                            variant="caption"
                            color="text"
                            showSymbol={true}
                            animate={false}
                            size="small"
                          />
                        )}
                      </MDBox>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </MDBox>
        )}

        {/* Indicateur "voir plus" si compact */}
        {hasMore && (
          <MDBox textAlign="center" mt={2}>
            <MDButton variant="text" size="small">
              Voir {participants.length - maxItems} autres participants
            </MDButton>
          </MDBox>
        )}

        {/* Légende */}
        <MDBox mt={2} pt={2} borderTop={1} borderColor="grey.200">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <MDBox display="flex" gap={2} flexWrap="wrap">
              {Object.entries(ROUND_STATUS).map(([key, config]) => (
                <MDBox key={key} display="flex" alignItems="center" gap={0.5}>
                  <Icon fontSize="small" color={config.color}>
                    {config.icon}
                  </Icon>
                  <MDTypography variant="caption" color="text">
                    {config.label}
                  </MDTypography>
                </MDBox>
              ))}
            </MDBox>
            
            <MDTypography variant="caption" color="text">
              Cliquez sur un tour pour voir les détails
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Props par défaut
SolTimelineCard.defaultProps = {
  solName: "Sol Famille",
  participants: [],
  currentRound: 1,
  amount: 5000,
  currency: "HTG",
  frequency: "monthly",
  startDate: new Date().toISOString(),
  payments: [],
  orientation: "vertical",
  showPaymentStatus: true,
  showDates: true,
  showAmounts: true,
  compact: false,
  maxItems: null,
};

// Validation des props
SolTimelineCard.propTypes = {
  solName: PropTypes.string,
  participants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  })),
  currentRound: PropTypes.number,
  amount: PropTypes.number,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  frequency: PropTypes.oneOf(["weekly", "monthly"]),
  startDate: PropTypes.string,
  payments: PropTypes.arrayOf(PropTypes.shape({
    participantId: PropTypes.string,
    round: PropTypes.number,
    paid: PropTypes.bool,
    amount: PropTypes.number,
    date: PropTypes.string,
  })),
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  showPaymentStatus: PropTypes.bool,
  showDates: PropTypes.bool,
  showAmounts: PropTypes.bool,
  compact: PropTypes.bool,
  maxItems: PropTypes.number,
};

export default SolTimelineCard;

// Export des utilitaires
export { generateSolDates, ROUND_STATUS };