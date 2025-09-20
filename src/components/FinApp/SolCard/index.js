import React, { useState } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';

// @mui icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from 'components/FinApp/CurrencyDisplay';

function SolCard({
  solName,
  solType = "family",
  participants = 0, // Nombre de participants
  participantsList = [], // Liste détaillée des participants
  amount,
  currency = "HTG",
  frequency = "monthly",
  nextPayment,
  myPosition,
  currentTurn,
  status = "active",
  description,
  onViewDetails,
  onMakePayment,
  ...other
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Calcul du progrès
  const progress = currentTurn && participants ? (currentTurn / participants) * 100 : 0;

  // Déterminer la couleur selon le type de sol
  const getTypeColor = () => {
    switch (solType) {
      case "family": return "success";
      case "work": return "info";
      case "investment": return "warning";
      case "student": return "secondary";
      case "community": return "primary";
      default: return "primary";
    }
  };

  // Déterminer le statut de couleur
  const getStatusColor = () => {
    switch (status) {
      case "active": return "success";
      case "pending": return "warning";
      case "completed": return "info";
      case "inactive": return "error";
      default: return "primary";
    }
  };

  // Formatter la fréquence
  const formatFrequency = () => {
    switch (frequency) {
      case "weekly": return "Hebdomadaire";
      case "biweekly": return "Bi-mensuel";
      case "monthly": return "Mensuel";
      case "quarterly": return "Trimestriel";
      default: return frequency;
    }
  };

  // Formatter le type
  const formatType = () => {
    switch (solType) {
      case "family": return "Famille";
      case "work": return "Travail";
      case "investment": return "Investissement";
      case "student": return "Étudiant";
      case "community": return "Communauté";
      default: return solType;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
      {...other}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header avec titre et badges */}
        <MDBox mb={2}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                {solName}
              </MDTypography>
            </Grid>
            <Grid item>
              <Chip 
                label={formatType()} 
                color={getTypeColor()} 
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Chip 
                label={status} 
                color={getStatusColor()} 
                size="small"
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Montant principal */}
        <MDBox textAlign="center" mb={2}>
          <CurrencyDisplay
            amount={amount}
            currency={currency}
            variant="h4"
            fontWeight="bold"
            color="primary"
            showTrend={false}
          />
          <MDTypography variant="caption" color="text">
            {formatFrequency()}
          </MDTypography>
        </MDBox>

        {/* Informations participants */}
        <MDBox mb={2}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <MDTypography variant="body2" color="text">
                  {participants} participants
                </MDTypography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <MDTypography variant="body2" color="text">
                  Position {myPosition}
                </MDTypography>
              </Box>
            </Grid>
          </Grid>
        </MDBox>

        {/* Avatars des participants (si liste disponible) */}
        {Array.isArray(participantsList) && participantsList.length > 0 && (
          <MDBox mb={2}>
            <AvatarGroup max={6} sx={{ justifyContent: 'flex-start' }}>
              {participantsList.slice(0, 6).map((participant, index) => (
                <Avatar 
                  key={index}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    backgroundColor: participant.status === 'paid' ? 'success.light' : 
                                   participant.status === 'current' ? 'warning.light' : 'grey.300'
                  }}
                >
                  {participant.name.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>
          </MDBox>
        )}

        {/* Progrès du sol */}
        <MDBox mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDTypography variant="body2" color="text">
              Tour {currentTurn} sur {participants}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {progress.toFixed(0)}%
            </MDTypography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </MDBox>

        {/* Prochaine échéance */}
        {nextPayment && (
          <MDBox>
            <MDTypography variant="body2" color="text">
              Prochain paiement : {new Date(nextPayment).toLocaleDateString('fr-FR')}
            </MDTypography>
          </MDBox>
        )}

        {/* Description (collapsible) */}
        {description && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <MDBox mt={2} pt={2} borderTop="1px solid" borderColor="divider">
              <MDTypography variant="body2" color="text">
                {description}
              </MDTypography>
            </MDBox>
          </Collapse>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <MDButton 
          variant="outlined" 
          size="small"
          onClick={onViewDetails}
        >
          Détails
        </MDButton>
        
        <Box>
          {description && (
            <IconButton 
              onClick={handleExpandClick}
              size="small"
              sx={{ mr: 1 }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          
          <MDButton 
            variant="contained" 
            size="small"
            onClick={onMakePayment}
            startIcon={<AttachMoneyIcon />}
          >
            Payer
          </MDButton>
        </Box>
      </CardActions>
    </Card>
  );
}

SolCard.propTypes = {
  solName: PropTypes.string.isRequired,
  solType: PropTypes.oneOf(["family", "work", "investment", "student", "community"]),
  participants: PropTypes.number,
  participantsList: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    position: PropTypes.number,
    status: PropTypes.string,
    avatar: PropTypes.string
  })),
  amount: PropTypes.number.isRequired,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  frequency: PropTypes.oneOf(["weekly", "biweekly", "monthly", "quarterly"]),
  nextPayment: PropTypes.string,
  myPosition: PropTypes.number,
  currentTurn: PropTypes.number,
  status: PropTypes.oneOf(["active", "pending", "completed", "inactive"]),
  description: PropTypes.string,
  onViewDetails: PropTypes.func,
  onMakePayment: PropTypes.func,
};



export default SolCard;