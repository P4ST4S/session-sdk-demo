/**
 * Service for document detection in video/image captures
 */
export class DocumentDetectionService {
  private animationFrameId: number | null = null;
  private detectionTimeout: number | null = null;

  /**
   * Detects a document in the video feed
   * This is a simulated detection for demo purposes
   */
  startDocumentDetection(
    videoElement: HTMLVideoElement | null,
    canvasElement: HTMLCanvasElement | null,
    onDocumentDetected: (imageDataUrl: string) => void
  ): { stop: () => void } {
    this.stopDocumentDetection();

    const detectDocument = () => {
      if (!videoElement || !canvasElement || !videoElement.videoWidth) {
        this.animationFrameId = requestAnimationFrame(detectDocument);
        return;
      }

      const video = videoElement;
      const canvas = canvasElement;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Here you could implement a document detection algorithm
      // For this demo, we're simulating detection after a random delay
      if (this.detectionTimeout) {
        clearTimeout(this.detectionTimeout);
      }

      this.detectionTimeout = window.setTimeout(() => {
        const dataUrl = canvas.toDataURL("image/jpeg");
        onDocumentDetected(dataUrl);
        this.stopDocumentDetection();
      }, 2000 + Math.random() * 3000); // Between 2 and 5 seconds

      this.animationFrameId = requestAnimationFrame(detectDocument);
    };

    detectDocument();

    return {
      stop: () => this.stopDocumentDetection(),
    };
  }

  stopDocumentDetection() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.detectionTimeout) {
      clearTimeout(this.detectionTimeout);
      this.detectionTimeout = null;
    }
  }
}

// Create a singleton instance
export const documentDetectionService = new DocumentDetectionService();
