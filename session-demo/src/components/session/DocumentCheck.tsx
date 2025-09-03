import { useState, useEffect } from "react";
import type { stepObject } from "../../types/session";
import JDIPreIntroduction from "../jdi/JDIPreIntroduction";
import JDIDocumentSelection from "../jdi/JDIDocumentSelection";
import JDIDocumentUpload from "../jdi/JDIDocumentUpload";
import JDIProcessing from "../jdi/JDIProcessing";
import JDISuccess from "../jdi/JDISuccess";
import JDIError from "../jdi/JDIError";
// Imports pour le mode mobile (capture photo)
import BeforePhoto from "../id-check/BeforePhoto";
import BeforeVersoPhoto from "../id-check/BeforeVersoPhoto";
import Photo from "../id-check/Photo";
import PhotoConfirmation from "../id-check/PhotoConfirmation";
import { useDocumentContext } from "../../context/DocumentContext";
import { documentTypesFromCountryId } from "../../utils/jdiCountry";
import { retrieveDocumentOptions } from "../../services/sessionService";
import type { onUploadFiles } from "../../types/uploadFiles";
import type { Prediction } from "../../utils/apiAnalysis";

interface DocumentCheckProps {
  stepObject: stepObject;
  sessionId: string;
  onContinueOnPC?: () => void;
  documentTypeId: string; // ID du type de document (id-card, jdd, income-proof, etc.)
  onBlockAutoProgress?: (block: boolean) => void; // Nouvelle prop pour contrôler le blocage
  isMobileCapture?: boolean; // Nouvelle prop pour déterminer le mode
}

/**
 * Composant générique pour la vérification de document
 * Ce composant remplace JDICheck en rendant le contenu dynamique en fonction du type de document
 */
