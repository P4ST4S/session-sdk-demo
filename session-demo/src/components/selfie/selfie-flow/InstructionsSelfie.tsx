import { FR, VideoRecordDirections } from "@unissey-web/sdk-react";
import "../Video.css";
import Button from "../../ui/Button";
import PoweredBy from "../../ui/PoweredBy";

interface InstructionsSelfieProps {
  setStep: (step: number) => void;
}

const InstructionsSelfie = ({ setStep }: InstructionsSelfieProps) => {
  const goOnNextStep = () => {
    setStep(1); // Move to the next step after showing instructions
  };

  return (
    <div className="selfie">
      <VideoRecordDirections strings={FR.videoRecordDirections} />

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button onClick={goOnNextStep} className="w-full">
            Je suis prêt.e
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default InstructionsSelfie;
