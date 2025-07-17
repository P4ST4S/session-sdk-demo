import React from "react";
import Button from "../ui/Button";
import shieldIcon from "../../assets/icons/shield_magic_link.svg";

interface SessionExpiredProps {
  onRetry?: () => void;
}

/**
 * SessionExpired Component
 *
 * Displays a session expired message with a retry button
 */
const SessionExpired: React.FC<SessionExpiredProps> = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="mb-6">
        <img src={shieldIcon} alt="Session expirée" />
      </div>
      <h2 className="text-2xl font-bold text-red-600 mb-4">Session expirée</h2>
      <p className="text-gray-600 mb-6">
        Cette session n'est plus valide, veuillez recommencer.
      </p>
      <Button onClick={handleRetry} className="w-full">
        Réessayer
      </Button>
    </div>
  );
};

export default SessionExpired;