const DocumentCheck = ({
  stepObject,
  sessionId,
  onContinueOnPC,
  documentTypeId,
  onBlockAutoProgress,
  isMobileCapture = false,
}: DocumentCheckProps) => {
  const [docStep, setDocStep] = useState(0);
  const [fileUploaded, setFileUploaded] = useState<onUploadFiles | null>(null);
  const [analysisData, setAnalysisData] = useState<Prediction[] | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // États pour le mode mobile (capture photo)
  const [capturedImages, setCapturedImages] = useState<{
    [key: string]: string;
  }>({});
  const [currentPhotoStep, setCurrentPhotoStep] = useState<
    "before-recto" | "recto" | "before-verso" | "verso" | "confirmation"
  >("before-recto");
  const documentContext = useDocumentContext();

  // Utiliser le contexte pour selectedDocumentType
  const { selectedDocumentType, setSelectedDocumentType } = documentContext;

  // Initialize docStep
  useEffect(() => {
    // If documentTypeId is missing, show error in console
    if (!documentTypeId) {
      console.error("DocumentCheck: Missing documentTypeId");
    }

    // Reset docStep when document type changes
    setDocStep(0);

    // Note: Removed automatic document type initialization for mobile
    // Let the JDI flow handle document selection for both mobile and desktop
  }, [documentTypeId, sessionId, isMobileCapture]);

  // Handlers pour le mode mobile
  const handlePhotoCapture = async (
    imageData: string,
    side: "recto" | "verso"
  ) => {
    setCapturedImages((prev) => ({ ...prev, [side]: imageData }));

    if (side === "recto") {
      // Vérifier si le document nécessite un verso selon le type de document
      const isPassport =
        documentTypeId === "jdi-3" ||
        (selectedDocumentType && selectedDocumentType.id === "jdi-3");

      if (isPassport) {
        // Le passeport n'a besoin que du recto
        setCurrentPhotoStep("confirmation");
      } else {
        // Les autres documents ont besoin du verso
        setCurrentPhotoStep("before-verso");
      }
    } else if (side === "verso") {
      setCurrentPhotoStep("confirmation");
    }
  };

  const handlePhotoConfirmation = () => {
    // Convertir les images capturées en fichiers et utiliser la logique JDI existante
    if (capturedImages.recto) {
      // Créer le bon format pour onUploadFiles
      const mockFile: onUploadFiles = {
        front: capturedImages.recto,
        back: capturedImages.verso || null,
      };
      setFileUploaded(mockFile);

      // Bloquer la progression automatique pendant l'analyse
      if (onBlockAutoProgress) {
        onBlockAutoProgress(true);
      }

      setDocStep(3); // Aller à l'étape de traitement
    }
  };

  const handleStartPhotoCapture = () => {
    setCurrentPhotoStep("recto");
  };

  // Debug logs for document check
  useEffect(() => {
    // Vérifier si nous avons des options disponibles pour ce type de document
    if (sessionId && documentTypeId) {
      const options = retrieveDocumentOptions(sessionId, documentTypeId);

      if (!options || options.length === 0) {
        console.warn(
          `DocumentCheck: Aucune option trouvée pour le type de document ${documentTypeId}`
        );
      }
    } else {
      console.warn("DocumentCheck: sessionId ou documentTypeId manquant", {
        sessionId,
        documentTypeId,
      });
    }
  }, [
    stepObject.step,
    sessionId,
    documentTypeId,
    docStep,
    selectedDocumentType,
  ]);

  const handleDocumentTypeSelect = (documentId: string) => {
    // Convertir le documentId en DrawerItem en utilisant les types de documents disponibles
    const documents = documentTypesFromCountryId("FR");
    let selectedDoc = documents.find((doc) => doc.id === documentId);

    // Si pas trouvé par ID direct, essayer le mapping
    if (!selectedDoc) {
      let mappedId = "";
      if (documentId === "national_id") {
        mappedId = "jdi-2"; // Carte d'identité - Format carte
      } else if (documentId === "passport") {
        mappedId = "jdi-3"; // Passeport biométrique
      } else if (documentId === "driving_license") {
        mappedId = "jdi-5"; // Permis de conduire - Format carte
      }

      if (mappedId) {
        selectedDoc = documents.find((doc) => doc.id === mappedId);
      }
    }

    // Si toujours pas trouvé, créer un document fallback
    if (!selectedDoc) {
      selectedDoc = {
        id: documentTypeId || "jdi-2",
        label: documentId,
        hasTwoSides: documentId !== "passport", // Le passeport n'a pas de verso
      };
    }

    setSelectedDocumentType(selectedDoc);
    setDocStep(2); // Go to document upload/capture step
  };

  const handleDocumentUpload = (files: onUploadFiles) => {
    // Start processing and block auto-progress
    setFileUploaded(files);
    if (onBlockAutoProgress) {
      onBlockAutoProgress(true); // Bloquer la progression automatique pendant l'analyse
    }
    setDocStep(3);
  };

  const handleProcessingComplete = (success: boolean, retryCount?: number, apiAnalysisData?: unknown) => {
    // Stocker les données de l'analyse pour les passer à JDIError si nécessaire
    if (apiAnalysisData) {
      // Extraire les predictions de la structure de réponse API
      const predictions = (apiAnalysisData as { data?: { analysisResult?: { job_status?: { predictions?: Prediction[] } } } })?.data?.analysisResult?.job_status?.predictions;
      setAnalysisData(predictions || null);
    }
    
    if (success) {
      setDocStep(4); // Go to success screen
    } else {
      // Incrémenter le retry count si ce n'est pas déjà fourni
      if (retryCount !== undefined) {
        setRetryCount(retryCount);
      } else {
        setRetryCount(prev => prev + 1);
      }
      setDocStep(5); // Go to error screen
    }
  };

  const handleRetryFromError = () => {
    // Débloquer la progression automatique pour permettre un nouveau retry
    if (onBlockAutoProgress) {
      onBlockAutoProgress(false);
    }
    // Incrémenter le retry count
    setRetryCount(prev => prev + 1);
    setDocStep(2); // Go back to document upload
  };

  const handleContinueAnyway = () => {
    // Continue to next step in the main flow even with error
    if (onContinueOnPC) {
      onContinueOnPC();
    } else {
      // Fallback behavior
      if (onBlockAutoProgress) {
        onBlockAutoProgress(false);
      }
    }
  };

  const handleSuccessContinue = () => {
    // Débloquer la progression automatique
    if (onBlockAutoProgress) {
      onBlockAutoProgress(false);
    }

    if (onContinueOnPC) {
      onContinueOnPC();
    } else {
      stepObject.setStep(stepObject.step + 1);
    }
  };

  const handleBack = () => {
    // Si on est à la première étape interne
    if (docStep === 0) {
      // Revenir à l'étape précédente du flux principal
      stepObject.setStep(stepObject.step - 1);
    } else {
      // Sinon, revenir à l'étape précédente du flux interne
      setDocStep(docStep - 1);
    }
  };

  // Flux JDI commun pour mobile et desktop
  switch (docStep) {
    case 0:
      // If documentTypeId is missing, show error screen
      if (!documentTypeId) {
        console.error("DocumentCheck: Missing documentTypeId in step 0");
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Erreur de configuration
            </h2>
            <p className="text-gray-600 mb-4">Type de document non spécifié.</p>
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={() => stepObject.setStep(4)} // Go back to OTP
            >
              Retour
            </button>
          </div>
        );
      }

      return (
        <JDIPreIntroduction
          documentTypeId={documentTypeId}
          onContinue={() => setDocStep(1)}
          onBack={handleBack}
        />
      );
    case 1:
      return (
        <JDIDocumentSelection
          onDocumentSelect={handleDocumentTypeSelect}
          onBack={handleBack}
          documentTypeId={documentTypeId}
          sessionId={sessionId}
        />
      );
    case 2:
      if (!selectedDocumentType) {
        console.error(
          "DocumentCheck: selectedDocumentType is null for step 3!"
        );
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Erreur de sélection
            </h2>
            <p className="text-gray-600 mb-4">
              Aucun type de document sélectionné. Veuillez revenir à l'étape
              précédente.
            </p>
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={() => setDocStep(1)}
            >
              Retour à la sélection
            </button>
          </div>
        );
      }

      // Mode mobile : capture photo
      if (isMobileCapture) {
        switch (currentPhotoStep) {
          case "before-recto":
            return <BeforePhoto setStep={() => handleStartPhotoCapture()} />;
          case "recto":
            return (
              <Photo
                onCapture={(imageData) =>
                  handlePhotoCapture(imageData, "recto")
                }
              />
            );
          case "before-verso":
            return (
              <BeforeVersoPhoto setStep={() => setCurrentPhotoStep("verso")} />
            );
          case "verso":
            return (
              <Photo
                onCapture={(imageData) =>
                  handlePhotoCapture(imageData, "verso")
                }
              />
            );
          case "confirmation":
            return (
              <PhotoConfirmation
                imageUrl={capturedImages.recto || ""}
                versoImageUrl={capturedImages.verso}
                requiresTwoSides={!!capturedImages.verso}
                onConfirm={handlePhotoConfirmation}
                onRetry={() => setCurrentPhotoStep("before-recto")}
                onRetryAfterProcessing={() =>
                  setCurrentPhotoStep("before-recto")
                }
                fileUploaded={fileUploaded}
              />
            );
          default:
            // Démarrer par défaut par 'before-recto'
            setCurrentPhotoStep("before-recto");
            return <BeforePhoto setStep={() => handleStartPhotoCapture()} />;
        }
      } else {
        // Mode desktop : upload de fichier
        return (
          <JDIDocumentUpload
            documentType={selectedDocumentType?.id || documentTypeId}
            documentTypeId={documentTypeId}
            onUpload={handleDocumentUpload}
            onBack={handleBack}
          />
        );
      }
    case 3:
      return (
        <JDIProcessing
          documentType={selectedDocumentType?.id || documentTypeId}
          onProcessingComplete={handleProcessingComplete}
          fileUploaded={fileUploaded}
          documentTypeId={documentTypeId}
          retryCount={retryCount}
        />
      );
    case 4:
      return (
        <JDISuccess
          documentType={selectedDocumentType?.id || documentTypeId}
          onContinue={handleSuccessContinue}
        />
      );
    case 5:
      return (
        <JDIError
          documentType={selectedDocumentType?.id || documentTypeId}
          onRetry={handleRetryFromError}
          onContinueAnyway={handleContinueAnyway}
          retryCount={retryCount}
          predictions={analysisData || undefined}
        />
      );
    default:
      console.error(`Invalid docStep: ${docStep}`);
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Erreur de navigation
          </h2>
          <p className="text-gray-600 mb-4">
            Étape non valide. Veuillez recommencer.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            onClick={() => setDocStep(0)}
          >
            Retour au début
          </button>
        </div>
      );
  }
};

export default DocumentCheck;
