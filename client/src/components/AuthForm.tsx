import InputField from "./InputField";



function AuthForm() {
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
        <h2>Plus qu'un quiz, un plan de vol vers la réussite</h2>
      <form className="border border-gray-300 shadow-md rounded-lg px-8 py-6 w-full max-w-sm flex flex-col gap-4">
       <InputField 
       type="text" 
       placeholder="Email"
       id="email" />
        <div className="flex justify-end  text-shadow-white">
          <a href="#" className="text-sm text-white hover:underline">Mot de passe oublié ?</a>
        </div>
        <div className="relative">
          <InputField
            type="password"
            placeholder="Mot de passe" 
            id="password"
          />
          <a href="#" className="absolute right-3 top-2 text-xs text-gray-500 hover:underline">Afficher</a>
        </div>
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" className="accent-blue-500" />
          Rester connecté
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Connexion
        </button>
      </form>
      <p className="mt-4 text-gray-700">
        Pas encore de compte ? <a href="#" className="text-blue-500 hover:underline">Créer un compte</a>
      </p>
    </div>
  );
}

export default AuthForm;