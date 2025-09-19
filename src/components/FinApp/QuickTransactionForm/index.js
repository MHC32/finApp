// src/components/FinApp/QuickTransactionForm/index.js
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// FinApp components
import AmountInput from "components/FinApp/AmountInput";
import CurrencySelector from "components/FinApp/CurrencySelector";

// Configuration des catégories populaires
const QUICK_CATEGORIES = [
  { id: "alimentation", label: "Alimentation", icon: "restaurant", color: "success" },
  { id: "transport", label: "Transport", icon: "directions_car", color: "info" },
  { id: "carburant", label: "Carburant", icon: "local_gas_station", color: "warning" },
  { id: "shopping", label: "Shopping", icon: "shopping_bag", color: "secondary" },
  { id: "sante", label: "Santé", icon: "medical_services", color: "error" },
  { id: "loisirs", label: "Loisirs", icon: "sports_esports", color: "primary" },
  { id: "factures", label: "Factures", icon: "receipt", color: "dark" },
  { id: "autre", label: "Autre", icon: "category", color: "dark" },
];

// Modèles de transactions rapides
const QUICK_TEMPLATES = [
  { label: "Tap-tap", amount: 25, currency: "HTG", category: "transport" },
  { label: "Lunch", amount: 150, currency: "HTG", category: "alimentation" },
  { label: "Essence", amount: 500, currency: "HTG", category: "carburant" },
  { label: "Recharge", amount: 100, currency: "HTG", category: "autre" },
];

