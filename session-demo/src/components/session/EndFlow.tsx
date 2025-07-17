import React from "react";
import type { stepObject } from "../../types/session";
import checkIcon from "../../assets/check.svg";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
interface EndFlowProps {
  stepObject: stepObject;
}

/**
 * EndFlow Component
 *
 * Composant affiché à la fin du flux de vérification lorsque toutes les étapes ont été complétées.
 * Affiche un message de confirmation avec une icône de succès.
 *
 * @param {EndFlowProps} props - Propriétés du composant
 * @param {stepObject} props.stepObject - Objet contenant l'état actuel et les fonctions de changement d'étape
 * @returns {JSX.Element} Le composant EndFlow
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EndFlow: React.FC<EndFlowProps> = ({ stepObject }) => {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          {/* Icon - shown on top for both mobile and desktop */}
          <div className="flex justify-center">
            <img
              src={checkIcon}
              alt="Vérification terminée"
              className="w-48 h-48"
            />
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              C'est tout bon !
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Merci d'avoir soumis vos documents, vous pouvez quitter cette
              fenêtre.
            </Subtitle>
          </div>
        </div>
      </div>

      {/* Button area - sticky on mobile, inline on desktop */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={() => window.close()}
            className="w-full py-3 md:py-4"
          >
            Terminer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndFlow;
