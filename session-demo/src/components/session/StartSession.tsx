import { useState } from "react";
import type { stepObject } from "../../types/session";
import Start from "../start-flow/Start";
import CGU from "../start-flow/CGU";

const StartSession = ({ stepObject }: { stepObject: stepObject }) => {
  const { setStep } = stepObject;
  const [startStep, setStartStep] = useState(0);

  return (
    <div className="w-full h-full">
      {startStep === 0 && <Start setStep={setStartStep} />}
      {startStep === 1 && <CGU setStep={setStep} />}
    </div>
  );
};

export default StartSession;
