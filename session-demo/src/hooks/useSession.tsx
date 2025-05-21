import DatakeenSession from "../components/DatakeenSession";
import type { UseSessionReturn } from "../types/session";
import { useMemo } from "react";

/**
 * Custom hook to manage the session component.
 * @param {string} sessionId - The ID of the session.
 * @returns {UseSessionReturn} - An object containing the session component. The session component is a React element that can be rendered in your application.
 */
const useSession = (sessionId: string): UseSessionReturn => {
  const SessionComponent = useMemo(() => {
    if (!sessionId) {
      return <div>No session ID provided.</div>;
    }
    return <DatakeenSession sessionId={sessionId} />;
  }, [sessionId]);

  return {
    SessionComponent,
  };
};

export default useSession;
