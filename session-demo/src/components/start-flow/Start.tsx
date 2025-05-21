import StartIcon from "../icons/StartIcon";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";

const Start = ({ setStep }: { setStep: (nubr: number) => void }) => {
  const goOnCGU = () => {
    setStep(1);
  };

  return (
    <div className="relative flex sm:items-center justify-content w-full px-6 sm:px-12 pt-8 pb-[80px] overflow-hidden sm:flex-col">
      <div className="w-[345px] flex flex-col sm:flex-col-reverse items-center mx-auto overflow-hidden">
        <StartIcon className="w-[230px] h-[230px] mb-[78px]" />
        <div className="flex flex-col">
          <Title className="mb-5 sm:mb-2">Vérifions votre identité</Title>
          <Subtitle>
            Pour réduire le risque de fraude, nous devons vérifier votre
            identité
          </Subtitle>
        </div>
      </div>

      <div className="hidden sm:flex w-[450px]">
        <p className="text-[#3C3C40B3] text-center text-[12px] font-semibold leading-[120%] mb-[18px]">
          En cliquant sur commencer, j’accepte les conditions d’utilisation de
          Datakeen et je déclare avoir lu la déclaration de protection des
          données.
        </p>
      </div>

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button onClick={goOnCGU} className="w-full">
            Commencer ma vérification
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default Start;
