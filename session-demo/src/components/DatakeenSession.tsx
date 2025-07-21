import { useEffect, useState } from "react";
import UserInputForm from "./session/UserInputForm";
import type { DatakeenSessionProps } from "../types/session";
import type { stepObject } from "../types/session";
import Paper from "./ui/Paper";
import StartSession from "./session/StartSession";
import type { UserInput } from "../types/userInput";
import type { ContactInfo } from "../types/contactInfo";
import { DocumentProvider } from "../context/DocumentContext";
import Selfie from "./session/Selfie";
import MobileRedirect from "./session/MobileRedirect";
import ContactInfoForm from "./session/ContactInfoForm";
import OTPVerification from "./session/OTPVerification";
import useIsMobile from "../hooks/useIsMobile";
import PoweredBy from "./ui/PoweredBy";
import DocumentCheck from "./session/DocumentCheck";
import SessionExpired from "./session/SessionExpired";
import EndFlow from "./session/EndFlow";
import {
  fetchSessionById,
  hasSelfieCaptureStep,
  isSessionExpired,
  type SessionData,
  updateSessionUserInput,
  updateSessionContactInfo,
  storeDocumentOptions,
  getOrderedWorkflowSteps,
} from "../services/sessionService";

/**
 * DatakeenSession Component
 *
 * The main component of the Datakeen SDK that manages the multi-step verification flow.
 * This component handles the different steps of the session process, including:
 * - Initial welcome screen
 * - User information collection
 * - Country selection for JDI verification
 * - Mobile redirect when selfie is required
 *
 * The component maintains internal state for the current step and user input data,
 * progressing through the verification workflow as the user completes each step.
 *
 * @param {DatakeenSessionProps} props - Component props
 * @param {string} props.sessionId - Unique identifier for the verification session
 * @param {SessionConfig} props.sessionConfig - Configuration for the session (e.g., selfie: true)
 * @returns {JSX.Element} A Paper-wrapped container with the appropriate step component based on current state
 */
