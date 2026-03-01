# Assessment Code Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move assessment-specific code from `lib/ai/` and `lib/db/` into `features/assessment/` with clear layering, split the 522-line `assessmentService.ts`, and extract API route handlers into the feature module.

**Architecture:** Feature-based vertical slice. `features/assessment/` owns all assessment logic (AI graph, prompts, DB services, handlers, validation). `lib/` retains only shared infrastructure (Prisma client, Supabase client, auth, `cn` utility). API routes become thin HTTP adapters delegating to handlers.

**Tech Stack:** Next.js App Router, LangGraph, Prisma, Supabase Auth, TypeScript

---

## Import Path Mapping (reference for all tasks)

| Old Path | New Path |
|----------|----------|
| `@/lib/ai/assessmentGraph` | `@/features/assessment/ai/graph` |
| `@/lib/ai/assessmentTypes` | `@/features/assessment/schema/types` |
| `@/lib/ai/domains` | `@/features/assessment/schema/domains` |
| `@/lib/ai/promptTemplates` | `@/features/assessment/ai/prompts` |
| `@/lib/ai/routingLogic` | `@/features/assessment/ai/routing` |
| `@/lib/ai/reportSchema` | `@/features/assessment/schema/report-schema` |
| `@/lib/ai/reportMapper` | `@/features/assessment/utils/report-mapper` |
| `@/lib/ai/inputValidation` | `@/features/assessment/validation/input` |
| `@/lib/ai/screeningHelpers` | `@/features/assessment/utils/screening-helpers` |
| `@/lib/db/assessmentService` | `@/features/assessment/services/*` (split into multiple files) |

## Files that need import updates (reference for Task 8)

**Source files:**
- `src/app/assessment/report/page.tsx` — imports from `@/lib/ai/reportSchema`, `@/lib/ai/reportMapper`
- `src/app/api/assessment/screening/route.ts` — imports from `@/lib/ai/domains`, `@/lib/ai/inputValidation`, `@/lib/db/assessmentService`
- `src/app/api/assessment/chat/route.ts` — imports from `@/lib/ai/assessmentGraph`, `@/lib/ai/assessmentTypes`, `@/lib/ai/screeningHelpers`, `@/lib/ai/inputValidation`, `@/lib/db/assessmentService`, `@/lib/supabase/server`
- `src/app/api/assessment/chat/end/route.ts` — imports from `@/lib/ai/assessmentGraph`, `@/lib/ai/inputValidation`, `@/lib/db/assessmentService`
- `src/app/api/assessment/report/route.ts` — imports from `@/lib/db/assessmentService`, `@/lib/supabase/server`

**Test files:**
- `tests/ai/inputValidation.test.ts` — imports from `@/lib/ai/inputValidation`
- `tests/ai/routingLogic.test.ts` — imports from `@/lib/ai/routingLogic`, `@/lib/ai/assessmentTypes`
- `tests/ai/screeningHelpers.test.ts` — imports from `@/lib/ai/screeningHelpers`
- `tests/ai/reportSchema.test.ts` — imports from `@/lib/ai/reportSchema`
- `tests/ai/reportMapper.test.ts` — imports from `@/lib/ai/reportMapper`, `@/lib/ai/reportSchema`
- `tests/ai/domains.test.ts` — imports from `@/lib/ai/domains`
- `tests/pipeline/01-screening.ts` — imports from `@/lib/ai/domains`, `@/lib/ai/screeningHelpers`, `@/lib/db/assessmentService`
- `tests/pipeline/02-assessment.ts` — imports from `@/lib/ai/assessmentGraph`, `@/lib/ai/screeningHelpers`, `@/lib/ai/assessmentTypes`, `@/lib/db/assessmentService`
- `tests/pipeline/03-report.ts` — imports from `@/lib/ai/assessmentGraph`, `@/lib/ai/reportSchema`, `@/lib/ai/assessmentTypes`, `@/lib/db/assessmentService`

---

### Task 1: Create directory structure

**Files:**
- Create directories under `src/features/assessment/`

**Step 1: Create all directories**

