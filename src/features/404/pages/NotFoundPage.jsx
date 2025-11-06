// src/pages/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { 
  Home, 
  ArrowLeft, 
  Search,
  AlertTriangle,
  Compass
} from 'lucide-react';

// Composants réutilisables
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';
import Badge from '../../../components/ui/Badge';

/**
 * Page 404 - Page non trouvée avec design élégant
 * Features: Glassmorphism, animations, suggestions, palette Haiti
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  // Pages suggérées selon le contexte
  const suggestedPages = [
    { 
      name: 'Tableau de bord', 
      path: ROUTES.DASHBOARD, 
      description: 'Retour à l\'accueil',
      icon: Home 
    },
    { 
      name: 'Comptes', 
      path: ROUTES.ACCOUNTS, 
      description: 'Gérer vos comptes',
      icon: Search 
    },
    { 
      name: 'Transactions', 
      path: ROUTES.TRANSACTIONS, 
      description: 'Voir l\'historique',
      icon: ArrowLeft 
    },
  ];

  // Actions principales
  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-haiti-teal/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-haiti-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-haiti-red/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Motifs géométriques */}
        <div className="absolute top-10 right-10 w-8 h-8 border-2 border-haiti-teal/20 rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-10 w-6 h-6 border-2 border-haiti-blue/20 rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-10 h-10 border-2 border-haiti-red/20 rounded-lg"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        
        {/* Header avec badge */}
        <div className="text-center mb-8">
          <Badge 
            variant="subtle" 
            color="teal" 
            className="mb-4 animate-bounce"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Erreur 404
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
            Page <span className="text-haiti-teal">Introuvable</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Désolé, la page que vous recherchez semble s'être égarée dans les Caraïbes 🌊
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Carte principale */}
          <Card 
            variant="glass-intense"
            hoverable
            className="text-center p-8 animate-slideUp"
          >
            {/* Icône animée */}
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-haiti-teal to-haiti-blue rounded-full flex items-center justify-center shadow-2xl">
                <Compass className="w-16 h-16 text-white animate-spin-slow" />
              </div>
              
              {/* Effet de halo */}
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-haiti-teal/20 rounded-full animate-ping"></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Navigation Perdue ?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Ne vous inquiétez pas, même les meilleurs navigateurs se perdent parfois !
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Retrouvons ensemble votre chemin vers la gestion de vos finances 🇭🇹
            </p>

            {/* Actions principales */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGoHome}
                leftIcon={Home}
                size="lg"
                className="flex-1"
              >
                Tableau de bord
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                leftIcon={ArrowLeft}
                size="lg"
                className="flex-1"
              >
                Retour
              </Button>
            </div>
          </Card>

          {/* Suggestions de pages */}
          <div className="space-y-4 animate-slideUp delay-150">
            <Card 
              variant="glass"
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-haiti-teal" />
                Pages suggérées
              </h3>
              
              <div className="space-y-3">
                {suggestedPages.map((page, index) => (
                  <Card
                    key={page.name}
                    variant="subtle"
                    hoverable
                    clickable
                    onClick={() => navigate(page.path)}
                    className="p-4 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-haiti-teal/10 rounded-lg flex items-center justify-center">
                        <page.icon className="w-5 h-5 text-haiti-teal" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {page.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {page.description}
                        </p>
                      </div>
                      
                      <Badge.Dot 
                        show 
                        color="teal" 
                        className="animate-pulse"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Alert d'aide */}
            <Alert
              type="tip"
              title="Besoin d'aide ?"
              description="Notre équipe de support est là pour vous aider à retrouver votre chemin."
              variant="subtle"
              dismissible
            >
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/help')}
                >
                  Contacter le support
                </Button>
              </div>
            </Alert>
          </div>
        </div>

        {/* Footer décoratif */}
        <div className="text-center mt-12 animate-fadeIn delay-300">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>FinApp Haiti</span>
            <span>•</span>
            <span>Gestion financière intelligente</span>
            <span>•</span>
            <span>🇭🇹</span>
          </div>
        </div>
      </div>

      {/* Loading indicator discret */}
      <div className="fixed bottom-8 right-8">
        <Loading
          type="dots"
          size="sm"
          color="teal"
          text="Recherche de solutions..."
        />
      </div>
    </div>
  );
};

export default NotFoundPage;