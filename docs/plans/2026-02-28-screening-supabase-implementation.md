# Screening → Supabase Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove localStorage dependency for screening data; store all data in Supabase with decoupled screening/chat flows.

**Architecture:**
- New `UserScreeningResult` table stores per-user latest screening (upsert on each screening submit)
- `AssessmentSession` gains `screeningSnapshot` field to freeze domain scores at chat start
- Screening and chat are independent: screening overwrites previous, chat creates new session reading latest screening

**Tech Stack:** Next.js 14+, Prisma, Supabase (auth + postgres), TypeScript

---

## Task 1: Database Schema - Add UserScreeningResult

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Write the schema change**

Add to `prisma/schema.prisma` after the existing enums:

```prisma
// User's latest screening result (one per user, overwritten on each screening)
model UserScreeningResult {
  id             String          @id @default(uuid()) @db.Uuid
  userId         String          @unique @db.Uuid
  answers        Json            // { questionId: score }
  domainScores   Json            // { domain: avgScore } - all 13 domains
  flaggedDomains SymptomDomain[] // top 5 with score >= 2
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@map("user_screening_results")
}
```

**Step 2: Modify AssessmentSession - add screeningSnapshot**

Add field to `AssessmentSession` model:

```prisma
model AssessmentSession {
  // ... existing fields ...

  // Snapshot of all 13 domain scores at session creation
  screeningSnapshot  Json?

  // Remove screeningResponses relation (will be done in Task 2)
}
```

**Step 3: Run migration**

Run: `npx prisma migrate dev --name add_user_screening_result`

Expected: Migration created and applied successfully.

**Step 4: Generate Prisma client**

Run: `npx prisma generate`

Expected: Prisma Client generated successfully.

**Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): add UserScreeningResult and screeningSnapshot field"
```

---

## Task 2: Database Schema - Remove ScreeningResponse

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/db/assessmentService.ts`

**Step 1: Remove ScreeningResponse model and relation**

In `prisma/schema.prisma`, delete the entire `ScreeningResponse` model and remove `screeningResponses` from `AssessmentSession`:

```prisma
// DELETE THIS ENTIRE MODEL:
// model ScreeningResponse { ... }

// In AssessmentSession, REMOVE this line:
// screeningResponses ScreeningResponse[]
```

**Step 2: Update assessmentService.ts - remove ScreeningResponse imports and functions**

Remove from imports:
```typescript
// REMOVE: ScreeningResponse from imports
import type {
  AssessmentSession,
  // ScreeningResponse,  <-- REMOVE
  ChatMessage,
  // ...
} from '@prisma/client';
```

Remove `CreateSessionInput.screeningResults` and update `createAssessmentSession`:
```typescript
export interface CreateSessionInput {
  threadId: string;
  userId?: string;
  flaggedDomains: AppSymptomDomain[];
  screeningSnapshot: Record<string, number>;  // NEW: all 13 domain scores
  // REMOVE: screeningResults: ScreeningResult[];
}

export async function createAssessmentSession(
  input: CreateSessionInput
): Promise<AssessmentSession> {
  const { threadId, userId, flaggedDomains, screeningSnapshot } = input;

  const session = await prisma.assessmentSession.create({
    data: {
      threadId,
      userId,
      flaggedDomains: flaggedDomains as SymptomDomain[],
      screeningSnapshot,
      status: 'in_progress',
      // REMOVE: screeningResponses create block
      domainAssessments: {
        create: flaggedDomains.map((domain, index) => ({
          domain: domain as SymptomDomain,
          status: index === 0 ? 'in_progress' : 'pending',
          screeningScore: screeningSnapshot[domain] ?? 0,
        })),
      },
    },
  });

  return session;
}
```

**Step 3: Run migration**

Run: `npx prisma migrate dev --name remove_screening_response`

Expected: Migration removes `screening_responses` table.

**Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ src/lib/db/assessmentService.ts
git commit -m "feat(db): remove ScreeningResponse table, use screeningSnapshot"
```

---

## Task 3: Add UserScreeningResult Service Functions

**Files:**
- Modify: `src/lib/db/assessmentService.ts`

**Step 1: Add types for UserScreeningResult operations**

```typescript
export interface UpsertScreeningInput {
  userId: string;
  answers: Record<string, number>;
  domainScores: Record<string, number>;
  flaggedDomains: AppSymptomDomain[];
}
```

**Step 2: Add upsertUserScreening function**

```typescript
/**
 * Upsert user's screening result (overwrites previous).
 */
