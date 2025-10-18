// src/examples/CardExamples.jsx
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  CreditCard,
  Wallet,
  Building2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Settings,
  MoreVertical,
  ArrowRight
} from 'lucide-react';

/**
 * Page d'exemples pour tester le composant Card
 * Toutes les variantes, configurations et cas d'usage réels
 */
const CardExamples = () => {

  const handleCardClick = (title) => {
    alert(`Card "${title}" cliquée !`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🇭🇹 Card Component - FinApp Haiti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cards avec glassmorphism et palette Teal 🌊
          </p>
        </div>

        {/* Section 1 : Variantes de base */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            1. Variantes de base
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Glass (par défaut) */}
            <Card variant="glass">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-haiti-blue/10 rounded-lg">
                  <DollarSign className="text-haiti-blue" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Glass</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glassmorphism par défaut avec backdrop blur
              </p>
            </Card>

            {/* Glass Intense */}
            <Card variant="glass-intense">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-haiti-teal/10 rounded-lg">
                  <TrendingUp className="text-haiti-teal" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Glass Intense</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glassmorphism plus opaque pour meilleur contraste
              </p>
            </Card>

            {/* Solid */}
            <Card variant="solid">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <CreditCard className="text-gray-700 dark:text-gray-300" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Solid</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Background solide blanc/gris
              </p>
            </Card>

            {/* Teal accent */}
            <Card variant="teal">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-haiti-teal/10 rounded-lg">
                  <Wallet className="text-haiti-teal" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Teal 🌊</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glass avec bordure Teal Turquoise
              </p>
            </Card>

            {/* Blue accent */}
            <Card variant="blue">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-haiti-blue/10 rounded-lg">
                  <Building2 className="text-haiti-blue" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Blue 🔵</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glass avec bordure Bleu Haiti
              </p>
            </Card>

            {/* Red accent */}
            <Card variant="red">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-haiti-red/10 rounded-lg">
                  <TrendingDown className="text-haiti-red" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Red 🔴</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glass avec bordure Rouge Haiti
              </p>
            </Card>
          </div>
        </section>

        {/* Section 2 : Avec Header et Footer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            2. Avec Header et Footer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avec header et footer (méthode props) */}
            <Card
              variant="glass"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Compte Principal
                  </h3>
                  <button className="text-gray-500 hover:text-haiti-teal">
                    <Settings size={20} />
                  </button>
                </div>
              }
              footer={
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Dernière mise à jour
                  </span>
                  <Button variant="outline-secondary" size="sm">
                    Détails
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Solde actuel</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    25,000 HTG
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 dark:text-green-400">+5.2%</span>
                  <span className="text-gray-500 dark:text-gray-400">ce mois</span>
                </div>
              </div>
            </Card>

            {/* Avec sous-composants */}
            <Card variant="teal">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <span>Transaction Récente</span>
                  <MoreVertical size={20} className="text-gray-500" />
                </div>
              </Card.Header>
              
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-haiti-teal/10 rounded-lg">
                      <DollarSign className="text-haiti-teal" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Paiement MonCash
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Il y a 2 heures
                      </p>
                    </div>
                    <span className="font-bold text-haiti-red">-1,500 HTG</span>
                  </div>
                </div>
              </Card.Body>
              
              <Card.Footer>
                <Button variant="ghost" size="sm" rightIcon={ArrowRight}>
                  Voir tout
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </section>

        {/* Section 3 : Stats Cards (Dashboard) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            3. Stats Cards (Dashboard style)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenus */}
            <Card variant="glass" hoverable>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  +12.5%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenus</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                45,300 HTG
              </h3>
            </Card>

            {/* Dépenses */}
            <Card variant="glass" hoverable>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  -8.2%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dépenses</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                32,150 HTG
              </h3>
            </Card>

            {/* Épargne */}
            <Card variant="glass" hoverable>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-haiti-teal/10 rounded-lg">
                  <Wallet className="text-haiti-teal" size={24} />
                </div>
                <span className="text-xs font-medium text-haiti-teal bg-haiti-teal/10 px-2 py-1 rounded">
                  Stable
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Épargne</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                13,150 HTG
              </h3>
            </Card>

            {/* Utilisateurs */}
            <Card variant="glass" hoverable>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-haiti-blue/10 rounded-lg">
                  <Users className="text-haiti-blue" size={24} />
                </div>
                <span className="text-xs font-medium text-haiti-blue bg-haiti-blue/10 px-2 py-1 rounded">
                  +3
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Membres Sol</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                12 personnes
              </h3>
            </Card>
          </div>
        </section>

        {/* Section 4 : Tailles de padding */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            4. Tailles de padding
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card variant="glass" padding="none">
              <div className="p-4 bg-haiti-blue/5 rounded-t-2xl">
                <p className="text-xs font-medium text-haiti-blue">Padding: none</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aucun padding (p-0)
                </p>
              </div>
            </Card>

            <Card variant="glass" padding="sm">
              <p className="text-xs font-medium text-haiti-teal mb-2">Padding: sm</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Petit (p-4)
              </p>
            </Card>

            <Card variant="glass" padding="md">
              <p className="text-xs font-medium text-haiti-teal mb-2">Padding: md</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Moyen (p-6)
              </p>
            </Card>

            <Card variant="glass" padding="lg">
              <p className="text-xs font-medium text-haiti-teal mb-2">Padding: lg</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Large (p-8)
              </p>
            </Card>

            <Card variant="glass" padding="xl">
              <p className="text-xs font-medium text-haiti-teal mb-2">Padding: xl</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Extra large (p-10)
              </p>
            </Card>
          </div>
        </section>

        {/* Section 5 : Hoverable et Clickable */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            5. Hoverable et Clickable
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Normal */}
            <Card variant="glass">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Normal
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Card standard sans effet
              </p>
            </Card>

            {/* Hoverable */}
            <Card variant="glass" hoverable>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Hoverable
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Survole-moi pour voir l'effet ! (shadow + scale + translate)
              </p>
            </Card>

            {/* Clickable */}
            <Card 
              variant="teal" 
              clickable 
              hoverable
              onClick={() => handleCardClick('Clickable Card')}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Clickable
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clique-moi ! J'ai un cursor pointer et un onClick
              </p>
            </Card>
          </div>
        </section>

        {/* Section 6 : Cas d'usage réels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            6. Cas d'usage réels - FinApp Haiti
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carte de compte bancaire */}
            <Card variant="blue" hoverable>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-haiti-blue/10 rounded-lg">
                    <Building2 className="text-haiti-blue" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">BUH</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Banque de l'Union Haïtienne
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-haiti-blue">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Numéro de compte
                  </p>
                  <p className="font-mono font-bold text-gray-900 dark:text-white">
                    **** **** **** 3421
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Solde disponible
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    125,450.00 HTG
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" fullWidth>
                    Transférer
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    Détails
                  </Button>
                </div>
              </div>
            </Card>

            {/* Carte de profil utilisateur */}
            <Card variant="teal">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-haiti-teal to-haiti-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Jean Dupont
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Membre depuis 2024
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Heart size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-haiti-teal" />
                  <span className="text-gray-700 dark:text-gray-300">
                    jean.dupont@email.com
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-haiti-teal" />
                  <span className="text-gray-700 dark:text-gray-300">
                    +509 1234 5678
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-haiti-teal" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Port-au-Prince, Haiti 🇭🇹
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" size="sm" fullWidth>
                  Modifier le profil
                </Button>
              </div>
            </Card>

            {/* Carte de Sol (Tontine) */}
            <Card variant="glass-intense" hoverable clickable>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Users className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Sol Famille
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      15 membres actifs
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  Actif
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Cotisation
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    500 HTG
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Prochain tour
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    5 jours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>Paiement tous les lundis</span>
              </div>
            </Card>

            {/* Carte transaction récente */}
            <Card variant="glass">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Transactions Récentes
                </h3>
                <Button variant="ghost" size="sm" rightIcon={ArrowRight}>
                  Tout voir
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'MonCash Recharge', amount: '+2,500', positive: true, time: '2h' },
                  { name: 'Supermarché', amount: '-850', positive: false, time: '5h' },
                  { name: 'Transfert reçu', amount: '+1,200', positive: true, time: '1j' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.positive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        <DollarSign size={16} className={tx.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {tx.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Il y a {tx.time}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.amount} HTG
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
            📝 Notes d'utilisation - Card Component
          </h3>
          <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
            <li>✅ Glassmorphism par défaut avec backdrop-blur</li>
            <li>✅ 7 variantes : glass, glass-intense, solid, teal, blue, red, outline</li>
            <li>✅ Support Light/Dark mode automatique</li>
            <li>✅ Sections Header/Footer optionnelles</li>
            <li>✅ Sous-composants : Card.Header, Card.Title, Card.Description, Card.Body, Card.Footer</li>
            <li>✅ Hoverable (shadow + scale + translate)</li>
            <li>✅ Clickable avec onClick</li>
            <li>✅ 5 tailles de padding : none, sm, md, lg, xl</li>
            <li>🌊 Bordures Teal disponibles pour accent visuel</li>
            <li>🇭🇹 Couleurs Haiti intégrées (Bleu, Teal, Rouge)</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CardExamples;