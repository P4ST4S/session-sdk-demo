import { useState, useEffect } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import BeforeVersoPhoto from "../id-check/BeforeVersoPhoto";
import Photo from "../id-check/Photo";
import PhotoConfirmation from "../id-check/PhotoConfirmation";
import { cameraService } from "../../services/cameraService";
import { useDocumentContext } from "../../context/DocumentContext";

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

  // Utiliser le contexte pour obtenir le document sélectionné
  const { selectedDocumentType } = useDocumentContext();

  // Monitor step changes to ensure the camera is stopped
  useEffect(() => {
    // Stop the camera during step transitions
    if (internalStep !== 1 && internalStep !== 3) {
      // Stop the camera if we're not at a photo capture step
      cameraService.stopCamera();
    }
  }, [internalStep]);

  // Determine if the document needs two sides based on the selected document type
  useEffect(() => {
    if (selectedDocumentType) {
      // Utiliser directement la propriété hasTwoSides du document sélectionné
      setRequiresTwoSides(!!selectedDocumentType.hasTwoSides);
      console.log(
        "Document context: using hasTwoSides from selectedDocumentType:",
        {
          id: selectedDocumentType.id,
          label: selectedDocumentType.label,
          hasTwoSides: selectedDocumentType.hasTwoSides,
        }
      );
    } else if (documentTypeId) {
      // Fallback si le contexte n'est pas disponible
      console.log(
        "Document context not available, using fallback with documentTypeId:",
        documentTypeId
      );
      setRequiresTwoSides(documentTypeId !== "jdi-3");
    } else {
      console.log(
        "No document information available in either context or props"
      );
    }
  }, [selectedDocumentType, documentTypeId]);
  const onCaptureRecto = (image: string) => {
    console.log("Captured recto image:", image);
    setCapturedRectoImage(image);
    console.log(
      "Requires two sides:",
      requiresTwoSides,
      "from document:",
      selectedDocumentType?.label
    );

    // Routing logic based on whether the document requires two sides
    if (requiresTwoSides) {
      // If two sides are required, go to the instruction screen for verso capture
      setInternalStep(2); // Go to the "turn document" screen
    } else {
      // For single-sided documents (like passports), skip verso capture
      setInternalStep(4); // Skip directly to confirmation
    }
  };

  const onCaptureVerso = (image: string) => {
    console.log("Captured verso image:", image);
    setCapturedVersoImage(image);
    setInternalStep(4); // Go to confirmation after capturing the verso
  };

  const handleConfirm = () => {
    // Prépare les images à envoyer en fonction du type de document
    const imagesToSend = {
      recto: capturedRectoImage,
      // N'inclut le verso que si le document a deux faces et que l'image a été capturée
      ...(requiresTwoSides && capturedVersoImage
        ? { verso: capturedVersoImage }
        : {}),
    };

    console.log("Images confirmed:", imagesToSend);

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

      {/* Step 2: Instructions before the second photo (back) - only shown if document has two sides */}
      {internalStep === 2 && requiresTwoSides && (
        <BeforeVersoPhoto setStep={setInternalStep} />
      )}

      {/* Step 3: Capture of the back photo - only shown if document has two sides */}
      {internalStep === 3 && requiresTwoSides && (
        <Photo onCapture={onCaptureVerso} />
      )}

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
