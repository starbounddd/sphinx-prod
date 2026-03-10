// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation types
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'strong';
  isPwned?: boolean;
  pwnedCount?: number;
}

// Check password against HaveIBeenPwned API using k-anonymity
// Only sends first 5 chars of SHA-1 hash (privacy-safe)
export async function checkPasswordPwned(password: string): Promise<{ isPwned: boolean; count: number }> {
  try {
    // Convert password to SHA-1 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // k-anonymity: only send first 5 characters
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' }, // Prevent response length analysis
    });

    if (!response.ok) {
      // If API fails, don't block user - just skip this check
      console.warn('HIBP API error:', response.status);
      return { isPwned: false, count: 0 };
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, countStr] = line.split(':');
      if (hashSuffix?.trim() === suffix) {
        return { isPwned: true, count: parseInt(countStr?.trim() || '0', 10) };
      }
    }

    return { isPwned: false, count: 0 };
  } catch (error) {
    console.warn('HIBP check failed:', error);
    return { isPwned: false, count: 0 };
  }
}

// Validate password strength and rules
export function validatePasswordStrength(password: string): Omit<PasswordValidationResult, 'isPwned' | 'pwnedCount'> {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  // Maximum length (prevent DoS)
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Check for character variety (letters count as one category)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const varietyCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  if (varietyCount < 2) {
    errors.push('Password must include at least 2 of: letters, numbers, special characters');
  }

  // Common patterns to reject
  const commonPatterns = [
    /^(.)\1+$/, // All same character: "aaaaaaaa"
    /^(012|123|234|345|456|567|678|789|890)+/, // Sequential numbers
    /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i, // Sequential letters
    /^(qwerty|asdf|zxcv|password|admin|user|login|welcome|letmein)/i, // Common words
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains a common pattern');
      break;
    }
  }

  // Determine strength
  let strength: 'weak' | 'fair' | 'strong' = 'weak';
  if (errors.length === 0) {
    if (password.length >= 12 && varietyCount >= 3) {
      strength = 'strong';
    } else if (password.length >= 8 && varietyCount >= 2) {
      strength = 'fair';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

// Full password validation (sync rules + async pwned check)
export async function validatePassword(password: string): Promise<PasswordValidationResult> {
  const strengthResult = validatePasswordStrength(password);

  // Only check pwned if basic validation passes
  if (!strengthResult.isValid) {
    return strengthResult;
  }

  const { isPwned, count } = await checkPasswordPwned(password);

  if (isPwned) {
    return {
      ...strengthResult,
      isValid: false,
      errors: [...strengthResult.errors, `This password has appeared in ${count.toLocaleString()} data breaches. Please choose a different password.`],
      isPwned,
      pwnedCount: count,
    };
  }

  return {
    ...strengthResult,
    isPwned: false,
    pwnedCount: 0,
  };
}

export function validateRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function validateLength(
  value: string,
  min: number,
  max: number
): boolean {
  return value.length >= min && value.length <= max;
}
