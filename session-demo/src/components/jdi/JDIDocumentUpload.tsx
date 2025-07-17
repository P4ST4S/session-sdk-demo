import { useState, useRef, useEffect } from "react";

import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";
import { Card } from "../ui/Card";
import { Download } from "lucide-react";

interface JDIDocumentUploadProps {
  documentType: string;
  onUpload: () => void;
  onBack: () => void;
  documentTypeId?: string; // Pour identifier des types spécifiques comme jdd ou income-proof
}

// Récupère le bon label en fonction du type de document et de l'ID du type
const getDocumentLabel = (documentType: string, documentTypeId?: string) => {
  // Si c'est un type spécial, adapter le label en fonction
  if (documentTypeId === "jdd") {
    // Pour les justificatifs de domicile, utiliser directement la valeur comme label
    return documentType;
  } else if (documentTypeId === "income-proof") {
    // Pour les justificatifs de revenus, utiliser directement la valeur comme label
    return documentType;
  }

  // Sinon, utiliser la logique standard pour les documents d'identité
  switch (documentType) {
    case "national_id":
      return "Carte nationale d'identité";
    case "passport":
      return "Passeport";
    case "driving_license":
      return "Permis de conduire";
    default:
      return documentType; // Utiliser directement la valeur si c'est un label personnalisé
  }
};

const requiresTwoSides = (documentType: string, documentTypeId?: string) => {
  // Les justificatifs spéciaux n'ont généralement qu'une face
  if (documentTypeId === "jdd" || documentTypeId === "income-proof") {
    return false;
  }

  // Pour les documents d'identité, vérifier en fonction du type
  switch (documentType) {
    case "national_id":
    case "driving_license":
      return true;
    case "passport":
    default:
      return false;
  }
};

