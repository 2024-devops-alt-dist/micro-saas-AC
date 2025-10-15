import QuizCard from '../features/quiz/components/QuizCard.tsx';
import mockQuiz from '../features/quiz/data/mockQuiz.json';
import { useState } from 'react';

function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  // const question = mockQuiz.quiz[0];
  // console.log('Question:', question);
  // console.log('Propositions:', question.propositions);
  // console.log('proposition correcte:', question.propositions.find(p => p.is_correct)?.text);
  // État pour l'index de la question courante
  
  const questions = mockQuiz.quiz;
  const question = questions[currentIdx];

  const handlePrev = () => {
    setSelected(null);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };



  return (
  <QuizCard
      question={question}
      selected={selected}
      onSelect={setSelected}
      onPrev={handlePrev}
      onNext={handleNext}
      disablePrev={currentIdx === 0}
      disableNext={currentIdx === questions.length - 1}
    />
  );
}
export default Quiz;