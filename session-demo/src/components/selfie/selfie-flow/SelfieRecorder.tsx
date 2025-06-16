import { AcquisitionPreset, VideoRecorder } from "@unissey-web/sdk-react";
import { useRef, useState, useEffect } from "react";
import Button from "../../ui/Button";
import PoweredBy from "../../ui/PoweredBy";

import "../Video.css";

interface SelfieRecorderProps {
  handleSelfie: (e: Event) => void;
}

const SelfieRecorder = ({ handleSelfie }: SelfieRecorderProps) => {
  const recorderRef = useRef<any>(null);
  const [disableButton, setDisableButton] = useState(false);

  // Ajouter et supprimer la classe 'recording-selfie' sur le body
  useEffect(() => {
    // Ajouter la classe au body lors du montage du composant
    document.body.classList.add("recording-selfie");

    // Nettoyer en supprimant la classe lors du démontage du composant
    return () => {
      document.body.classList.remove("recording-selfie");
    };
  }, []);

  const recordStarting = () => {
    if (recorderRef.current && recorderRef.current.capture) {
      recorderRef.current.capture();
      setDisableButton(true);
    } else {
      console.error(
        "La méthode capture n'est pas disponible ou la référence est null"
      );
    }
  };

  return (
    <div className="selfie flex flex-col h-screen max-h-screen w-full overflow-hidden fixed inset-0">
      <div className="video-container flex-grow flex items-center justify-center">
        <VideoRecorder
          ref={recorderRef}
          preset={AcquisitionPreset.SELFIE_OPTIMIZED}
          hideCaptureBtn
          faceChecker="enabled"
          disableDebugMode
          onRecorderReady={() => console.log("Enregistreur prêt")}
          onRecordCompleted={handleSelfie}
          onRecord={recordStarting}
        />
      </div>

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button
            onClick={recordStarting}
            className="w-full"
            disabled={disableButton}
          >
            {disableButton ? "En cours..." : "Commencer"}
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default SelfieRecorder;
