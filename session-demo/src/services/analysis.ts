import type { onUploadFiles } from "../types/uploadFiles";
import { dataURLtoFile, getMimeTypeFromDataURL } from "./utils";
import { mimeTypeToExtension } from "../utils/mimeTypes";
import { apiService } from "./api";

function createFileName(fileURL: string, prefix: string = "file") {
  const mimeType = getMimeTypeFromDataURL(fileURL);
  if (!mimeType) {
    throw new Error("Unable to determine MIME type from file URL");
  }

  const ext = mimeTypeToExtension(mimeType);
  return `${prefix}.${ext}`;
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
  formData.append("save", save as any);

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
    throw new Error("User input not found in local storage");
  }

  // ... reste de votre code identique

  const fileTypes: Record<string, string> = {};
  if (files.front) {
    const frontFileName = createFileName(files.front, "idcard_front");
    const frontFile = dataURLtoFile(files.front, frontFileName);
    formData.append("files", frontFile, frontFileName);
    console.log("Front file structure:", {
      name: frontFile.name,
      originalname: (frontFile as any).originalname,
      type: frontFile.type,
      mimetype: (frontFile as any).mimetype,
      size: frontFile.size,
    });

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
  formData.append("incrementAnalysis", incrementAnalysis as any);
  formData.append("forceUpload", forceUpload as any);

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
  const formData = await launchAnalysis(
    sessionId,
    files,
    documentTypeId,
    personPhoto,
    save,
    incrementAnalysis,
    forceUpload
  );

  try {
    const response = await apiService.post(`/${sessionId}/analysis`, formData);
    if (!response.success) {
      throw new Error(`Analysis failed: ${response.data}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error launching analysis:", error);
    throw error;
  }
}
