// src/components/FinApp/SolsTable/index.js
import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Button,
  Menu,
  MenuItem,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  InputAdornment,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Collapse,
  Alert,
  LinearProgress,
  AvatarGroup,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

// Material Dashboard 2 React components
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';
import CreateSolForm from '../CreateSolForm';
import JoinSolForm from '../JoinSolForm';
import SolPaymentForm from '../SolPaymentForm';

// Types de sols avec couleurs et icônes
const SOL_TYPES = {
  family: { 
    label: 'Familial', 
    icon: 'family_restroom', 
    color: '#4caf50',
    description: 'Sol entre membres de la famille'
  },
  work: { 
    label: 'Travail', 
    icon: 'work', 
    color: '#2196f3',
    description: 'Sol entre collègues de travail'
  },
  friends: { 
    label: 'Amis', 
    icon: 'group', 
    color: '#ff9800',
    description: 'Sol entre amis proches'
  },
  neighborhood: { 
    label: 'Quartier', 
    icon: 'location_city', 
    color: '#9c27b0',
    description: 'Sol communautaire'
  },
  investment: { 
    label: 'Investissement', 
    icon: 'trending_up', 
    color: '#f44336',
    description: 'Sol pour projets communs'
  },
  business: { 
    label: 'Business', 
    icon: 'business', 
    color: '#607d8b',
    description: 'Sol professionnel'
  }
};

// Statuts des sols
const SOL_STATUS = {
  active: { label: 'Actif', color: 'success', icon: 'play_circle' },
  completed: { label: 'Terminé', color: 'info', icon: 'check_circle' },
  paused: { label: 'En pause', color: 'warning', icon: 'pause_circle' },
  cancelled: { label: 'Annulé', color: 'error', icon: 'cancel' }
};

// Fréquences
const FREQUENCIES = {
  weekly: { label: 'Hebdomadaire', icon: 'event_repeat' },
  biweekly: { label: 'Bimensuel', icon: 'event_repeat' },
  monthly: { label: 'Mensuel', icon: 'calendar_month' },
  quarterly: { label: 'Trimestriel', icon: 'calendar_today' }
};

// Filtres prédéfinis
const QUICK_FILTERS = {
  all: { label: "Tous les sols", filter: () => true },
  active: { label: "Actifs", filter: (sol) => sol.status === 'active' },
  my_turn_soon: { label: "Mon tour bientôt", filter: (sol) => {
    const turnsUntilMe = (sol.myPosition - sol.currentTurn + sol.participants) % sol.participants;
    return turnsUntilMe <= 2 && turnsUntilMe > 0;
  }},
  payment_due: { label: "Paiement dû", filter: (sol) => {
    const nextPayment = new Date(sol.nextPayment);
    const today = new Date();
    const daysDiff = (nextPayment - today) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7 && daysDiff >= 0;
  }},
  high_amount: { label: "Montant élevé", filter: (sol) => sol.amount >= 5000 }
};

