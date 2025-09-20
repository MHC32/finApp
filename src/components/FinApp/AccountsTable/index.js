// src/components/FinApp/AccountsTable/index.js
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
import Collapse from '@mui/material/Collapse';

// @mui icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';

// Types de comptes bancaires haïtiens
const ACCOUNT_TYPES = {
  checking: {
    label: 'Compte Courant',
    icon: AccountBalanceIcon,
    color: '#1976D2'
  },
  savings: {
    label: 'Compte Épargne',
    icon: SavingsIcon,
    color: '#388E3C'
  },
  credit: {
    label: 'Carte de Crédit',
    icon: CreditCardIcon,
    color: '#F57C00'
  },
  wallet: {
    label: 'Portefeuille Mobile',
    icon: AccountBalanceWalletIcon,
    color: '#7B1FA2'
  },
  investment: {
    label: 'Compte Investissement',
    icon: TrendingUpIcon,
    color: '#C2185B'
  }
};

// Banques haïtiennes principales
const HAITI_BANKS = {
  sogebank: {
    name: 'Sogebank',
    logo: '/images/banks/sogebank.png',
    color: '#0066CC'
  },
  unibank: {
    name: 'Unibank',
    logo: '/images/banks/unibank.png',
    color: '#FF6600'
  },
  bnc: {
    name: 'BNC',
    logo: '/images/banks/bnc.png',
    color: '#006633'
  },
  buh: {
    name: 'BUH',
    logo: '/images/banks/buh.png',
    color: '#CC0000'
  },
  capital_bank: {
    name: 'Capital Bank',
    logo: '/images/banks/capital.png',
    color: '#330066'
  },
  fonkoze: {
    name: 'Fonkoze',
    logo: '/images/banks/fonkoze.png',
    color: '#009933'
  },
  moncash: {
    name: 'MonCash',
    logo: '/images/banks/moncash.png',
    color: '#FF3300'
  },
  natcash: {
    name: 'NatCash',
    logo: '/images/banks/natcash.png',
    color: '#0099CC'
  }
};

// Statuts des comptes
const ACCOUNT_STATUS = {
  active: {
    label: 'Actif',
    color: 'success',
    icon: CheckCircleIcon
  },
  inactive: {
    label: 'Inactif',
    color: 'default',
    icon: PauseCircleIcon
  },
  suspended: {
    label: 'Suspendu',
    color: 'warning',
    icon: WarningIcon
  },
  closed: {
    label: 'Fermé',
    color: 'error',
    icon: ErrorIcon
  },
  pending: {
    label: 'En attente',
    color: 'info',
    icon: PauseCircleIcon
  }
};

// Statuts de synchronisation
const SYNC_STATUS = {
  connected: {
    label: 'Connecté',
    color: 'success',
    icon: LinkIcon
  },
  disconnected: {
    label: 'Déconnecté',
    color: 'error',
    icon: LinkOffIcon
  },
  syncing: {
    label: 'Synchronisation',
    color: 'warning',
    icon: SyncIcon
  },
  error: {
    label: 'Erreur',
    color: 'error',
    icon: ErrorIcon
  }
};

// Configuration des colonnes
const TABLE_COLUMNS = [
  {
    id: 'account',
    label: 'Compte',
    sortable: true,
    width: '25%'
  },
  {
    id: 'bank',
    label: 'Banque',
    sortable: true,
    width: '15%'
  },
  {
    id: 'type',
    label: 'Type',
    sortable: true,
    width: '12%',
    align: 'center'
  },
  {
    id: 'balance',
    label: 'Solde',
    sortable: true,
    width: '15%',
    align: 'right'
  },
  {
    id: 'trend',
    label: 'Évolution',
    sortable: true,
    width: '10%',
    align: 'center'
  },
  {
    id: 'lastSync',
    label: 'Dernière Sync',
    sortable: true,
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
    width: '3%',
    align: 'center'
  }
];

