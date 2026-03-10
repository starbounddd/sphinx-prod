# Test Restructuring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Delete stale AI/assessment unit tests, rewrite them to match current source, and replace the monolithic `pipeline.smoke.test.ts` with a 3-phase `tests/pipeline/` folder that verifies real Supabase state at each step using real LLM + real DB.

**Architecture:** Unit tests (`tests/ai/`, `tests/assessment/`) import source directly and mock nothing (pure function tests) or mock external deps (LLM/DB for route tests). Smoke tests (`tests/pipeline/`) call the actual `assessmentService` and `assessmentGraph` functions against real Supabase and real OpenAI, using a shared test user authenticated via env vars. The 3 phase files share state via a module-scoped `SharedState` object in `helpers.ts`.

**Tech Stack:** Vitest, Prisma (real DB), Supabase auth, LangGraph/OpenAI (real LLM), TypeScript

---

## Task 1: Delete old test files

**Files:**
- Delete: `tests/ai/domains.test.ts`
- Delete: `tests/ai/guardrails.test.ts`
- Delete: `tests/ai/graphHelpers.test.ts`
- Delete: `tests/ai/inputValidation.test.ts`
- Delete: `tests/ai/inputValidation-edge-cases.test.ts`
- Delete: `tests/ai/reportMapper.test.ts`
- Delete: `tests/ai/reportSchema.test.ts`
- Delete: `tests/ai/routingLogic.test.ts`
- Delete: `tests/ai/screeningHelpers.test.ts`
- Delete: `tests/assessment/chat-route.test.ts`
- Delete: `tests/assessment/chat-route-edge-cases.test.ts`
- Delete: `tests/pipeline.smoke.test.ts`

**Step 1: Delete all stale test files**

```bash
rm tests/ai/domains.test.ts \
   tests/ai/guardrails.test.ts \
   tests/ai/graphHelpers.test.ts \
   tests/ai/inputValidation.test.ts \
   tests/ai/inputValidation-edge-cases.test.ts \
   tests/ai/reportMapper.test.ts \
   tests/ai/reportSchema.test.ts \
   tests/ai/routingLogic.test.ts \
   tests/ai/screeningHelpers.test.ts \
   tests/assessment/chat-route.test.ts \
   tests/assessment/chat-route-edge-cases.test.ts \
   tests/pipeline.smoke.test.ts
```

**Step 2: Verify only safety/ and surveys/ tests remain**

```bash
find tests/ -name '*.test.ts' | sort
```

Expected:
```
tests/safety/detectors.test.ts
tests/surveys/scoring.test.ts
```

**Step 3: Commit**

```bash
git add -A tests/
git commit -m "chore: delete stale ai/assessment/pipeline tests for rewrite"
```

---

## Task 2: Write `tests/ai/domains.test.ts`

**Files:**
- Create: `tests/ai/domains.test.ts`
- Source: `src/lib/ai/domains.ts` (exports `calculateDomainScores`, `identifyFlaggedDomains`, `QUESTION_DOMAIN_MAP`, `DOMAIN_FEATURES`)
- Source: `src/lib/ai/assessmentTypes.ts` (exports `SymptomDomain`)

**Step 1: Write the test**

