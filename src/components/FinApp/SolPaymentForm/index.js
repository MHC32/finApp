// src/components/FinApp/SolPaymentForm/index.js
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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// @mui icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// FinApp components
import AmountInput from 'components/FinApp/AmountInput';
import CurrencyDisplay from 'components/FinApp/CurrencyDisplay';

// Méthodes de paiement disponibles en Haïti
const PAYMENT_METHODS = [
  {
    id: 'moncash',
    name: 'MonCash',
    description: 'Paiement mobile Digicel',
    icon: 'phone_android',
    color: 'error',
    fee: 0,
    instant: true,
    popular: true
  },
  {
    id: 'natcash',
    name: 'NatCash',
    description: 'Paiement mobile Natcom',
    icon: 'phone_android',
    color: 'info',
    fee: 0,
    instant: true,
    popular: true
  },
  {
    id: 'bank_transfer',
    name: 'Virement bancaire',
    description: 'Transfert entre comptes bancaires',
    icon: 'account_balance',
    color: 'primary',
    fee: 25,
    instant: false,
    popular: false
  },
  {
    id: 'cash',
    name: 'Paiement en espèces',
    description: 'Remise directe à l\'organisateur',
    icon: 'attach_money',
    color: 'success',
    fee: 0,
    instant: true,
    popular: false,
    requiresProof: true
  },
  {
    id: 'agent',
    name: 'Agent financier',
    description: 'Western Union, MoneyGram, etc.',
    icon: 'store',
    color: 'warning',
    fee: 50,
    instant: false,
    popular: false
  }
];

const STEPS = [
  { label: 'Vérification', description: 'Confirmez les détails du paiement' },
  { label: 'Méthode de paiement', description: 'Choisissez comment payer' },
  { label: 'Confirmation du paiement', description: 'Effectuez le paiement' },
  { label: 'Preuve de paiement', description: 'Ajoutez une preuve si nécessaire' }
];

