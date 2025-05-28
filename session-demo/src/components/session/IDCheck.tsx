import { useState } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import Photo from "../id-check/Photo";

interface IDCheckProps {
  stepObject: stepObject;
}

const IDCheck = ({ stepObject }: IDCheckProps) => {
  const [internalStep, setInternalStep] = useState(0);

  return (
    <>
      {internalStep === 0 && <BeforePhoto setStep={setInternalStep} />}
      {internalStep === 1 && <Photo />}
    </>
  );
};

export default IDCheck;
