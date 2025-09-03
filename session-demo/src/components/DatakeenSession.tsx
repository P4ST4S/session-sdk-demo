import { useEffect } from "react";
import type { DatakeenSessionProps } from "../types/session";
import Paper from "./ui/Paper";
import useIsMobile from "../hooks/useIsMobile";
import PoweredBy from "./ui/PoweredBy";
import SessionExpired from "./session/SessionExpired";
import { useRouteCSS } from "../hooks/useRouteCSS";
import { DocumentProvider } from "../context/DocumentContext";
import { ConfigProvider } from "../context/ConfigContext";

// Hooks
import { useSessionData } from "../hooks/useSessionData";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useStepCSS } from "../hooks/useStepCSS";
import { useTemplateLoader } from "../hooks/useTemplateLoader";

// Components
import NoSessionIdState from "./states/NoSessionIdState";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import SessionContent from "./session/SessionContent";

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
 * @param {string} props.apiBaseUrl - Optional API base URL for dynamic environment configuration
 * @returns {JSX.Element} A Paper-wrapped container with the appropriate step component based on current state
 */
const DatakeenSession = ({
  sessionId,
  sessionConfig,
  apiBaseUrl,
}: DatakeenSessionProps) => {
  const isMobile = useIsMobile();

  // Load base CSS and UI components CSS that are always needed
  useRouteCSS("ui-components");

  // Session data management
  const {
    session,
    setSession,
    loading,
    setLoading,
    error,
    isExpired,
    userInput,
    setUserInput,
    contactInfo,
    setContactInfo,
    loadSession,
    handleRetrySession,
  } = useSessionData(sessionId);

  // Step navigation management
  const { step, stepObject, setBlockAutoProgress } = useStepNavigation(
    sessionId,
    session?.status
  );

  // Load route-specific CSS based on current step
  useStepCSS(step, session);

  // Template loading logic
  useTemplateLoader(step, sessionId, session, loading, setSession, setLoading);

  // Load session data on component mount
  useEffect(() => {
    loadSession();
  }, [sessionId, sessionConfig]);

  // Handle initial step setting when session loads
  useEffect(() => {
    if (session && session.status === "ended") {
      // If session is ended, find the appropriate end step
      const templateNodes = session.template?.nodes || [];
      const endNodeIndex = templateNodes.findIndex(
        (node) => node.type === "end"
      );

      if (endNodeIndex !== -1) {
        stepObject.setStep(5 + endNodeIndex);
      } else {
        stepObject.setStep(5 + templateNodes.length);
      }
    }
  }, [session, stepObject]);

  if (!sessionId) {
    return <NoSessionIdState />;
  }

  return (
    <ConfigProvider apiBaseUrl={apiBaseUrl}>
      <DocumentProvider>
        <div className="sdk-session">
          <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="flex-1 flex flex-col items-center justify-center">
              <Paper className="w-full h-screen flex flex-col justify-center items-center lg:w-[600px] lg:h-[600px] background-white rounded-lg overflow-auto sm:pt-4 sm:pb-4 z-10">
                {loading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState error={error} />
                ) : isExpired ? (
                  <SessionExpired onRetry={handleRetrySession} />
                ) : (
                  <>
                    <SessionContent
                      step={step}
                      loading={loading}
                      session={session}
                      sessionId={sessionId}
                      stepObject={stepObject}
                      userInput={userInput}
                      setUserInput={setUserInput}
                      contactInfo={contactInfo}
                      setContactInfo={setContactInfo}
                      setBlockAutoProgress={setBlockAutoProgress}
                    />

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
        </div>
      </DocumentProvider>
    </ConfigProvider>
  );
};

export default DatakeenSession;