```typescript
// tests/ai/domains.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateDomainScores,
  identifyFlaggedDomains,
  QUESTION_DOMAIN_MAP,
  DOMAIN_FEATURES,
} from '@/lib/ai/domains';

/* ==========================================================================
   Constants
   ========================================================================== */

const ALL_DOMAINS = [
  'depression', 'anger', 'mania', 'anxiety', 'somatic_symptoms',
  'suicidal_tendencies', 'psychosis', 'sleep_problems', 'memory',
  'repetitive_thoughts', 'dissociation', 'personality', 'substance_use',
] as const;

const ALL_QUESTIONS = [
  'depression_low_mood', 'anger_irritability', 'mania_low_sleep_energy',
  'mania_risk_projects', 'anxiety_nervous', 'anxiety_avoidance',
  'somatic_pain', 'suicidal_thoughts', 'psychosis_hearing_voices',
  'psychosis_thought_broadcast', 'sleep_difficulty', 'memory_difficulty',
  'repetitive_compulsive', 'dissociation_detached', 'personality_identity',
  'personality_relationships', 'substance_use_behavior',
] as const;

/* ==========================================================================
   QUESTION_DOMAIN_MAP
   ========================================================================== */

describe('QUESTION_DOMAIN_MAP', () => {
  it('maps all 17 questions to valid domains', () => {
    expect(Object.keys(QUESTION_DOMAIN_MAP)).toHaveLength(17);
    for (const qId of ALL_QUESTIONS) {
      expect(QUESTION_DOMAIN_MAP[qId]).toBeDefined();
      expect(ALL_DOMAINS).toContain(QUESTION_DOMAIN_MAP[qId]);
    }
  });

  it('maps multi-question domains correctly', () => {
    // mania has 2 questions
    expect(QUESTION_DOMAIN_MAP['mania_low_sleep_energy']).toBe('mania');
    expect(QUESTION_DOMAIN_MAP['mania_risk_projects']).toBe('mania');
    // anxiety has 2
    expect(QUESTION_DOMAIN_MAP['anxiety_nervous']).toBe('anxiety');
    expect(QUESTION_DOMAIN_MAP['anxiety_avoidance']).toBe('anxiety');
    // psychosis has 2
    expect(QUESTION_DOMAIN_MAP['psychosis_hearing_voices']).toBe('psychosis');
    expect(QUESTION_DOMAIN_MAP['psychosis_thought_broadcast']).toBe('psychosis');
    // personality has 2
    expect(QUESTION_DOMAIN_MAP['personality_identity']).toBe('personality');
    expect(QUESTION_DOMAIN_MAP['personality_relationships']).toBe('personality');
  });
});

/* ==========================================================================
   DOMAIN_FEATURES
   ========================================================================== */

describe('DOMAIN_FEATURES', () => {
  it('defines features for all 13 domains', () => {
    for (const domain of ALL_DOMAINS) {
      expect(DOMAIN_FEATURES[domain]).toBeDefined();
      expect(DOMAIN_FEATURES[domain].description).toBeTruthy();
      expect(DOMAIN_FEATURES[domain].highSalienceMarkers.length).toBeGreaterThan(0);
    }
  });

  it('each domain has all 6 probing dimensions', () => {
    const expectedDimensions = [
      'affective', 'cognitive', 'physiological', 'behavioral', 'functional', 'perceptual',
    ];
    for (const domain of ALL_DOMAINS) {
      const dims = Object.keys(DOMAIN_FEATURES[domain].probingDimensions);
      expect(dims).toEqual(expect.arrayContaining(expectedDimensions));
    }
  });
});

/* ==========================================================================
   calculateDomainScores
   ========================================================================== */

describe('calculateDomainScores', () => {
  it('averages scores for multi-question domains', () => {
    const answers = {
      mania_low_sleep_energy: 2,
      mania_risk_projects: 4,
    };
    const scores = calculateDomainScores(answers);
    expect(scores.mania).toBe(3); // (2+4)/2
  });

  it('passes through single-question domains directly', () => {
    const answers = { depression_low_mood: 3 };
    const scores = calculateDomainScores(answers);
    expect(scores.depression).toBe(3);
  });

  it('ignores unknown question IDs', () => {
    const answers = {
      depression_low_mood: 2,
      unknown_question: 4,
    };
    const scores = calculateDomainScores(answers);
    expect(scores.depression).toBe(2);
    expect(scores).not.toHaveProperty('unknown');
  });

  it('handles all 17 questions', () => {
    const answers: Record<string, number> = {};
    for (const q of ALL_QUESTIONS) {
      answers[q] = 2;
    }
    const scores = calculateDomainScores(answers);
    // All domains mapped should have score 2
    for (const domain of Object.keys(scores)) {
      expect(scores[domain as keyof typeof scores]).toBe(2);
    }
  });

  it('returns empty object for empty answers', () => {
    const scores = calculateDomainScores({});
    expect(Object.keys(scores)).toHaveLength(0);
  });
});

/* ==========================================================================
   identifyFlaggedDomains
   ========================================================================== */

describe('identifyFlaggedDomains', () => {
  it('flags domains with score >= 2 (default threshold)', () => {
    const scores = { depression: 3, anxiety: 2, anger: 1.5 } as Record<string, number>;
    const flagged = identifyFlaggedDomains(scores);
    expect(flagged).toContain('depression');
    expect(flagged).toContain('anxiety');
    expect(flagged).not.toContain('anger');
  });

  it('sorts by specificity tier then score', () => {
    // psychosis=high specificity, depression=medium, somatic_symptoms=low
    const scores = {
      somatic_symptoms: 4,
      depression: 3,
      psychosis: 2,
    } as Record<string, number>;
    const flagged = identifyFlaggedDomains(scores);
    expect(flagged[0]).toBe('psychosis');    // high tier
    expect(flagged[1]).toBe('depression');   // medium tier
    expect(flagged[2]).toBe('somatic_symptoms'); // low tier
  });

  it('limits to max 5 domains by default', () => {
    const scores: Record<string, number> = {};
    for (const domain of ALL_DOMAINS) {
      scores[domain] = 3;
    }
    const flagged = identifyFlaggedDomains(scores);
    expect(flagged.length).toBeLessThanOrEqual(5);
  });

  it('respects custom threshold', () => {
    const scores = { depression: 1.5 } as Record<string, number>;
    expect(identifyFlaggedDomains(scores, 1)).toContain('depression');
    expect(identifyFlaggedDomains(scores, 2)).not.toContain('depression');
  });

  it('respects custom maxDomains', () => {
    const scores: Record<string, number> = {};
    for (const domain of ALL_DOMAINS) {
      scores[domain] = 3;
    }
    const flagged = identifyFlaggedDomains(scores, 2, 3);
    expect(flagged).toHaveLength(3);
  });

  it('returns empty array when no domains meet threshold', () => {
    const scores = { depression: 1, anxiety: 0.5 } as Record<string, number>;
    expect(identifyFlaggedDomains(scores)).toEqual([]);
  });
});
```

**Step 2: Run and verify it passes**

```bash
vitest run tests/ai/domains.test.ts
```

Expected: All tests PASS.

**Step 3: Commit**

```bash
git add tests/ai/domains.test.ts
git commit -m "test: rewrite domains.test.ts for current source"
```

---

## Task 3: Write `tests/ai/inputValidation.test.ts`

**Files:**
- Create: `tests/ai/inputValidation.test.ts`
- Source: `src/lib/ai/inputValidation.ts` (exports `validateThreadId`, `validateScreeningAnswers`, `validateMessage`)

**Step 1: Write the test**