const AccountsTable = ({
  accounts = [],
  title = "Mes Comptes Bancaires",
  defaultCurrency = 'HTG',
  onAccountEdit,
  onAccountDelete,
  onAccountView,
  onAccountSync,
  onAccountToggleVisibility,
  onAccountToggleFavorite,
  onBulkAction,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  showSelection = true,
  showBalances = true,
  defaultRowsPerPage = 10,
  viewMode = 'detailed',
  ...other
}) => {
  // États pour le tri et pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState('account');
  const [order, setOrder] = useState('asc');

  // États pour les filtres
  const [searchText, setSearchText] = useState('');
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [showHiddenAccounts, setShowHiddenAccounts] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // États pour les actions
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // États pour les dialogs
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);

  // Enrichir les données des comptes
  const enrichedAccounts = useMemo(() => {
    return accounts.map(account => {
      // Calculer l'évolution du solde
      const previousBalance = account.previousBalance || account.balance;
      const balanceChange = account.balance - previousBalance;
      const balanceChangePercent = previousBalance !== 0 ? (balanceChange / Math.abs(previousBalance)) * 100 : 0;
      
      // Déterminer la tendance
      const trend = balanceChange > 0 ? 'up' : balanceChange < 0 ? 'down' : 'flat';
      
      // Calculer le nombre de jours depuis la dernière synchronisation
      const lastSyncDate = account.lastSync ? new Date(account.lastSync) : null;
      const daysSinceSync = lastSyncDate ? Math.floor((new Date() - lastSyncDate) / (1000 * 60 * 60 * 24)) : null;
      
      // Déterminer le statut de synchronisation
      let syncStatus = account.syncStatus || 'disconnected';
      if (daysSinceSync > 7) syncStatus = 'error';
      else if (daysSinceSync > 3) syncStatus = 'disconnected';

      return {
        ...account,
        balanceChange,
        balanceChangePercent,
        trend,
        daysSinceSync,
        syncStatus,
        displayBalance: showBalances || !account.hidden ? account.balance : '****'
      };
    });
  }, [accounts, showBalances]);

  // Filtrer et trier les comptes
  const filteredAccounts = useMemo(() => {
    let filtered = enrichedAccounts.filter(account => {
      // Filtre par texte de recherche
      if (searchText && !account.name.toLowerCase().includes(searchText.toLowerCase()) && 
          !account.accountNumber?.toLowerCase().includes(searchText.toLowerCase()) &&
          !HAITI_BANKS[account.bank]?.name.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      // Filtre par banque
      if (selectedBanks.length > 0 && !selectedBanks.includes(account.bank)) {
        return false;
      }

      // Filtre par type
      if (selectedTypes.length > 0 && !selectedTypes.includes(account.type)) {
        return false;
      }

      // Filtre par statut
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(account.status || 'active')) {
        return false;
      }

      // Filtre par devise
      if (selectedCurrencies.length > 0 && !selectedCurrencies.includes(account.currency || defaultCurrency)) {
        return false;
      }

      // Filtre par solde
      if (minBalance && account.balance < parseFloat(minBalance)) return false;
      if (maxBalance && account.balance > parseFloat(maxBalance)) return false;

      // Filtre comptes cachés
      if (!showHiddenAccounts && account.hidden) return false;

      // Filtre favoris seulement
      if (showOnlyFavorites && !account.favorite) return false;

      // Filtres rapides
      switch (quickFilter) {
        case 'positive':
          return account.balance > 0;
        case 'negative':
          return account.balance < 0;
        case 'zero':
          return account.balance === 0;
        case 'favorites':
          return account.favorite;
        case 'credit_cards':
          return account.type === 'credit';
        case 'savings':
          return account.type === 'savings';
        case 'mobile_wallets':
          return account.type === 'wallet';
        case 'sync_issues':
          return account.syncStatus === 'error' || account.daysSinceSync > 7;
        case 'inactive':
          return ['inactive', 'suspended', 'closed'].includes(account.status);
        default:
          return true;
      }
    });

    // Trier
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === 'balance' || orderBy === 'trend') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (orderBy === 'account') {
        aVal = a.name;
        bVal = b.name;
      }

      if (orderBy === 'bank') {
        aVal = HAITI_BANKS[a.bank]?.name || a.bank;
        bVal = HAITI_BANKS[b.bank]?.name || b.bank;
      }

      if (orderBy === 'lastSync') {
        aVal = a.lastSync ? new Date(a.lastSync) : new Date(0);
        bVal = b.lastSync ? new Date(b.lastSync) : new Date(0);
      }

      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [enrichedAccounts, searchText, selectedBanks, selectedTypes, selectedStatuses, selectedCurrencies,
      minBalance, maxBalance, showHiddenAccounts, showOnlyFavorites, quickFilter, orderBy, order, defaultCurrency]);

  // Données paginées
  const paginatedAccounts = useMemo(() => {
    if (!showPagination) return filteredAccounts;
    const startIndex = page * rowsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAccounts, page, rowsPerPage, showPagination]);

  // Handlers de tri
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  // Handlers de sélection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(paginatedAccounts.map(acc => acc.id));
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
  const handleMenuOpen = (event, account) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedAccount(null);
  };

  // Handlers d'actions
  const handleView = useCallback(() => {
    handleMenuClose();
    if (onAccountView && selectedAccount) {
      onAccountView(selectedAccount);
    }
  }, [onAccountView, selectedAccount]);

  const handleEdit = useCallback(() => {
    handleMenuClose();
    if (onAccountEdit && selectedAccount) {
      onAccountEdit(selectedAccount);
    }
  }, [onAccountEdit, selectedAccount]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    if (onAccountDelete && selectedAccount && 
        window.confirm(`Êtes-vous sûr de vouloir supprimer le compte "${selectedAccount.name}" ?`)) {
      onAccountDelete(selectedAccount.id);
    }
  }, [onAccountDelete, selectedAccount]);

  const handleSync = useCallback(() => {
    handleMenuClose();
    if (onAccountSync && selectedAccount) {
      onAccountSync(selectedAccount.id);
    } else {
      setSyncDialogOpen(true);
    }
  }, [onAccountSync, selectedAccount]);

  const handleToggleVisibility = useCallback(() => {
    handleMenuClose();
    if (onAccountToggleVisibility && selectedAccount) {
      onAccountToggleVisibility(selectedAccount.id);
    }
  }, [onAccountToggleVisibility, selectedAccount]);

  const handleToggleFavorite = useCallback(() => {
    handleMenuClose();
    if (onAccountToggleFavorite && selectedAccount) {
      onAccountToggleFavorite(selectedAccount.id);
    }
  }, [onAccountToggleFavorite, selectedAccount]);

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

  // Render de l'évolution du solde
  const renderTrendCell = (account) => {
    const { trend, balanceChange, balanceChangePercent } = account;
    const TrendIcon = trend === 'up' ? TrendingUpIcon : 
                    trend === 'down' ? TrendingDownIcon : TrendingFlatIcon;

    return (
      <MDBox display="flex" alignItems="center" justifyContent="center">
        <Tooltip title={`${balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(2)} (${balanceChangePercent.toFixed(1)}%)`}>
          <TrendIcon 
            sx={{ 
              fontSize: 20,
              color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.disabled'
            }} 
          />
        </Tooltip>
      </MDBox>
    );
  };

  // Render des informations du compte
  const renderAccountInfo = (account) => {
    const bank = HAITI_BANKS[account.bank];
    const accountType = ACCOUNT_TYPES[account.type];

    return (
      <MDBox display="flex" alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          badgeContent={
            account.favorite ? (
              <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
            ) : null
          }
        >
          <Avatar
            src={bank?.logo}
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1,
              bgcolor: bank?.color || accountType?.color,
              '& img': { objectFit: 'contain' }
            }}
          >
            {bank?.name?.charAt(0) || account.bank?.charAt(0)}
          </Avatar>
        </Badge>
        
        <MDBox>
          <MDBox display="flex" alignItems="center" gap={0.5}>
            <MDTypography variant="body2" fontWeight="medium">
              {account.name}
            </MDTypography>
            {account.hidden && (
              <VisibilityOffIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            )}
          </MDBox>
          
          <MDTypography variant="caption" color="text">
            {account.accountNumber ? `****${account.accountNumber.slice(-4)}` : 'Pas de numéro'}
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  };

  // Render du statut de synchronisation
  const renderSyncStatus = (account) => {
    const sync = SYNC_STATUS[account.syncStatus] || SYNC_STATUS.disconnected;
    
    return (
      <MDBox textAlign="center">
        <Tooltip title={account.lastSync ? `Dernière sync: ${new Date(account.lastSync).toLocaleDateString('fr-FR')}` : 'Jamais synchronisé'}>
          <Chip
            icon={React.createElement(sync.icon, { sx: { fontSize: 16 } })}
            label={account.daysSinceSync !== null ? `${account.daysSinceSync}j` : sync.label}
            color={sync.color}
            size="small"
            variant="outlined"
          />
        </Tooltip>
      </MDBox>
    );
  };

  // Render du détail d'une ligne expandée
  const renderExpandedRow = (account) => {
    return (
      <TableRow>
        <TableCell colSpan={TABLE_COLUMNS.length + (showSelection ? 2 : 1)} sx={{ py: 2, bgcolor: 'grey.50' }}>
          <MDBox p={2}>
            <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
              <MDBox>
                <MDTypography variant="caption" color="text">Numéro de compte</MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {account.accountNumber || 'Non renseigné'}
                </MDTypography>
              </MDBox>
              
              <MDBox>
                <MDTypography variant="caption" color="text">Date d'ouverture</MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {account.openDate ? new Date(account.openDate).toLocaleDateString('fr-FR') : 'Inconnue'}
                </MDTypography>
              </MDBox>
              
              <MDBox>
                <MDTypography variant="caption" color="text">Solde disponible</MDTypography>
                <CurrencyDisplay
                  amount={account.availableBalance || account.balance}
                  currency={account.currency || defaultCurrency}
                  variant="body2"
                  fontWeight="medium"
                />
              </MDBox>
              
              <MDBox>
                <MDTypography variant="caption" color="text">Limite de crédit</MDTypography>
                <CurrencyDisplay
                  amount={account.creditLimit || 0}
                  currency={account.currency || defaultCurrency}
                  variant="body2"
                  fontWeight="medium"
                />
              </MDBox>
            </Stack>

            {account.description && (
              <MDBox sx={{ mb: 1 }}>
                <MDTypography variant="caption" color="text">Description</MDTypography>
                <MDTypography variant="body2">
                  {account.description}
                </MDTypography>
              </MDBox>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {account.features?.map((feature, index) => (
                <Chip key={index} label={feature} size="small" variant="outlined" />
              ))}
            </Stack>
          </MDBox>
        </TableCell>
      </TableRow>
    );
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalBalance = filteredAccounts.reduce((sum, acc) => {
      // Convertir en devise par défaut si nécessaire
      const rate = acc.currency === 'USD' && defaultCurrency === 'HTG' ? 110 : 1;
      return sum + (acc.balance * rate);
    }, 0);
    
    const positiveAccounts = filteredAccounts.filter(acc => acc.balance > 0).length;
    const negativeAccounts = filteredAccounts.filter(acc => acc.balance < 0).length;
    const favoriteAccounts = filteredAccounts.filter(acc => acc.favorite).length;
    const syncIssues = filteredAccounts.filter(acc => acc.syncStatus === 'error' || acc.daysSinceSync > 7).length;

    return {
      totalAccounts: filteredAccounts.length,
      totalBalance,
      positiveAccounts,
      negativeAccounts,
      favoriteAccounts,
      syncIssues
    };
  }, [filteredAccounts, defaultCurrency]);

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
                  {stats.totalAccounts} compte{stats.totalAccounts > 1 ? 's' : ''} 
                  · {stats.positiveAccounts} positif{stats.positiveAccounts > 1 ? 's' : ''}
                  {stats.syncIssues > 0 && ` · ${stats.syncIssues} problème${stats.syncIssues > 1 ? 's' : ''} sync`}
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
                    color={searchText || selectedBanks.length > 0 || selectedTypes.length > 0 ? "primary" : "default"}
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
                placeholder="Rechercher un compte..."
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
              <MDTypography variant="caption" color="text">Solde Total</MDTypography>
              <CurrencyDisplay
                amount={stats.totalBalance}
                currency={defaultCurrency}
                variant="body2"
                fontWeight="bold"
              />
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Comptes +</MDTypography>
              <MDTypography variant="body2" fontWeight="bold" color="success">
                {stats.positiveAccounts}
              </MDTypography>
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Comptes -</MDTypography>
              <MDTypography variant="body2" fontWeight="bold" color="error">
                {stats.negativeAccounts}
              </MDTypography>
            </MDBox>
            
            <MDBox textAlign="center">
              <MDTypography variant="caption" color="text">Favoris</MDTypography>
              <MDTypography variant="body2" fontWeight="bold" color="warning">
                {stats.favoriteAccounts}
              </MDTypography>
            </MDBox>
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
                variant={quickFilter === 'positive' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('positive')}
                color="success"
              >
                Positifs
              </MDButton>
              <MDButton
                variant={quickFilter === 'negative' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('negative')}
                color="error"
              >
                Négatifs
              </MDButton>
              <MDButton
                variant={quickFilter === 'favorites' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('favorites')}
                color="warning"
              >
                Favoris
              </MDButton>
              <MDButton
                variant={quickFilter === 'credit_cards' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('credit_cards')}
              >
                Crédit
              </MDButton>
              <MDButton
                variant={quickFilter === 'mobile_wallets' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('mobile_wallets')}
              >
                Mobile
              </MDButton>
              <MDButton
                variant={quickFilter === 'sync_issues' ? 'contained' : 'outlined'}
                onClick={() => setQuickFilter('sync_issues')}
                color="error"
              >
                Problèmes
              </MDButton>
            </ButtonGroup>
            
            <FormControlLabel
              control={
                <Switch
                  checked={showHiddenAccounts}
                  onChange={(e) => setShowHiddenAccounts(e.target.checked)}
                  size="small"
                />
              }
              label="Comptes cachés"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={showOnlyFavorites}
                  onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                  size="small"
                />
              }
              label="Favoris seulement"
            />
          </Stack>
        </CardContent>

        {/* Panel de filtres avancés */}
        <Collapse in={showFiltersPanel}>
          <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Banques</InputLabel>
                <Select
                  multiple
                  value={selectedBanks}
                  onChange={(e) => setSelectedBanks(e.target.value)}
                  input={<OutlinedInput label="Banques" />}
                  renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                >
                  {Object.entries(HAITI_BANKS).map(([key, bank]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedBanks.includes(key)} />
                      <ListItemText primary={bank.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Types</InputLabel>
                <Select
                  multiple
                  value={selectedTypes}
                  onChange={(e) => setSelectedTypes(e.target.value)}
                  input={<OutlinedInput label="Types" />}
                  renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                >
                  {Object.entries(ACCOUNT_TYPES).map(([key, type]) => (
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
                  {Object.entries(ACCOUNT_STATUS).map(([key, status]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedStatuses.includes(key)} />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Solde Min"
                type="number"
                value={minBalance}
                onChange={(e) => setMinBalance(e.target.value)}
                sx={{ width: 120 }}
              />

              <TextField
                size="small"
                label="Solde Max"
                type="number"
                value={maxBalance}
                onChange={(e) => setMaxBalance(e.target.value)}
                sx={{ width: 120 }}
              />

              <MDButton
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchText('');
                  setSelectedBanks([]);
                  setSelectedTypes([]);
                  setSelectedStatuses([]);
                  setSelectedCurrencies([]);
                  setMinBalance('');
                  setMaxBalance('');
                  setQuickFilter('all');
                  setShowHiddenAccounts(false);
                  setShowOnlyFavorites(false);
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
                      indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedAccounts.length}
                      checked={paginatedAccounts.length > 0 && selectedRows.length === paginatedAccounts.length}
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
              {paginatedAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_COLUMNS.length + (showSelection ? 2 : 1)} align="center" sx={{ py: 4 }}>
                    <Alert severity="info">
                      <MDTypography variant="body2">
                        {searchText || selectedBanks.length > 0 || selectedTypes.length > 0
                          ? 'Aucun compte ne correspond aux critères de recherche.'
                          : 'Aucun compte trouvé. Ajoutez votre premier compte !'}
                      </MDTypography>
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAccounts.map((account) => (
                  <React.Fragment key={account.id}>
                    <TableRow
                      hover
                      selected={selectedRows.includes(account.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {showSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(account.id)}
                            onChange={() => handleSelectRow(account.id)}
                          />
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleRowExpand(account.id)}
                        >
                          {expandedRows.has(account.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>

                      {/* Compte */}
                      <TableCell onClick={() => handleRowExpand(account.id)}>
                        {renderAccountInfo(account)}
                      </TableCell>

                      {/* Banque */}
                      <TableCell>
                        <MDBox display="flex" alignItems="center">
                          <Avatar
                            src={HAITI_BANKS[account.bank]?.logo}
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              mr: 1,
                              bgcolor: HAITI_BANKS[account.bank]?.color
                            }}
                          >
                            {HAITI_BANKS[account.bank]?.name?.charAt(0)}
                          </Avatar>
                          <MDTypography variant="body2">
                            {HAITI_BANKS[account.bank]?.name || account.bank}
                          </MDTypography>
                        </MDBox>
                      </TableCell>

                      {/* Type */}
                      <TableCell align="center">
                        <Chip
                          icon={React.createElement(ACCOUNT_TYPES[account.type]?.icon || AccountBalanceIcon, {
                            sx: { fontSize: 16 }
                          })}
                          label={ACCOUNT_TYPES[account.type]?.label || account.type}
                          size="small"
                          sx={{
                            bgcolor: ACCOUNT_TYPES[account.type]?.color + '20',
                            color: ACCOUNT_TYPES[account.type]?.color
                          }}
                        />
                      </TableCell>

                      {/* Solde */}
                      <TableCell align="right">
                        <MDBox>
                          {showBalances && !account.hidden ? (
                            <CurrencyDisplay
                              amount={account.balance}
                              currency={account.currency || defaultCurrency}
                              variant="body2"
                              fontWeight="medium"
                            />
                          ) : (
                            <MDTypography variant="body2" fontWeight="medium" color="text">
                              ****
                            </MDTypography>
                          )}
                          <MDTypography variant="caption" color="text" display="block">
                            {account.currency || defaultCurrency}
                          </MDTypography>
                        </MDBox>
                      </TableCell>

                      {/* Évolution */}
                      <TableCell align="center">
                        {renderTrendCell(account)}
                      </TableCell>

                      {/* Dernière synchronisation */}
                      <TableCell align="center">
                        {renderSyncStatus(account)}
                      </TableCell>

                      {/* Statut */}
                      <TableCell align="center">
                        <Chip
                          icon={React.createElement(ACCOUNT_STATUS[account.status || 'active'].icon, {
                            sx: { fontSize: 16 }
                          })}
                          label={ACCOUNT_STATUS[account.status || 'active'].label}
                          color={ACCOUNT_STATUS[account.status || 'active'].color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, account)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* Ligne expandée */}
                    {expandedRows.has(account.id) && renderExpandedRow(account)}
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
            count={filteredAccounts.length}
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
          
          <MenuItem onClick={handleSync}>
            <ListItemIcon>
              <SyncIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Synchroniser</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleToggleFavorite}>
            <ListItemIcon>
              {selectedAccount?.favorite ? 
                <StarIcon fontSize="small" /> : 
                <StarBorderIcon fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText>
              {selectedAccount?.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleToggleVisibility}>
            <ListItemIcon>
              {selectedAccount?.hidden ? 
                <VisibilityIcon fontSize="small" /> : 
                <VisibilityOffIcon fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText>
              {selectedAccount?.hidden ? 'Afficher' : 'Masquer'}
            </ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={() => console.log('Historique')}>
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Historique</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => console.log('Relevé')}>
            <ListItemIcon>
              <ReceiptIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Télécharger relevé</ListItemText>
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
          <MenuItem onClick={() => handleBulkAction('sync')}>
            <ListItemIcon>
              <SyncIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Synchroniser sélection</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleBulkAction('favorite')}>
            <ListItemIcon>
              <StarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ajouter aux favoris</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleBulkAction('hide')}>
            <ListItemIcon>
              <VisibilityOffIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Masquer sélection</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleBulkAction('export')}>
            <ListItemIcon>
              <GetAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Exporter sélection</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={() => handleBulkAction('delete')}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer sélection</ListItemText>
          </MenuItem>
        </Menu>
      </Card>

      {/* Dialog de synchronisation */}
      <Dialog open={syncDialogOpen} onClose={() => setSyncDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Synchroniser {selectedAccount?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            La synchronisation va mettre à jour le solde et récupérer les dernières transactions.
          </Alert>
          
          <MDBox textAlign="center" py={2}>
            <SyncIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <MDTypography variant="body2">
              Prêt à synchroniser avec {HAITI_BANKS[selectedAccount?.bank]?.name}
            </MDTypography>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setSyncDialogOpen(false)}>
            Annuler
          </MDButton>
          <MDButton 
            variant="contained" 
            color="primary"
            onClick={() => {
              setSyncDialogOpen(false);
              if (onAccountSync && selectedAccount) {
                onAccountSync(selectedAccount.id);
              }
            }}
          >
            Synchroniser
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    currency: PropTypes.string,
    status: PropTypes.string,
    accountNumber: PropTypes.string,
    hidden: PropTypes.bool,
    favorite: PropTypes.bool,
    lastSync: PropTypes.string,
    syncStatus: PropTypes.string,
    previousBalance: PropTypes.number,
    availableBalance: PropTypes.number,
    creditLimit: PropTypes.number,
    openDate: PropTypes.string,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string)
  })),
  title: PropTypes.string,
  defaultCurrency: PropTypes.string,
  onAccountEdit: PropTypes.func,
  onAccountDelete: PropTypes.func,
  onAccountView: PropTypes.func,
  onAccountSync: PropTypes.func,
  onAccountToggleVisibility: PropTypes.func,
  onAccountToggleFavorite: PropTypes.func,
  onBulkAction: PropTypes.func,
  showFilters: PropTypes.bool,
  showSearch: PropTypes.bool,
  showPagination: PropTypes.bool,
  showSelection: PropTypes.bool,
  showBalances: PropTypes.bool,
  defaultRowsPerPage: PropTypes.number,
  viewMode: PropTypes.oneOf(['detailed', 'compact', 'minimal'])
};

export default AccountsTable;