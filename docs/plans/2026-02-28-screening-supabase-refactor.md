# Screening → Supabase Refactor Design

**Date**: 2026-02-28
**Status**: Approved

## Problem

Current implementation stores screening data in localStorage, which:
1. Loses data on browser clear
2. Doesn't persist across devices
3. Makes report generation fragile (MemorySaver loses state on hot reload)

## Goals

1. Store all screening data in Supabase
2. Decouple screening and chat - they can be done independently
3. User can redo screening (overwrites previous) or start new chat anytime
4. Report generation uses snapshot data, not live screening results

## Data Model Changes

### New Table: `UserScreeningResult`

Stores the user's latest screening result (one per user, overwritten on each screening).

```prisma
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

### Modified: `AssessmentSession`

Add `screeningSnapshot` to store a copy of all 13 domain scores at session creation time.

```prisma
model AssessmentSession {
  // ... existing fields ...

  screeningSnapshot Json?  // { domain: avgScore } - snapshot of all 13 domains

  // Remove: screeningResponses relation (no longer needed)
}
```

### Delete: `ScreeningResponse` table

No longer needed - screening data lives in `UserScreeningResult`.

## API Changes

### New: `POST /api/assessment/screening`

Saves/updates user's screening result.

**Request**:
```typescript
{ answers: Record<string, number> }  // questionId → score (0-4)
```

**Server Logic**:
1. Read userId from Supabase auth session
2. Calculate domain scores (avg per domain)
3. Identify flagged domains (score >= 2, top 5)
4. Upsert `UserScreeningResult`

**Response**:
```typescript
{ success: true }
```

### Modified: `POST /api/assessment/chat`

No longer receives screening data. Creates session from DB.

**Request (init)**:
```typescript
{ threadId: string }  // no screeningAnswers
```

**Server Logic (init)**:
1. Read userId from auth
2. Fetch `UserScreeningResult` for user
3. Create `AssessmentSession` with:
   - `screeningSnapshot`: copy of all domainScores
   - `flaggedDomains`: copy from UserScreeningResult
4. Return initial AI message

**Request (message)**:
```typescript
{ threadId: string, message: string }
```

### Modified: `POST /api/assessment/chat/end`

Report generation reads from session's `screeningSnapshot`.

## Frontend Changes

### Path Change

- `/screening` → `/assessment/screening`

### `SurveyForm.tsx`

- Remove localStorage writes
- On submit: call `POST /api/assessment/screening`
- On success: redirect to `/assessment/chat`

### `useAssessmentChat.ts`

- Remove localStorage reads for screening data
- Init: just send `{ threadId }` to API
- API returns all needed data from DB

### `assessment/chat/page.tsx`

- No URL parameter needed
- Chat reads latest screening from DB on init

### Auth Requirement

- `/assessment/screening` requires login
- Redirect to login page if not authenticated

## Data Flow

```
User logs in
     ↓
/assessment/screening
     ↓ submit
POST /api/assessment/screening
     ↓
Upsert UserScreeningResult (overwrites previous)
     ↓
Redirect → /assessment/chat

/assessment/chat
     ↓ init (sends threadId)
POST /api/assessment/chat
     ↓
- Read UserScreeningResult for user
- Create AssessmentSession with screeningSnapshot
- Return AI greeting + flaggedDomains
     ↓
Chat proceeds...
     ↓ complete
Generate report using:
- screeningSnapshot (all 13 domains)
- domainAssessments (deep eval of flagged 5)
```

## Benefits

1. **Decoupled**: Screening and chat are independent
2. **Flexible**: User can redo screening anytime, start new chat anytime
3. **Reliable**: No localStorage dependency, survives hot reload
4. **Snapshot**: Each chat session has frozen screening data for consistent reports

## Files to Modify

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Add UserScreeningResult, modify AssessmentSession, remove ScreeningResponse |
| `src/app/assessment/screening/page.tsx` | New (move from /screening) |
| `src/app/screening/page.tsx` | Delete |
| `src/components/survey/SurveyForm/SurveyForm.tsx` | Remove localStorage, call API |
| `src/app/api/assessment/screening/route.ts` | New API endpoint |
| `src/app/api/assessment/chat/route.ts` | Read from DB, not request body |
| `src/app/api/assessment/chat/end/route.ts` | Use screeningSnapshot for report |
| `src/lib/db/assessmentService.ts` | Add UserScreeningResult operations |
| `src/components/assessment/hooks/useAssessmentChat.ts` | Remove localStorage logic |
