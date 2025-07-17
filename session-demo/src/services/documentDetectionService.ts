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
      await tf.setBackend("webgl");
      await tf.ready();

      this.model = await cocoSsd.load();
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

      try {
        const predictions = await this.model.detect(videoElement);

        const documentLike = predictions.find(
          (pred) =>
            ["book", "cell phone", "tv", "laptop"].includes(pred.class) &&
            pred.score > 0.6
        );

        if (documentLike) {
          const ctx = canvasElement.getContext("2d");

          if (ctx) {
            // Get the dimensions of the detected document
            const [x, y, width, height] = documentLike.bbox;

            // Set the canvas size to match the detected area
            canvasElement.width = width;
            canvasElement.height = height;

            // Draw only the detected area on the canvas
            ctx.drawImage(
              videoElement,
              x,
              y,
              width,
              height, // Source rectangle (detected area)
              0,
              0,
              width,
              height // Destination rectangle (entire canvas)
            );

            const dataUrl = canvasElement.toDataURL("image/jpeg");

            onDocumentDetected(dataUrl);
          } else {
            console.warn(
              "[DocumentDetection] Canvas 2D context not available."
            );
          }
        } else {
          console.log("[DocumentDetection] No document-like object detected.");
        }
      } catch (err) {
        console.error("[DocumentDetection] Error during detection:", err);
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
