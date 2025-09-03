import { useRef, useState, useEffect } from "react";
import type { CameraFacingMode } from "../../types/camera";
import { cameraService } from "../../services/cameraService";
import { documentDetectionService } from "../../services/documentDetectionService";
import CameraError from "./CameraError";
import CameraMask from "./CameraMask";
import OrientationToggle from "./OrientationToggle";

interface PhotoProps {
  onCapture: (image: string) => void;
}

const Photo: React.FC<PhotoProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [facingMode, setFacingMode] = useState<CameraFacingMode>("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );
  const [autoCaptureTrigger] = useState(true); // Controls auto-capture behavior

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    const mediaQuery = window.matchMedia("(orientation: portrait)");
    mediaQuery.addEventListener("change", handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    const initCamera = async () => {
      const result = await cameraService.startCamera(
        videoRef.current,
        isPortrait,
        facingMode
      );

      if (result.success) {
        setIsDetecting(true);
      } else if (result.error) {
        setCameraError(result.error);
        setIsDetecting(false);
      }
    };

    initCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      cameraService.stopCamera();
      setIsDetecting(false);

      // Make sure to stop any ongoing detection
      documentDetectionService.stopDocumentDetection();
    };
  }, [isPortrait, facingMode]);

  useEffect(() => {
    if (!isDetecting) return;

    let detectionHandlerRef: { stop: () => void } | null = null;

    const startDetection = async () => {
      const detectionHandler =
        await documentDetectionService.startDocumentDetection(
          videoRef.current,
          canvasRef.current,
          (imageDataUrl) => {
            if (autoCaptureTrigger && imageDataUrl) {
              // Stop the detection and camera BEFORE calling onCapture
              setIsDetecting(false);

              // Stop the detection after capturing the image
              if (detectionHandlerRef) {
                detectionHandlerRef.stop();
              }

              // Make sure to stop the camera to turn off the camera LED
              cameraService.stopCamera();

              // Only then call onCapture to proceed to next step
              onCapture(imageDataUrl);
            }
            // Note: Manual capture is always available via button regardless of auto mode
          },
          true // Always enable auto-detection for document analysis
        );

      detectionHandlerRef = detectionHandler;
    };

    startDetection();

    return () => {
      if (detectionHandlerRef) {
        detectionHandlerRef.stop();
      }
    };
  }, [isDetecting, onCapture, autoCaptureTrigger]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const calculateMaskCoordinates = () => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Validation des dimensions vidéo
    if (videoWidth === 0 || videoHeight === 0) {
      console.warn('Video dimensions not ready:', { videoWidth, videoHeight });
      return null;
    }

    // Détection d'orientation plus robuste basée sur les dimensions réelles de la vidéo
    const videoIsPortrait = videoHeight > videoWidth;
    
    // Utiliser l'orientation de la vidéo plutôt que l'orientation de l'écran
    // car parfois il peut y avoir un décalage
    const effectiveIsPortrait = videoIsPortrait;

    // Calculate mask dimensions based on the same logic as CameraMask component
    const maskWidthRatio = effectiveIsPortrait ? 0.8 : 0.6; // w-4/5 or w-3/5
    const aspectRatio = 3 / 2; // aspect-[3/2]

    // Calculate mask dimensions with validation
    const maskWidth = Math.round(videoWidth * maskWidthRatio);
    const maskHeight = Math.round(maskWidth / aspectRatio);

    // Validation des dimensions du masque
    if (maskWidth <= 0 || maskHeight <= 0) {
      console.warn('Invalid mask dimensions:', { maskWidth, maskHeight });
      return null;
    }

    // Center the mask with validation
    const maskX = Math.round((videoWidth - maskWidth) / 2);
    const maskY = Math.round((videoHeight - maskHeight) / 2);

    // S'assurer que le masque ne dépasse pas les limites de la vidéo
    const finalX = Math.max(0, Math.min(maskX, videoWidth - maskWidth));
    const finalY = Math.max(0, Math.min(maskY, videoHeight - maskHeight));
    const finalWidth = Math.min(maskWidth, videoWidth - finalX);
    const finalHeight = Math.min(maskHeight, videoHeight - finalY);

    console.log('Mask coordinates calculated:', {
      video: { width: videoWidth, height: videoHeight },
      orientation: { screen: isPortrait, video: videoIsPortrait, effective: effectiveIsPortrait },
      mask: { x: finalX, y: finalY, width: finalWidth, height: finalHeight },
      ratio: maskWidthRatio
    });

    return {
      x: finalX,
      y: finalY,
      width: finalWidth,
      height: finalHeight
    };
  };

  const handleManualCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    // Calculate mask coordinates
    const maskCoords = calculateMaskCoordinates();
    if (!maskCoords) {
      console.error('Could not calculate mask coordinates');
      return;
    }

    try {
      // Set canvas size to match the cropped area (mask dimensions)
      canvas.width = maskCoords.width;
      canvas.height = maskCoords.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle camera flip for front camera
      if (facingMode === "user") {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }

      // Draw only the masked area to canvas
      ctx.drawImage(
        video,
        maskCoords.x, maskCoords.y, maskCoords.width, maskCoords.height, // Source rectangle (masked area)
        0, 0, maskCoords.width, maskCoords.height // Destination rectangle (entire canvas)
      );

      // Restore context if we flipped it
      if (facingMode === "user") {
        ctx.restore();
      }

      // Convert to data URL with high quality
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

      // Validation de l'image générée
      if (!dataUrl || dataUrl === "data:,") {
        console.error('Failed to generate image data URL');
        return;
      }

      console.log('Manual capture successful:', {
        dimensions: { width: canvas.width, height: canvas.height },
        maskCoords,
        facingMode,
        dataUrlLength: dataUrl.length
      });

      // Stop detection and camera
      setIsDetecting(false);
      cameraService.stopCamera();
      documentDetectionService.stopDocumentDetection();

      // Call onCapture with the cropped image
      onCapture(dataUrl);
    } catch (error) {
      console.error('Error during manual capture:', error);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Camera content area */}
      <div className="flex-1 relative overflow-hidden">
        {cameraError ? (
          <div className="flex items-center justify-center h-full px-4 py-6">
            <CameraError errorMessage={cameraError} onRetry={handleRetry} />
          </div>
        ) : (
          <>
            {/* Livestream of the camera*/}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover z-0 ${
                facingMode === "user" ? "scale-x-[-1]" : ""
              }`}
            />
            {/* Canvas for capture and detection */}
            <canvas ref={canvasRef} className="hidden" />
            {/* Autocapture active tag */}
            {/* Tag Autocapture activée - Simple et clignotant */}
            <div className="absolute top-4  left-1/2 transform -translate-x-1/2 z-50">
              <span className="text-white z-50 text-sm font-semibold animate-pulse drop-shadow-lg">
                Autocapture activée
              </span>
            </div>{" "}
            {/* Mask */}
            <CameraMask
              isDetecting={isDetecting}
              isPortrait={isPortrait}
              facingMode={facingMode}
            />
            {/* Manual capture instructions */}
            <div className="absolute bottom-20 left-0 right-0 z-20 pointer-events-none">
              <div className="text-center px-4">
                <div className="bg-black bg-opacity-60 text-white text-sm px-4 py-2 rounded-lg inline-block">
                  Positionnez le document
                </div>
              </div>
            </div>
            {/* Button to change orientation */}
            <OrientationToggle onCameraToggle={toggleCamera} />
          </>
        )}
      </div>

      {/* Controls at the bottom */}
      <div className="relative z-20 bg-black bg-opacity-80 p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Manual capture button - always available */}
          <button
            onClick={handleManualCapture}
            disabled={!isDetecting}
            className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all bg-transparent hover:bg-white hover:bg-opacity-20 ${
              !isDetecting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </button>

          {/* Status message */}
          <div className="text-white text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#11E5C5] rounded-full animate-pulse"></div>
              <span>Capture automatique active ou appuyez sur le bouton</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
