// src/examples/ButtonExamples.jsx
import { useState } from 'react';
import Button from '../components/ui/Button';
import { 
  Save, 
  Trash2, 
  Download, 
  Plus,
  ArrowRight,
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Button
 * À utiliser pendant le développement pour valider toutes les variantes
 */
const ButtonExamples = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Simuler un chargement
  const handleLoadingTest = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Button Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tous les exemples du composant Button avec variantes, tailles et états
          </p>
        </div>

        {/* Section 1 : Variantes de base */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            1. Variantes principales
          </h2>
          
          <div className="space-y-4">
            {/* Primary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Primary (Bleu Haiti 🇭🇹)
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" leftIcon={Save}>Enregistrer</Button>
                <Button variant="primary" rightIcon={ArrowRight}>Continuer</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Secondary
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="secondary" leftIcon={Settings}>Paramètres</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
            </div>

            {/* Danger */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Danger (Rouge Haiti 🇭🇹)
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="danger">Danger Button</Button>
                <Button variant="danger" leftIcon={Trash2}>Supprimer</Button>
                <Button variant="danger" disabled>Disabled</Button>
              </div>
            </div>

            {/* Success */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Success
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="success">Success Button</Button>
                <Button variant="success" leftIcon={CheckCircle}>Valider</Button>
                <Button variant="success" disabled>Disabled</Button>
              </div>
            </div>

            {/* Warning */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Warning
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="warning">Warning Button</Button>
                <Button variant="warning" leftIcon={AlertCircle}>Attention</Button>
                <Button variant="warning" disabled>Disabled</Button>
              </div>
            </div>

            {/* Ghost */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ghost
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="ghost" leftIcon={Info}>Info</Button>
                <Button variant="ghost" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 : Variantes Outline */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            2. Variantes Outline
          </h2>
          
          <div className="space-y-4">
            {/* Outline Primary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Outline Primary
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Outline Button</Button>
                <Button variant="outline" leftIcon={Download}>Télécharger</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
            </div>

            {/* Outline Secondary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Outline Secondary
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline-secondary">Outline Secondary</Button>
                <Button variant="outline-secondary" leftIcon={Settings}>Options</Button>
                <Button variant="outline-secondary" disabled>Disabled</Button>
              </div>
            </div>

            {/* Outline Danger */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Outline Danger
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline-danger">Outline Danger</Button>
                <Button variant="outline-danger" leftIcon={Trash2}>Effacer</Button>
                <Button variant="outline-danger" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 : Tailles */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            3. Tailles (sm, md, lg)
          </h2>
          
          <div className="flex flex-wrap items-end gap-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium (défaut)</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <Button variant="outline" size="sm" leftIcon={Plus}>Ajouter</Button>
            <Button variant="outline" size="md" leftIcon={Plus}>Ajouter</Button>
            <Button variant="outline" size="lg" leftIcon={Plus}>Ajouter</Button>
          </div>
        </section>

        {/* Section 4 : États Loading */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            4. État Loading
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Cliquez pour tester le loading (2 secondes)
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  isLoading={isLoading}
                  onClick={handleLoadingTest}
                >
                  Test Loading
                </Button>
                <Button 
                  variant="secondary" 
                  isLoading={isLoading}
                  leftIcon={Save}
                >
                  Sauvegarde...
                </Button>
                <Button 
                  variant="danger" 
                  isLoading={isLoading}
                >
                  Suppression...
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Loading permanent (pour démo)
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" isLoading size="sm">Loading Small</Button>
                <Button variant="primary" isLoading size="md">Loading Medium</Button>
                <Button variant="primary" isLoading size="lg">Loading Large</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 : Full Width */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            5. Full Width
          </h2>
          
          <div className="space-y-3">
            <Button variant="primary" fullWidth>
              Bouton pleine largeur Primary
            </Button>
            <Button variant="secondary" fullWidth leftIcon={Save}>
              Bouton pleine largeur avec icône
            </Button>
            <Button variant="outline" fullWidth rightIcon={ArrowRight}>
              Bouton pleine largeur Outline
            </Button>
          </div>
        </section>

        {/* Section 6 : Composition d'icônes */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            6. Composition avec icônes
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Icône gauche
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={Plus}>Nouveau compte</Button>
                <Button variant="secondary" leftIcon={Download}>Exporter</Button>
                <Button variant="success" leftIcon={CheckCircle}>Approuver</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Icône droite
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" rightIcon={ArrowRight}>Suivant</Button>
                <Button variant="outline" rightIcon={ArrowRight}>Continuer</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Icône seule (sans texte - possible avec children vide)
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" leftIcon={Settings}>
                  {/* Texte optionnel */}
                </Button>
                <Button variant="ghost" leftIcon={Trash2}>
                  {/* Texte optionnel */}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 : Groupes de boutons */}
        <section className="mb-12 glass-light dark:glass-dark glass-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            7. Groupes de boutons
          </h2>
          
          <div className="space-y-4">
            {/* Actions primaires */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Actions primaires
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={Save}>Enregistrer</Button>
                <Button variant="secondary">Annuler</Button>
              </div>
            </div>

            {/* Actions destructives */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Actions destructives
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="danger" leftIcon={Trash2}>Supprimer</Button>
                <Button variant="ghost">Annuler</Button>
              </div>
            </div>

            {/* Actions tertiaires */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Navigation
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Précédent</Button>
                <Button variant="primary" rightIcon={ArrowRight}>Suivant</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📝 Notes d'utilisation
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>✅ Toutes les variantes supportent Light/Dark mode automatiquement</li>
            <li>✅ Les icônes utilisent lucide-react (import en tant que composant)</li>
            <li>✅ Le composant est accessible (focus ring, disabled states)</li>
            <li>✅ forwardRef est supporté pour les refs React</li>
            <li>🇭🇹 Les couleurs Haiti sont utilisées pour primary et danger</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ButtonExamples;