import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Title from "./Title";
import Subtitle from "./Subtitle";
import ButtonDesktop from "./ButtonDesktop";

interface QRCodeDisplayProps {
  url: string;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onContinueOnPC?: () => void;
  showButtons?: boolean;
}

const QRCodeDisplay = ({
  url,
  title = "Scannez le QR Code",
  subtitle = "Utilisez votre téléphone pour continuer la vérification",
  onBack,
  onContinueOnPC,
  showButtons = true,
}: QRCodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;

      // Reset error state
      setQrError(null);

      // Check if URL is valid
      if (!url || url.trim() === "") {
        setQrError("URL manquante");
        return;
      }

      try {
        // Utiliser toDataURL au lieu de toCanvas pour éviter les problèmes de compatibilité
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        // Dessiner l'image sur le canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
          img.src = qrDataUrl;
        }
      } catch (error) {
        console.error("Erreur lors de la génération du QR code:", error);
        setQrError("Impossible de générer le QR code");
      }
    };

    generateQRCode();
  }, [url]);

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">{title}</Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              {subtitle}
            </Subtitle>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            {qrError ? (
              <div className="text-red-500 text-center p-4">{qrError}</div>
            ) : !url || url.trim() === "" ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center w-64 h-64">
                <div className="text-gray-500 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2"></div>
                  Génération du QR code...
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                <canvas ref={canvasRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      {showButtons && (onBack || onContinueOnPC) && (
        <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
          <div className="w-full max-w-md mx-auto">
            <div className="flex gap-3 justify-end">
              {onBack && (
                <ButtonDesktop onClick={onBack} type="back">
                  Retour
                </ButtonDesktop>
              )}
              {onContinueOnPC && (
                <ButtonDesktop onClick={onContinueOnPC} type="continue">
                  Continuer sur PC
                </ButtonDesktop>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
