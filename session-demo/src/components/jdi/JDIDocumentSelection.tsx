import { useState, useEffect } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";
import { Select } from "../ui/SelectComponent";
import { retrieveDocumentOptions } from "../../services/sessionService";

interface JDIDocumentSelectionProps {
  onDocumentSelect: (documentType: string) => void;
  onBack: () => void;
  documentTypeId?: string; // ID du type de document (jdd, income-proof, etc.)
  sessionId?: string; // Session ID pour récupérer les options stockées
}

// Options par défaut pour les documents d'identité standard
const defaultDocumentTypes = [
  { value: "national_id", label: "Carte nationale d'identité" },
  { value: "passport", label: "Passeport" },
  { value: "driving_license", label: "Permis de conduire" },
];

const JDIDocumentSelection = ({
  onDocumentSelect,
  onBack,
  documentTypeId,
  sessionId,
}: JDIDocumentSelectionProps) => {
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [documentOptions, setDocumentOptions] =
    useState<{ value: string; label: string }[]>(defaultDocumentTypes);

  // Charger les options du document depuis localStorage si disponibles
  useEffect(() => {
    if (sessionId && documentTypeId) {
      // Utiliser la fonction utilitaire pour récupérer les options
      const options = retrieveDocumentOptions(sessionId, documentTypeId);

      if (options && options.length > 0) {
        // Transformer les options en format attendu par le Select
        const formattedOptions = options.map((option: string) => ({
          value: option,
          label: option,
        }));

        setDocumentOptions(formattedOptions);
      }
    } else {
      // Utiliser les options par défaut si aucun type spécifique n'est fourni
      setDocumentOptions(defaultDocumentTypes);
    }
  }, [sessionId, documentTypeId]);

  const handleContinue = () => {
    if (!selectedDocument) {
      setError("Veuillez sélectionner un type de document");
      return;
    }
    setError("");
    onDocumentSelect(selectedDocument);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              {documentTypeId === "jdd"
                ? "Type de justificatif de domicile"
                : documentTypeId === "income-proof"
                ? "Type de justificatif de revenus"
                : "Type de document d'identité"}
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              {documentTypeId === "jdd"
                ? "Sélectionnez le type de justificatif de domicile que vous souhaitez utiliser pour votre vérification."
                : documentTypeId === "income-proof"
                ? "Sélectionnez le type de justificatif de revenus que vous souhaitez utiliser pour votre vérification."
                : "Sélectionnez le type de document d'identité que vous souhaitez utiliser pour votre vérification."}
            </Subtitle>
          </div>

          {/* Document selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {documentTypeId === "jdd"
                  ? "Type de justificatif de domicile"
                  : documentTypeId === "income-proof"
                  ? "Type de justificatif de revenus"
                  : "Type de document d'identité"}{" "}
                *
              </label>
              <Select
                options={documentOptions}
                value={selectedDocument}
                onValueChange={(value) => {
                  setSelectedDocument(value);
                  setError("");
                }}
                placeholder={
                  documentTypeId === "jdd"
                    ? "Choisissez votre type de justificatif de domicile"
                    : documentTypeId === "income-proof"
                    ? "Choisissez votre type de justificatif de revenus"
                    : "Choisissez votre type de document d'identité"
                }
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {error}
                </p>
              )}
            </div>

            {/* Information about selected document */}
            {selectedDocument && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Informations importantes
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {/* Afficher des instructions différentes selon le type de document */}
                  {documentTypeId === "jdd" ? (
                    <>
                      <p>
                        • Assurez-vous que le document est récent (moins de 3
                        mois)
                      </p>
                      <p>
                        • Vérifiez que votre nom et adresse sont clairement
                        visibles
                      </p>
                      <p>• Le document doit être à votre nom</p>
                    </>
                  ) : documentTypeId === "income-proof" ? (
                    <>
                      <p>• Le document doit être à votre nom</p>
                      <p>
                        • Assurez-vous que toutes les informations sont lisibles
                      </p>
                      <p>• Les montants doivent être clairement visibles</p>
                    </>
                  ) : selectedDocument === "national_id" ? (
                    <>
                      <p>• Déposer le recto et le verso de votre carte</p>
                      <p>
                        • Assurez-vous que toutes les informations sont lisibles
                      </p>
                    </>
                  ) : selectedDocument === "passport" ? (
                    <>
                      <p>• Déposer uniquement la page avec votre photo</p>
                      <p>• Vérifiez que le passeport est valide</p>
                    </>
                  ) : selectedDocument === "driving_license" ? (
                    <>
                      <p>• Déposer le recto et le verso de votre permis</p>
                      <p>• Vérifiez que le permis n'est pas expiré</p>
                    </>
                  ) : (
                    <>
                      <p>• Assurez-vous que le document est valide</p>
                      <p>
                        • Toutes les informations doivent être clairement
                        lisibles
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button
              onClick={handleContinue}
              className="w-full py-3"
              disabled={!selectedDocument}
            >
              Continuer
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
            <ButtonDesktop
              onClick={handleContinue}
              type="continue"
              disabled={!selectedDocument}
            >
              Continuer
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIDocumentSelection;
