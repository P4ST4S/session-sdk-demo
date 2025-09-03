import { useState, useEffect, useCallback } from "react";
import type { stepObject } from "../../types/session";
import BeforePhoto from "../id-check/BeforePhoto";
import BeforeVersoPhoto from "../id-check/BeforeVersoPhoto";
import Photo from "../id-check/Photo";
import PhotoConfirmation from "../id-check/PhotoConfirmation";
import { cameraService } from "../../services/cameraService";
import { useDocumentContext } from "../../context/DocumentContext";
import { documentTypesFromCountryId } from "../../utils/jdiCountry";
import JDIPreIntroduction from "../jdi/JDIPreIntroduction";
import JDICountrySelection from "../jdi/JDICountrySelection";
import JDIDocumentSelection from "../jdi/JDIDocumentSelection";
import JDIProcessing from "../jdi/JDIProcessing";
import JDISuccess from "../jdi/JDISuccess";
import JDIError from "../jdi/JDIError";
import type { onUploadFiles } from "../../types/uploadFiles";
import type { Prediction } from "../../utils/apiAnalysis";

interface IDCheckProps {
  stepObject: stepObject;
  documentTypeId?: string | null;
  sessionId?: string;
}

const IDCheck = ({
  stepObject,
  documentTypeId = "jdi-2",
  sessionId,
}: IDCheckProps) => {
  // Flux JDI complet : 0=pre-intro, 1=pays, 2=selection, 3=capture, 4=processing, 5=success, 6=error
  const [docStep, setDocStep] = useState(0);
  const [internalStep, setInternalStep] = useState(0); // Pour les étapes de capture photo
  const [selectedCountry, setSelectedCountry] = useState<string>("FR"); // Pays par défaut
  const [capturedRectoImage, setCapturedRectoImage] = useState<string | null>(
    null
  );
  const [capturedVersoImage, setCapturedVersoImage] = useState<string | null>(
    null
  );
  const [retryCount, setRetryCount] = useState(0);
  const [filesUploaded, setFilesUploaded] = useState<onUploadFiles>({
    front: null,
    back: null,
  });
  const [requiresTwoSides, setRequiresTwoSides] = useState(false);
  const [analysisData, setAnalysisData] = useState<Prediction[] | null>(null);

  // Use the context to get the selected document and the setter
  const { selectedDocumentType, setSelectedDocumentType } =
    useDocumentContext();

  // Monitor step changes to ensure the camera is stopped
  useEffect(() => {
    // Stop the camera during step transitions
    if (internalStep !== 1 && internalStep !== 3) {
      // Stop the camera if we're not at a photo capture step
      cameraService.stopCamera();
    }
  }, [internalStep]);

  // Determine if the document needs two sides based on the selected document type
  useEffect(() => {
    if (selectedDocumentType) {
      // Force le passeport à être recto seulement
      const isPassport = selectedDocumentType.id === "jdi-3";
      const needsTwoSides =
        !isPassport && selectedDocumentType.hasTwoSides === true;

      setRequiresTwoSides(needsTwoSides);
    } else if (documentTypeId) {
      // Fallback if context is not available
      const isPassport = documentTypeId === "jdi-3";
      setRequiresTwoSides(!isPassport);
    }
  }, [selectedDocumentType, documentTypeId]);

  // Handler pour la sélection du pays
  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setDocStep(2); // Aller à la sélection de document
  };

  // Fonction pour gérer la sélection du document
  const handleDocumentSelect = (documentId: string) => {
    // Vérifier si c'est un type de document spécial (JDD ou income-proof)
    if (documentTypeId === "jdd" || documentTypeId === "income-proof") {
      // Pour les documents spéciaux, créer un document personnalisé
      const customDoc = {
        id: documentTypeId,
        label: documentId, // Utiliser l'option sélectionnée comme label
        hasTwoSides: false, // Par défaut, ces documents n'ont pas besoin de verso
      };

      setSelectedDocumentType(customDoc);
      setDocStep(3); // Aller directement à la capture
      return;
    }

    // Traitement pour les documents d'identité - recherche par correspondance de label
    const documents = documentTypesFromCountryId(selectedCountry.toLowerCase());
    let selectedDoc = null;

    // Recherche directe par documentId d'abord
    selectedDoc = documents.find((doc) => doc.id === documentId);

    if (!selectedDoc) {
      // Si pas trouvé, recherche par correspondance de label
      let mappedId = "";
      if (documentId === "national_id") {
        mappedId = "jdi-2"; // Carte d'identité - Format carte
      } else if (documentId === "passport") {
        mappedId = "jdi-3"; // Passeport biométrique
      } else if (documentId === "driving_license") {
        mappedId = "jdi-5"; // Permis de conduire - Format carte
      } else if (documentId === "residence_permit") {
        mappedId = "jdi-4"; // Titre de séjour
      }
      // Recherche par nom complet du document
      else if (documentId.toLowerCase().includes("passeport")) {
        mappedId = "jdi-3"; // Passeport biométrique
      } else if (
        documentId.toLowerCase().includes("carte nationale") ||
        documentId.toLowerCase().includes("cni")
      ) {
        mappedId = "jdi-2"; // Carte d'identité
      } else if (documentId.toLowerCase().includes("permis")) {
        mappedId = "jdi-5"; // Permis de conduire
      } else if (documentId.toLowerCase().includes("titre de séjour")) {
        mappedId = "jdi-4"; // Titre de séjour
      } else if (documentId.toLowerCase().includes("vitale")) {
        mappedId = "jdi-1"; // Carte Vitale
      }

      if (mappedId) {
        selectedDoc = documents.find((doc) => doc.id === mappedId);
      }
    }

    if (selectedDoc) {
      // Mettre à jour le contexte avec le document sélectionné
      setSelectedDocumentType(selectedDoc);
      // Aller à l'étape de capture
      setDocStep(3);
      setInternalStep(0);
    } else {
      // En cas d'échec, créer un document par défaut
      const fallbackDoc = {
        id: "jdi-2", // Carte d'identité par défaut
        label: documentId,
        hasTwoSides: true,
      };
      setSelectedDocumentType(fallbackDoc);
      setDocStep(3);
      setInternalStep(0);
    }
  };

  const onCaptureRecto = (image: string) => {
    setCapturedRectoImage(image);
    setFilesUploaded((prev) => ({ ...prev, front: image }));
    if (requiresTwoSides) {
      setInternalStep(2);
    } else {
      setInternalStep(4);
    }
  };

  const onCaptureVerso = (image: string) => {
    setCapturedVersoImage(image);
    setFilesUploaded((prev) => ({ ...prev, back: image }));
    setInternalStep(4);
  };

  const handleConfirm = () => {
    // Make sure the camera is properly stopped
    cameraService.stopCamera();

    // Convertir les images en fichiers pour le processing
    setFilesUploaded({
      front: capturedRectoImage,
      back: capturedVersoImage && requiresTwoSides ? capturedVersoImage : null,
    });

    // Reset retry count only for new capture (not retry)
    if (retryCount === 0) {
      setRetryCount(0);
    }

    // Aller à l'étape de processing pour lancer l'analyse
    setDocStep(4);
  };

  const handleRetry = () => {
    // Make sure the camera is properly stopped
    cameraService.stopCamera();

    // Reset all captured images and return to the first photo instruction
    setCapturedRectoImage(null);
    setCapturedVersoImage(null);
    setInternalStep(0);
  };

  const handleRetryAfterProcessing = useCallback(() => {
    setRetryCount(retryCount + 1); // Increment retry count
    // Make sure the camera is properly stopped
    cameraService.stopCamera();

    setCapturedRectoImage(null);
    setCapturedVersoImage(null);
    setDocStep(3); // Retourner à la capture
    setInternalStep(0);
  }, [retryCount]);

  const handleContinueAnyway = useCallback(() => {
    // Continue to next step in the main flow even with error
    stepObject.setStep(stepObject.step + 1);
  }, [stepObject]);

  const handleProcessingComplete = useCallback(
    (success: boolean, currentRetryCount?: number, analysisApiData?: unknown) => {
      // Extraire les predictions de la réponse API
      let predictions: Prediction[] = [];
      if (analysisApiData && typeof analysisApiData === 'object') {
        const response = analysisApiData as { data?: { analysisResult?: { job_status?: { predictions?: Prediction[] } } } };
        // Naviguer dans la structure: data.analysisResult.job_status.predictions
        predictions = response?.data?.analysisResult?.job_status?.predictions || [];
      }
      
      setAnalysisData(predictions);
      
      if (success) {
        setRetryCount(0); // Reset retry count on success
        setDocStep(5); // success
      } else {
        // Toujours aller à l'écran d'erreur avec le retryCount actuel du state
        setDocStep(6); // error
      }
    },
    [retryCount]
  );

  const handleSuccessContinue = useCallback(() => {
    // Move to the next step in the workflow
    stepObject.setStep(stepObject.step + 1);
  }, [stepObject]);

  const handleErrorRetry = useCallback(() => {
    setRetryCount(retryCount + 1); // Increment retry count
    // Reset et retourner au début du processus de capture
    setCapturedRectoImage(null);
    setCapturedVersoImage(null);
    setDocStep(3); // Retourner à la capture
    setInternalStep(0);
  }, [retryCount]);

  const handleBackToUserInput = useCallback(() => {
    // Retour à l'étape 2 qui correspond à UserInputForm (étape d'informations d'identité)
    stepObject.setStep(2);
  }, [stepObject]);

  // Gérer le retour en arrière
  const handleBack = () => {
    if (docStep > 0) {
      setDocStep(docStep - 1);
    } else {
      stepObject.setStep(stepObject.step - 1);
    }
  };

  // Rendu basé sur docStep (flux JDI complet avec pays)
  switch (docStep) {
    case 0:
      return (
        <JDIPreIntroduction
          documentTypeId={documentTypeId as string}
          onContinue={() => setDocStep(1)}
          onBack={handleBack}
        />
      );

    case 1:
      return (
        <JDICountrySelection
          onCountrySelect={handleCountrySelect}
          onBack={handleBack}
          documentTypeId={documentTypeId as string}
        />
      );

    case 2:
      return (
        <JDIDocumentSelection
          onDocumentSelect={handleDocumentSelect}
          onBack={handleBack}
          documentTypeId={documentTypeId as string}
          sessionId={sessionId as string}
        />
      );

    case 3:
      // Étape de capture photo mobile
      switch (internalStep) {
        case 0:
          return <BeforePhoto setStep={setInternalStep} />;

        case 1:
          return <Photo onCapture={onCaptureRecto} />;

        case 2:
          return requiresTwoSides ? (
            <BeforeVersoPhoto setStep={setInternalStep} />
          ) : null;

        case 3:
          return requiresTwoSides ? <Photo onCapture={onCaptureVerso} /> : null;

        case 4:
          return (
            <PhotoConfirmation
              imageUrl={capturedRectoImage || ""}
              versoImageUrl={capturedVersoImage || undefined}
              requiresTwoSides={requiresTwoSides}
              onConfirm={handleConfirm}
              onRetry={handleRetry}
              onRetryAfterProcessing={handleRetryAfterProcessing}
              fileUploaded={filesUploaded}
            />
          );

        default:
          return <BeforePhoto setStep={setInternalStep} />;
      }

    case 4:
      return (
        <JDIProcessing
          documentType={selectedDocumentType?.id || (documentTypeId as string)}
          onProcessingComplete={handleProcessingComplete}
          fileUploaded={filesUploaded}
          documentTypeId={documentTypeId as string}
          retryCount={retryCount}
        />
      );

    case 5:
      return (
        <JDISuccess
          documentType={selectedDocumentType?.id || (documentTypeId as string)}
          onContinue={handleSuccessContinue}
        />
      );

    case 6:
      return (
        <JDIError
          documentType={selectedDocumentType?.id || (documentTypeId as string)}
          onRetry={handleErrorRetry}
          onContinueAnyway={handleContinueAnyway}
          onBackToUserInput={handleBackToUserInput}
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
            Recommencer
          </button>
        </div>
      );
  }
};

export default IDCheck;
