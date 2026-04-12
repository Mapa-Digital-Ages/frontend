const DEFAULT_PATH = '/'
const DEFAULT_DAYS = 7

export function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function setCookie(name: string, value: string, days = DEFAULT_DAYS) {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    `path=${DEFAULT_PATH}`,
    'SameSite=Strict',
  ].join('; ')
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${DEFAULT_PATH}; SameSite=Strict`
}
