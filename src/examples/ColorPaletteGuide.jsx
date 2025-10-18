// src/examples/ColorPaletteGuide.jsx
import Button from '../components/ui/Button';
import { Palette, Check } from 'lucide-react';

/**
 * Guide visuel de la palette de couleurs FinApp Haiti 🇭🇹
 * Montre toutes les couleurs avec leurs codes hex
 */
const ColorPaletteGuide = () => {
  
  // Copier un code couleur dans le presse-papier
  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Couleur ${color} copiée ! ✓`);
  };

  const ColorCard = ({ name, hex, description, tailwindClass, icon }) => (
    <div 
      className="glass-light dark:glass-dark glass-card group cursor-pointer transition-transform hover:scale-105"
      onClick={() => copyColor(hex)}
    >
      {/* Preview de couleur */}
      <div 
        className={`h-32 rounded-lg mb-4 flex items-center justify-center text-white text-4xl ${tailwindClass}`}
      >
        {icon}
      </div>
      
      {/* Infos */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {hex}
          </code>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Cliquer pour copier
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Palette size={40} className="text-haiti-blue" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Palette de couleurs 🇭🇹
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            FinApp Haiti - Couleurs officielles avec Teal Turquoise
          </p>
        </div>

        {/* Palette principale Haiti */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🇭🇹 Couleurs Haiti (Palette principale)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ColorCard
              name="Haiti Blue"
              hex="#1e40af"
              description="Bleu du drapeau - Couleur primaire"
              tailwindClass="bg-haiti-blue"
              icon="🔵"
            />
            
            <ColorCard
              name="Haiti Teal"
              hex="#0d9488"
              description="Turquoise mer des Caraïbes - Secondaire 🌊"
              tailwindClass="bg-haiti-teal"
              icon="🌊"
            />
            
            <ColorCard
              name="Haiti Red"
              hex="#dc2626"
              description="Rouge du drapeau - Danger/Attention"
              tailwindClass="bg-haiti-red"
              icon="🔴"
            />
          </div>
        </section>

        {/* Couleurs système */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ⚙️ Couleurs système
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ColorCard
              name="Success"
              hex="#10b981"
              description="Vert - Succès, validation"
              tailwindClass="bg-success"
              icon="✓"
            />
            
            <ColorCard
              name="Warning"
              hex="#f59e0b"
              description="Orange - Avertissement"
              tailwindClass="bg-warning"
              icon="⚠️"
            />
            
            <ColorCard
              name="Info"
              hex="#3b82f6"
              description="Bleu clair - Information"
              tailwindClass="bg-info"
              icon="ℹ️"
            />
          </div>
        </section>

        {/* Nuances */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎨 Nuances disponibles
          </h2>
          
          {/* Blue nuances */}
          <div className="mb-8 glass-light dark:glass-dark glass-card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Haiti Blue
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-haiti-blue-light h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#3b82f6</p>
                <p className="text-xs text-gray-500">Light</p>
              </div>
              <div className="text-center">
                <div className="bg-haiti-blue h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#1e40af</p>
                <p className="text-xs text-gray-500">Default</p>
              </div>
              <div className="text-center">
                <div className="bg-haiti-blue-dark h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#1e3a8a</p>
                <p className="text-xs text-gray-500">Dark</p>
              </div>
            </div>
          </div>

          {/* Teal nuances */}
          <div className="mb-8 glass-light dark:glass-dark glass-card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Haiti Teal 🌊
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-haiti-teal-light h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#14b8a6</p>
                <p className="text-xs text-gray-500">Light</p>
              </div>
              <div className="text-center">
                <div className="bg-haiti-teal h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#0d9488</p>
                <p className="text-xs text-gray-500">Default</p>
              </div>
              <div className="text-center">
                <div className="bg-haiti-teal-dark h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#0f766e</p>
                <p className="text-xs text-gray-500">Dark</p>
              </div>
            </div>
          </div>

          {/* Red nuances */}
          <div className="glass-light dark:glass-dark glass-card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Haiti Red
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-haiti-red-light h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#ef4444</p>
                <p className="text-xs text-gray-500">Light</p>
              </div>
              <div className="text-center">
                <div className="bg-haiti-red h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#dc2626</p>
                <p className="text-xs text-gray-500">Default</p>
              </div>
              <div className="text-center">
                <div className="bg-haiti-red-dark h-20 rounded-lg mb-2"></div>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">#991b1b</p>
                <p className="text-xs text-gray-500">Dark</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exemples d'utilisation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎯 Exemples d'utilisation
          </h2>
          
          <div className="glass-light dark:glass-dark glass-card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Boutons avec nouvelle palette
            </h3>
            
            <div className="space-y-6">
              {/* Primary */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Primary (Bleu Haiti)
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Action principale</Button>
                  <Button variant="outline">Outline bleu</Button>
                </div>
              </div>

              {/* Secondary - NOUVEAU TEAL */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Secondary (Teal Turquoise) 🌊 ← NOUVEAU !
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Action secondaire</Button>
                  <Button variant="outline-secondary">Outline teal</Button>
                </div>
              </div>

              {/* Danger */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Danger (Rouge Haiti)
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="danger">Supprimer</Button>
                  <Button variant="outline-danger">Outline rouge</Button>
                </div>
              </div>

              {/* Success & Warning */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Système
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="success">Succès</Button>
                  <Button variant="warning">Avertissement</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guide d'utilisation */}
        <section className="mb-12">
          <div className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Check size={24} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-3">
                  ✨ Nouvelle palette appliquée !
                </h3>
                <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-2">
                  <li><strong>Primary (Bleu Haiti)</strong> : Actions principales, navigation</li>
                  <li><strong>Secondary (Teal Turquoise) 🌊</strong> : Actions secondaires, éléments complémentaires</li>
                  <li><strong>Danger (Rouge Haiti)</strong> : Suppressions, alertes critiques</li>
                  <li><strong>Success</strong> : Validations, confirmations</li>
                  <li><strong>Warning</strong> : Avertissements, attention</li>
                  <li><strong>Info</strong> : Informations, aide contextuelle</li>
                </ul>
                
                <div className="mt-4 pt-4 border-t border-teal-200 dark:border-teal-800">
                  <p className="text-sm text-teal-700 dark:text-teal-300">
                    💡 <strong>Astuce</strong> : Cliquez sur une carte couleur pour copier son code hex !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>🇭🇹 FinApp Haiti - Palette de couleurs inspirée par la mer des Caraïbes</p>
        </div>

      </div>
    </div>
  );
};

export default ColorPaletteGuide;