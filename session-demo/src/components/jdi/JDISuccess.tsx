import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";

interface JDISuccessProps {
  documentType: string;
  onContinue: () => void;
}

const JDISuccess = ({ documentType, onContinue }: JDISuccessProps) => {
  const getDocumentLabel = (documentType: string) => {
    switch (documentType) {
      case "national_id":
        return "Carte nationale d'identité";
      case "passport":
        return "Passeport";
      case "driving_license":
        return "Permis de conduire";
      default:
        return "Document";
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Success icon */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl text-green-600">
              Vérification réussie !
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              Votre {getDocumentLabel(documentType).toLowerCase()} a été validé
              avec succès. Vous pouvez maintenant continuer le processus de
              vérification.
            </Subtitle>
          </div>

          {/* Success details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Document validé</h3>
            <div className="text-sm text-green-800 space-y-1">
              <p>• Qualité des images : Excellente</p>
              <p>• Lisibilité des informations : Confirmée</p>
              <p>• Authenticité : Vérifiée</p>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Prochaines étapes
            </h3>
            <p className="text-sm text-blue-800">
              Nous allons maintenant procéder à la vérification de votre
              identité avec une photo en direct.
            </p>
          </div>
        </div>
      </div>

      {/* Footer with button */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={onContinue} className="w-full py-3">
              Continuer la vérification
            </Button>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex gap-3 justify-end">
            <ButtonDesktop onClick={onContinue} type="continue">
              Continuer la vérification
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDISuccess;
