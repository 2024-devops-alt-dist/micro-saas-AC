
import { useEffect, useState } from 'react';
import Button from '../components/Button.tsx'
import {getLevels} from '../services/api.tsx'
import { apiFetch } from '../services/api.tsx';
//import quizpilot from '../assets/quizpilot.gif'
import Title from '../components/Title.tsx';
import AuthForm from '../features/auth/components/AuthForm.tsx';
import TestQuizService from '../features/quiz/components/TestQuizService.tsx';

type Level = {
  id: string | number;
  name: string;
};


function Home() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [apiResponse, setApiResponse] = useState<string | object | null>(null);
  
  useEffect(() => {
    getLevels().then((data: Level[]) => setLevels(data));
  }, []);

  const testApiConnection = async () => {
    try {
      const response = await apiFetch("/api/test/");
      setApiResponse(response);
      console.log("API connection successful:", response);
    } catch (error) {
      console.error("API connection failed:", error);
    }
  };

  return (
    <div>
      <Title />
      {/* <h1><img src={quizpilot} alt="QuizPilot" className="flex justify-center items-center w-full" /></h1> */}
      <p className="mt-2 text-lg">Fais décoller tes révisions, t'es un boss hugo !</p>
      
      <ul>
        {levels.map((level: Level) => (
          <li key={level.id}>{level.name}</li>
        ))}
      </ul>

      <div className="mt-4 p-4 border rounded">
        <Button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={testApiConnection}

        >
          Tester la connexion à l'APi coucou le bouton
        </Button>
        {apiResponse && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">Réponse de l'API:</h3>
            <pre>{JSON.stringify(apiResponse)}</pre>
          </div>
        )}
        {apiResponse === "success" && (
          <div className="mt-2 text-green-600 font-semibold">bravo c'est connecté</div>
        )}
        {apiResponse === "error" && (
          <div className="mt-2 text-red-600 font-semibold">aie aie aie</div>
        )}
      </div>

      <div className="mt-8">
        <AuthForm />
        <div className="mt-8">
          <TestQuizService />
        </div>
      

      </div>

      </div>
      
  )
}

export default Home
