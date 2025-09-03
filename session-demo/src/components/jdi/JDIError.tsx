import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";
import { useI18n } from "../../hooks/useI18n";
import { Prediction, extractRootCauses } from "../../utils/apiAnalysis";

interface JDIErrorProps {
  documentType: string;
  onRetry: () => void;
  onContinueAnyway: () => void;
  onBackToUserInput?: () => void;
  retryCount?: number;
  predictions?: Prediction[]; // Nouvelles données de l'API
}

const JDIError = ({
  documentType,
  onRetry,
  onContinueAnyway,
  onBackToUserInput,
  retryCount = 0,
  predictions = [],
}: JDIErrorProps) => {
  const { t, translateCodeDescription, translateDocumentType } = useI18n();

  const getDocumentLabel = (documentType: string) => {
    const translated = translateDocumentType(documentType);
    // Si pas de traduction, utiliser les traductions par défaut
    if (translated === documentType) {
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
    }
    return translated;
  };

  // Extraire les root causes des prédictions de l'API
  const rootCauses = extractRootCauses(predictions);
  
  // Obtenir les descriptions traduites des root causes
  const getTranslatedRootCauses = () => {
    if (rootCauses.length === 0) {
      // Messages par défaut si aucune prédiction disponible
      return [
        "Qualité des images : Insuffisante",
        "Lisibilité des informations : Problématique", 
        "Authenticité : Non vérifiée"
      ];
    }

    // Traduire directement les codeNames de l'API en utilisant les clés document_error_description_
    return rootCauses.map(codeName => {
      const translated = translateCodeDescription(codeName);
      
      // Si pas de traduction trouvée, essayer avec le codeDescription original de l'API
      if (translated === codeName || translated === `Unknown error: ${codeName}`) {
        // Fallback vers le codeDescription de l'API s'il existe
        const prediction = predictions.find(p => p.codeName === codeName);
        console.log(`🔍 JDIError - Fallback pour "${codeName}":`, prediction?.codeDescription);
        return prediction?.codeDescription || translated;
      }
      return translated;
    });
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
              {t("errors.verification_failed")}
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              {t("errors.verification_failed_subtitle", { 
                documentType: getDocumentLabel(documentType) 
              })}
            </Subtitle>
          </div>

          {/* Error details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">
              {t("errors.problems_detected")}
            </h3>
            <div className="text-sm text-red-800 space-y-1">
              {getTranslatedRootCauses().map((rootCause, index) => (
                <p key={index}>{rootCause}</p>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              {t("errors.next_steps")}
            </h3>
            <p className="text-sm text-blue-800">
              {t("errors.next_steps_description")}
            </p>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout */}
          <div className="flex flex-col space-y-3 md:hidden">
            {onBackToUserInput && (
              <button
                onClick={onBackToUserInput}
                className="w-full text-black text-center font-poppins text-sm font-medium py-2"
              >
                {t("errors.back_to_user_input")}
              </button>
            )}
            {retryCount >= 1 && (
              <button
                onClick={onContinueAnyway}
                className="w-full text-black text-center font-poppins text-sm font-medium py-2"
              >
                {t("errors.continue_anyway")}
              </button>
            )}
            <Button onClick={onRetry} className="w-full py-3">
              {t("errors.retry_verification")}
            </Button>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-col space-y-3">
            {onBackToUserInput && (
              <button
                onClick={onBackToUserInput}
                className="w-full text-black text-center font-poppins text-sm font-medium py-2"
              >
                {t("errors.back_to_user_input")}
              </button>
            )}
            {retryCount >= 1 && (
              <button
                onClick={onContinueAnyway}
                className="w-full text-black text-center font-poppins text-sm font-medium py-2"
              >
                {t("errors.continue_anyway")}
              </button>
            )}
            <div className="flex justify-end">
              <ButtonDesktop onClick={onRetry} type="continue">
                {t("errors.retry_verification")}
              </ButtonDesktop>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIError;
