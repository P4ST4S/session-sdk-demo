import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";

interface JDIErrorProps {
  documentType: string;
  onRetry: () => void;
  onContactSupport: () => void;
}

const JDIError = ({
  documentType,
  onRetry,
  onContactSupport,
}: JDIErrorProps) => {
  const getDocumentLabel = (documentType: string) => {
    switch (documentType) {
      case "national_id":
        return "carte nationale d'identité";
      case "passport":
        return "passeport";
      case "driving_license":
        return "permis de conduire";
      default:
        return "document";
    }
  };

  const getErrorReasons = () => {
    const reasons = [
      "La qualité de l'image n'est pas suffisante",
      "Certaines informations ne sont pas lisibles",
      "Le document semble endommagé ou altéré",
      "Le type de document ne correspond pas",
    ];

    // Return 2-3 random reasons for demo
    return reasons.slice(0, Math.floor(Math.random() * 2) + 2);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Error icon */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✕</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl text-red-600">
              Vérification échouée
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              Nous n'avons pas pu valider votre {getDocumentLabel(documentType)}
              . Veuillez vérifier les points ci-dessous et réessayer.
            </Subtitle>
          </div>

          {/* Error reasons */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">
              Problèmes détectés
            </h3>
            <div className="text-sm text-red-800 space-y-1">
              {getErrorReasons().map((reason, index) => (
                <p key={index}>• {reason}</p>
              ))}
            </div>
          </div>

          {/* Tips for better photos */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">
              Conseils pour améliorer vos photos
            </h3>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• Assurez-vous que l'éclairage est suffisant</p>
              <p>• Évitez les reflets et les ombres</p>
              <p>• Photographiez le document à plat</p>
              <p>• Vérifiez que toutes les informations sont visibles</p>
              <p>• Utilisez un fond uni et contrasté</p>
            </div>
          </div>

          {/* Contact support option */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Si vous continuez à rencontrer des difficultés, notre équipe de
              support peut vous aider à résoudre le problème.
            </p>
            <button
              onClick={onContactSupport}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Contacter le support
            </button>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={onRetry} className="w-full py-3">
              Reprendre les photos
            </Button>
            <button
              onClick={onContactSupport}
              className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
            >
              Contacter le support
            </button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-end">
            <ButtonDesktop onClick={onContactSupport} type="back">
              Contacter le support
            </ButtonDesktop>
            <ButtonDesktop onClick={onRetry} type="continue">
              Reprendre les photos
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIError;
