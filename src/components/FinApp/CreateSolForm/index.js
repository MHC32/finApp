// src/components/FinApp/CreateSolForm/index.js
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
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';

// @mui icons
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RuleIcon from '@mui/icons-material/Rule';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// FinApp components
import AmountInput from 'components/FinApp/AmountInput';
import CurrencySelector from 'components/FinApp/CurrencySelector';

// Configuration des types de sols haïtiens
const SOL_TYPES = [
  {
    id: 'family',
    label: 'Sol Familial',
    description: 'Entre membres de la famille pour soutien mutuel',
    icon: 'family_restroom',
    color: 'success',
    defaultParticipants: 8,
    recommended: true
  },
  {
    id: 'work',
    label: 'Sol de Travail',
    description: 'Entre collègues de bureau ou même profession',
    icon: 'work',
    color: 'info',
    defaultParticipants: 12,
    recommended: true
  },
  {
    id: 'neighborhood',
    label: 'Sol de Quartier',
    description: 'Entre voisins et amis du quartier',
    icon: 'location_city',
    color: 'primary',
    defaultParticipants: 10,
    recommended: false
  },
  {
    id: 'investment',
    label: 'Sol d\'Investissement',
    description: 'Pour financer des projets communs (commerce, agriculture)',
    icon: 'trending_up',
    color: 'warning',
    defaultParticipants: 6,
    recommended: false
  },
  {
    id: 'student',
    label: 'Sol Étudiant',
    description: 'Entre étudiants pour financer études',
    icon: 'school',
    color: 'secondary',
    defaultParticipants: 8,
    recommended: false
  },
  {
    id: 'community',
    label: 'Sol Communautaire',
    description: 'Grand sol communautaire avec organisation',
    icon: 'groups',
    color: 'primary',
    defaultParticipants: 20,
    recommended: false
  }
];

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Hebdomadaire', description: 'Chaque semaine' },
  { value: 'biweekly', label: 'Bi-mensuel', description: 'Toutes les 2 semaines' },
  { value: 'monthly', label: 'Mensuel', description: 'Chaque mois', recommended: true },
  { value: 'quarterly', label: 'Trimestriel', description: 'Tous les 3 mois' }
];

const STEPS = [
  { label: 'Type de Sol', icon: 'category' },
  { label: 'Participants', icon: 'people' },
  { label: 'Montant & Fréquence', icon: 'attach_money' },
  { label: 'Règles & Conditions', icon: 'rule' },
  { label: 'Partage & Invitation', icon: 'share' }
];

