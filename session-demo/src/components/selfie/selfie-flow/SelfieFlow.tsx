import { useState } from "react";
import InstructionsSelfie from "./InstructionsSelfie";
import SelfieRecorder from "./SelfieRecorder";

interface SelfieFlowProps {
  handleSelfie: (e: Event) => void;
}

const SelfieFlow = ({ handleSelfie }: SelfieFlowProps) => {
  const [internalStep, setInternalStep] = useState(0);

  return (
    <div className="h-full w-full flex flex-col">
      {internalStep === 0 && (
        <div className="flex-1 flex flex-col h-full">
          <InstructionsSelfie setStep={setInternalStep} />
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
