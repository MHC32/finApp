// src/components/FinApp/JoinSolForm/index.js
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
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// @mui icons
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// FinApp components
import CurrencyDisplay from 'components/FinApp/CurrencyDisplay';

// Configuration des méthodes de recherche
const SEARCH_METHODS = [
  {
    id: 'qr',
    label: 'Scanner un code QR',
    description: 'Scannez le code QR partagé par l\'organisateur',
    icon: QrCodeScannerIcon,
    primary: true
  },
  {
    id: 'link',
    label: 'Lien d\'invitation',
    description: 'Collez le lien reçu par WhatsApp, SMS, etc.',
    icon: LinkIcon,
    primary: true
  },
  {
    id: 'code',
    label: 'Code d\'invitation',
    description: 'Entrez le code à 6 chiffres fourni',
    icon: SearchIcon,
    primary: false
  },
  {
    id: 'search',
    label: 'Rechercher un sol public',
    description: 'Parcourez les sols ouverts dans votre région',
    icon: PeopleIcon,
    primary: false
  }
];

// Mock data pour les sols trouvés
const MOCK_SOLS = [
  {
    id: 'sol_001',
    name: 'Sol Famille Janvier',
    type: 'family',
    organizer: 'Marie Dupont',
    participants: 6,
    maxParticipants: 8,
    amount: 5000,
    currency: 'HTG',
    frequency: 'monthly',
    startDate: '2024-02-01',
    description: 'Sol familial mensuel pour soutien mutuel',
    rules: {
      allowMissPayment: true,
      maxMissedPayments: 1,
      penaltyAmount: 500,
      requireApproval: true
    },
    isPrivate: false,
    region: 'Port-au-Prince'
  },
  {
    id: 'sol_002',
    name: 'Sol Bureau Marketing',
    type: 'work',
    organizer: 'Jean Pierre',
    participants: 10,
    maxParticipants: 12,
    amount: 2000,
    currency: 'HTG',
    frequency: 'weekly',
    startDate: '2024-01-22',
    description: 'Sol hebdomadaire entre collègues',
    rules: {
      allowMissPayment: false,
      requireApproval: false
    },
    isPrivate: true,
    region: 'Pétion-Ville'
  }
];

const STEPS = [
  { label: 'Méthode de recherche', description: 'Comment voulez-vous trouver le sol ?' },
  { label: 'Sol trouvé', description: 'Vérifiez les détails du sol' },
  { label: 'Position dans le sol', description: 'Choisissez votre position préférée' },
  { label: 'Confirmation', description: 'Confirmez votre participation' }
];

