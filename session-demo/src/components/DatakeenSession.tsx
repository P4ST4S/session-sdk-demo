import { useState } from "react";
import UserInputForm from "./session/UserInputForm";
// import StartSession from "./session/StartSession";
import type { DatakeenSessionProps } from "../types/session";
import type { stepObject } from "../types/session";
import Paper from "./ui/Paper";
import { FileUpload } from "./session/FileUpload";
import Start from "./start-flow/Start";

const DatakeenSession = ({ sessionId }: DatakeenSessionProps) => {
  const [step, setStep] = useState(0);
  const stepObject: stepObject = {
    setStep,
    step,
  };

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Session ID is required</h1>
      </div>
    );
  }

  return (
    <Paper className="w-full h-screen sm:w-[600px] sm:h-[600px] background-white rounded-lg overflow-auto sm:pt-4 sm:pb-4 z-10">
      {step === 0 && <Start />}
      {step === 1 && <UserInputForm stepObject={stepObject} />}
      {step === 2 && (
        <FileUpload label="Upload File" sublabel="Upload your file here" />
      )}
    </Paper>
  );
};

export default DatakeenSession;
