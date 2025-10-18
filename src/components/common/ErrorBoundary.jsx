import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Composant ErrorBoundary - Capture les erreurs React
 * 
 * Features:
 * - Capture erreurs composants enfants
 * - Affichage UI erreur personnalisé
 * - Boutons retry et retour accueil
 * - Log erreurs en console (dev)
 * - Peut envoyer erreurs à service monitoring (prod)
 * 
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher l'UI de secours
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Sauvegarder les détails de l'erreur
    this.setState({
      error,
      errorInfo
    });

    // En production, envoyer à un service de monitoring
    // comme Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }

    // Appeler le callback onError si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Si un composant fallback personnalisé est fourni
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error, this.handleReset) 
          : fallback;
      }

      // UI d'erreur par défaut
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl w-full">
            {/* Card d'erreur */}
            <div className="glass-card p-8 text-center space-y-6">
              {/* Icône */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Oups ! Une erreur s'est produite
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Nous sommes désolés, quelque chose s'est mal passé.
                </p>
              </div>

              {/* Message d'erreur (développement seulement) */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="text-left">
                  <details className="space-y-2">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400">
                      Détails techniques (dev)
                    </summary>
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
                      <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                        {error.toString()}
                      </p>
                      {errorInfo && (
                        <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  icon={RefreshCw}
                  size="lg"
                >
                  Réessayer
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  icon={Home}
                  size="lg"
                >
                  Retour à l'accueil
                </Button>
              </div>

              {/* Message d'aide */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Si le problème persiste, veuillez contacter le support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Pas d'erreur, afficher les enfants normalement
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  onReset: PropTypes.func
};

export default ErrorBoundary;