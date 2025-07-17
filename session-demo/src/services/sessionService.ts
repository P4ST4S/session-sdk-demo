/**
 * Session Service
 *
 * Service for interacting with the Datakeen Session API.
 * Handles fetching session data by ID.
 */

import { API_BASE_URL } from "../config/env";

/**
 * Interface for session template node
 */
interface SessionTemplateNode {
  id: string;
  type: string;
  title: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  options: unknown[];
  selectedOptions: string[];
  requiredDocumentType?: string;
  isRequired: boolean;
  order: number;
}

/**
 * Interface for session template edge
 */
interface SessionTemplateEdge {
  id: string;
  source: string;
  target: string;
}

/**
 * Interface for session template
 */
interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  nodes: SessionTemplateNode[];
  edges: SessionTemplateEdge[];
  groupId: string;
  userId: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for session data
 */
export interface SessionData {
  id: string;
  userId: string | null;
  token: string;
  templateId: string;
  templateKey: string;
  expireTime: number;
  status: string;
  result: Record<string, unknown>;
  landingPage: unknown;
  withSelfie: boolean | null;
  groupId: string | null;
  userInput: Record<string, unknown>;
  contactInfo?: {
    email: string;
    phoneNumber: string;
  };
  callbackURL: string;
  webhookURL: string;
  analysisTemplateId: string | null;
  userAgent: unknown[];
  mobile: boolean;
  analysisId: string | null;
  createdAt: string;
  updatedAt: string;
  auditTrail: unknown[];
  user: unknown | null;
  analysis: unknown[];
  template: SessionTemplate;
}

/**
 * Fetches session data by ID from the Datakeen backend
 *
 * @param sessionId - The unique identifier of the session
 * @returns The session data
 */
export const fetchSessionById = async (
  sessionId: string
): Promise<SessionData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/backend/session/sdk/${sessionId}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch session data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session data:", error);
    throw error;
  }
};

/**
 * Determines if the session template has a specific type of node
 *
 * @param template - The session template
 * @param nodeType - The type of node to check for
 * @returns true if the template has a node of the specified type, false otherwise
 */
export const hasNodeType = (
  template: SessionTemplate,
  nodeType: string
): boolean => {
  return template.nodes.some((node) => node.type === nodeType);
};

/**
 * Determines if the session template has a node with a specific requiredDocumentType
 *
 * @param template - The session template
 * @param requiredDocumentType - The requiredDocumentType to check for
 * @returns true if the template has a node with the specified requiredDocumentType, false otherwise
 */
export const hasDocumentTypeNode = (
  template: SessionTemplate,
  requiredDocumentType: string
): boolean => {
  return template.nodes.some(
    (node) => node.requiredDocumentType === requiredDocumentType
  );
};

/**
 * Gets all nodes of a specific type
 *
 * @param template - The session template
 * @param nodeType - The type of node to get
 * @returns Array of nodes matching the type
 */
export const getNodesByType = (
  template: SessionTemplate,
  nodeType: string
): SessionTemplateNode[] => {
  return template.nodes.filter((node) => node.type === nodeType);
};

/**
 * Gets all nodes with a specific requiredDocumentType
 *
 * @param template - The session template
 * @param requiredDocumentType - The requiredDocumentType to get
 * @returns Array of nodes matching the requiredDocumentType
 */
export const getNodesByDocumentType = (
  template: SessionTemplate,
  requiredDocumentType: string
): SessionTemplateNode[] => {
  return template.nodes.filter(
    (node) => node.requiredDocumentType === requiredDocumentType
  );
};

/**
 * Get document options for a specific document type
 *
 * @param template - The session template
 * @param requiredDocumentType - The document type to get options for
 * @returns Array of document options (empty if none found)
 */
export const getDocumentOptions = (
  template: SessionTemplate,
  requiredDocumentType: string
): string[] => {
  const node = template.nodes.find(
    (node) => node.requiredDocumentType === requiredDocumentType
  );
  return node?.selectedOptions || [];
};

/**
 * Determines if the session template has a selfie step
 *
 * @param template - The session template
 * @returns true if the template has a selfie step, false otherwise
 */
export const hasSelfieCaptureStep = (template: SessionTemplate): boolean => {
  return hasNodeType(template, "selfie-capture");
};

