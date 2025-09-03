import type { onUploadFiles } from "../types/uploadFiles";
import { dataURLtoFile, getMimeTypeFromDataURL } from "./utils";
import { mimeTypeToExtension } from "../utils/mimeTypes";
import { apiService } from "./api";
import type { SelfieCaptureData } from "../types/selfie";

// Map pour suivre les analyses en cours et éviter les doublons
const ongoingAnalyses = new Map<string, Promise<any>>();

function createFileName(fileURL: string, prefix: string = "file") {
  const mimeType = getMimeTypeFromDataURL(fileURL);
  if (!mimeType) {
    throw new Error("Unable to determine MIME type from file URL");
  }

  const ext = mimeTypeToExtension(mimeType);
  return `${prefix}.${ext}`;
}

// Fonction pour créer une clé unique pour identifier une analyse
function createAnalysisKey(
  sessionId: string,
  files: onUploadFiles,
  documentTypeId: string
): string {
  const frontHash = files.front ? files.front.substring(0, 50) : "no-front";
  const backHash = files.back ? files.back.substring(0, 50) : "no-back";
  return `${sessionId}-${documentTypeId}-${frontHash}-${backHash}`;
}

async function launchAnalysis(
  sessionId: string,
  files: onUploadFiles,
  documentTypeId: string,
  personPhoto: string | null = null,
  save: boolean = true,
  incrementAnalysis: boolean = true,
  forceUpload: boolean = false
) {
  if (!sessionId || !files || !documentTypeId) {
    throw new Error("Invalid parameters for analysis");
  }

  const formData = new FormData();
  formData.append("sessionId", sessionId);
  formData.append("save", String(save));

  const userInputJson = localStorage.getItem(`userInput_${sessionId}`);
  if (userInputJson) {
    const userInput = JSON.parse(userInputJson);

    const fullName = `${userInput.firstName || ""} ${
      userInput.lastName || ""
    }`.trim();
    formData.append("name", fullName || "Unknown");

    formData.append("firstName", userInput.firstName || "");
    formData.append("lastName", userInput.lastName || "");
    formData.append("birthDate", userInput.birthDate || "");
  } else {
    console.error(
      "User input not found in local storage for session:",
      sessionId
    );
    throw new Error("User input not found in local storage");
  }

  const fileTypes: Record<string, string> = {};
  if (files.front) {
    const frontFileName = createFileName(files.front, "idcard_front");
    const frontFile = dataURLtoFile(files.front, frontFileName);
    formData.append("files", frontFile, frontFileName);

    const documentType = documentTypeId.includes("-")
      ? documentTypeId.split("-")[0]
      : documentTypeId;

    fileTypes[frontFileName] = documentType;
  }

  if (files.back) {
    const backFileName = createFileName(files.back, "idcard_back");
    const backFile = dataURLtoFile(files.back, backFileName);
    formData.append("files", backFile, backFileName);

    const documentType = documentTypeId.includes("-")
      ? documentTypeId.split("-")[0]
      : documentTypeId;

    fileTypes[backFileName] = documentType;
  }

  formData.append("fileTypes", JSON.stringify(fileTypes));
  formData.append("incrementAnalysis", String(incrementAnalysis));
  formData.append("forceUpload", String(forceUpload));

  if (personPhoto) {
    formData.append("personPhoto", personPhoto);
  }

  return formData;
}

export async function analyzeFiles(
  sessionId: string,
  files: onUploadFiles,
  documentTypeId: string,
  personPhoto: string | null = null,
  save: boolean = true,
  incrementAnalysis: boolean = true,
  forceUpload: boolean = false
): Promise<any> {
  // Pour les retry, on ne force pas l'upload mais on écrase l'analyse existante
  const isRetry = !incrementAnalysis && !forceUpload;

  // Créer une clé unique pour cette analyse
  const analysisKey = createAnalysisKey(sessionId, files, documentTypeId);

  // Vérifier si une analyse identique est déjà en cours
  if (ongoingAnalyses.has(analysisKey) && !isRetry) {
    console.log("🔄 Analysis already in progress, returning existing promise");
    return ongoingAnalyses.get(analysisKey);
  }

  // Créer la promesse d'analyse et la stocker
  const analysisPromise = (async () => {
    try {
      const formData = await launchAnalysis(
        sessionId,
        files,
        documentTypeId,
        personPhoto,
        save,
        // Pour les retry, on ne fait pas d'increment mais on force l'upload pour écraser
        isRetry ? false : incrementAnalysis,
        isRetry ? true : forceUpload
      );

      console.log(
        `🚀 Starting analysis - retry: ${isRetry}, sessionId: ${sessionId}`
      );

      const response = await apiService.post(
        `/backend/session/sdk/${sessionId}/analysis`,
        formData
      );

      if (!response.success) {
        throw new Error(`Analysis failed: ${response.data}`);
      }

      console.log("✅ Analysis completed successfully");
      return response.data;
    } catch (error) {
      console.error("❌ Analysis failed:", error);
      throw error;
    } finally {
      // Nettoyer la promesse de la map une fois terminée
      ongoingAnalyses.delete(analysisKey);
    }
  })();

  // Stocker la promesse pour éviter les appels simultanés
  ongoingAnalyses.set(analysisKey, analysisPromise);

  return analysisPromise;
}

export async function analyzeSelfie(
  sessionId: string,
  selfieFile: SelfieCaptureData
): Promise<any> {
  console.log("🤳 Starting selfie analysis for session:", sessionId);
  console.log("� File size:", selfieFile.media.size, "bytes");
  
  const formData = new FormData();
  formData.append("file", selfieFile.media, "selfie.mp4");

  try {
    console.log("🚀 Sending selfie to API...");
    
    const response = await apiService.post(
      `/backend/session/unissey/${sessionId}/analyze`,
      formData,
      {
        timeout: 60000, // 60 secondes pour tous
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    console.log("✅ Analysis response:", response);
    
    if (!response.success) {
      console.error("❌ Analysis failed:", response.data);
      throw new Error(`Selfie analysis failed: ${response.data}`);
    }

    return response.data;
  } catch (error) {
    console.error("💥 Analysis error:", error);
    throw error;
  }
}