function SolsTable({
  sols = [],
  currency = "HTG",
  title = "Mes Sols/Tontines",
  showQuickAdd = true,
  showFilters = true,
  showExport = true,
  height = 600,
  pageSize = 25,
  viewMode = "table", // 'table' ou 'cards'
  onSolJoin,
  onSolCreate,
  onSolPayment,
  onSolDetails,
  onSolLeave,
  onBulkAction,
  ...other
}) {
  // États pour les filtres
  const [searchText, setSearchText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState([]);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');

  // États pour les actions
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedSol, setSelectedSol] = useState(null);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);

  // Calculer données dérivées pour chaque sol
  const enrichedSols = useMemo(() => {
    return sols.map(sol => {
      // Calculer progression
      const progressPercentage = ((sol.currentTurn - 1) / sol.participants) * 100;
      
      // Calculer prochaine échéance
      const nextPaymentDate = new Date(sol.nextPayment);
      const today = new Date();
      const daysUntilPayment = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
      
      // Calculer position relative
      const turnsUntilMyTurn = (sol.myPosition - sol.currentTurn + sol.participants) % sol.participants;
      
      // Calculer montants
      const totalPaid = (sol.currentTurn - 1) * sol.amount;
      const totalToReceive = sol.amount * sol.participants;
      const myTotalContribution = Math.min(sol.currentTurn, sol.myPosition) * sol.amount;
      
      // Statut paiement personnel
      const myPaymentStatus = sol.currentTurn <= sol.myPosition ? 'paid' : 'upcoming';
      
      return {
        ...sol,
        progressPercentage,
        daysUntilPayment,
        turnsUntilMyTurn,
        totalPaid,
        totalToReceive,
        myTotalContribution,
        myPaymentStatus,
        isMyTurnNext: turnsUntilMyTurn === 1,
        isPaymentDue: daysUntilPayment <= 7 && daysUntilPayment >= 0
      };
    });
  }, [sols]);

  // Appliquer les filtres
  const filteredSols = useMemo(() => {
    let filtered = enrichedSols;

    // Filtre de recherche textuelle
    if (searchText) {
      filtered = filtered.filter(sol =>
        sol.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        sol.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        sol.organizer?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtre par types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(sol =>
        selectedTypes.includes(sol.solType || sol.type)
      );
    }

    // Filtre par statuts
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(sol =>
        selectedStatuses.includes(sol.status)
      );
    }

    // Filtre par fréquences
    if (selectedFrequencies.length > 0) {
      filtered = filtered.filter(sol =>
        selectedFrequencies.includes(sol.frequency)
      );
    }

    // Filtre par montants
    if (minAmount !== '') {
      filtered = filtered.filter(sol =>
        sol.amount >= parseFloat(minAmount)
      );
    }
    if (maxAmount !== '') {
      filtered = filtered.filter(sol =>
        sol.amount <= parseFloat(maxAmount)
      );
    }

    // Filtre rapide
    if (quickFilter && quickFilter !== 'all') {
      const filterConfig = QUICK_FILTERS[quickFilter];
      if (filterConfig) {
        filtered = filtered.filter(filterConfig.filter);
      }
    }

    return filtered.sort((a, b) => {
      // Prioriser sols avec paiement dû
      if (a.isPaymentDue && !b.isPaymentDue) return -1;
      if (!a.isPaymentDue && b.isPaymentDue) return 1;
      
      // Puis sols avec tour proche
      if (a.isMyTurnNext && !b.isMyTurnNext) return -1;
      if (!a.isMyTurnNext && b.isMyTurnNext) return 1;
      
      // Puis par status (actifs en premier)
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      return 0;
    });
  }, [
    enrichedSols, searchText, selectedTypes, selectedStatuses, selectedFrequencies,
    minAmount, maxAmount, quickFilter
  ]);

  // Configuration des colonnes
  const columns = [
    {
      field: 'name',
      headerName: 'Sol',
      width: 280,
      renderCell: (params) => {
        const solType = SOL_TYPES[params.row.solType || params.row.type] || SOL_TYPES.friends;
        
        return (
          <MDBox display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: solType.color,
                color: 'white',
                width: 40,
                height: 40
              }}
            >
              <Icon sx={{ fontSize: 20 }}>{solType.icon}</Icon>
            </Avatar>
            <MDBox>
              <MDBox display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <MDTypography variant="button" fontWeight="medium" color="dark">
                  {params.row.name}
                </MDTypography>
                {params.row.isPaymentDue && (
                  <Chip label="Paiement dû" color="error" size="small" />
                )}
                {params.row.isMyTurnNext && (
                  <Chip label="Mon tour!" color="success" size="small" />
                )}
              </MDBox>
              <MDTypography variant="caption" color="text" display="block">
                {solType.label} • {params.row.organizer}
              </MDTypography>
            </MDBox>
          </MDBox>
        );
      }
    },
    {
      field: 'participants',
      headerName: 'Participants',
      width: 160,
      renderCell: (params) => (
        <MDBox>
          <MDBox display="flex" alignItems="center" gap={1} mb={0.5}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
              {params.row.participantsList?.slice(0, 3).map((participant, index) => (
                <Avatar key={index} sx={{ bgcolor: '#1976d2' }}>
                  {participant.name?.charAt(0) || 'P'}
                </Avatar>
              ))}
            </AvatarGroup>
            <MDTypography variant="button" fontWeight="medium">
              {params.row.participants}
            </MDTypography>
          </MDBox>
          <MDTypography variant="caption" color="text">
            Position #{params.row.myPosition}
          </MDTypography>
        </MDBox>
      )
    },
    {
      field: 'amount',
      headerName: 'Montant',
      width: 140,
      renderCell: (params) => (
        <MDBox>
          <CurrencyDisplay
            amount={params.row.amount}
            currency={params.row.currency || currency}
            variant="button"
            fontWeight="bold"
            showSymbol={true}
          />
          <MDTypography variant="caption" color="text" display="block">
            {FREQUENCIES[params.row.frequency]?.label || params.row.frequency}
          </MDTypography>
        </MDBox>
      )
    },
    {
      field: 'progress',
      headerName: 'Progression',
      width: 200,
      renderCell: (params) => (
        <MDBox width="100%">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <MDTypography variant="caption" fontWeight="medium">
              {params.row.currentTurn}/{params.row.participants}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {params.row.progressPercentage.toFixed(0)}%
            </MDTypography>
          </MDBox>
          <LinearProgress
            variant="determinate"
            value={params.row.progressPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: params.row.status === 'active' ? 'primary.main' : 'grey.400'
              }
            }}
          />
          <MDTypography variant="caption" color="text" mt={0.5}>
            {params.row.turnsUntilMyTurn === 0 
              ? "Votre tour!" 
              : `Dans ${params.row.turnsUntilMyTurn} tour${params.row.turnsUntilMyTurn > 1 ? 's' : ''}`
            }
          </MDTypography>
        </MDBox>
      )
    },
    {
      field: 'nextPayment',
      headerName: 'Échéance',
      width: 140,
      renderCell: (params) => {
        const isOverdue = params.row.daysUntilPayment < 0;
        const isDue = params.row.daysUntilPayment <= 7 && params.row.daysUntilPayment >= 0;
        
        return (
          <MDBox>
            <MDTypography 
              variant="button" 
              fontWeight="medium"
              color={isOverdue ? 'error' : isDue ? 'warning' : 'text'}
            >
              {new Date(params.row.nextPayment).toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'short' 
              })}
            </MDTypography>
            <MDTypography 
              variant="caption" 
              color={isOverdue ? 'error' : isDue ? 'warning' : 'text'}
              display="block"
            >
              {isOverdue 
                ? `Retard ${Math.abs(params.row.daysUntilPayment)}j`
                : `Dans ${params.row.daysUntilPayment}j`
              }
            </MDTypography>
          </MDBox>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 110,
      renderCell: (params) => {
        const status = SOL_STATUS[params.row.status] || SOL_STATUS.active;
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            icon={<Icon>{status.icon}</Icon>}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <MDBox display="flex" gap={0.5}>
          {params.row.isPaymentDue && (
            <Tooltip title="Payer">
              <IconButton
                size="small"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayment(params.row);
                }}
              >
                <Icon fontSize="small">payment</Icon>
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Détails">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDetails(params.row);
              }}
            >
              <Icon fontSize="small">visibility</Icon>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Plus">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSol(params.row);
                setMenuAnchor(e.currentTarget);
              }}
            >
              <Icon fontSize="small">more_vert</Icon>
            </IconButton>
          </Tooltip>
        </MDBox>
      )
    }
  ];

  // Gestionnaires d'événements
  const handlePayment = useCallback((sol) => {
    setSelectedSol(sol);
    setShowPaymentForm(true);
    if (onSolPayment) {
      onSolPayment(sol);
    }
  }, [onSolPayment]);

  const handleDetails = useCallback((sol) => {
    if (onSolDetails) {
      onSolDetails(sol);
    }
  }, [onSolDetails]);

  const handleLeave = useCallback((sol) => {
    if (window.confirm(`Quitter le sol "${sol.name}" ? Cette action est irréversible.`)) {
      if (onSolLeave) {
        onSolLeave(sol.id);
      }
    }
  }, [onSolLeave]);

  const handleBulkAction = useCallback((action) => {
    setBulkActionAnchor(null);
    if (onBulkAction) {
      onBulkAction(action, selectedRows);
    }
  }, [onBulkAction, selectedRows]);

  const handleExport = (format) => {
    const dataToExport = filteredSols.map(sol => ({
      Nom: sol.name,
      Type: SOL_TYPES[sol.solType || sol.type]?.label || sol.type,
      Participants: sol.participants,
      Position: sol.myPosition,
      Montant: sol.amount,
      Devise: sol.currency,
      Fréquence: FREQUENCIES[sol.frequency]?.label || sol.frequency,
      Tour: sol.currentTurn,
      Statut: SOL_STATUS[sol.status]?.label || sol.status,
      Échéance: new Date(sol.nextPayment).toLocaleDateString('fr-FR'),
      Organisateur: sol.organizer
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sols_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
    
    setFilterMenuAnchor(null);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedFrequencies([]);
    setMinAmount('');
    setMaxAmount('');
    setQuickFilter('all');
  };

  // Calculer statistiques
  const stats = useMemo(() => {
    const activeSols = filteredSols.filter(s => s.status === 'active');
    const totalInvested = filteredSols.reduce((sum, s) => sum + s.myTotalContribution, 0);
    const totalToReceive = filteredSols.reduce((sum, s) => sum + s.totalToReceive, 0);
    const paymentsThisWeek = filteredSols.filter(s => s.daysUntilPayment <= 7 && s.daysUntilPayment >= 0).length;
    const myTurnsComingUp = filteredSols.filter(s => s.turnsUntilMyTurn <= 2 && s.turnsUntilMyTurn > 0).length;

    return {
      totalSols: filteredSols.length,
      activeSols: activeSols.length,
      totalInvested,
      totalToReceive,
      paymentsThisWeek,
      myTurnsComingUp
    };
  }, [filteredSols]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Card {...other}>
        <CardHeader
          title={
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium">
                  {title}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {stats.totalSols} sol{stats.totalSols > 1 ? 's' : ''} 
                  · {stats.activeSols} actif{stats.activeSols > 1 ? 's' : ''}
                  · {stats.paymentsThisWeek} échéance{stats.paymentsThisWeek > 1 ? 's' : ''} cette semaine
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center" gap={1}>
                {selectedRows.length > 0 && (
                  <MDButton
                    variant="outlined"
                    size="small"
                    onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                    startIcon={<Icon>checklist</Icon>}
                  >
                    {selectedRows.length}
                  </MDButton>
                )}

                <ToggleButtonGroup
                  value={currentViewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setCurrentViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="table">
                    <Icon>table_view</Icon>
                  </ToggleButton>
                  <ToggleButton value="cards">
                    <Icon>view_module</Icon>
                  </ToggleButton>
                </ToggleButtonGroup>
                
                {showFilters && (
                  <MDButton
                    variant="outlined"
                    size="small"
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    startIcon={<Icon>filter_list</Icon>}
                    color={showFiltersPanel ? "primary" : "secondary"}
                  >
                    Filtres
                  </MDButton>
                )}
                
                {showExport && (
                  <MDButton
                    variant="outlined"
                    size="small"
                    onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                    startIcon={<Icon>download</Icon>}
                  >
                    Export
                  </MDButton>
                )}
              </MDBox>
            </MDBox>
          }
        />
        
        <CardContent>
          {/* Filtres rapides */}
          <MDBox mb={2}>
            <MDBox display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <MDTypography variant="button" fontWeight="medium" color="text">
                Affichage:
              </MDTypography>
              {Object.entries(QUICK_FILTERS).map(([key, filter]) => (
                <Chip
                  key={key}
                  label={filter.label}
                  onClick={() => setQuickFilter(key)}
                  color={quickFilter === key ? "primary" : "default"}
                  variant={quickFilter === key ? "filled" : "outlined"}
                  size="small"
                />
              ))}
            </MDBox>
          </MDBox>

          {/* Panel de filtres avancés */}
          <Collapse in={showFiltersPanel}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <MDBox display="flex" flexDirection="column" gap={2}>
                  {/* Recherche et montants */}
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <TextField
                      label="Rechercher"
                      placeholder="Nom, organisateur..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      size="small"
                      sx={{ minWidth: 200 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>search</Icon>
                          </InputAdornment>
                        )
                      }}
                    />
                    
                    <TextField
                      label="Min"
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    
                    <TextField
                      label="Max"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </MDBox>

                  {/* Sélecteurs */}
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Types</InputLabel>
                      <Select
                        multiple
                        value={selectedTypes}
                        onChange={(e) => setSelectedTypes(e.target.value)}
                        input={<OutlinedInput label="Types" />}
                        renderValue={(selected) => `${selected.length} type${selected.length > 1 ? 's' : ''}`}
                      >
                        {Object.entries(SOL_TYPES).map(([key, type]) => (
                          <MenuItem key={key} value={key}>
                            <Checkbox checked={selectedTypes.indexOf(key) > -1} />
                            <Icon sx={{ mr: 1 }}>{type.icon}</Icon>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Statuts</InputLabel>
                      <Select
                        multiple
                        value={selectedStatuses}
                        onChange={(e) => setSelectedStatuses(e.target.value)}
                        input={<OutlinedInput label="Statuts" />}
                        renderValue={(selected) => `${selected.length} statut${selected.length > 1 ? 's' : ''}`}
                      >
                        {Object.entries(SOL_STATUS).map(([key, status]) => (
                          <MenuItem key={key} value={key}>
                            <Checkbox checked={selectedStatuses.indexOf(key) > -1} />
                            <Icon sx={{ mr: 1 }}>{status.icon}</Icon>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Fréquences</InputLabel>
                      <Select
                        multiple
                        value={selectedFrequencies}
                        onChange={(e) => setSelectedFrequencies(e.target.value)}
                        input={<OutlinedInput label="Fréquences" />}
                        renderValue={(selected) => `${selected.length} fréq.`}
                      >
                        {Object.entries(FREQUENCIES).map(([key, freq]) => (
                          <MenuItem key={key} value={key}>
                            <Checkbox checked={selectedFrequencies.indexOf(key) > -1} />
                            <Icon sx={{ mr: 1 }}>{freq.icon}</Icon>
                            {freq.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MDBox>

                  {/* Actions */}
                  <MDBox display="flex" gap={1} justifyContent="flex-end">
                    <MDButton
                      variant="outlined"
                      size="small"
                      onClick={clearFilters}
                      startIcon={<Icon>clear</Icon>}
                    >
                      Effacer
                    </MDButton>
                  </MDBox>
                </MDBox>
              </CardContent>
            </Card>
          </Collapse>

          {/* Statistiques */}
          <MDBox mb={2}>
            <MDBox display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Investi: ${stats.totalInvested.toLocaleString()} ${currency}`}
                color="info"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`À recevoir: ${stats.totalToReceive.toLocaleString()} ${currency}`}
                color="success"
                variant="outlined"
                size="small"
              />
              {stats.paymentsThisWeek > 0 && (
                <Chip
                  label={`${stats.paymentsThisWeek} échéance${stats.paymentsThisWeek > 1 ? 's' : ''} cette semaine`}
                  color="warning"
                  size="small"
                />
              )}
              {stats.myTurnsComingUp > 0 && (
                <Chip
                  label={`${stats.myTurnsComingUp} tour${stats.myTurnsComingUp > 1 ? 's' : ''} proche${stats.myTurnsComingUp > 1 ? 's' : ''}`}
                  color="primary"
                  size="small"
                />
              )}
            </MDBox>
          </MDBox>

          {/* Table ou Cards */}
          {currentViewMode === 'table' ? (
            <MDBox height={height}>
              <DataGrid
                rows={filteredSols}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(newSelection) => {
                  setSelectedRows(newSelection);
                }}
                components={{
                  NoRowsOverlay: () => (
                    <MDBox display="flex" alignItems="center" justifyContent="center" height="100%">
                      <MDBox textAlign="center">
                        <Icon color="action" style={{ fontSize: 48, marginBottom: 16 }}>
                          people
                        </Icon>
                        <MDTypography variant="h6" color="text" fontWeight="medium">
                          Aucun sol trouvé
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {sols.length === 0 
                            ? "Créez ou rejoignez votre premier sol"
                            : "Aucun sol ne correspond aux filtres"
                          }
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  )
                }}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderBottom: '2px solid rgba(224, 224, 224, 1)',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              />
            </MDBox>
          ) : (
            <MDBox>
              <Alert severity="info">
                <MDTypography variant="body2" fontWeight="medium">
                  Vue cartes en développement
                </MDTypography>
                <MDTypography variant="caption">
                  Utilisez la vue table pour le moment
                </MDTypography>
              </Alert>
            </MDBox>
          )}
        </CardContent>

        {/* FAB actions rapides */}
        {showQuickAdd && (
          <MDBox position="fixed" bottom={80} right={16} display="flex" flexDirection="column" gap={1}>
            <Fab
              color="primary"
              size="medium"
              onClick={() => setShowCreateForm(true)}
            >
              <Icon>add</Icon>
            </Fab>
            <Fab
              color="secondary"
              size="small"
              onClick={() => setShowJoinForm(true)}
            >
              <Icon>group_add</Icon>
            </Fab>
          </MDBox>
        )}

        {/* Menu export */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleExport('csv')}>
            <Icon sx={{ mr: 1 }}>table_view</Icon>
            Exporter CSV
          </MenuItem>
          <MenuItem onClick={() => { console.log('Export PDF'); setFilterMenuAnchor(null); }}>
            <Icon sx={{ mr: 1 }}>picture_as_pdf</Icon>
            Rapport PDF
          </MenuItem>
        </Menu>

        {/* Menu actions sol */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => { handleDetails(selectedSol); setMenuAnchor(null); }}>
            <Icon sx={{ mr: 1 }}>visibility</Icon>
            Détails
          </MenuItem>
          <MenuItem onClick={() => { handlePayment(selectedSol); setMenuAnchor(null); }}>
            <Icon sx={{ mr: 1 }}>payment</Icon>
            Paiement
          </MenuItem>
          <MenuItem onClick={() => { console.log('Historique', selectedSol); setMenuAnchor(null); }}>
            <Icon sx={{ mr: 1 }}>history</Icon>
            Historique
          </MenuItem>
          <MenuItem onClick={() => { console.log('Inviter', selectedSol); setMenuAnchor(null); }}>
            <Icon sx={{ mr: 1 }}>person_add</Icon>
            Inviter
          </MenuItem>
          <MenuItem onClick={() => { handleLeave(selectedSol); setMenuAnchor(null); }} sx={{ color: 'error.main' }}>
            <Icon sx={{ mr: 1 }}>exit_to_app</Icon>
            Quitter
          </MenuItem>
        </Menu>

        {/* Menu actions groupées */}
        <Menu
          anchorEl={bulkActionAnchor}
          open={Boolean(bulkActionAnchor)}
          onClose={() => setBulkActionAnchor(null)}
        >
          <MenuItem onClick={() => handleBulkAction('export')}>
            <Icon sx={{ mr: 1 }}>download</Icon>
            Exporter sélectionnés
          </MenuItem>
          <MenuItem onClick={() => handleBulkAction('mark_paid')}>
            <Icon sx={{ mr: 1 }}>check_circle</Icon>
            Marquer payé
          </MenuItem>
          <MenuItem onClick={() => handleBulkAction('remind')}>
            <Icon sx={{ mr: 1 }}>notifications</Icon>
            Rappels
          </MenuItem>
        </Menu>

        {/* Dialog création */}
        <Dialog
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <MDTypography variant="h6" fontWeight="medium">
              Créer un nouveau sol
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <CreateSolForm
              currency={currency}
              onSubmit={(solData) => {
                console.log('Nouveau sol:', solData);
                setShowCreateForm(false);
                if (onSolCreate) {
                  onSolCreate(solData);
                }
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog rejoindre */}
        <Dialog
          open={showJoinForm}
          onClose={() => setShowJoinForm(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <MDTypography variant="h6" fontWeight="medium">
              Rejoindre un sol
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <JoinSolForm
              onSubmit={(joinData) => {
                console.log('Rejoindre sol:', joinData);
                setShowJoinForm(false);
                if (onSolJoin) {
                  onSolJoin(joinData);
                }
              }}
              onCancel={() => setShowJoinForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog paiement */}
        <Dialog
          open={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <MDTypography variant="h6" fontWeight="medium">
              Effectuer paiement
            </MDTypography>
            {selectedSol && (
              <MDTypography variant="subtitle2" color="text">
                {selectedSol.name} - Tour {selectedSol.currentTurn}
              </MDTypography>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedSol && (
              <SolPaymentForm
                sol={selectedSol}
                onSubmit={(paymentData) => {
                  console.log('Paiement:', paymentData);
                  setShowPaymentForm(false);
                  setSelectedSol(null);
                }}
                onCancel={() => {
                  setShowPaymentForm(false);
                  setSelectedSol(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </LocalizationProvider>
  );
}

SolsTable.propTypes = {
  sols: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    solType: PropTypes.string,
    type: PropTypes.string,
    participants: PropTypes.number.isRequired,
    participantsList: PropTypes.array,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string,
    frequency: PropTypes.string.isRequired,
    nextPayment: PropTypes.string.isRequired,
    myPosition: PropTypes.number.isRequired,
    currentTurn: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    organizer: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    description: PropTypes.string
  })),
  currency: PropTypes.string,
  title: PropTypes.string,
  showQuickAdd: PropTypes.bool,
  showFilters: PropTypes.bool,
  showExport: PropTypes.bool,
  height: PropTypes.number,
  pageSize: PropTypes.number,
  viewMode: PropTypes.oneOf(['table', 'cards']),
  onSolJoin: PropTypes.func,
  onSolCreate: PropTypes.func,
  onSolPayment: PropTypes.func,
  onSolDetails: PropTypes.func,
  onSolLeave: PropTypes.func,
  onBulkAction: PropTypes.func
};

export default SolsTable;