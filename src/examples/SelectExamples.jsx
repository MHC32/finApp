import { useState } from 'react';
import Select from '../components/ui/Select';
import { Building2, CreditCard, DollarSign, Tag } from 'lucide-react';

/**
 * Page d'exemples - Composant Select
 * 
 * Démontre toutes les fonctionnalités du composant Select
 */
const SelectExamples = () => {
  // États pour les exemples
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('htg');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Options de données
  const banksOptions = [
    { value: 'buh', label: 'BUH (Banque de l\'Union Haïtienne)' },
    { value: 'sogebank', label: 'Sogebank' },
    { value: 'bnc', label: 'BNC (Banque Nationale de Crédit)' },
    { value: 'unibank', label: 'Unibank' },
    { value: 'capital', label: 'Capital Bank' },
    { value: 'citibank', label: 'Citibank N.A Haiti' }
  ];

  const accountsOptions = [
    { value: 'checking', label: 'Compte Courant' },
    { value: 'savings', label: 'Compte Épargne' },
    { value: 'moncash', label: 'MonCash' },
    { value: 'natcash', label: 'NatCash' },
    { value: 'cash', label: 'Espèces' }
  ];

  const currencyOptions = [
    { value: 'htg', label: 'HTG - Gourde Haïtienne' },
    { value: 'usd', label: 'USD - Dollar Américain' }
  ];

  const categoriesOptions = [
    { value: 'food', label: '🍔 Alimentation' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'housing', label: '🏠 Logement' },
    { value: 'health', label: '⚕️ Santé' },
    { value: 'education', label: '📚 Éducation' },
    { value: 'entertainment', label: '🎬 Loisirs' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'utilities', label: '💡 Services' }
  ];

  const countriesOptions = [
    { value: 'ht', label: '🇭🇹 Haïti' },
    { value: 'us', label: '🇺🇸 États-Unis' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'fr', label: '🇫🇷 France' },
    { value: 'do', label: '🇩🇴 République Dominicaine' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Select Component 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Composant dropdown de sélection avec recherche et multi-select
          </p>
        </div>

        {/* Grid d'exemples */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 1. Select Simple */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              1️⃣ Select Simple
            </h2>
            <Select
              options={banksOptions}
              value={selectedBank}
              onChange={setSelectedBank}
              placeholder="Sélectionner une banque"
              icon={Building2}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Valeur : <code>{selectedBank || 'null'}</code>
            </p>
          </div>

          {/* 2. Select avec Recherche */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              2️⃣ Avec Recherche
            </h2>
            <Select
              options={countriesOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Rechercher un pays"
              searchable
              searchPlaceholder="Taper pour rechercher..."
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Valeur : <code>{selectedCountry || 'null'}</code>
            </p>
          </div>

          {/* 3. Select Clearable */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              3️⃣ Clearable (Effaçable)
            </h2>
            <Select
              options={currencyOptions}
              value={selectedCurrency}
              onChange={setSelectedCurrency}
              placeholder="Sélectionner une devise"
              icon={DollarSign}
              clearable
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Valeur : <code>{selectedCurrency || 'null'}</code>
            </p>
          </div>

          {/* 4. Multi-Select */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              4️⃣ Multi-Select
            </h2>
            <Select
              options={categoriesOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Sélectionner des catégories"
              icon={Tag}
              multiple
              searchable
              clearable
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Valeur : <code>[{selectedCategories.join(', ')}]</code>
            </p>
          </div>

          {/* 5. Select Error State */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              5️⃣ État Erreur
            </h2>
            <Select
              options={accountsOptions}
              value={null}
              onChange={() => {}}
              placeholder="Type de compte requis"
              icon={CreditCard}
              error
              helperText="Veuillez sélectionner un type de compte"
            />
          </div>

          {/* 6. Select Success State */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              6️⃣ État Succès
            </h2>
            <Select
              options={accountsOptions}
              value={selectedAccount}
              onChange={setSelectedAccount}
              placeholder="Type de compte"
              icon={CreditCard}
              success
              helperText="Type de compte validé ✓"
            />
          </div>

          {/* 7. Select Disabled */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              7️⃣ Désactivé
            </h2>
            <Select
              options={banksOptions}
              value="sogebank"
              onChange={() => {}}
              placeholder="Banque"
              icon={Building2}
              disabled
              helperText="Sélection non disponible"
            />
          </div>

          {/* 8. Tailles */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              8️⃣ Tailles
            </h2>
            <div className="space-y-3">
              <Select
                options={banksOptions}
                value={null}
                onChange={() => {}}
                placeholder="Small (sm)"
                size="sm"
              />
              <Select
                options={banksOptions}
                value={null}
                onChange={() => {}}
                placeholder="Medium (md) - défaut"
                size="md"
              />
              <Select
                options={banksOptions}
                value={null}
                onChange={() => {}}
                placeholder="Large (lg)"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Section Features */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ✨ Features
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                🎯 Fonctionnalités
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✅ Single & Multi-select</li>
                <li>✅ Recherche/filtrage</li>
                <li>✅ Clearable (effaçable)</li>
                <li>✅ Icônes personnalisées</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                🎨 Design
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✅ Glassmorphism</li>
                <li>✅ Light/Dark mode</li>
                <li>✅ 3 tailles (sm, md, lg)</li>
                <li>✅ États (error, success)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                ⌨️ Accessibilité
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✅ Navigation clavier</li>
                <li>✅ Arrow up/down</li>
                <li>✅ Enter pour sélectionner</li>
                <li>✅ ESC pour fermer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Exemple de Code
          </h2>
          <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import Select from './components/ui/Select';
import { Building2 } from 'lucide-react';

const [selectedBank, setSelectedBank] = useState(null);

const banksOptions = [
  { value: 'buh', label: 'BUH' },
  { value: 'sogebank', label: 'Sogebank' },
  { value: 'bnc', label: 'BNC' }
];

<Select
  options={banksOptions}
  value={selectedBank}
  onChange={setSelectedBank}
  placeholder="Sélectionner une banque"
  icon={Building2}
  searchable
  clearable
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SelectExamples;