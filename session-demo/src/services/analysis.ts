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
  fileTypes: string,
  personPhoto: string | null = null,
  save: boolean = true,
  incrementAnalysis: boolean = true,
  forceUpload: boolean = false
) {
  if (!sessionId || !files || !fileTypes) {
    throw new Error("Invalid parameters for analysis");
  }

  const formData = new FormData();
  formData.append("sessionId", sessionId);
  formData.append("save", save as any); // send boolean value directely, any is required

  const userInputJson = localStorage.getItem(`userInput_${sessionId}`);
  if (userInputJson) {
    const userInput = JSON.parse(userInputJson);

    formData.append("firstName", userInput.firstName || "");
    formData.append("lastName", userInput.lastName || "");
    formData.append("birthDate", userInput.birthDate || "");
  } else {
    throw new Error("User input not found in local storage");
  }

  // stock files in formData key "files"
  if (files.front) {
    const frontFileName = createFileName(files.front, "front");
    const frontFile = dataURLtoFile(files.front, frontFileName);
    formData.append("files", frontFile, frontFileName);
  }
  if (files.back) {
    const backFileName = createFileName(files.back, "back");
    const backFile = dataURLtoFile(files.back, backFileName);
    formData.append("files", backFile, backFileName);
  }

  formData.append("fileTypes", fileTypes);
  formData.append("incrementAnalysis", incrementAnalysis as any); // send boolean value directely, any is required
  formData.append("forceUpload", forceUpload as any); // send boolean value directely, any is required

  if (personPhoto) {
    formData.append("personPhoto", personPhoto);
  }

  return formData;
}

export async function analyzeFiles(
  sessionId: string,
  files: onUploadFiles,
  fileTypes: string,
  personPhoto: string | null = null,
  save: boolean = true,
  incrementAnalysis: boolean = true,
  forceUpload: boolean = false
): Promise<void> {
  const formData = await launchAnalysis(
    sessionId,
    files,
    fileTypes,
    personPhoto,
    save,
    incrementAnalysis,
    forceUpload
  );

  try {
    console.log("CALL apiService.post", `/${sessionId}/analysis`, formData);
    const response = await apiService.post(`/${sessionId}/analysis`, formData);
    if (!response.success) {
      throw new Error(`Analysis failed: ${response.data}`);
    }
    console.log("Analysis launched successfully:", response.data);
  } catch (error) {
    console.error("Error launching analysis:", error);
    throw error;
  }
}
