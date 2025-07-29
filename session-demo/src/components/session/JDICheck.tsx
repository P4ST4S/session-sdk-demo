import { useState } from "react";
import type { stepObject } from "../../types/session";
import type { onUploadFiles } from "../../types/uploadFiles";
import JDIIntroduction from "../jdi/JDIIntroduction";
import JDIDocumentSelection from "../jdi/JDIDocumentSelection";
import JDIDocumentUpload from "../jdi/JDIDocumentUpload";
import JDIProcessing from "../jdi/JDIProcessing";
import JDISuccess from "../jdi/JDISuccess";
import JDIError from "../jdi/JDIError";

interface JDICheckProps {
  stepObject: stepObject;
  sessionId: string;
  onContinueOnPC?: () => void;
  documentTypeId?: string; // ID du type de document (jdd, income-proof, etc.)
}

const JDICheck = ({
  stepObject,
  sessionId,
  onContinueOnPC,
  documentTypeId,
}: JDICheckProps) => {
  const [JDIStep, setJDIStep] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | null
  >(null);
  const [fileUploaded, setFileUploaded] = useState<onUploadFiles | null>(null);

  const handleDocumentTypeSelect = (documentType: string) => {
    setSelectedDocumentType(documentType);
    setJDIStep(2); // Go to document upload step
  };

  const handleDocumentUpload = (files: onUploadFiles) => {
    setFileUploaded(files);
    // Start processing
    setJDIStep(3);
  };

  const handleProcessingComplete = (success: boolean) => {
    if (success) {
      setJDIStep(4); // Go to success screen
    } else {
      setJDIStep(5); // Go to error screen
    }
  };

  const handleRetryFromError = () => {
    setJDIStep(2); // Go back to document upload
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
    if (JDIStep === 0) {
      // Revenir à l'étape précédente du flux principal
      stepObject.setStep(stepObject.step - 1);
    } else {
      // Sinon, revenir à l'étape précédente du flux interne
      setJDIStep(JDIStep - 1);
    }
  };

  const onRetake = () => {
    setFileUploaded(null);
    setJDIStep(2); // Revenir à l'étape de téléchargement du document
  };

  switch (JDIStep) {
    case 0:
      return (
        <JDIIntroduction
          onContinue={() => setJDIStep(1)}
          onBack={handleBack}
          documentTypeId={documentTypeId}
          sessionId={sessionId}
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
      return (
        <JDIDocumentUpload
          documentType={selectedDocumentType!}
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
          onRetake={onRetake}
          documentTypeId="jdd"
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
      return null;
  }
};

export default JDICheck;
