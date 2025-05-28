import React, { useEffect, useState } from "react";

interface CameraMaskProps {
  isDetecting: boolean;
}

const CameraMask: React.FC<CameraMaskProps> = ({ isDetecting }) => {
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    const mediaQuery = window.matchMedia("(orientation: portrait)");
    mediaQuery.addEventListener("change", handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div
        className={`
          border-4 border-white border-dashed rounded-lg
          flex items-center justify-center
          ${
            isPortrait ? "w-6/7 h-1/4 aspect-[3/2]" : "w-1/2 h-2/3 aspect-[3/4]"
          }
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
