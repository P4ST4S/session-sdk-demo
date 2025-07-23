import Title from "../../ui/Title";
import Subtitle from "../../ui/Subtitle";
import Button from "../../ui/Button";
import ButtonDesktop from "../../ui/ButtonDesktop";
import { SelfieIcon } from "../../../assets";

interface SelfiePreIntroductionProps {
  onContinue: () => void;
  onBack?: () => void;
}

const SelfiePreIntroduction = ({ onContinue }: SelfiePreIntroductionProps) => {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto ">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl font-semibold">
              Prenez une vidéo de votre visage{" "}
            </Title>
            <Subtitle className="text-xs md:text-xs text-gray-600 leading-relaxed px-4">
              Afin de vérifier votre identité, nous allons vous demander de
              prendre une courte vidéo de votre visage{" "}
            </Subtitle>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <img
                src={SelfieIcon}
                alt="Vérification par selfie"
                className="w-80 h-80 object-contain bg-white"
              />
            </div>
          </div>
          <p className="text-center text-xs  text-gray-600 leading-relaxed ">
            À la prochaine étape, nous vous demanderons de prendre une vidéo de
            votre visage.
          </p>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={onContinue} className="w-full py-3">
              Commencer
            </Button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-center">
            <ButtonDesktop onClick={onContinue} type="continue">
              Commencer
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfiePreIntroduction;
