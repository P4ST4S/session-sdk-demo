import React, { useState, useEffect } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import type { ProcessingStep } from "../../types/session";
import { DEFAULT_PROCESSING_STEPS } from "../../utils/stepsAnalysis";

interface PhotoProcessingLoaderProps {
  onProcessingComplete: () => void;
  onRetry?: () => void;
  steps?: ProcessingStep[];
}

const PhotoProcessingLoader: React.FC<PhotoProcessingLoaderProps> = ({
  onProcessingComplete,
  onRetry,
  steps = DEFAULT_PROCESSING_STEPS,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  // Verify if no steps have hasError after analysis
  const hasErrorInSteps = steps.some((step) => step.hasError);

  useEffect(() => {
    const totalSteps = steps.length;

    // If we've completed all steps, call onProcessingComplete
    if (currentStep >= totalSteps) {
      setIsProcessing(false);
      if (!hasErrorInSteps) {
        onProcessingComplete();
      }
      return;
    }

    // Move to next step after 1.5 seconds
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentStep, onProcessingComplete]);

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Analyse du document
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              Veuillez patienter pendant le traitement de votre document
            </Subtitle>
          </div>

          {/* Processing steps with status indicators */}
          <div className="w-full flex justify-center">
            <div className="space-y-5">
              {steps.map((step, index: number) => (
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

      {/* Footer with buttons */}
      {!isProcessing && (
        <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
          <div className="w-full max-w-md mx-auto space-y-3">
            {hasErrorInSteps && (
              <button className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2">
                Poursuivre tout de même
              </button>
            )}
            <Button
              onClick={hasErrorInSteps ? onRetry : onProcessingComplete}
              className="w-full py-3 md:py-4"
            >
              {hasErrorInSteps ? "Soumettre à nouveau" : "Continuer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoProcessingLoader;
