import { Annotation, MessagesAnnotation } from '@langchain/langgraph';

/* ==========================================================================
   Symptom Domains
   ========================================================================== */

export type SymptomDomain =
  | 'depression'
  | 'anger'
  | 'mania'
  | 'anxiety'
  | 'somatic_symptoms'
  | 'suicidal_tendencies'
  | 'psychosis'
  | 'sleep_problems'
  | 'memory'
  | 'repetitive_thoughts'
  | 'dissociation'
  | 'personality'
  | 'substance_use';

export const DOMAIN_LABELS: Record<SymptomDomain, string> = {
  depression: 'Depression',
  anger: 'Anger & Irritability',
  mania: 'Mania & Elevated Mood',
  anxiety: 'Anxiety',
  somatic_symptoms: 'Somatic Symptoms',
  suicidal_tendencies: 'Suicidal Ideation',
  psychosis: 'Psychosis',
  sleep_problems: 'Sleep Problems',
  memory: 'Memory Difficulties',
  repetitive_thoughts: 'Repetitive Thoughts & Compulsions',
  dissociation: 'Dissociation',
  personality: 'Personality & Relationships',
  substance_use: 'Substance Use',
};

/* ==========================================================================
   Assessment Dimensions
   ========================================================================== */

export type AssessmentDimension =
  | 'affective'
  | 'cognitive'
  | 'physiological'
  | 'behavioral'
  | 'functional'
  | 'perceptual';

/* ==========================================================================
   Domain Scoring & Assessment
   ========================================================================== */

export interface DomainScoring {
  /** Impact on daily functioning (0 = none, 3 = severe) */
  functionalImpact: number;
  /** Perceived control over symptoms (0 = no control, 3 = full control) */
  control: number;
  /** Duration description (e.g. "2 weeks", "several months") */
  duration: string;
  /** Frequency of symptoms (0 = rarely, 3 = constant) */
  frequency: number;
  /** Confidence in the assessment (0 = low, 3 = high) */
  confidence: number;
}

export interface DomainAssessment {
  domain: SymptomDomain;
  screeningScore: number;
  scoring: DomainScoring;
  evidenceNotes: string[];
  status: 'pending' | 'in_progress' | 'completed';
  questionsAsked: number;
}

/* ==========================================================================
   Screening Result
   ========================================================================== */

export interface ScreeningResult {
  questionId: string;
  domain: SymptomDomain;
  score: number;
  questionText: string;
}

/* ==========================================================================
   LangGraph State Annotation
   ========================================================================== */

export const AssessmentGraphState = Annotation.Root({
  ...MessagesAnnotation.spec,

  /** Raw screening questionnaire answers */
  screeningResults: Annotation<ScreeningResult[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),

  /** Domains that scored above the flagging threshold */
  flaggedDomains: Annotation<SymptomDomain[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),

  /** The domain currently being assessed */
  currentDomain: Annotation<SymptomDomain | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),

  /** Per-domain assessment progress — merges incoming keys into existing record */
  domainAssessments: Annotation<Record<string, DomainAssessment>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),

  /** Total follow-up questions asked across all domains */
  questionCount: Annotation<number>({
    reducer: (_prev, next) => next,
    default: () => 0,
  }),

  /** ISO timestamp of when the assessment session started */
  startTime: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => new Date().toISOString(),
  }),

  /** Whether the entire assessment is complete */
  isComplete: Annotation<boolean>({
    reducer: (_prev, next) => next,
    default: () => false,
  }),

  /** Quick-reply suggestions for the user */
  quickReplies: Annotation<string[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),

  /** The user's self-described main concern */
  chiefComplaint: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => '',
  }),

  /** Dimensions covered per domain — merges incoming keys into existing record */
  dimensionsCovered: Annotation<Record<string, string[]>>({
    reducer: (prev, next) => {
      const merged = { ...prev };
      for (const [domain, dims] of Object.entries(next)) {
        const existing = merged[domain] || [];
        const combined = new Set([...existing, ...dims]);
        merged[domain] = [...combined];
      }
      return merged;
    },
    default: () => ({}),
  }),

  /** Final structured report (generated at assessment end) */
  report: Annotation<any | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
});

/** Convenience type for the full graph state object */
export type AssessmentGraphStateType = typeof AssessmentGraphState.State;
