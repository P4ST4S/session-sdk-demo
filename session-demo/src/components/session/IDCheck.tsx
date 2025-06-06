import { useState, useEffect } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import BeforeVersoPhoto from "../id-check/BeforeVersoPhoto";
import Photo from "../id-check/Photo";
import PhotoConfirmation from "../id-check/PhotoConfirmation";
import { JDIDocumentType as FrenchJDI } from "../../utils/chooseDocuments/frenchDocumentTypes";
import { JDIDocumentType as SpanishJDI } from "../../utils/chooseDocuments/spanishDocumentTypes";
import { cameraService } from "../../services/cameraService";

interface IDCheckProps {
  stepObject: stepObject;
  documentTypeId?: string | null;
}

const IDCheck = ({ stepObject, documentTypeId = "jdi-2" }: IDCheckProps) => {
  const [internalStep, setInternalStep] = useState(0);
  const [capturedRectoImage, setCapturedRectoImage] = useState<string | null>(
    null
  );
  const [capturedVersoImage, setCapturedVersoImage] = useState<string | null>(
    null
  );
  const [requiresTwoSides, setRequiresTwoSides] = useState(false);

  // Monitor step changes to ensure the camera is stopped
  useEffect(() => {
    // Stop the camera during step transitions
    if (internalStep !== 1 && internalStep !== 3) {
      // Stop the camera if we're not at a photo capture step
      cameraService.stopCamera();
    }
  }, [internalStep]);

  // Determine if the document needs two sides based on the document type ID
  useEffect(() => {
    if (!documentTypeId) return;

    // Search in both French and Spanish document types
    const allDocumentTypes = [...FrenchJDI, ...SpanishJDI];
    const selectedDocType = allDocumentTypes.find(
      (doc) => doc.id === documentTypeId
    );

    if (selectedDocType) {
      setRequiresTwoSides(selectedDocType.hasTwoSides || false);
    } else {
      // Fallback logic: assume all documents except passports (jdi-3) require two sides
      setRequiresTwoSides(documentTypeId !== "jdi-3");
    }
  }, [documentTypeId]);
  const onCaptureRecto = (image: string) => {
    console.log("Captured recto image:", image);
    setCapturedRectoImage(image);

    // If the document requires two sides, show the "turn document" screen
    if (requiresTwoSides) {
      setInternalStep(2); // Go to the "turn document" screen
    } else {
      setInternalStep(4); // Skip directly to confirmation for single-sided documents
    }
  };

  const onCaptureVerso = (image: string) => {
    console.log("Captured verso image:", image);
    setCapturedVersoImage(image);
    setInternalStep(4); // Go to confirmation after capturing the verso
  };

  const handleConfirm = () => {
    console.log("Images confirmed:", {
      recto: capturedRectoImage,
      verso: capturedVersoImage,
    });

    // Make sure the camera is properly stopped
    cameraService.stopCamera();

    // Here you can process the confirmed images, e.g., send them to a server

    // Move to the next step in the workflow
    stepObject.setStep(stepObject.step + 1);
  };

  const handleRetry = () => {
    // Make sure the camera is properly stopped
    cameraService.stopCamera();

    // Reset all captured images and return to the first photo instruction
    setCapturedRectoImage(null);
    setCapturedVersoImage(null);
    setInternalStep(0);
  };

  const handleRetryAfterProcessing = () => {
    // Make sure the camera is properly stopped
    cameraService.stopCamera();

    setCapturedRectoImage(null);
    setCapturedVersoImage(null);
    stepObject.setStep(1); // Return to the user input step
  };

  return (
    <>
      {/* Step 0: Instructions before the first photo (front) */}
      {internalStep === 0 && <BeforePhoto setStep={setInternalStep} />}

      {/* Step 1: Capture of the front photo */}
      {internalStep === 1 && <Photo onCapture={onCaptureRecto} />}

      {/* Step 2: Instructions before the second photo (back) */}
      {internalStep === 2 && <BeforeVersoPhoto setStep={setInternalStep} />}

      {/* Step 3: Capture of the back photo */}
      {internalStep === 3 && <Photo onCapture={onCaptureVerso} />}

      {/* Step 4: Photo confirmation */}
      {internalStep === 4 && (
        <PhotoConfirmation
          imageUrl={capturedRectoImage || ""}
          versoImageUrl={
            requiresTwoSides ? capturedVersoImage || "" : undefined
          }
          requiresTwoSides={requiresTwoSides}
          onConfirm={handleConfirm}
          onRetry={handleRetry}
          onRetryAfterProcessing={handleRetryAfterProcessing}
        />
      )}
    </>
  );
};

export default IDCheck;
