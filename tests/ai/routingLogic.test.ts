import { describe, it, expect } from 'vitest';
import { routeEntry, routeAfterProcessing } from '@/lib/ai/routingLogic';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import type { SymptomDomain, DomainAssessment } from '@/lib/ai/assessmentTypes';

/* ==========================================================================
   Helpers
   ========================================================================== */

function makeDomainAssessment(
  domain: SymptomDomain,
  overrides: Partial<DomainAssessment> = {},
): DomainAssessment {
  return {
    domain,
    screeningScore: 3,
    scoring: {
      functionalImpact: 0,
      control: 0,
      duration: '',
      frequency: 0,
      confidence: 0,
    },
    evidenceNotes: [],
    status: 'pending',
    questionsAsked: 0,
    ...overrides,
  };
}

function makeState(overrides: Record<string, any> = {}) {
  return {
    messages: [],
    screeningResults: [],
    flaggedDomains: [] as SymptomDomain[],
    currentDomain: null as SymptomDomain | null,
    domainAssessments: {} as Record<string, DomainAssessment>,
    questionCount: 0,
    startTime: new Date().toISOString(),
    isComplete: false,
    quickReplies: [] as string[],
    chiefComplaint: '',
    dimensionsCovered: {} as Record<string, string[]>,
    report: null,
    ...overrides,
  };
}

/* ==========================================================================
   routeEntry
   ========================================================================== */

describe('routeEntry', () => {
  it('routes to "initialize" when there are no human messages', () => {
    const state = makeState({ messages: [] });
    expect(routeEntry(state)).toBe('initialize');
  });

  it('routes to "initialize" when only AI messages exist', () => {
    const state = makeState({
      messages: [new AIMessage('Hello')],
    });
    expect(routeEntry(state)).toBe('initialize');
  });

  it('routes to "processResponse" when a human message exists', () => {
    const state = makeState({
      messages: [new AIMessage('Hello'), new HumanMessage('I feel sad')],
    });
    expect(routeEntry(state)).toBe('processResponse');
  });

  it('routes to "processResponse" with only a human message', () => {
    const state = makeState({
      messages: [new HumanMessage('test')],
    });
    expect(routeEntry(state)).toBe('processResponse');
  });
});

/* ==========================================================================
   routeAfterProcessing
   ========================================================================== */

describe('routeAfterProcessing', () => {
  it('routes to "generateReport" when time limit exceeded', () => {
    const twentyOneMinutesAgo = new Date(
      Date.now() - 21 * 60 * 1000,
    ).toISOString();
    const state = makeState({
      startTime: twentyOneMinutesAgo,
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 1,
        }),
      },
    });
    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('routes to "generateReport" when question limit reached', () => {
    const state = makeState({
      questionCount: 20,
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 4,
        }),
      },
    });
    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('routes to "generateReport" when no current domain', () => {
    const state = makeState({ currentDomain: null });
    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('routes to "generateQuestion" when domain has more questions to ask', () => {
    const state = makeState({
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 1,
        }),
      },
      dimensionsCovered: {},
    });
    expect(routeAfterProcessing(state)).toBe('generateQuestion');
  });

  it('routes to "transitionDomain" when domain is exhausted and pending domains exist', () => {
    const state = makeState({
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 4,
        }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      dimensionsCovered: {},
    });
    expect(routeAfterProcessing(state)).toBe('transitionDomain');
  });

  it('routes to "generateReport" when domain exhausted and no pending domains', () => {
    const state = makeState({
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 4,
        }),
      },
      dimensionsCovered: {},
    });
    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('routes to "transitionDomain" when enough dimensions covered and pending domains', () => {
    const state = makeState({
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 2,
        }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      dimensionsCovered: {
        depression: ['affective', 'cognitive', 'behavioral'],
      },
    });
    expect(routeAfterProcessing(state)).toBe('transitionDomain');
  });

  it('routes to "generateQuestion" when not enough dimensions and questions', () => {
    const state = makeState({
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 2,
        }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      dimensionsCovered: {
        depression: ['affective'],
      },
    });
    expect(routeAfterProcessing(state)).toBe('generateQuestion');
  });
});
