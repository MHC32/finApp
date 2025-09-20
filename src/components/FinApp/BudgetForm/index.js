// src/components/FinApp/BudgetForm/index.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// @mui icons
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// FinApp components
import AmountInput from 'components/FinApp/AmountInput';
import CurrencySelector from 'components/FinApp/CurrencySelector';

// Catégories de budget avec données haïtiennes typiques
const BUDGET_CATEGORIES = [
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: RestaurantIcon,
    color: 'success',
    description: 'Courses, restaurants, street food',
    avgPercentage: 35,
    haitiSuggestion: 'Inclut marché, ti kob manje, restaurant',
    subcategories: ['Courses', 'Restaurant', 'Ti kob manje', 'Boissons']
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: DirectionsCarIcon,
    color: 'info',
    description: 'Tap-tap, taxi, carburant, entretien',
    avgPercentage: 20,
    haitiSuggestion: 'Transport quotidien, carburant, maintenance',
    subcategories: ['Tap-tap', 'Taxi', 'Carburant', 'Entretien véhicule']
  },
  {
    id: 'logement',
    name: 'Logement',
    icon: HomeIcon,
    color: 'primary',
    description: 'Loyer, électricité, eau, internet',
    avgPercentage: 25,
    haitiSuggestion: 'Kay, courant, dlo, internet',
    subcategories: ['Loyer', 'EDH (électricité)', 'CAMEP (eau)', 'Internet', 'Réparations']
  },
  {
    id: 'sante',
    name: 'Santé',
    icon: MedicalServicesIcon,
    color: 'error',
    description: 'Médecin, médicaments, assurance',
    avgPercentage: 8,
    haitiSuggestion: 'Doktè, medikaman, laboratoire',
    subcategories: ['Consultation', 'Médicaments', 'Laboratoire', 'Urgences']
  },
  {
    id: 'education',
    name: 'Éducation',
    icon: SchoolIcon,
    color: 'warning',
    description: 'École, formation, livres',
    avgPercentage: 5,
    haitiSuggestion: 'Lekòl, fòmasyon, liv',
    subcategories: ['Frais de scolarité', 'Fournitures', 'Formation', 'Livres']
  },
  {
    id: 'loisirs',
    name: 'Loisirs',
    icon: SportsEsportsIcon,
    color: 'secondary',
    description: 'Sorties, sports, divertissement',
    avgPercentage: 5,
    haitiSuggestion: 'Soti, jwèt, mizik, sinema',
    subcategories: ['Sorties', 'Sports', 'Musique', 'Cinéma']
  },
  {
    id: 'factures',
    name: 'Factures',
    icon: ReceiptIcon,
    color: 'dark',
    description: 'Téléphone, abonnements',
    avgPercentage: 2,
    haitiSuggestion: 'Telefòn, abònman',
    subcategories: ['Téléphone', 'Abonnements', 'Services']
  }
];

// Modèles de budget pré-définis
const BUDGET_TEMPLATES = [
  {
    id: 'student',
    name: 'Étudiant',
    description: 'Budget pour étudiant universitaire',
    targetIncome: 15000,
    categories: {
      alimentation: 5000,
      transport: 3000,
      education: 4000,
      loisirs: 2000,
      factures: 1000
    }
  },
  {
    id: 'young_professional',
    name: 'Jeune professionnel',
    description: 'Premier emploi, vie autonome',
    targetIncome: 35000,
    categories: {
      alimentation: 12000,
      transport: 8000,
      logement: 10000,
      sante: 2000,
      loisirs: 2000,
      factures: 1000
    }
  },
  {
    id: 'family',
    name: 'Famille',
    description: 'Couple avec enfants',
    targetIncome: 60000,
    categories: {
      alimentation: 20000,
      transport: 12000,
      logement: 18000,
      sante: 5000,
      education: 3000,
      loisirs: 2000
    }
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Revenus variables, besoin flexibilité',
    targetIncome: 50000,
    categories: {
      alimentation: 15000,
      transport: 10000,
      logement: 15000,
      sante: 3000,
      education: 2000,
      loisirs: 3000,
      factures: 2000
    }
  }
];

