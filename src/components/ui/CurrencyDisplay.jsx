// src/components/ui/CurrencyDisplay.jsx
import React from 'react';
import { useExchange } from '../../hooks/useExchange';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';

const CurrencyDisplay = ({
  amount,
  currency,
  showConversion = true,
  showTrend = false,
  size = 'md',
  variant = 'default', // default, compact, detailed
  prefix = '',
  suffix = '',
  className = '',
  onClick,
  ...props
}) => {
  const { formatWithConversion, isReady, convert } = useExchange();

  // ✅ Tailles avec dark mode
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  // ✅ Couleurs selon le montant avec dark mode
  const getAmountColor = (amount) => {
    if (amount > 0) return 'text-green-600 dark:text-green-400';
    if (amount < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-900 dark:text-white';
  };

  // ✅ Icône de tendance
  const getTrendIcon = (amount) => {
    if (amount > 0) return <TrendingUpIcon className="w-4 h-4 text-green-500 dark:text-green-400" />;
    if (amount < 0) return <TrendingDownIcon className="w-4 h-4 text-red-500 dark:text-red-400" />;
    return <MinusIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
  };

  // ✅ Formater le montant localement si conversion indisponible
  const formatLocalAmount = (amount, currency) => {
    try {
      return new Intl.NumberFormat('fr-HT', {
        style: 'currency',
        currency: currency === 'HTG' ? 'HTG' : 'USD',
        minimumFractionDigits: currency === 'HTG' ? 0 : 2,
        maximumFractionDigits: currency === 'HTG' ? 0 : 2
      }).format(Math.abs(amount));
    } catch (error) {
      // Fallback si la devise n'est pas supportée
      const symbol = currency === 'HTG' ? 'G' : '$';
      return `${symbol}${Math.abs(amount).toLocaleString()}`;
    }
  };

  // ✅ Obtenir la conversion dans l'autre devise
  const getConversionText = () => {
    if (!isReady || !showConversion) return null;
    
    const targetCurrency = currency === 'HTG' ? 'USD' : 'HTG';
    const converted = convert(Math.abs(amount), currency, targetCurrency);
    
    if (!converted) return null;
    
    return formatLocalAmount(converted, targetCurrency);
  };

  // ✅ Rendu selon le variant
  const renderAmount = () => {
    const baseAmount = isReady && showConversion 
      ? formatWithConversion(amount, currency)
      : formatLocalAmount(amount, currency);

    const conversionText = getConversionText();

    switch (variant) {
      case 'compact':
        return (
          <div className="flex items-center space-x-1">
            {showTrend && getTrendIcon(amount)}
            <span className="font-semibold">
              {prefix}{baseAmount}{suffix}
            </span>
          </div>
        );

      case 'detailed':
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {showTrend && getTrendIcon(amount)}
              <span className="font-bold">
                {prefix}{baseAmount}{suffix}
              </span>
            </div>
            {conversionText && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ≈ {conversionText}
              </div>
            )}
            {!isReady && showConversion && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                Conversion indisponible
              </div>
            )}
          </div>
        );

      default: // default
        return (
          <div className="flex items-center space-x-2">
            {showTrend && getTrendIcon(amount)}
            <span className="font-medium">
              {prefix}{baseAmount}{suffix}
            </span>
            {conversionText && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (≈ {conversionText})
              </span>
            )}
            {!isReady && showConversion && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                (conversion indisponible)
              </span>
            )}
          </div>
        );
    }
  };

  // ✅ Classes finales avec dark mode
  const finalClasses = [
    'inline-flex items-center transition-colors duration-200',
    sizes[size],
    getAmountColor(amount),
    onClick && 'hover:opacity-75 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded',
    className
  ].filter(Boolean).join(' ');

  // ✅ Composant dynamique (cliquable ou non)
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={finalClasses}
      title={onClick ? 'Cliquer pour plus de détails' : undefined}
      {...props}
    >
      {renderAmount()}
    </Component>
  );
};

// ✅ Variants spécialisés
export const CompactCurrency = ({ amount, currency, ...props }) => (
  <CurrencyDisplay 
    amount={amount} 
    currency={currency} 
    variant="compact" 
    size="sm"
    {...props} 
  />
);

export const DetailedCurrency = ({ amount, currency, showTrend = true, ...props }) => (
  <CurrencyDisplay 
    amount={amount} 
    currency={currency} 
    variant="detailed" 
    showTrend={showTrend}
    {...props} 
  />
);

export const LargeCurrency = ({ amount, currency, ...props }) => (
  <CurrencyDisplay 
    amount={amount} 
    currency={currency} 
    size="2xl" 
    showConversion={true}
    {...props} 
  />
);

// ✅ Composant pour les balances/soldes
export const BalanceDisplay = ({ 
  balance, 
  currency, 
  label = "Solde", 
  className = '',
  ...props 
}) => (
  <div className={`text-center space-y-1 ${className}`}>
    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
      {label}
    </p>
    <CurrencyDisplay 
      amount={balance} 
      currency={currency} 
      variant="detailed"
      size="xl"
      showTrend={true}
      {...props}
    />
  </div>
);

// ✅ Composant pour les différences/changements
export const AmountChange = ({ 
  amount, 
  currency, 
  showPercentage = false,
  percentage = 0,
  className = '',
  ...props 
}) => {
  const isPositive = amount >= 0;
  const changeColor = isPositive 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  return (
    <div className={`flex items-center space-x-1 ${changeColor} ${className}`}>
      {isPositive ? (
        <TrendingUpIcon className="w-4 h-4" />
      ) : (
        <TrendingDownIcon className="w-4 h-4" />
      )}
      <CurrencyDisplay 
        amount={amount} 
        currency={currency} 
        size="sm"
        prefix={isPositive ? '+' : ''}
        {...props}
      />
      {showPercentage && (
        <span className="text-xs">
          ({isPositive ? '+' : ''}{percentage.toFixed(1)}%)
        </span>
      )}
    </div>
  );
};

export default CurrencyDisplay;