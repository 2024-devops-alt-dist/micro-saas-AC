import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useState } from "react";



function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl">Plus qu'un quiz, un plan de vol vers la réussite</h2>
      <form className=" rounded-lg px-8 py-6 w-full max-w-sm flex flex-col gap-4">
       <InputField 
       type="text" 
       placeholder="Email"
       className="border rounded-xl px-3 py-2 placeholder-gray-400 text-[#1A1F26] shadow-md"
       id="email" />
        <div className="flex justify-end  text-shadow-white">
          <a href="#" className="text-sm text-white hover:underline">Mot de passe oublié ?</a>
        </div>
        <div className="relative">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe" 
            className="border rounded-xl px-3 py-2 w-full placeholder-gray-400 text-[#1A1F26] shadow-md"
            id="password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            {showPassword ? "Masquer" : "Afficher"}
          </button>
        </div>
        <label className="flex justify-end  text-shadow-white gap-2 items-center text-sm">
          Rester connecté
          <input type="checkbox" className="accent-blue-500" />
        </label>
        <Button
          type="submit"
          className="bg-[#f3eb75] text-[#1A1F26] font-semibold py-2 rounded hover:bg-yellow-400 transition"
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