import { useState } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import EmptyState from '../components/common/EmptyState';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Plus, Filter, Download, Upload } from 'lucide-react';

/**
 * Composant qui génère une erreur pour tester ErrorBoundary
 */
const BuggyComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Erreur de test déclenchée intentionnellement !');
  }
  return <div className="p-4 text-center text-green-600 dark:text-green-400">✓ Pas d'erreur</div>;
};

/**
 * Page d'exemples - Composants Common
 * 
 * Démontre ErrorBoundary, EmptyState et SearchBar
 */
const CommonComponentsExamples = () => {
  // États SearchBar
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // États ErrorBoundary
  const [throwError, setThrowError] = useState(false);

  // Suggestions pour SearchBar
  const searchSuggestions = [
    'Transactions récentes',
    'Budget mensuel',
    'Comptes bancaires',
    'Dépenses alimentation',
    'Revenus salaire'
  ];

  // Gérer la recherche
  const handleSearch = (query) => {
    console.log('Recherche:', query);
    setSearchLoading(true);
    
    // Simuler recherche
    setTimeout(() => {
      setSearchResults(query ? [`Résultats pour "${query}"...`] : []);
      setSearchLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Common Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ErrorBoundary, EmptyState & SearchBar - Composants utilitaires
          </p>
        </div>

        {/* ========== SEARCHBAR ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔍 SearchBar
          </h2>

          {/* SearchBar Principal */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              1️⃣ SearchBar avec Suggestions
            </h3>
            
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Rechercher des transactions, comptes, budgets..."
              suggestions={searchSuggestions}
              showSuggestions
              loading={searchLoading}
              debounceMs={300}
              fullWidth
            />

            {searchQuery && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recherche active : <span className="font-semibold text-gray-900 dark:text-white">{searchQuery}</span>
                </p>
                {searchResults.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {searchResults[0]}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SearchBar Variantes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                2️⃣ Variantes
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Default</p>
                  <SearchBar
                    placeholder="Variant default..."
                    variant="default"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Filled</p>
                  <SearchBar
                    placeholder="Variant filled..."
                    variant="filled"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ghost</p>
                  <SearchBar
                    placeholder="Variant ghost..."
                    variant="ghost"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                3️⃣ Tailles
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Small</p>
                  <SearchBar
                    placeholder="Taille small..."
                    size="sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Medium (défaut)</p>
                  <SearchBar
                    placeholder="Taille medium..."
                    size="md"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Large</p>
                  <SearchBar
                    placeholder="Taille large..."
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                4️⃣ États
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Loading</p>
                  <SearchBar
                    value="Recherche en cours..."
                    loading
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Disabled</p>
                  <SearchBar
                    value="Désactivé"
                    disabled
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avec valeur</p>
                  <SearchBar
                    value="Ma recherche"
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                5️⃣ Full Width
              </h3>
              <SearchBar
                placeholder="Recherche pleine largeur..."
                fullWidth
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Parfait pour les barres de navigation et headers
              </p>
            </div>
          </div>
        </div>

        {/* ========== EMPTYSTATE ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📭 EmptyState
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Empty */}
            <Card variant="glass">
              <EmptyState
                variant="empty"
                title="Aucune transaction"
                description="Vous n'avez pas encore de transactions. Commencez par en ajouter une."
                action={
                  <Button icon={Plus}>
                    Ajouter une transaction
                  </Button>
                }
              />
            </Card>

            {/* Search */}
            <Card variant="glass">
              <EmptyState
                variant="search"
                title="Aucun résultat"
                description='Aucun résultat trouvé pour "budget voyage". '
                action={
                  <Button variant="outline">
                    Effacer la recherche
                  </Button>
                }
              />
            </Card>

            {/* Filtered */}
            <Card variant="glass">
              <EmptyState
                variant="filtered"
                title="Aucune donnée avec ces filtres"
                description="Essayez de modifier ou supprimer certains filtres pour voir plus de résultats."
                action={
                  <Button icon={Filter} variant="outline">
                    Réinitialiser les filtres
                  </Button>
                }
              />
            </Card>

            {/* Error */}
            <Card variant="glass">
              <EmptyState
                variant="error"
                title="Erreur de chargement"
                description="Une erreur s'est produite lors du chargement des données. Veuillez réessayer."
                action={
                  <Button>
                    Réessayer
                  </Button>
                }
              />
            </Card>

            {/* No Data */}
            <Card variant="glass">
              <EmptyState
                variant="nodata"
                title="Pas encore de données"
                description="Les données seront disponibles après votre première synchronisation."
                action={
                  <Button icon={Download}>
                    Synchroniser maintenant
                  </Button>
                }
              />
            </Card>

            {/* Not Found */}
            <Card variant="glass">
              <EmptyState
                variant="notfound"
                title="Page introuvable"
                description="La page que vous recherchez n'existe pas ou a été déplacée."
                action={
                  <Button>
                    Retour à l'accueil
                  </Button>
                }
              />
            </Card>
          </div>

          {/* Tailles */}
          <div className="glass-card p-6 space-y-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Tailles EmptyState
            </h3>
            
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
              <EmptyState
                size="sm"
                title="Small EmptyState"
                description="Taille compacte pour petits espaces"
                action={<Button size="sm">Action</Button>}
              />

              <div className="pt-8">
                <EmptyState
                  size="md"
                  title="Medium EmptyState"
                  description="Taille par défaut pour la plupart des cas"
                  action={<Button>Action</Button>}
                />
              </div>

              <div className="pt-8">
                <EmptyState
                  size="lg"
                  title="Large EmptyState"
                  description="Taille grande pour pages principales et états importants"
                  action={<Button size="lg">Action</Button>}
                />
              </div>
            </div>
          </div>

          {/* Avec actions multiples */}
          <Card variant="glass">
            <EmptyState
              title="Importer vos données"
              description="Importez vos transactions depuis un fichier CSV ou Excel pour commencer rapidement."
              action={
                <Button icon={Upload}>
                  Importer depuis un fichier
                </Button>
              }
              secondaryAction={
                <Button variant="outline" icon={Plus}>
                  Ajouter manuellement
                </Button>
              }
            />
          </Card>
        </div>

        {/* ========== ERRORBOUNDARY ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🛡️ ErrorBoundary
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sans erreur */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                1️⃣ Sans Erreur
              </h3>
              <ErrorBoundary>
                <BuggyComponent shouldThrow={false} />
              </ErrorBoundary>
            </div>

            {/* Avec erreur */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                2️⃣ Démo ErrorBoundary
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cliquez pour déclencher une erreur et voir l'ErrorBoundary en action :
              </p>
              <Button
                onClick={() => setThrowError(!throwError)}
                variant={throwError ? 'danger' : 'outline'}
              >
                {throwError ? 'Réinitialiser' : 'Déclencher une erreur'}
              </Button>

              {throwError && (
                <ErrorBoundary
                  onReset={() => setThrowError(false)}
                  onError={(error, errorInfo) => {
                    console.log('Erreur capturée:', error);
                    console.log('Info:', errorInfo);
                  }}
                >
                  <BuggyComponent shouldThrow={true} />
                </ErrorBoundary>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              ℹ️ À propos de ErrorBoundary
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong className="text-gray-900 dark:text-white">ErrorBoundary</strong> capture les erreurs JavaScript dans les composants enfants React.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Affiche une UI de secours élégante au lieu d'un crash</li>
                <li>Log les erreurs en console (développement)</li>
                <li>Peut envoyer les erreurs à un service de monitoring (production)</li>
                <li>Boutons pour réessayer ou retourner à l'accueil</li>
                <li>Détails techniques visibles en mode développement</li>
              </ul>
              <p className="pt-2">
                <strong className="text-gray-900 dark:text-white">Utilisation recommandée :</strong> Wrapper l'application entière ou des sections importantes.
              </p>
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
                SearchBar
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Rechercher..."
  suggestions={suggestions}
  showSuggestions
  loading={isSearching}
  debounceMs={300}
  fullWidth
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                EmptyState
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<EmptyState
  variant="empty"
  title="Aucune transaction"
  description="Commencez par ajouter votre première transaction"
  action={
    <Button onClick={handleAdd}>
      Ajouter une transaction
    </Button>
  }
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                ErrorBoundary
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Dans App.jsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log à un service monitoring
    logErrorToService(error, errorInfo);
  }}
>
  <YourApp />
</ErrorBoundary>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonComponentsExamples;