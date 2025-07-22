import { useState, useEffect } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import BeforeVersoPhoto from "../id-check/BeforeVersoPhoto";
import Photo from "../id-check/Photo";
import PhotoConfirmation from "../id-check/PhotoConfirmation";
import { cameraService } from "../../services/cameraService";
import { useDocumentContext } from "../../context/DocumentContext";
import { documentTypesFromCountryId } from "../../utils/jdiCountry";
import JDIDocumentSelection from "../jdi/JDIDocumentSelection";
import type { onUploadFiles } from "../../types/uploadFiles";

interface IDCheckProps {
  stepObject: stepObject;
  documentTypeId?: string | null;
  sessionId?: string;
}

const IDCheck = ({
  stepObject,
  documentTypeId = "jdi-2",
  sessionId,
}: IDCheckProps) => {
  const [internalStep, setInternalStep] = useState(-1); // Commencer à -1 pour l'étape de sélection de document
  const [capturedRectoImage, setCapturedRectoImage] = useState<string | null>(
    null
  );
  const [capturedVersoImage, setCapturedVersoImage] = useState<string | null>(
    null
  );
  // Nouveau state pour stocker les fichiers comme dans JDICheck
  const [filesUploaded, setFilesUploaded] = useState<onUploadFiles>({
    front: null,
    back: null,
  });
  const [requiresTwoSides, setRequiresTwoSides] = useState(false);

  // Use the context to get the selected document and the setter
  const { selectedDocumentType, setSelectedDocumentType } =
    useDocumentContext();

  // Monitor step changes to ensure the camera is stopped
  useEffect(() => {
    // Stop the camera during step transitions
    if (internalStep !== 1 && internalStep !== 3) {
      // Stop the camera if we're not at a photo capture step
      cameraService.stopCamera();
    }
  }, [internalStep]);

  // Check if document is already selected in context, if so skip selection step
  useEffect(() => {
    if (selectedDocumentType && internalStep === -1) {
      // Si un document est déjà sélectionné dans le contexte, passer à l'étape suivante
      setInternalStep(0);
    }
  }, [selectedDocumentType, internalStep]);

  // Determine if the document needs two sides based on the selected document type
  useEffect(() => {
    if (selectedDocumentType) {
      // Directly use the hasTwoSides property from the selected document
      setRequiresTwoSides(!!selectedDocumentType.hasTwoSides);
    } else if (documentTypeId) {
      // Fallback if context is not available

      setRequiresTwoSides(documentTypeId !== "jdi-3");
    } else {
      console.log(
        "No document information available in either context or props"
      );
    }
  }, [selectedDocumentType, documentTypeId]);

  // Fonction pour gérer la sélection du document
  const handleDocumentSelect = (documentId: string) => {
    // Vérifier si c'est un type de document spécial (JDD ou income-proof)
    if (documentTypeId === "jdd" || documentTypeId === "income-proof") {
      // Pour les documents spéciaux, créer un document personnalisé
      const customDoc = {
        id: documentTypeId,
        label: documentId, // Utiliser l'option sélectionnée comme label
        hasTwoSides: false, // Par défaut, ces documents n'ont pas besoin de verso
      };

      setSelectedDocumentType(customDoc);
      setInternalStep(0);
      return;
    }

    // Traitement standard pour les documents d'identité
    const countryId = "fr"; // Par défaut la France - pourrait être dynamique
    const documents = documentTypesFromCountryId(countryId);

    // Mapper l'ID du document du JDIDocumentSelection aux IDs dans frenchDocumentTypes
    let mappedId = "";
    if (documentId === "national_id")
      mappedId = "jdi-2"; // Carte d'identité - Format carte
    else if (documentId === "passport")
      mappedId = "jdi-3"; // Passeport biométrique
    else if (documentId === "driving_license") mappedId = "jdi-5"; // Permis de conduire - Format carte

    const selectedDoc = documents.find((doc) => doc.id === mappedId);

    if (selectedDoc) {
      // Mettre à jour le contexte avec le document sélectionné
      setSelectedDocumentType(selectedDoc);
      // Passer à l'étape suivante
      setInternalStep(0);
    } else {
      console.error(
        "Document non trouvé pour l'ID:",
        mappedId,
        "depuis documentId:",
        documentId
      );
    }
  };

  const onCaptureRecto = (image: string) => {
    setCapturedRectoImage(image);
    setFilesUploaded((prev) => ({ ...prev, front: image }));
    if (requiresTwoSides) {
      setInternalStep(2);
    } else {
      setInternalStep(4);
    }
  };

  const onCaptureVerso = (image: string) => {
    setCapturedVersoImage(image);
    setFilesUploaded((prev) => ({ ...prev, back: image }));
    setInternalStep(4);
  };

  const handleConfirm = () => {
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

  // Gérer le retour en arrière
  const handleBack = () => {
    // Si on est à l'étape de sélection du document, revenir à l'étape précédente du flux principal
    if (internalStep === -1) {
      stepObject.setStep(stepObject.step - 1);
    } else {
      // Sinon, revenir à l'étape précédente du flux interne
      setInternalStep(Math.max(-1, internalStep - 1));
    }
  };

  return (
    <>
      {/* Step -1: Document type selection */}
      {internalStep === -1 && (
        <JDIDocumentSelection
          onDocumentSelect={handleDocumentSelect}
          onBack={handleBack}
          documentTypeId={documentTypeId as string}
          sessionId={sessionId}
        />
      )}

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
          fileUploaded={filesUploaded}
        />
      )}
    </>
  );
};

export default IDCheck;
