import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Button from "./Button";

type Props = {
  onConfirm: (file: File) => void;
  onClose: () => void;
  maxWidth?: number; // à voir pour changer la qualité/taille du scan
};

const videoConstraints = {
  facingMode: { ideal: "environment" },
};

export default function ScanModal({ onConfirm, onClose, maxWidth = 1280 }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const dataURLtoFile = (dataurl: string, filename = "scan.jpg") => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleConfirm = async () => {
    if (!imgSrc) return;
    setIsProcessing(true);
    try {
      // Convertir dataURL en File et envoyer
      const file = dataURLtoFile(imgSrc, "scan.jpg");
      onConfirm(file);
    } finally {
      setIsProcessing(false);
    }
  };

  // Gestion de l'input file (import / caméra native)
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Créer une URL pour l'aperçu
    const url = URL.createObjectURL(f);
    setImgSrc(url);

  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full bg-gray-800 text-white rounded-lg p-4 flex flex-col items-center gap-4" style={{ maxWidth }}>
        {!imgSrc ? (
          <>
            <div className="w-full aspect-[4/3] bg-black rounded overflow-hidden flex items-center justify-center">
              {/* Webcam preview */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.8}
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                mirrored={false}
                imageSmoothing={true}
                minScreenshotHeight={300}
                minScreenshotWidth={300}
              />
            </div>

            <p className="text-sm text-gray-300 text-center">
              Positionnez le document dans le cadre puis appuyez sur "Prendre la photo".
            </p>

            <div className="flex w-full gap-3">
              <Button
                type="button"
                onClick={capture}
                className="flex-1 px-4 py-3 bg-yellow-300 hover:bg-yellow-400 text-black rounded font-bold"
              >
                Prendre la photo
              </Button>

              <label className="flex-1">
                <input
                  id="file-capture"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded text-center text-sm cursor-pointer">
                  Importer / Caméra native
                </div>
              </label>
            </div>

            <div className="flex w-full gap-3">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Annuler
              </Button>
            </div>
          </>
        ) : (
          // Preview + actions
          <>
            <div className="w-full bg-gray-900 rounded overflow-hidden flex items-center justify-center">
              <img src={imgSrc} alt="preview" className="w-full h-auto object-contain" />
            </div>

            <div className="flex w-full gap-3">
              <Button
                type="button"
                onClick={() => setImgSrc(null)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Reprendre
              </Button>

              <Button
                type="button"
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-yellow-300 hover:bg-yellow-400 text-black rounded font-bold"
              >
                {isProcessing ? "Envoi..." : "Confirmer / Scanner"}
              </Button>
            </div>

            <Button
              type="button"
              onClick={onClose}
              className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Retour
            </Button>
          </>
        )}
      </div>
    </div>
  );
}