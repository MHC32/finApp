// src/store/exchangeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExchangeService } from '../services/exchangeService';

export const useExchangeStore = create(
  persist(
    (set, get) => ({
      // ✅ ÉTAT
      rates: null,
      loading: false,
      error: null,
      lastUpdate: null,
      autoUpdate: true,
      preferredCurrency: 'HTG', // Devise d'affichage préférée

      // ✅ ACTIONS
      
      // Charger les taux
      loadRates: async (forceRefresh = false) => {
        set({ loading: true, error: null });
        
        try {
          const rates = await ExchangeService.getRates(forceRefresh);
          
          set({
            rates,
            loading: false,
            lastUpdate: new Date(),
            error: null
          });
          
          return rates;
          
        } catch (error) {
          console.error('❌ Erreur chargement taux:', error);
          
          set({
            loading: false,
            error: error.message || 'Erreur de connexion'
          });
          
          throw error;
        }
      },

      // Rafraîchir les taux
      refreshRates: async () => {
        return get().loadRates(true);
      },

      // Convertir un montant
      convert: (amount, fromCurrency, toCurrency) => {
        const { rates } = get();
        
        if (!rates) {
          console.warn('❌ Pas de taux disponibles pour conversion');
          return amount;
        }
        
        return ExchangeService.convertAmount(amount, fromCurrency, toCurrency, rates);
      },

      // Obtenir le taux entre deux devises
      getRate: (fromCurrency, toCurrency) => {
        const { rates } = get();
        
        if (!rates) return 1;
        
        return ExchangeService.getExchangeRate(fromCurrency, toCurrency, rates);
      },

      // Définir la devise préférée
      setPreferredCurrency: (currency) => {
        set({ preferredCurrency: currency });
      },

      // Activer/désactiver mise à jour auto
      setAutoUpdate: (enabled) => {
        set({ autoUpdate: enabled });
      },

      // Vérifier si les taux sont périmés
      areRatesStale: () => {
        const { rates } = get();
        return ExchangeService.areRatesStale(rates);
      },

      // Obtenir les infos sur les taux actuels
      getRatesInfo: () => {
        const { rates, lastUpdate, error } = get();
        
        if (!rates) {
          return {
            available: false,
            source: 'none',
            lastUpdate: null,
            isStale: true,
            error
          };
        }
        
        return {
          available: true,
          source: rates.source,
          lastUpdate: lastUpdate || new Date(rates.timestamp),
          isStale: ExchangeService.areRatesStale(rates),
          htgToUsd: rates.rates.HTG ? (1 / rates.rates.HTG) : null,
          usdToHtg: rates.rates.HTG || null,
          error: null
        };
      },

      // Initialiser le store
      initialize: async () => {
        console.log('🚀 Initialisation du store de change...');
        
        try {
          // Charger les taux au démarrage
          await get().loadRates();
          
          // Programmer vérification périodique si auto-update activé
          const { autoUpdate } = get();
          
          if (autoUpdate) {
            // Vérifier toutes les heures si mise à jour nécessaire
            setInterval(() => {
              const { areRatesStale, loadRates } = get();
              
              if (areRatesStale()) {
                console.log('🔄 Taux périmés, mise à jour...');
                loadRates(true);
              }
            }, 60 * 60 * 1000); // 1 heure
          }
          
          console.log('✅ Store de change initialisé');
          
        } catch (error) {
          console.error('❌ Erreur initialisation store:', error);
        }
      }
    }),
    {
      name: 'finapp-exchange',
      partialize: (state) => ({
        rates: state.rates,
        autoUpdate: state.autoUpdate,
        preferredCurrency: state.preferredCurrency,
        lastUpdate: state.lastUpdate
      })
    }
  )
);