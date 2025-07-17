import { AcquisitionPreset, VideoRecorder } from "@unissey-web/sdk-react";
import { useRef, useState, useEffect } from "react";
import Button from "../../ui/Button";
import Title from "../../ui/Title";
import Subtitle from "../../ui/Subtitle";
import useVideoRecorderStyles from "../hooks/useVideoRecorderStyles";
import { setupVideoElementsObserver } from "../utils/videoElementStyles";

import "../Video.css";
import "../Button.css";

interface SelfieRecorderProps {
  handleSelfie: (e: Event) => void;
  onBeginCapture?: () => void;
  isCapturing?: boolean;
}

interface VideoRecorderRef extends HTMLElement {
  capture: () => void;
}

const SelfieRecorder = ({
  handleSelfie,
  onBeginCapture = () => {},
  isCapturing = false,
}: SelfieRecorderProps) => {
  const recorderRef = useRef<VideoRecorderRef | null>(null);
  const [disableButton, setDisableButton] = useState(false);
  const [recorderReady, setRecorderReady] = useState(false);
  const [recordingState, setRecordingState] = useState<
    "idle" | "preparing" | "recording" | "processing"
  >("idle");

  // Utiliser le hook personnalisé pour injecter des styles CSS spécifiques
  useVideoRecorderStyles();

  // Ajouter et supprimer la classe 'recording-selfie' sur le body
  useEffect(() => {
    // Ajouter la classe au body lors du montage du composant
    document.body.classList.add("recording-selfie");

    // Configurer l'observateur pour les éléments vidéo
    const cleanupObserver = setupVideoElementsObserver();

    // Nettoyer en supprimant la classe lors du démontage du composant
    return () => {
      document.body.classList.remove("recording-selfie");
      cleanupObserver(); // Nettoyer l'observateur
    };
  }, []);

  // Réagir aux changements d'état de capture externes
  useEffect(() => {
    if (isCapturing && recordingState === "idle") {
      setRecordingState("preparing");
      setDisableButton(true);

      // Lancer la capture après un délai
      setTimeout(() => {
        setRecordingState("recording");
        if (recorderRef.current && recorderRef.current.capture) {
          recorderRef.current.capture();
        }
      }, 500);
    }
  }, [isCapturing, recordingState]);

  const recordStarting = () => {
    if (!recorderReady) {
      return;
    }

    // Notifier le composant parent que la capture commence
    onBeginCapture();

    setRecordingState("preparing");
    setDisableButton(true);

    // Ajouter un délai de 500ms pour donner le temps à l'utilisateur de se préparer
    setTimeout(() => {
      setRecordingState("recording");
      if (recorderRef.current && recorderRef.current.capture) {
        recorderRef.current.capture();
      } else {
        console.error(
          "La méthode capture n'est pas disponible ou la référence est null"
        );
      }
    }, 500);
  };

  const handleRecorderReady = () => {
    setRecorderReady(true);
  };

  const handleRecordCompleted = (e: Event) => {
    setRecordingState("processing");
    handleSelfie(e);
  };

  return (
    <div
      className="selfie flex flex-col h-full w-full overflow-hidden"
      style={{ borderRadius: 0 }}
    >
      {/* En-tête avec instructions */}
      <div className="p-4 text-center">
        <Title className="text-lg md:text-xl mb-1">Prenez votre selfie</Title>
        <Subtitle className="text-xs text-gray-600 md:text-sm">
          Placez votre visage au centre du cadre et regardez l'appareil
        </Subtitle>
      </div>

      {/* Conteneur vidéo avec overlay - prend tout l'espace disponible */}
      <div
        className="video-container flex-grow relative flex items-center justify-center overflow-hidden"
        style={{ borderRadius: 0, background: "transparent !important" }}
      >
        {/* Indicateur d'état de l'enregistrement */}
        {recordingState === "recording" && (
          <div className="absolute top-4 right-4 z-10 flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
            <span className="text-white text-sm">Enregistrement...</span>
          </div>
        )}

        {/* Le conteneur du VideoRecorder prend tout l'espace disponible */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            borderRadius: 0,
            background: "transparent !important",
          }}
        >
          <VideoRecorder
            // Le TypeScript ne peut pas inférer correctement le type pour la prop ref du VideoRecorder
            // @ts-expect-error - Le type attendu par VideoRecorder n'est pas explicitement exposé
            ref={recorderRef}
            preset={AcquisitionPreset.SELFIE_OPTIMIZED}
            hideCaptureBtn
            faceChecker="enabled"
            disableDebugMode
            onRecorderReady={handleRecorderReady}
            onRecordCompleted={handleRecordCompleted}
            onRecord={recordStarting}
            style={{
              borderRadius: "0 !important",
              background: "transparent !important",
              width: "100%",
              height: "100%",
            }}
            className="video-recorder-no-radius w-full h-full"
          />
        </div>
      </div>

      {/* Barre d'instructions et bouton */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 md:p-6">
        <div className="max-w-md mx-auto">
          <Button
            onClick={recordStarting}
            className="w-full py-3 md:py-4 relative selfie-button"
            disabled={disableButton || !recorderReady}
          >
            {recordingState === "idle" && "Prendre mon selfie"}
            {recordingState === "preparing" && "Préparation..."}
            {recordingState === "recording" && (
              <span className="flex items-center justify-center">
                <span className="mr-2">Enregistrement</span>
                <span className="flex space-x-1 loading-dots">
                  <span className="h-1 w-1 bg-white rounded-full"></span>
                  <span className="h-1 w-1 bg-white rounded-full"></span>
                  <span className="h-1 w-1 bg-white rounded-full"></span>
                </span>
              </span>
            )}
            {recordingState === "processing" && "Traitement..."}
          </Button>

          {/* Instructions supplémentaires */}
          <div className="text-center text-xs text-gray-400 mt-3">
            Assurez-vous d'être dans un environnement bien éclairé
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfieRecorder;
