// src/components/FinApp/AddAccountForm/index.js
import React, { useState } from 'react';
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
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';

// @mui icons
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import BusinessIcon from '@mui/icons-material/Business';
import WalletIcon from '@mui/icons-material/Wallet';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// FinApp components
import AmountInput from 'components/FinApp/AmountInput';
import CurrencySelector from 'components/FinApp/CurrencySelector';

// Banques haïtiennes populaires
const HAITIAN_BANKS = [
  {
    id: 'sogebank',
    name: 'Sogebank',
    fullName: 'Société Générale Haïtienne de Banque',
    logo: '/banks/sogebank.png',
    color: '#e53e3e',
    popular: true,
    services: ['checking', 'savings', 'credit_card', 'business']
  },
  {
    id: 'unibank',
    name: 'Unibank',
    fullName: 'Unibank S.A.',
    logo: '/banks/unibank.png',
    color: '#3182ce',
    popular: true,
    services: ['checking', 'savings', 'credit_card']
  },
  {
    id: 'bnc',
    name: 'BNC',
    fullName: 'Banque Nationale de Crédit',
    logo: '/banks/bnc.png',
    color: '#38a169',
    popular: true,
    services: ['checking', 'savings', 'business']
  },
  {
    id: 'capital_bank',
    name: 'Capital Bank',
    fullName: 'Capital Bank S.A.',
    logo: '/banks/capital.png',
    color: '#805ad5',
    popular: false,
    services: ['checking', 'savings', 'credit_card']
  },
  {
    id: 'bmpad',
    name: 'BMPAD',
    fullName: 'Banque Métropolitaine d\'Haiti',
    logo: '/banks/bmpad.png',
    color: '#d69e2e',
    popular: false,
    services: ['checking', 'savings']
  },
  {
    id: 'other',
    name: 'Autre banque',
    fullName: 'Banque non listée',
    logo: null,
    color: '#718096',
    popular: false,
    services: ['checking', 'savings', 'credit_card', 'business']
  }
];

// Types de comptes
const ACCOUNT_TYPES = [
  {
    id: 'checking',
    name: 'Compte courant',
    description: 'Compte pour les transactions quotidiennes',
    icon: AccountBalanceIcon,
    color: 'primary',
    features: ['Cartes de débit', 'Chéquiers', 'Virements']
  },
  {
    id: 'savings',
    name: 'Compte épargne',
    description: 'Compte pour économiser avec intérêts',
    icon: SavingsIcon,
    color: 'success',
    features: ['Intérêts', 'Dépôts à terme', 'Épargne sécurisée']
  },
  {
    id: 'credit_card',
    name: 'Carte de crédit',
    description: 'Ligne de crédit revolving',
    icon: CreditCardIcon,
    color: 'warning',
    features: ['Crédit revolving', 'Paiements différés', 'Points rewards']
  },
  {
    id: 'business',
    name: 'Compte business',
    description: 'Compte pour entreprises et commerces',
    icon: BusinessIcon,
    color: 'info',
    features: ['Gestion entreprise', 'Virements commerciaux', 'Prêts business']
  },
  {
    id: 'mobile_wallet',
    name: 'Portefeuille mobile',
    description: 'MonCash, NatCash, etc.',
    icon: WalletIcon,
    color: 'secondary',
    features: ['Paiements mobiles', 'Transferts instantanés', 'QR codes']
  }
];

const STEPS = [
  { label: 'Type de compte', description: 'Choisissez le type de compte à ajouter' },
  { label: 'Institution financière', description: 'Sélectionnez votre banque' },
  { label: 'Informations du compte', description: 'Détails et configuration' },
  { label: 'Vérification', description: 'Confirmez les informations' }
];

