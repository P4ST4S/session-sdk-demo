import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export class DocumentDetectionService {
  private animationFrameId: number | null = null;
  private detectionTimeoutId: number | null = null;
  private model: cocoSsd.ObjectDetection | null = null;
  private isDetecting = false;
  private readonly DETECTION_INTERVAL_MS = 1000; // <--- delay between detections

  async loadModel() {
    if (!this.model) {
      console.log("[DocumentDetection] Initialisation du backend...");
      await tf.setBackend("webgl");
      await tf.ready();
      console.log(
        "[DocumentDetection] Backend prêt, chargement du modèle coco-ssd..."
      );
      this.model = await cocoSsd.load();
      console.log("[DocumentDetection] Modèle chargé avec succès.");
    }
  }

  async startDocumentDetection(
    videoElement: HTMLVideoElement | null,
    canvasElement: HTMLCanvasElement | null,
    onDocumentDetected: (imageDataUrl: string) => void
  ): Promise<{ stop: () => void }> {
    this.stopDocumentDetection();
    await this.loadModel();

    const detect = async () => {
      if (
        !videoElement ||
        !canvasElement ||
        !this.model ||
        !videoElement.videoWidth ||
        this.isDetecting
      ) {
        this.scheduleNextDetection(detect);
        return;
      }

      this.isDetecting = true;
      console.log("[DocumentDetection] Lancement d'une nouvelle détection...");

      try {
        const predictions = await this.model.detect(videoElement);
        console.log("[DocumentDetection] Prédictions :", predictions);

        const documentLike = predictions.find(
          (pred) =>
            ["book", "cell phone", "tv", "laptop"].includes(pred.class) &&
            pred.score > 0.6
        );

        if (documentLike) {
          console.log("[DocumentDetection] Document détecté :", documentLike);
          const ctx = canvasElement.getContext("2d");

          if (ctx) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            ctx.drawImage(
              videoElement,
              0,
              0,
              canvasElement.width,
              canvasElement.height
            );

            ctx.strokeStyle = "#11E5C5";
            ctx.lineWidth = 4;
            ctx.strokeRect(
              documentLike.bbox[0],
              documentLike.bbox[1],
              documentLike.bbox[2],
              documentLike.bbox[3]
            );

            const dataUrl = canvasElement.toDataURL("image/jpeg");
            console.log(
              "[DocumentDetection] Image capturée, appel du callback."
            );
            onDocumentDetected(dataUrl);
          } else {
            console.warn(
              "[DocumentDetection] Contexte 2D du canvas non disponible."
            );
          }
        } else {
          console.log("[DocumentDetection] Aucun objet document-like détecté.");
        }
      } catch (err) {
        console.error("[DocumentDetection] Erreur pendant la détection :", err);
      }

      this.isDetecting = false;
      this.scheduleNextDetection(detect);
    };

    detect();

    return {
      stop: () => this.stopDocumentDetection(),
    };
  }

  private scheduleNextDetection(callback: () => void) {
    if (this.detectionTimeoutId) clearTimeout(this.detectionTimeoutId);
    this.detectionTimeoutId = window.setTimeout(
      callback,
      this.DETECTION_INTERVAL_MS
    );
  }

  stopDocumentDetection() {
    console.log("[DocumentDetection] Arrêt de la détection.");
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.detectionTimeoutId) {
      clearTimeout(this.detectionTimeoutId);
      this.detectionTimeoutId = null;
    }
  }
}

export const documentDetectionService = new DocumentDetectionService();
