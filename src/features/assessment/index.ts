// Schema
export type {
  SymptomDomain,
  AssessmentDimension,
  DomainScoring,
  DomainAssessment,
  ScreeningResult,
  AssessmentGraphStateType,
} from './schema/types';
export { DOMAIN_LABELS, AssessmentGraphState } from './schema/types';

export type {
  AIReportDomain,
  AIReportFinding,
  AIGeneratedReport,
  ReportFindingIcon,
  AIReportValidation,
} from './schema/report-schema';
export { validateAIReport } from './schema/report-schema';

export type { DomainFeature, SeverityLevel } from './schema/domains';
export {
  DOMAIN_FEATURES,
  QUESTION_DOMAIN_MAP,
  calculateDomainScores,
  identifyFlaggedDomains,
  computeOverallSeverity,
} from './schema/domains';

// AI
export {
  createAssessmentGraph,
  runAssessmentTurn,
  forceGenerateReport,
  resetAssessmentGraph,
} from './ai/graph';
export {
  routeEntry,
  routeAfterProcessing,
  getDimensionsCovered,
  MAX_QUESTIONS,
  MAX_DURATION_MINUTES,
  QUESTIONS_PER_DOMAIN,
  MIN_DIMENSIONS_TO_TRANSITION,
} from './ai/routing';
export { promptTemplates } from './ai/prompts';

// Services
export * from './services/types';
export * from './services/sessions';
export * from './services/messages';
export * from './services/domains';
export * from './services/reports';
export * from './services/safety';
export * from './services/screening';
export { persistSessionResults } from './services/persistence';

// Validation
export {
  validateThreadId,
  validateScreeningAnswers,
  validateMessage,
} from './validation/input';

// Utils
export { toScreeningResults } from './utils/screening-helpers';
export {
  impactLabel,
  mapDomainToResult,
  mapFindingToInsight,
  computeSummaryStats,
  mapAIReportToAssessmentReport,
} from './utils/report-mapper';
