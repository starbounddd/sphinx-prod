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
