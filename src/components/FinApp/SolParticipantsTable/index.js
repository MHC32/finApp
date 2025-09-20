// src/components/FinApp/SolParticipantsTable/index.js
import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ButtonGroup from '@mui/material/ButtonGroup';

// @mui icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import CrownIcon from '@mui/icons-material/EmojiEvents';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BlockIcon from '@mui/icons-material/Block';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';

// Statuts des participants
const PARTICIPANT_STATUS = {
  active: {
    label: 'Actif',
    color: 'success',
    icon: CheckCircleIcon
  },
  pending: {
    label: 'En attente',
    color: 'warning',
    icon: PendingIcon
  },
  late: {
    label: 'En retard',
    color: 'error',
    icon: WarningIcon
  },
  excluded: {
    label: 'Exclu',
    color: 'default',
    icon: BlockIcon
  },
  completed: {
    label: 'Terminé',
    color: 'info',
    icon: CheckCircleIcon
  }
};

// Statuts de paiement
const PAYMENT_STATUS = {
  paid: {
    label: 'Payé',
    color: 'success',
    icon: CheckCircleIcon
  },
  pending: {
    label: 'En attente',
    color: 'warning',
    icon: PendingIcon
  },
  late: {
    label: 'En retard',
    color: 'error',
    icon: WarningIcon
  },
  exempted: {
    label: 'Exempté',
    color: 'info',
    icon: CheckCircleIcon
  },
  cancelled: {
    label: 'Annulé',
    color: 'default',
    icon: CancelIcon
  }
};

// Rôles des participants
const PARTICIPANT_ROLES = {
  organizer: {
    label: 'Organisateur',
    color: 'primary',
    icon: CrownIcon
  },
  co_organizer: {
    label: 'Co-organisateur',
    color: 'secondary',
    icon: AdminPanelSettingsIcon
  },
  member: {
    label: 'Membre',
    color: 'default',
    icon: PersonIcon
  },
  vip: {
    label: 'VIP',
    color: 'warning',
    icon: StarIcon
  }
};

// Configuration des colonnes
const TABLE_COLUMNS = [
  {
    id: 'participant',
    label: 'Participant',
    sortable: true,
    width: '25%'
  },
  {
    id: 'position',
    label: 'Position',
    sortable: true,
    width: '8%',
    align: 'center'
  },
  {
    id: 'role',
    label: 'Rôle',
    sortable: true,
    width: '12%',
    align: 'center'
  },
  {
    id: 'paymentStatus',
    label: 'Paiement Actuel',
    sortable: true,
    width: '15%',
    align: 'center'
  },
  {
    id: 'participation',
    label: 'Participation',
    sortable: true,
    width: '12%',
    align: 'center'
  },
  {
    id: 'totalPaid',
    label: 'Total Payé',
    sortable: true,
    width: '12%',
    align: 'right'
  },
  {
    id: 'status',
    label: 'Statut',
    sortable: true,
    width: '10%',
    align: 'center'
  },
  {
    id: 'actions',
    label: 'Actions',
    sortable: false,
    width: '6%',
    align: 'center'
  }
];

