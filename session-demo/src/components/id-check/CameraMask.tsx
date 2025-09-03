import React, { useEffect, useState } from "react";
import type { CameraFacingMode } from "../../types/camera";

interface CameraMaskProps {
  isDetecting: boolean;
  isPortrait?: boolean;
  facingMode?: CameraFacingMode;
}

const CameraMask: React.FC<CameraMaskProps> = ({
  isPortrait = false,
  facingMode = "environment",
}) => {
  const [videoOrientation, setVideoOrientation] = useState<boolean | null>(null);

  // Détecter l'orientation réelle de la vidéo pour synchroniser avec Photo.tsx
  useEffect(() => {
    const checkVideoOrientation = () => {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        const videoIsPortrait = videoElement.videoHeight > videoElement.videoWidth;
        setVideoOrientation(videoIsPortrait);
      }
    };

    // Vérifier immédiatement
    checkVideoOrientation();

    // Vérifier périodiquement en cas de changement
    const interval = setInterval(checkVideoOrientation, 1000);

    return () => clearInterval(interval);
  }, []);

  // Utiliser l'orientation de la vidéo si disponible, sinon fallback sur l'orientation de l'écran
  const effectiveIsPortrait = videoOrientation !== null ? videoOrientation : isPortrait;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div
        className={`
          relative
          ${effectiveIsPortrait ? "w-4/5 aspect-[3/2]" : "w-3/5 aspect-[3/2]"}
          ${facingMode === "user" ? "transform scale-x-[-1]" : ""}
          transition-all duration-300 ease-in-out
        `}
        style={{
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)",
          border: "3px solid white",
          borderRadius: "8px",
        }}
      >
        {/* Indicateur d'orientation pour debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -top-8 left-0 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            {effectiveIsPortrait ? 'Portrait' : 'Landscape'} 
            {videoOrientation !== null ? ' (Video)' : ' (Screen)'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraMask;