```bash
mkdir -p src/features/assessment/{schema,ai,services,handlers,validation,utils}
```

**Step 2: Verify structure exists**

```bash
ls -R src/features/assessment/
```

Expected: 6 empty subdirectories.

**Step 3: Commit**

```bash
git add src/features/
git commit -m "chore: scaffold features/assessment directory structure"
```

---

### Task 2: Move schema files (types, report-schema, domains)

These are the type foundations everything else depends on. assessmentTypes ↔ reportSchema have a circular import — move them together.

**Files:**
- Create: `src/features/assessment/schema/types.ts` (from `src/lib/ai/assessmentTypes.ts`)
- Create: `src/features/assessment/schema/report-schema.ts` (from `src/lib/ai/reportSchema.ts`)
- Create: `src/features/assessment/schema/domains.ts` (from `src/lib/ai/domains.ts`)

**Step 1: Copy `assessmentTypes.ts` → `schema/types.ts`**

Copy the file. Update its one internal import:

```
// OLD: import type { AIGeneratedReport } from './reportSchema';
// NEW: import type { AIGeneratedReport } from './report-schema';
```

The `@langchain/langgraph` import stays as-is (external dep).

**Step 2: Copy `reportSchema.ts` → `schema/report-schema.ts`**

Copy the file. Update its one internal import:

```
// OLD: import type { SymptomDomain } from './assessmentTypes';
// NEW: import type { SymptomDomain } from './types';
```

**Step 3: Copy `domains.ts` → `schema/domains.ts`**

Copy the file. Update its one import:

```
// OLD: import type { SymptomDomain, AssessmentDimension } from './assessmentTypes';
// NEW: import type { SymptomDomain, AssessmentDimension } from './types';
```

**Step 4: Verify build**

```bash
npx tsc --noEmit
```

Expected: success (old files still exist, new files compile alongside them).

**Step 5: Commit**

```bash
git add src/features/assessment/schema/
git commit -m "refactor: copy assessment schema files to features/assessment/schema"
```

---

### Task 3: Move AI core files (graph, routing, prompts)

**Files:**
- Create: `src/features/assessment/ai/graph.ts` (from `src/lib/ai/assessmentGraph.ts`)
- Create: `src/features/assessment/ai/routing.ts` (from `src/lib/ai/routingLogic.ts`)
- Create: `src/features/assessment/ai/prompts.ts` (from `src/lib/ai/promptTemplates.ts`)

**Step 1: Copy `assessmentGraph.ts` → `ai/graph.ts`**

Update ALL internal imports (6 changes):

```
// OLD → NEW
'./assessmentTypes'  → '../schema/types'
'./reportSchema'     → '../schema/report-schema'
'./promptTemplates'  → './prompts'
'./domains'          → '../schema/domains'
'./routingLogic'     → './routing'
```

External imports (`@langchain/*`) stay unchanged.

**Step 2: Copy `routingLogic.ts` → `ai/routing.ts`**

Update import:

```
// OLD: import type { AssessmentGraphStateType, SymptomDomain, AssessmentDimension } from './assessmentTypes';
// NEW: import type { AssessmentGraphStateType, SymptomDomain, AssessmentDimension } from '../schema/types';
```

**Step 3: Copy `promptTemplates.ts` → `ai/prompts.ts`**

Update imports:

```
// OLD: import type { SymptomDomain, DomainAssessment, AssessmentDimension } from './assessmentTypes';
// NEW: import type { SymptomDomain, DomainAssessment, AssessmentDimension } from '../schema/types';

// OLD: import { DOMAIN_LABELS } from './assessmentTypes';
// NEW: import { DOMAIN_LABELS } from '../schema/types';

// OLD: import { DOMAIN_FEATURES } from './domains';
// NEW: import { DOMAIN_FEATURES } from '../schema/domains';
```