/**
 * Determines if the session template has an ID document step
 *
 * @param template - The session template
 * @returns true if the template has an ID document step, false otherwise
 */
export const hasDocumentStep = (template: SessionTemplate): boolean => {
  // Check if there's any document-selection node with requiredDocumentType "id-card"
  // or if none specified, just check for document-selection nodes
  const hasIDCard = hasDocumentTypeNode(template, "id-card");
  return hasIDCard || hasNodeType(template, "document-selection");
};

/**
 * Determines if the session template has a JDD (proof of address) step
 *
 * @param template - The session template
 * @returns true if the template has a JDD step, false otherwise
 */
export const hasJDDStep = (template: SessionTemplate): boolean => {
  return hasDocumentTypeNode(template, "jdd");
};

/**
 * Determines if the session template has a proof of funds step
 *
 * @param template - The session template
 * @returns true if the template has a proof of funds step, false otherwise
 */
export const hasProofOfFundsStep = (template: SessionTemplate): boolean => {
  return hasDocumentTypeNode(template, "income-proof");
};

/**
 * Gets all node types in the template
 *
 * @param template - The session template
 * @returns Array of node types in the template
 */
export const getNodeTypes = (template: SessionTemplate): string[] => {
  return Array.from(new Set(template.nodes.map((node) => node.type)));
};

/**
 * Gets all document types required in the template
 *
 * @param template - The session template
 * @returns Array of document types required in the template
 */
export const getRequiredDocumentTypes = (
  template: SessionTemplate
): string[] => {
  return Array.from(
    new Set(
      template.nodes
        .filter((node) => node.requiredDocumentType)
        .map((node) => node.requiredDocumentType!)
    )
  );
};

/**
 * Converts template document type to internal document type
 * This helps standardize document types between the template and the application
 *
 * @param templateDocType - The document type as defined in the template
 * @returns The internal document type used by the application
 */
export const convertTemplateDocTypeToInternal = (
  templateDocType: string
): string => {
  if (!templateDocType) return "";

  // Mapping between template document types and internal document types
  const typeMap: Record<string, string> = {
    "id-card": "id-card",
    jdd: "jdd",
    "income-proof": "income-proof", // Using consistent naming
  };

  return typeMap[templateDocType] || templateDocType;
};

/**
 * Converts internal document type to template document type
 *
 * @param internalDocType - The document type used internally by the application
 * @returns The document type as expected in the template
 */
export const convertInternalDocTypeToTemplate = (
  internalDocType: string
): string => {
  if (!internalDocType) return "";

  // Mapping between internal document types and template document types
  const typeMap: Record<string, string> = {
    "id-card": "id-card",
    jdd: "jdd",
    funds: "income-proof", // Map funds to income-proof for backwards compatibility
    "income-proof": "income-proof",
  };

  return typeMap[internalDocType] || internalDocType;
};

/**
 * Updates session data with user input information
 *
 * @param sessionId - The unique identifier of the session
 * @param userInput - The user input data (firstName, lastName, birthDate)
 * @returns The updated session data
 */
export const updateSessionUserInput = async (
  sessionId: string,
  userInput: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    [key: string]: unknown;
  }
): Promise<SessionData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/backend/session/sdk/${sessionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update session data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating session data:", error);
    throw error;
  }
};

/**
 * Updates session data with contact information
 *
 * @param sessionId - The unique identifier of the session
 * @param contactInfo - The contact information data (email, phoneNumber)
 * @returns The updated session data
 */
export const updateSessionContactInfo = async (
  sessionId: string,
  contactInfo: {
    email: string;
    phoneNumber: string;
    [key: string]: unknown;
  }
): Promise<SessionData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/backend/session/sdk/${sessionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactInfo,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update contact information: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating contact information:", error);
    throw error;
  }
};

/**
 * Gets the workflow steps from the template in order
 *
 * @param template - The session template
 * @returns Array of ordered steps
 */
export const getOrderedWorkflowSteps = (
  template: SessionTemplate
): SessionTemplateNode[] => {
  // Filter out only start nodes, keep end nodes for proper workflow completion, then sort by order
  return template.nodes
    .filter((node) => node.type !== "start")
    .sort((a, b) => a.order - b.order);
};

