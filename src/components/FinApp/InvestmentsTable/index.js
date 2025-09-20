// src/components/FinApp/InvestmentsTable/index.js
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
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';

// @mui icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';

// Constantes pour les types d'investissement
const INVESTMENT_TYPES = {
  real_estate: {
    label: 'Immobilier',
    icon: HomeIcon,
    color: '#2196F3'
  },
  business: {
    label: 'Business',
    icon: BusinessIcon,
    color: '#4CAF50'
  },
  agriculture: {
    label: 'Agriculture',
    icon: AgricultureIcon,
    color: '#8BC34A'
  },
  commerce: {
    label: 'Commerce',
    icon: StorefrontIcon,
    color: '#FF9800'
  },
  transport: {
    label: 'Transport',
    icon: LocalShippingIcon,
    color: '#607D8B'
  },
  finance: {
    label: 'Finance',
    icon: AccountBalanceIcon,
    color: '#9C27B0'
  }
};

// Statuts d'investissement
const INVESTMENT_STATUS = {
  active: {
    label: 'Actif',
    color: 'success',
    icon: CheckCircleIcon
  },
  pending: {
    label: 'En attente',
    color: 'warning',
    icon: PauseCircleIcon
  },
  completed: {
    label: 'Terminé',
    color: 'info',
    icon: CheckCircleIcon
  },
  paused: {
    label: 'En pause',
    color: 'default',
    icon: PauseCircleIcon
  },
  cancelled: {
    label: 'Annulé',
    color: 'error',
    icon: CancelIcon
  }
};

// Types de partenariat
const PARTNERSHIP_TYPES = {
  solo: {
    label: 'Solo',
    icon: PersonIcon,
    color: 'primary'
  },
  partnership: {
    label: 'Partenariat',
    icon: PeopleIcon,
    color: 'secondary'
  }
};

