import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import Collapse from '../../../components/Collapse'
import ValidationAnimation from './ValidationAnimation';
import { useEffect, useState } from 'react';
import { getCategories, getLevels, saveQuizStats } from '../../../services/api';

interface CategoryOrLevel {
  id: number;
  name: string;
}

type ResultProps = {
  score: number;
  questions: {
    question: string;
    propositions: { text: string; is_correct: boolean }[];
  }[];
  answers: (string | undefined)[];
  metadata?: {
    theme: string;
    difficulty: string;
  };
};

function QuizResult({ score, questions, answers, metadata }: ResultProps) {
  const { width, height } = useWindowSize()
  const ratio = score / questions.length;
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saveResult = async () => {
      const userId = localStorage.getItem("user_id");
      console.log("DEBUG STATS - userId:", userId);
      console.log("DEBUG STATS - metadata:", metadata);

      if (!userId) {
        console.warn("DEBUG STATS - Aucun userId trouvé. Reconnectez-vous.");
        return;
      }
      if (!metadata) {
        console.warn("DEBUG STATS - Pas de metadata reçues.");
        return;
      }
      if (isSaved) return;

      try {
        const [categories, levels] = await Promise.all([getCategories(), getLevels()]) as [CategoryOrLevel[], CategoryOrLevel[]];

        // On cherche une correspondance souple pour le thème (ex: "Maths" vs "Mathématiques")
        const cat = categories.find((c: CategoryOrLevel) =>
          c.name.toLowerCase().includes(metadata.theme.toLowerCase()) ||
          metadata.theme.toLowerCase().includes(c.name.toLowerCase())
        );

        const lev = levels.find((l: CategoryOrLevel) =>
          l.name.toLowerCase() === metadata.difficulty.toLowerCase()
        );

        console.log("DEBUG STATS - Catégorie trouvée:", cat);
        console.log("DEBUG STATS - Niveau trouvé:", lev);

        if (cat && lev) {
          await saveQuizStats({
            user_id: parseInt(userId),
            category_id: cat.id,
            level_id: lev.id,
            score: score
          });
          setIsSaved(true);
          console.log("✅ Statistiques enregistrées !");
        } else {
          console.warn("DEBUG STATS - Correspondance non trouvée en base pour:", metadata);
        }
      } catch (err) {
        console.error("DEBUG STATS - Erreur API:", err);
      }
    };

    saveResult();
  }, [score, metadata, isSaved]);

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 text-white">

      {/* Animations */}
      {ratio >= 0.8 && (
        <div className="fixed inset-0 w-screen h-screen pointer-events-none flex items-center justify-center z-50">
          <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
        </div>
      )}

      <div className="w-full max-w-md bg-gray-800/60 rounded-3xl border border-gray-700/50 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-900 border-4 border-yellow-300 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-900/10">
            <span className="text-3xl font-bold text-yellow-300">{score}</span>
            <span className="text-gray-200 text-sm ml-1">/{questions.length}</span>
          </div>

          {ratio >= 0.8 ? (
            <h2 className="text-2xl font-bold text-green-400">Bravo Pilote ! 🎉</h2>
          ) : ratio >= 0.5 ? (
            <h2 className="text-2xl font-bold text-yellow-300">Bien joué ! 👍</h2>
          ) : (
            <h2 className="text-2xl font-bold text-orange-400">Continue tes efforts ! 💪</h2>
          )}
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-gray-200 text-sm leading-relaxed">
            {ratio >= 0.8
              ? "Vous avez maîtrisé ce sujet avec brio. Votre plan de vol vers la réussite est parfaitement tracé !"
              : ratio >= 0.5
                ? "Une bonne performance ! Encore un peu d'entraînement et vous serez prêt pour le décollage vertical."
                : "Chaque vol commence par un premier pas. Analysez vos erreurs et retentez l'expérience !"}
          </p>
        </div>

        {ratio >= 0.5 && ratio < 0.8 && (
          <div className="flex justify-center mb-6">
            <ValidationAnimation />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-yellow-300 text-gray-900 rounded-2xl font-bold hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-900/10"
          >
            RECOMMENCER
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-gray-700 text-white rounded-2xl font-bold border border-gray-600 hover:bg-gray-600 transition-all active:scale-95"
          >
            RETOUR À L'ACCUEIL
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-6">
        <Collapse title="Consulter le détail de vos réponses">
          <ul className="space-y-6 p-2">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correctAns = q.propositions.find(p => p.is_correct)?.text;
              const isCorrect = userAns === correctAns;

              return (
                <li
                  key={i}
                  className="bg-[#111d37] p-4 rounded-2xl border border-gray-700/30"
                  aria-label={`Question ${i + 1}: ${q.question}`}
                >
                  <h3 className="font-bold mb-3 text-gray-100 text-xl">{q.question}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-100 uppercase font-bold w-16">
                        Votre choix :
                      </span>
                      <span
                        className={`font-normal text-base flex items-center gap-1 ${
                          isCorrect ? "text-green-300" : "text-red-400"
                        }`}
                        aria-label={isCorrect ? "Bonne réponse" : "Réponse incorrecte"}
                      >
                        <span aria-hidden="true">{isCorrect ? "✔" : "✗"}</span>
                        {userAns || "Aucune réponse"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-300 uppercase font-bold w-16">
                          Correct :
                        </span>
                        <span className="text-green-300 font-normal text-base flex items-center gap-1" aria-label="Réponse correcte">
                          <span aria-hidden="true">✔</span>
                          {correctAns}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Collapse>
      </div>
    </div>
  );
}

export default QuizResult;