**Step 4: Verify build**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/features/assessment/ai/
git commit -m "refactor: copy AI graph, routing, prompts to features/assessment/ai"
```

---

### Task 4: Move validation and utility files

**Files:**
- Create: `src/features/assessment/validation/input.ts` (from `src/lib/ai/inputValidation.ts`)
- Create: `src/features/assessment/utils/screening-helpers.ts` (from `src/lib/ai/screeningHelpers.ts`)
- Create: `src/features/assessment/utils/report-mapper.ts` (from `src/lib/ai/reportMapper.ts`)

**Step 1: Copy `inputValidation.ts` → `validation/input.ts`**

No import changes — this file has zero imports.

**Step 2: Copy `screeningHelpers.ts` → `utils/screening-helpers.ts`**

Update imports:

```
// OLD: import type { ScreeningResult } from './assessmentTypes';
// NEW: import type { ScreeningResult } from '../schema/types';

// OLD: import { QUESTION_DOMAIN_MAP } from './domains';
// NEW: import { QUESTION_DOMAIN_MAP } from '../schema/domains';
```

**Step 3: Copy `reportMapper.ts` → `utils/report-mapper.ts`**

Update imports:

```
// OLD: import type { ... } from './reportSchema';
// NEW: import type { ... } from '../schema/report-schema';

// OLD: import type { DomainAssessment } from './assessmentTypes';
// NEW: import type { DomainAssessment } from '../schema/types';
```

The `@/components/assessment/types` import stays unchanged — it's an external dependency.

**Step 4: Verify build**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/features/assessment/validation/ src/features/assessment/utils/
git commit -m "refactor: copy validation and utils to features/assessment"
```

---

### Task 5: Split assessmentService.ts into services/*

The original file at `src/lib/db/assessmentService.ts` (522 lines) has clear section comments. Split along those boundaries.

**Files:**
- Create: `src/features/assessment/services/types.ts`
- Create: `src/features/assessment/services/sessions.ts`
- Create: `src/features/assessment/services/messages.ts`
- Create: `src/features/assessment/services/domains.ts`
- Create: `src/features/assessment/services/reports.ts`
- Create: `src/features/assessment/services/safety.ts`
- Create: `src/features/assessment/services/screening.ts`
- Create: `src/features/assessment/services/persistence.ts`

**Step 1: Create `services/types.ts`**

Extract the 7 input interfaces (lines 31-86 of original). Update imports:

```typescript
import type { AIGeneratedReport } from '../schema/report-schema';
import type {
  DomainAssessment,
  SymptomDomain as AppSymptomDomain,
} from '../schema/types';

export interface CreateSessionInput { ... }   // lines 31-36
export interface SaveMessageInput { ... }     // lines 38-44
export interface UpdateDomainAssessmentInput { ... }  // lines 46-59
export interface SaveReportInput { ... }      // lines 61-64
export interface SaveSafetyEventInput { ... } // lines 66-72
export interface CompleteSessionInput { ... } // lines 74-79
export interface UpsertScreeningInput { ... } // lines 81-86
```

Copy interfaces exactly from the original file.

**Step 2: Create `services/sessions.ts`**

Functions: `createAssessmentSession`, `getSessionByThreadId`, `getFullSession`, `completeSession`, `abandonSession`, `getUserSessions`, `getUserLatestSession` (original lines 95-440).

```typescript
import { prisma } from '@/lib/db/prisma';
import type { AssessmentSession, SymptomDomain, AssessmentStatus, DomainStatus } from '@prisma/client';
import type { CreateSessionInput, CompleteSessionInput } from './types';

// Copy 7 functions exactly from original lines 95-178, 416-440
```

**Step 3: Create `services/messages.ts`**

Functions: `saveMessage`, `saveMessages`, `getSessionMessages`, `getLatestMessageSequence` (original lines 187-240).

```typescript
import { prisma } from '@/lib/db/prisma';
import type { ChatMessage, MessageRole } from '@prisma/client';
import type { SaveMessageInput } from './types';

// Copy 4 functions exactly from original lines 187-240
```

**Step 4: Create `services/domains.ts`**

Functions: `upsertDomainAssessment`, `updateDomainAssessments`, `getSessionDomainAssessments` (original lines 249-322).