function CreateSolForm({
  onSubmit,
  onCancel,
  initialData = null,
  mode = 'create', // 'create' | 'edit'
  disabled = false,
  ...other
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Étape 1: Type
    solType: '',
    solName: '',
    description: '',
    
    // Étape 2: Participants
    maxParticipants: 8,
    isPrivate: false,
    allowInviteOthers: true,
    participants: [],
    
    // Étape 3: Montant & Fréquence
    amount: '',
    currency: 'HTG',
    frequency: 'monthly',
    startDate: '',
    
    // Étape 4: Règles
    rules: {
      allowMissPayment: false,
      maxMissedPayments: 1,
      penaltyAmount: 0,
      autoExcludeAfterMissed: true,
      allowEarlyWithdraw: false,
      requireGuarantor: false
    },
    
    // Étape 5: Partage
    inviteMethod: 'qr', // 'qr' | 'link' | 'manual'
    autoStart: true,
    requireApproval: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialiser avec les données existantes si mode edit
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData, mode]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Logique spéciale selon le champ
    if (field === 'solType') {
      const selectedType = SOL_TYPES.find(type => type.id === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          maxParticipants: selectedType.defaultParticipants,
          solName: prev.solName || `Sol ${selectedType.label}`,
          description: prev.description || selectedType.description
        }));
      }
    }
  };

  const handleRuleChange = (ruleName, value) => {
    setFormData(prev => ({
      ...prev,
      rules: { ...prev.rules, [ruleName]: value }
    }));
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Type
        if (!formData.solType) newErrors.solType = 'Sélectionnez un type de sol';
        if (!formData.solName.trim()) newErrors.solName = 'Nom du sol requis';
        break;
        
      case 1: // Participants
        if (formData.maxParticipants < 3) newErrors.maxParticipants = 'Minimum 3 participants';
        if (formData.maxParticipants > 50) newErrors.maxParticipants = 'Maximum 50 participants';
        break;
        
      case 2: // Montant
        if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Montant requis';
        if (!formData.frequency) newErrors.frequency = 'Fréquence requise';
        if (!formData.startDate) newErrors.startDate = 'Date de début requise';
        break;
        
      case 3: // Règles
        if (formData.rules.penaltyAmount < 0) newErrors.penaltyAmount = 'Montant invalide';
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
      const solData = {
        ...formData,
        createdAt: new Date(),
        status: formData.autoStart ? 'active' : 'pending',
        currentTurn: 0,
        totalAmount: formData.amount * formData.maxParticipants
      };

      if (onSubmit) {
        await onSubmit(solData);
      }
    } catch (error) {
      console.error('Erreur création sol:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSolDuration = () => {
    const { maxParticipants, frequency } = formData;
    const multipliers = { weekly: 1, biweekly: 2, monthly: 4.33, quarterly: 13 };
    return Math.ceil(maxParticipants * (multipliers[frequency] || 4.33));
  };

  const calculateTotalAmount = () => {
    return formData.amount * formData.maxParticipants;
  };

  // Rendu des étapes
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Type de Sol
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Choisissez le type de sol
            </MDTypography>
            
            <Grid container spacing={2}>
              {SOL_TYPES.map((type) => (
                <Grid item xs={12} sm={6} key={type.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.solType === type.id ? `${type.color}.main` : 'grey.200',
                      bgcolor: formData.solType === type.id ? `${type.color}.50` : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        borderColor: `${type.color}.main`,
                        bgcolor: `${type.color}.50`
                      }
                    }}
                    onClick={() => handleFieldChange('solType', type.id)}
                  >
                    {type.recommended && (
                      <Chip
                        label="Recommandé"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                    <CardContent>
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ bgcolor: `${type.color}.main`, mr: 2 }}>
                          <PeopleIcon />
                        </Avatar>
                        <MDTypography variant="h6" fontWeight="medium">
                          {type.label}
                        </MDTypography>
                      </MDBox>
                      <MDTypography variant="body2" color="text">
                        {type.description}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" mt={1} display="block">
                        Participants typiques: {type.defaultParticipants}
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {formData.solType && (
              <MDBox mt={3}>
                <MDInput
                  label="Nom du sol"
                  placeholder="Ex: Sol Famille Janvier, Sol Bureau Marketing..."
                  value={formData.solName}
                  onChange={(e) => handleFieldChange('solName', e.target.value)}
                  error={!!errors.solName}
                  helperText={errors.solName}
                  fullWidth
                  margin="normal"
                />
                
                <MDInput
                  label="Description (optionnel)"
                  placeholder="Décrivez l'objectif de ce sol..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </MDBox>
            )}
          </MDBox>
        );

      case 1: // Participants
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Configuration des participants
            </MDTypography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDTypography variant="body1" fontWeight="medium" mb={2}>
                  Nombre de participants
                </MDTypography>
                <Slider
                  value={formData.maxParticipants}
                  onChange={(e, value) => handleFieldChange('maxParticipants', value)}
                  min={3}
                  max={50}
                  step={1}
                  marks={[
                    { value: 3, label: '3' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                    { value: 50, label: '50' }
                  ]}
                  valueLabelDisplay="on"
                  sx={{ mb: 3 }}
                />
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Durée estimée: {calculateSolDuration()} semaines
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDBox>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPrivate}
                        onChange={(e) => handleFieldChange('isPrivate', e.target.checked)}
                      />
                    }
                    label="Sol privé (sur invitation seulement)"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allowInviteOthers}
                        onChange={(e) => handleFieldChange('allowInviteOthers', e.target.checked)}
                      />
                    }
                    label="Permettre aux participants d'inviter d'autres"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.requireApproval}
                        onChange={(e) => handleFieldChange('requireApproval', e.target.checked)}
                      />
                    }
                    label="Approbation requise pour rejoindre"
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        );

      case 2: // Montant & Fréquence
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Montant et fréquence des paiements
            </MDTypography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currency) => handleFieldChange('currency', currency)}
                  label="Devise"
                  fullWidth
                  margin="normal"
                />
                
                <AmountInput
                  label="Montant par participant"
                  value={formData.amount}
                  onChange={(amount) => handleFieldChange('amount', amount)}
                  currency={formData.currency}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  fullWidth
                  margin="normal"
                />

                <MDInput
                  label="Date de début"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Fréquence des paiements</FormLabel>
                  <RadioGroup
                    value={formData.frequency}
                    onChange={(e) => handleFieldChange('frequency', e.target.value)}
                  >
                    {FREQUENCY_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={
                          <MDBox>
                            <MDTypography variant="body1">
                              {option.label}
                              {option.recommended && (
                                <Chip label="Recommandé" size="small" color="primary" sx={{ ml: 1 }} />
                              )}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              {option.description}
                            </MDTypography>
                          </MDBox>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {formData.amount && formData.maxParticipants && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <MDTypography variant="body2" fontWeight="medium">
                      Montant total du sol: {calculateTotalAmount().toLocaleString()} {formData.currency}
                    </MDTypography>
                    <MDTypography variant="caption">
                      Chaque participant recevra ce montant à son tour
                    </MDTypography>
                  </Alert>
                )}
              </Grid>
            </Grid>
          </MDBox>
        );

      case 3: // Règles
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Règles et conditions du sol
            </MDTypography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDTypography variant="body1" fontWeight="medium" mb={2}>
                  Gestion des paiements manqués
                </MDTypography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rules.allowMissPayment}
                      onChange={(e) => handleRuleChange('allowMissPayment', e.target.checked)}
                    />
                  }
                  label="Permettre les paiements manqués"
                />

                {formData.rules.allowMissPayment && (
                  <MDBox mt={2}>
                    <MDInput
                      label="Nombre max de paiements manqués"
                      type="number"
                      value={formData.rules.maxMissedPayments}
                      onChange={(e) => handleRuleChange('maxMissedPayments', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 5 }}
                      fullWidth
                      margin="normal"
                    />
                    
                    <AmountInput
                      label="Pénalité par paiement manqué"
                      value={formData.rules.penaltyAmount}
                      onChange={(amount) => handleRuleChange('penaltyAmount', amount)}
                      currency={formData.currency}
                      fullWidth
                      margin="normal"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.rules.autoExcludeAfterMissed}
                          onChange={(e) => handleRuleChange('autoExcludeAfterMissed', e.target.checked)}
                        />
                      }
                      label="Exclure automatiquement après limite dépassée"
                    />
                  </MDBox>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography variant="body1" fontWeight="medium" mb={2}>
                  Règles avancées
                </MDTypography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rules.allowEarlyWithdraw}
                      onChange={(e) => handleRuleChange('allowEarlyWithdraw', e.target.checked)}
                    />
                  }
                  label="Permettre retrait anticipé (urgent)"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rules.requireGuarantor}
                      onChange={(e) => handleRuleChange('requireGuarantor', e.target.checked)}
                    />
                  }
                  label="Exiger un garant pour rejoindre"
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <MDTypography variant="caption">
                    Ces règles seront appliquées automatiquement pendant toute la durée du sol.
                    Elles peuvent être modifiées par vote majoritaire des participants.
                  </MDTypography>
                </Alert>
              </Grid>
            </Grid>
          </MDBox>
        );

      case 4: // Partage
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Partage et invitation
            </MDTypography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Méthode d'invitation</FormLabel>
                  <RadioGroup
                    value={formData.inviteMethod}
                    onChange={(e) => handleFieldChange('inviteMethod', e.target.value)}
                  >
                    <FormControlLabel
                      value="qr"
                      control={<Radio />}
                      label={
                        <MDBox display="flex" alignItems="center">
                          <QrCodeIcon sx={{ mr: 1 }} />
                          <MDBox>
                            <MDTypography variant="body1">Code QR</MDTypography>
                            <MDTypography variant="caption" color="text">
                              Scanner pour rejoindre facilement
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      }
                    />
                    <FormControlLabel
                      value="link"
                      control={<Radio />}
                      label={
                        <MDBox display="flex" alignItems="center">
                          <ShareIcon sx={{ mr: 1 }} />
                          <MDBox>
                            <MDTypography variant="body1">Lien de partage</MDTypography>
                            <MDTypography variant="caption" color="text">
                              Envoyer par WhatsApp, SMS, etc.
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      }
                    />
                    <FormControlLabel
                      value="manual"
                      control={<Radio />}
                      label={
                        <MDBox display="flex" alignItems="center">
                          <PeopleIcon sx={{ mr: 1 }} />
                          <MDBox>
                            <MDTypography variant="body1">Invitation manuelle</MDTypography>
                            <MDTypography variant="caption" color="text">
                              Ajouter les participants un par un
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDTypography variant="body1" fontWeight="medium" mb={2}>
                  Options de démarrage
                </MDTypography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoStart}
                      onChange={(e) => handleFieldChange('autoStart', e.target.checked)}
                    />
                  }
                  label="Démarrer automatiquement quand complet"
                />

                <Alert severity="success" sx={{ mt: 2 }}>
                  <MDTypography variant="body2" fontWeight="medium">
                    Résumé de votre sol:
                  </MDTypography>
                  <MDTypography variant="caption" component="div">
                    • {formData.solName}<br/>
                    • {formData.maxParticipants} participants<br/>
                    • {formData.amount} {formData.currency} par {formData.frequency === 'weekly' ? 'semaine' : formData.frequency === 'monthly' ? 'mois' : 'période'}<br/>
                    • Total: {calculateTotalAmount().toLocaleString()} {formData.currency}<br/>
                    • Durée: {calculateSolDuration()} semaines
                  </MDTypography>
                </Alert>
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
          {/* Header */}
          <MDBox mb={3}>
            <MDTypography variant="h5" fontWeight="medium">
              {mode === 'edit' ? 'Modifier le sol' : 'Créer un nouveau sol'}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Configurez votre sol/tontine selon vos besoins
            </MDTypography>
          </MDBox>

          {/* Stepper */}
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
                  
                  {/* Navigation buttons */}
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
                      loading={loading && index === STEPS.length - 1}
                    >
                      {index === STEPS.length - 1 ? 
                        (mode === 'edit' ? 'Sauvegarder' : 'Créer le sol') : 
                        'Suivant'
                      }
                    </MDButton>
                  </MDBox>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    </MDBox>
  );
}

CreateSolForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialData: PropTypes.object,
  mode: PropTypes.oneOf(['create', 'edit']),
  disabled: PropTypes.bool,
};

export default CreateSolForm;