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
import PoweredBy from "../ui/PoweredBy";
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
        console.log("✅ Metadata loaded, seeking to 0.1s");
        tempVideo.currentTime = 0.1;
      };

      tempVideo.onseeked = () => {
        console.log("🖼️ Frame ready to capture");
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
    console.log("Loading state shown");
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <div className="mb-4">Traitement de votre selfie...</div>
          <div className="w-10 h-10 border-4 border-[#11E5C5] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Error state shown:", error);
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="mb-4 text-red-500">{error}</div>
          <button
            onClick={onRetake}
            className="px-4 py-2 bg-[#11E5C5] text-white rounded-lg hover:bg-[#0bb8a0] transition-colors"
          >
            Reprendre le selfie
          </button>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    console.log("No image URL available despite loading being complete");
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="mb-4">Impossible d'afficher le selfie</div>
          <button
            onClick={onRetake}
            className="px-4 py-2 bg-[#11E5C5] text-white rounded-lg hover:bg-[#0bb8a0] transition-colors"
          >
            Reprendre le selfie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-content w-full px-4 pt-8 pb-[80px] overflow-hidden">
      <div className="flex flex-col gap-5 mt-4 mx-auto w-full max-w-[322px]">
        <div className="flex flex-col items-center mx-auto overflow-hidden">
          <Title className="mb-5">Confirmez votre selfie</Title>
          <Subtitle className="mb-6">
            Vérifiez que votre selfie est clairement visible et bien cadré.
          </Subtitle>

          <div className="w-full mb-8">
            <div className="overflow-hidden border-3 border-[#11E5C5] rounded-lg mb-4">
              <img
                src={imageUrl}
                alt="Votre selfie"
                className="w-full object-contain"
              />
            </div>
          </div>

          {/* Canvas caché utilisé pour le traitement des images */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] pt-4 bg-white">
        {/* Buttons for confirmation or retry */}
        <div className="flex flex-col gap-3 w-full mb-4">
          <Button onClick={onConfirm} className="w-full">
            Confirmer
          </Button>
          <button
            onClick={onRetake}
            className="text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline"
          >
            Reprendre la photo
          </button>
        </div>
        <div className="pb-4">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
};

export default SelfieConfirmation;
