import { calculateDomainScores, identifyFlaggedDomains } from '../schema/domains';
import { upsertUserScreening } from '../services/screening';
import { validateScreeningAnswers } from '../validation/input';

type ScreeningResult =
  | { success: true }
  | { success: false; error: string; status: number };

export async function handleScreening(
  userId: string,
  answers: Record<string, number> | undefined,
): Promise<ScreeningResult> {
  const validation = validateScreeningAnswers(answers);
  if (!validation.valid) {
    return { success: false, error: validation.error!, status: 400 };
  }

  const domainScores = calculateDomainScores(answers!);
  const flaggedDomains = identifyFlaggedDomains(domainScores);

  await upsertUserScreening({
    userId,
    answers: answers!,
    domainScores,
    flaggedDomains,
  });

  return { success: true };
}
