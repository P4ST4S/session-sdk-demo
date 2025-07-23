import { useEffect } from "react";
import type { SelfieCaptureData } from "../../types/selfie";
import "./Video.css";
import "./VideoFixes.css";
import SelfieFlow from "./selfie-flow/SelfieFlow";
import VideoResetStyles from "./VideoResetStyles";

interface VideoProps {
  setSelfieData: (selfieData: SelfieCaptureData) => void;
  setStep: (step: number) => void;
  onBack?: () => void;
}

const Video = ({ setSelfieData, setStep, onBack }: VideoProps) => {
  // Effet pour ajouter la classe au body lorsque le composant est monté
  useEffect(() => {
    // Empêcher le scroll sur le body lorsque la capture est active
    document.body.classList.add("selfie-active");

    // Ajouter une classe pour gérer le plein écran sur mobile
    document.documentElement.classList.add("selfie-fullscreen");

    return () => {
      // Nettoyer en enlevant les classes lors du démontage
      document.body.classList.remove("selfie-active");
      document.documentElement.classList.remove("selfie-fullscreen");
    };
  }, []);

  const handleSelfie = (e: Event) => {
    const data = (e as CustomEvent<SelfieCaptureData>).detail;

    // Attendre un court instant avant de passer à l'écran de confirmation
    // pour donner le temps à l'utilisateur de voir que la capture est terminée
    setTimeout(() => {
      setSelfieData(data);
      setStep(1); // Move to the next step after selfie capture
    }, 300);
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <VideoResetStyles />
      <SelfieFlow handleSelfie={handleSelfie} onBack={onBack} />
    </div>
  );
};

export default Video;
