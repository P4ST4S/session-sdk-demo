import { useState, useEffect } from "react";

export const useStepNavigation = (
  sessionId: string,
  sessionStatus?: string
) => {
  const [step, setStepState] = useState(0);
  const [blockAutoProgress, setBlockAutoProgress] = useState(false);

  const setStep = (newStep: number) => {
    // Block automatic step changes if DocumentCheck is analyzing
    if (blockAutoProgress && newStep > step) {
      return;
    }

    setStepState(newStep);
    // Save current step to localStorage
    if (sessionId) {
      localStorage.setItem(`currentStep_${sessionId}`, String(newStep));
    }
  };

  // Initialize step from localStorage or session status
  useEffect(() => {
    if (sessionId) {
      // Check if session is already ended
      if (sessionStatus === "ended") {
        // If session is ended, go directly to end step
        // We'll set this to a high number that will be handled by the template logic
        setStepState(100); // This will be handled by the template rendering logic
        return;
      }

      // Check for saved step in localStorage
      const savedStep = localStorage.getItem(`currentStep_${sessionId}`);
      if (savedStep) {
        try {
          const stepNumber = parseInt(savedStep, 10);
          setStepState(stepNumber);
        } catch (e) {
          console.error("Failed to parse saved step:", e);
        }
      }
    }
  }, [sessionId, sessionStatus]);

  const stepObject = {
    setStep,
    step,
  };

  return {
    step,
    setStep,
    stepObject,
    blockAutoProgress,
    setBlockAutoProgress,
  };
};
