// src/components/FinApp/TransactionForm/index.js
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DatePicker from "@mui/lab/DatePicker";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// FinApp components
import AmountInput from "components/FinApp/AmountInput";
import CurrencySelector from "components/FinApp/CurrencySelector";
import { QUICK_CATEGORIES } from "components/FinApp/QuickTransactionForm";

// Configuration des types de récurrence
const RECURRENCE_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "daily", label: "Quotidienne" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "yearly", label: "Annuelle" },
];

// Méthodes de paiement
const PAYMENT_METHODS = [
  { id: "cash", label: "Espèces", icon: "payments" },
  { id: "card", label: "Carte", icon: "credit_card" },
  { id: "bank_transfer", label: "Virement", icon: "account_balance" },
  { id: "mobile_money", label: "Mobile Money", icon: "phone_android" },
  { id: "check", label: "Chèque", icon: "receipt_long" },
];

// Tags émotionnels
const EMOTIONAL_TAGS = [
  { id: "necessary", label: "Nécessaire", color: "success" },
  { id: "impulse", label: "Impulsif", color: "warning" },
  { id: "planned", label: "Planifié", color: "info" },
  { id: "regret", label: "Regret", color: "error" },
  { id: "happy", label: "Heureux", color: "success" },
  { id: "investment", label: "Investissement", color: "primary" },
];

