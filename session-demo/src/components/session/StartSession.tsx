// import QrCodeRedirect from "./QrCodeRedirect";
import { useState } from "react";
import type { stepObject } from "../../types/session";
import Start from "../start-flow/Start";
import CGU from "../start-flow/CGU";
import useIsMobile from "../../hooks/useIsMobile";

const StartSession = ({ stepObject }: { stepObject: stepObject }) => {
  const isMobile = useIsMobile();
  const { setStep } = stepObject;
  const [startStep, setStartStep] = useState(0);

  return (
    <>
      {startStep === 0 && <Start setStep={isMobile ? setStartStep : setStep} />}
      {startStep === 1 && <CGU setStep={setStep} />}
    </>
  );
};

export default StartSession;
