import React from "react";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";

interface PhotoConfirmationProps {
  imageUrl: string;
  onConfirm: () => void;
  onRetry: () => void;
}

const PhotoConfirmation: React.FC<PhotoConfirmationProps> = ({
  imageUrl,
  onConfirm,
  onRetry,
}) => {
  return (
    <div className="relative flex justify-content w-full px-4 pt-8 pb-[80px] overflow-hidden">
      <div className="flex flex-col gap-5 mt-4 mx-auto w-full max-w-[322px]">
        <div className="flex flex-col items-center mx-auto">
          <Title className="mb-5 sm:mb-2">Confirmation de la photo</Title>
          <Subtitle>
            Vérifiez que votre document est bien visible et lisible avant de
            continuer
          </Subtitle>
        </div>
        {/* Display the captured image */}
        <div className="w-full flex justify-center my-4">
          <div className="relative overflow-hidden rounded-lg border-2 border-[#11E5C5]">
            <img
              src={imageUrl}
              alt="Document capturé"
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        {/* Buttons for confirmation or retry */}
        <div className="flex flex-col gap-3 w-full mb-4">
          <Button onClick={onConfirm} className="w-full">
            Confirmer
          </Button>
          <button
            onClick={onRetry}
            className="text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline"
          >
            Reprendre la photo
          </button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default PhotoConfirmation;
