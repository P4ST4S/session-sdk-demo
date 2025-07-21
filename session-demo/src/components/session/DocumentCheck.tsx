import { useState, useEffect } from "react";
import type { stepObject } from "../../types/session";
import JDIIntroduction from "../jdi/JDIIntroduction";
import JDIDocumentSelection from "../jdi/JDIDocumentSelection";
import JDIDocumentUpload from "../jdi/JDIDocumentUpload";
import JDIProcessing from "../jdi/JDIProcessing";
import JDISuccess from "../jdi/JDISuccess";
import JDIError from "../jdi/JDIError";
import { retrieveDocumentOptions } from "../../services/sessionService";
import type { onUploadFiles } from "../../types/uploadFiles";

interface DocumentCheckProps {
  stepObject: stepObject;
  sessionId: string;
  onContinueOnPC?: () => void;
  documentTypeId?: string; // ID du type de document (id-card, jdd, income-proof, etc.)
}

/**
 * Composant générique pour la vérification de document
 * Ce composant remplace JDICheck en rendant le contenu dynamique en fonction du type de document
 */
const DocumentCheck = ({
  stepObject,
  sessionId,
  onContinueOnPC,
  documentTypeId,
}: DocumentCheckProps) => {
  const [docStep, setDocStep] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | null
  >(null);
  const [fileUploaded, setFileUploaded] = useState<onUploadFiles | null>(null);

  // Initialize docStep
  useEffect(() => {
    // If documentTypeId is missing, show error in console
    if (!documentTypeId) {
      console.error("DocumentCheck: Missing documentTypeId");
    }

    // Reset docStep when document type changes
    setDocStep(0);
  }, [documentTypeId, sessionId]);

  // Debug logs for document check
  useEffect(() => {
    // Vérifier si nous avons des options disponibles pour ce type de document
    if (sessionId && documentTypeId) {
      const options = retrieveDocumentOptions(sessionId, documentTypeId);

      if (!options || options.length === 0) {
        console.warn(
          `DocumentCheck: Aucune option trouvée pour le type de document ${documentTypeId}`
        );
      }
    } else {
      console.warn("DocumentCheck: sessionId ou documentTypeId manquant", {
        sessionId,
        documentTypeId,
      });
    }
  }, [
    stepObject.step,
    sessionId,
    documentTypeId,
    docStep,
    selectedDocumentType,
  ]);

  const handleDocumentTypeSelect = (documentType: string) => {
    setSelectedDocumentType(documentType);
    setDocStep(2); // Go to document upload step
  };

  const handleDocumentUpload = (files: onUploadFiles) => {
    // Start processing
    setFileUploaded(files);
    setDocStep(3);
  };

  const handleProcessingComplete = (success: boolean) => {
    if (success) {
      setDocStep(4); // Go to success screen
    } else {
      setDocStep(5); // Go to error screen
    }
  };

  const handleRetryFromError = () => {
    setDocStep(2); // Go back to document upload
  };

  const handleContactSupport = () => {
    // Here you would typically open a support chat or redirect to support page
    alert("Fonctionnalité de support à implémenter");
  };

  const handleSuccessContinue = () => {
    // Continue to next step in the main flow
    if (onContinueOnPC) {
      onContinueOnPC();
    } else {
      stepObject.setStep(stepObject.step + 1);
    }
  };

  const handleBack = () => {
    // Si on est à la première étape interne
    if (docStep === 0) {
      // Revenir à l'étape précédente du flux principal
      stepObject.setStep(stepObject.step - 1);
    } else {
      // Sinon, revenir à l'étape précédente du flux interne
      setDocStep(docStep - 1);
    }
  };

  switch (docStep) {
    case 0:
      // If documentTypeId is missing, show error screen
      if (!documentTypeId) {
        console.error("DocumentCheck: Missing documentTypeId in step 0");
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Erreur de configuration
            </h2>
            <p className="text-gray-600 mb-4">Type de document non spécifié.</p>
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={() => stepObject.setStep(3)} // Go back to OTP
            >
              Retour
            </button>
          </div>
        );
      }

      return (
        <JDIIntroduction
          sessionId={sessionId}
          documentTypeId={documentTypeId}
          onContinue={() => setDocStep(1)}
          onBack={handleBack}
        />
      );
    case 1:
      return (
        <JDIDocumentSelection
          onDocumentSelect={handleDocumentTypeSelect}
          onBack={handleBack}
          documentTypeId={documentTypeId}
          sessionId={sessionId}
        />
      );
    case 2:
      if (!selectedDocumentType) {
        console.error(
          "DocumentCheck: selectedDocumentType is null for JDIDocumentUpload!"
        );
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Erreur de sélection
            </h2>
            <p className="text-gray-600 mb-4">
              Aucun type de document sélectionné. Veuillez revenir à l'étape
              précédente.
            </p>
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={() => setDocStep(1)}
            >
              Retour à la sélection
            </button>
          </div>
        );
      }

      return (
        <JDIDocumentUpload
          documentType={selectedDocumentType}
          documentTypeId={documentTypeId}
          onUpload={handleDocumentUpload}
          onBack={handleBack}
        />
      );
    case 3:
      return (
        <JDIProcessing
          documentType={selectedDocumentType!}
          onProcessingComplete={handleProcessingComplete}
          fileUploaded={fileUploaded}
        />
      );
    case 4:
      return (
        <JDISuccess
          documentType={selectedDocumentType!}
          onContinue={handleSuccessContinue}
        />
      );
    case 5:
      return (
        <JDIError
          documentType={selectedDocumentType!}
          onRetry={handleRetryFromError}
          onContactSupport={handleContactSupport}
        />
      );
    default:
      console.error(`Invalid docStep: ${docStep}`);
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Erreur de navigation
          </h2>
          <p className="text-gray-600 mb-4">
            Étape non valide. Veuillez recommencer.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            onClick={() => setDocStep(0)}
          >
            Retour au début
          </button>
        </div>
      );
  }
};

export default DocumentCheck;