function AddAccountForm({
  onSubmit,
  onCancel,
  existingAccounts = [],
  disabled = false,
  showAdvancedOptions = true,
  ...other
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Type et banque
    accountType: '',
    bankId: '',
    customBankName: '',
    
    // Informations du compte
    accountName: '',
    accountNumber: '',
    initialBalance: 0,
    currency: 'HTG',
    
    // Configuration
    isMainAccount: false,
    includeInOverview: true,
    enableNotifications: true,
    autoSync: false,
    
    // Sécurité
    hideBalance: false,
    requirePinForAccess: false,
    
    // Métadonnées
    notes: '',
    openingDate: new Date().toISOString().split('T')[0],
    branchLocation: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  // Données dérivées
  const selectedBank = HAITIAN_BANKS.find(bank => bank.id === formData.bankId);
  const selectedAccountType = ACCOUNT_TYPES.find(type => type.id === formData.accountType);
  const isCustomBank = formData.bankId === 'other';

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Type de compte
        if (!formData.accountType) {
          newErrors.accountType = 'Sélectionnez un type de compte';
        }
        break;
        
      case 1: // Institution financière
        if (!formData.bankId) {
          newErrors.bankId = 'Sélectionnez une banque';
        }
        if (isCustomBank && !formData.customBankName.trim()) {
          newErrors.customBankName = 'Nom de la banque requis';
        }
        break;
        
      case 2: // Informations du compte
        if (!formData.accountName.trim()) {
          newErrors.accountName = 'Nom du compte requis';
        }
        if (formData.accountType !== 'mobile_wallet' && !formData.accountNumber.trim()) {
          newErrors.accountNumber = 'Numéro de compte requis';
        }
        if (formData.initialBalance < 0) {
          newErrors.initialBalance = 'Le solde ne peut pas être négatif';
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
      const accountData = {
        ...formData,
        id: `${formData.bankId}_${Date.now()}`,
        bankName: isCustomBank ? formData.customBankName : selectedBank.name,
        bankFullName: isCustomBank ? formData.customBankName : selectedBank.fullName,
        accountTypeName: selectedAccountType.name,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(accountData);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du compte:', error);
      setErrors({ submit: 'Erreur lors de l\'ajout du compte' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Type de compte
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Quel type de compte souhaitez-vous ajouter ?
            </MDTypography>

            <Grid container spacing={2}>
              {ACCOUNT_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Grid item xs={12} sm={6} key={type.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: formData.accountType === type.id ? `${type.color}.main` : 'grey.200',
                        bgcolor: formData.accountType === type.id ? `${type.color}.50` : 'transparent',
                        '&:hover': {
                          borderColor: `${type.color}.main`,
                          bgcolor: `${type.color}.50`
                        }
                      }}
                      onClick={() => handleFieldChange('accountType', type.id)}
                    >
                      <CardContent>
                        <MDBox display="flex" alignItems="center" mb={1}>
                          <Avatar sx={{ bgcolor: `${type.color}.main`, mr: 2 }}>
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
                        
                        <MDBox>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            Fonctionnalités :
                          </MDTypography>
                          <MDBox display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                            {type.features.map((feature, index) => (
                              <Chip
                                key={index}
                                label={feature}
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

            {formData.accountType && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <MDTypography variant="body2">
                  Vous avez sélectionné: <strong>{selectedAccountType.name}</strong>
                </MDTypography>
              </Alert>
            )}
          </MDBox>
        );

      case 1: // Institution financière
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Choisissez votre institution financière
            </MDTypography>

            <Grid container spacing={2}>
              {HAITIAN_BANKS.map((bank) => (
                <Grid item xs={12} sm={6} key={bank.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.bankId === bank.id ? bank.color : 'grey.200',
                      bgcolor: formData.bankId === bank.id ? `${bank.color}15` : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        borderColor: bank.color,
                        bgcolor: `${bank.color}10`
                      }
                    }}
                    onClick={() => handleFieldChange('bankId', bank.id)}
                  >
                    {bank.popular && bank.id !== 'other' && (
                      <Chip
                        label="Populaire"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                    <CardContent>
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <Avatar 
                          sx={{ 
                            bgcolor: bank.color, 
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          {bank.logo ? (
                            <img src={bank.logo} alt={bank.name} style={{ width: '100%' }} />
                          ) : (
                            bank.name.charAt(0)
                          )}
                        </Avatar>
                        <MDBox>
                          <MDTypography variant="h6" fontWeight="medium">
                            {bank.name}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            {bank.fullName}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      
                      {bank.id !== 'other' && (
                        <MDBox>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            Services disponibles :
                          </MDTypography>
                          <MDBox display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                            {bank.services.map((service, index) => {
                              const serviceType = ACCOUNT_TYPES.find(t => t.id === service);
                              return (
                                <Chip
                                  key={index}
                                  label={serviceType?.name || service}
                                  size="small"
                                  variant="outlined"
                                  color={formData.accountType === service ? 'primary' : 'default'}
                                />
                              );
                            })}
                          </MDBox>
                        </MDBox>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {isCustomBank && (
              <MDBox mt={3}>
                <MDInput
                  label="Nom de la banque"
                  placeholder="Ex: Banque de l'Union Haïtienne"
                  value={formData.customBankName}
                  onChange={(e) => handleFieldChange('customBankName', e.target.value)}
                  error={!!errors.customBankName}
                  helperText={errors.customBankName}
                  fullWidth
                />
              </MDBox>
            )}
          </MDBox>
        );

      case 2: // Informations du compte
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Informations du compte
            </MDTypography>

            <Grid container spacing={3}>
              {/* Nom du compte */}
              <Grid item xs={12}>
                <MDInput
                  label="Nom du compte"
                  placeholder={`Mon compte ${selectedAccountType?.name || ''} ${selectedBank?.name || ''}`}
                  value={formData.accountName}
                  onChange={(e) => handleFieldChange('accountName', e.target.value)}
                  error={!!errors.accountName}
                  helperText={errors.accountName || 'Nom d\'affichage pour ce compte'}
                  fullWidth
                />
              </Grid>

              {/* Numéro de compte */}
              {formData.accountType !== 'mobile_wallet' && (
                <Grid item xs={12}>
                  <MDInput
                    label="Numéro de compte"
                    placeholder="1234567890"
                    value={formData.accountNumber}
                    onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber}
                    fullWidth
                    type={showAccountNumber ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <MDButton
                            variant="text"
                            size="small"
                            onClick={() => setShowAccountNumber(!showAccountNumber)}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            {showAccountNumber ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </MDButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              )}

              {/* Numéro de téléphone pour mobile wallet */}
              {formData.accountType === 'mobile_wallet' && (
                <Grid item xs={12}>
                  <MDInput
                    label="Numéro de téléphone"
                    placeholder="+509 1234 5678"
                    value={formData.accountNumber}
                    onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber || 'Numéro associé au portefeuille mobile'}
                    fullWidth
                  />
                </Grid>
              )}

              {/* Solde initial et devise */}
              <Grid item xs={12} md={6}>
                <AmountInput
                  label="Solde initial"
                  value={formData.initialBalance}
                  onChange={(value) => handleFieldChange('initialBalance', value)}
                  currency={formData.currency}
                  error={!!errors.initialBalance}
                  helperText={errors.initialBalance || 'Solde actuel du compte'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currency) => handleFieldChange('currency', currency)}
                  label="Devise du compte"
                  fullWidth
                />
              </Grid>

              {/* Options avancées */}
              {showAdvancedOptions && (
                <>
                  <Grid item xs={12}>
                    <Divider>
                      <Chip label="Options" size="small" />
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isMainAccount}
                          onChange={(e) => handleFieldChange('isMainAccount', e.target.checked)}
                        />
                      }
                      label="Compte principal"
                    />
                    <MDTypography variant="caption" color="text" display="block">
                      Utiliser par défaut pour les transactions
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.includeInOverview}
                          onChange={(e) => handleFieldChange('includeInOverview', e.target.checked)}
                        />
                      }
                      label="Inclure dans le tableau de bord"
                    />
                    <MDTypography variant="caption" color="text" display="block">
                      Afficher dans les vues d'ensemble
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hideBalance}
                          onChange={(e) => handleFieldChange('hideBalance', e.target.checked)}
                        />
                      }
                      label="Masquer le solde"
                    />
                    <MDTypography variant="caption" color="text" display="block">
                      Afficher *** au lieu du montant
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.enableNotifications}
                          onChange={(e) => handleFieldChange('enableNotifications', e.target.checked)}
                        />
                      }
                      label="Notifications"
                    />
                    <MDTypography variant="caption" color="text" display="block">
                      Alertes de solde faible, etc.
                    </MDTypography>
                  </Grid>
                </>
              )}

              {/* Informations supplémentaires */}
              <Grid item xs={12} md={6}>
                <MDInput
                  label="Date d'ouverture"
                  type="date"
                  value={formData.openingDate}
                  onChange={(e) => handleFieldChange('openingDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MDInput
                  label="Agence/Succursale"
                  placeholder="Ex: Port-au-Prince Centre"
                  value={formData.branchLocation}
                  onChange={(e) => handleFieldChange('branchLocation', e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  label="Notes"
                  placeholder="Informations additionnelles sur ce compte..."
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

      case 3: // Vérification
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Vérifiez les informations
            </MDTypography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="h6" fontWeight="medium" display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: selectedAccountType?.color + '.main', mr: 2 }}>
                          {React.createElement(selectedAccountType?.icon)}
                        </Avatar>
                        {formData.accountName}
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {selectedAccountType?.name} • {isCustomBank ? formData.customBankName : selectedBank?.name}
                      </MDTypography>
                    </MDBox>

                    <MDBox mb={1}>
                      <MDTypography variant="body2" color="text">
                        {formData.accountType === 'mobile_wallet' ? 'Téléphone' : 'Numéro de compte'}: 
                        <strong style={{ marginLeft: 8 }}>
                          {formData.accountNumber.replace(/./g, '*').slice(0, -4) + formData.accountNumber.slice(-4)}
                        </strong>
                      </MDTypography>
                    </MDBox>

                    <MDBox mb={1}>
                      <MDTypography variant="body2" color="text">
                        Solde initial: 
                        <strong style={{ marginLeft: 8 }}>
                          {formData.initialBalance.toLocaleString()} {formData.currency}
                        </strong>
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="medium" mb={2}>
                        Configuration
                      </MDTypography>
                      
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.isMainAccount ? 'success.main' : 'grey.400',
                            mr: 1 
                          }} 
                        />
                        <MDTypography variant="body2" color={formData.isMainAccount ? 'text' : 'text.secondary'}>
                          Compte principal
                        </MDTypography>
                      </MDBox>
                      
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <CheckCircleIcon 
                          sx={{ 
                            color: formData.includeInOverview ? 'success.main' : 'grey.400',
                            mr: 1 
                          }} 
                        />
                        <MDTypography variant="body2" color={formData.includeInOverview ? 'text' : 'text.secondary'}>
                          Inclus dans tableau de bord
                        </MDTypography>
                      </MDBox>
                      
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <SecurityIcon 
                          sx={{ 
                            color: formData.hideBalance ? 'warning.main' : 'grey.400',
                            mr: 1 
                          }} 
                        />
                        <MDTypography variant="body2" color={formData.hideBalance ? 'text' : 'text.secondary'}>
                          Solde masqué
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Alert severity="success">
              <MDTypography variant="body2">
                <strong>Votre compte sera ajouté avec succès !</strong><br />
                Vous pourrez commencer à enregistrer des transactions immédiatement.
              </MDTypography>
            </Alert>
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
              Ajouter un compte
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Ajoutez un nouveau compte pour gérer vos finances
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
                      {index === STEPS.length - 1 ? 'Ajouter le compte' : 'Suivant'}
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

AddAccountForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  existingAccounts: PropTypes.array,
  disabled: PropTypes.bool,
  showAdvancedOptions: PropTypes.bool,
};

export default AddAccountForm;