import { db } from "../database/db";
import { useAuthStore } from "../store/authStore";


export const validatePureAuthSystem = async () => {
  console.log('🧪 === VALIDATION SYSTÈME AUTH PURE ===');
  
  const tests = [];
  
  // Test 1: Vérification Zustand store
  try {
    const authState = useAuthStore.getState();
    tests.push({
      name: 'Store Zustand accessible',
      status: 'pass',
      details: `Utilisateur: ${authState.user ? 'Connecté' : 'Non connecté'}`
    });
  } catch (error) {
    tests.push({
      name: 'Store Zustand accessible',
      status: 'fail',
      details: error.message
    });
  }
  
  // Test 2: Vérification base de données
  try {
    const usersCount = await db.users.count();
    const accountsCount = await db.accounts.count();
    tests.push({
      name: 'Base de données fonctionnelle',
      status: 'pass',
      details: `${usersCount} utilisateurs, ${accountsCount} comptes`
    });
  } catch (error) {
    tests.push({
      name: 'Base de données fonctionnelle',
      status: 'fail',
      details: error.message
    });
  }
  
  // Test 3: Cohérence des données
  try {
    const authState = useAuthStore.getState();
    if (authState.user?.id) {
      const dbUser = await db.users.get(authState.user.id);
      const coherent = dbUser && dbUser.email === authState.user.email;
      
      tests.push({
        name: 'Cohérence Store/DB',
        status: coherent ? 'pass' : 'fail',
        details: coherent ? 'Données synchronisées' : 'Incohérence détectée'
      });
    } else {
      tests.push({
        name: 'Cohérence Store/DB',
        status: 'skip',
        details: 'Utilisateur non connecté'
      });
    }
  } catch (error) {
    tests.push({
      name: 'Cohérence Store/DB',
      status: 'fail',
      details: error.message
    });
  }
  
  // Test 4: Session active
  try {
    const authState = useAuthStore.getState();
    if (authState.isAuthenticated) {
      const timeRemaining = authState.getSessionTimeRemaining();
      tests.push({
        name: 'Session monitoring',
        status: 'pass',
        details: timeRemaining === -1 ? 'Session illimitée' : `${Math.floor(timeRemaining/60)}m restantes`
      });
    } else {
      tests.push({
        name: 'Session monitoring',
        status: 'skip',
        details: 'Pas de session active'
      });
    }
  } catch (error) {
    tests.push({
      name: 'Session monitoring',
      status: 'fail',
      details: error.message
    });
  }
  
  console.log('📊 Résultats validation pure:', tests);
  return tests;
};

// Outils de debug globaux
window.debugPureAuth = {
  // Valider le système complet
  validate: validatePureAuthSystem,
  
  // Inspecter l'état du store
  inspectStore: () => {
    const state = useAuthStore.getState();
    console.log('🔍 État du store:', {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      sessionData: state.sessionData,
      securitySettings: state.securitySettings,
      userPreferences: state.userPreferences
    });
    return state;
  },
  
  // Forcer une déconnexion
  forceLogout: () => {
    const { logout } = useAuthStore.getState();
    logout();
    console.log('🚪 Déconnexion forcée');
  },
  
  // Vérifier la session
  checkSession: () => {
    const { getSessionStats, checkSessionValidity } = useAuthStore.getState();
    const stats = getSessionStats();
    const validity = checkSessionValidity();
    
    console.log('⏱️ Informations session:', {
      stats,
      validity,
      isValid: validity === true
    });
    
    return { stats, validity };
  },
  
  // Simuler expiration de session
  expireSession: () => {
    const state = useAuthStore.getState();
    if (state.sessionData.autoLogoutTimer) {
      clearTimeout(state.sessionData.autoLogoutTimer);
    }
    
    // Simuler expiration immédiate
    setTimeout(() => {
      state.logout();
      console.log('⏰ Session expirée (simulation)');
    }, 1000);
  },
  
  // Nettoyer complètement l'état
  resetAll: async () => {
    const { logout } = useAuthStore.getState();
    logout();
    
    // Optionnel: nettoyer aussi la persistence
    localStorage.removeItem('finapp-auth');
    
    console.log('🧹 État complètement réinitialisé');
  }
};

console.log('🛠️ Outils de debug pure auth disponibles dans window.debugPureAuth');