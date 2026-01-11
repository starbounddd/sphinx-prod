import { validateAIOutput } from '@/lib/ai/validateOutput'

describe('AI Guardrails', () => {
  it('should validate AI output', () => {
    const output = 'Sample AI output'
    const isValid = validateAIOutput(output)
    expect(isValid).toBe(true)
  })
})
