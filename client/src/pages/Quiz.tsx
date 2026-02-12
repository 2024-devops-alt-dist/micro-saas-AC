import { useLocation } from "react-router-dom";
import QuizCard from "../features/quiz/components/QuizCard";
import QuizResult from "../features/quiz/components/QuizResult";
import mockQuiz from "../features/quiz/data/mockQuiz.json";
import UseQuiz from "../features/quiz/components/UseQuiz";
import BottomNav from "../components/BottomNav";

function QuizPage() {
  const location = useLocation();

  // On récupère les données du quiz depuis la navigation (si on vient de GenerateQuiz)
  // Sinon on utilise le mock quiz (utile pour les tests E2E)
  const quizDataFromNavigation = location.state?.quizData;
  const metadata = location.state?.metadata;
  const dataToUse = quizDataFromNavigation || mockQuiz.quiz;

  const {
    question,
    currentIdx,
    answers,
    score,
    isFinished,
    selectAnswer,
    prev,
    next,
    questions
  } = UseQuiz(dataToUse);

  if (isFinished) {
    return (
      <QuizResult
        score={score}
        answers={answers}
        questions={questions}
        metadata={metadata}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <QuizCard
        question={question}
        selected={answers[currentIdx] ?? null}
        onSelect={selectAnswer}
        onPrev={prev}
        onNext={next}
        disablePrev={currentIdx === 0}
        disableNext={!answers[currentIdx]}
      />
      <BottomNav />
    </div>
  );
}

export default QuizPage;