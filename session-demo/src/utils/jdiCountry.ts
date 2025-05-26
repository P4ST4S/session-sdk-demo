import { JDIDocumentType as FrenchJDI } from "./chooseDocuments/frenchDocumentTypes";
import { JDIDocumentType as SpanishJDI } from "./chooseDocuments/spanishDocumentTypes";

export type DrawerItem = {
  id: string;
  label: string;
};

export const countries = [
  { id: "fr", label: "France" },
  { id: "es", label: "Espagne" },
  { id: "pt", label: "Portugal" },
  { id: "de", label: "Allemagne" },
  { id: "it", label: "Italie" },
  { id: "us", label: "États-Unis" },
  { id: "uk", label: "Royaume-Uni" },
];

export const documentTypesFromCountryId = (countryId: string): DrawerItem[] => {
  switch (countryId) {
    case "fr":
      return FrenchJDI;
    case "es":
      return SpanishJDI;
    case "pt":
    case "de":
    case "it":
    case "us":
    case "uk":
      return []; // Add other countries' document types as needed
    default:
      return []; // Return an empty array if the country is not recognized
  }
  // Add more countries and their document types as needed
  return [];
};