```typescript
// tests/ai/inputValidation.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateThreadId,
  validateScreeningAnswers,
  validateMessage,
} from '@/lib/ai/inputValidation';

/* ==========================================================================
   validateThreadId
   ========================================================================== */

describe('validateThreadId', () => {
  it('accepts a non-empty string', () => {
    expect(validateThreadId('abc-123')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateThreadId('')).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(validateThreadId(123)).toBe(false);
    expect(validateThreadId(null)).toBe(false);
    expect(validateThreadId(undefined)).toBe(false);
    expect(validateThreadId({})).toBe(false);
  });

  it('rejects strings exceeding 256 chars', () => {
    expect(validateThreadId('a'.repeat(256))).toBe(true);
    expect(validateThreadId('a'.repeat(257))).toBe(false);
  });

  it('accepts single character', () => {
    expect(validateThreadId('x')).toBe(true);
  });
});

/* ==========================================================================
   validateScreeningAnswers
   ========================================================================== */

describe('validateScreeningAnswers', () => {
  it('accepts valid answers (scores 0-4)', () => {
    const result = validateScreeningAnswers({
      depression_low_mood: 0,
      anxiety_nervous: 2,
      psychosis_hearing_voices: 4,
    });
    expect(result.valid).toBe(true);
  });

  it('rejects null', () => {
    expect(validateScreeningAnswers(null).valid).toBe(false);
  });

  it('rejects undefined', () => {
    expect(validateScreeningAnswers(undefined).valid).toBe(false);
  });

  it('rejects arrays', () => {
    expect(validateScreeningAnswers([1, 2, 3]).valid).toBe(false);
  });

  it('rejects non-number scores', () => {
    const result = validateScreeningAnswers({ q1: 'high' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('must be a number');
  });

  it('rejects NaN scores', () => {
    const result = validateScreeningAnswers({ q1: NaN });
    expect(result.valid).toBe(false);
  });

  it('rejects Infinity scores', () => {
    const result = validateScreeningAnswers({ q1: Infinity });
    expect(result.valid).toBe(false);
  });

  it('rejects out-of-range scores (below 0)', () => {
    const result = validateScreeningAnswers({ q1: -1 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('between 0 and 4');
  });

  it('rejects out-of-range scores (above 4)', () => {
    const result = validateScreeningAnswers({ q1: 5 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('between 0 and 4');
  });

  it('accepts float scores within 0-4', () => {
    const result = validateScreeningAnswers({ q1: 2.5 });
    expect(result.valid).toBe(true);
  });

  it('accepts empty object', () => {
    const result = validateScreeningAnswers({});
    expect(result.valid).toBe(true);
  });
});

/* ==========================================================================
   validateMessage
   ========================================================================== */

describe('validateMessage', () => {
  it('accepts normal messages', () => {
    const result = validateMessage('Hello, I have been feeling anxious.');
    expect(result.valid).toBe(true);
  });

  it('rejects non-string types', () => {
    expect(validateMessage(123).valid).toBe(false);
    expect(validateMessage(null).valid).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateMessage('').valid).toBe(false);
  });

  it('rejects whitespace-only strings', () => {
    expect(validateMessage('   ').valid).toBe(false);
  });

  it('rejects messages exceeding 5000 chars', () => {
    expect(validateMessage('a'.repeat(5000)).valid).toBe(true);
    expect(validateMessage('a'.repeat(5001)).valid).toBe(false);
  });

  it('accepts messages with emoji', () => {
    expect(validateMessage('I feel okay 😊').valid).toBe(true);
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/ai/inputValidation.test.ts
```

**Step 3: Commit**

```bash
git add tests/ai/inputValidation.test.ts
git commit -m "test: rewrite inputValidation.test.ts for current source"
```

---

## Task 4: Write `tests/ai/reportSchema.test.ts`

**Files:**
- Create: `tests/ai/reportSchema.test.ts`
- Source: `src/lib/ai/reportSchema.ts` (exports `validateAIReport`)

**Step 1: Write the test**

```typescript
// tests/ai/reportSchema.test.ts
import { describe, it, expect } from 'vitest';
import { validateAIReport } from '@/lib/ai/reportSchema';
import type { AIGeneratedReport } from '@/lib/ai/reportSchema';

function makeValidReport(): AIGeneratedReport {
  return {
    chiefComplaint: 'Persistent anxiety and trouble sleeping',
    mainGoal: 'Better manage daily anxiety',
    analysis: 'The individual presents with moderate anxiety impacting daily functioning.',
    domains: [
      {
        domain: 'anxiety',
        label: 'Anxiety',
        screeningScore: 3,
        functionalImpact: 2,
        control: 1,
        duration: '6 months',
        frequency: 2,
        confidence: 2,
        summary: 'Moderate anxiety with avoidance behaviors.',
      },
    ],
    findings: [
      {
        icon: 'zap',
        title: 'Elevated anxiety with avoidance',
        description: 'The individual reports significant anxiety.',
      },
    ],
    recommendations: ['Consider CBT therapy', 'Practice mindfulness'],
  };
}

describe('validateAIReport', () => {
  it('accepts a valid complete report', () => {
    const result = validateAIReport(makeValidReport());
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.report.chiefComplaint).toBe('Persistent anxiety and trouble sleeping');
    }
  });

  it('accepts optional culturalBackground and summary', () => {
    const report = { ...makeValidReport(), culturalBackground: 'East Asian background', summary: 'Anxiety flagged' };
    const result = validateAIReport(report);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.report.culturalBackground).toBe('East Asian background');
      expect(result.report.summary).toBe('Anxiety flagged');
    }
  });

  it('rejects null input', () => {
    expect(validateAIReport(null).valid).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(validateAIReport('string').valid).toBe(false);
  });

  it('rejects missing chiefComplaint', () => {
    const report = makeValidReport();
    delete (report as any).chiefComplaint;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects missing mainGoal', () => {
    const report = makeValidReport();
    delete (report as any).mainGoal;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects missing analysis', () => {
    const report = makeValidReport();
    delete (report as any).analysis;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects non-array domains', () => {
    const report = { ...makeValidReport(), domains: 'not-array' };
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with NaN screeningScore', () => {
    const report = makeValidReport();
    report.domains[0].screeningScore = NaN;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with Infinity functionalImpact', () => {
    const report = makeValidReport();
    report.domains[0].functionalImpact = Infinity;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with out-of-range screeningScore (>4)', () => {
    const report = makeValidReport();
    report.domains[0].screeningScore = 5;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects domain with out-of-range functionalImpact (>3)', () => {
    const report = makeValidReport();
    report.domains[0].functionalImpact = 4;
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects invalid finding icon', () => {
    const report = makeValidReport();
    (report.findings[0] as any).icon = 'invalid-icon';
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('accepts all valid icons: zap, clock, activity, calendar', () => {
    for (const icon of ['zap', 'clock', 'activity', 'calendar']) {
      const report = makeValidReport();
      report.findings[0].icon = icon as any;
      expect(validateAIReport(report).valid).toBe(true);
    }
  });

  it('rejects non-string recommendation entries', () => {
    const report = makeValidReport();
    (report as any).recommendations = [123];
    expect(validateAIReport(report).valid).toBe(false);
  });

  it('rejects non-string culturalBackground', () => {
    const report = { ...makeValidReport(), culturalBackground: 123 };
    expect(validateAIReport(report).valid).toBe(false);
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/ai/reportSchema.test.ts
```

