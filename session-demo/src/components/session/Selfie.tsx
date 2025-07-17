import { useState } from "react";
import type { stepObject } from "../../types/session";
import Video from "../selfie/Video";
import SelfieConfirmation from "../selfie/SelfieConfirmation";
import type { SelfieCaptureData } from "../../types/selfie";

/**
 * Composant de gestion du flux selfie.
 * Gère les étapes internes de capture et confirmation du selfie.
 */
const Selfie = ({ stepObject }: { stepObject: stepObject }) => {
  const [internalStep, setInternalStep] = useState(0);
  const [selfieData, setSelfieData] = useState<SelfieCaptureData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleConfirmSelfie = () => {
    // Ajouter une transition visuelle avant de passer à l'étape suivante
    setIsTransitioning(true);

    // Attendre un peu pour l'animation avant de passer à l'étape suivante
    setTimeout(() => {
      stepObject.setStep(stepObject.step + 1);
      setIsTransitioning(false);
    }, 500);
  };

  const handleRetakeSelfie = () => {
    setInternalStep(0);
  };

  return (
    <div
      className={`h-full w-full transition-opacity duration-500 ${
        isTransitioning ? "opacity-50" : "opacity-100"
      }`}
    >
      {internalStep === 0 && (
        <Video setSelfieData={setSelfieData} setStep={setInternalStep} />
      )}
      {internalStep === 1 && selfieData && (
        <SelfieConfirmation
          selfieData={selfieData}
          onConfirm={handleConfirmSelfie}
          onRetake={handleRetakeSelfie}
        />
      )}
    </div>
  );
};

export default Selfie;
