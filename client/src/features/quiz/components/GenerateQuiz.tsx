import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Scan from "../../../components/Scan";
import { generateQuizFromFile } from "../../../services/n8nServices";
import { useNavigate } from "react-router-dom";


//import { type ChangeEvent } from "react";
//import useGenerateQuiz from "./useGenerateQuiz";
//import ProgressRing from "./ProgressRing";

const THEMES = ["Général", "Histoire", "Maths", "Science"];
const DIFFICULTIES = ["Facile", "Intermédiaire", "Difficile"];
const QUESTION_TYPES = ["QCM", "Vrai/Faux", "Ouverte"];

export default function GenerateQuiz() {
  //   const {
  //     options,
  //     setOption,
  //     file,
  //     setFile,
  //     isGenerating,
  //     progress,
  //     error,
  //     generateQuiz,
  //     uploadFile,
  //     startScan,
  //     reset,
  //   }
  // = useGenerateQuiz({ theme: THEMES[0], difficulty: DIFFICULTIES[0], questionType: QUESTION_TYPES[0] });

  const navigate = useNavigate();
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [options, setOptions] = useState({
    theme: THEMES[0],
    difficulty: DIFFICULTIES[0],
    questionType: QUESTION_TYPES[0],
  });

  // empêche le scroll de fond quand la modale est ouverte
  useEffect(() => {
    if (isScanOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isScanOpen]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Fichier selectionné:", e.target.files);
    const f = e.target.files?.[0] ?? null;
    console.log("Fichier selectionné:", f);
    setFile(f);
    setError(null);
    setSuccess(null);
  };

  const handleScanConfirm = (scannedFile: File) => {
    // Traiter le fichier scanné ici
    console.log("Fichier scanné:", scannedFile);
    setFile(scannedFile);
    setError(null);
    setSuccess(null);
    setIsScanOpen(false);
  };

  const handleGenerateQuiz = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    // try {
    //   const result = await generateQuizFromFile(file);
    //   console.log("Resultat du quiz généré (result):", result);
    //   console.log("Resultat du quiz généré (result.quiz):", result.quiz);
    //   setSuccess("Quiz généré avec succès");
    //   if (result && result.quiz) {
    //     // On redirige vers la page quiz en passant les données réelles

    //     navigate("/quiz", { state: { quizData: result.quiz } });
    //   }
    // } catch (error) {
    try {
      const response = await generateQuizFromFile(file);
      console.log("DEBUG - Réponse brute:", response);

      // 1. On gère le cas où n8n renvoie un tableau [ { quiz: ... } ]
      const result = Array.isArray(response) ? response[0] : response;

      // 2. On vérifie si n8n n'a pas renvoyé une erreur (format JSON d'erreur n8n)
      if (result.errorMessage || result.error) {
        setError(`Erreur n8n: ${result.errorMessage || result.error}`);
        return;
      }

      // 3. On vérifie si on a bien nos questions
      if (result && result.quiz) {
        setSuccess("Quiz généré avec succès ! Redirection...");
        navigate("/quiz", { state: { quizData: result.quiz } });
      } else {
        setError("Format de réponse inconnu (pas de clé 'quiz')");
      }
    } catch (error) {
      console.error("DEBUG - Erreur lors de la génération du quiz:", error);
      setError("Erreur lors de la génération du quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const scanModalContent = (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Scanner un document</h2>
      <Scan
        onConfirm={handleScanConfirm}
        onClose={() => setIsScanOpen(false)}
      />
    </div>
  );


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-80 space-y-4">
        <select
          value={options.theme}
          onChange={(e) => setOptions({ ...options, theme: e.target.value })}
          className="w-full p-3 rounded bg-gray-700 text-white"
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={options.difficulty}
          onChange={(e) => setOptions({ ...options, difficulty: e.target.value })}
          className="w-full p-3 rounded bg-gray-700 text-white"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={options.questionType}
          onChange={(e) => setOptions({ ...options, questionType: e.target.value })}
          className="w-full p-3 rounded bg-gray-700 text-white"
        >
          {QUESTION_TYPES.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <label htmlFor="file-input" className="flex-1 cursor-pointer">
            <div className="px-3 py-2 bg-gray-800 rounded text-sm text-gray-200 text-left">
              {file ? file.name : "Charger un fichier"}
              <div className="text-xs text-gray-400">Fichier PDF ou Image (jpg, png, jpeg)</div>
            </div>
          </label>
          <input
            id="file-input"
            type="file"
            accept=".pdf,image/*"
            onChange={onFileChange}
            className="hidden"
          />

          {/* <Button
            type="button"
            onClick={async () => {
              if (file) await generateQuizFromFile(file);
              "test";
            }}
            className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-black rounded font-bold"
          >
            Ok
          </Button> */}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Scanner un document</span>

          <Button
            type="button"
            onClick={() => setIsScanOpen(true)}
            // onClick={() => startScan()}
            // disabled={isGenerating}
            className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-black rounded font-bold"
          >
            Scan
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleGenerateQuiz}
          disabled={isGenerating || !file}
          className="w-full py-3 bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-black rounded shadow-lg font-bold text-lg"
        >
          {isGenerating ? "Génération en cours..." : "Générer le Quiz"}
        </Button>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        {success && <div className="text-green-400 mt-2">{success}</div>}

        <div className="flex justify-center mt-4">
          {/* <ProgressRing size={120} stroke={10} progress={progress} /> */}
        </div>

        {/* {error && <div className="text-red-400 mt-2">{error}</div>} */}

        <div className="flex gap-3 mt-2">
          {/* <button onClick={() => reset()} className="flex-1 py-2 bg-gray-700 rounded text-sm">Réinitialiser</button> */}
        </div>
      </div>
      <Modal isOpen={isScanOpen} isClose={() => setIsScanOpen(false)} content={scanModalContent} />
    </div>
  );
}