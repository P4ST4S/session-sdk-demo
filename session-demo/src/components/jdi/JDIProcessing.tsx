import { useState, useEffect } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";

interface JDIProcessingProps {
  onProcessingComplete: (success: boolean) => void;
  documentType: string;
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
}: JDIProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(timer);
          // Simulate random success/failure for demo
          const success = Math.random() > 0.3; // 70% success rate
          setTimeout(() => onProcessingComplete(success), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [onProcessingComplete]);

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

          {/* Processing steps */}
          <div className="w-full">
            <div className="space-y-5">
              {processingSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  {/* Status indicator */}
                  <div className="mr-4 mt-1 flex-shrink-0">
                    {index < currentStep ? (
                      // Completed step - Green checkmark
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#11E5C5] text-white text-xs">
                        ✓
                      </div>
                    ) : index === currentStep ? (
                      // Current step - Loading spinner
                      <div className="w-6 h-6 rounded-full border-2 border-t-[#11E5C5] border-r-[#11E5C5] border-b-[#11E5C5] border-l-transparent animate-spin"></div>
                    ) : (
                      // Future step - Empty circle
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

          {/* Progress bar */}
          <div className="w-full">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#11E5C5] h-2 rounded-full transition-all duration-500 ease-out"
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
