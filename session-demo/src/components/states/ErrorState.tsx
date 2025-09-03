import React from "react";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-red-600 mb-2">
        Erreur de chargement
      </h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        onClick={onRetry || (() => window.location.reload())}
      >
        Réessayer
      </button>
    </div>
  );
};

export default ErrorState;
