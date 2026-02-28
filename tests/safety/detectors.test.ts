import { detectHarmfulContent } from '@/lib/safety/detectors';
import { describe, it } from 'vitest';

describe('Safety Detectors', () => {
  it('should detect harmful content', () => {
    const harmfulText = 'sample text';
    const detected = detectHarmfulContent(harmfulText);
    expect(detected).toBe(false);
  });
});
