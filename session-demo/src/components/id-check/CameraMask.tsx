import React from "react";
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
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div
        className={`
          relative
          ${isPortrait ? "w-4/5 aspect-[3/2]" : "w-3/5 aspect-[3/2]"}
          ${facingMode === "user" ? "transform scale-x-[-1]" : ""}
        `}
        style={{
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)",
          border: "3px solid white",
          borderRadius: "8px",
        }}
      ></div>
    </div>
  );
};

export default CameraMask;
