export type CameraOrientation = "landscape" | "portrait";

export interface CameraConstraints {
  video: {
    facingMode: string;
    width: { ideal: number };
    height: { ideal: number };
  };
}

export interface CameraError {
  type: string;
  message: string;
}
