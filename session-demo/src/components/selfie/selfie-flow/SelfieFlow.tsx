import { useState } from "react";
import SelfiePreIntroduction from "./SelfiePreIntroduction";
import InstructionsSelfie from "./InstructionsSelfie";
import SelfieRecorder from "./SelfieRecorder";

interface SelfieFlowProps {
  handleSelfie: (e: Event) => void;
  onBack?: () => void;
}

const SelfieFlow = ({ handleSelfie, onBack }: SelfieFlowProps) => {
  const [internalStep, setInternalStep] = useState(-1); // Commencer à -1 pour la pré-introduction

  const handleBack = () => {
    if (internalStep > -1) {
      setInternalStep(internalStep - 1);
    } else if (internalStep === -1 && onBack) {
      // Si on est à la première étape et qu'on a une fonction de retour parent, l'utiliser
      onBack();
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {internalStep === -1 && (
        <div className="flex-1 flex flex-col h-full">
          <SelfiePreIntroduction
            onContinue={() => setInternalStep(0)}
            onBack={handleBack}
          />
        </div>
      )}
      {internalStep === 0 && (
        <div className="flex-1 flex flex-col h-full">
          <InstructionsSelfie
            setStep={setInternalStep}
            onBack={() => setInternalStep(-1)}
          />
        </div>
      )}
      {internalStep === 1 && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <SelfieRecorder handleSelfie={handleSelfie} />
        </div>
      )}
    </div>
  );
};

export default SelfieFlow;
