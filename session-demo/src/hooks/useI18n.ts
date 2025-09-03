import { useTranslation } from 'react-i18next';
import sdkI18n from '../i18n';

export const useI18n = () => {
  // Utiliser l'instance i18n du SDK au lieu de l'instance globale
  const { t, i18n } = useTranslation('translation', { i18n: sdkI18n });

  const translateCodeDescription = (codeName: string): string => {
    // Construire la clé de traduction basée sur le codeName
    const key = `document_error_description_${codeName}`;
    
    // Vérifier si la traduction existe
    const translation = t(key);
    
    // Si la traduction n'existe pas (retourne la clé), retourner une description par défaut
    if (translation === key) {
      // Fallback avec des descriptions par défaut basées sur le codeName
      const fallbacks: Record<string, string> = {
        'noIdFound': 'Le document n\'a pas pu être traité : Aucune pièce d\'identité trouvée',
        'blurry': 'Le document n\'a pas pu être traité : Image floue',
        'reflections': 'Le document n\'a pas pu être traité : Reflets détectés',
        'readability': 'Le document n\'a pas pu être traité : Problème de lisibilité',
        'missingPart': 'Le document n\'a pas pu être traité : Partie manquante',
        'expired': 'Le document est expiré',
        'suspicious': 'Document suspect détecté',
        'specimen': 'Document trouvé dans la base de spécimens'
      };
      
      return fallbacks[codeName] || `Erreur: ${codeName}`;
    }
    
    return translation;
  };

  const translateDocumentType = (documentType: string): string => {
    return t(`documentTypes.${documentType}`, { defaultValue: documentType });
  };

  const setLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return {
    t,
    translateCodeDescription,
    translateDocumentType,
    setLanguage,
    currentLanguage: i18n.language
  };
};
