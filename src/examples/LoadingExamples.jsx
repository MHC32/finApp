// src/examples/LoadingExamples.jsx
import { useState } from 'react';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { RefreshCw } from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Loading
 * Tous les types, tailles et cas d'usage réels
 */
const LoadingExamples = () => {
  const [showFullPage, setShowFullPage] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Simuler un chargement
  const simulateLoading = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Loading Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Spinners, dots, pulse et skeleton loaders avec palette Teal 🌊
          </p>
        </div>

        {/* Section 1 : Types de Spinners */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Types de loading
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Spinner */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Spinner
                </h3>
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" />
                </div>
              </div>

              {/* Dots */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dots
                </h3>
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex justify-center">
                  <Loading type="dots" />
                </div>
              </div>

              {/* Pulse */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Pulse
                </h3>
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="pulse" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2 : Tailles */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Tailles (sm, md, lg, xl)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Small</p>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" size="sm" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Medium</p>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" size="md" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Large</p>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" size="lg" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">XL</p>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" size="xl" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3 : Couleurs Haiti */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Couleurs Haiti 🇭🇹
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Teal 🌊</p>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" color="teal" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Blue 🔵</p>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" color="blue" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Red 🔴</p>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" color="red" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Gray</p>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Loading type="spinner" color="gray" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">White</p>
                <div className="p-6 bg-gray-800 dark:bg-gray-200 rounded-lg">
                  <Loading type="spinner" color="white" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 4 : Avec texte */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. Avec texte d'accompagnement
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Loading type="spinner" text="Chargement en cours..." />
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Loading type="dots" text="Traitement du paiement..." color="blue" />
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Loading type="pulse" text="Synchronisation..." color="teal" />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 5 : Overlays */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Overlays (Full Page & Relatif)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Page Overlay */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Full Page Overlay
                </h3>
                <Button 
                  variant="primary" 
                  onClick={() => simulateLoading(setShowFullPage)}
                  leftIcon={RefreshCw}
                  fullWidth
                >
                  Afficher Full Page Loading
                </Button>
              </div>

              {/* Relative Overlay */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Relative Overlay
                </h3>
                <Button 
                  variant="secondary" 
                  onClick={() => simulateLoading(setShowOverlay)}
                  leftIcon={RefreshCw}
                  fullWidth
                >
                  Afficher Overlay Relatif
                </Button>
              </div>
            </div>

            {/* Exemple avec overlay relatif */}
            <div className="mt-6 relative h-64 glass-light dark:glass-dark rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Contenu de la Card
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Cliquez sur "Afficher Overlay Relatif" pour voir un loading par-dessus cette card.
              </p>
              {showOverlay && (
                <Loading 
                  overlay 
                  type="spinner" 
                  size="lg" 
                  text="Chargement des données..." 
                />
              )}
            </div>
          </Card>
        </section>

        {/* Section 6 : Skeleton Loaders */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              6. Skeleton Loaders
            </h2>
            
            <div className="space-y-6">
              {/* Skeleton éléments de base */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Éléments de base
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Texte</p>
                    <Loading.Skeleton variant="text" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Titre</p>
                    <Loading.Skeleton variant="title" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avatar</p>
                    <Loading.Skeleton variant="avatar" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Button</p>
                    <Loading.Skeleton variant="button" />
                  </div>
                </div>
              </div>

              {/* Skeleton Card */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Skeleton Card
                </h3>
                <Loading.SkeletonCard />
              </div>

              {/* Skeleton List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Skeleton List
                </h3>
                <Loading.SkeletonList count={4} />
              </div>

              {/* Skeleton Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Skeleton Table
                </h3>
                <Loading.SkeletonTable rows={5} columns={4} />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 7 : Cas d'usage réels */}
        <section className="mb-12">
          <Card variant="teal">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              7. Cas d'usage FinApp Haiti 🇭🇹
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dashboard loading */}
              <Card variant="glass">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Chargement Dashboard
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Loading.Skeleton variant="card" />
                    <Loading.Skeleton variant="card" />
                  </div>
                  <Loading.Skeleton variant="title" />
                  <Loading.SkeletonList count={3} />
                </div>
              </Card>

              {/* Transaction loading */}
              <Card variant="glass">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Traitement Paiement
                </h3>
                <div className="p-8 text-center">
                  <Loading 
                    type="spinner" 
                    size="lg" 
                    color="teal"
                    text="Traitement du paiement de 2,500 HTG..."
                  />
                </div>
              </Card>

              {/* Liste comptes loading */}
              <Card variant="glass">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Liste des Comptes
                </h3>
                <Loading.SkeletonList count={5} />
              </Card>

              {/* Stats loading */}
              <Card variant="glass">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Statistiques
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
                      <Loading.Skeleton variant="text" width="60%" />
                      <Loading.Skeleton variant="title" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Card>
        </section>

        {/* Section 8 : Inline dans boutons */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              8. Inline dans composants
            </h2>
            
            <div className="space-y-4">
              {/* Bouton avec loading */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Boutons avec loading
                </h3>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-haiti-teal text-white rounded-lg flex items-center gap-2">
                    <Loading type="spinner" size="sm" color="white" />
                    Chargement...
                  </button>
                  
                  <button className="px-6 py-2 bg-haiti-blue text-white rounded-lg flex items-center gap-2">
                    <Loading type="dots" size="sm" color="white" />
                    En cours...
                  </button>
                </div>
              </div>

              {/* Dans un input */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input avec validation en cours
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Vérification du numéro de compte..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loading type="spinner" size="sm" color="teal" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Loading Component
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ 3 types de spinner : spinner, dots, pulse</li>
            <li>✅ 4 tailles : sm, md, lg, xl</li>
            <li>✅ 5 couleurs : teal 🌊, blue 🔵, red 🔴, gray, white</li>
            <li>✅ Overlay : fullPage (fixe) ou overlay (relatif au parent)</li>
            <li>✅ Skeleton loaders : text, title, avatar, card, button, input</li>
            <li>✅ Skeleton composés : SkeletonCard, SkeletonList, SkeletonTable</li>
            <li>✅ Support Light/Dark mode automatique</li>
            <li>✅ Texte d'accompagnement optionnel</li>
            <li>✅ Inline usage dans boutons, inputs, etc.</li>
            <li>🌊 Couleur Teal par défaut (identité Haiti)</li>
            <li>🇭🇹 Parfait pour tous les états de chargement FinApp Haiti</li>
          </ul>
        </div>

      </div>

      {/* Full Page Loading (si activé) */}
      {showFullPage && (
        <Loading 
          fullPage 
          type="spinner" 
          size="xl" 
          color="teal"
          text="Chargement de l'application..." 
        />
      )}
    </div>
  );
};

export default LoadingExamples;