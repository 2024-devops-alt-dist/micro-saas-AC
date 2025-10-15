import QuizCard from '../features/quiz/components/QuizCard.tsx';
import mockQuiz from '../features/quiz/data/mockQuiz.json';
import { useState } from 'react';

function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
 // const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(mockQuiz.quiz.length).fill(null));
  const [score, setScore] = useState(0);
  
  const questions = mockQuiz.quiz;
  const question = questions[currentIdx];

  console.log('Current Question:', question);
  console.log('All Answers:', answers);
  console.log('Score:', score);

  // const question = mockQuiz.quiz[0];
  // console.log('Question:', question);
  // console.log('Propositions:', question.propositions);
  // console.log('proposition correcte:', question.propositions.find(p => p.is_correct)?.text);
  // État pour l'index de la question courante
  

    // Fonction appelée quand on répond à une question
  const handleSelect = (answer: string) => {
    // Si la question est déjà répondue, on ne fait rien
    if (answers[currentIdx]) return;
    // On vérifie si la réponse est correcte
    const isCorrect = question.propositions.find(p => p.text === answer)?.is_correct;
    // On stocke la réponse
    const newAnswers = [...answers];
    newAnswers[currentIdx] = answer;
    setAnswers(newAnswers);
    // Si la réponse est correcte, on incrémente le score
    if (isCorrect) setScore(s => s + 1);
    console.log(`Score actuel: ${isCorrect ? score + 1 : score}/${questions.length}`);
  };


  const handlePrev = () => {
//    setSelected(null);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
     //       setSelected(null);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
          //  setSelected(null);
    }
  };



  return (
  <QuizCard
      question={question}
      selected={answers[currentIdx]}
      //onSelect={setSelected}
      onSelect={handleSelect}
      onPrev={handlePrev}
      onNext={handleNext}
      disablePrev={currentIdx === 0}
      disableNext={currentIdx === questions.length - 1}
    />
  );
}
export default Quiz;