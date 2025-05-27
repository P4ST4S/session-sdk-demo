/**
 * @file Start.tsx
 * @description This component serves as the initial welcome screen in the identity verification flow.
 * It provides users with an introduction to the verification process and a button to begin.
 *
 * @component Start
 *
 * @props {function} setStep - Callback function to change the current step in the parent component
 *                            workflow. Called with 1 when the user clicks to start verification.
 *
 * @flow
 * 1. User is presented with a welcome screen explaining the identity verification purpose
 * 2. User clicks "Commencer ma vérification" (Start my verification) to proceed
 * 3. On button click, user is taken to the next step (CGU/Terms of Use)
 *
 * @responsiveness
 * - Mobile: Displays the StartIcon below the title and subtitle
 * - Desktop: Displays the StartIcon above the title and subtitle and shows additional terms notice
 *
 * @dependencies
 * - StartIcon - SVG icon component for visual representation
 * - UI components for consistent styling (Title, Subtitle, Button, etc.)
 *
 * @example
 * <Start setStep={(step) => setCurrentStep(step)} />
 */

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
