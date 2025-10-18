import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { 
  Home, 
  CreditCard, 
  DollarSign, 
  Settings,
  TrendingUp,
  Bell,
  ExternalLink
} from 'lucide-react';

/**
 * Page d'exemples - Composants Navigation
 * 
 * Démontre Tabs et Alert
 */
const NavigationExamples = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Navigation Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tabs & Alert - Composants de navigation et messages
          </p>
        </div>

        {/* ========== TABS ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📑 Tabs
          </h2>

          {/* Tabs Line (défaut) */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              1️⃣ Tabs Line (défaut)
            </h3>
            
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview" icon={Home}>
                  Vue d'ensemble
                </Tabs.Tab>
                <Tabs.Tab value="transactions" icon={CreditCard} badge={12}>
                  Transactions
                </Tabs.Tab>
                <Tabs.Tab value="budgets" icon={DollarSign}>
                  Budgets
                </Tabs.Tab>
                <Tabs.Tab value="stats" icon={TrendingUp}>
                  Statistiques
                </Tabs.Tab>
                <Tabs.Tab value="settings" icon={Settings} disabled>
                  Paramètres
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Vue d'ensemble
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bienvenue sur votre tableau de bord financier. Consultez vos comptes, transactions et budgets.
                  </p>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="transactions">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Transactions récentes (12)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Achat supermarché</span>
                      <span className="text-red-600 dark:text-red-400 font-semibold">-2,500 HTG</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Salaire</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">+50,000 HTG</span>
                    </div>
                  </div>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="budgets">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Budgets mensuels
                  </h4>
                  <ProgressBar
                    value={75}
                    label="Alimentation"
                    showValue
                    color="teal"
                    size="sm"
                  />
                  <ProgressBar
                    value={90}
                    label="Transport"
                    showValue
                    color="orange"
                    size="sm"
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="stats">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Statistiques
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Graphiques et analyses de vos finances.
                  </p>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          {/* Tabs Enclosed */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              2️⃣ Tabs Enclosed
            </h3>
            
            <Tabs defaultValue="monthly" variant="enclosed">
              <Tabs.List>
                <Tabs.Tab value="monthly">Mensuel</Tabs.Tab>
                <Tabs.Tab value="yearly">Annuel</Tabs.Tab>
                <Tabs.Tab value="custom">Personnalisé</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="monthly">
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Rapport mensuel des dépenses et revenus.
                  </p>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="yearly">
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Vue annuelle de vos finances.
                  </p>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="custom">
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Sélectionnez une période personnalisée.
                  </p>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          {/* Tabs Pills */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              3️⃣ Tabs Pills
            </h3>
            
            <Tabs defaultValue="all" variant="pills" color="blue">
              <Tabs.List>
                <Tabs.Tab value="all" badge={25}>Tous</Tabs.Tab>
                <Tabs.Tab value="income" badge={8}>Revenus</Tabs.Tab>
                <Tabs.Tab value="expense" badge={17}>Dépenses</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="all">
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Affichage de toutes les transactions (25).
                  </p>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="income">
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Transactions de type revenus uniquement (8).
                  </p>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="expense">
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Transactions de type dépenses uniquement (17).
                  </p>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          {/* Tabs Vertical */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              4️⃣ Tabs Vertical
            </h3>
            
            <Tabs defaultValue="profile" orientation="vertical" variant="pills">
              <Tabs.List>
                <Tabs.Tab value="profile" icon={Home}>Profil</Tabs.Tab>
                <Tabs.Tab value="security" icon={Settings}>Sécurité</Tabs.Tab>
                <Tabs.Tab value="notifications" icon={Bell}>Notifications</Tabs.Tab>
              </Tabs.List>

              <div className="flex-1">
                <Tabs.Panel value="profile">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Informations du profil
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Modifiez vos informations personnelles.
                    </p>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel value="security">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Paramètres de sécurité
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Gérez votre mot de passe et authentification.
                    </p>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel value="notifications">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Préférences de notifications
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choisissez comment vous souhaitez être notifié.
                    </p>
                  </div>
                </Tabs.Panel>
              </div>
            </Tabs>
          </div>

          {/* Tabs Tailles & Couleurs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                5️⃣ Tailles
              </h3>
              
              <div className="space-y-4">
                <Tabs defaultValue="tab1" size="sm">
                  <Tabs.List>
                    <Tabs.Tab value="tab1">Small</Tabs.Tab>
                    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                <Tabs defaultValue="tab1" size="md">
                  <Tabs.List>
                    <Tabs.Tab value="tab1">Medium</Tabs.Tab>
                    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                <Tabs defaultValue="tab1" size="lg">
                  <Tabs.List>
                    <Tabs.Tab value="tab1">Large</Tabs.Tab>
                    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                6️⃣ Couleurs
              </h3>
              
              <div className="space-y-4">
                <Tabs defaultValue="tab1" color="teal" variant="pills">
                  <Tabs.List>
                    <Tabs.Tab value="tab1">Teal</Tabs.Tab>
                    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                <Tabs defaultValue="tab1" color="blue" variant="pills">
                  <Tabs.List>
                    <Tabs.Tab value="tab1">Blue</Tabs.Tab>
                    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                <Tabs defaultValue="tab1" color="purple" variant="pills">
                  <Tabs.List>
                    <Tabs.Tab value="tab1">Purple</Tabs.Tab>
                    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* ========== ALERT ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🚨 Alert
          </h2>

          {/* Alert Types - Subtle */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              1️⃣ Types - Variant Subtle (défaut)
            </h3>
            
            <div className="space-y-3">
              <Alert
                type="info"
                title="Information"
                description="Ceci est un message informatif pour vous aider."
              />

              <Alert
                type="success"
                title="Succès !"
                description="Votre transaction a été enregistrée avec succès."
              />

              <Alert
                type="warning"
                title="Attention"
                description="Votre budget mensuel est bientôt épuisé."
              />

              <Alert
                type="error"
                title="Erreur"
                description="Une erreur s'est produite lors de l'enregistrement."
              />

              <Alert
                type="tip"
                title="Conseil"
                description="Pensez à définir des budgets pour mieux gérer vos finances."
              />
            </div>
          </div>

          {/* Alert Variants */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              2️⃣ Variantes
            </h3>
            
            <div className="space-y-3">
              <Alert
                type="success"
                variant="solid"
                title="Variant Solid"
                description="Arrière-plan plein avec texte blanc."
              />

              <Alert
                type="info"
                variant="outlined"
                title="Variant Outlined"
                description="Bordure colorée avec fond blanc."
              />

              <Alert
                type="warning"
                variant="subtle"
                title="Variant Subtle"
                description="Fond coloré léger - utilisé par défaut."
              />

              <Alert
                type="error"
                variant="left-accent"
                title="Variant Left Accent"
                description="Barre d'accent à gauche pour une touche moderne."
              />
            </div>
          </div>

          {/* Alert avec Actions */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              3️⃣ Avec Actions
            </h3>
            
            <div className="space-y-3">
              <Alert
                type="warning"
                title="Budget épuisé"
                description="Votre budget alimentation pour ce mois est terminé."
                actions={
                  <>
                    <Button size="sm" variant="ghost">
                      Voir détails
                    </Button>
                    <Button size="sm" variant="outline">
                      Ajuster budget
                    </Button>
                  </>
                }
              />

              <Alert
                type="info"
                variant="left-accent"
                title="Nouvelle fonctionnalité"
                description="Découvrez notre nouveau module d'analyse IA."
                actions={
                  <Button size="sm" icon={ExternalLink}>
                    En savoir plus
                  </Button>
                }
              />
            </div>
          </div>

          {/* Alert Dismissible */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              4️⃣ Dismissible (fermable)
            </h3>
            
            <div className="space-y-3">
              <Alert
                type="success"
                title="Transaction enregistrée"
                description="Votre dépense de 2,500 HTG a été ajoutée."
                dismissible
                onClose={() => console.log('Alert fermée')}
              />

              <Alert
                type="tip"
                variant="left-accent"
                title="Astuce du jour"
                description="Utilisez les tags pour mieux organiser vos transactions."
                dismissible
              />
            </div>
          </div>

          {/* Alert Tailles */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              5️⃣ Tailles
            </h3>
            
            <div className="space-y-3">
              <Alert
                type="info"
                size="sm"
                title="Small Alert"
                description="Taille compacte pour les espaces réduits."
              />

              <Alert
                type="success"
                size="md"
                title="Medium Alert (défaut)"
                description="Taille standard pour la plupart des cas."
              />

              <Alert
                type="warning"
                size="lg"
                title="Large Alert"
                description="Taille plus grande pour les messages importants."
              />
            </div>
          </div>

          {/* Alert Sans Icône */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              6️⃣ Options
            </h3>
            
            <div className="space-y-3">
              <Alert
                type="info"
                title="Sans icône"
                description="Alert sans icône pour un style minimaliste."
                showIcon={false}
              />

              <Alert
                type="success"
                description="Alert sans titre, juste une description."
                dismissible
              />

              <Alert type="warning" variant="left-accent">
                <div>
                  <p className="font-semibold mb-2">Contenu personnalisé</p>
                  <p className="text-sm opacity-80">
                    Vous pouvez passer du JSX personnalisé dans les children pour un contrôle total.
                  </p>
                  <ul className="text-sm opacity-80 mt-2 space-y-1 list-disc list-inside">
                    <li>Point important 1</li>
                    <li>Point important 2</li>
                    <li>Point important 3</li>
                  </ul>
                </div>
              </Alert>
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
                Tabs
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Tabs defaultValue="overview" variant="line">
  <Tabs.List>
    <Tabs.Tab value="overview" icon={Home}>
      Vue d'ensemble
    </Tabs.Tab>
    <Tabs.Tab value="transactions" badge={12}>
      Transactions
    </Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="overview">
    Contenu de l'onglet overview
  </Tabs.Panel>
  
  <Tabs.Panel value="transactions">
    Contenu de l'onglet transactions
  </Tabs.Panel>
</Tabs>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                Alert
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Alert
  type="success"
  variant="subtle"
  title="Succès !"
  description="Votre transaction a été enregistrée."
  dismissible
  onClose={() => console.log('Fermé')}
  actions={
    <Button size="sm">Voir détails</Button>
  }
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationExamples;