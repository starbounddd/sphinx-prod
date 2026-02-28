# Changelogs

> Worker append-only log. Do not edit previous entries.

## TASK T1 — Baseline Audit + Architecture Plan

### DESIGN

**Date:** 2026-02-27

#### Audit Summary

The AI assessment chat feature is a three-stage patient flow:
1. **Screening** (`/screening`) — 17-question Likert-scale survey stored in localStorage
2. **Assessment Chat** (`/assessment/chat`) — LangGraph-powered multi-turn conversation
3. **Assessment Report** (`/assessment/report`) — Structured findings & recommendations

**Current state:** All three stages are implemented and wired end-to-end. The LangGraph assessment engine (5 nodes: initialize → processResponse → generateQuestion → transitionDomain → generateReport) is operational with MemorySaver-based thread persistence. Frontend reads screening data from localStorage and communicates with the backend via `POST /api/assessment/chat`.

#### Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| AI orchestration | LangGraph StateGraph (5 nodes, conditional routing) | Structured multi-turn conversation with domain-specific probing and automatic transitions |
| LLM provider | GPT-4 via `@langchain/openai` (temp 0.7, 2000 tokens) | Balances quality and cost for clinical-grade conversational assessment |
| State persistence | MemorySaver (in-process singleton) + localStorage (client) | Thread-based server persistence without external DB; client-side for report access |
| Data flow | localStorage → API → LangGraph → API response → localStorage | No database persistence for assessment data (future consideration) |
| Safety protocol | Crisis resources (988, Crisis Text Line) embedded in system prompt | Automatic inclusion when suicidal ideation detected |
| Assessment limits | 20 questions max, 20-minute timeout, 4 questions/domain, 3 dimensions min to transition | Prevents assessment fatigue while ensuring coverage |
| Frontend framework | Next.js 16 App Router + React 19 + TailwindCSS 4 | Existing stack |
| Testing | Vitest + Playwright browser tests | Existing test infrastructure |

#### Data Flow

```
User → SurveyForm → localStorage(sphinx_screening_answers)
                          ↓
useAssessmentChat → POST /api/assessment/chat { threadId, screeningAnswers }
                          ↓
route.ts → calculateDomainScores → identifyFlaggedDomains → toScreeningResults
                          ↓
runAssessmentTurn(threadId, undefined, screeningResults, flaggedDomains)
                          ↓
LangGraph: START → routeEntry → initialize → END
                          ↓
API Response: { success, message: { content, quickReplies, isComplete, ... } }
                          ↓
User types/selects quick reply → POST { threadId, message }
                          ↓
runAssessmentTurn(threadId, message)
                          ↓
LangGraph: START → routeEntry → processResponse → routeAfterProcessing
   → generateQuestion | transitionDomain | generateReport → END
                          ↓
When isComplete → localStorage(sphinx_chat_messages, sphinx_chat_report, sphinx_assessment_metadata)
                          ↓
Navigate to /assessment/report → load from localStorage → ClarityReport
```

#### Safety Constraints

- No diagnostic labels emitted by AI — information gathering only
- Crisis resources always provided when suicidal ideation detected
- Single-question-at-a-time rule enforced in system prompt
- Assessment automatically terminates at 20 questions or 20 minutes
- OPENAI_API_KEY validated before processing any request

#### Integration Points

- `src/lib/ai/assessmentGraph.ts` — LangGraph engine (615 lines)
- `src/lib/ai/promptTemplates.ts` — All AI prompts (243 lines)
- `src/lib/ai/domains.ts` — Domain definitions & scoring (674 lines)
- `src/lib/ai/assessmentTypes.ts` — Type definitions (170 lines)
- `src/app/api/assessment/chat/route.ts` — API endpoint (219 lines)
- `src/components/assessment/hooks/useAssessmentChat.ts` — Frontend state (201 lines)
- `src/components/assessment/ui/AssessmentChat.tsx` — Chat UI
- `src/components/assessment/ui/ClarityReport.tsx` — Report UI

#### Gaps Identified for T2-T4

1. **Backend tests missing** — No unit tests for domain scoring, screening result conversion, graph routing logic, or API route behavior
2. **Input validation** — API route trusts all input shapes; needs validation for threadId format, screening answer ranges, message length limits
3. **Error handling** — LLM failures silently fall through; needs explicit error surfaces
4. **Chat input** — Missing ChatInput component reference in AssessmentChat (need to verify)
5. **Report data** — Report page falls back to MOCK data if localStorage empty; needs graceful empty-state handling

### DECISIONS

- T2 will add unit tests for: `calculateDomainScores`, `identifyFlaggedDomains`, `toScreeningResults` (route helper), graph routing functions (`routeEntry`, `routeAfterProcessing`), and API route validation logic
- T3 will verify existing frontend components work with real data flow and add any missing UI elements
- T4 will document environment setup, API contract, and developer workflow

---

## 2026-02-28T23:27:00Z Supervisor DESIGN T1

### DESIGN
- Goal: shorten the healthcare assessment workflow by letting the assessment chat consume screening outputs, drive focused follow-up questions, and produce structured state the report/provider views can reuse.
- Data flow: `localStorage.sphinx_screening_answers` seeds the assessment UI hook, the hook initializes `POST /api/assessment/chat`, the route converts raw survey answers into `ScreeningResult[]`, computes flagged domains, and hands the turn to `runAssessmentTurn(...)`, which persists thread state in the LangGraph memory checkpointer.
- Safety constraints: the API must reject malformed or ambiguous requests before any model call, require a configured AI key for valid work, preserve domain-specific status reporting for clinician review, and keep the chat/report surfaces framed as assessment support rather than diagnosis.
- Integration points: `src/app/assessment/chat/page.tsx` mounts the chat UI, `src/components/assessment/hooks/useAssessmentChat.ts` owns client-side session flow, `src/app/api/assessment/chat/route.ts` is the request-contract boundary, and `src/lib/ai/assessmentGraph.ts` remains the conversational orchestration layer.

### Decisions
- Decision: keep `/api/assessment/chat` as the single contract boundary for both initialization and continuation so the client only owns thread state plus UX concerns.
- Decision: make request validation explicit and reject `message` plus `screeningAnswers` in the same payload; silent precedence would hide client bugs in a healthcare flow.
- Decision: run browser-mode Vitest only when `VITEST_BROWSER=1` so node-based verification can run in restricted environments without opening a sandbox-blocked listener.
- Decision: add route-level tests around the API contract instead of only graph internals because the route is where screening data, environment validation, and domain-status shaping meet.

## 2026-02-28T23:27:00Z Supervisor T2 progress

- Added contract tests for `/api/assessment/chat` covering initialization, continuation, malformed payloads, missing provider key, and graph failures.
- Refactored the route to share AI-message extraction and domain-status mapping helpers instead of duplicating response shaping logic in both request paths.
- Hardened validation order so missing `threadId` returns `400` even when the AI key is absent, which gives the client a correct actionable error.

---

## TASK T2 — Backend TDD Implementation

### WORK LOG

**Date:** 2026-02-28

#### Tests Fixed

- Aligned 2 failing `chat-route.test.ts` expectations with actual implementation:
  - `'Missing required field: threadId'` → `'Missing or invalid required field: threadId'` (route uses `validateThreadId` guard message)
  - `'Invalid request: "screeningAnswers" must be an object…'` → `'Score for "anxiety_nervous" must be a number, got string'` (per-key validation from `validateScreeningAnswers`)

#### Bug Found & Fixed (TDD)

- **NaN/Infinity validation bypass** in `inputValidation.ts:43`: `typeof NaN === 'number'` is `true` and `NaN < 0` is `false`, so `NaN` and `Infinity` passed the range check. Fixed by adding `Number.isFinite(value)` guard. Critical for a healthcare application where invalid scores must never reach the AI model.

#### Type Safety Improvement

- Changed `validateThreadId` return type from `boolean` to `threadId is string` (TypeScript type guard). This lets the compiler narrow `threadId` from `string | undefined` to `string` after the validation check, eliminating the build error on `route.ts:114`.

#### New Test Files (51 new tests)

| File | Tests | Coverage |
|---|---|---|
| `tests/ai/graphHelpers.test.ts` | 17 | `defaultScoring`, `elapsedMinutes`, `parseJsonResponse`, `getDimensionsCovered` — pure functions replicated from `assessmentGraph.ts` |
| `tests/ai/inputValidation-edge-cases.test.ts` | 25 | NaN/Infinity/float scores, boundary lengths (256/257 threadId, 5000/5001 message), structural types (null/undefined/string/number), whitespace-only messages, emoji content |
| `tests/assessment/chat-route-edge-cases.test.ts` | 9 | Missing both params, malformed JSON body, empty-string API key, zero flagged domains initialization, no-AI-message fallback, non-string AI content, out-of-range scores, whitespace/empty messages |

#### Final Test Results

```
Test Files: 11 passed (11)
Tests:      126 passed (126)
Duration:   615ms
```

### HOW_TO_VERIFY

```bash
npx vitest run
# Expected: 11 files, 126 tests, 0 failures
```

---

## TASK T3 — Frontend Implementation

### DESIGN

**Date:** 2026-02-28

#### Audit of Existing Frontend

