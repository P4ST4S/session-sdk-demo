import { useEffect, useState } from "react";
import UserInputForm from "./session/UserInputForm";
// import StartSession from "./session/StartSession";
import type { DatakeenSessionProps } from "../types/session";
import type { stepObject } from "../types/session";
import Paper from "./ui/Paper";
import { FileUpload } from "./session/FileUpload";
import StartSession from "./session/StartSession";
import type { UserInput } from "../types/userInput";
import ChooseCountryJDI from "./session/ChooseCountryJDI";

/**
 * DatakeenSession Component
 *
 * The main component of the Datakeen SDK that manages the multi-step verification flow.
 * This component handles the different steps of the session process, including:
 * - Initial welcome screen
 * - User information collection
 * - Country selection for JDI verification
 *
 * The component maintains internal state for the current step and user input data,
 * progressing through the verification workflow as the user completes each step.
 *
 * @param {DatakeenSessionProps} props - Component props
 * @param {string} props.sessionId - Unique identifier for the verification session
 * @returns {JSX.Element} A Paper-wrapped container with the appropriate step component based on current state
 */
const DatakeenSession = ({ sessionId }: DatakeenSessionProps) => {
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState<UserInput>({
    lastName: "",
    firstName: "",
    birthDate: "",
  });
  const [country, setCountry] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);
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

  // Uncomment the following useEffect if you want to log sessionId and userInput
  useEffect(() => {
    if (userInput && userInput.firstName && userInput.lastName) {
      console.log("Session ID:", sessionId);
      console.log("User Input:", userInput);
    }
  }, [sessionId, userInput]);

  useEffect(() => {
    if (country && documentType) {
      console.log("Selected Country:", country);
      console.log("Selected Document Type:", documentType);
    }
  }, [country, documentType]);

  return (
    <Paper className="w-full h-screen sm:w-[600px] sm:h-[600px] background-white rounded-lg overflow-auto sm:pt-4 sm:pb-4 z-10">
      {step === 0 && <StartSession stepObject={stepObject} />}
      {step === 1 && (
        <UserInputForm stepObject={stepObject} setUserInput={setUserInput} />
      )}
      {step === 2 && (
        <ChooseCountryJDI
          setStep={setStep}
          setCountry={setCountry}
          setDocumentType={setDocumentType}
        />
      )}
      {step === 3 && (
        <FileUpload label="Upload File" sublabel="Upload your file here" />
      )}
    </Paper>
  );
};

export default DatakeenSession;
