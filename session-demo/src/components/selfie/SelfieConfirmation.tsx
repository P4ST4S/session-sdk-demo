/**
 * SelfieConfirmation component
 *
 * Displays the captured selfie and allows the user to confirm or retake it.
 *
 * @param {Object} props - Component props
 * @param {SelfieCaptureData} props.selfieData - The captured selfie data containing media blob and metadata
 * @param {Function} props.onConfirm - Function called when user confirms the selfie
 * @param {Function} props.onRetake - Function called when user wants to retake the selfie
 * @returns {JSX.Element} The selfie confirmation UI component
 */

import { useEffect, useState, useRef } from "react";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import type { SelfieCaptureData } from "../../types/selfie";

interface SelfieConfirmationProps {
  selfieData: SelfieCaptureData;
  onConfirm: () => void;
  onRetake: () => void;
}

const SelfieConfirmation = ({
  selfieData,
  onConfirm,
  onRetake,
}: SelfieConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (!selfieData?.media) {
      setError("Aucune donnée de selfie disponible");
      setIsLoading(false);
      return;
    }

    const blob = selfieData.media;
    const mimeType = blob.type;
    const canPlay = document.createElement("video").canPlayType(mimeType);

    if (!mimeType.startsWith("video/") || canPlay === "") {
      setError("Format vidéo non supporté par ce navigateur");
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      const videoUrl = URL.createObjectURL(blob);
      const tempVideo = document.createElement("video");

      tempVideo.autoplay = false;
      tempVideo.muted = true;
      tempVideo.playsInline = true;
      tempVideo.crossOrigin = "anonymous";
      tempVideo.src = videoUrl;

      tempVideo.onloadedmetadata = () => {
        tempVideo.currentTime = 0.1;
      };

      tempVideo.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = tempVideo.videoWidth || 320;
        canvas.height = tempVideo.videoHeight || 240;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Impossible de dessiner la vidéo");
          setIsLoading(false);
          return;
        }

        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        const frameUrl = canvas.toDataURL("image/jpeg", 0.9);
        setImageUrl(frameUrl);
        setIsLoading(false);

        URL.revokeObjectURL(videoUrl);
      };

      tempVideo.onerror = (e) => {
        console.error("❌ Erreur de lecture vidéo :", e);
        setError("Impossible de charger la vidéo selfie");
        setIsLoading(false);
      };
    }, 0); // delay to wait for the video to load

    return () => clearTimeout(timeout);
  }, [selfieData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center p-6">
          <div className="mb-4 text-gray-700">
            Traitement de votre selfie...
          </div>
          <div className="w-12 h-12 border-4 border-[#11E5C5] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <Title className="text-xl mb-2">Une erreur est survenue</Title>
          <p className="mb-6 text-sm text-gray-600">{error}</p>
          <Button onClick={onRetake} className="w-full md:max-w-xs mx-auto">
            Reprendre le selfie
          </Button>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <Title className="text-xl mb-2">
            Impossible d'afficher le selfie
          </Title>
          <p className="mb-6 text-sm text-gray-600">
            Nous n'avons pas pu traiter correctement votre selfie.
          </p>
          <Button onClick={onRetake} className="w-full md:max-w-xs mx-auto">
            Reprendre le selfie
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full w-full bg-white">
      {/* Header */}
      <div className="p-4 text-center bg-white border-b border-gray-100">
        <Title className="text-xl md:text-2xl">Confirmez votre selfie</Title>
        <Subtitle className="text-xs text-gray-600 mt-2 md:text-sm">
          Vérifiez que votre visage est clairement visible
        </Subtitle>
      </div>

      {/* Main content area */}
      <div className="flex-1 px-4 py-6 md:px-8 md:py-8 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Selfie display with frame */}
          <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative rounded-lg overflow-hidden border-2 border-[#11E5C5]">
              <img
                src={imageUrl}
                alt="Votre selfie"
                className="w-full h-64 md:h-80 object-cover bg-white"
              />
              {/* Overlay pour améliorer la lisibilité */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-3">
                <p className="text-white text-xs text-center">
                  Selfie capturé avec succès
                </p>
              </div>
            </div>
          </div>

          {/* Checklist de confirmation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-3">Vérifiez que :</h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Votre visage est bien visible et occupe la majeure partie de
                l'image
              </li>
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                L'image est nette et bien éclairée
              </li>
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Aucun objet ne cache votre visage (lunettes de soleil, masque,
                etc.)
              </li>
            </ul>
          </div>

          {/* Canvas caché utilisé pour le traitement des images */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={onConfirm} className="w-full py-3">
              Confirmer
            </Button>
            <button
              onClick={onRetake}
              className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
            >
              Reprendre le selfie
            </button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-between items-center">
            <button
              onClick={onRetake}
              className="px-6 py-3 text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline border border-gray-300 rounded-lg"
            >
              Reprendre le selfie
            </button>
            <Button onClick={onConfirm} className="px-6 py-3">
              Confirmer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfieConfirmation;