const STEPS = [
  { label: 'Informations générales', description: 'Nom, période, revenus' },
  { label: 'Catégories et montants', description: 'Répartition par catégorie' },
  { label: 'Objectifs et alertes', description: 'Configuration avancée' },
  { label: 'Vérification', description: 'Résumé et validation' }
];

function BudgetForm({
  budget = null,
  onSubmit,
  onCancel,
  accounts = [],
  isEditing = false,
  showTemplates = true,
  showAdvancedSettings = true,
  ...other
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    expectedIncome: 0,
    currency: 'HTG',
    includeAllAccounts: true,
    selectedAccounts: [],
    categories: {},
    customCategories: [],
    savingsGoal: 0,
    savingsPercentage: 10,
    emergencyFund: 0,
    enableAlerts: true,
    alertThreshold: 80,
    weeklyReports: true,
    monthlyAnalysis: true,
    autoAdjust: false,
    rolloverUnused: true,
    strictMode: false,
    notes: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget && isEditing) {
      setFormData({
        ...formData,
        ...budget,
        startDate: budget.startDate?.split('T')[0] || formData.startDate,
        endDate: budget.endDate?.split('T')[0] || ''
      });
    }
  }, [budget, isEditing]);

  useEffect(() => {
    if (formData.startDate && formData.period) {
      const start = new Date(formData.startDate);
      let end = new Date(start);
      
      switch (formData.period) {
        case 'weekly':
          end.setDate(start.getDate() + 7);
          break;
        case 'monthly':
          end.setMonth(start.getMonth() + 1);
          break;
        case 'yearly':
          end.setFullYear(start.getFullYear() + 1);
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        endDate: end.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.period]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCategoryAmountChange = (categoryId, amount) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: parseFloat(amount) || 0
      }
    }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      name: `Budget ${template.name}`,
      expectedIncome: template.targetIncome,
      categories: { ...template.categories }
    }));
  };

  const getTotalBudgeted = () => {
    return Object.values(formData.categories).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const getRemainingBudget = () => {
    return formData.expectedIncome - getTotalBudgeted() - formData.savingsGoal;
  };

  const getBudgetHealth = () => {
    const total = getTotalBudgeted();
    const income = formData.expectedIncome;
    
    if (total > income) return { status: 'error', message: 'Budget dépasse les revenus' };
    if (total > income * 0.9) return { status: 'warning', message: 'Budget serré, peu de marge' };
    if (total < income * 0.5) return { status: 'info', message: 'Budget conservateur' };
    return { status: 'success', message: 'Budget équilibré' };
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0:
        if (!formData.name.trim()) {
          newErrors.name = 'Nom du budget requis';
        }
        if (!formData.expectedIncome || formData.expectedIncome <= 0) {
          newErrors.expectedIncome = 'Revenus attendus requis';
        }
        break;
        
      case 1:
        const totalBudgeted = getTotalBudgeted();
        if (totalBudgeted === 0) {
          newErrors.categories = 'Au moins une catégorie doit avoir un montant';
        }
        if (totalBudgeted > formData.expectedIncome) {
          newErrors.categories = 'Le total ne peut pas dépasser les revenus';
        }
        break;
        
      case 2:
        if (formData.savingsGoal > formData.expectedIncome) {
          newErrors.savingsGoal = 'Objectif d\'épargne trop élevé';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      const budgetData = {
        ...formData,
        id: budget?.id || `budget_${Date.now()}`,
        totalBudgeted: getTotalBudgeted(),
        remainingBudget: getRemainingBudget(),
        healthStatus: getBudgetHealth().status,
        createdAt: budget?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(budgetData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde du budget' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <MDBox>
            {showTemplates && !isEditing && (
              <MDBox mb={4}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Modèles de budget
                </MDTypography>
                <Grid container spacing={2}>
                  {BUDGET_TEMPLATES.map((template) => (
                    <Grid item xs={12} sm={6} md={3} key={template.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: 2,
                          borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'grey.200',
                          bgcolor: selectedTemplate?.id === template.id ? 'primary.50' : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50'
                          }
                        }}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent>
                          <MDTypography variant="h6" fontWeight="medium">
                            {template.name}
                          </MDTypography>
                          <MDTypography variant="body2" color="text" mb={1}>
                            {template.description}
                          </MDTypography>
                          <Chip
                            label={`${template.targetIncome.toLocaleString()} HTG/mois`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {selectedTemplate && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Modèle sélectionné: <strong>{selectedTemplate.name}</strong>. 
                    Vous pouvez modifier les valeurs selon vos besoins.
                  </Alert>
                )}
                
                <Divider sx={{ my: 3 }}>
                  <Chip label="ou créez votre budget personnalisé" size="small" />
                </Divider>
              </MDBox>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDInput
                  label="Nom du budget"
                  placeholder="Ex: Budget Famille Septembre 2024"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>Période</FormLabel>
                  <RadioGroup
                    value={formData.period}
                    onChange={(e) => handleFieldChange('period', e.target.value)}
                    row
                  >
                    <FormControlLabel value="weekly" control={<Radio />} label="Hebdomadaire" />
                    <FormControlLabel value="monthly" control={<Radio />} label="Mensuel" />
                    <FormControlLabel value="yearly" control={<Radio />} label="Annuel" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  label="Description (optionnel)"
                  placeholder="Objectifs et contexte de ce budget..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MDInput
                  label="Date de début"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MDInput
                  label="Date de fin"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled
                  helperText="Calculée automatiquement selon la période"
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <AmountInput
                  label="Revenus attendus"
                  value={formData.expectedIncome}
                  onChange={(value) => handleFieldChange('expectedIncome', value)}
                  currency={formData.currency}
                  error={!!errors.expectedIncome}
                  helperText={errors.expectedIncome || 'Total des revenus pour cette période'}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currency) => handleFieldChange('currency', currency)}
                  label="Devise"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.includeAllAccounts}
                      onChange={(e) => handleFieldChange('includeAllAccounts', e.target.checked)}
                    />
                  }
                  label="Inclure tous les comptes dans ce budget"
                />
                <MDTypography variant="caption" color="text" display="block">
                  Les transactions de ces comptes seront comparées au budget
                </MDTypography>
              </Grid>
            </Grid>
          </MDBox>
        );

      case 1:
        const budgetHealth = getBudgetHealth();
        
        return (
          <MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Répartition par catégorie
              </MDTypography>
              
              <MDBox textAlign="right">
                <MDTypography variant="body2" color="text">
                  Total budgété: {getTotalBudgeted().toLocaleString()} {formData.currency}
                </MDTypography>
                <MDTypography variant="body2" color={getRemainingBudget() >= 0 ? 'success' : 'error'}>
                  Restant: {getRemainingBudget().toLocaleString()} {formData.currency}
                </MDTypography>
              </MDBox>
            </MDBox>

            <MDBox mb={3}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <MDTypography variant="body2">
                  Utilisation du budget
                </MDTypography>
                <MDTypography variant="body2">
                  {((getTotalBudgeted() / formData.expectedIncome) * 100).toFixed(1)}%
                </MDTypography>
              </MDBox>
              <LinearProgress
                variant="determinate"
                value={Math.min((getTotalBudgeted() / formData.expectedIncome) * 100, 100)}
                color={budgetHealth.status === 'error' ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Alert severity={budgetHealth.status} sx={{ mt: 2 }}>
                {budgetHealth.message}
              </Alert>
            </MDBox>

            <Grid container spacing={3}>
              {BUDGET_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const amount = formData.categories[category.id] || 0;
                const percentage = formData.expectedIncome > 0 ? 
                  (amount / formData.expectedIncome) * 100 : 0;
                
                return (
                  <Grid item xs={12} key={category.id}>
                    <Card>
                      <CardContent>
                        <MDBox display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: `${category.color}.main`, mr: 2 }}>
                            <IconComponent />
                          </Avatar>
                          <MDBox flex={1}>
                            <MDTypography variant="h6" fontWeight="medium">
                              {category.name}
                            </MDTypography>
                            <MDTypography variant="body2" color="text">
                              {category.haitiSuggestion}
                            </MDTypography>
                          </MDBox>
                          <Chip
                            label={`${percentage.toFixed(1)}%`}
                            size="small"
                            color={category.color}
                            variant="outlined"
                          />
                        </MDBox>

                        <MDBox display="flex" alignItems="center" gap={2}>
                          <MDBox flex={1}>
                            <AmountInput
                              label={`Budget ${category.name}`}
                              value={amount}
                              onChange={(value) => handleCategoryAmountChange(category.id, value)}
                              currency={formData.currency}
                              size="small"
                            />
                          </MDBox>
                          
                          <MDBox minWidth={120}>
                            <MDTypography variant="caption" color="text">
                              Suggéré: {category.avgPercentage}%
                            </MDTypography>
                            <MDTypography variant="caption" color="text" display="block">
                              ({((formData.expectedIncome * category.avgPercentage) / 100).toLocaleString()} {formData.currency})
                            </MDTypography>
                          </MDBox>
                          
                          <Tooltip title="Utiliser la suggestion">
                            <IconButton
                              size="small"
                              onClick={() => handleCategoryAmountChange(
                                category.id, 
                                (formData.expectedIncome * category.avgPercentage) / 100
                              )}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </MDBox>

                        {amount > 0 && (
                          <Accordion sx={{ mt: 2, boxShadow: 'none' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <MDTypography variant="caption">
                                Voir les sous-catégories suggérées
                              </MDTypography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <MDBox display="flex" flexWrap="wrap" gap={1}>
                                {category.subcategories.map((sub, index) => (
                                  <Chip
                                    key={index}
                                    label={sub}
                                    size="small"
                                    variant="outlined"
                                    color={category.color}
                                  />
                                ))}
                              </MDBox>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {errors.categories && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.categories}
              </Alert>
            )}
          </MDBox>
        );

      case 2:
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Objectifs et notifications
            </MDTypography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Objectif d'épargne
                    </MDTypography>
                    
                    <MDBox mb={3}>
                      <MDTypography variant="body2" color="text" mb={1}>
                        Pourcentage à épargner: {formData.savingsPercentage}%
                      </MDTypography>
                      <Slider
                        value={formData.savingsPercentage}
                        onChange={(e, value) => {
                          handleFieldChange('savingsPercentage', value);
                          handleFieldChange('savingsGoal', (formData.expectedIncome * value) / 100);
                        }}
                        min={0}
                        max={50}
                        step={1}
                        marks={[
                          { value: 10, label: '10%' },
                          { value: 20, label: '20%' },
                          { value: 30, label: '30%' }
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                      />
                    </MDBox>

                    <AmountInput
                      label="Montant à épargner"
                      value={formData.savingsGoal}
                      onChange={(value) => {
                        handleFieldChange('savingsGoal', value);
                        handleFieldChange('savingsPercentage', 
                          formData.expectedIncome > 0 ? (value / formData.expectedIncome) * 100 : 0
                        );
                      }}
                      currency={formData.currency}
                      error={!!errors.savingsGoal}
                      helperText={errors.savingsGoal || 'Montant que vous souhaitez économiser'}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Alertes et notifications
                    </MDTypography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.enableAlerts}
                              onChange={(e) => handleFieldChange('enableAlerts', e.target.checked)}
                            />
                          }
                          label="Activer les alertes de budget"
                        />
                        <MDTypography variant="caption" color="text" display="block">
                          Notifications quand vous approchez la limite
                        </MDTypography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MDBox>
                          <MDTypography variant="body2" mb={1}>
                            Seuil d'alerte: {formData.alertThreshold}%
                          </MDTypography>
                          <Slider
                            value={formData.alertThreshold}
                            onChange={(e, value) => handleFieldChange('alertThreshold', value)}
                            min={50}
                            max={100}
                            step={5}
                            disabled={!formData.enableAlerts}
                            marks={[
                              { value: 75, label: '75%' },
                              { value: 90, label: '90%' }
                            ]}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}%`}
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.weeklyReports}
                              onChange={(e) => handleFieldChange('weeklyReports', e.target.checked)}
                            />
                          }
                          label="Rapports hebdomadaires"
                        />
                        <MDTypography variant="caption" color="text" display="block">
                          Résumé de vos dépenses chaque semaine
                        </MDTypography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.monthlyAnalysis}
                              onChange={(e) => handleFieldChange('monthlyAnalysis', e.target.checked)}
                            />
                          }
                          label="Analyse mensuelle"
                        />
                        <MDTypography variant="caption" color="text" display="block">
                          Analyse détaillée et conseils d'amélioration
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {showAdvancedSettings && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <MDTypography variant="h6" fontWeight="medium" mb={2}>
                        Options avancées
                      </MDTypography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.autoAdjust}
                                onChange={(e) => handleFieldChange('autoAdjust', e.target.checked)}
                              />
                            }
                            label="Ajustement automatique"
                          />
                          <MDTypography variant="caption" color="text" display="block">
                            Ajuster le budget selon vos habitudes
                          </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.rolloverUnused}
                                onChange={(e) => handleFieldChange('rolloverUnused', e.target.checked)}
                              />
                            }
                            label="Reporter le non-utilisé"
                          />
                          <MDTypography variant="caption" color="text" display="block">
                            Reporter l'argent non dépensé au mois suivant
                          </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.strictMode}
                                onChange={(e) => handleFieldChange('strictMode', e.target.checked)}
                              />
                            }
                            label="Mode strict"
                          />
                          <MDTypography variant="caption" color="text" display="block">
                            Bloquer les dépenses au-delà du budget
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <MDInput
                  label="Notes additionnelles"
                  placeholder="Objectifs particuliers, contexte, rappels..."
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </MDBox>
        );

      case 3:
        const totalBudgeted = getTotalBudgeted();
        const remaining = getRemainingBudget();
        const health = getBudgetHealth();
        
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Résumé du budget
            </MDTypography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="h5" fontWeight="medium">
                        {formData.name}
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {formData.period === 'weekly' ? 'Hebdomadaire' : 
                         formData.period === 'monthly' ? 'Mensuel' : 'Annuel'} • 
                        {new Date(formData.startDate).toLocaleDateString('fr-FR')} - 
                        {new Date(formData.endDate).toLocaleDateString('fr-FR')}
                      </MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                      <MDTypography variant="body1" fontWeight="medium">
                        Revenus attendus: {formData.expectedIncome.toLocaleString()} {formData.currency}
                      </MDTypography>
                      <MDTypography variant="body1">
                        Total budgété: {totalBudgeted.toLocaleString()} {formData.currency}
                      </MDTypography>
                      <MDTypography variant="body1">
                        Épargne planifiée: {formData.savingsGoal.toLocaleString()} {formData.currency}
                      </MDTypography>
                      <MDTypography 
                        variant="body1" 
                        color={remaining >= 0 ? 'success.main' : 'error.main'}
                        fontWeight="medium"
                      >
                        Solde disponible: {remaining.toLocaleString()} {formData.currency}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox textAlign="center">
                      <MDTypography variant="h4" fontWeight="bold" color="primary.main">
                        {((totalBudgeted / formData.expectedIncome) * 100).toFixed(1)}%
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        du budget utilisé
                      </MDTypography>
                      
                      <MDBox mt={2}>
                        <Alert severity={health.status}>
                          {health.message}
                        </Alert>
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Répartition par catégorie
                </MDTypography>
                
                <Grid container spacing={2}>
                  {BUDGET_CATEGORIES.map((category) => {
                    const amount = formData.categories[category.id] || 0;
                    if (amount === 0) return null;
                    
                    const percentage = (amount / formData.expectedIncome) * 100;
                    const IconComponent = category.icon;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={category.id}>
                        <MDBox 
                          display="flex" 
                          alignItems="center" 
                          p={1.5} 
                          borderRadius={1}
                          bgcolor="grey.50"
                        >
                          <Avatar sx={{ bgcolor: `${category.color}.main`, mr: 2, width: 32, height: 32 }}>
                            <IconComponent sx={{ fontSize: 18 }} />
                          </Avatar>
                          <MDBox>
                            <MDTypography variant="body2" fontWeight="medium">
                              {category.name}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              {amount.toLocaleString()} {formData.currency} ({percentage.toFixed(1)}%)
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Configuration
                </MDTypography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDBox>
                      <MDTypography variant="body2" fontWeight="medium" mb={1}>
                        Notifications
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mb={0.5}>
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.enableAlerts ? 'success.main' : 'grey.400',
                            mr: 1,
                            fontSize: 16
                          }} 
                        />
                        <MDTypography variant="caption">
                          Alertes à {formData.alertThreshold}%
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" mb={0.5}>
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.weeklyReports ? 'success.main' : 'grey.400',
                            mr: 1,
                            fontSize: 16
                          }} 
                        />
                        <MDTypography variant="caption">
                          Rapports hebdomadaires
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center">
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.monthlyAnalysis ? 'success.main' : 'grey.400',
                            mr: 1,
                            fontSize: 16
                          }} 
                        />
                        <MDTypography variant="caption">
                          Analyse mensuelle
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox>
                      <MDTypography variant="body2" fontWeight="medium" mb={1}>
                        Options avancées
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mb={0.5}>
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.autoAdjust ? 'success.main' : 'grey.400',
                            mr: 1,
                            fontSize: 16
                          }} 
                        />
                        <MDTypography variant="caption">
                          Ajustement automatique
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" mb={0.5}>
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.rolloverUnused ? 'success.main' : 'grey.400',
                            mr: 1,
                            fontSize: 16
                          }} 
                        />
                        <MDTypography variant="caption">
                          Report non-utilisé
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center">
                        <WarningIcon 
                          sx={{ 
                            color: formData.strictMode ? 'warning.main' : 'grey.400',
                            mr: 1,
                            fontSize: 16
                          }} 
                        />
                        <MDTypography variant="caption">
                          Mode strict activé
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {remaining < 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Attention: Votre budget dépasse vos revenus de {Math.abs(remaining).toLocaleString()} {formData.currency}
                </MDTypography>
                <MDTypography variant="caption">
                  Ajustez les montants ou augmentez vos revenus attendus
                </MDTypography>
              </Alert>
            )}
          </MDBox>
        );

      default:
        return null;
    }
  };

  return (
    <MDBox {...other}>
      <Card>
        <CardContent>
          <MDBox mb={3}>
            <MDTypography variant="h5" fontWeight="medium">
              {isEditing ? 'Modifier le budget' : 'Créer un budget'}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {isEditing ? 'Ajustez les paramètres de votre budget' : 'Définissez vos objectifs financiers et suivez vos dépenses'}
            </MDTypography>
          </MDBox>

          <Stepper activeStep={activeStep} orientation="vertical">
            {STEPS.map((step, index) => (
              <Step key={index}>
                <StepLabel>
                  <MDTypography variant="h6" fontWeight="medium">
                    {step.label}
                  </MDTypography>
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  
                  <MDBox mt={3} display="flex" justifyContent="space-between">
                    <MDButton
                      onClick={index === 0 ? onCancel : handleBack}
                      disabled={loading}
                    >
                      {index === 0 ? 'Annuler' : 'Précédent'}
                    </MDButton>
                    
                    <MDButton
                      variant="contained"
                      onClick={index === STEPS.length - 1 ? handleSubmit : handleNext}
                      disabled={loading}
                    >
                      {index === STEPS.length - 1 ? 
                        (isEditing ? 'Mettre à jour' : 'Créer le budget') : 
                        'Suivant'
                      }
                    </MDButton>
                  </MDBox>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </CardContent>
      </Card>
    </MDBox>
  );
}

BudgetForm.propTypes = {
  budget: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  accounts: PropTypes.array,
  isEditing: PropTypes.bool,
  showTemplates: PropTypes.bool,
  showAdvancedSettings: PropTypes.bool,
};

export default BudgetForm;