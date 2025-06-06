import React, { useState } from "react";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import PhotoProcessingLoader from "./PhotoProcessingLoader";

interface PhotoConfirmationProps {
  imageUrl: string;
  versoImageUrl?: string;
  requiresTwoSides?: boolean;
  onConfirm: () => void;
  onRetry: () => void;
  onRetryAfterProcessing: () => void;
}

const PhotoConfirmation: React.FC<PhotoConfirmationProps> = ({
  imageUrl,
  versoImageUrl = "",
  requiresTwoSides = false,
  onConfirm,
  onRetry,
  onRetryAfterProcessing,
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
      />
    );
  }

  return (
    <div className="relative flex justify-center w-full px-4 pt-8 pb-[140px] overflow-y-auto lg:flex-col">
      <div className="flex flex-col mt-4 mx-auto w-full max-w-[322px]">
        <div className="flex flex-col items-center mx-auto">
          <Title className="mb-5 sm:mb-2">
            {requiresTwoSides
              ? "Confirmation des photos"
              : "Confirmation de la photo"}
          </Title>
          <Subtitle>
            Vérifiez que votre document est bien visible et lisible avant de
            continuer
          </Subtitle>
        </div>
        {/* Display the captured image(s) */}
        <div className="w-full flex flex-col gap-4 my-4 mt-8">
          {/* Recto image */}
          <div className="w-full">
            <div className="flex flex-col">
              <div
                className="self-start bg-[#11E5C5] text-white py-1 px-4 z-10 text-sm font-medium shadow-md border-4 border-b-0 border-[#11E5C5] mb-[-3px]"
                style={{
                  borderTopLeftRadius: "0.375rem",
                  borderTopRightRadius: "0.375rem",
                }}
              >
                Recto
              </div>
              <div
                className="overflow-hidden border-3 border-[#11E5C5] lg:flex lg:items-center lg:justify-center"
                style={{ borderRadius: "0.5rem", borderTopLeftRadius: "0" }}
              >
                <img
                  src={imageUrl}
                  alt="Document recto"
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Verso image - only show if in two-sided mode and we have a verso image */}
          {requiresTwoSides && versoImageUrl && (
            <div className="w-full">
              <div className="flex flex-col">
                <div
                  className="self-start bg-[#11E5C5] text-white py-1 px-4 z-10 text-sm font-medium shadow-md border-4 border-b-0 border-[#11E5C5] mb-[-3px]"
                  style={{
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                  }}
                >
                  Verso
                </div>
                <div
                  className="overflow-hidden border-3 border-[#11E5C5] lg:flex lg:items-center lg:justify-center"
                  style={{ borderRadius: "0.5rem", borderTopLeftRadius: "0" }}
                >
                  <img
                    src={versoImageUrl}
                    alt="Document verso"
                    className="w-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] pt-4 bg-white">
        {/* Buttons for confirmation or retry */}
        <div className="flex flex-col gap-3 w-full mb-4">
          <Button onClick={handleConfirm} className="w-full">
            Confirmer
          </Button>
          <button
            onClick={onRetry}
            className="text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline"
          >
            Reprendre la photo
          </button>
        </div>
        <div className="pb-4">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
};

export default PhotoConfirmation;
