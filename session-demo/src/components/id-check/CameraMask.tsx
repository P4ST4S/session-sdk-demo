import React from "react";
import type { CameraFacingMode } from "../../types/camera";

interface CameraMaskProps {
  isDetecting: boolean;
  isPortrait?: boolean;
  facingMode?: CameraFacingMode;
}

const CameraMask: React.FC<CameraMaskProps> = ({
  isDetecting,
  isPortrait = false,
  facingMode = "environment",
}) => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div
        className={`
          border-4 border-white border-dashed rounded-lg
          flex items-center justify-center
          ${
            isPortrait ? "w-6/7 h-1/4 aspect-[3/2]" : "w-1/2 h-2/3 aspect-[3/4]"
          }
          ${facingMode === "user" ? "transform scale-x-[-1]" : ""}
        `}
      >
        <p className="text-white text-center bg-black bg-opacity-50 p-2 rounded">
          {isDetecting
            ? "Placez votre document d'identité dans le cadre"
            : "Détection en cours..."}
        </p>
      </div>
    </div>
  );
};

export default CameraMask;
