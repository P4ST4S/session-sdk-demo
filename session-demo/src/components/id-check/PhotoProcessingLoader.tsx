import React, { useState, useEffect } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";

interface PhotoProcessingLoaderProps {
  onProcessingComplete: () => void;
}

const PROCESSING_STEPS = [
  {
    title: "Analyse du document",
    subtitle: "Vérification de la validité du document",
  },
  {
    title: "Extraction des données",
    subtitle: "Extraction des informations du document",
  },
  {
    title: "Vérification de l'identité",
    subtitle: "Comparaison avec les données fournies",
  },
  {
    title: "Finalisation",
    subtitle: "Préparation des résultats",
  },
];

const PhotoProcessingLoader: React.FC<PhotoProcessingLoaderProps> = ({
  onProcessingComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const totalSteps = PROCESSING_STEPS.length;

    // If we've completed all steps, call onProcessingComplete
    if (currentStep >= totalSteps) {
      setIsProcessing(false);
      onProcessingComplete();
      return;
    }

    // Move to next step after 1 second
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentStep, onProcessingComplete]);

  return (
    <div className="space-y-4 pt-8 relative flex flex-col items-center w-full h-full px-4 pb-[80px]">
      <div className="flex flex-col gap-5 mt-4 max-w-[400px] mx-auto">
        <Title>Analyse du document</Title>
        <Subtitle>
          Veuillez patienter pendant le traitement de votre document
        </Subtitle>
      </div>

      <div className="flex flex-col items-start gap-6 w-full max-w-[400px] mx-auto mt-8">
        {/* Processing steps with status indicators */}
        <div className="w-full space-y-5 min-h-[250px]">
          {PROCESSING_STEPS.slice(0, currentStep + 1).map((step, index) => (
            <div key={index} className="flex items-start">
              {/* Status indicator */}
              <div className="mr-4 mt-1">
                {index < currentStep ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#11E5C5] text-white">
                    <span>✓</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-t-[#11E5C5] border-r-[#11E5C5] border-b-[#11E5C5] border-l-transparent animate-spin"></div>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1">
                <p className="font-medium text-[#3C3C40]">{step.title}</p>
                <p className="text-sm text-gray-500">{step.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          {!isProcessing && <Button className="w-full">Continuer</Button>}
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default PhotoProcessingLoader;
