export type CameraFacingMode = "environment" | "user";

export interface CameraConstraints {
  video: {
    facingMode: CameraFacingMode;
    width: { ideal: number };
    height: { ideal: number };
  };
}

export interface CameraError {
  type: string;
  message: string;
}
