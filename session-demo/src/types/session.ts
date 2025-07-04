import type React from "react";

export interface DatakeenSessionProps {
  sessionId: string;
}

export interface UseSessionReturn {
  SessionComponent: React.ReactElement;
}

export type stepObject = {
  setStep: (step: number) => void;
  step: number;
};

export interface ProcessingStep {
  title: string;
  subtitle: string;
  hasError?: boolean;
}
