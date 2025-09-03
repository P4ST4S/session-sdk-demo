import { useState, useEffect, useRef } from "react";
import Title from "../../ui/Title";
import Subtitle from "../../ui/Subtitle";
import { codeToStep } from "../../../services/utils";
import type { SelfieCaptureData } from "../../../types/selfie";
import { analyzeSelfie } from "../../../services/analysis";

interface SelfieProcessingProps {
  onProcessingComplete: (success: boolean) => void;
  selfieFile: SelfieCaptureData | null;
  onRetake: () => void;
}

const processingSteps = [
  {
    title: "Analyse du selfie",
    subtitle: "Vérification de la qualité de la vidéo",
  },
  {
    title: "Détection du visage",
    subtitle: "Reconnaissance et validation faciale",
  },
  { title: "Vérification de sécurité", subtitle: "Contrôle de vivacité" },
  { title: "Finalisation", subtitle: "Traitement en cours..." },
];
const SelfieProcessing = ({
  onProcessingComplete,
  selfieFile,
  onRetake,
}: SelfieProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [conformityCode, setConformityCode] = useState<string | null>(null);

  const analysisStartedRef = useRef(false);
  useEffect(() => {
    // Prevent multiple analysis runs
    if (analysisStartedRef.current) return;
    if (!selfieFile) return;

    analysisStartedRef.current = true;
    
    // Timeout simple : 60 secondes pour tous
    const timeoutId = setTimeout(() => {
      if (!isDone) {
        console.error("⏰ Selfie analysis timeout after 60 seconds");
        setHasError(true);
        setIsDone(true);
        onProcessingComplete(false);
      }
    }, 60000);
    
    const processFiles = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        console.error("❌ No session ID found");
        setHasError(true);
        onProcessingComplete(false);
        setIsDone(true);
        clearTimeout(timeoutId);
        return;
      }
      
      console.log("🚀 Starting selfie analysis...");
      
      try {
        // Délai minimum simple : 2 secondes
        const [response] = await Promise.all([
          analyzeSelfie(sessionId, selfieFile),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        
        console.log("✅ Analysis response:", response);
        clearTimeout(timeoutId);

        // Handle Unissey response format
        let isSuccess = false;
        let conformityCodeToSet = "4"; // Default to error

        if (response && response.data) {
          // Check if analysis was successful based on Unissey response structure
          const data = response.data;

          if (data.is_genuine && data.is_match) {
            // Success: both face detection and comparison successful
            isSuccess = true;
            conformityCodeToSet = "1.0"; // Success code
          } else if (data.details) {
            // Check specific failure reasons
            const details = data.details;

            if (details.liveness?.result !== "success") {
              conformityCodeToSet = "3.0"; // Liveness failed
            } else if (details.face_comparison?.result !== "success") {
              conformityCodeToSet = "2.0"; // Face comparison failed
            } else {
              conformityCodeToSet = "4.0"; // Generic error
            }
          }
        }

        console.log("📊 Selfie analysis result:", {
          isSuccess,
          conformityCode: conformityCodeToSet,
          isGenuine: response?.data?.is_genuine,
          isMatch: response?.data?.is_match,
        });

        setConformityCode(conformityCodeToSet);
        setIsDone(true);

        // Only call onProcessingComplete with success if everything passed
        if (isSuccess) {
          onProcessingComplete(true);
        }
      } catch (error) {
        console.error("💥 Selfie analysis failed:", error);
        clearTimeout(timeoutId);
        setHasError(true);
        setIsDone(true);
        onProcessingComplete(false);
      }
    };
    
    processFiles();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onProcessingComplete, selfieFile, isDone]);

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
          onProcessingComplete(stepToStop === 4);
          return prev; // Stop at the step in error
        }
      });
    }, 500); // Adjust the speed of the animation
    return () => clearInterval(interval);
  }, [onProcessingComplete, hasError, isDone, conformityCode]);

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
                ? "Une erreur est survenue lors de l'analyse du selfie. Veuillez réessayer."
                : `Nous analysons votre selfie. Cela peut prendre quelques instants.`}
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

          {/* Footer with buttons */}
          {hasError && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6">
              <div className="w-full max-w-md mx-auto">
                {/* Mobile layout - stacked buttons */}
                <div className="flex flex-col space-y-3 md:hidden">
                  <button
                    onClick={onRetake}
                    className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
                  >
                    Reprendre le selfie
                  </button>
                </div>

                {/* Desktop layout - horizontal buttons */}
                <div className="hidden md:flex gap-3 justify-between items-center">
                  <button
                    onClick={onRetake}
                    className="px-6 py-3 text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline border border-gray-300 rounded-lg"
                  >
                    Reprendre le selfie
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfieProcessing;
