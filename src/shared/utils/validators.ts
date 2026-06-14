export function isRequired(value: string) {
  return value.trim().length > 0
}

export function isValidEmail(value: string) {
  const email = value.trim()
  const emailPattern =
    /^[^\s(),:;<>@[\\\]]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/
  const localPart = email.split('@')[0] ?? ''

  return (
    emailPattern.test(email) &&
    !localPart.startsWith('.') &&
    !localPart.endsWith('.') &&
    !localPart.includes('..')
  )
}

export function hasMinLength(value: string, minLength: number) {
  return value.trim().length >= minLength
}
