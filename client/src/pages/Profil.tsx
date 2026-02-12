import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { authService } from "../features/auth/services/authService";
import Button from "../components/Button";
import Title from "../components/Title";
//import { getUsersStats, type UserStats } from "../features/quiz/services/statsService";

function Profil() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  //const [stats, setStats] = useState<UserStats[]>([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // const fetchStats = async () => {
    //   try {
    //     const data = await getUsersStats();
    //     // Trier par date décroissante
    //     const sortedData = [...data].sort((a, b) =>
    //       new Date(b.date).getTime() - new Date(a.date).getTime()
    //     );
    //     setStats(sortedData);
    //   } catch (error) {
    //     console.error("Erreur lors de la récupération des stats:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    //fetchStats();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated) return null;

  const username = authService.getUsername();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <Title text="MON PROFIL" />

      {/* Carte Utilisateur */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm uppercase">Pilote</p>
            <h2 className="text-2xl font-bold text-blue-400">{username}</h2>
          </div>
          <Button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white rounded-lg transition"
          >
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => navigate("/stats")}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-900/20"
        >
          Voir mes Graphiques 📊
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => navigate("/quiz")}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-900/20"
        >
          Voir mes Quiz
        </Button>
      </div>

      {/* Tableau des Quiz
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
      </div> */}

      <BottomNav />
    </div>
  );
}

export default Profil;
