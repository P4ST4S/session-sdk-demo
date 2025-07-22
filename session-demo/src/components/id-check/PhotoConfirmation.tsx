import React, { useState } from "react";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import PhotoProcessingLoader from "./PhotoProcessingLoader";
import ButtonDesktop from "../ui/ButtonDesktop";
import type { onUploadFiles } from "../../types/uploadFiles";

interface PhotoConfirmationProps {
  imageUrl: string;
  versoImageUrl?: string;
  requiresTwoSides?: boolean;
  onConfirm: () => void;
  onRetry: () => void;
  onRetryAfterProcessing: () => void;
  fileUploaded: onUploadFiles | null;
}

const PhotoConfirmation: React.FC<PhotoConfirmationProps> = ({
  imageUrl,
  versoImageUrl = "",
  requiresTwoSides = false,
  onConfirm,
  onRetry,
  onRetryAfterProcessing,
  fileUploaded,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    // Call the original onConfirm callback after processing is complete
    onConfirm();
  };

  const handleRetryAfterProcessing = () => {
    onRetryAfterProcessing();
  };

  if (isProcessing) {
    return (
      <PhotoProcessingLoader
        onProcessingComplete={handleProcessingComplete}
        onRetry={handleRetryAfterProcessing}
        filesUploaded={fileUploaded}
      />
    );
  }

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              {requiresTwoSides
                ? "Confirmation des photos"
                : "Confirmation de la photo"}
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              Vérifiez que votre document est bien visible et lisible avant de
              continuer
            </Subtitle>
          </div>

          {/* Display the captured image(s) */}
          <div className="w-full flex flex-col gap-6">
            {/* Recto image */}
            <div className="w-full">
              <div className="mb-2">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  Recto
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Document recto"
                  className="w-full h-48 md:h-56 object-contain bg-white"
                />
              </div>
            </div>

            {/* Verso image - only show if in two-sided mode and we have a verso image */}
            {requiresTwoSides && versoImageUrl && (
              <div className="w-full">
                <div className="mb-2">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    Verso
                  </span>
                </div>
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img
                    src={versoImageUrl}
                    alt="Document verso"
                    className="w-full h-48 md:h-56 object-contain bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button onClick={handleConfirm} className="w-full py-3">
              Confirmer
            </Button>
            <button
              onClick={onRetry}
              className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
            >
              Reprendre la photo
            </button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-end">
            <ButtonDesktop onClick={onRetry} type="back">
              Reprendre la photo
            </ButtonDesktop>
            <ButtonDesktop onClick={handleConfirm} type="continue">
              Confirmer
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoConfirmation;
