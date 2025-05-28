import type { CameraConstraints, CameraFacingMode } from "../types/camera";

// Permit to enable development mode to test without a camera
const DEV_MODE = false; //import.meta.env.DEV;
// Default image path for development mode
const DEFAULT_TEST_IMAGE = "/mock-id-card.jpeg";

export class CameraService {
  private stream: MediaStream | null = null;
  private devMode: boolean = DEV_MODE;
  private mockImagePath: string = DEFAULT_TEST_IMAGE;

  private async startMockCamera(
    videoElement: HTMLVideoElement | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!videoElement) {
        return { success: false, error: "Élément vidéo non disponible" };
      }

      // Create an image element to load the mock image
      const img = new Image();
      img.src = this.mockImagePath;

      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(
            new Error(`Impossible de charger l'image: ${this.mockImagePath}`)
          );
      });

      // Create a canvas to convert the image into a video stream
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return { success: false, error: "Contexte du canvas non disponible" };
      }

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Create a video stream from the canvas
      // @ts-ignore - The captureStream property is not recognized by TypeScript
      const stream = canvas.captureStream(30);
      this.stream = stream;

      // Assign the stream to the video element
      videoElement.srcObject = stream;

      return { success: true };
    } catch (err) {
      console.error("Erreur lors de la création du flux vidéo mock:", err);
      return {
        success: false,
        error: `Erreur lors de la création du flux vidéo mock: ${
          err instanceof Error ? err.message : String(err)
        }`,
      };
    }
  }

  async startCamera(
    videoElement: HTMLVideoElement | null,
    orientation: boolean,
    facingMode: CameraFacingMode = "environment"
  ): Promise<{ success: boolean; error?: string }> {
    // If development mode is enabled, use a mock image instead of the camera
    if (this.devMode) {
      return this.startMockCamera(videoElement);
    }

    try {
      const constraints: CameraConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: orientation ? 1920 : 1080 },
          height: { ideal: orientation ? 1080 : 1920 },
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoElement) {
        videoElement.srcObject = this.stream;
      }

      return { success: true };
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra:", err);
      let errorMessage =
        "Une erreur inconnue s'est produite lors de l'accès à la caméra.";

      if (err instanceof DOMException) {
        if (err.name === "NotFoundError") {
          errorMessage = "Aucune caméra n'a été détectée sur votre appareil.";
        } else if (err.name === "NotAllowedError") {
          errorMessage =
            "L'accès à la caméra a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
        } else {
          errorMessage = `Impossible d'accéder à la caméra: ${err.message}`;
        }
      }

      return { success: false, error: errorMessage };
    }
  }

  captureFrame(
    videoElement: HTMLVideoElement | null,
    canvasElement: HTMLCanvasElement | null
  ): string | null {
    if (!videoElement || !canvasElement || !videoElement.videoWidth) {
      return null;
    }

    const ctx = canvasElement.getContext("2d");
    if (!ctx) return null;

    // Set canvas dimensions to match the video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Draw the video frame onto the canvas
    ctx.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    // Return the data URL of the canvas
    return canvasElement.toDataURL("image/jpeg");
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  // Méthode pour activer/désactiver le mode développement
  setDevMode(enabled: boolean): void {
    this.devMode = enabled;
  }

  // Méthode pour définir l'image de test à utiliser
  setMockImage(imagePath: string): void {
    this.mockImagePath = imagePath;
  }

  // Vérifie si le mode développement est activé
  isDevModeEnabled(): boolean {
    return this.devMode;
  }
}

// Create a singleton instance of the camera service
export const cameraService = new CameraService();
