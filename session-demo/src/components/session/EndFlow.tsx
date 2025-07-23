import React, { useState } from "react";
import type { stepObject } from "../../types/session";
import checkIcon from "../../assets/check.svg";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import { updateSessionStatus } from "../../services/sessionService";

interface EndFlowProps {
  stepObject: stepObject;
  sessionId: string;
  sessionStatus?: string; // Ajout du statut de session optionnel
}

/**
 * EndFlow Component
 *
 * Composant affiché à la fin du flux de vérification lorsque toutes les étapes ont été complétées.
 * Affiche un message de confirmation avec une icône de succès.
 *
 * @param {EndFlowProps} props - Propriétés du composant
 * @param {stepObject} props.stepObject - Objet contenant l'état actuel et les fonctions de changement d'étape
 * @param {string} props.sessionId - L'identifiant de la session
 * @param {string} props.sessionStatus - Le statut actuel de la session
 * @returns {JSX.Element} Le composant EndFlow
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EndFlow: React.FC<EndFlowProps> = ({
  stepObject,
  sessionId,
  sessionStatus,
}) => {
  const [isEnding, setIsEnding] = useState(false);

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      // Si la session n'est pas encore terminée, la marquer comme terminée
      if (sessionStatus !== "ended") {
        await updateSessionStatus(sessionId, "ended");
      }

      // Nettoyer le localStorage pour cette session
      localStorage.removeItem(`currentStep_${sessionId}`);
      localStorage.removeItem(`userInput_${sessionId}`);
      localStorage.removeItem(`contactInfo_${sessionId}`);

      // Forcer la fermeture immédiatement
      closeWindow();
    } catch (error) {
      console.error("Erreur lors de la finalisation de la session:", error);
      // En cas d'erreur, essayer quand même de fermer la fenêtre
      closeWindow();
    } finally {
      setIsEnding(false);
    }
  };

  const closeWindow = () => {
    console.log("Tentative de fermeture de la fenêtre...");

    // Méthode 1: Si dans un iframe, communiquer avec le parent IMMÉDIATEMENT
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          {
            action: "closeSession",
            sessionId,
            status: "ended",
            message: "Session terminée, veuillez fermer cette fenêtre",
          },
          "*"
        );
        console.log("Message envoyé au parent pour fermeture");
      } catch (e) {
        console.log("postMessage échoué:", e);
      }
    }

    // Méthode 2: Essayer window.close() avec différentes approches
    try {
      // Essayer close direct
      window.close();
      console.log("window.close() direct appelé");
    } catch (e) {
      console.log("window.close() direct échoué:", e);
    }

    // Méthode 3: Si on a un opener, essayer de se fermer via l'opener
    setTimeout(() => {
      try {
        if (window.opener) {
          window.opener.focus();
          window.close();
          console.log("Fermeture via opener");
        }
      } catch (e) {
        console.log("Fermeture via opener échouée:", e);
      }
    }, 100);

    // Méthode 4: Forcer avec self.close()
    setTimeout(() => {
      try {
        self.close();
        console.log("self.close() appelé");
      } catch (e) {
        console.log("self.close() échoué:", e);
      }
    }, 200);

    // Méthode 5: Essayer de manipuler l'historique pour forcer la fermeture
    setTimeout(() => {
      try {
        window.history.back();
        window.close();
        console.log("history.back() + close");
      } catch (e) {
        console.log("history.back() + close échoué:", e);
      }
    }, 300);

    // Méthode 6: Rediriger vers une page de fermeture personnalisée
    setTimeout(() => {
      try {
        // Créer une URL de données avec un script de fermeture automatique
        const closeScript = `
          <html>
            <head><title>Session terminée</title></head>
            <body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
              <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;text-align:center;">
                <h1 style="color:#4ade80;margin-bottom:20px;">✅ Session terminée avec succès</h1>
                <p style="color:#666;margin-bottom:30px;">Cette fenêtre va se fermer automatiquement.</p>
                <button onclick="attemptClose()" style="background:#3b82f6;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-size:16px;">
                  Fermer maintenant
                </button>
              </div>
              <script>
                function attemptClose() {
                  try {
                    window.close();
                    self.close();
                    if (window.opener) {
                      window.opener.focus();
                      window.close();
                    }
                    if (window.parent && window.parent !== window) {
                      window.parent.postMessage({action:'closeWindow'}, '*');
                    }
                  } catch(e) {
                    console.log('Fermeture impossible:', e);
                    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h2>Veuillez fermer cette fenêtre manuellement</h2><p>Appuyez sur Alt+F4 ou cliquez sur le X</p></div>';
                  }
                }
                // Essayer de fermer automatiquement après 1 seconde
                setTimeout(attemptClose, 1000);
              </script>
            </body>
          </html>
        `;
        const dataUrl =
          "data:text/html;charset=utf-8," + encodeURIComponent(closeScript);
        window.location.replace(dataUrl);
        console.log("Redirection vers page de fermeture personnalisée");
      } catch (e) {
        console.log("Redirection vers page personnalisée échouée:", e);
      }
    }, 500);
  };
  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          {/* Icon - shown on top for both mobile and desktop */}
          <div className="flex justify-center">
            <img
              src={checkIcon}
              alt="Vérification terminée"
              className="w-48 h-48"
            />
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              C'est tout bon !
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Merci d'avoir soumis vos documents, vous pouvez quitter cette
              fenêtre.
            </Subtitle>
          </div>
        </div>
      </div>

      {/* Button area - sticky on mobile, inline on desktop */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={handleEndSession}
            disabled={isEnding}
            className="w-full py-3 md:py-4"
          >
            {isEnding ? "Finalisation..." : "Terminer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndFlow;
