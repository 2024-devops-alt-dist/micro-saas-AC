import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
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

    const [isScanOpen, setIsScanOpen] = useState(false);
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

  const onFileChange = async () => {
   // const f = e.target.files?.[0] ?? null;
   // setFile(f);
    // Optionally auto-upload immediately:
    // if (f) await uploadFile(f);
  };

  const scanModalContent = (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Scanner un document</h2>
    </div>
  );
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-80 space-y-4">
        <select
          value={"options.theme"}
          onChange={() => "test"}
          className="w-full p-3 rounded bg-gray-700 text-white"
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={"options.difficulty"}
          onChange={() => "test"}
          className="w-full p-3 rounded bg-gray-700 text-white"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={"options.questionType"}
          onChange={() => "test"}
          className="w-full p-3 rounded bg-gray-700 text-white"
        >
          {QUESTION_TYPES.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <label className="flex-1">
            <input type="file" accept=".pdf,image/*" onChange={onFileChange} className="hidden" id="file-input" />
            <div className="cursor-pointer px-3 py-2 bg-gray-800 rounded text-sm text-gray-200 text-left">
              {/* {file ? file.name : "Charger un fichier"} */}
                Charger un fichier
              <div className="text-xs text-gray-400">Fichier PDF ou JPEG</div>
            </div>
          </label>

          <Button
            type="button"
            onClick={async () => {
              // if (file) await uploadFile(file);
              "test";
            }}
            className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-black rounded font-bold"
          >
            Ok
          </Button>
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
          // onClick={() => generateQuiz()}
          // disabled={isGenerating}
          className="w-full py-3 bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-black rounded shadow-lg font-bold text-lg"
        >
          Générer le Quiz
        </Button>

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