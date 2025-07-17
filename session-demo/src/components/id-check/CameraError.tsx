import React from "react";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";

interface CameraErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      {/* Error icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
      <div className="space-y-4">
        <Title className="text-xl md:text-2xl lg:text-3xl text-red-600">
          Erreur de caméra
        </Title>
        <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
          {errorMessage}
        </Subtitle>
      </div>

      {/* Retry button */}
      <div className="pt-4">
        <Button onClick={onRetry} className="w-full py-3 md:py-4">
          Réessayer
        </Button>
      </div>
    </div>
  );
};

export default CameraError;
