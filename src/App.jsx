// src/App.jsx
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './store/slices/themeSlice';
import { loginUser, logoutUser, registerUser } from './store/slices/authSlice';
import ThemeInitializer from './components/ThemeInitializer';
import { Moon, Sun, LogIn, LogOut, UserPlus } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  
  // Récupérer state depuis Redux
  const { currentTheme, isDark } = useSelector((state) => state.theme);
  const { user, isAuthenticated, loading, error, successMessage } = useSelector((state) => state.auth);
  
  // Handlers
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const handleTestLogin = () => {
    // Test avec données fictives - remplacer par un vrai formulaire plus tard
    dispatch(loginUser({
      identifier: 'test@example.com',
      password: 'Password123'
    }));
  };
  
  const handleTestRegister = () => {
    // Test avec données fictives
    dispatch(registerUser({
      firstName: 'Jean',
      lastName: 'Baptiste',
      email: 'jean.baptiste@example.com',
      password: 'Password123',
      phone: '+50937123456'
    }));
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  return (
    <>
      {/* Initialiser le thème */}
      <ThemeInitializer />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header avec toggle thème */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              FinApp Haiti 🇭🇹
            </h1>
            
            <button
              onClick={handleToggleTheme}
              className="p-3 rounded-lg glass-light dark:glass-dark hover:scale-105 transition-transform"
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-blue-600" />
              )}
            </button>
          </div>
          
          {/* Info thème actuel */}
          <div className="mb-8 p-4 rounded-lg glass-card glass-light dark:glass-dark">
            <p className="text-sm text-gray-700 dark:text-gray-100">
              Thème actuel : <span className="font-semibold text-gray-900 dark:text-white">{currentTheme}</span>
            </p>
          </div>
          
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
              <p className="text-red-800 dark:text-red-200">❌ {error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
              <p className="text-green-800 dark:text-green-200">✅ {successMessage}</p>
            </div>
          )}
          
          {/* État authentification */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Card État Auth */}
            <div className="p-6 rounded-xl glass-card glass-light dark:glass-dark">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                État Authentification
              </h2>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-100">
                  Authentifié : {' '}
                  <span className={`font-semibold ${isAuthenticated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isAuthenticated ? 'Oui ✅' : 'Non ❌'}
                  </span>
                </p>
                
                {user && (
                  <>
                    <p className="text-gray-700 dark:text-gray-100">
                      Nom : <span className="font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-100">
                      Email : <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-100">
                      Rôle : <span className="font-semibold text-gray-900 dark:text-white">{user.role}</span>
                    </p>
                  </>
                )}
                
                <p className="text-gray-700 dark:text-gray-100">
                  Chargement : {' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {loading ? 'En cours...' : 'Non'}
                  </span>
                </p>
              </div>
              
              {/* Actions Auth */}
              <div className="mt-6 space-y-3">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={handleTestLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Test Login
                    </button>
                    
                    <button
                      onClick={handleTestRegister}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Test Register
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                )}
              </div>
            </div>
            
            {/* Card Redux DevTools */}
            <div className="p-6 rounded-xl glass-card glass-light dark:glass-dark">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Redux DevTools
              </h2>
              
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-100">
                <p>✅ Redux Store configuré</p>
                <p>✅ authSlice actif</p>
                <p>✅ themeSlice actif</p>
                <p>✅ Intercepteurs Axios actifs</p>
                <p>✅ Refresh token automatique</p>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-800 dark:text-blue-100">
                  💡 Ouvre Redux DevTools dans ton navigateur pour voir les actions et le state en temps réel !
                </p>
              </div>
            </div>
            
          </div>
          
          {/* Instructions */}
          <div className="mt-8 p-6 rounded-xl glass-card glass-light dark:glass-dark">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              🧪 Tests à faire
            </h2>
            
            <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-100 list-decimal list-inside">
              <li>Lance le backend : <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded">npm run dev</code></li>
              <li>Clique sur "Test Login" ou "Test Register"</li>
              <li>Observe Redux DevTools pour voir les actions</li>
              <li>Vérifie que les tokens sont stockés</li>
              <li>Toggle le thème et vois la persistence</li>
              <li>Refresh la page et vérifie que le thème persiste</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-xs text-yellow-800 dark:text-yellow-100">
                ⚠️ Note : Les credentials de test doivent exister dans ta base de données backend !
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default App;