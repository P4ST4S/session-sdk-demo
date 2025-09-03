import { useEffect } from "react";
import { fetchSessionById, type SessionData } from "../services/sessionService";

export const useTemplateLoader = (
  step: number,
  sessionId: string,
  session: SessionData | null,
  loading: boolean,
  setSession: (session: SessionData | null) => void,
  setLoading: (loading: boolean) => void
) => {
  // Effect to track current step and session for debugging
  useEffect(() => {
    // If we're at step 5+ and template is not available
    // and we're not already loading
    if (step >= 5 && session && !session.template && sessionId && !loading) {
      // Update loading state to show indicator
      setLoading(true);

      const reloadSession = async () => {
        try {
          const refreshedSession = await fetchSessionById(sessionId);

          if (refreshedSession && refreshedSession.template) {
            setSession(refreshedSession);
          }
          // Finish loading even if session doesn't have template
          setLoading(false);
        } catch (err) {
          console.error("Failed to reload session at step 5+:", err);
          setLoading(false);
        }
      };

      reloadSession();
    }
  }, [session, step, sessionId, loading, setSession, setLoading]);

  // Effect to preload/verify the template is loaded before rendering template nodes
  useEffect(() => {
    // Only preload if we don't already have a template
    if (step >= 5 && sessionId && (!session || !session.template) && !loading) {
      // Set loading to true to avoid double loading
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
  }, [step, sessionId, session, loading, setSession, setLoading]);
};
