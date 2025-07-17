import { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import QRCodeDisplay from "../ui/QRCodeDisplay";

interface MobileRedirectProps {
  sessionId: string;
  children?: React.ReactNode;
  onBack?: () => void;
  onContinueOnPC?: () => void;
}

const MobileRedirect = ({
  sessionId,
  children,
  onBack,
  onContinueOnPC,
}: MobileRedirectProps) => {
  const isMobile = useIsMobile();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Only generate URL if sessionId is available
    if (!sessionId) return;

    // Generate the mobile URL with the session ID
    const baseUrl = window.location.origin + window.location.pathname;
    const url = new URL(baseUrl);
    url.searchParams.set("sessionId", sessionId);
    url.searchParams.set("mobile", "true");
    const mobileUrl = url.toString();

    setCurrentUrl(mobileUrl);
  }, [sessionId]);

  // If the user is on mobile, show the normal session flow
  if (isMobile) {
    return <>{children || null}</>;
  }

  // If the user is on desktop, show the QR code redirect
  return (
    <QRCodeDisplay
      url={currentUrl}
      title="Continuer sur mobile"
      subtitle="Scannez ce QR code pour continuer la vérification d'identité sur votre smartphone."
      onBack={onBack}
      onContinueOnPC={onContinueOnPC}
    />
  );
};

export default MobileRedirect;
