import { useState, useEffect, useRef } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import type { onUploadFiles } from "../../types/uploadFiles";
import { analyzeFiles } from "../../services/analysis";
import { codeToStep } from "../../services/utils";

interface JDIProcessingProps {
  onProcessingComplete: (success: boolean) => void;
  documentType: string;
  fileUploaded: onUploadFiles | null;
  documentTypeId: string;
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
  documentTypeId,
}: JDIProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [conformityCode, setConformityCode] = useState<string | null>(null);

  const analysisStartedRef = useRef(false);
  useEffect(() => {
    // Prevent multiple analysis runs
    if (analysisStartedRef.current) return;
    if (!fileUploaded) return;

    analysisStartedRef.current = true;
    const processFiles = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        setHasError(true);
        onProcessingComplete(false);
        setIsDone(true);
        return;
      }
      try {
        const response: any = await analyzeFiles(
          sessionId,
          fileUploaded,
          documentTypeId,
          null,
          false, // finish the session if true
          true,
          false
        );
        console.log("Analysis response:", response);
        setConformityCode(
          response?.data?.analysisResult?.job_status?.predictions?.[0]?.code ||
            null
        );

        setIsDone(true);
      } catch (error) {
        setHasError(true);
        setIsDone(true);
      }
    };
    processFiles();
  }, [onProcessingComplete, documentType, fileUploaded]);

  useEffect(() => {
    // While analysis is not finished, stay at step 0
    if (!isDone && !hasError) {
      setCurrentStep(0);
      return;
    }
    // We want stepToStop to be the step in error (the one corresponding to conformityCode)
    let stepToStop = codeToStep(conformityCode || "4");
    // If codeToStep returns 0 (generic error), stop at the first step
    if (stepToStop === 0) stepToStop = 1;
    console.log("Step to stop (error):", stepToStop);

    // When analysis is finished (success or error), start the animation
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < stepToStop - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (stepToStop < 4) setHasError(true);
          return prev; // Stop at the step in error
        }
      });
    }, 500); // Adjust the speed of the animation
    return () => clearInterval(interval);
  }, [onProcessingComplete, hasError, isDone, conformityCode]);

  // Get the label for the document type
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
                      // Step in error - red cross
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                        ×
                      </div>
                    ) : index < currentStep ? (
                      // Completed step - green check
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#11E5C5] text-white text-xs">
                        ✓
                      </div>
                    ) : index === currentStep ? (
                      // Current step - spinner
                      <div className="w-6 h-6 rounded-full border-2 border-t-[#11E5C5] border-r-[#11E5C5] border-b-[#11E5C5] border-l-transparent animate-spin"></div>
                    ) : (
                      // Upcoming step - gray circle
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
              Step {currentStep + 1} of {processingSteps.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIProcessing;
