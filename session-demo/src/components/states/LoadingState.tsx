import React from "react";

interface LoadingStateProps {
  message?: string;
  subtitle?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Chargement de la session...",
  subtitle = "Préparation des étapes de vérification",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary mb-4"></div>
      <p className="mt-4 text-gray-600 font-medium text-lg animate-pulse">
        {message}
      </p>
      <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
    </div>
  );
};

export default LoadingState;
