/**
 * =========================================================
 * FinApp Haiti - Account Modal CRUD
 * Modal pour créer/modifier un compte
 * =========================================================
 */

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Redux
import {
  createAccountAsync,
  updateAccountAsync,
} from "store/slices/accountsSlice";

// Constants
const ACCOUNT_TYPES = [
  { value: "checking", label: "Compte Courant" },
  { value: "savings", label: "Compte Épargne" },
  { value: "credit", label: "Carte de Crédit" },
  { value: "cash", label: "Espèces" },
  { value: "investment", label: "Investissement" },
];

const CURRENCIES = [
  { value: "HTG", label: "Gourde Haïtienne (HTG)" },
  { value: "USD", label: "Dollar Américain (USD)" },
];

const HAITI_BANKS = [
  { value: "BRH", label: "Banque de la République d'Haïti" },
  { value: "BUH", label: "Banque de l'Union Haïtienne" },
  { value: "SOGEBANK", label: "Sogebank" },
  { value: "CAPITAL_BANK", label: "Capital Bank" },
  { value: "UNIBANK", label: "Unibank" },
  { value: "BNC", label: "Banque Nationale de Crédit" },
  { value: "SCOTIABANK", label: "Scotiabank" },
  { value: "CITIBANK", label: "Citibank" },
  { value: "BPH", label: "Banque Populaire Haïtienne" },
  { value: "OTHER", label: "Autre" },
];

/**
 * Initial Form State
 */
const initialFormState = {
  name: "",
  type: "checking",
  currency: "HTG",
  bankName: "",
  accountNumber: "",
  initialBalance: 0,
  minimumBalance: 0,
  creditLimit: 0,
  description: "",
  isActive: true,
  includeInTotal: true,
  allowNegativeBalance: false,
};

/**
 * Account Modal Component
 */
