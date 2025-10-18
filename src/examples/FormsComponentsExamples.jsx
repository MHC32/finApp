import { useState } from 'react';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';
import FormTextarea from '../components/forms/FormTextarea';
import FormCheckbox from '../components/forms/FormCheckbox';
import FormDatePicker from '../components/forms/FormDatePicker';
import FormCurrencyInput from '../components/forms/FormCurrencyInput';
import Button from '../components/ui/Button';
import { Mail, Lock, User, Phone } from 'lucide-react';

/**
 * Page d'exemples - Composants Forms
 * 
 * Démontre tous les wrappers de formulaires
 */
const FormsComponentsExamples = () => {
  // États du formulaire exemple
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bank: null,
    category: null,
    description: '',
    acceptTerms: false,
    newsletter: true,
    date: '',
    amount: '',
    currency: 'HTG'
  });

  const [errors, setErrors] = useState({});

  // Options pour les selects
  const bankOptions = [
    { value: 'buh', label: 'BUH' },
    { value: 'sogebank', label: 'Sogebank' },
    { value: 'bnc', label: 'BNC' },
    { value: 'unibank', label: 'Unibank' }
  ];

  const categoryOptions = [
    { value: 'food', label: '🍔 Alimentation' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'housing', label: '🏠 Logement' },
    { value: 'health', label: '⚕️ Santé' },
    { value: 'entertainment', label: '🎬 Loisirs' }
  ];

  // Gérer changement champs
  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation simple
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Au moins 8 caractères';
    if (!formData.bank) newErrors.bank = 'Veuillez sélectionner une banque';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions';
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.amount) newErrors.amount = 'Le montant est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form valid:', formData);
      alert('Formulaire valide ! Voir console pour les données.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Forms Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Wrappers de formulaires avec validation intégrée
          </p>
        </div>

        {/* Formulaire Complet */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📝 Formulaire Exemple Complet
          </h2>

          <div className="space-y-6">
            {/* Section Informations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Informations personnelles
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label="Nom complet"
                  name="name"
                  type="text"
                  icon={User}
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => handleChange('name')(e.target.value)}
                  error={errors.name}
                  required
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="jean@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email')(e.target.value)}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  placeholder="+509 1234 5678"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone')(e.target.value)}
                  helperText="Format : +509 XXXX XXXX"
                  optional
                />

                <FormInput
                  label="Mot de passe"
                  name="password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password')(e.target.value)}
                  error={errors.password}
                  helperText="Minimum 8 caractères"
                  required
                />
              </div>
            </div>

            {/* Section Transaction */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Détails de la transaction
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <FormSelect
                  label="Banque"
                  name="bank"
                  options={bankOptions}
                  value={formData.bank}
                  onChange={handleChange('bank')}
                  placeholder="Sélectionner une banque"
                  error={errors.bank}
                  searchable
                  clearable
                  required
                />

                <FormSelect
                  label="Catégorie"
                  name="category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={handleChange('category')}
                  placeholder="Sélectionner une catégorie"
                  searchable
                  optional
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormDatePicker
                  label="Date de transaction"
                  name="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date')(e.target.value)}
                  error={errors.date}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />

                <FormCurrencyInput
                  label="Montant"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange('amount')}
                  currency={formData.currency}
                  onCurrencyChange={handleChange('currency')}
                  error={errors.amount}
                  placeholder="0.00"
                  allowNegative
                  required
                />
              </div>

              <FormTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange('description')(e.target.value)}
                placeholder="Décrivez la transaction..."
                rows={4}
                maxLength={500}
                showCount
                helperText="Description optionnelle de la transaction"
                optional
              />
            </div>

            {/* Section Conditions */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <FormCheckbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange('acceptTerms')}
                label="J'accepte les conditions d'utilisation"
                description="En cochant, vous acceptez nos CGU et politique de confidentialité"
                error={errors.acceptTerms}
                required
              />

              <FormCheckbox
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange('newsletter')}
                label="Recevoir la newsletter"
                description="Recevez nos actualités et conseils financiers"
                color="blue"
              />
            </div>

            {/* Boutons */}
            <div className="flex items-center gap-4 pt-4">
              <Button onClick={handleSubmit} size="lg" className="flex-1">
                Soumettre le formulaire
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    bank: null,
                    category: null,
                    description: '',
                    acceptTerms: false,
                    newsletter: true,
                    date: '',
                    amount: '',
                    currency: 'HTG'
                  });
                  setErrors({});
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>

        {/* Exemples individuels */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* FormInput */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              1️⃣ FormInput
            </h3>
            <div className="space-y-4">
              <FormInput
                label="Input Normal"
                placeholder="Saisir du texte"
                helperText="Texte d'aide"
              />
              <FormInput
                label="Input Required"
                placeholder="Champ obligatoire"
                required
              />
              <FormInput
                label="Input avec Erreur"
                value="valeur@invalide"
                error="Format email invalide"
                required
              />
              <FormInput
                label="Input Disabled"
                value="Champ désactivé"
                disabled
              />
            </div>
          </div>

          {/* FormSelect */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              2️⃣ FormSelect
            </h3>
            <div className="space-y-4">
              <FormSelect
                label="Select Normal"
                options={bankOptions}
                placeholder="Choisir..."
              />
              <FormSelect
                label="Select Required"
                options={bankOptions}
                placeholder="Obligatoire"
                required
              />
              <FormSelect
                label="Select avec Erreur"
                options={bankOptions}
                error="Sélection requise"
                required
              />
            </div>
          </div>

          {/* FormTextarea */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              3️⃣ FormTextarea
            </h3>
            <FormTextarea
              label="Textarea avec compteur"
              placeholder="Écrivez quelque chose..."
              maxLength={200}
              showCount
              rows={3}
            />
            <FormTextarea
              label="Avec Erreur"
              value="Texte invalide"
              error="Le texte est trop court"
              rows={2}
              required
            />
          </div>

          {/* FormCheckbox */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              4️⃣ FormCheckbox
            </h3>
            <div className="space-y-3">
              <FormCheckbox
                label="Checkbox Normal"
                description="Description optionnelle"
              />
              <FormCheckbox
                label="Checkbox Required"
                description="Ce champ est obligatoire"
                required
              />
              <FormCheckbox
                label="Checkbox avec Erreur"
                error="Vous devez accepter"
                required
              />
            </div>
          </div>

          {/* FormDatePicker */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              5️⃣ FormDatePicker
            </h3>
            <div className="space-y-4">
              <FormDatePicker
                label="Date Normal"
                helperText="Sélectionnez une date"
              />
              <FormDatePicker
                label="Date Required"
                required
              />
              <FormDatePicker
                label="Date avec Erreur"
                error="Date invalide"
                required
              />
            </div>
          </div>

          {/* FormCurrencyInput */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              6️⃣ FormCurrencyInput
            </h3>
            <div className="space-y-4">
              <FormCurrencyInput
                label="Montant HTG"
                placeholder="0.00"
                currency="HTG"
              />
              <FormCurrencyInput
                label="Montant USD"
                placeholder="0.00"
                currency="USD"
              />
              <FormCurrencyInput
                label="Avec Erreur"
                error="Montant requis"
                required
              />
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Exemple de Code
          </h2>
          <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import FormInput from './components/forms/FormInput';
import FormSelect from './components/forms/FormSelect';
import FormCurrencyInput from './components/forms/FormCurrencyInput';

const [formData, setFormData] = useState({
  name: '',
  bank: null,
  amount: '',
  currency: 'HTG'
});
const [errors, setErrors] = useState({});

<div>
  <FormInput
    label="Nom complet"
    name="name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    error={errors.name}
    required
  />

  <FormSelect
    label="Banque"
    name="bank"
    options={bankOptions}
    value={formData.bank}
    onChange={(value) => setFormData({ ...formData, bank: value })}
    error={errors.bank}
    searchable
    required
  />

  <FormCurrencyInput
    label="Montant"
    name="amount"
    value={formData.amount}
    onChange={(value) => setFormData({ ...formData, amount: value })}
    currency={formData.currency}
    onCurrencyChange={(curr) => setFormData({ ...formData, currency: curr })}
    error={errors.amount}
    required
  />

  <Button onClick={handleSubmit}>Soumettre</Button>
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FormsComponentsExamples;