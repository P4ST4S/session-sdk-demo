import { beforePhotoIcon } from "../../assets";
import Button from "../ui/Button";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";

interface BeforePhotoProps {
  setStep: (step: number) => void;
}

const BeforePhoto = ({ setStep }: BeforePhotoProps) => {
  const goOnNextStep = () => {
    setStep(1);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Tenez le recto de votre document
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              Afin de vérifier votre pièce d'identité, nous allons vous demander
              de tenir votre document puis de l'incliner face à la caméra
            </Subtitle>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={beforePhotoIcon}
              alt="Avant de prendre la photo"
              className="max-w-full h-auto object-contain max-h-[30vh]"
            />
          </div>
        </div>
      </div>

      {/* Footer with button */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          <Button onClick={goOnNextStep} className="w-full py-3 md:py-4">
            Je suis prêt.e
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BeforePhoto;
