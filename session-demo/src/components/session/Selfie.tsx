import { useState } from "react";
import type { stepObject } from "../../types/session";
import Video from "../selfie/Video";
import SelfieConfirmation from "../selfie/SelfieConfirmation";
import type { SelfieCaptureData } from "../../types/selfie";

const Selfie = ({ stepObject }: { stepObject: stepObject }) => {
  const [internalStep, setInternalStep] = useState(0);
  const [selfieData, setSelfieData] = useState<SelfieCaptureData | null>(null);

  const handleConfirmSelfie = () => {
    console.log("Selfie confirmé:", selfieData);
    stepObject.setStep(stepObject.step + 1);
  };

  const handleRetakeSelfie = () => {
    setInternalStep(0);
  };

  return (
    <>
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
    </>
  );
};

export default Selfie;