**Step 3: Commit**

```bash
git add tests/ai/reportSchema.test.ts
git commit -m "test: rewrite reportSchema.test.ts for current source"
```

---

## Task 5: Write `tests/ai/screeningHelpers.test.ts`

**Files:**
- Create: `tests/ai/screeningHelpers.test.ts`
- Source: `src/lib/ai/screeningHelpers.ts` (exports `toScreeningResults`)

**Step 1: Write the test**

```typescript
// tests/ai/screeningHelpers.test.ts
import { describe, it, expect } from 'vitest';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';

describe('toScreeningResults', () => {
  it('converts raw answers to ScreeningResult[]', () => {
    const answers = { depression_low_mood: 3, anxiety_nervous: 2 };
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(2);

    const depression = results.find((r) => r.questionId === 'depression_low_mood');
    expect(depression).toBeDefined();
    expect(depression!.domain).toBe('depression');
    expect(depression!.score).toBe(3);
    expect(depression!.questionText).toBeTruthy();
  });

  it('filters out unknown question IDs', () => {
    const answers = { depression_low_mood: 2, unknown_q: 4 };
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(1);
    expect(results[0].questionId).toBe('depression_low_mood');
  });

  it('handles all 17 known questions', () => {
    const answers: Record<string, number> = {};
    const allQuestions = [
      'depression_low_mood', 'anger_irritability', 'mania_low_sleep_energy',
      'mania_risk_projects', 'anxiety_nervous', 'anxiety_avoidance',
      'somatic_pain', 'suicidal_thoughts', 'psychosis_hearing_voices',
      'psychosis_thought_broadcast', 'sleep_difficulty', 'memory_difficulty',
      'repetitive_compulsive', 'dissociation_detached', 'personality_identity',
      'personality_relationships', 'substance_use_behavior',
    ];
    for (const q of allQuestions) {
      answers[q] = 2;
    }
    const results = toScreeningResults(answers);
    expect(results).toHaveLength(17);
  });

  it('returns empty array for empty input', () => {
    expect(toScreeningResults({})).toEqual([]);
  });

  it('each result has a non-empty questionText', () => {
    const results = toScreeningResults({ depression_low_mood: 1 });
    expect(results[0].questionText).toBeTruthy();
    expect(results[0].questionText.length).toBeGreaterThan(10);
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/ai/screeningHelpers.test.ts
```

**Step 3: Commit**

```bash
git add tests/ai/screeningHelpers.test.ts
git commit -m "test: rewrite screeningHelpers.test.ts for current source"
```

---

## Task 6: Write `tests/ai/routingLogic.test.ts`

**Files:**
- Create: `tests/ai/routingLogic.test.ts`
- Source: `src/lib/ai/routingLogic.ts` (exports `routeEntry`, `routeAfterProcessing`, constants)
- Source: `src/lib/ai/assessmentTypes.ts` (for state type)

Note: `routeEntry` and `routeAfterProcessing` take `AssessmentGraphStateType` which includes LangChain messages. Tests must construct mock state objects with `_getType()` method on messages.

**Step 1: Write the test**

```typescript
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

/* ==========================================================================
   Helpers
   ========================================================================== */

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

/* ==========================================================================
   Constants
   ========================================================================== */

describe('routing constants', () => {
  it('MAX_QUESTIONS = 20', () => expect(MAX_QUESTIONS).toBe(20));
  it('MAX_DURATION_MINUTES = 20', () => expect(MAX_DURATION_MINUTES).toBe(20));
  it('QUESTIONS_PER_DOMAIN = 4', () => expect(QUESTIONS_PER_DOMAIN).toBe(4));
  it('MIN_DIMENSIONS_TO_TRANSITION = 3', () => expect(MIN_DIMENSIONS_TO_TRANSITION).toBe(3));
});

/* ==========================================================================
   routeEntry
   ========================================================================== */

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

/* ==========================================================================
   routeAfterProcessing
   ========================================================================== */

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
```

**Step 2: Run and verify**

```bash
vitest run tests/ai/routingLogic.test.ts
```

**Step 3: Commit**

```bash
git add tests/ai/routingLogic.test.ts
git commit -m "test: rewrite routingLogic.test.ts for current source"
```

---

## Task 7: Write `tests/ai/reportMapper.test.ts`

**Files:**
- Create: `tests/ai/reportMapper.test.ts`
- Source: `src/lib/ai/reportMapper.ts` (exports `impactLabel`, `specificityFromConfidence`, `mapDomainToResult`, `mapFindingToInsight`, `computeSummaryStats`, `mapAIReportToAssessmentReport`)

**Step 1: Write the test**

