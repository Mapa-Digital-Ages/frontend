export function isRequired(value: string) {
  return value.trim().length > 0
}

export function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value)
}

export function hasMinLength(value: string, minLength: number) {
  return value.trim().length >= minLength
}
