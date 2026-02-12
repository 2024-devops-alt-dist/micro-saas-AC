import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { authService } from "../features/auth/services/authService";
import Button from "../components/Button";
import Title from "../components/Title";
import { getUsersStats, type UserStats } from "../features/quiz/services/statsService";
import EditProfileModal from "../features/auth/components/EditProfileModal";
import { PresentationChartBarIcon, AtSymbolIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

function Profil() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [stats, setStats] = useState<UserStats[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getUsersStats();
        const sortedData = [...data].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setStats(sortedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
      }
    };

    fetchStats();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleUpdateProfile = async (currentPassword: string, newEmail?: string, newPassword?: string) => {
    await authService.updateProfile(currentPassword, newEmail, newPassword);

    if (newPassword) {
      navigate("/login");
    } else {
      setSuccessMessage("Profil mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      if (newEmail) {
        window.location.reload();
      }
    }
  };

  if (!isAuthenticated) return null;

  const username = authService.getUsername();
  const email = authService.getEmail();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <Title text="MON PROFIL" />

      {successMessage && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Carte Informations Utilisateur */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Compte Pilote</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {username}
            </h2>
          </div>
          <Button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300"
          >
            Déconnexion
          </Button>
        </div>

        {/* Informations du compte */}
        <div className="space-y-3 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-400 text-lg">👤</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Nom du pilote</p>
              <p className="text-white font-medium">{username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <AtSymbolIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-white font-medium">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <PresentationChartBarIcon className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Quiz effectués</p>
              <p className="text-white font-medium">{stats.length} quiz</p>
            </div>
          </div>
        </div>

        {/* Bouton Modifier */}
        <div className="mt-4">
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-2 bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-300"
          >
            ✏️ Modifier mes informations
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => navigate("/history")}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-900/20"
        >
          Voir mes Quiz
        </Button>
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button
          onClick={() => navigate("/stats")}
          className="py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
        >
          <PresentationChartBarIcon className="w-5 h-5" />
          <span>Mes Stats</span>
        </Button>
        <Button
          onClick={() => navigate("/generate-quiz")}
          className="py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
        >
          <AcademicCapIcon className="w-5 h-5" />
          <span>Nouveau Quiz</span>
        </Button>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
        currentEmail={email}
      />

      <BottomNav />
    </div>
  );
}

export default Profil;
