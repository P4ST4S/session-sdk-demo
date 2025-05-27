/**
 * @file StartSession.tsx
 * @description This component manages the initial steps of the user verification session flow.
 * It handles the logic for displaying either the Start screen or CGU (Conditions Générales d'Utilisation)
 * based on the current step state.
 *
 * @component StartSession
 *
 * @props {stepObject} stepObject - Object containing step management functions from the parent component,
 *                                 primarily the setStep function to control the overall verification flow.
 *
 * @state {number} startStep - Tracks the current step within the start flow (0 = Start screen, 1 = CGU screen).
 *
 * @behavior
 * - On mobile devices: The first step (Start) transitions to the CGU screen within this component
 * - On desktop devices: The first step transitions directly to the next main step in the parent component
 * - The CGU screen always transitions to the next main step in the parent component
 *
 * @flow
 * 1. User sees the Start screen (startStep === 0)
 * 2. After clicking to proceed:
 *    - If on mobile: User sees the CGU screen (startStep === 1)
 *    - If on desktop: User proceeds directly to the next main step
 * 3. After accepting the CGUs, user proceeds to the next main step
 *
 * @dependencies
 * - useIsMobile - Custom hook to detect if the user is on a mobile device
 * - Start - Component for the initial welcome screen
 * - CGU - Component for displaying terms and conditions
 *
 * @example
 * <StartSession stepObject={{ setStep: (step) => setCurrentStep(step) }} />
 */

// import QrCodeRedirect from "./QrCodeRedirect";
import { useState } from "react";
import type { stepObject } from "../../types/session";
import Start from "../start-flow/Start";
import CGU from "../start-flow/CGU";
import useIsMobile from "../../hooks/useIsMobile";

const StartSession = ({ stepObject }: { stepObject: stepObject }) => {
  const isMobile = useIsMobile();
  const { setStep } = stepObject;
  const [startStep, setStartStep] = useState(0);

  return (
    <>
      {startStep === 0 && <Start setStep={isMobile ? setStartStep : setStep} />}
      {startStep === 1 && <CGU setStep={setStep} />}
    </>
  );
};

export default StartSession;
