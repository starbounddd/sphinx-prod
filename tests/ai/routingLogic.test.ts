// tests/ai/routingLogic.test.ts
import { describe, it, expect } from 'vitest';
import {
  routeEntry,
  routeAfterProcessing,
  MAX_QUESTIONS,
  MAX_DURATION_MINUTES,
  QUESTIONS_PER_DOMAIN,
  MIN_DIMENSIONS_TO_TRANSITION,
} from '@/lib/ai/routingLogic';
import type { DomainAssessment, SymptomDomain } from '@/lib/ai/assessmentTypes';

function makeFakeMessage(type: 'human' | 'ai') {
  return {
    _getType: () => type,
    content: 'test message',
  };
}

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
    status: 'in_progress',
    questionsAsked: 0,
    ...overrides,
  };
}

function makeState(overrides: Record<string, unknown> = {}) {
  return {
    messages: [],
    screeningResults: [],
    screeningSnapshot: {},
    flaggedDomains: ['depression'] as SymptomDomain[],
    currentDomain: 'depression' as SymptomDomain | null,
    domainAssessments: {
      depression: makeDomainAssessment('depression'),
    } as Record<string, DomainAssessment>,
    questionCount: 0,
    startTime: new Date().toISOString(),
    isComplete: false,
    quickReplies: [],
    chiefComplaint: '',
    dimensionsCovered: {} as Record<string, string[]>,
    report: null,
    ...overrides,
  };
}

describe('routing constants', () => {
  it('MAX_QUESTIONS = 20', () => expect(MAX_QUESTIONS).toBe(20));
  it('MAX_DURATION_MINUTES = 20', () => expect(MAX_DURATION_MINUTES).toBe(20));
  it('QUESTIONS_PER_DOMAIN = 4', () => expect(QUESTIONS_PER_DOMAIN).toBe(4));
  it('MIN_DIMENSIONS_TO_TRANSITION = 3', () => expect(MIN_DIMENSIONS_TO_TRANSITION).toBe(3));
});

describe('routeEntry', () => {
  it('routes to initialize when no human messages', () => {
    const state = makeState({ messages: [] });
    expect(routeEntry(state as any)).toBe('initialize');
  });

  it('routes to initialize when only AI messages', () => {
    const state = makeState({ messages: [makeFakeMessage('ai')] });
    expect(routeEntry(state as any)).toBe('initialize');
  });

  it('routes to processResponse when human message present', () => {
    const state = makeState({ messages: [makeFakeMessage('human')] });
    expect(routeEntry(state as any)).toBe('processResponse');
  });
});

describe('routeAfterProcessing', () => {
  it('generates report when time limit exceeded', () => {
    const pastTime = new Date(Date.now() - 21 * 60_000).toISOString();
    const state = makeState({ startTime: pastTime });
    expect(routeAfterProcessing(state as any)).toBe('generateReport');
  });

  it('generates report when question limit reached', () => {
    const state = makeState({ questionCount: MAX_QUESTIONS });
    expect(routeAfterProcessing(state as any)).toBe('generateReport');
  });

  it('generates report when no current domain', () => {
    const state = makeState({ currentDomain: null });
    expect(routeAfterProcessing(state as any)).toBe('generateReport');
  });

  it('transitions domain when questions per domain reached and pending domains exist', () => {
    const state = makeState({
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      currentDomain: 'depression' as SymptomDomain,
      domainAssessments: {
        depression: makeDomainAssessment('depression', { questionsAsked: QUESTIONS_PER_DOMAIN }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
    });
    expect(routeAfterProcessing(state as any)).toBe('transitionDomain');
  });

  it('transitions domain when sufficient dimensions covered and pending domains exist', () => {
    const state = makeState({
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      currentDomain: 'depression' as SymptomDomain,
      domainAssessments: {
        depression: makeDomainAssessment('depression', { questionsAsked: 1 }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      dimensionsCovered: {
        depression: ['affective', 'cognitive', 'behavioral'],
      },
    });
    expect(routeAfterProcessing(state as any)).toBe('transitionDomain');
  });

  it('generates report when domain exhausted and no pending domains', () => {
    const state = makeState({
      flaggedDomains: ['depression'] as SymptomDomain[],
      currentDomain: 'depression' as SymptomDomain,
      domainAssessments: {
        depression: makeDomainAssessment('depression', { questionsAsked: QUESTIONS_PER_DOMAIN }),
      },
    });
    expect(routeAfterProcessing(state as any)).toBe('generateReport');
  });

  it('continues with generateQuestion when domain not exhausted', () => {
    const state = makeState({
      flaggedDomains: ['depression'] as SymptomDomain[],
      currentDomain: 'depression' as SymptomDomain,
      domainAssessments: {
        depression: makeDomainAssessment('depression', { questionsAsked: 1 }),
      },
    });
    expect(routeAfterProcessing(state as any)).toBe('generateQuestion');
  });
});