```typescript
import { prisma } from '@/lib/db/prisma';
import type { DomainAssessment as PrismaDomainAssessment, SymptomDomain, DomainStatus } from '@prisma/client';
import type { UpdateDomainAssessmentInput } from './types';
import type { DomainAssessment, SymptomDomain as AppSymptomDomain } from '../schema/types';

// Copy 3 functions exactly from original lines 249-322
```

**Step 5: Create `services/reports.ts`**

Functions: `saveAssessmentReport`, `getSessionReport` (original lines 331-360).

```typescript
import { prisma } from '@/lib/db/prisma';
import type { AssessmentReport } from '@prisma/client';
import type { SaveReportInput } from './types';

// Copy 2 functions exactly from original lines 331-360
```

**Step 6: Create `services/safety.ts`**

Functions: `saveSafetyEvent`, `getSessionSafetyEvents`, `markSafetyEventNotified` (original lines 369-407).

```typescript
import { prisma } from '@/lib/db/prisma';
import type { SafetyEvent, SafetyEventType } from '@prisma/client';
import type { SaveSafetyEventInput } from './types';

// Copy 3 functions exactly from original lines 369-407
```

**Step 7: Create `services/screening.ts`**

Functions: `upsertUserScreening`, `getUserScreening` (original lines 449-521).

```typescript
import { prisma } from '@/lib/db/prisma';
import type { SymptomDomain } from '@prisma/client';
import type { UpsertScreeningInput } from './types';
import type { SymptomDomain as AppSymptomDomain } from '../schema/types';

// Copy 2 functions exactly from original lines 449-521
```

**Step 8: Create `services/persistence.ts`**

Function: `persistSessionResults` (original lines 481-512). This is the orchestrator that calls other service functions.

```typescript
import type { AIGeneratedReport } from '../schema/report-schema';
import type { DomainAssessment } from '../schema/types';
import { getSessionByThreadId, completeSession } from './sessions';
import { saveAssessmentReport } from './reports';
import { updateDomainAssessments } from './domains';

// Copy persistSessionResults exactly from original lines 481-512
// Replace internal function calls with imports from sibling modules
```

**Step 9: Verify build**

```bash
npx tsc --noEmit
```

**Step 10: Commit**

```bash
git add src/features/assessment/services/
git commit -m "refactor: split assessmentService.ts into focused service modules"
```

---

### Task 6: Create barrel export

**Files:**
- Create: `src/features/assessment/index.ts`

**Step 1: Create barrel export**

```typescript
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

export type { DomainFeature } from './schema/domains';
export {
  DOMAIN_FEATURES,
  QUESTION_DOMAIN_MAP,
  calculateDomainScores,
  identifyFlaggedDomains,
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
  specificityFromConfidence,
  mapDomainToResult,
  mapFindingToInsight,
  computeSummaryStats,
  mapAIReportToAssessmentReport,
} from './utils/report-mapper';
```

**Step 2: Verify build**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/features/assessment/index.ts
git commit -m "refactor: add barrel export for features/assessment"
```

---

### Task 7: Update all consumer imports and slim down API routes

Now switch all consumers from old paths to new paths. Use the import path mapping table at the top of this plan.

**Files to modify:**
- `src/app/assessment/report/page.tsx`
- `src/app/api/assessment/screening/route.ts`
- `src/app/api/assessment/chat/route.ts`
- `src/app/api/assessment/chat/end/route.ts`
- `src/app/api/assessment/report/route.ts`

**Step 1: Update `src/app/assessment/report/page.tsx`**

```
// OLD:
import { validateAIReport } from '@/lib/ai/reportSchema';
import { mapAIReportToAssessmentReport } from '@/lib/ai/reportMapper';

// NEW:
import { validateAIReport } from '@/features/assessment/schema/report-schema';
import { mapAIReportToAssessmentReport } from '@/features/assessment/utils/report-mapper';
```

**Step 2: Update `src/app/api/assessment/screening/route.ts`**

```
// OLD:
import { calculateDomainScores, identifyFlaggedDomains } from '@/lib/ai/domains';
import { upsertUserScreening } from '@/lib/db/assessmentService';
import { validateScreeningAnswers } from '@/lib/ai/inputValidation';

