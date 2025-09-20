// src/components/FinApp/TransactionTable/index.js
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
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Collapse,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

// Material Dashboard 2 React components
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';

// FinApp components
import CurrencyDisplay from '../CurrencyDisplay';
import CategorySelector from '../CategorySelector';
import QuickTransactionForm from '../QuickTransactionForm';
import TransactionForm from '../TransactionForm';

// Catégories avec icônes (réutilisation CategorySelector)
const TRANSACTION_CATEGORIES = {
  alimentation: { label: 'Alimentation', icon: 'restaurant', color: '#4caf50' },
  transport: { label: 'Transport', icon: 'directions_car', color: '#2196f3' },
  logement: { label: 'Logement', icon: 'home', color: '#ff9800' },
  sante: { label: 'Santé', icon: 'medical_services', color: '#f44336' },
  education: { label: 'Éducation', icon: 'school', color: '#9c27b0' },
  shopping: { label: 'Shopping', icon: 'shopping_bag', color: '#607d8b' },
  divertissement: { label: 'Loisirs', icon: 'movie', color: '#795548' },
  travail: { label: 'Revenus', icon: 'work', color: '#4caf50' },
  transfert: { label: 'Transferts', icon: 'swap_horiz', color: '#00bcd4' },
  autre: { label: 'Autre', icon: 'category', color: '#9e9e9e' }
};

// Types de transaction
const TRANSACTION_TYPES = {
  income: { label: 'Revenus', color: 'success', icon: 'trending_up' },
  expense: { label: 'Dépenses', color: 'error', icon: 'trending_down' },
  transfer: { label: 'Transferts', color: 'info', icon: 'swap_horiz' }
};

// Comptes bancaires
const BANK_ACCOUNTS = {
  sogebank_checking: { label: 'Sogebank - Courant', bank: 'Sogebank', type: 'Courant' },
  sogebank_savings: { label: 'Sogebank - Épargne', bank: 'Sogebank', type: 'Épargne' },
  unibank_checking: { label: 'Unibank - Courant', bank: 'Unibank', type: 'Courant' },
  bnc_business: { label: 'BNC - Business', bank: 'BNC', type: 'Business' },
  capital_savings: { label: 'Capital Bank - Épargne', bank: 'Capital Bank', type: 'Épargne' },
  cash: { label: 'Liquide', bank: 'Cash', type: 'Espèces' }
};

// Filtres prédéfinis
const QUICK_FILTERS = {
  today: { label: "Aujourd'hui", days: 0 },
  week: { label: "Cette semaine", days: 7 },
  month: { label: "Ce mois", days: 30 },
  quarter: { label: "Ce trimestre", days: 90 },
  year: { label: "Cette année", days: 365 },
  all: { label: "Toutes", days: null }
};