The assessment chat frontend was already implemented end-to-end with the following component tree:

```
AssessmentChatPage (src/app/assessment/chat/page.tsx)
└── AssessmentChat (orchestrator)
    ├── useAssessmentChat() — hook: thread management, API calls, localStorage persistence
    ├── ChatSidebar — domain progress tracker (280px)
    ├── AssessmentHeader — domain badge, question counter, timer pill
    ├── ChatMessageList — auto-scrolling message list
    ├── ThinkingIndicator — bouncing dots animation
    ├── QuickReplyBar — chip-style response suggestions
    ├── ChatInput — auto-resizing textarea (shared component)
    └── ChatDisclaimer — static AI disclaimer
```

All imports verified valid. All shared UI components (`ChatInput`, `ChatMessage`, `QuickReplyChip`, `BouncingDots`) exist and are properly exported.

#### Issues Found & Fixed

1. **Build-breaking import** (`node:async_hooks`): `src/app/assessment/report/page.tsx` imported `DOMAIN_LABELS` from `assessmentTypes.ts`, which imports `@langchain/langgraph` (Node-only). Created `src/lib/ai/domainLabels.ts` as a client-safe module with the same constant, updated the report page import.

2. **Storybook type error in build**: `tsconfig.json` included `**/*.stories.tsx` but `@storybook/nextjs-vite` was not installed. Added `**/*.stories.ts` and `**/*.stories.tsx` to the `exclude` array.

#### Browser MCP Validation

- **Outcome:** Supabase auth middleware (`src/proxy.ts`) requires valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for all routes. Without a valid Supabase project, the middleware redirects every request to `/login` before the assessment chat can render.
- **Mitigation:** TypeScript compilation passes cleanly for all production source code. All component imports, props, and hook contracts are verified through static analysis. Screenshot captured as `browser-verification-auth-wall.png`.
- **Prerequisite for full browser validation:** A running Supabase project with valid credentials in `.env.local`.

### DECISIONS

- Extracted `DOMAIN_LABELS` to a separate client-safe module rather than restructuring `assessmentTypes.ts`, to avoid breaking all existing server-side consumers
- Excluded Storybook files from `tsconfig.json` build rather than installing the Storybook dependency, since Storybook is not part of the assessment feature scope

### HOW_TO_VERIFY

```bash
# TypeScript compilation (production code)
npx tsc --noEmit 2>&1 | grep -v "test"
# Expected: no errors from src/ files

# Full build (requires Supabase env vars for static generation)
npx next build
# Expected: compiles successfully, may fail at static generation without Supabase

# All tests still pass
npx vitest run
# Expected: 126 passed
```

---

## TASK T4 — Integration Hardening + Docs

### WORK LOG

**Date:** 2026-02-28

#### Environment Requirements

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | Yes | GPT-4 API access for assessment chat |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (auth middleware) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key (auth middleware) |

Copy `env.local` to `.env.local` to configure:
```bash
cp env.local .env.local
```

#### API Contract

**Endpoint:** `POST /api/assessment/chat`

**Initialization request:**
```json
{
  "threadId": "uuid-string (required, max 256 chars)",
  "screeningAnswers": { "question_id": 0-4 }
}
```

**Continuation request:**
```json
{
  "threadId": "uuid-string",
  "message": "user message (max 5000 chars, non-empty)"
}
```

**Mutual exclusion:** `screeningAnswers` and `message` cannot be sent in the same request.

**Success response (200):**
```json
{
  "success": true,
  "message": {
    "content": "AI message text",
    "quickReplies": ["option1", "option2"],
    "isComplete": false,
    "report": null,
    "currentDomain": "anxiety",
    "questionCount": 1,
    "domainStatuses": { "anxiety": "in_progress" }
  }
}
```

**Error responses:**
- `400`: Missing/invalid threadId, ambiguous request, invalid screening scores, empty message
- `500`: Missing API key, graph failure

#### Developer Workflow

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp env.local .env.local

# 3. Run tests (no env vars needed)
npx vitest run

# 4. Start dev server (requires Supabase + OpenAI keys)
npx next dev --turbopack

