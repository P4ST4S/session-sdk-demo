import Body from "../ui/Body";
import Title from "../ui/Title";
import Select from "../ui/Select";
import { languages } from "../../utils/languages";
import { useState } from "react";

// For checkbox
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { CheckIcon } from "@radix-ui/react-icons";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";

const CGU = ({ setStep }: { setStep: (nubr: number) => void }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [checked, setChecked] = useState(false);
  const goOnNextStep = () => {
    setStep(1);
  };

  return (
    <div className="relative flex sm:items-center justify-content w-full px-4 sm:px-12 pt-8 pb-[80px] overflow-hidden flex-col">
      <div className="flex flex-col gap-5 mt-4">
        <Title>Nos conditions d’utilisation</Title>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select
            title=""
            items={languages}
            selectedItem={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>
        <Body className="text-left">
          Ce parcours d’identification est proposé par Datakeen.
          <br />
          <br />
          Nous capturons des photos et/ou vidéos de vos documents et de votre
          visage afin de vérifier votre identité pour le compte de l’entité qui
          en fait la demande. Cela inclut la collecte et l’analyse de données
          biométriques.
          <br />
          <br />
          Datakeen peut également utiliser vos données en tant que responsable
          du traitement pour ses propres besoins, conformément à sa politique de
          confidentialité.
          <br />
          <br />
          En cliquant sur "Continuer", vous confirmez avoir pris connaissance et
          accepté les conditions générales d’utilisation.
        </Body>
      </div>

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="flex flex-row items-center justify-center w-full mt-4 gap-3">
          <CheckboxPrimitive.Root
            id="checkbox"
            checked={checked}
            onCheckedChange={(value) => setChecked(!!value)}
            className="h-5 w-5 shrink-0 rounded border border-gray-300 bg-white data-[state=checked]:bg-[#11E5C5] data-[state=checked]:border-[#11E5C5]"
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
              <CheckIcon className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          <LabelPrimitive.Root htmlFor="checkbox">
            <Body className="text-left">
              Je consens à ce que mes informations biométriques soient traitées
              dans le but de vérifier mon identité à distance.
            </Body>
          </LabelPrimitive.Root>
        </div>
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button onClick={goOnNextStep} disabled={!checked} className="w-full">
            Continuer
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default CGU;