/**
 * Maps a template node type to a step component type
 *
 * @param node - The session template node
 * @returns The step component type
 */
export const getStepComponentType = (node: SessionTemplateNode): string => {
  // Map from template node types to component types
  const typeMap: Record<string, string> = {
    "document-selection": "document",
    "selfie-capture": "selfie",
    "contact-info": "contact-info",
    "user-input": "user-input",
    "otp-verification": "otp",
  };

  // First check the node type
  if (node.type in typeMap) {
    return typeMap[node.type];
  }

  // Then check the requiredDocumentType
  if (node.requiredDocumentType) {
    return node.requiredDocumentType;
  }

  // Default fallback
  return node.type;
};

/**
 * Checks if a session has expired
 *
 * @param session - The session data to check
 * @returns true if the session has expired, false otherwise
 */
export const isSessionExpired = (session: SessionData): boolean => {
  if (!session.expireTime) {
    return false;
  }

  const currentTime = Date.now();
  return currentTime > session.expireTime;
};

/**
 * Stores document options in localStorage for a specific document type
 *
 * @param sessionId - The session ID
 * @param documentTypeId - The document type ID (e.g., 'jdd', 'income-proof')
 * @param options - The options to store
 */
export const storeDocumentOptions = (
  sessionId: string,
  documentTypeId: string,
  options: string[]
): void => {
  if (!sessionId || !documentTypeId || !options || options.length === 0) {
    console.warn("Missing data for storeDocumentOptions:", {
      sessionId,
      documentTypeId,
      options,
    });
    return;
  }

  // Create a consistent key format based on document type
  let storageKey = "";

  switch (documentTypeId) {
    case "jdd":
      storageKey = `jddOptions_${sessionId}`;
      break;
    case "income-proof":
      storageKey = `fundsOptions_${sessionId}`;
      break;
    case "id-card":
      storageKey = `idOptions_${sessionId}`;
      break;
    default:
      storageKey = `${documentTypeId}Options_${sessionId}`;
  }

  localStorage.setItem(storageKey, JSON.stringify(options));
};

/**
 * Retrieves document options from localStorage for a specific document type
 *
 * @param sessionId - The session ID
 * @param documentTypeId - The document type ID (e.g., 'jdd', 'income-proof')
 * @returns Array of options or default options if none found
 */
export const retrieveDocumentOptions = (
  sessionId: string,
  documentTypeId: string
): string[] => {
  if (!sessionId || !documentTypeId) {
    console.warn("Missing data for retrieveDocumentOptions:", {
      sessionId,
      documentTypeId,
    });
    return [];
  }

  // Create consistent key formats to check
  const possibleKeys = [
    `${documentTypeId}Options_${sessionId}`,
    documentTypeId === "jdd" ? `jddOptions_${sessionId}` : "",
    documentTypeId === "income-proof" ? `fundsOptions_${sessionId}` : "",
    documentTypeId === "id-card" ? `idOptions_${sessionId}` : "",
  ].filter(Boolean);

  // Try each possible key
  for (const key of possibleKeys) {
    const savedOptions = localStorage.getItem(key);
    if (savedOptions) {
      try {
        const parsedOptions = JSON.parse(savedOptions);

        return parsedOptions;
      } catch (e) {
        console.error(
          `Error parsing options for ${documentTypeId} with key ${key}:`,
          e
        );
      }
    }
  }

  // Return default options if none found
  console.warn(`No options found for ${documentTypeId}, using defaults`);
  if (documentTypeId === "jdd") {
    return [
      "Facture d'électricité (< 3 mois)",
      "Facture de gaz (< 3 mois)",
      "Facture d'eau (< 3 mois)",
      "Quittance de loyer (< 3 mois)",
      "Facture téléphone/internet (< 3 mois)",
      "Attestation d'assurance habitation (< 3 mois)",
    ];
  } else if (documentTypeId === "income-proof") {
    return [
      "Bulletin de salaire",
      "Avis d'imposition",
      "Relevé de compte bancaire",
      "Attestation de revenus",
      "Contrat de travail",
    ];
  } else if (documentTypeId === "id-card") {
    return ["Carte nationale d'identité", "Passeport", "Permis de conduire"];
  }

  return [];
};
