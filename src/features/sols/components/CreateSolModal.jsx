// src/features/sols/components/CreateSolModal.jsx
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Users, 
  DollarSign, 
  Calendar,
  Info,
  Plus,
  X,
  ArrowRight
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormCurrencyInput from '../../../components/forms/FormCurrencyInput';
import FormTextarea from '../../../components/forms/FormTextarea';
import Switch from '../../../components/ui/Switch';
import Badge from '../../../components/ui/Badge';
import Alert from '../../../components/ui/Alert';

/**
 * Composant CreateSolModal - Modal de création d'un nouveau sol
 * 
 * Features:
 * - Formulaire complet avec validation
 * - Prévisualisation en temps réel
 * - Templates de sols
 * - Calculs automatiques (durée, montant total)
 * - Support multi-langues (Français/Créole)
 * 
 * @example
 * <CreateSolModal
 *   isOpen={showCreateModal}
 *   onClose={handleClose}
 *   onCreate={handleCreateSol}
 *   supportedData={supportedData}
 * />
 */
const CreateSolModal = forwardRef(({
  isOpen = false,
  onClose = () => {},
  onCreate = () => {},
  supportedData = {},
  loading = false,
  className = ''
}, ref) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'classic',
    contributionAmount: '',
    currency: 'HTG',
    maxParticipants: 8,
    frequency: 'monthly',
    startDate: '',
    duration: '',
    paymentDay: 1,
    interestRate: 0,
    tags: [],
    isPrivate: false,
    rules: []
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [customRule, setCustomRule] = useState('');

  // Données supportées avec fallback
  const {
    solTypes = [
      { value: 'classic', label: 'Sol Classique' },
      { value: 'business', label: 'Sol Business' },
      { value: 'emergency', label: 'Sol Urgence' },
      { value: 'project', label: 'Sol Projet' },
      { value: 'savings', label: 'Sol Épargne' }
    ],
    frequencies = [
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'biweekly', label: 'Bi-hebdomadaire' },
      { value: 'monthly', label: 'Mensuel' },
      { value: 'quarterly', label: 'Trimestriel' }
    ]
  } = supportedData;

  // Calculs dérivés
  const totalAmount = formData.contributionAmount && formData.maxParticipants
    ? formData.contributionAmount * formData.maxParticipants
    : 0;

  const estimatedDuration = formData.maxParticipants && formData.frequency
    ? calculateEstimatedDuration(formData.maxParticipants, formData.frequency)
    : '';

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du sol est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.contributionAmount || formData.contributionAmount < 100) {
      newErrors.contributionAmount = 'La contribution minimum est de 100';
    }

    if (!formData.maxParticipants || formData.maxParticipants < 3) {
      newErrors.maxParticipants = 'Minimum 3 participants requis';
    } else if (formData.maxParticipants > 20) {
      newErrors.maxParticipants = 'Maximum 20 participants autorisés';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    } else if (new Date(formData.startDate) <= new Date()) {
      newErrors.startDate = 'La date de début doit être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error quand l'utilisateur corrige
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Ajouter une règle
  const handleAddRule = () => {
    if (customRule.trim() && !formData.rules.includes(customRule.trim())) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, customRule.trim()]
      }));
      setCustomRule('');
    }
  };

  // Supprimer une règle
  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreate(formData);
    }
  };

  // Reset du formulaire
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: 'classic',
      contributionAmount: '',
      currency: 'HTG',
      maxParticipants: 8,
      frequency: 'monthly',
      startDate: '',
      duration: '',
      paymentDay: 1,
      interestRate: 0,
      tags: [],
      isPrivate: false,
      rules: []
    });
    setErrors({});
    setCurrentStep(1);
    setCustomRule('');
    onClose();
  };

  // Étapes suivante/précédente
  const nextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title="Créer un nouveau Sol"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge variant="subtle" color="teal">
              Étape {currentStep}/2
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={loading}
              >
                Retour
              </Button>
            )}
            
            {currentStep === 1 ? (
              <Button
                onClick={nextStep}
                rightIcon={ArrowRight}
                disabled={loading}
              >
                Continuer
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                Créer le Sol
              </Button>
            )}
          </div>
        </div>
      }
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1: Informations de base */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Créez votre sol en quelques étapes"
              description="Remplissez les informations de base pour démarrer votre tontine"
              size="sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nom du Sol"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="ex: Sol Business Entrepreneurs"
                error={errors.name}
                required
                leftIcon={Users}
              />

              <FormSelect
                label="Type de Sol"
                name="type"
                options={solTypes}
                value={formData.type}
                onChange={(value) => handleChange('type', value)}
                error={errors.type}
                required
              />
            </div>

            <FormTextarea
              label="Description (optionnel)"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez l'objectif de ce sol..."
              rows={3}
              maxLength={500}
              showCount
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormCurrencyInput
                label="Contribution"
                name="contributionAmount"
                value={formData.contributionAmount}
                onChange={(value) => handleChange('contributionAmount', value)}
                currency={formData.currency}
                onCurrencyChange={(value) => handleChange('currency', value)}
                placeholder="5000"
                error={errors.contributionAmount}
                required
              />

              <FormInput
                label="Nombre de participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
                min={3}
                max={20}
                error={errors.maxParticipants}
                required
                leftIcon={Users}
              />

              <FormSelect
                label="Fréquence"
                name="frequency"
                options={frequencies}
                value={formData.frequency}
                onChange={(value) => handleChange('frequency', value)}
                error={errors.frequency}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Date de début"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                error={errors.startDate}
                required
                leftIcon={Calendar}
              />

              <FormInput
                label="Jour de paiement"
                name="paymentDay"
                type="number"
                value={formData.paymentDay}
                onChange={(e) => handleChange('paymentDay', parseInt(e.target.value))}
                min={1}
                max={31}
                error={errors.paymentDay}
                helperText="Jour du mois pour les paiements"
              />
            </div>

            {/* Prévisualisation rapide */}
            <Card variant="subtle" className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Aperçu du Sol
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Montant total:</span>
                  <p className="font-semibold">{totalAmount.toLocaleString()} {formData.currency}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Durée estimée:</span>
                  <p className="font-semibold">{estimatedDuration}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Étape 2: Configuration avancée */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <Alert
              type="info"
              variant="subtle"
              title="Personnalisation avancée"
              description="Configurez les options supplémentaires pour votre sol"
              size="sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Taux d'intérêt (%)"
                name="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={(e) => handleChange('interestRate', parseFloat(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                helperText="Taux d'intérêt annuel optionnel"
                leftIcon={DollarSign}
              />

              <FormInput
                label="Durée (mois)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                min={1}
                max={36}
                helperText="Durée optionnelle en mois"
                leftIcon={Calendar}
              />
            </div>

            {/* Règles du sol */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Règles du Sol
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <FormInput
                    value={customRule}
                    onChange={(e) => setCustomRule(e.target.value)}
                    placeholder="Ajouter une règle..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRule();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddRule}
                    disabled={!customRule.trim()}
                    leftIcon={Plus}
                  >
                    Ajouter
                  </Button>
                </div>

                {/* Liste des règles */}
                {formData.rules.length > 0 && (
                  <div className="space-y-2">
                    {formData.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {rule}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRule(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Options de confidentialité */}
            <div className="space-y-3">
              <Switch
                checked={formData.isPrivate}
                onChange={(checked) => handleChange('isPrivate', checked)}
                label="Sol privé"
                description="Seuls les utilisateurs invités peuvent rejoindre ce sol"
                size="md"
              />
            </div>

            {/* Résumé final */}
            <Card variant="teal" className="p-4">
              <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-3">
                Récapitulatif
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-teal-700 dark:text-teal-300">Nom:</span>
                  <p className="font-semibold text-teal-900 dark:text-teal-100">{formData.name}</p>
                </div>
                <div>
                  <span className="text-teal-700 dark:text-teal-300">Type:</span>
                  <p className="font-semibold text-teal-900 dark:text-teal-100 capitalize">
                    {solTypes.find(t => t.value === formData.type)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-teal-700 dark:text-teal-300">Contribution:</span>
                  <p className="font-semibold text-teal-900 dark:text-teal-100">
                    {formData.contributionAmount} {formData.currency} / {formData.frequency}
                  </p>
                </div>
                <div>
                  <span className="text-teal-700 dark:text-teal-300">Participants:</span>
                  <p className="font-semibold text-teal-900 dark:text-teal-100">
                    {formData.maxParticipants} membres
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-teal-700 dark:text-teal-300">Montant total:</span>
                  <p className="font-semibold text-teal-900 dark:text-teal-100 text-lg">
                    {totalAmount.toLocaleString()} {formData.currency}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </form>
    </Modal>
  );
});

CreateSolModal.displayName = 'CreateSolModal';

// Helper function pour calculer la durée estimée
function calculateEstimatedDuration(participants, frequency) {
  const durationPerRound = {
    weekly: 1,
    biweekly: 2,
    monthly: 4,
    quarterly: 12
  };

  const totalWeeks = participants * (durationPerRound[frequency] || 4);
  const months = Math.ceil(totalWeeks / 4);
  
  if (months < 12) {
    return `${months} mois`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} an${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} mois` : ''}`;
  }
}

CreateSolModal.propTypes = {
  /** Modal ouvert ou fermé */
  isOpen: PropTypes.bool.isRequired,
  
  /** Fonction de fermeture */
  onClose: PropTypes.func.isRequired,
  
  /** Fonction de création */
  onCreate: PropTypes.func.isRequired,
  
  /** Données supportées (types, fréquences) */
  supportedData: PropTypes.shape({
    solTypes: PropTypes.array,
    frequencies: PropTypes.array
  }),
  
  /** État de chargement */
  loading: PropTypes.bool,
  
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default CreateSolModal;