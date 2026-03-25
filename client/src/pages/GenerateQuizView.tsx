import GenerateQuiz from '../features/quiz/components/GenerateQuiz'
import BottomNav from '../components/BottomNav'
import Title from '../components/Title'

function GererateQuizView() {
  return (
    <main className="min-h-screen bg-gray-900 pb-20">
      <Title text="CRÉER UN QUIZ" />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-8 text-left">
            <span className="text-yellow-400 text-lg shrink-0">⚠️</span>
            <div className="text-sm text-gray-400 space-y-1">
              <p className="text-yellow-300 font-semibold">Avertissement</p>
              <p>Ce service utilise une IA gratuite. Pour de meilleurs résultats, privilégiez des documents légers <span className="text-gray-300">(1 à 4 pages)</span> pour éviter les délais ou les erreurs.</p>
              <p>Et comme à chaque fois, avec l'intelligence Artificielle, les questions générées peuvent parfois nécessiter une vérification.</p>
            </div>
          </div>
      </div>
      <GenerateQuiz />
      <BottomNav />

    </main>
  )
}

export default GererateQuizView
