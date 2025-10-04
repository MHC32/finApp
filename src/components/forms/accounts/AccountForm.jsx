/**
 * =========================================================
 * FinApp Haiti - Account Form
 * Formulaire création/modification de compte
 * ✅ Utilise accountsSlice + constants.js
 * =========================================================
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Constants
import { ACCOUNT_TYPES, BANKS, CURRENCIES } from 'utils/constants';

// Account types helpers
import {
  isAccountTypeBankBased,
  getAccountTypeLabel,
  getBankLabel,
  getCurrencyLabel,
  getCurrencySymbol,
} from 'types/account.types';

// ===================================================================
// INITIAL FORM STATE
// ===================================================================

const getInitialFormState = (account = null) => ({
  // Champs obligatoires
  name: account?.name || '',
  type: account?.type || ACCOUNT_TYPES.CASH,
  currency: account?.currency || CURRENCIES.HTG,
  
  // Champs conditionnels (banque)
  bankName: account?.bankName || '',
  accountNumber: account?.accountNumber || '',
  
  // Soldes et limites
  initialBalance: account?.initialBalance || account?.currentBalance || 0,
  minimumBalance: account?.minimumBalance || 0,
  creditLimit: account?.creditLimit || 0,
  
  // Métadonnées
  description: account?.description || '',
  tags: account?.tags || [],
  notes: account?.notes || '',
  
  // Options
  isActive: account?.isActive !== undefined ? account.isActive : true,
  includeInTotal: account?.includeInTotal !== undefined ? account.includeInTotal : true,
  allowNegativeBalance: account?.allowNegativeBalance || false,
  
  // UI (optionnel)
  color: account?.color || '',
  icon: account?.icon || '',
});

// ===================================================================
// ACCOUNT FORM COMPONENT
// ===================================================================

function AccountForm({ account = null, onSubmit, onCancel, loading = false }) {
  const isEditMode = !!account;
  
  // Form state
  const [formData, setFormData] = useState(getInitialFormState(account));
  const [formErrors, setFormErrors] = useState({});
  
  // Réinitialiser le formulaire si account change
  useEffect(() => {
    setFormData(getInitialFormState(account));
    setFormErrors({});
  }, [account]);

  // ================================================================
  // VALIDATION
  // ================================================================

  const validateForm = () => {
    const errors = {};

    // Nom du compte
    if (!formData.name.trim()) {
      errors.name = 'Le nom du compte est requis';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }

    // Type de compte
    if (!formData.type) {
      errors.type = 'Le type de compte est requis';
    }

    // Devise
    if (!formData.currency) {
      errors.currency = 'La devise est requise';
    }

    // Banque (si type nécessite une banque)
    if (isAccountTypeBankBased(formData.type)) {
      if (!formData.bankName) {
        errors.bankName = 'La banque est requise pour ce type de compte';
      }
    }

    // Solde initial (création seulement)
    if (!isEditMode) {
      if (isNaN(formData.initialBalance)) {
        errors.initialBalance = 'Le solde initial doit être un nombre';
      }
    }

    // Solde minimum
    if (formData.minimumBalance && isNaN(formData.minimumBalance)) {
      errors.minimumBalance = 'Le solde minimum doit être un nombre';
    }

    // Limite de crédit
    if (formData.creditLimit && isNaN(formData.creditLimit)) {
      errors.creditLimit = 'La limite de crédit doit être un nombre';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, checked, type: inputType } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Si on change le type de compte, réinitialiser bankName si pas nécessaire
    if (name === 'type' && !isAccountTypeBankBased(value)) {
      setFormData((prev) => ({
        ...prev,
        bankName: '',
        accountNumber: '',
      }));
    }
  };

  /**
   * Handle submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      return;
    }

    // Préparer les données à envoyer
    const submitData = {
      name: formData.name.trim(),
      type: formData.type,
      currency: formData.currency,
      description: formData.description.trim() || undefined,
      minimumBalance: parseFloat(formData.minimumBalance) || 0,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      isActive: formData.isActive,
      includeInTotal: formData.includeInTotal,
      allowNegativeBalance: formData.allowNegativeBalance,
      notes: formData.notes.trim() || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      color: formData.color || undefined,
      icon: formData.icon || undefined,
    };

    // Ajouter bankName et accountNumber si nécessaire
    if (isAccountTypeBankBased(formData.type)) {
      submitData.bankName = formData.bankName;
      if (formData.accountNumber.trim()) {
        submitData.accountNumber = formData.accountNumber.trim();
      }
    }

    // Ajouter initialBalance seulement en création
    if (!isEditMode) {
      submitData.initialBalance = parseFloat(formData.initialBalance) || 0;
    }

    // Nettoyer les undefined
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    // Appeler onSubmit avec les données
    onSubmit(submitData);
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setFormData(getInitialFormState(account));
    setFormErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  // Vérifier si le type nécessite une banque
  const needsBankInfo = isAccountTypeBankBased(formData.type);

  return (
    <MDBox component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        
        {/* ======================================================= */}
        {/* SECTION 1: INFORMATIONS DE BASE */}
        {/* ======================================================= */}

        {/* Nom du compte */}
        <Grid item xs={12} md={6}>
          <MDInput
            type="text"
            label="Nom du compte *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.name}
            disabled={loading}
            placeholder="Ex: Mon compte Sogebank"
            inputProps={{ maxLength: 100 }}
          />
          {formErrors.name && (
            <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
              {formErrors.name}
            </MDTypography>
          )}
        </Grid>

        {/* Type de compte */}
        <Grid item xs={12} md={6}>
          <MDInput
            select
            label="Type de compte *"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.type}
            disabled={loading || isEditMode} // Ne pas permettre changement en édition
          >
            {Object.values(ACCOUNT_TYPES).map((type) => (
              <MenuItem key={type} value={type}>
                {getAccountTypeLabel(type)}
              </MenuItem>
            ))}
          </MDInput>
          {formErrors.type && (
            <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
              {formErrors.type}
            </MDTypography>
          )}
        </Grid>

        {/* Devise */}
        <Grid item xs={12} md={6}>
          <MDInput
            select
            label="Devise *"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.currency}
            disabled={loading || isEditMode} // Ne pas permettre changement en édition
          >
            {Object.values(CURRENCIES).map((currency) => (
              <MenuItem key={currency} value={currency}>
                {getCurrencyLabel(currency)} ({getCurrencySymbol(currency)})
              </MenuItem>
            ))}
          </MDInput>
          {formErrors.currency && (
            <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
              {formErrors.currency}
            </MDTypography>
          )}
        </Grid>

        {/* ======================================================= */}
        {/* SECTION 2: INFORMATIONS BANCAIRES (Conditionnel) */}
        {/* ======================================================= */}

        {needsBankInfo && (
          <>
            {/* Banque */}
            <Grid item xs={12} md={6}>
              <MDInput
                select
                label="Banque *"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.bankName}
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Sélectionner une banque</em>
                </MenuItem>
                {Object.values(BANKS).map((bank) => (
                  <MenuItem key={bank} value={bank}>
                    {getBankLabel(bank)}
                  </MenuItem>
                ))}
              </MDInput>
              {formErrors.bankName && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.bankName}
                </MDTypography>
              )}
            </Grid>

            {/* Numéro de compte */}
            <Grid item xs={12} md={6}>
              <MDInput
                type="text"
                label="Numéro de compte (optionnel)"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                placeholder="Ex: 123456789"
              />
            </Grid>
          </>
        )}

        {/* ======================================================= */}
        {/* SECTION 3: SOLDES & LIMITES */}
        {/* ======================================================= */}

        {/* Solde initial (création uniquement) */}
        {!isEditMode && (
          <Grid item xs={12} md={6}>
            <MDInput
              type="number"
              label="Solde initial"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.initialBalance}
              disabled={loading}
              inputProps={{ step: '0.01', min: '0' }}
              InputProps={{
                endAdornment: (
                  <MDTypography variant="caption" color="text">
                    {getCurrencySymbol(formData.currency)}
                  </MDTypography>
                ),
              }}
            />
            {formErrors.initialBalance && (
              <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                {formErrors.initialBalance}
              </MDTypography>
            )}
          </Grid>
        )}

        {/* Solde minimum */}
        <Grid item xs={12} md={6}>
          <MDInput
            type="number"
            label="Solde minimum (optionnel)"
            name="minimumBalance"
            value={formData.minimumBalance}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.minimumBalance}
            disabled={loading}
            inputProps={{ step: '0.01', min: '0' }}
            InputProps={{
              endAdornment: (
                <MDTypography variant="caption" color="text">
                  {getCurrencySymbol(formData.currency)}
                </MDTypography>
              ),
            }}
          />
          {formErrors.minimumBalance && (
            <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
              {formErrors.minimumBalance}
            </MDTypography>
          )}
        </Grid>

        {/* Limite de crédit */}
        {(formData.type === ACCOUNT_TYPES.CHECKING || formData.type === ACCOUNT_TYPES.SAVINGS) && (
          <Grid item xs={12} md={6}>
            <MDInput
              type="number"
              label="Limite de crédit (optionnel)"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.creditLimit}
              disabled={loading}
              inputProps={{ step: '0.01', min: '0' }}
              InputProps={{
                endAdornment: (
                  <MDTypography variant="caption" color="text">
                    {getCurrencySymbol(formData.currency)}
                  </MDTypography>
                ),
              }}
            />
            {formErrors.creditLimit && (
              <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                {formErrors.creditLimit}
              </MDTypography>
            )}
          </Grid>
        )}

        {/* ======================================================= */}
        {/* SECTION 4: MÉTADONNÉES */}
        {/* ======================================================= */}

        {/* Description */}
        <Grid item xs={12}>
          <MDInput
            multiline
            rows={3}
            label="Description (optionnel)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            placeholder="Notes ou détails supplémentaires sur ce compte..."
            inputProps={{ maxLength: 500 }}
          />
        </Grid>

        {/* ======================================================= */}
        {/* SECTION 5: OPTIONS */}
        {/* ======================================================= */}

        {/* Compte actif */}
        <Grid item xs={12} md={4}>
          <MDBox>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                  disabled={loading}
                  color="info"
                />
              }
              label="Compte actif"
            />
          </MDBox>
        </Grid>

        {/* Inclure dans le total */}
        <Grid item xs={12} md={4}>
          <MDBox>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.includeInTotal}
                  onChange={handleChange}
                  name="includeInTotal"
                  disabled={loading}
                  color="info"
                />
              }
              label="Inclure dans le total"
            />
          </MDBox>
        </Grid>

        {/* Autoriser solde négatif */}
        <Grid item xs={12} md={4}>
          <MDBox>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allowNegativeBalance}
                  onChange={handleChange}
                  name="allowNegativeBalance"
                  disabled={loading}
                  color="warning"
                />
              }
              label="Autoriser solde négatif"
            />
          </MDBox>
        </Grid>

        {/* ======================================================= */}
        {/* SECTION 6: ACTIONS */}
        {/* ======================================================= */}

        {/* Error Message */}
        {formErrors.submit && (
          <Grid item xs={12}>
            <MDBox bgcolor="error.main" borderRadius="md" p={2}>
              <MDTypography variant="body2" color="white">
                ❌ {formErrors.submit}
              </MDTypography>
            </MDBox>
          </Grid>
        )}

        {/* Boutons d'action */}
        <Grid item xs={12}>
          <MDBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <MDButton
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              type="submit"
              disabled={loading}
              startIcon={<Icon>{isEditMode ? 'save' : 'add'}</Icon>}
            >
              {loading ? 'En cours...' : isEditMode ? 'Enregistrer' : 'Créer le compte'}
            </MDButton>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

// ===================================================================
// PROP TYPES
// ===================================================================

AccountForm.propTypes = {
  account: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
};

export default AccountForm;