// src/services/exchangeService.js
class ExchangeService {
  static API_BASE = 'https://api.exchangerate-api.com/v4/latest';
  static CACHE_KEY = 'finapp-exchange-rates';
  static CACHE_DURATION = 60 * 60 * 1000; // 1 heure

  // ✅ RÉCUPÉRER LES TAUX DEPUIS L'API
  static async fetchRates(baseCurrency = 'USD') {
    try {
      console.log(`🌐 Récupération taux de change pour ${baseCurrency}...`);
      
      const response = await fetch(`${this.API_BASE}/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('✅ Taux récupérés:', data);
      
      // Structurer les données pour notre app
      const rates = {
        base: data.base,
        date: data.date,
        timestamp: Date.now(),
        rates: {
          HTG: data.rates.HTG || 133.33, // Fallback si HTG indisponible
          USD: data.base === 'USD' ? 1 : (1 / data.rates.USD)
        },
        source: 'api'
      };
      
      // Sauvegarder en cache
      this.saveToCache(rates);
      
      return rates;
      
    } catch (error) {
      console.error('❌ Erreur API taux de change:', error);
      
      // Fallback vers cache ou taux par défaut
      return this.getFallbackRates();
    }
  }

  // ✅ RÉCUPÉRER DEPUIS LE CACHE
  static getFromCache() {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const now = Date.now();
      
      // Vérifier si le cache est encore valide
      if (now - data.timestamp > this.CACHE_DURATION) {
        console.log('⏰ Cache expiré');
        return null;
      }
      
      console.log('📱 Utilisation du cache:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur lecture cache:', error);
      return null;
    }
  }

  // ✅ SAUVEGARDER EN CACHE
  static saveToCache(rates) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(rates));
      console.log('💾 Taux sauvegardés en cache');
    } catch (error) {
      console.error('❌ Erreur sauvegarde cache:', error);
    }
  }

  // ✅ TAUX DE SECOURS
  static getFallbackRates() {
    console.log('🔄 Utilisation des taux de secours');
    
    return {
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      rates: {
        HTG: 133.33, // Taux approximatif HTG/USD
        USD: 1
      },
      source: 'fallback'
    };
  }

  // ✅ OBTENIR LES TAUX (avec cache intelligent)
  static async getRates(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = this.getFromCache();
      if (cached) return cached;
    }
    
    return await this.fetchRates();
  }

  // ✅ CONVERTIR UN MONTANT
  static convertAmount(amount, fromCurrency, toCurrency, rates) {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = rates.rates[fromCurrency];
    const toRate = rates.rates[toCurrency];
    
    if (!fromRate || !toRate) {
      console.warn(`❌ Devise non supportée: ${fromCurrency} -> ${toCurrency}`);
      return amount;
    }
    
    // Conversion via USD comme base
    if (rates.base === 'USD') {
      if (fromCurrency === 'USD') {
        return amount * toRate;
      } else if (toCurrency === 'USD') {
        return amount / fromRate;
      } else {
        // Via USD : HTG -> USD -> autre
        const usdAmount = amount / fromRate;
        return usdAmount * toRate;
      }
    }
    
    return amount;
  }

  // ✅ OBTENIR LE TAUX DE CHANGE ENTRE DEUX DEVISES
  static getExchangeRate(fromCurrency, toCurrency, rates) {
    if (fromCurrency === toCurrency) return 1;
    
    const fromRate = rates.rates[fromCurrency];
    const toRate = rates.rates[toCurrency];
    
    if (!fromRate || !toRate) return 1;
    
    if (rates.base === 'USD') {
      if (fromCurrency === 'USD') {
        return toRate;
      } else if (toCurrency === 'USD') {
        return 1 / fromRate;
      } else {
        return toRate / fromRate;
      }
    }
    
    return 1;
  }

  // ✅ VÉRIFIER SI LES TAUX SONT RÉCENTS
  static areRatesStale(rates) {
    if (!rates || !rates.timestamp) return true;
    
    const now = Date.now();
    const ageHours = (now - rates.timestamp) / (1000 * 60 * 60);
    
    return ageHours > 24; // Considérer comme périmé après 24h
  }

  // ✅ INITIALISER LE SERVICE
  static async initialize() {
    console.log('🚀 Initialisation service de change...');
    
    try {
      // Récupérer les taux au démarrage
      await this.getRates();
      
      // Programmer une mise à jour quotidienne
      setInterval(async () => {
        console.log('🔄 Mise à jour automatique des taux...');
        await this.getRates(true);
      }, 24 * 60 * 60 * 1000); // 24 heures
      
      console.log('✅ Service de change initialisé');
      
    } catch (error) {
      console.error('❌ Erreur initialisation service de change:', error);
    }
  }
}

export { ExchangeService };