const DatakeenSession = ({
  sessionId,
  sessionConfig,
}: DatakeenSessionProps) => {
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState<UserInput>({
    lastName: "",
    firstName: "",
    birthDate: "",
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phoneNumber: "",
  });

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const isMobile = useIsMobile();
  const stepObject: stepObject = {
    setStep: (newStep: number) => {
      setStep(newStep);
      // Save current step to localStorage
      if (sessionId) {
        localStorage.setItem(`currentStep_${sessionId}`, String(newStep));
      }
    },
    step,
  };

  // Fetch session data on component mount
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) return;
      localStorage.setItem("sessionId", sessionId);

      setLoading(true);
      try {
        const sessionData = await fetchSessionById(sessionId);
        setSession(sessionData);

        // Check if session is expired
        if (isSessionExpired(sessionData)) {
          setIsExpired(true);
          setLoading(false);
          return;
        }

        // Initialize configuration based on session template
        if (sessionData.template) {
          // Récupérer tous les nœuds du template
          const templateNodes = sessionData.template.nodes;

          // Stocker les options de documents pour chaque type dans localStorage
          templateNodes.forEach((node) => {
            if (
              node.type === "document-selection" &&
              node.requiredDocumentType &&
              node.selectedOptions.length > 0
            ) {
              // Utiliser la nouvelle fonction pour stocker les options
              storeDocumentOptions(
                sessionId,
                node.requiredDocumentType,
                node.selectedOptions
              );
            }
          });

          // Check if we have saved user input in localStorage
          const savedUserInput = localStorage.getItem(`userInput_${sessionId}`);
          if (savedUserInput) {
            try {
              const parsedUserInput = JSON.parse(savedUserInput);

              // Only set the state if the data is complete
              if (
                parsedUserInput.firstName &&
                parsedUserInput.lastName &&
                parsedUserInput.birthDate
              ) {
                setUserInput(parsedUserInput);
              }
            } catch (e) {
              console.error("Failed to parse saved user input:", e);
            }
          }
          // If no localStorage data but user input exists in session data, use that instead
          else if (
            sessionData.userInput &&
            Object.keys(sessionData.userInput).length > 0
          ) {
            // Ensure we have at least the minimal fields before setting state
            if (
              sessionData.userInput.firstName &&
              sessionData.userInput.lastName
            ) {
              setUserInput((prev) => ({
                ...prev,
                ...sessionData.userInput,
              }));
            }
          }

          // Check if we have saved contact info in localStorage
          const savedContactInfo = localStorage.getItem(
            `contactInfo_${sessionId}`
          );
          if (savedContactInfo) {
            try {
              const parsedContactInfo = JSON.parse(savedContactInfo);

              // Only set the state if we have complete data
              if (parsedContactInfo.email && parsedContactInfo.phoneNumber) {
                setContactInfo(parsedContactInfo);
              }
            } catch (e) {
              console.error("Failed to parse saved contact info:", e);
            }
          }
          // If no localStorage data but contact info exists in session data, use that instead
          else if (
            sessionData.contactInfo &&
            Object.keys(sessionData.contactInfo).length > 0
          ) {
            // Ensure we have at least the minimal fields before setting state
            if (
              sessionData.contactInfo.email &&
              sessionData.contactInfo.phoneNumber
            ) {
              setContactInfo((prev) => ({
                ...prev,
                ...sessionData.contactInfo,
              }));
            }
          }

          // Check if we have a saved step in localStorage
          const savedStep = localStorage.getItem(`currentStep_${sessionId}`);
          if (savedStep) {
            try {
              const stepNumber = parseInt(savedStep, 10);
              setStep(stepNumber);
            } catch (e) {
              console.error("Failed to parse saved step:", e);
            }
          }
        }

        setError(null);
      } catch (err) {
        console.error("Failed to load session:", err);
        setError("Failed to load session data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, sessionConfig]);

  // Function to retry loading the session
  const handleRetrySession = async () => {
    setIsExpired(false);
    setLoading(true);
    setError(null);

    try {
      const sessionData = await fetchSessionById(sessionId);

      if (isSessionExpired(sessionData)) {
        setIsExpired(true);
      } else {
        setSession(sessionData);
        // Reset to initial step
        setStep(0);
      }
    } catch (err) {
      console.error("Failed to retry loading session:", err);
      setError("Failed to load session data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Session ID is required</h1>
      </div>
    );
  }

  // Effect to ensure userInput is properly initialized from localStorage at component mount
  useEffect(() => {
    if (sessionId) {
      const savedUserInput = localStorage.getItem(`userInput_${sessionId}`);
      if (savedUserInput) {
        try {
          const parsedUserInput = JSON.parse(savedUserInput);

          // Only update if we have meaningful data
          if (parsedUserInput.firstName && parsedUserInput.lastName) {
            setUserInput(parsedUserInput);
          }
        } catch (e) {
          console.error(
            "Failed to parse saved user input during initialization:",
            e
          );
        }
      }

      const savedContactInfo = localStorage.getItem(`contactInfo_${sessionId}`);
      if (savedContactInfo) {
        try {
          const parsedContactInfo = JSON.parse(savedContactInfo);

          // Only update if we have meaningful data
          if (parsedContactInfo.email && parsedContactInfo.phoneNumber) {
            setContactInfo(parsedContactInfo);
          }
        } catch (e) {
          console.error(
            "Failed to parse saved contact info during initialization:",
            e
          );
        }
      }
    }
  }, [sessionId]);

  // Effect to handle userInput changes and persist to backend and localStorage
  useEffect(() => {
    if (userInput && userInput.firstName && userInput.lastName) {
      // Save to localStorage for persistence
      localStorage.setItem(`userInput_${sessionId}`, JSON.stringify(userInput));

      // Update userInput in the backend when user input changes
      const updateUserData = async () => {
        if (
          sessionId &&
          userInput.firstName &&
          userInput.lastName &&
          userInput.birthDate
        ) {
          try {
            const updatedSession = await updateSessionUserInput(sessionId, {
              firstName: userInput.firstName,
              lastName: userInput.lastName,
              birthDate: userInput.birthDate,
            });

            // Update the local session data with the updated data from the server
            setSession(updatedSession);
          } catch (err) {
            console.error("Failed to update user input:", err);
          }
        }
      };

      updateUserData();
    }
  }, [sessionId, userInput]); // Effect to handle contactInfo changes and persist to localStorage and backend
  useEffect(() => {
    if (contactInfo && contactInfo.email && contactInfo.phoneNumber) {
      // Save to localStorage for persistence
      localStorage.setItem(
        `contactInfo_${sessionId}`,
        JSON.stringify(contactInfo)
      );

      // Update contactInfo in the backend when contact info changes
      const updateContactData = async () => {
        if (sessionId && contactInfo.email && contactInfo.phoneNumber) {
          try {
            const updatedSession = await updateSessionContactInfo(sessionId, {
              email: contactInfo.email,
              phoneNumber: contactInfo.phoneNumber,
            });

            // Update the local session data with the updated data from the server
            setSession(updatedSession);
          } catch (err) {
            console.error("Failed to update contact info:", err);
          }
        }
      };

      updateContactData();
    }
  }, [contactInfo, sessionId]);

  // Effect to periodically check if the session has expired while the user is active
  useEffect(() => {
    if (!session || isExpired) return;

    // Check immediately upon receiving session data
    if (isSessionExpired(session)) {
      setIsExpired(true);
      return;
    }

    // Set up a periodic check every 30 seconds
    const checkExpirationInterval = setInterval(() => {
      if (session && isSessionExpired(session)) {
        setIsExpired(true);
        clearInterval(checkExpirationInterval);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(checkExpirationInterval);
    };
  }, [session, isExpired]);

  // Fonction pour rendre un nœud du template en composant React
  const renderTemplateNode = (templateIndex: number) => {
    if (!session?.template) {
      console.error("No template found in session");
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Erreur de configuration
          </h2>
          <p className="text-gray-600 mb-4">
            Aucun template trouvé pour cette session.
          </p>
        </div>
      );
    }

    // Utiliser la fonction getOrderedWorkflowSteps pour obtenir les nœuds triés et filtrés
    const templateNodes = getOrderedWorkflowSteps(session.template);

    // Vérifier si l'index est valide
    if (templateNodes.length === 0) {
      console.warn("No valid template nodes found after filtering");
      return <EndFlow stepObject={stepObject} />;
    }

    if (templateIndex < 0 || templateIndex >= templateNodes.length) {
      console.warn(
        `Invalid template index: ${templateIndex}, max index: ${
          templateNodes.length - 1
        }`
      );

      // Si nous sommes au-delà de l'index maximum, cela signifie que nous avons terminé tous les nœuds
      // Afficher un écran de succès
      if (templateIndex >= templateNodes.length) {
        return <EndFlow stepObject={stepObject} />;
      }

      // Si l'index est négatif, rediriger vers l'étape précédente
      if (templateIndex < 0) {
        // Rediriger vers l'étape OTP (3)
        setTimeout(() => stepObject.setStep(3), 0);
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement de l'étape...</p>
          </div>
        );
      }
    }

    // À ce stade, nous devrions avoir un nœud valide
    const node = templateNodes[templateIndex];
    if (!node) {
      console.error(
        `Node at index ${templateIndex} is undefined. Available nodes:`,
        templateNodes
      );
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Erreur de rendu
          </h2>
          <p className="text-gray-600 mb-4">
            Impossible de trouver le nœud pour cette étape.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            onClick={() => stepObject.setStep(0)}
          >
            Recommencer
          </button>
        </div>
      );
    }

    // Déterminer quel composant afficher en fonction du type de nœud
    switch (node.type) {
      case "end":
        return <EndFlow stepObject={stepObject} />;
      case "document-selection":
        if (!node.requiredDocumentType) {
          console.error(
            "Missing requiredDocumentType in document-selection node:",
            node
          );
          return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-600 mb-2">
                Erreur de configuration
              </h2>
              <p className="text-gray-600 mb-4">
                Le type de document requis n'est pas spécifié dans le template.
              </p>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                onClick={() => stepObject.setStep(0)}
              >
                Recommencer
              </button>
            </div>
          );
        }

        return (
          <DocumentCheck
            key={`doc-check-${node.id}-${templateIndex}`}
            stepObject={stepObject}
            sessionId={sessionId}
            documentTypeId={node.requiredDocumentType}
            onContinueOnPC={() => {
              // Passer à l'étape suivante du template s'il y en a une, sinon terminer
              if (templateIndex < templateNodes.length - 1) {
                // +4 car les 4 premières étapes sont fixes (welcome, user-input, contact-info, otp)
                const nextStep = 4 + templateIndex + 1;
                stepObject.setStep(nextStep);
              } else {
                // Dernière étape, terminer le processus
                // Si nous avons un nœud "end" dans le template, on va l'afficher
                // Le nœud "end" sera le nœud avec l'index le plus élevé après tri
                const endNode = session.template.nodes.find(
                  (node) => node.type === "end"
                );
                if (endNode) {
                  // Nous continuons au nœud suivant qui sera le nœud "end"
                  stepObject.setStep(4 + templateIndex + 1);
                } else {
                  stepObject.setStep(0);
                }
              }
            }}
          />
        );
      case "selfie-capture":
        return (
          <Selfie
            key={`selfie-${node.id}-${templateIndex}`}
            stepObject={stepObject}
          />
        );
      default:
        console.warn(`Type de nœud non supporté: ${node.type}`);
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-yellow-600 mb-2">
              Étape non supportée
            </h2>
            <p className="text-gray-600 mb-4">
              Le type d'étape "{node.type}" n'est pas pris en charge.
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4 text-left text-xs overflow-auto max-h-32">
              <pre>{JSON.stringify(node, null, 2)}</pre>
            </div>
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={() => {
                // Essayer de passer à l'étape suivante
                if (templateIndex < templateNodes.length - 1) {
                  stepObject.setStep(4 + templateIndex + 1);
                } else {
                  // Ou revenir au début si c'est la dernière étape
                  stepObject.setStep(0);
                }
              }}
            >
              Continuer
            </button>
          </div>
        );
    }
  };

  // Effect to track current step and session for debugging
  useEffect(() => {
    // Si nous sommes à l'étape 4+ et que le template n'est pas disponible
    // et que nous ne sommes pas déjà en train de charger
    if (step >= 4 && session && !session.template && sessionId && !loading) {
      // Mettre à jour l'état de chargement pour montrer l'indicateur
      setLoading(true);

      const reloadSession = async () => {
        try {
          const refreshedSession = await fetchSessionById(sessionId);

          if (refreshedSession && refreshedSession.template) {
            setSession(refreshedSession);
          }
          // Terminer le chargement même si la session n'a pas de template
          setLoading(false);
        } catch (err) {
          console.error("Failed to reload session at step 4+:", err);
          setLoading(false);
        }
      };

      reloadSession();
    }
  }, [session, step, sessionId, loading]);

  // Effect to preload/verify the template is loaded before rendering template nodes
  useEffect(() => {
    // On précharge uniquement si on n'a pas déjà un template
    if (step >= 4 && sessionId && (!session || !session.template) && !loading) {
      // Mettre loading à true pour éviter les doubles chargements
      setLoading(true);

      const loadSessionTemplate = async () => {
        try {
          const sessionData = await fetchSessionById(sessionId);

          if (sessionData && sessionData.template) {
            setSession(sessionData);
          } else {
            console.error("Failed to load template from fresh session data");
          }
          setLoading(false);
        } catch (err) {
          console.error("Error preloading template:", err);
          setLoading(false);
        }
      };

      loadSessionTemplate();
    }
  }, [step, sessionId, session, loading]);

  return (
    <DocumentProvider>
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="flex-1 flex flex-col items-center justify-center">
          {" "}
          <Paper className="w-full h-screen flex flex-col justify-center items-center lg:w-[600px] lg:h-[600px] background-white rounded-lg overflow-auto sm:pt-4 sm:pb-4 z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary mb-4"></div>
                <p className="mt-4 text-gray-600 font-medium text-lg animate-pulse">
                  Chargement de la session...
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Préparation des étapes de vérification
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-red-600 mb-2">
                  Erreur de chargement
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            ) : isExpired ? (
              <SessionExpired onRetry={handleRetrySession} />
            ) : (
              <>
                {step === 0 && <StartSession stepObject={stepObject} />}
                {step === 1 &&
                session?.template &&
                hasSelfieCaptureStep(session.template) &&
                session.mobile ? (
                  <MobileRedirect
                    sessionId={sessionId}
                    onBack={() => setStep(0)}
                    onContinueOnPC={() => {
                      // Continue with PC flow, skip mobile redirect
                      setStep(2);
                      // Force PC mode by not redirecting to mobile
                    }}
                  />
                ) : step === 1 ? (
                  <UserInputForm
                    stepObject={stepObject}
                    setUserInput={setUserInput}
                    initialUserInput={userInput}
                  />
                ) : null}
                {step === 2 && (
                  <ContactInfoForm
                    stepObject={stepObject}
                    setContactInfo={setContactInfo}
                    initialContactInfo={contactInfo}
                  />
                )}
                {step === 3 && (
                  <OTPVerification
                    stepObject={stepObject}
                    contactInfo={contactInfo}
                  />
                )}

                {/* À partir de l'étape 4, utiliser la logique dynamique basée sur le template */}
                {step >= 4 && !loading ? (
                  session?.template ? (
                    renderTemplateNode(step - 4)
                  ) : (
                    // Fallback pour l'étape 4+ si le template n'est pas disponible
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                      <h2 className="text-xl font-bold text-gray-700 mb-2">
                        Préparation des étapes de vérification
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Un instant s'il vous plaît...
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 max-w-xs mx-auto">
                        <p className="text-sm text-blue-600">
                          Configuration des prochaines étapes en cours...
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded"
                        >
                          Actualiser si nécessaire
                        </button>
                      </div>
                    </div>
                  )
                ) : step >= 4 ? (
                  // Affiche un loader pendant le chargement à l'étape 4+
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2 animate-pulse">
                      Chargement en cours
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Préparation des documents à vérifier...
                    </p>
                  </div>
                ) : null}

                {isMobile && (
                  <div className="pb-4">
                    <PoweredBy />
                  </div>
                )}
              </>
            )}
          </Paper>
          {!isMobile && (
            <div className="pt-5">
              <PoweredBy />
            </div>
          )}
        </div>
      </div>
    </DocumentProvider>
  );
};

export default DatakeenSession;