// NEW:
import { calculateDomainScores, identifyFlaggedDomains } from '@/features/assessment/schema/domains';
import { upsertUserScreening } from '@/features/assessment/services/screening';
import { validateScreeningAnswers } from '@/features/assessment/validation/input';
```

**Step 3: Update `src/app/api/assessment/chat/route.ts`**

```
// OLD:
import { runAssessmentTurn } from '@/lib/ai/assessmentGraph';
import type { SymptomDomain } from '@/lib/ai/assessmentTypes';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import { validateThreadId, validateMessage } from '@/lib/ai/inputValidation';
import { createAssessmentSession, persistSessionResults, getUserScreening } from '@/lib/db/assessmentService';

// NEW:
import { runAssessmentTurn } from '@/features/assessment/ai/graph';
import type { SymptomDomain } from '@/features/assessment/schema/types';
import { toScreeningResults } from '@/features/assessment/utils/screening-helpers';
import { validateThreadId, validateMessage } from '@/features/assessment/validation/input';
import { createAssessmentSession } from '@/features/assessment/services/sessions';
import { persistSessionResults } from '@/features/assessment/services/persistence';
import { getUserScreening } from '@/features/assessment/services/screening';
```

**Step 4: Update `src/app/api/assessment/chat/end/route.ts`**

```
// OLD:
import { forceGenerateReport } from '@/lib/ai/assessmentGraph';
import { validateThreadId } from '@/lib/ai/inputValidation';
import { persistSessionResults } from '@/lib/db/assessmentService';

// NEW:
import { forceGenerateReport } from '@/features/assessment/ai/graph';
import { validateThreadId } from '@/features/assessment/validation/input';
import { persistSessionResults } from '@/features/assessment/services/persistence';
```

**Step 5: Update `src/app/api/assessment/report/route.ts`**

```
// OLD:
import { getUserLatestSession, getSessionReport } from '@/lib/db/assessmentService';

// NEW:
import { getUserLatestSession } from '@/features/assessment/services/sessions';
import { getSessionReport } from '@/features/assessment/services/reports';
```

**Step 6: Verify build**

```bash
npx tsc --noEmit
```

**Step 7: Commit**

```bash
git add src/app/
git commit -m "refactor: update source file imports to features/assessment paths"
```

---

### Task 8: Update test imports

**Files to modify:**
- `tests/ai/inputValidation.test.ts`
- `tests/ai/routingLogic.test.ts`
- `tests/ai/screeningHelpers.test.ts`
- `tests/ai/reportSchema.test.ts`
- `tests/ai/reportMapper.test.ts`
- `tests/ai/domains.test.ts`
- `tests/pipeline/01-screening.ts`
- `tests/pipeline/02-assessment.ts`
- `tests/pipeline/03-report.ts`

**Step 1: Update unit test imports**

Each test file: replace `@/lib/ai/<name>` with the corresponding new path from the mapping table. Examples:

`tests/ai/inputValidation.test.ts`:
```
// OLD: import { validateThreadId, validateScreeningAnswers, validateMessage } from '@/lib/ai/inputValidation';
// NEW: import { validateThreadId, validateScreeningAnswers, validateMessage } from '@/features/assessment/validation/input';
```

`tests/ai/routingLogic.test.ts`:
```
// OLD: import { routeEntry, routeAfterProcessing, ... } from '@/lib/ai/routingLogic';
// OLD: import type { DomainAssessment, SymptomDomain } from '@/lib/ai/assessmentTypes';
// NEW: import { routeEntry, routeAfterProcessing, ... } from '@/features/assessment/ai/routing';
// NEW: import type { DomainAssessment, SymptomDomain } from '@/features/assessment/schema/types';
```

Apply the same pattern for all 6 unit test files.

**Step 2: Update pipeline test imports**

`tests/pipeline/01-screening.ts`:
```
// OLD:
import { calculateDomainScores, identifyFlaggedDomains } from '@/lib/ai/domains';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import { upsertUserScreening, getUserScreening } from '@/lib/db/assessmentService';

