# Test Restructuring Design

**Date**: 2026-02-28
**Status**: Approved
**Context**: Major code migration from localStorage to Supabase; existing tests reference stale function signatures and mock patterns.

## Goals

1. Delete and rewrite all `tests/ai/` and `tests/assessment/` unit tests to match current source code
2. Replace `tests/pipeline.smoke.test.ts` with a `tests/pipeline/` folder containing 3 sequential phase files
3. Smoke tests hit real Supabase + real OpenAI (full E2E)
4. Each smoke test phase verifies Supabase state after completion

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| DB strategy for smoke tests | Real Supabase | Catches real DB issues; test user with env vars |
| LLM strategy for smoke tests | Real OpenAI | Full E2E; most realistic coverage |
| Unit test approach | Delete all, rewrite | Code migration changed too many signatures to selectively fix |
| Smoke test structure | 3 numbered files in folder | Clean separation; each phase debuggable independently |

## Structure

```
tests/
├── ai/                           (REWRITE)
│   ├── domains.test.ts
│   ├── inputValidation.test.ts
│   ├── reportSchema.test.ts
│   ├── screeningHelpers.test.ts
│   ├── routingLogic.test.ts      (if routing fns still exported)
│   └── reportMapper.test.ts      (if mapper fns still present)
├── assessment/                   (REWRITE)
│   └── chat-route.test.ts        (mocked LLM + Prisma for unit testing)
├── safety/                       (KEEP)
│   └── detectors.test.ts
├── surveys/                      (KEEP)
│   └── scoring.test.ts
├── pipeline/                     (NEW — replaces pipeline.smoke.test.ts)
│   ├── helpers.ts
│   ├── 01-screening.test.ts
│   ├── 02-assessment.test.ts
│   └── 03-report.test.ts
└── pipeline.smoke.test.ts        (DELETE)
```

## Smoke Tests — `tests/pipeline/`

### `helpers.ts` — Shared Infrastructure

- `getTestSupabaseClient()` — authenticated Supabase client (env: `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`)
- `getPrismaClient()` — re-exports from `src/lib/db/prisma.ts`
- `SharedState` module-scoped object — passes `userId`, `threadId`, `sessionId` between phase files
- `cleanup()` — deletes test data (UserScreeningResult, AssessmentSession cascade)
- `SCREENING_ANSWERS` — realistic 17-question answer set

### `01-screening.test.ts`

1. Sign in test user via Supabase auth
2. Call screening logic: `calculateDomainScores()`, `identifyFlaggedDomains()`
3. Persist via `upsertUserScreening()`
4. **Supabase check**: Query `user_screening_results` — verify `answers`, `domainScores`, `flaggedDomains`
5. Store `userId` + screening data in `SharedState`

### `02-assessment.test.ts`

1. Read screening from `SharedState`
2. Call `runAssessmentTurn(threadId, undefined, screeningResults, flaggedDomains, domainScores)` — real LLM init
3. Create session via `createAssessmentSession()`
4. **Supabase check**: Verify session with `screeningSnapshot`, `flaggedDomains`, status `in_progress`
5. Send 2-3 follow-up messages via `runAssessmentTurn(threadId, message)`
6. **Supabase check**: Verify `domain_assessments` records exist
7. Timeout: ~120s per test (real LLM)

### `03-report.test.ts`

1. Continue assessment until `isComplete` or call early end
2. Persist report via `saveAssessmentReport()`, domain assessments, complete session
3. **Supabase check**: Verify `assessment_reports` — `chiefComplaint`, `domains`, `findings`, `recommendations`
4. **Supabase check**: Verify session status `completed`, `endedAt` set
5. Validate report with `validateAIReport()`
6. Run `cleanup()`

## Unit Tests — Rewrite Scope

### `tests/ai/`

| File | Functions Tested |
|------|-----------------|
| `domains.test.ts` | `calculateDomainScores()`, `identifyFlaggedDomains()`, `QUESTION_DOMAIN_MAP`, `DOMAIN_FEATURES` |
| `inputValidation.test.ts` | `validateThreadId()`, `validateScreeningAnswers()`, `validateMessage()` |
| `reportSchema.test.ts` | `validateAIReport()` — valid, invalid, edge cases, NaN/Infinity safety |
| `screeningHelpers.test.ts` | `toScreeningResults()` — conversion, filtering, unknown questions |
| `routingLogic.test.ts` | Routing functions from `assessmentGraph.ts` (if exported) |
| `reportMapper.test.ts` | Report mapping functions (if still present) |

### `tests/assessment/`

| File | Scope |
|------|-------|
| `chat-route.test.ts` | POST handler validation — threadId, message, auth checks. Mocked LLM + Prisma. |

### Unchanged

- `tests/safety/detectors.test.ts`
- `tests/surveys/scoring.test.ts`

## Required Environment Variables (Smoke Tests)

```
TEST_USER_EMAIL=...
TEST_USER_PASSWORD=...
OPENAI_API_KEY=...
DATABASE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Execution

```bash
# Smoke tests (long timeout for real LLM)
# Note: Vitest v4 uses --test-timeout, not --timeout
vitest run tests/pipeline/ --test-timeout 180000

# Unit tests (fast, no external deps)
vitest run tests/ai/ tests/safety/ tests/surveys/

# Requires Node >= 22 (v18 has ESM compat issues with Vitest v4)
```
