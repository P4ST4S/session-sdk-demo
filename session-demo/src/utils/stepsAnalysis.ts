import type { ProcessingStep } from "../types/session";

/**
 * Default processing steps for document identity verification workflow.
 * Represents the sequence of operations performed during ID document verification.
 *
 * @remarks
 * This array defines the standard document processing pipeline with the following steps:
 * 1. Document Analysis - Validates the document authenticity (fails on server 500 errors)
 * 2. Data Extraction - Extracts information from the document (fails if extracted data is invalid)
 * 3. Identity Verification - Compares extracted data with user-provided information (fails on mismatch)
 * 4. Finalization - Prepares the verification results (never fails)
 *
 * Each step contains a user-facing title and subtitle to display during processing,
 * and may include an error state.
 *
 * @type {ProcessingStep[]}
 */
export const DEFAULT_PROCESSING_STEPS: ProcessingStep[] = [
  {
    title: "Analyse du document",
    subtitle: "Vérification de la validité du document",
  },
  {
    title: "Extraction des données",
    subtitle: "Extraction des informations du document",
  },
  {
    title: "Vérification de l'identité",
    subtitle: "Comparaison avec les données fournies",
  },
  {
    title: "Finalisation",
    subtitle: "Préparation des résultats",
  },
];
