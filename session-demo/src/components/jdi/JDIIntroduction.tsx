import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";
import { useEffect } from "react";
import { retrieveDocumentOptions } from "../../services/sessionService";

interface JDIIntroductionProps {
  onContinue: () => void;
  onBack: () => void;
  documentTypeId?: string; // ID du type de document
  sessionId?: string; // ID de la session
}

const JDIIntroduction = ({
  onContinue,
  onBack,
  documentTypeId,
  sessionId,
}: JDIIntroductionProps) => {
  // Log des props pour débogage
  useEffect(() => {
    // Vérifier si les options sont disponibles
    if (sessionId && documentTypeId) {
      const options = retrieveDocumentOptions(sessionId, documentTypeId);

      if (!options || options.length === 0) {
        console.warn(
          `JDIIntroduction: Aucune option trouvée pour le type de document ${documentTypeId}, utilisation des valeurs par défaut`
        );
      }
    } else {
      console.warn("JDIIntroduction: sessionId ou documentTypeId manquant", {
        sessionId,
        documentTypeId,
      });
    }
  }, [documentTypeId, sessionId]);
  // Déterminer le titre, la description et les documents acceptés en fonction du type
  let title, description, documentsAccepted;

  switch (documentTypeId) {
    case "jdd":
      title = "Justificatif de domicile";
      description =
        "Pour finaliser votre vérification, nous avons besoin d'un justificatif de domicile récent. Préparez votre document et suivez les instructions.";
      documentsAccepted =
        sessionId && documentTypeId
          ? retrieveDocumentOptions(sessionId, documentTypeId) || [
              "Facture d'électricité (< 3 mois)",
              "Facture de gaz (< 3 mois)",
              "Facture d'eau (< 3 mois)",
              "Quittance de loyer (< 3 mois)",
              "Facture téléphone/internet (< 3 mois)",
              "Attestation d'assurance habitation (< 3 mois)",
            ]
          : [
              "Facture d'électricité (< 3 mois)",
              "Facture de gaz (< 3 mois)",
              "Facture d'eau (< 3 mois)",
              "Quittance de loyer (< 3 mois)",
              "Facture téléphone/internet (< 3 mois)",
              "Attestation d'assurance habitation (< 3 mois)",
            ];
      break;
    case "income-proof":
      title = "Justificatif de revenus";
      description =
        "Pour finaliser votre vérification, nous avons besoin d'un justificatif de provenance des fonds. Préparez votre document et suivez les instructions.";
      documentsAccepted =
        sessionId && documentTypeId
          ? retrieveDocumentOptions(sessionId, documentTypeId) || [
              "Bulletin de salaire",
              "Avis d'imposition",
              "Relevé de compte bancaire",
              "Attestation de revenus",
              "Contrat de travail",
              "Titre de propriété",
              "Acte de vente",
              "Attestation de donation",
            ]
          : [
              "Bulletin de salaire",
              "Avis d'imposition",
              "Relevé de compte bancaire",
              "Attestation de revenus",
              "Contrat de travail",
              "Titre de propriété",
              "Acte de vente",
              "Attestation de donation",
            ];
      break;
    default:
      title = "Vérification d'identité";
      description =
        "Pour finaliser votre vérification, nous avons besoin d'une pièce d'identité. Préparez votre document et suivez les instructions.";
      documentsAccepted = [
        "Carte nationale d'identité",
        "Passeport",
        "Permis de conduire",
      ];
  }
  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">{title}</Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              {description}
            </Subtitle>
          </div>

          {/* Information cards */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Documents acceptés
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {documentsAccepted && documentsAccepted.length > 0 ? (
                  documentsAccepted.map((doc, index) => (
                    <li key={index}>• {doc}</li>
                  ))
                ) : (
                  <li>• Aucun document configuré</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={onContinue} className="w-full py-3">
              {documentTypeId === "jdd"
                ? "Vérifier mon justificatif de domicile"
                : documentTypeId === "income-proof"
                ? "Vérifier mon justificatif de revenus"
                : "Commencer la vérification"}
            </Button>
            <button
              onClick={onBack}
              className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
            >
              Retour
            </button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-end">
            <ButtonDesktop onClick={onBack} type="back">
              Retour
            </ButtonDesktop>
            <ButtonDesktop onClick={onContinue} type="continue">
              {documentTypeId === "jdd"
                ? "Vérifier mon justificatif de domicile"
                : documentTypeId === "income-proof"
                ? "Vérifier mon justificatif de revenus"
                : "Commencer la vérification"}
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIIntroduction;