export async function upsertUserScreening(
  input: UpsertScreeningInput
): Promise<{ id: string }> {
  const { userId, answers, domainScores, flaggedDomains } = input;

  const result = await prisma.userScreeningResult.upsert({
    where: { userId },
    update: {
      answers,
      domainScores,
      flaggedDomains: flaggedDomains as SymptomDomain[],
    },
    create: {
      userId,
      answers,
      domainScores,
      flaggedDomains: flaggedDomains as SymptomDomain[],
    },
    select: { id: true },
  });

  return result;
}
```

**Step 3: Add getUserScreening function**

```typescript
/**
 * Get user's latest screening result.
 */
export async function getUserScreening(userId: string) {
  return prisma.userScreeningResult.findUnique({
    where: { userId },
  });
}
```

**Step 4: Commit**

```bash
git add src/lib/db/assessmentService.ts
git commit -m "feat(db): add UserScreeningResult service functions"
```

---

## Task 4: Create Screening API Endpoint

**Files:**
- Create: `src/app/api/assessment/screening/route.ts`

**Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateDomainScores, identifyFlaggedDomains } from '@/lib/ai/domains';
import { upsertUserScreening } from '@/lib/db/assessmentService';
import { validateScreeningAnswers } from '@/lib/ai/inputValidation';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request
    const body = await request.json();
    const { answers } = body as { answers?: Record<string, number> };

    const validation = validateScreeningAnswers(answers);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 3. Calculate domain scores
    const domainScores = calculateDomainScores(answers!);
    const flaggedDomains = identifyFlaggedDomains(domainScores);

    // 4. Upsert to database
    await upsertUserScreening({
      userId: user.id,
      answers: answers!,
      domainScores,
      flaggedDomains,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[assessment/screening] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving screening results' },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/assessment/screening/route.ts
git commit -m "feat(api): add POST /api/assessment/screening endpoint"
```

---

## Task 5: Update Chat API - Read from Database

**Files:**
- Modify: `src/app/api/assessment/chat/route.ts`

**Step 1: Update imports**

```typescript
import { createClient } from '@/lib/supabase/server';
import {
  createAssessmentSession,
  completeSession,
  saveAssessmentReport,
  updateDomainAssessments,
  getSessionByThreadId,
  getUserScreening,  // NEW
} from '@/lib/db/assessmentService';
```

**Step 2: Replace initialization route (when no message provided)**

Replace the `if (screeningAnswers && !message)` block with:

```typescript
// Route: Initialization (no message = new session)
if (!message) {
  // Authenticate user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Get user's latest screening from database
  const screening = await getUserScreening(user.id);
  if (!screening) {
    return NextResponse.json(
      { error: 'No screening data found. Please complete screening first.' },
      { status: 400 }
    );
  }

  const domainScores = screening.domainScores as Record<string, number>;
  const flaggedDomains = screening.flaggedDomains as SymptomDomain[];
  const screeningResults = toScreeningResults(screening.answers as Record<string, number>);

  const result = await runAssessmentTurn(
    threadId,
    undefined,
    screeningResults,
    flaggedDomains,
  );

  // Create session in database with screening snapshot
  createAssessmentSession({
    threadId,
    userId: user.id,
    flaggedDomains,
    screeningSnapshot: domainScores,
  }).catch((err) => {
    console.error('[assessment/chat] Failed to create session in DB:', err);
  });

  return NextResponse.json(
    {
      success: true,
      message: {
        content: getLastAiContent(result.messages),
        quickReplies: result.quickReplies,
        isComplete: result.isComplete,
        report: result.report,
        currentDomain: result.currentDomain,
        questionCount: result.questionCount,
        domainStatuses: buildDomainStatuses(result.domainAssessments),
        screeningResults,  // Return for frontend state
        flaggedDomains,    // Return for frontend state
      },
    },
    { status: 200 },
  );
}
```

**Step 3: Remove screeningAnswers parameter handling**

Remove validation and parsing of `screeningAnswers` from request body.

**Step 4: Commit**

```bash
git add src/app/api/assessment/chat/route.ts
git commit -m "refactor(api): chat init reads screening from database"
```

---

## Task 6: Update SurveyForm - Remove localStorage, Call API

