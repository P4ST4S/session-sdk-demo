import React from "react";
import Selfie from "../session/Selfie";
import DocumentCheck from "../session/DocumentCheck";
import IDCheck from "../session/IDCheck";
import EndFlow from "../session/EndFlow";
import LoadingState from "../states/LoadingState";
import {
  getOrderedWorkflowSteps,
  type SessionData,
} from "../../services/sessionService";
import type { stepObject } from "../../types/session";

interface TemplateNodeRendererProps {
  session: SessionData;
  sessionId: string;
  stepObject: stepObject;
  templateIndex: number;
  onBlockAutoProgress: (block: boolean) => void;
  onContinueOnPC: () => void;
}

const TemplateNodeRenderer: React.FC<TemplateNodeRendererProps> = ({
  session,
  sessionId,
  stepObject,
  templateIndex,
  onBlockAutoProgress,
  onContinueOnPC,
}) => {
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

  // Check if session is ended before rendering nodes
  if (session.status === "ended") {
    return <EndFlow stepObject={stepObject} sessionId={sessionId} />;
  }

  // Use getOrderedWorkflowSteps to get sorted and filtered nodes
  const templateNodes = getOrderedWorkflowSteps(session.template);

  // Check if index is valid
  if (templateNodes.length === 0) {
    console.warn("No valid template nodes found after filtering");
    return (
      <EndFlow
        stepObject={stepObject}
        sessionId={sessionId}
        sessionStatus={session?.status}
      />
    );
  }

  if (templateIndex < 0 || templateIndex >= templateNodes.length) {
    console.warn(
      `Invalid template index: ${templateIndex}, max index: ${
        templateNodes.length - 1
      }`
    );

    // If we're beyond the maximum index, it means we've completed all nodes
    if (templateIndex >= templateNodes.length) {
      return (
        <EndFlow
          stepObject={stepObject}
          sessionId={sessionId}
          sessionStatus={session?.status}
        />
      );
    }

    // If index is negative, redirect to previous step
    if (templateIndex < 0) {
      // Redirect to OTP step (4)
      setTimeout(() => stepObject.setStep(4), 0);
      return <LoadingState message="Chargement de l'étape..." subtitle="" />;
    }
  }

  // At this point, we should have a valid node
  const node = templateNodes[templateIndex];
  if (!node) {
    console.error(
      `Node at index ${templateIndex} is undefined. Available nodes:`,
      templateNodes
    );
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Erreur de rendu</h2>
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

  // Determine which component to display based on node type
  switch (node.type) {
    case "end":
      return (
        <EndFlow
          stepObject={stepObject}
          sessionId={sessionId}
          sessionStatus={session?.status}
        />
      );

    case "document-selection": {
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

      // Decide which component to use based on template mobile property
      const isMobileTemplate = session?.template?.mobile === true;

      if (isMobileTemplate) {
        // Use IDCheck for mobile (capture photo) with full JDI flow
        return (
          <IDCheck
            key={`id-check-${node.id}-${templateIndex}`}
            stepObject={stepObject}
            documentTypeId={node.requiredDocumentType}
            sessionId={sessionId}
          />
        );
      } else {
        // Use DocumentCheck for desktop (file upload) with full JDI flow
        return (
          <DocumentCheck
            key={`doc-check-${node.id}-${templateIndex}`}
            stepObject={stepObject}
            sessionId={sessionId}
            documentTypeId={node.requiredDocumentType}
            onBlockAutoProgress={onBlockAutoProgress}
            onContinueOnPC={onContinueOnPC}
            isMobileCapture={false}
          />
        );
      }
    }

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
              // Try to go to next step
              if (templateIndex < templateNodes.length - 1) {
                stepObject.setStep(5 + templateIndex + 1);
              } else {
                // Or go back to beginning if it's the last step
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

export default TemplateNodeRenderer;