function TransactionTable({
  transactions = [],
  currency = "HTG",
  title = "Transactions",
  showQuickAdd = true,
  showFilters = true,
  showExport = true,
  height = 600,
  pageSize = 25,
  onTransactionEdit,
  onTransactionDelete,
  onTransactionDuplicate,
  onBulkAction,
  ...other
}) {
  // États pour les filtres
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [quickFilter, setQuickFilter] = useState('month');

  // États pour les actions
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);

  // Appliquer les filtres
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filtre de recherche textuelle
    if (searchText) {
      filtered = filtered.filter(transaction =>
        transaction.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.categoryLabel?.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.accountLabel?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtre par catégories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedCategories.includes(transaction.category)
      );
    }

    // Filtre par types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedTypes.includes(transaction.type)
      );
    }

    // Filtre par comptes
    if (selectedAccounts.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedAccounts.includes(transaction.account)
      );
    }

    // Filtre par dates
    if (dateFrom) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) >= dateFrom
      );
    }
    if (dateTo) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) <= dateTo
      );
    }

    // Filtre par montants
    if (minAmount !== '') {
      filtered = filtered.filter(transaction =>
        Math.abs(transaction.amount) >= parseFloat(minAmount)
      );
    }
    if (maxAmount !== '') {
      filtered = filtered.filter(transaction =>
        Math.abs(transaction.amount) <= parseFloat(maxAmount)
      );
    }

    // Filtre rapide par période
    if (quickFilter && quickFilter !== 'all') {
      const filterConfig = QUICK_FILTERS[quickFilter];
      if (filterConfig.days !== null) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - filterConfig.days);
        filtered = filtered.filter(transaction =>
          new Date(transaction.date) >= cutoffDate
        );
      }
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [
    transactions, searchText, selectedCategories, selectedTypes, selectedAccounts,
    dateFrom, dateTo, minAmount, maxAmount, quickFilter
  ]);

  // Configuration des colonnes
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      type: 'date',
      valueGetter: (params) => new Date(params.row.date),
      renderCell: (params) => {
        const date = new Date(params.row.date);
        return (
          <MDBox>
            <MDTypography variant="button" fontWeight="medium">
              {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              {date.toLocaleDateString('fr-FR', { year: 'numeric' })}
            </MDTypography>
          </MDBox>
        );
      }
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      renderCell: (params) => {
        const category = TRANSACTION_CATEGORIES[params.row.category] || TRANSACTION_CATEGORIES.autre;
        const type = TRANSACTION_TYPES[params.row.type] || TRANSACTION_TYPES.expense;
        
        return (
          <MDBox display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: category.color,
                color: 'white',
                width: 32,
                height: 32
              }}
            >
              <Icon sx={{ fontSize: 16 }}>{category.icon}</Icon>
            </Avatar>
            <MDBox>
              <MDTypography variant="button" fontWeight="medium" color="dark">
                {params.row.description}
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block">
                {category.label}
              </MDTypography>
            </MDBox>
          </MDBox>
        );
      }
    },
    {
      field: 'amount',
      headerName: 'Montant',
      width: 150,
      type: 'number',
      renderCell: (params) => (
        <CurrencyDisplay
          amount={params.row.amount}
          currency={params.row.currency || currency}
          variant="button"
          color={params.row.type === 'income' ? 'success' : 'error'}
          fontWeight="bold"
          showSymbol={true}
        />
      )
    },
    {
      field: 'account',
      headerName: 'Compte',
      width: 180,
      renderCell: (params) => {
        const account = BANK_ACCOUNTS[params.row.account] || { label: params.row.account, bank: 'Inconnu' };
        return (
          <MDBox>
            <MDTypography variant="button" fontWeight="medium">
              {account.bank}
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              {account.type}
            </MDTypography>
          </MDBox>
        );
      }
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => {
        const type = TRANSACTION_TYPES[params.row.type] || TRANSACTION_TYPES.expense;
        return (
          <Chip
            label={type.label}
            color={type.color}
            size="small"
            icon={<Icon>{type.icon}</Icon>}
          />
        );
      }
    },
    {
      field: 'balance',
      headerName: 'Solde',
      width: 140,
      renderCell: (params) => (
        params.row.balance ? (
          <CurrencyDisplay
            amount={params.row.balance}
            currency={params.row.currency || currency}
            variant="caption"
            color="text"
            showSymbol={true}
          />
        ) : (
          <MDTypography variant="caption" color="text">
            -
          </MDTypography>
        )
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <MDBox display="flex" gap={0.5}>
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}
            >
              <Icon fontSize="small">edit</Icon>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Dupliquer">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(params.row);
              }}
            >
              <Icon fontSize="small">content_copy</Icon>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row);
              }}
            >
              <Icon fontSize="small">delete</Icon>
            </IconButton>
          </Tooltip>
        </MDBox>
      )
    }
  ];

  // Gestionnaires d'événements
  const handleEdit = useCallback((transaction) => {
    setEditingTransaction(transaction);
    setShowFullForm(true);
    if (onTransactionEdit) {
      onTransactionEdit(transaction);
    }
  }, [onTransactionEdit]);

  const handleDelete = useCallback((transaction) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la transaction "${transaction.description}" ?`)) {
      if (onTransactionDelete) {
        onTransactionDelete(transaction.id);
      }
    }
  }, [onTransactionDelete]);

  const handleDuplicate = useCallback((transaction) => {
    const duplicatedTransaction = {
      ...transaction,
      id: undefined, // Nouvel ID sera généré
      date: new Date().toISOString().split('T')[0],
      description: `${transaction.description} (copie)`
    };
    setEditingTransaction(duplicatedTransaction);
    setShowFullForm(true);
    if (onTransactionDuplicate) {
      onTransactionDuplicate(duplicatedTransaction);
    }
  }, [onTransactionDuplicate]);

  const handleBulkAction = useCallback((action) => {
    setBulkActionAnchor(null);
    if (onBulkAction) {
      onBulkAction(action, selectedRows);
    }
  }, [onBulkAction, selectedRows]);

  const handleQuickFilterChange = (filterKey) => {
    setQuickFilter(filterKey);
    if (filterKey !== 'all') {
      const filterConfig = QUICK_FILTERS[filterKey];
      if (filterConfig.days !== null) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - filterConfig.days);
        setDateFrom(cutoffDate);
        setDateTo(new Date());
      }
    } else {
      setDateFrom(null);
      setDateTo(null);
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedAccounts([]);
    setDateFrom(null);
    setDateTo(null);
    setMinAmount('');
    setMaxAmount('');
    setQuickFilter('all');
  };

  const handleExport = (format) => {
    const dataToExport = filteredTransactions.map(transaction => ({
      Date: new Date(transaction.date).toLocaleDateString('fr-FR'),
      Description: transaction.description,
      Catégorie: TRANSACTION_CATEGORIES[transaction.category]?.label || transaction.category,
      Type: TRANSACTION_TYPES[transaction.type]?.label || transaction.type,
      Montant: transaction.amount,
      Devise: transaction.currency,
      Compte: BANK_ACCOUNTS[transaction.account]?.label || transaction.account
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
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (format === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
    
    setMenuAnchor(null);
  };

  // Calculer statistiques
  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = totalIncome - totalExpenses;
    
    return {
      totalTransactions: filteredTransactions.length,
      totalIncome,
      totalExpenses,
      balance
    };
  }, [filteredTransactions]);

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
                  {stats.totalTransactions} transaction{stats.totalTransactions > 1 ? 's' : ''} 
                  · Balance: {stats.balance >= 0 ? '+' : ''}{stats.balance.toLocaleString()} {currency}
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
                    {selectedRows.length} sélectionnée{selectedRows.length > 1 ? 's' : ''}
                  </MDButton>
                )}
                
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
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
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
                Période:
              </MDTypography>
              {Object.entries(QUICK_FILTERS).map(([key, filter]) => (
                <Chip
                  key={key}
                  label={filter.label}
                  onClick={() => handleQuickFilterChange(key)}
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
                  {/* Ligne 1: Recherche et montants */}
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <TextField
                      label="Rechercher"
                      placeholder="Description, catégorie..."
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
                      label="Montant min"
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      size="small"
                      sx={{ width: 120 }}
                    />
                    
                    <TextField
                      label="Montant max"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  </MDBox>

                  {/* Ligne 2: Dates */}
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <DatePicker
                      label="Date de début"
                      value={dateFrom}
                      onChange={setDateFrom}
                      renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150 }} />}
                    />
                    
                    <DatePicker
                      label="Date de fin"
                      value={dateTo}
                      onChange={setDateTo}
                      renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150 }} />}
                    />
                  </MDBox>

                  {/* Ligne 3: Sélecteurs multiples */}
                  <MDBox display="flex" gap={2} flexWrap="wrap">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Catégories</InputLabel>
                      <Select
                        multiple
                        value={selectedCategories}
                        onChange={(e) => setSelectedCategories(e.target.value)}
                        input={<OutlinedInput label="Catégories" />}
                        renderValue={(selected) => `${selected.length} sélectionnée${selected.length > 1 ? 's' : ''}`}
                      >
                        {Object.entries(TRANSACTION_CATEGORIES).map(([key, category]) => (
                          <MenuItem key={key} value={key}>
                            <Checkbox checked={selectedCategories.indexOf(key) > -1} />
                            <Icon sx={{ mr: 1 }}>{category.icon}</Icon>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Types</InputLabel>
                      <Select
                        multiple
                        value={selectedTypes}
                        onChange={(e) => setSelectedTypes(e.target.value)}
                        input={<OutlinedInput label="Types" />}
                        renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                      >
                        {Object.entries(TRANSACTION_TYPES).map(([key, type]) => (
                          <MenuItem key={key} value={key}>
                            <Checkbox checked={selectedTypes.indexOf(key) > -1} />
                            <Icon sx={{ mr: 1 }}>{type.icon}</Icon>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Comptes</InputLabel>
                      <Select
                        multiple
                        value={selectedAccounts}
                        onChange={(e) => setSelectedAccounts(e.target.value)}
                        input={<OutlinedInput label="Comptes" />}
                        renderValue={(selected) => `${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
                      >
                        {Object.entries(BANK_ACCOUNTS).map(([key, account]) => (
                          <MenuItem key={key} value={key}>
                            <Checkbox checked={selectedAccounts.indexOf(key) > -1} />
                            {account.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MDBox>

                  {/* Actions filtres */}
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

          {/* Statistiques rapides */}
          <MDBox mb={2}>
            <MDBox display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Revenus: +${stats.totalIncome.toLocaleString()} ${currency}`}
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Dépenses: -${stats.totalExpenses.toLocaleString()} ${currency}`}
                color="error"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Balance: ${stats.balance >= 0 ? '+' : ''}${stats.balance.toLocaleString()} ${currency}`}
                color={stats.balance >= 0 ? "success" : "error"}
                size="small"
              />
            </MDBox>
          </MDBox>

          {/* Table */}
          <MDBox height={height}>
            <DataGrid
              rows={filteredTransactions}
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
                        receipt_long
                      </Icon>
                      <MDTypography variant="h6" color="text" fontWeight="medium">
                        Aucune transaction
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {transactions.length === 0 
                          ? "Ajoutez votre première transaction"
                          : "Aucune transaction ne correspond aux filtres"
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
        </CardContent>

        {/* FAB pour ajout rapide */}
        {showQuickAdd && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16
            }}
            onClick={() => setShowQuickForm(true)}
          >
            <Icon>add</Icon>
          </Fab>
        )}

        {/* Menu export */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleExport('csv')}>
            <Icon sx={{ mr: 1 }}>table_view</Icon>
            Exporter CSV
          </MenuItem>
          <MenuItem onClick={() => handleExport('json')}>
            <Icon sx={{ mr: 1 }}>code</Icon>
            Exporter JSON
          </MenuItem>
        </Menu>

        {/* Menu actions groupées */}
        <Menu
          anchorEl={bulkActionAnchor}
          open={Boolean(bulkActionAnchor)}
          onClose={() => setBulkActionAnchor(null)}
        >
          <MenuItem onClick={() => handleBulkAction('delete')}>
            <Icon sx={{ mr: 1 }}>delete</Icon>
            Supprimer les sélectionnées
          </MenuItem>
          <MenuItem onClick={() => handleBulkAction('categorize')}>
            <Icon sx={{ mr: 1 }}>category</Icon>
            Changer la catégorie
          </MenuItem>
          <MenuItem onClick={() => handleBulkAction('export')}>
            <Icon sx={{ mr: 1 }}>download</Icon>
            Exporter les sélectionnées
          </MenuItem>
        </Menu>

        {/* Dialog formulaire rapide */}
        <Dialog
          open={showQuickForm}
          onClose={() => setShowQuickForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <MDTypography variant="h6" fontWeight="medium">
              Ajouter une transaction rapidement
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <QuickTransactionForm
              currency={currency}
              onSubmit={(transaction) => {
                console.log('Nouvelle transaction:', transaction);
                setShowQuickForm(false);
                // Callback vers parent pour ajouter la transaction
              }}
              onCancel={() => setShowQuickForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog formulaire complet */}
        <Dialog
          open={showFullForm}
          onClose={() => {
            setShowFullForm(false);
            setEditingTransaction(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <MDTypography variant="h6" fontWeight="medium">
              {editingTransaction?.id ? 'Modifier la transaction' : 'Ajouter une transaction'}
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <TransactionForm
              transaction={editingTransaction}
              currency={currency}
              onSubmit={(transaction) => {
                console.log('Transaction soumise:', transaction);
                setShowFullForm(false);
                setEditingTransaction(null);
                // Callback vers parent pour sauvegarder
              }}
              onCancel={() => {
                setShowFullForm(false);
                setEditingTransaction(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </LocalizationProvider>
  );
}

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['income', 'expense', 'transfer']).isRequired,
    category: PropTypes.string,
    account: PropTypes.string,
    currency: PropTypes.string,
    balance: PropTypes.number
  })),
  currency: PropTypes.string,
  title: PropTypes.string,
  showQuickAdd: PropTypes.bool,
  showFilters: PropTypes.bool,
  showExport: PropTypes.bool,
  height: PropTypes.number,
  pageSize: PropTypes.number,
  onTransactionEdit: PropTypes.func,
  onTransactionDelete: PropTypes.func,
  onTransactionDuplicate: PropTypes.func,
  onBulkAction: PropTypes.func
};

export default TransactionTable;
