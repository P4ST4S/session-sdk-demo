import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";
import { countries } from "../../utils/jdiCountry";
import type { DrawerItem } from "../../utils/jdiCountry";
import { useState } from "react";
import { SelectDrawer } from "../ui/SelectDrawer";
import { JDIDocumentType } from "../../utils/chooseDocuments/frenchDocumentTypes";

const ChooseCountryJDI = ({ setStep }: { setStep: (nbr: number) => void }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<DrawerItem | null>(
    null
  );
  const goOnNextStep = () => {
    setStep(0);
  };

  return (
    <div className="relative flex sm:items-center justify-content w-full px-6 sm:px-12 pt-8 pb-[80px] overflow-hidden sm:flex-col">
      <div className="flex flex-col gap-5 mt-4 mx-auto w-full max-w-[322px]">
        <div className="flex flex-col sm:flex-col-reverse items-center mx-auto overflow-hidden">
          <div className="flex flex-col">
            <Title className="mb-5 sm:mb-2">Pays émetteur du document</Title>
            <Subtitle>
              Sélectionnez le pays émetteur indiqué sur votre document
              d’identité
            </Subtitle>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center">
          <SelectDrawer
            title="Pays émetteur"
            items={countries}
            selectedItem={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center mt-[-30px]">
          <SelectDrawer
            title="Type de document"
            items={JDIDocumentType}
            selectedItem={selectedLanguage}
            onChange={setSelectedLanguage}
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

export default ChooseCountryJDI;
