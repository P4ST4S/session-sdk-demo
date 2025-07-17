import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import ButtonDesktop from "../ui/ButtonDesktop";
import useIsMobile from "../../hooks/useIsMobile";
import { OTPInput } from "../ui/OTPInput";

interface OTPVerificationProps {
  stepObject: {
    setStep: (step: number) => void;
    step: number;
  };
  contactInfo?: {
    email: string;
    phoneNumber: string;
  };
}

const OTPVerification = ({ stepObject, contactInfo }: OTPVerificationProps) => {
  const { setStep, step } = stepObject;
  const isMobile = useIsMobile();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const verifyOTP = () => {
    setError(false);

    if (otp.length !== 6) {
      setError(true);
      return;
    }

    // Simulate OTP verification
    // In real implementation, you would call your API here

    if (otp === "123456") {
      // Bloquer l'écran avec un loader avant de naviguer
      // pour éviter le flash entre les étapes
      const loadingElement = document.createElement("div");
      loadingElement.id = "global-loading-overlay";
      loadingElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
      `;

      const spinnerElement = document.createElement("div");
      spinnerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      `;

      // Ajouter une animation
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;

      document.head.appendChild(styleElement);
      loadingElement.appendChild(spinnerElement);
      document.body.appendChild(loadingElement);

      // OTP vérifié avec succès, passer à l'étape suivante après un court délai

      // Attendre que l'animation soit visible avant de changer d'étape
      setTimeout(() => {
        setStep(step + 1);

        // Nettoyer le loader après la transition
        setTimeout(() => {
          const overlay = document.getElementById("global-loading-overlay");
          if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => {
              document.body.removeChild(overlay);
            }, 300);
          }
        }, 500);
      }, 100);
    } else {
      setError(true);
    }
  };

  const resendOTP = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsResending(false);
    setCountdown(60);
    setCanResend(false);
    setOtp("");
  };

  const goOnPreviousStep = () => {
    setStep(step - 1);
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
    setError(false);
  };

  const maskedPhone = contactInfo?.phoneNumber
    ? contactInfo.phoneNumber.replace(
        /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        "$1 $2 ** ** $5"
      )
    : "";

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Vérification du code
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Un code de vérification à 6 chiffres a été envoyé par SMS au{" "}
              {maskedPhone}
            </Subtitle>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="space-y-4">
              <OTPInput
                length={6}
                value={otp}
                onChange={handleOTPChange}
                error={error}
                className="justify-center"
              />

              {error && (
                <p className="text-red-600 text-sm text-center flex items-center justify-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Code incorrect. Veuillez réessayer.
                </p>
              )}
            </div>

            {/* Resend section */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Vous n'avez pas reçu le code ?
              </p>

              {canResend ? (
                <button
                  onClick={resendOTP}
                  disabled={isResending}
                  className="text-sm text-[#11E5C5] hover:text-[#0FC5A8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? "Envoi en cours..." : "Renvoyer le code"}
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Renvoyer dans {countdown}s
                </p>
              )}
            </div>

            {/* Test info for development */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 text-center">
                💡 Code de test : 123456
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {isMobile ? (
            /* Mobile: Single verify button */
            <Button
              onClick={verifyOTP}
              className="w-full py-3"
              disabled={otp.length !== 6}
            >
              Vérifier
            </Button>
          ) : (
            /* Desktop: Back and verify buttons */
            <div className="flex gap-3 justify-end">
              <ButtonDesktop onClick={goOnPreviousStep} type="back">
                Retour
              </ButtonDesktop>
              <ButtonDesktop
                onClick={verifyOTP}
                type="continue"
                disabled={otp.length !== 6}
              >
                Vérifier
              </ButtonDesktop>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
