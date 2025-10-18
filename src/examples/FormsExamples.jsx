import { useState } from 'react';
import Checkbox from '../components/ui/Checkbox';
import Radio from '../components/ui/Radio';
import Switch from '../components/ui/Switch';

/**
 * Page d'exemples - Composants Forms
 * 
 * Démontre Checkbox, Radio et Switch
 */
const FormsExamples = () => {
  // États Checkbox
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // États Radio
  const [transactionType, setTransactionType] = useState('expense');
  const [accountType, setAccountType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('moncash');

  // États Switch
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // Gérer Select All
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(['item1', 'item2', 'item3']);
    } else {
      setSelectedItems([]);
    }
  };

  // Gérer checkbox individuelle
  const handleItemCheck = (itemId, checked) => {
    if (checked) {
      const newItems = [...selectedItems, itemId];
      setSelectedItems(newItems);
      setSelectAll(newItems.length === 3);
    } else {
      const newItems = selectedItems.filter(id => id !== itemId);
      setSelectedItems(newItems);
      setSelectAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Forms Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Checkbox, Radio & Switch - Composants de formulaires
          </p>
        </div>

        {/* ========== CHECKBOX ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ☑️ Checkbox
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Checkbox Simple */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                1️⃣ Checkbox Simple
              </h3>
              <div className="space-y-3">
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Se souvenir de moi"
                />
                <Checkbox
                  checked={acceptTerms}
                  onChange={setAcceptTerms}
                  label="J'accepte les conditions d'utilisation"
                  description="En cochant, vous acceptez nos termes et politiques"
                />
                <Checkbox
                  checked={newsletter}
                  onChange={setNewsletter}
                  label="Recevoir la newsletter"
                  color="blue"
                />
              </div>
            </div>

            {/* Checkbox États */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                2️⃣ États Checkbox
              </h3>
              <div className="space-y-3">
                <Checkbox
                  checked={false}
                  onChange={() => {}}
                  label="État Erreur"
                  description="Ce champ est requis"
                  error
                  color="red"
                />
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Désactivé (coché)"
                  disabled
                />
                <Checkbox
                  checked={false}
                  onChange={() => {}}
                  label="Désactivé (non coché)"
                  disabled
                />
                <Checkbox
                  checked={false}
                  indeterminate={true}
                  onChange={() => {}}
                  label="État Indéterminé"
                  description="Quelques items sélectionnés"
                />
              </div>
            </div>

            {/* Checkbox Tailles */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                3️⃣ Tailles
              </h3>
              <div className="space-y-3">
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Small (sm)"
                  size="sm"
                />
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Medium (md) - défaut"
                  size="md"
                />
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Large (lg)"
                  size="lg"
                />
              </div>
            </div>

            {/* Checkbox Couleurs */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                4️⃣ Couleurs
              </h3>
              <div className="space-y-3">
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Teal (défaut)"
                  color="teal"
                />
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Blue"
                  color="blue"
                />
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Red"
                  color="red"
                />
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  label="Green"
                  color="green"
                />
              </div>
            </div>

            {/* Select All Pattern */}
            <div className="glass-card p-6 space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                5️⃣ Pattern Select All
              </h3>
              <div className="space-y-3">
                <Checkbox
                  checked={selectAll}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < 3}
                  onChange={handleSelectAll}
                  label="Sélectionner tout"
                  size="lg"
                  color="blue"
                />
                <div className="ml-8 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  <Checkbox
                    checked={selectedItems.includes('item1')}
                    onChange={(checked) => handleItemCheck('item1', checked)}
                    label="Item 1"
                  />
                  <Checkbox
                    checked={selectedItems.includes('item2')}
                    onChange={(checked) => handleItemCheck('item2', checked)}
                    label="Item 2"
                  />
                  <Checkbox
                    checked={selectedItems.includes('item3')}
                    onChange={(checked) => handleItemCheck('item3', checked)}
                    label="Item 3"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedItems.length} item(s) sélectionné(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RADIO ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔘 Radio
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Radio Simple */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                1️⃣ Radio Simple
              </h3>
              <Radio.Group
                value={transactionType}
                onChange={setTransactionType}
                name="transactionType"
              >
                <Radio
                  value="income"
                  label="Revenus"
                  description="Argent reçu"
                />
                <Radio
                  value="expense"
                  label="Dépenses"
                  description="Argent dépensé"
                />
                <Radio
                  value="transfer"
                  label="Transfert"
                  description="Entre comptes"
                />
              </Radio.Group>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sélectionné : <code>{transactionType}</code>
              </p>
            </div>

            {/* Radio Horizontal */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                2️⃣ Orientation Horizontale
              </h3>
              <Radio.Group
                value={paymentMethod}
                onChange={setPaymentMethod}
                orientation="horizontal"
                color="blue"
              >
                <Radio value="moncash" label="MonCash" />
                <Radio value="natcash" label="NatCash" />
                <Radio value="cash" label="Espèces" />
              </Radio.Group>
            </div>

            {/* Radio Tailles */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                3️⃣ Tailles
              </h3>
              <div className="space-y-4">
                <Radio.Group value="md" onChange={() => {}} size="sm">
                  <Radio value="sm" label="Small (sm)" />
                </Radio.Group>
                <Radio.Group value="md" onChange={() => {}} size="md">
                  <Radio value="md" label="Medium (md) - défaut" />
                </Radio.Group>
                <Radio.Group value="lg" onChange={() => {}} size="lg">
                  <Radio value="lg" label="Large (lg)" />
                </Radio.Group>
              </div>
            </div>

            {/* Radio États */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                4️⃣ États
              </h3>
              <Radio.Group value={accountType} onChange={setAccountType} error>
                <Radio value="checking" label="Compte Courant" />
                <Radio value="savings" label="Compte Épargne" />
              </Radio.Group>
              <p className="text-sm text-red-600 dark:text-red-400">
                Veuillez sélectionner un type de compte
              </p>
              
              <Radio.Group value="disabled" onChange={() => {}} disabled>
                <Radio value="disabled" label="Option désactivée" />
              </Radio.Group>
            </div>

            {/* Radio Couleurs */}
            <div className="glass-card p-6 space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                5️⃣ Couleurs
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Radio.Group value="teal" onChange={() => {}} color="teal">
                  <Radio value="teal" label="Teal" />
                </Radio.Group>
                <Radio.Group value="blue" onChange={() => {}} color="blue">
                  <Radio value="blue" label="Blue" />
                </Radio.Group>
                <Radio.Group value="red" onChange={() => {}} color="red">
                  <Radio value="red" label="Red" />
                </Radio.Group>
                <Radio.Group value="green" onChange={() => {}} color="green">
                  <Radio value="green" label="Green" />
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        {/* ========== SWITCH ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔄 Switch
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Switch Simple */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                1️⃣ Switch Simple
              </h3>
              <div className="space-y-3">
                <Switch
                  checked={notifications}
                  onChange={setNotifications}
                  label="Activer les notifications"
                  description="Recevoir des notifications push"
                />
                <Switch
                  checked={darkMode}
                  onChange={setDarkMode}
                  label="Mode sombre"
                />
                <Switch
                  checked={biometrics}
                  onChange={setBiometrics}
                  label="Authentification biométrique"
                  description="Utiliser empreinte ou Face ID"
                />
              </div>
            </div>

            {/* Switch Tailles & Couleurs */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                2️⃣ Tailles & Couleurs
              </h3>
              <div className="space-y-3">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Small (sm)"
                  size="sm"
                  color="teal"
                />
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Medium (md) - défaut"
                  size="md"
                  color="blue"
                />
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Large (lg)"
                  size="lg"
                  color="green"
                />
              </div>
            </div>

            {/* Switch Label Position */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                3️⃣ Position Label
              </h3>
              <div className="space-y-3">
                <Switch
                  checked={autoSave}
                  onChange={setAutoSave}
                  label="Label à droite (défaut)"
                  labelPosition="right"
                />
                <Switch
                  checked={autoSave}
                  onChange={setAutoSave}
                  label="Label à gauche"
                  labelPosition="left"
                />
                <Switch
                  checked={autoSave}
                  onChange={setAutoSave}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sans label
                </p>
              </div>
            </div>

            {/* Switch États */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                4️⃣ États
              </h3>
              <div className="space-y-3">
                <Switch
                  checked={false}
                  onChange={() => {}}
                  label="État Erreur"
                  description="Une erreur s'est produite"
                  error
                  color="red"
                />
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Désactivé (ON)"
                  disabled
                />
                <Switch
                  checked={false}
                  onChange={() => {}}
                  label="Désactivé (OFF)"
                  disabled
                />
              </div>
            </div>

            {/* Switch Couleurs */}
            <div className="glass-card p-6 space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                5️⃣ Palette Couleurs
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Switch checked={true} onChange={() => {}} color="teal" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Teal</p>
                </div>
                <div className="space-y-2">
                  <Switch checked={true} onChange={() => {}} color="blue" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blue</p>
                </div>
                <div className="space-y-2">
                  <Switch checked={true} onChange={() => {}} color="red" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Red</p>
                </div>
                <div className="space-y-2">
                  <Switch checked={true} onChange={() => {}}color="green" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Green</p>
                </div>
                <div className="space-y-2">
                  <Switch checked={true} onChange={() => {}} color="purple" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Purple</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Exemples de Code
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                Checkbox
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Checkbox
  checked={rememberMe}
  onChange={setRememberMe}
  label="Se souvenir de moi"
  description="Restez connecté sur cet appareil"
  size="md"
  color="teal"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                Radio Group
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Radio.Group value={type} onChange={setType} name="transactionType">
  <Radio value="income" label="Revenus" />
  <Radio value="expense" label="Dépenses" />
  <Radio value="transfer" label="Transfert" />
</Radio.Group>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                Switch
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Switch
  checked={notifications}
  onChange={setNotifications}
  label="Activer les notifications"
  description="Recevoir des alertes en temps réel"
  size="md"
  color="teal"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormsExamples;