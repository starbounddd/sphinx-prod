import type {
  AssessmentGraphStateType,
  SymptomDomain,
  AssessmentDimension,
} from '../schema/types';

/* ==========================================================================
   Constants
   ========================================================================== */

export const MAX_QUESTIONS = 20;
export const MAX_DURATION_MINUTES = 20;
export const QUESTIONS_PER_DOMAIN = 4;
export const MIN_DIMENSIONS_TO_TRANSITION = 3;

/* ==========================================================================
   Helpers
   ========================================================================== */

function elapsedMinutes(startTime: string): number {
  return (Date.now() - new Date(startTime).getTime()) / 60_000;
}

export function getDimensionsCovered(
  dimensionsCoveredState: Record<string, string[]>,
  domain: SymptomDomain,
): AssessmentDimension[] {
  const dims = dimensionsCoveredState[domain];
  if (!dims) return [];
  return dims as AssessmentDimension[];
}

/* ==========================================================================
   routeEntry — decides whether to initialize or process a response
   ========================================================================== */

export function routeEntry(state: AssessmentGraphStateType): string {
  const hasHumanMessage = state.messages.some(
    (m) => m._getType() === 'human',
  );
  return hasHumanMessage ? 'processResponse' : 'initialize';
}

/* ==========================================================================
   routeAfterProcessing — decides next step after processing a user response
   ========================================================================== */

export function routeAfterProcessing(state: AssessmentGraphStateType): string {
  // Check time limit
  if (elapsedMinutes(state.startTime) >= MAX_DURATION_MINUTES) {
    return 'generateReport';
  }

  // Check global question limit
  if (state.questionCount >= MAX_QUESTIONS) {
    return 'generateReport';
  }

  const currentDomain = state.currentDomain;
  if (!currentDomain) {
    return 'generateReport';
  }

  const currentAssessment = state.domainAssessments[currentDomain];
  if (!currentAssessment) {
    return 'generateReport';
  }

  // Count pending domains
  const pendingDomains = state.flaggedDomains.filter((d) => {
    const a = state.domainAssessments[d];
    return a && a.status === 'pending';
  });

  const questionsAsked = currentAssessment.questionsAsked;
  const dimensionsCovered = getDimensionsCovered(
    state.dimensionsCovered,
    currentDomain,
  );

  // Transition if the domain has enough questions or dimensions covered
  // AND there are still pending domains
  const shouldTransition =
    (questionsAsked >= QUESTIONS_PER_DOMAIN ||
      dimensionsCovered.length >= MIN_DIMENSIONS_TO_TRANSITION) &&
    pendingDomains.length > 0;

  if (shouldTransition) {
    return 'transitionDomain';
  }

  // If domain is exhausted and no pending domains, generate report
  if (questionsAsked >= QUESTIONS_PER_DOMAIN && pendingDomains.length === 0) {
    return 'generateReport';
  }

  // Otherwise continue probing current domain
  return 'generateQuestion';
}