```typescript
// tests/ai/reportMapper.test.ts
import { describe, it, expect } from 'vitest';
import {
  impactLabel,
  specificityFromConfidence,
  mapDomainToResult,
  mapFindingToInsight,
  computeSummaryStats,
  mapAIReportToAssessmentReport,
} from '@/lib/ai/reportMapper';
import type { AIGeneratedReport, AIReportDomain, AIReportFinding } from '@/lib/ai/reportSchema';

/* ==========================================================================
   Helpers
   ========================================================================== */

function makeDomain(overrides: Partial<AIReportDomain> = {}): AIReportDomain {
  return {
    domain: 'anxiety',
    label: 'Anxiety',
    screeningScore: 3,
    functionalImpact: 2,
    control: 1,
    duration: '3 months',
    frequency: 2,
    confidence: 2,
    summary: 'Moderate anxiety.',
    ...overrides,
  };
}

function makeReport(overrides: Partial<AIGeneratedReport> = {}): AIGeneratedReport {
  return {
    chiefComplaint: 'Feeling anxious',
    mainGoal: 'Manage anxiety',
    analysis: 'Moderate anxiety impacting daily life.',
    domains: [makeDomain()],
    findings: [{ icon: 'zap', title: 'Elevated anxiety', description: 'Significant anxiety.' }],
    recommendations: ['CBT therapy'],
    ...overrides,
  };
}

/* ==========================================================================
   impactLabel
   ========================================================================== */

describe('impactLabel', () => {
  it('maps 0 -> None', () => expect(impactLabel(0)).toBe('None'));
  it('maps 1 -> Mild', () => expect(impactLabel(1)).toBe('Mild'));
  it('maps 2 -> Moderate', () => expect(impactLabel(2)).toBe('Moderate'));
  it('maps 3 -> High', () => expect(impactLabel(3)).toBe('High'));
  it('defaults unknown to None', () => expect(impactLabel(99)).toBe('None'));
});

/* ==========================================================================
   specificityFromConfidence
   ========================================================================== */

describe('specificityFromConfidence', () => {
  it('maps 0 -> Low', () => expect(specificityFromConfidence(0)).toBe('Low'));
  it('maps 1 -> Low', () => expect(specificityFromConfidence(1)).toBe('Low'));
  it('maps 2 -> Medium', () => expect(specificityFromConfidence(2)).toBe('Medium'));
  it('maps 3 -> High', () => expect(specificityFromConfidence(3)).toBe('High'));
});

/* ==========================================================================
   mapDomainToResult
   ========================================================================== */

describe('mapDomainToResult', () => {
  it('converts AIReportDomain to DomainResult', () => {
    const result = mapDomainToResult(makeDomain());
    expect(result.domain).toBe('anxiety');
    expect(result.label).toBe('Anxiety');
    expect(result.specificity).toBe('Medium'); // confidence=2
    expect(result.impact).toBe('Moderate');     // functionalImpact=2
    expect(result.control).toBe(1);
    expect(result.frequency).toBe(2);
    expect(result.duration).toBe('3 months');
    expect(result.clinicalNotes).toBe('Moderate anxiety.');
  });
});

/* ==========================================================================
   mapFindingToInsight
   ========================================================================== */

describe('mapFindingToInsight', () => {
  it('converts AIReportFinding to AIInsight', () => {
    const finding: AIReportFinding = {
      icon: 'zap',
      title: 'Test',
      description: 'Test desc',
    };
    const insight = mapFindingToInsight(finding);
    expect(insight.icon).toBe('zap');
    expect(insight.title).toBe('Test');
    expect(insight.body).toBe('Test desc');
    expect(insight.source).toBe('AI assessment analysis');
    expect(insight.iconColor).toBe('#D97706'); // zap color
  });

  it('maps all icon colors correctly', () => {
    expect(mapFindingToInsight({ icon: 'zap', title: '', description: '' }).iconColor).toBe('#D97706');
    expect(mapFindingToInsight({ icon: 'clock', title: '', description: '' }).iconColor).toBe('#0D9488');
    expect(mapFindingToInsight({ icon: 'activity', title: '', description: '' }).iconColor).toBe('#0D9488');
    expect(mapFindingToInsight({ icon: 'calendar', title: '', description: '' }).iconColor).toBe('#FFB7B2');
  });
});

/* ==========================================================================
   computeSummaryStats
   ========================================================================== */

describe('computeSummaryStats', () => {
  it('returns 4 summary stat cards', () => {
    const stats = computeSummaryStats(makeReport());
    expect(stats).toHaveLength(4);
  });

  it('first card shows domains count', () => {
    const stats = computeSummaryStats(makeReport({ domains: [makeDomain(), makeDomain({ domain: 'depression', label: 'Depression' })] }));
    expect(stats[0].value).toBe('2');
    expect(stats[0].label).toContain('Domains Flagged');
  });

  it('second card shows highest severity domain', () => {
    const stats = computeSummaryStats(makeReport({
      domains: [
        makeDomain({ label: 'Anxiety', functionalImpact: 1 }),
        makeDomain({ domain: 'depression', label: 'Depression', functionalImpact: 3 }),
      ],
    }));
    expect(stats[1].value).toBe('Depression');
  });

  it('handles empty domains', () => {
    const stats = computeSummaryStats(makeReport({ domains: [] }));
    expect(stats[0].value).toBe('0');
    expect(stats[1].value).toBe('N/A');
  });
});

/* ==========================================================================
   mapAIReportToAssessmentReport
   ========================================================================== */

describe('mapAIReportToAssessmentReport', () => {
  it('maps full report with correct structure', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport(),
      domainAssessments: {},
    });
    expect(result.id).toBeTruthy();
    expect(result.status).toBe('completed');
    expect(result.chiefComplaint).toBe('Feeling anxious');
    expect(result.analysis).toBe('Moderate anxiety impacting daily life.');
    expect(result.domains).toHaveLength(1);
    expect(result.summaryStats).toHaveLength(4);
    // findings (1) + recommendations insight (1) = 2 insights
    expect(result.insights).toHaveLength(2);
  });

  it('uses provided patient name', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport(),
      domainAssessments: {},
      patientName: 'Jane Doe',
    });
    expect(result.patientName).toBe('Jane Doe');
  });

  it('defaults patientName to Patient', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport(),
      domainAssessments: {},
    });
    expect(result.patientName).toBe('Patient');
  });

  it('appends recommendations as insight card', () => {
    const result = mapAIReportToAssessmentReport({
      aiReport: makeReport({ recommendations: ['Rec 1', 'Rec 2'] }),
      domainAssessments: {},
    });
    const recsInsight = result.insights.find((i) => i.title === 'Recommended Next Steps');
    expect(recsInsight).toBeDefined();
    expect(recsInsight!.body).toContain('Rec 1');
    expect(recsInsight!.body).toContain('Rec 2');
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/ai/reportMapper.test.ts
```

**Step 3: Commit**

```bash
git add tests/ai/reportMapper.test.ts
git commit -m "test: rewrite reportMapper.test.ts for current source"
```

---

## Task 8: Write `tests/pipeline/helpers.ts`

**Files:**
- Create: `tests/pipeline/helpers.ts`
- Reference: `src/lib/db/prisma.ts`, `src/lib/supabase/client.ts`

**Step 1: Write the helpers**