function QuickTransactionForm({
  open = false,
  onClose,
  onSubmit,
  defaultType = "expense",
  defaultAccount = null,
  accounts = [],
  recentTransactions = [],
  showTemplates = true,
  showPhotoUpload = true,
  floatingButton = false,
  ...other
}) {
  // États du formulaire
  const [formData, setFormData] = useState({
    type: defaultType,
    amount: "",
    currency: "HTG",
    category: "",
    description: "",
    account: defaultAccount,
    photo: null,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Montant, 2: Catégorie, 3: Détails

  // Reset form quand modal s'ouvre
  useEffect(() => {
    if (open) {
      setFormData({
        type: defaultType,
        amount: "",
        currency: "HTG",
        category: "",
        description: "",
        account: defaultAccount || (accounts.length > 0 ? accounts[0].id : null),
        photo: null,
      });
      setErrors({});
      setStep(1);
    }
  }, [open, defaultType, defaultAccount, accounts]);

  // Validation
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber >= 1) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = "Montant requis et doit être positif";
      }
    }
    
    if (stepNumber >= 2) {
      if (!formData.category) {
        newErrors.category = "Catégorie requise";
      }
    }
    
    if (stepNumber >= 3) {
      if (!formData.account) {
        newErrors.account = "Compte requis";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      amount: template.amount,
      currency: template.currency,
      category: template.category,
      description: template.label,
    }));
    setStep(3); // Skip à l'étape finale
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        timestamp: new Date().toISOString(),
      };
      
      if (onSubmit) {
        await onSubmit(transactionData);
      }
      
      onClose();
    } catch (error) {
      console.error("Erreur soumission:", error);
      setErrors({ submit: "Erreur lors de la sauvegarde" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Intégrer avec service upload
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  // Floating Action Button (optionnel)
  if (floatingButton) {
    return (
      <>
        <Fab
          color="primary"
          aria-label="Ajouter transaction"
          sx={{
            position: "fixed",
            bottom: 80, // Au-dessus de la bottom navigation
            right: 20,
            zIndex: 1000,
          }}
          onClick={() => setFormData(prev => ({ ...prev, open: true }))}
        >
          <Icon>add</Icon>
        </Fab>
        
        <QuickTransactionForm
          open={formData.open}
          onClose={() => setFormData(prev => ({ ...prev, open: false }))}
          onSubmit={onSubmit}
          defaultType={defaultType}
          defaultAccount={defaultAccount}
          accounts={accounts}
          recentTransactions={recentTransactions}
          showTemplates={showTemplates}
          showPhotoUpload={showPhotoUpload}
        />
      </>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 400,
        }
      }}
      {...other}
    >
      {/* Header */}
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              Nouvelle Transaction
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Étape {step}/3 - {
                step === 1 ? "Montant" :
                step === 2 ? "Catégorie" : "Finalisation"
              }
            </MDTypography>
          </MDBox>
          
          <MDBox display="flex" alignItems="center" gap={1}>
            {/* Toggle type transaction */}
            <MDBox display="flex" bgcolor="grey.100" borderRadius={1} p={0.5}>
              <MDButton
                variant={formData.type === "expense" ? "contained" : "text"}
                color="error"
                size="small"
                onClick={() => handleFieldChange("type", "expense")}
              >
                Dépense
              </MDButton>
              <MDButton
                variant={formData.type === "income" ? "contained" : "text"}
                color="success"
                size="small"
                onClick={() => handleFieldChange("type", "income")}
              >
                Revenu
              </MDButton>
            </MDBox>
            
            <IconButton onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>
        </MDBox>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Étape 1: Montant */}
        {step === 1 && (
          <MDBox>
            {/* Templates rapides */}
            {showTemplates && (
              <MDBox mb={3}>
                <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                  Transactions fréquentes
                </MDTypography>
                <MDBox display="flex" gap={1} flexWrap="wrap">
                  {QUICK_TEMPLATES.map((template, index) => (
                    <Chip
                      key={index}
                      label={`${template.label} - ${template.amount} ${template.currency}`}
                      onClick={() => handleTemplateSelect(template)}
                      clickable
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </MDBox>
              </MDBox>
            )}
            
            {/* Saisie montant */}
            <MDBox>
              <AmountInput
                value={formData.amount}
                onChange={(value) => handleFieldChange("amount", value)}
                currency={formData.currency}
                onCurrencyChange={(currency) => handleFieldChange("currency", currency)}
                label="Montant"
                size="large"
                showCurrencySwitch={true}
                error={!!errors.amount}
                helperText={errors.amount}
                autoFocus
                fullWidth
              />
            </MDBox>
          </MDBox>
        )}

        {/* Étape 2: Catégorie */}
        {step === 2 && (
          <MDBox>
            <MDTypography variant="button" fontWeight="medium" mb={2} display="block">
              Choisir une catégorie
            </MDTypography>
            
            <Grid container spacing={1}>
              {QUICK_CATEGORIES.map((category) => (
                <Grid item xs={6} sm={4} key={category.id}>
                  <MDBox
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: 2,
                      borderColor: formData.category === category.id ? `${category.color}.main` : "grey.200",
                      bgcolor: formData.category === category.id ? `${category.color}.50` : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: `${category.color}.main`,
                        bgcolor: `${category.color}.50`,
                      }
                    }}
                    onClick={() => handleFieldChange("category", category.id)}
                  >
                    <MDBox textAlign="center">
                      <Icon 
                        sx={{ 
                          fontSize: "2rem", 
                          color: formData.category === category.id ? `${category.color}.main` : "grey.500",
                          mb: 1
                        }}
                      >
                        {category.icon}
                      </Icon>
                      <MDTypography 
                        variant="caption" 
                        fontWeight="medium"
                        color={formData.category === category.id ? `${category.color}.main` : "text"}
                      >
                        {category.label}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Grid>
              ))}
            </Grid>
            
            {errors.category && (
              <MDTypography variant="caption" color="error" mt={1} display="block">
                {errors.category}
              </MDTypography>
            )}
          </MDBox>
        )}

        {/* Étape 3: Détails finaux */}
        {step === 3 && (
          <MDBox>
            <Grid container spacing={2}>
              {/* Description */}
              <Grid item xs={12}>
                <MDInput
                  label="Description (optionnel)"
                  placeholder="Ex: Lunch au restaurant..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              
              {/* Compte */}
              <Grid item xs={12} sm={6}>
                <MDInput
                  select
                  label="Compte"
                  value={formData.account || ""}
                  onChange={(e) => handleFieldChange("account", e.target.value)}
                  error={!!errors.account}
                  helperText={errors.account}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Sélectionner un compte</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.bank})
                    </option>
                  ))}
                </MDInput>
              </Grid>
              
              {/* Photo reçu */}
              {showPhotoUpload && (
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="photo-upload"
                      type="file"
                      onChange={handlePhotoUpload}
                    />
                    <label htmlFor="photo-upload">
                      <MDButton
                        variant="outlined"
                        component="span"
                        startIcon={<Icon>camera_alt</Icon>}
                        fullWidth
                        sx={{ height: 56 }} // Même hauteur que les inputs
                      >
                        {formData.photo ? "Photo ajoutée" : "Photo reçu"}
                      </MDButton>
                    </label>
                  </MDBox>
                </Grid>
              )}
            </Grid>
            
            {/* Résumé de la transaction */}
            <MDBox mt={3} p={2} bgcolor="grey.50" borderRadius={2}>
              <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                Résumé
              </MDTypography>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium" color={formData.type === "expense" ? "error" : "success"}>
                    {formData.type === "expense" ? "-" : "+"}{parseFloat(formData.amount || 0).toLocaleString()} {formData.currency}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    {QUICK_CATEGORIES.find(c => c.id === formData.category)?.label} • {formData.description || "Sans description"}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
            
            {errors.submit && (
              <MDTypography variant="caption" color="error" mt={1} display="block">
                {errors.submit}
              </MDTypography>
            )}
          </MDBox>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <MDBox display="flex" justifyContent="space-between" width="100%">
          <MDButton
            variant="text"
            onClick={step === 1 ? onClose : handlePrevStep}
            disabled={loading}
          >
            {step === 1 ? "Annuler" : "Précédent"}
          </MDButton>
          
          <MDButton
            variant="gradient"
            color={formData.type === "expense" ? "error" : "success"}
            onClick={handleNextStep}
            disabled={loading}
            startIcon={loading ? <Icon>hourglass_empty</Icon> : null}
          >
            {loading ? "Sauvegarde..." :
             step === 3 ? "Confirmer" : "Suivant"}
          </MDButton>
        </MDBox>
      </DialogActions>
    </Dialog>
  );
}

// Props par défaut
QuickTransactionForm.defaultProps = {
  open: false,
  defaultType: "expense",
  defaultAccount: null,
  accounts: [],
  recentTransactions: [],
  showTemplates: true,
  showPhotoUpload: true,
  floatingButton: false,
  onClose: () => {},
  onSubmit: () => {},
};

// Validation des props
QuickTransactionForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  defaultType: PropTypes.oneOf(["expense", "income"]),
  defaultAccount: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    bank: PropTypes.string,
  })),
  recentTransactions: PropTypes.array,
  showTemplates: PropTypes.bool,
  showPhotoUpload: PropTypes.bool,
  floatingButton: PropTypes.bool,
};

export default QuickTransactionForm;

// Export des utilitaires
export { QUICK_CATEGORIES, QUICK_TEMPLATES };