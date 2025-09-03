export interface Prediction {
  code: string;
  codeDescription: string;
  codeName: string;
  type: string;
  userInput?: {
    birthDate?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface AnalysisResult {
  predictions: Prediction[];
  internal_status: string;
  analysis_id: string;
}

/**
 * Extrait les root causes principales à partir des prédictions de l'API
 */
export const extractRootCauses = (predictions: Prediction[]): string[] => {
  if (!predictions || !Array.isArray(predictions)) {
    return [];
  }

  return predictions
    .filter(prediction => prediction.codeName && prediction.codeName !== 'conform')
    .map(prediction => prediction.codeName);
};

/**
 * Détermine si l'analyse a échoué basé sur les prédictions
 */
export const hasAnalysisFailed = (predictions: Prediction[]): boolean => {
  if (!predictions || !Array.isArray(predictions)) {
    return true;
  }

  // Si au moins une prédiction n'est pas 'conform', l'analyse a échoué
  return predictions.some(prediction => 
    prediction.codeName && prediction.codeName !== 'conform'
  );
};

/**
 * Obtient la root cause principale (première dans la liste)
 */
export const getPrimaryRootCause = (predictions: Prediction[]): string | null => {
  const rootCauses = extractRootCauses(predictions);
  return rootCauses.length > 0 ? rootCauses[0] : null;
};
