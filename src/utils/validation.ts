// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== ''
}

export function validateLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
}
