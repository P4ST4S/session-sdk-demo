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

const CGU = ({ setStep }: { setStep: (nubr: number) => void }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);

  const handleCheckboxChange = (value: boolean) => {
    setChecked(value);
    setError(false);
  };

  const goOnNextStep = () => {
    if (checked) {
      setStep(1);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div className="text-center justify-center items-center">
            <Title className="text-xl md:text-2xl lg:text-3xl mb-6">
              Nos conditions d'utilisation
            </Title>

            {/* Language selector */}
            <div className="flex justify-center items-center mb-6">
              <Select
                title=""
                items={languages}
                selectedItem={selectedLanguage}
                onChange={setSelectedLanguage}
                className="w-64 mx-auto"
              />
            </div>
          </div>

          {/* Terms content */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <Body className="text-left text-sm md:text-base leading-relaxed space-y-4">
              <p>Ce parcours d'identification est proposé par Datakeen.</p>

              <p>
                Nous capturons des photos et/ou vidéos de vos documents et de
                votre visage afin de vérifier votre identité pour le compte de
                l'entité qui en fait la demande. Cela inclut la collecte et
                l'analyse de données biométriques.
              </p>

              <p>
                Datakeen peut également utiliser vos données en tant que
                responsable du traitement pour ses propres besoins, conformément
                à sa politique de confidentialité.
              </p>

              <p>
                En cliquant sur "Continuer", vous confirmez avoir pris
                connaissance et accepté les conditions générales d'utilisation.
              </p>
            </Body>
          </div>
        </div>
      </div>

      {/* Footer with checkbox and button - sticky on mobile */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <Body className="text-red-600 text-sm text-center">
                Vous devez accepter les conditions d'utilisation pour continuer.
              </Body>
            </div>
          )}

          {/* Consent checkbox */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckboxPrimitive.Root
              id="checkbox"
              checked={checked}
              onCheckedChange={(value) => handleCheckboxChange(!!value)}
              className={`mt-1 h-5 w-5 shrink-0 rounded border bg-white transition-colors
                data-[state=checked]:bg-[#11E5C5] data-[state=checked]:border-[#11E5C5] 
                ${
                  error
                    ? "border-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
                <CheckIcon className="h-4 w-4" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            <LabelPrimitive.Root htmlFor="checkbox" className="cursor-pointer">
              <Body
                className={`text-left text-sm leading-relaxed ${
                  error ? "text-red-600" : "text-gray-700"
                }`}
              >
                Je consens à ce que mes informations biométriques soient
                traitées dans le but de vérifier mon identité à distance.
              </Body>
            </LabelPrimitive.Root>
          </div>

          {/* Continue button */}
          <div className="w-full max-w-md mx-auto">
            <Button
              onClick={goOnNextStep}
              className="w-full py-3 md:py-4 transition-all duration-200"
              disabled={!checked}
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGU;