function AccountModal({ open, onClose, account = null, mode = "create" }) {
  const dispatch = useDispatch();
  const isEditMode = mode === "edit" && account !== null;

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form when account changes
  useEffect(() => {
    if (isEditMode && account) {
      setFormData({
        name: account.name || "",
        type: account.type || "checking",
        currency: account.currency || "HTG",
        bankName: account.bankName || "",
        accountNumber: account.accountNumber || "",
        initialBalance: account.currentBalance || 0,
        minimumBalance: account.minimumBalance || 0,
        creditLimit: account.creditLimit || 0,
        description: account.description || "",
        isActive: account.isActive !== undefined ? account.isActive : true,
        includeInTotal: account.includeInTotal !== undefined ? account.includeInTotal : true,
        allowNegativeBalance: account.allowNegativeBalance || false,
      });
    } else {
      setFormData(initialFormState);
    }
    setFormErrors({});
  }, [account, isEditMode, open]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Le nom du compte est requis";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Minimum 3 caractères";
    }

    // Bank name validation (optionnel sauf pour certains types)
    if (["checking", "savings"].includes(formData.type) && !formData.bankName) {
      errors.bankName = "La banque est requise pour ce type de compte";
    }

    // Initial balance validation (only for create mode)
    if (!isEditMode && formData.initialBalance < 0 && !formData.allowNegativeBalance) {
      errors.initialBalance = "Le solde ne peut pas être négatif";
    }

    // Credit limit validation
    if (formData.type === "credit" && formData.creditLimit < 0) {
      errors.creditLimit = "La limite de crédit ne peut pas être négative";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update account
        await dispatch(updateAccountAsync({
          accountId: account._id,
          accountData: {
            name: formData.name,
            type: formData.type,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            description: formData.description,
            minimumBalance: parseFloat(formData.minimumBalance) || 0,
            creditLimit: parseFloat(formData.creditLimit) || 0,
            isActive: formData.isActive,
            includeInTotal: formData.includeInTotal,
            allowNegativeBalance: formData.allowNegativeBalance,
          }
        })).unwrap();

        console.log("✅ Compte modifié avec succès");
      } else {
        // Create new account
        await dispatch(createAccountAsync({
          name: formData.name,
          type: formData.type,
          currency: formData.currency,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          initialBalance: parseFloat(formData.initialBalance) || 0,
          minimumBalance: parseFloat(formData.minimumBalance) || 0,
          creditLimit: parseFloat(formData.creditLimit) || 0,
          description: formData.description,
          isActive: formData.isActive,
          includeInTotal: formData.includeInTotal,
          allowNegativeBalance: formData.allowNegativeBalance,
        })).unwrap();

        console.log("✅ Compte créé avec succès");
      }

      // Reset form and close
      setFormData(initialFormState);
      setFormErrors({});
      onClose();
    } catch (error) {
      console.error("❌ Erreur:", error);
      setFormErrors({ submit: error.message || "Une erreur est survenue" });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    if (!loading) {
      setFormData(initialFormState);
      setFormErrors({});
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogTitle>
          <MDBox display="flex" alignItems="center">
            <Icon fontSize="large" color="info" mr={2}>
              {isEditMode ? "edit" : "add_circle"}
            </Icon>
            <MDTypography variant="h4" fontWeight="medium">
              {isEditMode ? "Modifier le compte" : "Créer un compte"}
            </MDTypography>
          </MDBox>
        </DialogTitle>

        <Divider />

        {/* Content */}
        <DialogContent>
          <MDBox pt={2}>
            <Grid container spacing={3}>
              {/* Account Name */}
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
                />
                {formErrors.name && (
                  <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                    {formErrors.name}
                  </MDTypography>
                )}
              </Grid>

              {/* Account Type */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  label="Type de compte *"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading || isEditMode}
                >
                  {ACCOUNT_TYPES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MDInput>
              </Grid>

              {/* Currency */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  label="Devise *"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading || isEditMode}
                >
                  {CURRENCIES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MDInput>
              </Grid>

              {/* Bank Name */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  label="Banque"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  error={!!formErrors.bankName}
                >
                  <MenuItem value="">
                    <em>Sélectionner une banque</em>
                  </MenuItem>
                  {HAITI_BANKS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MDInput>
                {formErrors.bankName && (
                  <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                    {formErrors.bankName}
                  </MDTypography>
                )}
              </Grid>

              {/* Account Number */}
              <Grid item xs={12} md={6}>
                <MDInput
                  type="text"
                  label="Numéro de compte"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  placeholder="Ex: 1234567890"
                />
              </Grid>

              {/* Initial Balance (only in create mode) */}
              {!isEditMode && (
                <Grid item xs={12} md={6}>
                  <MDInput
                    type="number"
                    label="Solde initial"
                    name="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleChange}
                    fullWidth
                    disabled={loading}
                    error={!!formErrors.initialBalance}
                    inputProps={{ step: "0.01" }}
                  />
                  {formErrors.initialBalance && (
                    <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                      {formErrors.initialBalance}
                    </MDTypography>
                  )}
                </Grid>
              )}

              {/* Minimum Balance */}
              <Grid item xs={12} md={6}>
                <MDInput
                  type="number"
                  label="Solde minimum"
                  name="minimumBalance"
                  value={formData.minimumBalance}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>

              {/* Credit Limit (only for credit type) */}
              {formData.type === "credit" && (
                <Grid item xs={12} md={6}>
                  <MDInput
                    type="number"
                    label="Limite de crédit"
                    name="creditLimit"
                    value={formData.creditLimit}
                    onChange={handleChange}
                    fullWidth
                    disabled={loading}
                    error={!!formErrors.creditLimit}
                    inputProps={{ step: "0.01" }}
                  />
                  {formErrors.creditLimit && (
                    <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                      {formErrors.creditLimit}
                    </MDTypography>
                  )}
                </Grid>
              )}

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
                  placeholder="Notes ou détails supplémentaires..."
                />
              </Grid>

              {/* Switches */}
              <Grid item xs={12}>
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

              <Grid item xs={12}>
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
                    label="Inclure dans le total général"
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12}>
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
            </Grid>
          </MDBox>
        </DialogContent>

        <Divider />

        {/* Actions */}
        <DialogActions sx={{ p: 3 }}>
          <MDButton
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Annuler
          </MDButton>
          <MDButton
            variant="gradient"
            color="info"
            type="submit"
            disabled={loading}
            startIcon={<Icon>{isEditMode ? "save" : "add"}</Icon>}
          >
            {loading ? "En cours..." : (isEditMode ? "Enregistrer" : "Créer")}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AccountModal;