import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";
import { countries } from "../../utils/jdiCountry";
import type { Country } from "../../utils/jdiCountry";
import { useState } from "react";
import { CountrySelectDrawer } from "../ui/CountrySelectDrawer";

const ChooseCountry = ({ setStep }: { setStep: (nbr: number) => void }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Country | null>(
    null
  );
  const goOnNextStep = () => {
    setStep(0);
  };

  return (
    <div className="relative flex sm:items-center justify-content w-full px-6 sm:px-12 pt-8 pb-[80px] overflow-hidden sm:flex-col">
      <div className="flex flex-col gap-5 mt-4">
        <div className="w-[345px] flex flex-col sm:flex-col-reverse items-center mx-auto overflow-hidden">
          <div className="flex flex-col">
            <Title className="mb-5 sm:mb-2">Pays émetteur du document</Title>
            <Subtitle>
              Sélectionnez le pays émetteur indiqué sur votre document
              d’identité
            </Subtitle>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <CountrySelectDrawer
            title="Pays émetteur"
            items={countries}
            selectedItem={selectedLanguage}
            onChange={setSelectedLanguage}
            className="w-full h-[60px"
          />
        </div>
      </div>

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button onClick={goOnNextStep} className="w-full">
            Commencer ma vérification
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default ChooseCountry;
