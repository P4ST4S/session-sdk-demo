import type { SelfieCaptureData } from "../../types/selfie";
import "./Video.css";
import SelfieFlow from "./selfie-flow/SelfieFlow";

interface VideoProps {
  setSelfieData: (selfieData: SelfieCaptureData) => void;
  setStep: (step: number) => void;
}

const Video = ({ setSelfieData, setStep }: VideoProps) => {
  const handleSelfie = (e: Event) => {
    const data = (e as CustomEvent<SelfieCaptureData>).detail;

    console.log("Selfie captured - media type:", data.media.type);
    console.log("Selfie captured - media size:", data.media.size);

    setSelfieData(data);
    setStep(1); // Move to the next step after selfie capture
  };

  return <SelfieFlow handleSelfie={handleSelfie} />;
};

export default Video;