```typescript
// tests/pipeline/helpers.ts
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/db/prisma';

/* ==========================================================================
   Environment
   ========================================================================== */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/* ==========================================================================
   Supabase Auth Client (for test user sign-in)
   ========================================================================== */

let _supabase: ReturnType<typeof createClient> | null = null;

export function getTestSupabaseClient() {
  if (!_supabase) {
    _supabase = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    );
  }
  return _supabase;
}

/* ==========================================================================
   Shared State (module-scoped, persists across test files in single run)
   ========================================================================== */

export const sharedState = {
  userId: '',
  threadId: '',
  sessionId: '',
  domainScores: {} as Record<string, number>,
  flaggedDomains: [] as string[],
  answers: {} as Record<string, number>,
};

/* ==========================================================================
   Test Data
   ========================================================================== */

/** Realistic 17-question screening answers.
 *  Designed to flag: depression(3), anxiety(3), psychosis(2.5), sleep(3).
 *  Not flagged: anger(1), mania(1), somatic(1), suicidal(0), memory(1),
 *  repetitive(1), dissociation(1), personality(1), substance(0).
 */
export const SCREENING_ANSWERS: Record<string, number> = {
  depression_low_mood: 3,
  anger_irritability: 1,
  mania_low_sleep_energy: 1,
  mania_risk_projects: 1,
  anxiety_nervous: 3,
  anxiety_avoidance: 3,
  somatic_pain: 1,
  suicidal_thoughts: 0,
  psychosis_hearing_voices: 3,
  psychosis_thought_broadcast: 2,
  sleep_difficulty: 3,
  memory_difficulty: 1,
  repetitive_compulsive: 1,
  dissociation_detached: 1,
  personality_identity: 1,
  personality_relationships: 1,
  substance_use_behavior: 0,
};

/* ==========================================================================
   Auth Helper
   ========================================================================== */

export async function signInTestUser(): Promise<string> {
  const supabase = getTestSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: requireEnv('TEST_USER_EMAIL'),
    password: requireEnv('TEST_USER_PASSWORD'),
  });
  if (error || !data.user) {
    throw new Error(`Test user sign-in failed: ${error?.message ?? 'no user returned'}`);
  }
  return data.user.id;
}

/* ==========================================================================
   Cleanup
   ========================================================================== */

export async function cleanup() {
  const { userId } = sharedState;
  if (!userId) return;

  // Delete in dependency order:
  // 1. Get all sessions for the test user
  const sessions = await prisma.assessmentSession.findMany({
    where: { userId },
    select: { id: true },
  });
  const sessionIds = sessions.map((s) => s.id);

  if (sessionIds.length > 0) {
    // 2. Delete dependent records
    await prisma.safetyEvent.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.assessmentReport.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.chatMessage.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.domainAssessment.deleteMany({ where: { sessionId: { in: sessionIds } } });
    // 3. Delete sessions
    await prisma.assessmentSession.deleteMany({ where: { id: { in: sessionIds } } });
  }

  // 4. Delete screening result
  await prisma.userScreeningResult.deleteMany({ where: { userId } });
}

/* ==========================================================================
   Prisma re-export
   ========================================================================== */

export { prisma };
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit tests/pipeline/helpers.ts 2>&1 || echo "Type check via vitest run"
```

Note: This file has no tests itself — it will be validated when the phase files import it.

**Step 3: Commit**

```bash
git add tests/pipeline/helpers.ts
git commit -m "test: add pipeline smoke test helpers (shared state, auth, cleanup)"
```

---

## Task 9: Write `tests/pipeline/01-screening.test.ts`

**Files:**
- Create: `tests/pipeline/01-screening.test.ts`
- Uses: `tests/pipeline/helpers.ts`
- Source: `src/lib/ai/domains.ts`, `src/lib/db/assessmentService.ts`

**Step 1: Write the test**

```typescript
// tests/pipeline/01-screening.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  signInTestUser,
  sharedState,
  SCREENING_ANSWERS,
  cleanup,
  prisma,
} from './helpers';
import { calculateDomainScores, identifyFlaggedDomains } from '@/lib/ai/domains';
import { upsertUserScreening, getUserScreening } from '@/lib/db/assessmentService';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';

describe('Phase 1: Screening', () => {
  beforeAll(async () => {
    // Clean up any leftover test data first
    const userId = await signInTestUser();
    sharedState.userId = userId;
    await cleanup();
  });

  afterAll(async () => {
    // Don't cleanup here — subsequent phases need the data
  });

  it('authenticates the test user', () => {
    expect(sharedState.userId).toBeTruthy();
    expect(sharedState.userId.length).toBeGreaterThan(0);
  });

  it('calculates domain scores from screening answers', () => {
    const domainScores = calculateDomainScores(SCREENING_ANSWERS);
    sharedState.domainScores = domainScores;
    sharedState.answers = SCREENING_ANSWERS;

    // Verify expected scores
    expect(domainScores.depression).toBe(3);
    expect(domainScores.anxiety).toBe(3);         // (3+3)/2
    expect(domainScores.psychosis).toBe(2.5);      // (3+2)/2
    expect(domainScores.sleep_problems).toBe(3);
    expect(domainScores.anger).toBe(1);
    expect(domainScores.suicidal_tendencies).toBe(0);
  });

  it('identifies flagged domains with specificity sorting', () => {
    const flagged = identifyFlaggedDomains(sharedState.domainScores);
    sharedState.flaggedDomains = flagged;

    // psychosis is high specificity, should be first even though score=2.5
    expect(flagged[0]).toBe('psychosis');
    // depression=3, anxiety=3, sleep=3 are medium tier
    expect(flagged).toContain('depression');
    expect(flagged).toContain('anxiety');
    expect(flagged).toContain('sleep_problems');
    // Max 5 domains
    expect(flagged.length).toBeLessThanOrEqual(5);
    // Anger=1, suicidal=0 should NOT be flagged
    expect(flagged).not.toContain('anger');
    expect(flagged).not.toContain('suicidal_tendencies');
  });

  it('persists screening to Supabase via upsertUserScreening', async () => {
    await upsertUserScreening({
      userId: sharedState.userId,
      answers: SCREENING_ANSWERS,
      domainScores: sharedState.domainScores,
      flaggedDomains: sharedState.flaggedDomains as any,
    });
  });

  it('[Supabase check] user_screening_results has correct data', async () => {
    const screening = await getUserScreening(sharedState.userId);
    expect(screening).not.toBeNull();

    const answers = screening!.answers as Record<string, number>;
    expect(answers.depression_low_mood).toBe(3);
    expect(answers.anxiety_nervous).toBe(3);

    const domainScores = screening!.domainScores as Record<string, number>;
    expect(domainScores.depression).toBe(3);
    expect(domainScores.psychosis).toBe(2.5);

    const flagged = screening!.flaggedDomains as string[];
    expect(flagged).toContain('psychosis');
    expect(flagged).toContain('depression');
  });

  it('converts answers to ScreeningResult[] format', () => {
    const results = toScreeningResults(SCREENING_ANSWERS);
    expect(results).toHaveLength(17);
    // Every result should have domain, score, questionText
    for (const r of results) {
      expect(r.domain).toBeTruthy();
      expect(typeof r.score).toBe('number');
      expect(r.questionText).toBeTruthy();
    }
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/pipeline/01-screening.test.ts --timeout 30000
```

