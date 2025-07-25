import { FR, VideoRecordDirections } from "@unissey-web/sdk-react";
import "../Video.css";
import Button from "../../ui/Button";
import Title from "../../ui/Title";
import Subtitle from "../../ui/Subtitle";
import PoweredBy from "../../ui/PoweredBy";

interface InstructionsSelfieProps {
  setStep: (step: number) => void;
  onBack?: () => void;
}

const InstructionsSelfie = ({ setStep, onBack }: InstructionsSelfieProps) => {
  const goOnNextStep = () => {
    setStep(1); // Move to the next step after showing instructions
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full bg-white">
      {/* Header */}
      <div className="p-4 text-center bg-white border-b border-gray-100">
        <Title className="text-xl md:text-2xl">Vérification par selfie</Title>
        <Subtitle className="text-xs text-gray-600 mt-2 md:text-sm">
          Nous avons besoin de confirmer votre identité
        </Subtitle>
      </div>

      {/* Main content area with illustrations and instructions */}
      <div className="flex-1 px-4 py-6 pt-8 md:px-8 md:py-8 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Custom instructions with icons */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#11E5C5] bg-opacity-20 flex items-center justify-center text-[#11E5C5] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  Maintenez votre visage droit et entièrement visible
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Assurez-vous que votre visage soit bien positionné face à la
                  caméra
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#11E5C5] bg-opacity-20 flex items-center justify-center text-[#11E5C5] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  Conservez une expression neutre
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Gardez une expression naturelle et neutre pendant la capture
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#11E5C5] bg-opacity-20 flex items-center justify-center text-[#11E5C5] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M22 12H2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  Assurez-vous d'être suffisamment éclairé
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Choisissez un endroit bien éclairé, évitez le contre-jour
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#11E5C5] bg-opacity-20 flex items-center justify-center text-[#11E5C5] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="2.18"
                    ry="2.18"
                  />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  Assurez-vous que votre caméra n'est pas ouverte dans un autre
                  onglet
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Fermez les autres applications utilisant votre caméra
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={goOnNextStep} className="w-full py-3 md:py-4">
              Je suis prêt(e)
            </Button>
            {onBack && (
              <button
                onClick={handleBack}
                className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
              >
                Retour
              </button>
            )}
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-end">
            {onBack && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline"
              >
                Retour
              </button>
            )}
            <Button onClick={goOnNextStep} className="px-6 py-3 md:py-4">
              Je suis prêt(e)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsSelfie;