**Files:**
- Modify: `src/components/survey/SurveyForm/SurveyForm.tsx`

**Step 1: Remove localStorage usage**

Remove lines 143-144:
```typescript
// REMOVE:
// localStorage.setItem('sphinx_screening_answers', JSON.stringify(answers));
// localStorage.setItem('sphinx_screening_score', String(total));
```

**Step 2: Add API call and redirect**

Replace `handleSubmit` function:

```typescript
import { useRouter } from 'next/navigation';

// Inside component:
const router = useRouter();
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleSubmit(e?: React.FormEvent) {
  e?.preventDefault();
  if (isSubmitting) return;

  setIsSubmitting(true);
  setError(null);

  try {
    const res = await fetch('/api/assessment/screening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        // Redirect to login
        router.push('/login?redirect=/assessment/screening');
        return;
      }
      setError(data.error || 'Failed to save screening');
      return;
    }

    // Success - redirect to chat
    router.push('/assessment/chat');
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
}
```

**Step 3: Update submit button to show loading state**

```typescript
<button
  type="submit"
  disabled={isSubmitting}
  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-dark text-white font-chat text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
>
  {isSubmitting ? 'Saving...' : 'Submit Assessment'}
</button>

{error && (
  <p className="text-xs text-red text-center">{error}</p>
)}
```

**Step 4: Remove submitted results display (redirect instead)**

Remove the `if (submitted)` block - we now redirect on success.

**Step 5: Commit**

```bash
git add src/components/survey/SurveyForm/SurveyForm.tsx
git commit -m "refactor(survey): remove localStorage, call API and redirect"
```

---

## Task 7: Update useAssessmentChat - Remove localStorage

**Files:**
- Modify: `src/components/assessment/hooks/useAssessmentChat.ts`

**Step 1: Remove localStorage reads in init effect**

Remove the effect that reads from localStorage (lines 274-289):

```typescript
// REMOVE this entire useEffect:
// useEffect(() => {
//   if (state.isInitialized) return;
//   const stored = localStorage.getItem('sphinx_screening_answers');
//   ...
// }, [state.isInitialized]);
```

**Step 2: Update initAssessment to not require screeningAnswers**

```typescript
async function initAssessment() {
  dispatch({ type: 'START_THINKING' });

  try {
    const res = await fetch('/api/assessment/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId }),  // No screeningAnswers
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[initAssessment] API error:', data.error);
      dispatch({ type: 'STOP_THINKING' });
      return;
    }

    if (data.success) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: data.message.content,
        timestamp: new Date(),
        quickReplies: data.message.quickReplies,
      };

      dispatch({
        type: 'INITIALIZE_SUCCESS',
        message: aiMsg,
        questionCount: data.message.questionCount || 1,
        isComplete: data.message.isComplete,
        domainStatuses: data.message.domainStatuses || {},
        currentDomain: data.message.currentDomain,
        screeningResults: data.message.screeningResults || [],
        flaggedDomains: data.message.flaggedDomains || [],
      });
    }
  } catch (error) {
    console.error('Failed to initialize assessment:', error);
    dispatch({ type: 'STOP_THINKING' });
  }
}
```

**Step 3: Add auto-init effect**

```typescript
useEffect(() => {
  if (state.isInitialized) return;
  initAssessment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

**Step 4: Remove localStorage writes in persist effect**

Simplify or remove the persist effect (lines 242-269). If needed for report display, keep minimal:

```typescript
useEffect(() => {
  if (!state.isComplete || state.dataPersisted) return;
  // Data is already in Supabase - just mark as persisted
  dispatch({ type: 'MARK_PERSISTED' });
}, [state.isComplete, state.dataPersisted]);
```

**Step 5: Commit**

```bash
git add src/components/assessment/hooks/useAssessmentChat.ts
git commit -m "refactor(chat): remove localStorage, init from API"
```

---

## Task 8: Move Screening Page to /assessment/screening

**Files:**
- Create: `src/app/assessment/screening/page.tsx`
- Delete: `src/app/screening/page.tsx`

**Step 1: Create new directory and move page**

```bash
mkdir -p src/app/assessment/screening
```

**Step 2: Copy and modify page.tsx**

Create `src/app/assessment/screening/page.tsx` with auth check:

```typescript
'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SurveyForm } from '@/components/survey/SurveyForm/SurveyForm';
import surveyJson from '../../../../resources/survey_schemas/wellbeing_surveyv1.json';
import { Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ... Sidebar component (same as before) ...

export default function ScreeningPage(): JSX.Element {
  const router = useRouter();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const totalQuestions = surveyJson.questions.length;

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/assessment/screening');
        return;
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray font-chat">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* ... same layout as before ... */}
    </div>
  );
}
```

**Step 3: Delete old page**

```bash
rm src/app/screening/page.tsx
rmdir src/app/screening 2>/dev/null || true
```

**Step 4: Commit**

```bash
git add src/app/assessment/screening/page.tsx
git rm src/app/screening/page.tsx
git commit -m "refactor(routes): move /screening to /assessment/screening with auth"
```

---

## Task 9: Update Report Generation to Use screeningSnapshot

**Files:**
- Modify: `src/lib/ai/assessmentGraph.ts`

**Step 1: Update getAllFlaggedDomainsFromScreening to accept domainScores directly**

```typescript
/**
 * Get all flagged domains from precomputed domain scores.
 */
