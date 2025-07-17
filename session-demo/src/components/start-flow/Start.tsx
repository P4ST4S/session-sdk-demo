import StartIcon from "../icons/StartIcon";
import Button from "../ui/Button";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";

const Start = ({ setStep }: { setStep: (nubr: number) => void }) => {
  const goOnCGU = () => {
    setStep(1);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          {/* Icon - shown on top for both mobile and desktop */}
          <div className="flex justify-center">
            <StartIcon className="w-48 h-48" />
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Vérifions votre identité
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Pour réduire le risque de fraude, nous devons vérifier votre
              identité
            </Subtitle>
          </div>

          {/* Terms notice */}
          <div className=" md:block mt-8">
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              En cliquant sur commencer, j'accepte les conditions d'utilisation
              de Datakeen et je déclare avoir lu la déclaration de protection
              des données.
            </p>
          </div>
        </div>
      </div>

      {/* Button area - sticky on mobile, inline on desktop */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          <Button onClick={goOnCGU} className="w-full py-3 md:py-4">
            Commencer ma vérification
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Start;
