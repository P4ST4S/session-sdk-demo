import { useState, useEffect } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import type { onUploadFiles } from "../../types/uploadFiles";
import { analyzeFiles } from "../../services/analysis";

interface JDIProcessingProps {
  onProcessingComplete: (success: boolean) => void;
  documentType: string;
  fileUploaded: onUploadFiles | null;
}

const processingSteps = [
  {
    title: "Analyse des documents",
    subtitle: "Vérification de la qualité des images",
  },
  {
    title: "Validation des informations",
    subtitle: "Lecture des données du document",
  },
  { title: "Vérification de sécurité", subtitle: "Contrôle d'authenticité" },
  { title: "Finalisation", subtitle: "Traitement en cours..." },
];

const JDIProcessing = ({
  onProcessingComplete,
  documentType,
  fileUploaded,
}: JDIProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const processFiles = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        setHasError(true);
        onProcessingComplete(false);
        setIsDone(true);
        return;
      }

      if (fileUploaded) {
        try {
          await analyzeFiles(
            sessionId,
            fileUploaded,
            documentType,
            null,
            true,
            true,
            false
          );
          if (isMounted) setIsDone(true);
          onProcessingComplete(true);
        } catch (error) {
          if (isMounted) setHasError(true);
          if (isMounted) setIsDone(true);
          onProcessingComplete(false);
        }
      }
    };

    processFiles();
    return () => {
      isMounted = false;
    };
  }, [onProcessingComplete, documentType, fileUploaded]);

  useEffect(() => {
    if (hasError || isDone) return; // Stop animation if error or done
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev; // Stop at the last step
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [onProcessingComplete, hasError, isDone]);

  const getDocumentLabel = (documentType: string) => {
    switch (documentType) {
      case "national_id":
        return "carte nationale d'identité";
      case "passport":
        return "passeport";
      case "driving_license":
        return "permis de conduire";
      default:
        return "document";
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              {hasError ? "Échec de l'analyse" : "Analyse en cours"}
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              {hasError
                ? "Une erreur est survenue lors de l'analyse du document. Veuillez réessayer."
                : `Nous analysons votre ${getDocumentLabel(
                    documentType
                  )}. Cela peut prendre quelques instants.`}
            </Subtitle>
          </div>

          <div className="w-full">
            <div className="space-y-5">
              {processingSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    {hasError && index === currentStep ? (
                      // Step en erreur - croix rouge
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                        ×
                      </div>
                    ) : index < currentStep ? (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#11E5C5] text-white text-xs">
                        ✓
                      </div>
                    ) : index === currentStep ? (
                      <div className="w-6 h-6 rounded-full border-2 border-t-[#11E5C5] border-r-[#11E5C5] border-b-[#11E5C5] border-l-transparent animate-spin"></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#3C3C40] text-sm">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className={
                  hasError
                    ? "bg-red-500 h-2 rounded-full transition-all duration-500 ease-out"
                    : "bg-[#11E5C5] h-2 rounded-full transition-all duration-500 ease-out"
                }
                style={{
                  width: `${
                    ((currentStep + 1) / processingSteps.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Étape {currentStep + 1} sur {processingSteps.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIProcessing;
