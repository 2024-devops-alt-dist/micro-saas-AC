import { useUserStats } from "../features/charts/services/userStats";
import Title from "../components/Title";
import BottomNav from "../components/BottomNav";

function QuizHistory() {
    const { stats, state } = useUserStats();

    const sortedStats = [...stats].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24 px-4 sm:px-6 overflow-x-hidden">
            <Title text="MES QUIZ" />

            <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl max-w-4xl mx-auto mt-4 sm:mt-8">

                <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                    <h3 className="font-bold text-lg">Historique des Quiz</h3>
                </div>

                {state === "loading" ? (
                    <div className="p-12 text-center text-gray-400 italic">Chargement des données...</div>
                ) : sortedStats.length > 0 ? (
                    <>
                        {/* Vue tableau — desktop uniquement */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">Thème</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Score</th>
                                        <th className="px-4 py-3">Niveau</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {sortedStats.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-3 font-medium text-blue-300">
                                                {row.category_name || "Général"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-sm">
                                                {new Date(row.date).toLocaleDateString("fr-FR")}
                                            </td>
                                            <td className="px-4 py-3">
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
                        </div>

                        {/* Vue cartes — mobile uniquement */}
                        <div className="sm:hidden divide-y divide-gray-700/50">
                            {sortedStats.map((row) => (
                                <div key={row.id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-700/20 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-blue-300 truncate">{row.category_name || "Général"}</p>
                                        <p className="text-gray-400 text-xs mt-1">{new Date(row.date).toLocaleDateString("fr-FR")}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`font-bold text-sm ${row.score >= 7 ? 'text-green-400' : row.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {row.score}/10
                                        </span>
                                        <span className="text-[10px] px-2 py-1 rounded bg-gray-900 border border-gray-700 uppercase font-bold text-gray-400">
                                            {row.level_name || "Normal"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center text-gray-500 italic">
                        Aucun quiz enregistré. Lancez-vous !
                    </div>
                )}
            </div>
            <BottomNav />

        </div>
    );
}

export default QuizHistory;
