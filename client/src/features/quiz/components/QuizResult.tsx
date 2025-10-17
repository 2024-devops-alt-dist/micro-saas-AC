import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import Collapse from '../../../components/Collapse'
import ValidationAnimation from './ValidationAnimation';

type ResultProps = {
  score: number;
  questions: {  
    question: string;
    propositions: { text: string; is_correct: boolean }[];
  }[];
  answers: (string | undefined)[];
};

function QuizResult({ score, questions, answers }: ResultProps) {
  const { width, height } = useWindowSize()
  const ratio = score / questions.length;

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