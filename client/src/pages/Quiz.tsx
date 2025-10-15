import QuizCard from '../features/quiz/components/QuizCard.tsx';
import mockQuiz from '../features/quiz/data/mockQuiz.json';

function Quiz() {
  const question = mockQuiz.quiz[0];
  console.log('Question:', question);
  console.log('Propositions:', question.propositions);
  console.log('proposition correcte:', question.propositions.find(p => p.is_correct)?.text);
  return (
    <div>
      Quiz page
      <QuizCard question={question} onAnswer={(answer) => console.log(answer)} />
    </div>
  );
}
export default Quiz;