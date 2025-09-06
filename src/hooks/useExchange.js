// src/hooks/useExchange.js
import { useEffect } from 'react';
import { useExchangeStore } from '../store/exchangeStore';

export const useExchange = () => {
  const {
    rates,
    loading,
    error,
    lastUpdate,
    preferredCurrency,
    loadRates,
    refreshRates,
    convert,
    getRate,
    setPreferredCurrency,
    getRatesInfo,
    areRatesStale
  } = useExchangeStore();

  // ✅ CHARGER LES TAUX AU PREMIER RENDU
  useEffect(() => {
    if (!rates) {
      loadRates();
    }
  }, [rates, loadRates]);

  // ✅ HELPERS DE FORMATAGE
  const formatCurrency = (amount, currency = 'HTG', showSymbol = true) => {
    const formatter = new Intl.NumberFormat('fr-HT', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency === 'HTG' ? 'HTG' : 'USD',
      minimumFractionDigits: currency === 'HTG' ? 0 : 2,
      maximumFractionDigits: currency === 'HTG' ? 0 : 2
    });

    return formatter.format(Math.abs(amount));
  };

  // ✅ AFFICHAGE AVEC CONVERSION AUTOMATIQUE
  const formatWithConversion = (amount, originalCurrency, showBoth = true) => {
    if (!showBoth || !rates) {
      return formatCurrency(amount, originalCurrency);
    }

    const targetCurrency = originalCurrency === 'HTG' ? 'USD' : 'HTG';
    const convertedAmount = convert(amount, originalCurrency, targetCurrency);

    if (originalCurrency === preferredCurrency) {
      return `${formatCurrency(amount, originalCurrency)} (~${formatCurrency(convertedAmount, targetCurrency)})`;
    } else {
      return `${formatCurrency(convertedAmount, preferredCurrency)} (~${formatCurrency(amount, originalCurrency)})`;
    }
  };

  // ✅ OBTENIR LE STATUT DES TAUX
  const getStatus = () => {
    const info = getRatesInfo();
    
    if (loading) return { status: 'loading', message: 'Chargement des taux...' };
    if (error) return { status: 'error', message: error };
    if (!info.available) return { status: 'unavailable', message: 'Taux indisponibles' };
    if (info.isStale) return { status: 'stale', message: 'Taux périmés' };
    
    return { 
      status: 'ok', 
      message: `Mis à jour ${info.lastUpdate?.toLocaleString('fr-FR')}`,
      source: info.source 
    };
  };

  // ✅ CALCULER LE TAUX AFFICHÉ
  const getCurrentRate = (fromCurrency = 'USD', toCurrency = 'HTG') => {
    const rate = getRate(fromCurrency, toCurrency);
    return {
      rate,
      formatted: `1 ${fromCurrency} = ${formatCurrency(rate, toCurrency)}`,
      inverse: 1 / rate,
      inverseFormatted: `1 ${toCurrency} = ${formatCurrency(1 / rate, fromCurrency)}`
    };
  };

  return {
    // État
    rates,
    loading,
    error,
    lastUpdate,
    preferredCurrency,
    
    // Actions
    loadRates,
    refreshRates,
    convert,
    setPreferredCurrency,
    
    // Helpers
    formatCurrency,
    formatWithConversion,
    getCurrentRate,
    getStatus,
    areRatesStale,
    
    // Info rapide
    isReady: !loading && rates && !error,
    htgToUsd: rates?.rates?.HTG ? (1 / rates.rates.HTG) : null,
    usdToHtg: rates?.rates?.HTG || null
  };
};