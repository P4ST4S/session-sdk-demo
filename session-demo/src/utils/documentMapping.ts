/**
 * Mapping entre les documents spécifiques et les catégories génériques
 */

export interface DocumentCategory {
  id: string;
  label: string;
  description?: string;
}

// Catégories génériques pour l'affichage
export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: "national_id",
    label: "Carte nationale d'identité",
    description: "CNI française",
  },
  {
    id: "passport",
    label: "Passeport",
    description: "Passeport biométrique",
  },
  {
    id: "driving_license",
    label: "Permis de conduire",
    description: "Permis de conduire français",
  },
  {
    id: "residence_permit",
    label: "Titre de séjour",
    description: "Titre de séjour français",
  },
  {
    id: "carte_vitale",
    label: "Carte Vitale",
    description: "Carte Vitale française",
  },
];

// Mapping des documents spécifiques vers les catégories
export const DOCUMENT_MAPPING: Record<string, string> = {
  // Carte nationale d'identité
  "France CNI 2003": "national_id",
  "France CNI 2021": "national_id",
  CNI: "national_id",
  "Carte nationale d'identité": "national_id",

  // Passeport
  "Passeport biométrique international": "passport",
  Passeport: "passport",
  "Passeport français": "passport",

  // Permis de conduire
  "France Permis de conduire 2013": "driving_license",
  "France Permis de conduire rose 1989": "driving_license",
  "Permis de conduire": "driving_license",

  // Titre de séjour
  "France Titre de séjour 2011": "residence_permit",
  "France Titre de séjour 2021": "residence_permit",
  "Titre de séjour": "residence_permit",

  // Carte Vitale
  "France Carte Vitale 2007": "carte_vitale",
  "Carte Vitale": "carte_vitale",
};

// Mapping inverse : catégorie vers documents spécifiques
export const CATEGORY_TO_DOCUMENTS: Record<string, string[]> = {
  national_id: ["France CNI 2003", "France CNI 2021"],
  passport: ["Passeport biométrique international"],
  driving_license: [
    "France Permis de conduire 2013",
    "France Permis de conduire rose 1989",
  ],
  residence_permit: [
    "France Titre de séjour 2011",
    "France Titre de séjour 2021",
  ],
  carte_vitale: ["France Carte Vitale 2007"],
};

/**
 * Convertit une liste de documents spécifiques en catégories génériques
 */
export function mapDocumentsToCategories(
  specificDocuments: string[]
): DocumentCategory[] {
  const categoriesSet = new Set<string>();

  // Mapper chaque document spécifique vers sa catégorie
  specificDocuments.forEach((doc) => {
    const category = DOCUMENT_MAPPING[doc];
    if (category) {
      categoriesSet.add(category);
    }
  });

  // Retourner les catégories correspondantes
  return DOCUMENT_CATEGORIES.filter((cat) => categoriesSet.has(cat.id));
}

/**
 * Trouve le premier document spécifique correspondant à une catégorie
 * parmi ceux disponibles dans selectedOptions
 */
export function findSpecificDocumentForCategory(
  categoryId: string,
  availableDocuments: string[]
): string | null {
  const possibleDocs = CATEGORY_TO_DOCUMENTS[categoryId] || [];

  // Chercher le premier document disponible pour cette catégorie
  for (const doc of possibleDocs) {
    if (availableDocuments.includes(doc)) {
      return doc;
    }
  }

  return null;
}

/**
 * Retourne les informations d'une catégorie par son ID
 */
export function getCategoryById(categoryId: string): DocumentCategory | null {
  return DOCUMENT_CATEGORIES.find((cat) => cat.id === categoryId) || null;
}