function JoinSolForm({
  onSubmit,
  onCancel,
  solId = null, // Si déjà connu (via lien direct)
  disabled = false,
  ...other
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    searchMethod: '',
    searchValue: '',
    selectedSol: null,
    preferredPosition: null,
    agreedToRules: false,
    motivationMessage: '',
    guarantorInfo: null
  });

  const [foundSols, setFoundSols] = useState([]);
  const [availablePositions, setAvailablePositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  // Si solId fourni directement, aller à l'étape 2
  useEffect(() => {
    if (solId) {
      // Simuler la récupération du sol par ID
      const sol = MOCK_SOLS.find(s => s.id === solId);
      if (sol) {
        setFormData(prev => ({ 
          ...prev, 
          selectedSol: sol,
          searchMethod: 'direct'
        }));
        setActiveStep(1);
        generateAvailablePositions(sol);
      }
    }
  }, [solId]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setErrors({});

    try {
      let results = [];

      switch (formData.searchMethod) {
        case 'qr':
          // Scanner QR (simulation)
          setQrScannerOpen(true);
          break;
          
        case 'link':
          if (!formData.searchValue.trim()) {
            setErrors({ searchValue: 'Veuillez coller le lien d\'invitation' });
            return;
          }
          // Extraire l'ID du sol du lien
          const solIdFromLink = extractSolIdFromLink(formData.searchValue);
          results = MOCK_SOLS.filter(sol => sol.id === solIdFromLink);
          break;
          
        case 'code':
          if (!formData.searchValue.trim() || formData.searchValue.length !== 6) {
            setErrors({ searchValue: 'Code d\'invitation invalide (6 chiffres requis)' });
            return;
          }
          // Rechercher par code
          results = MOCK_SOLS.filter(sol => sol.id.includes(formData.searchValue));
          break;
          
        case 'search':
          // Recherche publique (tous les sols non privés)
          results = MOCK_SOLS.filter(sol => !sol.isPrivate);
          break;
      }

      setFoundSols(results);
      
      if (results.length === 0) {
        setErrors({ searchValue: 'Aucun sol trouvé avec ces critères' });
      } else if (results.length === 1) {
        // Auto-sélection si un seul résultat
        handleSolSelect(results[0]);
      }
      
    } catch (error) {
      setErrors({ general: 'Erreur lors de la recherche' });
    } finally {
      setLoading(false);
    }
  };

  const extractSolIdFromLink = (link) => {
    // Simulation d'extraction d'ID depuis un lien
    const match = link.match(/sol\/([^/?]+)/);
    return match ? match[1] : null;
  };

  const handleSolSelect = (sol) => {
    setFormData(prev => ({ ...prev, selectedSol: sol }));
    generateAvailablePositions(sol);
    setActiveStep(1);
  };

  const generateAvailablePositions = (sol) => {
    const occupied = sol.participants;
    const total = sol.maxParticipants;
    const available = [];
    
    for (let i = occupied + 1; i <= total; i++) {
      available.push({
        position: i,
        estimatedDate: calculateEstimatedDate(sol, i),
        isRecommended: i === occupied + 1 // Prochaine position disponible
      });
    }
    
    setAvailablePositions(available);
  };

  const calculateEstimatedDate = (sol, position) => {
    const startDate = new Date(sol.startDate);
    const multipliers = { weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };
    const daysToAdd = (position - 1) * multipliers[sol.frequency];
    
    const estimatedDate = new Date(startDate);
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
    
    return estimatedDate;
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0:
        if (!formData.searchMethod) {
          newErrors.searchMethod = 'Sélectionnez une méthode de recherche';
        }
        if (['link', 'code'].includes(formData.searchMethod) && !formData.searchValue.trim()) {
          newErrors.searchValue = 'Ce champ est requis';
        }
        break;
        
      case 1:
        if (!formData.selectedSol) {
          newErrors.selectedSol = 'Sélectionnez un sol';
        }
        break;
        
      case 2:
        if (!formData.preferredPosition) {
          newErrors.preferredPosition = 'Choisissez une position';
        }
        break;
        
      case 3:
        if (!formData.agreedToRules) {
          newErrors.agreedToRules = 'Vous devez accepter les règles';
        }
        if (formData.selectedSol?.rules?.requireGuarantor && !formData.guarantorInfo) {
          newErrors.guarantorInfo = 'Informations du garant requises';
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
      const joinData = {
        solId: formData.selectedSol.id,
        position: formData.preferredPosition,
        motivationMessage: formData.motivationMessage,
        guarantorInfo: formData.guarantorInfo,
        joinedAt: new Date()
      };

      if (onSubmit) {
        await onSubmit(joinData);
      }
    } catch (error) {
      console.error('Erreur lors de la demande d\'adhésion:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSolTypeIcon = (type) => {
    const icons = {
      family: FamilyRestroomIcon,
      work: WorkIcon,
      investment: TrendingUpIcon,
      student: PersonIcon,
      community: PeopleIcon
    };
    return icons[type] || PeopleIcon;
  };

  const getSolTypeLabel = (type) => {
    const labels = {
      family: 'Familial',
      work: 'Travail',
      investment: 'Investissement',
      student: 'Étudiant',
      community: 'Communautaire'
    };
    return labels[type] || type;
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Méthode de recherche
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Comment voulez-vous trouver le sol ?
            </MDTypography>

            <Grid container spacing={2}>
              {SEARCH_METHODS.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Grid item xs={12} sm={6} key={method.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: formData.searchMethod === method.id ? 'primary.main' : 'grey.200',
                        bgcolor: formData.searchMethod === method.id ? 'primary.50' : 'transparent',
                        position: 'relative',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50'
                        }
                      }}
                      onClick={() => handleFieldChange('searchMethod', method.id)}
                    >
                      {method.primary && (
                        <Chip
                          label="Recommandé"
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        />
                      )}
                      <CardContent>
                        <MDBox display="flex" alignItems="center" mb={1}>
                          <IconComponent sx={{ mr: 2, color: 'primary.main' }} />
                          <MDTypography variant="h6" fontWeight="medium">
                            {method.label}
                          </MDTypography>
                        </MDBox>
                        <MDTypography variant="body2" color="text">
                          {method.description}
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Champ de saisie selon la méthode */}
            {['link', 'code'].includes(formData.searchMethod) && (
              <MDBox mt={3}>
                <MDInput
                  label={formData.searchMethod === 'link' ? 'Lien d\'invitation' : 'Code d\'invitation'}
                  placeholder={formData.searchMethod === 'link' ? 
                    'https://finapp.ht/sol/ABC123...' : 
                    'Entrez le code à 6 chiffres'
                  }
                  value={formData.searchValue}
                  onChange={(e) => handleFieldChange('searchValue', e.target.value)}
                  error={!!errors.searchValue}
                  helperText={errors.searchValue}
                  fullWidth
                />
                
                <MDButton
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ mt: 2 }}
                  startIcon={<SearchIcon />}
                >
                  Rechercher
                </MDButton>
              </MDBox>
            )}

            {formData.searchMethod === 'search' && (
              <MDBox mt={3}>
                <MDButton
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  startIcon={<SearchIcon />}
                >
                  Voir les sols publics disponibles
                </MDButton>
              </MDBox>
            )}

            {/* Résultats de recherche */}
            {foundSols.length > 1 && (
              <MDBox mt={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Sols trouvés ({foundSols.length})
                </MDTypography>
                
                <Grid container spacing={2}>
                  {foundSols.map((sol) => {
                    const IconComponent = getSolTypeIcon(sol.type);
                    return (
                      <Grid item xs={12} key={sol.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onClick={() => handleSolSelect(sol)}
                        >
                          <CardContent>
                            <Grid container alignItems="center" spacing={2}>
                              <Grid item>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  <IconComponent />
                                </Avatar>
                              </Grid>
                              <Grid item xs>
                                <MDTypography variant="h6" fontWeight="medium">
                                  {sol.name}
                                </MDTypography>
                                <MDTypography variant="body2" color="text">
                                  Organisé par {sol.organizer} • {getSolTypeLabel(sol.type)}
                                </MDTypography>
                                <MDBox display="flex" alignItems="center" mt={1}>
                                  <CurrencyDisplay
                                    amount={sol.amount}
                                    currency={sol.currency}
                                    variant="body2"
                                    showTrend={false}
                                  />
                                  <Chip
                                    label={`${sol.participants}/${sol.maxParticipants} participants`}
                                    size="small"
                                    sx={{ ml: 2 }}
                                  />
                                </MDBox>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </MDBox>
            )}
          </MDBox>
        );

      case 1: // Détails du sol trouvé
        if (!formData.selectedSol) return null;
        
        const sol = formData.selectedSol;
        const IconComponent = getSolTypeIcon(sol.type);
        const progress = (sol.participants / sol.maxParticipants) * 100;

        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Détails du sol
            </MDTypography>

            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MDBox display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <IconComponent />
                      </Avatar>
                      <MDBox>
                        <MDTypography variant="h5" fontWeight="medium">
                          {sol.name}
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {getSolTypeLabel(sol.type)} • Organisé par {sol.organizer}
                        </MDTypography>
                      </MDBox>
                    </MDBox>

                    <MDTypography variant="body1" mb={2}>
                      {sol.description}
                    </MDTypography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                        <ListItemText
                          primary={
                            <CurrencyDisplay
                              amount={sol.amount}
                              currency={sol.currency}
                              variant="body1"
                              fontWeight="medium"
                              showTrend={false}
                            />
                          }
                          secondary={`Par ${sol.frequency === 'weekly' ? 'semaine' : 
                                     sol.frequency === 'monthly' ? 'mois' : 'période'}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText
                          primary={`${sol.participants} / ${sol.maxParticipants} participants`}
                          secondary={`${sol.maxParticipants - sol.participants} places disponibles`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><ScheduleIcon /></ListItemIcon>
                        <ListItemText
                          primary={`Début: ${new Date(sol.startDate).toLocaleDateString('fr-FR')}`}
                          secondary={`Durée estimée: ${sol.maxParticipants} ${sol.frequency === 'weekly' ? 'semaines' : 'mois'}`}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Progression
                    </MDTypography>
                    
                    <MDBox mb={2}>
                      <MDBox display="flex" justifyContent="space-between" mb={1}>
                        <MDTypography variant="body2">Participants</MDTypography>
                        <MDTypography variant="body2">{progress.toFixed(0)}%</MDTypography>
                      </MDBox>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </MDBox>

                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Règles du sol
                    </MDTypography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          {sol.rules.allowMissPayment ? 
                            <CheckCircleIcon color="success" /> : 
                            <WarningIcon color="warning" />
                          }
                        </ListItemIcon>
                        <ListItemText
                          primary={sol.rules.allowMissPayment ? 
                            'Paiements manqués autorisés' : 
                            'Paiements manqués non autorisés'
                          }
                          secondary={sol.rules.allowMissPayment && sol.rules.penaltyAmount ? 
                            `Pénalité: ${sol.rules.penaltyAmount} ${sol.currency}` : 
                            null
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {sol.rules.requireApproval ? 
                            <InfoIcon color="info" /> : 
                            <CheckCircleIcon color="success" />
                          }
                        </ListItemIcon>
                        <ListItemText
                          primary={sol.rules.requireApproval ? 
                            'Approbation requise pour rejoindre' : 
                            'Adhésion automatique'
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </MDBox>
        );

      case 2: // Choix de position
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Choisissez votre position dans le sol
            </MDTypography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Votre position détermine quand vous recevrez le montant total. 
              Plus votre position est proche, plus vous recevrez rapidement.
            </Alert>

            <Grid container spacing={2}>
              {availablePositions.map((pos) => (
                <Grid item xs={12} sm={6} md={4} key={pos.position}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.preferredPosition === pos.position ? 'primary.main' : 'grey.200',
                      bgcolor: formData.preferredPosition === pos.position ? 'primary.50' : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50'
                      }
                    }}
                    onClick={() => handleFieldChange('preferredPosition', pos.position)}
                  >
                    {pos.isRecommended && (
                      <Chip
                        label="Recommandé"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                    <CardContent sx={{ textAlign: 'center' }}>
                      <MDTypography variant="h4" fontWeight="bold" color="primary">
                        {pos.position}
                      </MDTypography>
                      <MDTypography variant="body2" color="text" mb={1}>
                        Position {pos.position}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Réception estimée:<br/>
                        {pos.estimatedDate.toLocaleDateString('fr-FR')}
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </MDBox>
        );

      case 3: // Confirmation
        return (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Confirmation de votre adhésion
            </MDTypography>

            <Alert severity="success" sx={{ mb: 3 }}>
              <MDTypography variant="body2" fontWeight="medium">
                Résumé de votre adhésion:
              </MDTypography>
              <MDTypography variant="caption" component="div">
                • Sol: {formData.selectedSol.name}<br/>
                • Position: {formData.preferredPosition}<br/>
                • Montant par paiement: {formData.selectedSol.amount} {formData.selectedSol.currency}<br/>
                • Vous recevrez: {formData.selectedSol.amount * formData.selectedSol.maxParticipants} {formData.selectedSol.currency}<br/>
                • Date estimée: {availablePositions.find(p => p.position === formData.preferredPosition)?.estimatedDate.toLocaleDateString('fr-FR')}
              </MDTypography>
            </Alert>

            <MDInput
              label="Message de motivation (optionnel)"
              placeholder="Expliquez pourquoi vous voulez rejoindre ce sol..."
              value={formData.motivationMessage}
              onChange={(e) => handleFieldChange('motivationMessage', e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />

            {formData.selectedSol?.rules?.requireGuarantor && (
              <MDBox mt={2}>
                <MDTypography variant="body1" fontWeight="medium" mb={1}>
                  Informations du garant
                </MDTypography>
                <MDInput
                  label="Nom complet du garant"
                  value={formData.guarantorInfo?.name || ''}
                  onChange={(e) => handleFieldChange('guarantorInfo', {
                    ...formData.guarantorInfo,
                    name: e.target.value
                  })}
                  error={!!errors.guarantorInfo}
                  helperText={errors.guarantorInfo}
                  fullWidth
                  margin="normal"
                />
                <MDInput
                  label="Téléphone du garant"
                  value={formData.guarantorInfo?.phone || ''}
                  onChange={(e) => handleFieldChange('guarantorInfo', {
                    ...formData.guarantorInfo,
                    phone: e.target.value
                  })}
                  fullWidth
                  margin="normal"
                />
              </MDBox>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreedToRules}
                  onChange={(e) => handleFieldChange('agreedToRules', e.target.checked)}
                />
              }
              label={
                <MDTypography variant="body2">
                  J'accepte les règles et conditions de ce sol et je m'engage à respecter 
                  les paiements selon la fréquence établie.
                </MDTypography>
              }
            />

            {errors.agreedToRules && (
              <MDTypography variant="caption" color="error" display="block" mt={1}>
                {errors.agreedToRules}
              </MDTypography>
            )}

            {formData.selectedSol?.rules?.requireApproval && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Votre demande sera soumise à l'organisateur pour approbation. 
                Vous recevrez une notification de la décision.
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
              Rejoindre un sol
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Trouvez et rejoignez un sol/tontine existant
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
                      disabled={loading || (index === 0 && !formData.searchMethod) || 
                               (index === 1 && !formData.selectedSol)}
                      loading={loading && index === STEPS.length - 1}
                    >
                      {index === STEPS.length - 1 ? 'Confirmer l\'adhésion' : 'Suivant'}
                    </MDButton>
                  </MDBox>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Dialog Scanner QR (simulation) */}
      <Dialog open={qrScannerOpen} onClose={() => setQrScannerOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <QrCodeScannerIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <MDTypography variant="h6" fontWeight="medium" mb={1}>
            Scanner de code QR
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={3}>
            Pointez votre caméra vers le code QR du sol
          </MDTypography>
          
          {/* Simulation de scan réussi */}
          <MDButton 
            variant="contained" 
            onClick={() => {
              setQrScannerOpen(false);
              handleSolSelect(MOCK_SOLS[0]); // Simuler un sol trouvé
            }}
          >
            Simuler scan réussi
          </MDButton>
        </DialogContent>
      </Dialog>
    </MDBox>
  );
}

JoinSolForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  solId: PropTypes.string, // ID du sol si accès direct
  disabled: PropTypes.bool,
};

export default JoinSolForm;