const SolParticipantsTable = ({
  participants = [],
  sol = null,
  title = "Participants du Sol",
  currentRound = 1,
  currency = 'HTG',
  onParticipantEdit,
  onParticipantRemove,
  onParticipantContact,
  onParticipantHistory,
  onPaymentUpdate,
  onPositionChange,
  onRoleChange,
  onBulkAction,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  showSelection = true,
  showContactInfo = false,
  defaultRowsPerPage = 10,
  isOrganizer = false,
  currentUserId = null,
  ...other
}) => {
  // États pour le tri et pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState('position');
  const [order, setOrder] = useState('asc');

  // États pour les filtres
  const [searchText, setSearchText] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState([]);
  const [quickFilter, setQuickFilter] = useState('all');
  const [showOnlyLate, setShowOnlyLate] = useState(false);

  // États pour les actions
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);

  // États pour les dialogs
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [contactInfoVisible, setContactInfoVisible] = useState(showContactInfo);

  // Enrichir les données des participants
  const enrichedParticipants = useMemo(() => {
    if (!sol) return participants;

    return participants.map(participant => {
      // Calculer le statut de paiement pour le tour actuel
      const currentPayment = participant.payments?.find(p => p.round === currentRound);
      const paymentStatus = currentPayment?.status || 'pending';
      
      // Calculer le total payé
      const totalPaid = participant.payments?.reduce((sum, payment) => {
        return payment.status === 'paid' ? sum + payment.amount : sum;
      }, 0) || 0;

      // Calculer le pourcentage de participation
      const expectedPayments = Math.min(currentRound, participant.position);
      const actualPayments = participant.payments?.filter(p => p.status === 'paid').length || 0;
      const participationRate = expectedPayments > 0 ? (actualPayments / expectedPayments) * 100 : 100;

      // Détermine si c'est le tour du participant
      const isCurrentTurn = participant.position === currentRound;
      const hasPaid = currentPayment?.status === 'paid';
      const isLate = paymentStatus === 'late' || (currentPayment && !hasPaid && new Date() > new Date(currentPayment.dueDate));

      // Statut global du participant
      let globalStatus = 'active';
      if (isLate) globalStatus = 'late';
      if (participant.status === 'excluded') globalStatus = 'excluded';
      if (participant.position < currentRound && hasPaid) globalStatus = 'completed';

      return {
        ...participant,
        paymentStatus,
        totalPaid,
        participationRate,
        isCurrentTurn,
        hasPaid,
        isLate,
        globalStatus,
        expectedAmount: expectedPayments * (sol.amount || 0),
        currentPayment
      };
    });
  }, [participants, sol, currentRound]);

  // Filtrer et trier les participants
  const filteredParticipants = useMemo(() => {
    let filtered = enrichedParticipants.filter(participant => {
      // Filtre par texte de recherche
      if (searchText && !participant.name.toLowerCase().includes(searchText.toLowerCase()) && 
          !participant.email?.toLowerCase().includes(searchText.toLowerCase()) &&
          !participant.phone?.includes(searchText)) {
        return false;
      }

      // Filtre par rôle
      if (selectedRoles.length > 0 && !selectedRoles.includes(participant.role || 'member')) {
        return false;
      }

      // Filtre par statut global
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(participant.globalStatus)) {
        return false;
      }

      // Filtre par statut de paiement
      if (selectedPaymentStatuses.length > 0 && !selectedPaymentStatuses.includes(participant.paymentStatus)) {
        return false;
      }

      // Filtre pour les retardataires seulement
      if (showOnlyLate && !participant.isLate) {
        return false;
      }

      // Filtres rapides
      switch (quickFilter) {
        case 'current_turn':
          return participant.isCurrentTurn;
        case 'paid':
          return participant.hasPaid;
        case 'unpaid':
          return !participant.hasPaid && participant.position <= currentRound;
        case 'late':
          return participant.isLate;
        case 'organizers':
          return ['organizer', 'co_organizer'].includes(participant.role);
        case 'completed':
          return participant.globalStatus === 'completed';
        default:
          return true;
      }
    });

    // Trier
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === 'position' || orderBy === 'totalPaid' || orderBy === 'participation') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (orderBy === 'participant') {
        aVal = a.name;
        bVal = b.name;
      }

      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [enrichedParticipants, searchText, selectedRoles, selectedStatuses, selectedPaymentStatuses, 
      showOnlyLate, quickFilter, orderBy, order, currentRound]);

  // Données paginées
  const paginatedParticipants = useMemo(() => {
    if (!showPagination) return filteredParticipants;
    const startIndex = page * rowsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredParticipants, page, rowsPerPage, showPagination]);

  // Handlers de tri
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  // Handlers de sélection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(paginatedParticipants.map(p => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Handlers du menu d'actions
  const handleMenuOpen = (event, participant) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedParticipant(participant);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedParticipant(null);
  };

  // Handlers d'actions
  const handleContact = useCallback(() => {
    handleMenuClose();
    if (onParticipantContact && selectedParticipant) {
      onParticipantContact(selectedParticipant);
    } else {
      setContactDialogOpen(true);
    }
  }, [onParticipantContact, selectedParticipant]);

  const handleHistory = useCallback(() => {
    handleMenuClose();
    if (onParticipantHistory && selectedParticipant) {
      onParticipantHistory(selectedParticipant);
    }
  }, [onParticipantHistory, selectedParticipant]);

  const handlePaymentUpdate = useCallback(() => {
    handleMenuClose();
    if (onPaymentUpdate && selectedParticipant) {
      onPaymentUpdate(selectedParticipant);
    } else {
      setPaymentDialogOpen(true);
    }
  }, [onPaymentUpdate, selectedParticipant]);

  const handleRoleChange = useCallback(() => {
    handleMenuClose();
    if (onRoleChange && selectedParticipant) {
      onRoleChange(selectedParticipant);
    } else {
      setRoleDialogOpen(true);
    }
  }, [onRoleChange, selectedParticipant]);

  const handlePositionChange = useCallback(() => {
    handleMenuClose();
    if (onPositionChange && selectedParticipant) {
      onPositionChange(selectedParticipant);
    } else {
      setPositionDialogOpen(true);
    }
  }, [onPositionChange, selectedParticipant]);

  const handleRemove = useCallback(() => {
    handleMenuClose();
    if (onParticipantRemove && selectedParticipant && 
        window.confirm(`Êtes-vous sûr de vouloir retirer ${selectedParticipant.name} du sol ?`)) {
      onParticipantRemove(selectedParticipant.id);
    }
  }, [onParticipantRemove, selectedParticipant]);

  // Handlers des actions en lot
  const handleBulkAction = useCallback((action) => {
    setBulkActionAnchor(null);
    if (onBulkAction) {
      onBulkAction(action, selectedRows);
    }
  }, [onBulkAction, selectedRows]);

  // Render du statut de paiement avec progress
  const renderPaymentStatus = (participant) => {
    const { paymentStatus, participationRate, currentPayment } = participant;
    const status = PAYMENT_STATUS[paymentStatus] || PAYMENT_STATUS.pending;

    return (
      <MDBox>
        <MDBox display="flex" alignItems="center" justifyContent="center" mb={0.5}>
          <Chip
            icon={React.createElement(status.icon, { sx: { fontSize: 16 } })}
            label={status.label}
            color={status.color}
            size="small"
            variant={participant.isCurrentTurn ? "filled" : "outlined"}
          />
        </MDBox>
        <LinearProgress
          variant="determinate"
          value={participationRate}
          sx={{
            height: 4,
            borderRadius: 2,
            '& .MuiLinearProgress-bar': {
              bgcolor: participationRate >= 80 ? 'success.main' : 
                      participationRate >= 60 ? 'warning.main' : 'error.main'
            }
          }}
        />
        <MDTypography variant="caption" color="text" textAlign="center" display="block">
          {participationRate.toFixed(0)}%
        </MDTypography>
      </MDBox>
    );
  };

  // Render des informations du participant
  const renderParticipantInfo = (participant) => {
    const isCurrentUser = participant.id === currentUserId;
    
    return (
      <MDBox display="flex" alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            participant.isCurrentTurn ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            ) : participant.hasPaid ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
            ) : null
          }
        >
          <Avatar
            src={participant.avatar}
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1,
              border: isCurrentUser ? 2 : 0,
              borderColor: 'primary.main'
            }}
          >
            {participant.name?.charAt(0)}
          </Avatar>
        </Badge>
        
        <MDBox>
          <MDBox display="flex" alignItems="center" gap={0.5}>
            <MDTypography variant="body2" fontWeight="medium">
              {participant.name}
              {isCurrentUser && ' (Vous)'}
            </MDTypography>
            {participant.role === 'organizer' && (
              <CrownIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            )}
            {participant.role === 'vip' && (
              <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            )}
          </MDBox>
          
          {contactInfoVisible && (participant.email || participant.phone) && (
            <MDTypography variant="caption" color="text" sx={{ display: 'block' }}>
              {participant.email || participant.phone}
            </MDTypography>
          )}
          
          {participant.isCurrentTurn && (
            <Chip
              label="Tour actuel"
              color="warning"
              size="small"
              sx={{ mt: 0.5, fontSize: 10, height: 16 }}
            />
          )}
        </MDBox>
      </MDBox>
    );
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalParticipants = filteredParticipants.length;
    const activePaid = filteredParticipants.filter(p => p.hasPaid && p.position <= currentRound).length;
    const expectedPayers = filteredParticipants.filter(p => p.position <= currentRound).length;
    const lateParticipants = filteredParticipants.filter(p => p.isLate).length;
    const totalCollected = filteredParticipants.reduce((sum, p) => sum + p.totalPaid, 0);
    const currentTurnParticipant = filteredParticipants.find(p => p.isCurrentTurn);

    return {
      totalParticipants,
      activePaid,
      expectedPayers,
      lateParticipants,
      totalCollected,
      currentTurnParticipant,
      paymentRate: expectedPayers > 0 ? (activePaid / expectedPayers) * 100 : 100
    };
  }, [filteredParticipants, currentRound]);

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium">
                  {title}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {stats.totalParticipants} participant{stats.totalParticipants > 1 ? 's' : ''} 
                  · Tour {currentRound}
                  · {stats.activePaid}/{stats.expectedPayers} payé{stats.activePaid > 1 ? 's' : ''}
                  {stats.lateParticipants > 0 && ` · ${stats.lateParticipants} en retard`}
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center" gap={1}>
                {selectedRows.length > 0 && isOrganizer && (
                  <MDButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                  >
                    Actions ({selectedRows.length})
                  </MDButton>
                )}
                
                {showFilters && (
                  <IconButton
                    size="small"
                    onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                    color={searchText || selectedRoles.length > 0 || selectedStatuses.length > 0 ? "primary" : "default"}
                  >
                    <FilterListIcon />
                  </IconButton>
                )}
              </MDBox>
            </MDBox>
          }
          action={
            showSearch && (
              <TextField
                size="small"
                placeholder="Rechercher un participant..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ minWidth: 200 }}
              />
            )
          }
        />

        {/* Statistiques rapides */}
        <CardContent sx={{ pt: 1, pb: 2 }}>
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Taux de Paiement</MDTypography>
              <MDTypography 
                variant="body2" 
                fontWeight="bold"
                color={stats.paymentRate >= 80 ? 'success' : stats.paymentRate >= 60 ? 'warning' : 'error'}
              >
                {stats.paymentRate.toFixed(1)}%
              </MDTypography>
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Total Collecté</MDTypography>
              <CurrencyDisplay
                amount={stats.totalCollected}
                currency={currency}
                variant="body2"
                fontWeight="bold"
              />
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Tour Actuel</MDTypography>
              <MDTypography variant="body2" fontWeight="bold">
                {stats.currentTurnParticipant?.name || `Position ${currentRound}`}
              </MDTypography>
            </MDBox>
            
            {stats.lateParticipants > 0 && (
              <MDBox textAlign="center">
                <MDTypography variant="caption" color="text">En Retard</MDTypography>
                <MDTypography variant="body2" fontWeight="bold" color="error">
                  {stats.lateParticipants}
                </MDTypography>
              </MDBox>
            )}
          </Stack>
        </CardContent>

        {/* Filtres rapides */}
        <CardContent sx={{ py: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <ButtonGroup size="small" variant="outlined">
              <MDButton
                variant={quickFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('all')}
              >
                Tous
              </MDButton>
              <MDButton
                variant={quickFilter === 'current_turn' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('current_turn')}
              >
                Tour actuel
              </MDButton>
              <MDButton
                variant={quickFilter === 'paid' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('paid')}
                color="success"
              >
                Payé
              </MDButton>
              <MDButton
                variant={quickFilter === 'unpaid' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('unpaid')}
                color="warning"
              >
                Non payé
              </MDButton>
              <MDButton
                variant={quickFilter === 'late' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('late')}
                color="error"
              >
                En retard
              </MDButton>
              <MDButton
                variant={quickFilter === 'organizers' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('organizers')}
              >
                Organisateurs
              </MDButton>
            </ButtonGroup>
            
            <FormControlLabel
              control={
                <Switch
                  checked={showOnlyLate}
                  onChange={(e) => setShowOnlyLate(e.target.checked)}
                  size="small"
                />
              }
              label="Retardataires seulement"
            />
          </Stack>
        </CardContent>

        {/* Panel de filtres avancés */}
        {showFiltersPanel && (
          <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Rôles</InputLabel>
                <Select
                  multiple
                  value={selectedRoles}
                  onChange={(e) => setSelectedRoles(e.target.value)}
                  input={<OutlinedInput label="Rôles" />}
                  renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                >
                  {Object.entries(PARTICIPANT_ROLES).map(([key, role]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedRoles.includes(key)} />
                      <ListItemText primary={role.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Statuts</InputLabel>
                <Select
                  multiple
                  value={selectedStatuses}
                  onChange={(e) => setSelectedStatuses(e.target.value)}
                  input={<OutlinedInput label="Statuts" />}
                  renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                >
                  {Object.entries(PARTICIPANT_STATUS).map(([key, status]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedStatuses.includes(key)} />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Paiements</InputLabel>
                <Select
                  multiple
                  value={selectedPaymentStatuses}
                  onChange={(e) => setSelectedPaymentStatuses(e.target.value)}
                  input={<OutlinedInput label="Paiements" />}
                  renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                >
                  {Object.entries(PAYMENT_STATUS).map(([key, status]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedPaymentStatuses.includes(key)} />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <MDButton
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchText('');
                  setSelectedRoles([]);
                  setSelectedStatuses([]);
                  setSelectedPaymentStatuses([]);
                  setQuickFilter('all');
                  setShowOnlyLate(false);
                }}
              >
                Réinitialiser
              </MDButton>
            </Stack>
          </CardContent>
        )}

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {showSelection && isOrganizer && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedParticipants.length}
                      checked={paginatedParticipants.length > 0 && selectedRows.length === paginatedParticipants.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                
                {TABLE_COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ width: column.width }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {paginatedParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_COLUMNS.length + (showSelection && isOrganizer ? 1 : 0)} align="center" sx={{ py: 4 }}>
                    <Alert severity="info">
                      <MDTypography variant="body2">
                        {searchText || selectedRoles.length > 0 || selectedStatuses.length > 0
                          ? 'Aucun participant ne correspond aux critères de recherche.'
                          : 'Aucun participant trouvé.'}
                      </MDTypography>
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedParticipants.map((participant) => (
                  <TableRow
                    key={participant.id}
                    hover
                    selected={selectedRows.includes(participant.id)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: participant.isCurrentTurn ? 'warning.50' : 'inherit',
                      '&:hover': {
                        bgcolor: participant.isCurrentTurn ? 'warning.100' : 'action.hover'
                      }
                    }}
                  >
                    {showSelection && isOrganizer && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(participant.id)}
                          onChange={() => handleSelectRow(participant.id)}
                        />
                      </TableCell>
                    )}

                    {/* Participant */}
                    <TableCell>
                      {renderParticipantInfo(participant)}
                    </TableCell>

                    {/* Position */}
                    <TableCell align="center">
                      <Chip
                        label={participant.position}
                        color={participant.isCurrentTurn ? 'warning' : 'default'}
                        size="small"
                        variant={participant.isCurrentTurn ? 'filled' : 'outlined'}
                      />
                    </TableCell>

                    {/* Rôle */}
                    <TableCell align="center">
                      <Chip
                        icon={React.createElement(PARTICIPANT_ROLES[participant.role || 'member'].icon, {
                          sx: { fontSize: 16 }
                        })}
                        label={PARTICIPANT_ROLES[participant.role || 'member'].label}
                        color={PARTICIPANT_ROLES[participant.role || 'member'].color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Statut de paiement */}
                    <TableCell align="center">
                      {renderPaymentStatus(participant)}
                    </TableCell>

                    {/* Participation */}
                    <TableCell align="center">
                      <MDBox textAlign="center">
                        <MDTypography variant="body2" fontWeight="medium">
                          {participant.payments?.filter(p => p.status === 'paid').length || 0}
                          /
                          {Math.min(currentRound, participant.position)}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          tours
                        </MDTypography>
                      </MDBox>
                    </TableCell>

                    {/* Total payé */}
                    <TableCell align="right">
                      <CurrencyDisplay
                        amount={participant.totalPaid}
                        currency={currency}
                        variant="body2"
                        fontWeight="medium"
                      />
                      <MDTypography variant="caption" color="text" display="block">
                        sur <CurrencyDisplay
                          amount={participant.expectedAmount}
                          currency={currency}
                          variant="caption"
                        />
                      </MDTypography>
                    </TableCell>

                    {/* Statut global */}
                    <TableCell align="center">
                      <Chip
                        icon={React.createElement(PARTICIPANT_STATUS[participant.globalStatus].icon, {
                          sx: { fontSize: 16 }
                        })}
                        label={PARTICIPANT_STATUS[participant.globalStatus].label}
                        color={PARTICIPANT_STATUS[participant.globalStatus].color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, participant)}
                        disabled={!isOrganizer && participant.id !== currentUserId}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {showPagination && (
          <TablePagination
            component="div"
            count={filteredParticipants.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        )}

        {/* Menu d'actions */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleContact}>
            <ListItemIcon>
              <MessageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Contacter</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleHistory}>
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Historique</ListItemText>
          </MenuItem>
          
          {isOrganizer && (
            <>
              <Divider />
              
              <MenuItem onClick={handlePaymentUpdate}>
                <ListItemIcon>
                  <PaymentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Mise à jour paiement</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handleRoleChange}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Changer rôle</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handlePositionChange}>
                <ListItemIcon>
                  <SwapHorizIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Changer position</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <RemoveIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Retirer du sol</ListItemText>
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Menu des filtres */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => setShowFiltersPanel(!showFiltersPanel)}>
            <ListItemIcon>
              <FilterListIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {showFiltersPanel ? 'Masquer' : 'Afficher'} les filtres
            </ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => setContactInfoVisible(!contactInfoVisible)}>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {contactInfoVisible ? 'Masquer' : 'Afficher'} contacts
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Menu des actions en lot */}
        <Menu
          anchorEl={bulkActionAnchor}
          open={Boolean(bulkActionAnchor)}
          onClose={() => setBulkActionAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleBulkAction('notify')}>
            <ListItemIcon>
              <NotificationsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Notifier sélection</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleBulkAction('payment_reminder')}>
            <ListItemIcon>
              <PaymentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rappel de paiement</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={() => handleBulkAction('remove')}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <RemoveIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Retirer sélection</ListItemText>
          </MenuItem>
        </Menu>
      </Card>

      {/* Dialog de contact */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Contacter {selectedParticipant?.name}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {selectedParticipant?.email && (
              <MDBox display="flex" alignItems="center">
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <MDTypography variant="body2">
                  {selectedParticipant.email}
                </MDTypography>
              </MDBox>
            )}
            
            {selectedParticipant?.phone && (
              <MDBox display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <MDTypography variant="body2">
                  {selectedParticipant.phone}
                </MDTypography>
              </MDBox>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              placeholder="Tapez votre message..."
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setContactDialogOpen(false)}>
            Annuler
          </MDButton>
          <MDButton variant="contained" color="primary">
            Envoyer
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

SolParticipantsTable.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    role: PropTypes.oneOf(['organizer', 'co_organizer', 'member', 'vip']),
    status: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    avatar: PropTypes.string,
    payments: PropTypes.arrayOf(PropTypes.shape({
      round: PropTypes.number,
      amount: PropTypes.number,
      status: PropTypes.string,
      date: PropTypes.string,
      dueDate: PropTypes.string
    }))
  })),
  sol: PropTypes.object,
  title: PropTypes.string,
  currentRound: PropTypes.number,
  currency: PropTypes.string,
  onParticipantEdit: PropTypes.func,
  onParticipantRemove: PropTypes.func,
  onParticipantContact: PropTypes.func,
  onParticipantHistory: PropTypes.func,
  onPaymentUpdate: PropTypes.func,
  onPositionChange: PropTypes.func,
  onRoleChange: PropTypes.func,
  onBulkAction: PropTypes.func,
  showFilters: PropTypes.bool,
  showSearch: PropTypes.bool,
  showPagination: PropTypes.bool,
  showSelection: PropTypes.bool,
  showContactInfo: PropTypes.bool,
  defaultRowsPerPage: PropTypes.number,
  isOrganizer: PropTypes.bool,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default SolParticipantsTable;