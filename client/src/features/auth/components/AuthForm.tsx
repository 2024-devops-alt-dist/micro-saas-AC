import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useState } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../services/api";

interface AuthFormProps {
  initialIsLogin?: boolean;
}

function AuthForm({ initialIsLogin = true }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      await apiFetch("/api/password-reset/", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotMessage("Si cet email est enregistré, un lien vous a été envoyé.");
    } catch {
      setForgotError("Une erreur est survenue. Réessayez.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        await authService.login(username, password);
        setMessage("Connexion réussie !");
        navigate("/profil");
      } else {
        await authService.register(username, email, password);
        await authService.login(username, password);
        navigate("/profil");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h2 className="text-3xl text-center max-w-lg mb-6">
        {isLogin
          ? "Plus qu'un quiz, un plan de vol vers la réussite !"
          : "Prêt pour le décollage ? Créez votre compte"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg px-8 py-6 w-full max-w-sm flex flex-col gap-4 bg-gray-800/60"
      >
        {error && (
          <p className="text-red-500 text-sm bg-red-100/10 p-2 rounded">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-sm bg-green-100/10 p-2 rounded">
            {message}
          </p>
        )}

        <InputField
          type="text"
          placeholder="Nom d'utilisateur"
          aria-label="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 pr-12 rounded bg-gray-700 placeholder-gray-400 shadow-md"
          id="username"
          required
        />

        {!isLogin && (
          <InputField
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pr-12 rounded bg-gray-700 placeholder-gray-400 shadow-md"
            id="email"
            required
          />
        )}

        <div className="relative">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            aria-label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 rounded bg-gray-700 placeholder-gray-400 shadow-md"
            id="password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </button>
        </div>

        {isLogin && (
          <div className="flex justify-end text-shadow-white">
            <button
              type="button"
              onClick={() => { setShowForgotModal(true); setForgotMessage(""); setForgotError(""); setForgotEmail(""); }}
              className="text-sm text-white hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}

        <label className="flex justify-end text-shadow-white gap-2 items-center text-sm">
          Rester connecté
          <input type="checkbox" className="accent-blue-500" />
        </label>

        <Button
          type="submit"
          className="px-6 py-3 rounded-lg bg-yellow-300 hover:bg-yellow-400 cursor-pointer shadow font-bold text-black text-base transition active:scale-95 disabled:opacity-50"
        >
          {isLogin ? "Connexion" : "S'inscrire"}
        </Button>
      </form>

      <p className="mt-4 text-gray-400">
        {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"} {" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Réinitialiser le mot de passe</h3>
            <p className="text-gray-400 text-sm mb-4">Entrez votre email et nous vous enverrons un lien.</p>
            {forgotMessage ? (
              <p className="text-green-400 text-sm bg-green-500/10 p-3 rounded">{forgotMessage}</p>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                {forgotError && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{forgotError}</p>}
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  required
                />
                <Button
                  type="submit"
                  disabled={forgotLoading}
                  className="py-2 bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg transition disabled:opacity-50"
                >
                  {forgotLoading ? "Envoi..." : "Envoyer le lien"}
                </Button>
              </form>
            )}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="mt-4 w-full py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthForm;