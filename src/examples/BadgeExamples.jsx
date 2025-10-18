// src/examples/BadgeExamples.jsx
import { useState } from 'react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Heart,
  Bell,
  Mail,
  ShoppingCart,
  User,
  Settings,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Badge
 * Tous les types, tailles, couleurs et cas d'usage réels
 */
const BadgeExamples = () => {
  const [badges, setBadges] = useState([
    { id: 1, label: 'Design', color: 'teal' },
    { id: 2, label: 'Development', color: 'blue' },
    { id: 3, label: 'Marketing', color: 'green' },
    { id: 4, label: 'Finance', color: 'orange' },
  ]);

  const handleRemove = (id) => {
    setBadges(badges.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Badge Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Badges pour statuts, labels, compteurs avec palette Teal 🌊
          </p>
        </div>

        {/* Section 1 : Variantes */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Variantes (solid, outline, subtle)
            </h2>
            
            <div className="space-y-6">
              {/* Solid */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Solid (fond plein)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="solid" color="teal">Teal 🌊</Badge>
                  <Badge variant="solid" color="blue">Blue 🔵</Badge>
                  <Badge variant="solid" color="red">Red 🔴</Badge>
                  <Badge variant="solid" color="green">Success</Badge>
                  <Badge variant="solid" color="orange">Warning</Badge>
                  <Badge variant="solid" color="yellow">Yellow</Badge>
                  <Badge variant="solid" color="purple">Purple</Badge>
                  <Badge variant="solid" color="gray">Gray</Badge>
                </div>
              </div>

              {/* Outline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Outline (bordure seulement)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" color="teal">Teal 🌊</Badge>
                  <Badge variant="outline" color="blue">Blue 🔵</Badge>
                  <Badge variant="outline" color="red">Red 🔴</Badge>
                  <Badge variant="outline" color="green">Success</Badge>
                  <Badge variant="outline" color="orange">Warning</Badge>
                  <Badge variant="outline" color="yellow">Yellow</Badge>
                  <Badge variant="outline" color="purple">Purple</Badge>
                  <Badge variant="outline" color="gray">Gray</Badge>
                </div>
              </div>

              {/* Subtle */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Subtle (fond semi-transparent)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="subtle" color="teal">Teal 🌊</Badge>
                  <Badge variant="subtle" color="blue">Blue 🔵</Badge>
                  <Badge variant="subtle" color="red">Red 🔴</Badge>
                  <Badge variant="subtle" color="green">Success</Badge>
                  <Badge variant="subtle" color="orange">Warning</Badge>
                  <Badge variant="subtle" color="yellow">Yellow</Badge>
                  <Badge variant="subtle" color="purple">Purple</Badge>
                  <Badge variant="subtle" color="gray">Gray</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2 : Tailles */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Tailles (sm, md, lg)
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="solid" color="teal" size="sm">Small</Badge>
                <Badge variant="solid" color="teal" size="md">Medium</Badge>
                <Badge variant="solid" color="teal" size="lg">Large</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" color="blue" size="sm">Small</Badge>
                <Badge variant="outline" color="blue" size="md">Medium</Badge>
                <Badge variant="outline" color="blue" size="lg">Large</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="subtle" color="green" size="sm">Small</Badge>
                <Badge variant="subtle" color="green" size="md">Medium</Badge>
                <Badge variant="subtle" color="green" size="lg">Large</Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3 : Formes */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Formes (rounded, pill, square)
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="solid" color="teal" shape="rounded">Rounded</Badge>
              <Badge variant="solid" color="blue" shape="pill">Pill (full rounded)</Badge>
              <Badge variant="solid" color="red" shape="square">Square</Badge>
            </div>
          </Card>
        </section>

        {/* Section 4 : Avec icônes */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. Avec icônes
            </h2>
            
            <div className="space-y-4">
              {/* Icône gauche */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Icône à gauche
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="solid" color="green" leftIcon={CheckCircle}>Validé</Badge>
                  <Badge variant="solid" color="red" leftIcon={AlertCircle}>Erreur</Badge>
                  <Badge variant="solid" color="orange" leftIcon={Clock}>En attente</Badge>
                  <Badge variant="solid" color="teal" leftIcon={Star}>Favori</Badge>
                </div>
              </div>

              {/* Icône droite */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Icône à droite
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" color="blue" rightIcon={TrendingUp}>En hausse</Badge>
                  <Badge variant="outline" color="teal" rightIcon={Zap}>Premium</Badge>
                  <Badge variant="outline" color="purple" rightIcon={Heart}>Aimé</Badge>
                </div>
              </div>

              {/* Tailles d'icônes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Icônes adaptées à la taille
                </h3>
                <div className="flex items-center gap-3">
                  <Badge variant="solid" color="teal" leftIcon={Star} size="sm">Small</Badge>
                  <Badge variant="solid" color="teal" leftIcon={Star} size="md">Medium</Badge>
                  <Badge variant="solid" color="teal" leftIcon={Star} size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 5 : Avec dot indicator */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Avec dot indicator
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="solid" color="green" dot>Actif</Badge>
              <Badge variant="solid" color="red" dot>Inactif</Badge>
              <Badge variant="solid" color="orange" dot>En pause</Badge>
              <Badge variant="outline" color="teal" dot>En ligne</Badge>
              <Badge variant="subtle" color="blue" dot>Disponible</Badge>
            </div>
          </Card>
        </section>

        {/* Section 6 : Removable */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              6. Removable (avec bouton X)
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cliquez sur le X pour retirer un badge
              </p>
              
              <div className="flex flex-wrap gap-2">
                {badges.map(badge => (
                  <Badge
                    key={badge.id}
                    variant="solid"
                    color={badge.color}
                    removable
                    onRemove={() => handleRemove(badge.id)}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>

              {badges.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Tous les badges ont été retirés ! Rechargez la page pour les voir à nouveau.
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* Section 7 : Badge.Dot (notification) */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              7. Badge.Dot (compteur de notifications)
            </h2>
            
            <div className="space-y-6">
              {/* Avec count */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Avec compteur
                </h3>
                <div className="flex gap-6">
                  <div className="relative">
                    <Bell size={32} className="text-gray-700 dark:text-gray-300" />
                    <Badge.Dot count={3} />
                  </div>

                  <div className="relative">
                    <Mail size={32} className="text-gray-700 dark:text-gray-300" />
                    <Badge.Dot count={12} color="teal" />
                  </div>

                  <div className="relative">
                    <ShoppingCart size={32} className="text-gray-700 dark:text-gray-300" />
                    <Badge.Dot count={5} color="blue" />
                  </div>

                  <div className="relative">
                    <Settings size={32} className="text-gray-700 dark:text-gray-300" />
                    <Badge.Dot count={150} max={99} color="red" />
                  </div>
                </div>
              </div>

              {/* Sans count (juste dot) */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Juste un point (sans nombre)
                </h3>
                <div className="flex gap-6">
                  <div className="relative">
                    <User size={32} className="text-gray-700 dark:text-gray-300" />
                    <Badge.Dot color="green" />
                  </div>

                  <div className="relative">
                    <Bell size={32} className="text-gray-700 dark:text-gray-300" />
                    <Badge.Dot color="red" />
                  </div>
                </div>
              </div>

              {/* Positions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Positions (top-right, top-left, bottom-right, bottom-left)
                </h3>
                <div className="flex gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Top-R</span>
                    </div>
                    <Badge.Dot count={5} position="top-right" />
                  </div>

                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Top-L</span>
                    </div>
                    <Badge.Dot count={5} position="top-left" />
                  </div>

                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bot-R</span>
                    </div>
                    <Badge.Dot count={5} position="bottom-right" />
                  </div>

                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bot-L</span>
                    </div>
                    <Badge.Dot count={5} position="bottom-left" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 8 : Cas d'usage FinApp Haiti */}
        <section className="mb-12">
          <Card variant="teal">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              8. Cas d'usage FinApp Haiti 🇭🇹
            </h2>
            
            <div className="space-y-8">
              {/* Statuts de compte */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Statuts de compte
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="solid" color="green" leftIcon={CheckCircle} dot>Actif</Badge>
                  <Badge variant="solid" color="red" leftIcon={AlertCircle}>Suspendu</Badge>
                  <Badge variant="solid" color="orange" leftIcon={Clock}>En attente</Badge>
                  <Badge variant="subtle" color="gray">Inactif</Badge>
                </div>
              </div>

              {/* Types de transactions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Types de transactions
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" color="green" leftIcon={TrendingUp}>Revenu</Badge>
                  <Badge variant="outline" color="red" leftIcon={DollarSign}>Dépense</Badge>
                  <Badge variant="outline" color="teal">Transfert</Badge>
                  <Badge variant="outline" color="blue">Épargne</Badge>
                </div>
              </div>

              {/* Catégories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Catégories de dépenses
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="subtle" color="purple">Alimentation</Badge>
                  <Badge variant="subtle" color="blue">Transport</Badge>
                  <Badge variant="subtle" color="green">Santé</Badge>
                  <Badge variant="subtle" color="orange">Loisirs</Badge>
                  <Badge variant="subtle" color="teal">Éducation</Badge>
                  <Badge variant="subtle" color="red">Urgent</Badge>
                </div>
              </div>

              {/* Devises */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Devises 🇭🇹
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="solid" color="teal">HTG</Badge>
                  <Badge variant="solid" color="blue">USD</Badge>
                  <Badge variant="outline" color="gray">EUR</Badge>
                </div>
              </div>

              {/* Rôles Sol (Tontine) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Rôles Sol (Tontine) 🇭🇹
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="solid" color="purple" leftIcon={Star}>Organisateur</Badge>
                  <Badge variant="solid" color="teal">Membre actif</Badge>
                  <Badge variant="subtle" color="orange">En attente</Badge>
                  <Badge variant="outline" color="green">Invité</Badge>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notifications avec compteurs
                </h3>
                <div className="flex gap-6">
                  <div className="relative">
                    <Button variant="ghost" className="relative">
                      <Bell size={20} />
                      <Badge.Dot count={7} color="red" />
                    </Button>
                  </div>

                  <div className="relative">
                    <Button variant="ghost">
                      <Mail size={20} />
                      <Badge.Dot count={3} color="teal" />
                    </Button>
                  </div>

                  <div className="relative">
                    <Button variant="ghost">
                      <ShoppingCart size={20} />
                      <Badge.Dot count={2} color="blue" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Badge Component
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ 3 variantes : solid, outline, subtle</li>
            <li>✅ 8 couleurs : teal 🌊, blue 🔵, red 🔴, green, orange, yellow, purple, gray</li>
            <li>✅ 3 tailles : sm, md, lg</li>
            <li>✅ 3 formes : rounded, pill, square</li>
            <li>✅ Support icônes gauche/droite (lucide-react)</li>
            <li>✅ Dot indicator optionnel</li>
            <li>✅ Removable avec bouton X</li>
            <li>✅ Badge.Dot pour compteurs de notifications</li>
            <li>✅ Badge.Dot : 4 positions (top-right, top-left, bottom-right, bottom-left)</li>
            <li>✅ Support Light/Dark mode automatique</li>
            <li>✅ forwardRef + PropTypes complets</li>
            <li>🌊 Couleur Teal par défaut pour identité Haiti</li>
            <li>🇭🇹 Parfait pour statuts, labels, compteurs FinApp Haiti</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default BadgeExamples;