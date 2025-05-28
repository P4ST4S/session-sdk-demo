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
            onCapture(imageDataUrl);
            setIsDetecting(false);
            // Stop the detection after capturing the image
            if (detectionHandlerRef) {
              detectionHandlerRef.stop();
            }
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
    <div className="relative w-full h-full">
      {cameraError ? (
        <CameraError errorMessage={cameraError} onRetry={handleRetry} />
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
  );
};

export default Photo;
