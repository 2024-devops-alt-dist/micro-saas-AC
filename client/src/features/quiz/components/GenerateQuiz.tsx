import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Scan from "../../../components/Scan";
import { generateQuizFromFile } from "../../../services/n8nServices";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const THEMES = ["Histoire", "Maths", "Science", "Technologie et Sciences numériques", "Géographie", "Biologie", "Physique Chimie", "Langues Vivantes", "Economie et Gestion", "Sciences de la Vie et de la Terre", "Autres"];
const DIFFICULTIES = ["Facile", "Intermédiaire", "Difficile"];

export default function GenerateQuiz() {

  const navigate = useNavigate();
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [options, setOptions] = useState({
    theme: THEMES[0],
    difficulty: DIFFICULTIES[0],
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

  // on gère l upload du fichier pdf
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setSuccess(null);
  };

  // on gère le scan du document img
  const imageToPdf = async (imageFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const pdf = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "px",
            format: [img.width, img.height],
          });

          // Support JPG + PNG automatiquement
          const imageType = imageFile.type.includes("png") ? "PNG" : "JPEG";

          pdf.addImage(img, imageType, 0, 0, img.width, img.height);

          const pdfBlob = pdf.output("blob");
          const pdfFile = new File([pdfBlob], "scan.pdf", {
            type: "application/pdf",
          });

          resolve(pdfFile);
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  };

  const handleScanConfirm = async (scannedFile: File) => {
    try {
      const pdfFile = await imageToPdf(scannedFile);
      setFile(pdfFile);
      setSuccess("Scan converti en PDF avec succès");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la conversion du scan en PDF");
    }

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
    try {
      const response = await generateQuizFromFile(file, options);
      const result = Array.isArray(response) ? response[0] : response;

      if (result.errorMessage || result.error) {
        setError(`Erreur n8n: ${result.errorMessage || result.error}`);
        return;
      }

      if (result && result.quiz) {
        setSuccess("Quiz généré avec succès ! Redirection...");
        navigate("/quiz", {
          state: {
            quizData: result.quiz,
            metadata: {
              theme: options.theme,
              difficulty: options.difficulty
            }
          }
        });
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
    <div className="p-4" role="dialog" aria-labelledby="scan-title">
      <h2 id="scan-title" className="text-xl font-bold mb-4 text-black">Scanner un document</h2>
      <Scan
        onConfirm={handleScanConfirm}
        onClose={() => setIsScanOpen(false)}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 pb-24">
      <div className="w-full max-w-md space-y-6">

        <div className="space-y-4">
          <label htmlFor="theme-select" className="inline-block text-xs uppercase tracking-widest text-gray-200 font-bold ml-2">Thème du Quiz</label>
          <select
            id="theme-select"
            value={options.theme}
            onChange={(e) => setOptions({ ...options, theme: e.target.value })}
            className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-300 outline-none transition-all cursor-pointer"
            aria-label="Sélectionner le thème du quiz"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor="difficulty-select" className="inline-block text-xs uppercase tracking-widest text-gray-200 font-bold ml-2">Difficulté du Quiz</label>
          <select
            id="difficulty-select"
            value={options.difficulty}
            onChange={(e) => setOptions({ ...options, difficulty: e.target.value })}
            className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-300 outline-none transition-all cursor-pointer"
            aria-label="Sélectionner la difficulté du quiz"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4 bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50">
          <h2 className="text-xs uppercase tracking-widest text-gray-200 font-bold">Source du contenu</h2>

          <div className="flex flex-col gap-3">
            <label htmlFor="file-input" className="cursor-pointer group" aria-label="Zone de chargement de fichier">
              <div
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('file-input')?.click();
                  }
                }}
                className="p-4 bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-600 group-hover:border-yellow-300/50 transition-all text-center focus:ring-2 focus:ring-yellow-300 outline-none"
                aria-label={file ? `Fichier chargé : ${file.name}` : "Cliquer ou appuyer sur Entrée pour charger un fichier PDF ou Image"}
              >
                <span className="text-2xl mb-2 block" aria-hidden="true">📄</span>
                <div className="text-sm font-bold text-gray-200">
                  {file ? file.name : "Charger un fichier"}
                </div>
                <div className="text-[10px] text-gray-200 mt-1 uppercase" aria-hidden="true">PDF ou Image (Max 5Mo)</div>
              </div>
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="relative flex items-center gap-3 py-2" aria-hidden="true">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="text-[10px] text-gray-200 uppercase font-bold px-2">Ou</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <Button
            type="button"
            onClick={() => setIsScanOpen(true)}
            className="w-full py-3 bg-gray-700 text-gray-300 rounded-2xl border border-gray-600 hover:bg-gray-600 hover:text-white transition-all flex items-center justify-center gap-2"
            aria-label="Utiliser la caméra pour scanner un document"
          >
            <span aria-hidden="true">📸</span>
            <span className="font-bold text-sm">Scanner un document</span>
          </Button>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !file}
            className="w-full py-4 bg-yellow-300 hover:bg-yellow-400 text-gray-900 rounded-2xl shadow-xl shadow-yellow-900/20 font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                <span>Génération...</span>
              </div>
            ) : "Générer le Quiz"}
          </Button>

          <div className="mt-4" aria-live="polite">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs text-center font-medium" role="status">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isScanOpen} isClose={() => setIsScanOpen(false)} content={scanModalContent} />
    </div>
  );
}