function TransactionForm({
  transaction = null,
  accounts = [],
  categories = QUICK_CATEGORIES,
  onSubmit,
  onCancel,
  isEditing = false,
  showAdvanced = true,
  showEmotionalTags = true,
  showRecurring = true,
  showSplitTransaction = true,
  ...other
}) {
  // Onglets
  const [activeTab, setActiveTab] = useState(0);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations de base
    type: "expense",
    amount: "",
    currency: "HTG",
    category: "",
    subcategory: "",
    description: "",
    
    // Compte et paiement
    account: accounts.length > 0 ? accounts[0].id : "",
    paymentMethod: "cash",
    
    // Date et localisation
    date: new Date(),
    location: "",
    
    // Avancé
    tags: [],
    emotionalTag: "",
    notes: "",
    
    // Récurrence
    isRecurring: false,
    recurrenceType: "none",
    recurrenceEndDate: null,
    
    // Split transaction
    isSplit: false,
    splitWith: [],
    
    // Fichiers
    attachments: [],
    receipt: null,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Charger transaction existante pour édition
  useEffect(() => {
    if (isEditing && transaction) {
      setFormData({
        ...formData,
        ...transaction,
        date: new Date(transaction.date),
        recurrenceEndDate: transaction.recurrenceEndDate ? new Date(transaction.recurrenceEndDate) : null,
      });
    }
  }, [isEditing, transaction]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    // Champs obligatoires
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Montant requis et doit être positif";
    }
    
    if (!formData.category) {
      newErrors.category = "Catégorie requise";
    }
    
    if (!formData.account) {
      newErrors.account = "Compte requis";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description requise";
    }
    
    // Validation récurrence
    if (formData.isRecurring) {
      if (formData.recurrenceType === "none") {
        newErrors.recurrenceType = "Type de récurrence requis";
      }
    }
    
    // Validation split
    if (formData.isSplit) {
      if (formData.splitWith.length === 0) {
        newErrors.splitWith = "Au moins une personne requise pour split";
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

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleFileUpload = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === "attachments" ? [...prev.attachments, ...files] : files[0]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: isEditing ? transaction.id : undefined,
        createdAt: isEditing ? transaction.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (onSubmit) {
        await onSubmit(transactionData);
      }
    } catch (error) {
      console.error("Erreur soumission:", error);
      setErrors({ submit: "Erreur lors de la sauvegarde" });
    } finally {
      setLoading(false);
    }
  };

  // Configuration sous-catégories
  const getSubcategories = (categoryId) => {
    const subcategoryMap = {
      alimentation: ["Restaurant", "Épicerie", "Fast-food", "Marché"],
      transport: ["Tap-tap", "Moto", "Taxi", "Carburant"],
      sante: ["Médecin", "Pharmacie", "Hôpital", "Dentiste"],
      loisirs: ["Cinéma", "Sport", "Sortie", "Jeux"],
    };
    
    return subcategoryMap[categoryId] || [];
  };

  return (
    <Card {...other}>
      <MDBox p={3}>
        {/* Header */}
        <MDBox mb={3}>
          <MDTypography variant="h5" fontWeight="medium">
            {isEditing ? "Modifier Transaction" : "Nouvelle Transaction"}
          </MDTypography>
          <MDTypography variant="body2" color="text">
            {isEditing ? "Modifier les détails de la transaction" : "Ajouter une nouvelle transaction à vos comptes"}
          </MDTypography>
        </MDBox>

        {/* Onglets */}
        <MDBox mb={3}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Informations de base" />
            <Tab label="Détails avancés" disabled={!showAdvanced} />
            <Tab label="Récurrence" disabled={!showRecurring} />
            <Tab label="Partage" disabled={!showSplitTransaction} />
          </Tabs>
        </MDBox>

        <form onSubmit={handleSubmit}>
          {/* Onglet 1: Informations de base */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Type de transaction */}
              <Grid item xs={12}>
                <MDBox display="flex" justifyContent="center" mb={2}>
                  <MDBox display="flex" bgcolor="grey.100" borderRadius={2} p={0.5}>
                    <MDButton
                      variant={formData.type === "expense" ? "contained" : "text"}
                      color="error"
                      onClick={() => handleFieldChange("type", "expense")}
                      sx={{ minWidth: 120 }}
                    >
                      <Icon sx={{ mr: 1 }}>remove</Icon>
                      Dépense
                    </MDButton>
                    <MDButton
                      variant={formData.type === "income" ? "contained" : "text"}
                      color="success"
                      onClick={() => handleFieldChange("type", "income")}
                      sx={{ minWidth: 120 }}
                    >
                      <Icon sx={{ mr: 1 }}>add</Icon>
                      Revenu
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Grid>

              {/* Montant */}
              <Grid item xs={12} md={6}>
                <AmountInput
                  value={formData.amount}
                  onChange={(value) => handleFieldChange("amount", value)}
                  currency={formData.currency}
                  onCurrencyChange={(currency) => handleFieldChange("currency", currency)}
                  label="Montant"
                  showCurrencySwitch={true}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  fullWidth
                />
              </Grid>

              {/* Compte */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  label="Compte"
                  value={formData.account}
                  onChange={(e) => handleFieldChange("account", e.target.value)}
                  error={!!errors.account}
                  helperText={errors.account}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="">Sélectionner un compte</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.bank}) - {account.balance?.toLocaleString()} {account.currency}
                    </option>
                  ))}
                </MDInput>
              </Grid>

              {/* Catégorie */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  label="Catégorie"
                  value={formData.category}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  error={!!errors.category}
                  helperText={errors.category}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </MDInput>
              </Grid>

              {/* Sous-catégorie */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={getSubcategories(formData.category)}
                  value={formData.subcategory}
                  onChange={(event, newValue) => handleFieldChange("subcategory", newValue || "")}
                  freeSolo
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      label="Sous-catégorie"
                      placeholder="Optionnel ou personnalisé"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <MDInput
                  label="Description"
                  placeholder="Décrivez la transaction..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Date et méthode de paiement */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date de transaction"
                  value={formData.date}
                  onChange={(newValue) => handleFieldChange("date", newValue)}
                  renderInput={(params) => <MDInput {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  label="Méthode de paiement"
                  value={formData.paymentMethod}
                  onChange={(e) => handleFieldChange("paymentMethod", e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label}
                    </option>
                  ))}
                </MDInput>
              </Grid>

              {/* Upload reçu */}
              <Grid item xs={12}>
                <MDBox>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="receipt-upload"
                    type="file"
                    onChange={(e) => handleFileUpload("receipt", e.target.files)}
                  />
                  <label htmlFor="receipt-upload">
                    <MDButton
                      variant="outlined"
                      component="span"
                      startIcon={<Icon>camera_alt</Icon>}
                      fullWidth
                    >
                      {formData.receipt ? "Reçu ajouté" : "Ajouter reçu"}
                    </MDButton>
                  </label>
                </MDBox>
              </Grid>
            </Grid>
          )}

          {/* Onglet 2: Détails avancés */}
          {activeTab === 1 && showAdvanced && (
            <Grid container spacing={3}>
              {/* Localisation */}
              <Grid item xs={12} md={6}>
                <MDInput
                  label="Localisation"
                  placeholder="Où a eu lieu la transaction..."
                  value={formData.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <Icon sx={{ mr: 1 }}>location_on</Icon>,
                  }}
                />
              </Grid>

              {/* Tags émotionnels */}
              {showEmotionalTags && (
                <Grid item xs={12}>
                  <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
                    Comment vous sentez-vous par rapport à cette dépense ?
                  </MDTypography>
                  <MDBox display="flex" gap={1} flexWrap="wrap">
                    {EMOTIONAL_TAGS.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.label}
                        onClick={() => handleFieldChange("emotionalTag", tag.id)}
                        color={formData.emotionalTag === tag.id ? tag.color : "default"}
                        variant={formData.emotionalTag === tag.id ? "filled" : "outlined"}
                        clickable
                      />
                    ))}
                  </MDBox>
                </Grid>
              )}

              {/* Tags personnalisés */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={["urgent", "planifié", "surprise", "cadeau", "business"]}
                  value={formData.tags}
                  onChange={(event, newValue) => handleFieldChange("tags", newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      label="Tags personnalisés"
                      placeholder="Ajouter des tags..."
                    />
                  )}
                />
              </Grid>

              {/* Notes supplémentaires */}
              <Grid item xs={12}>
                <MDInput
                  label="Notes supplémentaires"
                  placeholder="Informations additionnelles..."
                  value={formData.notes}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>

              {/* Fichiers joints */}
              <Grid item xs={12}>
                <MDBox>
                  <input
                    accept="*/*"
                    style={{ display: "none" }}
                    id="attachments-upload"
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload("attachments", e.target.files)}
                  />
                  <label htmlFor="attachments-upload">
                    <MDButton
                      variant="outlined"
                      component="span"
                      startIcon={<Icon>attach_file</Icon>}
                      fullWidth
                    >
                      Ajouter fichiers ({formData.attachments.length})
                    </MDButton>
                  </label>
                </MDBox>
              </Grid>
            </Grid>
          )}

          {/* Onglet 3: Récurrence */}
          {activeTab === 2 && showRecurring && (
            <Grid container spacing={3}>
              {/* Active récurrence */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRecurring}
                      onChange={(e) => handleFieldChange("isRecurring", e.target.checked)}
                    />
                  }
                  label="Transaction récurrente"
                />
              </Grid>

              {formData.isRecurring && (
                <>
                  {/* Type de récurrence */}
                  <Grid item xs={12} md={6}>
                    <MDInput
                      select
                      label="Fréquence"
                      value={formData.recurrenceType}
                      onChange={(e) => handleFieldChange("recurrenceType", e.target.value)}
                      error={!!errors.recurrenceType}
                      helperText={errors.recurrenceType}
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      {RECURRENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </MDInput>
                  </Grid>

                  {/* Date de fin */}
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Date de fin (optionnel)"
                      value={formData.recurrenceEndDate}
                      onChange={(newValue) => handleFieldChange("recurrenceEndDate", newValue)}
                      renderInput={(params) => <MDInput {...params} fullWidth />}
                    />
                  </Grid>

                  {/* Prévisualisation */}
                  <Grid item xs={12}>
                    <MDBox p={2} bgcolor="info.50" borderRadius={2}>
                      <MDTypography variant="button" fontWeight="medium" color="info.main" mb={1} display="block">
                        Prévisualisation récurrence
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        Cette transaction sera automatiquement créée chaque{" "}
                        {formData.recurrenceType === "daily" ? "jour" :
                         formData.recurrenceType === "weekly" ? "semaine" :
                         formData.recurrenceType === "monthly" ? "mois" : "année"}
                        {formData.recurrenceEndDate && ` jusqu'au ${formData.recurrenceEndDate.toLocaleDateString()}`}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </>
              )}
            </Grid>
          )}

          {/* Onglet 4: Partage */}
          {activeTab === 3 && showSplitTransaction && (
            <Grid container spacing={3}>
              {/* Active split */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isSplit}
                      onChange={(e) => handleFieldChange("isSplit", e.target.checked)}
                    />
                  }
                  label="Partager cette transaction"
                />
              </Grid>

              {formData.isSplit && (
                <>
                  {/* Personnes à partager */}
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={["Marie", "Jean", "Pierre", "Sophie"]} // TODO: Remplacer par vraie liste contacts
                      value={formData.splitWith}
                      onChange={(event, newValue) => handleFieldChange("splitWith", newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            label={option}
                            avatar={<Icon>person</Icon>}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <MDInput
                          {...params}
                          label="Partager avec"
                          placeholder="Ajouter des personnes..."
                          error={!!errors.splitWith}
                          helperText={errors.splitWith}
                        />
                      )}
                    />
                  </Grid>

                  {/* Calcul automatique */}
                  {formData.splitWith.length > 0 && (
                    <Grid item xs={12}>
                      <MDBox p={2} bgcolor="success.50" borderRadius={2}>
                        <MDTypography variant="button" fontWeight="medium" color="success.main" mb={1} display="block">
                          Répartition automatique
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          Montant par personne: {(parseFloat(formData.amount || 0) / (formData.splitWith.length + 1)).toLocaleString()} {formData.currency}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          ({formData.splitWith.length + 1} personnes au total)
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          )}

          {/* Actions */}
          <MDBox mt={4} display="flex" justifyContent="space-between">
            <MDButton
              variant="text"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </MDButton>

            <MDBox display="flex" gap={2}>
              {activeTab > 0 && (
                <MDButton
                  variant="outlined"
                  onClick={() => setActiveTab(activeTab - 1)}
                  disabled={loading}
                >
                  Précédent
                </MDButton>
              )}
              
              {activeTab < 3 ? (
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => setActiveTab(activeTab + 1)}
                  disabled={loading}
                >
                  Suivant
                </MDButton>
              ) : (
                <MDButton
                  type="submit"
                  variant="gradient"
                  color={formData.type === "expense" ? "error" : "success"}
                  disabled={loading}
                  startIcon={loading ? <Icon>hourglass_empty</Icon> : <Icon>save</Icon>}
                >
                  {loading ? "Sauvegarde..." : isEditing ? "Mettre à jour" : "Créer Transaction"}
                </MDButton>
              )}
            </MDBox>
          </MDBox>

          {/* Erreur globale */}
          {errors.submit && (
            <MDBox mt={2}>
              <MDTypography variant="caption" color="error">
                {errors.submit}
              </MDTypography>
            </MDBox>
          )}
        </form>
      </MDBox>
    </Card>
  );
}

// Props par défaut
TransactionForm.defaultProps = {
  transaction: null,
  accounts: [],
  categories: QUICK_CATEGORIES,
  isEditing: false,
  showAdvanced: true,
  showEmotionalTags: true,
  showRecurring: true,
  showSplitTransaction: true,
  onSubmit: () => {},
  onCancel: () => {},
};

// Validation des props
TransactionForm.propTypes = {
  transaction: PropTypes.object,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    bank: PropTypes.string,
    balance: PropTypes.number,
    currency: PropTypes.string,
  })),
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
  })),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  isEditing: PropTypes.bool,
  showAdvanced: PropTypes.bool,
  showEmotionalTags: PropTypes.bool,
  showRecurring: PropTypes.bool,
  showSplitTransaction: PropTypes.bool,
};

export default TransactionForm;

// Export des utilitaires
export { RECURRENCE_OPTIONS, PAYMENT_METHODS, EMOTIONAL_TAGS };