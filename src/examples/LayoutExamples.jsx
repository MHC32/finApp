import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Home, Plus, Download } from 'lucide-react';

/**
 * Page d'exemples - Composants Layout
 * 
 * Démontre MainLayout, Navbar, Sidebar, Footer, Breadcrumbs
 */
const LayoutExamples = () => {
  const [showFullLayout, setShowFullLayout] = useState(false);

  const breadcrumbsExample = [
    { label: 'Accueil', href: '/' },
    { label: 'Comptes', href: '/accounts' },
    { label: 'Détails du compte', href: '/accounts/123' }
  ];

  if (showFullLayout) {
    // Afficher le layout complet
    return (
      <MainLayout
        breadcrumbs={breadcrumbsExample}
        currentPath="/accounts"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Exemple de Page Complète
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Layout avec Navbar, Sidebar, Breadcrumbs et Footer
              </p>
            </div>
            <Button onClick={() => setShowFullLayout(false)} variant="outline">
              Retour aux exemples
            </Button>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} variant="glass">
                <Card.Header>
                  <h3 className="text-lg font-semibold">Card {i}</h3>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-600 dark:text-gray-400">
                    Contenu de la card {i}. Le layout s'adapte automatiquement.
                  </p>
                </Card.Body>
                <Card.Footer>
                  <Button size="sm" fullWidth>
                    Action
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Page d'exemples individuels
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Layout Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            MainLayout, Navbar, Sidebar, Footer & Breadcrumbs
          </p>
        </div>

        {/* Démo Layout Complet */}
        <Card variant="glass">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🏗️ Layout Complet
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Voir le layout en action avec tous les composants
                </p>
              </div>
              <Button onClick={() => setShowFullLayout(true)}>
                Voir le Layout complet
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600 dark:text-gray-400">
              Le MainLayout combine tous les composants de structure (Navbar, Sidebar, Breadcrumbs, Footer) 
              pour créer une structure d'application complète et responsive.
            </p>
          </Card.Body>
        </Card>

        {/* Breadcrumbs Examples */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🗺️ Breadcrumbs
            </h2>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Breadcrumbs simple avec home icon
              </p>
              <Breadcrumbs items={breadcrumbsExample} />
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Sans home icon
              </p>
              <Breadcrumbs 
                items={breadcrumbsExample} 
                showHome={false}
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Avec limitation d'items (maxItems = 2)
              </p>
              <Breadcrumbs 
                items={[
                  { label: 'Accueil', href: '/' },
                  { label: 'Finance', href: '/finance' },
                  { label: 'Comptes', href: '/accounts' },
                  { label: 'Banque', href: '/accounts/bank' },
                  { label: 'Détails', href: '/accounts/bank/123' }
                ]} 
                maxItems={2}
              />
            </div>
          </Card.Body>
        </Card>

        {/* Navbar Preview */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔝 Navbar
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              La Navbar est sticky en haut de page et contient :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Toggle sidebar (mobile)</li>
              <li>Logo et titre de l'app</li>
              <li>Toggle thème Light/Dark</li>
              <li>Icône notifications avec badge</li>
              <li>Menu utilisateur avec dropdown (profil, paramètres, déconnexion)</li>
            </ul>
            <div className="pt-4">
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Navbar />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Sidebar Preview */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📱 Sidebar
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Le Sidebar contient :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Navigation hiérarchique par sections</li>
              <li>Icônes pour chaque menu item</li>
              <li>Badges de notifications</li>
              <li>État actif/sélectionné</li>
              <li>Sections accordéon expansibles</li>
              <li>Responsive (overlay sur mobile)</li>
            </ul>
            <div className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Aperçu (voir le layout complet pour interaction complète)
              </p>
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-96">
                <Sidebar isOpen={true} currentPath="/dashboard" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Footer Preview */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📋 Footer
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Le Footer contient :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Copyright dynamique (année actuelle)</li>
              <li>Message "Fait avec ❤️ en Haïti 🇭🇹"</li>
              <li>Liens utiles (À propos, Confidentialité, Conditions, Support)</li>
              <li>Numéro de version</li>
            </ul>
            <div className="pt-4">
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Footer />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* PrivateRoute Info */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔒 PrivateRoute
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              PrivateRoute est un composant wrapper pour protéger les routes authentifiées.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong className="text-gray-900 dark:text-white">Features :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Vérifie l'authentification via Redux store</li>
                <li>Redirige vers /login si non authentifié</li>
                <li>Sauvegarde l'URL pour redirection après login</li>
                <li>Affiche un loader pendant vérification</li>
                <li>Support des rôles/permissions (optionnel)</li>
              </ul>
            </div>
            <div className="pt-4">
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`// Utilisation dans les routes
<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  } 
/>

// Avec rôles requis
<Route 
  path="/admin" 
  element={
    <PrivateRoute requiredRoles={['admin']}>
      <AdminPage />
    </PrivateRoute>
  } 
/>`}
              </pre>
            </div>
          </Card.Body>
        </Card>

        {/* Code Example MainLayout */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📝 Exemple MainLayout
            </h2>
          </Card.Header>
          <Card.Body>
            <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import MainLayout from './components/layout/MainLayout';

function MyPage() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: 'Accueil', href: '/' },
        { label: 'Comptes', href: '/accounts' }
      ]}
      currentPath="/accounts"
      maxWidth="7xl"
    >
      {/* Votre contenu de page */}
      <h1>Ma Page</h1>
      <p>Le layout gère tout automatiquement !</p>
    </MainLayout>
  );
}`}
            </pre>
          </Card.Body>
        </Card>

        {/* Récapitulatif */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ✨ Récapitulatif Layout System
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                  Composants
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✅ <strong>MainLayout</strong> - Structure globale</li>
                  <li>✅ <strong>Navbar</strong> - Navigation top</li>
                  <li>✅ <strong>Sidebar</strong> - Menu latéral</li>
                  <li>✅ <strong>Footer</strong> - Pied de page</li>
                  <li>✅ <strong>Breadcrumbs</strong> - Fil d'Ariane</li>
                  <li>✅ <strong>PrivateRoute</strong> - Protection routes</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                  Features
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>🎨 Light/Dark mode complet</li>
                  <li>📱 100% Responsive</li>
                  <li>🔒 Protection authentification</li>
                  <li>🧭 Navigation hiérarchique</li>
                  <li>🎯 États actifs/sélectionnés</li>
                  <li>⚡ Performance optimisée</li>
                </ul>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LayoutExamples;