// Configuration des colonnes
const TABLE_COLUMNS = [
  {
    id: 'name',
    label: 'Projet',
    sortable: true,
    width: '25%'
  },
  {
    id: 'type',
    label: 'Type',
    sortable: true,
    width: '12%'
  },
  {
    id: 'invested',
    label: 'Investi',
    sortable: true,
    width: '12%',
    align: 'right'
  },
  {
    id: 'currentValue',
    label: 'Valeur Actuelle',
    sortable: true,
    width: '15%',
    align: 'right'
  },
  {
    id: 'roi',
    label: 'ROI',
    sortable: true,
    width: '10%',
    align: 'center'
  },
  {
    id: 'partners',
    label: 'Partenaires',
    sortable: false,
    width: '12%',
    align: 'center'
  },
  {
    id: 'status',
    label: 'Statut',
    sortable: true,
    width: '8%',
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

const InvestmentsTable = ({
  investments = [],
  title = "Portfolio d'investissements",
  onInvestmentEdit,
  onInvestmentDelete,
  onInvestmentView,
  onInvestmentShare,
  onBulkAction,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  showSelection = true,
  defaultRowsPerPage = 10,
  viewMode = 'detailed', // 'detailed', 'compact', 'minimal'
  currency = 'HTG',
  ...other
}) => {
  // États pour le tri et pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  // États pour les filtres
  const [searchText, setSearchText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedPartnershipTypes, setSelectedPartnershipTypes] = useState([]);
  const [minROI, setMinROI] = useState('');
  const [maxROI, setMaxROI] = useState('');
  const [minInvestment, setMinInvestment] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');

  // États pour les actions
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Enrichir les données d'investissement
  const enrichedInvestments = useMemo(() => {
    return investments.map(investment => {
      // Calculer ROI
      const roi = investment.currentValue && investment.invested 
        ? ((investment.currentValue - investment.invested) / investment.invested) * 100
        : 0;

      // Calculer tendance ROI
      const roiTrend = roi > 5 ? 'up' : roi < -5 ? 'down' : 'flat';

      // Calculer performance
      const performance = investment.currentValue - investment.invested;

      // Calculer durée investissement
      const startDate = new Date(investment.startDate);
      const endDate = investment.endDate ? new Date(investment.endDate) : new Date();
      const durationMonths = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));

      // Calculer ROI annualisé
      const annualizedROI = durationMonths > 0 ? (roi * 12) / durationMonths : roi;

      return {
        ...investment,
        roi,
        roiTrend,
        performance,
        durationMonths,
        annualizedROI
      };
    });
  }, [investments]);

  // Filtrer et trier les investissements
  const filteredInvestments = useMemo(() => {
    let filtered = enrichedInvestments.filter(investment => {
      // Filtre par texte de recherche
      if (searchText && !investment.name.toLowerCase().includes(searchText.toLowerCase()) && 
          !investment.description?.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      // Filtre par type
      if (selectedTypes.length > 0 && !selectedTypes.includes(investment.type)) {
        return false;
      }

      // Filtre par statut
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(investment.status)) {
        return false;
      }

      // Filtre par type de partenariat
      if (selectedPartnershipTypes.length > 0) {
        const partnershipType = investment.partners?.length > 1 ? 'partnership' : 'solo';
        if (!selectedPartnershipTypes.includes(partnershipType)) {
          return false;
        }
      }

      // Filtre par ROI
      if (minROI && investment.roi < parseFloat(minROI)) return false;
      if (maxROI && investment.roi > parseFloat(maxROI)) return false;

      // Filtre par montant investi
      if (minInvestment && investment.invested < parseFloat(minInvestment)) return false;
      if (maxInvestment && investment.invested > parseFloat(maxInvestment)) return false;

      // Filtres rapides
      switch (quickFilter) {
        case 'profitable':
          return investment.roi > 0;
        case 'losing':
          return investment.roi < 0;
        case 'high_roi':
          return investment.roi > 20;
        case 'partnerships':
          return investment.partners?.length > 1;
        case 'recent':
          return new Date(investment.startDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });

    // Trier
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === 'roi' || orderBy === 'invested' || orderBy === 'currentValue') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [enrichedInvestments, searchText, selectedTypes, selectedStatuses, selectedPartnershipTypes, 
      minROI, maxROI, minInvestment, maxInvestment, quickFilter, orderBy, order]);

  // Données paginées
  const paginatedInvestments = useMemo(() => {
    if (!showPagination) return filteredInvestments;
    const startIndex = page * rowsPerPage;
    return filteredInvestments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvestments, page, rowsPerPage, showPagination]);

  // Handlers de tri
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  // Handlers de sélection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(paginatedInvestments.map(inv => inv.id));
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
  const handleMenuOpen = (event, investment) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedInvestment(investment);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedInvestment(null);
  };

  // Handlers d'actions
  const handleView = useCallback(() => {
    handleMenuClose();
    if (onInvestmentView && selectedInvestment) {
      onInvestmentView(selectedInvestment);
    }
  }, [onInvestmentView, selectedInvestment]);

  const handleEdit = useCallback(() => {
    handleMenuClose();
    if (onInvestmentEdit && selectedInvestment) {
      onInvestmentEdit(selectedInvestment);
    }
  }, [onInvestmentEdit, selectedInvestment]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    if (onInvestmentDelete && selectedInvestment && 
        window.confirm(`Êtes-vous sûr de vouloir supprimer l'investissement "${selectedInvestment.name}" ?`)) {
      onInvestmentDelete(selectedInvestment.id);
    }
  }, [onInvestmentDelete, selectedInvestment]);

  const handleShare = useCallback(() => {
    handleMenuClose();
    if (onInvestmentShare && selectedInvestment) {
      onInvestmentShare(selectedInvestment);
    }
  }, [onInvestmentShare, selectedInvestment]);

  // Handlers des actions en lot
  const handleBulkAction = useCallback((action) => {
    setBulkActionAnchor(null);
    if (onBulkAction) {
      onBulkAction(action, selectedRows);
    }
  }, [onBulkAction, selectedRows]);

  // Handler pour l'expansion des lignes
  const handleRowExpand = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Render d'une cellule de ROI avec indicateur visuel
  const renderROICell = (investment) => {
    const { roi, roiTrend } = investment;
    const TrendIcon = roiTrend === 'up' ? TrendingUpIcon : 
                    roiTrend === 'down' ? TrendingDownIcon : TrendingFlatIcon;
    const color = roi > 0 ? 'success' : roi < 0 ? 'error' : 'default';

    return (
      <MDBox display="flex" alignItems="center" justifyContent="center">
        <TrendIcon 
          sx={{ 
            fontSize: 16, 
            mr: 0.5,
            color: roi > 0 ? 'success.main' : roi < 0 ? 'error.main' : 'text.disabled'
          }} 
        />
        <Chip
          label={`${roi.toFixed(1)}%`}
          color={color}
          size="small"
          variant="outlined"
        />
      </MDBox>
    );
  };

  // Render des partenaires
  const renderPartnersCell = (investment) => {
    const partners = investment.partners || [];
    
    if (partners.length === 0) {
      return (
        <Chip
          icon={<PersonIcon />}
          label="Solo"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    }

    return (
      <Tooltip title={`${partners.length} partenaire${partners.length > 1 ? 's' : ''}`}>
        <AvatarGroup max={3} sx={{ justifyContent: 'center' }}>
          {partners.map((partner, index) => (
            <Avatar 
              key={index}
              sx={{ width: 24, height: 24, fontSize: 12 }}
              alt={partner.name}
              src={partner.avatar}
            >
              {partner.name?.charAt(0)}
            </Avatar>
          ))}
        </AvatarGroup>
      </Tooltip>
    );
  };

  // Render du détail d'une ligne expandée
  const renderExpandedRow = (investment) => {
    return (
      <TableRow>
        <TableCell colSpan={TABLE_COLUMNS.length} sx={{ py: 2, bgcolor: 'grey.50' }}>
          <MDBox p={2}>
            <MDTypography variant="h6" gutterBottom>
              Détails de l'investissement
            </MDTypography>
            
            <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
              <MDBox>
                <MDTypography variant="caption" color="text">Date de début</MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {new Date(investment.startDate).toLocaleDateString('fr-FR')}
                </MDTypography>
              </MDBox>
              
              {investment.endDate && (
                <MDBox>
                  <MDTypography variant="caption" color="text">Date de fin</MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">
                    {new Date(investment.endDate).toLocaleDateString('fr-FR')}
                  </MDTypography>
                </MDBox>
              )}
              
              <MDBox>
                <MDTypography variant="caption" color="text">Durée</MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {investment.durationMonths} mois
                </MDTypography>
              </MDBox>
              
              <MDBox>
                <MDTypography variant="caption" color="text">ROI Annualisé</MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {investment.annualizedROI.toFixed(1)}%
                </MDTypography>
              </MDBox>
              
              <MDBox>
                <MDTypography variant="caption" color="text">Performance</MDTypography>
                <CurrencyDisplay
                  amount={investment.performance}
                  currency={investment.currency || currency}
                  variant="body2"
                  fontWeight="medium"
                />
              </MDBox>
            </Stack>

            {investment.description && (
              <MDBox sx={{ mb: 1 }}>
                <MDTypography variant="caption" color="text">Description</MDTypography>
                <MDTypography variant="body2">
                  {investment.description}
                </MDTypography>
              </MDBox>
            )}

            {investment.notes && (
              <MDBox>
                <MDTypography variant="caption" color="text">Notes</MDTypography>
                <MDTypography variant="body2">
                  {investment.notes}
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </TableCell>
      </TableRow>
    );
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.invested, 0);
    const totalCurrentValue = filteredInvestments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
    const totalROI = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;
    const profitableCount = filteredInvestments.filter(inv => inv.roi > 0).length;
    const averageROI = filteredInvestments.length > 0 
      ? filteredInvestments.reduce((sum, inv) => sum + inv.roi, 0) / filteredInvestments.length 
      : 0;

    return {
      totalInvestments: filteredInvestments.length,
      totalInvested,
      totalCurrentValue,
      totalROI,
      profitableCount,
      averageROI
    };
  }, [filteredInvestments]);

  return (
    <Card {...other}>
      <CardHeader
        title={
          <MDBox display="flex" alignItems="center" justifyContent="space-between">
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                {title}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {stats.totalInvestments} projet{stats.totalInvestments > 1 ? 's' : ''} 
                · ROI moyen: {stats.averageROI.toFixed(1)}%
                · {stats.profitableCount} rentable{stats.profitableCount > 1 ? 's' : ''}
              </MDTypography>
            </MDBox>
            
            <MDBox display="flex" alignItems="center" gap={1}>
              {selectedRows.length > 0 && (
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
                  color={searchText || selectedTypes.length > 0 || selectedStatuses.length > 0 ? "primary" : "default"}
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
              placeholder="Rechercher des investissements..."
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
            <MDTypography variant="caption" color="text">Total Investi</MDTypography>
            <CurrencyDisplay
              amount={stats.totalInvested}
              currency={currency}
              variant="body2"
              fontWeight="bold"
            />
          </MDBox>
          
          <MDBox textAlign="center">
            <MDTypography variant="caption" color="text">Valeur Actuelle</MDTypography>
            <CurrencyDisplay
              amount={stats.totalCurrentValue}
              currency={currency}
              variant="body2"
              fontWeight="bold"
            />
          </MDBox>
          
          <MDBox textAlign="center">
            <MDTypography variant="caption" color="text">ROI Global</MDTypography>
            <MDTypography 
              variant="body2" 
              fontWeight="bold"
              color={stats.totalROI > 0 ? 'success' : stats.totalROI < 0 ? 'error' : 'text'}
            >
              {stats.totalROI.toFixed(1)}%
            </MDTypography>
          </MDBox>
        </Stack>
      </CardContent>

      {/* Filtres rapides */}
      <CardContent sx={{ py: 1 }}>
        <ButtonGroup size="small" variant="outlined">
          <MDButton
            variant={quickFilter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setQuickFilter('all')}
          >
            Tous
          </MDButton>
          <MDButton
            variant={quickFilter === 'profitable' ? 'contained' : 'outlined'}
            onClick={() => setQuickFilter('profitable')}
          >
            Rentables
          </MDButton>
          <MDButton
            variant={quickFilter === 'losing' ? 'contained' : 'outlined'}
            onClick={() => setQuickFilter('losing')}
          >
            En perte
          </MDButton>
          <MDButton
            variant={quickFilter === 'high_roi' ? 'contained' : 'outlined'}
            onClick={() => setQuickFilter('high_roi')}
          >
            Haut ROI
          </MDButton>
          <MDButton
            variant={quickFilter === 'partnerships' ? 'contained' : 'outlined'}
            onClick={() => setQuickFilter('partnerships')}
          >
            Partenariats
          </MDButton>
          <MDButton
            variant={quickFilter === 'recent' ? 'contained' : 'outlined'}
            onClick={() => setQuickFilter('recent')}
          >
            Récents
          </MDButton>
        </ButtonGroup>
      </CardContent>

      {/* Panel de filtres avancés */}
      <Collapse in={showFiltersPanel}>
        <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Types</InputLabel>
              <Select
                multiple
                value={selectedTypes}
                onChange={(e) => setSelectedTypes(e.target.value)}
                input={<OutlinedInput label="Types" />}
                renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
              >
                {Object.entries(INVESTMENT_TYPES).map(([key, type]) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox checked={selectedTypes.includes(key)} />
                    <ListItemText primary={type.label} />
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
                {Object.entries(INVESTMENT_STATUS).map(([key, status]) => (
                  <MenuItem key={key} value={key}>
                    <Checkbox checked={selectedStatuses.includes(key)} />
                    <ListItemText primary={status.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="ROI Min (%)"
              type="number"
              value={minROI}
              onChange={(e) => setMinROI(e.target.value)}
              sx={{ width: 120 }}
            />

            <TextField
              size="small"
              label="ROI Max (%)"
              type="number"
              value={maxROI}
              onChange={(e) => setMaxROI(e.target.value)}
              sx={{ width: 120 }}
            />

            <MDButton
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchText('');
                setSelectedTypes([]);
                setSelectedStatuses([]);
                setMinROI('');
                setMaxROI('');
                setQuickFilter('all');
              }}
            >
              Réinitialiser
            </MDButton>
          </Stack>
        </CardContent>
      </Collapse>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {showSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedInvestments.length}
                    checked={paginatedInvestments.length > 0 && selectedRows.length === paginatedInvestments.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              <TableCell width="40px">
                {/* Colonne d'expansion */}
              </TableCell>
              
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
            {paginatedInvestments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_COLUMNS.length + (showSelection ? 2 : 1)} align="center" sx={{ py: 4 }}>
                  <Alert severity="info">
                    <MDTypography variant="body2">
                      {searchText || selectedTypes.length > 0 || selectedStatuses.length > 0
                        ? 'Aucun investissement ne correspond aux critères de recherche.'
                        : 'Aucun investissement trouvé. Commencez votre premier investissement !'}
                    </MDTypography>
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              paginatedInvestments.map((investment) => (
                <React.Fragment key={investment.id}>
                  <TableRow
                    hover
                    selected={selectedRows.includes(investment.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {showSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(investment.id)}
                          onChange={() => handleSelectRow(investment.id)}
                        />
                      </TableCell>
                    )}
                    
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleRowExpand(investment.id)}
                      >
                        {expandedRows.has(investment.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>

                    {/* Nom du projet */}
                    <TableCell onClick={() => handleRowExpand(investment.id)}>
                      <MDBox display="flex" alignItems="center">
                        <Avatar
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: INVESTMENT_TYPES[investment.type]?.color || 'primary.main'
                          }}
                        >
                          {React.createElement(
                            INVESTMENT_TYPES[investment.type]?.icon || BusinessIcon,
                            { sx: { fontSize: 18, color: 'white' } }
                          )}
                        </Avatar>
                        <MDBox>
                          <MDTypography variant="body2" fontWeight="medium">
                            {investment.name}
                          </MDTypography>
                          {investment.description && (
                            <MDTypography variant="caption" color="text" sx={{ display: 'block' }}>
                              {investment.description.substring(0, 50)}
                              {investment.description.length > 50 && '...'}
                            </MDTypography>
                          )}
                        </MDBox>
                      </MDBox>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Chip
                        label={INVESTMENT_TYPES[investment.type]?.label || investment.type}
                        size="small"
                        sx={{
                          bgcolor: INVESTMENT_TYPES[investment.type]?.color + '20',
                          color: INVESTMENT_TYPES[investment.type]?.color
                        }}
                      />
                    </TableCell>

                    {/* Montant investi */}
                    <TableCell align="right">
                      <CurrencyDisplay
                        amount={investment.invested}
                        currency={investment.currency || currency}
                        variant="body2"
                        fontWeight="medium"
                      />
                    </TableCell>

                    {/* Valeur actuelle */}
                    <TableCell align="right">
                      <MDBox>
                        <CurrencyDisplay
                          amount={investment.currentValue || investment.invested}
                          currency={investment.currency || currency}
                          variant="body2"
                          fontWeight="medium"
                        />
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(((investment.currentValue || investment.invested) / investment.invested) * 100, 200)}
                          sx={{
                            mt: 0.5,
                            height: 4,
                            borderRadius: 2,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: investment.roi > 0 ? 'success.main' : investment.roi < 0 ? 'error.main' : 'grey.400'
                            }
                          }}
                        />
                      </MDBox>
                    </TableCell>

                    {/* ROI */}
                    <TableCell align="center">
                      {renderROICell(investment)}
                    </TableCell>

                    {/* Partenaires */}
                    <TableCell align="center">
                      {renderPartnersCell(investment)}
                    </TableCell>

                    {/* Statut */}
                    <TableCell align="center">
                      <Chip
                        icon={React.createElement(INVESTMENT_STATUS[investment.status]?.icon || CheckCircleIcon, {
                          sx: { fontSize: 16 }
                        })}
                        label={INVESTMENT_STATUS[investment.status]?.label || investment.status}
                        color={INVESTMENT_STATUS[investment.status]?.color || 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, investment)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                  {/* Ligne expandée */}
                  {expandedRows.has(investment.id) && renderExpandedRow(investment)}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {showPagination && (
        <TablePagination
          component="div"
          count={filteredInvestments.length}
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
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir détails</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Partager</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
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
        
        <Divider />
        
        <MenuItem onClick={() => console.log('Export CSV')}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exporter CSV</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => console.log('Export Excel')}>
          <ListItemIcon>
            <GetAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exporter Excel</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => console.log('Imprimer')}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimer</ListItemText>
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
        <MenuItem onClick={() => handleBulkAction('archive')}>
          <ListItemText>Archiver sélection</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleBulkAction('export')}>
          <ListItemText>Exporter sélection</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleBulkAction('share')}>
          <ListItemText>Partager sélection</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleBulkAction('delete')}
          sx={{ color: 'error.main' }}
        >
          <ListItemText>Supprimer sélection</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

InvestmentsTable.propTypes = {
  investments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    invested: PropTypes.number.isRequired,
    currentValue: PropTypes.number,
    status: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    currency: PropTypes.string,
    partners: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      avatar: PropTypes.string
    }))
  })),
  title: PropTypes.string,
  onInvestmentEdit: PropTypes.func,
  onInvestmentDelete: PropTypes.func,
  onInvestmentView: PropTypes.func,
  onInvestmentShare: PropTypes.func,
  onBulkAction: PropTypes.func,
  showFilters: PropTypes.bool,
  showSearch: PropTypes.bool,
  showPagination: PropTypes.bool,
  showSelection: PropTypes.bool,
  defaultRowsPerPage: PropTypes.number,
  viewMode: PropTypes.oneOf(['detailed', 'compact', 'minimal']),
  currency: PropTypes.string
};

export default InvestmentsTable;