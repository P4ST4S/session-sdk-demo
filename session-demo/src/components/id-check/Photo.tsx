import { useRef, useState, useEffect } from "react";
import type { CameraOrientation } from "../../types/camera";
import { cameraService } from "../../services/cameraService";
import { documentDetectionService } from "../../services/documentDetectionService";
import CameraError from "./CameraError";
import CameraMask from "./CameraMask";
import OrientationToggle from "./OrientationToggle";

interface PhotoProps {
  onCapture: (image: string) => void;
  orientation: CameraOrientation;
}

const Photo: React.FC<PhotoProps> = ({
  onCapture,
  orientation = "landscape",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [deviceOrientation, setDeviceOrientation] =
    useState<CameraOrientation>(orientation);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      const result = await cameraService.startCamera(
        videoRef.current,
        deviceOrientation
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
  }, [deviceOrientation]);

  useEffect(() => {
    if (!isDetecting) return;

    const detectionHandler = documentDetectionService.startDocumentDetection(
      videoRef.current,
      canvasRef.current,
      (imageDataUrl) => {
        onCapture(imageDataUrl);
        setIsDetecting(false);
      }
    );

    return () => {
      detectionHandler.stop();
    };
  }, [isDetecting, onCapture]);

  const toggleOrientation = () => {
    setDeviceOrientation((prev) =>
      prev === "landscape" ? "portrait" : "landscape"
    );
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
              deviceOrientation === "landscape" ? "rotate-0" : "rotate-90"
            }`}
          />

          {/* Canvas for capture and detection */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Mask */}
          <CameraMask isDetecting={isDetecting} />

          {/* Button to change orientation */}
          <OrientationToggle onToggle={toggleOrientation} />
        </>
      )}
    </div>
  );
};

export default Photo;
