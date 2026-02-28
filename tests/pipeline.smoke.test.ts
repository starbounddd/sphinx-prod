/**
 * Smoke tests for the screening → assessment → report pipeline.
 *
 * These tests verify the data flow between components without mocking,
 * ensuring the integration works correctly end-to-end.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDomainScores,
  identifyFlaggedDomains,
  QUESTION_DOMAIN_MAP,
  DOMAIN_FEATURES,
} from '@/lib/ai/domains';
import {
  routeEntry,
  routeAfterProcessing,
  MAX_QUESTIONS,
  MAX_DURATION_MINUTES,
  QUESTIONS_PER_DOMAIN,
  MIN_DIMENSIONS_TO_TRANSITION,
} from '@/lib/ai/routingLogic';
import type { SymptomDomain, DomainAssessment } from '@/lib/ai/assessmentTypes';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

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
   Pipeline Constants Validation
   ========================================================================== */

describe('Pipeline Constants', () => {
  it('has expected routing constants', () => {
    expect(MAX_QUESTIONS).toBe(20);
    expect(MAX_DURATION_MINUTES).toBe(20);
    expect(QUESTIONS_PER_DOMAIN).toBe(4);
    expect(MIN_DIMENSIONS_TO_TRANSITION).toBe(3);
  });

  it('has all 13 domains defined in DOMAIN_FEATURES', () => {
    const expectedDomains: SymptomDomain[] = [
      'depression',
      'anger',
      'mania',
      'anxiety',
      'somatic_symptoms',
      'suicidal_tendencies',
      'psychosis',
      'sleep_problems',
      'memory',
      'repetitive_thoughts',
      'dissociation',
      'personality',
      'substance_use',
    ];

    for (const domain of expectedDomains) {
      expect(DOMAIN_FEATURES[domain]).toBeDefined();
      expect(DOMAIN_FEATURES[domain].description).toBeTruthy();
      expect(DOMAIN_FEATURES[domain].highSalienceMarkers.length).toBeGreaterThan(0);
      expect(Object.keys(DOMAIN_FEATURES[domain].probingDimensions).length).toBeGreaterThan(0);
    }
  });
});

/* ==========================================================================
   Full Pipeline Smoke Tests
   ========================================================================== */

describe('Screening → Assessment Pipeline', () => {
  /**
   * Simulates a realistic screening scenario and verifies the assessment
   * pipeline correctly prioritizes domains by specificity.
   */
  it('processes screening answers and sorts flagged domains by specificity', () => {
    // Simulate screening answers (user responds to all 17 questions)
    const screeningAnswers: Record<string, number> = {
      // High severity for low specificity
      somatic_pain: 4,
      memory_difficulty: 4,
      repetitive_compulsive: 4,
      personality_identity: 4,
      personality_relationships: 4,
      // Medium severity for high specificity
      psychosis_hearing_voices: 2,
      psychosis_thought_broadcast: 2,
      substance_use_behavior: 2,
      suicidal_thoughts: 2,
      // Low severity for everything else
      depression_low_mood: 1,
      anger_irritability: 1,
      mania_low_sleep_energy: 1,
      mania_risk_projects: 1,
      anxiety_nervous: 1,
      anxiety_avoidance: 1,
      sleep_difficulty: 1,
      dissociation_detached: 1,
    };

    // Step 1: Calculate domain scores
    const domainScores = calculateDomainScores(screeningAnswers);

    // Verify high specificity domains have score of 2
    expect(domainScores.psychosis).toBe(2);
    expect(domainScores.substance_use).toBe(2);
    expect(domainScores.suicidal_tendencies).toBe(2);

    // Verify low specificity domains have score of 4
    expect(domainScores.somatic_symptoms).toBe(4);
    expect(domainScores.memory).toBe(4);
    expect(domainScores.repetitive_thoughts).toBe(4);
    expect(domainScores.personality).toBe(4);

    // Step 2: Identify flagged domains (threshold = 2)
    const flaggedDomains = identifyFlaggedDomains(domainScores, 2);

    // Should limit to 5 domains
    expect(flaggedDomains.length).toBeLessThanOrEqual(5);

    // High specificity domains should be prioritized despite lower scores
    // psychosis, substance_use, suicidal_tendencies are all high specificity with score 2
    const firstThree = flaggedDomains.slice(0, 3);
    expect(firstThree).toContain('psychosis');
    expect(firstThree).toContain('substance_use');
    expect(firstThree).toContain('suicidal_tendencies');
  });

  it('handles edge case where only low specificity domains are flagged', () => {
    const screeningAnswers: Record<string, number> = {
      somatic_pain: 3,
      memory_difficulty: 3,
      repetitive_compulsive: 3,
      personality_identity: 3,
      personality_relationships: 3,
      // All others below threshold
      depression_low_mood: 1,
      anger_irritability: 1,
      mania_low_sleep_energy: 1,
      mania_risk_projects: 1,
      anxiety_nervous: 1,
      anxiety_avoidance: 1,
      sleep_difficulty: 1,
      dissociation_detached: 1,
      psychosis_hearing_voices: 1,
      psychosis_thought_broadcast: 1,
      substance_use_behavior: 1,
      suicidal_thoughts: 1,
    };

    const domainScores = calculateDomainScores(screeningAnswers);
    const flaggedDomains = identifyFlaggedDomains(domainScores, 2);

    // Should only contain low specificity domains
    expect(flaggedDomains.length).toBe(4); // somatic, memory, repetitive, personality
    expect(flaggedDomains).toContain('somatic_symptoms');
    expect(flaggedDomains).toContain('memory');
    expect(flaggedDomains).toContain('repetitive_thoughts');
    expect(flaggedDomains).toContain('personality');

    // And should be sorted by score descending within the low tier
    // All have score 3, so order is deterministic by filter order
    expect(flaggedDomains.length).toBe(4);
  });

  it('handles edge case where no domains meet threshold', () => {
    const screeningAnswers: Record<string, number> = {};
    for (const key of Object.keys(QUESTION_DOMAIN_MAP)) {
      screeningAnswers[key] = 1; // All scores = 1, below threshold
    }

    const domainScores = calculateDomainScores(screeningAnswers);
    const flaggedDomains = identifyFlaggedDomains(domainScores, 2);

    expect(flaggedDomains).toHaveLength(0);
  });
});

