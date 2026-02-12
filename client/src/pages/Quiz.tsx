// import QuizCard from '../features/quiz/components/QuizCard.tsx';
// import QuizResult from '../features/quiz/components/QuizResult.tsx';
// import mockQuiz from '../features/quiz/data/mockQuiz.json';
// import { useState } from 'react';

// function Quiz() {
//   const [currentIdx, setCurrentIdx] = useState(0);
//  // const [selected, setSelected] = useState<string | null>(null);
//   const [answers, setAnswers] = useState<(string | undefined)[]>(Array(mockQuiz.quiz.length).fill(undefined));
//   const [score, setScore] = useState(0);

//   const questions = mockQuiz.quiz;
//   const question = questions[currentIdx];

//   console.log('Current Question:', question);
//   console.log('All Answers:', answers);
//   console.log('Score:', score);

//   // const question = mockQuiz.quiz[0];
//   // console.log('Question:', question);
//   // console.log('Propositions:', question.propositions);
//   // console.log('proposition correcte:', question.propositions.find(p => p.is_correct)?.text);
//   // État pour l'index de la question courante


//     // Fonction appelée quand on répond à une question
//   const handleSelect = (answer: string) => {
//     // Si la question est déjà répondue, on ne fait rien
//     if (answers[currentIdx]) return;
//     // On vérifie si la réponse est correcte
//     const isCorrect = question.propositions.find(p => p.text === answer)?.is_correct;
//     // On stocke la réponse
//     const newAnswers = [...answers];
//     newAnswers[currentIdx] = answer;
//     setAnswers(newAnswers);
//     // Si la réponse est correcte, on incrémente le score
//     if (isCorrect) setScore(s => s + 1);
//     console.log(`Score actuel: ${isCorrect ? score + 1 : score}/${questions.length}`);
//   };


//   const handlePrev = () => {
// //    setSelected(null);
//     if (currentIdx > 0) {
//       setCurrentIdx(currentIdx - 1);
//      //       setSelected(null);
//     }
//   };

//   const handleNext = () => {
//     if (currentIdx < questions.length - 1) {
//       setCurrentIdx(currentIdx + 1);
//     } else {
//       // Quand on est à la dernière question, passer à l'état "résultat"
//       setCurrentIdx(questions.length); // currentIdx = length => mode résultat
//     }
//   };

//   // Affichage de la carte ou du résultat selon currentIdx
//   if (currentIdx >= questions.length) {
//     return (
//       <QuizResult
//         score={score}
//         answers={answers}
//         questions={questions}
//       />
//     );
//   }

//   return (
//   <QuizCard
//       question={question}
//       selected={answers[currentIdx]}
//       //onSelect={setSelected}
//       onSelect={handleSelect}
//       onPrev={handlePrev}
//       onNext={handleNext}
//       disablePrev={currentIdx === 0}
//       disableNext={!answers[currentIdx] || currentIdx >= questions.length}
//     />
//   );
// }
// export default Quiz;

import { useLocation } from "react-router-dom";
import { useState } from "react";
//import QuizCard from "../features/quiz/components/QuizCard";
//import QuizResult from "../features/quiz/components/QuizResult";
import mockQuiz from "../features/quiz/data/mockQuiz.json";
import UseQuiz from "../features/quiz/components/UseQuiz";
import BottomNav from "../components/BottomNav";
import { getUsersStats, type UserStats } from "../features/quiz/services/statsService";

function QuizPage() {

  const location = useLocation();
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const quizDataFromNavigation = location.state?.quizData;
  //const metadata = location.state?.metadata;
  const dataToUse = quizDataFromNavigation || mockQuiz.quiz;
  //const { question, currentIdx, answers, score, isFinished, selectAnswer, prev, next, questions } =
  UseQuiz(dataToUse);

  // if (isFinished) {
  //   return <QuizResult score={score} answers={answers} questions={questions} metadata={metadata} />;
  // }

  const fetchStats = async () => {
    try {
      const data = await getUsersStats();
      // Trier par date décroissante
      const sortedData = [...data].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setStats(sortedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();


  return (
    <div>
      {/* Tableau des Quiz */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="font-bold text-lg">Derniers Quiz</h3>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 italic">Chargement des données...</div>
          ) : stats.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Thème</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Niveau</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {stats.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-300">
                      {row.category_name || "Général"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(row.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 px-4">
                      <span className={`font-bold ${row.score >= 7 ? 'text-green-400' : row.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {row.score}/10
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-1 rounded bg-gray-900 border border-gray-700 uppercase font-bold text-gray-400">
                        {row.level_name || "Normal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500 italic">
              Aucun quiz enregistré. Lancez-vous !
            </div>
          )}
        </div>
      </div>
      {/* <QuizCard
        question={question}
        selected={answers[currentIdx] ?? null}
        onSelect={(a) => { selectAnswer(a); }}
        onPrev={prev}
        onNext={next}
        disablePrev={currentIdx === 0}
        disableNext={!answers[currentIdx]}
      /> */}
      <BottomNav />
    </div>
  );

}

export default QuizPage;