Expected: All PASS (requires env vars set).

**Step 3: Commit**

```bash
git add tests/pipeline/01-screening.test.ts
git commit -m "test: add pipeline phase 1 — screening with Supabase verification"
```

---

## Task 10: Write `tests/pipeline/02-assessment.test.ts`

**Files:**
- Create: `tests/pipeline/02-assessment.test.ts`
- Uses: `tests/pipeline/helpers.ts`
- Source: `src/lib/ai/assessmentGraph.ts`, `src/lib/db/assessmentService.ts`

**Step 1: Write the test**

```typescript
// tests/pipeline/02-assessment.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import {
  sharedState,
  SCREENING_ANSWERS,
  signInTestUser,
  prisma,
} from './helpers';
import {
  runAssessmentTurn,
  resetAssessmentGraph,
} from '@/lib/ai/assessmentGraph';
import {
  createAssessmentSession,
  getSessionByThreadId,
  getSessionDomainAssessments,
  getUserScreening,
} from '@/lib/db/assessmentService';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import type { SymptomDomain } from '@/lib/ai/assessmentTypes';

describe('Phase 2: Assessment Chat', { timeout: 180_000 }, () => {
  beforeAll(async () => {
    // If running standalone (sharedState empty), sign in and read from DB
    if (!sharedState.userId) {
      sharedState.userId = await signInTestUser();
      const screening = await getUserScreening(sharedState.userId);
      if (!screening) throw new Error('No screening data — run 01-screening first');
      sharedState.domainScores = screening.domainScores as Record<string, number>;
      sharedState.flaggedDomains = screening.flaggedDomains as string[];
      sharedState.answers = screening.answers as Record<string, number>;
    }

    // Reset graph singleton for clean state
    resetAssessmentGraph();

    // Generate a unique threadId for this test run
    sharedState.threadId = uuidv4();
  });

  it('initializes assessment session with real LLM', async () => {
    const screeningResults = toScreeningResults(sharedState.answers);

    const result = await runAssessmentTurn(
      sharedState.threadId,
      undefined,
      screeningResults,
      sharedState.flaggedDomains as SymptomDomain[],
      sharedState.domainScores,
    );

    // Should return an AI message
    expect(result.messages.length).toBeGreaterThan(0);
    const lastMsg = result.messages[result.messages.length - 1];
    expect(typeof lastMsg.content).toBe('string');
    expect((lastMsg.content as string).length).toBeGreaterThan(10);

    // Should have a current domain
    expect(result.currentDomain).toBeTruthy();

    // Should have domain assessments initialized
    expect(Object.keys(result.domainAssessments).length).toBeGreaterThan(0);

    // Should not be complete yet
    expect(result.isComplete).toBe(false);
  });

  it('creates session in Supabase', async () => {
    const session = await createAssessmentSession({
      threadId: sharedState.threadId,
      userId: sharedState.userId,
      flaggedDomains: sharedState.flaggedDomains as SymptomDomain[],
      screeningSnapshot: sharedState.domainScores,
    });

    sharedState.sessionId = session.id;
    expect(session.threadId).toBe(sharedState.threadId);
    expect(session.status).toBe('in_progress');
  });

  it('[Supabase check] session exists with correct screening snapshot', async () => {
    const session = await getSessionByThreadId(sharedState.threadId);
    expect(session).not.toBeNull();
    expect(session!.status).toBe('in_progress');
    expect(session!.userId).toBe(sharedState.userId);

    const snapshot = session!.screeningSnapshot as Record<string, number>;
    expect(snapshot.depression).toBe(3);
    expect(snapshot.psychosis).toBe(2.5);

    const flagged = session!.flaggedDomains as string[];
    expect(flagged).toContain('psychosis');
    expect(flagged).toContain('depression');
  });

  it('[Supabase check] domain_assessments created for flagged domains', async () => {
    const assessments = await getSessionDomainAssessments(sharedState.sessionId);
    expect(assessments.length).toBeGreaterThan(0);

    // First domain should be in_progress, rest pending
    const inProgress = assessments.filter((a) => a.status === 'in_progress');
    const pending = assessments.filter((a) => a.status === 'pending');
    expect(inProgress.length).toBe(1);
    expect(pending.length).toBe(assessments.length - 1);
  });

  it('sends follow-up messages and gets AI responses', async () => {
    // Send 2 follow-up messages
    const messages = [
      'I have been feeling very anxious recently, especially in social situations.',
      'It happens almost every day, and I find it hard to concentrate at work.',
    ];

    for (const msg of messages) {
      const result = await runAssessmentTurn(sharedState.threadId, msg);

      // Should get an AI response back
      expect(result.messages.length).toBeGreaterThan(0);
      const lastMsg = result.messages[result.messages.length - 1];
      expect(typeof lastMsg.content).toBe('string');
      expect((lastMsg.content as string).length).toBeGreaterThan(0);

      // Question count should increment
      expect(result.questionCount).toBeGreaterThan(0);
    }
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/pipeline/02-assessment.test.ts --timeout 180000
```

Expected: All PASS (requires OPENAI_API_KEY + Supabase env vars).

