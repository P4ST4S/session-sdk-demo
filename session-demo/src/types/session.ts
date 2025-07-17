import type React from "react";

export interface SessionConfig {
  selfie?: boolean;
  requireMobile?: boolean;
}

export interface DatakeenSessionProps {
  sessionId: string;
  sessionConfig?: SessionConfig;
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
