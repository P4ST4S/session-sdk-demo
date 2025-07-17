import { beforeVersoIcon } from "../../assets";
import Button from "../ui/Button";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";

interface BeforeVersoPhotoProps {
  setStep: (step: number) => void;
}

const BeforeVersoPhoto = ({ setStep }: BeforeVersoPhotoProps) => {
  const goOnNextStep = () => {
    setStep(3); // Go to photo capture again, for the verso
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Retournez votre document
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              Maintenant, nous avons besoin de l'autre face de votre document.
              Retournez-le et tenez-le face à la caméra.
            </Subtitle>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src={beforeVersoIcon}
              alt="Avant de prendre la photo du verso"
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

export default BeforeVersoPhoto;
