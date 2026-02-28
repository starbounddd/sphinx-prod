/* ==========================================================================
   Input Validation for Assessment Chat API
   ========================================================================== */

interface ValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_THREAD_ID_LENGTH = 256;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_SCORE = 0;
const MAX_SCORE = 4;

/**
 * Validate a thread ID string.
 */
export function validateThreadId(threadId: unknown): threadId is string {
  if (typeof threadId !== 'string') return false;
  if (threadId.length === 0) return false;
  if (threadId.length > MAX_THREAD_ID_LENGTH) return false;
  return true;
}

/**
 * Validate screening answers object.
 * Expects Record<string, number> with scores between 0-4.
 */
export function validateScreeningAnswers(
  answers: unknown,
): ValidationResult {
  if (answers === null || answers === undefined) {
    return { valid: false, error: 'Screening answers must be an object' };
  }

  if (typeof answers !== 'object' || Array.isArray(answers)) {
    return { valid: false, error: 'Screening answers must be an object' };
  }

  const obj = answers as Record<string, unknown>;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return {
        valid: false,
        error: `Score for "${key}" must be a number, got ${typeof value}`,
      };
    }
    if (value < MIN_SCORE || value > MAX_SCORE) {
      return {
        valid: false,
        error: `Score for "${key}" must be between ${MIN_SCORE} and ${MAX_SCORE}, got ${value}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate a user message string.
 */
export function validateMessage(message: unknown): ValidationResult {
  if (typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  if (message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return { valid: true };
}
