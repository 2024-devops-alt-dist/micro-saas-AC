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
    <div className="min-h-screen text-white pb-24">
      <Title />

      <div className="flex flex-col items-center gap-6 mt-10 text-center">
        <h2 className="text-3xl font-bold">Bienvenue sur QuizPilot</h2>
        <p className="text-gray-400 max-w-md">
          Préparez vos examens avec des quiz personnalisés générés par l'IA
        </p>

        {!isAuthenticated ? (
          <div className="flex gap-4">
            <Link to="/login">
              <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button className="px-6 py-2 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg font-semibold">
                S'inscrire
              </Button>
            </Link>
          </div>
        ) : (
          <Link to="/generate-quiz">
            <Button className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg">
              Créer un Quiz
            </Button>
          </Link>
        )}
      </div>

      {/* <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-center">Niveaux disponibles</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {levels.map((level: Level) => (
            <div key={level.id} className="p-4 bg-gray-800 rounded-lg text-center shadow-md">
              {level.name}
            </div>
          ))}
        </div>
      </div> */}

   <div className="mt-12 p-4 border border-gray-700 rounded-lg bg-gray-800/50 max-w-full">
  <Button
    className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
    onClick={testApiConnection}
  >
    Tester la connexion à l'API
  </Button>

  {apiResponse && (
    <div className="mt-4 p-4 bg-black/30 rounded max-w-full overflow-hidden">
      <h3 className="font-bold text-sm text-gray-400">Réponse de l'API:</h3>

      <div className="
        text-xs mt-2
        whitespace-pre-wrap
        break-words
        max-w-full
      ">
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