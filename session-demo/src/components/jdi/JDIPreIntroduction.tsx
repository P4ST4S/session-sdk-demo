import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";
import { DocCheckIcon, IdCheckIcon } from "../../assets";

interface JDIPreIntroductionProps {
  onContinue: () => void;
  onBack: () => void;
  documentTypeId?: string;
}

const JDIPreIntroduction = ({
  onContinue,
  onBack,
  documentTypeId,
}: JDIPreIntroductionProps) => {
  // Déterminer le contenu en fonction du type de document
  let title, subtitle, icon;

  switch (documentTypeId) {
    case "jdd":
      title = "Déposez vos documents";
      subtitle =
        "Afin de compléter votre dossier, nous vous invitons à suivre ce processus de dépôt de documents.";
      icon = DocCheckIcon;
      break;
    case "income-proof":
      title = "Déposez vos documents";
      subtitle =
        "Afin de compléter votre dossier, nous vous invitons à suivre ce processus de dépôt de documents.";
      icon = DocCheckIcon;
      break;
    default:
      title = "Vérification d'identité";
      subtitle =
        "Afin de protéger vos informations et de prévenir tout risque de fraude, nous devons procéder à la vérification de votre identité.";
      icon = IdCheckIcon;
  }

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Icon */}

          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl font-semibold">
              {title}
            </Title>
            <Subtitle className="text-xs md:text-xs text-gray-600 leading-relaxed px-4">
              {subtitle}
            </Subtitle>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <img
                src={icon}
                alt={title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Information card */}

          <p className="text-center space-y-4 text-xs  text-gray-600 leading-relaxed px-4">
            En cliquant sur commencer, j’accepte les conditions d’utilisation de
            Datakeen et je déclare avoir lu la déclaration de protection des
            données.
          </p>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}

          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={onContinue} className="w-full py-3">
              Commencer
            </Button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-center">
            <ButtonDesktop onClick={onContinue} type="continue">
              Commencer
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIPreIntroduction;
