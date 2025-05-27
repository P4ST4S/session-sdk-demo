/**
 * @file CGU.tsx
 * @description This component displays the Conditions Générales d'Utilisation (Terms of Use)
 * that users must accept before proceeding with the identity verification process.
 * It provides options to select a language and requires user consent for biometric data processing.
 *
 * @component CGU
 *
 * @props {function} setStep - Callback function to change the current step in the parent component
 *                            workflow. Called with 1 when the user accepts the terms and proceeds.
 *
 * @state {object} selectedLanguage - Currently selected language for displaying the terms.
 * @state {boolean} checked - Whether the user has checked the consent checkbox.
 * @state {boolean} error - Whether there's an error state (user tried to proceed without consent).
 *
 * @validation
 * - User must check the consent checkbox to proceed.
 * - Error message appears if user attempts to continue without checking the box.
 *
 * @flow
 * 1. User views the terms of use in their selected language
 * 2. User must check the consent checkbox acknowledging biometric data processing
 * 3. User clicks "Continuer" to proceed
 * 4. If checkbox is checked, user advances to the next step
 * 5. If checkbox is not checked, an error message is displayed
 *
 * @dependencies
 * - languages - Array of available languages imported from languages utils
 * - Radix UI components for accessible checkbox implementation
 * - UI components for consistent styling (Body, Title, Button, etc.)
 *
 * @example
 * <CGU setStep={(step) => setCurrentStep(step)} />
 */

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
        {error && (
          <Body className="text-red-500 text-left mt-4">
            Vous devez accepter les conditions d’utilisation pour continuer.
          </Body>
        )}
        <div
          className={`flex flex-row items-center justify-center w-full gap-3 ${
            error ? "mt-2" : "mt-4"
          }`}
        >
          <CheckboxPrimitive.Root
            id="checkbox"
            checked={checked}
            onCheckedChange={(value) => handleCheckboxChange(!!value)}
            className={`h-5 w-5 shrink-0 rounded border bg-white data-[state=checked]:bg-[#11E5C5] data-[state=checked]:border-[#11E5C5] ${
              error ? "border-red-500" : "border-[#C4C4C4]"
            }`}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
              <CheckIcon className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          <LabelPrimitive.Root htmlFor="checkbox">
            <Body className={`text-left ${error ? "text-red-500" : ""}`}>
              Je consens à ce que mes informations biométriques soient traitées
              dans le but de vérifier mon identité à distance.
            </Body>
          </LabelPrimitive.Root>
        </div>
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button onClick={goOnNextStep} className="w-full">
            Continuer
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default CGU;