/* ==========================================================================
   Assessment → Report Pipeline
   ========================================================================== */

describe('Assessment Routing Pipeline', () => {
  it('routes through complete assessment flow for single domain', () => {
    // Initialize state with one flagged domain
    let state = makeState({
      flaggedDomains: ['depression'] as SymptomDomain[],
      currentDomain: 'depression' as SymptomDomain,
      domainAssessments: {
        depression: makeDomainAssessment('depression', { status: 'in_progress' }),
      },
    });

    // First entry without human message → initialize
    expect(routeEntry(state)).toBe('initialize');

    // Add human message → processResponse
    state.messages.push(new HumanMessage('I feel sad'));
    expect(routeEntry(state)).toBe('processResponse');

    // Not enough questions yet → generateQuestion
    expect(routeAfterProcessing(state)).toBe('generateQuestion');

    // Ask 4 questions → should generate report (no other domains)
    state.domainAssessments.depression.questionsAsked = 4;
    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('routes through assessment flow with domain transitions', () => {
    let state = makeState({
      flaggedDomains: ['psychosis', 'depression', 'anxiety'] as SymptomDomain[],
      currentDomain: 'psychosis' as SymptomDomain,
      domainAssessments: {
        psychosis: makeDomainAssessment('psychosis', { status: 'in_progress' }),
        depression: makeDomainAssessment('depression', { status: 'pending' }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      messages: [new HumanMessage('I hear voices')],
    });

    // After 4 questions on psychosis with pending domains → transitionDomain
    state.domainAssessments.psychosis.questionsAsked = 4;
    expect(routeAfterProcessing(state)).toBe('transitionDomain');
  });

  it('terminates on time limit', () => {
    const twentyOneMinutesAgo = new Date(Date.now() - 21 * 60 * 1000).toISOString();

    const state = makeState({
      startTime: twentyOneMinutesAgo,
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 1,
        }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      messages: [new HumanMessage('test')],
    });

    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('terminates on question limit', () => {
    const state = makeState({
      questionCount: MAX_QUESTIONS,
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 4,
        }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
    });

    expect(routeAfterProcessing(state)).toBe('generateReport');
  });

  it('transitions early when enough dimensions covered', () => {
    const state = makeState({
      currentDomain: 'depression' as SymptomDomain,
      flaggedDomains: ['depression', 'anxiety'] as SymptomDomain[],
      domainAssessments: {
        depression: makeDomainAssessment('depression', {
          status: 'in_progress',
          questionsAsked: 2, // Less than QUESTIONS_PER_DOMAIN
        }),
        anxiety: makeDomainAssessment('anxiety', { status: 'pending' }),
      },
      dimensionsCovered: {
        depression: ['affective', 'cognitive', 'behavioral'], // >= MIN_DIMENSIONS_TO_TRANSITION
      },
    });

    expect(routeAfterProcessing(state)).toBe('transitionDomain');
  });
});

/* ==========================================================================
   Question Domain Mapping Completeness
   ========================================================================== */

describe('Question to Domain Mapping Completeness', () => {
  it('all mapped domains have features defined', () => {
    const mappedDomains = new Set(Object.values(QUESTION_DOMAIN_MAP));

    for (const domain of mappedDomains) {
      expect(
        DOMAIN_FEATURES[domain],
        `Domain "${domain}" is mapped but has no features defined`,
      ).toBeDefined();
    }
  });

  it('all feature domains have at least one question mapped', () => {
    const featureDomains = Object.keys(DOMAIN_FEATURES) as SymptomDomain[];
    const mappedDomains = new Set(Object.values(QUESTION_DOMAIN_MAP));

    for (const domain of featureDomains) {
      expect(
        mappedDomains.has(domain),
        `Domain "${domain}" has features but no questions mapped`,
      ).toBe(true);
    }
  });

  it('each domain has probing dimensions for assessment', () => {
    for (const [domain, features] of Object.entries(DOMAIN_FEATURES)) {
      const dimensions = Object.keys(features.probingDimensions);
      expect(
        dimensions.length,
        `Domain "${domain}" has no probing dimensions`,
      ).toBeGreaterThan(0);

      // Each dimension should have example questions
      for (const dim of dimensions) {
        expect(
          features.probingDimensions[dim as keyof typeof features.probingDimensions].length,
          `Domain "${domain}" dimension "${dim}" has no example questions`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
