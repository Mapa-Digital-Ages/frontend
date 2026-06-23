import { isValidEmail } from '@/shared/utils/validators'

export type PasswordResetLinkData = {
  code: string
  email: string
}

export function parsePasswordResetLink(
  hash: string
): PasswordResetLinkData | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const email = params.get('email') ?? ''
  const code = params.get('code') ?? ''

  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) return null
  return { code, email }
}
