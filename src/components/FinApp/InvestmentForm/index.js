// src/components/FinApp/InvestmentForm/index.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// @mui icons
import BusinessIcon from '@mui/icons-material/Business';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CalculateIcon from '@mui/icons-material/Calculate';
import DateRangeIcon from '@mui/icons-material/DateRange';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// FinApp components
import AmountInput from 'components/FinApp/AmountInput';
import CurrencySelector from 'components/FinApp/CurrencySelector';

// Types d'investissements populaires en Haïti
const INVESTMENT_TYPES = [
  {
    id: 'agriculture',
    name: 'Agriculture/Élevage',
    icon: AgricultureIcon,
    color: 'success',
    description: 'Élevage porcs, poules, culture',
    riskLevel: 'medium',
    avgROI: '15-25%',
    duration: '6-24 mois',
    examples: ['Élevage de porcs', 'Aviculture', 'Culture légumes', 'Aquaculture'],
    haitiSpecific: true
  },
  {
    id: 'commerce',
    name: 'Commerce/Business',
    icon: StorefrontIcon,
    color: 'primary',
    description: 'Boutique, restaurant, service',
    riskLevel: 'medium',
    avgROI: '20-40%',
    duration: '3-12 mois',
    examples: ['Boutique neighborhood', 'Restaurant', 'Service transport', 'Coiffure'],
    haitiSpecific: true
  },
  {
    id: 'immobilier',
    name: 'Immobilier',
    icon: HomeIcon,
    color: 'warning',
    description: 'Achat, construction, location',
    riskLevel: 'low',
    avgROI: '8-15%',
    duration: '12-60 mois',
    examples: ['Achat maison', 'Construction duplex', 'Location appartement', 'Terrain'],
    haitiSpecific: false
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: LocalShippingIcon,
    color: 'info',
    description: 'Véhicule, moto, tap-tap',
    riskLevel: 'medium',
    avgROI: '10-20%',
    duration: '6-36 mois',
    examples: ['Achat tap-tap', 'Moto taxi', 'Camion livraison', 'Voiture location'],
    haitiSpecific: true
  },
  {
    id: 'finance',
    name: 'Produits financiers',
    icon: AccountBalanceIcon,
    color: 'secondary',
    description: 'Épargne, obligations, actions',
    riskLevel: 'low',
    avgROI: '3-8%',
    duration: '12-60 mois',
    examples: ['Compte épargne', 'Obligations État', 'Actions BSEIHA', 'Coopérative'],
    haitiSpecific: false
  },
  {
    id: 'crypto',
    name: 'Cryptomonnaies',
    icon: CurrencyBitcoinIcon,
    color: 'error',
    description: 'Bitcoin, stablecoins',
    riskLevel: 'high',
    avgROI: '0-100%',
    duration: '1-60 mois',
    examples: ['Bitcoin', 'USDC', 'Trading', 'DeFi'],
    haitiSpecific: false
  }
];

// Niveaux de risque
const RISK_LEVELS = {
  low: { label: 'Faible', color: 'success', description: 'Risque minimal, rendement stable' },
  medium: { label: 'Moyen', color: 'warning', description: 'Équilibre risque/rendement' },
  high: { label: 'Élevé', color: 'error', description: 'Risque important, rendement variable' }
};

const STEPS = [
  { label: 'Type d\'investissement', description: 'Choisissez votre domaine d\'investissement' },
  { label: 'Détails du projet', description: 'Informations et montants' },
  { label: 'Partenaires et financement', description: 'Co-investisseurs et structure' },
  { label: 'Projections et suivi', description: 'Objectifs et métriques' }
];

