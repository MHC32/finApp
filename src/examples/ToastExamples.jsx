// src/examples/ToastExamples.jsx
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ToastContainer from '../components/ui/ToastContainer';
import useToast from '../hooks/useToast';
import { 
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Bell,
  DollarSign,
  CreditCard,
  Users,
  Mail
} from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Toast
 * Tous les types, positions et cas d'usage réels
 */
const ToastExamples = () => {
  const { toasts, success, error, warning, info, removeToast, clearToasts } = useToast();

  // Exemples de toasts
  const showSuccessToast = () => {
    success('Transaction effectuée avec succès !', {
      title: 'Succès',
      duration: 5000,
    });
  };

  const showErrorToast = () => {
    error('Une erreur est survenue lors du paiement.', {
      title: 'Erreur',
      duration: 6000,
    });
  };

  const showWarningToast = () => {
    warning('Votre session expire dans 5 minutes.', {
      title: 'Attention',
      duration: 8000,
    });
  };

  const showInfoToast = () => {
    info('Nouvelle mise à jour disponible !', {
      title: 'Information',
      duration: 5000,
    });
  };

  // Toasts avec positions différentes
  const showTopRight = () => {
    success('Toast en haut à droite', { position: 'top-right' });
  };

  const showTopLeft = () => {
    info('Toast en haut à gauche', { position: 'top-left' });
  };

  const showBottomRight = () => {
    warning('Toast en bas à droite', { position: 'bottom-right' });
  };

  const showBottomLeft = () => {
    error('Toast en bas à gauche', { position: 'bottom-left' });
  };

  const showTopCenter = () => {
    info('Toast centré en haut', { position: 'top-center' });
  };

  const showBottomCenter = () => {
    success('Toast centré en bas', { position: 'bottom-center' });
  };

  // Toasts sans auto-dismiss
  const showPersistent = () => {
    warning('Ce toast ne disparaît pas automatiquement. Fermez-le manuellement.', {
      title: 'Toast persistant',
      duration: 0, // 0 = pas d'auto-dismiss
    });
  };

  // Cas d'usage réels FinApp Haiti
  const showPaymentSuccess = () => {
    success('Paiement de 2,500 HTG effectué avec succès !', {
      title: 'Paiement réussi 💰',
      duration: 6000,
    });
  };

  const showTransferError = () => {
    error('Solde insuffisant pour effectuer le transfert.', {
      title: 'Transfert échoué',
      duration: 7000,
    });
  };

  const showAccountCreated = () => {
    success('Votre compte a été créé ! Vérifiez votre email.', {
      title: 'Bienvenue sur FinApp Haiti 🇭🇹',
      duration: 8000,
    });
  };

  const showBudgetWarning = () => {
    warning('Vous avez dépassé 80% de votre budget du mois.', {
      title: 'Alerte budget',
      duration: 10000,
    });
  };

  const showSolReminder = () => {
    info('N\'oubliez pas votre cotisation Sol lundi prochain.', {
      title: 'Rappel Tontine',
      duration: 7000,
    });
  };

  // Multiple toasts
  const showMultiple = () => {
    success('Premier toast');
    setTimeout(() => info('Deuxième toast'), 300);
    setTimeout(() => warning('Troisième toast'), 600);
    setTimeout(() => error('Quatrième toast'), 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Toast Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Notifications temporaires avec glassmorphism et palette Teal 🌊
          </p>
        </div>

        {/* Contrôles globaux */}
        <div className="mb-8 flex items-center justify-between glass-light dark:glass-dark glass-card">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Bell size={16} className="inline mr-2" />
              Toasts actifs : <span className="font-bold text-haiti-teal">{toasts.length}</span>
            </p>
          </div>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={clearToasts}
            disabled={toasts.length === 0}
          >
            Tout effacer
          </Button>
        </div>

        {/* Section 1 : Types de base */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Types de toasts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="success" 
                leftIcon={CheckCircle}
                onClick={showSuccessToast}
                fullWidth
              >
                Success
              </Button>

              <Button 
                variant="danger" 
                leftIcon={AlertCircle}
                onClick={showErrorToast}
                fullWidth
              >
                Error
              </Button>

              <Button 
                variant="warning" 
                leftIcon={AlertTriangle}
                onClick={showWarningToast}
                fullWidth
              >
                Warning
              </Button>

              <Button 
                variant="outline-secondary" 
                leftIcon={Info}
                onClick={showInfoToast}
                fullWidth
              >
                Info
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 2 : Positions */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Positions (6 options)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={showTopRight} fullWidth>
                Top Right
              </Button>
              <Button variant="outline" onClick={showTopLeft} fullWidth>
                Top Left
              </Button>
              <Button variant="outline" onClick={showTopCenter} fullWidth>
                Top Center
              </Button>
              <Button variant="outline" onClick={showBottomRight} fullWidth>
                Bottom Right
              </Button>
              <Button variant="outline" onClick={showBottomLeft} fullWidth>
                Bottom Left
              </Button>
              <Button variant="outline" onClick={showBottomCenter} fullWidth>
                Bottom Center
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 3 : Options avancées */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Options avancées
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline-secondary" 
                onClick={showPersistent}
                fullWidth
              >
                Toast Persistant (pas d'auto-dismiss)
              </Button>

              <Button 
                variant="outline" 
                onClick={showMultiple}
                fullWidth
              >
                Afficher 4 toasts simultanés
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 4 : Cas d'usage FinApp Haiti */}
        <section className="mb-12">
          <Card variant="teal">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. Cas d'usage réels - FinApp Haiti 🇭🇹
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Paiement réussi */}
              <Button 
                variant="success" 
                leftIcon={DollarSign}
                onClick={showPaymentSuccess}
                fullWidth
              >
                Paiement réussi
              </Button>

              {/* Transfert échoué */}
              <Button 
                variant="danger" 
                leftIcon={CreditCard}
                onClick={showTransferError}
                fullWidth
              >
                Transfert échoué
              </Button>

              {/* Compte créé */}
              <Button 
                variant="success" 
                leftIcon={Mail}
                onClick={showAccountCreated}
                fullWidth
              >
                Compte créé
              </Button>

              {/* Alerte budget */}
              <Button 
                variant="warning" 
                leftIcon={AlertTriangle}
                onClick={showBudgetWarning}
                fullWidth
              >
                Alerte budget
              </Button>

              {/* Rappel Sol */}
              <Button 
                variant="outline-secondary" 
                leftIcon={Users}
                onClick={showSolReminder}
                fullWidth
              >
                Rappel Sol (Tontine)
              </Button>

              {/* Notification générale */}
              <Button 
                variant="outline" 
                leftIcon={Bell}
                onClick={() => info('Nouvelle notification reçue !', { title: 'Notification' })}
                fullWidth
              >
                Notification
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 5 : Guide d'utilisation */}
        <section className="mb-12">
          <Card variant="glass-intense">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Comment utiliser le Toast
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-haiti-teal/5 rounded-lg border border-haiti-teal/20">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  1. Importer le hook
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  <code>{`import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';`}</code>
                </pre>
              </div>

              <div className="p-4 bg-haiti-blue/5 rounded-lg border border-haiti-blue/20">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  2. Utiliser le hook dans votre composant
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  <code>{`const { toasts, success, error, warning, info, removeToast } = useToast();`}</code>
                </pre>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  3. Ajouter le ToastContainer
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  <code>{`<ToastContainer toasts={toasts} onRemove={removeToast} />`}</code>
                </pre>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  4. Afficher un toast
                </h4>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  <code>{`// Méthode simple
success('Opération réussie !');
error('Une erreur est survenue');

// Avec options
success('Paiement effectué', {
  title: 'Succès',
  duration: 5000,
  position: 'top-right'
});`}</code>
                </pre>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Toast Component
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ 4 types : success, error, warning, info</li>
            <li>✅ 6 positions : top-right, top-left, bottom-right, bottom-left, top-center, bottom-center</li>
            <li>✅ Auto-dismiss configurable (duration en ms, 0 = infini)</li>
            <li>✅ Animations entrée/sortie selon la position</li>
            <li>✅ Glassmorphism avec bordure colorée selon le type</li>
            <li>✅ Bouton fermeture manuel</li>
            <li>✅ Support Light/Dark mode automatique</li>
            <li>✅ Hook useToast pour utilisation facile</li>
            <li>✅ Gestion de plusieurs toasts simultanés</li>
            <li>✅ Portal React (monte au niveau body)</li>
            <li>🌊 Couleur Teal pour type "info"</li>
            <li>🇭🇹 Parfait pour feedback utilisateur dans FinApp Haiti</li>
          </ul>
        </div>

      </div>

      {/* Toast Container - IMPORTANT : À ajouter dans chaque page qui utilise les toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ToastExamples;