import { BeforePhotoIcon } from "../../assets";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
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
    <div className="relative flex justify-content w-full px-4 pt-8 pb-[80px] overflow-hidden lg:flex-col">
      <div className="flex flex-col gap-5 mt-4 mx-auto w-full max-w-[322px]">
        <div className="flex flex-col sm:flex-col-reverse items-center mx-auto overflow-hidden">
          <div className="flex flex-col">
            <Title className="mb-5 sm:mb-2">
              Tenez le recto de votre document
            </Title>
            <Subtitle>
              Afin de vérifier votre pièce d’identité, nous allons vous demander
              tenir votre document puis de l’incliner face à la caméra
            </Subtitle>
          </div>
        </div>
        <img
          src={BeforePhotoIcon}
          alt="Avant de prendre la photo"
          className="max-h-[60vh] w-auto object-contain ml-[-20px]"
        />
      </div>
      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button onClick={goOnNextStep} className="w-full">
            Je suis prêt.e
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default BeforePhoto;