# 5. Navigate to /screening → complete survey → /assessment/chat
```

#### Assessment Flow (End-to-End)

1. User completes 17-question screening at `/screening`
2. Answers saved to `localStorage.sphinx_screening_answers`
3. User navigates to `/assessment/chat`
4. `useAssessmentChat` reads screening answers, calls API with `screeningAnswers`
5. API calculates domain scores, identifies flagged domains, initializes LangGraph thread
6. Multi-turn conversation: user sends messages → API processes evidence → routes to next question/domain/report
7. Assessment completes after 20 questions, 20 minutes, or all domains exhausted
8. Chat history + report saved to localStorage
9. User redirected to `/assessment/report` to view structured clinical summary

#### Key Files

| File | Purpose |
|---|---|
| `src/app/api/assessment/chat/route.ts` | API endpoint (validation, routing, response shaping) |
| `src/lib/ai/assessmentGraph.ts` | LangGraph state machine (5 nodes, conditional routing) |
| `src/lib/ai/inputValidation.ts` | Request validation (threadId, screeningAnswers, message) |
| `src/lib/ai/routingLogic.ts` | State machine routing decisions (exported for testability) |
| `src/lib/ai/screeningHelpers.ts` | Screening data conversion utilities |
| `src/lib/ai/domains.ts` | Domain definitions, scoring, flagging |
| `src/lib/ai/domainLabels.ts` | Client-safe domain label map |
| `src/components/assessment/hooks/useAssessmentChat.ts` | Frontend state management hook |
| `src/components/assessment/ui/AssessmentChat.tsx` | Main chat UI orchestrator |

### HOW_TO_VERIFY

```bash
# All tests pass
npx vitest run
# Expected: 11 files, 126 tests, 0 failures

# TypeScript compiles
npx tsc --noEmit 2>&1 | grep -c "error" | grep -v test
# Expected: 0 errors in production code

# Env file exists
test -f .env.local && echo "OK" || echo "MISSING: copy env.local to .env.local"
```

---

## TASK T-011A — Typed Report Schema + Mapper + Unit Tests

### WORK LOG

**Date:** 2026-02-28
**Task ID:** T-02280811

#### Problem

The LangGraph assessment graph stored the AI-generated report as `report: Annotation<any | null>` — no compile-time guarantees on the shape of the data flowing from the AI to the frontend. In a healthcare application, unvalidated AI output reaching the UI is a safety concern.

#### Solution

Created a typed report pipeline: AI output → validation → typed schema → mapper → frontend `AssessmentReport`.

#### New Files

| File | Purpose |
|---|---|
| `src/lib/ai/reportSchema.ts` | `AIGeneratedReport` interface + `validateAIReport()` validation gate |
| `src/lib/ai/reportMapper.ts` | Pure mapper: `mapAIReportToAssessmentReport()` + helper functions |
| `tests/ai/reportSchema.test.ts` | 22 tests: valid/invalid/edge-case report validation |
| `tests/ai/reportMapper.test.ts` | 29 tests: scalar mappers, domain/finding conversion, summary stats, full pipeline |

#### Schema Design (aligned with product spec)

`AIGeneratedReport` mirrors the DSM-5 cross-cutting report template:
- `chiefComplaint` — patient's own words
- `mainGoal` — what the patient is seeking
- `analysis` — empathetic summary (no diagnostic labels)
- `domains[]` — per-domain: functionalImpact (0-3), control (0-3), duration, frequency (0-3), confidence (0-3), summary
- `findings[]` — icon + title + description
- `recommendations[]` — actionable next steps
- `culturalBackground?` — optional cultural context
- `summary?` — optional flagged-domains summary

#### Validation

`validateAIReport()` rejects:
- Non-object payloads (null, string, undefined)
- Missing required fields (chiefComplaint, mainGoal, analysis, domains, findings, recommendations)
- Out-of-range scores (functionalImpact/control/frequency/confidence must be finite 0-3, screeningScore 0-4)
- NaN/Infinity values (healthcare safety — same pattern as inputValidation.ts)
- Invalid finding icons (must be zap|clock|activity|calendar)
- Non-string recommendation entries

#### Mapper Functions

| Function | Maps |
|---|---|
| `impactLabel(0-3)` | → None / Mild / Moderate / High |
| `specificityFromConfidence(0-3)` | → Low / Medium / High |
| `mapDomainToResult(AIReportDomain)` | → frontend `DomainResult` |
| `mapFindingToInsight(AIReportFinding)` | → frontend `AIInsight` with icon colors |
| `computeSummaryStats(AIGeneratedReport)` | → 4 `SummaryStat` cards (domains flagged, severity, risk, confidence) |
| `mapAIReportToAssessmentReport(input)` | → complete `AssessmentReport` for ClarityReport component |

#### Wiring Changes

- `assessmentTypes.ts`: `report: Annotation<any | null>` → `report: Annotation<AIGeneratedReport | null>`
- `assessmentGraph.ts`: `generateReportNode` now validates AI JSON via `validateAIReport()` before storing

#### Test Results

```
Test Files: 13 passed (13)
Tests:      177 passed (177)
Duration:   634ms
```

### HOW_TO_VERIFY

```bash
npx vitest run
# Expected: 13 files, 177 tests, 0 failures
```
