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
        );

      detectionHandlerRef = detectionHandler;
    };

    startDetection();

    return () => {
      if (detectionHandlerRef) {
        detectionHandlerRef.stop();
      }
    };
  }, [isDetecting, onCapture]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleRetry = () => {
    window.location.reload();
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

            {/* Mask */}
            <CameraMask
              isDetecting={isDetecting}
              isPortrait={isPortrait}
              facingMode={facingMode}
            />

            {/* Button to change orientation */}
            <OrientationToggle onCameraToggle={toggleCamera} />
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
