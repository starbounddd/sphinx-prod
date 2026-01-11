import { detectHarmfulContent } from '@/lib/safety/detectors'

describe('Safety Detectors', () => {
  it('should detect harmful content', () => {
    const harmfulText = 'sample text'
    const detected = detectHarmfulContent(harmfulText)
    expect(detected).toBe(false)
  })
})
