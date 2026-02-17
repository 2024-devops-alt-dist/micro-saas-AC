import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.tsx';
import { apiFetch } from '../services/api.tsx';
import Title from '../components/Title.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { authService } from '../features/auth/services/authService';

function Home() {
  const [apiResponse, setApiResponse] = useState<string | object | null>(null);
  const isAuthenticated = authService.isAuthenticated();

  const testApiConnection = async () => {
    try {
      const response = await apiFetch("/api/test/");
      setApiResponse(response);
    } catch (error) {
      console.error("API connection failed:", error);
    }
  };

  return (
    <div className="min-h-screen text-white pb-24 px-4 sm:px-6">
      <Title />

      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 mt-4 sm:mt-10 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            Bienvenue sur QuizPilot
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Préparez vos examens avec des quiz personnalisés générés par l'IA et suivez votre progression en temps réel.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm px-4">
            <Link to="/login">
              <Button className="w-full px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white rounded-xl font-semibold transition-all duration-300">
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button className="w-full px-6 py-3 bg-yellow-400 text-black hover:bg-yellow-500 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-yellow-900/20">
                S'inscrire
              </Button>
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-md px-4">
            <Link to="/generate-quiz">
              <Button className="w-full py-4 bg-yellow-300 text-gray-900 hover:bg-yellow-400 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-900/30 transition-all active:scale-95">
                CRÉER UN QUIZ
              </Button>
            </Link>
          </div>
        )}

        {/* Features Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 text-left">
            {/* <span className="text-2xl mb-2 block">🎯</span>
            <h4 className="font-bold text-gray-200">Précision IA</h4>
            <p className="text-xs text-gray-500 mt-1">Des questions adaptées à votre niveau et à votre sujet.</p> */}
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
          </div>
          <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 text-left">
            {/* <span className="text-2xl mb-2 block">📊</span>
            <h4 className="font-bold text-gray-200">Suivi Pilote</h4>
            <p className="text-xs text-gray-500 mt-1">Analysez vos performances avec des graphiques détaillés.</p> */}
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 p-6 border border-gray-700/50 rounded-2xl bg-gray-800/30 max-w-xl mx-auto">
        <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">à cacher</h4>
        <Button
          className="w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-xl border border-gray-700 hover:bg-gray-700 hover:text-white transition-all text-sm"
          onClick={testApiConnection}
        >
          Tester la connexion à l'API
        </Button>

        {apiResponse && (
          <div className="mt-4 p-4 bg-black/40 rounded-xl max-w-full overflow-hidden border border-gray-800">
            <h3 className="font-bold text-xs text-blue-400/70 mb-2">RÉPONSE DU SERVEUR:</h3>
            <div className="text-[10px] font-mono whitespace-pre-wrap break-words text-gray-500 leading-tight">
              {JSON.stringify(apiResponse, null, 2)}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>

  );
}

export default Home;