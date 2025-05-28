import { useState } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import Photo from "../id-check/Photo";
import PhotoConfirmation from "../id-check/PhotoConfirmation";

interface IDCheckProps {
  stepObject: stepObject;
}

const IDCheck = ({ stepObject }: IDCheckProps) => {
  const [internalStep, setInternalStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const onCapture = (image: string) => {
    console.log("Captured image:", image);
    setCapturedImage(image);
    setInternalStep(2); // Move to confirmation step
  };

  const handleConfirm = () => {
    console.log("Image confirmed:", capturedImage);
    // Here you can handle the confirmed image, e.g., send it to a server or process it

    // Move to the next step in the workflow
    stepObject.setStep(stepObject.step + 1);
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setInternalStep(1); // Go back to camera step
  };

  return (
    <>
      {internalStep === 0 && <BeforePhoto setStep={setInternalStep} />}
      {internalStep === 1 && <Photo onCapture={onCapture} />}
      {internalStep === 2 && capturedImage && (
        <PhotoConfirmation
          imageUrl={capturedImage}
          onConfirm={handleConfirm}
          onRetry={handleRetry}
        />
      )}
    </>
  );
};

export default IDCheck;
