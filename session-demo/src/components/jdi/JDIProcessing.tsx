import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import type { onUploadFiles } from "../../types/uploadFiles";
import type { ProcessingStep } from "../../types/session";
import { analyzeFiles } from "../../services/analysis";

interface JDIProcessingProps {
  onProcessingComplete: (success: boolean, retryCount?: number, analysisData?: unknown) => void;
  documentType: string;
  fileUploaded: onUploadFiles | null;
  documentTypeId: string;
  retryCount?: number;
}

// Étapes de traitement pour l'analyse JDI
const JDI_PROCESSING_STEPS: ProcessingStep[] = [
  {
    title: "Réception du document",
    subtitle: "Téléchargement et vérification du format",
    hasError: false,
  },
  {
    title: "Analyse de la qualité",
    subtitle: "Contrôle de la netteté et de l'éclairage",
    hasError: false,
  },
  {
    title: "Extraction des données",
    subtitle: "Lecture des informations du document",
    hasError: false,
  },
  {
    title: "Vérification finale",
    subtitle: "Validation des données extraites",
    hasError: false,
  },
];

const JDIProcessing = memo(
  ({
    onProcessingComplete,
    documentType,
    fileUploaded,
    documentTypeId,
    retryCount = 0,
  }: JDIProcessingProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [processingSteps, setProcessingSteps] =
      useState(JDI_PROCESSING_STEPS);
    const [isComplete, setIsComplete] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{
      success: boolean;
      code?: string;
      data?: unknown;
    } | null>(null);

    const processingStartedRef = useRef(false);
    const processedFilesRef = useRef<string | null>(null);

    // Créer une clé stable pour les fichiers uploadés
    const filesKey = useMemo(() => {
      if (!fileUploaded) return null;
      return `${fileUploaded.front?.substring(0, 50) || "no-front"}-${
        fileUploaded.back?.substring(0, 50) || "no-back"
      }`;
    }, [fileUploaded]);

    // Callback stable pour onProcessingComplete
    const stableOnProcessingComplete = useCallback(
      (success: boolean, retryCount?: number, analysisData?: unknown) => {
        onProcessingComplete(success, retryCount, analysisData);
      },
      [onProcessingComplete]
    );

    useEffect(() => {
      // Empêcher les appels multiples
      if (
        !fileUploaded ||
        !filesKey ||
        isProcessing ||
        processingStartedRef.current
      ) {
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        stableOnProcessingComplete(false);
        return;
      }

      // Vérifier si on a déjà traité ces mêmes fichiers
      if (processedFilesRef.current === filesKey) {
        return;
      }

      const processFiles = async () => {
        try {
          // Marquer le début du traitement
          setIsProcessing(true);
          processingStartedRef.current = true;
          processedFilesRef.current = filesKey;

          // Animation des étapes avec appel API réel à la fin
          for (let i = 0; i < processingSteps.length; i++) {
            setCurrentStep(i);

            if (i < processingSteps.length - 1) {
              // Délai entre les étapes (sauf la dernière)
              await new Promise((resolve) => setTimeout(resolve, 800));
            } else {
              // Dernière étape : appel API réel
              const response = await analyzeFiles(
                sessionId,
                fileUploaded,
                documentTypeId,
                null,
                false, // save = false - don't save to session yet
                false, // incrementAnalysis = false - don't auto-progress session
                false
              );

              // Extract conformity code
              const extractedCode =
                response?.data?.analysisResult?.job_status?.predictions?.[0]
                  ?.code || "2.0";

              // Determine success based on code
              const isSuccess = extractedCode === "1.0";

              setAnalysisResult({ 
                success: isSuccess, 
                code: extractedCode, 
                data: response 
              });

              // Marquer l'étape courante selon le résultat
              setProcessingSteps((prev) =>
                prev.map((step, index) =>
                  index === i ? { ...step, hasError: !isSuccess } : step
                )
              );

              // Petit délai pour voir le résultat
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }

          setCurrentStep(processingSteps.length);
          setIsComplete(true);
        } catch {
          // Marquer l'étape courante comme erreur
          setProcessingSteps((prev) =>
            prev.map((step, index) =>
              index === currentStep ? { ...step, hasError: true } : step
            )
          );

          setAnalysisResult({ success: false, data: null });
          setIsComplete(true);
        } finally {
          setIsProcessing(false);
        }
      };

      processFiles();
    }, [
      fileUploaded,
      filesKey,
      documentTypeId,
      isProcessing,
      stableOnProcessingComplete,
      processingSteps.length,
      currentStep,
    ]);

      // Auto-complete when analysis is done
  useEffect(() => {
    if (isComplete && analysisResult) {
      setTimeout(() => {
        // Passer le résultat, le retryCount actuel et les données de l'analyse
        stableOnProcessingComplete(analysisResult.success, retryCount, analysisResult.data);
      }, 1000);
    }
  }, [isComplete, analysisResult, stableOnProcessingComplete, retryCount]);

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
        {/* Main content area */}
        <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <Title className="text-xl md:text-2xl lg:text-3xl">
                Analyse en cours
              </Title>
              <Subtitle className="text-sm text-gray-600 leading-relaxed">
                Nous analysons votre {getDocumentLabel(documentType)}. Cela peut
                prendre quelques instants.
              </Subtitle>
            </div>

            {/* Processing steps with status indicators */}
            <div className="w-full flex justify-center">
              <div className="space-y-5">
                {processingSteps.map((step, index: number) => (
                  <div key={index} className="flex items-start">
                    {/* Status indicator */}
                    <div className="mr-4 mt-1 flex-shrink-0">
                      {index < currentStep ? (
                        step.hasError ? (
                          // Error indicator - Red X
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                            ✕
                          </div>
                        ) : (
                          // Success indicator - Green checkmark
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#11E5C5] text-white text-xs">
                            ✓
                          </div>
                        )
                      ) : index === currentStep ? (
                        // Loading spinner only for the current step
                        <div className="w-6 h-6 rounded-full border-2 border-t-[#11E5C5] border-r-[#11E5C5] border-b-[#11E5C5] border-l-transparent animate-spin"></div>
                      ) : (
                        // Empty circle for future steps
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>

                    {/* Step content */}
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
          </div>
        </div>
      </div>
    );
  }
);

JDIProcessing.displayName = "JDIProcessing";

export default JDIProcessing;