// NEW:
import { calculateDomainScores, identifyFlaggedDomains } from '@/features/assessment/schema/domains';
import { toScreeningResults } from '@/features/assessment/utils/screening-helpers';
import { upsertUserScreening } from '@/features/assessment/services/screening';
import { getUserScreening } from '@/features/assessment/services/screening';
```

`tests/pipeline/02-assessment.ts`:
```
// OLD:
import { runAssessmentTurn, resetAssessmentGraph } from '@/lib/ai/assessmentGraph';
import { toScreeningResults } from '@/lib/ai/screeningHelpers';
import type { SymptomDomain } from '@/lib/ai/assessmentTypes';
import { createAssessmentSession, getSessionByThreadId, getSessionDomainAssessments, getUserScreening } from '@/lib/db/assessmentService';

// NEW:
import { runAssessmentTurn, resetAssessmentGraph } from '@/features/assessment/ai/graph';
import { toScreeningResults } from '@/features/assessment/utils/screening-helpers';
import type { SymptomDomain } from '@/features/assessment/schema/types';
import { createAssessmentSession, getSessionByThreadId } from '@/features/assessment/services/sessions';
import { getSessionDomainAssessments } from '@/features/assessment/services/domains';
import { getUserScreening } from '@/features/assessment/services/screening';
```

`tests/pipeline/03-report.ts`:
```
// OLD:
import { forceGenerateReport } from '@/lib/ai/assessmentGraph';
import { validateAIReport } from '@/lib/ai/reportSchema';
import type { AssessmentGraphStateType } from '@/lib/ai/assessmentTypes';
import { saveAssessmentReport, updateDomainAssessments, completeSession, getSessionReport, getSessionByThreadId, getFullSession, getUserScreening } from '@/lib/db/assessmentService';

// NEW:
import { forceGenerateReport } from '@/features/assessment/ai/graph';
import { validateAIReport } from '@/features/assessment/schema/report-schema';
import type { AssessmentGraphStateType } from '@/features/assessment/schema/types';
import { getSessionByThreadId, getFullSession, completeSession } from '@/features/assessment/services/sessions';
import { updateDomainAssessments } from '@/features/assessment/services/domains';
import { saveAssessmentReport, getSessionReport } from '@/features/assessment/services/reports';
import { getUserScreening } from '@/features/assessment/services/screening';
```

**Step 3: Run tests**

```bash
npx vitest run
```

Expected: all tests pass (old files still exist as fallback).

**Step 4: Commit**

```bash
git add tests/
git commit -m "refactor: update test imports to features/assessment paths"
```

---

### Task 9: Extract API handlers

Extract business logic from each API route into `features/assessment/handlers/`. Routes become thin HTTP adapters.

**Files:**
- Create: `src/features/assessment/handlers/screening.ts`
- Create: `src/features/assessment/handlers/chat.ts`
- Create: `src/features/assessment/handlers/end.ts`
- Create: `src/features/assessment/handlers/report.ts`
- Modify: all 4 API route files

**Step 1: Create `handlers/screening.ts`**

```typescript
import { calculateDomainScores, identifyFlaggedDomains } from '../schema/domains';
import { validateScreeningAnswers } from '../validation/input';
import { upsertUserScreening } from '../services/screening';

export async function handleScreening(userId: string, answers: Record<string, number>) {
  validateScreeningAnswers(answers);
  const domainScores = calculateDomainScores(answers);
  const flaggedDomains = identifyFlaggedDomains(domainScores);
  await upsertUserScreening({ userId, answers, domainScores, flaggedDomains });
  return { success: true };
}
```

Then slim `screening/route.ts` to: parse request → auth check → call `handleScreening(userId, answers)` → return response.

**Step 2: Create `handlers/chat.ts`**

Move all orchestration logic from `chat/route.ts` including:
- `buildDomainStatuses()` helper
- `getLastAiContent()` helper
- Init flow (get screening, create session, run initial turn)
- Continue flow (run turn, check completion, persist)

Export two functions:

```typescript
export async function handleChatInit(userId: string, threadId: string): Promise<ChatResponse>
export async function handleChatContinue(threadId: string, message: string): Promise<ChatResponse>
```

Then slim `chat/route.ts` to: parse request → validate → route to init/continue → return response.

**Step 3: Create `handlers/end.ts`**

```typescript
import { forceGenerateReport } from '../ai/graph';
import { persistSessionResults } from '../services/persistence';

