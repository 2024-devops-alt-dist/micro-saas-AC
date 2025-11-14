import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useState } from "react";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
        <h2 className="text-3xl text-center max-w-lg mb-6">Plus qu'un quiz, un plan de vol vers la réussite</h2>
      <form className="rounded-lg px-8 py-6 w-full max-w-sm flex flex-col gap-4 bg-gray-800/60">
       <InputField 
       type="text" 
       placeholder="Email"
       className="w-full p-3 rounded bg-gray-700 placeholder-gray-400 shadow-md"
       id="email" />
        <div className="flex justify-end  text-shadow-white">
          <a href="#" className="text-sm text-white hover:underline">Mot de passe oublié ?</a>
        </div>
        <div className="relative">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe" 
            className="w-full p-3 rounded bg-gray-700  placeholder-gray-400 shadow-md"
            id="password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer"
          >
            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
          </button>
        </div>
        <label className="flex justify-end  text-shadow-white gap-2 items-center text-sm">
          Rester connecté
          <input type="checkbox" className="accent-blue-500" />
        </label>
        <Button
          type="submit"
          className="px-6 py-3 rounded-lg bg-yellow-300 hover:bg-yellow-400 cursor-pointer shadow font-bold text-black text-base transition active:scale-95 disabled:opacity-50"
        >
          Connexion
        </Button>
      </form>
      <p className="mt-4 text-gray-700">
        Pas encore de compte ? <a href="#" className="text-blue-500 hover:underline">Créer un compte</a>
      </p>
    </div>
  );
}

export default AuthForm;