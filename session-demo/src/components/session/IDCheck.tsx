import { useState } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import Photo from "../id-check/Photo";

interface IDCheckProps {
  stepObject: stepObject;
}

const IDCheck = ({ stepObject }: IDCheckProps) => {
  const [internalStep, setInternalStep] = useState(0);

  const onCapture = (image: string) => {
    console.log("Captured image:", image);
    // Here you can handle the captured image, e.g., send it to a server or process it
  };

  return (
    <>
      {internalStep === 0 && <BeforePhoto setStep={setInternalStep} />}
      {internalStep === 1 && (
        <Photo orientation="landscape" onCapture={onCapture} />
      )}
    </>
  );
};

export default IDCheck;
