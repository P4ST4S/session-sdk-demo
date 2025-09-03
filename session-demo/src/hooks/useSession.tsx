import DatakeenSession from "../components/DatakeenSession";
import type { UseSessionReturn, SessionConfig } from "../types/session";
import { useMemo } from "react";

/**
 * Custom hook to manage the session component.
 * @param {string} sessionId - The ID of the session.
 * @param {SessionConfig} sessionConfig - Configuration for the session (optional).
 * @param {string} apiBaseUrl - Optional API base URL for dynamic environment configuration.
 * @returns {UseSessionReturn} - An object containing the session component. The session component is a React element that can be rendered in your application.
 */
const useSession = (
  sessionId: string,
  sessionConfig?: SessionConfig,
  apiBaseUrl?: string
): UseSessionReturn => {
  const SessionComponent = useMemo(() => {
    if (!sessionId) {
      return <div>No session ID provided.</div>;
    }
    return (
      <DatakeenSession
        sessionId={sessionId}
        sessionConfig={sessionConfig}
        apiBaseUrl={apiBaseUrl}
      />
    );
  }, [sessionId, sessionConfig, apiBaseUrl]);

  return {
    SessionComponent,
  };
};

export default useSession;
