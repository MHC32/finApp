// src/examples/ModalExamples.jsx
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { 
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  DollarSign,
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Calendar,
  Users,
  Settings
} from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Modal
 * Tous les types, tailles et cas d'usage réels
 */
const ModalExamples = () => {
  // États pour contrôler l'ouverture des modals
  const [modals, setModals] = useState({
    simple: false,
    withForm: false,
    confirmation: false,
    success: false,
    error: false,
    info: false,
    payment: false,
    account: false,
    settings: false,
    sizeSmall: false,
    sizeMedium: false,
    sizeLarge: false,
    sizeXl: false,
    size2xl: false,
    variantTeal: false,
    variantBlue: false,
    noClose: false,
  });

  // Ouvrir un modal
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  // Fermer un modal
  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  // Handler pour confirmation
  const handleConfirm = () => {
    alert('Action confirmée ! ✓');
    closeModal('confirmation');
  };

  // Handler pour paiement
  const handlePayment = () => {
    alert('Paiement effectué ! 💰');
    closeModal('payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Modal Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Modals avec glassmorphism, animations et palette Teal 🌊
          </p>
        </div>

        {/* Section 1 : Types de base */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Types de modals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="primary" 
                onClick={() => openModal('simple')}
                fullWidth
              >
                Modal Simple
              </Button>

              <Button 
                variant="secondary" 
                onClick={() => openModal('withForm')}
                fullWidth
              >
                Avec Formulaire
              </Button>

              <Button 
                variant="outline" 
                onClick={() => openModal('confirmation')}
                leftIcon={AlertCircle}
                fullWidth
              >
                Confirmation
              </Button>

              <Button 
                variant="success" 
                onClick={() => openModal('success')}
                leftIcon={CheckCircle}
                fullWidth
              >
                Succès
              </Button>

              <Button 
                variant="danger" 
                onClick={() => openModal('error')}
                leftIcon={AlertCircle}
                fullWidth
              >
                Erreur
              </Button>

              <Button 
                variant="outline-secondary" 
                onClick={() => openModal('info')}
                leftIcon={Info}
                fullWidth
              >
                Information
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 2 : Tailles */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Tailles (sm, md, lg, xl, 2xl)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button variant="outline" onClick={() => openModal('sizeSmall')} fullWidth>
                Small
              </Button>
              <Button variant="outline" onClick={() => openModal('sizeMedium')} fullWidth>
                Medium
              </Button>
              <Button variant="outline" onClick={() => openModal('sizeLarge')} fullWidth>
                Large
              </Button>
              <Button variant="outline" onClick={() => openModal('sizeXl')} fullWidth>
                XL
              </Button>
              <Button variant="outline" onClick={() => openModal('size2xl')} fullWidth>
                2XL
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 3 : Variantes */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Variantes (glass, teal, blue)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline-secondary" onClick={() => openModal('variantTeal')} fullWidth>
                Variant Teal 🌊
              </Button>
              <Button variant="outline" onClick={() => openModal('variantBlue')} fullWidth>
                Variant Blue 🔵
              </Button>
              <Button variant="ghost" onClick={() => openModal('noClose')} fullWidth>
                Sans bouton X
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 4 : Cas d'usage réels */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. Cas d'usage FinApp Haiti 🇭🇹
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="primary" 
                leftIcon={DollarSign}
                onClick={() => openModal('payment')}
                fullWidth
              >
                Effectuer Paiement
              </Button>

              <Button 
                variant="secondary" 
                leftIcon={User}
                onClick={() => openModal('account')}
                fullWidth
              >
                Créer Compte
              </Button>

              <Button 
                variant="outline-secondary" 
                leftIcon={Settings}
                onClick={() => openModal('settings')}
                fullWidth
              >
                Paramètres
              </Button>
            </div>
          </Card>
        </section>

        {/* ============================================
            MODALS DÉCLARATIONS
            ============================================ */}

        {/* Modal Simple */}
        <Modal
          isOpen={modals.simple}
          onClose={() => closeModal('simple')}
          title="Modal Simple"
          size="md"
        >
          <p className="text-gray-700 dark:text-gray-300">
            Ceci est un modal simple avec glassmorphism. Il se ferme en cliquant sur l'overlay,
            sur le bouton X, ou en appuyant sur ESC.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            💡 Essayez de cliquer en dehors du modal ou d'appuyer sur ESC pour le fermer.
          </p>
        </Modal>

        {/* Modal avec Formulaire */}
        <Modal
          isOpen={modals.withForm}
          onClose={() => closeModal('withForm')}
          title="Formulaire de Contact"
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => closeModal('withForm')}>
                Annuler
              </Button>
              <Button variant="primary">
                Envoyer
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              type="text"
              label="Nom complet"
              placeholder="Jean Dupont"
              leftIcon={User}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="jean.dupont@email.com"
              leftIcon={Mail}
              required
            />
            <Input
              type="tel"
              label="Téléphone"
              placeholder="+509 1234 5678"
              leftIcon={Phone}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                className="
                  w-full px-4 py-2 rounded-lg
                  border-2 border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:border-haiti-teal focus:ring-2 focus:ring-haiti-teal/20
                  transition-all
                "
                rows={4}
                placeholder="Votre message..."
              />
            </div>
          </div>
        </Modal>

        {/* Modal Confirmation */}
        <Modal
          isOpen={modals.confirmation}
          onClose={() => closeModal('confirmation')}
          size="sm"
          variant="glass"
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Confirmer la suppression ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
            </p>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => closeModal('confirmation')}
                fullWidth
              >
                Annuler
              </Button>
              <Button 
                variant="danger" 
                leftIcon={Trash2}
                onClick={handleConfirm}
                fullWidth
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Succès */}
        <Modal
          isOpen={modals.success}
          onClose={() => closeModal('success')}
          size="sm"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Succès !
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Votre transaction a été effectuée avec succès.
            </p>
            <Button 
              variant="success" 
              onClick={() => closeModal('success')}
              fullWidth
            >
              Parfait !
            </Button>
          </div>
        </Modal>

        {/* Modal Erreur */}
        <Modal
          isOpen={modals.error}
          onClose={() => closeModal('error')}
          size="sm"
          variant="glass"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Erreur
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.
            </p>
            <Button 
              variant="danger" 
              onClick={() => closeModal('error')}
              fullWidth
            >
              Fermer
            </Button>
          </div>
        </Modal>

        {/* Modal Info */}
        <Modal
          isOpen={modals.info}
          onClose={() => closeModal('info')}
          title="Information importante"
          size="md"
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Info className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                FinApp Haiti utilise le <strong>Teal Turquoise 🌊</strong> comme couleur secondaire,
                inspirée de la mer des Caraïbes.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cette couleur apporte fraîcheur et modernité à l'application tout en restant
                fidèle à l'identité haïtienne.
              </p>
            </div>
          </div>
        </Modal>

        {/* Modal Paiement (cas réel) */}
        <Modal
          isOpen={modals.payment}
          onClose={() => closeModal('payment')}
          title="Effectuer un paiement"
          size="lg"
          variant="teal"
          footer={
            <>
              <Button variant="ghost" onClick={() => closeModal('payment')}>
                Annuler
              </Button>
              <Button variant="primary" leftIcon={DollarSign} onClick={handlePayment}>
                Payer maintenant
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            {/* Montant */}
            <div className="p-4 bg-haiti-teal/5 rounded-lg border border-haiti-teal/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant à payer</p>
              <p className="text-3xl font-bold text-haiti-teal">2,500.00 HTG</p>
            </div>

            {/* Formulaire */}
            <div className="space-y-4">
              <Input
                type="text"
                label="Numéro de carte"
                placeholder="1234 5678 9012 3456"
                leftIcon={CreditCard}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Date d'expiration"
                  placeholder="MM/YY"
                  leftIcon={Calendar}
                  required
                />
                <Input
                  type="text"
                  label="CVV"
                  placeholder="123"
                  leftIcon={Lock}
                  required
                  maxLength={3}
                />
              </div>

              <Input
                type="text"
                label="Nom sur la carte"
                placeholder="JEAN DUPONT"
                leftIcon={User}
                required
              />
            </div>

            {/* Info sécurité */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Vos informations de paiement sont sécurisées et cryptées.
              </p>
            </div>
          </div>
        </Modal>

        {/* Modal Création de compte */}
        <Modal
          isOpen={modals.account}
          onClose={() => closeModal('account')}
          title="Créer un nouveau compte"
          size="xl"
          variant="blue"
          footer={
            <>
              <Button variant="ghost" onClick={() => closeModal('account')}>
                Annuler
              </Button>
              <Button variant="primary">
                Créer le compte
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Informations personnelles
              </h4>
              <Input
                type="text"
                label="Prénom"
                placeholder="Jean"
                leftIcon={User}
                required
              />
              <Input
                type="text"
                label="Nom"
                placeholder="Dupont"
                leftIcon={User}
                required
              />
              <Input
                type="email"
                label="Email"
                placeholder="jean.dupont@email.com"
                leftIcon={Mail}
                required
              />
              <Input
                type="tel"
                label="Téléphone"
                placeholder="+509 1234 5678"
                leftIcon={Phone}
                required
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Informations de compte
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de compte
                </label>
                <select className="
                  w-full px-4 py-2 rounded-lg
                  border-2 border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:border-haiti-blue focus:ring-2 focus:ring-haiti-blue/20
                  transition-all
                ">
                  <option>Compte courant</option>
                  <option>Compte épargne</option>
                  <option>Compte MonCash</option>
                </select>
              </div>
              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                leftIcon={Lock}
                required
                helperText="Minimum 8 caractères"
              />
              <Input
                type="password"
                label="Confirmer mot de passe"
                placeholder="••••••••"
                leftIcon={Lock}
                required
              />
            </div>
          </div>
        </Modal>

        {/* Modal Paramètres */}
        <Modal
          isOpen={modals.settings}
          onClose={() => closeModal('settings')}
          title="Paramètres"
          size="2xl"
          footer={
            <>
              <Button variant="ghost" onClick={() => closeModal('settings')}>
                Annuler
              </Button>
              <Button variant="secondary">
                Enregistrer
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            {/* Préférences */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Préférences générales
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Notifications par email', checked: true },
                  { label: 'Notifications push', checked: true },
                  { label: 'Newsletter hebdomadaire', checked: false },
                  { label: 'Alertes de sécurité', checked: true },
                ].map((pref, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={pref.checked}
                      className="w-5 h-5 text-haiti-teal rounded focus:ring-haiti-teal"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{pref.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Devise */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Devise par défaut
              </h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="currency" defaultChecked className="text-haiti-teal focus:ring-haiti-teal" />
                  <span className="text-gray-700 dark:text-gray-300">HTG (Gourde)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="currency" className="text-haiti-teal focus:ring-haiti-teal" />
                  <span className="text-gray-700 dark:text-gray-300">USD (Dollar)</span>
                </label>
              </div>
            </div>
          </div>
        </Modal>

        {/* Modals Tailles */}
        <Modal isOpen={modals.sizeSmall} onClose={() => closeModal('sizeSmall')} title="Small Modal" size="sm">
          <p className="text-gray-700 dark:text-gray-300">Modal de taille Small (max-w-sm)</p>
        </Modal>

        <Modal isOpen={modals.sizeMedium} onClose={() => closeModal('sizeMedium')} title="Medium Modal" size="md">
          <p className="text-gray-700 dark:text-gray-300">Modal de taille Medium (max-w-md) - Taille par défaut</p>
        </Modal>

        <Modal isOpen={modals.sizeLarge} onClose={() => closeModal('sizeLarge')} title="Large Modal" size="lg">
          <p className="text-gray-700 dark:text-gray-300">Modal de taille Large (max-w-lg)</p>
        </Modal>

        <Modal isOpen={modals.sizeXl} onClose={() => closeModal('sizeXl')} title="XL Modal" size="xl">
          <p className="text-gray-700 dark:text-gray-300">Modal de taille XL (max-w-xl)</p>
        </Modal>

        <Modal isOpen={modals.size2xl} onClose={() => closeModal('size2xl')} title="2XL Modal" size="2xl">
          <p className="text-gray-700 dark:text-gray-300">Modal de taille 2XL (max-w-2xl)</p>
        </Modal>

        {/* Modals Variantes */}
        <Modal isOpen={modals.variantTeal} onClose={() => closeModal('variantTeal')} title="Modal Teal 🌊" variant="teal" size="md">
          <p className="text-gray-700 dark:text-gray-300">
            Modal avec bordure Teal Turquoise - Parfait pour les actions secondaires !
          </p>
        </Modal>

        <Modal isOpen={modals.variantBlue} onClose={() => closeModal('variantBlue')} title="Modal Blue 🔵" variant="blue" size="md">
          <p className="text-gray-700 dark:text-gray-300">
            Modal avec bordure Bleu Haiti - Pour les actions principales !
          </p>
        </Modal>

        <Modal 
          isOpen={modals.noClose} 
          onClose={() => closeModal('noClose')} 
          title="Sans bouton X" 
          showCloseButton={false}
          size="sm"
          footer={
            <Button variant="primary" onClick={() => closeModal('noClose')} fullWidth>
              Fermer manuellement
            </Button>
          }
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Ce modal n'a pas de bouton X. Vous devez le fermer avec le bouton ci-dessous,
            ou en cliquant sur l'overlay, ou avec ESC.
          </p>
        </Modal>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Modal Component
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ Glassmorphism avec backdrop-blur sur overlay</li>
            <li>✅ Animations fadeIn (overlay) + slideUp (contenu)</li>
            <li>✅ Fermeture: overlay click + ESC key + bouton X</li>
            <li>✅ Scroll lock automatique sur body</li>
            <li>✅ Portal React (monte au niveau body)</li>
            <li>✅ 8 tailles: sm, md, lg, xl, 2xl, 3xl, 4xl, full</li>
            <li>✅ 5 variantes: glass, glass-intense, solid, teal, blue</li>
            <li>✅ Header/Footer optionnels avec sections personnalisables</li>
            <li>✅ Support Light/Dark mode automatique</li>
            <li>🌊 Focus ring en Teal pour accessibilité</li>
            <li>🇭🇹 Couleurs Haiti intégrées</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ModalExamples;