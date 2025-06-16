import { useState } from "react";
import InstructionsSelfie from "./InstructionsSelfie";
import SelfieRecorder from "./SelfieRecorder";

interface SelfieFlowProps {
  handleSelfie: (e: Event) => void;
}

const SelfieFlow = ({ handleSelfie }: SelfieFlowProps) => {
  const [internalStep, setInternalStep] = useState(0);

  return (
    <>
      {internalStep === 0 && <InstructionsSelfie setStep={setInternalStep} />}
      {internalStep === 1 && <SelfieRecorder handleSelfie={handleSelfie} />}
    </>
  );
};

export default SelfieFlow;
