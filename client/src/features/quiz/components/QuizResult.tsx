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
    <div className="relative">
      {/* Animations */}
      {ratio >= 0.8 && (
        <div className="fixed inset-0 w-screen h-screen pointer-events-none flex items-center justify-center z-50">
          <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
        </div>
      )}

      {ratio >= 0.8 && (
        <p className="text-green-600 font-bold mt-4 text-center relative z-50">Bravo! 🎉</p>
      )}

      {ratio >= 0.5 && ratio < 0.8 && (
        <div className="flex justify-center mt-6 mb-6 relative z-50">
          <ValidationAnimation />
        </div>
      )}

      {ratio < 0.5 && (
        <p className="text-orange-500 text-center font-bold mt-4 text-xl relative z-50">Continue, tu vas y arriver ! 💪</p>
      )}

      <Collapse title={`Votre score: ${score} / ${questions.length}`}>
        <ul className="space-y-4">
          {questions.map((q, i) => (
            <li key={i}>
              <h3 className="font-semibold">{q.question}</h3>
              <p>Votre réponse: {answers[i]}</p>
              <p>Réponse correcte: {q.propositions.find(p => p.is_correct)?.text}</p>
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  )
}

export default QuizResult