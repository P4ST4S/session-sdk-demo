import { createContext, useContext, useState, type ReactNode } from "react";
import type { DrawerItem } from "../utils/jdiCountry";

// Define the shape of our context
type DocumentContextType = {
  selectedDocumentType: DrawerItem | null;
  setSelectedDocumentType: (documentType: DrawerItem | null) => void;
};

// Create context with default values
export const DocumentContext = createContext<DocumentContextType>({
  selectedDocumentType: null,
  setSelectedDocumentType: () => {},
});

// Provider component to wrap the app with
interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DrawerItem | null>(null);

  return (
    <DocumentContext.Provider
      value={{ selectedDocumentType, setSelectedDocumentType }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use the document context
export const useDocumentContext = () => useContext(DocumentContext);
