import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useState } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../services/authService";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        await authService.login(username, password);
        setMessage("Connexion réussie !");
      } else {
        await authService.register(username, email, password);
        setMessage("Compte créé avec succès ! Connectez-vous.");
        setIsLogin(true);
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 placeholder-gray-400 shadow-md"
          id="username"
          required
        />

        {!isLogin && (
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 placeholder-gray-400 shadow-md"
            id="email"
            required
          />
        )}

        <div className="relative">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 placeholder-gray-400 shadow-md"
            id="password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer"
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
            <a href="#" className="text-sm text-white hover:underline">
              Mot de passe oublié ?
            </a>
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
    </div>
  );
}

export default AuthForm;