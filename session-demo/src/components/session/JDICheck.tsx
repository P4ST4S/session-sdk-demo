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
  documentTypeId?: string;
}

const JDICheck = ({
  stepObject,
  sessionId,
  onContinueOnPC,
  documentTypeId,
}: JDICheckProps) => {
  const [JDIStep, setJDIStep] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState<onUploadFiles | null>(null);

  const handleDocumentSelect = (documentType: string) => {
    setSelectedDocumentType(documentType);
    setJDIStep(2);
  };

  const handleDocumentUpload = (files: onUploadFiles) => {
    setFileUploaded(files);
    setJDIStep(3);
  };

  const handleProcessingComplete = (success: boolean) => {
    if (success) {
      setJDIStep(4);
    } else {
      setJDIStep(5);
    }
  };

  const handleRetryFromError = () => {
    setJDIStep(2);
  };

  const handleBackToUserInput = () => {
    // Retour à l'étape 2 qui correspond à UserInputForm (étape d'informations d'identité)
    stepObject.setStep(2);
  };

  const handleSuccessContinue = () => {
    if (onContinueOnPC) {
      onContinueOnPC();
    } else {
      stepObject.setStep(stepObject.step + 1);
    }
  };

  const handleBack = () => {
    if (JDIStep === 0) {
      stepObject.setStep(stepObject.step - 1);
    } else {
      setJDIStep(JDIStep - 1);
    }
  };

  const onRetake = () => {
    setJDIStep(2);
  };

  switch (JDIStep) {
    case 0:
      return (
        <JDIIntroduction
          onContinue={() => setJDIStep(1)}
          onBack={handleBack}
        />
      );
    case 1:
      return (
        <JDIDocumentSelection
          onDocumentSelect={handleDocumentSelect}
          onBack={handleBack}
          documentTypeId={documentTypeId}
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
          onContinueAnyway={handleSuccessContinue}
          onBackToUserInput={handleBackToUserInput}
        />
      );
    default:
      return null;
  }
};

export default JDICheck;
