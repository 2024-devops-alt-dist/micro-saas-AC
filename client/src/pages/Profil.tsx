import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { authService } from "../features/auth/services/authService";
import Button from "../components/Button";

function Profil() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated) return null;

  const username = authService.getUsername();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-20">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-lg">Bonjour, <span className="text-blue-400 font-bold">{username}</span></p>
        <p className="mt-2 text-gray-400 font-rajdhani">Fais décoller tes révisions !</p>

        <Button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
        >
          Se déconnecter
        </Button>
      </div>
      <BottomNav />
    </div>
  );
}

export default Profil;
