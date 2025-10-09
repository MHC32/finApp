/**
 * =========================================================
 * FinApp Haiti - Account Form (VERSION FINALE)
 * Formulaire synchronisé avec backend
 * ✅ Basé sur Account model + controller + routes
 * =========================================================
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui components
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// MD components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Constants
import { ACCOUNT_TYPES, BANKS, CURRENCIES } from 'utils/constants/constants';

// ===================================================================
// ACCOUNT FORM COMPONENT
// ===================================================================

function AccountForm({ account = null, onSubmit, onCancel, loading = false }) {
  const isEditMode = !!account;

  // Form state - Synchronisé avec Account model
  const [formData, setFormData] = useState({
    name: '',
    type: ACCOUNT_TYPES.CASH,
    bankName: 'cash',
    currency: 'HTG',
    accountNumber: '',
    initialBalance: 0,
    minimumBalance: 0,
    creditLimit: 0,
    description: '',
    tags: [],
    isDefault: false,
    includeInTotal: true,
    allowNegativeBalance: false,
  });

  const [errors, setErrors] = useState({});

  // ================================================================
  // EFFECTS
  // ================================================================

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        type: account.type || ACCOUNT_TYPES.CASH,
        bankName: account.bankName || 'cash',
        currency: account.currency || 'HTG',
        accountNumber: account.accountNumber || '',
        initialBalance: account.currentBalance || 0,
        minimumBalance: account.minimumBalance || 0,
        creditLimit: account.creditLimit || 0,
        description: account.description || '',
        tags: account.tags || [],
        isDefault: account.isDefault || false,
        includeInTotal: account.includeInTotal !== undefined ? account.includeInTotal : true,
        allowNegativeBalance: account.allowNegativeBalance || false,
      });
    }
  }, [account]);

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    let processedValue = value;
    
    // Traitement selon le type de champ
    if (field === 'initialBalance' || field === 'minimumBalance' || field === 'creditLimit') {
      processedValue = parseFloat(value) || 0;
    }
    
    // Si on change le type de compte, adapter bankName
    if (field === 'type') {
      const newType = value;
      // Si type n'est pas checking/savings, mettre bankName à 'cash'
      if (newType !== ACCOUNT_TYPES.CHECKING && newType !== ACCOUNT_TYPES.SAVINGS) {
        setFormData((prev) => ({
          ...prev,
          type: newType,
          bankName: 'cash',
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validation name (2-100 caractères)
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }

    // Validation type
    if (!formData.type) {
      newErrors.type = 'Le type de compte est requis';
    }

    // Validation bankName (requis si checking ou savings)
    if (
      (formData.type === ACCOUNT_TYPES.CHECKING || formData.type === ACCOUNT_TYPES.SAVINGS) &&
      !formData.bankName
    ) {
      newErrors.bankName = 'La banque est requise pour ce type de compte';
    }

    // Validation currency
    if (!formData.currency) {
      newErrors.currency = 'La devise est requise';
    }

    // Validation accountNumber (optionnel mais min 5 max 30 si présent)
    if (formData.accountNumber && formData.accountNumber.trim()) {
      if (formData.accountNumber.trim().length < 5) {
        newErrors.accountNumber = 'Le numéro de compte doit contenir au moins 5 caractères';
      } else if (formData.accountNumber.trim().length > 30) {
        newErrors.accountNumber = 'Le numéro de compte ne peut pas dépasser 30 caractères';
      }
    }

    // Validation initialBalance (doit être positif)
    if (formData.initialBalance < 0) {
      newErrors.initialBalance = 'Le solde initial doit être positif';
    }

    // Validation creditLimit (doit être positif)
    if (formData.creditLimit < 0) {
      newErrors.creditLimit = 'La limite de crédit doit être positive';
    }

    // Validation description (max 200)
    if (formData.description && formData.description.trim().length > 200) {
      newErrors.description = 'La description ne peut pas dépasser 200 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (onSubmit) {
      // Préparer les données selon le format backend
      const submitData = {
        name: formData.name.trim(),
        type: formData.type,
        bankName: formData.bankName,
        currency: formData.currency,
        accountNumber: formData.accountNumber?.trim() || undefined,
        initialBalance: formData.initialBalance,
        minimumBalance: formData.minimumBalance,
        creditLimit: formData.creditLimit,
        description: formData.description?.trim() || undefined,
        tags: formData.tags,
        isDefault: formData.isDefault,
        includeInTotal: formData.includeInTotal,
        allowNegativeBalance: formData.allowNegativeBalance,
      };

      onSubmit(submitData);
    }
  };

  // ================================================================
  // RENDER HELPERS
  // ================================================================

  const renderLabel = (label, required = false) => (
    <MDTypography variant="caption" fontWeight="medium" color="text" mb={0.5} display="block">
      {label}
      {required && <span style={{ color: '#f44336' }}> *</span>}
    </MDTypography>
  );

  const renderError = (field) => {
    if (!errors[field]) return null;
    return (
      <MDTypography variant="caption" color="error" mt={0.5} display="block">
        {errors[field]}
      </MDTypography>
    );
  };

  // Déterminer si le champ banque doit être affiché
  const shouldShowBankField =
    formData.type === ACCOUNT_TYPES.CHECKING || formData.type === ACCOUNT_TYPES.SAVINGS;

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <MDBox component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        {/* Nom du compte */}
        <Grid item xs={12}>
          {renderLabel('Nom du compte', true)}
          <MDInput
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="Ex: Compte courant BNC"
            fullWidth
            required
            disabled={loading}
            error={!!errors.name}
          />
          {renderError('name')}
        </Grid>

        {/* Type de compte */}
        <Grid item xs={12} md={shouldShowBankField ? 6 : 12}>
          {renderLabel('Type de compte', true)}
          <MDInput
            select
            value={formData.type}
            onChange={handleChange('type')}
            fullWidth
            required
            disabled={loading}
            error={!!errors.type}
          >
            <MenuItem value={ACCOUNT_TYPES.CHECKING}>Compte Courant</MenuItem>
            <MenuItem value={ACCOUNT_TYPES.SAVINGS}>Compte Épargne</MenuItem>
            <MenuItem value={ACCOUNT_TYPES.CASH}>Espèces</MenuItem>
            <MenuItem value={ACCOUNT_TYPES.MOBILE_MONEY}>Mobile Money</MenuItem>
            <MenuItem value={ACCOUNT_TYPES.INVESTMENT}>Investissement</MenuItem>
          </MDInput>
          {renderError('type')}
        </Grid>

        {/* Banque (conditionnel) */}
        {shouldShowBankField && (
          <Grid item xs={12} md={6}>
            {renderLabel('Banque', true)}
            <MDInput
              select
              value={formData.bankName}
              onChange={handleChange('bankName')}
              fullWidth
              required
              disabled={loading}
              error={!!errors.bankName}
            >
              {Object.entries(BANKS).map(([key, bank]) => (
                <MenuItem key={key} value={key}>
                  {bank.logo} {bank.shortName || bank.name}
                </MenuItem>
              ))}
            </MDInput>
            {renderError('bankName')}
          </Grid>
        )}

        {/* Devise */}
        <Grid item xs={12} md={6}>
          {renderLabel('Devise', true)}
          <MDInput
            select
            value={formData.currency}
            onChange={handleChange('currency')}
            fullWidth
            required
            disabled={loading}
            error={!!errors.currency}
          >
            {Object.entries(CURRENCIES).map(([key, curr]) => (
              <MenuItem key={key} value={key}>
                {curr.name} ({curr.symbol})
              </MenuItem>
            ))}
          </MDInput>
          {renderError('currency')}
        </Grid>

        {/* Numéro de compte (optionnel) */}
        <Grid item xs={12} md={6}>
          {renderLabel('Numéro de compte (optionnel)')}
          <MDInput
            type="text"
            value={formData.accountNumber}
            onChange={handleChange('accountNumber')}
            placeholder="Ex: 123456789"
            fullWidth
            disabled={loading}
            error={!!errors.accountNumber}
          />
          {renderError('accountNumber')}
        </Grid>

        {/* Solde initial/actuel */}
        <Grid item xs={12} md={4}>
          {renderLabel(isEditMode ? 'Solde actuel' : 'Solde initial')}
          <MDInput
            type="number"
            value={formData.initialBalance}
            onChange={handleChange('initialBalance')}
            placeholder="0.00"
            fullWidth
            disabled={loading}
            error={!!errors.initialBalance}
            inputProps={{
              step: '0.01',
              min: '0',
            }}
          />
          {renderError('initialBalance')}
        </Grid>

        {/* Solde minimum */}
        <Grid item xs={12} md={4}>
          {renderLabel('Solde minimum (optionnel)')}
          <MDInput
            type="number"
            value={formData.minimumBalance}
            onChange={handleChange('minimumBalance')}
            placeholder="0.00"
            fullWidth
            disabled={loading}
            inputProps={{
              step: '0.01',
            }}
          />
        </Grid>

        {/* Limite de crédit */}
        <Grid item xs={12} md={4}>
          {renderLabel('Limite de crédit (optionnel)')}
          <MDInput
            type="number"
            value={formData.creditLimit}
            onChange={handleChange('creditLimit')}
            placeholder="0.00"
            fullWidth
            disabled={loading}
            error={!!errors.creditLimit}
            inputProps={{
              step: '0.01',
              min: '0',
            }}
          />
          {renderError('creditLimit')}
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          {renderLabel('Description (optionnel)')}
          <MDInput
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Notes sur ce compte..."
            fullWidth
            disabled={loading}
            error={!!errors.description}
          />
          {renderError('description')}
        </Grid>

        {/* Options */}
        <Grid item xs={12}>
          <MDBox display="flex" flexDirection="column" gap={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDefault}
                  onChange={handleCheckboxChange('isDefault')}
                  disabled={loading}
                />
              }
              label={
                <MDTypography variant="button" color="text">
                  Définir comme compte par défaut
                </MDTypography>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.includeInTotal}
                  onChange={handleCheckboxChange('includeInTotal')}
                  disabled={loading}
                />
              }
              label={
                <MDTypography variant="button" color="text">
                  Inclure dans le solde total
                </MDTypography>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.allowNegativeBalance}
                  onChange={handleCheckboxChange('allowNegativeBalance')}
                  disabled={loading}
                />
              }
              label={
                <MDTypography variant="button" color="text">
                  Autoriser solde négatif
                </MDTypography>
              }
            />
          </MDBox>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Actions */}
      <MDBox display="flex" justifyContent="flex-end" gap={2}>
        <MDButton variant="outlined" color="dark" onClick={onCancel} disabled={loading}>
          Annuler
        </MDButton>
        <MDButton
          type="submit"
          variant="gradient"
          color={isEditMode ? 'warning' : 'info'}
          disabled={loading || !formData.name || !formData.type}
        >
          <Icon sx={{ mr: 1 }}>
            {loading ? 'hourglass_empty' : isEditMode ? 'save' : 'add_circle'}
          </Icon>
          {loading ? 'En cours...' : isEditMode ? 'Enregistrer' : 'Créer le compte'}
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

// ===================================================================
// PROP TYPES
// ===================================================================

AccountForm.propTypes = {
  account: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AccountForm;