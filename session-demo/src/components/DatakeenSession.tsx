import { useEffect, useState } from "react";
import UserInputForm from "./session/UserInputForm";
// import StartSession from "./session/StartSession";
import type { DatakeenSessionProps } from "../types/session";
import type { stepObject } from "../types/session";
import Paper from "./ui/Paper";
import { FileUpload } from "./session/FileUpload";
import StartSession from "./session/StartSession";
import type { UserInput } from "../types/userInput";

const DatakeenSession = ({ sessionId }: DatakeenSessionProps) => {
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState<UserInput>({
    lastName: "",
    firstName: "",
    birthDate: "",
  });
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

  useEffect(() => {
    if (userInput && userInput.firstName && userInput.lastName) {
      console.log("Session ID:", sessionId);
      console.log("User Input:", userInput);
    }
  }, [sessionId, userInput]);

  return (
    <Paper className="w-full h-screen sm:w-[600px] sm:h-[600px] background-white rounded-lg overflow-auto sm:pt-4 sm:pb-4 z-10">
      {step === 0 && <StartSession stepObject={stepObject} />}
      {step === 1 && (
        <UserInputForm stepObject={stepObject} setUserInput={setUserInput} />
      )}
      {step === 2 && (
        <FileUpload label="Upload File" sublabel="Upload your file here" />
      )}
    </Paper>
  );
};

export default DatakeenSession;