function getAllFlaggedDomainsFromSnapshot(
  domainScores: Record<string, number>,
  threshold: number = 2,
): Record<SymptomDomain, number> {
  const result = {} as Record<SymptomDomain, number>;
  for (const [domain, score] of Object.entries(domainScores)) {
    if (score >= threshold) {
      result[domain as SymptomDomain] = score;
    }
  }
  return result;
}
```

**Step 2: Update generateReportNode to use screeningSnapshot when available**

The report generation will need to receive screeningSnapshot from session. This is handled when the session data is loaded. For now, the existing `getAllFlaggedDomainsFromScreening` using `screeningResults` still works.

**Step 3: Commit**

```bash
git add src/lib/ai/assessmentGraph.ts
git commit -m "refactor(ai): add helper for screening snapshot in report gen"
```

---

## Task 10: Add Supabase Client Helper

**Files:**
- Modify: `src/lib/supabase/client.ts`

**Step 1: Verify client export**

Ensure `src/lib/supabase/client.ts` exports a client-side createClient:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

**Step 2: Commit if changes needed**

```bash
git add src/lib/supabase/client.ts
git commit -m "fix(supabase): ensure client-side createClient export"
```

---

## Task 11: Update Internal Links

**Files:**
- Grep and update any references to `/screening`

**Step 1: Search for old path references**

Run: `grep -r '"/screening"' src/`

**Step 2: Update each reference to `/assessment/screening`**

Common locations:
- Navigation components
- SurveyForm (already updated in Task 6)
- Any redirect logic

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor(routes): update all /screening links to /assessment/screening"
```

---

## Task 12: Manual Testing Checklist

**Test Flow:**

1. **Auth required for screening:**
   - Visit `/assessment/screening` while logged out
   - Expected: Redirected to login

2. **Screening saves to database:**
   - Log in, complete screening
   - Check Supabase: `user_screening_results` table has entry

3. **Chat loads from database:**
   - After screening, redirected to `/assessment/chat`
   - Chat initializes with correct flagged domains
   - Check: `assessment_sessions` table has `screeningSnapshot`

4. **Redo screening:**
   - Complete screening again with different answers
   - Verify `user_screening_results` is updated (not duplicated)

5. **New chat uses latest screening:**
   - Start new chat session
   - Verify it uses updated screening data

6. **Report generation:**
   - Complete chat or end early
   - Verify report shows all 13 domain scores

**Step: Final commit**

```bash
git add -A
git commit -m "test: verify screening → supabase refactor"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add UserScreeningResult model | `prisma/schema.prisma` |
| 2 | Remove ScreeningResponse model | `prisma/schema.prisma`, `assessmentService.ts` |
| 3 | Add screening service functions | `assessmentService.ts` |
| 4 | Create screening API endpoint | `api/assessment/screening/route.ts` |
| 5 | Update chat API to read from DB | `api/assessment/chat/route.ts` |
| 6 | Update SurveyForm | `SurveyForm.tsx` |
| 7 | Update useAssessmentChat hook | `useAssessmentChat.ts` |
| 8 | Move screening page | `app/assessment/screening/page.tsx` |
| 9 | Update report generation | `assessmentGraph.ts` |
| 10 | Verify Supabase client | `supabase/client.ts` |
| 11 | Update internal links | Various |
| 12 | Manual testing | N/A |
