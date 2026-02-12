import { useState, useEffect } from "react";
import { getUsersStats, type UserStats } from "../features/quiz/services/statsService";
import Title from "../components/Title";
import BottomNav from "../components/BottomNav";

function QuizHistory() {
    const [stats, setStats] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getUsersStats();
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
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
            <Title text="MES QUIZ" />

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl max-w-4xl mx-auto">
                <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                    <h3 className="font-bold text-lg">Historique des Quiz</h3>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 italic">Chargement des données...</div>
                    ) : stats.length > 0 ? (
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
                                {stats.map((row) => (
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
                    ) : (
                        <div className="p-12 text-center text-gray-500 italic">
                            Aucun quiz enregistré. Lancez-vous !
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default QuizHistory;
