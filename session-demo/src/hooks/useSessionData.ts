import { useState, useEffect } from "react";
import type { SessionData } from "../services/sessionService";
import type { UserInput } from "../types/userInput";
import type { ContactInfo } from "../types/contactInfo";
import {
  fetchSessionById,
  isSessionExpired,
  updateSessionUserInput,
  updateSessionContactInfo,
  storeDocumentOptions,
} from "../services/sessionService";

export const useSessionData = (sessionId: string) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const [userInput, setUserInput] = useState<UserInput>({
    lastName: "",
    firstName: "",
    birthDate: "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phoneNumber: "",
  });

  // Load session data
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
        // Store document options for each type in localStorage
        const templateNodes = sessionData.template.nodes;
        templateNodes.forEach((node) => {
          if (
            node.type === "document-selection" &&
            node.requiredDocumentType &&
            node.selectedOptions.length > 0
          ) {
            storeDocumentOptions(
              sessionId,
              node.requiredDocumentType,
              node.selectedOptions
            );
          }
        });

        // Load saved user input from localStorage
        const savedUserInput = localStorage.getItem(`userInput_${sessionId}`);
        if (savedUserInput) {
          try {
            const parsedUserInput = JSON.parse(savedUserInput);
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
        } else if (
          sessionData.userInput &&
          Object.keys(sessionData.userInput).length > 0
        ) {
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

        // Load saved contact info from localStorage
        const savedContactInfo = localStorage.getItem(
          `contactInfo_${sessionId}`
        );
        if (savedContactInfo) {
          try {
            const parsedContactInfo = JSON.parse(savedContactInfo);
            if (parsedContactInfo.email && parsedContactInfo.phoneNumber) {
              setContactInfo(parsedContactInfo);
            }
          } catch (e) {
            console.error("Failed to parse saved contact info:", e);
          }
        } else if (
          sessionData.contactInfo &&
          Object.keys(sessionData.contactInfo).length > 0
        ) {
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
      }

      setError(null);
    } catch (err) {
      console.error("Failed to load session:", err);
      setError("Failed to load session data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Retry loading the session
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
      }
    } catch (err) {
      console.error("Failed to retry loading session:", err);
      setError("Failed to load session data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update user input in backend and localStorage
  useEffect(() => {
    if (userInput && userInput.firstName && userInput.lastName) {
      localStorage.setItem(`userInput_${sessionId}`, JSON.stringify(userInput));

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
            // Ne mettre à jour que si la requête réussit
            if (updatedSession) {
              setSession(updatedSession);
            }
          } catch (err) {
            console.error("Failed to update user input:", err);
            // Ne pas mettre à jour la session en cas d'erreur
          }
        }
      };

      updateUserData();
    }
  }, [sessionId, userInput]);

  // Update contact info in backend and localStorage
  useEffect(() => {
    if (contactInfo && contactInfo.email && contactInfo.phoneNumber) {
      localStorage.setItem(
        `contactInfo_${sessionId}`,
        JSON.stringify(contactInfo)
      );

      const updateContactData = async () => {
        if (sessionId && contactInfo.email && contactInfo.phoneNumber) {
          try {
            const updatedSession = await updateSessionContactInfo(sessionId, {
              email: contactInfo.email,
              phoneNumber: contactInfo.phoneNumber,
            });
            // Ne mettre à jour que si la requête réussit
            if (updatedSession) {
              setSession(updatedSession);
            }
          } catch (err) {
            console.error("Failed to update contact info:", err);
            // Ne pas mettre à jour la session en cas d'erreur
          }
        }
      };

      updateContactData();
    }
  }, [contactInfo, sessionId]);

  // Check session expiration periodically
  useEffect(() => {
    if (!session || isExpired) return;

    if (isSessionExpired(session)) {
      setIsExpired(true);
      return;
    }

    const checkExpirationInterval = setInterval(() => {
      if (session && isSessionExpired(session)) {
        setIsExpired(true);
        clearInterval(checkExpirationInterval);
      }
    }, 30000);

    return () => {
      clearInterval(checkExpirationInterval);
    };
  }, [session, isExpired]);

  return {
    session,
    setSession,
    loading,
    setLoading,
    error,
    setError,
    isExpired,
    setIsExpired,
    userInput,
    setUserInput,
    contactInfo,
    setContactInfo,
    loadSession,
    handleRetrySession,
  };
};
