// src/components/ui/ExchangeWidget.jsx
import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useExchange } from '../../hooks/useExchange';
import { Button, Card, Input, Badge } from '../ui';

const ExchangeWidget = ({ showConverter = true, showSettings = false, className = '' }) => {
  const {
    isReady,
    loading,
    refreshRates,
    convert,
    getCurrentRate,
    getStatus,
    preferredCurrency,
    setPreferredCurrency,
    htgToUsd,
    usdToHtg
  } = useExchange();

  // État du convertisseur
  const [converterState, setConverterState] = useState({
    amount: 1000,
    fromCurrency: 'HTG',
    toCurrency: 'USD',
    result: 0
  });

  // Historique des taux (simulation)
  const [rateHistory, setRateHistory] = useState([]);

  const status = getStatus();
  const currentRate = getCurrentRate(converterState.fromCurrency, converterState.toCurrency);

  // Mettre à jour la conversion quand les paramètres changent
  useEffect(() => {
    if (isReady && converterState.amount) {
      const result = convert(
        converterState.amount, 
        converterState.fromCurrency, 
        converterState.toCurrency
      );
      setConverterState(prev => ({ ...prev, result }));
    }
  }, [isReady, converterState.amount, converterState.fromCurrency, converterState.toCurrency, convert]);

  // Inverser les devises
  const swapCurrencies = () => {
    setConverterState(prev => ({
      amount: prev.result || prev.amount,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      result: prev.amount
    }));
  };

  // Formater le pourcentage de changement (simulation)
  const getChangePercentage = () => {
    // Simulation d'un changement quotidien
    const randomChange = (Math.random() - 0.5) * 2; // -1% à +1%
    return randomChange;
  };

  const changePercentage = getChangePercentage();

  // Status badge
  const getStatusBadge = () => {
    switch (status.status) {
      case 'loading':
        return <Badge variant="default" className="text-xs"><Clock className="w-3 h-3 mr-1" />Chargement</Badge>;
      case 'error':
        return <Badge variant="danger" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Erreur</Badge>;
      case 'stale':
        return <Badge variant="warning" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Périmé</Badge>;
      case 'ok':
        return <Badge variant="success" className="text-xs"><CheckCircle className="w-3 h-3 mr-1" />À jour</Badge>;
      default:
        return <Badge variant="default" className="text-xs">Indisponible</Badge>;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Taux de change principal */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💱</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Taux de Change</h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge()}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {status.message}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRates}
            disabled={loading}
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </Button>
        </div>

        {isReady ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USD vers HTG */}
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">USD → HTG</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                1 USD = {usdToHtg?.toLocaleString() || 'N/A'} HTG
              </p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {changePercentage >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs ${changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* HTG vers USD */}
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">HTG → USD</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                1 HTG = ${htgToUsd?.toFixed(4) || 'N/A'}
              </p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {changePercentage <= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs ${changePercentage <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {changePercentage <= 0 ? '+' : ''}{(-changePercentage).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Taux de change indisponibles</p>
            <Button size="sm" onClick={refreshRates} className="mt-2">
              Réessayer
            </Button>
          </div>
        )}
      </Card>

      {/* Convertisseur */}
      {showConverter && (
        <Card title="💰 Convertisseur de Devises">
          <div className="space-y-4">
            {/* Montant de départ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Montant
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={converterState.amount}
                  onChange={(e) => setConverterState(prev => ({ 
                    ...prev, 
                    amount: parseFloat(e.target.value) || 0 
                  }))}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Montant à convertir"
                />
                <select
                  value={converterState.fromCurrency}
                  onChange={(e) => setConverterState(prev => ({ 
                    ...prev, 
                    fromCurrency: e.target.value 
                  }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="HTG">HTG</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Bouton d'inversion */}
            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Inverser les devises"
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
            </div>

            {/* Résultat */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Résultat
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isReady ? converterState.result.toLocaleString() : '---'}
                  </span>
                </div>
                <select
                  value={converterState.toCurrency}
                  onChange={(e) => setConverterState(prev => ({ 
                    ...prev, 
                    toCurrency: e.target.value 
                  }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD</option>
                  <option value="HTG">HTG</option>
                </select>
              </div>
            </div>

            {/* Taux utilisé */}
            {isReady && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                Taux: {currentRate.formatted}
              </div>
            )}

            {/* Raccourcis de conversion */}
            <div className="grid grid-cols-2 gap-2">
              {[100, 500, 1000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setConverterState(prev => ({ ...prev, amount }))}
                  className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {amount.toLocaleString()} {converterState.fromCurrency}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Paramètres */}
      {showSettings && (
        <Card title="⚙️ Paramètres de Change">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Devise d'affichage préférée
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="HTG">🇭🇹 Gourde Haïtienne (HTG)</option>
                <option value="USD">🇺🇸 Dollar Américain (USD)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Cette devise sera utilisée par défaut dans toute l'application
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informations API</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Source: ExchangeRate-API</p>
                <p>• Mise à jour: Quotidienne</p>
                <p>• Cache local: 1 heure</p>
                <p>• Fallback: Taux approximatif</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <p className="font-medium">Note importante</p>
                  <p>Les taux affichés sont indicatifs. Pour des transactions importantes, vérifiez toujours avec votre banque.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExchangeWidget;