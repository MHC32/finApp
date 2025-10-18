// src/examples/InputExamples.jsx
import { useState } from 'react';
import Input from '../components/ui/Input';
import { 
  User, 
  Mail, 
  Lock, 
  Phone,
  Search,
  DollarSign,
  Calendar,
  MapPin,
  CreditCard,
  Building2
} from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Input
 * Tous les types, états et configurations possibles
 * Avec nouvelle palette Teal 🌊
 */
const InputExamples = () => {
  // États pour les inputs contrôlés
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    amount: '',
    search: '',
  });

  // États pour validation
  const [errors, setErrors] = useState({});
  const [successes, setSuccesses] = useState({});

  // Handler générique
  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Simuler une validation
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'L\'email est requis' }));
    } else if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Format d\'email invalide' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
      setSuccesses(prev => ({ ...prev, email: 'Email valide !' }));
    }
  };

  const validatePassword = () => {
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Le mot de passe est requis' }));
    } else if (formData.password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Minimum 8 caractères requis' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
      setSuccesses(prev => ({ ...prev, password: 'Mot de passe fort !' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Input Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tous les exemples du composant Input avec palette Teal 🌊
          </p>
        </div>

        {/* Info nouvelle palette */}
        <div className="mb-8 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <p className="text-sm text-teal-800 dark:text-teal-200">
            ✨ <strong>Nouvelle palette appliquée !</strong> Les bordures et icônes en focus utilisent maintenant le <strong>Teal Turquoise 🌊</strong> (#0d9488)
          </p>
        </div>

        {/* Section 1 : Types de base */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            1. Types de base
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text */}
            <Input
              type="text"
              label="Nom d'utilisateur"
              placeholder="Entrez votre nom"
              leftIcon={User}
              helperText="Focus = bordure Teal 🌊"
            />

            {/* Email */}
            <Input
              type="email"
              label="Email"
              placeholder="exemple@email.com"
              leftIcon={Mail}
              helperText="Icône change en Teal au focus"
            />

            {/* Password */}
            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              leftIcon={Lock}
              helperText="Toggle œil en Teal au hover"
            />

            {/* Tel */}
            <Input
              type="tel"
              label="Téléphone"
              placeholder="+509 1234 5678"
              leftIcon={Phone}
              helperText="Format: +509 XXXX XXXX"
            />

            {/* Number */}
            <Input
              type="number"
              label="Montant"
              placeholder="0.00"
              leftIcon={DollarSign}
              helperText="Montant en HTG ou USD"
              min={0}
              step="0.01"
            />

            {/* Search */}
            <Input
              type="search"
              label="Recherche"
              placeholder="Rechercher une transaction..."
              leftIcon={Search}
            />

            {/* Date */}
            <Input
              type="date"
              label="Date de transaction"
              leftIcon={Calendar}
            />

            {/* URL */}
            <Input
              type="url"
              label="Site web"
              placeholder="https://example.com"
              helperText="URL complète avec https://"
            />
          </div>
        </section>

        {/* Section 2 : Tailles */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            2. Tailles (sm, md, lg)
          </h2>
          
          <div className="space-y-4">
            <Input
              size="sm"
              label="Small"
              placeholder="Small input - focus pour voir le Teal"
              leftIcon={User}
            />
            
            <Input
              size="md"
              label="Medium (défaut)"
              placeholder="Medium input - focus pour voir le Teal"
              leftIcon={User}
            />
            
            <Input
              size="lg"
              label="Large"
              placeholder="Large input - focus pour voir le Teal"
              leftIcon={User}
            />
          </div>
        </section>

        {/* Section 3 : États et validation */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            3. États et validation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email avec validation */}
            <Input
              type="email"
              label="Email (test validation)"
              placeholder="test@example.com"
              leftIcon={Mail}
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={validateEmail}
              error={errors.email}
              success={successes.email}
              helperText="Tapez un email et sortez du champ"
            />

            {/* Password avec validation */}
            <Input
              type="password"
              label="Mot de passe (test validation)"
              placeholder="Min 8 caractères"
              leftIcon={Lock}
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={validatePassword}
              error={errors.password}
              success={successes.password}
              helperText="Minimum 8 caractères requis"
            />

            {/* Erreur statique */}
            <Input
              type="text"
              label="Avec erreur"
              placeholder="Input invalide"
              leftIcon={User}
              error="Ce champ contient une erreur"
            />

            {/* Succès statique */}
            <Input
              type="text"
              label="Avec succès"
              placeholder="Input valide"
              leftIcon={Mail}
              success="Validation réussie !"
            />

            {/* Disabled */}
            <Input
              type="text"
              label="Désactivé"
              placeholder="Input désactivé"
              leftIcon={Lock}
              disabled
              value="Valeur désactivée"
            />

            {/* Read only */}
            <Input
              type="text"
              label="Lecture seule"
              placeholder="Lecture seule"
              leftIcon={CreditCard}
              readOnly
              value="5234 **** **** 8901"
            />
          </div>
        </section>

        {/* Section 4 : Démonstration Focus Teal */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            4. Démonstration Focus Teal 🌊
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
              <p className="text-sm text-teal-800 dark:text-teal-200 mb-4">
                ✨ Cliquez dans un champ ci-dessous pour voir les effets :
              </p>
              <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-1 mb-4">
                <li>• Bordure devient <strong>Teal Turquoise</strong></li>
                <li>• Ring/glow en <strong>Teal transparent</strong></li>
                <li>• Icône gauche change en <strong>Teal</strong></li>
                <li>• Hover sur bordure = <strong>Teal clair</strong></li>
              </ul>
            </div>

            <Input
              type="text"
              placeholder="Cliquez ici pour voir la bordure Teal"
              leftIcon={User}
              size="lg"
            />

            <Input
              type="email"
              placeholder="L'icône Mail devient Teal au focus"
              leftIcon={Mail}
              size="lg"
            />

            <Input
              type="search"
              placeholder="Recherche avec effet Teal"
              leftIcon={Search}
              size="lg"
            />
          </div>
        </section>

        {/* Section 5 : Avec icônes */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            5. Avec icônes (Teal au focus)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icône gauche */}
            <Input
              type="text"
              label="Icône à gauche"
              placeholder="Votre nom"
              leftIcon={User}
              helperText="Icône devient Teal au focus"
            />

            {/* Icône droite custom */}
            <Input
              type="text"
              label="Icône à droite"
              placeholder="Ville"
              rightIcon={MapPin}
              helperText="Icône droite aussi en Teal"
            />

            {/* Sans icône */}
            <Input
              type="text"
              label="Sans icône"
              placeholder="Texte simple"
              helperText="Juste la bordure Teal"
            />

            {/* Password avec toggle auto */}
            <Input
              type="password"
              label="Password (toggle Teal)"
              placeholder="Votre mot de passe"
              leftIcon={Lock}
              helperText="Hover sur l'œil = Teal"
            />
          </div>
        </section>

        {/* Section 6 : Champs requis */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            6. Champs requis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              label="Nom complet"
              placeholder="Jean Dupont"
              leftIcon={User}
              required
            />

            <Input
              type="email"
              label="Email professionnel"
              placeholder="email@entreprise.com"
              leftIcon={Mail}
              required
            />

            <Input
              type="password"
              label="Nouveau mot de passe"
              placeholder="••••••••"
              leftIcon={Lock}
              required
              helperText="Minimum 8 caractères"
            />

            <Input
              type="tel"
              label="Téléphone mobile"
              placeholder="+509 1234 5678"
              leftIcon={Phone}
              required
            />
          </div>
        </section>

        {/* Section 7 : Full Width */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            7. Full Width
          </h2>
          
          <div className="space-y-4">
            <Input
              type="text"
              label="Nom de l'entreprise"
              placeholder="FinApp Haiti S.A."
              leftIcon={Building2}
              fullWidth
            />

            <Input
              type="text"
              label="Adresse complète"
              placeholder="12 Rue de la Paix, Port-au-Prince"
              leftIcon={MapPin}
              fullWidth
              helperText="Adresse physique de l'entreprise"
            />

            <Input
              type="search"
              placeholder="Rechercher dans toutes les transactions..."
              leftIcon={Search}
              fullWidth
              size="lg"
            />
          </div>
        </section>

        {/* Section 8 : Formulaire réaliste */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            8. Exemple de formulaire
          </h2>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                name="firstName"
                label="Prénom"
                placeholder="Jean"
                leftIcon={User}
                required
              />

              <Input
                type="text"
                name="lastName"
                label="Nom de famille"
                placeholder="Dupont"
                leftIcon={User}
                required
              />
            </div>

            <Input
              type="email"
              name="email"
              label="Adresse email"
              placeholder="jean.dupont@email.com"
              leftIcon={Mail}
              required
              fullWidth
            />

            <Input
              type="tel"
              name="phone"
              label="Numéro de téléphone"
              placeholder="+509 1234 5678"
              leftIcon={Phone}
              fullWidth
            />

            <Input
              type="password"
              name="password"
              label="Mot de passe"
              placeholder="••••••••"
              leftIcon={Lock}
              required
              fullWidth
              helperText="Minimum 8 caractères avec majuscule et chiffre"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              leftIcon={Lock}
              required
              fullWidth
            />

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="
                  px-8 py-3
                  bg-haiti-blue hover:bg-blue-700
                  text-white font-medium
                  rounded-lg
                  transition-colors
                "
              >
                Créer mon compte
              </button>
              <button
                type="button"
                className="
                  px-8 py-3
                  bg-haiti-teal hover:bg-teal-700
                  text-white font-medium
                  rounded-lg
                  transition-colors
                "
              >
                Action secondaire
              </button>
            </div>
          </form>
        </section>

        {/* Section 9 : Inputs spécialisés Haiti */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            9. Inputs spécialisés Haiti 🇭🇹
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Montant HTG */}
            <Input
              type="number"
              label="Montant en Gourdes (HTG)"
              placeholder="0.00"
              leftIcon={DollarSign}
              min={0}
              step="0.01"
              helperText="Monnaie locale haïtienne"
            />

            {/* Montant USD */}
            <Input
              type="number"
              label="Montant en Dollars (USD)"
              placeholder="0.00"
              leftIcon={DollarSign}
              min={0}
              step="0.01"
              helperText="Devise étrangère"
            />

            {/* Téléphone Haiti */}
            <Input
              type="tel"
              label="Téléphone Haïti"
              placeholder="+509 3456 7890"
              leftIcon={Phone}
              pattern="^\+509\s?\d{4}\s?\d{4}$"
              helperText="Format: +509 XXXX XXXX"
            />

            {/* MonCash */}
            <Input
              type="tel"
              label="Numéro MonCash"
              placeholder="509 XXXX XXXX"
              leftIcon={CreditCard}
              helperText="Portefeuille mobile MonCash"
            />
          </div>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Palette Teal 🌊
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ Support automatique Light/Dark mode</li>
            <li>✅ Toggle password visibility intégré (type="password")</li>
            <li>✅ Icônes d'état automatiques (error/success)</li>
            <li>✅ Label avec astérisque rouge si required</li>
            <li>✅ Messages d'aide, erreur et succès</li>
            <li>✅ Validation HTML5 native (pattern, min, max, etc.)</li>
            <li>✅ Accessibilité ARIA complète</li>
            <li>✅ forwardRef pour refs React</li>
            <li>🌊 <strong>Focus borders et icônes en Teal Turquoise (#0d9488)</strong></li>
            <li>🇭🇹 Couleurs Haiti pour une app authentiquement haïtienne</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default InputExamples;