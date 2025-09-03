import React from "react";
import StartSession from "../session/StartSession";
import UserInputForm from "../session/UserInputForm";
import ContactInfoForm from "../session/ContactInfoForm";
import OTPVerification from "../session/OTPVerification";
import EndFlow from "../session/EndFlow";
import LoadingState from "../states/LoadingState";
import TemplateNodeRenderer from "../template/TemplateNodeRenderer";
import {
  getOrderedWorkflowSteps,
  type SessionData,
} from "../../services/sessionService";
import type { stepObject } from "../../types/session";
import type { UserInput } from "../../types/userInput";
import type { ContactInfo } from "../../types/contactInfo";

interface SessionContentProps {
  step: number;
  loading: boolean;
  session: SessionData | null;
  sessionId: string;
  stepObject: stepObject;
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  setBlockAutoProgress: (block: boolean) => void;
}

const SessionContent: React.FC<SessionContentProps> = ({
  step,
  loading,
  session,
  sessionId,
  stepObject,
  userInput,
  setUserInput,
  contactInfo,
  setContactInfo,
  setBlockAutoProgress,
}) => {
  // Handle template step progression
  const handleContinueOnPC = () => {
    // Unblock automatic progression
    setBlockAutoProgress(false);

    if (!session?.template) return;

    const templateNodes = getOrderedWorkflowSteps(session.template);
    // AJUSTÉ POUR LE SKIP : template index now starts at step 5 instead of step 5
    // (because we skipped ContactInfo and OTP steps 3 and 4)
    const templateIndex = step - 5;

    if (templateIndex < templateNodes.length - 1) {
      // +5 because the first 3 steps are now: welcome, user-input, template start (skip contact+otp)
      const nextStep = 5 + templateIndex + 1;
      stepObject.setStep(nextStep);
    } else {
      // Last step, finish the process
      const endNode = session.template.nodes.find(
        (node) => node.type === "end"
      );
      if (endNode) {
        // Continue to the next node which will be the "end" node
        stepObject.setStep(5 + templateIndex + 1);
      } else {
        stepObject.setStep(0);
      }
    }
  };

  // Special check: If session is ended, display EndFlow directly
  if (session?.status === "ended") {
    return (
      <EndFlow
        stepObject={stepObject}
        sessionId={sessionId}
        sessionStatus={session.status}
      />
    );
  }

  // Render step content
  switch (step) {
    case 0:
      return <StartSession stepObject={stepObject} />;

    case 1:
    case 2:
      return (
        <UserInputForm
          stepObject={stepObject}
          setUserInput={setUserInput}
          initialUserInput={userInput}
        />
      );

    // ÉTAPES COMMENTÉES TEMPORAIREMENT - SKIP CONTACT INFO ET OTP
    // case 3:
    //   return (
    //     <ContactInfoForm
    //       stepObject={stepObject}
    //       setContactInfo={setContactInfo}
    //       initialContactInfo={contactInfo}
    //     />
    //   );

    // case 4:
    //   return (
    //     <OTPVerification stepObject={stepObject} contactInfo={contactInfo} />
    //   );

    default:
      // From step 5 onwards, use dynamic logic based on template
      if (step >= 5) {
        if (loading) {
          return (
            <LoadingState
              message="Chargement en cours"
              subtitle="Préparation des documents à vérifier..."
            />
          );
        }

        if (session?.template) {
          return (
            <TemplateNodeRenderer
              session={session}
              sessionId={sessionId}
              stepObject={stepObject}
              templateIndex={step - 5}
              onBlockAutoProgress={setBlockAutoProgress}
              onContinueOnPC={handleContinueOnPC}
            />
          );
        } else {
          // Fallback for step 5+ if template is not available
          return (
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
          );
        }
      }

      return null;
  }
};

export default SessionContent;
