// src/components/ui/CurrencyDisplay.jsx
import React from 'react';
import { useExchange } from '../../hooks/useExchange';

const CurrencyDisplay = ({ 
  amount, 
  currency, 
  showConversion = true,
  size = 'md',
  className = '',
  onClick
}) => {
  const { formatWithConversion, isReady } = useExchange();

  // Tailles définies
  const sizes = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  // Couleur selon le montant
  const getAmountColor = (amount) => {
    if (amount > 0) return 'text-green-600 dark:text-green-400';
    if (amount < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-900 dark:text-white';
  };

  // Composant cliquable ou non
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center font-medium transition-colors
        ${sizes[size]}
        ${getAmountColor(amount)}
        ${onClick ? 'hover:opacity-75 cursor-pointer' : ''}
        ${className}
      `}
    >
      {isReady && showConversion ? (
        <span>
          {formatWithConversion(amount, currency)}
        </span>
      ) : (
        <span>
          {new Intl.NumberFormat('fr-HT', {
            style: 'currency',
            currency: currency === 'HTG' ? 'HTG' : 'USD',
            minimumFractionDigits: currency === 'HTG' ? 0 : 2
          }).format(Math.abs(amount))}
        </span>
      )}
      
      {!isReady && showConversion && (
        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
          (conversion indisponible)
        </span>
      )}
    </Component>
  );
};

export default CurrencyDisplay;