export async function handleForceEnd(threadId: string) {
  const result = await forceGenerateReport(threadId);
  if (result) {
    await persistSessionResults(threadId, result, true);
  }
  return { success: true, report: result?.report ?? null };
}
```

Then slim `chat/end/route.ts`.

**Step 4: Create `handlers/report.ts`**

```typescript
import { getUserLatestSession } from '../services/sessions';
import { getSessionReport } from '../services/reports';

export async function handleGetReport(userId: string) {
  const session = await getUserLatestSession(userId);
  if (!session) return { success: false, error: 'No session found' };

  const report = await getSessionReport(session.id);
  if (!report) return { success: false, error: 'No report found' };

  return { success: true, report, screeningSnapshot: session.screeningSnapshot };
}
```

Then slim `report/route.ts`.

**Step 5: Verify build**

```bash
npx tsc --noEmit
```

**Step 6: Run tests**

```bash
npx vitest run
```

**Step 7: Commit**

```bash
git add src/features/assessment/handlers/ src/app/api/assessment/
git commit -m "refactor: extract API handlers into features/assessment/handlers"
```

---

### Task 10: Delete old files and clean up

**Files:**
- Delete: `src/lib/ai/` (entire directory — 9 files)
- Delete: `src/lib/db/assessmentService.ts`

**Step 1: Delete `src/lib/ai/`**

```bash
rm -r src/lib/ai/
```

**Step 2: Delete `src/lib/db/assessmentService.ts`**

```bash
rm src/lib/db/assessmentService.ts
```

**Step 3: Verify no stale imports remain**

```bash
grep -r "@/lib/ai/" src/ tests/
grep -r "@/lib/db/assessmentService" src/ tests/
```

Expected: no results for either command.

**Step 4: Verify build**

```bash
npx tsc --noEmit
```

**Step 5: Run all tests**

```bash
npx vitest run
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove old lib/ai and lib/db/assessmentService"
```

---

### Task 11: Final verification

**Step 1: Full production build**

```bash
npm run build
```

Expected: clean build, no errors.

**Step 2: All tests**

```bash
npx vitest run
```

Expected: all tests pass.

**Step 3: Verify final structure**

```bash
find src/features/assessment -type f | sort
```

Expected output (approximately):
```
src/features/assessment/ai/graph.ts
src/features/assessment/ai/prompts.ts
src/features/assessment/ai/routing.ts
src/features/assessment/handlers/chat.ts
src/features/assessment/handlers/end.ts
src/features/assessment/handlers/report.ts
src/features/assessment/handlers/screening.ts
src/features/assessment/index.ts
src/features/assessment/schema/domains.ts
src/features/assessment/schema/report-schema.ts
src/features/assessment/schema/types.ts
src/features/assessment/services/domains.ts
src/features/assessment/services/messages.ts
src/features/assessment/services/persistence.ts
src/features/assessment/services/reports.ts
src/features/assessment/services/safety.ts
src/features/assessment/services/screening.ts
src/features/assessment/services/sessions.ts
src/features/assessment/services/types.ts
src/features/assessment/utils/report-mapper.ts
src/features/assessment/utils/screening-helpers.ts
src/features/assessment/validation/input.ts
```

**Step 4: Verify `src/lib/` is clean**

```bash
find src/lib -type f | sort
```

Expected: only shared infrastructure remains:
```
src/lib/auth/getUser.ts
src/lib/db/prisma.ts
src/lib/supabase/client.ts
src/lib/supabase/proxy.ts
src/lib/supabase/server.ts
src/lib/utils.ts
```

**Step 5: Commit if any final fixes were needed**

```bash
git add -A
git commit -m "chore: complete assessment code restructure"
```
