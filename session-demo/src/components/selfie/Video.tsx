import { SelfieCapture, FR, AcquisitionPreset } from "@unissey-web/sdk-react";
import type { SelfieCaptureData } from "../../types/selfie";

const customFR = {
  ...FR.selfieCapture,
  title: "Capturez votre selfie",
  recordBtnLabel: "Prendre le selfie",
  recorder: {
    ...FR.selfieCapture.recorder,
    capture: "Capturez votre selfie",
    recordBtnLabel: "Prendre le selfie",
  },
};

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

  return (
    <SelfieCapture
      onRecordCompleted={handleSelfie}
      recorderOptions={{
        preset: AcquisitionPreset.SELFIE_OPTIMIZED,
      }}
      strings={customFR}
      disableDebugMode={true}
      hideCapturePrevBtn={true}
    />
  );
};

export default Video;
