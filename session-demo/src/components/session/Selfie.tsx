import { useState } from "react";
import type { stepObject } from "../../types/session";
import Video from "../selfie/Video";
import SelfieConfirmation from "../selfie/SelfieConfirmation";
import type { SelfieCaptureData } from "../../types/selfie";
import SelfieProcessing from "../selfie/selfie-flow/SelfieProcessing";

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
      setInternalStep(2); // Passer à l'étape de traitement du selfie
      setIsTransitioning(false);
    }, 500);
  };

  const selfieProcessed = (processed: boolean) => {
    // Callback pour indiquer que le selfie a été traité
    if (processed) {
      stepObject.setStep(stepObject.step + 1);
    }
  };

  const onRetake = () => {
    setInternalStep(0);
  };

  const handleRetakeSelfie = () => {
    setInternalStep(0);
  };

  const handleBackToParent = () => {
    // Retourner à l'étape précédente du flow principal
    stepObject.setStep(stepObject.step - 1);
  };

  return (
    <div
      className={`h-full w-full transition-opacity duration-500 ${
        isTransitioning ? "opacity-50" : "opacity-100"
      }`}
    >
      {internalStep === 0 && (
        <Video
          setSelfieData={setSelfieData}
          setStep={setInternalStep}
          onBack={handleBackToParent}
        />
      )}
      {internalStep === 1 && selfieData && (
        <SelfieConfirmation
          selfieData={selfieData}
          onConfirm={handleConfirmSelfie}
          onRetake={handleRetakeSelfie}
        />
      )}
      {internalStep === 2 && selfieData && (
        <SelfieProcessing
          onProcessingComplete={selfieProcessed}
          selfieFile={selfieData}
          onRetake={onRetake}
        />
      )}
    </div>
  );
};

export default Selfie;
