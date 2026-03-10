import GenerateQuiz from '../features/quiz/components/GenerateQuiz'
import BottomNav from '../components/BottomNav'
import Title from '../components/Title'

function GererateQuizView() {
  return (
    <main className="min-h-screen bg-gray-900 pb-20">
      <Title text="CRÉER UN QUIZ" />
      <GenerateQuiz />
      <BottomNav />

    </main>
  )
}

export default GererateQuizView
