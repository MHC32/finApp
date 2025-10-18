// src/examples/AvatarExamples.jsx
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

/**
 * Page d'exemples pour tester le composant Avatar
 * Tous les types, tailles et cas d'usage réels
 */
const AvatarExamples = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Avatar Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Avatars avec images, initiales, status et palette Teal 🌊
          </p>
        </div>

        {/* Section 1 : Tailles */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Tailles (xs, sm, md, lg, xl, 2xl)
            </h2>
            
            <div className="flex items-end gap-4">
              <div className="text-center">
                <Avatar name="Jean Dupont" size="xs" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">xs</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" size="sm" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">sm</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" size="md" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">md</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" size="lg" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">lg</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" size="xl" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">xl</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" size="2xl" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">2xl</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2 : Formes */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Formes (circle, rounded, square)
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Avatar name="Jean Dupont" shape="circle" size="xl" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Circle</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" shape="rounded" size="xl" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Rounded</p>
              </div>

              <div className="text-center">
                <Avatar name="Jean Dupont" shape="square" size="xl" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Square</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3 : Avec initiales */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Avec initiales (générées depuis le nom)
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Noms complets (prend première + dernière lettre)
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Avatar name="Jean Dupont" size="lg" />
                  <Avatar name="Marie Pierre" size="lg" />
                  <Avatar name="Paul Michel" size="lg" />
                  <Avatar name="Sophie Laurent" size="lg" />
                  <Avatar name="Marc Antoine" size="lg" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Noms simples (prend 2 premières lettres)
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Avatar name="Jean" size="lg" />
                  <Avatar name="Marie" size="lg" />
                  <Avatar name="Paul" size="lg" />
                  <Avatar name="Sophie" size="lg" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Fallback personnalisé
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Avatar fallback="?" size="lg" />
                  <Avatar fallback="👤" size="lg" />
                  <Avatar fallback="U" size="lg" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 4 : Avec images */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. Avec images
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Images réelles (avec fallback vers initiales si erreur)
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=1" 
                    name="Jean Dupont"
                    alt="Jean Dupont"
                    size="lg" 
                  />
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=2" 
                    name="Marie Pierre"
                    alt="Marie Pierre"
                    size="lg" 
                  />
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=3" 
                    name="Paul Michel"
                    alt="Paul Michel"
                    size="lg" 
                  />
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=4" 
                    name="Sophie Laurent"
                    alt="Sophie Laurent"
                    size="lg" 
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Image cassée (fallback vers initiales automatique)
                </h3>
                <Avatar 
                  src="https://invalid-url.com/image.jpg" 
                  name="Jean Dupont"
                  alt="Jean Dupont"
                  size="lg" 
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 5 : Avec status indicator */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Avec status indicator
            </h2>
            
            <div className="space-y-6">
              {/* Status colors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Couleurs de status
                </h3>
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <Avatar name="JD" size="xl" status="online" statusColor="green" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Online (green)</p>
                  </div>

                  <div className="text-center">
                    <Avatar name="MP" size="xl" status="offline" statusColor="gray" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Offline (gray)</p>
                  </div>

                  <div className="text-center">
                    <Avatar name="PM" size="xl" status="busy" statusColor="red" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Busy (red)</p>
                  </div>

                  <div className="text-center">
                    <Avatar name="SL" size="xl" status="away" statusColor="orange" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Away (orange)</p>
                  </div>

                  <div className="text-center">
                    <Avatar name="MA" size="xl" status="active" statusColor="teal" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Active (teal)</p>
                  </div>

                  <div className="text-center">
                    <Avatar name="AL" size="xl" status="verified" statusColor="blue" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Verified (blue)</p>
                  </div>
                </div>
              </div>

              {/* Status sur différentes tailles */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Status adapté à la taille
                </h3>
                <div className="flex items-end gap-3">
                  <Avatar name="JD" size="sm" status="online" />
                  <Avatar name="JD" size="md" status="online" />
                  <Avatar name="JD" size="lg" status="online" />
                  <Avatar name="JD" size="xl" status="online" />
                  <Avatar name="JD" size="2xl" status="online" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 6 : Avatar.Group */}
        <section className="mb-12">
          <Card variant="glass">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              6. Avatar.Group (avatars empilés)
            </h2>
            
            <div className="space-y-6">
              {/* Groupe simple */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Groupe de 3 avatars
                </h3>
                <Avatar.Group>
                  <Avatar name="Jean Dupont" />
                  <Avatar name="Marie Pierre" />
                  <Avatar name="Paul Michel" />
                </Avatar.Group>
              </div>

              {/* Groupe avec max */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Groupe avec max (affiche +N pour le reste)
                </h3>
                <Avatar.Group max={3}>
                  <Avatar name="Jean Dupont" />
                  <Avatar name="Marie Pierre" />
                  <Avatar name="Paul Michel" />
                  <Avatar name="Sophie Laurent" />
                  <Avatar name="Marc Antoine" />
                  <Avatar name="Anne Louise" />
                </Avatar.Group>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Max 3 avatars, reste affiché avec +3
                </p>
              </div>

              {/* Différentes tailles */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Groupes de différentes tailles
                </h3>
                <div className="space-y-3">
                  <Avatar.Group size="sm">
                    <Avatar name="JD" />
                    <Avatar name="MP" />
                    <Avatar name="PM" />
                    <Avatar name="SL" />
                  </Avatar.Group>

                  <Avatar.Group size="md">
                    <Avatar name="JD" />
                    <Avatar name="MP" />
                    <Avatar name="PM" />
                    <Avatar name="SL" />
                  </Avatar.Group>

                  <Avatar.Group size="lg">
                    <Avatar name="JD" />
                    <Avatar name="MP" />
                    <Avatar name="PM" />
                    <Avatar name="SL" />
                  </Avatar.Group>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 7 : Cas d'usage FinApp Haiti */}
        <section className="mb-12">
          <Card variant="teal">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              7. Cas d'usage FinApp Haiti 🇭🇹
            </h2>
            
            <div className="space-y-8">
              {/* Profil utilisateur */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profil utilisateur avec status
                </h3>
                <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Avatar 
                    name="Jean Dupont"
                    size="xl"
                    status="online"
                    statusColor="green"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Jean Dupont</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">jean.dupont@email.com</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="subtle" color="green" size="sm">Membre actif</Badge>
                      <Badge variant="subtle" color="teal" size="sm">Premium</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membres Sol (Tontine) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Membres Sol (Tontine) 🇭🇹
                </h3>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">12 membres actifs</p>
                    <Avatar.Group max={5} size="md">
                      <Avatar name="Jean Dupont" status="online" />
                      <Avatar name="Marie Pierre" status="online" />
                      <Avatar name="Paul Michel" status="away" statusColor="orange" />
                      <Avatar name="Sophie Laurent" status="online" />
                      <Avatar name="Marc Antoine" />
                      <Avatar name="Anne Louise" />
                      <Avatar name="Pierre Jean" />
                      <Avatar name="Louise Marie" />
                      <Avatar name="Antoine Paul" />
                      <Avatar name="Julie Sophie" />
                      <Avatar name="Michel Jean" />
                      <Avatar name="Claire Marie" />
                    </Avatar.Group>
                  </div>
                  <Badge variant="solid" color="green" size="lg">Actif</Badge>
                </div>
              </div>

              {/* Compte bancaire */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Titulaire du compte
                </h3>
                <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Avatar 
                    name="Marie Pierre"
                    size="lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Marie Pierre</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compte principal • BUH</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">125,450 HTG</p>
                </div>
              </div>

              {/* Transactions récentes avec avatars */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Transactions récentes
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Paul Michel', action: 'Transfert reçu', amount: '+2,500 HTG', time: '2h' },
                    { name: 'Sophie Laurent', action: 'Paiement MonCash', amount: '-850 HTG', time: '5h' },
                    { name: 'Marc Antoine', action: 'Transfert envoyé', amount: '-1,200 HTG', time: '1j' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
                      <Avatar name={tx.name} size="md" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{tx.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tx.action} • Il y a {tx.time}</p>
                      </div>
                      <span className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Avatar Component
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ 6 tailles : xs, sm, md, lg, xl, 2xl</li>
            <li>✅ 3 formes : circle (défaut), rounded, square</li>
            <li>✅ Support images avec fallback automatique vers initiales</li>
            <li>✅ Génération automatique des initiales depuis le nom</li>
            <li>✅ Status indicator avec 6 couleurs (green, red, orange, gray, teal, blue)</li>
            <li>✅ Avatar.Group pour avatars empilés avec compteur +N</li>
            <li>✅ Gradient Teal → Blue par défaut (identité Haiti) 🌊</li>
            <li>✅ Support Light/Dark mode automatique</li>
            <li>✅ forwardRef + PropTypes complets</li>
            <li>✅ Accessible (alt text, aria-label pour status)</li>
            <li>🇭🇹 Parfait pour profils, membres Sol, transactions FinApp Haiti</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AvatarExamples;