function InvestmentForm({
  investment = null, // Pour modification
  onSubmit,
  onCancel,
  accounts = [],
  existingInvestments = [],
  contacts = [],
  isEditing = false,
  showAdvancedProjections = true,
  ...other
}) {
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    // Type et informations de base
    type: '',
    name: '',
    description: '',
    
    // Montants et financement
    totalInvestment: 0,
    personalContribution: 0,
    currency: 'HTG',
    fundingSource: 'personal', // 'personal', 'loan', 'mixed'
    loanAmount: 0,
    loanInterestRate: 0,
    
    // Dates
    startDate: new Date().toISOString().split('T')[0],
    expectedDuration: 12, // en mois
    
    // Partenaires
    hasPartners: false,
    partners: [], // [{ name, email, contribution, percentage }]
    
    // Projections
    expectedROI: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    breakEvenMonth: 6,
    
    // Suivi
    trackingMetrics: [],
    reviewFrequency: 'monthly',
    enableNotifications: true,
    
    // Risques
    riskAssessment: 'medium',
    contingencyPlan: '',
    
    // Métadonnées
    notes: '',
    tags: [],
    documents: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Données dérivées
  const selectedType = INVESTMENT_TYPES.find(type => type.id === formData.type);
  const totalWithPartners = formData.personalContribution + 
    formData.partners.reduce((sum, partner) => sum + (partner.contribution || 0), 0);
  const personalPercentage = totalWithPartners > 0 ? 
    (formData.personalContribution / totalWithPartners) * 100 : 100;

  // Initialiser avec investissement existant pour modification
  useEffect(() => {
    if (investment && isEditing) {
      setFormData({
        ...formData,
        ...investment,
        startDate: investment.startDate?.split('T')[0] || formData.startDate
      });
    }
  }, [investment, isEditing]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePartnerChange = (index, field, value) => {
    const updatedPartners = [...formData.partners];
    updatedPartners[index] = { ...updatedPartners[index], [field]: value };
    
    // Recalculer les pourcentages
    const totalContribution = formData.personalContribution + 
      updatedPartners.reduce((sum, partner) => sum + (partner.contribution || 0), 0);
    
    updatedPartners.forEach(partner => {
      partner.percentage = totalContribution > 0 ? 
        ((partner.contribution || 0) / totalContribution) * 100 : 0;
    });
    
    setFormData(prev => ({ ...prev, partners: updatedPartners }));
  };

  const addPartner = () => {
    setFormData(prev => ({
      ...prev,
      partners: [...prev.partners, { 
        name: '', 
        email: '', 
        contribution: 0, 
        percentage: 0 
      }]
    }));
  };

  const removePartner = (index) => {
    const updatedPartners = formData.partners.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, partners: updatedPartners }));
  };

  const calculateProjections = () => {
    const monthlyProfit = formData.monthlyRevenue - formData.monthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const roi = totalWithPartners > 0 ? (annualProfit / totalWithPartners) * 100 : 0;
    const breakEven = monthlyProfit > 0 ? Math.ceil(totalWithPartners / monthlyProfit) : 0;
    
    return { monthlyProfit, annualProfit, roi, breakEven };
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Type d'investissement
        if (!formData.type) {
          newErrors.type = 'Sélectionnez un type d\'investissement';
        }
        if (!formData.name.trim()) {
          newErrors.name = 'Nom du projet requis';
        }
        break;
        
      case 1: // Détails du projet
        if (!formData.personalContribution || formData.personalContribution <= 0) {
          newErrors.personalContribution = 'Votre contribution est requise';
        }
        if (formData.fundingSource === 'loan' || formData.fundingSource === 'mixed') {
          if (!formData.loanAmount || formData.loanAmount <= 0) {
            newErrors.loanAmount = 'Montant du prêt requis';
          }
          if (!formData.loanInterestRate || formData.loanInterestRate < 0) {
            newErrors.loanInterestRate = 'Taux d\'intérêt requis';
          }
        }
        break;
        
      case 2: // Partenaires
        if (formData.hasPartners && formData.partners.length === 0) {
          newErrors.partners = 'Ajoutez au moins un partenaire';
        }
        formData.partners.forEach((partner, index) => {
          if (!partner.name.trim()) {
            newErrors[`partner_${index}_name`] = 'Nom du partenaire requis';
          }
          if (!partner.contribution || partner.contribution <= 0) {
            newErrors[`partner_${index}_contribution`] = 'Contribution requise';
          }
        });
        break;
        
      case 3: // Projections
        if (formData.expectedROI < 0) {
          newErrors.expectedROI = 'ROI ne peut pas être négatif';
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
      const projections = calculateProjections();
      
      const investmentData = {
        ...formData,
        id: investment?.id || `investment_${Date.now()}`,
        totalInvestment: totalWithPartners,
        personalPercentage,
        projections,
        riskLevel: selectedType?.riskLevel,
        createdAt: investment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(investmentData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde de l\'investissement' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Type d'investissement
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Quel type d'investissement voulez-vous créer ?
            </MDTypography>

            <Grid container spacing={2}>
              {INVESTMENT_TYPES.map((type) => {
                const IconComponent = type.icon;
                const riskConfig = RISK_LEVELS[type.riskLevel];
                
                return (
                  <Grid item xs={12} md={6} key={type.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: formData.type === type.id ? `${type.color}.main` : 'grey.200',
                        bgcolor: formData.type === type.id ? `${type.color}.50` : 'transparent',
                        position: 'relative',
                        '&:hover': {
                          borderColor: `${type.color}.main`,
                          bgcolor: `${type.color}.50`
                        }
                      }}
                      onClick={() => handleFieldChange('type', type.id)}
                    >
                      {type.haitiSpecific && (
                        <Chip
                          label="Populaire en Haïti"
                          color="success"
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        />
                      )}
                      <CardContent>
                        <MDBox display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: `${type.color}.main`, mr: 2, width: 48, height: 48 }}>
                            <IconComponent />
                          </Avatar>
                          <MDBox>
                            <MDTypography variant="h6" fontWeight="medium">
                              {type.name}
                            </MDTypography>
                            <MDTypography variant="body2" color="text">
                              {type.description}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <MDBox>
                            <MDTypography variant="caption" color="text">
                              ROI moyen: <strong>{type.avgROI}</strong>
                            </MDTypography>
                            <MDTypography variant="caption" color="text" display="block">
                              Durée: <strong>{type.duration}</strong>
                            </MDTypography>
                          </MDBox>
                          <Chip
                            label={`Risque ${riskConfig.label}`}
                            size="small"
                            color={riskConfig.color}
                            variant="outlined"
                          />
                        </MDBox>

                        <MDBox>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            Exemples:
                          </MDTypography>
                          <MDBox display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                            {type.examples.slice(0, 3).map((example, index) => (
                              <Chip
                                key={index}
                                label={example}
                                size="small"
                                variant="outlined"
                                color={type.color}
                              />
                            ))}
                          </MDBox>
                        </MDBox>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {formData.type && (
              <MDBox mt={3}>
                <MDInput
                  label="Nom du projet"
                  placeholder={`Ex: ${selectedType?.examples[0]} - ${new Date().getFullYear()}`}
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
                
                <MDInput
                  label="Description du projet"
                  placeholder="Décrivez votre projet d'investissement..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              </MDBox>
            )}
          </MDBox>
        );

      case 1: // Détails du projet
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Financement et montants
            </MDTypography>

            <Grid container spacing={3}>
              {/* Votre contribution */}
              <Grid item xs={12} md={6}>
                <AmountInput
                  label="Votre contribution personnelle"
                  value={formData.personalContribution}
                  onChange={(value) => handleFieldChange('personalContribution', value)}
                  currency={formData.currency}
                  error={!!errors.personalContribution}
                  helperText={errors.personalContribution || 'Montant que vous investissez'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currency) => handleFieldChange('currency', currency)}
                  label="Devise"
                  fullWidth
                />
              </Grid>

              {/* Source de financement */}
              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Source de financement</FormLabel>
                  <RadioGroup
                    value={formData.fundingSource}
                    onChange={(e) => handleFieldChange('fundingSource', e.target.value)}
                  >
                    <FormControlLabel
                      value="personal"
                      control={<Radio />}
                      label="Financement personnel uniquement"
                    />
                    <FormControlLabel
                      value="loan"
                      control={<Radio />}
                      label="Prêt bancaire/microcrédit"
                    />
                    <FormControlLabel
                      value="mixed"
                      control={<Radio />}
                      label="Mixte (personnel + prêt)"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Détails du prêt */}
              {(formData.fundingSource === 'loan' || formData.fundingSource === 'mixed') && (
                <>
                  <Grid item xs={12} md={6}>
                    <AmountInput
                      label="Montant du prêt"
                      value={formData.loanAmount}
                      onChange={(value) => handleFieldChange('loanAmount', value)}
                      currency={formData.currency}
                      error={!!errors.loanAmount}
                      helperText={errors.loanAmount}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDInput
                      label="Taux d'intérêt annuel (%)"
                      type="number"
                      value={formData.loanInterestRate}
                      onChange={(e) => handleFieldChange('loanInterestRate', parseFloat(e.target.value))}
                      error={!!errors.loanInterestRate}
                      helperText={errors.loanInterestRate}
                      fullWidth
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </Grid>
                </>
              )}

              {/* Dates */}
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
                  label="Durée prévue (mois)"
                  type="number"
                  value={formData.expectedDuration}
                  onChange={(e) => handleFieldChange('expectedDuration', parseInt(e.target.value))}
                  fullWidth
                  inputProps={{ min: 1, max: 120 }}
                  helperText="Durée estimée du projet"
                />
              </Grid>

              {/* Résumé financement */}
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Résumé du financement
                    </MDTypography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <MDTypography variant="body2" color="text">
                          Contribution personnelle
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium">
                          {formData.personalContribution.toLocaleString()} {formData.currency}
                        </MDTypography>
                      </Grid>
                      
                      {formData.loanAmount > 0 && (
                        <Grid item xs={6} md={3}>
                          <MDTypography variant="body2" color="text">
                            Montant du prêt
                          </MDTypography>
                          <MDTypography variant="h6" fontWeight="medium" color="warning.main">
                            {formData.loanAmount.toLocaleString()} {formData.currency}
                          </MDTypography>
                        </Grid>
                      )}
                      
                      <Grid item xs={6} md={3}>
                        <MDTypography variant="body2" color="text">
                          Investissement total
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium" color="primary.main">
                          {(formData.personalContribution + formData.loanAmount).toLocaleString()} {formData.currency}
                        </MDTypography>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <MDTypography variant="body2" color="text">
                          Fin prévue
                        </MDTypography>
                        <MDTypography variant="body1" fontWeight="medium">
                          {new Date(new Date(formData.startDate).setMonth(
                            new Date(formData.startDate).getMonth() + formData.expectedDuration
                          )).toLocaleDateString('fr-FR')}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        );

      case 2: // Partenaires et financement
        return (
          <MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Partenaires et co-investisseurs
              </MDTypography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasPartners}
                    onChange={(e) => handleFieldChange('hasPartners', e.target.checked)}
                  />
                }
                label="Investissement en partenariat"
              />
            </MDBox>

            {formData.hasPartners ? (
              <MDBox>
                {/* Liste des partenaires */}
                {formData.partners.map((partner, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <MDTypography variant="h6" fontWeight="medium">
                          Partenaire {index + 1}
                        </MDTypography>
                        <IconButton
                          color="error"
                          onClick={() => removePartner(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </MDBox>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <MDInput
                            label="Nom du partenaire"
                            value={partner.name}
                            onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                            error={!!errors[`partner_${index}_name`]}
                            helperText={errors[`partner_${index}_name`]}
                            fullWidth
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <MDInput
                            label="Email (optionnel)"
                            type="email"
                            value={partner.email}
                            onChange={(e) => handlePartnerChange(index, 'email', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <AmountInput
                            label="Contribution"
                            value={partner.contribution}
                            onChange={(value) => handlePartnerChange(index, 'contribution', value)}
                            currency={formData.currency}
                            error={!!errors[`partner_${index}_contribution`]}
                            helperText={errors[`partner_${index}_contribution`]}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}

                {/* Bouton ajouter partenaire */}
                <MDButton
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addPartner}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  Ajouter un partenaire
                </MDButton>

                {/* Tableau de répartition */}
                {(formData.personalContribution > 0 || formData.partners.length > 0) && (
                  <Card>
                    <CardContent>
                      <MDTypography variant="h6" fontWeight="medium" mb={2}>
                        Répartition des parts
                      </MDTypography>
                      
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Investisseur</strong></TableCell>
                              <TableCell align="right"><strong>Contribution</strong></TableCell>
                              <TableCell align="right"><strong>Pourcentage</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Vous</TableCell>
                              <TableCell align="right">
                                {formData.personalContribution.toLocaleString()} {formData.currency}
                              </TableCell>
                              <TableCell align="right">
                                <strong>{personalPercentage.toFixed(1)}%</strong>
                              </TableCell>
                            </TableRow>
                            {formData.partners.map((partner, index) => (
                              <TableRow key={index}>
                                <TableCell>{partner.name || `Partenaire ${index + 1}`}</TableCell>
                                <TableCell align="right">
                                  {(partner.contribution || 0).toLocaleString()} {formData.currency}
                                </TableCell>
                                <TableCell align="right">
                                  {(partner.percentage || 0).toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow sx={{ bgcolor: 'primary.50' }}>
                              <TableCell><strong>Total</strong></TableCell>
                              <TableCell align="right">
                                <strong>{totalWithPartners.toLocaleString()} {formData.currency}</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>100.0%</strong>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                )}
              </MDBox>
            ) : (
              <Alert severity="info">
                <MDTypography variant="body2">
                  Vous êtes le seul investisseur de ce projet. Vous détiendrez 100% des parts et bénéfices.
                </MDTypography>
              </Alert>
            )}

            {errors.partners && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.partners}
              </Alert>
            )}
          </MDBox>
        );

      case 3: // Projections et suivi
        const projections = calculateProjections();
        
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={3}>
              Projections financières et suivi
            </MDTypography>

            <Grid container spacing={3}>
              {/* Projections de revenus */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Projections de revenus
                    </MDTypography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <AmountInput
                          label="Revenus mensuels estimés"
                          value={formData.monthlyRevenue}
                          onChange={(value) => handleFieldChange('monthlyRevenue', value)}
                          currency={formData.currency}
                          helperText="Chiffre d'affaires mensuel prévu"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <AmountInput
                          label="Dépenses mensuelles estimées"
                          value={formData.monthlyExpenses}
                          onChange={(value) => handleFieldChange('monthlyExpenses', value)}
                          currency={formData.currency}
                          helperText="Coûts d'exploitation mensuels"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <MDInput
                          label="ROI attendu (%/an)"
                          type="number"
                          value={formData.expectedROI}
                          onChange={(e) => handleFieldChange('expectedROI', parseFloat(e.target.value))}
                          error={!!errors.expectedROI}
                          helperText={errors.expectedROI || selectedType?.avgROI}
                          fullWidth
                          inputProps={{ min: 0, max: 1000, step: 0.1 }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Calculs automatiques */}
              {(formData.monthlyRevenue > 0 || formData.monthlyExpenses > 0) && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'success.50' }}>
                    <CardContent>
                      <MDTypography variant="h6" fontWeight="medium" mb={2} display="flex" alignItems="center">
                        <CalculateIcon sx={{ mr: 1 }} />
                        Calculs automatiques
                      </MDTypography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <MDTypography variant="body2" color="text">
                            Profit mensuel
                          </MDTypography>
                          <MDTypography 
                            variant="h6" 
                            fontWeight="medium"
                            color={projections.monthlyProfit >= 0 ? 'success.main' : 'error.main'}
                          >
                            {projections.monthlyProfit.toLocaleString()} {formData.currency}
                          </MDTypography>
                        </Grid>
                        
                        <Grid item xs={6} md={3}>
                          <MDTypography variant="body2" color="text">
                            Profit annuel estimé
                          </MDTypography>
                          <MDTypography 
                            variant="h6" 
                            fontWeight="medium"
                            color={projections.annualProfit >= 0 ? 'success.main' : 'error.main'}
                          >
                            {projections.annualProfit.toLocaleString()} {formData.currency}
                          </MDTypography>
                        </Grid>
                        
                        <Grid item xs={6} md={3}>
                          <MDTypography variant="body2" color="text">
                            ROI calculé
                          </MDTypography>
                          <MDTypography 
                            variant="h6" 
                            fontWeight="medium"
                            color={projections.roi >= 0 ? 'success.main' : 'error.main'}
                          >
                            {projections.roi.toFixed(1)}%
                          </MDTypography>
                        </Grid>
                        
                        <Grid item xs={6} md={3}>
                          <MDTypography variant="body2" color="text">
                            Seuil de rentabilité
                          </MDTypography>
                          <MDTypography variant="h6" fontWeight="medium">
                            {projections.breakEven} mois
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Évaluation des risques */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Évaluation des risques
                    </MDTypography>
                    
                    <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                      <FormLabel component="legend">Niveau de risque perçu</FormLabel>
                      <RadioGroup
                        value={formData.riskAssessment}
                        onChange={(e) => handleFieldChange('riskAssessment', e.target.value)}
                      >
                        {Object.entries(RISK_LEVELS).map(([key, risk]) => (
                          <FormControlLabel
                            key={key}
                            value={key}
                            control={<Radio />}
                            label={
                              <MDBox>
                                <MDTypography variant="body2" fontWeight="medium">
                                  {risk.label}
                                </MDTypography>
                                <MDTypography variant="caption" color="text">
                                  {risk.description}
                                </MDTypography>
                              </MDBox>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    
                    <MDInput
                      label="Plan de contingence"
                      placeholder="Actions en cas de difficultés..."
                      value={formData.contingencyPlan}
                      onChange={(e) => handleFieldChange('contingencyPlan', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Configuration du suivi */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Suivi et notifications
                    </MDTypography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Fréquence de révision</FormLabel>
                      <RadioGroup
                        value={formData.reviewFrequency}
                        onChange={(e) => handleFieldChange('reviewFrequency', e.target.value)}
                        row
                      >
                        <FormControlLabel value="weekly" control={<Radio />} label="Hebdomadaire" />
                        <FormControlLabel value="monthly" control={<Radio />} label="Mensuel" />
                        <FormControlLabel value="quarterly" control={<Radio />} label="Trimestriel" />
                      </RadioGroup>
                    </FormControl>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.enableNotifications}
                          onChange={(e) => handleFieldChange('enableNotifications', e.target.checked)}
                        />
                      }
                      label="Notifications de performance"
                      sx={{ mb: 2 }}
                    />
                    
                    <MDInput
                      label="Notes additionnelles"
                      placeholder="Objectifs particuliers, rappels..."
                      value={formData.notes}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
              {isEditing ? 'Modifier l\'investissement' : 'Nouvel investissement'}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {isEditing ? 'Mettez à jour les informations de votre investissement' : 'Créez et suivez un nouveau projet d\'investissement'}
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
                        (isEditing ? 'Mettre à jour' : 'Créer l\'investissement') : 
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

InvestmentForm.propTypes = {
  investment: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  accounts: PropTypes.array,
  existingInvestments: PropTypes.array,
  contacts: PropTypes.array,
  isEditing: PropTypes.bool,
  showAdvancedProjections: PropTypes.bool,
};

export default InvestmentForm;