function SolPaymentForm({
  solData,
  paymentDue = null, // Données du paiement dû
  onSubmit,
  onCancel,
  disabled = false,
  ...other
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    paymentMethod: '',
    amount: paymentDue?.amount || 0,
    currency: paymentDue?.currency || solData?.currency || 'HTG',
    dueDate: paymentDue?.dueDate || null,
    
    // Détails selon la méthode
    mobileNumber: '',
    accountNumber: '',
    recipientInfo: '',
    
    // Preuve de paiement
    proofType: 'screenshot', // 'screenshot', 'receipt', 'reference'
    proofFile: null,
    referenceNumber: '',
    notes: '',
    
    // Options
    notifyOrganizer: true,
    schedulePayment: false,
    scheduledDate: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'completed', 'failed'
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Calculer les frais et montant total
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === formData.paymentMethod);
  const fees = selectedMethod?.fee || 0;
  const totalAmount = formData.amount + fees;

  // Vérifier si paiement en retard
  const isLate = paymentDue?.dueDate && new Date() > new Date(paymentDue.dueDate);
  const daysLate = isLate ? Math.ceil((new Date() - new Date(paymentDue.dueDate)) / (1000 * 60 * 60 * 24)) : 0;

  // Calculer pénalité si applicable
  const penalty = isLate && solData?.rules?.penaltyAmount ? 
    Math.min(daysLate * solData.rules.penaltyAmount, solData.rules.maxPenalty || Infinity) : 0;

  const finalAmount = formData.amount + penalty;

  useEffect(() => {
    if (paymentDue) {
      setFormData(prev => ({
        ...prev,
        amount: paymentDue.amount,
        currency: paymentDue.currency,
        dueDate: paymentDue.dueDate
      }));
    }
  }, [paymentDue]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 1: // Méthode de paiement
        if (!formData.paymentMethod) {
          newErrors.paymentMethod = 'Sélectionnez une méthode de paiement';
        }
        break;
        
      case 2: // Détails paiement
        if (['moncash', 'natcash'].includes(formData.paymentMethod)) {
          if (!formData.mobileNumber) {
            newErrors.mobileNumber = 'Numéro de téléphone requis';
          } else if (!/^(\+509|509)?[0-9]{8}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
            newErrors.mobileNumber = 'Numéro de téléphone invalide';
          }
        }
        
        if (formData.paymentMethod === 'bank_transfer') {
          if (!formData.accountNumber) {
            newErrors.accountNumber = 'Numéro de compte requis';
          }
        }
        
        if (formData.schedulePayment && !formData.scheduledDate) {
          newErrors.scheduledDate = 'Date de programmation requise';
        }
        break;
        
      case 3: // Preuve
        if (selectedMethod?.requiresProof || formData.paymentMethod === 'cash') {
          if (formData.proofType === 'reference' && !formData.referenceNumber) {
            newErrors.referenceNumber = 'Numéro de référence requis';
          }
          if (['screenshot', 'receipt'].includes(formData.proofType) && !formData.proofFile) {
            newErrors.proofFile = 'Fichier de preuve requis';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 2 && ['moncash', 'natcash'].includes(formData.paymentMethod)) {
        // Simuler le processus de paiement mobile
        setConfirmDialogOpen(true);
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const processPayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');
    
    try {
      // Simuler le traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setPaymentStatus('completed');
      setActiveStep(3); // Aller à l'étape preuve
      setConfirmDialogOpen(false);
      
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      const paymentData = {
        solId: solData.id,
        amount: finalAmount,
        currency: formData.currency,
        method: formData.paymentMethod,
        totalWithFees: totalAmount,
        penalty: penalty,
        
        paymentDetails: {
          mobileNumber: formData.mobileNumber,
          accountNumber: formData.accountNumber,
          recipientInfo: formData.recipientInfo
        },
        
        proof: {
          type: formData.proofType,
          file: formData.proofFile,
          referenceNumber: formData.referenceNumber,
          notes: formData.notes
        },
        
        options: {
          notifyOrganizer: formData.notifyOrganizer,
          scheduled: formData.schedulePayment,
          scheduledDate: formData.scheduledDate
        },
        
        timestamp: new Date(),
        status: paymentStatus
      };

      if (onSubmit) {
        await onSubmit(paymentData);
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFieldChange('proofFile', file);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Vérification
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Détails du paiement
            </MDTypography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="h5" fontWeight="medium" display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        {solData.name}
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        Organisé par {solData.organizer}
                      </MDTypography>
                    </MDBox>

                    <MDBox display="flex" alignItems="center" mb={1}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <MDTypography variant="body1">
                        Montant dû: 
                      </MDTypography>
                      <CurrencyDisplay
                        amount={formData.amount}
                        currency={formData.currency}
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                        showTrend={false}
                        sx={{ ml: 1 }}
                      />
                    </MDBox>

                    {formData.dueDate && (
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <MDTypography variant="body2" color="text">
                          Échéance: {new Date(formData.dueDate).toLocaleDateString('fr-FR')}
                        </MDTypography>
                      </MDBox>
                    )}

                    {isLate && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <MDTypography variant="body2" fontWeight="medium">
                          Paiement en retard de {daysLate} jour{daysLate > 1 ? 's' : ''}
                        </MDTypography>
                        {penalty > 0 && (
                          <MDTypography variant="caption">
                            Pénalité appliquée: {penalty} {formData.currency}
                          </MDTypography>
                        )}
                      </Alert>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="medium" mb={2}>
                        Résumé
                      </MDTypography>
                      
                      <MDBox display="flex" justifyContent="space-between" mb={1}>
                        <MDTypography variant="body2">Montant de base:</MDTypography>
                        <CurrencyDisplay
                          amount={formData.amount}
                          currency={formData.currency}
                          variant="body2"
                          showTrend={false}
                        />
                      </MDBox>
                      
                      {penalty > 0 && (
                        <MDBox display="flex" justifyContent="space-between" mb={1}>
                          <MDTypography variant="body2" color="warning.main">Pénalité retard:</MDTypography>
                          <CurrencyDisplay
                            amount={penalty}
                            currency={formData.currency}
                            variant="body2"
                            color="warning.main"
                            showTrend={false}
                          />
                        </MDBox>
                      )}
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <MDBox display="flex" justifyContent="space-between">
                        <MDTypography variant="h6" fontWeight="medium">Total:</MDTypography>
                        <CurrencyDisplay
                          amount={finalAmount}
                          currency={formData.currency}
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                          showTrend={false}
                        />
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {solData?.rules && (
              <Alert severity="info">
                <MDTypography variant="body2" fontWeight="medium">
                  Rappel des règles:
                </MDTypography>
                <MDTypography variant="caption" component="div">
                  {!solData.rules.allowMissPayment && "• Les paiements manqués ne sont pas autorisés"}
                  {solData.rules.allowMissPayment && `• Maximum ${solData.rules.maxMissedPayments} paiement(s) manqué(s) autorisé(s)`}
                  {solData.rules.penaltyAmount && `• Pénalité: ${solData.rules.penaltyAmount} ${formData.currency}/jour de retard`}
                </MDTypography>
              </Alert>
            )}
          </MDBox>
        );

      case 1: // Méthode de paiement
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Choisissez votre méthode de paiement
            </MDTypography>

            <Grid container spacing={2}>
              {PAYMENT_METHODS.map((method) => (
                <Grid item xs={12} sm={6} key={method.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.paymentMethod === method.id ? `${method.color}.main` : 'grey.200',
                      bgcolor: formData.paymentMethod === method.id ? `${method.color}.50` : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        borderColor: `${method.color}.main`,
                        bgcolor: `${method.color}.50`
                      }
                    }}
                    onClick={() => handleFieldChange('paymentMethod', method.id)}
                  >
                    {method.popular && (
                      <Chip
                        label="Populaire"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                    <CardContent>
                      <MDBox display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ bgcolor: `${method.color}.main`, mr: 2 }}>
                          {method.icon === 'phone_android' && <PhoneAndroidIcon />}
                          {method.icon === 'account_balance' && <AccountBalanceIcon />}
                          {method.icon === 'attach_money' && <AttachMoneyIcon />}
                          {method.icon === 'store' && <StoreIcon />}
                        </Avatar>
                        <MDBox>
                          <MDTypography variant="h6" fontWeight="medium">
                            {method.name}
                          </MDTypography>
                          <MDTypography variant="body2" color="text">
                            {method.description}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      
                      <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox>
                          {method.fee > 0 ? (
                            <MDTypography variant="caption" color="warning.main">
                              Frais: {method.fee} {formData.currency}
                            </MDTypography>
                          ) : (
                            <MDTypography variant="caption" color="success.main">
                              Gratuit
                            </MDTypography>
                          )}
                        </MDBox>
                        <Chip
                          label={method.instant ? 'Instantané' : 'Différé'}
                          size="small"
                          color={method.instant ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </MDBox>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {formData.paymentMethod && (
              <MDBox mt={3}>
                <Alert severity="info">
                  <MDTypography variant="body2">
                    <strong>Total à payer: {totalAmount} {formData.currency}</strong>
                    {fees > 0 && ` (incluant ${fees} ${formData.currency} de frais)`}
                  </MDTypography>
                </Alert>
              </MDBox>
            )}
          </MDBox>
        );

      case 2: // Détails du paiement
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Détails du paiement
            </MDTypography>

            {['moncash', 'natcash'].includes(formData.paymentMethod) && (
              <MDBox>
                <MDInput
                  label="Numéro de téléphone"
                  placeholder="Ex: +509 1234 5678"
                  value={formData.mobileNumber}
                  onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber || `Votre numéro ${selectedMethod?.name}`}
                  fullWidth
                  margin="normal"
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <MDTypography variant="body2">
                    Un code de confirmation sera envoyé à ce numéro pour valider le paiement de {totalAmount} {formData.currency}.
                  </MDTypography>
                </Alert>
              </MDBox>
            )}

            {formData.paymentMethod === 'bank_transfer' && (
              <MDBox>
                <MDInput
                  label="Numéro de compte destinataire"
                  placeholder="Compte de l'organisateur"
                  value={formData.recipientInfo}
                  onChange={(e) => handleFieldChange('recipientInfo', e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled
                  helperText="Informations fournies par l'organisateur"
                />

                <MDInput
                  label="Votre numéro de compte"
                  placeholder="Compte à débiter"
                  value={formData.accountNumber}
                  onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                  fullWidth
                  margin="normal"
                />

                <Alert severity="warning" sx={{ mt: 2 }}>
                  <MDTypography variant="body2">
                    Le virement peut prendre 24-48h pour être traité. Frais bancaires: {fees} {formData.currency}.
                  </MDTypography>
                </Alert>
              </MDBox>
            )}

            {formData.paymentMethod === 'cash' && (
              <MDBox>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <MDTypography variant="body2">
                    Remettez {finalAmount} {formData.currency} directement à l'organisateur {solData.organizer}.
                    Une preuve sera requise à l'étape suivante.
                  </MDTypography>
                </Alert>

                <MDInput
                  label="Lieu/moment de remise"
                  placeholder="Ex: Bureau, domicile, rendez-vous..."
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                />
              </MDBox>
            )}

            <MDBox mt={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.schedulePayment}
                    onChange={(e) => handleFieldChange('schedulePayment', e.target.checked)}
                  />
                }
                label="Programmer le paiement pour plus tard"
              />

              {formData.schedulePayment && (
                <MDInput
                  label="Date de paiement programmé"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => handleFieldChange('scheduledDate', e.target.value)}
                  error={!!errors.scheduledDate}
                  helperText={errors.scheduledDate}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyOrganizer}
                    onChange={(e) => handleFieldChange('notifyOrganizer', e.target.checked)}
                  />
                }
                label="Notifier l'organisateur après paiement"
              />
            </MDBox>
          </MDBox>
        );

      case 3: // Preuve de paiement
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Preuve de paiement
            </MDTypography>

            {paymentStatus === 'completed' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                Paiement effectué avec succès !
              </Alert>
            )}

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">Type de preuve</FormLabel>
              <RadioGroup
                value={formData.proofType}
                onChange={(e) => handleFieldChange('proofType', e.target.value)}
              >
                <FormControlLabel
                  value="screenshot"
                  control={<Radio />}
                  label="Capture d'écran de la confirmation"
                />
                <FormControlLabel
                  value="receipt"
                  control={<Radio />}
                  label="Photo du reçu/ticket"
                />
                <FormControlLabel
                  value="reference"
                  control={<Radio />}
                  label="Numéro de référence seulement"
                />
              </RadioGroup>
            </FormControl>

            {['screenshot', 'receipt'].includes(formData.proofType) && (
              <MDBox mb={3}>
                <MDButton
                  variant="outlined"
                  component="label"
                  startIcon={<CameraAltIcon />}
                  sx={{ mb: 2 }}
                >
                  Choisir un fichier
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </MDButton>
                
                {formData.proofFile && (
                  <Alert severity="success">
                    Fichier sélectionné: {formData.proofFile.name}
                  </Alert>
                )}
                
                {errors.proofFile && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.proofFile}
                  </MDTypography>
                )}
              </MDBox>
            )}

            {formData.proofType === 'reference' && (
              <MDInput
                label="Numéro de référence"
                placeholder="Ex: REF123456789"
                value={formData.referenceNumber}
                onChange={(e) => handleFieldChange('referenceNumber', e.target.value)}
                error={!!errors.referenceNumber}
                helperText={errors.referenceNumber}
                fullWidth
                margin="normal"
              />
            )}

            <MDInput
              label="Notes additionnelles (optionnel)"
              placeholder="Commentaires sur le paiement..."
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
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
              Paiement Sol
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Effectuez votre paiement pour le sol {solData.name}
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
                      {index === STEPS.length - 1 ? 'Confirmer le paiement' : 'Suivant'}
                    </MDButton>
                  </MDBox>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Dialog de confirmation paiement mobile */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          {paymentStatus === 'processing' && (
            <MDBox>
              <LinearProgress sx={{ mb: 3 }} />
              <PhoneAndroidIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Traitement du paiement...
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Veuillez confirmer le paiement sur votre téléphone {selectedMethod?.name}
              </MDTypography>
            </MDBox>
          )}
          
          {paymentStatus === 'completed' && (
            <MDBox>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Paiement réussi !
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Votre paiement de {totalAmount} {formData.currency} a été traité avec succès.
              </MDTypography>
            </MDBox>
          )}
          
          {paymentStatus === 'failed' && (
            <MDBox>
              <WarningIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Paiement échoué
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Le paiement n'a pas pu être traité. Veuillez réessayer.
              </MDTypography>
            </MDBox>
          )}
        </DialogContent>
        
        <DialogActions>
          {paymentStatus === 'processing' && (
            <MDButton onClick={processPayment} variant="contained" disabled={loading}>
              Simuler paiement réussi
            </MDButton>
          )}
          {paymentStatus !== 'processing' && (
            <MDButton onClick={() => setConfirmDialogOpen(false)}>
              Fermer
            </MDButton>
          )}
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

SolPaymentForm.propTypes = {
  solData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    organizer: PropTypes.string.isRequired,
    currency: PropTypes.string,
    rules: PropTypes.object
  }).isRequired,
  paymentDue: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    dueDate: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SolPaymentForm;