import React from "react";

interface CameraErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-red-600 p-4 rounded-lg max-w-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4"
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
        <h3 className="text-xl font-bold mb-2">Erreur de caméra</h3>
        <p>{errorMessage}</p>
        <button
          onClick={onRetry}
          className="mt-4 bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-100"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
};

export default CameraError;