const JDIDocumentUpload = ({
  documentType,
  onUpload,
  onBack,
  documentTypeId,
}: JDIDocumentUploadProps) => {
  // Ajout de logs pour le débogage
  useEffect(() => {
    // Vérifier si le document type est valide
    if (!documentType) {
      console.error("JDIDocumentUpload: documentType is missing or invalid", {
        documentType,
        documentTypeId,
      });
    }
  }, [documentType, documentTypeId]);

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const twoSidesRequired = requiresTwoSides(documentType, documentTypeId);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("application/pdf")
    ) {
      setError("Veuillez sélectionner un fichier image ou PDF valide");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 10MB");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (side === "front") {
        setFrontImage(result);
      } else {
        setBackImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    // Clear previous errors
    setError("");

    // Validation checks
    if (!frontImage) {
      const errorMsg =
        documentTypeId === "jdd"
          ? "Veuillez ajouter une photo de votre justificatif de domicile"
          : documentTypeId === "income-proof"
          ? "Veuillez ajouter une photo de votre justificatif de revenus"
          : "Veuillez ajouter une photo du recto de votre document";

      setError(errorMsg);
      return;
    }

    if (twoSidesRequired && !backImage) {
      setError("Veuillez ajouter une photo du verso de votre document");
      return;
    }

    // Additional validations
    if (frontImage && frontImage.length < 1000) {
      setError("L'image du recto semble corrompue, veuillez la reprendre");
      return;
    }

    if (twoSidesRequired && backImage && backImage.length < 1000) {
      setError("L'image du verso semble corrompue, veuillez la reprendre");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically upload the images to your server

      onUpload();
    } catch (err) {
      console.error("JDIDocumentUpload: Upload error:", err);
      setError(
        "Erreur lors du téléchargement. Veuillez vérifier votre connexion et réessayer."
      );
      setIsUploading(false);
    }
  };

  const removeImage = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImage(null);
      if (frontInputRef.current) frontInputRef.current.value = "";
    } else {
      setBackImage(null);
      if (backInputRef.current) backInputRef.current.value = "";
    }
    setError("");
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {documentTypeId === "jdd"
                ? `Déposez votre ${getDocumentLabel(
                    documentType,
                    documentTypeId
                  )}`
                : documentTypeId === "income-proof"
                ? `Déposez votre ${getDocumentLabel(
                    documentType,
                    documentTypeId
                  )}`
                : `Déposez votre pièce d'identité`}
            </h1>
            <p className="text-gray-600">
              {documentTypeId === "jdd"
                ? "Téléchargez votre justificatif de domicile."
                : documentTypeId === "income-proof"
                ? "Téléchargez votre justificatif de revenus."
                : "Téléchargez votre pièce d'identité."}
            </p>
          </div>

          {/* Upload Card */}
          <Card className="border-2 border-dashed border-teal-300 bg-teal-50/30 p-8 mb-6">
            <div className="text-center space-y-6">
              {!frontImage ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {getDocumentLabel(documentType, documentTypeId)}
                  </h3>

                  <div className="flex justify-center w-full">
                    <Button
                      onClick={() => frontInputRef.current?.click()}
                      className="border border-teal-300 text-teal-600 bg-transparent hover:bg-teal-50 px-4 py-2 rounded-lg font-medium text-sm mx-auto flex items-center"
                      disabled={isUploading}
                    >
                      <span>Parcourir mes fichiers</span>
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Les formats PDF, PNG et JPG sont acceptés</p>
                    <p>
                      Jusqu'à {twoSidesRequired ? "2 fichiers" : "1 fichier"} |
                      5MB par fichier max
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {documentType === "passport" ? "Page avec photo" : "Recto"}
                  </h3>
                  {frontImage &&
                  frontImage.startsWith("data:application/pdf") ? (
                    <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg border">
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-red-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 3h6.93c-.06.35-.13.68-.24 1H13v-1zm0 3h6.24c-.22.35-.47.69-.74 1H13v-1zm0 3h3.59c-.92.45-1.96.75-3.07.82L13 19z" />
                        </svg>
                        <p className="mt-2 text-sm font-medium">Document PDF</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={frontImage || "/placeholder.svg"}
                      alt="Document recto"
                      className="w-full h-48 object-contain bg-white rounded-lg border"
                    />
                  )}
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => frontInputRef.current?.click()}
                      className="text-teal-600 bg-white hover:bg-teal-50 text-xs px-2 py-1 rounded border border-teal-200"
                    >
                      Changer
                    </button>
                    <button
                      onClick={() => removeImage("front")}
                      className="text-red-600 bg-white hover:bg-red-50 text-xs px-2 py-1 rounded border border-red-200"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={frontInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "front")}
                className="hidden"
              />
            </div>
          </Card>

          {/* Back side upload - only if required */}
          {twoSidesRequired && (
            <Card className="border-2 border-dashed border-teal-300 bg-teal-50/30 p-8 mb-6">
              <div className="text-center space-y-6">
                {!backImage ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Verso
                    </h3>

                    <div className="flex justify-center w-full">
                      <Button
                        onClick={() => backInputRef.current?.click()}
                        className="border border-teal-300 text-teal-600 bg-transparent hover:bg-teal-50 px-4 py-2 rounded-lg font-medium text-sm mx-auto flex items-center"
                        disabled={isUploading}
                      >
                        <Download className="w-3 h-3 mr-2" />
                        <span>Parcourir mes fichiers</span>
                      </Button>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Les formats PDF, PNG et JPG sont acceptés</p>
                      <p>Jusqu'à 1 fichier | 5MB par fichier max</p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Verso
                    </h3>
                    {backImage &&
                    backImage.startsWith("data:application/pdf") ? (
                      <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg border">
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-red-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 3h6.93c-.06.35-.13.68-.24 1H13v-1zm0 3h6.24c-.22.35-.47.69-.74 1H13v-1zm0 3h3.59c-.92.45-1.96.75-3.07.82L13 19z" />
                          </svg>
                          <p className="mt-2 text-sm font-medium">
                            Document PDF
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={backImage || "/placeholder.svg"}
                        alt="Document verso"
                        className="w-full h-48 object-contain bg-white rounded-lg border"
                      />
                    )}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => backInputRef.current?.click()}
                        className="text-teal-600 bg-white hover:bg-teal-50 text-xs px-2 py-1 rounded border border-teal-200"
                      >
                        Changer
                      </button>
                      <button
                        onClick={() => removeImage("back")}
                        className="text-red-600 bg-white hover:bg-red-50 text-xs px-2 py-1 rounded border border-red-200"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="hidden"
                />
              </div>
            </Card>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-2">⚠</span>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button
              onClick={handleUpload}
              className="w-full py-3"
              disabled={
                !frontImage || (twoSidesRequired && !backImage) || isUploading
              }
            >
              {isUploading
                ? "Téléchargement..."
                : documentTypeId === "jdd" || documentTypeId === "income-proof"
                ? "Valider le document"
                : "Valider les documents"}
            </Button>
            <button
              onClick={onBack}
              disabled={isUploading}
              className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2 disabled:opacity-50"
            >
              Retour
            </button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-end">
            <ButtonDesktop onClick={onBack} type="back" disabled={isUploading}>
              Retour
            </ButtonDesktop>
            <ButtonDesktop
              onClick={handleUpload}
              type="continue"
              disabled={
                !frontImage || (twoSidesRequired && !backImage) || isUploading
              }
            >
              {isUploading
                ? "Téléchargement..."
                : documentTypeId === "jdd" || documentTypeId === "income-proof"
                ? "Valider le document"
                : "Valider les documents"}
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDIDocumentUpload;
