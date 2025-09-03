// Re-export i18n utilities
export { useI18n } from '../hooks/useI18n';
export { I18nProvider, useI18nContext } from '../providers/I18nProvider';
export { extractRootCauses, hasAnalysisFailed, getPrimaryRootCause } from '../utils/apiAnalysis';
export type { Prediction, AnalysisResult } from '../utils/apiAnalysis';