**Step 3: Commit**

```bash
git add tests/pipeline/02-assessment.test.ts
git commit -m "test: add pipeline phase 2 — assessment chat with real LLM + Supabase check"
```

---

## Task 11: Write `tests/pipeline/03-report.test.ts`

**Files:**
- Create: `tests/pipeline/03-report.test.ts`
- Uses: `tests/pipeline/helpers.ts`
- Source: `src/lib/ai/assessmentGraph.ts`, `src/lib/db/assessmentService.ts`, `src/lib/ai/reportSchema.ts`

**Step 1: Write the test**

```typescript
// tests/pipeline/03-report.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  sharedState,
  signInTestUser,
  cleanup,
  prisma,
} from './helpers';
import {
  forceGenerateReport,
  resetAssessmentGraph,
} from '@/lib/ai/assessmentGraph';
import {
  saveAssessmentReport,
  updateDomainAssessments,
  completeSession,
  getSessionReport,
  getSessionByThreadId,
  getFullSession,
  getUserScreening,
} from '@/lib/db/assessmentService';
import { validateAIReport } from '@/lib/ai/reportSchema';
import type { SymptomDomain } from '@/lib/ai/assessmentTypes';

describe('Phase 3: Report Generation', { timeout: 180_000 }, () => {
  beforeAll(async () => {
    // If running standalone, recover state from DB
    if (!sharedState.userId) {
      sharedState.userId = await signInTestUser();
    }
    if (!sharedState.threadId || !sharedState.sessionId) {
      // Find the most recent in-progress session for this user
      const session = await prisma.assessmentSession.findFirst({
        where: { userId: sharedState.userId, status: 'in_progress' },
        orderBy: { startedAt: 'desc' },
      });
      if (!session) throw new Error('No in-progress session — run phases 1+2 first');
      sharedState.threadId = session.threadId;
      sharedState.sessionId = session.id;
    }
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('force-generates a report from current assessment state', async () => {
    const result = await forceGenerateReport(sharedState.threadId);

    // Should have a report
    expect(result.report).not.toBeNull();
    expect(result.report).toBeDefined();

    // Report should have required fields
    expect(result.report!.chiefComplaint).toBeTruthy();
    expect(result.report!.mainGoal).toBeTruthy();
    expect(result.report!.analysis).toBeTruthy();
    expect(result.report!.domains).toBeDefined();
    expect(Array.isArray(result.report!.domains)).toBe(true);
    expect(result.report!.findings).toBeDefined();
    expect(result.report!.recommendations).toBeDefined();
  });

  it('report passes schema validation', async () => {
    const result = await forceGenerateReport(sharedState.threadId);
    const validation = validateAIReport(result.report);
    expect(validation.valid).toBe(true);
  });

  it('persists report to Supabase', async () => {
    const result = await forceGenerateReport(sharedState.threadId);

    if (result.report) {
      await saveAssessmentReport({
        sessionId: sharedState.sessionId,
        report: result.report,
      });
    }

    // Update domain assessments
    await updateDomainAssessments(
      sharedState.sessionId,
      result.domainAssessments as Parameters<typeof updateDomainAssessments>[1],
    );

    // Complete the session
    await completeSession({
      sessionId: sharedState.sessionId,
      chiefComplaint: result.chiefComplaint,
      totalQuestions: result.questionCount,
      isEarlyTermination: true,
    });
  });

  it('[Supabase check] assessment_reports has the report', async () => {
    const report = await getSessionReport(sharedState.sessionId);
    expect(report).not.toBeNull();
    expect(report!.chiefComplaint).toBeTruthy();
    expect(report!.mainGoal).toBeTruthy();
    expect(report!.analysis).toBeTruthy();

    // domains should be a non-empty array
    const domains = report!.domains as unknown[];
    expect(Array.isArray(domains)).toBe(true);
    expect(domains.length).toBeGreaterThan(0);

    // findings should be a non-empty array
    const findings = report!.findings as unknown[];
    expect(Array.isArray(findings)).toBe(true);

    // recommendations should be an array
    expect(Array.isArray(report!.recommendations)).toBe(true);
  });

  it('[Supabase check] session is marked completed', async () => {
    const session = await getSessionByThreadId(sharedState.threadId);
    expect(session).not.toBeNull();
    expect(session!.status).toBe('completed');
    expect(session!.endedAt).not.toBeNull();
    expect(session!.totalQuestions).toBeGreaterThanOrEqual(0);
  });

  it('[Supabase check] full session has all related data', async () => {
    const full = await getFullSession(sharedState.sessionId);
    expect(full).not.toBeNull();

    // Should have domain assessments
    expect(full!.domainAssessments.length).toBeGreaterThan(0);

    // Should have a report
    expect(full!.report).not.toBeNull();

    // Session should reference correct user
    expect(full!.userId).toBe(sharedState.userId);
  });

  it('cleanup removes all test data', async () => {
    await cleanup();

    // Verify cleanup
    const screening = await getUserScreening(sharedState.userId);
    expect(screening).toBeNull();

    const session = await getSessionByThreadId(sharedState.threadId);
    expect(session).toBeNull();
  });
});
```

**Step 2: Run and verify**

```bash
vitest run tests/pipeline/03-report.test.ts --timeout 180000
```

**Step 3: Commit**

```bash
git add tests/pipeline/03-report.test.ts
git commit -m "test: add pipeline phase 3 — report generation with Supabase verification + cleanup"
```

---

## Task 12: Run full test suite and fix any issues

**Step 1: Run all unit tests**

```bash
vitest run tests/ai/ tests/safety/ tests/surveys/
```

Expected: All PASS.

**Step 2: Run full pipeline smoke tests**

```bash
vitest run tests/pipeline/ --timeout 180000
```

Expected: All 3 phases PASS in order.

**Step 3: Run everything together**

```bash
vitest run --timeout 180000
```

**Step 4: Fix any failures** — debug and fix as needed.

**Step 5: Final commit**

```bash
git add -A
git commit -m "test: complete test restructuring — unit tests rewritten, 3-phase pipeline smoke tests"
```
